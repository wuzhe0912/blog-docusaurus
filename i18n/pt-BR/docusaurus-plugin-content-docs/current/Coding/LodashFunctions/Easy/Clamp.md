---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Descrição do problema

Implemente a função `clamp` para limitar um valor dentro de um intervalo especificado.

## Requisitos

- `clamp` aceita três parâmetros: `number` (valor numérico), `lower` (limite inferior) e `upper` (limite superior).
- Se `number` for menor que `lower`, retorna `lower`.
- Se `number` for maior que `upper`, retorna `upper`.
- Caso contrário, retorna `number`.

## I. Solução por força bruta com condicionais `if`

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

## II. Uso de `Math.min` e `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
