---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Differenze principali (Key Differences)

- **`undefined`**:
  - Indica che una variabile è stata dichiarata ma non assegnata.
  - È il valore predefinito per le variabili non inizializzate.
  - Una funzione restituisce `undefined` se non viene fornito un valore di ritorno esplicito.
- **`null`**:
  - Rappresenta un valore vuoto o l'assenza di valore.
  - Solitamente viene assegnato esplicitamente come `null`.
  - Viene usato per indicare che una variabile punta intenzionalmente a nulla.

## Esempio

```js
let x;
console.log(x); // output: undefined

function foo() {}
console.log(foo()); // output: undefined

let y = null;
console.log(y); // output: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // output: null
```

## Validazione con `typeof`

```js
console.log(typeof undefined); // output: "undefined"
console.log(typeof null); // output: "object"

console.log(null == undefined); // output: true
console.log(null === undefined); // output: false
```
