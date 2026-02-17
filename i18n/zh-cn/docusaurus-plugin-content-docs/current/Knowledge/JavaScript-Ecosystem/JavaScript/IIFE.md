---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE 又称立即执行函数，与一般函数的写法有所差异，外层需多包裹一层 `()`，并且具有立即被执行的特性：

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

除此之外，也可以通过 recursion（递归）的方式来重复执行，直到中断条件，同时，结尾的 `()` 则能用来传入参数。

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

但需要注意的是，IIFE 仅能在初始时被执行，或是通过其本身内部重复调用，而无法通过外部再次调用执行。

## 2. Why use IIFE ?

### scope

基于变量在 function 中被销毁的特性，可以通过 IIFE 来达到隔离的效果，避免污染全局的变量。如下图：

```js
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

使用 IIFE 搭配 closure 可以建立 Private variable and methods，也就意味着可以在 function 中保存变量，每次调用这个 function，可以根据前一次的结果进行调整，比如递增或递减。

```js
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

但需要注意的是，变量因为没有被销毁，如果滥用的话，会占用内存，影响性能。

### module

通过对象的形式来执行，可以通过下面的案例看到，除了递增变量也能进行初始化：

```js
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
console.log(Score.current()); // result 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // result 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // result 0 => reset = 0
```

另一种写法：

```js
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

最后特别注意一点，因为 IIFE 的立即执行特性，倘若连续两个立即函数，会造成 `ASI（自动补全分号）`的规则没有运作。因此在连续两组 IIFE 的状况下，需要自己补上分号。
