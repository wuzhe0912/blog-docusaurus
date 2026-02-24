# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](../README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![ko](https://img.shields.io/badge/한국어-grey?style=flat-square)](./README.ko.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Blog personal y base de conocimiento construido con Docusaurus.

[Sitio en vivo](https://pitt-wu-blog.vercel.app/)

## Stack tecnológico

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- Búsqueda: [Algolia DocSearch](https://docsearch.algolia.com/)
- Despliegue: [Vercel](https://vercel.com/)
- Gestor de paquetes: [Bun](https://bun.sh/)
- Node.js >= 22 (vía `.nvmrc`)

## Estructura del proyecto

```
├── blog/              # Artículos del blog
├── docs/              # Notas técnicas
│   ├── Knowledge/     #   Fundamentos frontend (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   Preparación de entrevistas y notas de carrera
│   ├── Coding/        #   Ejercicios de programación
│   └── LeetCode/      #   Soluciones de LeetCode
├── src/
│   ├── pages/         #   Páginas personalizadas (Inicio, About, Projects)
│   ├── components/    #   Componentes React
│   └── css/           #   Estilos globales (CSS Modules + Infima)
├── sidebar/           # Configuración modular del sidebar
├── i18n/              # Archivos de traducción (13 idiomas)
└── static/img/        # Recursos estáticos
```

## Internacionalización

Compatible con 13 idiomas — `en` (predeterminado), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## Primeros pasos

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo (predeterminado: port 3010)
bun run dev

# Iniciar con un idioma específico
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# Compilar
bun run build

# Vista previa local del build de producción
bun run serve
```
