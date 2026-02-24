---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Cos'è una Promise?

Promise è una funzionalità ES6 introdotta principalmente per risolvere il callback hell e rendere il codice asincrono più facile da leggere e mantenere.
Una Promise rappresenta il completamento (o fallimento) eventuale di un'operazione asincrona e il suo valore risultante.

Una Promise ha tre stati:

- **pending**: stato iniziale
- **fulfilled**: operazione completata con successo
- **rejected**: operazione fallita

## Uso di base (Basic Usage)

### Creare una Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // operazione asincrona
  const success = true;

  if (success) {
    resolve('Successo!'); // la Promise diventa fulfilled
  } else {
    reject('Fallito!'); // la Promise diventa rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Successo!'
  })
  .catch((error) => {
    console.log(error); // 'Fallito!'
  });
```

### Esempio reale: gestione delle richieste API

```js
// funzione condivisa per le richieste API
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // controlla se la risposta è nell'intervallo 200~299
      if (!response.ok) {
        throw new Error('La risposta di rete non è stata ok ' + response.statusText);
      }
      return response.json(); // converte la risposta in JSON e la restituisce
    })
    .catch((error) => {
      // gestisce problemi di rete o fallimenti delle richieste
      console.log('Si è verificato un problema con la tua operazione fetch:', error);
      throw error; // rilancia per la gestione a monte
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('Dati utente ricevuti:', userData);
  })
  .catch((error) => {
    console.log('Errore:', error.message);
  });
```

## Metodi di Promise

### `.then()` / `.catch()` / `.finally()`

```js
promise
  .then((result) => {
    // gestisci il successo
    return result;
  })
  .catch((error) => {
    // gestisci l'errore
    console.error(error);
  })
  .finally(() => {
    // viene eseguito indipendentemente dal successo o fallimento
    console.log('Promise completata');
  });
```

### `Promise.all()`

Si risolve quando tutte le Promise si risolvono, e viene rifiutata immediatamente quando una qualsiasi Promise viene rifiutata.

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

**Quando usarla**: procedere solo dopo che multiple chiamate API hanno tutte avuto successo.

### `Promise.race()`

Restituisce il risultato della prima Promise che si risolve (fulfilled o rejected).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('primo'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('secondo'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'secondo' (più veloce)
});
```

**Quando usarla**: gestione del timeout delle richieste, o prendere la risposta più veloce.

### `Promise.allSettled()`

Attende che tutte le Promise si risolvano (fulfilled/rejected), poi restituisce tutti i risultati.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Errore');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Errore' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Quando usarla**: quando hai bisogno di tutti i risultati, anche se alcuni falliscono.

### `Promise.any()`

Si risolve con la prima Promise fulfilled. Viene rifiutata solo se tutte le Promise vengono rifiutate.

```js
const promise1 = Promise.reject('Errore 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Successo'), 100)
);
const promise3 = Promise.reject('Errore 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Successo'
});
```

**Quando usarla**: risorse di fallback dove un solo successo è sufficiente.

## Domande di colloquio (Interview Questions)

### Domanda 1: concatenamento di Promise e gestione degli errori

Prevedi l'output:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('Questo non verrà eseguito'));
```

#### Analisi passo passo

```js
Promise.resolve(1) // restituisce 1
  .then((x) => x + 1) // x = 1, restituisce 2
  .then(() => {
    throw new Error('My Error'); // lancia -> va al catch
  })
  .catch((e) => 1) // cattura e restituisce il valore normale 1
  .then((x) => x + 1) // x = 1, restituisce 2
  .then((x) => console.log(x)) // stampa 2
  .catch((e) => console.log('Questo non verrà eseguito')); // non eseguito
```

**Risposta: `2`**

#### Concetti chiave

1. **`catch` può recuperare con un valore normale**: quando `catch()` restituisce un valore normale, la catena continua in modalità fulfilled.
2. **`then` dopo `catch` viene comunque eseguito**: perché l'errore è stato gestito.
3. **Il `catch` finale non viene eseguito**: nessun nuovo errore è stato lanciato.

Se vuoi che l'errore continui a propagarsi, rilancialo nel `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Errore catturato');
    throw e; // rilancia
  })
  .then((x) => x + 1) // non verrà eseguito
  .then((x) => console.log(x)) // non verrà eseguito
  .catch((e) => console.log('Questo verrà eseguito')); // verrà eseguito
