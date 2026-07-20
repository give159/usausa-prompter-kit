# 付録｜完全網羅・解説編（フリガナつき）

このツールのHTMLファイルを、上から順に・できるだけ余さず解説します。実物のコードそのままに、日本語コメントとフリガナ（読み仮名）をつけました。CSSや似た繰り返しは代表例＋要約で、JavaScriptは**全194関数**を機能別に説明します。

- 記号（`{ } ( ) => ;`）も少しずつ読めるようにしています。まず日本語だけ追ってOK。
- ※イメージは「正確ではないが、つかむため」の補助です。
- 本解説は、うさうさプロンプター v1.7B PRO（build 2026-07-10・全2,204行）に基づきます。行番号は実物と一致しています。

**読み方早見**：`function`（ファンクション＝関数）／`const`（コンスト＝変えない入れもの）／`let`（レット＝変えられる入れもの）／`=>`（アロー＝受け取って〜する）／`if`（イフ＝もし）／`for`（フォー＝繰り返す）／`try`（トライ＝ためす）／`catch`（キャッチ＝失敗を受け止める）。

---

## 0. ファイル全体の地図（どこに何があるか）

| 行 | 区画 | 中身 |
|---|---|---|
| 1〜25 | 冒頭 | DOCTYPE宣言・文字コード・タイトルなどの決まり文句 |
| 26〜29 | head開始 | ページの設定が始まる |
| 30〜431 | style（CSS） | 見た目の設定（色・大きさ・配置） |
| 432〜433 | head終了 | 設定おわり |
| 434〜820 | body（HTML） | 画面に置く部品（ボタン・入力欄・表示エリア） |
| 821〜2202 | script（JavaScript） | 動きのすべて。全194関数がここに |
| 2203〜2204 | 終了 | body・htmlの閉じ |

「①決まり文句 → ②見た目 → ③部品 → ④動き」の順に並んでいます。これはWebページの標準的な並びです。

---

## 1. 冒頭の決まり文句（1〜25行）

```html
<!DOCTYPE html>
```
↑ 「これはHTMLという種類の文書です」という最初の宣言。おまじないと思ってOK。

```html
<meta charset="utf-8">
```
↑ charset（キャラセット＝文字の種類）をutf-8に。日本語が文字化けしないための設定。

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
↑ viewport（ビューポート＝表示領域）の設定。スマホでも見やすい幅に自動調整する、という意味。

**要約**：1〜25行は、ブラウザに「これから日本語のWebページを、スマホ対応で表示します」と伝える準備部分です。動きには関係しません。

---

## 2. 見た目の設定 CSS（30〜431行）

CSSは「どの部品を・どんな色や大きさ・どこに置くか」を決める区画です。402行と長いので、代表だけ読みます。

### 2-1. 色の定義（:root）

```css
:root{
  --ink:#…; --paper:#…; --rose:#…; --mint:#…; --gold:#…;
}
```
↑ `:root`（ルート＝根っこ＝ページ全体）に、色の名前を定義しています。`--ink`（インク＝文字色）、`--paper`（ペーパー＝背景色）、`--rose`（ローズ＝差し色）など。**色をここで名前づけ**しておき、あとで使い回します。塗料に名前をつけて棚に並べるイメージ。

### 2-2. 部品ごとの見た目（代表）

```css
.ghost{ … }
.ghost:hover{ … }
.ghost.on{ … }
```
↑ `.ghost`（ゴースト）はボタンの一種の見た目。`:hover`（ホバー＝マウスを乗せたとき）、`.on`（オン＝押された状態）で、それぞれ見た目が変わる設定。**同じボタンでも「普通・乗せた時・押した時」で3つの顔がある**わけです。

```css
.stage{ … }
.scroller{ … }
.script{ … }
```
↑ 原稿が流れる舞台まわり。`.stage`（ステージ＝舞台）、`.scroller`（スクローラー＝流れる部分）、`.script`（スクリプト＝原稿）。プロンプターの中心部分の見た目です。

**CSS全体の要約**：30〜431行は、`:root`で色を定義し、`.app`（アプリ全体）→`.topbar`（上のバー）→`.stage`（原稿の舞台）→各ボタン→モーダル（ポップアップ画面）の順に、すべての部品の見た目を指定しています。似たパターン（色・余白・角丸の指定）の繰り返しが大半です。

