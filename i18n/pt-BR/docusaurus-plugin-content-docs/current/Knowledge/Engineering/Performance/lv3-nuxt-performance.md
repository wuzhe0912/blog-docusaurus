---
title: '[Lv3] Otimização de performance no Nuxt 3: Bundle Size, velocidade SSR e otimização de imagens'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Guia completo de otimização de performance no Nuxt 3: desde redução de Bundle Size, otimização de velocidade SSR até estratégias de carregamento de imagens, criando uma experiência de performance máxima.

---

## 1. Eixo principal da resposta na entrevista

1. **Otimização de Bundle Size**: análise (`nuxi analyze`), divisão (`SplitChunks`), Tree Shaking, Lazy Loading.
2. **Otimização de velocidade SSR (TTFB)**: cache Redis, Nitro Cache, redução de chamadas API bloqueantes, Streaming SSR.
3. **Otimização de imagens**: `@nuxt/image`, formato WebP, CDN, Lazy Loading.
4. **Otimização de grandes volumes de dados**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Como reduzir o Bundle Size do Nuxt 3?

### 2.1 Ferramentas de diagnóstico

Primeiro, é necessário saber onde está o gargalo. Use `nuxi analyze` para visualizar a estrutura do Bundle.

```bash
npx nuxi analyze
```

Isso gera um relatório mostrando quais pacotes ocupam mais espaço.

### 2.2 Estratégias de otimização

#### 1. Code Splitting (divisão de código)
O Nuxt 3 já faz Code Splitting baseado em rotas (Route-based) por padrão. Mas para pacotes grandes (como ECharts, Lodash), precisamos otimizar manualmente.

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

#### 2. Tree Shaking e importação sob demanda
Garanta que apenas os módulos necessários sejam importados, não o pacote inteiro.

```typescript
// Errado: importar todo o lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// Correto: importar apenas debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// Recomendado: usar vueuse (específico para Vue e tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading de componentes
Para componentes não necessários na primeira tela, use o prefixo `Lazy` para importação dinâmica.

```vue
<template>
  <div>
    <!-- O código do componente só sera carregado quando show for true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Remover pacotes desnecessários do Server-side
Garanta que pacotes usados apenas no Server (como drivers de banco de dados, operações de fs) não sejam empacotados no Client. O Nuxt 3 trata automaticamente arquivos terminados em `.server.ts`, ou use o diretório `server/`.

---

## 3. Como otimizar a velocidade SSR (TTFB)?

### 3.1 Por que o TTFB é tao longo?
TTFB (Time To First Byte) e o indicador-chave de performance SSR. As causas comuns de TTFB longo são:
1. **API lenta**: o Server precisa esperar a resposta da API do back-end antes de renderizar o HTML.
2. **Requisicoes sequenciais**: múltiplas requisições de API executadas em série, não em paralelo.
3. **Computacao pesada**: o Server executa muitas tarefas CPU-intensive.

### 3.2 Soluções de otimização

