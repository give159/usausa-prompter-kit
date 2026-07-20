// test/unit.test.js ― 純粋ロジックのユニットテスト（Node標準の node:test を使用）
// 実行: node --test
"use strict";
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadFunctions } = require("../extract");

// テスト対象の関数を tool.html から切り出す（依存の少ない順にまとめて評価）
const fns = loadFunctions("tool.html", [
  "clamp", "clampRatio", "hexLum", "contrastRatio", "contrastLabel",
]);

// ── clamp：値を「下限a〜上限b」に収める安全弁 ─────────────────
test("clamp: 範囲内の値はそのまま返す", () => {
  assert.equal(fns.clamp(300, 80, 600), 300);
});
test("clamp: 境界値ぴったりはそのまま（80と600）", () => {
  assert.equal(fns.clamp(80, 80, 600), 80);
  assert.equal(fns.clamp(600, 80, 600), 600);
});
test("clamp: 下限割れは下限に、上限超えは上限に丸める（79→80 / 601→600）", () => {
  assert.equal(fns.clamp(79, 80, 600), 80);
  assert.equal(fns.clamp(601, 80, 600), 600);
});
test("clamp: 極端な値（マイナス・巨大数）でも壊れない", () => {
  assert.equal(fns.clamp(-99999, 20, 120), 20);
  assert.equal(fns.clamp(99999, 20, 120), 120);
});

// ── clampRatio：0〜1に収める（位置の割合など） ──────────────
test("clampRatio: 0.5はそのまま、範囲外は0/1に、falsyは0に", () => {
  assert.equal(fns.clampRatio(0.5), 0.5);
  assert.equal(fns.clampRatio(-0.1), 0);
  assert.equal(fns.clampRatio(1.5), 1);
  assert.equal(fns.clampRatio(undefined), 0);
});

// ── hexLum：カラーコード → 相対輝度（WCAGの計算式） ──────────
test("hexLum: 白(#ffffff)は輝度1、黒(#000000)は輝度0", () => {
  assert.ok(Math.abs(fns.hexLum("#ffffff") - 1) < 1e-9);
  assert.ok(Math.abs(fns.hexLum("#000000") - 0) < 1e-9);
});
test("hexLum: #なし6桁・大文字も受け付ける", () => {
  assert.equal(fns.hexLum("FFFFFF"), fns.hexLum("#ffffff"));
});
test("hexLum: 不正な文字列は null（例外を投げず安全に失敗）", () => {
  assert.equal(fns.hexLum("赤"), null);
  assert.equal(fns.hexLum("#12"), null);
  assert.equal(fns.hexLum(""), null);
});

// ── contrastRatio：文字色と背景色のコントラスト比 ────────────
test("contrastRatio: 白×黒は最大の21", () => {
  assert.ok(Math.abs(fns.contrastRatio("#ffffff", "#000000") - 21) < 0.01);
});
test("contrastRatio: 同じ色どうしは最小の1", () => {
  assert.ok(Math.abs(fns.contrastRatio("#777777", "#777777") - 1) < 0.01);
});
test("contrastRatio: 引数の順番を入れ替えても同じ比になる（明↔暗の自動判定）", () => {
  const a = fns.contrastRatio("#111111", "#ffffff");
  const b = fns.contrastRatio("#ffffff", "#111111");
  assert.ok(Math.abs(a - b) < 1e-9);
});

// ── contrastLabel：比 → 画面に出すラベル（WCAG 4.5 / 3 のしきい値） ──
test("contrastLabel: 4.5以上は「✓ 読みやすい」", () => {
  assert.match(fns.contrastLabel(4.5).text, /読みやすい/);
  assert.equal(fns.contrastLabel(4.5).cls, "ok");
});
test("contrastLabel: 3以上4.5未満は「△ ぎりぎり」", () => {
  assert.match(fns.contrastLabel(4.49).text, /ぎりぎり/);
  assert.equal(fns.contrastLabel(3).cls, "warn");
});
test("contrastLabel: 3未満は「⚠ 読みにくいかも」", () => {
  assert.match(fns.contrastLabel(2.99).text, /読みにくい/);
  assert.equal(fns.contrastLabel(1).cls, "bad");
});
test("contrastLabel: 比がnull（色が不正）でも既定ラベルを返す", () => {
  assert.equal(fns.contrastLabel(null).cls, "ok");
});
