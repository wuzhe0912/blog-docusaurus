---
id: state-management-vue-pinia-best-practices
title: 'Praktik Terbaik dan Kesalahan Umum Pinia'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Cara menjaga store Pinia tetap mudah dipelihara pada aplikasi Vue skala menengah hingga besar.

---

## 1. Fokus wawancara

1. Batas desain store
2. Jebakan reaktivitas
3. Praktik maintainability tingkat tim

## 2. Prinsip desain store

### Tanggung jawab tunggal per store

```ts
useAuthStore();
useUserStore();
useCatalogStore();
```

Hindari satu mega store yang mencampur concern yang tidak terkait.

### Pertahankan store sebagai container state

Prioritaskan:

- state
- getter deterministik
- action yang terfokus

Pindahkan workflow bisnis yang berat ke composable/service.

### Jika memungkinkan, taruh side effect di luar store

Daripada menaruh seluruh orkestrasi API langsung di action store, gunakan composable untuk workflow dan jaga action store tetap fokus pada update state.

## 3. Kesalahan umum

### Kesalahan 1: destructuring langsung state/getter

```ts
// bad: reactivity can be lost
const { token, isLoggedIn } = authStore;

// good
const { token, isLoggedIn } = storeToRefs(authStore);
```

### Kesalahan 2: mengakses store di luar konteks valid

Panggil store di `setup`, composable, atau lokasi yang aman terhadap lifecycle aplikasi.

### Kesalahan 3: dependensi store melingkar

Store A mengimpor Store B dan Store B mengimpor Store A menyebabkan perilaku runtime yang rapuh.

### Kesalahan 4: memodifikasi salinan non-reaktif

Selalu lakukan update melalui referensi reaktif atau action.

## 4. Standar praktis

- Gunakan tipe TypeScript untuk state dan payload
- Jaga nama action tetap eksplisit (`setUserProfile`, `resetSession`)
- Kelompokkan store berdasarkan domain bisnis
- Tambahkan method reset untuk logout/pergantian akun
- Jaga kebijakan persistence tetap eksplisit per field

## 5. Ringkasan siap wawancara

> Saya menjaga store tetap kecil dan fokus domain, menghindari jebakan reaktivitas dengan `storeToRefs`, memindahkan orkestrasi kompleks ke composable, serta menegakkan typing dan strategi reset yang jelas.
