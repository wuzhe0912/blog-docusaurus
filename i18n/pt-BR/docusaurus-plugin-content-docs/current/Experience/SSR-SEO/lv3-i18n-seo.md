---
title: '[Lv3] Nuxt 3 Multilinguagem (i18n) e melhores praticas de SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Implementar multilinguagem (Internationalization) sob uma arquitetura SSR nao se resume a traduzir texto, mas envolve tambem estrategias de roteamento, tags SEO (hreflang), gerenciamento de estado e consistencia de Hydration.

---

## 1. Pontos-chave de resposta em entrevista

1.  **Estrategia de roteamento**: Usar a estrategia de prefixo URL do `@nuxtjs/i18n` (como `/en/about`, `/jp/about`) para distinguir idiomas. Isso e o mais favoravel ao SEO.
2.  **Tags SEO**: Garantir a geracao automatica correta de `<link rel="alternate" hreflang="..." />` e Canonical URL, evitando penalidades por conteudo duplicado.
3.  **Gerenciamento de estado**: Detectar corretamente o idioma do usuario na fase SSR (Cookie/Header) e garantir que o idioma seja consistente durante a Hydration do Client.

---

## 2. Estrategia de implementacao i18n do Nuxt 3

### 2.1 Por que escolher `@nuxtjs/i18n`?

O modulo oficial `@nuxtjs/i18n` e baseado no `vue-i18n`, otimizado especificamente para Nuxt. Ele resolve os problemas comuns da implementacao manual de i18n:

- Geracao automatica de rotas com prefixo de idioma (Auto-generated routes).
- Tratamento automatico de SEO Meta Tags (hreflang, og:locale).
- Suporte para Lazy Loading de pacotes de idioma (otimizacao do Bundle Size).

### 2.2 Instalacao e configuracao

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: '繁體中文' },
    ],
    defaultLocale: 'tw',
    lazy: true, // Habilitar Lazy Loading
    langDir: 'locales', // Diretorio de arquivos de idioma
    strategy: 'prefix_and_default', // Estrategia de roteamento chave
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Detectar e redirecionar apenas no caminho raiz
    },
  },
});
```

### 2.3 Estrategia de roteamento (Routing Strategy)

Esta e a chave para o SEO. `@nuxtjs/i18n` oferece varias estrategias:

1.  **prefix_except_default** (recomendado):

    - Idioma padrao (tw) sem prefixo: `example.com/about`
    - Outros idiomas (en) com prefixo: `example.com/en/about`
    - Vantagem: URL limpa, peso SEO concentrado.

2.  **prefix_and_default**:

    - Todos os idiomas com prefixo: `example.com/tw/about`, `example.com/en/about`
    - Vantagem: Estrutura uniforme, facil gerenciamento de redirecionamentos.

3.  **no_prefix** (nao recomendado para SEO):
    - Todos os idiomas com a mesma URL, troca por Cookie.
    - Desvantagem: Motores de busca nao conseguem indexar as diferentes versoes linguisticas.

---

## 3. Implementacao SEO chave

### 3.1 Tag hreflang

Os motores de busca precisam saber "quais versoes linguisticas esta pagina tem". `@nuxtjs/i18n` gera automaticamente no `<head>`:

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Atencao:** `baseUrl` deve ser definido em `nuxt.config.ts`, caso contrario hreflang gerara caminhos relativos (invalidos).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Deve ser definido!
  },
});
```

### 3.2 Canonical URL

Garantir que cada versao linguistica da pagina tenha um Canonical URL apontando para si mesma, evitando ser considerada conteudo duplicado.

### 3.3 Traducao de conteudo dinamico (API)

A API backend tambem precisa suportar multilinguagem. Normalmente, o header `Accept-Language` e incluido nas requisicoes.

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // Enviar idioma atual ao backend
    },
  });
};
```

---

## 4. Desafios comuns e solucoes

### 4.1 Hydration Mismatch

**Problema:** Server detecta ingles e renderiza HTML em ingles; o navegador do Client tem chines como padrao, Vue i18n inicializa em chines, causando cintilacao de tela ou Hydration Error.

**Solucao:**

- Usar a configuracao `detectBrowserLanguage` para que o Client ao inicializar respeite a configuracao da URL ou Cookie, em vez da configuracao do navegador.
- Garantir que a configuracao de `defaultLocale` do Server e Client seja consistente.

### 4.2 Troca de idioma

Usar `switchLocalePath` para gerar links em vez de construir strings manualmente.

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <nav>
    <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="switchLocalePath('tw')">繁體中文</NuxtLink>
  </nav>
</template>
```

---

## 5. Pontos-chave para entrevista

### 5.1 i18n e SEO

**Q: O que observar com multilinguagem (i18n) em um ambiente SSR? Como tratar o SEO?**

> **Exemplo de resposta:**
> Ao fazer i18n em um ambiente SSR, o mais importante e o **SEO** e a **consistencia de Hydration**.
>
> Sobre **SEO**:
>
> 1.  **Estrutura de URL**: Uso a estrategia de "subcaminho" (como `/en/`, `/tw/`), dando a cada idioma uma URL independente para que os motores de busca possam indexar.
> 2.  **hreflang**: E necessario configurar corretamente `<link rel="alternate" hreflang="..." />`, informando ao Google que estas paginas sao versoes linguisticas diferentes do mesmo conteudo, evitando penalidades por conteudo duplicado. Normalmente uso o modulo `@nuxtjs/i18n` para gerar automaticamente essas tags.
>
> Sobre **Hydration**:
> Garantir que o idioma renderizado pelo Server e o idioma inicializado pelo Client sejam consistentes. Configuro a determinacao do idioma a partir do prefixo URL ou Cookie, e adiciono a locale correspondente no header das requisicoes API.

### 5.2 Roteamento e estado

**Q: Como implementar a funcionalidade de troca de idioma?**

> **Exemplo de resposta:**
> Uso o composable `useSwitchLocalePath` fornecido pelo `@nuxtjs/i18n`.
> Ele gera automaticamente a URL do idioma correspondente com base na rota atual (mantendo query parameters), e trata a conversao dos prefixos de rota. Isso evita erros de concatenacao manual de strings, e garante que o usuario permaneca no conteudo da pagina original ao trocar de idioma.

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
