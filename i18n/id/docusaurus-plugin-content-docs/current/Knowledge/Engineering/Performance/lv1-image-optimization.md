---
id: performance-lv1-image-optimization
title: '[Lv1] Optimasi Pemuatan Gambar: Lazy Load Empat Lapis'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Strategi lazy loading gambar empat lapis yang secara signifikan mengurangi lalu lintas layar pertama dan meningkatkan kecepatan pemuatan yang dirasakan pengguna.

---

## Situasi

Halaman galeri mungkin berisi ratusan gambar, tetapi pengguna biasanya hanya melihat beberapa item pertama.

Masalah umum tanpa optimasi:

- Payload awal yang besar dari permintaan gambar
- Waktu pemuatan layar pertama yang lama
- Jank saat scroll di perangkat kelas rendah
- Bandwidth terbuang untuk gambar yang tidak pernah dilihat pengguna

## Tugas

1. Muat hanya gambar yang dekat dengan viewport
2. Preload tepat sebelum masuk area pandang
3. Kendalikan permintaan gambar bersamaan
4. Hindari unduhan berulang saat navigasi cepat
5. Jaga lalu lintas gambar layar pertama di bawah batas anggaran

## Aksi: Strategi empat lapis

### Lapis 1: Deteksi visibilitas dengan IntersectionObserver

```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target as HTMLImageElement);
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '120px 0px', threshold: 0.01 }
);
```

Ini memicu pemuatan hanya ketika gambar mendekati area pandang.

### Lapis 2: Placeholder dan pengalaman progresif

- Gunakan thumbnail blur / skeleton placeholder
- Cadangkan width/height untuk mencegah layout shift
- Ganti placeholder setelah gambar berhasil di-decode

```html
<img src="/placeholder.webp" data-src="/real-image.webp" width="320" height="180" alt="cover" />
```

### Lapis 3: Antrian konkurensi

```ts
const MAX_CONCURRENT = 6;
const queue: Array<() => Promise<void>> = [];
let active = 0;

async function runQueue() {
  if (active >= MAX_CONCURRENT || queue.length === 0) return;
  const task = queue.shift();
  if (!task) return;

  active += 1;
  try {
    await task();
  } finally {
    active -= 1;
    runQueue();
  }
}
```

Membatasi tekanan jaringan dan menghindari lonjakan permintaan.

### Lapis 4: Pembatalan dan deduplikasi

- Batalkan permintaan yang sudah kedaluwarsa melalui `AbortController`
- Gunakan map di memori berbasis URL untuk menghindari pemuatan duplikat
- Lewati permintaan ulang untuk aset yang sudah berhasil dimuat

```ts
const inflight = new Map<string, Promise<void>>();
```

## Hasil

Contoh dampak setelah penerapan:

- Payload gambar layar pertama berkurang drastis
- First meaningful paint lebih cepat
- Kelancaran scroll lebih baik
- Bounce rate lebih rendah pada jaringan mobile

## Ringkasan siap wawancara

> Saya menggabungkan deteksi viewport, rendering placeholder, kontrol antrian permintaan, dan pembatalan/deduplikasi. Ini menghindari pemuatan gambar yang tidak pernah dilihat pengguna dan menjaga jaringan serta UI tetap responsif.
