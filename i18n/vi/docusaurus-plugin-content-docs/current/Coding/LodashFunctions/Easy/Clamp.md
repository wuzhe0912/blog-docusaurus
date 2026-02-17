---
id: lodash-functions-easy-clamp
title: '📄 Clamp'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Mô tả bài toán

Triển khai hàm `clamp` để giới hạn một giá trị trong phạm vi chỉ định.

## Yêu cầu

- `clamp` nhận ba tham số: `number` (giá trị số), `lower` (giới hạn dưới) và `upper` (giới hạn trên).
- Nếu `number` nhỏ hơn `lower`, trả về `lower`.
- Nếu `number` lớn hơn `upper`, trả về `upper`.
- Ngược lại, trả về `number`.

## I. Giải pháp brute force, sử dụng điều kiện `if`

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

## II. Sử dụng hàm `Math.min` và `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
