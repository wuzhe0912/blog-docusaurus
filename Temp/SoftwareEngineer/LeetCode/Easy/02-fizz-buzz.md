---
id: 02-fizz-buzz
title: '📜 FizzBuzz'
slug: /02-fizz-buzz
---

## Question

```bash
給一個數字 n，印出 1~n，但如果碰到 3 的倍數，印出 Fizz，碰到 5 的倍數，改印 Buzz。

若同時碰到 3 跟 5 的倍數，印出 FizzBuzz。
```

## Answer (JavaScript)

```js
const num = 100;

for (let i = 1; i < num + 1; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log(`${i}：FizzBuzz`);
  } else if (i % 3 === 0) {
    console.log(`${i}：Fizz`);
  } else if (i % 5 === 0) {
    console.log(`${i}：Buzz`);
  } else {
    console.log(i);
  }
}
```
