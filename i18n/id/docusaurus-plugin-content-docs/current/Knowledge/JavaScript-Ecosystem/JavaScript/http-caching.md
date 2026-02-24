---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. Apa itu HTTP caching dan mengapa penting?

> Apa itu HTTP caching? Mengapa penting?

HTTP caching adalah teknik yang menyimpan respons HTTP sementara di klien (browser) atau server perantara, sehingga permintaan selanjutnya bisa menggunakan ulang data yang di-cache tanpa harus mengakses server asal lagi.

### Cache vs Penyimpanan Sementara (Temporary Storage)

Dalam konteks teknis, kedua istilah ini sering tercampur, tapi keduanya memiliki tujuan yang berbeda.

#### Cache

**Definisi**: salinan tersimpan yang digunakan untuk **optimisasi performa**, fokus pada penggunaan ulang dan akses yang lebih cepat.

**Karakteristik**:

- ✅ Tujuan: peningkatan performa
- ✅ Data diharapkan untuk digunakan ulang
- ✅ Strategi kedaluwarsa/revalidasi yang eksplisit
- ✅ Biasanya salinan dari data asli

**Contoh**:

```javascript
// HTTP Cache - cache respons API
Cache-Control: max-age=3600 // cache 1 jam

// Memory Cache - cache hasil komputasi
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n); // gunakan ulang cache
  const result = /* hitung */;
  cache.set(n, result);
  return result;
}
```

#### Penyimpanan Sementara (Temporary Storage)

**Definisi**: data yang disimpan untuk kebutuhan alur kerja sementara, menekankan siklus hidup yang singkat.

**Karakteristik**:

- ✅ Tujuan: penyimpanan sementara
- ✅ Penggunaan ulang opsional
- ✅ Biasanya siklus hidup lebih pendek
- ✅ Mungkin menyimpan state perantara

**Contoh**:

```javascript
// sessionStorage - data formulir sementara
sessionStorage.setItem('formData', JSON.stringify(form));

// path file upload sementara
const tempFile = await uploadToTemp(file);
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Perbandingan

| Fitur | Cache | Penyimpanan Sementara |
| ------- | ----- | ----------------- |
| Tujuan utama | Performa | Penyimpanan sementara |
| Penggunaan ulang | Ya, sering berulang | Tidak dijamin |
| Siklus hidup | Digerakkan kebijakan | Biasanya pendek |
| Penggunaan umum | HTTP cache, memory cache | sessionStorage, file temp |
| Istilah Inggris | Cache | Temp / Temporary / Buffer |

#### Perbedaan praktis

```javascript
// ===== Skenario cache =====

// 1) HTTP cache: gunakan ulang respons API
fetch('/api/users').then((response) => response.json());
fetch('/api/users').then((response) => response.json());

// 2) memoization cache
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Skenario penyimpanan sementara =====

// 1) simpan draf saat unload
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2) pemrosesan upload sementara
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file);
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath);
  return processed;
}

// 3) hasil perantara sementara
const tempResults = [];
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults);
```

#### Dalam pengembangan web

```javascript
// HTTP Cache (berumur panjang, bisa digunakan ulang)
Cache-Control: public, max-age=31536000, immutable

// sessionStorage (sementara, cakupan per tab)
sessionStorage.setItem('tempData', data)

