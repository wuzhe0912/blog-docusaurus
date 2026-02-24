---
id: random-number
title: 📄 Случайное число
slug: /random-number
---

## Описание задачи

Реализуйте `random()`, который принимает `min` и `max` и возвращает случайное число в диапазоне между `min` и `max`.

Функция должна возвращать случайное целое число между минимальным и максимальным значениями.

## Версия на TypeScript

```ts
function createRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error('The min parameter must be less than max');
  }

  return Math.floor(Math.random() * (max - min) + min);
}

console.log(createRandomNumber(0, 200)); // 0 ~ 199
```
