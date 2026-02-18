---
title: '[Lv2] Nuxt 3 Lifecycle and Hydration Fundamentals'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Understanding lifecycle boundaries and hydration behavior is key to avoiding SSR-client mismatch issues.

---

## 1. Interview focus

1. Server-side vs client-side lifecycle differences
2. `useState` vs `ref` in SSR
3. Typical hydration mismatch causes and fixes

## 2. Lifecycle boundaries in Nuxt 3

In SSR mode:

- `setup()` runs on server and client
- `onMounted()` runs only on client
- Browser APIs must be guarded for client execution

```ts
<script setup lang="ts">
if (process.server) {
  console.log('Server render phase');
}

onMounted(() => {
  // Client only
  console.log(window.location.href);
});
</script>
```

## 3. Why hydration mismatch happens

Common causes:

- Rendering random values (`Math.random()`) during SSR
- Rendering time-dependent values (`new Date()`) without synchronization
- Accessing browser-only APIs during server render
- Different conditional branches between server and client

## 4. `useState` vs `ref` in SSR

- `ref` is local reactive state for component instance
- `useState` serializes and hydrates state across SSR boundary

```ts
const counter = useState<number>('counter', () => 0);
```

For shared SSR-aware state, prefer `useState`.

## 5. Practical mismatch prevention

- Wrap browser-only UI with `ClientOnly` when needed
- Move browser APIs to `onMounted`
- Ensure deterministic initial render values
- Keep SSR and client branching explicit (`process.server`, `process.client`)

## 6. Debug workflow

- Reproduce mismatch on full page refresh
- Compare server HTML and hydrated DOM
- Disable suspicious dynamic fragments incrementally
- Confirm final render stability under slow network and cold load

## Interview-ready summary

> I treat SSR and client as two execution phases. I keep initial output deterministic, use `useState` for SSR-shared state, and isolate browser-only logic to client hooks. This prevents hydration mismatch and keeps rendering predictable.
