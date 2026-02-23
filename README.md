# Pitt Wu's Story

[![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md)

Personal blog and knowledge base built with Docusaurus.

[Live Site](https://pitt-wu-blog.vercel.app/)

## Tech Stack

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Search: [Algolia DocSearch](https://docsearch.algolia.com/)
- Deployment: [Vercel](https://vercel.com/)
- Package Manager: [Bun](https://bun.sh/)
- Node.js >= 22 (via `.nvmrc`)

## Project Structure

```
├── blog/              # Blog posts
├── docs/              # Technical notes
│   ├── Knowledge/     #   Frontend fundamentals (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Interview prep & career notes
│   ├── Coding/        #   Coding challenges
│   └── LeetCode/      #   LeetCode solutions
├── src/
│   ├── pages/         #   Custom pages (Home, About, Projects)
│   ├── components/    #   React components
│   └── css/           #   Global styles (CSS Modules + Infima)
├── sidebar/           # Modular sidebar configs
├── i18n/              # Translations (10 locales)
└── static/img/        # Static assets
```

## i18n

Supports 10 locales — `en` (default), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`.

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server (default: port 3010)
bun run dev

# Start with a specific locale
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build
bun run build

# Serve production build locally
bun run serve
```
