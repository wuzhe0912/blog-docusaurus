---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Question Description

Implement a `clamp` function that restricts a number to a specified range.

## Requirements

- `clamp` accepts three parameters: `number` (the value), `lower` (lower bound), and `upper` (upper bound).
- If `number` is less than `lower`, return `lower`.
- If `number` is greater than `upper`, return `upper`.
- Otherwise, return `number`.

## I. Brute Force Using `if` Conditionals

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

## II. Using `Math.min` and `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
