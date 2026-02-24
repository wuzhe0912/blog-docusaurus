# 擴充 3 語系（it / ru / id）— 完整執行計劃

> 最後更新：2026-02-24
> 狀態：Phase 1–2 已完成，Phase 2 需品質校正，Phase 3–7 待執行

---

## 重要原則

### 翻譯來源

- **所有翻譯一律以英文（English）為基底**
- Docs 來源：`docs/` 目錄（defaultLocale `en` 的原始檔案）
- Blog 來源：`blog/` 目錄（defaultLocale `en` 的原始檔案）
- JSON 來源：以 `i18n/en/code.json` 的 key 結構為準，message 值參考英文語意翻譯
- **禁止使用德文（de）或任何非英文語系作為翻譯基底**，否則會產生翻譯偏差

### Frontmatter 規則

- `id`、`slug`、`tags` 保持與英文版完全一致，不翻譯
- 僅翻譯 `title`（若有 emoji prefix 如 `[Hard] 📄` 則保留）
- Blog 的 `authors`、`slug` 不翻譯

### 技術名詞規則

- 技術專有名詞各語系均保持英文原文（如 SSR、Hydration、Bundle、Closure、Virtual DOM）
- 程式碼區塊（code blocks）不翻譯
- 程式碼中的註解（comments）需翻譯
- 章節標題中若有技術名詞，保留英文並加上括號翻譯（參考 ja 格式：`### Variable Scope（変数スコープ）`）

---

## 進度總覽

| Phase | 描述                         | 狀態                                |
| ----- | ---------------------------- | ----------------------------------- |
| 1     | 設定檔與基礎架構             | ✅ 已完成（commit c44625a）         |
| 2     | i18n JSON 翻譯檔             | ⚠️ 已完成但需校正（commit 04600b0） |
| 3     | Docs 翻譯（89 × 3 = 267 檔） | ⏳ 未開始                           |
| 4     | Blog 翻譯（7 × 3 = 21 檔）   | ⏳ 未開始（目錄已建立，無 .md 檔）  |
| 5     | README 檔案                  | ⏳ 未開始                           |
| 6     | Build 驗證                   | ⏳ 未開始                           |
| 7     | 翻譯品質抽測                 | ⏳ 未開始                           |

---

## Phase 1：設定檔與基礎架構 ✅ 已完成

已在 commit `c44625a` 完成：

- [x] `docusaurus.config.js` — i18n.locales 加入 `'it'`, `'ru'`, `'id'`
- [x] `package.json` — 新增 `dev:it`, `dev:ru`, `dev:id`, `build:it`, `build:ru`, `build:id`
- [x] `CLAUDE.md` — locale 表格更新為 13 列

---

## Phase 2：i18n JSON 翻譯檔 ⚠️ 需校正

已在 commit `04600b0` 建立所有 JSON 檔案，但原計劃以德文（de）為模板，可能有翻譯偏差。

### 2.1 校正作業

針對每個語系（it / ru / id），逐一對照英文語意校正以下檔案：

#### 2.1.1 `code.json`（745 keys）— 高優先

校正方式：讀取 `i18n/{locale}/code.json`，對照英文原意（key 名本身即語意說明），確認翻譯準確。

重點抽查 key：

```
homepage.features.fairWorld.title
homepage.features.fairWorld.description
homepage.features.lifeJourney.title
homepage.features.lifeJourney.description
homepage.features.persistence.title
homepage.features.persistence.description
homepage.hero.title.0 ~ title.4
homepage.hero.subtitle.0 ~ subtitle.4
about.expertise.frontend.description
about.expertise.engineering.description
about.workWithMe.description
about.workWithMe.cta
```

校正標準：

- 對照 `i18n/en/code.json`（Docusaurus theme 預設 key）及其他已驗證語系（如 `ja`, `zh-tw`）的對應 key
- 確認非從德文直譯，而是符合該語系的自然表達
- 技術名詞保持英文

#### 2.1.2 `current.json`（sidebar labels）— 中優先

路徑：`i18n/{locale}/docusaurus-plugin-content-docs/current.json`

