---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Vergleich der Unterschiede

- **`undefined`**：
  - Zeigt an, dass eine Variable deklariert, aber noch kein Wert zugewiesen wurde.
  - Ist der Standardwert nicht initialisierter Variablen.
  - Wenn eine Funktion keinen expliziten Rückgabewert hat, gibt sie standardmäßig `undefined` zurück.
- **`null`**：
  - Steht für einen leeren Wert oder keinen Wert.
  - Muss in der Regel explizit als `null` zugewiesen werden.
  - Wird verwendet, um anzuzeigen, dass eine Variable absichtlich auf kein Objekt oder keinen Wert verweist.

## Beispiel

```js
let x;
console.log(x); // Ausgabe: undefined

function foo() {}
console.log(foo()); // Ausgabe: undefined

let y = null;
console.log(y); // Ausgabe: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Ausgabe: null
```

## Überprüfung mit typeof

```js
console.log(typeof undefined); // Ausgabe: "undefined"
console.log(typeof null); // Ausgabe: "object"

console.log(null == undefined); // Ausgabe: true
console.log(null === undefined); // Ausgabe: false
```
