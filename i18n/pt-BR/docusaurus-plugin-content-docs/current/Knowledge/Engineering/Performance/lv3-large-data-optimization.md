---
id: performance-lv3-large-data-optimization
title: '[Lv3] Estrategias de otimizacao para grandes volumes de dados: selecao e implementacao de solucoes'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Quando a tela precisa exibir dezenas de milhares de registros, como encontrar o equilibrio entre performance, experiencia do usuario e custo de desenvolvimento?

## Cenario de entrevista

**P: Quando existem dezenas de milhares de registros na tela, como voce otimizaria?**

Esta e uma pergunta aberta. O entrevistador espera ouvir nao apenas uma unica solucao, mas:

1. **Avaliacao de requisitos**: realmente e necessario exibir tantos dados de uma vez?
2. **Selecao de solucao**: quais sao as opcoes? Quais sao os pros e contras de cada uma?
3. **Pensamento abrangente**: consideracoes combinadas de front-end + back-end + UX
4. **Experiencia real**: motivos da escolha e resultados da implementacao

---

## Primeiro passo: avaliacao de requisitos

Antes de escolher a solucao tecnica, faca a si mesmo estas perguntas:

### Perguntas centrais

```markdown
O usuario realmente precisa ver todos os dados?
-> Na maioria dos casos, o usuario se importa apenas com os primeiros 50-100 registros
-> Pode reduzir o escopo atraves de filtros, busca e ordenacao

Os dados precisam ser atualizados em tempo real?
-> WebSocket em tempo real vs polling periodico vs apenas carregamento inicial

Qual e o padrao de operacao do usuario?
-> Navegacao principal -> virtual scroll
-> Buscar dados especificos -> busca + paginacao
-> Visualizar registro por registro -> scroll infinito

A estrutura de dados e fixa?
-> Altura fixa -> virtual scroll e facil de implementar
-> Altura variavel -> necessario calculo dinamico de altura

E necessario selecionar tudo, imprimir ou exportar?
-> Necessario -> virtual scroll tem limitacoes
-> Nao necessario -> virtual scroll e a melhor escolha
```

### Analise de casos reais

```javascript
// Caso 1: Historico de transacoes (10.000+ registros)
Comportamento do usuario: ver transacoes recentes, buscar datas especificas ocasionalmente
Melhor solucao: paginacao no back-end + busca

// Caso 2: Lista de jogos em tempo real (3.000+ jogos)
Comportamento do usuario: navegar, filtrar por categoria, rolagem fluida
Melhor solucao: virtual scroll + filtragem no front-end

// Caso 3: Feed social (crescimento infinito)
Comportamento do usuario: rolar continuamente para baixo, sem necessidade de pular paginas
Melhor solucao: scroll infinito + carregamento em lotes

// Caso 4: Relatorios de dados (tabelas complexas)
Comportamento do usuario: visualizar, ordenar, exportar
Melhor solucao: paginacao no back-end + API de exportacao
```

---

## Visao geral das solucoes de otimizacao

### Tabela comparativa de solucoes

| Solucao           | Cenario adequado          | Vantagens                | Desvantagens             | Dificuldade | Performance |
| ----------------- | ------------------------- | ------------------------ | ------------------------ | ----------- | ----------- |
| **Paginacao back-end** | Maioria dos cenarios  | Simples e confiavel, SEO friendly | Necessita paginacao, experiencia interrompida | 1/5 Simples | 3/5 Media |
| **Virtual scroll** | Grandes volumes com altura fixa | Performance maxima, rolagem fluida | Implementacao complexa, sem busca nativa | 4/5 Complexa | 5/5 Excelente |
| **Scroll infinito** | Redes sociais, feeds de noticias | Experiencia continua, implementacao simples | Acumulo de memoria, sem paginacao | 2/5 Simples | 3/5 Media |
| **Carregamento em lotes** | Otimizacao do carregamento inicial | Carregamento progressivo, combina com skeleton screen | Requer cooperacao do back-end | 2/5 Simples | 3/5 Media |
| **Web Worker** | Computacao pesada, ordenacao, filtragem | Nao bloqueia thread principal | Custo de comunicacao, debug dificil | 3/5 Media | 4/5 Boa |
| **Solucao hibrida** | Requisitos complexos | Combina vantagens de multiplas solucoes | Alta complexidade | 4/5 Complexa | 4/5 Boa |

