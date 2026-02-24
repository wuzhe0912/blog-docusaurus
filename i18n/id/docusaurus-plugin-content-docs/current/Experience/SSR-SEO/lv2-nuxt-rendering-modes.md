---
title: '[Lv2] Mode Rendering Nuxt 3: SSR, SSG, CSR, dan Strategi Hybrid'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Memilih mode rendering yang tepat adalah keputusan produk, bukan sekadar preferensi teknis.

---

## 1. Fokus wawancara

1. Menjelaskan SSR/SSG/CSR/hybrid dengan jelas
2. Memetakan skenario bisnis ke pilihan rendering
3. Membahas trade-off SEO, freshness, dan biaya

## 2. Perbandingan mode rendering

| Mode | Waktu render | SEO | Biaya server runtime | Paling cocok untuk |
| --- | --- | --- | --- | --- |
| SSR | Per request | Kuat | Lebih tinggi | Halaman SEO dinamis |
| SSG | Saat build | Kuat | Rendah | Konten yang mayoritas statis |
| CSR | Runtime browser | Lebih lemah secara default | Rendah | Dashboard bergaya aplikasi |
| Hybrid | Campuran per route | Tergantung route | Seimbang | Produk besar dengan kebutuhan campuran |

## 3. Dasar konfigurasi Nuxt 3

### SSR aktif

```ts
export default defineNuxtConfig({
  ssr: true,
});
```

### Mode khusus CSR

```ts
export default defineNuxtConfig({
  ssr: false,
});
```

### Aturan route hybrid

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/products/**': { ssr: true },
    '/dashboard/**': { ssr: false },
  },
});
```

## 4. Panduan keputusan praktis

Gunakan SSR ketika:

- Konten halaman dinamis dan kritis untuk SEO
- Metadata bergantung pada data runtime

Gunakan SSG ketika:

- Konten jarang berubah
- Anda menginginkan distribusi global cepat dengan CDN

Gunakan CSR ketika:

- SEO bukan prioritas
- Aplikasi sangat interaktif setelah login

Gunakan hybrid ketika:

- Halaman publik membutuhkan SEO
- Area terautentikasi berperilaku seperti SPA

## 5. Jebakan umum

- Menggunakan CSR untuk halaman yang penting untuk indexing
- Menggunakan SSR di semua tempat tanpa strategi cache
- Tidak memisahkan kebutuhan route berdasarkan intent

## Ringkasan siap wawancara

> Saya memilih mode rendering per route berdasarkan pentingnya SEO, kesegaran data, dan biaya infrastruktur. Di Nuxt 3, route rules hybrid biasanya memberi keseimbangan terbaik untuk produk nyata.
