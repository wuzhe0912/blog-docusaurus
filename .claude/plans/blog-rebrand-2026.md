# Blog AI 時代轉型 — 執行計劃

> **Last updated:** 2026-02-12

## Context

網站從「技術 wiki」轉型為「個人品牌 + 職涯故事」。
Blog 成為主角，舊 docs 降級為 Notes。繁中先寫，10 語系同步。

---

## Phase 1: 技術基礎修復（6 commits）

> **Status:** DONE  |  **Completed:** 2026-02-11

- [x] **Step 1.1** — 刪除 placeholder 頁面（`src/pages/markdown-page.md`）
- [x] **Step 1.2** — 修正 editUrl（docs + blog 指向正確 repo）
- [x] **Step 1.3** — 更新 authors.yml（title → Software / Product Engineer）
- [x] **Step 1.4** — 新增 4 語系（pt-BR, de, fr, vi）到 config + package.json
- [x] **Step 1.5** — 產生 theme 翻譯檔（7 locale 的 write-translations）
- [x] **Step 1.6** — Commit .claude/ 設定變更

### Commits

| Step | Commit Message |
|------|---------------|
| 1.1 | `[Chore][pages] Remove unused markdown-page placeholder` |
| 1.2 | `[Fix][config] Fix editUrl to point to correct repository` |
| 1.3 | `[Chore][blog] Update author title` |
| 1.4 | `[Feature][config] Add pt-BR, de, fr, vi locales to i18n config` |
| 1.5 | `[Chore][config] Generate theme translation files for all new locales` |
| 1.6 | `[Chore][config] Update claude settings` |

---

## Phase 2: 網站架構重設計（1 commit）

> **Status:** DONE  |  **Completed:** 2026-02-12

- [x] **Step 2.1** — Navbar 重組（8 項 → 5 項：Blog, Projects, Notes, About, localeDropdown）
- [x] **Step 2.2** — Sidebar 整併（6 sidebar → 2：Notes + Projects）
- [x] **Step 2.3** — 更新 Notes 入口頁（標題改「技術筆記」，加引導文字指向 Blog）
- [x] **Step 2.4** — Blog 設定加強（blogSidebarCount: ALL, postsPerPage: 10）
- [x] **Step 2.5** — Navbar i18n（全 10 語系 navbar.json 更新為 Blog/Projects/Notes/About）
- [x] **Step 2.6** — 驗證 `bun run build` 全 10 語系通過（0 errors）

### 變更檔案

| 檔案 | 變更內容 |
|------|---------|
| `docusaurus.config.js` | navbar.items 8→5, blog 加 sidebar/pagination 設定 |
| `sidebars.js` | 6 sidebar → Notes + Projects |
| `docs/Knowledge/knowledge.md` | 標題→技術筆記，新增 Blog 引導 + 4 個新 section 描述 |
| `i18n/*/navbar.json` (x10) | 移除舊 key，新增 Blog/Projects/Notes/About 翻譯 |

### Navbar i18n 對照表

| Key      | zh-tw  | en       | ja           | zh-cn  | ko       | es        | pt-BR    | de        | fr       | vi         |
| -------- | ------ | -------- | ------------ | ------ | -------- | --------- | -------- | --------- | -------- | ---------- |
| Blog     | 部落格 | Blog     | ブログ       | 博客   | 블로그   | Blog      | Blog     | Blog      | Blog     | Blog       |
| Projects | 作品集 | Projects | プロジェクト | 作品集 | 프로젝트 | Proyectos | Projetos | Projekte  | Projets  | Dự án      |
| Notes    | 筆記   | Notes    | ノート       | 笔记   | 노트     | Notas     | Notas    | Notizen   | Notes    | Ghi chú    |
| About    | 關於我 | About    | 紹介         | 关于我 | 소개     | Acerca de | Sobre    | Über mich | À propos | Giới thiệu |

### Commit

`[Feature][config] Redesign navbar and sidebar for personal brand positioning`

---

## Phase 3: 內容策略 & 第一篇文章（2-3 commits）

> **Status:** PENDING

