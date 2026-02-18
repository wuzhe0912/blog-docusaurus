# i18n 翻譯補完 — 執行檢查清單

> 建立日期：2026-02-18
> 對照文件：`.claude/i18n-audit/REPORT.md`

## 使用規則

1. **每完成一個步驟，立即將該項的 `[ ]` 改為 `[x]` 並存檔**
2. 若某步驟產出需要 commit，在該步驟的 checkbox 後方附註 commit hash
3. 若執行中發現新問題，在該 Phase 末尾新增子項目並標記 `[NEW]`
4. 每個 Phase 結束時，回頭確認所有 checkbox 都已更新

---

## Phase 0: Quick Wins — ja / ko 各補 1 篇達到 100%

### 0-1. ja: 補 http-methods.md

- [ ] 讀取源文件 `docs/Knowledge/Browser-Network/HTTP/http-methods.md`
- [ ] 翻譯為日文，保留 frontmatter `id` / `slug` / `tags` 不變，翻譯 `title`
- [ ] 技術名詞（GET / POST / PUT / DELETE / PATCH / HTTP）保持英文
- [ ] 程式碼區塊中的註解翻譯為日文
- [ ] 寫入 `i18n/ja/docusaurus-plugin-content-docs/current/Knowledge/Browser-Network/HTTP/http-methods.md`
- [ ] 確認 frontmatter 格式正確（`---` 分隔符、id/slug 與源文件一致）
- [ ] Commit：`[Docs][docs] Add ja translation for http-methods`

### 0-2. ko: 補 element-properties.md

- [ ] 讀取源文件 `docs/Knowledge/CSS-UI/CSS/element-properties.md`
- [ ] 翻譯為韓文，保留 frontmatter `id` / `slug` / `tags` 不變，翻譯 `title`
- [ ] 技術名詞（block / inline / inline-block / CSS）保持英文
- [ ] 程式碼區塊中的註解翻譯為韓文
- [ ] 寫入 `i18n/ko/docusaurus-plugin-content-docs/current/Knowledge/CSS-UI/CSS/element-properties.md`
- [ ] 確認 frontmatter 格式正確
- [ ] Commit：`[Docs][docs] Add ko translation for element-properties`

---

## Phase 1: code.json 未翻譯 key 補齊

> 目標：將所有語系的 code.json 中與 en 完全相同的 message 翻譯為對應語言。
> 注意：部分 key 是刻意保留英文（如 `about.meta.title: "About"`），需逐一判斷。

### 1-1. 確認刻意保留英文的 key 清單

- [ ] 讀取 `i18n/en/code.json`，列出以下候選項並決定是否翻譯：
  - `homepage.cta.title: "Open to Opportunities"` → 決定：保留 / 翻譯
  - `about.meta.title: "About"` → 決定：保留 / 翻譯
  - `about.meta.description` → 決定：保留 / 翻譯
  - `about.expertise.heading: "Expertise"` → 決定：保留 / 翻譯
  - `about.workWithMe.heading: "Work With Me"` → 決定：保留 / 翻譯
  - `theme.blog.author.pageTitle: "{authorName} - {nPosts}"` → 決定：保留 / 翻譯
  - `projects.card.website: "Website"` → 決定：保留 / 翻譯
- [ ] 將決定結果記錄在此處（直接在上方每行後方寫結果）
- [ ] 根據決定，從後續步驟中排除「刻意保留」的 key

### 1-2. de code.json（48 key → 扣除保留項後的數量）

- [ ] 讀取 `i18n/de/code.json`
- [ ] 讀取 `i18n/en/code.json` 作為參照
- [ ] 翻譯 SearchModal 系列 key（約 25 key）
  - [ ] searchBox 區塊（placeholderText / enterKeyHint / searchInputLabel / backToKeywordSearch）
  - [ ] startScreen 區塊（recentSearchesTitle / noRecentSearchesText / saveRecentSearch / removeRecentSearch / favoriteSearches / recentConversations）
  - [ ] errorScreen 區塊（titleText / helpText）
  - [ ] resultsScreen 區塊（askAiPlaceholder）
  - [ ] askAiScreen 區塊（disclaimerText / relatedSourcesText / thinkingText / copy / copied / like / dislike / thanksForFeedback / preToolCall / duringToolCall / afterToolCall）
  - [ ] footer 區塊（selectText / submitQuestionText / navigateText / closeText / searchByText / backToSearchText）
  - [ ] noResultsScreen 區塊（noResultsText / suggestedQueryText / reportMissingResults）
  - [ ] placeholder
