---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Comparação das diferenças

- **`undefined`**：
  - Indica que uma variável foi declarada, mas ainda não recebeu um valor.
  - É o valor padrão de variáveis não inicializadas.
  - Se uma função não possui um valor de retorno explícito, retorna `undefined` por padrão.
- **`null`**：
  - Representa um valor vazio ou a ausência de valor.
  - Geralmente deve ser explicitamente atribuído como `null`.
  - Usado para indicar que uma variável intencionalmente não aponta para nenhum objeto ou valor.

## Exemplo

```js
let x;
console.log(x); // Saída: undefined

function foo() {}
console.log(foo()); // Saída: undefined

let y = null;
console.log(y); // Saída: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Saída: null
```

## Verificação com typeof

```js
console.log(typeof undefined); // Saída: "undefined"
console.log(typeof null); // Saída: "object"

console.log(null == undefined); // Saída: true
console.log(null === undefined); // Saída: false
```
