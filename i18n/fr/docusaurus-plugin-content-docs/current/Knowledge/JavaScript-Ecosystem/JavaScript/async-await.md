---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Il est recommandé de lire d'abord [Promise](/docs/promise) pour comprendre les concepts de base

## Qu'est-ce que async/await ?

`async/await` est un sucre syntaxique introduit dans ES2017 (ES8), construit sur les Promise, qui fait ressembler le code asynchrone à du code synchrone, le rendant plus facile à lire et à maintenir.

**Concepts clés** :

- Les fonctions `async` retournent toujours une Promise
- `await` ne peut être utilisé qu'à l'intérieur des fonctions `async`
- `await` met en pause l'exécution de la fonction et attend que la Promise soit résolue

## Syntaxe de base

### Fonction async

Le mot-clé `async` fait qu'une fonction retourne automatiquement une Promise :

```js
// Écriture traditionnelle avec Promise
function fetchData() {
  return Promise.resolve('données');
}

// Écriture avec async (équivalent)
async function fetchData() {
  return 'données'; // Automatiquement encapsulé dans Promise.resolve('données')
}

// La façon d'appeler est identique
fetchData().then((data) => console.log(data)); // 'données'
```

### Mot-clé await

`await` attend qu'une Promise soit résolue et retourne le résultat :

```js
async function getData() {
  const result = await Promise.resolve('terminé');
  console.log(result); // 'terminé'
}
```

## Comparaison Promise vs async/await

### Exemple 1 : Requête API simple

**Écriture avec Promise** :

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Erreur :', error);
      throw error;
    });
}
```

**Écriture avec async/await** :

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
}
```

### Exemple 2 : Chaîner plusieurs opérations asynchrones

**Écriture avec Promise** :

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
      console.error('Erreur :', error);
    });
}
```

**Écriture avec async/await** :

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Erreur :', error);
  }
}
```

## Gestion des erreurs

### try/catch vs .catch()

**async/await avec try/catch** :

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Requête échouée :', error);
    // On peut traiter différents types d'erreurs ici
    if (error.name === 'NetworkError') {
      // Traiter l'erreur réseau
    }
    throw error; // Relancer ou retourner une valeur par défaut
  }
}
```

**Utilisation mixte (non recommandé mais fonctionnel)** :

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Requête échouée :', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### try/catch multiniveau

Pour les erreurs à différentes étapes, on peut utiliser plusieurs blocs try/catch :

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Échec de récupération de l\'utilisateur :', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Échec de récupération des articles :', error);
    return []; // Retourner un tableau vide comme valeur par défaut
  }
}
```

## Exemples d'application pratique

### Exemple : Processus de correction d'examens

> Flux : Corriger l'examen → Vérifier la récompense → Attribuer la récompense → Exclusion ou punition

```js
// Corriger l'examen
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
        reject('Vous avez atteint le seuil d\'exclusion');
      }
    }, 2000);
  });
}

// Vérifier la récompense
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} obtient des billets de cinéma`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} obtient une distinction`);
      } else {
        reject('Pas de récompense pour vous');
      }
    }, 2000);
  });
}
```

**Écriture avec Promise** :

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Réécriture avec async/await** :

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

### Exemple : Exécution concurrente de plusieurs requêtes

Quand plusieurs requêtes n'ont pas de dépendances entre elles, elles doivent être exécutées simultanément :

**❌ Incorrect : Exécution séquentielle (plus lent)** :

```js
async function fetchAllData() {
  const users = await fetchUsers(); // Attendre 1 seconde
  const posts = await fetchPosts(); // Attendre encore 1 seconde
  const comments = await fetchComments(); // Attendre encore 1 seconde
  // Total 3 secondes
  return { users, posts, comments };
}
```

**✅ Correct : Exécution concurrente (plus rapide)** :

```js
async function fetchAllData() {
  // Lancer trois requêtes simultanément
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Seulement 1 seconde nécessaire (le temps de la requête la plus lente)
  return { users, posts, comments };
}
```

**Utiliser Promise.allSettled() pour gérer les échecs partiels** :

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

## Pièges courants

### 1. Utiliser await dans les boucles (exécution séquentielle)