大部分 sidebar label 為英文技術名詞（不需翻譯），但以下 key 需確認有正確的語系翻譯：

```
sidebar.experience.category.🏗️ 專案架構  → 需翻譯
sidebar.experience.category.📦 狀態管理  → 需翻譯
```

對照已驗證語系的翻譯：
| Key | ja | de | 預期 it | 預期 ru | 預期 id |
|-----|----|----|---------|---------|---------|
| 🏗️ 專案架構 | プロジェクト設計 | Projektarchitektur | Architettura del Progetto | Архитектура проекта | Arsitektur Proyek |
| 📦 狀態管理 | 状態管理 | State Management | Gestione dello Stato | Управление состоянием | Manajemen State |

#### 2.1.3 `navbar.json` / `footer.json` / `options.json` — 低優先

路徑：

- `i18n/{locale}/docusaurus-theme-classic/navbar.json`
- `i18n/{locale}/docusaurus-theme-classic/footer.json`
- `i18n/{locale}/docusaurus-plugin-content-blog/options.json`

這些檔案 key 數少（共 13 keys），快速對照確認即可。

### 2.2 執行順序

```
1. 讀取 i18n/it/code.json → 校正 → 存檔
2. 讀取 i18n/it/docusaurus-plugin-content-docs/current.json → 校正 → 存檔
3. 讀取 i18n/it/docusaurus-theme-classic/navbar.json → 校正 → 存檔
4. 讀取 i18n/it/docusaurus-theme-classic/footer.json → 校正 → 存檔
5. 讀取 i18n/it/docusaurus-plugin-content-blog/options.json → 校正 → 存檔
6. 重複 1-5 for ru
7. 重複 1-5 for id
8. commit: [Fix][config] Proofread i18n JSON translations against English source
```

---

## Phase 3：Docs 翻譯（89 檔 × 3 語系 = 267 檔）

### 3.0 翻譯來源

- **來源目錄：`docs/`**（英文原始檔案）
- **目標目錄：`i18n/{locale}/docusaurus-plugin-content-docs/current/`**
- **目錄結構：比照 `docs/` 的子目錄結構完整複製**

### 3.1 目錄結構（需先建立）

對每個 locale（it / ru / id），建立以下目錄：

```bash
LOCALE=it  # 替換為 ru / id

mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Coding/JavaScript
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Coding/LodashFunctions/Easy
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Coding/LodashFunctions/Medium
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Experience/Project-Architecture
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Experience/SSR-SEO
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Experience/State-Management/Vue
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Browser-Network/Browser
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Browser-Network/HTTP
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/CSS-UI/CSS
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Engineering/Performance
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Engineering/Tools
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Frontend-Frameworks/React
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Frontend-Frameworks/Vue
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/JavaScript-Ecosystem/JavaScript
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/JavaScript-Ecosystem/TypeScript
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Security/Authentication
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/Knowledge/Security/WebSecurity
mkdir -p i18n/$LOCALE/docusaurus-plugin-content-docs/current/LeetCode/Easy
```

### 3.2 翻譯格式規範

每個 .md 檔的翻譯規則：

1. **Frontmatter**：保留 `id`、`slug`、`tags` 不變，僅翻譯 `title`（保留 emoji prefix）
2. **章節標題**：翻譯標題文字，技術名詞保留英文（可加括號翻譯）
3. **程式碼區塊**：完全不動
4. **程式碼中的註解**：翻譯為目標語系
5. **引用區塊（blockquote）**：翻譯內容
6. **連結文字**：翻譯顯示文字，URL 不動
7. **表格**：翻譯文字內容，保留結構

範例（以 ja 格式為參考）：

```markdown
---
id: closure # ← 不翻譯
title: '[Hard] 📄 Closure' # ← 翻譯（保留 prefix）
slug: /closure # ← 不翻譯
tags: [JavaScript, Quiz, Hard] # ← 不翻譯
---

## 1. Che cos'è la Closure? ← 翻譯

> Che cos'è una closure? ← 翻譯

Per comprendere le closure, è necessario prima capire lo scope delle variabili JavaScript e come una funzione accede alle variabili esterne.

### Variable Scope（Ambito delle variabili） ← 技術名詞+括號翻譯
```

