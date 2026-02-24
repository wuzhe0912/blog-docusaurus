---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Описание задачи

Реализуйте функцию `clamp`, которая ограничивает число заданным диапазоном.

## Требования

- `clamp` принимает три параметра: `number` (значение), `lower` (нижняя граница) и `upper` (верхняя граница).
- Если `number` меньше `lower`, вернуть `lower`.
- Если `number` больше `upper`, вернуть `upper`.
- Иначе вернуть `number`.

## I. Переборный подход через условия `if`

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

## II. Через `Math.min` и `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
