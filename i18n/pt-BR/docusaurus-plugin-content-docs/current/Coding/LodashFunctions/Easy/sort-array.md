---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

Dado um array com vários números, use a função `sort` para ordenar o array. Forneça soluções para os dois casos a seguir:

1. Ordem crescente (do menor para o maior)
2. Ordem decrescente (do maior para o menor)

### Ordem crescente

```js
const numbers = [10, 5, 50, 2, 200];

// Usar função de comparação
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Ordem decrescente

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Inserir strings intencionalmente

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

No entanto, esta solução não consegue excluir strings que não podem ser convertidas em números, como `'iphone'`, `'ipad'`, etc. Essas strings serão convertidas em `NaN`, e embora provavelmente fiquem no final da ordenação, os resultados podem variar dependendo do navegador. Nestes casos, deve-se considerar usar `filter` primeiro para excluir e reorganizar o array.

### Ordenar Objects

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
