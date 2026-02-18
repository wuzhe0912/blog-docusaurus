---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

Given an array of numbers, use the `sort` function to sort the array. Provide solutions for both scenarios:

1. Ascending order (smallest to largest)
2. Descending order (largest to smallest)

### Ascending Sort

```js
const numbers = [10, 5, 50, 2, 200];

// Using a comparison function
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Descending Sort

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Intentionally Inserting Strings

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

However, this solution cannot handle strings that cannot be converted to numbers, such as `'iphone'`, `'ipad'`, etc. These strings are converted to `NaN`, and while they may end up at the end of the sorted array, different browsers may produce different results. In such cases, consider using `filter` first to remove and restructure the array.

### Object Sorting

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
