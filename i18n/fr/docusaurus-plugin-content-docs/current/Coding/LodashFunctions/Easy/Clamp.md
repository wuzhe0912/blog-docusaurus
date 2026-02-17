---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Description du problème

Implémentez la fonction `clamp` pour limiter une valeur dans une plage spécifiée.

## Exigences

- `clamp` accepte trois paramètres : `number` (valeur numérique), `lower` (limite inférieure) et `upper` (limite supérieure).
- Si `number` est inférieur à `lower`, retourner `lower`.
- Si `number` est supérieur à `upper`, retourner `upper`.
- Sinon, retourner `number`.

## I. Solution par force brute avec des conditions `if`

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

## II. Utilisation de `Math.min` et `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
