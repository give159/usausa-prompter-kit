# 付録｜ソースコード 一行ずつ解説（ふりがなプログラミング・超初心者版）

実物のコードを**1行ずつ**、日本語のコメントとふりがなで読み解きます。1文字も書けなくて大丈夫。「読める」だけを目指します。

対象: うさうさプロンプター v1.7C PRO（全2,220行）。掲載コードはすべて実物そのままで、行番号も一致しています。

---

## 読む前に：記号のふりがな

コードには記号がたくさん出てきます。最初に読み方だけ覚えます。意味は追い追いで大丈夫です。

| 記号 | 読み方 | 意味（ざっくり） |
|---|---|---|
| `{ }` | ブレース（波かっこ） | 「ここからここまでが1つのまとまり」 |
| `( )` | パーレン（丸かっこ） | 「受け取るもの」または「計算のかたまり」 |
| `;` | セミコロン | 「1つの文の終わり」。日本語の句点「。」 |
| `=` | イコール | 「右のものを左に入れる」（等しい、ではない） |
| `===` | トリプルイコール | 「同じかどうか調べる」（こちらが比較） |
| `=>` | アロー（矢印） | 「受け取って〜する」 |
| `//` | スラッシュ2つ | 「ここから先はコメント（人間へのメモ）」 |
| `!` | ビックリ（ノット） | 「〜でない」 |
| `\|\|` | パイプ2つ（オア） | 「または」 |
| `&&` | アンド2つ | 「かつ」 |
| `.` | ドット | 「〜の」（所属を表す） |
| `+=` | プラスイコール | 「今の値に足す」 |

**単語のふりがな**：`function`（ファンクション＝関数・部品）／`const`（コンスト＝変えない入れもの）／`let`（レット＝変えられる入れもの）／`return`（リターン＝答えを返す・引き返す）／`if`（イフ＝もし）／`try`（トライ＝ためす）／`catch`（キャッチ＝失敗を受け止める）／`async`（アシンク＝時間がかかる処理）／`await`（アウェイト＝終わるまで待つ）

---

## 例1：いちばん短い関数 `clamp`（938行目）

まず1行だけの関数から。ここが読めれば、他も読めます。

```javascript
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
```

これを分解します。

| コード片 | 読み | 意味 |
|---|---|---|
| `function` | ファンクション | 「これから部品を作ります」の合図 |
| `clamp` | クランプ | この部品の名前（挟んで固定する、の意） |
| `(v,a,b)` | パーレン ブイ・エー・ビー | 受け取るもの3つ。v=値、a=下限、b=上限 |
| `{` | ブレース開き | ここから中身 |
| `return` | リターン | 「答えを返します」 |
| `Math.min(b,v)` | マス・ミン | 「bとvのうち、小さい方」 |
| `Math.max(a, …)` | マス・マックス | 「aと、その結果のうち、大きい方」 |
| `;` | セミコロン | この文はここで終わり |
| `}` | ブレース閉じ | 部品の中身はここまで |

**動きを追う（v=700, a=80, b=600 のとき）**
1. `Math.min(600, 700)` → 小さい方は **600**
2. `Math.max(80, 600)` → 大きい方は **600**
3. → 答えは **600**。700と入れても600に押し戻された！

**一言まとめ**：どんな値が来ても、80〜600の間に必ず収める安全弁です。

---

## 例2：画面から部品を取ってくる `$`（833行目）

```javascript
const $=id=>document.getElementById(id);
```

| コード片 | 読み | 意味 |
|---|---|---|
| `const` | コンスト | 「変えない入れものを作ります」 |
| `$` | ダラー | この入れものの名前（記号1文字でも名前になれる） |
| `=` | イコール | 右のものを左に入れる |
| `id` | アイディー | 受け取るもの（部品の名札） |
| `=>` | アロー | 「idを受け取って、〜する」 |
| `document` | ドキュメント | 画面全体のこと |
| `.getElementById(id)` | ゲット・エレメント・バイ・アイディー | 「その名札の部品を取ってくる」 |

