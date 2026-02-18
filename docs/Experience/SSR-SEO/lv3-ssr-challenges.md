---
title: '[Lv3] SSR Implementation Challenges and Solutions'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Real SSR projects usually fail at boundaries: hydration consistency, environment differences, third-party compatibility, and performance under load.

---

## Interview scenario

**Q: What SSR challenges have you faced, and how did you solve them?**

A strong answer should cover real failure modes, root causes, and measurable fixes.

## 1. Challenge: Hydration Mismatch {#challenge-1-hydration-mismatch}

### Symptoms

- Vue/React hydration warnings
- Click handlers broken after initial render
- Unexpected UI flicker on mount

### Root causes

- Non-deterministic server output (`Date.now()`, random values)
- Browser-only APIs executed during SSR
- Different conditional logic on server/client

### Solutions

- Keep first render deterministic
- Guard browser APIs with client-only hooks
- Wrap browser-only fragments with `ClientOnly` when appropriate

## 2. Challenge: server vs client environment gaps

### Typical issues

- Accessing `window`, `document`, `localStorage` on server
- Assuming timezone/locale consistency
- Reading runtime config incorrectly

### Solutions

- Use environment guards (`process.server`, `process.client`)
- Standardize timezone-sensitive rendering
- Separate private server runtime config from public client config

## 3. Challenge: third-party library incompatibility

### Typical issues

- Libraries that require DOM at import time
- Tracking scripts mutating DOM during hydration

### Solutions

- Dynamic import in client-only context
- Encapsulate integrations in dedicated client components
- Defer non-critical third-party execution

## 4. Challenge: SSR performance and TTFB

### Typical bottlenecks

- Serial API waterfalls
- No cache strategy for expensive endpoints
- Oversized payload sent to client

### Solutions

- Parallelize independent requests
- Introduce short-TTL server caching
- Avoid sending unnecessary state in payload
- Stream or defer non-critical sections when possible

## 5. Challenge: caching and invalidation

### Risks

- Stale SEO metadata
- User-specific content leaked via shared cache

### Solutions

- Cache only safe public responses
- Include cache keys for locale and route params
- Define clear invalidation events and TTL policy

## 6. Challenge: observability gaps

### What to monitor

- TTFB/LCP/CLS per route
- Server error rates and timeout rates
- Cache hit ratio
- Hydration warning frequency in logs

### Outcome

Instrumentation turns "SSR feels slow" into actionable numbers.

## 9. Challenge: Server-side Memory Leak {#challenge-9-server-side-memory-leak}

### Typical causes

- Global caches with unbounded growth
- Timers/subscriptions not cleaned on route churn
- Per-request objects retained in long-lived module scope

### Solutions

- Add bounded cache policy (size + TTL)
- Ensure teardown for timers/listeners/workers
- Avoid retaining request context after response ends
- Track heap growth trends and take snapshots in staging

## 11. Challenge: Deployment Architecture (SSR vs SPA) {#challenge-11-deployment-architecture-ssr-vs-spa}

### Key differences

- SSR needs server runtime, cache layers, and cold-start planning
- SPA static hosting is simpler but weaker for SEO-critical dynamic pages
- SSR rollout requires observability for TTFB, error rates, and cache behavior

### Practical deployment checklist

- Environment-specific runtime config
- CDN and edge cache strategy
- Health checks and graceful fallback
- Blue-green/canary release with rollback path

## Interview-ready summary

> SSR complexity is mostly boundary management. I stabilize server/client output, isolate browser-only code, control API waterfalls with caching, and track route-level metrics so performance and SEO quality stay reliable in production.
