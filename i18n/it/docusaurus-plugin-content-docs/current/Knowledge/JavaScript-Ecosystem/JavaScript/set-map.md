---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. Cosa sono Set e Map?

> Cosa sono Set e Map?

`Set` e `Map` sono due strutture dati introdotte in ES6.
Risolvono casi d'uso specifici meglio dei semplici array/oggetti.

### Set

**Definizione**: `Set` è una collezione di **valori unici**, simile a un insieme matematico.

**Caratteristiche**:

- I valori memorizzati sono **unici**
- Il controllo di uguaglianza usa la semantica `===` per la maggior parte dei valori
- Mantiene l'ordine di inserimento
- Può memorizzare qualsiasi tipo di valore (primitivo o oggetto)

**Uso di base**:

```javascript
// crea Set
const set = new Set();

// aggiungi valori
set.add(1);
set.add(2);
set.add(2); // duplicato ignorato
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// controllo di esistenza
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// eliminazione
set.delete(2);
console.log(set.has(2)); // false

// svuotamento
set.clear();
console.log(set.size); // 0
```

**Creare Set da array**:

```javascript
// rimuovi duplicati dall'array
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// converti di nuovo in array
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// forma abbreviata
const uniqueArr2 = [...new Set(arr)];
```

### Map

**Definizione**: `Map` è una collezione chiave-valore simile agli oggetti, ma le chiavi possono essere di qualsiasi tipo.

**Caratteristiche**:

- Le chiavi possono essere di qualsiasi tipo (string, number, object, function, ecc.)
- Mantiene l'ordine di inserimento
- Ha la proprietà `size`
- L'iterazione segue l'ordine di inserimento

**Uso di base**:

```javascript
// crea Map
const map = new Map();

// imposta coppie chiave-valore
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// ottieni valore
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// esistenza chiave
console.log(map.has('name')); // true

// eliminazione
map.delete('name');

// dimensione
console.log(map.size); // 3

// svuotamento
map.clear();
```

**Creare Map da array**:

```javascript
// da array 2D
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// da oggetto
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Differenza tra Set e Array

| Caratteristica | Set | Array |
| ------- | --- | ----- |
| Duplicati | Non consentiti | Consentiti |
| Accesso per indice | Non supportato | Supportato |
| Complessità di ricerca | O(1) in media | O(n) |
| Ordine di inserimento | Preservato | Preservato |
| Metodi comuni | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Casi d'uso**:

```javascript
// ✅ Set per valori unici
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Set per controlli di esistenza veloci
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Homepage già visitata');
}

// ✅ Array quando servono indici o duplicati
const scores = [100, 95, 100, 90];
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Differenza tra Map e Object

| Caratteristica | Map | Object |
| ------- | --- | ------ |
| Tipo di chiave | Qualsiasi tipo | String o Symbol |
| Dimensione | Proprietà `size` | Calcolo manuale |
| Chiavi predefinite | Nessuna | Esiste la catena prototype |
| Ordine di iterazione | Ordine di inserimento | Ordine di inserimento nel JS moderno |
| Prestazioni | Migliori per aggiunte/rimozioni frequenti | Spesso buone per strutture statiche/semplici |
| JSON | Non serializzabile direttamente | Supporto JSON nativo |

**Casi d'uso**:

```javascript
// ✅ Map quando le chiavi non sono stringhe
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Map per aggiunte/rimozioni frequenti
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Object per strutture statiche + JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config);
```

## 4. Domande comuni di colloquio (Common Interview Questions)

> Domande comuni di colloquio

### Domanda 1: rimuovere duplicati da un array

Implementa una funzione per rimuovere i duplicati.

```javascript
function removeDuplicates(arr) {
  // la tua implementazione
}
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Metodo 1: Set (raccomandato)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Metodo 2: filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Metodo 3: reduce**

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

**Prestazioni**:

- Set: O(n), il più veloce
- filter + indexOf: O(n²), più lento
- reduce + includes: O(n²), più lento

</details>

### Domanda 2: controllare duplicati in un array

Implementa una funzione per verificare se un array ha duplicati.

```javascript
function hasDuplicates(arr) {
  // la tua implementazione
}
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Metodo 1: Set (raccomandato)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Metodo 2: Set con uscita anticipata**

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

**Metodo 3: indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Prestazioni**:

- Metodo Set 1: O(n), il più veloce
- Metodo Set 2: O(n), può fermarsi in anticipo
- indexOf: O(n²), più lento

</details>

### Domanda 3: contare le occorrenze

Implementa una funzione per contare le occorrenze di ogni elemento.

```javascript
function countOccurrences(arr) {
  // la tua implementazione
}
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Metodo 1: Map (raccomandato)**

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

**Metodo 2: reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Metodo 3: oggetto semplice**

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

**Perché Map è utile**:

- Le chiavi possono essere di qualsiasi tipo
- Ha `size` integrato
- Iterazione stabile nell'ordine di inserimento

</details>

### Domanda 4: intersezione di due array

Implementa l'intersezione di array.

```javascript
function intersection(arr1, arr2) {
  // la tua implementazione
}
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Metodo 1: Set**

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

**Metodo 2: filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Metodo 3: filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Prestazioni**:

- Set: O(n + m), più veloce
- filter + includes: O(n × m), più lento

</details>

### Domanda 5: differenza di due array

Implementa la differenza di array (valori in `arr1` ma non in `arr2`).

