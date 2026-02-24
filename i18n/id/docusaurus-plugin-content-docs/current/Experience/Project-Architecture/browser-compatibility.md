---
id: project-architecture-browser-compatibility
title: 'Penanganan Kompatibilitas Browser'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Strategi kompatibilitas browser yang praktis, dengan fokus pada Safari dan perilaku viewport mobile.

---

## 1. Kompatibilitas unit viewport

Unit viewport modern:

- `svh`: tinggi viewport kecil
- `lvh`: tinggi viewport besar
- `dvh`: tinggi viewport dinamis

Saat didukung, `dvh` membantu memperbaiki masalah loncatan address bar di Safari mobile.

Untuk dukungan browser lama, gunakan fallback perhitungan tinggi berbasis JavaScript.

## 2. Mencegah iOS Safari mengubah ukuran teks otomatis

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

Gunakan dengan hati-hati dan validasi dampaknya terhadap aksesibilitas.

## 3. Strategi vendor prefix

Gunakan Autoprefixer sebagai default dan tambahkan prefix manual hanya untuk edge case khusus.

Rekomendasi:

- Definisikan target browser di satu tempat
- Jaga strategi polyfill tetap eksplisit
- Verifikasi alur kritis di Safari dan Android WebView

## Ringkasan siap wawancara

> Saya menangani kompatibilitas dengan fallback berlapis: CSS modern terlebih dahulu, prefix dan polyfill terarah sebagai lapisan kedua, lalu fallback JS hanya saat perilaku platform tidak andal.
