---
id: 01-IIFE
title: '📜 IIFE'
slug: /IIFE
---

> [關聯 : TikTok Questions](../../Interview/Jobs/00-tiktok.md/#vanilla-js)

## Intro

> IIFE 又稱立即執行函式，與一般函式的寫法有所差異，外層需多包裹一層 `()`，並且具有立即被執行的特性 :

```javascript
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

除此之外，也可以透過遞迴(recursion)的方式來重複執行，直到中斷條件，同時，結尾的 `()` 則能用傳入參數。

```javascript
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

但需要注意的是，IIFE 僅能在初始時被執行，或是透過其本身內部重複呼叫，而無法透過外部再次呼叫執行。

## Why use IIFE ?

### scope

基於變數在 function 中被銷毀的特性，可以透過 IIFE 來達到隔離的效果，避免污染全域的變數。如下圖：

```javascript
// global
const name = 'Yumi';

const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // result Pitt
  console.log(Hello()); // result Hello Pitt!
})();

console.log(name); // result Yumi
console.log(Hello()); // result Hello Yumi!
```

### private variable and methods

使用 IIFE 搭配 closure 可以建立 Private variable and methods，也就意味著可以在 function 中保存變數，每次呼叫這個 function，可以根據前一次的結果進行調整，譬如遞增或遞減。

```javascript
const increment = (() => {
  let result = 0;
  console.log(result);
  const credits = (num) => {
    console.log(`I have ${num} credits.`);
  };
  return () => {
    result += 1;
    credits(result);
  };
})();

increment(); // I have 1 credits.
increment(); // I have 2 credits.
```

但需要注意的是，變數因為沒有被銷毀，如果濫用的話，會佔用記憶體，影響效能。

### module

透過物件的形式來執行，可以透過下面的案例看到，除了遞增變數也能進行初始化：

```javascript
const Score = (() => {
  let result = 0;

  return {
    current: () => {
      return result;
    },

    increment: () => {
      result += 1;
    },

    reset: () => {
      result = 0;
    },
  };
})();

Score.increment();
console.log(Score.current());
Score.increment();
console.log(Score.current());
Score.reset();
console.log(Score.current());
```

另一種寫法：

```javascript
const Score = (() => {
  let result = 0;
  const current = () => {
    return result;
  };

  const increment = () => {
    result += 1;
  };

  const reset = () => {
    result = 0;
  };

  return {
    current: current,
    increment: increment,
    reset: reset,
  };
})();

Score.increment();
console.log(Score.current());
Score.increment();
console.log(Score.current());
Score.reset();
console.log(Score.current());
```
