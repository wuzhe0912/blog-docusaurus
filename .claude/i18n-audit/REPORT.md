# i18n 翻譯審計報告

> 審計日期：2026-02-18
> 審計範圍：全 10 語系的 docs / blog / code.json / footer / navbar / sidebar

---

## 1. Docs 翻譯覆蓋率

**源文件總數（en/default）：89 個**

| Locale | 已翻譯 | 覆蓋率 | 狀態 |
|--------|--------|--------|------|
| zh-tw | 89 | 100% | 完整 |
| zh-cn | 83 | 93% | 缺 6 篇 |
| ja | 88 | 99% | 缺 1 篇 |
| ko | 88 | 99% | 缺 1 篇 |
| es | 79 | 89% | 缺 10 篇 |
| pt-BR | 74 | 83% | 缺 15 篇 |
| de | 78 | 88% | 缺 11 篇 |
| fr | 78 | 88% | 缺 11 篇 |
| vi | 73 | 82% | 缺 16 篇 |

---

## 2. 各語系缺少的 Docs 明細

### zh-cn（缺 6 篇）

- Knowledge/JavaScript-Ecosystem/JavaScript/closure.md
- Knowledge/JavaScript-Ecosystem/JavaScript/let-var-const-differences.md
- Knowledge/JavaScript-Ecosystem/JavaScript/web-storage.md
- Knowledge/JavaScript-Ecosystem/JavaScript/http-caching.md
- Knowledge/Engineering/Tools/frontend-bundler.md
- Knowledge/Browser-Network/Browser/web-browsing-process.md

### ja（缺 1 篇）

- Knowledge/Browser-Network/HTTP/http-methods.md

### ko（缺 1 篇）

- Knowledge/CSS-UI/CSS/element-properties.md

### es（缺 10 篇）

- Knowledge/JavaScript-Ecosystem/JavaScript/js-null-undefined.md
- Knowledge/JavaScript-Ecosystem/TypeScript/basic-types.md
- Knowledge/Frontend-Frameworks/Vue/composition-vs-options-api.md
- Knowledge/Frontend-Frameworks/Vue/component-communication.md
- Knowledge/Engineering/Tools/frontend-bundler.md
- Experience/2025-11-interview-prep.md
- Experience/Project-Architecture/browser-compatibility.md
- Experience/Project-Architecture/vite-setting.md
- Experience/State-Management/Vue/pinia-usage.md
- Coding/JavaScript/deep-clone.md

### pt-BR（缺 15 篇）

- Knowledge/Engineering/Performance/lv3-large-data-optimization.md
- Knowledge/Engineering/Performance/lv2-js-optimization.md
- Knowledge/Engineering/Tools/frontend-bundler.md
- Knowledge/JavaScript-Ecosystem/TypeScript/generics.md
- Knowledge/JavaScript-Ecosystem/JavaScript/closure.md
- Knowledge/JavaScript-Ecosystem/JavaScript/http-caching.md
- Knowledge/JavaScript-Ecosystem/JavaScript/framework.md
- Knowledge/Browser-Network/Browser/web-browsing-process.md
- Knowledge/Browser-Network/HTTP/http-methods.md
- Knowledge/CSS-UI/CSS/element-properties.md
- Experience/2025-11-interview-prep.md
- Experience/Project-Architecture/browser-compatibility.md
- Experience/Project-Architecture/vite-setting.md
- Experience/State-Management/Vue/pinia-usage.md
- Coding/JavaScript/deep-clone.md

### de（缺 11 篇）

- Knowledge/JavaScript-Ecosystem/TypeScript/basic-types.md
- Knowledge/JavaScript-Ecosystem/JavaScript/javascript-best-practices.md
- Knowledge/Engineering/Tools/frontend-bundler.md
- Knowledge/Frontend-Frameworks/Vue/composition-vs-options-api.md
- Knowledge/Browser-Network/Browser/web-browsing-process.md
- Experience/2025-11-interview-prep.md
- Experience/Project-Architecture/browser-compatibility.md
- Experience/Project-Architecture/vite-setting.md
- Coding/JavaScript/deep-clone.md
- Coding/JavaScript/find-most-frequent-char.md
- Coding/JavaScript/object-path-parsing.md

### fr（缺 11 篇）

