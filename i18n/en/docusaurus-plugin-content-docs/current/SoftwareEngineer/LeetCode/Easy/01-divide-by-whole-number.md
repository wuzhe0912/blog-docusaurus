---
id: 01-divide-by-whole-number
title: '📜 Divide by whole number'
slug: /01-divide-by-whole-number
---

## Question

> 請回答 1-10000000 這個範圍內，能被 3 或 7 整除，並且不能同時被 3 和 7 整除的整數數量。

## Answer (JavaScript)

```js
const filterArray = [];
const num = 1000000;

for (i = 1; i <= num; i++) {
  if (i % 3 === 0 || i % 7 === 0) {
    let checkSame = i % 3 === 0 && i % 7 === 0;
    if (!checkSame) {
      filterArray.push(i);
    }
  }
}

console.log(filterArray);
```
