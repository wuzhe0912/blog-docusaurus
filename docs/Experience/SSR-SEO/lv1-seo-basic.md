---
title: '[Lv1] SEO Fundamentals: Router Mode and Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Foundation-level SEO implementation for web apps: clean URLs, baseline metadata, and crawler-friendly page structure.

---

## 1. Interview focus

1. Why route mode matters for crawlability
2. How to structure baseline meta tags
3. How to validate SEO output in production

## 2. Router mode decision

### Why history mode is preferred

Use history mode to produce clean URLs:

- Preferred: `/products/123`
- Less ideal: `/#/products/123`

Clean URLs are easier for search engines and users.

### Required server fallback

When using history mode, configure fallback to `index.html`:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Without this, deep links can return 404 on refresh.

## 3. Core meta tag setup

At minimum include:

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

## 4. Static page checklist

For landing pages and campaign pages:

- One clear `h1`
- Semantic heading hierarchy
- Descriptive title and description
- Meaningful alt text for key images
- Internal links to related sections

## 5. Common mistakes

- Duplicate titles across different pages
- Missing or duplicated canonical tags
- Keyword stuffing in description
- Blocking crawlable pages in robots accidentally

## 6. Validation workflow

- View page source and confirm final head tags
- Use social preview validators for OG tags
- Check indexing coverage in search console
- Track organic pages with performance reports

## Interview-ready summary

> I start with clean history-mode URLs, complete baseline meta tags, and proper server fallback. Then I validate source output and indexing behavior to ensure both crawlers and users receive stable, high-quality page metadata.
