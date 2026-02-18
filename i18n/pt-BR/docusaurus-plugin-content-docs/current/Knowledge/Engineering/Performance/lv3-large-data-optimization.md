---
id: performance-lv3-large-data-optimization
title: '[Lv3] Estratégias de otimização para grandes volumes de dados: seleção e implementação de soluções'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Quando a tela precisa exibir dezenas de milhares de registros, como encontrar o equilibrio entre performance, experiência do usuário e custo de desenvolvimento?

## Cenário de entrevista

**P: Quando existem dezenas de milhares de registros na tela, como você otimizaria?**

Esta é uma pergunta aberta. O entrevistador espera ouvir não apenas uma única solução, mas:

1. **Avaliação de requisitos**: realmente é necessário exibir tantos dados de uma vez?
2. **Seleção de solução**: quais são as opções? Quais são os pros e contras de cada uma?
3. **Pensamento abrangente**: consideracoes combinadas de front-end + back-end + UX
4. **Experiência real**: motivos da escolha e resultados da implementação

---

## Primeiro passo: avaliação de requisitos

Antes de escolher a solução técnica, faca a si mesmo estas perguntas:

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

### Análise de casos reais

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

## Visão geral das soluções de otimização

### Tabela comparativa de soluções

| Solução           | Cenário adequado          | Vantagens                | Desvantagens             | Dificuldade | Performance |
| ----------------- | ------------------------- | ------------------------ | ------------------------ | ----------- | ----------- |
| **Paginacao back-end** | Maioria dos cenários  | Simples é confiável, SEO friendly | Necessita paginação, experiência interrompida | 1/5 Simples | 3/5 Média |
| **Virtual scroll** | Grandes volumes com altura fixa | Performance máxima, rolagem fluida | Implementação complexa, sem busca nativa | 4/5 Complexa | 5/5 Excelente |
| **Scroll infinito** | Redes sociais, feeds de notícias | Experiência contínua, implementação simples | Acúmulo de memória, sem paginação | 2/5 Simples | 3/5 Média |
| **Carregamento em lotes** | Otimização do carregamento inicial | Carregamento progressivo, combina com skeleton screen | Requer cooperacao do back-end | 2/5 Simples | 3/5 Média |
| **Web Worker** | Computacao pesada, ordenação, filtragem | Não bloqueia thread principal | Custo de comunicação, debug difícil | 3/5 Média | 4/5 Boa |
| **Solução híbrida** | Requisitos complexos | Combina vantagens de múltiplas soluções | Alta complexidade | 4/5 Complexa | 4/5 Boa |

---

## Detalhes das soluções

### 1. Paginacao back-end (Pagination) - Solução preferencial

> **Índice de recomendação: 5/5 (altamente recomendado)**
> A solução mais comum é confiável, adequada para 80% dos cenários

#### Implementação

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

#### Tecnicas de otimização

```javascript
// 1. Paginacao baseada em cursor (Cursor-based Pagination)
// Adequada para dados com atualização em tempo real, evita duplicatas ou omissoes
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. Cache de páginas populares
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Retornar apenas campos necessários
const data = await Collection.find()
  .select('id name price status') // Selecionar apenas campos necessarios
  .skip(skip)
  .limit(pageSize);
```

#### Cenários adequados

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

### 2. Virtual Scroll - Performance máxima

> **Índice de recomendação: 4/5 (recomendado)**
> Melhor performance, adequado para grandes volumes de dados com altura fixa

Virtual scroll é uma técnica que renderiza apenas a area visível, reduzindo nos de DOM de 10.000+ para 20-30, com redução de 80% no uso de memória.

#### Conceito central

