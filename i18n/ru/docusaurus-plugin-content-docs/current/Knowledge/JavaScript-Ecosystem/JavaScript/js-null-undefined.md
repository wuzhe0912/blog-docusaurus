---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Ключевые различия (Key Differences)

- **`undefined`**:
  - Указывает, что переменная была объявлена, но не получила значение.
  - Является значением по умолчанию для неинициализированных переменных.
  - Функция возвращает `undefined`, если явное возвращаемое значение не указано.
- **`null`**:
  - Представляет пустое значение или отсутствие значения.
  - Обычно присваивается явно как `null`.
  - Используется для указания того, что переменная намеренно не указывает ни на что.

## Пример (Example)

```js
let x;
console.log(x); // вывод: undefined

function foo() {}
console.log(foo()); // вывод: undefined

let y = null;
console.log(y); // вывод: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // вывод: null
```

## Проверка с помощью `typeof`

```js
console.log(typeof undefined); // вывод: "undefined"
console.log(typeof null); // вывод: "object"

console.log(null == undefined); // вывод: true
console.log(null === undefined); // вывод: false
```