**一言まとめ**：長い `document.getElementById("stage")` を、`$("stage")` と短く書くための近道です。このツールでは何百回も使われるので、短くする価値があります。

---

## 例3：危ない文字を無害にする `esc`（892行目）

```javascript
function esc(s){return s.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));}
```

長く見えますが、やっていることは1つです。

| コード片 | 読み | 意味 |
|---|---|---|
| `function esc(s)` | エスケープ | 文字列sを受け取る部品。esc=escape（逃がす・無害化） |
| `s.replace(…)` | リプレース | 「sの中の〜を置き換える」 |
| `/[&<>]/g` | 正規表現 | 「& か < か > の文字すべて」。`g`はglobal＝全部という印 |
| `c=>` | シー・アロー | 見つけた文字cを受け取って |
| `{"&":"&amp;", …}` | 対応表 | 「&なら&amp;に」「<なら&lt;に」という変換表 |
| `[c]` | ブラケット シー | 「その表からcに対応するものを取り出す」 |

**なぜ必要？**：原稿に `<script>` のような文字が入っていたとき、そのまま画面に出すとプログラムとして実行されてしまう危険があります。無害な見た目の文字に変えることで、それを防ぎます。**セキュリティの要**です。

---

## 例4：色の読みやすさを判定 `contrastLabel`（1005〜1011行目）

7行あります。1行ずつ見ます。

```javascript
function contrastLabel(ratio){
  if(ratio==null)return {cls:"ok",text:"標準（読みやすい）"};
  const r=Math.round(ratio*10)/10;
  if(ratio>=4.5)return {cls:"ok",text:"✓ 読みやすい（比 "+r+"）"};
  if(ratio>=3)return {cls:"warn",text:"△ ぎりぎり（比 "+r+"）大きな文字向き"};
  return {cls:"bad",text:"⚠ 読みにくいかも（比 "+r+"）色を見直しましょう"};
}
```

**1行目** `function contrastLabel(ratio){`
→ contrastLabel（コントラスト・ラベル＝明暗差の札）という部品。ratio（レシオ＝比）を受け取ります。

**2行目** `if(ratio==null)return {cls:"ok",text:"標準（読みやすい）"};`
→ もしratioが空（null＝ヌル＝無い）なら、「標準」の札を返して**ここで終わり**。`return`は「答えを返してこの部品を抜ける」なので、以降は実行されません。

**3行目** `const r=Math.round(ratio*10)/10;`
→ rという入れものに、「ratioを10倍して四捨五入し、10で割る」＝**小数第1位までに丸めた値**を入れます。4.567 → 4.6 になります。

**4行目** `if(ratio>=4.5)return {cls:"ok", …};`
→ もしratioが4.5以上なら「✓ 読みやすい」の札を返して終わり。`>=`は「以上」。

**5行目** `if(ratio>=3)return {cls:"warn", …};`
→ （4.5未満で）3以上なら「△ ぎりぎり」の札。ここに来た時点で4.5未満は確定しているので、実質「3以上4.5未満」の意味になります。

**6行目** `return {cls:"bad", …};`
→ ここまで来た＝どの条件にも当てはまらなかった（3未満）ので、「⚠ 読みにくいかも」の札。

**7行目** `}`
→ 部品の終わり。

**読みどころ**：`if`と`return`を上から並べると、**関所を順に通す**形になります。引っかかったところで終了。これは実務でとてもよく使う書き方です。

---

## 例5：速度を設定する `setCpm`（1286〜1292行目）

実務らしい関数です。設定を変え、画面を更新し、保存まで行います。

```javascript
function setCpm(v,silent){
  state.cpm=clamp(Math.round(Number.isFinite(+v)?+v:300),80,600);
  $("cpmVal").textContent=state.cpm;$("cpmRange").value=state.cpm;
  $("cpmVal2").textContent=state.cpm;$("cpmRange2").value=state.cpm;
  document.querySelectorAll("#segPace button").forEach(b=>b.classList.toggle("active",+b.dataset.cpm===state.cpm));
  recalcSpeed();updateProgress();updateStats();if(!silent)saveSoon();
}
```

