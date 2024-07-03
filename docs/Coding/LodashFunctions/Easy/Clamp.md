---
id: lodash-functions-easy-clamp
title: 'Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## 概述

實現 `clamp` 函式，將數值限制在指定的範圍內。

## 要求

- `clamp` 接受三個參數：`number`（數值）、`lower`（下限）和 `upper`（上限）。
- 如果 `number` 小於 `lower`，則返回 `lower`。
- 如果 `number` 大於 `upper`，則返回 `upper`。
- 否則，返回 `number`。

## 解法一

> 最直接的暴力解法，使用 `if` 條件判斷。

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

## 解法二

> 使用 `Math.min` 和 `Math.max` 函式。

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
