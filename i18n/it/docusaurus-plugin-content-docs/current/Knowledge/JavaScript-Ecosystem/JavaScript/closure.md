---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. Cos'è una Closure?

> Cos'è una closure?

Per comprendere le closure, dovresti prima capire lo scope delle variabili in JavaScript e come una funzione accede alle variabili esterne.

### Scope delle variabili (Variable Scope)

In JavaScript, lo scope delle variabili si discute comunemente come scope globale e scope di funzione (e scope di blocco con `let`/`const`).

```js
// scope globale
let a = 1;

function parentFunction() {
  // scope di funzione
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // stampa 1 2 3, può accedere allo scope globale + scope della funzione esterna
  }

  childFunction();
}

parentFunction();
console.log(a); // stampa 1, può accedere allo scope globale
console.log(b, c); // errore: non può accedere alle variabili dentro lo scope di funzione
```

### Esempio di Closure

Una closure si forma quando una funzione figlia è definita all'interno di una funzione genitore e viene restituita, così la funzione figlia mantiene l'accesso all'ambiente lessicale del genitore (evitando la garbage collection immediata per le variabili catturate).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Conteggio corrente: ${count}`);
  };
}

const counter = parentFunction();

counter(); // stampa Conteggio corrente: 1
counter(); // stampa Conteggio corrente: 2
// `count` viene preservato perché childFunction esiste ancora e mantiene un riferimento
```

Attenzione: le closure mantengono le variabili in memoria. Un uso eccessivo può aumentare l'utilizzo di memoria e ridurre le prestazioni.

## 2. Crea una funzione che soddisfi le seguenti condizioni

> Crea una funzione (usando i concetti di closure) che soddisfi:

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### Prima soluzione: due funzioni

Dividi in due stili di funzione:

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// usa la closure per salvare value
function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Seconda soluzione: funzione singola

Il primo approccio potrebbe essere rifiutato nei colloqui se chiedono una singola funzione che gestisca entrambi gli stili.

```js
function plus(value, subValue) {
  // determina il comportamento in base al numero di argomenti
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Sfrutta la funzionalità closure per incrementare il numero

> Usa le closure per implementare un conteggio incrementale:

```js
function plus() {
  // codice
}

var obj = plus();
obj.add(); // stampa 1
obj.add(); // stampa 2
```

### Prima soluzione: restituire un contenitore di variabili

Usa qui uno stile di funzione normale (non è necessaria una arrow function).

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Seconda soluzione: restituire direttamente l'oggetto

Puoi anche incapsulare l'oggetto direttamente nel `return`.

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. Cosa verrà stampato in questa chiamata di funzione annidata?

> Qual è l'output di questa chiamata di funzione annidata?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Analisi

**Output:**

```
hello
TypeError: aa is not a function
```

### Flusso di esecuzione dettagliato

```js
// Esegui a(b(c))
// JavaScript valuta le chiamate di funzione dall'interno verso l'esterno

// Passo 1: valuta b(c) interno
b(c)
  ↓
// c viene passata a b
// dentro b, bb() significa c()
c() // stampa 'hello'
  ↓
// b non ha un'istruzione return
// quindi restituisce undefined
return undefined

// Passo 2: valuta a(undefined)
a(undefined)
  ↓
// undefined viene passato ad a
// a prova aa(), cioè undefined()
undefined() // ❌ TypeError: aa is not a function
```

### Perché?

#### 1. Ordine di valutazione delle funzioni (interno -> esterno)

```js
// Esempio
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. esegui multiply(2, 3) prima -> 6
           └────── 3. poi esegui add(6)

// Stessa idea
a(b(c))
  ↑ ↑
  | └─ 1. valuta b(c)
  └─── 2. poi valuta a(risultato di b(c))
```

#### 2. Una funzione senza `return` restituisce `undefined`

```js
function b(bb) {
  bb(); // viene eseguita, ma nessun return
} // return undefined implicito

// Equivalente a
function b(bb) {
  bb();
  return undefined; // aggiunto implicitamente da JavaScript
}
```

#### 3. Chiamare un non-funzione lancia TypeError

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// altri casi di errore
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Come risolvere?

#### Metodo 1: far restituire a `b` una funzione

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b eseguita');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// output:
// hello
// b eseguita
```

#### Metodo 2: passare un riferimento a funzione, non eseguire troppo presto

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // stampa 'hello'

// oppure
a(() => b(c)); // stampa 'hello'
```

#### Metodo 3: cambiare il flusso di esecuzione

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// esegui separatamente
b(c); // stampa 'hello'
a(() => console.log('a eseguita')); // stampa 'a eseguita'
```

### Variazioni correlate nei colloqui

#### Domanda 1: cosa succede se cambiamo così?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Clicca per vedere la risposta</summary>

```
hello
TypeError: aa is not a function
```

**Spiegazione:**

1. `b(c)` -> esegue `c()`, stampa `'hello'`, restituisce `'world'`
2. `a('world')` -> prova a eseguire `'world'()`
3. `'world'` è una stringa, non una funzione, quindi lancia TypeError

</details>

#### Domanda 2: cosa succede se tutte le funzioni restituiscono valori?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Clicca per vedere la risposta</summary>

```
[Function: c]
hello
```

**Spiegazione:**

1. `b(c)` -> restituisce la funzione `c` stessa (non eseguita)
2. `a(c)` -> restituisce la funzione `c`
3. `result` è la funzione `c`
4. `result()` -> esegue `c()`, restituisce `'hello'`

</details>

### Punti chiave (Key Takeaways)

```javascript
// precedenza delle chiamate di funzione
a(b(c))
  ↓
// 1. valuta prima la chiamata interna
b(c) // se b non ha return, il risultato è undefined
  ↓
// 2. poi valuta la chiamata esterna
a(undefined) // chiamare undefined() lancia un errore

// soluzioni
// ✅ 1. assicurati che la funzione intermedia restituisca una funzione
// ✅ 2. oppure incapsula con una arrow function
a(() => b(c))
```

## Riferimenti

- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
