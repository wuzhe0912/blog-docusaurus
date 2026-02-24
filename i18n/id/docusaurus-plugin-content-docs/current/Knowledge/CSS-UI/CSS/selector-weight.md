---
id: selector-weight
title: '[Easy] Selector Specificity'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Bagaimana cara menghitung specificity selector?

Specificity menentukan aturan CSS mana yang menang ketika beberapa aturan menargetkan elemen yang sama.

Model mental sederhana:

`inline style` > `ID` > `class/attribute/pseudo-class` > `element/pseudo-element`

## 2. Penghitungan specificity

Pikirkan dalam bentuk kolom:

- A: inline style
- B: ID
- C: class, attribute, pseudo-class
- D: nama elemen dan pseudo-element

Bandingkan dari kiri ke kanan.

```html
<div id="app" class="wrapper">Text</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

`#app` menang karena specificity ID lebih tinggi.

## 3. Contoh umum

```css
p {}                /* 0-0-0-1 */
.card p {}          /* 0-0-1-1 */
#root .card p {}    /* 0-1-1-1 */
```

## 4. Bagaimana dengan `!important`?

`!important` mengesampingkan urutan cascade normal dalam origin/layer yang sama, tetapi menggunakannya di mana-mana membuat CSS sulit dipelihara.

Lebih baik gunakan:

- Struktur selector yang lebih baik
- Kedalaman nesting yang lebih rendah
- Scope komponen yang mudah diprediksi

## 5. Praktik terbaik

- Jaga specificity tetap rendah dan konsisten
- Hindari selector berantai yang terlalu dalam
- Gunakan styling berbasis class untuk UI yang dapat digunakan ulang
- Gunakan utility class atau scope komponen untuk menghindari perang selector

## 6. Jawaban cepat untuk wawancara

### Q1: Apakah urutan berpengaruh jika specificity sama?

Ya. Deklarasi yang lebih belakangan yang menang.

### Q2: Apakah styling berbasis ID direkomendasikan?

Biasanya tidak untuk sistem UI yang skalabel; class lebih mudah digunakan ulang.

### Q3: Mengapa menghindari penggunaan `!important` yang sering?

Karena merusak cascade yang mudah diprediksi dan meningkatkan biaya pemeliharaan.
