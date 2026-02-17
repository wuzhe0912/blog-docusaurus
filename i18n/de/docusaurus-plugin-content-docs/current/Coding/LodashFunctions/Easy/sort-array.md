---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

Gegeben ist ein Array mit mehreren Zahlen. Verwende die `sort`-Funktion, um das Array zu sortieren, und biete Lösungen für die folgenden beiden Fälle:

1. Aufsteigende Sortierung (vom kleinsten zum größten)
2. Absteigende Sortierung (vom größten zum kleinsten)

### Aufsteigende Sortierung

```js
const numbers = [10, 5, 50, 2, 200];

// Vergleichsfunktion verwenden
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Absteigende Sortierung

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Absichtlich Strings einfügen

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

Diese Lösung kann jedoch Strings, die nicht in Zahlen umgewandelt werden können (z.B. `'iphone'`, `'ipad'`), nicht ausschließen. Diese Strings werden zu `NaN` konvertiert. Obwohl sie möglicherweise am Ende der Sortierung stehen, können je nach Browser unterschiedliche Ergebnisse auftreten. In solchen Fällen sollte man in Betracht ziehen, zuerst mit `filter` das Array zu bereinigen.

### Object Sortierung

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
