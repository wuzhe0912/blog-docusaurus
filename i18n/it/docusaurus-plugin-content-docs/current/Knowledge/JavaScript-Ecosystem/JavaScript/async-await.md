---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Consigliato: leggi prima [Promise](/docs/promise) per i concetti fondamentali.

## Cos'è async/await?

`async/await` è uno zucchero sintattico introdotto in ES2017 (ES8), costruito sopra Promise.
Rende il codice asincrono più simile al codice sincrono, migliorando leggibilità e manutenibilità.

**Concetti fondamentali:**

- Una funzione `async` restituisce sempre una Promise.
- `await` può essere usato solo all'interno di una funzione `async`.
- `await` mette in pausa l'esecuzione della funzione fino a quando la Promise non si risolve.

## Sintassi di base

### Funzione `async`

La parola chiave `async` fa sì che una funzione restituisca automaticamente una Promise:

```js
// Stile tradizionale con Promise
function fetchData() {
  return Promise.resolve('data');
}

// Stile async (equivalente)
async function fetchData() {
  return 'data'; // automaticamente incapsulato come Promise.resolve('data')
}

// stesso pattern di chiamata
fetchData().then((data) => console.log(data)); // 'data'
```

### Parola chiave `await`

`await` attende una Promise e restituisce il suo valore risolto:

```js
async function getData() {
  const result = await Promise.resolve('done');
  console.log(result); // 'done'
}
```

## Promise vs async/await

### Esempio 1: semplice richiesta API

**Stile Promise:**

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Errore:', error);
      throw error;
    });
}
```

**Stile async/await:**

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Errore:', error);
    throw error;
  }
}
```

### Esempio 2: concatenamento di operazioni asincrone multiple

**Stile Promise:**

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
      console.error('Errore:', error);
    });
}
```

**Stile async/await:**

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Errore:', error);
  }
}
```

## Gestione degli errori (Error Handling)

### `try/catch` vs `.catch()`

**Usare `try/catch` con async/await:**

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Richiesta fallita:', error);
    // Qui puoi gestire diversi tipi di errore
    if (error.name === 'NetworkError') {
      // gestisci errore di rete
    }
    throw error; // rilancia o restituisci un valore di fallback
  }
}
```

**Uso misto (non raccomandato, ma funziona):**

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Richiesta fallita:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### `try/catch` annidati

Usa `try/catch` stratificati quando passaggi diversi necessitano di comportamenti di fallback diversi:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Impossibile recuperare l\'utente:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Impossibile recuperare i post:', error);
    return []; // array vuoto come fallback
  }
}
```

## Esempi pratici

### Esempio: flusso di valutazione

> Flusso: valuta compito -> verifica premio -> assegna premio -> esclusione o penalità

```js
// valuta compito
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
        reject('Hai raggiunto la soglia di esclusione');
      }
    }, 2000);
  });
}

// verifica premio
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} riceve biglietti per il cinema`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} riceve un premio al merito`);
      } else {
        reject('Nessun premio');
      }
    }, 2000);
  });
}
```

**Stile Promise:**

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Riscrittura con async/await:**

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

### Esempio: richieste concorrenti

Quando le richieste sono indipendenti, eseguile in modo concorrente.

**❌ Sbagliato: esecuzione sequenziale (più lenta):**

```js
async function fetchAllData() {
  const users = await fetchUsers(); // attesa 1 sec
  const posts = await fetchPosts(); // altri 1 sec
  const comments = await fetchComments(); // altri 1 sec
  // totale 3 sec
  return { users, posts, comments };
}
```

**✅ Corretto: esecuzione concorrente (più veloce):**

```js
async function fetchAllData() {
  // avvia tre richieste contemporaneamente
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // impiega solo il tempo della richiesta più lenta
  return { users, posts, comments };
}
```

**Usa `Promise.allSettled()` per fallimenti parziali:**

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

## Errori comuni (Common Pitfalls)

### 1. Usare `await` nei cicli (sequenziale per errore)

