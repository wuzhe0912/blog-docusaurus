---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

Dado un array de varios números, usa la función `sort` para ordenar el array. Proporciona soluciones para los siguientes dos casos:

1. Orden ascendente (de menor a mayor)
2. Orden descendente (de mayor a menor)

### Orden ascendente

```js
const numbers = [10, 5, 50, 2, 200];

// Usar función de comparación
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Orden descendente

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Insertar strings intencionalmente

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

Sin embargo, esta solución no puede excluir strings que no se pueden convertir a números, como `'iphone'`, `'ipad'`, etc. Estos strings se convertirán a `NaN`, y aunque probablemente queden al final del ordenamiento, los resultados pueden variar según el navegador. En estos casos, se debe considerar usar `filter` primero para excluir y reorganizar el array.

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
