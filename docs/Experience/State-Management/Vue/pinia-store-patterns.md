---
id: state-management-vue-pinia-store-patterns
title: 'Pinia Store Implementation Patterns'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Choose store style based on complexity: Options API for straightforward stores, Setup syntax for composability-heavy scenarios.

---

## 1. Interview focus

1. Options vs Setup store syntax
2. Reactivity and typing considerations
3. Pattern selection by scenario

## 2. Options store pattern

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubled: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count += 1;
    },
  },
});
```

Good for simple, explicit state modules.

## 3. Setup store pattern

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value += 1;
  }

  return { count, doubled, increment };
});
```

Good when you need composition API primitives directly (`watch`, `computed`, shared composables).

## 4. Pattern selection guide

Use Options syntax when:

- Store logic is straightforward
- Team prefers object-style consistency

Use Setup syntax when:

- You need advanced composition patterns
- State derives from multiple composables
- You need fine-grained control over reactive primitives

## 5. Common pitfalls

- Returning non-reactive primitives in setup store by mistake
- Mixing too many concerns in one store
- Reusing store IDs accidentally

## 6. Interview-ready summary

> I pick store syntax by complexity and team clarity. Options syntax is great for simple domain stores, while setup syntax is stronger for composable-heavy logic.