**❌ Sbagliato: attende ad ogni iterazione, scarse prestazioni:**

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // sequenziale, lento
    results.push(user);
  }
  return results;
}
// 10 utenti * 1s ciascuno = 10 secondi
```

**✅ Corretto: `Promise.all()` per la concorrenza:**

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// richieste concorrenti, circa 1 secondo in totale
```

**Compromesso: limitare la concorrenza:**

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
// elabora 3 alla volta per evitare troppe richieste simultanee
```

### 2. Dimenticare `await`

Senza `await`, ottieni una Promise invece del valore risolto.

```js
// ❌ sbagliato
async function getUser() {
  const user = fetchUser(1); // dimenticato await, user è una Promise
  console.log(user.name); // undefined (Promise non ha proprietà name)
}

// ✅ corretto
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // nome corretto
}
```

### 3. Usare `await` senza `async`

`await` può essere usato solo all'interno di una funzione `async`.

```js
// ❌ sbagliato: errore di sintassi
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ corretto
async function getData() {
  const data = await fetchData();
  return data;
}
```

**Top-level await:**

Negli ambienti con moduli ES2022, puoi usare `await` al livello superiore del modulo:

```js
// modulo ES2022
const data = await fetchData();
console.log(data);
```

### 4. Mancata gestione degli errori

Senza `try/catch`, gli errori possono diventare rejection non gestite.

```js
// ❌ potrebbe causare errori non gestiti
async function fetchData() {
  const response = await fetch('/api/data'); // lancia se la richiesta fallisce
  return response.json();
}

// ✅ aggiungi la gestione degli errori
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Errore:', error);
    return null; // o valore di fallback
  }
}
```

### 5. `async` restituisce sempre una Promise

Anche senza `await`, una funzione `async` restituisce comunque una Promise.

```js
async function getValue() {
  return 42; // in realtà Promise.resolve(42)
}

// usa .then() o await per ottenere il valore
getValue().then((value) => console.log(value)); // 42

// oppure
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Uso avanzato (Advanced Usage)

### Gestione del timeout

Implementa il timeout con `Promise.race()`:

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout della richiesta')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Richiesta fallita:', error.message);
    throw error;
  }
}

// utilizzo
fetchWithTimeout('/api/data', 3000); // timeout di 3 secondi
```

### Meccanismo di retry

Riprovare automaticamente in caso di errore:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;

      console.log(`Tentativo ${i + 1} fallito, nuovo tentativo tra ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// utilizzo
fetchWithRetry('/api/data', 3, 2000); // fino a 3 tentativi, intervallo di 2s
```

### Elaborazione sequenziale con mantenimento dello stato

A volte l'esecuzione sequenziale è necessaria, mantenendo tutti i risultati intermedi:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // decide il passo successivo in base al risultato precedente
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await nell'Event Loop

`async/await` è comunque basato su Promise, quindi segue le stesse regole dell'Event Loop:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// ordine di output: 1, 2, 4, 3
```

Spiegazione:

1. `console.log('1')` - sincrono
2. `test()` viene chiamata, `console.log('2')` - sincrono
3. `await Promise.resolve()` - pianifica il codice rimanente come micro task
4. `console.log('4')` - sincrono
5. il micro task viene eseguito, `console.log('3')`

## Punti chiave per i colloqui (Interview Key Points)

1. **`async/await` è zucchero sintattico sopra Promise**: sintassi più pulita, stesso modello sottostante.
2. **Usa `try/catch` per la gestione degli errori**: preferibile al `.catch()` concatenato nello stile async/await.
3. **Concorrenza vs sequenza è importante**: evita `await` alla cieca nei cicli.
4. **`async` restituisce sempre una Promise**: anche senza return espliciti di Promise.
5. **`await` richiede contesto async**: tranne il top-level await nei moduli ES2022.
6. **Comprendi il comportamento dell'Event Loop**: il codice dopo `await` viene eseguito come micro task.

## Argomenti correlati

- [Promise](/docs/promise) - fondamento di async/await
- [Event Loop](/docs/event-loop) - modello dell'ordine di esecuzione

## Riferimenti

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
