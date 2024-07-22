---
id: 04-sun-of-n-number
title: '📜 Calculate the sun of N numbers'
slug: /04-sun-of-n-number
---

## Question

```bash
假設有一個數字 N，我們要求 1+…_+N 的總和。
```

## Answer (JavaScript)

```js
// use closure to save variable
function solve(num) {
  let sumNumber = 0;
  for (let i = 1; i <= num; i++) {
    sumNumber += i;
  }
  return sumNumber;
}

console.log(solve(10));
```