**❌ Incorrect : Attendre à chaque itération, inefficace** :

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // Exécution séquentielle, très lent !
    results.push(user);
  }
  return results;
}
// S'il y a 10 utilisateurs et que chaque requête prend 1 seconde, cela prend 10 secondes au total
```

**✅ Correct : Exécution concurrente avec Promise.all()** :

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 utilisateurs en requêtes concurrentes, seulement 1 seconde
```

**Compromis : Limiter la concurrence** :

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
// Traiter 3 à la fois, évitant d'envoyer trop de requêtes simultanément
```

### 2. Oublier d'utiliser await

Oublier `await` donne un Promise au lieu de la valeur réelle :

```js
// ❌ Incorrect
async function getUser() {
  const user = fetchUser(1); // await oublié, user est un Promise
  console.log(user.name); // undefined (Promise n'a pas de propriété name)
}

// ✅ Correct
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // Nom correct
}
```

### 3. Utiliser await sans async

`await` ne peut être utilisé qu'à l'intérieur de fonctions `async` :

```js
// ❌ Incorrect : Erreur de syntaxe
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ Correct
async function getData() {
  const data = await fetchData();
  return data;
}
```

**await de niveau supérieur (Top-level await)** :

Dans ES2022 et les environnements de modules, on peut utiliser await au niveau supérieur d'un module :

```js
// ES2022 module
const data = await fetchData(); // Utilisable au niveau supérieur du module
console.log(data);
```

### 4. Omission de la gestion des erreurs

Sans try/catch, les erreurs ne seront pas capturées :

```js
// ❌ Peut entraîner des erreurs non capturées
async function fetchData() {
  const response = await fetch('/api/data'); // En cas d'échec, une erreur sera lancée
  return response.json();
}

// ✅ Ajouter la gestion des erreurs
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Erreur :', error);
    return null; // Ou retourner une valeur par défaut
  }
}
```

### 5. Les fonctions async retournent toujours une Promise

Même sans utiliser `await`, une fonction `async` retourne une Promise :

```js
async function getValue() {
  return 42; // Retourne en réalité Promise.resolve(42)
}

// Il faut utiliser .then() ou await pour obtenir la valeur
getValue().then((value) => console.log(value)); // 42

// Ou
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Applications avancées

### Gestion du timeout

Implémentation d'un mécanisme de timeout avec Promise.race() :

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Délai d\'attente dépassé')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Requête échouée :', error.message);
    throw error;
  }
}

// Utilisation
fetchWithTimeout('/api/data', 3000); // Timeout de 3 secondes
```

### Mécanisme de réessai

Implémentation d'un réessai automatique en cas d'échec :

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Dernier essai échoué, lancer l'erreur

      console.log(`Tentative ${i + 1} échouée, nouvel essai dans ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Utilisation
fetchWithRetry('/api/data', 3, 2000); // Maximum 3 tentatives, intervalle de 2 secondes
```

### Traitement séquentiel avec conservation de l'état

Parfois il faut exécuter séquentiellement tout en conservant tous les résultats :

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // On peut décider de l'étape suivante en fonction du résultat précédent
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await dans l'Event Loop

async/await reste fondamentalement du Promise, et suit donc les mêmes règles de l'Event Loop :

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// Ordre de sortie : 1, 2, 4, 3
```

Analyse :

1. `console.log('1')` - Exécution synchrone
2. `test()` est appelé, `console.log('2')` - Exécution synchrone
3. `await Promise.resolve()` - Le code suivant est placé dans la file des micro tasks
4. `console.log('4')` - Exécution synchrone
5. Le micro task s'exécute, `console.log('3')`

## Points clés pour les entretiens

1. **async/await est du sucre syntaxique pour Promise** : Plus lisible mais fondamentalement identique
2. **La gestion des erreurs utilise try/catch** : Pas `.catch()`
3. **Attention concurrent vs séquentiel** : Ne pas utiliser await aveuglément dans les boucles
4. **Les fonctions async retournent toujours un Promise** : Même sans return Promise explicite
5. **await uniquement dans les fonctions async** : Sauf top-level await (ES2022)
6. **Comprendre l'Event Loop** : Le code après await est un micro task

## Sujets connexes

- [Promise](/docs/promise) - Base d'async/await
- [Event Loop](/docs/event-loop) - Comprendre l'ordre d'exécution

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
