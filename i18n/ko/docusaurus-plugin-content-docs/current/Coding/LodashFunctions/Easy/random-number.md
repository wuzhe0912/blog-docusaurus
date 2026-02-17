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
    throw new Error('전달된 min 매개변수는 max보다 크거나 같을 수 없습니다');
  }

  return Math.floor(Math.random() * (max - min) + min);
}

console.log(createRandomNumber(0, 200)); // 0 ~ 199
```
