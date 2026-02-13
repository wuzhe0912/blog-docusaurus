# Blog AI 時代轉型 — 執行計劃

> **Last updated:** 2026-02-13

## Context

網站從「技術 wiki」轉型為「個人品牌 + 職涯故事」。
Blog 成為主角，舊 docs 降級為 Notes。繁中先寫，10 語系同步。

---

## Phase 1: 技術基礎修復（6 commits）

> **Status:** DONE | **Completed:** 2026-02-11

- [x] **Step 1.1** — 刪除 placeholder 頁面（`src/pages/markdown-page.md`）
- [x] **Step 1.2** — 修正 editUrl（docs + blog 指向正確 repo）
- [x] **Step 1.3** — 更新 authors.yml（title → Software / Product Engineer）
- [x] **Step 1.4** — 新增 4 語系（pt-BR, de, fr, vi）到 config + package.json
- [x] **Step 1.5** — 產生 theme 翻譯檔（7 locale 的 write-translations）
- [x] **Step 1.6** — Commit .claude/ 設定變更

### Commits

| Step | Commit Message                                                         |
| ---- | ---------------------------------------------------------------------- |
| 1.1  | `[Chore][pages] Remove unused markdown-page placeholder`               |
| 1.2  | `[Fix][config] Fix editUrl to point to correct repository`             |
| 1.3  | `[Chore][blog] Update author title`                                    |
| 1.4  | `[Feature][config] Add pt-BR, de, fr, vi locales to i18n config`       |
| 1.5  | `[Chore][config] Generate theme translation files for all new locales` |
| 1.6  | `[Chore][config] Update claude settings`                               |

---

## Phase 2: 網站架構重設計（1 commit）

> **Status:** DONE | **Completed:** 2026-02-12

- [x] **Step 2.1** — Navbar 重組（8 項 → 5 項：Blog, Projects, Notes, About, localeDropdown）
- [x] **Step 2.2** — Sidebar 整併（6 sidebar → 2：Notes + Projects）
- [x] **Step 2.3** — 更新 Notes 入口頁（標題改「技術筆記」，加引導文字指向 Blog）
- [x] **Step 2.4** — Blog 設定加強（blogSidebarCount: ALL, postsPerPage: 10）
- [x] **Step 2.5** — Navbar i18n（全 10 語系 navbar.json 更新為 Blog/Projects/Notes/About）
- [x] **Step 2.6** — 驗證 `bun run build` 全 10 語系通過（0 errors）

### Commit

`[Feature][config] Redesign navbar and sidebar for personal brand positioning`

---

## Phase 2.5: 預設語系切換 en + Vercel 語系偵測（2 commits）

> **Status:** DONE | **Completed:** 2026-02-12

- [x] **Step 2.5.1** — 複製 docs/ 和 blog/ 到 zh-tw i18n 目錄（103 docs + 5 blog）
- [x] **Step 2.5.2** — 修改 defaultLocale → `en`，locales 順序 en 排首位
- [x] **Step 2.5.3** — 建立 `vercel.json`，啟用 Vercel i18n 瀏覽器語系偵測
- [x] **Step 2.5.4** — 清理 `i18n/en/.../docs/current/` 舊結構檔案（5 個目錄全刪）
- [x] **Step 2.5.5** — 驗證 `bun run build` 全 10 語系通過（0 errors）

### Commits

| Scope       | Commit Message                                                                    |
| ----------- | --------------------------------------------------------------------------------- |
| 2.5.1-2.5.2 | `[Feature][config] Switch defaultLocale to en and copy zh-tw content`             |
| 2.5.3-2.5.5 | `[Feature][config] Add Vercel i18n routing and clean up stale en translations`    |

### 後續修正

- `vercel.json` 的 `i18n` 屬性不被 Vercel schema 支援，已移除（`[Fix][config] Remove invalid i18n property from vercel.json`）
- 新增 `.nvmrc` 指定 Node 22，解決 Vercel Node 18 過期問題（`[Chore][config] Add .nvmrc to set Vercel Node.js version to 22`）

---

## Phase 3: 內容策略 & 第一篇文章（2-3 commits）

> **Status:** IN PROGRESS | **Completed:** 3.1 done, 3.2-3.3 pending

