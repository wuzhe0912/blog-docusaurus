---
title: '[Lv2] Implementacao SSR: Data Fetching e gestao de SEO Meta'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Em um projeto Nuxt 3: implementar carregamento de dados em SSR e gestao dinamica de SEO Meta para que buscadores indexem rotas dinamicas corretamente.

---

## 1. Eixo da resposta na entrevista

1. **Estrategia de data fetching**: usar `useFetch`/`useAsyncData` para preload no servidor e entregar HTML completo para SEO.
2. **Meta tags dinamicas**: usar `useHead` ou `useSeoMeta` para gerar metadata por recurso.
3. **Performance**: aplicar request deduplication, cache no servidor e separar claramente paginas SSR e CSR.

---

## 2. Uso correto de useFetch / useAsyncData

### 2.1 Por que data fetching em SSR e importante

**Cenario tipico:**

- Rotas dinamicas (ex.: `/products/[id]`) precisam buscar dados de API.
- Se carregar apenas no cliente, crawler pode ver conteudo incompleto.
- Objetivo: entregar HTML renderizado no servidor com dados completos.

**Solucao:** usar `useFetch` ou `useAsyncData` no Nuxt 3.

### 2.2 Exemplo base com useFetch

**Arquivo:** `pages/products/[id].vue`

```typescript
// uso basico
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Opcoes importantes:**

| Opcao       | Objetivo                                      | Default  |
| ----------- | --------------------------------------------- | -------- |
| `key`       | Chave unica para deduplicar requests          | auto     |
| `lazy`      | Carga adiada (nao bloqueia SSR)               | `false`  |
| `server`    | Executar no servidor                          | `true`   |
| `default`   | Valor fallback                                | `null`   |
| `transform` | Transformar resposta antes do consumo         | -        |

### 2.3 Exemplo completo

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // evita requests duplicados
  lazy: false, // SSR espera os dados
  server: true, // garante execucao no servidor
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // normalizacao de dados
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Por que essas opcoes importam:**

1. **`key`**
   - Permite request deduplication.
   - Mesmo key -> um request efetivo.
2. **`lazy: false`**
   - Servidor renderiza depois de receber dados.
   - Crawler recebe conteudo final.
3. **`server: true`**
   - Fetch roda no caminho SSR.
   - Evita depender somente do cliente.

### 2.4 useAsyncData vs useFetch

| Criterio      | useFetch                    | useAsyncData                        |
| ------------- | --------------------------- | ----------------------------------- |
| Uso principal | Chamada API                 | Qualquer operacao assincrona        |
| Conveniencia  | URL/header integrados       | Logica manual                       |
| Caso comum    | HTTP data fetching          | Query de DB, agregacao, arquivos    |

```typescript
// useFetch: focado em API
const { data } = await useFetch('/api/products/123');

