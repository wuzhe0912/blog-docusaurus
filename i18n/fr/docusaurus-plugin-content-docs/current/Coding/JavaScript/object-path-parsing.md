---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Description du problème

Implémenter des fonctions d'analyse de chemin d'objet, capables d'obtenir et de définir les valeurs d'objets imbriqués selon une chaîne de chemin.

### Exigences

1. **Fonction `get`** : Obtenir la valeur d'un objet selon un chemin

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Fonction `set`** : Définir la valeur d'un objet selon un chemin

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Implémentation de la fonction get

### Méthode 1 : Utiliser split et reduce

**Idée** : Diviser la chaîne de chemin en un tableau, puis utiliser `reduce` pour accéder couche par couche à l'objet.

```javascript
function get(obj, path, defaultValue) {
  // Gérer les cas limites
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Diviser la chaîne de chemin en tableau
  const keys = path.split('.');

  // Utiliser reduce pour accéder couche par couche
  const result = keys.reduce((current, key) => {
    // Si la valeur courante est null ou undefined, retourner undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // Si le résultat est undefined, retourner la valeur par défaut
  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined（nécessite le traitement des indices de tableau）
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Méthode 2 : Support des indices de tableau

**Idée** : Traiter les indices de tableau dans le chemin, comme `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Expression régulière : noms de propriété ou indices de tableau
  // Correspond à 'a', 'b', '[0]', 'c' etc.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Traiter l'indice de tableau [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Méthode 3 : Implémentation complète (gestion des cas limites)

```javascript
function get(obj, path, defaultValue) {
  // Gérer les cas limites
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Analyser le chemin : support des formats 'a.b.c' et 'a.b[0].c'
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Si la valeur courante est null ou undefined, retourner la valeur par défaut
    if (result == null) {
      return defaultValue;
    }

    // Traiter l'indice de tableau
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj（chemin vide retourne l'objet original）
```

## 3. Implementation: set Function

> Implémentation de la fonction set

### Méthode 1 : Implémentation de base