- Knowledge/JavaScript-Ecosystem/JavaScript/closure.md
- Knowledge/JavaScript-Ecosystem/JavaScript/primitive-vs-reference.md
- Knowledge/Engineering/Tools/frontend-bundler.md
- Knowledge/Browser-Network/HTTP/http-methods.md
- Experience/2025-11-interview-prep.md
- Experience/Project-Architecture/browser-compatibility.md
- Experience/Project-Architecture/vite-setting.md
- Coding/JavaScript/deep-clone.md
- Coding/JavaScript/find-most-frequent-char.md
- Coding/JavaScript/object-path-parsing.md
- Coding/coding.md

### vi（缺 16 篇）

- Knowledge/JavaScript-Ecosystem/JavaScript/closure.md
- Knowledge/JavaScript-Ecosystem/JavaScript/http-caching.md
- Knowledge/JavaScript-Ecosystem/JavaScript/let-var-const-differences.md
- Knowledge/JavaScript-Ecosystem/JavaScript/js-null-undefined.md
- Knowledge/JavaScript-Ecosystem/TypeScript/basic-types.md
- Knowledge/JavaScript-Ecosystem/TypeScript/generics.md
- Knowledge/Engineering/Tools/frontend-bundler.md
- Knowledge/CSS-UI/CSS/element-properties.md
- Knowledge/Browser-Network/Browser/web-browsing-process.md
- Experience/2025-11-interview-prep.md
- Experience/Project-Architecture/browser-compatibility.md
- Experience/Project-Architecture/vite-setting.md
- Coding/JavaScript/deep-clone.md
- Coding/JavaScript/find-most-frequent-char.md
- Coding/JavaScript/object-path-parsing.md
- Coding/coding.md

---

## 3. Blog 翻譯覆蓋率

**源文件總數：5 篇** — 全 9 語系 100% 完成。

---

## 4. code.json 未翻譯 key（與 en 完全相同的 message）

| Locale | 未翻譯 key 數 | 主要缺口 |
|--------|---------------|----------|
| zh-tw | 6 | 部分刻意保留英文項 |
| zh-cn | 5 | 部分刻意保留英文項 |
| ja | 3 | 部分刻意保留英文項 |
| ko | 3 | 部分刻意保留英文項 |
| vi | 7 | 部分刻意保留英文項 |
| es | 10 | draftBanner、Authors、部分 SearchModal |
| fr | 19 | Archive、ARIA、SearchModal、Blog author |
| pt-BR | 32 | SearchModal 大量未翻譯 |
| de | 48 | SearchModal + Sidebar ARIA + 多項 UI |

### 各語系共通未翻譯（可能刻意保留）

- `homepage.cta.title: "Open to Opportunities"`
- `theme.blog.author.pageTitle: "{authorName} - {nPosts}"`
- `about.meta.title: "About"`

### de 主要缺口（48 key）

SearchModal 全系列（searchBox / startScreen / errorScreen / resultsScreen / askAiScreen / footer / noResultsScreen）、DocSidebarItem ARIA、docs.sidebar ARIA、Blog author 系列、contentVisibility 系列。

### pt-BR 主要缺口（32 key）

SearchModal 全系列、about.expertise / workWithMe heading、IconExternalLink ARIA、projects.card.website。

### fr 主要缺口（19 key）

Blog authorsList / author、contentVisibility draftBanner、NavBar ARIA、docs.sidebar ARIA、SearchModal 部分 key。

### es 主要缺口（10 key）

Blog authorsList / author、contentVisibility draftBanner、admonition info/tip。

---

## 5. 其他翻譯檔案

| 檔案 | 狀態 |
|------|------|
| footer.json | 全 10 語系完整，無 copyright key |
| navbar.json | 全 10 語系存在 |
| sidebar*.json | 全 10 語系存在 |
| blog options.json | 全 10 語系存在 |

---

## 6. 翻譯品質

| 檢查項 | 結果 |
|--------|------|
| 非中文語系殘留中文 | 無（僅 SSR-SEO 中合法日文範例） |
| zh-cn 簡繁混用 | 已清理完成 |
| es 音標（á é í ó ú ñ） | 正確 |
| pt-BR 音標（ã ç ê ó） | 正確 |
| fr 重音（é è ê à ç） | 正確 |
| de 變音（ä ö ü ß） | 正確 |
| vi 聲調符號 | 正確 |
| frontmatter（id/slug/title） | 全部正確 |
| 技術名詞保留英文 | 正確（SSR、Hydration、Bundle 等） |

---

## 7. 非阻塞性項目

- macOS `._*` 資源 fork 檔案：61 個存在於磁碟，但已被 global gitignore 排除，不影響 repo。
