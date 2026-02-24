---
id: primitive-vs-reference
title: '[Medium] 📄 Tipi primitivi vs tipi di riferimento'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. Cosa sono i tipi primitivi e i tipi di riferimento?

> Cosa sono i tipi primitivi e i tipi di riferimento?

I tipi di dati in JavaScript possono essere raggruppati in due categorie: **tipi primitivi** e **tipi di riferimento**.
Differiscono fondamentalmente nel comportamento della memoria e nella semantica di passaggio.

### Tipi primitivi (Primitive Types)

**Caratteristiche**:

- Memorizzati come valori diretti (comunemente concettualizzati nello **stack**)
- Passati per **copia del valore**
- Immutabili

**7 tipi primitivi**:

```javascript
// 1. String
const str = 'hello';

// 2. Number
const num = 42;

// 3. Boolean
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Tipi di riferimento (Reference Types)

**Caratteristiche**:

- Gli oggetti sono allocati nella memoria **heap**
- Le variabili contengono riferimenti (indirizzi)
- Mutabili

**Esempi**:

```javascript
// 1. Object
const obj = { name: 'John' };

// 2. Array
const arr = [1, 2, 3];

// 3. Function
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Call by Value vs Call by Reference

### Call by Value (comportamento dei primitivi)

**Comportamento**: il valore viene copiato; modificare la copia non influenza l'originale.

```javascript
let a = 10;
let b = a; // copia il valore

b = 20;

console.log(a); // 10
console.log(b); // 20
```

**Diagramma della memoria**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ <- valore indipendente
├─────────┤
│ b: 20   │ <- valore indipendente dopo copia/aggiornamento
└─────────┘
```

### Comportamento dei riferimenti (oggetti)

**Comportamento**: il riferimento viene copiato; entrambe le variabili possono puntare allo stesso oggetto.

```javascript
let obj1 = { name: 'John' };
let obj2 = obj1; // copia il riferimento

obj2.name = 'Jane';

console.log(obj1.name); // 'Jane'
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true
```

**Diagramma della memoria**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (stesso oggetto) │
└─────────┘                    └──────────────────┘
```

## 3. Domande quiz comuni (Common Quiz Questions)

> Domande quiz comuni

### Domanda 1: passaggio di valori primitivi

```javascript
function changeValue(x) {
  x = 100;
  console.log('Dentro la funzione x:', x);
}

let num = 50;
changeValue(num);
console.log('Fuori dalla funzione num:', num);
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// Dentro la funzione x: 100
// Fuori dalla funzione num: 50
```

**Spiegazione:**

- `num` è un primitivo (`Number`)
- l'argomento della funzione ottiene una copia del valore
- modificare `x` non modifica `num`

```javascript
// flusso
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (copia)
x = 100; // solo x cambia
console.log(num); // ancora 50
```

</details>

