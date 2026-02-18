---
id: project-architecture-browser-compatibility
title: 'Browser Compatibility Handling'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Practical browser-compatibility strategies, with focus on Safari and mobile viewport behavior.

---

## 1. Viewport unit compatibility

Modern viewport units:

- `svh`: small viewport height
- `lvh`: large viewport height
- `dvh`: dynamic viewport height

When supported, `dvh` helps fix mobile Safari address-bar jump issues.

For legacy browser support, fallback to JavaScript-driven height calculation.

## 2. Prevent iOS Safari auto text resizing

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

Use carefully and validate accessibility impact.

## 3. Vendor prefix strategy

Use Autoprefixer as default and add manual prefixes only for special edge cases.

Recommended:

- Define browser targets in one place
- Keep polyfill strategy explicit
- Verify critical flows in Safari and Android WebView

## Interview-ready summary

> I handle compatibility with layered fallbacks: modern CSS first, targeted prefixes and polyfills second, and JS fallback only when platform behavior is unreliable.