// localStorage (penyimpanan persisten, bukan lapisan optimisasi cache utama)
localStorage.setItem('userPreferences', prefs)
```

### Mengapa perbedaan ini penting

1. **Keputusan desain**:
   - Butuh optimisasi performa -> cache
   - Butuh penyimpanan sementara -> temp storage
2. **Manajemen sumber daya**:
   - Cache fokus pada hit rate dan strategi kedaluwarsa
   - Temp storage fokus pada waktu pembersihan dan batas ukuran
3. **Kejelasan wawancara**:
   - Pertanyaan performa -> bahas strategi caching
   - Pertanyaan data sementara -> bahas strategi temp storage

Artikel ini terutama fokus pada **cache**, khususnya HTTP caching.

### Manfaat caching

1. **Lebih sedikit permintaan jaringan**
2. **Beban server lebih rendah**
3. **Pemuatan halaman lebih cepat**
4. **Penggunaan bandwidth lebih rendah**
5. **Pengalaman pengguna lebih baik**

### Lapisan cache browser

```text
┌─────────────────────────────────────┐
│       Lapisan Cache Browser         │
├─────────────────────────────────────┤
│  1. Memory Cache                    │
│     - Tercepat, kapasitas kecil     │
│     - Dibersihkan saat tab/sesi     │
│       berakhir                      │
├─────────────────────────────────────┤
│  2. Disk Cache                      │
│     - Lebih lambat, kapasitas besar │
│     - Penyimpanan persisten         │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Dikontrol penuh oleh aplikasi │
│     - Memungkinkan perilaku offline  │
└─────────────────────────────────────┘
```

## 2. Apa saja strategi HTTP caching?

> Strategi caching apa yang ada di HTTP?

### Kategori strategi

```text
Strategi HTTP Caching
├── Strong Cache (Segar)
│   ├── Cache-Control
│   └── Expires
└── Validation Cache (Negosiasi)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Strong cache (cache segar)

**Perilaku**: browser menyajikan dari cache lokal secara langsung tanpa mengirim permintaan ke server asal.

#### `Cache-Control` (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Directive umum**:

```javascript
// 1) max-age: masa berlaku kesegaran dalam detik
Cache-Control: max-age=3600

// 2) no-cache: izinkan caching tapi wajibkan revalidasi sebelum penggunaan ulang
Cache-Control: no-cache

// 3) no-store: jangan cache sama sekali
Cache-Control: no-store

// 4) public: bisa di-cache oleh browser/CDN/proxy
Cache-Control: public, max-age=31536000

// 5) private: hanya cache browser
Cache-Control: private, max-age=3600

// 6) immutable: konten tidak akan berubah selama masa kesegaran
Cache-Control: public, max-age=31536000, immutable

// 7) must-revalidate: setelah kedaluwarsa, harus revalidasi
Cache-Control: max-age=3600, must-revalidate
```

#### `Expires` (HTTP/1.0, legacy)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Masalah**:

- Menggunakan waktu absolut
- Bergantung pada kebenaran jam klien
- Sebagian besar digantikan oleh `Cache-Control`

### 2. Validation cache (negosiasi)

**Perilaku**: browser bertanya ke server apakah sumber daya berubah.

#### `Last-Modified` / `If-Modified-Since`

```http
# respons pertama
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# permintaan selanjutnya
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Alur**:

1. Permintaan pertama: server mengirim `Last-Modified`
2. Permintaan berikutnya: browser mengirim `If-Modified-Since`
3. Tidak berubah: server mengembalikan `304 Not Modified`
4. Berubah: server mengembalikan `200 OK` + body baru

#### `ETag` / `If-None-Match`

```http
# respons pertama
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# permintaan selanjutnya
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Keunggulan**:

- Lebih presisi dari `Last-Modified`
- Berbasis konten (hash atau token versi)
- Bisa mendeteksi perubahan yang tidak terlihat di timestamp level detik

### Last-Modified vs ETag

| Fitur | Last-Modified | ETag |
| ------- | ------------- | ---- |
| Presisi | Level detik | Token/hash konten, lebih presisi |
| Biaya | Lebih rendah | Mungkin perlu komputasi ekstra |
| Cocok untuk | File statis umum | Kontrol validasi yang tepat |
| Prioritas | Lebih rendah | Lebih tinggi (`ETag` diutamakan saat keduanya ada) |

## 3. Bagaimana cara kerja caching browser?

> Apa alur kerja cache browser?

### Alur kerja lengkap

