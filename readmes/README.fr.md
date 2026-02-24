# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](../README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Blog personnel et base de connaissances construit avec Docusaurus.

[Voir le site](https://pitt-wu-blog.vercel.app/)

## Stack technique

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Recherche : [Algolia DocSearch](https://docsearch.algolia.com/)
- Déploiement : [Vercel](https://vercel.com/)
- Gestionnaire de paquets : [Bun](https://bun.sh/)
- Node.js >= 22 (via `.nvmrc`)

## Structure du projet

```
├── blog/              # Articles de blog
├── docs/              # Notes techniques
│   ├── Knowledge/     #   Fondamentaux frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Préparation d'entretiens et notes de carrière
│   ├── Coding/        #   Exercices de programmation
│   └── LeetCode/      #   Solutions LeetCode
├── src/
│   ├── pages/         #   Pages personnalisées (Accueil, About, Projects)
│   ├── components/    #   Composants React
│   └── css/           #   Styles globaux (CSS Modules + Infima)
├── sidebar/           # Configuration modulaire du sidebar
├── i18n/              # Fichiers de traduction (13 langues)
└── static/img/        # Ressources statiques
```

## Internationalisation

Prise en charge de 13 langues — `en` (par défaut), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Pour commencer

```bash
# Installer les dépendances
bun install

# Démarrer le serveur de développement (par défaut : port 3010)
bun run dev

# Démarrer avec une langue spécifique
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build
bun run build

# Prévisualiser le build de production en local
bun run serve
```