**1行目** `function setCpm(v,silent){`
→ setCpm（セット・シーピーエム＝速度を設定）。v（新しい値）と、silent（サイレント＝静かに＝保存せずに、の指示）を受け取ります。

**2行目** `state.cpm=clamp(Math.round(Number.isFinite(+v)?+v:300),80,600);`
→ 内側から読みます。
- `+v` … vを数値に変換
- `Number.isFinite(+v)` … 「それはちゃんとした数字か？」を確かめる（isFinite＝有限か）
- `? +v : 300` … **三項演算子**。「はいなら+v、いいえなら300」。`?`が「なら」、`:`が「そうでなければ」
- `Math.round(…)` … 四捨五入して整数に
- `clamp(…,80,600)` … 例1の安全弁で80〜600に収める
- `state.cpm=` … その結果を、状態（state）の速度に入れる

つまり**「数字でなければ300、数字なら整数にして80〜600に収める」**を1行でやっています。

**3〜4行目** `$("cpmVal").textContent=state.cpm; …`
→ 画面の4か所（数値表示2つ、スライダー2つ）を、新しい値に更新します。設定画面と操作パネルの両方に速度表示があるので、両方直しています。

**5行目** `document.querySelectorAll("#segPace button").forEach(b=>b.classList.toggle("active",…));`
→ 速度のプリセットボタン（遅い/標準/速い）を全部取り出し、`forEach`（フォーイーチ＝それぞれに対して）で1つずつ調べ、今の速度と一致するものだけに「active（選択中）」の印を付けます。

**6行目** `recalcSpeed();updateProgress();updateStats();if(!silent)saveSoon();`
→ 速度の再計算、進み具合の更新、統計の更新を実行。最後に「もしsilentでなければ（`!silent`）保存」します。

**読みどころ**：1つの設定変更で「値を守る→画面を直す→関連を再計算→保存」の4仕事をしています。**設定系の関数はだいたいこの形**です。

---

## 例6：動きの心臓 `loop`（1163〜1170行目）

原稿を流し続ける、このツールで最も大事な関数です。

```javascript
function loop(t){
  if(!state.playing)return;
  if(!lastT)lastT=t;const dt=(t-lastT)/1000;lastT=t;
  state.pos+=state.speed*dt;
  if(state.pos>=state.max){state.pos=state.max;pause();showEnd();}
  applyTransform();updateProgress();
  if(state.playing)raf=requestAnimationFrame(loop);
}
```

**1行目** `function loop(t){`
→ loop（ループ＝繰り返し）。t（タイム＝今の時刻）を受け取ります。この時刻はブラウザが自動でくれます。

**2行目** `if(!state.playing)return;`
→ もし再生中**でない**なら（`!`＝でない）、何もせず引き返す。停止中に動き続けないための番人。

**3行目** `if(!lastT)lastT=t;const dt=(t-lastT)/1000;lastT=t;`
→ 3つの文が1行に入っています。
- `if(!lastT)lastT=t;` … 前回時刻がまだ無ければ、今の時刻を入れる（初回の準備）
- `const dt=(t-lastT)/1000;` … dt（デルタタイム＝経過時間）＝「今 − 前回」をミリ秒から秒に直す（÷1000）
- `lastT=t;` … 次回のために、今の時刻を覚えておく

**4行目** `state.pos+=state.speed*dt;`
→ 位置（pos）に、「速度 × 経過時間」を**足す**（`+=`）。距離＝速さ×時間、という小学校で習った式そのままです。

**5行目** `if(state.pos>=state.max){state.pos=state.max;pause();showEnd();}`
→ もし位置が最後（max）に達したら、位置を最後ぴったりに直し、`pause()`で止め、`showEnd()`で終了画面を出します。

