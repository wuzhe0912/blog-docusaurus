---
title: '[Lv2] Implementasi SSR: Data Fetching dan Manajemen SEO Meta'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Pola implementasi SSR Nuxt yang praktis untuk halaman dinamis: ambil data di server, render HTML lengkap, dan hasilkan metadata spesifik route.

---

## 1. Fokus wawancara

1. Strategi data fetching server-first
2. Metadata dinamis dari konten yang diambil
3. Deduplication dan caching untuk performa

## 2. Pola data fetching SSR

### `useFetch` untuk penggunaan API langsung

```ts
const route = useRoute();

const { data: product, error } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  server: true,
  lazy: false,
});
```

### `useAsyncData` untuk logika kustom

```ts
const { data } = await useAsyncData(`article-${route.params.slug}`, async () => {
  const article = await $fetch(`/api/articles/${route.params.slug}`);
  return normalizeArticle(article);
});
```

## 3. Pembuatan head dinamis

Hasilkan metadata dari konten yang diambil saat SSR:

```ts
useHead(() => ({
  title: product.value?.name || 'Product',
  meta: [
    { name: 'description', content: product.value?.summary || '' },
    { property: 'og:title', content: product.value?.name || '' },
    { property: 'og:description', content: product.value?.summary || '' },
    { property: 'og:image', content: product.value?.image || '' },
  ],
  link: [{ rel: 'canonical', href: `https://example.com/products/${route.params.id}` }],
}));
```

## 4. Penanganan error dan status code

Untuk halaman yang kritis terhadap SEO, kembalikan response code yang tepat.

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product Not Found' });
}
```

## 5. Kontrol performa

- Deduplicate key request yang sama
- Cache response yang stabil jika memungkinkan
- Hindari memblokir SSR dengan API call yang tidak kritis
- Pindahkan data prioritas rendah yang spesifik pengguna ke client fetch

## 6. Checklist produksi

- HTML SSR sudah memuat konten bermakna sebelum hydration
- Title dan description halaman spesifik per route
- Canonical URL sesuai dengan URL publik
- Halaman 404/410 mengembalikan status code yang nyata
- Rendering tetap stabil pada kondisi API lambat

## Ringkasan siap wawancara

> Saya mengambil konten yang kritis SEO saat SSR, menurunkan metadata dari konten tersebut, dan menegakkan status code yang benar. Lalu saya optimalkan dengan deduplication request dan selective caching untuk menyeimbangkan kualitas dan kecepatan.
