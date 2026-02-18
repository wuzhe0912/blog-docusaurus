---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker in Practice: Background Computation Without Blocking UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> Web Worker moves CPU-heavy logic off the main thread so UI stays responsive.

## 1. Why Web Worker?

JavaScript on the main thread is single-threaded for UI tasks. Heavy computation can freeze interactions.

Typical candidates:

- Large JSON parsing and transformation
- Aggregation/statistics on large arrays
- Compression, encryption, or image processing

## 2. Basic usage

### Main thread

```ts
const worker = new Worker(new URL('./report.worker.ts', import.meta.url), { type: 'module' });

worker.postMessage({ type: 'AGGREGATE', payload: data });

worker.onmessage = (event) => {
  renderChart(event.data);
};
```

### Worker thread

```ts
self.onmessage = (event) => {
  const { type, payload } = event.data;
  if (type === 'AGGREGATE') {
    const result = compute(payload);
    self.postMessage(result);
  }
};
```

## 3. Message passing patterns

- Request/response with `requestId`
- Progress events for long tasks
- Error channel with structured error payload

```ts
self.postMessage({ requestId, progress: 60 });
```

## 4. Transferable objects for large binary data

For large `ArrayBuffer`, transfer ownership to avoid expensive copies.

```ts
worker.postMessage({ bytes: buffer }, [buffer]);
```

## 5. Worker pool pattern

For multiple heavy tasks, create a small worker pool instead of spawning unlimited workers.

Benefits:

- Predictable CPU usage
- Better scheduling control
- Lower startup overhead

## 6. Constraints and caveats

- Workers cannot access DOM directly
- Serialization cost exists for structured clone
- Debugging is harder than main-thread code
- Not every task should be moved to workers

## 7. Cleanup

Always terminate when no longer needed.

```ts
worker.terminate();
```

## Interview-ready summary

> I use Web Workers for CPU-heavy tasks that would block interactions. I design message protocols, use transferable objects for large binary payloads, and keep the worker lifecycle controlled with cleanup and pool limits.
