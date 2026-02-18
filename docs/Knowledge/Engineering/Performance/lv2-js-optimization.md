---
id: performance-lv2-js-optimization
title: '[Lv2] JavaScript Runtime Optimization: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Optimize JavaScript runtime cost by controlling frequency, scheduling heavy tasks, and preventing main-thread blocking.

---

## 1. Debounce for bursty input

Use debounce when frequent updates should run only after user pause.

```ts
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

Use cases:

- Search input filtering
- API suggestions
- Live validation

## 2. Throttle for continuous events

Use throttle when events are continuous and should run at a fixed rate.

```ts
function throttle<T extends (...args: any[]) => void>(fn: T, wait = 100) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```

Use cases:

- Scroll position updates
- Resize recalculation
- Mouse move tracking

## 3. `requestAnimationFrame` for visual updates

```ts
let rafId = 0;
window.addEventListener('scroll', () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    updateStickyHeader();
  });
});
```

Align visual updates with browser paint cycles.

## 4. Time slicing for large loops

```ts
async function processInChunks<T>(items: T[], chunkSize = 500) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(handleItem);
    await new Promise((r) => setTimeout(r, 0));
  }
}
```

Keeps the UI responsive during heavy processing.

## 5. Offload heavy work to Web Worker

```ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.postMessage({ action: 'aggregate', payload: largeData });
worker.onmessage = (event) => {
  renderResult(event.data);
};
```

Main thread remains interactive while computation runs in background.

## 6. Measurement first

Track improvements with:

- Performance panel (long tasks)
- Web Vitals
- Custom marks/measures

```ts
performance.mark('filter-start');
runFilter();
performance.mark('filter-end');
performance.measure('filter-cost', 'filter-start', 'filter-end');
```

## Interview-ready summary

> I use debounce for burst input, throttle for continuous events, `requestAnimationFrame` for visual updates, time slicing for large loops, and Web Workers for CPU-heavy tasks. I validate improvements with concrete performance metrics.
