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
  - Wenn eine Funktion keinen expliziten Rueckgabewert hat, gibt sie standardmaessig `undefined` zurueck.
- **`null`**：
  - Steht fuer einen leeren Wert oder keinen Wert.
  - Muss in der Regel explizit als `null` zugewiesen werden.
  - Wird verwendet, um anzuzeigen, dass eine Variable absichtlich auf kein Objekt oder keinen Wert verweist.

## Beispiel

```js
let x;
console.log(x); // 輸出：undefined

function foo() {}
console.log(foo()); // 輸出：undefined

let y = null;
console.log(y); // 輸出：null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // 輸出：null
```

## Ueberpruefung mit typeof

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
