---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Panoramica (Overview)

JavaScript ha tre parole chiave per dichiarare variabili: `var`, `let` e `const`.
Tutte e tre dichiarano variabili, ma differiscono per scope, requisiti di inizializzazione, comportamento di ridichiarazione, regole di riassegnazione e tempistica di accesso.

## Differenze principali (Key Differences)

| Comportamento          | `var`                     | `let`                     | `const`                   |
| ---------------------- | ------------------------- | ------------------------- | ------------------------- |
| Scope                  | Funzione o globale        | Blocco                    | Blocco                    |
| Inizializzazione       | Facoltativa               | Facoltativa               | Obbligatoria              |
| Ridichiarazione        | Consentita                | Non consentita            | Non consentita            |
| Riassegnazione         | Consentita                | Consentita                | Non consentita            |
| Accesso prima della dichiarazione | Restituisce `undefined` | Lancia `ReferenceError` | Lancia `ReferenceError` |

## Spiegazione dettagliata (Detailed Explanation)

### Scope

`var` ha scope di funzione (o scope globale), mentre `let` e `const` hanno scope di blocco (inclusi blocchi di funzione, blocchi `if-else` e cicli `for`).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Inizializzazione (Initialization)

`var` e `let` possono essere dichiarati senza inizializzazione, ma `const` deve essere inizializzato al momento della dichiarazione.

```javascript
var varVariable; // valido
let letVariable; // valido
const constVariable; // SyntaxError: Missing initializer in const declaration
```

### Ridichiarazione (Redeclaration)

Nello stesso scope, `var` consente la ridichiarazione della stessa variabile, mentre `let` e `const` no.

```javascript
var x = 1;
var x = 2; // valido, x ora è 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Riassegnazione (Reassignment)

Le variabili dichiarate con `var` e `let` possono essere riassegnate, mentre le variabili `const` no.

```javascript
var x = 1;
x = 2; // valido

let y = 1;
y = 2; // valido

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Nota: anche se una variabile `const` non può essere riassegnata, il contenuto di oggetti/array può comunque essere modificato.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // valido
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // valido
console.log(arr); // [1, 2, 3, 4]
```

### Accesso prima della dichiarazione (Temporal Dead Zone)

Le variabili dichiarate con `var` vengono sollevate e inizializzate a `undefined`.
Anche `let` e `const` vengono sollevate, ma non sono inizializzate prima della dichiarazione, quindi accedervi prima lancia `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Domanda di colloquio (Interview Question)

### Domanda: la classica trappola `setTimeout + var`

Prevedi l'output di questo codice:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Risposta errata comune

Molte persone pensano che l'output sia: `1 2 3 4 5`

#### Output effettivo

```
6
6
6
6
6
```

#### Perché?

Questa domanda coinvolge tre concetti fondamentali:

**1. Scope di funzione di `var`**

```javascript
// `var` non crea scope di blocco nei cicli
for (var i = 1; i <= 5; i++) {
  // `i` è nello scope esterno; tutte le iterazioni condividono lo stesso `i`
}
console.log(i); // 6 (dopo la fine del ciclo)

// idea equivalente con `var`
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4;
  // il ciclo termina
}
```

**2. Esecuzione asincrona di `setTimeout`**

```javascript
// `setTimeout` è asincrono e viene eseguito dopo che il codice sincrono corrente termina
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Questo callback è accodato nell'event loop
    console.log(i);
  }, 0);
}
// Il ciclo termina prima (`i` diventa 6), poi i callback vengono eseguiti
```

**3. Riferimento della closure**

```javascript
// Tutti i callback fanno riferimento allo stesso `i`
// Al momento dell'esecuzione, `i` è già 6
```

#### Soluzioni

**Soluzione 1: Usa `let` (raccomandata) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// output: 1 2 3 4 5

// `let` si comporta concettualmente come:
{
  let i = 1; // prima iterazione
}
{
  let i = 2; // seconda iterazione
}
{
  let i = 3; // terza iterazione
}
```

**Perché funziona**: `let` crea un nuovo binding con scope di blocco ad ogni iterazione, così ogni callback cattura il valore di quella iterazione.

```javascript
// concettualmente equivalente a:
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ...e così via
```

**Soluzione 2: Usa IIFE (Immediately Invoked Function Expression)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// output: 1 2 3 4 5
```

**Perché funziona**: ogni iterazione crea un nuovo scope di funzione e passa l'`i` corrente come parametro `j`.

**Soluzione 3: Usa il terzo parametro di `setTimeout`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // il terzo argomento viene passato al callback
}
// output: 1 2 3 4 5
```

**Perché funziona**: i parametri dopo il delay vengono passati alla funzione callback.

**Soluzione 4: Usa `bind`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// output: 1 2 3 4 5
```

**Perché funziona**: `bind` crea una nuova funzione con l'`i` corrente vincolato come argomento.

#### Confronto delle soluzioni

| Soluzione              | Pro                      | Contro                   | Raccomandazione |
| ---------------------- | ------------------------ | ------------------------ | --------------- |
| `let`                  | Conciso, moderno, chiaro | Richiede ES6+            | 5/5 fortemente raccomandato |
| IIFE                   | Buona compatibilità      | Sintassi più verbosa     | 3/5 accettabile |
| Arg. `setTimeout`      | Semplice e diretto       | Poco conosciuto da molti | 4/5 raccomandato |
| `bind`                 | Stile funzionale         | Leggermente meno leggibile | 3/5 accettabile |

#### Domande di approfondimento

**D1: Cosa succede se cambiamo così?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Risposta**: stampa `6` una volta al secondo, per un totale di 5 volte (a 1s, 2s, 3s, 4s e 5s).

**D2: Come stampiamo 1, 2, 3, 4, 5 in ordine, uno al secondo?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// stampa 1 dopo 1s
// stampa 2 dopo 2s
// stampa 3 dopo 3s
// stampa 4 dopo 4s
// stampa 5 dopo 5s
```

#### Punti chiave per i colloqui (Interview Focus Points)

Questa domanda testa:

1. ✅ **Scope di `var`**: scope di funzione vs scope di blocco
2. ✅ **Event Loop**: esecuzione sincrona vs asincrona
3. ✅ **Closure**: come le funzioni catturano le variabili esterne
4. ✅ **Soluzioni**: approcci multipli e compromessi

Flusso di risposta raccomandato nei colloqui:

- Dichiara prima il risultato corretto (`6 6 6 6 6`)
- Spiega la causa (scope di `var` + `setTimeout` asincrono)
- Fornisci le correzioni (preferisci `let`, poi menziona le alternative)
- Mostra comprensione degli internals di JavaScript

## Best practice

1. Preferisci `const` come prima scelta: se una variabile non necessita di riassegnazione, `const` migliora leggibilità e manutenibilità.
2. Usa `let` quando la riassegnazione è necessaria.
3. Evita `var` nel JavaScript moderno: il suo comportamento di scope/hoisting causa spesso problemi imprevisti.
4. Considera la compatibilità del browser: per i browser vecchi, usa transpiler come Babel per convertire `let`/`const`.

## Argomenti correlati

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