- [ ] 翻譯 DocSidebarItem ARIA key（expandCategoryAriaLabel / collapseCategoryAriaLabel）
- [ ] 翻譯 docs.sidebar ARIA key（navAriaLabel / closeSidebarButton / toggleSidebarButton）
- [ ] 翻譯 NavBar.navAriaLabel
- [ ] 翻譯 docs.breadcrumbs 系列
- [ ] 翻譯 Blog author 系列（authorsList.pageTitle / authorsList.viewAll / author.noPosts）
- [ ] 翻譯 contentVisibility 系列（draftBanner.title / draftBanner.message / unlisted*）
- [ ] 翻譯 admonition 系列（info / tip / danger / caution / warning）
- [ ] 翻譯其他零散未翻譯 key
- [ ] 驗證 JSON 格式正確（無語法錯誤）
- [ ] Commit：`[Docs][config] Translate de code.json untranslated keys`

### 1-3. pt-BR code.json（32 key）

- [ ] 讀取 `i18n/pt-BR/code.json`
- [ ] 翻譯 SearchModal 系列 key
  - [ ] searchBox 區塊
  - [ ] startScreen 區塊（recentConversations / removeRecentConversation）
  - [ ] resultsScreen 區塊
  - [ ] askAiScreen 區塊（全部）
  - [ ] footer 區塊（submitQuestionText / backToSearchText）
  - [ ] noResultsScreen 區塊
- [ ] 翻譯 about 系列（expertise.heading / workWithMe.heading）— 若非刻意保留
- [ ] 翻譯 IconExternalLink.ariaLabel
- [ ] 翻譯 projects.card.website — 若非刻意保留
- [ ] 驗證 JSON 格式正確
- [ ] Commit：`[Docs][config] Translate pt-BR code.json untranslated keys`

### 1-4. fr code.json（19 key）

- [ ] 讀取 `i18n/fr/code.json`
- [ ] 翻譯 Blog author 系列（authorsList.pageTitle / authorsList.viewAll / author.noPosts）
- [ ] 翻譯 contentVisibility 系列（draftBanner.title / draftBanner.message）
- [ ] 翻譯 NavBar.navAriaLabel
- [ ] 翻譯 docs.sidebar.navAriaLabel
- [ ] 翻譯 SearchModal 部分 key（若有）
- [ ] 翻譯 admonition 系列（danger / info）
- [ ] 翻譯 tags.tagsPageTitle（若非刻意保留 "Tags"）
- [ ] 驗證 JSON 格式正確
- [ ] Commit：`[Docs][config] Translate fr code.json untranslated keys`

### 1-5. es code.json（10 key）

- [ ] 讀取 `i18n/es/code.json`
- [ ] 翻譯 Blog author 系列
- [ ] 翻譯 contentVisibility 系列
- [ ] 翻譯 admonition 系列（info / tip）
- [ ] 翻譯 docs.versionBadge.label（若 "Version:" 需翻譯為 "Versión:"）
- [ ] 驗證 JSON 格式正確
- [ ] Commit：`[Docs][config] Translate es code.json untranslated keys`

### 1-6. vi / zh-tw / zh-cn / ja / ko code.json（3-7 key 各）

- [ ] 逐一檢查各語系，翻譯非刻意保留的 key
- [ ] 驗證 JSON 格式正確
- [ ] Commit：`[Docs][config] Translate remaining code.json keys for CJK+vi locales`

### 1-7. Phase 1 驗證

- [ ] 對全部 9 語系重跑 code.json 比對腳本，確認未翻譯 key 數降至預期值
- [ ] 記錄最終各語系剩餘未翻譯 key 數（應僅剩刻意保留項）

---

## Phase 2: Docs 翻譯補齊 — 共通缺口優先

> 策略：先翻譯「多語系都缺」的文件，一次產出多語系翻譯，效率最高。

