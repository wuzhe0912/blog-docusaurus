---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Comparacao das diferencas

- **`undefined`**：
  - Indica que uma variavel foi declarada, mas ainda nao recebeu um valor.
  - E o valor padrao de variaveis nao inicializadas.
  - Se uma funcao nao possui um valor de retorno explicito, retorna `undefined` por padrao.
- **`null`**：
  - Representa um valor vazio ou a ausencia de valor.
  - Geralmente deve ser explicitamente atribuido como `null`.
  - Usado para indicar que uma variavel intencionalmente nao aponta para nenhum objeto ou valor.

## Exemplo

```js
let x;
console.log(x); // Saida: undefined

function foo() {}
console.log(foo()); // Saida: undefined

let y = null;
console.log(y); // Saida: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Saida: null
```

## Verificacao com typeof

```js
console.log(typeof undefined); // Saida: "undefined"
console.log(typeof null); // Saida: "object"

console.log(null == undefined); // Saida: true
console.log(null === undefined); // Saida: false
```
