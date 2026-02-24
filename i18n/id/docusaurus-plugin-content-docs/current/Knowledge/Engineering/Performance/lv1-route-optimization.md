---
id: performance-lv1-route-optimization
title: '[Lv1] Optimasi Level Route: Lazy Loading Tiga Lapis'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Lazy loading level route mengurangi ukuran JavaScript awal dan meningkatkan kecepatan layar pertama dengan mengirimkan kode sesuai kebutuhan.

---

## Situasi

Dalam produk multi-tenant, setiap tenant sering memiliki tema dan pohon route yang berbeda. Jika semuanya di-bundle secara eager, JavaScript startup menjadi terlalu besar.

Gejala umum:

- Pemuatan awal lambat pada jaringan mobile
- Bundle `main.js` yang besar
- Kode yang tidak diperlukan untuk route yang tidak pernah dikunjungi pengguna

## Tugas

1. Jaga anggaran JS awal tetap kecil
2. Muat hanya modul tenant dan route yang diperlukan
3. Pertahankan kemudahan pemeliharaan dan kecepatan pengembangan

## Aksi: Lazy loading tiga lapis

### Lapis 1: Modul route dinamis level tenant

```ts
// src/router/routes.ts
export default async function getRoutes(siteKey: string) {
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return module.routes;
}
```

Hanya pohon route tenant yang aktif yang dimuat.

### Lapis 2: Lazy import komponen level halaman

```ts
const HomePage = () => import('@/pages/HomePage.vue');

export const routes = [
  {
    path: '/home',
    component: HomePage,
  },
];
```

Setiap chunk halaman diunduh hanya saat diperlukan.

### Lapis 3: Gerbang route berbasis izin

```ts
router.beforeEach(async (to) => {
  const allowed = await permissionService.canAccess(to.name as string);
  if (!allowed) return '/403';
});
```

Halaman yang tidak diizinkan diblokir sebelum modul berat dimuat.

## Peningkatan tambahan

- Prefetch route berikutnya yang berkemungkinan tinggi saat idle
- Pisahkan dependensi bersama yang besar ke dalam vendor chunk
- Pantau ukuran chunk level route di CI

## Hasil

Dampak umum:

- JS awal berkurang secara signifikan
- Render layar pertama lebih cepat
- Time-to-interactive lebih baik pada perangkat kelas rendah

## Ringkasan siap wawancara

> Saya mengoptimasi route dalam tiga lapis: pemuatan modul tenant, lazy chunk level halaman, dan guard berbasis izin. Ini menjaga startup tetap kecil sambil mempertahankan arsitektur route yang skalabel.
