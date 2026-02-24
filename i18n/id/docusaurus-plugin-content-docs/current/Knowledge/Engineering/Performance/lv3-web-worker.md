---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker dalam Praktik: Komputasi Latar Belakang Tanpa Memblokir UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> Web Worker memindahkan logika berat CPU dari main thread sehingga UI tetap responsif.

## 1. Mengapa Web Worker?

JavaScript di main thread bersifat single-threaded untuk tugas UI. Komputasi berat dapat membekukan interaksi.

Kandidat umum:

- Parsing dan transformasi JSON besar
- Agregasi/statistik pada array besar
- Kompresi, enkripsi, atau pemrosesan gambar

## 2. Penggunaan dasar

### Main thread

```ts
const worker = new Worker(new URL('./report.worker.ts', import.meta.url), { type: 'module' });

worker.postMessage({ type: 'AGGREGATE', payload: data });

worker.onmessage = (event) => {
  renderChart(event.data);
};
```

### Worker thread

```ts
self.onmessage = (event) => {
  const { type, payload } = event.data;
  if (type === 'AGGREGATE') {
    const result = compute(payload);
    self.postMessage(result);
  }
};
```

## 3. Pola pengiriman pesan

- Request/response dengan `requestId`
- Event progress untuk tugas panjang
- Channel error dengan payload error terstruktur

```ts
self.postMessage({ requestId, progress: 60 });
```

## 4. Transferable objects untuk data biner besar

Untuk `ArrayBuffer` besar, transfer kepemilikan untuk menghindari salinan yang mahal.

```ts
worker.postMessage({ bytes: buffer }, [buffer]);
```

## 5. Pola worker pool

Untuk beberapa tugas berat, buat worker pool kecil alih-alih membuat worker tanpa batas.

Keuntungan:

- Penggunaan CPU yang dapat diprediksi
- Kontrol penjadwalan yang lebih baik
- Overhead startup yang lebih rendah

## 6. Batasan dan peringatan

- Worker tidak dapat mengakses DOM secara langsung
- Biaya serialisasi ada untuk structured clone
- Debugging lebih sulit daripada kode main thread
- Tidak setiap tugas harus dipindahkan ke worker

## 7. Pembersihan

Selalu terminate jika tidak lagi diperlukan.

```ts
worker.terminate();
```

## Ringkasan siap wawancara

> Saya menggunakan Web Worker untuk tugas berat CPU yang akan memblokir interaksi. Saya merancang protokol pesan, menggunakan transferable objects untuk payload biner besar, dan menjaga siklus hidup worker tetap terkontrol dengan pembersihan dan batas pool.
