---
title: '[Lv2] Nuxt 3 Rendering Modes: SSR, SSG, CSR, and Hybrid Strategy'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Choosing the right rendering mode is a product decision, not just a technical preference.

---

## 1. Interview focus

1. Explain SSR/SSG/CSR/hybrid clearly
2. Map business scenarios to rendering choices
3. Discuss trade-offs with SEO, freshness, and cost

## 2. Rendering mode comparison

| Mode | Render timing | SEO | Runtime server cost | Best for |
| --- | --- | --- | --- | --- |
| SSR | Per request | Strong | Higher | Dynamic SEO pages |
| SSG | Build time | Strong | Low | Mostly static content |
| CSR | Browser runtime | Weaker by default | Low | App-like dashboards |
| Hybrid | Per-route mix | Depends on route | Balanced | Large mixed products |

## 3. Nuxt 3 configuration basics

### SSR enabled

```ts
export default defineNuxtConfig({
  ssr: true,
});
```

### CSR-only mode

```ts
export default defineNuxtConfig({
  ssr: false,
});
```

### Hybrid route rules

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

## 4. Practical decision guide

Use SSR when:

- Page content is dynamic and SEO-critical
- Metadata depends on runtime data

Use SSG when:

- Content changes infrequently
- You want fast global delivery with CDN

Use CSR when:

- SEO is not a priority
- The app is highly interactive after login

Use hybrid when:

- Public pages need SEO
- Authenticated areas behave like SPA

## 5. Common pitfalls

- Using CSR for index-critical pages
- Using SSR everywhere without cache strategy
- Not separating route requirements by intent

## Interview-ready summary

> I choose rendering mode per route based on SEO importance, data freshness, and infrastructure cost. In Nuxt 3, hybrid route rules usually give the best balance for real products.