```text
┌──────────────────────────────────────────────┐
│       Alur Permintaan Sumber Daya Browser     │
└──────────────────────────────────────────────┘
                    ↓
         1. Periksa Memory Cache
                    ↓
            ┌───────┴────────┐
            │   Hit cache?   │
            └───────┬────────┘
                Ya  │ Tidak
                    ↓
         2. Periksa Disk Cache
                    ↓
            ┌───────┴────────┐
            │   Hit cache?   │
            └───────┬────────┘
                Ya  │ Tidak
                    ↓
         3. Periksa Service Worker
                    ↓
            ┌───────┴────────┐
            │   Hit cache?   │
            └───────┬────────┘
                Ya  │ Tidak
                    ↓
         4. Periksa kesegaran
                    ↓
            ┌───────┴────────┐
            │   Kedaluwarsa? │
            └───────┬────────┘
                Ya  │ Tidak
                    ↓
         5. Revalidasi dengan server
                    ↓
            ┌───────┴────────┐
            │   Berubah?     │
            └───────┬────────┘
                Ya  │ Tidak (304)
                    ↓
         6. Minta konten baru
                    ↓
            ┌───────┴────────┐
            │   Kembalikan   │
            │   200 + body   │
            │   baru         │
            └────────────────┘
```

### Contoh praktis

```javascript
// permintaan pertama
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// dalam 1 jam
// strong cache hit -> gunakan lokal, tidak ada permintaan
// status yang ditampilkan devtools: from disk cache atau from memory cache

// setelah 1 jam
GET /api/data.json
If-None-Match: "abc123"

// tidak berubah
Response:
  304 Not Modified

// berubah
Response:
  200 OK
  ETag: "def456"

  { data: "data baru" }
```

## 4. Apa saja strategi caching yang umum?

> Strategi caching praktis yang umum

### 1. Aset statis berumur panjang

```javascript
// HTML: jangan cache lama, selalu validasi
Cache-Control: no-cache

// CSS/JS dengan hash: cache immutable yang lama
Cache-Control: public, max-age=31536000, immutable
// nama file: main.abc123.js
```

**Prinsip**:

- HTML harus tetap segar untuk mereferensikan hash aset terbaru
- Aset statis yang di-hash bisa di-cache untuk waktu lama
- Perubahan konten -> perubahan nama file -> unduhan baru

### 2. Sumber daya yang sering diperbarui

```javascript
// Data API: cache pendek + revalidasi
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Strategi gambar

```javascript
// avatar pengguna: cache menengah
Cache-Control: public, max-age=86400

// logo/ikon: cache lebih lama
Cache-Control: public, max-age=2592000

// gambar dinamis: validasi
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Kebijakan yang disarankan berdasarkan jenis sumber daya

```javascript
const cachingStrategies = {
  html: 'Cache-Control: no-cache',
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',
  staticAssets: 'Cache-Control: public, max-age=2592000',
  apiData: 'Cache-Control: private, max-age=60',
  userData: 'Cache-Control: private, no-cache',
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker caching

Service Worker memberikan kontrol penuh atas runtime caching dan perilaku offline.

### Penggunaan dasar

```javascript
// daftarkan Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// install: pre-cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch: contoh cache-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// activate: bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Strategi SW yang umum

#### 1. Cache First

```javascript
// terbaik untuk aset statis
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First

```javascript
// terbaik untuk permintaan API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate

```javascript
// terbaik untuk respons cepat + pembaruan di background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. Bagaimana cara mengimplementasikan cache busting?

> Bagaimana cara mengimplementasikan cache busting?

Cache busting memastikan pengguna mengambil aset terbaru saat konten berubah.

### Metode 1: hashing nama file (direkomendasikan)

```javascript
// dengan Webpack/Vite
// output: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<script src="/js/main.abc123.js"></script>
```

**Kelebihan**:

- ✅ Nama file baru memaksa unduhan
- ✅ File lama tetap bisa di-cache
- ✅ Best practice industri

### Metode 2: query versi

```html
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Kekurangan**:

- ❌ Beberapa CDN/proxy memperlakukan caching query-string secara berbeda
- ❌ Pemeliharaan versi manual

### Metode 3: timestamp

