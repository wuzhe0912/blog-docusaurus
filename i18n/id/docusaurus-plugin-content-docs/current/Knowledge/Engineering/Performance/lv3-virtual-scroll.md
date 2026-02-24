---
id: performance-lv3-virtual-scroll
title: '[Lv3] Virtual Scrolling: Merender Daftar Besar secara Efisien'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Virtual scrolling menjaga ukuran DOM tetap kecil dengan merender hanya jendela yang terlihat ditambah buffer.

---

## Situasi

Tabel besar dengan pembaruan yang sering dapat menghasilkan puluhan ribu node DOM, menyebabkan:

- Render awal yang lambat
- Stutter saat scroll
- Penggunaan memori yang tinggi
- Pembaruan yang mahal selama event real-time

## Ide inti

Alih-alih merender semua baris, render hanya:

- Baris yang terlihat
- Overscan kecil sebelum dan sesudah viewport

Saat posisi scroll berubah, daur ulang kontainer baris dan perbarui jendela data yang ditampilkan.

## Implementasi dasar (tinggi baris tetap)

```ts
const rowHeight = 48;
const viewportHeight = 480;
const visibleCount = Math.ceil(viewportHeight / rowHeight);

const startIndex = Math.floor(scrollTop / rowHeight);
const endIndex = startIndex + visibleCount + 6; // overscan
```

```tsx
<div style={{ height: totalRows * rowHeight }}>
  <div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
    {rows.slice(startIndex, endIndex).map(renderRow)}
  </div>
</div>
```

## Pertimbangan tinggi baris variabel

Untuk konten dinamis:

- Ukur tinggi baris secara lazy
- Pertahankan offset prefix-sum
- Gunakan binary search untuk memetakan `scrollTop` ke indeks

Jika tinggi baris sangat bervariasi, dukungan library biasanya lebih aman.

## Jebakan interaksi dan perbaikan

- Jaga key yang stabil untuk mencegah remount yang tidak perlu
- Memoize komponen baris
- Debounce efek samping berat dari event scroll
- Pertahankan scroll anchor saat daftar diperbarui

## Kapan menghindari virtual scroll

- Dataset kecil (kompleksitas mungkin tidak sebanding)
- Skenario yang memerlukan semua node DOM untuk operasi native browser
- Layout yang sangat tidak teratur dan sulit diukur

## Ringkasan siap wawancara

> Saya menerapkan virtual scrolling ketika jumlah baris tinggi dan biaya rendering mendominasi. Kuncinya adalah windowed rendering dengan overscan, key yang stabil, dan strategi pembaruan yang hati-hati agar scroll tetap lancar di bawah perubahan data yang sering.