---

## Detalhes das solucoes

### 1. Paginacao back-end (Pagination) - Solucao preferencial

> **Indice de recomendacao: 5/5 (altamente recomendado)**
> A solucao mais comum e confiavel, adequada para 80% dos cenarios

#### Implementacao

```javascript
// Requisicao do front-end
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// API do back-end (exemplo com Node.js + MongoDB)
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  const data = await Collection.find().skip(skip).limit(pageSize).lean(); // Retorna apenas objetos puros, sem metodos do Mongoose

  const total = await Collection.countDocuments();

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});
```

#### Tecnicas de otimizacao

```javascript
// 1. Paginacao baseada em cursor (Cursor-based Pagination)
// Adequada para dados com atualizacao em tempo real, evita duplicatas ou omissoes
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. Cache de paginas populares
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Retornar apenas campos necessarios
const data = await Collection.find()
  .select('id name price status') // Selecionar apenas campos necessarios
  .skip(skip)
  .limit(pageSize);
```

#### Cenarios adequados

```markdown
Adequado
- Paineis administrativos (lista de pedidos, lista de usuarios)
- Sistemas de consulta de dados (historico)
- Sites publicos (blog, noticias)
- Paginas que necessitam de SEO

Nao adequado
- Necessidade de experiencia de rolagem fluida
- Listas com atualizacao em tempo real (paginacao pode saltar)
- Aplicacoes tipo rede social
```

---

### 2. Virtual Scroll - Performance maxima

> **Indice de recomendacao: 4/5 (recomendado)**
> Melhor performance, adequado para grandes volumes de dados com altura fixa

Virtual scroll e uma tecnica que renderiza apenas a area visivel, reduzindo nos de DOM de 10.000+ para 20-30, com reducao de 80% no uso de memoria.

#### Conceito central

```javascript
// Renderizar apenas dados no intervalo visivel
const itemHeight = 50; // Altura de cada item
const containerHeight = 600; // Altura do container
const visibleCount = Math.ceil(containerHeight / itemHeight); // Quantidade visivel = 12

// Calcular quais itens devem ser exibidos atualmente
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// Renderizar apenas este intervalo
const visibleItems = allItems.slice(startIndex, endIndex);

// Compensar altura com padding (para scrollbar correto)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

#### Implementacao

```vue
<!-- Usando vue-virtual-scroller -->
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }))
);
</script>
```

#### Comparacao de performance

| Indicador       | Renderizacao tradicional | Virtual scroll | Melhoria |
| --------------- | ------------------------ | -------------- | -------- |
| Nos de DOM      | 10.000+                  | 20-30          | -99.7%   |
| Uso de memoria  | 150 MB                   | 30 MB          | -80%     |
| Primeira renderizacao | 3-5 segundos        | 0.3 segundo    | +90%     |
| FPS de rolagem  | < 20                     | 55-60          | +200%    |

#### Saiba mais

Detalhes: [Implementacao completa de Virtual Scroll ->](/docs/experience/performance/lv3-virtual-scroll)

---

### 3. Scroll infinito (Infinite Scroll) - Experiencia continua

> **Indice de recomendacao: 3/5 (consideravel)**
> Adequado para cenarios de navegacao continua como redes sociais e feeds de noticias

#### Implementacao

```vue
<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <div v-for="item in displayedItems" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">Carregando...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const displayedItems = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

// Carregamento inicial
onMounted(() => {
  loadMore();
});

// Carregar mais dados
async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const { data, hasNext } = await fetchData(currentPage.value);
  displayedItems.value.push(...data);
  hasMore.value = hasNext;
  currentPage.value++;
  loading.value = false;
}

// Monitoramento de rolagem
function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  // Aciona carregamento quando faltam 100px para o final
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}
</script>
```

#### Tecnicas de otimizacao

```javascript
// 1. Usar IntersectionObserver (melhor performance)
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  },
  { rootMargin: '100px' } // Acionar 100px antes
);

// Observar o ultimo elemento
const lastItem = document.querySelector('.item:last-child');
observer.observe(lastItem);

