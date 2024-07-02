---
id: 03-odd-or-even-number
title: '📜 Determining odd or even numbers'
slug: /03-odd-or-even-number
---

## Question

```bash
如何印出 1~100？並判斷某個數是偶數？或是奇數？
```

## Answer (JavaScript)

```js
for (let i = 1; i < 101; i++) {
  if (i % 2 === 0) {
    console.log(`${i} is even number.`);
  } else {
    console.log(`${i} is odd number.`);
  }
}
```
