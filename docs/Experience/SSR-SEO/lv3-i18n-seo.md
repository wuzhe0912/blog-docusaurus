---
title: '[Lv3] Nuxt i18n and SEO Best Practices'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> In SSR projects, i18n SEO is not just translation. It includes route strategy, alternate links, canonical policy, and hydration-safe locale state.

---

## 1. Interview focus

1. Locale route strategy and crawlability
2. `hreflang` and canonical correctness
3. SSR locale detection and hydration consistency

## 2. Route strategy for multilingual SEO

Preferred approaches:

- Locale prefix per route (`/en/about`, `/ja/about`)
- Stable locale-specific URLs
- One canonical per locale page

Example Nuxt config:

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

## 3. Alternate links and canonical tags

Each locale page should expose:

- `rel="alternate"` with correct `hreflang`
- `x-default` when needed
- Locale-specific canonical URL

Example output concept:

- `en` page canonical: `https://example.com/about`
- `ja` page canonical: `https://example.com/ja/about`

## 4. SSR locale detection

Common sources:

- URL prefix
- Cookie preference
- `Accept-Language` header fallback

Rules:

- Resolve locale on server before render
- Keep same resolved locale for hydration
- Avoid locale switching during initial hydration

## 5. Content and indexing policy

- Translate meaningful content, not only UI labels
- Keep structured data localized where relevant
- Ensure sitemap includes localized URLs
- Avoid machine-translated low-quality pages with thin content

## 6. Common pitfalls

- Missing `hreflang` pairs between locales
- Canonical always pointing to default locale
- Inconsistent locale between SSR and client
- Non-localized meta titles/descriptions

## Interview-ready summary

> I treat i18n SEO as URL architecture plus metadata correctness. I enforce locale-specific routes, canonical and alternate links, and SSR-first locale resolution to keep search indexing and hydration consistent.
