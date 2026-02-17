---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Recomenda-se ler primeiro [Promise](/docs/promise) para entender os conceitos básicos

## O que é async/await?

`async/await` é um açúcar sintático introduzido no ES2017 (ES8), construído sobre Promise, que faz o código assíncrono parecer código síncrono, tornando-o mais fácil de ler e manter.

**Conceitos principais**:

- Funções `async` sempre retornam uma Promise
- `await` só pode ser usado dentro de funções `async`
- `await` pausa a execução da função e espera a Promise ser concluída

## Sintaxe básica

### Função async

A palavra-chave `async` faz a função retornar automaticamente uma Promise:

```js
// Escrita tradicional com Promise
function fetchData() {
  return Promise.resolve('dados');
}

// Escrita com async (equivalente)
async function fetchData() {
  return 'dados'; // Automaticamente encapsulado em Promise.resolve('dados')
}

// A forma de chamada é a mesma
fetchData().then((data) => console.log(data)); // 'dados'
```

### Palavra-chave await

`await` espera a Promise ser concluída e retorna o resultado:

```js
async function getData() {
  const result = await Promise.resolve('concluído');
  console.log(result); // 'concluído'
}
```

## Comparação Promise vs async/await

### Exemplo 1: Requisição API simples

**Escrita com Promise**:

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Erro:', error);
      throw error;
    });
}
```

**Escrita com async/await**:

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}
```

### Exemplo 2: Encadear múltiplas operações assíncronas

**Escrita com Promise**:

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('Erro:', error);
    });
}
```

**Escrita com async/await**:

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

## Tratamento de erros

### try/catch vs .catch()

**async/await com try/catch**:

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Requisição falhou:', error);
    // Aqui é possível tratar diferentes tipos de erros
    if (error.name === 'NetworkError') {
      // Tratar erro de rede
    }
    throw error; // Relançar ou retornar valor padrão
  }
}
```

**Uso misto (não recomendado mas funcional)**:

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Requisição falhou:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### try/catch multinível

Para erros em diferentes estágios, podem ser usados múltiplos blocos try/catch:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Falha ao obter usuário:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Falha ao obter publicações:', error);
    return []; // Retornar array vazio como valor padrão
  }
}
```

## Exemplos de aplicação prática

### Exemplo: Processo de correção de provas

> Fluxo: Corrigir prova → Verificar recompensa → Conceder recompensa → Expulsão ou punição

```js
// Corrigir prova
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('Você atingiu o limite de expulsão');
      }
    }, 2000);
  });
}

// Verificar recompensa
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} ganha ingressos de cinema`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} ganha uma menção honrosa`);
      } else {
        reject('Sem prêmio para você');
      }
    }, 2000);
  });
}
```

**Escrita com Promise**:

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Reescrita com async/await**:

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### Exemplo: Execução concorrente de múltiplas requisições

Quando não há dependências entre múltiplas requisições, elas devem ser executadas concorrentemente:

**❌ Errado: Execução sequencial (mais lento)**:

```js
async function fetchAllData() {
  const users = await fetchUsers(); // Esperar 1 segundo
  const posts = await fetchPosts(); // Esperar mais 1 segundo
  const comments = await fetchComments(); // Esperar mais 1 segundo
  // Total 3 segundos
  return { users, posts, comments };
}
```

**✅ Correto: Execução concorrente (mais rápido)**:

```js
async function fetchAllData() {
  // Iniciar três requisições simultaneamente
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Precisa apenas de 1 segundo (o tempo da requisição mais lenta)
  return { users, posts, comments };
}
```

**Usar Promise.allSettled() para lidar com falhas parciais**:

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## Armadilhas comuns

### 1. Usar await em loops (execução sequencial)

**❌ Errado: Esperar a cada iteração, ineficiente**:

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // Execução sequencial, muito lento!
    results.push(user);
  }
  return results;
}
// Se há 10 usuários e cada requisição leva 1 segundo, leva 10 segundos no total
```

