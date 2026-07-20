// test/smoke.test.js ― jsdomで「実際にHTMLを起動して」確かめるスモークテスト
// 実行: node --test
"use strict";
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { JSDOM } = require("jsdom");

// ページを1回だけ起動して全テストで使い回す
function boot() {
  const html = fs.readFileSync("tool.html", "utf8");
  const dom = new JSDOM(html, {
    runScripts: "dangerously",      // <script>を実行する（＝動的テストの心臓部）
    pretendToBeVisual: true,        // requestAnimationFrame 等を有効化
    url: "http://localhost/tool.html",  // 通常版扱いのまま localStorage も使えるURL
                                        // (file:// だとjsdomではlocalStorageが使えない)
  });
  // jsdomに無いブラウザAPIは、最低限のスタブ（代役）を置く
  const w = dom.window;
  if (!w.matchMedia) w.matchMedia = () => ({ matches: false, addEventListener() {}, addListener() {} });
  if (!w.AudioContext) w.AudioContext = class { close() {} };
  return dom;
}
const dom = boot();
const doc = dom.window.document;

// 後始末: ツール内の時計(setInterval)等が生きているとテストが終わらないため、
// 全テスト完了後にウィンドウを閉じてタイマーを止める
after(() => dom.window.close());

test("起動: <script>がエラーなく実行され、原稿入力欄(#ta)が存在する", () => {
  assert.ok(doc.getElementById("ta"), "#ta が見つからない＝初期化に失敗している");
});

test("バージョン: 画面にJSが描画した v1.7B PRO の表記が出ている", () => {
  // cover-ver はJSが動いて初めて生成される → 「スクリプトが最後まで走った」証拠
  const ver = doc.querySelector(".cover-ver");
  assert.ok(ver, ".cover-ver が無い（JSが途中で落ちた可能性）");
  assert.match(ver.textContent, /1\.7B PRO/);
});

test("主要ボタン: 再生・しおり・続きから・実績・全画面が揃っている", () => {
  for (const id of ["btnBookmark", "btnResume", "btnLog", "btnFull"]) {
    assert.ok(doc.getElementById(id), `#${id} が見つからない`);
  }
});

test("通常版(ローカル)の安全確認: 相談ボタンを押すとAI案内が『使えません』側になる", () => {
  doc.getElementById("btnAI").click();  // 実際のボタンをクリック（ユーザー操作を再現）
  const bar = doc.getElementById("aiBar");
  assert.ok(bar.className.includes("warn"), "通常版なのに ok(有効)表示になっている");
  assert.match(doc.getElementById("aiBarText").textContent, /使えません/);
});

test("保存: 起動後の自動保存で usausa_prompter_v2 に書き込まれる", async () => {
  // boot()内の saveSoon() は600ms後に保存する設計 → 少し待ってから確認する
  await new Promise((r) => setTimeout(r, 900));
  const raw = dom.window.localStorage.getItem("usausa_prompter_v2");
  assert.ok(raw, "保存データが localStorage に無い");
  const data = JSON.parse(raw);
  assert.equal(data.v, 12);      // スキーマバージョン
  assert.equal(data.cpm, 300);   // 既定の読み上げ速度
  assert.equal(data.size, 48);   // 既定の文字サイズ
});
