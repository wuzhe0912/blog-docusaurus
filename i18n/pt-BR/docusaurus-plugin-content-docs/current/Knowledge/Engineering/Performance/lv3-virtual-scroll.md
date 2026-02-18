---
id: performance-lv3-virtual-scroll
title: '[Lv3] Implementação de Virtual Scroll: lidando com renderização de grandes volumes de dados'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Quando a página precisa renderizar 1000+ registros, o virtual scroll pode reduzir os nos de DOM de 1000+ para 20-30, diminuindo o uso de memória em 80%.

---

## Cenário de entrevista

**P: Se a tela tem mais de uma tabela, cada uma com mais de cem registros, e eventos que atualizam o DOM frequentemente, qual método você usaria para otimizar a performance dessa página?**

---

## Análise do problema (Situation)

### Cenário real do projeto

No projeto da plataforma, temos páginas que precisam lidar com grandes volumes de dados:

```markdown
Pagina de historico de registros
- Tabela de depositos: 1000+ registros
- Tabela de saques: 800+ registros
- Tabela de apostas: 5000+ registros
- Cada registro com 8-10 campos (hora, valor, status, etc.)

Problemas sem otimizacao
- Nos de DOM: 1000 registros x 10 campos = 10.000+ nos
- Uso de memória: aproximadamente 150-200 MB
- Tempo da primeira renderização: 3-5 segundos (tela branca)
- Travamento na rolagem: FPS < 20
- Atualizacao via WebSocket: tabela inteira re-renderizada (muito lento)
```

### Gravidade do problema

```javascript
// Abordagem tradicional
<tr v-for="record in allRecords">  // 1000+ registros todos renderizados
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 campos
</tr>

// Resultado:
// - Renderizacao inicial: 10.000+ nos de DOM
// - Visiveis para o usuário: 20-30 registros
// - Desperdicio: 99% dos nos não são vistos pelo usuário
```

---

## Solução (Action)

### Virtual Scrolling

Considerando a otimização de virtual scroll, ha duas direcoes: usar a biblioteca de terceiros com suporte oficial [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller), configurando parâmetros conforme a necessidade para determinar as linhas visíveis.

```js
// Renderizar apenas as linhas visíveis, por exemplo:
// - 100 registros, renderizar apenas os 20 visíveis
// - Reducao drastica de nos de DOM
```

Outra opção e implementar manualmente, mas considerando o custo de desenvolvimento real e os cenários cobertos, eu tenderia a usar a biblioteca de terceiros com suporte oficial.

### Controle de frequência de atualização de dados

> Solução 1: requestAnimationFrame (RAF)
> Conceito: o navegador redesenha no máximo 60 vezes por segundo (60 FPS). Atualizacoes mais rápidas são imperceptíveis ao olho humano, então acompanhamos a taxa de atualização da tela.

```js
// Antes: atualizar imediatamente ao receber dados (possivelmente 100 vezes/segundo)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// Melhorado: coletar dados e atualizar conforme taxa de atualização da tela (máximo 60 vezes/segundo)
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // Armazenar ultimo preco

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // Atualizar quando o navegador estiver pronto para redesenhar
      isScheduled = false;
    });
  }
});
```

Solução 2: throttle
Conceito: limitar forçadamente a frequência de atualização, ex: "no máximo 1 atualização a cada 100ms"

```js
// throttle do lodash (se o projeto já usa)
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // Executar no maximo 1 vez a cada 100ms

socket.on('price', updatePrice);
```

### Otimizações específicas do Vue3

Existem syntactic sugars do Vue3 que oferecem otimização de performance, como v-memo, embora eu pessoalmente use pouco esse cenário.

```js
// 1. v-memo - memoizar colunas que não mudam frequentemente
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Re-renderizar apenas quando esses campos mudam
</tr>

// 2. Congelar dados estáticos para evitar overhead reativo
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef para arrays grandes
const tableData = shallowRef([...])  // Rastrear apenas o array, não os objetos internos

// 4. Usar key para otimizar algoritmo diff (usar ID único para rastrear cada item, limitando atualização DOM aos nos com mudancas)
<tr v-for="row in data" :key="row.id">  // Key estável
```

RAF: acompanha atualização da tela (~16ms), adequado para animações, rolagem
throttle: intervalo personalizado (ex: 100ms), adequado para busca, resize

### Otimização de renderização DOM

```scss
// Usar CSS transform em vez de top/left
.row-update {
  transform: translateY(0); /* Aciona aceleracao GPU */
  will-change: transform; /* Dica ao navegador para otimizar */
}

// CSS containment para isolar escopo de renderização
.table-container {
  contain: layout style paint;
}
```

---

## Resultados da otimização (Result)

### Comparação de performance

| Indicador       | Antes       | Depois       | Melhoria |
| --------------- | ----------- | ------------ | -------- |
| Nos de DOM      | 10.000+     | 20-30        | -99.7%   |
| Uso de memória  | 150-200 MB  | 30-40 MB     | -80%     |
| Primeira renderização | 3-5 s  | 0.3-0.5 s    | +90%     |
| FPS de rolagem  | < 20        | 55-60        | +200%    |
| Resposta de atualização | 500-800 ms | 16-33 ms | +95%     |