```javascript
// umum hanya di development
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Kasus penggunaan**:

- bypass cache di development
- tidak ideal untuk production

## 7. Pertanyaan wawancara caching yang umum

> Pertanyaan wawancara caching yang umum

### Pertanyaan 1: Bagaimana cara mencegah HTML di-cache?

<details>
<summary>Klik untuk melihat jawaban</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

atau tag meta HTML:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Pertanyaan 2: Mengapa menggunakan ETag dan bukan hanya Last-Modified?

<details>
<summary>Klik untuk melihat jawaban</summary>

**Keunggulan ETag**:

1. Lebih presisi
2. Validasi berbasis konten
3. Menghindari kasus edge timestamp (re-deploy dengan konten yang sama)
4. Lebih baik di sistem terdistribusi dengan jam yang tidak sinkron

**Contoh**:

```javascript
// konten tidak berubah, waktu deployment berubah
// Last-Modified berubah, tapi konten identik

ETag: 'hash-of-abc'; // stabil jika konten tidak berubah
```

</details>

### Pertanyaan 3: perbedaan antara `from disk cache` dan `from memory cache`?

<details>
<summary>Klik untuk melihat jawaban</summary>

| Fitur | Memory Cache | Disk Cache |
| ------- | ------------ | ---------- |
| Penyimpanan | RAM | Disk |
| Kecepatan | Sangat cepat | Lebih lambat |
| Kapasitas | Lebih kecil | Lebih besar |
| Persistensi | Biasanya berumur pendek | Persisten |
| Prioritas | Lebih tinggi | Lebih rendah |

Urutan pemuatan umum (konseptual):

```text
1. Memory Cache
2. Service Worker Cache
3. Disk Cache
4. Revalidasi / Jaringan
```

</details>

### Pertanyaan 4: bagaimana cara memaksa browser memuat ulang sumber daya?

<details>
<summary>Klik untuk melihat jawaban</summary>

**Development**:

```javascript
// Hard Reload
// Nonaktifkan cache di DevTools

const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Production**:

```javascript
// nama file dengan hash (terbaik)
main.abc123.js

// query versi
<script src="/js/main.js?v=2.0.0"></script>

// kebijakan cache
Cache-Control: no-cache
Cache-Control: no-store
```

</details>

### Pertanyaan 5: bagaimana cara mengimplementasikan cache offline di PWA?

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// sw.js
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

Strategi PWA lengkap biasanya menggabungkan:

```javascript
// 1) aset statis: cache-first
// 2) API: network-first
// 3) gambar: cache-first
// 4) navigasi HTML: network-first + fallback offline
```

</details>

## 8. Best practice

> Best practice

### ✅ Direkomendasikan

```javascript
// 1. HTML: jangan cache lama untuk memastikan dokumen entry terbaru
Cache-Control: no-cache

// 2. CSS/JS dengan hash: cache immutable yang lama
// contoh nama file: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Gambar: cache menengah/panjang
Cache-Control: public, max-age=2592000

// 4. Data API: cache pendek + validasi
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker untuk dukungan offline
```

### ❌ Hindari

```javascript
// buruk: cache lama untuk dokumen entry HTML
Cache-Control: max-age=31536000

// buruk: hanya mengandalkan Expires
Expires: Wed, 21 Oct 2025 07:28:00 GMT

// buruk: tidak ada header cache eksplisit

// buruk: kebijakan sama untuk semua jenis sumber daya
Cache-Control: max-age=3600
```

### Pohon keputusan strategi cache

```text
Apakah ini aset statis?
├─ Ya -> nama file punya hash?
│        ├─ Ya -> cache immutable lama (max-age=31536000, immutable)
│        └─ Tidak -> cache menengah/panjang (misal max-age=2592000)
└─ Tidak -> Apakah ini HTML?
         ├─ Ya -> no-cache
         └─ Tidak -> Apakah ini API?
                ├─ Ya -> cache pendek + validasi (max-age=60 + ETag)
                └─ Tidak -> tentukan berdasarkan frekuensi pembaruan
```

## Referensi

- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
