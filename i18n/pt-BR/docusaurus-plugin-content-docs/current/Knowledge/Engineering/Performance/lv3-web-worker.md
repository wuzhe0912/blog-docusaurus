---
id: performance-lv3-web-worker
title: '[Lv3] Aplicação de Web Worker: computação em segundo plano sem bloquear a UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** é uma API que executa JavaScript em uma thread de segundo plano no navegador, permitindo realizar computacoes demoradas sem bloquear a thread principal (thread da UI).

## Conceito central

### Contexto do problema

JavaScript é originalmente **single-threaded**, com todo o código executado na thread principal:

```javascript
// Computacao demorada bloqueando a thread principal
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Calculo complexo
  }
  return result;
}

// A página inteira congela durante a execução
const result = heavyComputation(); // UI nao pode interagir
```

**Problema:**

- Página travada, usuário não consegue clicar ou rolar
- Animacoes param
- Experiência do usuário pessima

### Solução com Web Worker

Web Worker fornece capacidade de **multi-threading**, permitindo tarefas demoradas em segundo plano:

```javascript
// Usando Worker para execução em segundo plano
const worker = new Worker('worker.js');

// Thread principal não bloqueia, página contínua interativa
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Computacao em segundo plano concluida:', e.data);
};
```

---

## Cenário 1: processamento de grandes volumes de dados

```javascript
// main.js
const worker = new Worker('worker.js');

// Processar JSON de grande porte
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Resultado do processamento:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // Executar processamento demorado de dados
    const result = data.map((item) => {
      // Computacao complexa
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## Cenário 2: processamento de imagens

Processamento de filtros, compressão e operações em pixels de imagens, evitando congelamento da UI.

## Cenário 3: cálculos complexos

Operacoes matemáticas (como cálculo de primos, criptografia/descriptografia)
Calculo de hash de arquivos grandes
Análise e estatísticas de dados

## Limitações e cuidados

### O que NAO pode ser feito no Worker

- Manipulacao direta do DOM
- Acesso a objetos window, document, parent
- Uso de certas Web APIs (como alert)

### O que PODE ser usado no Worker

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Timers (setTimeout, setInterval)
- Algumas APIs do navegador

```javascript
// Situacoes em que NAO se deve usar Worker
// 1. Calculos simples e rápidos (criar Worker tem overhead)
const result = 1 + 1; // Nao precisa de Worker

// 2. Necessidade de comunicação frequente com a thread principal
// O custo de comunicação pode anular a vantagem do multi-threading

// Situacoes em que se DEVE usar Worker
// 1. Computacao única de longa duração
const result = calculatePrimes(1000000);

// 2. Processamento em lote de grandes volumes de dados
const processed = largeArray.map(complexOperation);
```

---

## Casos de aplicação em projetos reais

### Caso: processamento criptografico de dados de jogos

Na plataforma de jogos, precisamos criptografar/descriptografar dados sensíveis:

```javascript
// main.js - Thread principal
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// Criptografar dados do jogador
function encryptPlayerData(data) {
  return new Promise((resolve, reject) => {
    cryptoWorker.postMessage({
      action: 'encrypt',
      data: data,
      key: SECRET_KEY,
    });

    cryptoWorker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.encrypted);
      } else {
        reject(e.data.error);
      }
    };
  });
}

// Uso
const encrypted = await encryptPlayerData(sensitiveData);
// Página não trava, usuário pode continuar operando

// crypto-worker.js - Thread do Worker
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      // Operação demorada de criptografia
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### Caso: filtragem de grandes volumes de dados de jogos

```javascript
// Filtragem complexa em 3000+ jogos
const filterWorker = new Worker('/workers/game-filter.js');

// Criterios de filtragem
const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ jogos
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered); // Exibir resultados filtrados
};

// Thread principal não trava, usuário pode continuar rolando e clicando
```

---

## Pontos-chave para entrevista

### Perguntas comuns de entrevista

**P1: Como o Web Worker se comunica com a thread principal?**

R: Através de `postMessage` e `onmessage`:

```javascript
// Thread principal -> Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker -> Thread principal
self.postMessage({ type: 'RESULT', result: processedData });

// Observação: os dados são "clonados estruturalmente" (Structured Clone)
// Isso significa:
// Pode transmitir: Number, String, Object, Array, Date, RegExp
// Não pode transmitir: Function, elementos DOM, Symbol
```

**P2: Qual é o custo de performance do Web Worker?**

R: Existem dois custos principais:

```javascript
// 1. Custo de criação do Worker (aproximadamente 30-50ms)
const worker = new Worker('worker.js'); // Necessita carregar arquivo

// 2. Custo de comunicação (copia de dados)
worker.postMessage(largeData); // Copia de dados grandes leva tempo

// Soluções:
// 1. Reutilizar Workers (não criar toda vez)
// 2. Usar Transferable Objects (transferir propriedade, sem copia)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Transferir propriedade
```

**P3: O que são Transferable Objects?**

R: Transferencia de propriedade dos dados, em vez de copia:

```javascript
// Abordagem normal: copiar dados (lento)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // Copiar 10MB (demorado)

// Transferable: transferir propriedade (rápido)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Transferir propriedade (nivel de milissegundos)

// Atenção: após transferência, a thread principal não pode mais usar esses dados
console.log(largeArray.length); // 0 (ja transferido)
```

