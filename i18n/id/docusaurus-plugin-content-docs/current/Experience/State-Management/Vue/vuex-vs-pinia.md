---
id: state-management-vue-vuex-vs-pinia
title: 'Perbandingan Vuex vs Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Vuex dan Pinia menyelesaikan masalah yang sama, tetapi dengan ergonomi dan tingkat modernisasi yang berbeda.

---

## 1. Fokus wawancara

1. Perbedaan arsitektur inti
2. Kapan setiap opsi tepat digunakan
3. Strategi migrasi dari Vuex ke Pinia

## 2. Perbandingan tingkat tinggi

| Topik | Vuex | Pinia |
| --- | --- | --- |
| Era ekosistem Vue | Utama di Vue 2 | Resmi di Vue 3 |
| Mutations wajib | Ya | Tidak |
| Ergonomi TypeScript | Setup lebih berat | Inferensi lebih baik |
| Desain modul | Modul bertingkat umum | Store independen datar |
| DX dan maintainability | Baik | Lebih baik di aplikasi Vue 3 modern |

## 3. Kontras API

### Gaya Vuex

```ts
mutations: {
  increment(state) {
    state.count++;
  }
}
```

### Gaya Pinia

```ts
actions: {
  increment() {
    this.count++;
  }
}
```

Pinia menghapus boilerplate mutation.

## 4. Panduan keputusan

Gunakan Vuex ketika:

- Codebase legacy Vue 2 stabil
- Biaya migrasi saat ini terlalu tinggi

Gunakan Pinia ketika:

- Pengembangan Vue 3 baru
- Target TS kuat + maintainability
- Tim menginginkan boilerplate lebih sedikit

## 5. Pendekatan migrasi

1. Perkenalkan Pinia berdampingan dengan Vuex yang sudah ada
2. Migrasikan modul berisiko rendah terlebih dahulu
3. Pindahkan alur bisnis bersama ke composable
4. Hapus Vuex setelah parity dan cakupan test tercapai

## 6. Ringkasan siap wawancara

> Untuk proyek Vue 3 saya merekomendasikan Pinia karena API lebih bersih dan ergonomi TypeScript lebih baik. Untuk codebase legacy Vuex, saya menggunakan migrasi bertahap untuk menurunkan risiko.
