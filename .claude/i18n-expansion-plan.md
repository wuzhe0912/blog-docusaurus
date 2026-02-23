# 擴充 3 語系（it / ru / id）計劃

## Context

Claude Code 官方文件支援 Italiano、Русский、Bahasa Indonesia，目前 blog 尚未涵蓋。本計劃將這 3 個語系加入現有 10 語系架構，使 blog 總計支援 13 語系。

## 範圍總覽（每個語系）

| 類別                           | 數量      |
| ------------------------------ | --------- |
| docs 翻譯（.md）               | 89 檔     |
| blog 翻譯（.md）               | 7 檔      |
| code.json（UI 文字）           | 745 keys  |
| current.json（sidebar labels） | ~190 keys |
| navbar.json                    | 7 keys    |
| footer.json                    | 3 keys    |
| options.json（blog）           | 3 keys    |
| README                         | 1 檔      |

**3 語系合計：約 288 個 .md 檔 + 2,847 個 JSON 翻譯 key + 3 個 README**

---

## Phase 1：設定檔與基礎架構

### 1.1 `docusaurus.config.js`

- i18n.locales 陣列加入 `'it'`, `'ru'`, `'id'`

### 1.2 `package.json`

- 新增 6 個 script：
  - `dev:it`, `dev:ru`, `dev:id`
  - `build:it`, `build:ru`, `build:id`

### 1.3 `CLAUDE.md`

- i18n locale 表格從 10 列更新為 13 列

---

## Phase 2：i18n JSON 翻譯檔

以 `i18n/de/` 為參考模板，建立 3 個語系的完整 JSON 結構：

### 每個語系建立：

```
i18n/{locale}/
├── code.json                                    # 745 keys
├── docusaurus-theme-classic/
│   ├── navbar.json                              # 7 keys
│   └── footer.json                              # 3 keys
├── docusaurus-plugin-content-docs/
│   └── current.json                             # ~190 keys
└── docusaurus-plugin-content-blog/
    └── options.json                             # 3 keys
```

### 執行順序

1. `it`（Italiano）— code.json → navbar/footer → current.json → options.json
2. `ru`（Русский）— 同上
3. `id`（Bahasa Indonesia）— 同上

---

## Phase 3：Docs 翻譯（89 檔 × 3 語系 = 267 檔）

以 `i18n/de/docusaurus-plugin-content-docs/current/` 的目錄結構為模板，建立翻譯內容：

```
current/
├── Coding/JavaScript/ + LodashFunctions/Easy|Medium/
├── Experience/Project-Architecture/ + SSR-SEO/ + State-Management/Vue/
├── Knowledge/
│   ├── Browser-Network/Browser|HTTP/
│   ├── CSS-UI/CSS/
│   ├── Engineering/Performance|Tools/
│   ├── Frontend-Frameworks/React|Vue/
│   ├── JavaScript-Ecosystem/JavaScript|TypeScript/
│   └── Security/Authentication|WebSecurity/
└── LeetCode/Easy/
```

### 分批執行（per locale）

| Batch | 範圍                               | 約略檔數 |
| ----- | ---------------------------------- | -------- |
| 1     | Knowledge/JavaScript-Ecosystem     | ~20      |
| 2     | Knowledge/Frontend-Frameworks      | ~15      |
| 3     | Knowledge/CSS-UI + Browser-Network | ~15      |
| 4     | Knowledge/Engineering + Security   | ~15      |
| 5     | Experience                         | ~10      |
| 6     | Coding + LeetCode                  | ~14      |

每個 locale 完成 6 batch，3 語系共 18 batch。

---

## Phase 4：Blog 翻譯（7 檔 × 3 語系 = 21 檔）

```
docusaurus-plugin-content-blog/
├── 2023/07-22.md
├── 2023/12-31.md
├── 2024/08-11.md
├── 2024/12-31.md
├── 2025/12-25-layoff-negotiation-playbook.md
├── 2025/12-31.md
└── 2026/02-18-rebuilding-blog-with-ai.md
```

---

## Phase 5：README 檔案

### 5.1 建立 3 個新 README

- `README.it.md`（Italiano）
- `README.ru.md`（Русский）
- `README.id.md`（Bahasa Indonesia）