```

### Domanda 2: Event Loop e ordine di esecuzione

> Questa domanda testa anche la comprensione dell'Event Loop.

Prevedi l'output:

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

#### Capire l'ordine in `d()`

```js
function d() {
  setTimeout(c, 100); // 4. macro task (100ms di ritardo)
  const temp = Promise.resolve().then(a); // 2. micro task (dopo il codice sincrono)
  console.log('Warrior'); // 1. codice sincrono
  setTimeout(b, 0); // 3. macro task (0ms, comunque macro)
}
```

Ordine di esecuzione:

1. **Codice sincrono**: `console.log('Warrior')` -> `Warrior`
2. **Micro task**: `Promise.resolve().then(a)` -> esegue `a()` -> `Warlock`
3. **Macro task**:
   - `setTimeout(b, 0)` viene eseguito per primo
   - esegue `b()` -> `Druid`
   - dentro `b`, `Promise.resolve().then(...)` è un micro task -> `Rogue`
4. **Macro task**: `setTimeout(c, 100)` viene eseguito dopo -> `Mage`

#### Risposta

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Concetti chiave

- **Codice sincrono** > **Micro task (`Promise`)** > **Macro task (`setTimeout`)**
- I callback `.then()` sono micro task: vengono eseguiti dopo il macro task corrente, prima del prossimo macro task
- `setTimeout(..., 0)` è comunque un macro task e viene eseguito dopo i micro task

### Domanda 3: comportamento sincrono vs asincrono del costruttore Promise

Prevedi l'output:

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

#### Dettaglio importante

Il punto chiave: **il codice dentro il costruttore della Promise viene eseguito in modo sincrono**.
Solo i callback `.then()` / `.catch()` sono asincroni.

Analisi dell'esecuzione:

```js
console.log(1); // 1. sincrono
setTimeout(() => console.log(2), 1000); // 5. macro task (1000ms)
setTimeout(() => console.log(3), 0); // 4. macro task (0ms)

new Promise((resolve, reject) => {
  console.log(4); // 2. sincrono (dentro il costruttore)
  resolve(5);
}).then((foo) => {
  console.log(6); // micro task
});

console.log(7); // 3. sincrono
```

Flusso di esecuzione:

1. **Sincrono**: 1 -> 4 -> 7
2. **Micro task**: 6
3. **Macro task** (per ritardo): 3 -> 2

#### Risposta

```
1
4
7
6
3
2
```

#### Concetti chiave

1. **Il corpo del costruttore Promise è sincrono**: `console.log(4)` non è asincrono.
2. **Solo `.then()` e `.catch()` sono micro task asincroni**.
3. **Ordine**: codice sincrono -> micro task -> macro task.

## Insidie comuni (Common Pitfalls)

### 1. Dimenticare il `return`

Se dimentichi `return` in una catena di Promise, il `.then()` successivo riceve `undefined`.

```js
// ❌ sbagliato
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // dimenticato il return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ corretto
fetchUser()
  .then((user) => {
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log(posts); // dati corretti
  });
```

### 2. Dimenticare di catturare gli errori

Le rejection non gestite delle Promise possono interrompere il flusso e creare errori di runtime rumorosi.

```js
// ❌ potrebbe causare rejection non gestite
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ aggiungi catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Si è verificato un errore:', error);
  });
```

### 3. Uso eccessivo di `new Promise(...)`

Non avvolgere una funzione che già restituisce una Promise.

```js
// ❌ incapsulamento inutile
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ restituisci direttamente
function fetchData() {
  return fetch(url);
}
```

### 4. Concatenamento errato di catch multipli

Ogni `catch()` gestisce gli errori dalle parti precedenti della catena.

```js
Promise.resolve()
  .then(() => {
    throw new Error('Errore 1');
  })
  .catch((e) => {
    console.log('Catturato:', e.message); // Catturato: Errore 1
  })
  .then(() => {
    throw new Error('Errore 2');
  })
  .catch((e) => {
    console.log('Catturato:', e.message); // Catturato: Errore 2
  });
```

## Argomenti correlati

- [async/await](/docs/async-await) - zucchero sintattico più pulito per Promise
- [Event Loop](/docs/event-loop) - comprensione più profonda del modello asincrono

## Riferimenti

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