**Tipos Transferable suportados:**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**P4: Quando usar Web Worker?**

R: Árvore de decisão:

```
E computacao demorada (> 50ms)?
|- Nao -> Nao precisa de Worker
|- Sim -> Continuar avaliando
    |
    |- Precisa manipular DOM?
    |   |- Sim -> Nao pode usar Worker (considere requestIdleCallback)
    |   |- Nao -> Continuar avaliando
    |
    |- Frequencia de comunicacao e alta (> 60 vezes/segundo)?
        |- Sim -> Provavelmente nao adequado (overhead de comunicacao)
        |- Nao -> Adequado para usar Worker
```

**Cenários adequados:**

- Criptografia/descriptografia
- Processamento de imagens (filtros, compressão)
- Ordenacao/filtragem de grandes volumes de dados
- Calculos matemáticos complexos
- Parsing de arquivos (JSON, CSV)

**Cenários não adequados:**

- Calculos simples (overhead maior que beneficio)
- Necessidade de comunicação frequente
- Necessidade de manipular DOM
- Necessidade de APIs não suportadas

**P5: Quais são os tipos de Web Worker?**

R: Três tipos:

```javascript
// 1. Dedicated Worker (dedicado)
const worker = new Worker('worker.js');
// So pode se comunicar com a página que o criou

// 2. Shared Worker (compartilhado)
const sharedWorker = new SharedWorker('shared-worker.js');
// Pode ser compartilhado entre múltiplas páginas/abas

// 3. Service Worker (serviço)
navigator.serviceWorker.register('sw.js');
// Usado para cache, suporte offline, notificações push
```

**Comparação:**

| Característica | Dedicated  | Shared             | Service    |
| -------------- | ---------- | ------------------ | ---------- |
| Compartilhamento | Página única | Múltiplas páginas | Todo o site |
| Ciclo de vida | Fecha com a página | Ultima página fechar | Independente da página |
| Uso principal | Computacao em segundo plano | Comunicacao entre páginas | Cache, offline |

**P6: Como debugar Web Worker?**

R: Chrome DevTools suporta:

```javascript
// 1. No painel Sources, você pode ver arquivos do Worker
// 2. Pode definir breakpoints
// 3. Pode executar código no Console

// Dica útil: usar console no Worker
self.addEventListener('message', (e) => {
  console.log('Worker recebeu:', e.data);
  // Visivel no Console do DevTools
});

// Tratamento de erros
worker.onerror = (error) => {
  console.error('Erro no Worker:', error.message);
  console.error('Arquivo:', error.filename);
  console.error('Linha:', error.lineno);
};
```

---

## Comparação de performance

### Dados de teste real (processamento de 1 milhao de registros)

| Método                    | Tempo de execução | UI trava? | Pico de memória |
| ------------------------- | ----------------- | --------- | --------------- |
| Thread principal (síncrono) | 2.5 s            | Trava completamente | 250 MB    |
| Thread principal (time slicing) | 3.2 s        | Trava ocasionalmente | 280 MB   |
| Web Worker                | 2.3 s             | Completamente fluido | 180 MB   |

**Conclusao:**

- Web Worker não apenas não trava a UI, mas também é mais rápido devido ao paralelismo multi-core
- Menor uso de memória (thread principal não precisa reter grandes volumes de dados)

---

## Tecnologias relacionadas

### Web Worker vs outras soluções

```javascript
// 1. setTimeout (pseudo-assíncrono)
setTimeout(() => heavyTask(), 0);
// Ainda na thread principal, vai travar

// 2. requestIdleCallback (execução em tempo ocioso)
requestIdleCallback(() => heavyTask());
// Executa apenas em momentos ociosos, sem garantia de tempo de conclusão

// 3. Web Worker (verdadeiro multi-threading)
worker.postMessage(task);
// Verdadeiramente paralelo, não bloqueia UI
```

### Avançado: simplificar comunicação do Worker com Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) permite usar Worker como funções normais:

```javascript
// Forma tradicional (verbosa)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Usando Comlink (concisa)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// Chamar como função normal
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## Sugestoes de estudo

**Preparacao para entrevista:**

1. Entender "por que Worker é necessário" (problema da single thread)
2. Saber "quando usar" (computação demorada)
3. Compreender "mecanismo de comunicação" (postMessage)
4. Conhecer "limitações" (sem acesso ao DOM)
5. Ter implementado pelo menos um caso com Worker

**Sugestoes práticas:**

- Começar com casos simples (como cálculo de primos)
- Usar Chrome DevTools para debug
- Medir diferenças de performance
- Considerar ferramentas como Comlink

---

## Topicos relacionados

- [Otimização a nível de rota ->](/docs/experience/performance/lv1-route-optimization)
- [Otimização de carregamento de imagens ->](/docs/experience/performance/lv1-image-optimization)
- [Implementação de Virtual Scroll ->](/docs/experience/performance/lv3-virtual-scroll)
- [Estratégias de otimização para grandes volumes de dados ->](/docs/experience/performance/lv3-large-data-optimization)
