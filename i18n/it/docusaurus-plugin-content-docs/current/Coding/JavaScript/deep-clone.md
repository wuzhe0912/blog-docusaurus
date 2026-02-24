---
id: deep-clone
title: '[Medium] Clone profondo'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. Cos'è il Deep Clone?

> Cos'è il Deep Clone?

**Deep Clone** crea un nuovo oggetto e copia ricorsivamente tutte le proprietà dell'oggetto originale, inclusi oggetti annidati e array. Dopo un deep clone, il nuovo oggetto è completamente indipendente dall'originale: modificare uno non influenza l'altro.

### Confronto tra Shallow Clone e Deep Clone

**Shallow Clone**: copia solo il primo livello delle proprietà di un oggetto. Gli oggetti annidati condividono ancora i riferimenti.

```javascript
// Shallow clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Original object was also modified
```

**Deep Clone**: copia ricorsivamente tutti i livelli delle proprietà, rendendoli completamente indipendenti.

```javascript
// Deep clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Original object is unaffected
```

## 2. Metodi di implementazione

> Metodi di implementazione

### Metodo 1: uso di JSON.parse e JSON.stringify

**Pro**: semplice e veloce
**Contro**: non gestisce funzioni, undefined, Symbol, Date, RegExp, Map, Set e altri tipi speciali

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

**Limitazioni**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date becomes an empty object
console.log(cloned.func); // undefined ❌ Function is lost
console.log(cloned.undefined); // undefined ✅ But JSON.stringify removes it
console.log(cloned.symbol); // undefined ❌ Symbol is lost
console.log(cloned.regex); // {} ❌ RegExp becomes an empty object
```

### Metodo 2: implementazione ricorsiva (gestione di tipi base e oggetti)

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
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

console.log(original.date.getFullYear()); // 2024 ✅ Unaffected
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Metodo 3: implementazione completa (gestione di Map, Set, Symbol, ecc.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  // Handle Symbol properties
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copy regular properties
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copy Symbol properties
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

### Metodo 4: gestione dei riferimenti circolari

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Circular reference handled correctly
console.log(cloned !== original); // true ✅ It's a different object
```

## 3. Domande comuni da colloquio

> Domande comuni da colloquio

### Domanda 1: implementazione base del Deep Clone

Implementa una funzione `deepClone` che possa clonare in profondità oggetti e array.

<details>
<summary>Clicca per mostrare la risposta</summary>

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
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

### Domanda 2: gestione dei riferimenti circolari

Implementa una funzione `deepClone` che possa gestire i riferimenti circolari.

<details>
<summary>Clicca per mostrare la risposta</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Punti chiave**:

- Usa `WeakMap` per tracciare gli oggetti già processati
- Controlla se un oggetto esiste già nella mappa prima di crearne uno nuovo
- Se esiste, restituisci il riferimento dalla mappa per evitare ricorsione infinita

</details>

### Domanda 3: limitazioni di JSON.parse e JSON.stringify

Spiega le limitazioni dell'uso di `JSON.parse(JSON.stringify())` per il deep clone e fornisci delle soluzioni.

<details>
<summary>Clicca per mostrare la risposta</summary>

**Limitazioni**:

1. **Non può gestire le funzioni**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Non può gestire undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (but the property is removed) ❌
   ```

3. **Non può gestire Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol property is lost
   ```

4. **Date diventa una stringa**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Becomes a string
   ```

5. **RegExp diventa un oggetto vuoto**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Becomes an empty object
   ```

6. **Non può gestire Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Becomes an empty object
   ```

7. **Non può gestire i riferimenti circolari**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Error: Converting circular structure to JSON
   ```

**Soluzione**: usa un'implementazione ricorsiva con gestione specifica per i diversi tipi.

</details>

## 4. Best practice

> Best practice

### Approcci consigliati

```javascript
// 1. Choose the appropriate method based on requirements
// For basic objects and arrays only, use a simple recursive implementation
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

// 2. For complex types, use the complete implementation
function completeDeepClone(obj, map = new WeakMap()) {
  // ... complete implementation
}

// 3. Use WeakMap to handle circular references
// WeakMap doesn't prevent garbage collection, making it suitable for tracking object references
```

### Approcci da evitare

```javascript
// 1. Don't overuse JSON.parse(JSON.stringify())
// ❌ Loses functions, Symbol, Date, and other special types
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Don't forget to handle circular references
// ❌ Will cause stack overflow
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Infinite recursion
  }
  return cloned;
}

// 3. Don't forget to handle Date, RegExp, and other special types
// ❌ These types require special handling
```

## 5. Riepilogo da colloquio

> Riepilogo da colloquio

### Riferimento rapido

**Deep Clone**:

- **Definizione**: copia ricorsivamente un oggetto e tutte le sue proprietà annidate, creando una copia completamente indipendente
- **Metodi**: implementazione ricorsiva, JSON.parse(JSON.stringify()), structuredClone()
- **Punti chiave**: gestione di tipi speciali, riferimenti circolari, proprietà Symbol

**Passi di implementazione**:

1. Gestisci tipi primitivi e null
2. Gestisci Date, RegExp e altri oggetti speciali
3. Gestisci array e oggetti
4. Gestisci i riferimenti circolari (con WeakMap)
5. Gestisci le proprietà Symbol

### Esempio di risposta da colloquio

**Q: Implementa una funzione di Deep Clone.**

> "Il deep clone crea un nuovo oggetto completamente indipendente copiando ricorsivamente tutte le proprietà annidate. La mia implementazione gestisce prima i tipi primitivi e null, poi applica una gestione specifica per tipi diversi come Date, RegExp, array e oggetti. Per i riferimenti circolari uso una WeakMap per tracciare gli oggetti già processati. Per le proprietà Symbol uso Object.getOwnPropertySymbols per leggerle e copiarle. In questo modo l'oggetto clonato in profondità è del tutto indipendente dall'originale: modificare uno non influenza l'altro."

**Q: Quali sono le limitazioni di JSON.parse(JSON.stringify())?**

> "Le limitazioni principali sono: 1) non gestisce le funzioni, che vengono rimosse; 2) non gestisce undefined e Symbol, quindi queste proprietà vengono ignorate; 3) gli oggetti Date diventano stringhe; 4) RegExp diventa un oggetto vuoto; 5) non gestisce Map, Set e altre strutture dati speciali; 6) non gestisce riferimenti circolari e genera un errore. Per questi casi speciali è meglio usare un'implementazione ricorsiva."

## Riferimenti

- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
