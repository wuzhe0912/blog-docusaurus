---
title: '[Lv2] Fundamental Lifecycle dan Hydration di Nuxt 3'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Memahami batas lifecycle dan perilaku hydration adalah kunci untuk menghindari masalah mismatch antara SSR dan client.

---

## 1. Fokus wawancara

1. Perbedaan lifecycle server-side vs client-side
2. `useState` vs `ref` di SSR
3. Penyebab umum hydration mismatch beserta perbaikannya

## 2. Batas lifecycle di Nuxt 3

Dalam mode SSR:

- `setup()` berjalan di server dan client
- `onMounted()` hanya berjalan di client
- Browser API harus diberi guard agar hanya dieksekusi di client

```ts
<script setup lang="ts">
if (process.server) {
  console.log('Server render phase');
}

onMounted(() => {
  // Client only
  console.log(window.location.href);
});
</script>
```

## 3. Mengapa hydration mismatch terjadi

Penyebab umum:

- Merender nilai acak (`Math.random()`) saat SSR
- Merender nilai berbasis waktu (`new Date()`) tanpa sinkronisasi
- Mengakses browser-only API saat server render
- Cabang kondisional berbeda antara server dan client

## 4. `useState` vs `ref` di SSR

- `ref` adalah state reaktif lokal untuk instance komponen
- `useState` melakukan serialisasi dan hydration state lintas batas SSR

```ts
const counter = useState<number>('counter', () => 0);
```

Untuk state bersama yang sadar SSR, pilih `useState`.

## 5. Pencegahan mismatch yang praktis

- Bungkus UI browser-only dengan `ClientOnly` bila diperlukan
- Pindahkan browser API ke `onMounted`
- Pastikan nilai initial render bersifat deterministik
- Buat percabangan SSR dan client eksplisit (`process.server`, `process.client`)

## 6. Alur debugging

- Reproduksi mismatch dengan full page refresh
- Bandingkan HTML dari server dan DOM setelah hydration
- Nonaktifkan fragmen dinamis yang mencurigakan secara bertahap
- Konfirmasi stabilitas render akhir pada jaringan lambat dan cold load

## Ringkasan siap wawancara

> Saya memperlakukan SSR dan client sebagai dua fase eksekusi. Saya menjaga output awal tetap deterministik, memakai `useState` untuk state bersama SSR, dan mengisolasi logika browser-only ke hook client. Ini mencegah hydration mismatch dan membuat rendering tetap terprediksi.
