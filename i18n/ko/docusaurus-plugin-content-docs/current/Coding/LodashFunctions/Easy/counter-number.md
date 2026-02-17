---
id: counter-number
title: 📄 Counter
slug: /counter-number
---

## Question Description

카운터를 생성하고, `add()`와 `minus()` 메서드를 통해 카운터 값을 증가 또는 감소시킬 수 있도록 합니다.

## 1. JavaScript Version

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Counter</title>
</head>
<body>
    <p>Count: <span id="count">0</span></p>
    <button id="addBtn">Add</button>
    <button id="minusBtn">Minus</button>

    <script src="counter.js"></script>
</body>
</html>

```

```js
const createCounter = () => {
  let count = 0;
  const $countEl = document.querySelector('#count');

  const add = () => {
    count++;
    $countEl.textContent = count;
  };

  const minus = () => {
    count--;
    $countEl.textContent = count;
  };

  return { add, minus };
};

const counter = createCounter();

document.querySelector('#addBtn').addEventListener('click', counter.add);
document.querySelector('#minusBtn').addEventListener('click', counter.minus);
```

## 2. TypeScript Version

팩토리 함수 `createCounter`를 사용하여 카운터 객체를 생성하고, `add()`와 `minus()` 메서드를 반환합니다. `count` 변수는 private 변수로 설정하여 외부에서 직접 접근하는 것을 방지합니다.

```ts
type CounterType = {
  add: () => void;
  minus: () => void;
};

const createCounter = (): CounterType => {
  let count: number = 0;

  const add = () => {
    count++;
    console.log(count);
  };

  const minus = () => {
    count--;
    console.log(count);
  };

  return { add, minus };
};

const counter = createCounter();
counter.add(); // 1
counter.add(); // 2
counter.minus(); // 1
```
