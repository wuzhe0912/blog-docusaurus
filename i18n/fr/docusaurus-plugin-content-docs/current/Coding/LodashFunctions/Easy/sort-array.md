---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

Étant donné un tableau de plusieurs nombres, utilisez la fonction `sort` pour trier le tableau. Fournissez des solutions pour les deux cas suivants :

1. Tri croissant (du plus petit au plus grand)
2. Tri décroissant (du plus grand au plus petit)

### Tri croissant

```js
const numbers = [10, 5, 50, 2, 200];

// Utiliser une fonction de comparaison
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Tri décroissant

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Insérer intentionnellement des strings

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

Cependant, cette solution ne peut pas exclure les chaînes de caractères qui ne peuvent pas être converties en nombres, comme `'iphone'`, `'ipad'`, etc. Ces chaînes seront converties en `NaN`, et bien qu'elles se retrouvent probablement à la fin du tri, les résultats peuvent varier selon le navigateur. Dans ce cas, il faut envisager d'utiliser `filter` au préalable pour exclure et réorganiser le tableau.

### Tri d'Objects

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