### Domanda 2: passaggio di oggetti

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('Dentro la funzione obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('Fuori dalla funzione person.name:', person.name);
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// Dentro la funzione obj.name: Changed
// Fuori dalla funzione person.name: Changed
```

**Spiegazione:**

- `person` è un tipo di riferimento (`Object`)
- l'argomento della funzione copia il riferimento
- `obj` e `person` puntano allo stesso oggetto

```javascript
// schema della memoria
let person = { name: 'Original' }; // heap @0x001
changeObject(person); // obj -> @0x001
obj.name = 'Changed'; // muta @0x001
console.log(person.name); // legge da @0x001
```

</details>

### Domanda 3: riassegnazione vs mutazione della proprietà

```javascript
function test1(obj) {
  obj.name = 'Modified'; // muta la proprietà
}

function test2(obj) {
  obj = { name: 'New Object' }; // riassegna il parametro locale
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: Modified
// B: Modified (non 'New Object')
```

**Spiegazione:**

**test1: mutazione della proprietà**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // muta l'oggetto originale
}
```

**test2: riassegnazione**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // cambia solo il binding locale
}
// person punta ancora all'oggetto originale
```

**Schema della memoria**:

```text
// prima di test1
person ---> { name: 'Original' }
obj    ---> { name: 'Original' } (stesso)

// dopo test1
person ---> { name: 'Modified' }
obj    ---> { name: 'Modified' } (stesso)

// dentro test2
person ---> { name: 'Modified' } (invariato)
obj    ---> { name: 'New Object' } (nuovo oggetto)

// dopo test2
person ---> { name: 'Modified' }
// obj locale è scomparso
```

</details>

### Domanda 4: passaggio di array

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Spiegazione:**

- `modifyArray`: muta l'array originale
- `reassignArray`: riassegna solo il parametro locale

</details>

### Domanda 5: confronto di uguaglianza

```javascript
// primitivi
let a = 10;
let b = 10;
console.log('A:', a === b);

// riferimenti
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: true
// B: false
// C: true
```

**Spiegazione:**

I primitivi confrontano per valore; gli oggetti confrontano per riferimento.

```javascript
obj1 === obj2; // false (riferimenti diversi)
obj1 === obj3; // true (stesso riferimento)
```

</details>

## 4. Copia superficiale vs copia profonda (Shallow Copy vs Deep Copy)

> Copia superficiale vs copia profonda

### Copia superficiale (Shallow Copy)

**Definizione**: viene copiato solo il livello superiore; gli oggetti annidati rimangono riferimenti condivisi.

#### Metodo 1: operatore spread

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

copy.name = 'Jane';
console.log(original.name); // 'John'

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (influenzato)
```

#### Metodo 2: `Object.assign()`

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'
```

#### Metodo 3: copia superficiale di array

```javascript
const arr1 = [1, 2, 3];

const arr2 = [...arr1];
const arr3 = arr1.slice();
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1
```

### Copia profonda (Deep Copy)

**Definizione**: tutti i livelli vengono copiati ricorsivamente.

#### Metodo 1: `JSON.parse(JSON.stringify(...))`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']
```

**Limitazioni**:

```javascript
const obj = {
  date: new Date(), // -> stringa
  func: () => {}, // ignorata
  undef: undefined, // ignorato
  symbol: Symbol('test'), // ignorato
  regexp: /abc/, // -> {}
  circular: null, // riferimento circolare lancia errore
};
obj.circular = obj;

JSON.parse(JSON.stringify(obj)); // errore o perdita di dati
```

#### Metodo 2: `structuredClone()`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

console.log(copy.date instanceof Date); // true
```

**Pro**:

- Supporta Date, RegExp, Map, Set, ecc.
- Supporta riferimenti circolari
- Solitamente migliori prestazioni rispetto al deep clone manuale

**Limitazioni**:

- Non clona le funzioni
- Non clona i valori Symbol in tutti i pattern di utilizzo

#### Metodo 3: deep clone ricorsivo

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'
```

#### Metodo 4: Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Confronto tra copia superficiale e profonda

| Caratteristica | Copia superficiale | Copia profonda |
| ------- | ------------ | --------- |
| Profondità di copia | Solo livello superiore | Tutti i livelli |
| Oggetti annidati | Riferimenti condivisi | Completamente indipendenti |
| Prestazioni | Più veloce | Più lenta |
| Uso di memoria | Inferiore | Superiore |
| Caso d'uso | Strutture semplici | Strutture annidate complesse |

## 5. Insidie comuni (Common Pitfalls)

> Insidie comuni

### Insidia 1: aspettarsi che argomenti primitivi mutino il valore esterno

```javascript
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5

count = increment(count);
console.log(count); // 6
```

### Insidia 2: aspettarsi che la riassegnazione sostituisca l'oggetto esterno

```javascript
function resetObject(obj) {
  obj = { name: 'Reset' }; // solo riassegnazione locale
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'

// approccio corretto 1: muta la proprietà
function resetObject1(obj) {
  obj.name = 'Reset';
}

// approccio corretto 2: restituisci un nuovo oggetto
function resetObject2(obj) {
  return { name: 'Reset' };
}
person = resetObject2(person);
```

### Insidia 3: assumere che lo spread sia una copia profonda

```javascript
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // superficiale

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'

const deep = structuredClone(original);
```

### Insidia 4: fraintendere `const`

```javascript
const obj = { name: 'John' };

// obj = { name: 'Jane' }; // TypeError

obj.name = 'Jane'; // consentito
obj.age = 30; // consentito

const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane';
console.log(immutableObj.name); // 'John'
```

### Insidia 5: riferimento condiviso nei cicli

```javascript
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // stesso riferimento oggetto ogni volta
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]

const arr2 = [];
for (let i = 0; i < 3; i++) {
  arr2.push({ value: i }); // nuovo oggetto ad ogni iterazione
}

console.log(arr2);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best practice

> Best practice

### ✅ Raccomandato

```javascript
// 1. scegli una strategia di copia esplicita
const original = { name: 'John', age: 30 };

const copy1 = { ...original }; // superficiale
const copy2 = structuredClone(original); // profonda

// 2. evita effetti collaterali di mutazione nelle funzioni
function addItem(arr, item) {
  return [...arr, item]; // stile immutabile
}

// 3. usa const per prevenire riassegnazioni accidentali
const config = { theme: 'dark' };

// 4. usa Object.freeze per costanti immutabili
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Da evitare

```javascript
function increment(num) {
  num++; // inefficace per il primitivo esterno
}

const copy = { ...nested }; // non è una copia profonda

for (let i = 0; i < 3; i++) {
  arr.push(obj); // stesso riferimento oggetto riutilizzato
}
```

## 7. Riepilogo per i colloqui (Interview Summary)

> Riepilogo per i colloqui

### Promemoria rapido

**Primitivi**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Passati per valore
- Immutabili

**Riferimenti**:

- Object, Array, Function, Date, RegExp, ecc.
- La variabile memorizza il riferimento all'oggetto nello heap
- Mutabili

### Risposta esempio per un colloquio

**D: JavaScript è call-by-value o call-by-reference?**

> JavaScript è call-by-value per tutti gli argomenti.
> Per gli oggetti, il valore copiato è il riferimento (indirizzo di memoria).
>
> - Argomenti primitivi: la copia del valore non influenza la variabile esterna.
> - Argomenti oggetto: la copia del riferimento consente la mutazione dello stesso oggetto.
> - Riassegnare il parametro locale non cambia il binding esterno.

## Riferimenti

- [MDN - Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript.info - Object copy](https://javascript.info/object-copy)
