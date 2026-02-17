---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Qu'est-ce que le Deep Clone ?

**Le Deep Clone (copie profonde)** consiste a creer un nouvel objet et a copier recursivement toutes les proprietes de l'objet original ainsi que tous ses objets et tableaux imbriques. L'objet issu du Deep Clone est completement independant de l'original : modifier l'un n'affecte pas l'autre.

### Copie superficielle vs Copie profonde

**Shallow Clone (Copie superficielle)** : Copie uniquement les proprietes du premier niveau de l'objet ; les objets imbriques partagent toujours la meme reference.

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

console.log(original.address.city); // 'Kaohsiung' ❌ L'objet original a aussi ete modifie
```

**Deep Clone (Copie profonde)** : Copie recursivement toutes les couches de proprietes, completement independant.

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

console.log(original.address.city); // 'Taipei' ✅ L'objet original n'est pas affecte
```

## 2. Implementation Methods

> Methodes d'implementation

### Methode 1 : Utilisation de JSON.parse et JSON.stringify

**Avantages** : Simple et rapide
**Inconvenients** : Ne peut pas gerer les fonctions, undefined, Symbol, Date, RegExp, Map, Set et autres types speciaux

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

### Methode 2 : Implementation recursive (gestion des types de base et objets)

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

console.log(original.date.getFullYear()); // 2024 ✅ Non affecte
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Methode 3 : Implementation complete (gestion de Map, Set, Symbol, etc.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion des references circulaires
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

  // Gestion des proprietes Symbol
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copier les proprietes normales
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copier les proprietes Symbol
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

### Methode 4 : Gestion des references circulaires

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion des references circulaires
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

// Test des references circulaires
const original = {
  name: 'John',
};
original.self = original; // Reference circulaire

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Reference circulaire correctement geree
console.log(cloned !== original); // true ✅ Objets differents
```

## 3. Common Interview Questions

> Questions d'entretien frequentes

### Question 1 : Implementation basique du Deep Clone

Implementez une fonction `deepClone` capable de copier profondement des objets et des tableaux.

<details>
<summary>Cliquez pour voir la reponse</summary>

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

### Question 2 : Gestion des references circulaires

Implementez une fonction `deepClone` capable de gerer les references circulaires.

<details>
<summary>Cliquez pour voir la reponse</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Gestion de null et des types de base
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gestion des references circulaires
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

// Test des references circulaires
const original = {
  name: 'John',
};
original.self = original; // Reference circulaire

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Points cles** :

- Utiliser `WeakMap` pour suivre les objets deja traites
- Avant de creer un nouvel objet, verifier s'il existe deja dans le map
- S'il existe, retourner directement la reference du map pour eviter la recursion infinie

</details>

### Question 3 : Limitations de JSON.parse et JSON.stringify

Expliquez les limitations de l'utilisation de `JSON.parse(JSON.stringify())` pour le Deep Clone et proposez des solutions.

<details>
<summary>Cliquez pour voir la reponse</summary>

**Limitations** :

1. **Ne peut pas gerer les fonctions**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Ne peut pas gerer undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (mais la propriete est supprimee) ❌
   ```

3. **Ne peut pas gerer Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ La propriete Symbol est perdue
   ```

4. **Date devient une chaine de caracteres**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Devient une chaine
   ```

5. **RegExp devient un objet vide**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Devient un objet vide
   ```

6. **Ne peut pas gerer Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Devient un objet vide
   ```

7. **Ne peut pas gerer les references circulaires**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Erreur : Converting circular structure to JSON
   ```

**Solution** : Utiliser une implementation recursive avec un traitement special pour les differents types.

</details>

## 4. Best Practices

> Bonnes pratiques

### Pratiques recommandees

```javascript
// 1. Choisir la methode appropriee en fonction des besoins
// Si seuls des objets basiques et des tableaux doivent etre traites, utiliser une implementation recursive simple
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

// 2. Si des types complexes doivent etre geres, utiliser l'implementation complete
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Implementation complete
}

// 3. Utiliser WeakMap pour gerer les references circulaires
// WeakMap n'empeche pas la collecte des dechets, adapte au suivi des references d'objets
```

### Pratiques a eviter

```javascript
// 1. Ne pas abuser de JSON.parse(JSON.stringify())
// ❌ Les fonctions, Symbol, Date et autres types speciaux sont perdus
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Ne pas oublier de gerer les references circulaires
// ❌ Provoque un debordement de pile
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Recursion infinie
  }
  return cloned;
}

// 3. Ne pas oublier de gerer Date, RegExp et autres types speciaux
// ❌ Ces types necessitent un traitement special
```

## 5. Interview Summary

> Resume pour les entretiens

### Aide-memoire

**Deep Clone** :

- **Definition** : Copier recursivement un objet et toutes ses proprietes imbriquees, completement independant
- **Methodes** : Implementation recursive, JSON.parse(JSON.stringify()), structuredClone()
- **Points cles** : Gestion des types speciaux, references circulaires, proprietes Symbol

**Points d'implementation** :

1. Gerer les types de base et null
2. Gerer Date, RegExp et autres objets speciaux
3. Gerer les tableaux et les objets
4. Gerer les references circulaires (avec WeakMap)
5. Gerer les proprietes Symbol

### Exemple de reponse en entretien

**Q : Veuillez implementer une fonction Deep Clone.**

> "Le Deep Clone consiste a creer un nouvel objet completement independant en copiant recursivement toutes les proprietes imbriquees. Mon implementation gere d'abord les types de base et null, puis effectue un traitement special pour differents types comme Date, RegExp, tableaux et objets. Pour gerer les references circulaires, j'utilise un WeakMap pour suivre les objets deja traites. Pour les proprietes Symbol, j'utilise Object.getOwnPropertySymbols pour les obtenir et les copier. Cela garantit que l'objet copie en profondeur est completement independant de l'objet original, et que modifier l'un n'affecte pas l'autre."

**Q : Quelles sont les limitations de JSON.parse(JSON.stringify()) ?**

> "Les principales limitations de cette methode sont : 1) Ne peut pas gerer les fonctions, qui sont supprimees ; 2) Ne peut pas gerer undefined et Symbol, ces proprietes sont ignorees ; 3) Les objets Date deviennent des chaines de caracteres ; 4) RegExp devient un objet vide ; 5) Ne peut pas gerer Map, Set et autres structures de donnees speciales ; 6) Ne peut pas gerer les references circulaires, ce qui provoque une erreur. Si ces cas speciaux doivent etre geres, il faut utiliser une implementation recursive."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/fr/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