**6行目** `applyTransform();updateProgress();`
→ 計算した位置を実際の画面に反映し、進み具合バーも更新。

**7行目** `if(state.playing)raf=requestAnimationFrame(loop);`
→ まだ再生中なら、`requestAnimationFrame`（リクエスト・アニメーション・フレーム＝次の描画のときに呼んで）で**自分自身をもう一度予約**します。これが1秒に約60回繰り返され、なめらかな動きになります。

**読みどころ**：**自分で自分を呼ぶ**のがポイント。パラパラ漫画を1枚ずつめくるように、少しずつ位置を進めては描き直しています。

---

## 例7：保存のしくみ `lsSet` と `saveSoon`（1323〜1331行目）

```javascript
function lsSet(k,v){try{localStorage.setItem(k,v);return true;}catch(e){storageOK=false;return false;}}
```

**この1行**
- `lsSet` … ls＝localStorage（ブラウザ内の保存場所）＋set（入れる）
- `try{ … }` … 「ためしにやってみる」
- `localStorage.setItem(k,v)` … kという名前でvを保存
- `return true;` … 成功したら「はい」を返す
- `catch(e){ … }` … もし失敗したら（プライベートモード等）、ここで**受け止める**
- `storageOK=false;return false;` … 保存できない印を立て、「いいえ」を返す

**読みどころ**：`try`〜`catch`があるので、保存に失敗してもツール全体は止まりません。**エラーで巻き込まれないための防護服**です。

```javascript
function saveSoon(){clearTimeout(saveTimer);saveTimer=setTimeout(saveNow,600);}
```

**この1行**
- `clearTimeout(saveTimer)` … 前に予約した保存をキャンセル
- `setTimeout(saveNow,600)` … 600ミリ秒後に保存を予約

**なぜ？**：スライダーを動かすと1秒に何十回も呼ばれます。毎回保存すると重いので、**「操作が止まって0.6秒経ったら1回だけ保存」**にしています。これをデバウンス（debounce＝跳ね返り防止）と呼びます。

---

## 例8：安全の関門 `isArtifactEnv`（1985〜1993行目）

このツールで**最も重要な安全装置**です。1行ずつ丁寧に読みます。

```javascript
function isArtifactEnv(){
  try{
    if(location.protocol==="file:")return false;              // ローカルファイル直開き＝通常版
    const h=location.hostname||"";
    if(!h||h==="localhost"||h==="127.0.0.1")return false;      // ローカルサーバ＝通常版扱い
    // Claudeのアーティファクトは claude.site / anthropic 系ドメインのサンドボックスで動作
    return /claude\.site|claudeusercontent|anthropic/i.test(h);
  }catch(e){return false;}
}
```

**1行目** `function isArtifactEnv(){`
→ is（〜であるか）＋Artifact（アーティファクト）＋Env（エンバイロンメント＝環境）。「アーティファクト環境ですか？」と尋ねる部品。答えは true（はい）か false（いいえ）。

**2行目** `try{`
→ ここから「ためしに」。何か失敗しても大丈夫なように囲みます。

**3行目** `if(location.protocol==="file:")return false;`
→ location（ロケーション＝今いる場所＝URL）のprotocol（プロトコル＝方式）が「file:」なら、**ファイルを直接開いている＝通常版**なので false（いいえ）を返す。**この時点でAI相談は無効が確定**します。行末の `//` 以降は人間へのメモです。

**4行目** `const h=location.hostname||"";`
→ h という入れものに、ホスト名（サイトの住所）を入れる。`||""` は「もし無ければ空文字を入れる」という保険。

**5行目** `if(!h||h==="localhost"||h==="127.0.0.1")return false;`
→ もしhが空（`!h`）**または** localhost **または** 127.0.0.1 なら、自分のパソコン内＝通常版なので false。`||`が「または」です。

**6行目** `// Claudeのアーティファクトは…`
→ コメント（人間へのメモ）。実行されません。

