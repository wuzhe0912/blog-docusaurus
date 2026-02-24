---
id: random-number
title: 📄 Numero casuale
slug: /random-number
---

## Descrizione della domanda

Implementa una funzione `random()` che riceva `min` e `max` e restituisca un numero casuale tra `min` e `max`.

La funzione deve restituire un intero casuale compreso tra il valore minimo e quello massimo.

## Versione TypeScript

```ts
function createRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error('The min parameter must be less than max');
  }

  return Math.floor(Math.random() * (max - min) + min);
}

console.log(createRandomNumber(0, 200)); // 0 ~ 199
```
