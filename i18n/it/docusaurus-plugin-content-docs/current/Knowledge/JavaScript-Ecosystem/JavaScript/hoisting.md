---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. Cos'è l'Hoisting?

L'esecuzione di JavaScript può essere vista come due fasi: creazione ed esecuzione.

```js
var name = 'Pitt';
console.log(name); // stampa Pitt
```

Con l'hoisting, il motore gestisce concettualmente prima la dichiarazione e poi l'assegnazione:

```js
// creazione
var name;

// esecuzione
name = 'Pitt';
console.log(name);
```

Le funzioni si comportano diversamente dalle variabili. Una dichiarazione di funzione viene vincolata durante la fase di creazione:

```js
getName();

function getName() {
  console.log('string'); // stampa string
}
```

Funziona perché la dichiarazione di funzione viene sollevata (hoisted) prima delle chiamate in fase di esecuzione:

```js
// creazione
function getName() {
  console.log('string');
}

// esecuzione
getName();
```

Nota: con le espressioni di funzione, l'ordine di dichiarazione e assegnazione è ancora importante.

Nella fase di creazione, le dichiarazioni di funzione hanno priorità più alta rispetto alle dichiarazioni di variabili.

### Corretto

```js
name = 'Yumy';
console.log(name); // stampa Yumy
var name;

// --- Equivale a ---

// creazione
var name;

// esecuzione
name = 'Yumy';
console.log(name); // stampa Yumy
```

### Sbagliato

```js
console.log(name); // stampa undefined
var name = 'Jane';

// --- Equivale a ---

// creazione
var name;

// esecuzione
console.log(name); // stampa undefined, perché l'assegnazione non è ancora avvenuta
name = 'Pitt';
```

## 2. Cosa viene stampato per `name`?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Risposta

```js
// creazione
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// esecuzione
whoseName();
name = 'Pitt';
console.log(name); // stampa Pitt
```

Dentro `whoseName()`, `name` inizia come `undefined`, quindi il ramo `if (name)` non viene eseguito.
Dopo, `name` viene assegnato `'Pitt'`, quindi l'output finale è comunque `Pitt`.

---

## 3. Dichiarazione di funzione vs dichiarazione di variabile: priorità dell'Hoisting

### Domanda: funzione e variabile con lo stesso nome

Prevedi l'output di questo codice:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Risposte errate comuni

Molte persone pensano che:

- Stamperà `undefined` (supponendo che `var` venga sollevato per primo)
- Stamperà `'1'` (supponendo che l'assegnazione sia già avvenuta)
- Lancerà un errore (supponendo un conflitto per stesso nome)

### Output effettivo

```js
[Function: foo]
```

### Perché?

Questa domanda testa la **regola di priorità dell'hoisting**:

**Priorità dell'hoisting: dichiarazione di funzione > dichiarazione di variabile**

```js
// Codice originale
console.log(foo);
var foo = '1';
function foo() {}

// Equivalente dopo l'hoisting
// Fase 1: creazione (hoisting)
function foo() {} // 1. la dichiarazione di funzione viene sollevata per prima
var foo; // 2. la dichiarazione di variabile viene sollevata (non sovrascrive la funzione)

// Fase 2: esecuzione
console.log(foo); // foo è una funzione qui
foo = '1'; // 3. l'assegnazione sovrascrive la funzione
```

### Concetti chiave

**1. Le dichiarazioni di funzione vengono completamente sollevate**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. `var` solleva solo la dichiarazione, non l'assegnazione**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Quando dichiarazioni di funzione e variabile condividono un nome**

```js
// Ordine di hoisting
function foo() {} // la funzione viene sollevata e inizializzata per prima
var foo; // dichiarazione sollevata, ma non sovrascrive la funzione

// Quindi foo è ancora una funzione
console.log(foo); // [Function: foo]
```

### Flusso di esecuzione completo

```js
// Codice originale
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Equivalente ========

// Fase di creazione (hoisting)
function foo() {} // 1️⃣ la dichiarazione di funzione viene completamente sollevata
var foo; // 2️⃣ la dichiarazione di variabile viene sollevata ma non sostituisce la funzione

// Fase di esecuzione
console.log(foo); // [Function: foo]
foo = '1'; // 3️⃣ l'assegnazione ora sovrascrive la funzione
console.log(foo); // '1'
```

### Domande estese

#### Domanda A: l'ordine cambia il risultato?

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Risposta:**

```js
[Function: foo] // primo output
'1' // secondo output
```

**Motivo:** l'ordine nel sorgente non cambia la priorità dell'hoisting. La dichiarazione di funzione vince comunque sulla dichiarazione di variabile nella fase di creazione.

#### Domanda B: funzioni multiple con lo stesso nome

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**Risposta:**

```js
[Function: foo] // primo output (la dichiarazione di funzione successiva sovrascrive la precedente)
'1' // secondo output (l'assegnazione sovrascrive la funzione)
```

**Motivo:**

```js
// Dopo l'hoisting
function foo() {
  return 1;
} // prima funzione

function foo() {
  return 2;
} // la seconda funzione sovrascrive la prima

var foo; // solo dichiarazione (non sovrascrive la funzione)

console.log(foo); // funzione che restituisce 2
foo = '1'; // l'assegnazione sovrascrive la funzione
console.log(foo); // '1'
```

#### Domanda C: espressione di funzione vs dichiarazione di funzione

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**Risposta:**

```js
undefined // foo è undefined
[Function: bar] // bar è una funzione
```

**Motivo:**

```js
// Dopo l'hoisting
var foo; // la dichiarazione di variabile viene sollevata (il corpo della funzione no)
function bar() {
  return 2;
} // la dichiarazione di funzione viene completamente sollevata

console.log(foo); // undefined
console.log(bar); // funzione

foo = function () {
  return 1;
}; // assegnazione a runtime
```

**Differenza chiave:**

- **Dichiarazione di funzione**: `function foo() {}` -> completamente sollevata (incluso il corpo)
- **Espressione di funzione**: `var foo = function() {}` -> solo il nome della variabile viene sollevato

### `let`/`const` evitano questo pattern

```js
// ❌ `var` ha insidie di hoisting
console.log(foo); // undefined
var foo = '1';

// ✅ let/const sono nella TDZ prima dell'inizializzazione
console.log(bar); // ReferenceError
let bar = '1';

// ✅ usare lo stesso nome con funzione e let/const lancia un errore
function baz() {}
let baz = '1'; // SyntaxError: Identifier 'baz' has already been declared
```

### Riepilogo delle priorità dell'Hoisting

```
Priorità dell'hoisting (alta -> bassa):

1. Dichiarazione di funzione
   - function foo() {} ✅ completamente sollevata
   - priorità più alta

2. Dichiarazione di variabile
   - var foo ⚠️ solo dichiarazione (nessuna assegnazione)
   - non sovrascrive una dichiarazione di funzione esistente

3. Assegnazione di variabile
   - foo = '1' ✅ può sovrascrivere la funzione
   - avviene solo nella fase di esecuzione

4. Espressione di funzione
   - var foo = function() {} ⚠️ trattata come assegnazione
   - solo il nome della variabile viene sollevato
```

### Focus nei colloqui (Interview Focus)

Quando rispondi a questo tipo di domande, puoi seguire questa struttura:

1. Spiega l'hoisting come due fasi: creazione ed esecuzione.
2. Enfatizza la priorità: dichiarazione di funzione > dichiarazione di variabile.
3. Riscrivi il codice nella forma dopo l'hoisting per mostrare il ragionamento.
4. Menziona le best practice: preferisci `let`/`const`, ed evita i pattern confusi di `var`.

**Risposta esempio per un colloquio:**

> Questa domanda riguarda la priorità dell'hoisting. In JavaScript, le dichiarazioni di funzione vengono sollevate prima delle dichiarazioni di variabili.
>
> Il motore attraversa due fasi:
>
> 1. Fase di creazione: `function foo() {}` viene sollevata per prima, poi `var foo` viene sollevata senza sovrascrivere la funzione.
> 2. Fase di esecuzione: `console.log(foo)` stampa la funzione, e solo successivamente `foo = '1'` la sovrascrive.
>
> In pratica, usa `let`/`const` invece di `var` per evitare questa confusione.

---

## Argomenti correlati

- [Differenze tra var, let, const](/docs/let-var-const-differences)
