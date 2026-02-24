---
id: counter-number
title: 📄 Contatore
slug: /counter-number
---

## Descrizione della domanda

Crea un contatore che permetta di incrementare o decrementare il valore tramite i metodi `add()` e `minus()`.

## 1. Versione JavaScript

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

## 2. Versione TypeScript

Usa la factory function `createCounter` per creare un oggetto contatore, restituendo i metodi `add()` e `minus()` e mantenendo privata la variabile `count` per impedirne l'accesso diretto dall'esterno.

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