**✅ Correto: Execução concorrente com Promise.all()**:

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 usuários com requisições concorrentes, apenas 1 segundo
```

**Solução intermediária: Limitar a concorrência**:

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// Processar 3 por vez, evitando enviar muitas requisições de uma só vez
```

### 2. Esquecer de usar await

Esquecer `await` retorna uma Promise em vez do valor real:

```js
// ❌ Errado
async function getUser() {
  const user = fetchUser(1); // Esqueceu await, user é uma Promise
  console.log(user.name); // undefined (Promise não tem propriedade name)
}

// ✅ Correto
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // Nome correto
}
```

### 3. Usar await sem async

`await` só pode ser usado dentro de funções `async`:

```js
// ❌ Errado: Erro de sintaxe
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ Correto
async function getData() {
  const data = await fetchData();
  return data;
}
```

**await de nível superior (Top-level await)**:

No ES2022 e em ambientes de módulos, é possível usar await no nível superior do módulo:

```js
// ES2022 module
const data = await fetchData(); // Pode ser usado no nível superior do módulo
console.log(data);
```

### 4. Omissão do tratamento de erros

Sem try/catch, os erros não serão capturados:

```js
// ❌ Pode causar erros não capturados
async function fetchData() {
  const response = await fetch('/api/data'); // Se falhar, lançará um erro
  return response.json();
}

// ✅ Adicionar tratamento de erros
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Erro:', error);
    return null; // Ou retornar valor padrão
  }
}
```

### 5. Funções async sempre retornam Promise

Mesmo sem usar `await`, funções `async` retornam uma Promise:

```js
async function getValue() {
  return 42; // Na verdade retorna Promise.resolve(42)
}

// É necessário usar .then() ou await para obter o valor
getValue().then((value) => console.log(value)); // 42

// Ou
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Aplicações avançadas

### Tratamento de timeout

Implementação de mecanismo de timeout usando Promise.race():

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Tempo limite da requisição esgotado')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Requisição falhou:', error.message);
    throw error;
  }
}

// Uso
fetchWithTimeout('/api/data', 3000); // Timeout de 3 segundos
```

### Mecanismo de retry

Implementação de retry automático em caso de falha:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Última tentativa falhou, lançar erro

      console.log(`Tentativa ${i + 1} falhou, tentando novamente em ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Uso
fetchWithRetry('/api/data', 3, 2000); // Máximo 3 tentativas, intervalo de 2 segundos
```

### Processamento sequencial mantendo o estado

Às vezes é necessário executar sequencialmente mas manter todos os resultados:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // Pode decidir o próximo passo com base no resultado anterior
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await no Event Loop

async/await é essencialmente ainda Promise, portanto segue as mesmas regras do Event Loop:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// Ordem de saída: 1, 2, 4, 3
```

Análise:

1. `console.log('1')` - Execução síncrona
2. `test()` é chamado, `console.log('2')` - Execução síncrona
3. `await Promise.resolve()` - O código subsequente é colocado na fila de micro tasks
4. `console.log('4')` - Execução síncrona
5. O micro task é executado, `console.log('3')`

## Pontos-chave para entrevistas

1. **async/await é açúcar sintático de Promise**: Mais legível mas essencialmente o mesmo
2. **O tratamento de erros usa try/catch**: Não `.catch()`
3. **Atenção a concorrente vs sequencial**: Não usar await indiscriminadamente em loops
4. **Funções async sempre retornam Promise**: Mesmo sem return Promise explícito
5. **await só pode ser usado dentro de funções async**: Exceto top-level await (ES2022)
6. **Entender o Event Loop**: O código após await é um micro task

## Tópicos relacionados

- [Promise](/docs/promise) - Base do async/await
- [Event Loop](/docs/event-loop) - Entender a ordem de execução

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