// 2. Controle de throttle (evitar multiplos acionamentos durante rolagem rapida)
import { throttle } from 'lodash';
const handleScroll = throttle(checkAndLoadMore, 200);

// 3. Descarga virtualizada (evitar acumulo de memoria)
// Quando dados ultrapassam 500 registros, descartar os mais antigos
if (displayedItems.value.length > 500) {
  displayedItems.value = displayedItems.value.slice(-500);
}
```

#### Cenarios adequados

```markdown
Adequado
- Feeds de redes sociais (Facebook, Twitter)
- Listas de noticias, listas de artigos
- Cascata de produtos
- Cenarios de navegacao continua

Nao adequado
- Necessidade de pular para dados especificos
- Necessidade de exibir total de dados (ex: "10.000 registros")
- Cenarios de retorno ao topo (rolar demais sem conseguir voltar)
```

---

### 4. Carregamento progressivo (Progressive Loading)

> **Indice de recomendacao: 3/5 (consideravel)**
> Carregamento gradual, melhoria na experiencia da primeira tela

#### Implementacao

```javascript
// Estrategia de carregamento em lotes
async function loadDataInBatches() {
  const batchSize = 50;
  const totalBatches = Math.ceil(totalItems / batchSize);

  // Primeiro lote: carregamento imediato (dados da primeira tela)
  const firstBatch = await fetchBatch(0, batchSize);
  displayedItems.value = firstBatch;

  // Lotes subsequentes: carregamento atrasado
  for (let i = 1; i < totalBatches; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Intervalo de 100ms
    const batch = await fetchBatch(i * batchSize, batchSize);
    displayedItems.value.push(...batch);
  }
}

// Com skeleton screen
<template>
  <div v-if="loading">
    <SkeletonItem v-for="i in 10" :key="i" />
  </div>
  <div v-else>
    <Item v-for="item in items" :key="item.id" :data="item" />
  </div>
</template>
```

#### Usando requestIdleCallback

```javascript
// Carregar dados subsequentes quando o navegador estiver ocioso
function loadBatchWhenIdle(batch) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      displayedItems.value.push(...batch);
    });
  } else {
    // Fallback: usar setTimeout
    setTimeout(() => {
      displayedItems.value.push(...batch);
    }, 0);
  }
}
```

---

### 5. Processamento com Web Worker (Heavy Computation)

> **Indice de recomendacao: 4/5 (recomendado)**
> Computacao pesada sem bloquear a thread principal

#### Cenarios adequados

```markdown
Adequado
- Ordenacao de grandes volumes de dados (10.000+ registros)
- Filtragem e busca complexa
- Conversao de formato de dados
- Calculos estatisticos (processamento de dados para graficos)

Nao adequado
- Necessidade de manipular DOM (Worker nao tem acesso)
- Calculos simples (custo de comunicacao maior que o calculo)
- Interacoes que necessitam feedback imediato
```

#### Implementacao

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { data, keyword } = e.data;

  // Filtrar grandes volumes de dados no Worker
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // Retornar resultado
  self.postMessage(filtered);
});

// main.js
const worker = new Worker('/worker.js');

function searchData(keyword) {
  worker.postMessage({ data: allData, keyword });

  worker.onmessage = (e) => {
    displayedItems.value = e.data;
    console.log('Filtragem concluida, thread principal sem travamento');
  };
}
```

