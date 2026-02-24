---
id: css-units
title: '[Medium] CSS Units'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Apa perbedaan antara `px`, `em`, `rem`, `vw`, dan `vh`?

### Perbandingan singkat

| Unit | Tipe | Relatif terhadap | Penggunaan umum |
| --- | --- | --- | --- |
| `px` | Mirip absolut | CSS pixel | Border, shadow, detail halus |
| `em` | Relatif | Ukuran font elemen (atau parent untuk font-size) | Jarak/skala lokal |
| `rem` | Relatif | Ukuran font root (`html`) | Tipografi dan jarak global |
| `vw` | Relatif | 1% lebar viewport | Width/layout yang fleksibel |
| `vh` | Relatif | 1% tinggi viewport | Bagian dengan tinggi penuh |

## 2. Perilaku unit dengan contoh

### `px`

```css
.card {
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
```

Gunakan untuk detail visual yang tajam.

### `em`

```css
.button {
  font-size: 1rem;
  padding: 0.5em 1em;
}
```

Padding akan menyesuaikan dengan ukuran font elemen ini.

### `rem`

```css
html {
  font-size: 16px;
}

h1 {
  font-size: 2rem; /* 32px */
}
```

Sangat baik untuk ukuran yang konsisten di seluruh komponen.

### `vw` dan `vh`

```css
.hero {
  min-height: 100vh;
  padding-inline: 5vw;
}
```

Gunakan untuk layout yang bergantung pada viewport.

## 3. Unit berguna lainnya

### `%`

Relatif terhadap ukuran parent/referensi.

```css
.container {
  width: 80%;
}
```

### `vmin` dan `vmax`

- `1vmin`: 1% dari sisi viewport yang lebih kecil
- `1vmax`: 1% dari sisi viewport yang lebih besar

### `ch`

Kira-kira selebar karakter `0`. Berguna untuk panjang baris yang mudah dibaca.

```css
.prose {
  max-width: 65ch;
}
```

## 4. Aturan praktis

- Gunakan `rem` untuk font dan skala jarak
- Gunakan `px` untuk border/efek garis tipis
- Gunakan `%` untuk container yang fleksibel
- Gunakan `vw`/`vh` untuk bagian yang bergantung pada viewport
- Gunakan `em` ketika Anda ingin penskalaan lokal pada komponen

## 5. Catatan viewport di perangkat mobile

Pada browser mobile, address bar yang dinamis dapat membuat `100vh` tidak stabil.

Gunakan unit yang lebih baru jika didukung:

- `dvh`: dynamic viewport height
- `svh`: small viewport height
- `lvh`: large viewport height

```css
.full-screen {
  min-height: 100dvh;
}
```

## 6. Jawaban cepat untuk wawancara

### Q1: Mengapa banyak tim lebih memilih `rem` daripada `px` untuk tipografi?

Karena memusatkan penskalaan dari font-size root dan meningkatkan konsistensi.

### Q2: Mengapa `em` yang bersarang bisa rumit?

Karena nilainya bertumpuk berdasarkan ukuran font lokal, yang bisa membesar secara tidak terduga.

### Q3: Kapan `px` masih menjadi pilihan yang tepat?

Untuk detail visual yang presisi seperti border, shadow, dan penyesuaian posisi ikon.