```javascript
function difference(arr1, arr2) {
  // la tua implementazione
}
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Metodo 1: Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Metodo 2: deduplica prima poi filtra**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Metodo 3: includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Prestazioni**:

- Set: O(n + m), più veloce
- includes: O(n × m), più lento

</details>

### Domanda 6: implementare una cache LRU

Implementa una cache LRU con `Map`.

```javascript
class LRUCache {
  constructor(capacity) {
    // la tua implementazione
  }

  get(key) {
    // la tua implementazione
  }

  put(key, value) {
    // la tua implementazione
  }
}
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Implementazione:**

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

    // sposta la chiave alla fine (usata più di recente)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // se la chiave esiste, eliminala prima
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // se piena, rimuovi la più vecchia (prima chiave)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // aggiungi alla fine (più recente)
    this.cache.set(key, value);
  }
}

// utilizzo
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // rimuove la chiave 2
console.log(cache.get(2)); // -1
console.log(cache.get(3)); // 'three'
```

**Spiegazione:**

- Map mantiene l'ordine di inserimento
- la prima chiave è la più vecchia
- `get` aggiorna la recenza tramite delete+set
- `put` rimuove la più vecchia quando la capacità è piena

</details>

### Domanda 7: oggetto come chiave di Map

Spiega l'output:

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
<summary>Clicca per vedere la risposta</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Spiegazione:**

- `obj1` e `obj2` sono istanze di oggetto diverse
- `Map` confronta le chiavi oggetto per riferimento
- quindi vengono trattate come chiavi diverse

**Confronto con un oggetto semplice:**

```javascript
// le chiavi di un oggetto semplice diventano stringhe
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (sovrascritta)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']

// Map mantiene i riferimenti
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet e WeakMap

> Differenza tra WeakSet e WeakMap

### WeakSet

**Caratteristiche**:

- Può memorizzare solo **oggetti**
- Usa **riferimenti deboli**
- Nessun `size`
- Non iterabile
- Nessun `clear`

**Caso d'uso**: marcatura di oggetti senza perdite di memoria.

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// se obj1 non ha altri riferimenti, può essere raccolto dal garbage collector
```

### WeakMap

**Caratteristiche**:

- Le chiavi devono essere **oggetti**
- Usa **riferimenti deboli** per le chiavi
- Nessun `size`
- Non iterabile
- Nessun `clear`

**Caso d'uso**: metadati privati legati al ciclo di vita dell'oggetto.

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// se obj1 non ha altri riferimenti, la voce può essere raccolta dal garbage collector
```

### Collezioni deboli vs forti

| Caratteristica | Set/Map | WeakSet/WeakMap |
| ------- | ------- | --------------- |
| Tipo chiave/valore | Qualsiasi tipo | Solo oggetto |
| Riferimento debole | No | Sì |
| Iterabile | Sì | No |
| `size` | Sì | No |
| `clear` | Sì | No |
| Pulizia automatica GC | No | Sì |

## 6. Best practice

> Best practice

### Raccomandato

```javascript
// 1. Usa Set per l'unicità
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Usa Set per ricerche veloci
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // accesso concesso
}

// 3. Usa Map quando le chiavi non sono stringhe
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Usa Map per aggiunte/rimozioni frequenti
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Usa WeakMap per dati privati legati all'oggetto
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

### Da evitare

```javascript
// 1. Non usare Set come sostituto completo degli array
const set = new Set([1, 2, 3]);
// set[0] -> undefined

const arr = [1, 2, 3];
arr[0]; // 1

// 2. Non usare Map per strutture statiche semplici
const configMap = new Map();
configMap.set('apiUrl', 'https://api.example.com');
configMap.set('timeout', 5000);

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Non confondere le API di Set e Map
const set2 = new Set();
// set2.set('key', 'value'); // TypeError

const map = new Map();
map.set('key', 'value');
```

## 7. Riepilogo per i colloqui (Interview Summary)

> Riepilogo per i colloqui

### Promemoria rapido

**Set**:

- Solo valori unici
- Ricerca veloce O(1)
- Ottimo per deduplicazione e controlli di appartenenza

**Map**:

- Archivio chiave-valore con chiavi di qualsiasi tipo
- Preserva l'ordine di inserimento
- Ottimo per chiavi non-string e aggiornamenti frequenti

**WeakSet / WeakMap**:

- Riferimenti deboli, compatibile con il GC
- Solo chiavi/valori oggetto
- Ottimo per metadati di oggetti sicuri dalle perdite di memoria

### Risposte esempio per i colloqui

**D: Quando dovresti usare Set invece di Array?**

> Usa Set quando hai bisogno di unicità o controlli di esistenza veloci.
> `Set.has` è O(1) in media, mentre `includes` dell'array è O(n).
> Esempi tipici sono la deduplicazione e i controlli dei permessi.

**D: Qual è la differenza tra Map e Object?**

> Le chiavi di Map possono essere di qualsiasi tipo, inclusi oggetti/funzioni.
> Le chiavi di Object sono solo string o Symbol.
> Map ha `size`, preserva l'ordine di inserimento e evita problemi di chiavi nella catena prototype.
> Map è migliore quando le chiavi sono dinamiche o gli aggiornamenti sono frequenti.

**D: Qual è la differenza tra WeakMap e Map?**

> Le chiavi di WeakMap devono essere oggetti e sono riferimenti deboli.
> Se l'oggetto chiave non è più referenziato altrove, la sua voce può essere raccolta automaticamente dal garbage collector.
> WeakMap non è iterabile e non ha `size`.
> È utile per dati privati e prevenzione delle perdite di memoria.

## Riferimenti

- [MDN - Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
