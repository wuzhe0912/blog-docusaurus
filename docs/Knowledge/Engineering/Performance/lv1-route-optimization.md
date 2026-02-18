---
id: performance-lv1-route-optimization
title: '[Lv1] Route-level Optimization: Three-layer Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Route-level lazy loading reduces initial JavaScript size and improves first-screen speed by delivering code on demand.

---

## Situation

In multi-tenant products, each tenant often has a different theme and route tree. If everything is bundled eagerly, startup JS becomes too large.

Common symptoms:

- Slow initial load on mobile networks
- Large `main.js` bundle
- Unnecessary code for routes users never visit

## Task

1. Keep initial JS budget small
2. Load only required tenant and route modules
3. Preserve maintainability and developer velocity

## Action: Three-layer lazy loading

### Layer 1: Tenant-level dynamic route module

```ts
// src/router/routes.ts
export default async function getRoutes(siteKey: string) {
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return module.routes;
}
```

Only the active tenant route tree is loaded.

### Layer 2: Page-level lazy component import

```ts
const HomePage = () => import('@/pages/HomePage.vue');

export const routes = [
  {
    path: '/home',
    component: HomePage,
  },
];
```

Each page chunk is downloaded only when needed.

### Layer 3: Permission-aware route gating

```ts
router.beforeEach(async (to) => {
  const allowed = await permissionService.canAccess(to.name as string);
  if (!allowed) return '/403';
});
```

Unauthorized pages are blocked before heavy modules are loaded.

## Extra enhancements

- Prefetch high-probability next routes on idle
- Split large shared dependencies into vendor chunks
- Track route-level chunk size in CI

## Result

Typical impact:

- Initial JS reduced significantly
- Faster first-screen render
- Better time-to-interactive on low-end devices

## Interview-ready summary

> I optimize routes in three layers: tenant module loading, page-level lazy chunks, and permission-aware guards. This keeps startup small while preserving scalable route architecture.
