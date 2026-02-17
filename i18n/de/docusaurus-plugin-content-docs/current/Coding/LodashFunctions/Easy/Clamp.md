---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Problembeschreibung

Implementiere die `clamp`-Funktion, um einen Wert auf einen bestimmten Bereich zu begrenzen.

## Anforderungen

- `clamp` akzeptiert drei Parameter: `number` (Zahlenwert), `lower` (Untergrenze) und `upper` (Obergrenze).
- Wenn `number` kleiner als `lower` ist, wird `lower` zurückgegeben.
- Wenn `number` größer als `upper` ist, wird `upper` zurückgegeben.
- Andernfalls wird `number` zurückgegeben.

## I. Brute-Force-Lösung mit `if`-Bedingungen

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

## II. Verwendung von `Math.min` und `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
