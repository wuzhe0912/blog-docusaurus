---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> Qu'est-ce que Set et Map ?

`Set` et `Map` sont deux nouvelles structures de données introduites dans ES6, offrant des solutions plus adaptées à certains scénarios que les objets et tableaux traditionnels.

### Set (Ensemble)

**Définition** : `Set` est une collection de **valeurs uniques**, similaire au concept d'ensemble en mathématiques.

**Caractéristiques** :

- Les valeurs stockées **ne se répètent pas**
- Utilise `===` pour déterminer l'égalité des valeurs
- Conserve l'ordre d'insertion
- Peut stocker tout type de valeur (types primitifs ou objets)

**Utilisation de base** :

```javascript
// Créer un Set
const set = new Set();

// Ajouter des valeurs
set.add(1);
set.add(2);
set.add(2); // Les valeurs en double ne sont pas ajoutées
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// Vérifier si une valeur existe
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// Supprimer une valeur
set.delete(2);
console.log(set.has(2)); // false

// Vider le Set
set.clear();
console.log(set.size); // 0
```

**Créer un Set à partir d'un tableau** :

```javascript
// Supprimer les doublons d'un tableau
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// Reconvertir en tableau
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// Forme abrégée
const uniqueArr2 = [...new Set(arr)];
```

### Map (Carte)

**Définition** : `Map` est une collection de **paires clé-valeur**, similaire à un objet, mais les clés peuvent être de tout type.

**Caractéristiques** :

- Les clés peuvent être de tout type (chaînes, nombres, objets, fonctions, etc.)
- Conserve l'ordre d'insertion
- Possède la propriété `size`
- L'ordre d'itération correspond à l'ordre d'insertion

**Utilisation de base** :

```javascript
// Créer un Map
const map = new Map();

// Ajouter des paires clé-valeur
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// Obtenir des valeurs
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// Vérifier si une clé existe
console.log(map.has('name')); // true

// Supprimer une paire clé-valeur
map.delete('name');

// Obtenir la taille
console.log(map.size); // 3

// Vider le Map
map.clear();
```

**Créer un Map à partir d'un tableau** :

```javascript
// Créer à partir d'un tableau bidimensionnel
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// Créer à partir d'un objet
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Différences entre Set et Array

| Caractéristique     | Set                    | Array                    |
| ------------------- | ---------------------- | ------------------------ |
| Valeurs en double   | Non autorisées         | Autorisées               |
| Accès par index     | Non supporté           | Supporté                 |
| Performance de recherche | O(1)              | O(n)                     |
| Ordre d'insertion   | Conservé               | Conservé                 |
| Méthodes courantes  | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Scénarios d'utilisation** :

```javascript
// ✅ Adapté pour Set : des valeurs uniques sont nécessaires
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Adapté pour Set : vérification rapide de l'existence
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('La page d\'accueil a déjà été visitée');
}

// ✅ Adapté pour Array : index ou valeurs en double nécessaires
const scores = [100, 95, 100, 90]; // Doublons autorisés
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Différences entre Map et Object

| Caractéristique     | Map                | Object                     |
| ------------------- | ------------------ | -------------------------- |
| Type de clé         | Tout type          | Chaîne ou Symbol           |
| Taille              | Propriété `size`   | Calcul manuel nécessaire   |
| Clés par défaut     | Aucune             | Chaîne de prototypes       |
| Ordre d'itération   | Ordre d'insertion  | ES2015+ conserve l'ordre d'insertion |
| Performance         | Plus rapide pour ajouts/suppressions fréquents | Plus rapide dans les cas généraux |
| JSON                | Non supporté directement | Support natif           |

**Scénarios d'utilisation** :

```javascript
// ✅ Adapté pour Map : les clés ne sont pas des chaînes
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Adapté pour Map : ajouts/suppressions fréquents nécessaires
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Adapté pour Object : structure statique, JSON nécessaire
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // Peut être sérialisé directement
```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Supprimer les doublons d'un tableau

Implémentez une fonction qui supprime les valeurs en double d'un tableau.