- [ ] **Step 3.1** — 建立 `blog/tags.yml`（career, engineering, ai-tools, year-review, side-projects, life）
- [ ] **Step 3.2** — 第一篇文章 `blog/2026/02-10-why-i-rebuilt-my-blog.md`（**需本人撰寫正文**）
- [ ] **Step 3.3** — 文章 i18n（翻譯到 9 語系）

### Step 3.1 — Blog tags

建立 `blog/tags.yml`：

```yaml
career:
  label: Career
  description: Career reflections and transitions
engineering:
  label: Engineering
  description: Technical decisions and architecture
ai-tools:
  label: AI & Tools
  description: AI-augmented development and tooling
year-review:
  label: Year Review
  description: Annual reflections
side-projects:
  label: Side Projects
  description: Personal projects and experiments
life:
  label: Life
  description: Life beyond code
```

- **Commit:** `[Feature][blog] Add structured blog tags`

### Step 3.2 — 第一篇文章（你自己寫）

- 我提供 `blog/2026/02-10-why-i-rebuilt-my-blog.md` 的 frontmatter 模板和大綱框架
- 你填入正文內容
- **Commit:** `[Docs][blog] Add first post: Why I rebuilt my technical blog`

### Step 3.3 — 文章 i18n（等 3.2 完成後）

- 翻譯到 9 語系，放到 `i18n/{locale}/docusaurus-plugin-content-blog/2026/`
- **Commit:** `[Docs][blog] Add i18n translations for first blog post`

---

## Phase 4: i18n 完善（3 commits）

> **Status:** PENDING

- [ ] **Step 4.1** — Theme 翻譯（code.json + footer.json 全語系補完）
- [ ] **Step 4.2** — 補翻現有 blog（5 篇 × 缺少的語系）
- [ ] **Step 4.3** — 清理 i18n 殘留（en/ja 下的舊 docs 翻譯）

### Step 4.1 — Theme 翻譯

需翻譯的檔案（每個 locale）：

- `code.json`（~90 個自訂 key：首頁 hero/features/CTA + About 頁全部）
- `docusaurus-theme-classic/navbar.json`（Step 2.5 已處理）
- `docusaurus-theme-classic/footer.json`

翻譯策略：

- zh-cn：從 zh-tw 繁轉簡
- ko, es, pt-BR, de, fr, vi：從 en 翻譯
- en, ja：已有 ~90%，補缺即可

- **Commit:** `[Feature][config] Complete theme translations for all locales`

### Step 4.2 — 補翻現有 blog

現有 blog（5 篇）：

- `blog/2024/08-11.md` — 翻譯到 9 語系（全缺）
- `blog/2023/*.md`（4 篇） — en/ja 已有，補 zh-cn, ko, es, pt-BR, de, fr, vi
- **Commit:** `[Docs][blog] Add translations for existing blog posts to all locales`

### Step 4.3 — 清理 i18n 殘留

現有過期 docs 翻譯（使用舊目錄結構 InterviewQuestions/, Quiz/ 等）：

- `i18n/en/docusaurus-plugin-content-docs/current/` — ~40 個舊檔案
- `i18n/ja/docusaurus-plugin-content-docs/current/` — ~30 個舊檔案
- 這些對應已不存在的 docs 路徑，需清理
- **Commit:** `[Chore][config] Clean up stale i18n doc translations`

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

| 階段    | 新增                                                | 修改                                                                                 | 刪除                       |
| ------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------- |
| Phase 1 | ~70 個 i18n 檔（write-translations 產出）           | docusaurus.config.js, blog/authors.yml, package.json, .claude/settings.local.json    | src/pages/markdown-page.md |
| Phase 2 | —                                                   | docusaurus.config.js, sidebars.js, docs/Knowledge/knowledge.md, 10 個 navbar.json   | —                          |
| Phase 3 | blog/tags.yml, 1 篇 blog + 9 個翻譯                 | —                                                                                    | —                          |
| Phase 4 | ~70 個 code.json/footer.json 翻譯, ~40 個 blog 翻譯 | 補完現有 code.json                                                                   | ~70 個過期 docs 翻譯       |