#### 1. Server-Side Caching (Nitro Cache)
Use a funcionalidade de cache do Nitro para armazenar respostas de API ou resultados de renderização.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Página inicial com cache de 1 hora (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // Páginas de produtos com cache de 10 minutos
    '/products/**': { swr: 600 },
    // Cache de API
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. Requisicoes em paralelo (Parallel Fetching)
Use `Promise.all` para enviar múltiplas requisições em paralelo, em vez de `await` uma após a outra.

```typescript
// Lento: execução sequencial (tempo total = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// Rapido: execução paralela (tempo total = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Adiamento de dados não críticos (Lazy Fetching)
Dados não necessários na primeira tela podem ser carregados no Client (`lazy: true`), evitando bloqueio do SSR.

```typescript
// Dados de comentários não precisam de SEO, podem ser carregados no Client
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // Nem mesmo executar no Server
});
```

#### 4. Streaming SSR (experimental)
O Nuxt 3 suporta HTML Streaming, permitindo renderizar e enviar simultaneamente para que o usuário veja o conteúdo mais rápido.

---

## 4. Otimização de imagens no Nuxt 3

### 4.1 Usando @nuxt/image
O módulo oficial `@nuxt/image` é a melhor solução, oferecendo:
- **Conversao automática de formato**: automaticamente para WebP/AVIF.
- **Redimensionamento automático**: gera imagens no tamanho adequado conforme a tela.
- **Lazy Loading**: lazy loading integrado.
- **Integracao CDN**: suporta Cloudinary, Imgix e outros Providers.

### 4.2 Exemplo de implementação

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // Opções padrão
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

### 5.1 Seleção de solução
Para grandes volumes de dados (ex: 10.000 produtos), existem três estratégias principais, considerando **SEO**:

| Estratégia | Cenário adequado | Compatibilidade com SEO |
| :--- | :--- | :--- |
| **Paginacao tradicional (Pagination)** | Listas de e-commerce, listas de artigos | Excelente (melhor) |
| **Scroll infinito (Infinite Scroll)** | Feeds sociais, galerias de fotos | Baixa (requer tratamento especial) |
| **Virtual Scroll** | Relatorios complexos, listas muito longas | Muito baixa (conteúdo não está no DOM) |

### 5.2 Como manter SEO com scroll infinito?
Com scroll infinito, motores de busca geralmente rastreiam apenas a primeira página. Soluções:
1. **Combinar com páginação**: fornecer tags `<link rel="next" href="...">` para que os crawlers saibam que ha próxima página.
2. **Noscript Fallback**: fornecer uma versão de páginação tradicional em `<noscript>` para crawlers.
3. **Botao "Carregar mais"**: SSR renderiza os primeiros 20 registros; cliques subsequentes em "Carregar mais" ou rolagem acionam Client-side fetch.

### 5.3 Exemplo de implementação (Load More + SEO)

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

    <!-- Otimização SEO: informar crawlers sobre próxima página -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. Lazy Loading em ambiente SSR

### 6.1 Descrição do problema
Em ambiente SSR, se usar `IntersectionObserver` para implementar Lazy Loading, como o Server não possui `window` ou `document`, isso causara erros ou Hydration Mismatch.

### 6.2 Soluções

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

### 7.1 Por que é necessário monitorar?
Os gargalos de performance de aplicações SSR geralmente ocorrem no Server, invisível ao DevTools do navegador. Sem monitoramento, é difícil identificar se API lenta, Memory Leak ou CPU alta são a causa do TTFB lento.

### 7.2 Ferramentas comuns

1. **Nuxt DevTools (fase de desenvolvimento)**:
   - Integrado ao Nuxt 3.
   - Visualizar tempo de resposta de Server Routes.
   - Preview de **Open Graph** para SEO.
   - Painel **Server Routes** para monitorar tempo de chamadas de API.

2. **Lighthouse / PageSpeed Insights (após deploy)**:
   - Monitorar Core Web Vitals (LCP, CLS, FID/INP).
   - LCP (Largest Contentful Paint) depende fortemente do TTFB do SSR.

3. **Server-Side Monitoring (APM)**:
   - **Sentry / Datadog**: rastrear erros e performance do Server.
   - **OpenTelemetry**: rastrear o Request Trace completo (Nuxt Server -> API Server -> DB).

### 7.3 Implementação de rastreamento simples de tempo

No `server/middleware`, você pode implementar um timer simples:

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);

    // Também pode adicionar header Server-Timing para visualização no DevTools do navegador
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. Resumo para entrevista

**P: Como rastrear e monitorar problemas de performance SSR?**
> Na fase de desenvolvimento, uso principalmente o **Nuxt DevTools** para verificar tempos de resposta e tamanho do Payload dos Server Routes.
> Em ambiente de produção, acompanho **Core Web Vitals** (especialmente LCP) e **TTFB**.
> Para investigacao profunda de gargalos no Server, uso Server Middleware customizado para registrar tempos de requisição, envio dos dados via header `Server-Timing` ao navegador, ou integro **Sentry** / **OpenTelemetry** para rastreamento de cadeia completa.

**P: Como reduzir o bundle size do Nuxt 3?**
> Primeiro analiso com `nuxi analyze`. Para pacotes grandes (como lodash), aplico Tree Shaking ou divisão manual (`manualChunks`). Para componentes não essenciais na primeira tela, uso `<LazyComponent>` para importação dinâmica.

**P: Como otimizar a velocidade SSR?**
> O foco e reduzir o TTFB. Uso `routeRules` do Nitro para configurar Server-side caching (SWR). Requisicoes de API são paralelizadas com `Promise.all`. Dados não críticos são configurados com `lazy: true` para carregamento no Client.

**P: Como fazer otimização de imagens?**
> Uso o módulo `@nuxt/image`, que converte automaticamente para WebP, redimensiona automaticamente, e suporta Lazy Loading, reduzindo significativamente o volume de transferência.

**P: Como manter SEO com scroll infinito?**
> Scroll infinito não é amigavel para SEO. Se for um site de conteúdo, priorizo páginação tradicional. Se scroll infinito for obrigatório, renderizo a primeira página com SSR e uso Meta Tags (`rel="next"`) para informar crawlers sobre a estrutura de páginação, ou forneco links de páginação via Noscript.
