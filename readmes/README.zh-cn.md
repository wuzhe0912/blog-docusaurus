# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](../README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

基于 Docusaurus 构建的个人博客与知识库。

[在线网站](https://pitt-wu-blog.vercel.app/)

## 技术架构

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- 搜索：[Algolia DocSearch](https://docsearch.algolia.com/)
- 部署：[Vercel](https://vercel.com/)
- 包管理器：[Bun](https://bun.sh/)
- Node.js >= 22（通过 `.nvmrc` 配置）

## 项目结构

```
├── blog/              # 博客文章
├── docs/              # 技术笔记
│   ├── Knowledge/     #   前端基础（JS、TS、CSS、Vue、React…）
│   ├── Experience/    #   面试准备与职业笔记
│   ├── Coding/        #   编程练习题
│   └── LeetCode/      #   LeetCode 题解
├── src/
│   ├── pages/         #   自定义页面（首页、About、Projects）
│   ├── components/    #   React 组件
│   └── css/           #   全局样式（CSS Modules + Infima）
├── sidebar/           # 模块化侧边栏配置
├── i18n/              # 翻译文件（13 语种）
└── static/img/        # 静态资源
```

## 多语言

支持 13 个语种 — `en`（默认）、`zh-tw`、`zh-cn`、`ja`、`ko`、`es`、`pt-BR`、`de`、`fr`、`vi`、`it`、`ru`、`id`。

## 快速开始

```bash
# 安装依赖
bun install

# 启动开发服务器（默认 port 3010）
bun run dev

# 以特定语种启动
bun run dev:tw    # 繁体中文
bun run dev:ja    # 日本語

# 构建
bun run build

# 本地预览 production build
bun run serve
```
