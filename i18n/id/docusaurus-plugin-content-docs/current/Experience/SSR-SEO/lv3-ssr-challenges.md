---
title: '[Lv3] Tantangan dan Solusi Implementasi SSR'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Proyek SSR nyata biasanya gagal di area batas: konsistensi hydration, perbedaan environment, kompatibilitas pihak ketiga, dan performa saat beban tinggi.

---

## Skenario wawancara

**Q: Tantangan SSR apa yang pernah Anda hadapi, dan bagaimana Anda menyelesaikannya?**

Jawaban yang kuat seharusnya mencakup mode kegagalan nyata, akar penyebab, dan perbaikan yang terukur.

## 1. Tantangan: Hydration Mismatch {#challenge-1-hydration-mismatch}

### Gejala

- Peringatan hydration Vue/React
- Click handler rusak setelah render awal
- UI flicker yang tidak terduga saat mount

### Akar penyebab

- Output server non-deterministik (`Date.now()`, nilai acak)
- Browser-only API dieksekusi saat SSR
- Logika kondisional berbeda di server/client

### Solusi

- Jaga render pertama tetap deterministik
- Lindungi browser API dengan hook client-only
- Bungkus fragmen browser-only dengan `ClientOnly` saat tepat

## 2. Tantangan: gap environment server vs client

### Masalah umum

- Mengakses `window`, `document`, `localStorage` di server
- Mengasumsikan konsistensi timezone/locale
- Membaca runtime config secara keliru

### Solusi

- Gunakan environment guard (`process.server`, `process.client`)
- Standarkan rendering yang sensitif timezone
- Pisahkan private server runtime config dari public client config

## 3. Tantangan: inkompatibilitas library pihak ketiga

### Masalah umum

- Library yang membutuhkan DOM saat import time
- Script tracking yang memodifikasi DOM saat hydration

### Solusi

- Dynamic import dalam konteks client-only
- Enkapsulasi integrasi dalam komponen client khusus
- Tunda eksekusi pihak ketiga yang tidak kritis

## 4. Tantangan: performa SSR dan TTFB

### Bottleneck umum

- API waterfall yang serial
- Tidak ada strategi cache untuk endpoint mahal
- Payload yang dikirim ke client terlalu besar

### Solusi

- Paralelkan request independen
- Terapkan server caching dengan TTL pendek
- Hindari mengirim state yang tidak diperlukan dalam payload
- Lakukan stream atau defer untuk bagian yang tidak kritis bila memungkinkan

## 5. Tantangan: caching dan invalidation

### Risiko

- Metadata SEO basi
- Konten spesifik pengguna bocor melalui shared cache

### Solusi

- Cache hanya response publik yang aman
- Sertakan cache key untuk locale dan route params
- Definisikan event invalidation dan kebijakan TTL yang jelas

## 6. Tantangan: gap observability

### Apa yang perlu dipantau

- TTFB/LCP/CLS per route
- Tingkat error server dan timeout
- Rasio cache hit
- Frekuensi peringatan hydration di log

### Hasil

Instrumentasi mengubah "SSR terasa lambat" menjadi angka yang bisa ditindaklanjuti.

## 9. Tantangan: Server-side Memory Leak {#challenge-9-server-side-memory-leak}

### Penyebab umum

- Cache global dengan pertumbuhan tanpa batas
- Timer/subscription tidak dibersihkan saat route churn
- Objek per-request tertahan di module scope yang berumur panjang

### Solusi

- Tambahkan kebijakan cache terbatas (ukuran + TTL)
- Pastikan teardown untuk timer/listener/worker
- Hindari menahan request context setelah response selesai
- Lacak tren pertumbuhan heap dan ambil snapshot di staging

## 11. Tantangan: Arsitektur Deployment (SSR vs SPA) {#challenge-11-deployment-architecture-ssr-vs-spa}

### Perbedaan utama

- SSR membutuhkan runtime server, layer cache, dan perencanaan cold-start
- Static hosting SPA lebih sederhana tetapi lebih lemah untuk halaman dinamis yang kritis SEO
- Rollout SSR membutuhkan observability untuk TTFB, tingkat error, dan perilaku cache

### Checklist deployment praktis

- Runtime config spesifik environment
- Strategi CDN dan edge cache
- Health check dan fallback yang graceful
- Rilis blue-green/canary dengan jalur rollback

## Ringkasan siap wawancara

> Kompleksitas SSR sebagian besar adalah manajemen batas. Saya menstabilkan output server/client, mengisolasi kode browser-only, mengendalikan API waterfall dengan caching, dan melacak metrik per route agar performa serta kualitas SEO tetap andal di produksi.
