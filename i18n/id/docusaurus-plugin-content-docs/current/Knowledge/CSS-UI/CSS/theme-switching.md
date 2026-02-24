---
id: theme-switching
title: '[Medium] Multi-theme Switching Implementation'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 1. Skenario wawancara

> Sebuah produk membutuhkan setidaknya dua tema visual (misalnya, light dan dark). Bagaimana Anda merancang arsitektur CSS-nya?

Pertanyaan ini mengevaluasi:

- Keputusan arsitektur CSS
- Strategi token tema
- Pendekatan switching saat runtime
- Performa dan kemudahan pemeliharaan

## 2. Ringkasan strategi yang direkomendasikan

| Strategi | Cocok untuk | Switch runtime | Kompleksitas | Rekomendasi |
| --- | --- | --- | --- | --- |
| CSS custom properties | Sebagian besar aplikasi modern | Ya | Sedang | Sangat direkomendasikan |
| Mode tema framework utility | Stack utility-first | Ya | Sedang | Direkomendasikan |
| Style duplikat berbasis class | Kompatibilitas legacy | Ya | Tinggi | Alternatif yang dapat diterima |
| Variabel build-time saja (Sass/Less) | Build brand tetap | Tidak | Rendah | Tidak ideal untuk live toggle |

## 3. Arsitektur inti: design token + CSS variable

Definisikan token semantik alih-alih warna yang di-hardcode di komponen.

```css
:root {
  --bg: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
}

[data-theme='dark'] {
  --bg: #0b1220;
  --surface: #111827;
  --text: #f3f4f6;
  --text-muted: #9ca3af;
  --border: #374151;
  --primary: #60a5fa;
}
```

Gunakan token di mana saja:

```css
.page {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
}

.button-primary {
  background: var(--primary);
  color: #fff;
}
```

## 4. Implementasi switch tema saat runtime

### Dasar HTML

```html
<html data-theme="light">
  <body>
    <button id="theme-toggle" type="button">Toggle tema</button>
  </body>
</html>
```

### Logika JavaScript

```js
const STORAGE_KEY = 'theme';
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function initTheme() {
  applyTheme(getPreferredTheme());
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

initTheme();
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
```

## 5. Mencegah flash tema pada render pertama

Terapkan tema awal sebelum aplikasi dirender.

```html
<script>
  (function () {
    var key = 'theme';
    var saved = localStorage.getItem(key);
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'light' || saved === 'dark' ? saved : dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

Letakkan script ini di `<head>` sebelum bundle CSS/JS jika memungkinkan.

## 6. Layering token yang skalabel

Model token yang praktis:

1. Primitif global (`--gray-100`, `--blue-500`)
2. Token semantik (`--text`, `--bg`, `--border`)
3. Token komponen (`--btn-bg`, `--card-shadow`)

Contoh:

```css
:root {
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --blue-600: #2563eb;

  --bg: var(--gray-50);
  --text: var(--gray-900);
  --link: var(--blue-600);
}
```

Ini membuat perubahan di seluruh sistem mudah dikelola.

## 7. Persyaratan aksesibilitas

- Penuhi persyaratan kontras (WCAG)
- Pastikan focus state terlihat di semua tema
- Jangan hanya mengandalkan warna untuk menunjukkan status
- Dukung preferensi sistem (`prefers-color-scheme`)

Media query yang berguna:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## 8. Panduan animasi dan transisi

Transisi tema bisa halus tetapi harus menghindari repaint yang berat.

```css
:root,
[data-theme='dark'] {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

Hindari menganimasi blur/shadow yang besar pada setiap elemen saat toggle tema.

## 9. Contoh framework

### React

```tsx
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function onToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  return <button onClick={onToggle}>Tema: {theme}</button>;
}
```

### Vue 3

```ts
import { ref, watchEffect } from 'vue';

const theme = ref<'light' | 'dark'>('light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});
```

## 10. Kesalahan umum

- Meng-hardcode warna langsung di komponen
- Mencampur penamaan token semantik dan primitif
- Mengabaikan perbedaan tema pada chart/code-block
- Toggle terlalu banyak class di pohon elemen yang dalam
- Lupa menyimpan preferensi pengguna

## 11. Checklist pengujian

- Tema tetap tersimpan setelah refresh
- Tidak ada flash pada render pertama
- Pemeriksaan kontras lulus
- State focus/hover/disabled semuanya jelas
- Komponen pihak ketiga diberi tema secara konsisten
- Tampilan mobile dan desktop sudah divalidasi

## 12. Template jawaban siap wawancara

> Saya menggunakan CSS custom properties dengan token semantik dan mengganti tema menggunakan atribut root seperti `data-theme`. Saya menginisialisasi tema sebelum render pertama untuk menghindari flicker, menyimpan preferensi di localStorage, dan menggunakan preferensi sistem sebagai fallback. Saya juga menerapkan kontras dan visibilitas state di semua tema. Ini membuat switching tema cepat, mudah dipelihara, dan skalabel.

## 13. Jawaban cepat untuk wawancara

### Q1: Mengapa memilih CSS variable daripada aturan class yang diduplikasi?

Lebih sedikit duplikasi, fleksibilitas runtime, dan kemudahan pemeliharaan yang lebih baik.

### Q2: Bagaimana cara menghindari flicker awal?

Atur tema dalam script inline kecil sebelum merender aplikasi.

### Q3: Haruskah tema menjadi state global?

Biasanya ya, karena banyak halaman/komponen bergantung padanya.

### Q4: Bisakah variabel Sass menangani switching tema saat runtime?

Tidak dengan sendirinya. Variabel Sass diselesaikan pada saat build.
