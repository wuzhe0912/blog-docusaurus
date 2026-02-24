# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Docusaurus で構築した個人ブログ＆ナレッジベース。

[サイトを見る](https://pitt-wu-blog.vercel.app/)

## 技術スタック

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- 検索：[Algolia DocSearch](https://docsearch.algolia.com/)
- デプロイ：[Vercel](https://vercel.com/)
- パッケージマネージャー：[Bun](https://bun.sh/)
- Node.js >= 22（`.nvmrc` で指定）

## プロジェクト構成

```
├── blog/              # ブログ記事
├── docs/              # 技術ノート
│   ├── Knowledge/     #   フロントエンド基礎（JS、TS、CSS、Vue、React…）
│   ├── Experience/    #   面接対策・キャリアノート
│   ├── Coding/        #   コーディング練習
│   └── LeetCode/      #   LeetCode 解法
├── src/
│   ├── pages/         #   カスタムページ（ホーム、About、Projects）
│   ├── components/    #   React コンポーネント
│   └── css/           #   グローバルスタイル（CSS Modules + Infima）
├── sidebar/           # モジュール式サイドバー設定
├── i18n/              # 翻訳ファイル（13 言語）
└── static/img/        # 静的アセット
```

## 多言語対応

13 言語をサポート — `en`（デフォルト）、`zh-tw`、`zh-cn`、`ja`、`ko`、`es`、`pt-BR`、`de`、`fr`、`vi`、`it`、`ru`、`id`。

## はじめる

```bash
# 依存関係をインストール
bun install

# 開発サーバーを起動（デフォルト: port 3010）
bun run dev

# 特定の言語で起動
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# ビルド
bun run build

# production build をローカルで確認
bun run serve
```