### 3.3 分批執行清單

每個 batch 翻譯 3 個語系（it → ru → id），每完成一個 batch 就 commit。

#### Batch 1：Knowledge/JavaScript-Ecosystem（20 檔 × 3 語系 = 60 檔）

來源：`docs/Knowledge/JavaScript-Ecosystem/`

**JavaScript（16 檔）：**
| # | 來源檔案 | 目標路徑 |
|---|---------|---------|
| 1 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/async-await.md` | `i18n/{locale}/docusaurus-plugin-content-docs/current/Knowledge/JavaScript-Ecosystem/JavaScript/async-await.md` |
| 2 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/closure.md` | 同上結構 |
| 3 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/event-loop.md` | |
| 4 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/framework.md` | |
| 5 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/hoisting.md` | |
| 6 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/http-caching.md` | |
| 7 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/IIFE.md` | |
| 8 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/javascript-best-practices.md` | |
| 9 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/js-null-undefined.md` | |
| 10 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/let-var-const-differences.md` | |
| 11 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/operators.md` | |
| 12 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/primitive-vs-reference.md` | |
| 13 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/promise.md` | |
| 14 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/script-loading-strategies.md` | |
| 15 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/set-map.md` | |
| 16 | `docs/Knowledge/JavaScript-Ecosystem/JavaScript/this-binding.md` | |

**TypeScript（4 檔）：**
| # | 來源檔案 |
|---|---------|
| 17 | `docs/Knowledge/JavaScript-Ecosystem/TypeScript/basic-types.md` |
| 18 | `docs/Knowledge/JavaScript-Ecosystem/TypeScript/generics.md` |
| 19 | `docs/Knowledge/JavaScript-Ecosystem/TypeScript/interface-vs-type.md` |
| 20 | `docs/Knowledge/JavaScript-Ecosystem/TypeScript/typescript-vs-javascript.md` |

```
Commit: [Docs][docs] Translate Batch 1 JavaScript-Ecosystem docs for it/ru/id
```

#### Batch 2：Knowledge/Frontend-Frameworks（10 檔 × 3 = 30 檔）

來源：`docs/Knowledge/Frontend-Frameworks/`

**Vue（9 檔）：**
| # | 來源檔案 |
|---|---------|
| 1 | `docs/Knowledge/Frontend-Frameworks/Vue/component-communication.md` |
| 2 | `docs/Knowledge/Frontend-Frameworks/Vue/composition-vs-options-api.md` |
| 3 | `docs/Knowledge/Frontend-Frameworks/Vue/ref-vs-reactive.md` |
| 4 | `docs/Knowledge/Frontend-Frameworks/Vue/static-hoisting.md` |
| 5 | `docs/Knowledge/Frontend-Frameworks/Vue/two-way-data-binding.md` |
| 6 | `docs/Knowledge/Frontend-Frameworks/Vue/vue-basic-api.md` |
| 7 | `docs/Knowledge/Frontend-Frameworks/Vue/vue-lifecycle.md` |
| 8 | `docs/Knowledge/Frontend-Frameworks/Vue/vue3-new-features.md` |
| 9 | `docs/Knowledge/Frontend-Frameworks/Vue/watch-vs-watcheffect.md` |

**React（1 檔）：**
| # | 來源檔案 |
|---|---------|
| 10 | `docs/Knowledge/Frontend-Frameworks/React/react-useeffect-virtual-dom.md` |

```
Commit: [Docs][docs] Translate Batch 2 Frontend-Frameworks docs for it/ru/id
```

#### Batch 3：Knowledge/CSS-UI + Browser-Network（10 檔 × 3 = 30 檔）

**CSS-UI/CSS（6 檔）：**
| # | 來源檔案 |
|---|---------|
| 1 | `docs/Knowledge/CSS-UI/CSS/css-box-model.md` |
| 2 | `docs/Knowledge/CSS-UI/CSS/css-pseudo-elements.md` |
| 3 | `docs/Knowledge/CSS-UI/CSS/css-units.md` |
| 4 | `docs/Knowledge/CSS-UI/CSS/element-properties.md` |
| 5 | `docs/Knowledge/CSS-UI/CSS/selector-weight.md` |
| 6 | `docs/Knowledge/CSS-UI/CSS/theme-switching.md` |

**Browser-Network（4 檔）：**
| # | 來源檔案 |
|---|---------|
| 7 | `docs/Knowledge/Browser-Network/Browser/web-browsing-process.md` |
| 8 | `docs/Knowledge/Browser-Network/HTTP/cross-origin-resource-sharing.md` |
| 9 | `docs/Knowledge/Browser-Network/HTTP/http-methods.md` |
| 10 | `docs/Knowledge/Browser-Network/HTTP/network-protocols.md` |

```
Commit: [Docs][docs] Translate Batch 3 CSS-UI and Browser-Network docs for it/ru/id
```

#### Batch 4：Knowledge/Engineering + Security（15 檔 × 3 = 45 檔）

**Engineering/Performance（8 檔）：**
| # | 來源檔案 |
|---|---------|
| 1 | `docs/Knowledge/Engineering/Performance/index.md` |
| 2 | `docs/Knowledge/Engineering/Performance/lv1-image-optimization.md` |
| 3 | `docs/Knowledge/Engineering/Performance/lv1-route-optimization.md` |
| 4 | `docs/Knowledge/Engineering/Performance/lv2-js-optimization.md` |
| 5 | `docs/Knowledge/Engineering/Performance/lv3-large-data-optimization.md` |
| 6 | `docs/Knowledge/Engineering/Performance/lv3-nuxt-performance.md` |
| 7 | `docs/Knowledge/Engineering/Performance/lv3-virtual-scroll.md` |
| 8 | `docs/Knowledge/Engineering/Performance/lv3-web-worker.md` |

**Engineering/Tools（1 檔）：**
| # | 來源檔案 |
|---|---------|
| 9 | `docs/Knowledge/Engineering/Tools/frontend-bundler.md` |

**Security/Authentication（4 檔）：**
| # | 來源檔案 |
|---|---------|
| 10 | `docs/Knowledge/Security/Authentication/index.md` |
| 11 | `docs/Knowledge/Security/Authentication/lv1-jwt-structure.md` |
| 12 | `docs/Knowledge/Security/Authentication/lv1-project-implementation.md` |
| 13 | `docs/Knowledge/Security/Authentication/lv1-session-vs-token.md` |

**Security/WebSecurity（1 檔）：**
| # | 來源檔案 |
|---|---------|
| 14 | `docs/Knowledge/Security/WebSecurity/client-side-security.md` |

**Knowledge root（1 檔）：**
| # | 來源檔案 |
|---|---------|
| 15 | `docs/Knowledge/knowledge.md` |

```
Commit: [Docs][docs] Translate Batch 4 Engineering and Security docs for it/ru/id
```

#### Batch 5：Experience（14 檔 × 3 = 42 檔）

| #   | 來源檔案                                                        |
| --- | --------------------------------------------------------------- |
| 1   | `docs/Experience/2023-experience.md`                            |
| 2   | `docs/Experience/2025-11-interview-prep.md`                     |
| 3   | `docs/Experience/Project-Architecture/browser-compatibility.md` |
| 4   | `docs/Experience/Project-Architecture/vite-setting.md`          |
| 5   | `docs/Experience/SSR-SEO/index.md`                              |
| 6   | `docs/Experience/SSR-SEO/lv1-seo-basic.md`                      |
| 7   | `docs/Experience/SSR-SEO/lv2-nuxt-lifecycle-hydration.md`       |
| 8   | `docs/Experience/SSR-SEO/lv2-nuxt-rendering-modes.md`           |
| 9   | `docs/Experience/SSR-SEO/lv2-nuxt-server-features.md`           |
| 10  | `docs/Experience/SSR-SEO/lv2-seo-optimization.md`               |
| 11  | `docs/Experience/SSR-SEO/lv2-ssr-implementation.md`             |
| 12  | `docs/Experience/SSR-SEO/lv3-i18n-seo.md`                       |
| 13  | `docs/Experience/SSR-SEO/lv3-ssr-challenges.md`                 |
| 14  | `docs/Experience/State-Management/index.md`                     |

```
Commit: [Docs][docs] Translate Batch 5 Experience docs for it/ru/id
```

#### Batch 6：Experience/State-Management/Vue + Coding + LeetCode（19 檔 × 3 = 57 檔）

**State-Management/Vue（6 檔）：**
| # | 來源檔案 |
|---|---------|
| 1 | `docs/Experience/State-Management/Vue/pinia-best-practices.md` |
| 2 | `docs/Experience/State-Management/Vue/pinia-persistence.md` |
| 3 | `docs/Experience/State-Management/Vue/pinia-setup.md` |
| 4 | `docs/Experience/State-Management/Vue/pinia-store-patterns.md` |
| 5 | `docs/Experience/State-Management/Vue/pinia-usage.md` |
| 6 | `docs/Experience/State-Management/Vue/vuex-vs-pinia.md` |

**Coding（4 檔）：**
| # | 來源檔案 |
|---|---------|
| 7 | `docs/Coding/coding.md` |
| 8 | `docs/Coding/JavaScript/deep-clone.md` |
| 9 | `docs/Coding/JavaScript/find-most-frequent-char.md` |
| 10 | `docs/Coding/JavaScript/object-path-parsing.md` |

**LodashFunctions/Easy（7 檔）：**
| # | 來源檔案 |
|---|---------|
| 11 | `docs/Coding/LodashFunctions/Easy/clamp.md` |
| 12 | `docs/Coding/LodashFunctions/Easy/counter-number.md` |
| 13 | `docs/Coding/LodashFunctions/Easy/find-most-frequent-char.md` |
| 14 | `docs/Coding/LodashFunctions/Easy/find-value-in-array.md` |
| 15 | `docs/Coding/LodashFunctions/Easy/random-number.md` |
| 16 | `docs/Coding/LodashFunctions/Easy/sort-array.md` |
| 17 | `docs/Coding/LodashFunctions/Easy/string-operation.md` |

**LodashFunctions/Medium（1 檔）：**
| # | 來源檔案 |
|---|---------|
| 18 | `docs/Coding/LodashFunctions/Medium/MultiDimensionalArray.md` |

**LeetCode/Easy（1 檔）：**
| # | 來源檔案 |
|---|---------|
| 19 | `docs/LeetCode/Easy/breadth-first-search.md` |

```
Commit: [Docs][docs] Translate Batch 6 State-Management, Coding, and LeetCode docs for it/ru/id
```

### 3.4 Docs 翻譯驗證（每個 Batch 完成後）

每完成一個 batch commit 前，執行以下檢查：

```bash
# 確認檔案數量一致
find i18n/it/docusaurus-plugin-content-docs/current/ -name "*.md" | wc -l
find i18n/ru/docusaurus-plugin-content-docs/current/ -name "*.md" | wc -l
find i18n/id/docusaurus-plugin-content-docs/current/ -name "*.md" | wc -l

