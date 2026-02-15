---
title: '[Lv3] Otimizacao de performance no Nuxt 3: Bundle Size, velocidade SSR e otimizacao de imagens'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Guia completo de otimizacao de performance no Nuxt 3: desde reducao de Bundle Size, otimizacao de velocidade SSR ate estrategias de carregamento de imagens, criando uma experiencia de performance maxima.

---

## 1. Eixo principal da resposta na entrevista

1. **Otimizacao de Bundle Size**: analise (`nuxi analyze`), divisao (`SplitChunks`), Tree Shaking, Lazy Loading.
2. **Otimizacao de velocidade SSR (TTFB)**: cache Redis, Nitro Cache, reducao de chamadas API bloqueantes, Streaming SSR.
3. **Otimizacao de imagens**: `@nuxt/image`, formato WebP, CDN, Lazy Loading.
4. **Otimizacao de grandes volumes de dados**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Como reduzir o Bundle Size do Nuxt 3?

### 2.1 Ferramentas de diagnostico

Primeiro, e necessario saber onde esta o gargalo. Use `nuxi analyze` para visualizar a estrutura do Bundle.

```bash
npx nuxi analyze
```

Isso gera um relatorio mostrando quais pacotes ocupam mais espaco.

### 2.2 Estrategias de otimizacao

#### 1. Code Splitting (divisao de codigo)
O Nuxt 3 ja faz Code Splitting baseado em rotas (Route-based) por padrao. Mas para pacotes grandes (como ECharts, Lodash), precisamos otimizar manualmente.

**Configuracao do Nuxt (Vite/Webpack):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Dividir pacotes grandes de node_modules
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('echarts')) return 'echarts';
            }
          },
        },
      },
    },
  },
});
```

#### 2. Tree Shaking e importacao sob demanda
Garanta que apenas os modulos necessarios sejam importados, nao o pacote inteiro.

```typescript
// Errado: importar todo o lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// Correto: importar apenas debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// Recomendado: usar vueuse (especifico para Vue e tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading de componentes
Para componentes nao necessarios na primeira tela, use o prefixo `Lazy` para importacao dinamica.

```vue
<template>
  <div>
    <!-- O codigo do componente so sera carregado quando show for true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Remover pacotes desnecessarios do Server-side
Garanta que pacotes usados apenas no Server (como drivers de banco de dados, operacoes de fs) nao sejam empacotados no Client. O Nuxt 3 trata automaticamente arquivos terminados em `.server.ts`, ou use o diretorio `server/`.

---

## 3. Como otimizar a velocidade SSR (TTFB)?

### 3.1 Por que o TTFB e tao longo?
TTFB (Time To First Byte) e o indicador-chave de performance SSR. As causas comuns de TTFB longo sao:
1. **API lenta**: o Server precisa esperar a resposta da API do back-end antes de renderizar o HTML.
2. **Requisicoes sequenciais**: multiplas requisicoes de API executadas em serie, nao em paralelo.
3. **Computacao pesada**: o Server executa muitas tarefas CPU-intensive.

### 3.2 Solucoes de otimizacao

#### 1. Server-Side Caching (Nitro Cache)
Use a funcionalidade de cache do Nitro para armazenar respostas de API ou resultados de renderizacao.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Pagina inicial com cache de 1 hora (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // Paginas de produtos com cache de 10 minutos
    '/products/**': { swr: 600 },
    // Cache de API
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. Requisicoes em paralelo (Parallel Fetching)
Use `Promise.all` para enviar multiplas requisicoes em paralelo, em vez de `await` uma apos a outra.

```typescript
// Lento: execucao sequencial (tempo total = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// Rapido: execucao paralela (tempo total = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Adiamento de dados nao criticos (Lazy Fetching)
Dados nao necessarios na primeira tela podem ser carregados no Client (`lazy: true`), evitando bloqueio do SSR.

```typescript
// Dados de comentarios nao precisam de SEO, podem ser carregados no Client
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // Nem mesmo executar no Server
});
```

#### 4. Streaming SSR (experimental)
O Nuxt 3 suporta HTML Streaming, permitindo renderizar e enviar simultaneamente para que o usuario veja o conteudo mais rapido.

---

## 4. Otimizacao de imagens no Nuxt 3

### 4.1 Usando @nuxt/image
O modulo oficial `@nuxt/image` e a melhor solucao, oferecendo:
- **Conversao automatica de formato**: automaticamente para WebP/AVIF.
- **Redimensionamento automatico**: gera imagens no tamanho adequado conforme a tela.
- **Lazy Loading**: lazy loading integrado.
- **Integracao CDN**: suporta Cloudinary, Imgix e outros Providers.

### 4.2 Exemplo de implementacao

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // Opcoes padrao
    format: ['webp'],
  },
});
```

```vue
<template>
  <!-- Converte automaticamente para webp, largura 300px, com lazy load ativado -->
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    width="300"
    loading="lazy"
    placeholder
  />