Detalhes: [Aplicacao de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

### 6. Solucao hibrida (Hybrid Approach)

Para cenarios complexos, combine multiplas solucoes:

#### Opcao A: Virtual scroll + paginacao back-end

```javascript
// A cada vez, buscar 500 registros do back-end
// Front-end usa virtual scroll para renderizacao
// Ao chegar ao final da rolagem, carregar proximos 500 registros

const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}

// Usar virtual scroll para renderizar currentBatch
```

#### Opcao B: Scroll infinito + descarga virtualizada

```javascript
// Scroll infinito carrega dados
// Mas quando dados ultrapassam 1000 registros, descartar os mais antigos

function loadMore() {
  // Carregar mais dados
  items.value.push(...newItems);

  // Descarga virtualizada (manter os 1000 mais recentes)
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### Opcao C: Otimizacao de busca + virtual scroll

```javascript
// Busca usa API do back-end
// Resultados da busca renderizados com virtual scroll

async function search(keyword) {
  if (keyword) {
    // Com palavra-chave: busca no back-end (suporta busca fuzzy, full-text)
    searchResults.value = await apiSearch(keyword);
  } else {
    // Sem palavra-chave: exibir tudo (virtual scroll)
    searchResults.value = allItems.value;
  }
}
```

---

## Fluxograma de decisao

```
Inicio: dezenas de milhares de registros precisam ser exibidos
    |
P1: O usuario precisa ver todos os dados?
    |- Nao -> Paginacao back-end + busca/filtro
    |
    Sim
    |
P2: A altura dos dados e fixa?
    |- Sim -> Virtual scroll
    |- Nao -> Virtual scroll com altura dinamica (complexo) ou scroll infinito
    |
P3: E necessaria experiencia de navegacao continua?
    |- Sim -> Scroll infinito
    |- Nao -> Paginacao back-end
    |
P4: Existem necessidades de computacao pesada (ordenacao, filtragem)?
    |- Sim -> Web Worker + virtual scroll
    |- Nao -> Virtual scroll
```

---

## Estrategias de otimizacao complementares

Independentemente da solucao escolhida, estas otimizacoes podem ser combinadas:

### 1. Controle de frequencia de atualizacao de dados

```javascript
// RequestAnimationFrame (adequado para animacoes, rolagem)
let latestData = null;
let scheduled = false;

socket.on('update', (data) => {
  latestData = data;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => {
      updateUI(latestData);
      scheduled = false;
    });
  }
});

// Throttle (adequado para busca, resize)
import { throttle } from 'lodash';
const handleSearch = throttle(performSearch, 300);
```

### 2. Skeleton Screen

```vue
<template>
  <div v-if="loading">
    <!-- Exibir skeleton screen durante carregamento -->
    <div class="skeleton-item" v-for="i in 10" :key="i">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-text"></div>
    </div>
  </div>
  <div v-else>
    <!-- Dados reais -->
    <Item v-for="item in items" :key="item.id" />
  </div>
</template>

<style>
.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
```

### 3. Indices e cache

```javascript
// Criar indices no front-end (acelerar buscas)
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

// Busca rapida
const item = indexedData.get(targetId); // O(1) em vez de O(n)

// Usar IndexedDB para cache de grandes volumes de dados
import { openDB } from 'idb';

const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  },
});

// Armazenar dados
await db.put('items', item);

// Ler dados
const item = await db.get('items', id);
```

### 4. Otimizacao da API do back-end

```javascript
// 1. Retornar apenas campos necessarios
GET /api/items?fields=id,name,price

// 2. Usar compressao (gzip/brotli)
// Ativar no Express
app.use(compression());

// 3. HTTP/2 Server Push
// Pre-enviar dados que podem ser necessarios

// 4. GraphQL (consultar exatamente os dados necessarios)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## Indicadores de avaliacao de performance

Apos escolher a solucao, use estes indicadores para avaliar os resultados:

### Indicadores tecnicos

```markdown
1. Tempo da primeira renderizacao (FCP): < 1 segundo
2. Tempo ate interatividade (TTI): < 3 segundos
3. FPS de rolagem: > 50 (meta 60)
4. Uso de memoria: < 50 MB
5. Quantidade de nos DOM: < 1000
```

### Indicadores de experiencia do usuario

```markdown
1. Taxa de rejeicao: reducao de 20%+
2. Tempo de permanencia: aumento de 30%+
3. Quantidade de interacoes: aumento de 40%+
4. Taxa de erros: < 0.1%
```

### Ferramentas de medicao

```markdown
1. Chrome DevTools
   - Performance: Long Task, FPS
   - Memory: uso de memoria
   - Network: quantidade e tamanho de requisicoes

2. Lighthouse
   - Performance Score
   - FCP / LCP / TTI
   - CLS

3. Monitoramento personalizado
   - Performance API
   - User Timing API
   - RUM (Real User Monitoring)
```

---

## Modelo de resposta para entrevista

### Resposta estruturada (metodo STAR)

