---
id: random-number
title: 📄 Angka Acak
slug: /random-number
---

## Deskripsi Soal

Implementasikan `random()` yang menerima `min` dan `max`, lalu mengembalikan angka acak di antara `min` dan `max`.

Fungsi tersebut harus mengembalikan bilangan bulat acak di antara nilai min dan max.

## Versi TypeScript

```ts
function createRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error('The min parameter must be less than max');
  }

  return Math.floor(Math.random() * (max - min) + min);
}

console.log(createRandomNumber(0, 200)); // 0 ~ 199
```
