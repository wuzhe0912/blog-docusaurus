---
id: state-management-vue-pinia-best-practices
title: 'Pinia Best Practices and Common Mistakes'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> How to keep Pinia stores maintainable in medium-to-large Vue applications.

---

## 1. Interview focus

1. Store design boundaries
2. Reactivity pitfalls
3. Team-level maintainability practices

## 2. Store design principles

### Single responsibility per store

```ts
useAuthStore();
useUserStore();
useCatalogStore();
```

Avoid one mega store that mixes unrelated concerns.

### Keep stores as state containers

Prefer:

- state
- deterministic getters
- focused actions

Move heavy business workflows to composables/services.

### Keep side effects outside when possible

Instead of placing all API orchestration directly in store actions, use composables for workflow and keep store actions focused on state updates.

## 3. Common mistakes

### Mistake 1: direct destructuring of state/getters

```ts
// bad: reactivity can be lost
const { token, isLoggedIn } = authStore;

// good
const { token, isLoggedIn } = storeToRefs(authStore);
```

### Mistake 2: accessing stores outside valid context

Call stores in `setup`, composables, or app lifecycle-safe locations.

### Mistake 3: circular store dependencies

Store A imports Store B and Store B imports Store A causes fragile runtime behavior.

### Mistake 4: mutating non-reactive copies

Always update through reactive references or actions.

## 4. Practical standards

- Use TypeScript types for state and payloads
- Keep action names explicit (`setUserProfile`, `resetSession`)
- Group stores by business domain
- Add reset methods for logout/account switch
- Keep persistence policy explicit per field

## 5. Interview-ready summary

> I keep stores small and domain-focused, avoid reactivity pitfalls with `storeToRefs`, move complex orchestration to composables, and enforce clear typing and reset strategies.
