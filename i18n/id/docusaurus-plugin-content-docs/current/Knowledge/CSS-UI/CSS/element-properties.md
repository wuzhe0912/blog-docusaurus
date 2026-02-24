---
id: element-properties
title: '[Easy] Element Properties'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Apa itu elemen block dan inline?

### Elemen block

Elemen block biasanya dimulai pada baris baru dan melebar mengisi lebar yang tersedia.

Contoh umum:

`div`, `section`, `article`, `header`, `footer`, `main`, `nav`, `ul`, `ol`, `li`, `form`.

### Elemen inline

Elemen inline mengalir di dalam teks dan secara default tidak memulai baris baru.

Contoh umum:

`span`, `a`, `strong`, `em`, `img`, `label`, `code`.

## 2. Apa itu `inline-block`?

`inline-block` berada secara inline tetapi mempertahankan perilaku ukuran seperti block.

```css
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
}
```

Gunakan ketika elemen harus sejajar secara horizontal sambil tetap memiliki kontrol width/height/padding.

## 3. Apa fungsi `* { box-sizing: border-box; }`?

Mengubah perhitungan ukuran sehingga width/height yang dideklarasikan mencakup `padding` dan `border`.

```css
* {
  box-sizing: border-box;
}
```

Ini membuat perhitungan layout lebih mudah diprediksi.

## 4. Jawaban cepat untuk wawancara

### Q1: Bisakah elemen inline mengatur width/height?

Biasanya tidak (kecuali replaced element seperti `img`). Gunakan `inline-block` atau `block` jika diperlukan.

### Q2: Bisakah elemen block ditampilkan secara inline?

Ya, dengan mengubah `display` menggunakan CSS.

### Q3: Mengapa `border-box` populer?

Karena mengurangi kejutan ukuran dan menyederhanakan layout responsif.

## Referensi

- [MDN: Block-level content](https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content)
- [MDN: Inline-level content](https://developer.mozilla.org/en-US/docs/Glossary/Inline-level_content)
- [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)
