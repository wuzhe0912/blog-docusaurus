---
title: '[Lv2] Advanced SEO: Dynamic Meta Tags and Tracking Integration'
slug: /experience/ssr-seo/lv2-seo-optimization
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Build a scalable SEO layer with dynamic metadata, tracking integration, and centralized configuration management.

---

## 1. Interview focus

1. Dynamic meta strategy for multi-brand environments
2. Tracking integration without blocking rendering
3. Governance of SEO configuration at scale

## 2. Why dynamic metadata is needed

Static head tags are hard to maintain when:

- Multiple brands share one platform
- Campaign metadata changes frequently
- Product data updates continuously

A dynamic head system allows updates without full redeployment.

## 3. Dynamic meta implementation pattern

Use a centralized config source and route-aware mapping.

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

## 4. Tracking integration principles

Integrate analytics with minimal performance impact:

- Load non-critical scripts asynchronously
- Delay heavy trackers until consent/user interaction if required
- Keep tracking IDs environment-specific
- Fail gracefully if third-party scripts are blocked

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

## 5. Centralized SEO management

Use one source of truth for SEO fields:

- Brand defaults
- Route-level overrides
- Content-level dynamic values

This prevents conflicting metadata and improves auditability.

## 6. Verification checklist

- Correct title/description per route
- Canonical URL present and accurate
- OG/Twitter preview correct
- Tracking scripts loaded without blocking core content
- No duplicate/conflicting tags in final HTML

## Interview-ready summary

> I design SEO as a centralized system: dynamic route-aware metadata, consistent canonical policy, and non-blocking tracking integration. This scales across brands and supports faster operational updates.
