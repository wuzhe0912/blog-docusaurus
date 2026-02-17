---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Descripción del problema

Implementa la función `clamp` para limitar un valor dentro de un rango especificado.

## Requisitos

- `clamp` acepta tres parámetros: `number` (valor numérico), `lower` (límite inferior) y `upper` (límite superior).
- Si `number` es menor que `lower`, se devuelve `lower`.
- Si `number` es mayor que `upper`, se devuelve `upper`.
- En caso contrario, se devuelve `number`.

## I. Solución por fuerza bruta con condicionales `if`

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

## II. Uso de `Math.min` y `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
