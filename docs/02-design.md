# 付録2｜詳細設計書 ― うさうさプロンプター

| 項目 | 内容 |
|---|---|
| 対象バージョン | v1.7B PRO（build 2026-07-10） |
| 行番号の基準 | usausa-prompter-v1_7B-PRO.html 実ソース（逐行突合済み） |

---

## 1. アーキテクチャ概要

HTML・CSS・JavaScriptを1ファイルに収めた単一ファイル構成。外部依存ゼロ（script/CSS/CDN読み込みなし）。データはブラウザのlocalStorageにのみ保存する。

### 1.1 ファイル全体の行マップ

| 行範囲 | 内容 |
|---|---|
| 1〜29 | DOCTYPE・冒頭コメント・head開始 |
| 30〜432 | style（CSS） |
| 434〜820 | body（HTML構造） |
| 821〜2,203 | script（本体ロジック。即時関数で全体を包む） |

### 1.2 script内セクション（コメント区切り・実測行）

| 行 | セクション |
|---|---|
| 830 | 保存キー `const KEY="usausa_prompter_v2"` |
| 864 | バージョン定数（APP_VERSION／BUILD_DATE／APP_NAME） |
| 871〜880 | 状態オブジェクト `state` |
| 882〜 | 純粋ロジック（テスト対象：clamp・輝度・コントラスト等） |
| 1058〜 | レンダリング |
| 1152〜 | 再生制御 |
| 1312〜 | 保存・復元（serialize／deserialize、saveSoonは600msデバウンス） |
| 1818〜 | ファイル取り込み（isZipDoc判定・unzip・テキスト抽出） |
| 1889〜 | AIコンシェルジュ（callAI／sendAI／ペルソナ／環境判定） |

## 2. 状態管理

単一の `state` オブジェクト（871行〜）に集約。主なフィールド：

| フィールド | 型・既定値 | 意味 |
|---|---|---|
| text | string | 原稿本文 |
| cpm | number（300） | 読み上げ速度（字/分） |
| size | number（48） | 文字サイズ（px） |
| dir | "v"／"r"／"l"（"v"） | 表示方向（横書き下→上／縦書き右→左／縦書き左→右） |
| mirror | boolean | ミラー表示 |
| fgKey／bgKey・fgCustom／bgCustom | string | 配色（プリセットキー＋カスタム値） |
| timerMin | number（30） | タイマー分 |
| countSec | number（3） | カウントダウン秒 |
| countBeep | boolean | カウント音 |
| keepAwake | boolean | スリープ防止 |
| posRatio／bookmarkRatio | 0〜1 | 現在位置／しおり位置（割合） |
| versions | array（最大12） | 版履歴 |
| runLogs | array（最大50） | 読み上げ実績 |
| slots | array（固定2枠） | 台本ボックス（名称40文字まで） |
| notes | array | 勉強ノート（kind: study） |
| highlights | array | 行ハイライト情報 |

## 3. 保存データスキーマ（serialize／deserialize）

- **localStorageキー**: `usausa_prompter_v2`
- **スキーマバージョン**: `v: 12`
- **保存タイミング**: 各操作の都度（saveNow）＋600msデバウンス（saveSoon）＋beforeunload
- **復元時の安全策**: 全フィールドを clamp／型チェックし、不正値は既定値へ。JSON.parse失敗時はnull扱いで初期状態から開始
- **履歴の切り詰め**: `versions.unshift(...)` 後に `length=12`、`runLogs` は `length=50`。先頭が最新のため、切り詰めで消えるのは最古（通知なし）

## 4. 主要処理フローの要点

### 4.1 原稿の取り込み（Word／Excel）

1. 拡張子で分岐（`isZipDoc`＝.docx/.xlsxならZIP解析、それ以外はテキスト読み）
2. ZIP解析（1855〜1885行）: End of Central Directory Record（シグネチャ 0x06054b50）を末尾から探索し、各エントリのローカルヘッダからデータを取得
3. 圧縮方式: method=0はそのまま、method=8はブラウザ標準の `DecompressionStream("deflate-raw")` で展開
4. .docxは word/document.xml の w:t、.xlsxは sharedStrings 等からテキスト抽出

### 4.2 コントラスト自動判定（986〜997行）

1. `hexLum(hex)`: HEX値をsRGB相対輝度へ変換（ガンマ補正、係数 0.2126／0.7152／0.0722）。不正入力はnull
2. `contrastRatio(a,b)`: (L1+0.05)/(L2+0.05) で比を計算（明暗は自動判定、最大21）
3. `contrastLabel(r)`: 4.5以上=「読みやすい」／3以上=「ぎりぎり」／3未満=「読みにくいかも」

### 4.3 AI連携（1889〜1977行）

- すべてのAIボタンは `sendAI()` に集約。二重送信ガード（`aiBusy||!text||!text.trim()`）
- `isArtifactEnv()`（1969行〜）が実行環境を判定。localhost／127.0.0.1／file:// は通常版
- アーティファクト版のみ `callAI()`（1899行〜）が `fetch("https://api.anthropic.com/v1/messages")` を呼ぶ（model: claude-sonnet-4-6、max_tokens: 1000。APIキーはコードに含めず環境に委譲）
- 通常版では案内バーに「AI相談は使えません」を表示します
- 会話は直近12件を送信、原稿は必要部分を6,000字でクリップ

## 5. 設計判断（記録）

1. 単一ファイル構成: 配布・研修利用の容易さを最優先（トレードオフ: ファイル肥大）
2. localStorageのみ: プライバシー最優先。サーバ・アカウント不要
3. AI連携の環境判定設計: 通常版では無効・アーティファクト版で有効。鍵をコードに埋め込まない

---
面白きこともなき世を面白く。 ― 高杉晋作
