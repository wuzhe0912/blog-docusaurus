---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Qu'est-ce qu'une Promise ?

Promise est une nouvelle fonctionnalité d'ES6, principalement utilisée pour résoudre le problème du callback hell et rendre le code plus facile à lire. Une Promise représente l'achèvement ou l'échec éventuel d'une opération asynchrone, ainsi que sa valeur résultante.

Une Promise a trois états :

- **pending** (en attente) : État initial
- **fulfilled** (accompli) : Opération terminée avec succès
- **rejected** (rejeté) : Opération échouée

## Utilisation de base

### Créer une Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // Opération asynchrone
  const success = true;

  if (success) {
    resolve('Succès !'); // Changer l'état de la Promise en fulfilled
  } else {
    reject('Échec !'); // Changer l'état de la Promise en rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Succès !'
  })
  .catch((error) => {
    console.log(error); // 'Échec !'
  });
```

### Application pratique : Traiter les requêtes API

```js
// Créer une fonction commune pour traiter les requêtes API
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // Vérifier si la response est dans la plage 200 ~ 299
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Convertir la response en JSON et retourner
    })
    .catch((error) => {
      // Vérifier si le réseau est anormal ou si la requête a été rejetée
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // Relancer l'erreur
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

## Méthodes de Promise

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // Traiter le cas de succès
    return result;
  })
  .catch((error) => {
    // Traiter les erreurs
    console.error(error);
  })
  .finally(() => {
    // Toujours exécuté, que ce soit un succès ou un échec
    console.log('Promise terminée');
  });
```

### Promise.all()

N'est accomplie que lorsque toutes les Promise sont accomplies. Échoue dès qu'une seule échoue.

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

**Quand l'utiliser** : Lorsqu'il faut attendre que plusieurs requêtes API soient toutes terminées avant de continuer.

### Promise.race()

Retourne le résultat de la première Promise terminée (succès ou échec).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('Numéro 1'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Numéro 2'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'Numéro 2' (car terminée plus rapidement)
});
```

**Quand l'utiliser** : Définir un timeout de requête, ne prendre que la réponse la plus rapide.

### Promise.allSettled()

Attend que toutes les Promise soient terminées (succès ou échec) et retourne tous les résultats.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Erreur');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Erreur' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Quand l'utiliser** : Lorsqu'il faut connaître les résultats de toutes les Promise, même si certaines échouent.

### Promise.any()

Retourne la première Promise réussie. N'échoue que si toutes échouent.

```js
const promise1 = Promise.reject('Erreur 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Succès'), 100)
);
const promise3 = Promise.reject('Erreur 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Succès'
});
```

**Quand l'utiliser** : Plusieurs ressources de secours, il suffit qu'une seule réussisse.

## Questions d'entretien

### Question 1 : Chaînage de Promise et gestion des erreurs

Déterminez la sortie du code suivant :

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

#### Analyse

Analysons le processus d'exécution étape par étape :

```js
Promise.resolve(1) // Valeur de retour : 1
  .then((x) => x + 1) // x = 1, retourne 2
  .then(() => {
    throw new Error('My Error'); // Lance une erreur, va au catch
  })
  .catch((e) => 1) // Capture l'erreur, retourne 1 (Important : ici une valeur normale est retournée)
  .then((x) => x + 1) // x = 1, retourne 2
  .then((x) => console.log(x)) // Affiche 2
  .catch((e) => console.log('This will not run')); // Ne s'exécute pas
```

**Réponse : 2**

#### Concepts clés

1. **catch capture l'erreur et retourne une valeur normale** : Quand `catch()` retourne une valeur normale, la chaîne de Promise continue d'exécuter les `.then()` suivants
2. **then après catch continue de s'exécuter** : Car l'erreur a été traitée, la chaîne de Promise revient à l'état normal
3. **Le dernier catch ne s'exécute pas** : Car aucune nouvelle erreur n'a été lancée

Si on veut que l'erreur continue de se propager, il faut la relancer dans le `catch` :

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Erreur capturée');
    throw e; // Relancer l'erreur
  })
  .then((x) => x + 1) // Ne s'exécute pas
  .then((x) => console.log(x)) // Ne s'exécute pas
  .catch((e) => console.log('This will run')); // S'exécute
