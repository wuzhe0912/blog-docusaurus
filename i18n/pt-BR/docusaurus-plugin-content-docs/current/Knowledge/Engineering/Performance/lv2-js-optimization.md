---
id: performance-lv2-js-optimization
title: '[Lv2] Otimizacao de performance computacional JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Atraves de tecnicas como debounce, throttle, time slicing e requestAnimationFrame, otimizamos a performance computacional do JavaScript e melhoramos a experiencia do usuario.

---

## Contexto do problema

No projeto da plataforma, os usuarios realizam frequentemente as seguintes operacoes:

- **Busca** (digitando palavras-chave para filtrar 3000+ produtos em tempo real)
- **Rolagem de listas** (rastreando posicao e carregando mais itens durante a rolagem)
- **Troca de categorias** (filtrando para exibir tipos especificos de produtos)
- **Efeitos de animacao** (rolagem suave, efeitos de presentes)

Essas operacoes, sem otimizacao, causam travamento da pagina e uso excessivo de CPU.

---

## Estrategia 1: Debounce - Otimizacao de entrada de busca

```javascript
import { useDebounceFn } from '@vueuse/core';

// Funcao debounce: se digitar novamente dentro de 500ms, reinicia a contagem
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Executa somente apos parar de digitar por 500ms
  }
);
```

```md
Antes da otimizacao: digitando "slot game" (9 caracteres)

- Aciona 9 buscas
- Filtrando 3000 jogos x 9 vezes = 27.000 operacoes
- Tempo: cerca de 1.8 segundo (pagina trava)

Apos otimizacao: digitando "slot game"

- Aciona 1 busca (apos parar de digitar)
- Filtrando 3000 jogos x 1 vez = 3.000 operacoes
- Tempo: cerca de 0.2 segundo
- Melhoria de performance: 90%
```

## Estrategia 2: Throttle - Otimizacao de eventos de rolagem

> Cenario de aplicacao: rastreamento de posicao de rolagem, carregamento infinito

```javascript
import { throttle } from 'lodash';

// Funcao throttle: executa no maximo 1 vez a cada 100ms
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Antes da otimizacao:

- Evento de rolagem dispara 60 vezes por segundo (60 FPS)
- Cada disparo calcula a posicao de rolagem
- Tempo: cerca de 600ms (pagina trava)

Apos otimizacao:

- Evento de rolagem dispara no maximo 1 vez por segundo (100ms entre execucoes)
- Tempo: cerca de 100ms
- Melhoria de performance: 90%
```

## Estrategia 3: Time Slicing - Processamento de grandes volumes de dados

> Cenario de aplicacao: nuvem de tags, combinacoes de menu, filtragem de 3000+ jogos, renderizacao de historico de transacoes

```javascript
// Funcao personalizada de time slicing
function processInBatches(
  array: GameList, // 3000 jogos
  batchSize: number, // Processar 200 por lote
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Processamento concluido

    const batch = array.slice(index, index + batchSize); // Fatiar
    callback(batch); // Processar este lote
    index += batchSize;

    setTimeout(processNextBatch, 0); // Proximo lote na fila de microtarefas
  }

  processNextBatch();
}
```

Exemplo de uso:

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // Dividir 3000 jogos em 15 lotes, 200 por lote
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Estrategia 4: requestAnimationFrame - Otimizacao de animacoes

> Cenario de aplicacao: rolagem suave, animacoes Canvas, efeitos de presentes

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Funcao de easing (Easing Function)
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // Chamada recursiva
    }
  };

  requestAnimationFrame(animateScroll);
};
```

Por que usar requestAnimationFrame?

```javascript
// Abordagem errada: usar setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // Tentando 60fps (1000ms / 60 = 16ms)
// Problemas:
// 1. Nao sincroniza com o repaint do navegador (pode executar multiplas vezes entre repaints)
// 2. Executa mesmo em abas em segundo plano (desperdicio de recursos)
// 3. Pode causar jank (perda de frames)

// Abordagem correta: usar requestAnimationFrame
requestAnimationFrame(animateScroll);
// Vantagens:
// 1. Sincronizado com o repaint do navegador (60fps ou 120fps)
// 2. Pausa automaticamente quando a aba nao esta visivel (economia de bateria)
// 3. Mais fluido, sem perda de frames
```

---

## Pontos-chave para entrevista

### Debounce vs Throttle

| Caracteristica | Debounce                            | Throttle                            |
| -------------- | ----------------------------------- | ----------------------------------- |
| Momento de disparo | Apos parar a acao, espera um periodo | Executa no maximo uma vez em intervalo fixo |
| Cenario adequado | Entrada de busca, resize de janela | Eventos de rolagem, movimento do mouse |
| Numero de execucoes | Pode nao executar (se continuar acionando) | Garante execucao (frequencia fixa) |
| Atraso | Com atraso (espera parar) | Execucao imediata, limitacao subsequente |

### Time Slicing vs Web Worker

| Caracteristica | Time Slicing                       | Web Worker                          |
| -------------- | ----------------------------------- | ----------------------------------- |
| Ambiente de execucao | Thread principal                | Thread em segundo plano             |
| Cenario adequado | Tarefas que precisam manipular DOM | Tarefas de computacao pura          |
| Complexidade de implementacao | Mais simples              | Mais complexa (requer comunicacao)  |
| Melhoria de performance | Evita bloquear thread principal | Computacao verdadeiramente paralela |

### Perguntas comuns de entrevista

**P: Como escolher entre debounce e throttle?**

R: Depende do cenario de uso:

- **Debounce**: adequado para cenarios de "esperar o usuario completar a acao" (como entrada de busca)
- **Throttle**: adequado para cenarios de "precisa atualizar continuamente mas nao muito frequentemente" (como rastreamento de rolagem)

**P: Como escolher entre time slicing e Web Worker?**

R:

- **Time Slicing**: precisa manipular DOM, processamento simples de dados
- **Web Worker**: computacao pura, processamento de grandes volumes de dados, sem necessidade de manipulacao DOM

**P: Quais sao as vantagens do requestAnimationFrame?**

R:

1. Sincronizado com o repaint do navegador (60fps)
2. Pausa automaticamente quando a aba nao esta visivel (economia de bateria)
3. Evita perda de frames (Jank)
4. Performance superior a setInterval/setTimeout