### Resultado real

```markdown
Virtual scroll
- Renderiza apenas 20-30 registros visiveis
- Atualiza dinamicamente o intervalo visivel durante rolagem
- Imperceptivel para o usuario (experiencia fluida)
- Memoria estável (não cresce com volume de dados)

Atualizacao de dados com RAF
- WebSocket 100 atualizacoes/segundo -> maximo 60 renderizacoes
- Acompanha taxa de atualização da tela (60 FPS)
- Uso de CPU reduzido em 60%

Otimizacoes Vue3
- v-memo: evita re-renderizacoes desnecessarias
- shallowRef: reduz overhead reativo
- :key estável: otimiza algoritmo diff
```

---

## Pontos-chave para entrevista

### Perguntas de extensão comuns

**P: E se não puder usar bibliotecas de terceiros?**
R: Implementar a lógica central do virtual scroll manualmente:

```javascript
// Conceito central
const itemHeight = 50; // Altura de cada linha
const containerHeight = 600; // Altura do container
const visibleCount = Math.ceil(containerHeight / itemHeight); // Quantidade visivel

// Calcular quais itens devem ser exibidos
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// Renderizar apenas o intervalo visível
const visibleItems = allItems.slice(startIndex, endIndex);

// Compensar altura com padding (scrollbar correto)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**Pontos-chave:**

- Calcular intervalo visível (startIndex -> endIndex)
- Carregamento dinâmico de dados (slice)
- Compensacao de altura (padding top/bottom)
- Monitorar evento de rolagem (otimização com throttle)

**P: Como lidar com reconexao de WebSocket?**
R: Implementar estratégia de reconexao com backoff exponencial:

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 segundo

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('Nao foi possível conectar, por favor recarregue a página');
    return;
  }

  // Backoff exponencial: 1s -> 2s -> 4s -> 8s -> 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// Após reconexao bem-sucedida
socket.on('connect', () => {
  retryCount = 0; // Resetar contador
  syncData(); // Sincronizar dados
  showSuccess('Conexao restabelecida');
});
```

**P: Como testar o efeito da otimização de performance?**
R: Usando combinação de várias ferramentas:

```javascript
// 1. Performance API para medir FPS
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}

// 2. Memory Profiling (Chrome DevTools)
// - Tirar snapshot antes da renderização
// - Tirar snapshot após a renderização
// - Comparar diferença de memória

// 3. Lighthouse / Performance Tab
// - Tempo de Long Task
// - Total Blocking Time
// - Cumulative Layout Shift

// 4. Testes automatizados (Playwright)
const { test } = require('@playwright/test');

test('virtual scroll performance', async ({ page }) => {
  await page.goto('/records');

  // Medir tempo da primeira renderização
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // Acionar renderização
    const end = performance.now();
    return end - start;
  });

  expect(renderTime).toBeLessThan(500); // < 500ms
});
```

**P: Quais são as desvantagens do Virtual Scroll?**
R: Trade-offs a considerar:

```markdown
Desvantagens
- Nao e possível usar busca nativa do navegador (Ctrl+F)
- Nao e possível usar função "selecionar tudo" (requer tratamento especial)
- Complexidade de implementacao mais alta
- Requer altura fixa ou calculo previo de altura
- Acessibilidade requer tratamento adicional

Cenarios adequados
- Volume de dados > 100 registros
- Estrutura de dados similar para cada registro (altura fixa)
- Necessidade de rolagem de alta performance
- Foco em visualização (não edição)

Cenarios não adequados
- Volume de dados < 50 registros (over-engineering)
- Altura variavel (implementacao dificil)
- Necessidade de muita interacao (multi-selecao, drag and drop)
- Necessidade de imprimir tabela inteira
```

**P: Como otimizar listas com alturas variáveis?**
R: Usar virtual scroll com altura dinâmica:

```javascript
// Opção 1: altura estimada + medição real
const estimatedHeight = 50; // Altura estimada
const measuredHeights = {}; // Registrar alturas reais

// Medir após renderização
onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Opção 2: usar biblioteca que suporta altura dinâmica
// vue-virtual-scroller suporta dynamic-height
<DynamicScroller
  :items="items"
  :min-item-size="50"  // Altura minima
  :buffer="200"        // Buffer
/>
```

---

## Comparação técnica

### Virtual Scroll vs Paginacao

| Criterio         | Virtual Scroll            | Paginacao tradicional    |
| ---------------- | ------------------------- | ------------------------ |
| Experiência do usuário | Rolagem contínua (melhor) | Necessita páginação (interrompida) |
| Performance      | Sempre renderiza apenas área visível | Renderiza tudo por página |
| Dificuldade de implementação | Mais complexa      | Simples                  |
| SEO friendly     | Pior                      | Melhor                   |
| Acessibilidade   | Requer tratamento especial | Suporte nativo          |

**Recomendação:**

- Sistemas back-office, Dashboard -> Virtual Scroll
- Sites públicos, blogs -> Paginacao tradicional
- Solução híbrida: Virtual Scroll + botao "Carregar mais"
