# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Blog cá nhân và kho kiến thức được xây dựng bằng Docusaurus.

[Xem trang web](https://pitt-wu-blog.vercel.app/)

## Công nghệ sử dụng

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Tìm kiếm: [Algolia DocSearch](https://docsearch.algolia.com/)
- Triển khai: [Vercel](https://vercel.com/)
- Quản lý gói: [Bun](https://bun.sh/)
- Node.js >= 22 (qua `.nvmrc`)

## Cấu trúc dự án

```
├── blog/              # Bài viết blog
├── docs/              # Ghi chú kỹ thuật
│   ├── Knowledge/     #   Nền tảng frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Chuẩn bị phỏng vấn & ghi chú nghề nghiệp
│   ├── Coding/        #   Bài tập lập trình
│   └── LeetCode/      #   Lời giải LeetCode
├── src/
│   ├── pages/         #   Trang tùy chỉnh (Trang chủ, About, Projects)
│   ├── components/    #   React components
│   └── css/           #   Style toàn cục (CSS Modules + Infima)
├── sidebar/           # Cấu hình sidebar dạng module
├── i18n/              # File dịch (13 ngôn ngữ)
└── static/img/        # Tài nguyên tĩnh
```

## Đa ngôn ngữ

Hỗ trợ 13 ngôn ngữ — `en` (mặc định), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Bắt đầu

```bash
# Cài đặt dependencies
bun install

# Khởi động server phát triển (mặc định: port 3010)
bun run dev

# Khởi động với ngôn ngữ cụ thể
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build
bun run build

# Xem trước production build tại local
bun run serve
```