```javascript
function removeDuplicates(arr) {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Méthode 1 : Utiliser Set (recommandé)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Méthode 2 : Utiliser filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Méthode 3 : Utiliser reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Comparaison des performances** :

- Méthode Set : O(n), la plus rapide
- filter + indexOf : O(n²), plus lent
- reduce + includes : O(n²), plus lent

</details>

### Question 2 : Vérifier si un tableau a des doublons

Implémentez une fonction qui vérifie si un tableau contient des valeurs en double.

```javascript
function hasDuplicates(arr) {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Méthode 1 : Utiliser Set (recommandé)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Méthode 2 : Utiliser la méthode has de Set**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Méthode 3 : Utiliser indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Comparaison des performances** :

- Méthode Set 1 : O(n), la plus rapide
- Méthode Set 2 : O(n), peut se terminer plus tôt en moyenne
- Méthode indexOf : O(n²), plus lent

</details>

### Question 3 : Compter la fréquence des éléments

Implémentez une fonction qui compte le nombre d'occurrences de chaque élément dans un tableau.

```javascript
function countOccurrences(arr) {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Méthode 1 : Utiliser Map (recommandé)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Méthode 2 : Utiliser reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Méthode 3 : Convertir en objet**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Avantages de l'utilisation de Map** :

- Les clés peuvent être de tout type (objets, fonctions, etc.)
- Possède la propriété `size`
- L'ordre d'itération correspond à l'ordre d'insertion

</details>

### Question 4 : Trouver l'intersection de deux tableaux

Implémentez une fonction qui trouve l'intersection (éléments communs) de deux tableaux.

```javascript
function intersection(arr1, arr2) {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Méthode 1 : Utiliser Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Méthode 2 : Utiliser filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Méthode 3 : Utiliser filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Comparaison des performances** :

- Méthode Set : O(n + m), la plus rapide
- filter + includes : O(n × m), plus lent

</details>

### Question 5 : Trouver la différence de deux tableaux

Implémentez une fonction qui trouve la différence de deux tableaux (éléments dans arr1 qui ne sont pas dans arr2).

```javascript
function difference(arr1, arr2) {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Méthode 1 : Utiliser Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Méthode 2 : Utiliser Set pour dédupliquer puis filtrer**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Méthode 3 : Utiliser includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Comparaison des performances** :

- Méthode Set : O(n + m), la plus rapide
- Méthode includes : O(n × m), plus lent

</details>

### Question 6 : Implémenter un LRU Cache

Utilisez Map pour implémenter un cache LRU (Least Recently Used).

```javascript
class LRUCache {
  constructor(capacity) {
    // Votre implémentation
  }

  get(key) {
    // Votre implémentation
  }

  put(key, value) {
    // Votre implémentation
  }
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Implémentation** :

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // Déplacer la clé à la fin (indique une utilisation récente)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // Si la clé existe déjà, la supprimer d'abord
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Si la capacité est pleine, supprimer la clé la plus ancienne (la première)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Ajouter la paire clé-valeur (automatiquement placée à la fin)
    this.cache.set(key, value);
  }
}

// Exemple d'utilisation
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // Supprime la clé 2
console.log(cache.get(2)); // -1 (déjà supprimée)
console.log(cache.get(3)); // 'three'
```

**Explication** :

- Map conserve l'ordre d'insertion, la première clé est la plus ancienne
- Lors du `get`, la clé est déplacée à la fin pour indiquer une utilisation récente
- Lors du `put`, si la capacité est pleine, la première clé est supprimée

</details>

### Question 7 : Utiliser des objets comme clés de Map

Expliquez le résultat de sortie du code suivant.

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Explication** :

- `obj1` et `obj2` ont le même contenu, mais sont des **instances d'objets différentes**
- Map utilise la **comparaison par référence** (reference comparison), pas la comparaison par valeur
- Par conséquent, `obj1` et `obj2` sont traités comme des clés différentes
- Si un objet ordinaire est utilisé comme Map, l'objet est converti en chaîne `[object Object]`, faisant que tous les objets deviennent la même clé

**Comparaison avec les objets ordinaires** :

```javascript
// Objet ordinaire : les clés sont converties en chaînes
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (écrasé)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]'] (une seule clé)

// Map : conserve la référence de l'objet
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet et WeakMap

> Différences entre WeakSet et WeakMap

### WeakSet

**Caractéristiques** :

- Ne peut stocker que des **objets** (pas de types primitifs)
- **Référence faible** : si l'objet n'a plus d'autres références, il sera collecté par le garbage collector
- N'a pas de propriété `size`
- Non itérable
- N'a pas de méthode `clear`

