---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Qu'est-ce que le Deep Clone ?

**Le Deep Clone (copie profonde)** consiste à créer un nouvel objet et à copier récursivement toutes les propriétés de l'objet original ainsi que tous ses objets et tableaux imbriqués. L'objet issu du Deep Clone est complètement indépendant de l'original : modifier l'un n'affecte pas l'autre.

### Copie superficielle vs Copie profonde

**Shallow Clone (Copie superficielle)** : Copie uniquement les propriétés du premier niveau de l'objet ; les objets imbriqués partagent toujours la même référence.

```javascript
// Exemple de copie superficielle
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ L'objet original a aussi été modifié
```

**Deep Clone (Copie profonde)** : Copie récursivement toutes les couches de propriétés, complètement indépendant.

```javascript
// Exemple de copie profonde
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ L'objet original n'est pas affecté
```

## 2. Implementation Methods

> Méthodes d'implémentation

### Méthode 1 : Utilisation de JSON.parse et JSON.stringify

**Avantages** : Simple et rapide
**Inconvénients** : Ne peut pas gérer les fonctions, undefined, Symbol, Date, RegExp, Map, Set et autres types spéciaux

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Limitations** :

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date devient un objet vide
console.log(cloned.func); // undefined ❌ La fonction est perdue
console.log(cloned.undefined); // undefined ✅ Mais JSON.stringify le supprime
console.log(cloned.symbol); // undefined ❌ Symbol est perdu
console.log(cloned.regex); // {} ❌ RegExp devient un objet vide
```

### Méthode 2 : Implémentation récursive (gestion des types de base et objets)

```javascript
function deepClone(obj) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Gestion de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Gestion des tableaux
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Gestion des objets
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Non affecté
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Méthode 3 : Implémentation complète (gestion de Map, Set, Symbol, etc.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion des références circulaires
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Gestion de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Gestion de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Gestion de Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Gestion de Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Gestion des tableaux
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Gestion des objets
  const cloned = {};
  map.set(obj, cloned);

  // Gestion des propriétés Symbol
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copier les propriétés normales
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copier les propriétés Symbol
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Test
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Méthode 4 : Gestion des références circulaires

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion des références circulaires
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Gestion de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Gestion de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Gestion des tableaux
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Gestion des objets
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test des références circulaires
const original = {
  name: 'John',
};
original.self = original; // Référence circulaire

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Référence circulaire correctement gérée
console.log(cloned !== original); // true ✅ Objets différents
```

## 3. Common Interview Questions

> Questions d'entretien fréquentes

### Question 1 : Implémentation basique du Deep Clone

Implémentez une fonction `deepClone` capable de copier profondément des objets et des tableaux.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function deepClone(obj) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Gestion de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Gestion des tableaux
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Gestion des objets
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Question 2 : Gestion des références circulaires

Implémentez une fonction `deepClone` capable de gérer les références circulaires.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion des références circulaires
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Gestion de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Gestion de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Gestion des tableaux
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Gestion des objets
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test des références circulaires
const original = {
  name: 'John',
};
original.self = original; // Référence circulaire

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Points clés** :

- Utiliser `WeakMap` pour suivre les objets déjà traités
- Avant de créer un nouvel objet, vérifier s'il existe déjà dans le map
- S'il existe, retourner directement la référence du map pour éviter la récursion infinie

</details>

### Question 3 : Limitations de JSON.parse et JSON.stringify

Expliquez les limitations de l'utilisation de `JSON.parse(JSON.stringify())` pour le Deep Clone et proposez des solutions.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Limitations** :

1. **Ne peut pas gérer les fonctions**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Ne peut pas gérer undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (mais la propriété est supprimée) ❌
   ```

3. **Ne peut pas gérer Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ La propriété Symbol est perdue
   ```

4. **Date devient une chaîne de caractères**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Devient une chaîne
   ```

5. **RegExp devient un objet vide**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Devient un objet vide
   ```

6. **Ne peut pas gérer Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Devient un objet vide
   ```

7. **Ne peut pas gérer les références circulaires**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Erreur : Converting circular structure to JSON
   ```

**Solution** : Utiliser une implémentation récursive avec un traitement spécial pour les différents types.

</details>

## 4. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```javascript
// 1. Choisir la méthode appropriée en fonction des besoins
// Si seuls des objets basiques et des tableaux doivent être traités, utiliser une implémentation récursive simple
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. Si des types complexes doivent être gérés, utiliser l'implémentation complète
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Implémentation complète
}

// 3. Utiliser WeakMap pour gérer les références circulaires
// WeakMap n'empêche pas la collecte des déchets, adapté au suivi des références d'objets
```

### Pratiques à éviter

```javascript
// 1. Ne pas abuser de JSON.parse(JSON.stringify())
// ❌ Les fonctions, Symbol, Date et autres types spéciaux sont perdus
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Ne pas oublier de gérer les références circulaires
// ❌ Provoque un débordement de pile
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Récursion infinie
  }
  return cloned;
}

// 3. Ne pas oublier de gérer Date, RegExp et autres types spéciaux
// ❌ Ces types nécessitent un traitement spécial
```

## 5. Interview Summary

> Résumé pour les entretiens

### Aide-mémoire

**Deep Clone** :

- **Définition** : Copier récursivement un objet et toutes ses propriétés imbriquées, complètement indépendant
- **Méthodes** : Implémentation récursive, JSON.parse(JSON.stringify()), structuredClone()
- **Points clés** : Gestion des types spéciaux, références circulaires, propriétés Symbol

**Points d'implémentation** :

1. Gérer les types de base et null
2. Gérer Date, RegExp et autres objets spéciaux
3. Gérer les tableaux et les objets
4. Gérer les références circulaires (avec WeakMap)
5. Gérer les propriétés Symbol

### Exemple de réponse en entretien

**Q : Veuillez implémenter une fonction Deep Clone.**

> "Le Deep Clone consiste à créer un nouvel objet complètement indépendant en copiant récursivement toutes les propriétés imbriquées. Mon implémentation gère d'abord les types de base et null, puis effectue un traitement spécial pour différents types comme Date, RegExp, tableaux et objets. Pour gérer les références circulaires, j'utilise un WeakMap pour suivre les objets déjà traités. Pour les propriétés Symbol, j'utilise Object.getOwnPropertySymbols pour les obtenir et les copier. Cela garantit que l'objet copié en profondeur est complètement indépendant de l'objet original, et que modifier l'un n'affecte pas l'autre."

**Q : Quelles sont les limitations de JSON.parse(JSON.stringify()) ?**

> "Les principales limitations de cette méthode sont : 1) Ne peut pas gérer les fonctions, qui sont supprimées ; 2) Ne peut pas gérer undefined et Symbol, ces propriétés sont ignorées ; 3) Les objets Date deviennent des chaînes de caractères ; 4) RegExp devient un objet vide ; 5) Ne peut pas gérer Map, Set et autres structures de données spéciales ; 6) Ne peut pas gérer les références circulaires, ce qui provoque une erreur. Si ces cas spéciaux doivent être gérés, il faut utiliser une implémentation récursive."

## Référence

- [MDN - structuredClone()](https://developer.mozilla.org/fr/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