格式比照現有 README，含 shields.io badge 語系切換列（連結其餘 12 語系）。

### 5.2 更新現有 10 個 README 的 badge

所有現有 README（含 base `README.md`）的 badge 列需補上 3 個新語系連結：

- `[![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md)`
- `[![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md)`
- `[![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)`

同時各 README 的「i18n」段落語系數更新為 13。

---

## Phase 6：Build 驗證

逐語系執行 build 確認無錯誤：

```bash
bun run build:it
bun run build:ru
bun run build:id
```

---

## Phase 7：翻譯品質抽測檢查清單

每語系至少抽測以下項目，確認翻譯品質：

### JSON 翻譯（UI 層）

| #   | 檢查項目                                                        | it  | ru  | id  |
| --- | --------------------------------------------------------------- | --- | --- | --- |
| 1   | code.json：首頁 Hero rotating titles（5 組）自然且語意正確      | ☐   | ☐   | ☐   |
| 2   | code.json：About 頁 Role / Expertise 描述通順                   | ☐   | ☐   | ☐   |
| 3   | code.json：技術專有名詞保持英文（SSR、Hydration、Bundle 等）    | ☐   | ☐   | ☐   |
| 4   | navbar.json：所有導覽項目翻譯正確                               | ☐   | ☐   | ☐   |
| 5   | footer.json：社群連結標籤正確（GitHub / LinkedIn / CakeResume） | ☐   | ☐   | ☐   |
| 6   | current.json：sidebar category labels 翻譯且 emoji 保留         | ☐   | ☐   | ☐   |
| 7   | options.json：blog sidebar title 翻譯正確                       | ☐   | ☐   | ☐   |

### Docs 翻譯（內容層）

| #   | 檢查項目                                                   | it  | ru  | id  |
| --- | ---------------------------------------------------------- | --- | --- | --- |
| 8   | 抽查 Knowledge/JS 1 篇：程式碼區塊未被翻譯、註解已翻譯     | ☐   | ☐   | ☐   |
| 9   | 抽查 Knowledge/CSS 1 篇：CSS 屬性名保持英文                | ☐   | ☐   | ☐   |
| 10  | 抽查 Knowledge/Vue 或 React 1 篇：元件名 / hook 名保持英文 | ☐   | ☐   | ☐   |
| 11  | 抽查 Experience 1 篇：面試情境描述符合該語系慣用表達       | ☐   | ☐   | ☐   |
| 12  | 抽查 LeetCode 1 篇：題目標題保持英文、解題說明已翻譯       | ☐   | ☐   | ☐   |
| 13  | frontmatter `id` 和 `slug` 與 en 版一致（未被翻譯）        | ☐   | ☐   | ☐   |
| 14  | 內部連結（doc links / anchor links）未損壞                 | ☐   | ☐   | ☐   |

### Blog 翻譯

| #   | 檢查項目                                           | it  | ru  | id  |
| --- | -------------------------------------------------- | --- | --- | --- |
| 15  | 抽查最新 1 篇 blog：標題與內容語意通順             | ☐   | ☐   | ☐   |
| 16  | 抽查 layoff-negotiation-playbook：專業用語翻譯正確 | ☐   | ☐   | ☐   |
| 17  | blog frontmatter `slug` 保持英文                   | ☐   | ☐   | ☐   |

### 整合驗證

| #   | 檢查項目                                       | it  | ru  | id  |
| --- | ---------------------------------------------- | --- | --- | --- |
| 18  | `bun run build:{locale}` 零錯誤                | ☐   | ☐   | ☐   |
| 19  | `bun run dev:{locale}` 啟動後首頁正常渲染      | ☐   | ☐   | ☐   |
| 20  | Navbar locale dropdown 正確顯示新語系名稱      | ☐   | ☐   | ☐   |
| 21  | 從其他語系切換至新語系，頁面不出現 404         | ☐   | ☐   | ☐   |
| 22  | README badge 連結全部可正常跳轉（13 語系互通） | ☐   | ☐   | ☐   |
| 23  | ru 語系特別檢查：Cyrillic 字元正確渲染、無亂碼 | ☐   | ☐   | ☐   |
| 24  | id 語系特別檢查：印尼語拼寫無殘留馬來語混用    | ☐   | ☐   | ☐   |