---

## 3. 画面の部品 HTML body（434〜820行）

ここは「画面に実際に置く部品」の区画です。全部で**161個のID**（部品の名札）がついています。主要な部品を機能ごとに見ます。

### 3-1. 上のバー（ボタン群）
`btnResume`（続きから）、`btnBell`（音）、`btnFull`（全画面）、`btnAI`（AI相談）、`btnMemo`（メモ）、`btnLog`（実績）、`btnHL`（ハイライト）、`btnMirror`（ミラー）、`btnOpen`（原稿を開く）、`btnTimer`（タイマー）、`btnBug`（🐞状況メモ）など。
↑ `btn`はbutton（ボタン）の略。名前を見れば役割が分かるようになっています。

### 3-2. 原稿の舞台
`stage`（舞台）、`scroller`（流れる部分）、`script`（原稿本文）、`countdown`（開始前の数字）、`overlay`（上に重なる案内画面）。

### 3-3. 進み具合の表示
`progress`（進み具合バー）、`bar`（バー本体）、`knob`（つまみ）、`bmMark`（しおり位置）、`tCur`（現在時間）、`tTotal`（合計）、`tRemain`（残り）。

### 3-4. ポップアップ画面（モーダル6種）
`modal`（モーダル＝ポップアップ）が6つ。設定・色・タイマー・メモ・履歴・実績などの詳細画面です。ふだんは隠れていて、ボタンを押すと出てきます。

**HTML全体の要約**：434〜820行は、上部バー→原稿の舞台→操作パネル→6つのポップアップ、という順で部品を配置。この時点では「置いてあるだけ」で、まだ動きません。動きは次のJavaScriptが与えます。

---

## 4. 動きのすべて JavaScript（821〜2202行）

ここが心臓部です。全**194関数**を、機能グループごとに解説します。まず全体の即時関数の枠から。

```javascript
(function(){
  "use strict";
  …ここに全部の関数…
})();
```
↑ 全体が `(function(){ … })()` という「即時関数」で包まれています。これは**中身を外から触れないように箱で囲う**しくみ。`"use strict"`（ユーズ・ストリクト＝厳格モード）は、うっかりミスを早めに教えてくれる設定。

### グループA：小さな道具箱（824〜1057行の純粋な部品）

画面もタイマーも触らない、「入れたら決まった答えを返す」だけの小さな関数群です。テストしやすい部分でもあります。

**`$(sel)`（824行）** — `$`（ダラー）は「画面から部品を1つ取ってくる」近道。`document.querySelector`の短縮。毎回長く書かずに済むための道具。

**`esc(s)`（883行）** — esc（エスケープ＝無害化）。文字の中の`<`や`&`などの記号を、安全な形に変換する。悪意ある文字列で画面が壊されるのを防ぐ、防御の要。

**`inline(s)`（884行）** — 原稿中の簡単な記法（強調など）を画面表示用に変換。

**`parseLines(text)`（891行）** — parse（パース＝解析）＋lines（行）。原稿の文章を1行ずつに切り分ける。

**`splitPages(lines)`（904行）** — split（スプリット＝分割）＋pages（ページ）。行をページ単位にまとめる。

**`countChars(text)`（924行）** — count（数える）＋chars（文字）。文字数を数える。

**`clamp(v,a,b)`（929行）** — clamp（クランプ＝挟む）。値vを下限aと上限bの間に収める安全弁。
```javascript
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
```
↑ 「bとvの小さい方」を取り、さらに「aとその大きい方」を取る＝結局aとbの間に収まる。

**`clampRatio(r)`（930行）** — 割合rを0〜1の間に収める。位置の割合などに使う。

**`hexLum(hex)`（986行）** — hex（16進の色コード）＋lum（ルミナンス＝輝度）。色の明るさを計算。不正な色はnull（＝無し）を返す。

**`contrastRatio(fg,bg)`（992行）** — 文字色fgと背景色bgのコントラスト（明暗差）比を計算。

