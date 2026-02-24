---
title: '[Lv2] SEO Tingkat Lanjut: Meta Tag Dinamis dan Integrasi Tracking'
slug: /experience/ssr-seo/lv2-seo-optimization
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Bangun lapisan SEO yang skalabel dengan metadata dinamis, integrasi tracking, dan manajemen konfigurasi terpusat.

---

## 1. Fokus wawancara

1. Strategi meta dinamis untuk lingkungan multi-brand
2. Integrasi tracking tanpa memblokir rendering
3. Tata kelola konfigurasi SEO dalam skala besar

## 2. Mengapa metadata dinamis dibutuhkan

Head tag statis sulit dipelihara ketika:

- Banyak brand berbagi satu platform
- Metadata campaign sering berubah
- Data produk terus diperbarui

Sistem head dinamis memungkinkan pembaruan tanpa redeployment penuh.

## 3. Pola implementasi meta dinamis

Gunakan sumber konfigurasi terpusat dan pemetaan yang sadar route.

```ts
type SeoConfig = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
};

function applySeo(config: SeoConfig) {
  useHead({
    title: config.title,
    meta: [
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords || '' },
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:image', content: config.ogImage || '' },
    ],
    link: [{ rel: 'canonical', href: config.canonical || '' }],
  });
}
```

## 4. Prinsip integrasi tracking

Integrasikan analytics dengan dampak performa minimal:

- Muat script non-kritis secara asynchronous
- Tunda tracker berat sampai consent/interaksi pengguna jika diperlukan
- Jaga tracking ID spesifik per environment
- Tangani kegagalan dengan baik jika script pihak ketiga diblokir

```ts
useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX',
      async: true,
    },
  ],
});
```

## 5. Manajemen SEO terpusat

Gunakan satu source of truth untuk field SEO:

- Default per brand
- Override tingkat route
- Nilai dinamis tingkat konten

Ini mencegah metadata saling bertentangan dan meningkatkan kemudahan audit.

## 6. Checklist verifikasi

- Title/description benar per route
- Canonical URL ada dan akurat
- Preview OG/Twitter benar
- Script tracking termuat tanpa memblokir konten inti
- Tidak ada tag duplikat/bertentangan di HTML final

## Ringkasan siap wawancara

> Saya merancang SEO sebagai sistem terpusat: metadata dinamis sadar route, kebijakan canonical yang konsisten, dan integrasi tracking yang tidak memblokir render. Ini bisa diskalakan lintas brand dan mendukung pembaruan operasional yang lebih cepat.
