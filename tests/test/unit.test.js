// unit.test.js — 純粋ロジックの境界値テスト（15本）
const test = require("node:test");
const assert = require("node:assert");
const { clamp, clampRatio, hexLum, contrastRatio, contrastLabel } = require("../extract.js");

// --- clamp（5本）---
test("U01 clamp: 下限ぴったり80はそのまま", () => assert.equal(clamp(80, 80, 600), 80));
test("U02 clamp: 上限ぴったり600はそのまま", () => assert.equal(clamp(600, 80, 600), 600));
test("U03 clamp: 下限割れ79は80に丸める", () => assert.equal(clamp(79, 80, 600), 80));
test("U04 clamp: 上限超え601は600に丸める", () => assert.equal(clamp(601, 80, 600), 600));
test("U05 clampRatio: 範囲外を0〜1に丸める（-0.5→0, 1.5→1, 0.4→0.4）", () => {
  assert.equal(clampRatio(-0.5), 0);
  assert.equal(clampRatio(1.5), 1);
  assert.equal(clampRatio(0.4), 0.4);
});

// --- hexLum（4本）---
test("U06 hexLum: 白 #ffffff の相対輝度は1", () => assert.ok(Math.abs(hexLum("#ffffff") - 1) < 1e-9));
test("U07 hexLum: 黒 #000000 の相対輝度は0", () => assert.equal(hexLum("#000000"), 0));
test("U08 hexLum: 先頭#なし 'ffffff' も受け付ける", () => assert.ok(Math.abs(hexLum("ffffff") - 1) < 1e-9));
test("U09 hexLum: 不正な色コード #12 は例外を投げずnull", () => assert.equal(hexLum("#12"), null));

// --- contrastRatio（3本）---
test("U10 contrastRatio: 白×黒は最大の21", () => assert.ok(Math.abs(contrastRatio("#ffffff", "#000000") - 21) < 1e-9));
test("U11 contrastRatio: 色の順序を入れ替えても比は同じ", () => {
  assert.equal(contrastRatio("#ff6b9d", "#14101a"), contrastRatio("#14101a", "#ff6b9d"));
});
test("U12 contrastRatio: 片方が不正ならnull", () => assert.equal(contrastRatio("#zzz", "#ffffff"), null));

// --- contrastLabel（3本）---
test("U13 contrastLabel: 4.5以上は「読みやすい」(cls:ok)", () => {
  const r = contrastLabel(4.5);
  assert.equal(r.cls, "ok");
  assert.ok(r.text.includes("読みやすい"));
});
test("U14 contrastLabel: 3以上4.5未満は「ぎりぎり」(cls:warn)、3未満は(cls:bad)", () => {
  assert.equal(contrastLabel(4.499).cls, "warn");
  assert.equal(contrastLabel(3).cls, "warn");
  assert.equal(contrastLabel(2.999).cls, "bad");
});
test("U15 contrastLabel: nullは「標準（読みやすい）」で例外なし", () => {
  const r = contrastLabel(null);
  assert.equal(r.cls, "ok");
  assert.ok(r.text.includes("標準"));
});
