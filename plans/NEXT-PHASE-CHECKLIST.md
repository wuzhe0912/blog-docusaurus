# 下一階段檢查清單

> 建立日期：2026-02-18
> 前提：i18n 審計 + en 翻譯（89 檔案）已全數完成

---

## 優先級說明

| 等級 | 定義 |
| ---- | ---- |
| P0   | 結構性問題 — 已壞或誤導使用者 |
| P1   | 高影響 — SEO、品質、對外觀感 |
| P2   | 中影響 — 自動化、內容擴充 |
| P3   | 低影響 — 錦上添花 |

---

## P0 — 結構性問題

### 0-1. 清理空的 AI 目錄

`docs/AI/` 和 `docs/AI/Projects/` 存在但沒有任何內容檔案，sidebar 也無對應入口。
若近期無計畫撰寫 AI 內容，應刪除以避免混淆。

- [ ] 決定：保留（開始寫內容）或刪除
- [ ] 若刪除：移除 `docs/AI/` 目錄
- [ ] 若保留：建立 index.md 並加入 sidebar

### 0-2. 修復 sidebar 缺失

部分有內容的目錄沒有 sidebar 導航入口：

- [ ] 確認 `sidebar/Knowledge/javascript.js` 現為空註解 — 內容已搬至 Quiz，確認是否正確
- [ ] CSS-UI（6 檔案）缺少 sidebar 入口
- [ ] TypeScript（4 檔案）sidebar 入口確認
- [ ] React（1 檔案）sidebar 入口確認
- [ ] Security（4 檔案）sidebar 入口確認

---

## P1 — SEO 與品質

### 1-1. 翻譯品質抽查

89 個 docs/ 檔案由 2 個不同 AI 翻譯（Claude + Codex），可能有風格不一致或錯誤。

- [ ] Batch 1（JS, Codex 翻）抽查 3 檔
- [ ] Batch 2（Vue, Codex 翻）抽查 2 檔
- [ ] Batch 3-5（TS/React/CSS/Engineering, Codex 翻）抽查 3 檔
- [ ] Batch 6（Browser/Security, Claude 翻）抽查 2 檔
- [ ] Batch 7-8（SSR/State, Codex 翻）抽查 3 檔
- [ ] Batch 9（Coding/LeetCode, Claude 翻）抽查 2 檔
- [ ] 統整問題清單並修復

### 1-2. OG Image / Social Preview

目前無 OG 圖片，社群分享時無預覽圖。

- [ ] 設計或產生 OG image（1200×630）
- [ ] 放入 `static/img/og-image.png`
- [ ] 在 `docusaurus.config.js` 加入 metadata 設定
- [ ] 驗證社群分享預覽（Twitter Card Validator / Facebook Debugger）

### 1-3. 補齊 meta description

docs 和 blog 都沒有 `description` frontmatter，影響搜尋引擎摘要。

- [ ] 為 89 個 docs 檔案補上 `description`
- [ ] 為 5 篇 blog 補上 `description`
- [ ] 確認 build 無誤

### 1-4. 建立 robots.txt

`static/` 目錄缺少 robots.txt。

- [ ] 建立 `static/robots.txt`（允許所有爬蟲 + 指向 sitemap）
- [ ] 確認 sitemap.xml 由 Docusaurus 自動產生

### 1-5. Algolia 搜尋重建索引

docs/ 從中文改為英文後，Algolia 索引可能仍為舊中文內容。

- [ ] 觸發 Algolia 重新爬取（或確認 Vercel deploy 自動觸發）
- [ ] 驗證 en 語系搜尋能找到英文關鍵字

---

## P2 — 自動化與內容

### 2-1. 啟用 pre-commit hooks

`.githooks/pre-commit` 已存在但未啟用。

- [ ] 執行 `git config core.hooksPath .githooks`
- [ ] 測試 hook 正常運作（確保 `.claude/` 變更不會遺漏）

### 2-2. GitHub Actions CI

目前無任何 CI pipeline。

- [ ] 新增 build 驗證 workflow（PR 時自動 `bun run build`）
- [ ] 可選：i18n 完整性檢查（新增 docs 時確認各語系有對應翻譯）
- [ ] 可選：broken link 檢查

### 2-3. Linting / Formatting

目前無 ESLint、Prettier 設定。

- [ ] 評估是否需要（Docusaurus 專案複雜度不高）
- [ ] 若需要：加入 Prettier + ESLint 基本設定

### 2-4. 內容擴充方向

- [ ] LeetCode：目前僅 1 題 Easy，可依難度逐步補充
- [ ] Blog：2025 僅 1 篇，考慮新增技術文章或經驗分享
- [ ] Showcase Projects：目前 2 個，可擴充

---

## P3 — 錦上添花

### 3-1. UI 改進

- [ ] Pillars 區塊是否要加回首頁（之前暫時移除）
- [ ] 首頁 tagline 目前為空，考慮補上

### 3-2. 效能優化

- [ ] Lighthouse 跑分確認
- [ ] 圖片資源是否需要壓縮（static/img/ 下的 undraw SVG 可清理）

---

## 完成紀錄

| 日期 | 項目 | 備註 |
| ---- | ---- | ---- |
|      |      |      |
