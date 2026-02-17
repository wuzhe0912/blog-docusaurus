---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE は即時実行関数式とも呼ばれ、通常の関数とは書き方が異なり、外側にもう一層 `()` で囲む必要があり、即座に実行される特性を持っています：

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

さらに、recursion（再帰）を使って中断条件に達するまで繰り返し実行することもできます。末尾の `()` には引数を渡すことができます。

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

ただし注意すべき点として、IIFE は初回時にのみ実行されるか、内部から再帰的に呼び出すことしかできず、外部から再度呼び出して実行することはできません。

## 2. Why use IIFE ?

### scope

変数が function 内で破棄される特性を利用して、IIFE で変数のスコープを隔離し、グローバル変数の汚染を防ぐことができます。以下の例をご覧ください：

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

IIFE と closure を組み合わせることで、Private variable and methods を作成できます。つまり、function 内に変数を保持でき、その function を呼び出すたびに前回の結果に基づいて値を調整（インクリメントやデクリメントなど）できます。

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

ただし注意すべき点として、変数が破棄されないため、乱用するとメモリを占有し、パフォーマンスに影響を与える可能性があります。

### module

オブジェクト形式で実行することもできます。以下の例では、変数のインクリメントだけでなく初期化も行えることがわかります：

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

別の書き方：

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

最後に特に注意すべき点として、IIFE の即時実行という特性から、連続する2つの即時関数がある場合、`ASI（自動セミコロン挿入）`のルールが正しく動作しないことがあります。そのため、連続する2つの IIFE がある場合は、自分でセミコロンを補う必要があります。
