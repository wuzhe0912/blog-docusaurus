---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## 問題の説明

`clamp` 関数を実装し、数値を指定された範囲内に制限します。

## 要件

- `clamp` は3つの引数を受け取ります：`number`（数値）、`lower`（下限）、`upper`（上限）。
- `number` が `lower` より小さい場合、`lower` を返します。
- `number` が `upper` より大きい場合、`upper` を返します。
- それ以外の場合は、`number` を返します。

## I. ブルートフォース解法、`if` 条件分岐を使用

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

## II. `Math.min` と `Math.max` 関数を使用

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
