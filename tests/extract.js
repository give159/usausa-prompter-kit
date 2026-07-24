// extract.js — HTMLから純粋ロジック関数を切り出してNodeで使えるようにする
const fs = require("fs");
const src = fs.readFileSync(__dirname + "/usausa-prompter-v1_7C-PRO.html", "utf8");

function pick(name) {
  // "function NAME(" から、対応する閉じブレースまでを素朴に切り出す
  const start = src.indexOf("function " + name + "(");
  if (start < 0) throw new Error("not found: " + name);
  let depth = 0, i = src.indexOf("{", start);
  for (let j = i; j < src.length; j++) {
    if (src[j] === "{") depth++;
    else if (src[j] === "}") { depth--; if (depth === 0) return src.slice(start, j + 1); }
  }
  throw new Error("unbalanced: " + name);
}

const code = ["clamp", "clampRatio", "hexLum", "contrastRatio", "contrastLabel"].map(pick).join("\n");
const mod = {};
new Function("exportsObj", code + "\nexportsObj.clamp=clamp;exportsObj.clampRatio=clampRatio;exportsObj.hexLum=hexLum;exportsObj.contrastRatio=contrastRatio;exportsObj.contrastLabel=contrastLabel;")(mod);
module.exports = mod;
