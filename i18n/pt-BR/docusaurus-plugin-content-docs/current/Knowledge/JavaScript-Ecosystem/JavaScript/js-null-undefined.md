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
console.log(x); // 輸出：undefined

function foo() {}
console.log(foo()); // 輸出：undefined

let y = null;
console.log(y); // 輸出：null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // 輸出：null
```

## Verificacao com typeof

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