```javascript
// Renderizar apenas dados no intervalo visível
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

#### Implementação

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

#### Comparação de performance

| Indicador       | Renderizacao tradicional | Virtual scroll | Melhoria |
| --------------- | ------------------------ | -------------- | -------- |
| Nos de DOM      | 10.000+                  | 20-30          | -99.7%   |
| Uso de memória  | 150 MB                   | 30 MB          | -80%     |
| Primeira renderizacao | 3-5 segundos        | 0.3 segundo    | +90%     |
| FPS de rolagem  | < 20                     | 55-60          | +200%    |

#### Saiba mais

Detalhes: [Implementação completa de Virtual Scroll ->](/docs/experience/performance/lv3-virtual-scroll)

---

### 3. Scroll infinito (Infinite Scroll) - Experiência contínua

> **Índice de recomendação: 3/5 (consideravel)**
> Adequado para cenários de navegação contínua como redes sociais e feeds de notícias

#### Implementação

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

#### Tecnicas de otimização

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

// Observar o último elemento
const lastItem = document.querySelector('.item:last-child');
observer.observe(lastItem);

// 2. Controle de throttle (evitar múltiplos acionamentos durante rolagem rápida)
import { throttle } from 'lodash';
const handleScroll = throttle(checkAndLoadMore, 200);

// 3. Descarga virtualizada (evitar acúmulo de memória)
// Quando dados ultrapassam 500 registros, descartar os mais antigos
if (displayedItems.value.length > 500) {
  displayedItems.value = displayedItems.value.slice(-500);
}
```

#### Cenários adequados

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

> **Índice de recomendação: 3/5 (consideravel)**
> Carregamento gradual, melhoria na experiência da primeira tela

#### Implementação

```javascript
// Estratégia de carregamento em lotes
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

> **Índice de recomendação: 4/5 (recomendado)**
> Computacao pesada sem bloquear a thread principal

#### Cenários adequados

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

#### Implementação

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

Detalhes: [Aplicação de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

### 6. Solução híbrida (Hybrid Approach)

Para cenários complexos, combine múltiplas soluções:

#### Opção A: Virtual scroll + paginação back-end

```javascript
// A cada vez, buscar 500 registros do back-end
// Front-end usa virtual scroll para renderizacao
// Ao chegar ao final da rolagem, carregar próximos 500 registros

const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}

// Usar virtual scroll para renderizar currentBatch
```

#### Opção B: Scroll infinito + descarga virtualizada

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

#### Opção C: Otimização de busca + virtual scroll

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

## Fluxograma de decisão

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

## Estratégias de otimização complementares

Independentemente da solução escolhida, estas otimizações podem ser combinadas:

### 1. Controle de frequência de atualização de dados

```javascript
// RequestAnimationFrame (adequado para animações, rolagem)
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
// Criar índices no front-end (acelerar buscas)
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

// Busca rápida
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

### 4. Otimização da API do back-end

