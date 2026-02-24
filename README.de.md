# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Persönlicher Blog und Wissensdatenbank, erstellt mit Docusaurus.

[Zur Website](https://pitt-wu-blog.vercel.app/)

## Tech-Stack

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Suche: [Algolia DocSearch](https://docsearch.algolia.com/)
- Deployment: [Vercel](https://vercel.com/)
- Paketmanager: [Bun](https://bun.sh/)
- Node.js >= 22 (über `.nvmrc`)

## Projektstruktur

```
├── blog/              # Blogartikel
├── docs/              # Technische Notizen
│   ├── Knowledge/     #   Frontend-Grundlagen (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Interviewvorbereitung & Karrierenotizen
│   ├── Coding/        #   Programmierübungen
│   └── LeetCode/      #   LeetCode-Lösungen
├── src/
│   ├── pages/         #   Benutzerdefinierte Seiten (Home, About, Projects)
│   ├── components/    #   React-Komponenten
│   └── css/           #   Globale Styles (CSS Modules + Infima)
├── sidebar/           # Modulare Sidebar-Konfiguration
├── i18n/              # Übersetzungsdateien (13 Sprachen)
└── static/img/        # Statische Ressourcen
```

## Mehrsprachigkeit

Unterstützt 13 Sprachen — `en` (Standard), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Erste Schritte

```bash
# Abhängigkeiten installieren
bun install

# Entwicklungsserver starten (Standard: Port 3010)
bun run dev

# Mit einer bestimmten Sprache starten
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build erstellen
bun run build

# Production-Build lokal ansehen
bun run serve
```
