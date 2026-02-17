---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## O que é uma Promise?

Promise é uma nova funcionalidade do ES6, utilizada principalmente para resolver o problema do callback hell e tornar o código mais fácil de ler. Uma Promise representa a conclusão ou falha eventual de uma operação assíncrona, juntamente com seu valor resultante.

Uma Promise tem três estados:

- **pending** (pendente): Estado inicial
- **fulfilled** (cumprida): Operação concluída com sucesso
- **rejected** (rejeitada): Operação falhou

## Uso básico

### Criar uma Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // Operação assíncrona
  const success = true;

  if (success) {
    resolve('Sucesso!'); // Mudar o estado da Promise para fulfilled
  } else {
    reject('Falha!'); // Mudar o estado da Promise para rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Sucesso!'
  })
  .catch((error) => {
    console.log(error); // 'Falha!'
  });
```

### Aplicação prática: Processar requisições API

```js
// Criar uma função comum para processar requisições API
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // Verificar se a response está na faixa 200 ~ 299
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Converter a response para JSON e retornar
    })
    .catch((error) => {
      // Verificar se a rede está com problemas ou se a requisição foi rejeitada
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // Lançar o erro
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('User data received:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## Métodos da Promise

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // Tratar o caso de sucesso
    return result;
  })
  .catch((error) => {
    // Tratar erros
    console.error(error);
  })
  .finally(() => {
    // Sempre executado, independentemente de sucesso ou falha
    console.log('Promise concluída');
  });
```

### Promise.all()

Só é cumprida quando todas as Promise são concluídas. Falha se qualquer uma falhar.

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**Quando usar**: Quando é necessário esperar que múltiplas requisições API sejam concluídas antes de continuar a execução.

### Promise.race()

Retorna o resultado da primeira Promise concluída (seja sucesso ou falha).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('Número 1'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Número 2'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'Número 2' (porque foi concluída mais rápido)
});
```

**Quando usar**: Definir timeout de requisição, obter apenas a resposta mais rápida.

### Promise.allSettled()

Espera que todas as Promise sejam concluídas (sucesso ou falha) e retorna todos os resultados.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Erro');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Erro' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Quando usar**: Quando é necessário conhecer os resultados de todas as Promise, mesmo que algumas falhem.

### Promise.any()

Retorna a primeira Promise bem-sucedida. Só falha se todas falharem.

```js
const promise1 = Promise.reject('Erro 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Sucesso'), 100)
);
const promise3 = Promise.reject('Erro 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Sucesso'
});
```

**Quando usar**: Múltiplos recursos de backup, basta que um tenha sucesso.

## Perguntas de entrevista

### Pergunta 1: Encadeamento de Promise e tratamento de erros

Determine a saída do código a seguir:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('This will not run'));
```

#### Análise

Vamos analisar o processo de execução passo a passo:

```js
Promise.resolve(1) // Valor de retorno: 1
  .then((x) => x + 1) // x = 1, retorna 2
  .then(() => {
    throw new Error('My Error'); // Lança erro, vai para o catch
  })
  .catch((e) => 1) // Captura o erro, retorna 1 (Importante: aqui retorna um valor normal)
  .then((x) => x + 1) // x = 1, retorna 2
  .then((x) => console.log(x)) // Exibe 2
  .catch((e) => console.log('This will not run')); // Não é executado
```

**Resposta: 2**

#### Conceitos-chave

1. **catch captura o erro e retorna um valor normal**: Quando `catch()` retorna um valor normal, a cadeia de Promise continua executando os `.then()` seguintes
2. **then após catch continua executando**: Porque o erro já foi tratado, a cadeia de Promise volta ao estado normal
3. **O último catch não é executado**: Porque nenhum novo erro foi lançado

Se quiser que o erro continue se propagando, é necessário relançá-lo no `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Erro capturado');
    throw e; // Relançar o erro
  })
  .then((x) => x + 1) // Não é executado
  .then((x) => console.log(x)) // Não é executado
  .catch((e) => console.log('This will run')); // É executado
