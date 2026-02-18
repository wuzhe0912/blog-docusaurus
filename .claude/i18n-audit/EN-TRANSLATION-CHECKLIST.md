# docs/ 英文翻譯檢查清單

> 建立日期：2026-02-18
> 問題：`en` 為 defaultLocale，但 `docs/` 的 89 個檔案內容全為繁體中文
> 目標：將 `docs/` 全部翻譯為英文，使 en 語系正確顯示英文內容

---

## 翻譯規則

### 必須翻譯

- 所有中文正文、標題、列表項目、引言、表格內容
- 中文註解（code block 內的中文 comment 也要翻）
- frontmatter 的 `title` 若含中文需翻譯

### 不得修改

- frontmatter 的 `id` 和 `slug`（路由會壞）
- frontmatter 的 `tags`（已經是英文）
- code block 內的程式碼邏輯
- 技術名詞保持英文（SSR、Hydration、Bundle、DOM、CSSOM 等）
- 檔名和目錄結構

### 翻譯風格參考

以 `docs/` 現有的 中文 → 對照其他語系翻譯（如 de/ja/es），保持以下風格：

- 內容為技術筆記 / 面試題庫，語氣為教學式、直述、簡潔
- 許多檔案的 H2 標題已經是英文（如 `## 1. What is Closure ?`），這些保留不動
- 中文引言區塊（`>`）翻成英文
- 中文括號說明（如「Variable Scope(變數作用域)」）去掉中文部分，保留英文
- code block 內的中文 comment 翻成英文

### 驗證方式

每批次完成後：
1. 確認 `bun run build` 無錯誤
2. 抽查 2-3 個檔案確認翻譯品質
3. 確認 frontmatter id/slug 未被修改

---

## 狀態總覽

| Batch | 範圍 | 檔案數 | 行數 | 狀態 |
|-------|------|--------|------|------|
| 1 | Knowledge / JavaScript | 17 | ~5,580 | [ ] |
| 2 | Knowledge / Vue | 9 | ~6,505 | [ ] |
| 3 | Knowledge / TypeScript + React | 5 | ~2,270 | [ ] |
| 4 | Knowledge / CSS | 6 | ~2,168 | [ ] |
| 5 | Knowledge / Engineering | 9 | ~2,634 | [ ] |
| 6 | Knowledge / Browser-Network + Security + index | 10 | ~843 | ✅ |
| 7 | Experience / SSR-SEO | 9 | ~3,094 | [ ] |
| 8 | Experience / State-Management + misc | 11 | ~1,903 | [ ] |
| 9 | Coding + LeetCode | 13 | ~2,632 | ✅ |
| — | **合計** | **89** | **~27,629** | |

---

## Batch 1: Knowledge / JavaScript（17 files, ~5,580 lines）

- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/async-await.md` (557 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/closure.md` (444 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/event-loop.md` (82 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/framework.md` (87 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/hoisting.md` (395 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/http-caching.md` (858 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/IIFE.md` (149 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/javascript-best-practices.md` (16 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/js-null-undefined.md` (44 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/let-var-const-differences.md` (350 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/operators.md` (585 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/primitive-vs-reference.md` (768 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/promise.md` (473 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/script-loading-strategies.md` (78 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/set-map.md` (809 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/this-binding.md` (844 lines)
- [x] `docs/Knowledge/JavaScript-Ecosystem/JavaScript/web-storage.md` (41 lines)
- [x] Batch 1 build 驗證
- [x] Batch 1 commit (f83e514)

---

## Batch 2: Knowledge / Vue（9 files, ~6,505 lines）

- [x] `docs/Knowledge/Frontend-Frameworks/Vue/component-communication.md` (934 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/composition-vs-options-api.md` (679 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/ref-vs-reactive.md` (500 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/static-hoisting.md` (583 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/two-way-data-binding.md` (260 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/vue-basic-api.md` (1,337 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/vue-lifecycle.md` (950 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/vue3-new-features.md` (755 lines)
- [x] `docs/Knowledge/Frontend-Frameworks/Vue/watch-vs-watcheffect.md` (507 lines)
- [x] Batch 2 build 驗證
- [ ] Batch 2 commit

---

## Batch 3: Knowledge / TypeScript + React（5 files, ~2,270 lines）

- [ ] `docs/Knowledge/JavaScript-Ecosystem/TypeScript/basic-types.md` (486 lines)
- [ ] `docs/Knowledge/JavaScript-Ecosystem/TypeScript/generics.md` (500 lines)
- [ ] `docs/Knowledge/JavaScript-Ecosystem/TypeScript/interface-vs-type.md` (610 lines)
- [ ] `docs/Knowledge/JavaScript-Ecosystem/TypeScript/typescript-vs-javascript.md` (428 lines)
- [ ] `docs/Knowledge/Frontend-Frameworks/React/react-useeffect-virtual-dom.md` (246 lines)
- [ ] Batch 3 build 驗證
- [ ] Batch 3 commit

---

## Batch 4: Knowledge / CSS（6 files, ~2,168 lines）

- [ ] `docs/Knowledge/CSS-UI/CSS/css-box-model.md` (171 lines)
- [ ] `docs/Knowledge/CSS-UI/CSS/css-pseudo-elements.md` (387 lines)
- [ ] `docs/Knowledge/CSS-UI/CSS/css-units.md` (340 lines)
- [ ] `docs/Knowledge/CSS-UI/CSS/element-properties.md` (41 lines)
- [ ] `docs/Knowledge/CSS-UI/CSS/selector-weight.md` (57 lines)
- [ ] `docs/Knowledge/CSS-UI/CSS/theme-switching.md` (1,172 lines)
- [ ] Batch 4 build 驗證
- [ ] Batch 4 commit

---

## Batch 5: Knowledge / Engineering（9 files, ~2,634 lines）

- [ ] `docs/Knowledge/Engineering/Performance/index.md` (28 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv1-image-optimization.md` (257 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv1-route-optimization.md` (165 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv2-js-optimization.md` (234 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv3-large-data-optimization.md` (777 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv3-nuxt-performance.md` (344 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv3-virtual-scroll.md` (367 lines)
- [ ] `docs/Knowledge/Engineering/Performance/lv3-web-worker.md` (431 lines)
- [ ] `docs/Knowledge/Engineering/Tools/frontend-bundler.md` (31 lines)
- [ ] Batch 5 build 驗證
- [ ] Batch 5 commit

---

## Batch 6: Knowledge / Browser-Network + Security + index（10 files, ~843 lines）✅

- [x] `docs/Knowledge/knowledge.md` (59 lines)
- [x] `docs/Knowledge/Browser-Network/Browser/web-browsing-process.md` (112 lines)
- [x] `docs/Knowledge/Browser-Network/HTTP/cross-origin-resource-sharing.md` (49 lines)
- [x] `docs/Knowledge/Browser-Network/HTTP/http-methods.md` (64 lines)
- [x] `docs/Knowledge/Browser-Network/HTTP/network-protocols.md` (99 lines)
- [x] `docs/Knowledge/Security/Authentication/index.md` (33 lines)
- [x] `docs/Knowledge/Security/Authentication/lv1-jwt-structure.md` (127 lines)
- [x] `docs/Knowledge/Security/Authentication/lv1-project-implementation.md` (155 lines)
- [x] `docs/Knowledge/Security/Authentication/lv1-session-vs-token.md` (96 lines)
- [x] `docs/Knowledge/Security/WebSecurity/client-side-security.md` (49 lines)
- [x] Batch 6 build 驗證
- [x] Batch 6 commit

---

## Batch 7: Experience / SSR-SEO（9 files, ~3,094 lines）

- [ ] `docs/Experience/SSR-SEO/index.md` (30 lines)
- [ ] `docs/Experience/SSR-SEO/lv1-seo-basic.md` (246 lines)
- [ ] `docs/Experience/SSR-SEO/lv2-nuxt-lifecycle-hydration.md` (171 lines)
- [ ] `docs/Experience/SSR-SEO/lv2-nuxt-rendering-modes.md` (411 lines)
- [ ] `docs/Experience/SSR-SEO/lv2-nuxt-server-features.md` (218 lines)
- [ ] `docs/Experience/SSR-SEO/lv2-seo-optimization.md` (369 lines)
- [ ] `docs/Experience/SSR-SEO/lv2-ssr-implementation.md` (686 lines)
- [ ] `docs/Experience/SSR-SEO/lv3-i18n-seo.md` (182 lines)
- [ ] `docs/Experience/SSR-SEO/lv3-ssr-challenges.md` (781 lines)
- [ ] Batch 7 build 驗證
- [ ] Batch 7 commit

---

## Batch 8: Experience / State-Management + misc（11 files, ~1,903 lines）

- [ ] `docs/Experience/State-Management/index.md` (23 lines)
- [ ] `docs/Experience/State-Management/Vue/pinia-best-practices.md` (254 lines)
- [ ] `docs/Experience/State-Management/Vue/pinia-persistence.md` (217 lines)
- [ ] `docs/Experience/State-Management/Vue/pinia-setup.md` (162 lines)
- [ ] `docs/Experience/State-Management/Vue/pinia-store-patterns.md` (280 lines)
- [ ] `docs/Experience/State-Management/Vue/pinia-usage.md` (335 lines)
- [ ] `docs/Experience/State-Management/Vue/vuex-vs-pinia.md` (442 lines)
- [ ] `docs/Experience/2023-experience.md` (20 lines)
- [ ] `docs/Experience/2025-11-interview-prep.md` (76 lines)
- [ ] `docs/Experience/Project-Architecture/browser-compatibility.md` (30 lines)
- [ ] `docs/Experience/Project-Architecture/vite-setting.md` (64 lines)
- [ ] Batch 8 build 驗證
- [ ] Batch 8 commit

---

## Batch 9: Coding + LeetCode（13 files, ~2,632 lines）✅

- [x] `docs/Coding/coding.md` (13 lines)
- [x] `docs/Coding/JavaScript/deep-clone.md` (594 lines)
- [x] `docs/Coding/JavaScript/find-most-frequent-char.md` (486 lines)
- [x] `docs/Coding/JavaScript/object-path-parsing.md` (722 lines)
- [x] `docs/Coding/LodashFunctions/Easy/clamp.md` (39 lines)
- [x] `docs/Coding/LodashFunctions/Easy/counter-number.md` (86 lines)
- [x] `docs/Coding/LodashFunctions/Easy/find-most-frequent-char.md` (45 lines)
- [x] `docs/Coding/LodashFunctions/Easy/find-value-in-array.md` (173 lines)
- [x] `docs/Coding/LodashFunctions/Easy/random-number.md` (25 lines)
- [x] `docs/Coding/LodashFunctions/Easy/sort-array.md` (63 lines)
- [x] `docs/Coding/LodashFunctions/Easy/string-operation.md` (210 lines)
- [x] `docs/Coding/LodashFunctions/Medium/MultiDimensionalArray.md` (108 lines)
- [x] `docs/LeetCode/Easy/breadth-first-search.md` (68 lines)
- [x] Batch 9 build 驗證
- [x] Batch 9 commit

---

## 最終驗證

- [ ] 全 10 語系 `bun run build` 成功
- [ ] en 語系抽查 5+ 頁面確認為英文
- [ ] zh-tw 語系抽查確認仍為繁中（`i18n/zh-tw/` 未受影響）
- [ ] 其他語系抽查確認未受影響
- [ ] 更新 CLAUDE.md Current Status
- [ ] 更新 `.claude/i18n-audit/REPORT.md`
