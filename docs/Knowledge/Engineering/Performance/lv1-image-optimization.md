---
id: performance-lv1-image-optimization
title: '[Lv1] Image Loading Optimization: Four-layer Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> A four-layer image lazy-loading strategy that significantly reduces first-screen traffic and improves perceived loading speed.

---

## Situation

A gallery page may include hundreds of images, but users usually view only the first few items.

Typical issues without optimization:

- Huge initial payload from image requests
- Long first-screen loading time
- Scroll jank on lower-end devices
- Wasted bandwidth for images users never see

## Task

1. Load only images near the viewport
2. Preload just before entering view
3. Control concurrent image requests
4. Avoid redundant downloads during rapid navigation
5. Keep first-screen image traffic under a strict budget

## Action: Four-layer strategy

### Layer 1: Visibility detection with IntersectionObserver

```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target as HTMLImageElement);
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '120px 0px', threshold: 0.01 }
);
```

This triggers loading only when an image is close to view.

### Layer 2: Placeholder and progressive experience

- Use blurred thumbnail / skeleton placeholder
- Reserve width/height to prevent layout shift
- Replace placeholder after image decode

```html
<img src="/placeholder.webp" data-src="/real-image.webp" width="320" height="180" alt="cover" />
```

### Layer 3: Concurrency queue

```ts
const MAX_CONCURRENT = 6;
const queue: Array<() => Promise<void>> = [];
let active = 0;

async function runQueue() {
  if (active >= MAX_CONCURRENT || queue.length === 0) return;
  const task = queue.shift();
  if (!task) return;

  active += 1;
  try {
    await task();
  } finally {
    active -= 1;
    runQueue();
  }
}
```

Limits network pressure and avoids request spikes.

### Layer 4: Cancellation and deduplication

- Cancel outdated requests via `AbortController`
- Use URL-level in-memory map to deduplicate loading
- Skip re-requesting already successful assets

```ts
const inflight = new Map<string, Promise<void>>();
```

## Result

Example impact after rollout:

- First-screen image payload reduced drastically
- Faster first meaningful paint
- Better scroll smoothness
- Lower bounce rate on mobile networks

## Interview-ready summary

> I combine viewport detection, placeholder rendering, request queue control, and cancellation/deduplication. This avoids loading images users never see and keeps both network and UI responsive.
