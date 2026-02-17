---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE는 즉시 실행 함수 표현식이라고도 하며, 일반 함수와 작성법이 다릅니다. 외부에 `()`를 한 겹 더 감싸야 하며, 즉시 실행되는 특성을 가지고 있습니다:

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

이 외에도 recursion(재귀)을 사용하여 중단 조건에 도달할 때까지 반복 실행할 수 있으며, 끝부분의 `()`로 매개변수를 전달할 수 있습니다.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

다만 주의해야 할 점은, IIFE는 초기 실행 시에만 실행되거나 내부에서 재귀적으로 호출할 수 있을 뿐, 외부에서 다시 호출하여 실행할 수 없다는 것입니다.

## 2. Why use IIFE ?

### scope

변수가 function 내에서 소멸되는 특성을 이용하여, IIFE로 스코프를 격리하고 전역 변수의 오염을 방지할 수 있습니다. 아래 예시를 참고하세요:

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

IIFE와 closure를 결합하면 Private variable and methods를 만들 수 있습니다. 즉, function 내에 변수를 유지할 수 있으며, 해당 function을 호출할 때마다 이전 결과를 기반으로 값을 조정(증가 또는 감소 등)할 수 있습니다.

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

다만 주의해야 할 점은, 변수가 소멸되지 않기 때문에 남용하면 메모리를 차지하여 성능에 영향을 줄 수 있습니다.

### module

객체 형태로 실행할 수도 있습니다. 아래 예시를 보면 변수 증가뿐만 아니라 초기화도 가능함을 알 수 있습니다:

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

다른 작성 방법:

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

마지막으로 특히 주의해야 할 점은, IIFE의 즉시 실행 특성 때문에 연속된 두 개의 즉시 실행 함수가 있을 경우 `ASI(자동 세미콜론 삽입)` 규칙이 제대로 작동하지 않을 수 있다는 것입니다. 따라서 연속된 두 개의 IIFE가 있는 경우에는 직접 세미콜론을 추가해야 합니다.
