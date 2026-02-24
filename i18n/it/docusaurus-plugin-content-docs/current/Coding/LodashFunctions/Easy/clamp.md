---
id: lodash-functions-easy-clamp
title: '📄 Clamp (limite intervallo)'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Descrizione della domanda

Implementa una funzione `clamp` che limita un numero a un intervallo specificato.

## Requisiti

- `clamp` accetta tre parametri: `number` (il valore), `lower` (limite inferiore) e `upper` (limite superiore).
- Se `number` è minore di `lower`, restituisce `lower`.
- Se `number` è maggiore di `upper`, restituisce `upper`.
- Altrimenti, restituisce `number`.

## I. Approccio Brute Force con condizioni `if`

```javascript
function clamp(number, lower, upper) {
  if (number < lower) {
    return lower;
  } else if (number > upper) {
    return upper;
  } else {
    return number;
  }
}
```

## II. Utilizzo di `Math.min` e `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
