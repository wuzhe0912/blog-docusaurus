---
id: state-management-vue-pinia-setup
title: 'Pinia Setup and Configuration'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> A practical Pinia setup for scalable Vue 3 projects.

---

## 1. Interview focus

1. Why Pinia over Vuex in Vue 3
2. Core integration steps
3. Recommended project structure

## 2. Why Pinia

- Official state management for Vue 3
- Cleaner API (no mandatory mutations)
- Strong TypeScript inference
- Better modular architecture and DX

## 3. Basic setup

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

### With persistence plugin

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

## 4. Store structure recommendation

```text
src/stores/
  auth/
    auth.store.ts
  user/
    user.store.ts
  catalog/
    catalog.store.ts
```

Organize by domain, not by technical type.

## 5. Team conventions

- Store IDs should be stable and unique
- Export one `useXxxStore` per file
- Keep pure derived values in getters
- Keep API orchestration in composables/services

## 6. Interview-ready summary

> I set up Pinia as a modular domain-driven state layer, add persistence only where needed, and standardize store naming and boundaries for team scalability.
