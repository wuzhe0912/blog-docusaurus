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
- 預設語言：繁體中文（zh-tw）
- 預設主題：Dark mode
- 部署：Vercel
- 搜尋：Algolia

## Project Structure

- `src/pages/` — 自訂頁面（首頁、About）
- `src/components/` — React 元件
- `src/css/custom.css` — 全域樣式
- `docs/` — 技術文件（Knowledge、Experience、Coding、LeetCode、AI、ShowCase）
- `blog/` — 個人部落格文章
- `sidebar/` — 模組化側邊欄設定
- `static/img/` — 靜態資源

## i18n（國際化）

支援 6 個語系，所有新增內容和 UI 都必須完整支援全語系：

| Locale  | 語言             |
| ------- | ---------------- |
| `zh-tw` | 繁體中文（預設） |
| `zh-cn` | 簡體中文         |
| `en`    | English          |
| `ja`    | 日本語           |
| `ko`    | 한국어           |
| `es`    | Español          |

### 規則

- **UI 文字**：所有 UI 介面文字必須使用 `<Translate>` 元件或 `translate()` 函式，並在 `i18n/{locale}/` 下提供對應翻譯
- **文件/文章**：新增 docs 或 blog 時，必須在 `i18n/{locale}/docusaurus-plugin-content-docs/` 和 `i18n/{locale}/docusaurus-plugin-content-blog/` 下提供翻譯版本
- **頁面**：自訂頁面（src/pages）中的靜態文字使用 `<Translate>` 包裹
- **預設語言**：zh-tw 為預設，內容先以繁體中文撰寫，再產出其他語系翻譯
- **技術名詞**：技術專有名詞各語系均保持英文原文（如 SSR、Hydration、Bundle）

## Conventions

- CSS 使用 CSS Modules（`.module.css`），善用 Infima CSS 變數（`var(--ifm-*)`）
- 元件樣式需支援 dark/light mode 和 RWD
- 內容以繁體中文為預設語言撰寫，技術專有名詞保持英文
