# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md)

Blog pessoal e base de conhecimento construído com Docusaurus.

[Site ao vivo](https://pitt-wu-blog.vercel.app/)

## Stack tecnológico

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Busca: [Algolia DocSearch](https://docsearch.algolia.com/)
- Deploy: [Vercel](https://vercel.com/)
- Gerenciador de pacotes: [Bun](https://bun.sh/)
- Node.js >= 22 (via `.nvmrc`)

## Estrutura do projeto

```
├── blog/              # Posts do blog
├── docs/              # Notas técnicas
│   ├── Knowledge/     #   Fundamentos frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Preparação para entrevistas e notas de carreira
│   ├── Coding/        #   Exercícios de programação
│   └── LeetCode/      #   Soluções LeetCode
├── src/
│   ├── pages/         #   Páginas personalizadas (Home, About, Projects)
│   ├── components/    #   Componentes React
│   └── css/           #   Estilos globais (CSS Modules + Infima)
├── sidebar/           # Configuração modular do sidebar
├── i18n/              # Arquivos de tradução (10 idiomas)
└── static/img/        # Recursos estáticos
```

## Internacionalização

Suporte a 10 idiomas — `en` (padrão), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`.

## Primeiros passos

```bash
# Instalar dependências
bun install

# Iniciar servidor de desenvolvimento (padrão: port 3010)
bun run dev

# Iniciar com um idioma específico
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Build
bun run build

# Visualizar build de produção localmente
bun run serve
```
