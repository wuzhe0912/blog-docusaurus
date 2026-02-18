---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE stands for Immediately Invoked Function Expression.  
Compared with a normal function declaration, it wraps the function with an extra `()` and executes immediately:

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

It can also run repeatedly through recursion until a stop condition is reached, and the trailing `()` can pass in parameters.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Note that an IIFE runs at initialization time (or via internal self-calls), but cannot be called again directly from outside.

## 2. Why use IIFE ?

### scope

Because variables declared inside a function are scoped to that function, IIFE can isolate state and avoid polluting globals:

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

Using IIFE with closure can create private variables and methods.  
That means state can be preserved inside the function and updated on each call (for example, increment/decrement).

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

Be careful: because those variables persist, overuse can consume memory and hurt performance.

### module

You can expose functionality in object form as a module pattern.  
In the example below, you can increment and also reset state:

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

Another style:

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

One more note: because IIFEs execute immediately, placing two IIFEs back-to-back can break `ASI` (Automatic Semicolon Insertion).  
When chaining IIFEs, add semicolons explicitly.
