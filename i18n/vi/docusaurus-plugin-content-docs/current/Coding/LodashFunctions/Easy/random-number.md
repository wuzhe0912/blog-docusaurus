---
id: random-number
title: 📄 Random Number
slug: /random-number
---

## Question Description

Implement a `random()` that takes a `min` and `max` and returns a random number between `min` and `max`.

The function should return a random integer between the min and max values.

## TypeScript Version

```ts
function createRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error('Tham số min không được lớn hơn hoặc bằng max');
  }

  return Math.floor(Math.random() * (max - min) + min);
}

console.log(createRandomNumber(0, 200)); // 0 ~ 199
```
