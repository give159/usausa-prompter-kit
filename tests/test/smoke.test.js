// smoke.test.js — jsdomでHTMLを丸ごと起動するスモークテスト（6本）
// 通常版判定にするため url は http://localhost（localStorageも使える）
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.join(__dirname, "..", "usausa-prompter-v1_7C-PRO.html"), "utf8");

let dom, win, doc, fetchCalls;

test.before(async () => {
  fetchCalls = [];
  dom = new JSDOM(html, {
    url: "http://localhost/",           // → isArtifactEnv() は false（通常版）
    runScripts: "dangerously",
    pretendToBeVisual: true,            // requestAnimationFrame を有効化
    beforeParse(window) {
      // 回帰テスト用: window.fetch を監視スパイに差し替え（スクリプト実行前に仕込む）
      window.fetch = (...args) => { fetchCalls.push(args[0]); return Promise.reject(new Error("spy")); };
      // jsdom未実装APIの穴埋め（起動を止めないため）
      window.AudioContext = window.AudioContext || function(){ return { createOscillator(){return{connect(){},start(){},stop(){},frequency:{value:0},type:""};}, createGain(){return{connect(){},gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}}};}, destination:{}, currentTime:0 }; };
      window.matchMedia = window.matchMedia || (() => ({ matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
    },
  });
  win = dom.window; doc = win.document;
  await new Promise(r => setTimeout(r, 150)); // boot() 完了待ち
});

test.after(() => { dom.window.close(); }); // ← これを忘れるとテストが終わらない

test("S01 起動確認: boot()が走り、原稿の舞台(stage)とタイトルが存在する", () => {
  assert.ok(doc.getElementById("stage"), "#stage が無い");
  assert.ok(doc.title.includes("うさうさプロンプター"), "タイトル不一致: " + doc.title);
});

test("S02 バージョン表示: 表紙に v1.7C PRO と 2026-07-21 が刻印されている", () => {
  const cover = doc.querySelector(".cover-ver");
  assert.ok(cover, ".cover-ver が無い（表紙未描画）");
  assert.ok(cover.textContent.includes("1.7C PRO"), cover.textContent);
  assert.ok(cover.textContent.includes("2026-07-21"), cover.textContent);
});

test("S03 通常版のAI案内: AI相談を開くと「AI相談は使えません」バーが出る", () => {
  doc.getElementById("btnAI").click();            // openAI() → updateAiBar()
  const bar = doc.getElementById("aiBarText");
  assert.ok(bar.textContent.includes("AI相談は使えません"), bar.textContent);
  doc.getElementById("aiClose").click();          // モーダルを閉じる（開いたままだと以降のショートカットが正しく無効化される）
});

test("S04 localStorage保存: 操作後、キー usausa_prompter_v2 に v:12 で保存される", async () => {
  // ↑キーで速度変更 → saveSoon(600msデバウンス) → 保存
  win.dispatchEvent(new win.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
  await new Promise(r => setTimeout(r, 800));
  const raw = win.localStorage.getItem("usausa_prompter_v2");
  assert.ok(raw, "localStorage に保存されていない");
  assert.equal(JSON.parse(raw).v, 12, "スキーマバージョンが v:12 でない");
});

test("S05 既定値: 保存データの cpm=310(300+10) / size=48 が仕様どおり", () => {
  const d = JSON.parse(win.localStorage.getItem("usausa_prompter_v2"));
  assert.equal(d.cpm, 310, "cpm既定300から↑1回で310のはず: " + d.cpm); // S04で+10済み
  assert.equal(d.size, 48, "size既定48のはず: " + d.size);
});

test("S06 回帰: 通常版でAI送信ボタンを押しても fetch は1度も呼ばれない", async () => {
  doc.getElementById("aiInput").value = "テスト送信です";
  doc.getElementById("aiSend").click();           // sendAI → callAI(冒頭ガードでNOT_ARTIFACT)
  await new Promise(r => setTimeout(r, 200));
  assert.equal(fetchCalls.length, 0, "fetchが呼ばれた: " + JSON.stringify(fetchCalls));
  // ガード発動の証拠: チャット欄に通常版の案内が返る
  assert.ok(doc.getElementById("aiLog").textContent.includes("アーティファクト上でのみ動作"),
    doc.getElementById("aiLog").textContent.slice(0, 200));
});
