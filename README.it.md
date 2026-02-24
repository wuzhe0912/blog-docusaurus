# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Blog personale e knowledge base costruito con Docusaurus.

[Visita il sito](https://pitt-wu-blog.vercel.app/)

## Stack tecnologico

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Ricerca: [Algolia DocSearch](https://docsearch.algolia.com/)
- Deployment: [Vercel](https://vercel.com/)
- Gestore pacchetti: [Bun](https://bun.sh/)
- Node.js >= 22 (tramite `.nvmrc`)

## Struttura del progetto

```
├── blog/              # Articoli del blog
├── docs/              # Note tecniche
│   ├── Knowledge/     #   Fondamenti frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Preparazione colloqui e note di carriera
│   ├── Coding/        #   Esercizi di programmazione
│   └── LeetCode/      #   Soluzioni LeetCode
├── src/
│   ├── pages/         #   Pagine personalizzate (Home, About, Projects)
│   ├── components/    #   Componenti React
│   └── css/           #   Stili globali (CSS Modules + Infima)
├── sidebar/           # Configurazione modulare della sidebar
├── i18n/              # File di traduzione (13 lingue)
└── static/img/        # Risorse statiche
```

## Internazionalizzazione

Supporta 13 lingue — `en` (predefinito), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Per iniziare

```bash
# Installare le dipendenze
bun install

# Avviare il server di sviluppo (predefinito: port 3010)
bun run dev

# Avviare con una lingua specifica
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build
bun run build

# Anteprima locale del build di produzione
bun run serve
```