**`contrastLabel(ratio)`（996行）** — 比の大きさから「読みやすい／ぎりぎり／読みにくい」の札を返す。4.5と3が境目（WCAG基準）。

**`noteSanitize`（936）・`versionSanitize`（946）・`runLogSanitize`（968）・`slotsSanitize`（1003）** — sanitize（サニタイズ＝きれいにする）。保存データを読み込むとき、変な値が混じっていないか点検して整える関数たち。

**`statsAt`（952）・`runSummary`（979）・`nextHeadingLi`（962）・`lineToPage`（931）・`RE_BREAK_GLOBAL`（928）** — 統計計算や見出し探し、行↔ページ変換などの補助部品。

### グループB：保存と復元（1009〜1057行、1314〜1339行）

原稿や設定を、ブラウザの中に覚えておく仕組みです。

**`serialize(st)`（1009行）** — serialize（シリアライズ＝保存用の形に変換）。今の状態stを、保存できる1つの形（JSON）にまとめる。
```javascript
function serialize(st){ return { v:12, cpm:st.cpm, size:st.size, … }; }
```
↑ `v:12`はスキーマ（保存形式）のバージョン番号。cpm（速度）やsize（文字サイズ）などを1つの箱にまとめる。

**`deserialize(o)`（1025行）** — deserialize（デシリアライズ＝保存の形から元に戻す）。読み込んだデータoを、全項目チェックしながら状態に復元。変な値はclampや既定値で直す。

**`lsSet(k,v)`（1314）・`lsGet(k)`（1315行）** — ls＝localStorage（ローカルストレージ＝ブラウザ内の保存場所）。kという名前でvを保存／取り出す。
```javascript
function lsSet(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
```
↑ `try…catch`で囲み、保存に失敗しても（プライベートモード等）エラーで止まらないようにしている。

**`saveNow()`（1317行）** — 今すぐ保存。**`saveSoon()`（1322行）** — 600ミリ秒待ってから保存（連続操作を1回にまとめる工夫。デバウンスと呼ぶ）。

**`loadSaved()`（1323）・`applySaved(d,announce)`（1324行）** — 保存データを読み込み、画面に反映する。

---

（後半へ続く：再生・表示／UI操作／取り込み／AI連携／メモ・履歴・起動）
前半からの続きです。JavaScript（194関数）の残りグループC〜Gを解説します。

---

### グループC：原稿を流す・描く（1059〜1207行）

プロンプターの本質「原稿を一定速度で動かす」部分です。

**`render()`（1059行）** — render（レンダー＝描画する）。原稿を画面に組み立てて表示する。

**`measure()`（1077行）** — measure（メジャー＝測る）。原稿の高さや、1行ずつの位置を測る。流す距離の計算に必要。

**`recalcSpeed()`（1091行）** — recalc（リカルク＝再計算）＋speed（速度）。字/分の設定から、1秒で何ピクセル動かすかを計算。

**`applyTransform()`（1096行）** — 計算した位置ぶん、原稿を実際にずらす（スクロール）。

**`loop(t)`（1154行）** — loop（ループ＝繰り返し）。**動きの心臓**。1秒間に約60回呼ばれ、少しずつ原稿を進める。
```javascript
function loop(t){
  if(!state.playing) return;
  … const dt=(t-lastT)/1000; …
  state.pos += state.speed*dt;
  if(state.pos>=state.max){ state.pos=state.max; pause(); showEnd(); }
  applyTransform(); updateProgress();
  if(state.playing) raf=requestAnimationFrame(loop);
}
```
↑ 「再生中でなければ何もせず戻る（`if(!state.playing)return`）」。`dt`は前回からの経過秒。`速度×経過時間`ぶん位置を進める。最後まで行ったら止めて終了画面。`requestAnimationFrame(loop)`で「次の描画タイミングでまた自分を呼ぶ」＝なめらかな動きの秘密。

**`play()`（1182）・`pause()`（1185）・`toggle()`（1187）・`nudge(sec)`（1188）・`reset()`（1189行）** — 再生・一時停止・切り替え・少し動かす・最初に戻す。ボタンやキー操作の実体。

**`goToRatio`（1191）・`goToLine`（1192）・`goToPage`（1197行）** — 指定の割合／行／ページへジャンプ。

