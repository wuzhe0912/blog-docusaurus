---
id: lodash-functions-easy-clamp
title: '📄 Clamp (Batasi Nilai)'
slug: /lodash-functions-easy-clamp
tags: [Coding, Easy]
---

## Deskripsi Soal

Implementasikan fungsi `clamp` yang membatasi sebuah angka ke rentang tertentu.

## Persyaratan

- `clamp` menerima tiga parameter: `number` (nilai), `lower` (batas bawah), dan `upper` (batas atas).
- Jika `number` lebih kecil dari `lower`, kembalikan `lower`.
- Jika `number` lebih besar dari `upper`, kembalikan `upper`.
- Selain itu, kembalikan `number`.

## I. Brute Force dengan Kondisional `if`

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

## II. Menggunakan `Math.min` dan `Math.max`

```javascript
function clamp(number, lower, upper) {
  return Math.min(upper, Math.max(lower, number));
}
```
