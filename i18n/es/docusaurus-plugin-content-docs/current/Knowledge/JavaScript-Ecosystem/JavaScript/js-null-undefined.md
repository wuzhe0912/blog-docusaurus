---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Comparacion de diferencias

- **`undefined`**：
  - Indica que una variable ha sido declarada pero aun no se le ha asignado un valor.
  - Es el valor por defecto de las variables no inicializadas.
  - Si una funcion no tiene un valor de retorno explicito, devuelve `undefined` por defecto.
- **`null`**：
  - Representa un valor vacio o la ausencia de valor.
  - Generalmente debe asignarse explicitamente como `null`.
  - Se usa para indicar que una variable intencionalmente no apunta a ningun objeto o valor.

## Ejemplo

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

## Verificacion con typeof

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