### 2-1. frontend-bundler.md（缺 6 語系：zh-cn / es / pt-BR / de / fr / vi）

- [ ] 讀取源文件 `docs/Knowledge/Engineering/Tools/frontend-bundler.md`
- [ ] 翻譯並寫入 zh-cn 版本
- [ ] 翻譯並寫入 es 版本
- [ ] 翻譯並寫入 pt-BR 版本
- [ ] 翻譯並寫入 de 版本
- [ ] 翻譯並寫入 fr 版本
- [ ] 翻譯並寫入 vi 版本
- [ ] 逐一確認 6 個檔案的 frontmatter（id / slug / tags）
- [ ] Commit：`[Docs][docs] Add i18n for frontend-bundler (6 locales)`

### 2-2. 2025-11-interview-prep.md（缺 5 語系：es / pt-BR / de / fr / vi）

- [ ] 讀取源文件 `docs/Experience/2025-11-interview-prep.md`
- [ ] 注意：此檔案可能較長，確認完整讀取
- [ ] 翻譯並寫入 es 版本
- [ ] 翻譯並寫入 pt-BR 版本
- [ ] 翻譯並寫入 de 版本
- [ ] 翻譯並寫入 fr 版本
- [ ] 翻譯並寫入 vi 版本
- [ ] 逐一確認 frontmatter + 內部連結（anchor link）正確
- [ ] Commit：`[Docs][docs] Add i18n for interview-prep (5 locales)`

### 2-3. browser-compatibility.md（缺 5 語系：es / pt-BR / de / fr / vi）

- [ ] 讀取源文件 `docs/Experience/Project-Architecture/browser-compatibility.md`
- [ ] 翻譯並寫入 5 語系版本
- [ ] 確認 frontmatter
- [ ] Commit：`[Docs][docs] Add i18n for browser-compatibility (5 locales)`

### 2-4. vite-setting.md（缺 5 語系：es / pt-BR / de / fr / vi）

- [ ] 讀取源文件 `docs/Experience/Project-Architecture/vite-setting.md`
- [ ] 翻譯並寫入 5 語系版本
- [ ] 確認 frontmatter
- [ ] Commit：`[Docs][docs] Add i18n for vite-setting (5 locales)`

### 2-5. web-browsing-process.md（缺 4 語系：zh-cn / pt-BR / de / vi）

- [ ] 讀取源文件 `docs/Knowledge/Browser-Network/Browser/web-browsing-process.md`
- [ ] 翻譯並寫入 4 語系版本
- [ ] 確認 frontmatter
- [ ] Commit：`[Docs][docs] Add i18n for web-browsing-process (4 locales)`

### 2-6. deep-clone.md（缺 4 語系：es / pt-BR / de / fr — vi 已有但需確認）

- [ ] 確認 vi 版本是否存在且完整
- [ ] 讀取源文件 `docs/Coding/JavaScript/deep-clone.md`
- [ ] 翻譯並寫入缺少的語系版本
- [ ] 確認 frontmatter
- [ ] Commit：`[Docs][docs] Add i18n for deep-clone (4 locales)`

### 2-7. pinia-usage.md（缺 3 語系：es / pt-BR）

- [ ] 讀取源文件 `docs/Experience/State-Management/Vue/pinia-usage.md`
- [ ] 翻譯並寫入 es 版本
- [ ] 翻譯並寫入 pt-BR 版本
- [ ] 確認 frontmatter
- [ ] Commit：`[Docs][docs] Add i18n for pinia-usage (2 locales)`

---

## Phase 3: Docs 翻譯補齊 — 各語系獨立缺口

### 3-1. zh-cn 獨立缺口（5 篇，frontend-bundler 已在 2-1 處理）

- [ ] closure.md → 翻譯並寫入 zh-cn
- [ ] let-var-const-differences.md → 翻譯並寫入 zh-cn
- [ ] web-storage.md → 翻譯並寫入 zh-cn
- [ ] http-caching.md → 翻譯並寫入 zh-cn
- [ ] 逐一確認 frontmatter
- [ ] Commit：`[Docs][docs] Add zh-cn translations for 4 JS knowledge docs`

### 3-2. es 獨立缺口（5 篇，扣除已在共通處理的）

