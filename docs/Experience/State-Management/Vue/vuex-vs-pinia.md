---
id: state-management-vue-vuex-vs-pinia
title: 'Vuex vs Pinia Comparison'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Vuex and Pinia solve the same problem but with different ergonomics and modernization levels.

---

## 1. Interview focus

1. Core architectural differences
2. When each option is appropriate
3. Migration strategy from Vuex to Pinia

## 2. High-level comparison

| Topic | Vuex | Pinia |
| --- | --- | --- |
| Vue ecosystem era | Vue 2 primary | Vue 3 official |
| Mutations required | Yes | No |
| TypeScript ergonomics | Heavier setup | Better inference |
| Module design | Nested modules common | Flat independent stores |
| DX and maintainability | Good | Better in modern Vue 3 apps |

## 3. API contrast

### Vuex style

```ts
mutations: {
  increment(state) {
    state.count++;
  }
}
```

### Pinia style

```ts
actions: {
  increment() {
    this.count++;
  }
}
```

Pinia removes mutation boilerplate.

## 4. Decision guide

Use Vuex when:

- Legacy Vue 2 codebase is stable
- Migration cost is currently too high

Use Pinia when:

- New Vue 3 development
- Strong TS + maintainability goals
- Team wants less boilerplate

## 5. Migration approach

1. Introduce Pinia alongside existing Vuex
2. Migrate low-risk modules first
3. Move shared business flow into composables
4. Remove Vuex after parity and test coverage

## 6. Interview-ready summary

> For Vue 3 projects I recommend Pinia due to cleaner API and TypeScript ergonomics. For legacy Vuex codebases, I use incremental migration to reduce risk.
