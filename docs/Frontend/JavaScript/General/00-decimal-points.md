---
id: 00-decimal-points
title: '📜 Why 0.1 + 0.2 !== 0.3 ?'
slug: /decimal-points
---

> [關聯 : TikTok Questions](../../Interview/Jobs/00-tiktok.md/#vanilla-js)

## 原因

在多數的程式語言中，包含 JS 在內，當我們檢測這段數字時都會拿到 fasle 的結果 :

```javascript
0.1 + 0.2 == 0.3 // false

# or

0.1 + 0.2 === 0.3 // false
```

這是因為小數點數字對人類來說，或許是一種直觀的數字，但對電腦而言，則需透過 [binary64](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) 來計算呈現小數點數字。

雖然我對這部分的底層計算方式所知甚淺，僅知道電腦在計算 0.1 和 0.2 時，是透過一串數字 7205759403792794 \* 2 的 n 個負次方。

但因為這些尾數都非常龐大，所以我無意在這邊過度深入，僅知道電腦計算 0.1 和 0.2 這兩個小數時，拿到的近似值都略大於該數。

```javascript
0.1 => 0.10000000000000000555
0.2 => 0.2000000000000000111
```

到了計算 0.3 時，電腦改用 5404319552844596 \* 2 的 -54 次方，會拿到 `0.30000000000000004440`，這就導致了等式的兩側不相符合。

## 解決方法

### Library

> [math.js](https://github.com/josdejong/mathjs)

```javascript
const math = require('mathjs');

const a = 0.1;
const b = 0.2;

console.log(math.add(a, b)); // result 0.30000000000000004
console.log(math.format(math.bignumber(a)), math.bignumber(b)); // result 0.3
```

> [decimal.js](https://github.com/MikeMcl/decimal.js)

```javascript
const Decimal = require('decimal.js');

const a = new Decimal(0.1);
const b = 0.2;

console.log(a.plus(b).toString()); // result 0.3
```

> [big.js](https://github.com/MikeMcl/big.js/)

```javascript
const Big = require('big.js');
const a = new Big(0.1);
const b = 0.2;

console.log(a.plus(b).toString()); // result 0.3 => type = string
```

### Vanilla API

> [Number.prototype.toFixed()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed)

```javascript
parseFloat((0.1 + 0.2).toFixed(2)); // result 0.3
```

透過傳入參數，參數會決定要取到尾數多少位，進而忽略多餘的尾數。

## Reference

- [Why is 0.1 + 0.2 not equal to 0.3?](https://lemire.me/blog/2020/10/10/why-is-0-1-0-2-not-equal-to-0-3/)
- [如何解决 0.1 +0.2===0.30000000000000004 类问题](https://juejin.cn/post/6844903730349883406)
