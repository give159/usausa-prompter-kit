# うさうさプロンプター 動的テスト一式（v1.7C PRO対応）

03-extend-guide.md 記載の手順そのままで動きます。

## 実行方法
```bash
# このフォルダに usausa-prompter-v1_7C-PRO.html を置いてから
npm init -y
npm i -D jsdom
node --test
```

## 構成（ユニット15＋スモーク6＝計21項目）
- extract.js … HTMLから純粋ロジック5関数（clamp/clampRatio/hexLum/contrastRatio/contrastLabel）を切り出す
- test/unit.test.js … U01〜U15 境界値テスト
- test/smoke.test.js … S01〜S06 jsdom起動テスト
  - S06 が「通常版で送信ボタンを押してもfetchが呼ばれない」回帰テスト（window.fetch監視）

## 実行記録
2026-07-24 実行：Node v22.22.2 ＋ jsdom 29.1.1 で **21項目 全PASS**
（対象: usausa-prompter-v1_7C-PRO (6).html／全2,220行）