**Scénario d'utilisation** : Marquer des objets, éviter les fuites de mémoire

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// Quand obj1 n'a plus d'autres références, il sera collecté
// La référence dans weakSet sera également nettoyée automatiquement
```

### WeakMap

**Caractéristiques** :

- Les clés ne peuvent être que des **objets** (pas de types primitifs)
- **Référence faible** : si l'objet clé n'a plus d'autres références, il sera collecté par le garbage collector
- N'a pas de propriété `size`
- Non itérable
- N'a pas de méthode `clear`

**Scénario d'utilisation** : Stocker des données privées d'objets, éviter les fuites de mémoire

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// Quand obj1 n'a plus d'autres références, il sera collecté
// La paire clé-valeur dans weakMap sera également nettoyée automatiquement
```

### Comparaison WeakSet/WeakMap vs Set/Map

| Caractéristique      | Set/Map              | WeakSet/WeakMap          |
| -------------------- | -------------------- | ------------------------ |
| Type de clé/valeur   | Tout type            | Objets uniquement        |
| Référence faible     | Non                  | Oui                      |
| Itérable             | Oui                  | Non                      |
| Propriété size       | Oui                  | Non                      |
| Méthode clear        | Oui                  | Non                      |
| Garbage collection   | Pas de nettoyage automatique | Nettoyage automatique |

## 6. Best Practices

> Meilleures pratiques

### Pratiques recommandées

```javascript
// 1. Utiliser Set quand des valeurs uniques sont nécessaires
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Utiliser Set quand une recherche rapide est nécessaire
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // Autoriser l'accès
}

// 3. Utiliser Map quand les clés ne sont pas des chaînes
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Utiliser Map quand des ajouts/suppressions fréquents sont nécessaires
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Utiliser WeakMap pour associer des données d'objets et éviter les fuites de mémoire
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Pratiques à éviter

```javascript
// 1. Ne pas utiliser Set pour remplacer toutes les fonctionnalités des tableaux
// ❌ Mauvais : utiliser Set quand l'accès par index est nécessaire
const set = new Set([1, 2, 3]);
// set[0] // undefined, impossible d'accéder par index

// ✅ Bon : utiliser un tableau quand l'accès par index est nécessaire
const arr = [1, 2, 3];
arr[0]; // 1

// 2. Ne pas utiliser Map pour remplacer toutes les fonctionnalités des objets
// ❌ Mauvais : utiliser Map pour des structures statiques simples
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ Bon : utiliser un objet pour des structures simples
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Ne pas confondre Set et Map
// ❌ Erreur : Set n'a pas de paires clé-valeur
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ Correct : Map a des paires clé-valeur
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> Résumé d'entretien

### Mémorisation rapide

**Set (Ensemble)** :

- Valeurs uniques, pas de doublons
- Recherche rapide : O(1)
- Adapté pour : déduplication, vérification rapide de l'existence

**Map (Carte)** :

- Paires clé-valeur, les clés peuvent être de tout type
- Conserve l'ordre d'insertion
- Adapté pour : clés non-chaîne, ajouts/suppressions fréquents

**WeakSet/WeakMap** :

- Référence faible, garbage collection automatique
- Clés/valeurs uniquement des objets
- Adapté pour : éviter les fuites de mémoire

### Exemple de réponse en entretien

**Q : Quand doit-on utiliser Set plutôt qu'un tableau ?**

> "On doit utiliser Set quand il faut garantir l'unicité des valeurs ou vérifier rapidement si une valeur existe. La méthode `has` de Set a une complexité temporelle O(1), tandis que `includes` d'un tableau est O(n). Par exemple, pour supprimer les doublons d'un tableau ou vérifier les permissions d'un utilisateur, Set est plus efficace."

**Q : Quelle est la différence entre Map et Object ?**

> "Les clés de Map peuvent être de tout type, y compris des objets, des fonctions, etc., tandis que les clés d'un objet ne peuvent être que des chaînes ou des Symbols. Map possède la propriété `size` pour obtenir directement la taille, tandis qu'un objet nécessite un calcul manuel. Map conserve l'ordre d'insertion et n'a pas de chaîne de prototypes, ce qui le rend adapté au stockage de données pures. Quand on a besoin d'utiliser des objets comme clés ou que des ajouts/suppressions fréquents sont nécessaires, Map est le meilleur choix."

**Q : Quelle est la différence entre WeakMap et Map ?**

> "Les clés de WeakMap ne peuvent être que des objets et utilisent des références faibles. Quand l'objet clé n'a plus d'autres références, l'entrée correspondante dans WeakMap sera automatiquement collectée par le garbage collector, ce qui évite les fuites de mémoire. WeakMap n'est pas itérable et n'a pas de propriété `size`. Il est adapté au stockage de données privées ou de métadonnées d'objets ; quand l'objet est détruit, les données associées sont également nettoyées automatiquement."

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