```

### Question 2 : Event Loop et ordre d'exécution

> Cette question inclut des concepts d'Event Loop

Déterminez la sortie du code suivant :

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

#### Comprendre l'ordre d'exécution

Regardons d'abord `d()` :

```js
function d() {
  setTimeout(c, 100); // 4. Macro task, délai 100ms, exécuté en dernier
  const temp = Promise.resolve().then(a); // 2. Micro task, exécuté après le code synchrone
  console.log('Warrior'); // 1. Exécution synchrone, sortie immédiate
  setTimeout(b, 0); // 3. Macro task, délai 0ms, mais reste un macro task
}
```

Analyse de l'ordre d'exécution :

1. **Code synchrone** : `console.log('Warrior')` → Affiche `Warrior`
2. **Micro task** : `Promise.resolve().then(a)` → Exécute `a()`, affiche `Warlock`
3. **Macro task** :
   - `setTimeout(b, 0)` s'exécute d'abord (délai 0ms)
   - Exécute `b()`, affiche `Druid`
   - `Promise.resolve().then(...)` dans `b()` est un micro task, s'exécute immédiatement, affiche `Rogue`
4. **Macro task** : `setTimeout(c, 100)` s'exécute en dernier (délai 100ms), affiche `Mage`

#### Réponse

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Concepts clés

- **Code synchrone** > **Micro task (Promise)** > **Macro task (setTimeout)**
- `.then()` de Promise appartient aux micro tasks, exécuté après la fin du macro task actuel et avant le début du prochain
- `setTimeout` même avec un délai de 0 reste un macro task, exécuté après tous les micro tasks

### Question 3 : Synchrone et asynchrone dans le constructeur de Promise

Déterminez la sortie du code suivant :

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

#### Attention au bloc Promise

La clé de cette question : **Le code dans le constructeur de Promise est exécuté de manière synchrone**, seuls `.then()` et `.catch()` sont asynchrones.

Analyse de l'ordre d'exécution :

```js
console.log(1); // 1. Synchrone, affiche 1
setTimeout(() => console.log(2), 1000); // 5. Macro task, délai 1000ms
setTimeout(() => console.log(3), 0); // 4. Macro task, délai 0ms

new Promise((resolve, reject) => {
  console.log(4); // 2. Synchrone ! Dans le constructeur de Promise c'est synchrone, affiche 4
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task, affiche 6
});

console.log(7); // 3. Synchrone, affiche 7
```

Flux d'exécution :

1. **Exécution synchrone** : 1 → 4 → 7
2. **Micro task** : 6
3. **Macro task** (par temps de délai) : 3 → 2

#### Réponse

```
1
4
7
6
3
2
```

#### Concepts clés

1. **Le code dans le constructeur de Promise est exécuté de manière synchrone** : `console.log(4)` n'est pas asynchrone
2. **Seuls `.then()` et `.catch()` sont asynchrones** : Ils appartiennent aux micro tasks
3. **Ordre d'exécution** : Code synchrone → micro task → macro task

## Pièges courants

### 1. Oublier return

Oublier `return` dans une chaîne de Promise fait que le `.then()` suivant reçoit `undefined` :

```js
// ❌ Incorrect
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // return oublié
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ Correct
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // Ne pas oublier return
  })
  .then((posts) => {
    console.log(posts); // Données correctes
  });
```

### 2. Oublier catch pour les erreurs

Les erreurs Promise non capturées provoquent UnhandledPromiseRejection :

```js
// ❌ Peut causer des erreurs non capturées
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ Ajouter catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Une erreur est survenue :', error);
  });
```

### 3. Abus du constructeur de Promise

Il n'est pas nécessaire d'encapsuler dans un Promise des fonctions qui retournent déjà un Promise :

```js
// ❌ Encapsulation inutile
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ Retourner directement
function fetchData() {
  return fetch(url);
}
```

### 4. Enchaîner plusieurs catch

Chaque `catch()` ne capture que les erreurs qui le précèdent :

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Capturé :', e.message); // Capturé : Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Capturé :', e.message); // Capturé : Error 2
  });
```

## Sujets connexes

- [async/await](/docs/async-await) - Sucre syntaxique plus élégant pour les Promise
- [Event Loop](/docs/event-loop) - Compréhension approfondie du mécanisme asynchrone de JavaScript

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
