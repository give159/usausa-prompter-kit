# うさうさプロンプター テスト一式（v1.7C PRO対応）

単一ファイルHTMLツールの動的テスト2段構え（ユニット15本＋jsdomスモーク6本）。
全21本PASS済み（Node.js v22 / jsdom 29 / 2026-07-21検証）。

## セットアップ（初回のみ）

1. このフォルダに、テスト対象のHTMLを `tool.html` という名前でコピーする
   （usausa-prompter-v1_7C-PRO.html を改名コピー）
2. ターミナルで:

    npm install

## 実行

    npm test              # 全テスト実行（約3秒）
    npm run test:watch    # 保存のたびに自動再実行

## 構成

| ファイル | 役割 |
|---|---|
| extract.js | HTMLから関数を名前で切り出すヘルパー（波かっこ深さカウント＋vmサンドボックス） |
| test/unit.test.js | 純粋ロジックのユニットテスト15本（clamp／hexLum／contrastRatio等の境界値） |
| test/smoke.test.js | jsdomでHTMLを丸ごと起動するスモークテスト6本（起動・バージョン・通常版AI無効表示・**通常版でfetch自体が呼ばれないこと**・保存） |

## 結果の見方

- `✔`＝合格、`✖`＝不合格。末尾の `pass / fail` をまず見る
- 失敗時は「実際の値 !== 期待した値」と `at ファイル:行` が表示される

## 注意（ハマりどころ）

- テストが終わらない → smoke側の `after(() => dom.window.close())` を消さないこと
- 別バージョンのHTMLを検査する場合、バージョン表記テスト（1.7C PRO）は書き換えが必要

詳しい解説は別冊「動的テスト入門（Windows + VS Code）」参照。
面白きこともなき世を面白く。 ― 高杉晋作
