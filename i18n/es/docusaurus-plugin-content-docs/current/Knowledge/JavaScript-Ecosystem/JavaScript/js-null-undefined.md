---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Comparación de diferencias

- **`undefined`**：
  - Indica que una variable ha sido declarada pero aún no se le ha asignado un valor.
  - Es el valor por defecto de las variables no inicializadas.
  - Si una función no tiene un valor de retorno explícito, devuelve `undefined` por defecto.
- **`null`**：
  - Representa un valor vacío o la ausencia de valor.
  - Generalmente debe asignarse explícitamente como `null`.
  - Se usa para indicar que una variable intencionalmente no apunta a ningún objeto o valor.

## Ejemplo

```js
let x;
console.log(x); // Salida: undefined

function foo() {}
console.log(foo()); // Salida: undefined

let y = null;
console.log(y); // Salida: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Salida: null
```

## Verificación con typeof

```js
console.log(typeof undefined); // Salida: "undefined"
console.log(typeof null); // Salida: "object"

console.log(null == undefined); // Salida: true
console.log(null === undefined); // Salida: false
```
