---
title: '[Lv2] Funcionalidades do Nuxt 3 Server: Server Routes e Sitemap dinamico'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Dominar as funcionalidades do Nitro Server Engine do Nuxt 3, implementar Server Routes (API Routes), Sitemap dinamico e Robots.txt para melhorar o SEO e a flexibilidade arquitetural do site.

---

## 1. Pontos-chave de resposta em entrevista

1.  **Server Routes (API Routes)**: Usar `server/api` ou `server/routes` para construir logica backend. Comumente usado para ocultar API Keys, tratar CORS, arquitetura BFF (Backend for Frontend).
2.  **Sitemap dinamico**: Geracao dinamica de XML via Server Routes (`server/routes/sitemap.xml.ts`), garantindo que os motores de busca possam indexar o conteudo mais recente.
3.  **Robots.txt**: Igualmente gerado dinamicamente via Server Routes ou configurado via Nuxt Config, para controlar as permissoes de acesso dos crawlers.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 O que e o Nitro?

Nitro e o novo motor de servidor do Nuxt 3, que permite implantar aplicacoes Nuxt em qualquer lugar (Universal Deployment). Nao e apenas um servidor, mas uma poderosa ferramenta de build e runtime.

### 2.2 Caracteristicas principais do Nitro

1.  **Implantacao multiplataforma (Universal Deployment)**:
    Pode ser compilado para Node.js server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers e outros formatos. Implantacao zero-config nas principais plataformas.

2.  **Leve e rapido (Lightweight & Fast)**:
    Tempo de cold start extremamente curto e bundle size gerado muito pequeno (minimo < 1MB).

3.  **Divisao automatica de codigo (Auto Code Splitting)**:
    Analisa automaticamente as dependencias dos Server Routes e realiza code splitting para garantir velocidade de inicializacao.

4.  **HMR (Hot Module Replacement)**:
    Nao apenas o frontend tem HMR, o Nitro permite que o desenvolvimento de API backend tambem tenha HMR. Modificacao de arquivos `server/` sem reiniciar o servidor.

5.  **Storage Layer (Unstorage)**:
    API de Storage unificada integrada, permitindo conexao facil com Redis, GitHub, FS, Memory e outras interfaces de armazenamento.

6.  **Server Assets**:
    Acesso conveniente a arquivos de recursos estaticos no Server.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 O que sao Server Routes?

O Nuxt 3 tem integrado o motor de servidor **Nitro**, permitindo que desenvolvedores escrevam APIs backend diretamente no projeto. Esses arquivos sao colocados nos diretorios `server/api` ou `server/routes` e sao automaticamente mapeados como endpoints de API.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 Em quais situacoes sao usados? (Pergunta comum de entrevista)

**1. Ocultar informacoes sensiveis (Secret Management)**
O frontend nao pode armazenar Private API Keys com seguranca. Usando Server Routes como intermediario, e possivel acessar a Key via variaveis de ambiente no Server, retornando apenas o resultado ao frontend.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key so e usada no Server, nao e exposta ao Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. Tratamento de problemas CORS (Proxy)**
Quando uma API externa nao suporta CORS, Server Routes podem ser usadas como Proxy. O navegador faz requisicoes ao Nuxt Server (mesma origem), o Nuxt Server faz requisicoes a API externa (sem restricoes CORS).

**3. Backend for Frontend (BFF)**
Agregar, filtrar ou converter o formato dos dados de multiplas APIs backend no Nuxt Server, retornando tudo de uma vez ao frontend. Reduz o numero de requisicoes do frontend e o tamanho do Payload.

**4. Tratamento de Webhooks**
Receber notificacoes Webhook de servicos de terceiros (como pagamentos, CMS).

---

## 4. Implementacao de Sitemap dinamico

### 3.1 Por que um Sitemap dinamico e necessario?

Para sites com conteudo que muda frequentemente (como e-commerce, sites de noticias), um `sitemap.xml` gerado estaticamente se torna obsoleto rapidamente. Usando Server Routes, o Sitemap mais recente pode ser gerado dinamicamente a cada requisicao.