# 預期最終結果：每個 locale 都是 89 檔
```

---

## Phase 4：Blog 翻譯（7 檔 × 3 語系 = 21 檔）

### 4.0 翻譯來源

- **來源目錄：`blog/`**（英文原始檔案）
- **目標目錄：`i18n/{locale}/docusaurus-plugin-content-blog/`**
- 目錄結構已建立（`2023/`, `2024/`, `2025/`, `2026/`）

### 4.1 檔案清單

對每個 locale（it / ru / id）翻譯以下 7 檔：

| #   | 來源檔案                                         | 目標路徑                                                                                 |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | `blog/2023/07-22.md`                             | `i18n/{locale}/docusaurus-plugin-content-blog/2023/07-22.md`                             |
| 2   | `blog/2023/12-31.md`                             | `i18n/{locale}/docusaurus-plugin-content-blog/2023/12-31.md`                             |
| 3   | `blog/2024/08-11.md`                             | `i18n/{locale}/docusaurus-plugin-content-blog/2024/08-11.md`                             |
| 4   | `blog/2024/12-31.md`                             | `i18n/{locale}/docusaurus-plugin-content-blog/2024/12-31.md`                             |
| 5   | `blog/2025/12-25-layoff-negotiation-playbook.md` | `i18n/{locale}/docusaurus-plugin-content-blog/2025/12-25-layoff-negotiation-playbook.md` |
| 6   | `blog/2025/12-31.md`                             | `i18n/{locale}/docusaurus-plugin-content-blog/2025/12-31.md`                             |
| 7   | `blog/2026/02-18-rebuilding-blog-with-ai.md`     | `i18n/{locale}/docusaurus-plugin-content-blog/2026/02-18-rebuilding-blog-with-ai.md`     |

### 4.2 Blog 翻譯格式

- `slug`：不翻譯（保持英文）
- `title`：翻譯為目標語系
- `authors`：不翻譯
- `tags`：不翻譯
- `<!--truncate-->`：保留不動
- 內文：完整翻譯，技術名詞保持英文

```
Commit: [Docs][blog] Translate all blog posts for it/ru/id locales
```

---

## Phase 5：README 檔案

### 5.1 建立 3 個新 README

參考 `README.de.md` 的**格式結構**（非翻譯內容），以 `README.md`（英文）為翻譯基底。

建立：

- `README.it.md`（Italiano）
- `README.ru.md`（Русский）
- `README.id.md`（Bahasa Indonesia）

每個 README 須包含：

1. **Badge 列**：13 個語系切換 badge（排除自己，連結其餘 12 個）
2. **簡介段落**
3. **Tech-Stack 段落**
4. **Project Structure 段落**
5. **i18n 說明**：語系數更新為 13
6. **License 段落**

新增的 3 個 badge：

```markdown
[![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md)
[![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md)
[![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)
```

### 5.2 更新現有 10+1 個 README 的 badge

需更新的檔案（共 11 檔）：

1. `README.md`
2. `README.zh-tw.md`
3. `README.zh-cn.md`
4. `README.ja.md`
5. `README.ko.md`
6. `README.es.md`
7. `README.pt-BR.md`
8. `README.de.md`
9. `README.fr.md`
10. `README.vi.md`

每個檔案需要：

- badge 列補上 3 個新語系連結
- i18n 段落語系數從 10 更新為 13

```
Commit: [Docs][config] Add README files for it/ru/id and update badge links
```

---

## Phase 6：Build 驗證

### 6.1 逐語系 Build

```bash
bun run build:it  # 預期：Build 成功，無錯誤
bun run build:ru  # 預期：Build 成功，無錯誤
bun run build:id  # 預期：Build 成功，無錯誤
```

### 6.2 常見 Build 錯誤處理

| 錯誤類型                     | 原因                 | 修復方式                    |
| ---------------------------- | -------------------- | --------------------------- |
| `SidebarItemsGeneratorError` | docs 目錄結構不匹配  | 對照 `docs/` 確認路徑       |
| `BrokenMarkdownLink`         | 內部連結 slug 被翻譯 | 檢查 slug/id 是否與英文一致 |
| `Missing frontmatter id`     | frontmatter 格式錯誤 | 確認 YAML 格式正確          |

### 6.3 Build 成功後

```bash
# 確認每個 locale 的 docs 檔案數量
for locale in it ru id; do
  echo "$locale: $(find i18n/$locale/docusaurus-plugin-content-docs/current/ -name '*.md' | wc -l) docs, $(find i18n/$locale/docusaurus-plugin-content-blog/ -name '*.md' | wc -l) blog"
done

# 預期輸出：
# it: 89 docs, 7 blog
# ru: 89 docs, 7 blog
# id: 89 docs, 7 blog
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

| #   | 檢查項目                                                 | it  | ru  | id  |
| --- | -------------------------------------------------------- | --- | --- | --- |
| 8   | 抽查 Knowledge/JS 1 篇：程式碼區塊未被翻譯、註解已翻譯   | ☐   | ☐   | ☐   |
| 9   | 抽查 Knowledge/CSS 1 篇：CSS 屬性名保持英文              | ☐   | ☐   | ☐   |
| 10  | 抽查 Knowledge/Vue 或 React 1 篇：元件名/hook 名保持英文 | ☐   | ☐   | ☐   |
| 11  | 抽查 Experience 1 篇：面試情境描述符合該語系慣用表達     | ☐   | ☐   | ☐   |
| 12  | 抽查 LeetCode 1 篇：題目標題保持英文、解題說明已翻譯     | ☐   | ☐   | ☐   |
| 13  | frontmatter `id` 和 `slug` 與 en 版一致（未被翻譯）      | ☐   | ☐   | ☐   |
| 14  | 內部連結（doc links / anchor links）未損壞               | ☐   | ☐   | ☐   |

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

---

## Commit 計劃總覽

| 順序  | Commit Message                                                                            | 涵蓋範圍        |
| ----- | ----------------------------------------------------------------------------------------- | --------------- |
| ~~1~~ | ~~`[Chore][config] Add it/ru/id locales to i18n config and scripts`~~                     | ~~Phase 1~~ ✅  |
| ~~2~~ | ~~`[Docs][config] Add i18n JSON translation files for it/ru/id locales`~~                 | ~~Phase 2~~ ✅  |
| 3     | `[Fix][config] Proofread i18n JSON translations against English source`                   | Phase 2 校正    |
| 4     | `[Docs][docs] Translate Batch 1 JavaScript-Ecosystem docs for it/ru/id`                   | Phase 3 Batch 1 |
| 5     | `[Docs][docs] Translate Batch 2 Frontend-Frameworks docs for it/ru/id`                    | Phase 3 Batch 2 |
| 6     | `[Docs][docs] Translate Batch 3 CSS-UI and Browser-Network docs for it/ru/id`             | Phase 3 Batch 3 |
| 7     | `[Docs][docs] Translate Batch 4 Engineering and Security docs for it/ru/id`               | Phase 3 Batch 4 |
| 8     | `[Docs][docs] Translate Batch 5 Experience docs for it/ru/id`                             | Phase 3 Batch 5 |
| 9     | `[Docs][docs] Translate Batch 6 State-Management, Coding, and LeetCode docs for it/ru/id` | Phase 3 Batch 6 |
| 10    | `[Docs][blog] Translate all blog posts for it/ru/id locales`                              | Phase 4         |
| 11    | `[Docs][config] Add README files for it/ru/id and update badge links`                     | Phase 5         |
| 12    | （若 build 修復）`[Fix][config] Fix build errors for it/ru/id locales`                    | Phase 6         |

### Commit 注意事項

- 每次 commit 前必須先 `git status` 檢查完整 working tree
- 包含所有相關變更（`.claude/`、`bun.lock` 等副作用檔案）
- **不加** `Co-Authored-By` 行
- 使用 `[Type][Scope] description` 格式

---

## 附錄：Web Storage 翻譯對照

已翻譯的 `docs/Knowledge/JavaScript-Ecosystem/JavaScript/web-storage.md` 不在原始 89 檔清單中。確認：此檔案存在於 `docs/` 目錄，已包含在 Batch 1 的 JavaScript 清單中（第 16 檔 `this-binding.md` 之後）。

> 更正：web-storage.md 未列入 Batch 1 表格。需確認 `docs/Knowledge/JavaScript-Ecosystem/JavaScript/` 下的完整檔案清單共 17 檔（含 web-storage.md），Batch 1 應為 21 檔。

### 完整 JavaScript 檔案清單（17 檔）

```
async-await.md, closure.md, event-loop.md, framework.md, hoisting.md,
http-caching.md, IIFE.md, javascript-best-practices.md, js-null-undefined.md,
let-var-const-differences.md, operators.md, primitive-vs-reference.md,
promise.md, script-loading-strategies.md, set-map.md, this-binding.md,
web-storage.md
```

Batch 1 正確檔數：17 (JS) + 4 (TS) = **21 檔 × 3 語系 = 63 檔**