```

### Pergunta 2: Event Loop e ordem de execução

> Esta pergunta inclui conceitos de Event Loop

Determine a saída do código a seguir:

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

#### Entendendo a ordem de execução

Primeiro vejamos `d()`:

```js
function d() {
  setTimeout(c, 100); // 4. Macro task, atraso 100ms, executado por último
  const temp = Promise.resolve().then(a); // 2. Micro task, executado após código síncrono
  console.log('Warrior'); // 1. Execução síncrona, saída imediata
  setTimeout(b, 0); // 3. Macro task, atraso 0ms, mas ainda é macro task
}
```

Análise da ordem de execução:

1. **Código síncrono**: `console.log('Warrior')` → Exibe `Warrior`
2. **Micro task**: `Promise.resolve().then(a)` → Executa `a()`, exibe `Warlock`
3. **Macro task**:
   - `setTimeout(b, 0)` é executado primeiro (atraso 0ms)
   - Executa `b()`, exibe `Druid`
   - `Promise.resolve().then(...)` dentro de `b()` é um micro task, executado imediatamente, exibe `Rogue`
4. **Macro task**: `setTimeout(c, 100)` executado por último (atraso 100ms), exibe `Mage`

#### Resposta

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Conceitos-chave

- **Código síncrono** > **Micro task (Promise)** > **Macro task (setTimeout)**
- `.then()` da Promise pertence a micro task, é executado após o macro task atual terminar e antes do próximo macro task começar
- `setTimeout` mesmo com atraso de 0 ainda é macro task, executado após todos os micro tasks

### Pergunta 3: Síncrono e assíncrono no construtor de Promise

Determine a saída do código a seguir:

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// output ?
```

#### Atenção ao bloco Promise

O ponto-chave desta questão: **O código dentro do construtor de Promise é executado sincronamente**, apenas `.then()` e `.catch()` são assíncronos.

Análise da ordem de execução:

```js
console.log(1); // 1. Síncrono, exibe 1
setTimeout(() => console.log(2), 1000); // 5. Macro task, atraso 1000ms
setTimeout(() => console.log(3), 0); // 4. Macro task, atraso 0ms

new Promise((resolve, reject) => {
  console.log(4); // 2. Síncrono! Dentro do construtor de Promise é síncrono, exibe 4
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task, exibe 6
});

console.log(7); // 3. Síncrono, exibe 7
```

Fluxo de execução:

1. **Execução síncrona**: 1 → 4 → 7
2. **Micro task**: 6
3. **Macro task** (por tempo de atraso): 3 → 2

#### Resposta

```
1
4
7
6
3
2
```

#### Conceitos-chave

1. **O código dentro do construtor de Promise é executado sincronamente**: `console.log(4)` não é assíncrono
2. **Apenas `.then()` e `.catch()` são assíncronos**: Pertencem a micro tasks
3. **Ordem de execução**: Código síncrono → micro task → macro task

## Armadilhas comuns

### 1. Esquecer return

Esquecer `return` em uma cadeia de Promise faz com que o `.then()` seguinte receba `undefined`:

```js
// ❌ Errado
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // Esqueceu return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ Correto
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // Lembrar do return
  })
  .then((posts) => {
    console.log(posts); // Dados corretos
  });
```

### 2. Esquecer catch para erros

Erros de Promise não capturados causam UnhandledPromiseRejection:

```js
// ❌ Pode causar erros não capturados
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ Adicionar catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Ocorreu um erro:', error);
  });
```

### 3. Abuso do construtor de Promise

Não é necessário encapsular em Promise funções que já retornam uma Promise:

```js
// ❌ Encapsulamento desnecessário
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ Retornar diretamente
function fetchData() {
  return fetch(url);
}
```

### 4. Encadear múltiplos catch

Cada `catch()` só captura erros anteriores a ele:

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Capturado:', e.message); // Capturado: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Capturado:', e.message); // Capturado: Error 2
  });
```

## Tópicos relacionados

- [async/await](/docs/async-await) - Açúcar sintático mais elegante para Promise
- [Event Loop](/docs/event-loop) - Compreensão profunda do mecanismo assíncrono do JavaScript

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
