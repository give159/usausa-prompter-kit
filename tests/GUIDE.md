# ステップバイステップで動かす 単一HTMLツールのテスト

配布zipを解凍して `npm test` まで、10ステップ。対象は「うさうさプロンプター v1.7B PRO」。掲載コマンド・出力はすべて実機確認済み（Node.js v22 / jsdom 29）。

## この記事のゴール

配布した `うさうさプロンプター_テスト一式_v1.7B.zip` を使い、手元で全20本のテストを緑にするまでを、コピペで追える10ステップにしました。読了目安10分、実作業10分です。

前提: Node.js v22（`node --version` で確認）。入っていなければ `winget install OpenJS.NodeJS.LTS` を先に。

| 区分 | 中身 | 本数 |
|---|---|---|
| レベル1 ユニット | HTML内の関数を切り出して境界値を検査 | 15本 |
| レベル2 スモーク | jsdomでHTMLを丸ごと起動して検査 | 5本 |

## STEP 1｜zipを解凍する

日本語や空白を含まない浅いパス（例 `C:\work`）が安全です。

```
usausa_tests/
├─ extract.js            # 関数を切り出すヘルパー
├─ package.json          # npm test が登録済み
├─ README.md
├─ .gitignore
└─ test/
    ├─ unit.test.js      # ユニット15本
    └─ smoke.test.js     # スモーク5本
```

## STEP 2｜テスト対象のHTMLを置く

`usausa_tests` 直下に、対象を **`tool.html`** という名前でコピーします。改名しないとテストが見つけられません。

```
copy usausa-prompter-v1_7B-PRO.html usausa_tests\tool.html
```

> ツール本体は「製品」、テストは「検査道具」。混ぜると更新のたびに事故るので分けています。

## STEP 3｜依存をインストール

```bash
cd usausa_tests
npm install     # jsdom が入る（初回のみ）
```

`node_modules` が自動生成されます（触らない・.gitignore済み）。

## STEP 4｜まず全部走らせる

```bash
npm test
```

`test/` 配下の `*.test.js` が自動で集まり、20本が一気に走ります（約3秒）。最後の3行だけ見ればOK。

```
# tests 20
# pass 20
# fail 0
```

## STEP 5｜1ファイルだけ・見やすい形式で

原因を追うときは対象を絞り、1件ずつ出る spec 形式に。

```bash
node --test --test-reporter=spec test/unit.test.js
```

```
✔ clamp: 範囲内の値はそのまま返す (1.2ms)
✔ clamp: 境界値ぴったりはそのまま（80と600） (0.2ms)
✔ clamp: 下限割れは下限に、上限超えは上限に丸める（79→80 / 601→600） (0.1ms)
```

`✔` が合格、末尾は時間。テスト名が日本語なので、一覧がそのまま「何を保証したか」になります。

## STEP 6｜名前で絞り込む

```bash
node --test --test-name-pattern="clamp" test/unit.test.js
```

```
# tests 5
# pass 5
```

clampを含む5本だけ。修正まわりの素早い再確認に。

## STEP 7｜わざと失敗させて読み方を覚える

`test/fail.test.js` を作り、わざと間違った期待値を書きます。

```js
// test/fail.test.js ← 練習用。覚えたら消す
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadFunctions } = require("../extract");
const fns = loadFunctions("tool.html", ["clamp"]);
test("clamp: 79はそのまま返る（←わざと間違い）", () => {
  assert.equal(fns.clamp(79, 80, 600), 79);
});
```

```
✖ clamp: 79はそのまま返る（←わざと間違い） (1.5ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

  80 !== 79

      at TestContext.<anonymous> (test/fail.test.js:6:10)
```

読むのは3行だけ。① `✖の行`＝落ちたテスト名。② `80 !== 79`＝「実際 !== 期待」（左が実物）。③ `at ...(ファイル:行)`＝落ちた場所。

**判断のしかた**

- 実際の値が正しい → テストの期待値を直す（今回。clampは80に丸めるのが正しい）
- 期待値が正しい → 製品のバグ。`tool.html` を直して緑に戻す
- 迷ったら → 仕様（要件定義書の制限値一覧）に戻る

覚えたら `test/fail.test.js` は削除（残すと fail 1 のまま）。

## STEP 8｜スモークテストが何を見ているか

jsdom でHTMLを丸ごと起動し、組み上がった状態を検査します。特に重要なのが、通常版でAI相談が無効になる安全確認です。

```js
test("通常版(ローカル)の安全確認: 相談ボタンを押すとAI案内が『使えません』側になる", () => {
  doc.getElementById("btnAI").click();   // 実際のボタンをクリック
  const bar = doc.getElementById("aiBar");
  assert.ok(bar.className.includes("warn"));
  assert.match(doc.getElementById("aiBarText").textContent, /使えません/);
});
```

これは書籍レビュー章の「AI無効化」を、机上ではなく実際に起動して裏づけるテストです。ほかに起動確認・バージョン表示・localStorage保存（v:12／cpm:300／size:48）を検査します。

## STEP 9｜開発中は watch で回しっぱなし

```bash
npm run test:watch
```

保存のたびに自動再実行。止めるのは Ctrl+C。

## STEP 10｜運用ルールに落とす

- HTMLを1箇所でも直したら `npm test`（20本で約3秒）
- バージョン刻印（PRO化）は fail 0 のときだけ。緑がPROの証
- 新機能は「観点→テスト→実装」の順。テストが仕様書代わりになる
- 別バージョン検査時は、smokeの「1.7B PRO」表示テストを新版数に書き換える

## 3行まとめ

- 解凍→`tool.html`配置→`npm install`→`npm test` の4手で全20本が緑になる
- 原因追跡は「1ファイル・spec形式・名前フィルタ」で絞る
- 失敗出力は「✖の行 → 実際!==期待 → atの場所」の3点だけ読む

---

面白きこともなき世を面白く。 ― 高杉晋作
