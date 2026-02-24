---
id: state-management-vue-pinia-setup
title: 'Setup dan Konfigurasi Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Setup Pinia yang praktis untuk proyek Vue 3 yang skalabel.

---

## 1. Fokus wawancara

1. Mengapa memilih Pinia dibanding Vuex di Vue 3
2. Langkah integrasi inti
3. Struktur proyek yang disarankan

## 2. Mengapa Pinia

- State management resmi untuk Vue 3
- API lebih bersih (tanpa mutations wajib)
- Inferensi TypeScript yang kuat
- Arsitektur modular dan DX yang lebih baik

## 3. Setup dasar

```ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount('#app');
```

### Dengan plugin persistence

```ts
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
```

## 4. Rekomendasi struktur store

```text
src/stores/
  auth/
    auth.store.ts
  user/
    user.store.ts
  catalog/
    catalog.store.ts
```

Susun berdasarkan domain, bukan berdasarkan tipe teknis.

## 5. Konvensi tim

- ID store harus stabil dan unik
- Ekspor satu `useXxxStore` per file
- Simpan nilai turunan murni di getter
- Simpan orkestrasi API di composable/service

## 6. Ringkasan siap wawancara

> Saya menyiapkan Pinia sebagai lapisan state modular berbasis domain, menambahkan persistence hanya saat perlu, dan menstandarkan penamaan serta batas store untuk skalabilitas tim.