</template>
```

---

## 5. Paginacao e rolagem para grandes volumes de dados

### 5.1 Selecao de solucao
Para grandes volumes de dados (ex: 10.000 produtos), existem tres estrategias principais, considerando **SEO**:

| Estrategia | Cenario adequado | Compatibilidade com SEO |
| :--- | :--- | :--- |
| **Paginacao tradicional (Pagination)** | Listas de e-commerce, listas de artigos | Excelente (melhor) |
| **Scroll infinito (Infinite Scroll)** | Feeds sociais, galerias de fotos | Baixa (requer tratamento especial) |
| **Virtual Scroll** | Relatorios complexos, listas muito longas | Muito baixa (conteudo nao esta no DOM) |

### 5.2 Como manter SEO com scroll infinito?
Com scroll infinito, motores de busca geralmente rastreiam apenas a primeira pagina. Solucoes:
1. **Combinar com paginacao**: fornecer tags `<link rel="next" href="...">` para que os crawlers saibam que ha proxima pagina.
2. **Noscript Fallback**: fornecer uma versao de paginacao tradicional em `<noscript>` para crawlers.
3. **Botao "Carregar mais"**: SSR renderiza os primeiros 20 registros; cliques subsequentes em "Carregar mais" ou rolagem acionam Client-side fetch.

### 5.3 Exemplo de implementacao (Load More + SEO)

```vue
<script setup>
// Dados da primeira tela (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Carregar mais no Client
const loadMore = async () => {
  page.value++;
  const newPosts = await $fetch('/api/posts', {
      query: { page: page.value }
  });
  posts.value.push(...newPosts);
};
</script>

<template>
  <div>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
    <button @click="loadMore">Carregar mais</button>

    <!-- Otimizacao SEO: informar crawlers sobre proxima pagina -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. Lazy Loading em ambiente SSR

### 6.1 Descricao do problema
Em ambiente SSR, se usar `IntersectionObserver` para implementar Lazy Loading, como o Server nao possui `window` ou `document`, isso causara erros ou Hydration Mismatch.

### 6.2 Solucoes

#### 1. Usar componentes nativos do Nuxt
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Diretiva personalizada (com tratamento SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // Executar apenas no Client
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Renderizar placeholder ou imagem original no Server (conforme necessidade de SEO)
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. Monitoramento e rastreamento de performance SSR

### 7.1 Por que e necessario monitorar?
Os gargalos de performance de aplicacoes SSR geralmente ocorrem no Server, invisivel ao DevTools do navegador. Sem monitoramento, e dificil identificar se API lenta, Memory Leak ou CPU alta sao a causa do TTFB lento.

### 7.2 Ferramentas comuns

1. **Nuxt DevTools (fase de desenvolvimento)**:
   - Integrado ao Nuxt 3.
   - Visualizar tempo de resposta de Server Routes.
   - Preview de **Open Graph** para SEO.
   - Painel **Server Routes** para monitorar tempo de chamadas de API.

2. **Lighthouse / PageSpeed Insights (apos deploy)**:
   - Monitorar Core Web Vitals (LCP, CLS, FID/INP).
   - LCP (Largest Contentful Paint) depende fortemente do TTFB do SSR.

3. **Server-Side Monitoring (APM)**:
   - **Sentry / Datadog**: rastrear erros e performance do Server.
   - **OpenTelemetry**: rastrear o Request Trace completo (Nuxt Server -> API Server -> DB).

### 7.3 Implementacao de rastreamento simples de tempo

No `server/middleware`, voce pode implementar um timer simples:

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);

    // Tambem pode adicionar header Server-Timing para visualizacao no DevTools do navegador
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. Resumo para entrevista

**P: Como rastrear e monitorar problemas de performance SSR?**
> Na fase de desenvolvimento, uso principalmente o **Nuxt DevTools** para verificar tempos de resposta e tamanho do Payload dos Server Routes.
> Em ambiente de producao, acompanho **Core Web Vitals** (especialmente LCP) e **TTFB**.
> Para investigacao profunda de gargalos no Server, uso Server Middleware customizado para registrar tempos de requisicao, envio dos dados via header `Server-Timing` ao navegador, ou integro **Sentry** / **OpenTelemetry** para rastreamento de cadeia completa.

**P: Como reduzir o bundle size do Nuxt 3?**
> Primeiro analiso com `nuxi analyze`. Para pacotes grandes (como lodash), aplico Tree Shaking ou divisao manual (`manualChunks`). Para componentes nao essenciais na primeira tela, uso `<LazyComponent>` para importacao dinamica.

**P: Como otimizar a velocidade SSR?**
> O foco e reduzir o TTFB. Uso `routeRules` do Nitro para configurar Server-side caching (SWR). Requisicoes de API sao paralelizadas com `Promise.all`. Dados nao criticos sao configurados com `lazy: true` para carregamento no Client.

**P: Como fazer otimizacao de imagens?**
> Uso o modulo `@nuxt/image`, que converte automaticamente para WebP, redimensiona automaticamente, e suporta Lazy Loading, reduzindo significativamente o volume de transferencia.

**P: Como manter SEO com scroll infinito?**
> Scroll infinito nao e amigavel para SEO. Se for um site de conteudo, priorizo paginacao tradicional. Se scroll infinito for obrigatorio, renderizo a primeira pagina com SSR e uso Meta Tags (`rel="next"`) para informar crawlers sobre a estrutura de paginacao, ou forneco links de paginacao via Noscript.
