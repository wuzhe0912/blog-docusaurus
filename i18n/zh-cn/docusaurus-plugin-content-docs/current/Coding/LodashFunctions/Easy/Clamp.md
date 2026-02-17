---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## 问题描述

实现 `clamp` 函数，将数值限制在指定的范围内。

## 要求

- `clamp` 接受三个参数：`number`（数值）、`lower`（下限）和 `upper`（上限）。
- 如果 `number` 小于 `lower`，则返回 `lower`。
- 如果 `number` 大于 `upper`，则返回 `upper`。
- 否则，返回 `number`。

## I. 暴力解，使用 `if` 条件判断

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

## II. 使用 `Math.min` 和 `Math.max` 函数

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
