# Pitt Wu's Story

[![en](https://img.shields.io/badge/English-grey?style=flat-square)](./README.md) [![zh-TW](https://img.shields.io/badge/繁體中文-grey?style=flat-square)](./README.zh-tw.md) [![zh-CN](https://img.shields.io/badge/简体中文-grey?style=flat-square)](./README.zh-cn.md) [![ja](https://img.shields.io/badge/日本語-grey?style=flat-square)](./README.ja.md) [![es](https://img.shields.io/badge/Español-grey?style=flat-square)](./README.es.md) [![pt-BR](https://img.shields.io/badge/Português-grey?style=flat-square)](./README.pt-BR.md) [![de](https://img.shields.io/badge/Deutsch-grey?style=flat-square)](./README.de.md) [![fr](https://img.shields.io/badge/Français-grey?style=flat-square)](./README.fr.md) [![vi](https://img.shields.io/badge/Tiếng_Việt-grey?style=flat-square)](./README.vi.md) [![it](https://img.shields.io/badge/Italiano-grey?style=flat-square)](./README.it.md) [![ru](https://img.shields.io/badge/Русский-grey?style=flat-square)](./README.ru.md) [![id](https://img.shields.io/badge/Bahasa_Indonesia-grey?style=flat-square)](./README.id.md)

Docusaurus로 만든 개인 블로그 및 지식 저장소.

[사이트 보기](https://pitt-wu-blog.vercel.app/)

## 기술 스택

- [Docusaurus 3](https://docusaurus.io/) + React 18 + MDX
- 검색: [Algolia DocSearch](https://docsearch.algolia.com/)
- 배포: [Vercel](https://vercel.com/)
- 패키지 매니저: [Bun](https://bun.sh/)
- Node.js >= 22 (`.nvmrc`로 설정)

## 프로젝트 구조

```
├── blog/              # 블로그 글
├── docs/              # 기술 노트
│   ├── Knowledge/     #   프론트엔드 기초 (JS, TS, CSS, Vue, React…)
│   ├── Experience/    #   면접 준비 & 커리어 노트
│   ├── Coding/        #   코딩 연습
│   └── LeetCode/      #   LeetCode 풀이
├── src/
│   ├── pages/         #   커스텀 페이지 (홈, About, Projects)
│   ├── components/    #   React 컴포넌트
│   └── css/           #   전역 스타일 (CSS Modules + Infima)
├── sidebar/           # 모듈식 사이드바 설정
├── i18n/              # 번역 파일 (13개 언어)
└── static/img/        # 정적 리소스
```

## 다국어 지원

13개 언어 지원 — `en` (기본), `zh-tw`, `zh-cn`, `ja`, `ko`, `es`, `pt-BR`, `de`, `fr`, `vi`, `it`, `ru`, `id`.

## 시작하기

```bash
# 의존성 설치
bun install

# 개발 서버 시작 (기본: port 3010)
bun run dev

# 특정 언어로 시작
bun run dev:tw    # 繁體中文
bun run dev:ja    # 日本語

# 빌드
bun run build

# production build 로컬 미리보기
bun run serve
```
