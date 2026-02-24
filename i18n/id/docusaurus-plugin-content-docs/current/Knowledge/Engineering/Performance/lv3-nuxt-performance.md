---
title: '[Lv3] Optimasi Performa Nuxt 3: Ukuran Bundle, Kecepatan SSR, dan Pengiriman Gambar'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Panduan praktis performa Nuxt 3 mencakup output build, latensi server rendering, dan pengiriman media.

---

## 1. Struktur wawancara

1. Optimasi ukuran bundle
2. Optimasi SSR/TTFB
3. Optimasi gambar
4. Strategi rendering data besar

## 2. Optimasi ukuran bundle

### Analisis terlebih dahulu

```bash
npx nuxi analyze
```

Identifikasi dependensi berat dan pertumbuhan shared chunk.

### Split dan lazy-load secara sengaja

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('echarts')) return 'vendor-echarts';
            if (id.includes('lodash')) return 'vendor-lodash';
          },
        },
      },
    },
  },
});
```

- Gunakan lazy loading level route dan level komponen
- Utamakan import selektif daripada import seluruh library

## 3. Kecepatan SSR dan TTFB

### Hindari waterfall SSR yang memblokir

- Paralelkan panggilan API yang independen
- Tambahkan caching untuk API baca yang mahal
- Pindahkan permintaan non-kritis ke fase hydration sisi klien

```ts
const [profile, metrics] = await Promise.all([
  $fetch('/api/profile'),
  $fetch('/api/metrics'),
]);
```

### Gunakan caching Nitro jika sesuai

```ts
export default cachedEventHandler(
  async () => {
    return await fetchDashboardSnapshot();
  },
  { maxAge: 60 }
);
```

## 4. Pengiriman gambar

- Gunakan `@nuxt/image` dengan format modern
- Atur width/height dan `sizes` yang tepat
- Lazy-load media di bawah fold
- Sajikan dari CDN yang dekat dengan pengguna

```vue
<NuxtImg
  src="/hero/banner.jpg"
  format="webp"
  width="1200"
  height="630"
  sizes="sm:100vw md:100vw lg:1200px"
  loading="lazy"
/>
```

## 5. Checklist pemantauan runtime

- Payload JS level route
- TTFB dan LCP di produksi
- Rasio cache hit
- Latensi API p95
- Ukuran transfer gambar dan header cache

## Ringkasan siap wawancara

> Di Nuxt 3, saya mengoptimasi dengan terlebih dahulu menganalisis komposisi bundle, lalu mengurangi JS startup melalui lazy loading dan strategi chunk, meningkatkan TTFB SSR dengan parallel fetch ditambah cache, dan mengirimkan gambar melalui `@nuxt/image` + CDN. Saya memvalidasi dengan metrik produksi, bukan asumsi.