**Entrevistador: Quando existem dezenas de milhares de dados na tela, como otimizar?**

**Resposta:**

> "Excelente pergunta. Antes de escolher a solucao, eu avaliaria os requisitos reais:
>
> **1. Analise de requisitos (30 segundos)**
>
> - O usuario precisa ver todos os dados? Na maioria dos casos, nao
> - A altura dos dados e fixa? Isso afeta a escolha tecnica
> - Qual e a operacao principal do usuario? Navegar, buscar ou encontrar item especifico
>
> **2. Selecao de solucao (1 minuto)**
>
> Dependendo do cenario, eu escolheria:
>
> - **Painel administrativo geral** -> Paginacao back-end (mais simples e confiavel)
> - **Necessidade de rolagem fluida** -> Virtual scroll (melhor performance)
> - **Tipo rede social** -> Scroll infinito (melhor experiencia)
> - **Necessidade de computacao complexa** -> Web Worker + virtual scroll
>
> **3. Caso real (1 minuto)**
>
> No meu projeto anterior, encontrei a situacao de uma lista de jogos com 3000+ jogos.
> Escolhi a solucao de virtual scroll, e os resultados foram:
>
> - Nos de DOM de 10.000+ para 20-30 (-99.7%)
> - Uso de memoria reduzido em 80% (150MB -> 30MB)
> - Tempo da primeira renderizacao de 3-5 segundos para 0.3 segundo
> - Fluidez de rolagem atingindo 60 FPS
>
> Combinado com filtragem no front-end, controle de atualizacao com RAF, skeleton screen e outras otimizacoes, a experiencia do usuario melhorou significativamente.
>
> **4. Otimizacoes complementares (30 segundos)**
>
> Independentemente da solucao, eu combinaria com:
>
> - Otimizacao da API do back-end (retornar apenas campos necessarios, compressao, cache)
> - Skeleton screen para melhorar experiencia de carregamento
> - Debounce e throttle para controlar frequencia de atualizacao
> - Ferramentas como Lighthouse para monitoramento continuo de performance"

### Perguntas complementares comuns

**P: E se nao puder usar bibliotecas de terceiros?**

R: O principio central do virtual scroll nao e complexo e pode ser implementado manualmente. Basicamente e calcular o intervalo visivel (startIndex/endIndex), carregar dados dinamicamente (slice), compensar altura (padding top/bottom). Em projetos reais, eu avaliaria o custo de desenvolvimento; se o prazo permitir, implementar manualmente, mas recomendo priorizar bibliotecas maduras para evitar armadilhas.

**P: Quais sao as desvantagens do virtual scroll?**

R: Existem alguns trade-offs a considerar:

1. Nao e possivel usar busca nativa do navegador (Ctrl+F)
2. Nao e possivel selecionar todos os itens (requer tratamento especial)
3. Complexidade de implementacao mais alta
4. Acessibilidade requer tratamento adicional

Portanto, e necessario avaliar com base nos requisitos reais se vale a pena usar.

**P: Como testar o efeito da otimizacao?**

R: Usando combinacao de varias ferramentas:

- Chrome DevTools Performance (Long Task, FPS)
- Lighthouse (pontuacao geral)
- Monitoramento de performance personalizado (Performance API)
- Rastreamento de comportamento do usuario (taxa de rejeicao, tempo de permanencia)

---

## Notas relacionadas

- [Implementacao completa de Virtual Scroll ->](/docs/experience/performance/lv3-virtual-scroll)
- [Visao geral de otimizacao de performance web ->](/docs/experience/performance)
- [Aplicacao de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

## Resumo

Ao enfrentar a questao "otimizacao de dezenas de milhares de dados":

1. **Avalie os requisitos primeiro**: nao se apresse em escolher a tecnologia
2. **Conheca multiplas solucoes**: paginacao back-end, virtual scroll, scroll infinito, etc.
3. **Pondere os trade-offs**: performance vs custo de desenvolvimento vs experiencia do usuario
4. **Otimize continuamente**: use ferramentas de monitoramento para melhorias continuas
5. **Deixe os dados falarem**: comprove a eficacia da otimizacao com dados reais de performance

Lembre-se: **nao existe bala de prata, apenas a solucao mais adequada para o cenario atual**.
