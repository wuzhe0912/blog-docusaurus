---
id: state-management-vue-pinia-setup
title: 'Setup e configurazione di Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Un setup Pinia pratico per progetti Vue 3 scalabili.

---

## 1. Focus da colloquio

1. Perché scegliere Pinia al posto di Vuex in Vue 3
2. Passi principali di integrazione
3. Struttura progetto consigliata

## 2. Perché Pinia

- State management ufficiale per Vue 3
- API più pulita (senza mutations obbligatorie)
- Inferenza TypeScript solida
- Migliore architettura modulare e DX

## 3. Setup base

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

### Con plugin di persistenza

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

## 4. Struttura store consigliata

```text
src/stores/
  auth/
    auth.store.ts
  user/
    user.store.ts
  catalog/
    catalog.store.ts
```

Organizza per dominio, non per tipologia tecnica.

## 5. Convenzioni di team

- Gli ID degli store dovrebbero essere stabili e univoci
- Esporta un solo `useXxxStore` per file
- Mantieni nei getter i valori derivati puri
- Mantieni l'orchestrazione API in composable/service

## 6. Sintesi pronta per il colloquio

> Imposto Pinia come livello di stato modulare guidato dal dominio, aggiungo persistenza solo dove serve e standardizzo naming e confini degli store per scalare in team.