**`updateProgress()`（1125）・`drawTicks()`（1140）・`currentLi()`（1134行）** — 進み具合バーの更新、目盛りの描画、今どの行かの取得。

**`showStart`（1200）・`showEnd`（1207）・`showCover`（1208）・`coverAction`（1237）・`hideOverlay`（1248行）** — 開始前・終了・表紙などの案内画面の出し入れ。

### グループD：設定を変える操作（1251〜1707行）

利用者がボタンやスライダーで設定を変えたときに動く関数群です。

**`loadScript(text,keepPos)`（1251行）** — 原稿を読み込む。**`setCpm(v)`（1277行）** — 速度を設定。**`setSize(v)`（1284行）** — 文字サイズ。**`setDir(d)`（1285行）** — 表示方向。**`setMirror(on)`（1286行）** — ミラー表示。

**`toggleHL`（1290）・`setBrush`（1297）・`applyBrush`（1299行）** — ハイライト（線引き）機能。

**`openModal(id)`（1424）・`closeModal(id)`（1425行）** — ポップアップ画面の開閉。

**`scrub(x)`（1480行）** — scrub（スクラブ＝こすって移動）。バーをドラッグして再生位置を動かす。

**`buildPalettes`（1621）・`applyColors`（1645）・`setFg`（1653）・`setBg`（1654）・`resetColors`（1655行）** — 配色パレットの作成・適用・文字色/背景色の設定・リセット。

**`startClock`（1658）・`tick`（1660）・`timerSet`（1667）・`timerStart`（1668）・`timerTick`（1670行）** — 時計とタイマー。tick（チック＝時を刻む）。

**`beep`（1672）・`tickSound`（1673）・`bellSound`（1674）・`playUiSound`（1680）・`setSound`（1682行）** — 各種の音。

**`toggleFull()`（1689行）** — 全画面表示の切り替え。

**`acquireWake`（1697）・`releaseWake`（1698）・`applyKeepAwake`（1700行）** — Wake Lock（画面が消えないようにする機能）の取得・解放。

**`startWithCountdown()`（1707行）** — カウントダウンしてから再生開始。

**`jumpHeading(dir)`（1719行）** — 見出し単位で前後にジャンプ。

**`resetSettings()`（1726）・`wipeAll()`（1735行）** — 設定リセット、全データ消去（wipe＝拭き取る）。

### グループE：文章の変換とメモ（1744〜1818行）

**`mdToHtml(src)`（1746行）** — md（マークダウン記法）をHTML（画面表示用）に変換。**`strongMd(s)`（1745行）** — 強調記法の処理。

**`renderNotes()`（1760）・`saveNote()`（1787）・`loadNoteToEditor(id)`（1778）・`openMemo(kind)`（1794行）** — 勉強ノート・メモの表示・保存・読み込み・開く。

**`exportNotes(kind,md)`（1801）・`noteToMd(n)`（1799）・`seedStudyNotes()`（1812行）** — ノートの書き出し、最初のサンプルノートの用意。

### グループF：ファイルの取り込み（1819〜1895行）

WordやExcel、テキストから原稿を読み込む部分です。ここは少し専門的。

**`parseCSV(text)`（1819行）** — CSV（カンマ区切り）を解析。

**`docxExtractText(xml)`（1829行）** — Wordファイル（.docx）の中身から文章だけを取り出す。extract（エクストラクト＝抽出）。

**`xlsxExtractText(...)`（1835行）** — Excelファイル（.xlsx）から文章を取り出す。

**`inflateRaw(u8)`（1855行）** — inflate（インフレート＝展開）。圧縮されたデータを元に戻す。ブラウザ標準の`DecompressionStream`を使う。

**`unzip(buf)`（1860行）** — unzip（アンジップ＝ZIP解凍）。.docxや.xlsxは中身がZIP圧縮なので、まずこれで解く。
```javascript
function unzip(buf){ … 末尾からEnd of Central Directory を探す … }
```
↑ ZIPは「末尾に目次がある」構造。その目次（シグネチャ0x06054b50）を探して、各ファイルを取り出す。

