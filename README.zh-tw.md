# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md)

以 Docusaurus 打造的個人部落格與知識庫。

[線上網站](https://pitt-wu-blog.vercel.app/)

## 技術架構

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- 搜尋：[Algolia DocSearch](https://docsearch.algolia.com/)
- 部署：[Vercel](https://vercel.com/)
- 套件管理：[Bun](https://bun.sh/)
- Node.js >= 22（透過 `.nvmrc` 設定）

## 專案結構

```
├── blog/              # 部落格文章
├── docs/              # 技術筆記
│   ├── Knowledge/     #   前端基礎（JS、TS、CSS、Vue、React…）
│   ├── Experience/    #   面試準備與職涯筆記
│   ├── Coding/        #   程式練習題
│   └── LeetCode/      #   LeetCode 解題
├── src/
│   ├── pages/         #   自訂頁面（首頁、About、Projects）
│   ├── components/    #   React 元件
│   └── css/           #   全域樣式（CSS Modules + Infima）
├── sidebar/           # 模組化側邊欄設定
├── i18n/              # 翻譯檔（10 語系）
└── static/img/        # 靜態資源
```

## 多語系

支援 10 個語系 — `en`（預設）、`zh-tw`、`zh-cn`、`ja`、`ko`、`es`、`pt-BR`、`de`、`fr`、`vi`。

## 快速開始

```bash
# 安裝依賴
bun install

# 啟動開發伺服器（預設 port 3010）
bun run dev

# 以特定語系啟動
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# 建置
bun run build

# 本地預覽 production build
bun run serve
```
