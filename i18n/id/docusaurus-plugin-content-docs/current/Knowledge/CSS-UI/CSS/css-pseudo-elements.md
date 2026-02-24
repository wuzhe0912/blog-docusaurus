---
id: css-pseudo-elements
title: '[Easy] Pseudo-elements'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 1. Apa itu pseudo-element?

Pseudo-element digunakan untuk memberi gaya pada bagian tertentu dari sebuah elemen atau membuat konten virtual sebelum/sesudahnya.

Pseudo-element menggunakan sintaks titik dua ganda:

- `::before`
- `::after`
- `::first-letter`
- `::first-line`
- `::selection`

## 2. `::before` dan `::after`

Ini adalah pseudo-element yang paling umum digunakan.

```css
.link::after {
  content: ' (eksternal)';
  color: #6b7280;
}

.badge::before {
  content: 'NEW';
  margin-right: 8px;
  background: #111827;
  color: #fff;
  padding: 2px 6px;
  border-radius: 999px;
}
```

Catatan:

- `content` wajib ada (bisa berupa string kosong)
- Pseudo-element adalah bagian dari rendering, bukan node DOM yang sebenarnya
- Pseudo-element dapat diposisikan dan diberi gaya seperti elemen biasa

## 3. Pseudo-element terkait teks

### `::first-letter`

```css
.article p::first-letter {
  font-size: 2rem;
  font-weight: 700;
}
```

### `::first-line`

```css
.article p::first-line {
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

### `::selection`

```css
::selection {
  background: #fef08a;
  color: #111827;
}
```

## 4. Pseudo-element untuk form dan list

### `::placeholder`

```css
input::placeholder {
  color: #9ca3af;
}
```

### `::marker`

```css
li::marker {
  color: #2563eb;
  font-weight: 700;
}
```

### `::file-selector-button`

```css
input[type='file']::file-selector-button {
  border: 0;
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
}
```

## 5. Pseudo-element vs pseudo-class

- Pseudo-class (`:hover`, `:focus`) menargetkan suatu state (keadaan)
- Pseudo-element (`::before`, `::after`) menargetkan bagian virtual

## 6. Praktik terbaik

- Jangan menempatkan konten semantik penting hanya di `::before/::after`
- Biarkan konten dekoratif tetap sebagai dekorasi
- Uji aksesibilitas dan perilaku screen reader
- Hindari penggunaan generated content yang berlebihan untuk logika bisnis

## 7. Jawaban cepat untuk wawancara

### Q1: Mengapa menggunakan `::before` daripada HTML tambahan?

Untuk UI yang murni dekoratif, pseudo-element mengurangi kebisingan di DOM.

### Q2: Bisakah JavaScript memilih pseudo-element secara langsung?

Tidak sebagai node DOM; Anda memberi gaya melalui aturan CSS.

### Q3: Mengapa menggunakan titik dua ganda?

CSS3 menstandarkan pseudo-element dengan `::` untuk membedakannya dari pseudo-class.
