// extract.js ― 単一ファイルHTMLから「関数のソースコード」を名前で切り出す
// 使い方: const { loadFunctions } = require("./extract");
//         const fns = loadFunctions("tool.html", ["clamp", "hexLum"]);
"use strict";
const fs = require("node:fs");
const vm = require("node:vm");

// HTML本文から function 名前(...) { ... } を波かっこの対応を数えて切り出す
function sliceFunction(source, name) {
  const re = new RegExp(String.raw`(async\s+)?function\s+${name}\s*\(`);
  const m = re.exec(source);
  if (!m) throw new Error(`関数 ${name} が見つかりません`);
  const start = m.index;
  let i = source.indexOf("{", start);
  let depth = 0;
  for (; i < source.length; i++) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) return source.slice(start, i + 1); }
  }
  throw new Error(`関数 ${name} の閉じかっこが見つかりません`);
}

// 指定した関数たちを1つのサンドボックス(vm)で評価して返す
function loadFunctions(htmlPath, names, stubs = {}) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const code = names.map((n) => sliceFunction(html, n)).join("\n");
  const sandbox = { console, ...stubs };
  vm.createContext(sandbox);
  vm.runInContext(code + "\n;({" + names.join(",") + "})", sandbox);
  const result = {};
  for (const n of names) result[n] = vm.runInContext(n, sandbox);
  return result;
}

module.exports = { loadFunctions, sliceFunction };