**7行目** `return /claude\.site|claudeusercontent|anthropic/i.test(h);`
→ ここまで来たら、住所hが「claude.site」「claudeusercontent」「anthropic」のどれかを含むか調べ（`test`）、その結果（true/false）を返す。`|`は「または」、`/i`は「大文字小文字を区別しない」印。**ここでtrueになったときだけ、AI相談が使えます**。

**8行目** `}catch(e){return false;}`
→ もし途中で失敗したら、安全側に倒して false（＝AI無効）を返す。

**読みどころ**：**「分からなければ安全側（無効）に倒す」**という設計になっています。3か所で false を返す道があり、true になるのは最後の1か所だけ。

**Before/After（このツールで実際にあった話）**：この判定関数自体は最初から正しく書けていましたが、以前のバージョンでは呼び出され方に抜けがありました。画面の案内文を切り替える`updateAiBar()`は`isArtifactEnv()`を呼んでいたものの、送信の入口である`sendAI()`からは呼ばれておらず、`callAI()`が環境を問わず実行されてしまう状態でした。つまり「関所」自体は正しくても、**関所の前を素通りする道が残っていた**わけです。現在は`callAI()`の冒頭でも同じ`isArtifactEnv()`を呼ぶよう修正され、通常版では送信ボタンを押しても通信そのものが発生しません（次の例9・callAI()の節を参照）。**「関数が正しい」ことと「その関数がすべての入口で使われている」ことは別**——これが、この例から持ち帰ってほしい教訓です。

---

## 例9：連打を防ぐ見張り番 `sendAI`（1949〜1951行目）

```javascript
async function sendAI(text,persona){
  persona=personaOf(persona);aiPersona=persona;
  if(aiBusy||!text||!text.trim())return;
```

**1行目** `async function sendAI(text,persona){`
→ `async`（アシンク）は「時間がかかる処理を含みます」の合図。text（相談文）とpersona（AIの人格）を受け取ります。

**2行目** `persona=personaOf(persona);aiPersona=persona;`
→ 受け取った人格を正しい形に整え、覚えておきます。

**3行目** `if(aiBusy||!text||!text.trim())return;`
→ **見張り番の1行**。3つの条件のどれか1つでも当てはまれば、何もせず引き返す。
- `aiBusy` … すでにAIが処理中（＝連打された）
- `!text` … 文字が無い
- `!text.trim()` … trim（トリム＝前後の空白を削る）した結果が空＝空白だけ

**読みどころ**：**たった1行で、連打・空送信・空白送信の3つを同時に防いでいます。** 短いですが、実務で非常に重要な守りです。

**注意（例8との関係）**：この3行を見て分かるとおり、`sendAI()`は`isArtifactEnv()`を呼んでいません。ただし、その先で呼ばれる`callAI()`（1907行）の冒頭に`isArtifactEnv()`のガードが入っているため、通常版では`callAI()`に到達した時点で処理が止まり、Anthropic社への通信自体は発生しません。「入口（`sendAI()`）では判定しないが、実際に通信する直前（`callAI()`）で判定する」——関所は1か所である必要はなく、外に出る直前に置いても機能する、という例です。

---

## ここまで読めたあなたへ

9つの例で、こんなことが読めるようになりました。

- `function` で部品を作り、`return` で答えを返す
- `if` で条件分岐し、引っかかった所で終わる（関所方式）
- `clamp` で値を守り、`esc` で表示を守り、`try/catch` でエラーを受け止める
- `loop` が自分を呼び続けて、なめらかな動きを作る
- `isArtifactEnv` が「分からなければ安全側」に倒す

コードは呪文ではなく、**英語で書かれた手順書**です。全部を理解する必要はありません。「ここが安全弁」「ここが分かれ道」「ここが心臓」と地図が読めれば、それで十分エンジニアと会話できます。

---
面白きこともなき世を面白く。 ― 高杉晋作