**`loadText(text)`（1881行）** — 取り出した文章を原稿として読み込む。

### グループG：AI相談（1896〜1990行）★アーティファクト版のみ

**このツールで一番の注意点**。AI相談は「Claudeのアーティファクト版で開いたときだけ」動きます。

**`callAI(messages,system)`（1898行）** — Claude（Anthropic API）へ実際に問い合わせる関数。
```javascript
async function callAI(messages,system){
  const res=await fetch("https://api.anthropic.com/v1/messages",{ … });
  … return parseAIResponse(await res.json());
}
```
↑ `async`/`await`（アシンク／アウェイト＝時間のかかる処理を待つ合図）。`fetch`（フェッチ＝取ってくる）でAIに送って返事を待つ。

**`sendAI(text,persona)`（1936行）** — 送信の入口。**見張り番つき**。
```javascript
async function sendAI(text,persona){
  … if(aiBusy || !text || !text.trim()) return;   // 連打・空送信を防ぐ
  try{ const reply=await callAI(…); … }
  catch(err){ … 通信エラーの案内 … }
}
```
↑ 「処理中か、文字が空なら、何もせず戻る」。`try`で送信を試み、失敗したら`catch`で優しい案内を出す。

**`isArtifactEnv()`（1969行）** — env（エンバイロンメント＝環境）を判定。**通常版とアーティファクト版を見分ける関門**。
```javascript
function isArtifactEnv(){
  if(location.protocol==="file:") return false;      // ファイル直開き＝通常版
  const h=location.hostname||"";
  if(!h||h==="localhost"||h==="127.0.0.1") return false;  // ローカル＝通常版
  return /claude\.site|claudeusercontent|anthropic/i.test(h);  // ←ここだけAI有効
}
```
↑ 開かれている場所（URL）を見て、Claudeのアーティファクト上なら`true`（AI有効）、それ以外は`false`（AI無効）を返す。

**`updateAiBar()`（1978行）** — 上の判定結果を受けて、画面の案内を「使えます／使えません」に切り替える。**通常版では通信は一切起きない**ことが、ここで保証されています。

**`personaOf`（1904）・`aiGreet`（1905）・`renderChat`（1906）・`apiMessages`（1923）・`quickAI`（1949）・`reviewWith`（1958行）** — AIの人格（3種）、あいさつ、会話の表示、送信内容の組み立て、クイック操作、レビュー機能。

### グループH：エディタ・履歴・実績・起動（1991〜2202行）

**`commitVersion(msg)`（1992）・`restoreVersion(id)`（2047）・`renderHist()`（2054行）** — 版履歴の保存・復元・表示。

**`saveSlot(i)`（2083）・`loadSlot(i)`（2084行）** — 台本ボックス（2枠）の保存・読み込み。

**`renderLog()`（2095）・`exportLogMd()`（2115）・`exportLogCsv()`（2123）・`clearLog()`（2129行）** — 読み上げ実績の表示・書き出し・消去。

**`updateResume()`（2149）・`doResume()`（2153行）** — 「続きから」機能。

**`buildBug(err)`（2157）・`copyBugLog()`（2175行）** — 🐞状況メモの作成とコピー。困ったときの相談用。

**`boot()`（2180行）** — boot（ブート＝起動）。**すべての最後に呼ばれる開始関数**。保存データを読み、ボタンに機能を結びつけ、画面を初期表示する。この関数が動いて、はじめてツールが使える状態になる。

---

## まとめ：このツールの正体

2,204行を一言でいうと、「原稿を一定速度で流す`loop()`を中心に、それを設定・保存・取り込み・AI相談で取り囲んだ単一ファイル」です。

- 心臓 … `loop()`（原稿を進める）
- 安全弁 … `clamp()`（変な値を防ぐ）・`esc()`（表示を守る）
- 記憶 … `serialize()`/`deserialize()`（保存と復元）
- 玄関 … `boot()`（起動）
- 特別扱い … AI相談（アーティファクト版のみ・通常版は通信なし）

全部を理解する必要はありません。「ここが心臓」「ここが安全弁」と地図が読めれば、コードは怖くなくなります。

---
面白きこともなき世を面白く。 ― 高杉晋作
