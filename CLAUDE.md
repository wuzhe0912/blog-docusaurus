# Project Guidelines

## Commit Message Format

```
[Type][Scope] Short description

Ex.
[Feature][pages] Redesign homepage with personal branding
[Fix][config] Fix broken algolia search config
[Chore][styles] Update custom CSS variables
[Refactor][docs] Restructure knowledge base categories
[Docs][blog] Add 2025 mid-year reflection post
```

### Type

- `Feature` — 新功能或新內容
- `Fix` — Bug 修復
- `Refactor` — 重構（不改變功能）
- `Chore` — 雜項（設定、依賴、CI）
- `Docs` — 文件或文章新增/更新
- `Style` — 純樣式調整（不影響邏輯）

### Scope

- `pages` — src/pages（首頁、About 等）
- `components` — src/components
- `styles` — src/css 或 CSS modules
- `config` — docusaurus.config.js、sidebars 等設定檔
- `docs` — docs/ 下的技術筆記
- `blog` — blog/ 下的文章
- `sidebar` — sidebar/ 設定
- `deps` — package.json 依賴變更

## Tech Stack

- Docusaurus 3.9.2 + React 18 + MDX
- 預設語言：English（en），內容先以繁體中文撰寫
- 預設主題：Dark mode
- 部署：Vercel
- 搜尋：Algolia

## Project Structure

- `src/pages/` — 自訂頁面（首頁、About）
- `src/components/` — React 元件
- `src/css/custom.css` — 全域樣式
- `docs/` — 技術文件（Knowledge、Experience、Coding（含 LeetCode）、AI、ShowCase）
- `blog/` — 個人部落格文章
- `sidebar/` — 模組化側邊欄設定
- `static/img/` — 靜態資源

## i18n（國際化）

支援 10 個語系，所有新增內容和 UI 都必須完整支援全語系：

| Locale  | 語言             |
| ------- | ---------------- |
| `en`    | English（預設）  |
| `zh-tw` | 繁體中文         |
| `zh-cn` | 簡體中文         |
| `ja`    | 日本語           |
| `ko`    | 한국어           |
| `es`    | Español          |
| `pt-BR` | Português        |
| `de`    | Deutsch          |
| `fr`    | Français         |
| `vi`    | Tiếng Việt       |

### 規則

- **UI 文字**：所有 UI 介面文字必須使用 `<Translate>` 元件或 `translate()` 函式，並在 `i18n/{locale}/` 下提供對應翻譯
- **文件/文章**：新增 docs 或 blog 時，必須在 `i18n/{locale}/docusaurus-plugin-content-docs/` 和 `i18n/{locale}/docusaurus-plugin-content-blog/` 下提供翻譯版本
- **頁面**：自訂頁面（src/pages）中的靜態文字使用 `<Translate>` 包裹
- **預設語言**：`en` 為 Docusaurus defaultLocale，但內容先以繁體中文撰寫，再產出其他語系翻譯
- **技術名詞**：技術專有名詞各語系均保持英文原文（如 SSR、Hydration、Bundle）

## Conventions

- **Commit 訊息禁止加 `Co-Authored-By` 或任何自動署名行**，只留標題訊息
- **此專案的 `.claude/` 檔案屬於版本控管範圍**：只要 `.claude/` 有變更，commit 時必須一併 stage；若新檔受 global gitignore 影響，請使用 `git add -f`
- CSS 使用 CSS Modules（`.module.css`），善用 Infima CSS 變數（`var(--ifm-*)`）
- 元件樣式需支援 dark/light mode 和 RWD
- 內容以繁體中文為預設語言撰寫，技術專有名詞保持英文
- i18n footer.json 不要放 copyright key，讓 config 動態產生年份
- 套件管理使用 bun，不用 yarn

## User Preferences

- 保留首頁幽默短語（rotating titles/subtitles + 三張哲學卡片），這是個人風格
- 對 AI 生成文案很敏感，寫文字時避免公式化、行銷感的語氣
- 不要過度包裝自己的頭銜或能力（不自稱顧問等）
- 目標：Frontend Engineer → Software / Product Engineer（一年內轉型）

## Current Status

- 首頁：Hero + 哲學卡片 + CTA，已完成 i18n
- About：ProfileHeader + Expertise + WorkWithMe，已完成 i18n
- Pillars 區塊暫時移除，等內容方向確定後加回
- About 敘事段落暫時移除，履歷內已夠多
- Navbar 重組：已完成，Notes 改為 dropdown（Knowledge / Experience / Coding 三個入口）
- Sidebar 重組：已完成，拆成 3 個獨立 sidebar，LeetCode 併入 Coding
- Sidebar 翻譯：已完成，category label 全 10 語系翻譯 + 清除 206 個歷史殘留 key
- Theme 翻譯：已補齊全 10 語系的 `code.json`、`current.json`、`footer.json`
- i18n 審計（2026/02/18）：全 9 語系 docs 89/89 = 100%、code.json 全數翻譯完成、修正中文殘留 bug
- docs/en 英文化修復（2026/02/18）：Batch 1-9 全數完成（89/89），defaultLocale `en` 已改為英文內容，並完成全語系 build 驗證與抽查
- Blog：layoff-negotiation-playbook 已完成全 10 語系（2025/12/25）
