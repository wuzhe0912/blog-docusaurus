---
id: counter-number
title: 📄 Счетчик
slug: /counter-number
---

## Описание задачи

Создайте счетчик, который позволяет увеличивать или уменьшать значение через методы `add()` и `minus()`.

## 1. Версия на JavaScript

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

## 2. Версия на TypeScript

Здесь используется фабричная функция `createCounter`, которая создает объект счетчика и возвращает методы `add()` и `minus()`, сохраняя переменную `count` приватной, чтобы нельзя было напрямую получить к ней доступ извне.

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