### 3.2 Metodo de implementacao: Geracao manual

Criar `server/routes/sitemap.xml.ts`:

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. Obter todos os dados de rotas dinamicas do banco de dados ou API
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. Adicionar paginas estaticas
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. Adicionar paginas dinamicas
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Definir Header e retornar XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 Metodo de implementacao: Usando modulo (`@nuxtjs/sitemap`)

Para requisitos padrao, o uso do modulo oficial e recomendado:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // Especificar uma API para fornecer a lista de URLs dinamicas
    ],
  },
});
```

---

## 5. Implementacao de Robots.txt dinamico

### 4.1 Metodo de implementacao

Criar `server/routes/robots.txt.ts`:

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // Determinar regras dinamicamente de acordo com o ambiente
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // Proibir indexacao em ambientes nao-producao

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. Pontos-chave para entrevista

### 5.1 Nitro Engine & Server Routes

**Q: Qual e o server engine do Nuxt 3? Quais sao as caracteristicas do Nitro?**

> **Exemplo de resposta:**
> O server engine do Nuxt 3 chama-se **Nitro**.
> Sua maior caracteristica e o **Universal Deployment**, ou seja, pode ser implantado sem configuracao em qualquer ambiente (Node.js, Vercel, AWS Lambda, Edge Workers, etc.).
> Outras caracteristicas incluem: **HMR** para APIs backend (sem reinicio ao modificar), **Auto Code Splitting** (acelerando a velocidade de inicializacao) e um **Storage Layer** integrado (conexao facil com Redis ou KV Storage).

**Q: O que sao os Server Routes do Nuxt 3? Voce ja os implementou?**

> **Exemplo de resposta:**
> Sim, ja implementei. Server Routes sao funcionalidades backend fornecidas pelo Nuxt 3 atraves do motor Nitro, colocadas no diretorio `server/api`.
> Eu os usei principalmente nestes cenarios:
>
> 1.  **Ocultar API Keys**: Ao integrar servicos de terceiros, evitando expor Secret Keys no codigo frontend.
> 2.  **CORS Proxy**: Resolvendo problemas de requisicoes cross-origin.
> 3.  **BFF (Backend for Frontend)**: Consolidando multiplas requisicoes API em uma, reduzindo requisicoes do frontend e otimizando a estrutura de dados.

### 5.2 Sitemap e Robots.txt

**Q: Como implementar sitemap e robots.txt dinamicos no Nuxt 3?**

> **Exemplo de resposta:**
> Eu usaria os Server Routes do Nuxt para implementa-los.
> Para o **Sitemap**, eu criaria `server/routes/sitemap.xml.ts`, chamando a API backend para obter a lista mais recente de artigos ou produtos, usando o pacote `sitemap` para gerar a string XML e retorna-la. Isso garante que os motores de busca obtenham os links mais recentes em cada crawl.
> Para o **Robots.txt**, eu criaria `server/routes/robots.txt.ts`, retornando dinamicamente regras diferentes conforme as variaveis de ambiente (Production ou Staging), por exemplo, configurando `Disallow: /` no ambiente Staging para prevenir indexacao.

### 5.3 SEO Meta Tags (complemento)

**Q: Como voce trata os SEO meta tags no Nuxt 3? Ja usou useHead ou useSeoMeta?**

> **Exemplo de resposta:**
> Uso principalmente os Composables `useHead` e `useSeoMeta` integrados no Nuxt 3.
> `useHead` me permite definir tags `title`, `meta`, `link`, etc. Para configuracao SEO pura, prefiro usar `useSeoMeta` porque sua sintaxe e mais concisa e Type-safe (dicas de tipo), como definir diretamente propriedades `ogTitle`, `description`, etc.
> Em paginas dinamicas (como paginas de produtos), passo uma Getter Function (por exemplo `title: () => product.value.name`), para que os Meta Tags se atualizem reativamente quando os dados mudam.

---

## 7. Referencias relacionadas

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
