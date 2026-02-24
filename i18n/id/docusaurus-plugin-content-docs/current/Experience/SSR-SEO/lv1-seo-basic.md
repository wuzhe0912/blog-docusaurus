---
title: '[Lv1] Fundamental SEO: Mode Router dan Meta Tag'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Implementasi SEO tingkat dasar untuk aplikasi web: URL bersih, metadata baseline, dan struktur halaman yang ramah crawler.

---

## 1. Fokus wawancara

1. Mengapa mode route penting untuk crawlability
2. Cara menyusun meta tag baseline
3. Cara memvalidasi output SEO di produksi

## 2. Keputusan mode router

### Mengapa mode history lebih disukai

Gunakan mode history untuk menghasilkan URL yang bersih:

- Disarankan: `/products/123`
- Kurang ideal: `/#/products/123`

URL bersih lebih mudah dipahami mesin pencari dan pengguna.

### Fallback server yang diperlukan

Saat menggunakan mode history, konfigurasi fallback ke `index.html`:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Tanpa ini, deep link bisa mengembalikan 404 saat refresh.

## 3. Setup meta tag inti

Minimal sertakan:

- `title`
- `meta[name="description"]`
- Canonical URL
- Open Graph tags
- Twitter card tags

```html
<title>Product Detail | Brand</title>
<meta name="description" content="Compare product features, pricing, and delivery options." />
<link rel="canonical" href="https://example.com/products/123" />
<meta property="og:title" content="Product Detail | Brand" />
<meta property="og:description" content="Compare product features and pricing." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/products/123" />
<meta property="og:image" content="https://example.com/og/product-123.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

## 4. Checklist halaman statis

Untuk landing page dan halaman campaign:

- Satu `h1` yang jelas
- Hierarki heading yang semantik
- Title dan description yang deskriptif
- Alt text yang bermakna untuk gambar utama
- Internal link ke bagian terkait

## 5. Kesalahan umum

- Title duplikat di halaman berbeda
- Canonical tag hilang atau duplikat
- Keyword stuffing pada description
- Tidak sengaja memblokir halaman yang seharusnya bisa di-crawl di robots

## 6. Alur validasi

- Lihat page source dan konfirmasi head tag final
- Gunakan validator social preview untuk OG tags
- Periksa cakupan indeks di search console
- Pantau halaman organik dengan laporan performa

## Ringkasan siap wawancara

> Saya memulai dengan URL mode history yang bersih, meta tag baseline yang lengkap, dan fallback server yang benar. Lalu saya memvalidasi output source dan perilaku indexing agar crawler dan pengguna sama-sama mendapatkan metadata halaman yang stabil dan berkualitas.