```javascript
// 1. Retornar apenas campos necessários
GET /api/items?fields=id,name,price

// 2. Usar compressão (gzip/brotli)
// Ativar no Express
app.use(compression());

// 3. HTTP/2 Server Push
// Pre-enviar dados que podem ser necessários

// 4. GraphQL (consultar exatamente os dados necessários)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## Indicadores de avaliação de performance

Após escolher a solução, use estes indicadores para avaliar os resultados:

### Indicadores técnicos

```markdown
1. Tempo da primeira renderizacao (FCP): < 1 segundo
2. Tempo ate interatividade (TTI): < 3 segundos
3. FPS de rolagem: > 50 (meta 60)
4. Uso de memoria: < 50 MB
5. Quantidade de nos DOM: < 1000
```

### Indicadores de experiência do usuário

```markdown
1. Taxa de rejeicao: reducao de 20%+
2. Tempo de permanencia: aumento de 30%+
3. Quantidade de interacoes: aumento de 40%+
4. Taxa de erros: < 0.1%
```

### Ferramentas de medição

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

### Resposta estruturada (método STAR)

**Entrevistador: Quando existem dezenas de milhares de dados na tela, como otimizar?**

**Resposta:**

> "Excelente pergunta. Antes de escolher a solução, eu avaliaria os requisitos reais:
>
> **1. Análise de requisitos (30 segundos)**
>
> - O usuário precisa ver todos os dados? Na maioria dos casos, não
> - A altura dos dados e fixa? Isso afeta a escolha técnica
> - Qual é a operação principal do usuário? Navegar, buscar ou encontrar item específico
>
> **2. Seleção de solução (1 minuto)**
>
> Dependendo do cenário, eu escolheria:
>
> - **Painel administrativo geral** -> Paginacao back-end (mais simples e confiável)
> - **Necessidade de rolagem fluida** -> Virtual scroll (melhor performance)
> - **Tipo rede social** -> Scroll infinito (melhor experiência)
> - **Necessidade de computação complexa** -> Web Worker + virtual scroll
>
> **3. Caso real (1 minuto)**
>
> No meu projeto anterior, encontrei a situação de uma lista de jogos com 3000+ jogos.
> Escolhi a solução de virtual scroll, e os resultados foram:
>
> - Nos de DOM de 10.000+ para 20-30 (-99.7%)
> - Uso de memória reduzido em 80% (150MB -> 30MB)
> - Tempo da primeira renderizacao de 3-5 segundos para 0.3 segundo
> - Fluidez de rolagem atingindo 60 FPS
>
> Combinado com filtragem no front-end, controle de atualização com RAF, skeleton screen e outras otimizações, a experiência do usuário melhorou significativamente.
>
> **4. Otimizações complementares (30 segundos)**
>
> Independentemente da solução, eu combinaria com:
>
> - Otimização da API do back-end (retornar apenas campos necessários, compressão, cache)
> - Skeleton screen para melhorar experiência de carregamento
> - Debounce e throttle para controlar frequência de atualização
> - Ferramentas como Lighthouse para monitoramento contínuo de performance"

### Perguntas complementares comuns

**P: E se não puder usar bibliotecas de terceiros?**

R: O princípio central do virtual scroll não é complexo e pode ser implementado manualmente. Basicamente e calcular o intervalo visível (startIndex/endIndex), carregar dados dinamicamente (slice), compensar altura (padding top/bottom). Em projetos reais, eu avaliaria o custo de desenvolvimento; se o prazo permitir, implementar manualmente, mas recomendo priorizar bibliotecas maduras para evitar armadilhas.

**P: Quais são as desvantagens do virtual scroll?**

R: Existem alguns trade-offs a considerar:

1. Não é possível usar busca nativa do navegador (Ctrl+F)
2. Não é possível selecionar todos os itens (requer tratamento especial)
3. Complexidade de implementação mais alta
4. Acessibilidade requer tratamento adicional

Portanto, é necessário avaliar com base nos requisitos reais se vale a pena usar.

**P: Como testar o efeito da otimização?**

R: Usando combinação de várias ferramentas:

- Chrome DevTools Performance (Long Task, FPS)
- Lighthouse (pontuacao geral)
- Monitoramento de performance personalizado (Performance API)
- Rastreamento de comportamento do usuário (taxa de rejeição, tempo de permanência)

---

## Notas relacionadas

- [Implementação completa de Virtual Scroll ->](/docs/experience/performance/lv3-virtual-scroll)
- [Visão geral de otimização de performance web ->](/docs/experience/performance)
- [Aplicação de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

## Resumo

Ao enfrentar a questão "otimização de dezenas de milhares de dados":

1. **Avalie os requisitos primeiro**: não se apresse em escolher a tecnologia
2. **Conheca múltiplas soluções**: paginação back-end, virtual scroll, scroll infinito, etc.
3. **Pondere os trade-offs**: performance vs custo de desenvolvimento vs experiência do usuário
4. **Otimize continuamente**: use ferramentas de monitoramento para melhorias continuas
5. **Deixe os dados falarem**: comprove a eficacia da otimização com dados reais de performance

Lembre-se: **não existe bala de prata, apenas a solução mais adequada para o cenário atual**.
