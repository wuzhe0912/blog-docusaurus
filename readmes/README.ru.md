# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](../README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Персональный блог и база знаний, созданный с помощью Docusaurus.

[Перейти на сайт](https://pitt-wu-blog.vercel.app/)

## Технологический стек

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Поиск: [Algolia DocSearch](https://docsearch.algolia.com/)
- Развёртывание: [Vercel](https://vercel.com/)
- Менеджер пакетов: [Bun](https://bun.sh/)
- Node.js >= 22 (через `.nvmrc`)

## Структура проекта

```
├── blog/              # Статьи блога
├── docs/              # Технические заметки
│   ├── Knowledge/     #   Основы frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Подготовка к собеседованиям и карьерные заметки
│   ├── Coding/        #   Задачи по программированию
│   └── LeetCode/      #   Решения LeetCode
├── src/
│   ├── pages/         #   Пользовательские страницы (Главная, About, Projects)
│   ├── components/    #   Компоненты React
│   └── css/           #   Глобальные стили (CSS Modules + Infima)
├── sidebar/           # Модульная конфигурация sidebar
├── i18n/              # Файлы переводов (13 языков)
└── static/img/        # Статические ресурсы
```

## Интернационализация

Поддержка 13 языков — `en` (по умолчанию), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Начало работы

```bash
# Установить зависимости
bun install

# Запустить сервер разработки (по умолчанию: port 3010)
bun run dev

# Запустить с определённым языком
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Сборка
bun run build

# Локальный просмотр production build
bun run serve
```
