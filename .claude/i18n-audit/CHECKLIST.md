# i18n 翻譯補完 — 執行檢查清單

> 建立日期：2026-02-18
> 最後更新：2026-02-18
> 對照文件：`.claude/i18n-audit/REPORT.md`

## 使用規則

1. **每完成一個步驟，立即將該項的 `[ ]` 改為 `[x]` 並存檔**
2. 若某步驟產出需要 commit，在該步驟的 checkbox 後方附註 commit hash
3. 若執行中發現新問題，在該 Phase 末尾新增子項目並標記 `[NEW]`
4. 每個 Phase 結束時，回頭確認所有 checkbox 都已更新

---

## 狀態摘要

- **Docs 覆蓋率**：全 9 語系 89/89 = 100% ✅
- **Blog 覆蓋率**：全 9 語系 5/5 = 100% ✅
- **code.json**：全 9 語系翻譯完成 ✅（僅剩刻意保留項 + 同形詞）
- **其他 JSON**：footer / navbar / sidebar / blog options 全部完整 ✅

---

## 刻意保留英文的 key（DO NOT TRANSLATE）

> ⚠️ 以下 key 全語系保持英文值，未來任何翻譯流程都應跳過這些 key。

| Key | 值 | 保留原因 |
|-----|----|----------|
| `homepage.cta.title` | "Open to Opportunities" | 品牌用語 |
| `homepage.meta.description` | "Software / Product Engineer..." | 品牌用語 |
| `about.role` | "Software / Product Engineer" | 職稱 |
| `about.meta.title` | "About" | 品牌一致性 |
| `about.meta.description` | "About Pitt Wu - Software..." | 品牌用語 |
| `about.expertise.heading` | "Expertise" | UI 設計 |
| `about.workWithMe.heading` | "Work With Me" | UI 設計 |
| `about.expertise.vueNuxt.item1` | "Vue 3 / Nuxt 3" | 技術名詞 |
| `about.expertise.vueNuxt.item2` | "SSR / SSG / ISR" | 技術名詞 |
| `about.expertise.performance.item1` | "Core Web Vitals" | 技術名詞 |
| `about.expertise.performance.item3` | "Lazy Load / Code Splitting" | 技術名詞 |
| `about.expertise.performance.item4` | "CI/CD Pipeline" | 技術名詞 |
| `about.expertise.ai.item3` | "RAG / Prompt Engineering" | 技術名詞 |
| `theme.blog.author.pageTitle` | "{authorName} - {nPosts}" | 格式模板 |
| `projects.card.website` | "Website" | 通用英文 |

### 同形詞（各語系中與英文相同的合法翻譯）

以下 key 在某些語系中的翻譯與英文相同，因為目標語言使用同樣的詞：

- `theme.tags.tagsListLabel` ("Tags:") — de/fr 均使用 "Tags:"
- `theme.tags.tagsPageTitle` ("Tags") — de/fr 均使用 "Tags"
- `theme.docs.versionBadge.label` ("Version: {versionLabel}") — de 使用 "Version:"
- `theme.admonition.info` ("info") — de/fr 均使用 "info"
- `theme.admonition.danger` ("danger") — fr 使用 "danger"
- `theme.navbar.mobileVersionsDropdown.label` ("Versions") — fr 使用 "Versions"

---

## Phase 1: code.json 未翻譯 key 補齊

> 目標：將 de / pt-BR / fr / es 的 code.json 中與 en 完全相同的 message 翻譯為對應語言。
> 排除上方「刻意保留英文」清單中的 key。

### 1-1. de code.json（~43 key）

- [x] 讀取 `i18n/de/code.json` 及 `i18n/en/code.json`
- [x] 翻譯 SearchModal 系列 key（全部完成）
- [x] 翻譯 DocSidebarItem ARIA key
- [x] 翻譯 docs.sidebar ARIA key
- [x] 翻譯 NavBar.navAriaLabel
- [x] 翻譯 docs.breadcrumbs 系列
- [x] 翻譯 Blog author 系列（authorsList.pageTitle / authorsList.viewAll / author.noPosts）
- [x] 翻譯 contentVisibility 系列
- [x] 修正 about.workWithMe.intro/contact 中文殘留 → 德文
- [x] 新增 theme.unlistedContent.title/message
- [x] 驗證 JSON 格式正確

### 1-2. pt-BR code.json（~27 key）

- [x] 讀取 `i18n/pt-BR/code.json`
- [x] 翻譯 SearchModal 系列 key（全部完成）
- [x] 翻譯 IconExternalLink.ariaLabel
- [x] 修正 about.workWithMe.intro/contact 中文殘留 → 葡文
- [x] 新增 theme.unlistedContent.title/message
- [x] 驗證 JSON 格式正確

### 1-3. fr code.json（~14 key）

- [x] 讀取 `i18n/fr/code.json`
- [x] 翻譯 Blog author 系列
- [x] 翻譯 contentVisibility 系列
- [x] 翻譯 NavBar.navAriaLabel / docs.sidebar.navAriaLabel
- [x] 翻譯 archive title/description
- [x] 修正 about.workWithMe.intro/contact 中文殘留 → 法文
- [x] 新增 theme.unlistedContent.title/message
- [x] 驗證 JSON 格式正確

### 1-4. es code.json（~7 key）

- [x] 讀取 `i18n/es/code.json`
- [x] 翻譯 Blog author 系列
- [x] 翻譯 contentVisibility 系列
- [x] 翻譯 admonition 系列（info / tip）
- [x] 翻譯 docs.versionBadge.label（"Versión:"）
- [x] 新增 theme.unlistedContent.title/message
- [x] 驗證 JSON 格式正確

### 1-5. vi / zh-cn / ko code.json

- [x] vi: 修正 about.workWithMe.intro/contact 中文殘留 → 越南文
- [x] vi: 新增 theme.unlistedContent.title/message
- [x] zh-cn: 新增 theme.unlistedContent.title/message
- [x] ko: 新增 theme.unlistedContent.title/message
- [x] 驗證 JSON 格式正確

### 1-6. Phase 1 驗證

- [x] 全 9 語系重跑比對腳本 → **0 remaining issues**
- [x] 各語系僅剩刻意保留項 + 同形詞

---

## Phase 2: 最終驗證

### 2-1. Build 驗證

- [x] 執行 `bun run build` 確認無編譯錯誤 — 全 10 語系 build 成功
- [x] 抽查語系頁面渲染 — build 產出正常

### 2-2. 收尾

- [x] 更新 REPORT.md 中的 code.json 表格 — 全語系 0 remaining issues
- [x] 更新 CLAUDE.md 的 Current Status 區塊
- [x] 更新本檢查清單為最終狀態
- [x] 最終 Commit