- [x] **Step 3.1** — 建立 `blog/tags.yml` + 更新現有文章 tags
- [ ] **Step 3.2** — 第一篇文章 `blog/2026/02-10-why-i-rebuilt-my-blog.md`（**需本人撰寫正文**）
- [ ] **Step 3.3** — 文章 i18n（翻譯到 9 語系）

### Step 3.1 — Blog tags（DONE）

建立 `blog/tags.yml`，定義 6 個結構化 tag：career, engineering, ai-tools, year-review, side-projects, life。
同步更新 4 篇現有文章 × 10 語系 = 40 個檔案的 tags frontmatter。

- **Commit:** `[Feature][blog] Add structured blog tags and clean up stale ja docs translations`

### Step 3.2 — 第一篇文章（等你自己寫）

- 我提供 `blog/2026/02-10-why-i-rebuilt-my-blog.md` 的 frontmatter 模板和大綱框架
- 你填入正文內容
- **Commit:** `[Docs][blog] Add first post: Why I rebuilt my technical blog`

### Step 3.3 — 文章 i18n（等 3.2 完成後）

- 翻譯到 9 語系，放到 `i18n/{locale}/docusaurus-plugin-content-blog/2026/`
- **Commit:** `[Docs][blog] Add i18n translations for first blog post`

---

## Phase 4: i18n 完善（3 commits）

> **Status:** DONE | **Completed:** 2026-02-13

- [x] **Step 4.1** — Theme 翻譯（code.json + footer.json 全語系補完）
- [x] **Step 4.2** — 補翻現有 blog（4 篇 × 全 10 語系）
- [x] **Step 4.3** — 清理 i18n 殘留（ja 下 32 個舊 docs 翻譯）

### Step 4.1 — Theme 翻譯（DONE）

- pt-BR, de, fr, vi 的 `code.json` 各補 23 個 about.expertise.* 和 about.workWithMe.* 翻譯 key
- ja, zh-cn, ko, es, pt-BR, de, fr, vi 的 `footer.json` 翻譯 "Community" 為各語系
- zh-cn, ko, es, pt-BR, de, fr, vi 的 `footer.json` 移除不需要的 `copyright` key
- **Commit:** `[Feature][config] Complete theme translations for all locales`

### Step 4.2 — 補翻現有 blog（DONE）

- 4 篇 blog × 9 語系 = 36 個翻譯檔案新增/更新
- 刪除 2 個冗餘的 `i18n/en/` blog 複本
- 修正 ja 既有翻譯的 frontmatter（old author format → `authors: wuzhe0912`）
- **Commit:** `[Docs][blog] Add full i18n translations for all blog posts`

### Step 4.3 — 清理 i18n 殘留（DONE）

- 刪除 `i18n/ja/docusaurus-plugin-content-docs/current/` 下 32 個過期檔案（Coding/, InterviewQuestions/, LeetCode/, Quiz/）
- 與 Step 3.1 合併為同一 commit

---

## 驗證 Checklist

每個 Phase 完成後：

1. `bun run build` — 全語系無編譯錯誤
2. 抽查 2-3 個語系本地預覽
3. Review diff → Commit

---

## 需要你處理的部分

- **Step 3.2**：第一篇 blog 的正文內容（我只提供模板框架）

## 檔案變更摘要

| 階段      | 新增                                                 | 修改                                                                              | 刪除                          |
| --------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------- |
| Phase 1   | ~70 個 i18n 檔（write-translations 產出）            | docusaurus.config.js, blog/authors.yml, package.json, .claude/settings.local.json | src/pages/markdown-page.md    |
| Phase 2   | —                                                    | docusaurus.config.js, sidebars.js, docs/Knowledge/knowledge.md, 10 個 navbar.json | —                             |
| Phase 2.5 | ~108 個 zh-tw i18n 檔, vercel.json, .nvmrc           | docusaurus.config.js, vercel.json                                                 | ~44 個舊 en docs 翻譯         |
| Phase 3   | blog/tags.yml                                        | 40 個 blog 檔案 tags 更新                                                         | —                             |
| Phase 4   | 36 個 blog 翻譯檔                                    | 12 個 code.json/footer.json                                                       | 32 個舊 ja docs + 2 個舊 en blog |
