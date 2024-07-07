---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

給定一個若干數字的陣列，請使用 `sort` 函式，將陣列進行排序，並請將下列兩種狀況，都提供解法：

1. 由小到大排序(升冪)
2. 由大到小排序(降冪)

### 升冪排序

```js
const numbers = [10, 5, 50, 2, 200];

// 使用比較函式
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### 降冪排序

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

但這個解法無法排除，無法轉換為數字的字串，例如 `'iphone'`, `'ipad'` 等等。這些字串會被轉換為 `NaN`，雖然可能排序上會在最後面，但也可能因為不同瀏覽器，產生不同結果。這種狀況下，只能考慮使用 `filter` 先進行排除重組陣列。

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
