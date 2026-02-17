---
id: counter-number
title: 📄 Counter
slug: /counter-number
---

## Question Description

创建一个计数器，允许通过 `add()` 和 `minus()` 方法来增加或减少计数器的值。

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

使用工厂函数 `createCounter` 来创建计数器对象，将 `add()` 和 `minus()` 方法返回，并将 `count` 变量设置为私有变量，避免外部直接访问。

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