// useAsyncData: logica async livre
const { data } = await useAsyncData('products', async () => {
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**Regra curta para entrevista:**

- **`$fetch`** para acao do usuario (click, submit, refresh).
- **`useFetch`** para carga inicial com sincronizacao SSR/Hydration.

**`$fetch` caracteristicas:**

- Cliente HTTP puro (`ofetch`)
- Nao transfere estado SSR
- Uso direto em `setup()` pode gerar double fetch

**`useFetch` caracteristicas:**

- Combina `useAsyncData` + `$fetch`
- Amigavel para hydration
- Entrega `data`, `pending`, `error`, `refresh`

**Comparacao:**

| Ponto               | useFetch                       | $fetch                         |
| ------------------- | ------------------------------ | ------------------------------ |
| Transferencia SSR   | Sim                            | Nao                            |
| Retorno             | Refs reativas                  | Promise com dados brutos       |
| Uso principal       | Carga inicial da pagina        | Operacoes dirigidas por evento |

```typescript
// correto: carga inicial
const { data } = await useFetch('/api/user');

// correto: acao de usuario
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// evitar: setup + $fetch direto
const data = await $fetch('/api/user');
```

---

## 3. Gestao de SEO Meta com useHead

### 3.1 Por que meta tags dinamicas sao necessarias

**Cenario tipico:**

- Paginas de produto e artigo sao dinamicas.
- Cada URL precisa de `title`, `description`, `og:image`, canonical proprios.
- Compartilhamento social (Open Graph/Twitter) precisa ser consistente.

**Solucao:** `useHead` ou `useSeoMeta`.

### 3.2 Exemplo de useHead

```typescript
useHead({
  title: () => product.value?.name,
  meta: [
    { name: 'description', content: () => product.value?.description },
    { property: 'og:title', content: () => product.value?.name },
    { property: 'og:image', content: () => product.value?.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**Boas praticas:**

1. Passar valores como funcao (`() => ...`) para reagir a mudancas de dados.
2. Cobrir estrutura SEO completa: title, description, OG, canonical.
3. Em 404, usar `noindex, nofollow`.

### 3.3 Variante compacta com useSeoMeta

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

---

## 4. Caso pratico 1: SEO para rotas dinamicas

### 4.1 Contexto

Cenario de e-commerce com muitas paginas SKU (`/products/[id]`).

**Desafios:**

- Muitas URLs dinamicas
- SEO unico por URL
- Tratamento correto de 404
- Evitar conteudo duplicado

### 4.2 Estrategia

1. Preload no servidor (`lazy: false`, `server: true`)
2. Lancar 404 com `createError`
3. Gerar meta e canonical dinamicamente

```typescript
const { data: product, error } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`,
  lazy: false,
  server: true,
});

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}

useSeoMeta({
  title: () => `${product.value?.name} - Product`,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

### 4.3 Resultado

**Antes:**
- Crawler via conteudo incompleto
- Varias paginas com metadata repetida
- 404 inconsistente

**Depois:**
- HTML SSR completo para crawler
- Metadata unico por rota
- Tratamento de erro consistente e seguro para SEO

---

## 5. Caso pratico 2: Otimizacao de performance

### 5.1 Problema

SSR aumenta carga de servidor. Sem otimizacao, latencia e custo sobem.

### 5.2 Estrategias

1. **Request deduplication**

```typescript
const { data } = await useFetch('/api/product/123', {
  key: 'product-123',
});
```

2. **Cache em servidor (Nitro)**

```typescript
export default defineCachedEventHandler(
  async (event) => {
    return await getProductsFromDB();
  },
  {
    maxAge: 60 * 60,
    swr: true,
  },
);
```

3. **Separar SSR/CSR**
- Paginas criticas para SEO: SSR
- Paginas internas sem indexacao: CSR

4. **Critical CSS e estrategia de assets**
- Priorizar CSS above-the-fold
- Carregar recursos nao criticos depois

### 5.3 Impacto

**Antes:**
- Alta carga no servidor
- Requests duplicados
- Sem estrategia de cache

**Depois:**
- Melhor tempo de resposta
- Menos pressao em backend/DB
- Performance mais estavel sob carga

---

## 6. Respostas curtas de entrevista

### 6.1 useFetch / useAsyncData

> Na carga inicial eu uso `useFetch` com `key`, `lazy: false` e `server: true` para garantir SSR completo e HTML util para indexacao.

### 6.2 Meta tags dinamicas

> Eu uso `useHead`/`useSeoMeta` com valores em funcao para atualizar metadados conforme os dados, incluindo OG e canonical.

### 6.3 Performance

> Eu combino deduplication, cache no servidor e split SSR/CSR para reduzir TTFB sem perder qualidade de SEO.

---

## 7. Best practices

### 7.1 Data fetching

1. Definir `key` sempre.
2. Escolher `lazy` de acordo com objetivo SEO.
3. Tratar erros (404/5xx) explicitamente.

### 7.2 SEO Meta

1. Valores funcionais para updates reativos.
2. Estrutura completa (title/description/OG/canonical).
3. Proteger paginas de erro com `noindex, nofollow`.

### 7.3 Performance

1. Aplicar cache no servidor.
2. Usar SSR apenas onde SEO precisa.
3. Reduzir custo de render com estrategia de CSS/assets.

---

## 8. Resumo para entrevista

> Em Nuxt 3 eu implementei data fetching SSR e gestao dinamica de SEO Meta para cobrir dois objetivos: indexacao correta e experiencia rapida. Para isso eu combinei preload no servidor, metadados por rota e otimizacoes com deduplication, cache e separacao SSR/CSR.

**Pontos-chave:**
- ✅ Uso correto de `useFetch`/`useAsyncData`
- ✅ Gestao dinamica com `useHead`/`useSeoMeta`
- ✅ SEO para rotas dinamicas
- ✅ Performance em cenarios reais
