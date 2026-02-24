# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](../README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md)

Blog pribadi dan basis pengetahuan yang dibangun dengan Docusaurus.

[Kunjungi Situs](https://pitt-wu-blog.vercel.app/)

## Stack Teknologi

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Pencarian: [Algolia DocSearch](https://docsearch.algolia.com/)
- Deployment: [Vercel](https://vercel.com/)
- Manajer paket: [Bun](https://bun.sh/)
- Node.js >= 22 (melalui `.nvmrc`)

## Struktur Proyek

```
├── blog/              # Artikel blog
├── docs/              # Catatan teknis
│   ├── Knowledge/     #   Dasar-dasar frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Persiapan wawancara & catatan karier
│   ├── Coding/        #   Latihan pemrograman
│   └── LeetCode/      #   Solusi LeetCode
├── src/
│   ├── pages/         #   Halaman kustom (Beranda, About, Projects)
│   ├── components/    #   Komponen React
│   └── css/           #   Style global (CSS Modules + Infima)
├── sidebar/           # Konfigurasi sidebar modular
├── i18n/              # File terjemahan (13 bahasa)
└── static/img/        # Aset statis
```

## Internasionalisasi

Mendukung 13 bahasa — `en` (default), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Memulai

```bash
# Instal dependensi
bun install

# Jalankan server pengembangan (default: port 3010)
bun run dev

# Jalankan dengan bahasa tertentu
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build
bun run build

# Pratinjau production build secara lokal
bun run serve
```