- [ ] js-null-undefined.md → 翻譯並寫入 es
- [ ] basic-types.md (TypeScript) → 翻譯並寫入 es
- [ ] composition-vs-options-api.md → 翻譯並寫入 es
- [ ] component-communication.md → 翻譯並寫入 es
- [ ] 逐一確認 frontmatter
- [ ] Commit：`[Docs][docs] Add es translations for JS/TS/Vue knowledge docs`

### 3-3. pt-BR 獨立缺口（8 篇）

- [ ] lv3-large-data-optimization.md → 翻譯並寫入 pt-BR
- [ ] lv2-js-optimization.md → 翻譯並寫入 pt-BR
- [ ] generics.md (TypeScript) → 翻譯並寫入 pt-BR
- [ ] closure.md → 翻譯並寫入 pt-BR
- [ ] http-caching.md → 翻譯並寫入 pt-BR
- [ ] framework.md → 翻譯並寫入 pt-BR
- [ ] http-methods.md → 翻譯並寫入 pt-BR
- [ ] element-properties.md → 翻譯並寫入 pt-BR
- [ ] 逐一確認 frontmatter
- [ ] Commit：`[Docs][docs] Add pt-BR translations for 8 knowledge docs`

### 3-4. de 獨立缺口（5 篇）

- [ ] basic-types.md (TypeScript) → 翻譯並寫入 de
- [ ] javascript-best-practices.md → 翻譯並寫入 de
- [ ] composition-vs-options-api.md → 翻譯並寫入 de
- [ ] find-most-frequent-char.md → 翻譯並寫入 de
- [ ] object-path-parsing.md → 翻譯並寫入 de
- [ ] 逐一確認 frontmatter
- [ ] Commit：`[Docs][docs] Add de translations for 5 knowledge/coding docs`

### 3-5. fr 獨立缺口（5 篇）

- [ ] closure.md → 翻譯並寫入 fr
- [ ] primitive-vs-reference.md → 翻譯並寫入 fr
- [ ] http-methods.md → 翻譯並寫入 fr
- [ ] find-most-frequent-char.md → 翻譯並寫入 fr
- [ ] object-path-parsing.md → 翻譯並寫入 fr
- [ ] coding.md（index page）→ 翻譯並寫入 fr
- [ ] 逐一確認 frontmatter
- [ ] Commit：`[Docs][docs] Add fr translations for 6 knowledge/coding docs`

### 3-6. vi 獨立缺口（8 篇）

- [ ] closure.md → 翻譯並寫入 vi
- [ ] http-caching.md → 翻譯並寫入 vi
- [ ] let-var-const-differences.md → 翻譯並寫入 vi
- [ ] js-null-undefined.md → 翻譯並寫入 vi
- [ ] basic-types.md (TypeScript) → 翻譯並寫入 vi
- [ ] generics.md (TypeScript) → 翻譯並寫入 vi
- [ ] element-properties.md → 翻譯並寫入 vi
- [ ] coding.md（index page）→ 翻譯並寫入 vi
- [ ] find-most-frequent-char.md → 翻譯並寫入 vi
- [ ] object-path-parsing.md → 翻譯並寫入 vi
- [ ] 逐一確認 frontmatter
- [ ] Commit：`[Docs][docs] Add vi translations for 10 knowledge/coding docs`

---

## Phase 4: 最終驗證

### 4-1. 覆蓋率重新計算

- [ ] 重跑文件數量比對，確認全語系 docs 覆蓋率
- [ ] 目標：全語系 ≥ 95%（理想 100%）
- [ ] 更新 REPORT.md 中的覆蓋率表格

### 4-2. code.json 重新驗證

- [ ] 重跑 code.json 比對腳本
- [ ] 確認各語系未翻譯 key 僅剩刻意保留項
- [ ] 更新 REPORT.md 中的 code.json 表格

### 4-3. Build 驗證

- [ ] 執行 `bun run build` 確認無編譯錯誤
- [ ] 抽查 2-3 個語系的頁面渲染（特別是新增的翻譯檔）

### 4-4. 收尾

- [ ] 更新 CLAUDE.md 的 Current Status 區塊
- [ ] 更新本檢查清單為最終狀態
- [ ] 最終 Commit：`[Chore][config] Update audit checklist and project status`
