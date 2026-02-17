---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

给定一个若干数字的数组，请使用 `sort` 函数，将数组进行排序，并请将下列两种状况，都提供解法：

1. 由小到大排序(升序)
2. 由大到小排序(降序)

### 升序排序

```js
const numbers = [10, 5, 50, 2, 200];

// 使用比较函数
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### 降序排序

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### 故意塞入 string

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

但这个解法无法排除无法转换为数字的字符串，例如 `'iphone'`, `'ipad'` 等等。这些字符串会被转换为 `NaN`，虽然可能排序上会在最后面，但也可能因为不同浏览器，产生不同结果。这种状况下，只能考虑使用 `filter` 先进行排除重组数组。

### Object 排序

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
