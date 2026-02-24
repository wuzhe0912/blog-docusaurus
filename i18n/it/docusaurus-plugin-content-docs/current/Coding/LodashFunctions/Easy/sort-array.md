---
id: sort-array
title: 📄 Ordina array
slug: /sort-array
---

## Descrizione della domanda

Dato un array di numeri, usa la funzione `sort` per ordinare l'array. Fornisci soluzioni per entrambi gli scenari:

1. Ordine crescente (dal più piccolo al più grande)
2. Ordine decrescente (dal più grande al più piccolo)

### Ordinamento crescente

```js
const numbers = [10, 5, 50, 2, 200];

// Using a comparison function
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Ordinamento decrescente

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Inserimento intenzionale di stringhe

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

Tuttavia, questa soluzione non può gestire stringhe che non possono essere convertite in numeri, come `'iphone'`, `'ipad'` ecc. Queste stringhe vengono convertite in `NaN` e, anche se possono finire in fondo all'array ordinato, browser diversi possono produrre risultati diversi. In questi casi, valuta di usare prima `filter` per ripulire e ristrutturare l'array.

### Ordinamento di oggetti

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
