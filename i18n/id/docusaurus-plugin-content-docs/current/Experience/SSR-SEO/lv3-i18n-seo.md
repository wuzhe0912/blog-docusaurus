---
title: '[Lv3] Praktik Terbaik Nuxt i18n dan SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Pada proyek SSR, i18n SEO bukan sekadar terjemahan. Ini mencakup strategi route, alternate links, kebijakan canonical, dan state locale yang aman untuk hydration.

---

## 1. Fokus wawancara

1. Strategi route locale dan crawlability
2. Ketepatan `hreflang` dan canonical
3. Deteksi locale SSR dan konsistensi hydration

## 2. Strategi route untuk SEO multibahasa

Pendekatan yang disarankan:

- Prefix locale per route (`/en/about`, `/ja/about`)
- URL spesifik locale yang stabil
- Satu canonical untuk setiap halaman locale

Contoh konfigurasi Nuxt:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: 'Japanese' },
      { code: 'zh-tw', iso: 'zh-TW', file: 'zh-tw.json', name: 'Traditional Chinese' },
    ],
    lazy: true,
    langDir: 'locales',
  },
});
```

## 3. Alternate links dan canonical tags

Setiap halaman locale seharusnya mengekspos:

- `rel="alternate"` dengan `hreflang` yang benar
- `x-default` bila diperlukan
- Canonical URL yang spesifik locale

Konsep output contoh:

- Canonical halaman `en`: `https://example.com/about`
- Canonical halaman `ja`: `https://example.com/ja/about`

## 4. Deteksi locale SSR

Sumber umum:

- Prefix URL
- Preferensi cookie
- Fallback header `Accept-Language`

Aturan:

- Resolve locale di server sebelum render
- Pertahankan locale yang sama untuk hydration
- Hindari pergantian locale selama hydration awal

## 5. Kebijakan konten dan indexing

- Terjemahkan konten yang bermakna, bukan hanya label UI
- Jaga structured data tetap terlokalisasi jika relevan
- Pastikan sitemap mencakup URL terlokalisasi
- Hindari halaman tipis berkualitas rendah hasil terjemahan mesin

## 6. Jebakan umum

- Pasangan `hreflang` antar locale tidak lengkap
- Canonical selalu mengarah ke locale default
- Locale tidak konsisten antara SSR dan client
- Meta title/description tidak dilokalisasi

## Ringkasan siap wawancara

> Saya memperlakukan i18n SEO sebagai arsitektur URL plus ketepatan metadata. Saya menegakkan route per locale, canonical dan alternate links, serta resolusi locale yang server-first agar indexing pencarian dan hydration tetap konsisten.
