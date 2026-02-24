---
id: object-path-parsing
title: '[Medium] Parsing dei path oggetto'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Descrizione della domanda

> Descrizione della domanda

Implementa funzioni di parsing dei path oggetto che possano leggere e impostare valori in oggetti annidati usando una stringa path.

### Requisiti

1. **Funzione `get`**: recupera un valore da un oggetto in base a un path

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Funzione `set`**: imposta un valore su un oggetto in base a un path

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementazione: funzione get

> Implementazione della funzione get

### Metodo 1: uso di split e reduce

**Approccio**: dividi la stringa path in un array, poi usa `reduce` per accedere all'oggetto livello per livello.

```javascript
function get(obj, path, defaultValue) {
  // Handle edge cases
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Split the path string into an array
  const keys = path.split('.');

  // Use reduce to access level by level
  const result = keys.reduce((current, key) => {
    // If current value is null or undefined, return undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // If result is undefined, return the default value
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
console.log(get(obj, 'a.b.d[2].e')); // undefined (need to handle array indices)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Metodo 2: supporto agli indici array

**Approccio**: gestisci gli indici array nel path, come `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Regex to match: property names or array indices
  // Matches 'a', 'b', '[0]', 'c', etc.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Handle array index [0] -> 0
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

### Metodo 3: implementazione completa (gestione dei casi limite)

```javascript
function get(obj, path, defaultValue) {
  // Handle edge cases
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Parse path: supports 'a.b.c' and 'a.b[0].c' formats
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // If current value is null or undefined, return default value
    if (result == null) {
      return defaultValue;
    }

    // Handle array index
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
console.log(get(obj, '', obj)); // obj (empty path returns original object)
```

## 3. Implementazione: funzione set

> Implementazione della funzione set

### Metodo 1: implementazione base

**Approccio**: crea una struttura oggetto annidata in base al path, poi imposta il valore.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Parse path
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Create nested structure
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // If key doesn't exist or isn't an object, create a new object
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // If current is not an array, convert it
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

### Metodo 2: implementazione completa (gestione di array e oggetti)

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

  // Iterate to the second-to-last key, creating nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // Ensure it's an array
      if (!Array.isArray(current)) {
        // Convert object to array (preserving existing indices)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // Ensure index exists
      if (current[index] == null) {
        // Determine if next key is array or object
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Handle object key
      if (current[key] == null) {
        // Determine if next key is array or object
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // If exists but not an object, convert it
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Set the value for the last key
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

### Metodo 3: versione semplificata (solo oggetti, senza gestione indici array)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Create nested structure (except for the last key)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the value for the last key
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

## 4. Domande comuni da colloquio

> Domande comuni da colloquio

### Domanda 1: funzione get base

Implementa una funzione `get` che recuperi il valore di un oggetto annidato in base a una stringa path.

<details>
<summary>Clicca per mostrare la risposta</summary>

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

**Punti chiave**:

- Gestisci i casi null/undefined
- Usa split per dividere il path
- Accedi alle proprietà dell'oggetto livello per livello
- Restituisci il valore di default quando il path non esiste

</details>

### Domanda 2: funzione get con supporto agli indici array

Estendi la funzione `get` per supportare indici array come `'a.b[0].c'`.

<details>
<summary>Clicca per mostrare la risposta</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Use regex to parse the path
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Handle array index
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

**Punti chiave**:

- Usa la regex `/[^.[\]]+|\[(\d+)\]/g` per fare il parsing del path
- Gestisci indici array nel formato `[0]`
- Converti l'indice stringa in numero

</details>

### Domanda 3: funzione set

Implementa una funzione `set` che imposti il valore di un oggetto annidato in base a una stringa path.

<details>
<summary>Clicca per mostrare la risposta</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Create nested structure (except for the last key)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the value for the last key
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

**Punti chiave**:

- Crea la struttura oggetto annidata livello per livello
- Assicurati che gli oggetti intermedi del path esistano
- Imposta il valore target alla fine

</details>

### Domanda 4: implementazione completa di get e set

Implementa funzioni `get` e `set` complete con supporto agli indici array e gestione dei casi limite.

<details>
<summary>Clicca per mostrare la risposta</summary>

```javascript
// get function
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

// set function
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Create nested structure
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

  // Set value
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

## 5. Best practice

> Best practice

### Approcci consigliati

```javascript
// 1. Handle edge cases
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Use regex to parse complex paths
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Determine the next key's type in set
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Use nullish coalescing for default values
return result ?? defaultValue;
```

### Approcci da evitare

```javascript
// 1. ❌ Don't forget to handle null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // May throw
}

// 2. ❌ Don't directly mutate the original object (unless explicitly required)
function set(obj, path, value) {
  // Should return the modified object, not just mutate directly
}

// 3. ❌ Don't ignore the difference between arrays and objects
// Need to determine if the next key is an array index or object key
```

## 6. Riepilogo da colloquio

> Riepilogo da colloquio

### Riferimento rapido

**Parsing dei path oggetto**:

- **Funzione get**: recupera il valore tramite path, gestisce null/undefined, supporta valori di default
- **Funzione set**: imposta il valore tramite path, crea automaticamente la struttura annidata
- **Parsing del path**: usa regex per gestire i formati `'a.b.c'` e `'a.b[0].c'`
- **Gestione dei casi limite**: gestisci null, undefined, stringhe vuote, ecc.

**Passi di implementazione**:

1. Parsing del path: `split('.')` o regex
2. Accesso livello per livello: usa loop o `reduce`
3. Gestione casi limite: controlla null/undefined
4. Supporto array: gestisci indici nel formato `[0]`

### Esempio di risposta da colloquio

**Q: Implementa una funzione che recuperi il valore di un oggetto tramite path.**

> "Implementerei una funzione `get` che riceve un oggetto, una stringa path e un valore di default. Per prima cosa gestisco i casi limite: se l'oggetto è null o il path non è una stringa, restituisco il default. Poi uso `split('.')` per dividere il path in un array di chiavi e uso un loop per accedere alle proprietà livello per livello. A ogni accesso, controllo se il valore corrente è null o undefined: in quel caso restituisco il default. Infine, se il risultato è undefined restituisco il default, altrimenti restituisco il risultato. Per supportare gli indici array, uso la regex `/[^.[\]]+|\[(\d+)\]/g` per fare il parsing del path e gestire gli indici nel formato `[0]`."

**Q: Come implementeresti una funzione che imposta il valore di un oggetto tramite path?**

> "Implementerei una funzione `set` che riceve un oggetto, una stringa path e un valore. Prima faccio il parsing del path in un array di chiavi, poi itero fino alla penultima chiave creando la struttura annidata livello per livello. Per ogni chiave intermedia, se non esiste o non è un oggetto, creo un nuovo oggetto. Se la chiave successiva è nel formato indice array, creo invece un array. Infine imposto il valore per l'ultima chiave. In questo modo garantisco che tutti gli oggetti intermedi del path esistano prima di impostare correttamente il valore target."

## Riferimenti

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
