---
title: '[Lv3] Desafios de implementacao SSR e solucoes'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Problemas comuns em SSR e solucoes praticas: Hydration Mismatch, variaveis de ambiente, compatibilidade de bibliotecas, performance e arquitetura de deploy.

---

## Cenario de entrevista

**Pergunta: Quais dificuldades voce encontrou ao implementar SSR e como resolveu?**

O que o entrevistador quer validar:

1. **Experiencia real**: se voce realmente implementou SSR.
2. **Metodo de resolucao**: como identifica causa raiz e prioriza.
3. **Profundidade tecnica**: rendering, hydration, cache e deploy.
4. **Boas praticas**: solucoes robustas, mensuraveis e sustentaveis.

---

## Desafio 1: Hydration Mismatch

### Problema

Alerta comum:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Causas frequentes:

- Render diferente entre servidor e cliente
- Uso de APIs exclusivas de browser em caminho SSR (`window`, `document`, `localStorage`)
- Valores nao deterministas (`Date.now()`, `Math.random()`)

### Solucoes

#### Opcao A: encapsular com `ClientOnly`

```vue
<template>
  <div>
    <h1>Conteudo SSR</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>Carregando...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

#### Opcao B: guardas no cliente

```vue
<script setup lang="ts">
const ua = ref('');

onMounted(() => {
  if (process.client) {
    ua.value = window.navigator.userAgent;
  }
});
</script>
```

**Mensagem-chave:** saida SSR precisa ser deterministica; logica browser-only deve ficar no cliente.

---

## Desafio 2: Variaveis de ambiente

### Problema

- Segredos do servidor podem vazar para cliente.
- Uso desorganizado de `process.env` dificulta manutencao.

### Solucao

Separar com runtime config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
```

```ts
// uso
const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // cliente + servidor
const secret = config.apiSecret; // so servidor
```

**Mensagem-chave:** segredo fica no servidor; configuracao publica fica no bloco `public`.

---

## Desafio 3: Bibliotecas sem suporte SSR

### Problema

- Algumas libs acessam DOM durante SSR.
- Resultado: erro de build/runtime ou hydration quebrada.

### Solucoes

1. Carregar a lib apenas no cliente (plugin `.client.ts`)
2. Import dinamico em contexto cliente
3. Avaliar alternativa compativel com SSR

```ts
let chartLib: any;
if (process.client) {
  chartLib = await import('chart.js/auto');
}
```

**Mensagem-chave:** primeiro isolar causa, depois aplicar client-isolation ou trocar biblioteca.

---

## Desafio 4: Cookies e headers

### Problema

- Auth em SSR depende de leitura de cookie no servidor.
- Headers precisam ser consistentes entre cliente, SSR e API.

### Solucao

```ts
const token = useCookie('access_token');

const { data } = await useFetch('/api/me', {
  headers: process.server
    ? useRequestHeaders(['cookie'])
    : undefined,
  credentials: 'include',
});
```

**Mensagem-chave:** request SSR nao pode perder contexto de autenticacao.

---

## Desafio 5: Timing de carga assincrona

### Problema

- Varias componentes buscam os mesmos dados.
- Requests duplicados e estado de loading inconsistente.

### Solucao

- Definir keys unicos para deduplication
- Centralizar acesso em composables compartilhados
- Separar carga inicial de acao do usuario

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Mensagem-chave:** centralizar fluxo de dados evita repeticao por componente.

---

## Desafio 6: Performance e carga do servidor

### Problema

- SSR aumenta CPU e I/O.
- Sob carga alta, TTFB piora.

### Solucoes

1. Cache com Nitro
2. Otimizar query de DB
3. Dividir SSR/CSR por relevancia SEO
4. Configurar CDN corretamente

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Mensagem-chave:** performance e decisao de arquitetura, nao so detalhe de frontend.

---

## Desafio 7: Tratamento de erro e 404

### Problema

- IDs dinamicos podem ser invalidos.
- Sem semantica 404 correta, SEO pode indexar pagina errada.

### Solucao

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Adicional:

- `error.vue` para UX de erro clara
- Pagina de erro com `noindex, nofollow`

**Mensagem-chave:** HTTP status, UX e SEO precisam ser consistentes.

---

## Desafio 8: APIs somente de browser

### Problema

- No SSR nao existe `window`/`document`.
- Acesso direto causa erro de runtime.

### Solucao

```ts
const width = ref<number | null>(null);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Ou com guarda:

```ts
if (process.client) {
  localStorage.setItem('theme', 'dark');
}
```

**Mensagem-chave:** APIs de browser apenas em fase cliente claramente delimitada.

---

## Desafio 9: Memory leak no servidor

### Problema

- Processo Node de longa duracao cresce em memoria.
- Causa comum: estado global mutavel, timers/listeners sem cleanup.

### Solucoes

1. Nao usar estado global por request
2. Limpar listeners/intervals
3. Monitorar com heap snapshot e `process.memoryUsage()`

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Mensagem-chave:** leak em SSR e risco operacional e de seguranca.

---

## Desafio 10: Scripts de ads e tracking

### Problema

- Scripts de terceiros bloqueiam main thread ou quebram hydration.
- CLS/FID/INP pioram.

### Solucao

- Carregar script de forma assincrona e tardia
- Reservar espaco para ads e evitar layout shift
- Nao acoplar UI critica ao tracking

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Mensagem-chave:** monetizacao nao pode degradar estabilidade de rendering.

---

## Desafio 11: Arquitetura de deploy (SSR vs SPA)

### Problema

- SPA e estatico e simples para publicar.
- SSR precisa de camada de compute, observabilidade e gestao de processo.

### Comparacao

| Aspecto        | SPA (Static)        | SSR (Node/Edge)                 |
| -------------- | ------------------- | ------------------------------- |
| Infraestrutura | Storage + CDN       | Compute + CDN                   |
| Operacao       | Muito simples       | Complexidade media              |
| Custo          | Baixo               | Mais alto por tempo de computo  |
| Monitoramento  | Minimo              | Logs, metrics, memory, cold start |

### Recomendacoes

1. PM2 ou containers para estabilidade
2. CDN e Cache-Control bem configurados
3. Staging com teste de carga antes de producao
4. Definir error budget e alerting

**Mensagem-chave:** SSR nao e so renderizacao; tambem e arquitetura operacional.

---

## Resumo para entrevista

**Resposta possivel (30-45 segundos):**

> Em projetos SSR eu agrupo os riscos em quatro frentes: render deterministico para evitar hydration mismatch, separacao rigorosa entre configuracao de servidor e cliente, performance com deduplication/cache/splitting, e operacao confiavel com tratamento de erros, monitoramento de memoria e arquitetura de deploy apropriada.

**Checklist:**
- ✅ Citar um problema concreto com causa
- ✅ Mostrar contramedidas tecnicas
- ✅ Explicar impacto em SEO/performance/operacao
- ✅ Encerrar com contexto real de projeto
