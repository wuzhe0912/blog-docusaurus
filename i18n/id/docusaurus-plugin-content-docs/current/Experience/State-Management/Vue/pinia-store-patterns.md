---
id: state-management-vue-pinia-store-patterns
title: 'Pola Implementasi Store Pinia'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Pilih gaya store berdasarkan kompleksitas: Options API untuk store yang sederhana, sintaks Setup untuk skenario yang berat pada composability.

---

## 1. Fokus wawancara

1. Sintaks store Options vs Setup
2. Pertimbangan reaktivitas dan typing
3. Pemilihan pola berdasarkan skenario

## 2. Pola store Options

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

Cocok untuk modul state yang sederhana dan eksplisit.

## 3. Pola store Setup

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

Cocok saat Anda perlu primitive composition API secara langsung (`watch`, `computed`, shared composables).

## 4. Panduan pemilihan pola

Gunakan sintaks Options ketika:

- Logika store sederhana
- Tim lebih menyukai konsistensi gaya object

Gunakan sintaks Setup ketika:

- Anda membutuhkan pola composition tingkat lanjut
- State diturunkan dari banyak composable
- Anda membutuhkan kontrol detail terhadap primitive reaktif

## 5. Jebakan umum

- Keliru mengembalikan primitive non-reaktif di setup store
- Mencampur terlalu banyak concern dalam satu store
- Tidak sengaja menggunakan ulang ID store

## 6. Ringkasan siap wawancara

> Saya memilih sintaks store berdasarkan kompleksitas dan kejelasan untuk tim. Sintaks Options bagus untuk store domain sederhana, sementara sintaks setup lebih kuat untuk logika yang berat pada composable.
