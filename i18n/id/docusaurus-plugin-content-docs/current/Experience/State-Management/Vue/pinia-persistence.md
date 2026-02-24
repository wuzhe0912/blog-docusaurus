---
id: state-management-vue-pinia-persistence
title: 'Strategi Persistence Pinia'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Persistence harus disengaja: tidak semua state perlu bertahan setelah refresh.

---

## 1. Fokus wawancara

1. Opsi persistence di Pinia
2. Keputusan penyimpanan per field
3. Batas keamanan

## 2. Opsi persistence

### Opsi A: `pinia-plugin-persistedstate`

```ts
export const usePrefsStore = defineStore('prefs', {
  state: () => ({ theme: 'light', locale: 'en' }),
  persist: true,
});
```

Juga dapat mengonfigurasi storage kustom dan path yang dipilih.

### Opsi B: composable storage VueUse

```ts
const theme = useLocalStorage<'light' | 'dark'>('theme', 'light');
const dismissedTips = useSessionStorage<boolean>('dismissedTips', false);
```

Berguna saat hanya field tertentu yang perlu persistence.

### Opsi C: persistence manual

Memungkinkan, tetapi mudah salah dan lebih sulit dipelihara.

## 3. Apa yang dipersist vs tidak dipersist

Persist:

- theme / locale
- preferensi UI
- filter non-sensitif

Jangan dipersist:

- access token mentah pada konteks yang tidak aman
- field profil pengguna sensitif tanpa kebijakan yang jelas
- state loading sementara yang berumur pendek

## 4. Rekomendasi produksi

- Definisikan matriks persistence per store
- Gunakan `sessionStorage` untuk data sesi pendek
- Gunakan version key eksplisit untuk migrasi
- Sediakan fallback aman saat skema tersimpan berubah

## 5. Ringkasan siap wawancara

> Saya memilih persistence berdasarkan sensitivitas data dan masa hidupnya. Saya menggunakan plugin atau VueUse untuk persistence yang terprediksi, menghindari penyimpanan nilai sensitif secara buta, dan memelihara key yang aman untuk migrasi.
