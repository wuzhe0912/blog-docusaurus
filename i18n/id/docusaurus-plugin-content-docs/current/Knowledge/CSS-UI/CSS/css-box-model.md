---
id: css-box-model
title: '[Easy] Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## 1. Apa itu CSS Box Model?

CSS Box Model menjelaskan bagaimana ukuran dan jarak elemen dihitung.

Setiap elemen terdiri dari:

- `content`: teks atau media yang sebenarnya
- `padding`: ruang antara content dan border
- `border`: garis tepi di sekitar content + padding
- `margin`: ruang luar antara elemen

```css
.card {
  width: 240px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 12px;
}
```

## 2. Apa yang dikontrol oleh `box-sizing`?

`box-sizing` menentukan apakah `padding` dan `border` termasuk dalam width/height yang dideklarasikan.

### `content-box` (default)

Width yang dideklarasikan = hanya content.

Width yang dirender = `width + padding kiri/kanan + border kiri/kanan`.

```css
.box {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Width akhir adalah `100 + 20 + 2 = 122px`.

### `border-box`

Width yang dideklarasikan mencakup content + padding + border.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Width akhir tetap `100px`.

## 3. Mengapa `border-box` sering digunakan?

Karena membuat perhitungan layout menjadi lebih mudah diprediksi dan lebih cocok untuk desain responsif.

Reset yang umum digunakan:

```css
* {
  box-sizing: border-box;
}
```

Banyak tim juga menerapkannya pada pseudo-element:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4. Margin collapse (poin penting dalam wawancara)

Margin vertikal antara elemen block dapat mengalami collapse (penggabungan).

```css
.a {
  margin-bottom: 24px;
}

.b {
  margin-top: 16px;
}
```

Jaraknya adalah `24px`, bukan `40px`.

Cara menghindari margin collapse:

- Tambahkan `padding` atau `border` pada elemen induk
- Gunakan `display: flow-root` pada elemen induk
- Gunakan layout `flex` atau `grid`

## 5. Tips debugging Box Model

- Gunakan panel box model di DevTools browser
- Tambahkan sementara `outline: 1px solid red` untuk memeriksa batas elemen
- Gunakan sistem jarak yang konsisten (misalnya, skala 4/8) untuk konsistensi

## 6. Jawaban cepat untuk wawancara

### Q1: Apa perbedaan antara margin dan padding?

`padding` berada di dalam border; `margin` berada di luar border.

### Q2: Mengapa mengatur `box-sizing: border-box` secara global?

Untuk mencegah width/height yang tidak terduga dan menyederhanakan perhitungan layout.

### Q3: Apakah width selalu dihormati?

Width dapat dibatasi oleh `min-width`, `max-width`, layout elemen induk, dan perilaku content.