**Idée** : Créer une structure d'objets imbriqués selon le chemin, puis définir la valeur.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Analyser le chemin
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Créer la structure imbriquée
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Traiter l'indice de tableau
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // Si la clé n'existe pas ou n'est pas un objet, créer un nouvel objet
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Définir la valeur de la dernière clé
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // Si ce n'est pas un tableau, il faut le convertir
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Méthode 2 : Implémentation complète (gestion des tableaux et objets)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Parcourir jusqu'à l'avant-dernière clé, créer la structure imbriquée
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Traiter l'indice de tableau
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // S'assurer que c'est un tableau
      if (!Array.isArray(current)) {
        // Convertir l'objet en tableau (conserver les indices existants)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // S'assurer que l'indice existe
      if (current[index] == null) {
        // Déterminer si la clé suivante est un tableau ou un objet
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Traiter les clés d'objet
      if (current[key] == null) {
        // Déterminer si la clé suivante est un tableau ou un objet
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // Si la valeur existe mais n'est pas un objet, il faut la convertir
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Définir la valeur de la dernière clé
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Méthode 3 : Version simplifiée (objets uniquement, sans indices de tableau)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Créer la structure imbriquée (sauf la dernière clé)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Définir la valeur de la dernière clé
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Implémentation basique de la fonction get

Implémentez une fonction `get` qui obtient la valeur d'un objet imbriqué selon une chaîne de chemin.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Points clés** :

- Gérer les cas null/undefined
- Utiliser split pour diviser le chemin
- Accéder couche par couche aux propriétés de l'objet
- Retourner la valeur par défaut quand le chemin n'existe pas

</details>

### Question 2 : Fonction get avec support des indices de tableau

Étendez la fonction `get` pour qu'elle supporte les indices de tableau, comme `'a.b[0].c'`.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Utiliser une expression régulière pour analyser le chemin
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Traiter l'indice de tableau
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Points clés** :

- Utiliser l'expression régulière `/[^.[\]]+|\[(\d+)\]/g` pour analyser le chemin
- Traiter les indices de tableau au format `[0]`
- Convertir les indices chaîne en nombres

</details>

### Question 3 : Implémentation de la fonction set

Implémentez une fonction `set` qui définit la valeur d'un objet imbriqué selon une chaîne de chemin.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Créer la structure imbriquée (sauf la dernière clé)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Définir la valeur de la dernière clé
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Points clés** :

- Créer couche par couche la structure d'objets imbriqués
- S'assurer que les objets intermédiaires du chemin existent
- Définir la valeur cible à la fin

</details>

### Question 4 : Implémentation complète de get et set

Implémentez les fonctions `get` et `set` complètes, avec support des indices de tableau et gestion de tous les cas limites.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// Fonction get
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Fonction set
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Créer la structure imbriquée
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Définir la valeur
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```javascript
// 1. Gérer les cas limites
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Utiliser les expressions régulières pour analyser les chemins complexes
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Déterminer le type de la clé suivante dans set
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Utiliser le nullish coalescing pour gérer les valeurs par défaut
return result ?? defaultValue;
```

### Pratiques à éviter

```javascript
// 1. ❌ Ne pas oublier de gérer null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // Peut provoquer une erreur
}

// 2. ❌ Ne pas modifier directement l'objet original (sauf si explicitement demandé)
function set(obj, path, value) {
  // Devrait retourner l'objet modifié, pas le modifier directement
}

// 3. ❌ Ne pas ignorer la différence entre tableaux et objets
// Il faut déterminer si la clé suivante est un indice de tableau ou une clé d'objet
```

## 6. Interview Summary

> Résumé d'entretien

### Aide-mémoire rapide

**Analyse de chemin d'objet** :

- **Fonction get** : Obtenir une valeur selon le chemin, gérer null/undefined, supporter les valeurs par défaut
- **Fonction set** : Définir une valeur selon le chemin, créer automatiquement la structure imbriquée
- **Analyse de chemin** : Utiliser les expressions régulières pour traiter les formats `'a.b.c'` et `'a.b[0].c'`
- **Gestion des cas limites** : Gérer null, undefined, chaîne vide, etc.

**Points clés de l'implémentation** :

1. Analyse de chemin : `split('.')` ou expressions régulières
2. Accès couche par couche : utiliser une boucle ou `reduce`
3. Gestion des cas limites : vérifier null/undefined
4. Support des tableaux : traiter les indices au format `[0]`

### Exemple de réponse en entretien

**Q : Implémentez une fonction qui obtient la valeur d'un objet selon un chemin.**

> "J'implémenterais une fonction `get` qui accepte un objet, une chaîne de chemin et une valeur par défaut. D'abord, je gère les cas limites : si l'objet est null ou si le chemin n'est pas une chaîne, je retourne la valeur par défaut. Ensuite, j'utilise `split('.')` pour diviser le chemin en un tableau de clés, et j'utilise une boucle pour accéder couche par couche aux propriétés de l'objet. À chaque accès, je vérifie si la valeur courante est null ou undefined, et si c'est le cas, je retourne la valeur par défaut. Enfin, si le résultat est undefined, je retourne la valeur par défaut, sinon je retourne le résultat. Si le support des indices de tableau est nécessaire, j'utilise l'expression régulière `/[^.[\]]+|\[(\d+)\]/g` pour analyser le chemin et traiter les indices au format `[0]`."

**Q : Comment implémenter une fonction qui définit la valeur d'un objet selon un chemin ?**

> "J'implémenterais une fonction `set` qui accepte un objet, une chaîne de chemin et une valeur. D'abord, j'analyse le chemin en un tableau de clés, puis je parcours jusqu'à l'avant-dernière clé en créant couche par couche la structure d'objets imbriqués. Pour chaque clé intermédiaire, si elle n'existe pas ou n'est pas un objet, je crée un nouvel objet. Si la clé suivante est au format d'indice de tableau, je crée un tableau. Enfin, je définis la valeur de la dernière clé. Cela garantit que tous les objets intermédiaires du chemin existent, puis définit correctement la valeur cible."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
