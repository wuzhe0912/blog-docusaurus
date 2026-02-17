---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> HTTP caching la gi? Tai sao no quan trong?

HTTP caching la ky thuat luu tru tam thoi cac phan hoi HTTP tren may khach (trinh duyet) hoac cac may chu trung gian, nham muc dich su dung truc tiep du lieu da duoc cache trong cac yeu cau tiep theo ma khong can gui lai yeu cau den may chu.

### Cache vs Luu tru tam thoi: Co gi khac nhau?

Trong tai lieu ky thuat, hai thuat ngu nay thuong duoc su dung lan lon, nhung thuc te chung co y nghia khac nhau:

#### Cache

**Dinh nghia**: Ban sao du lieu duoc luu tru de **toi uu hoa hieu suat**, nhan manh vao "tai su dung" va "truy cap nhanh hon".

**Dac diem**:

- ✅ Muc dich la nang cao hieu suat
- ✅ Du lieu co the duoc tai su dung
- ✅ Co chinh sach het han ro rang
- ✅ Thuong la ban sao cua du lieu goc

**Vi du**:

```javascript
// HTTP Cache - Cache phan hoi API
Cache-Control: max-age=3600  // Cache 1 gio

// Memory Cache - Cache ket qua tinh toan
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // Tai su dung cache
  const result = /* tinh toan */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage (Luu tru tam thoi)

**Dinh nghia**: Du lieu duoc luu tru **tam thoi**, nhan manh vao "tinh tam thoi" va "se bi xoa".

**Dac diem**:

- ✅ Muc dich la luu tru tam thoi
- ✅ Khong nhat thiet duoc tai su dung
- ✅ Vong doi thuong ngan
- ✅ Co the chua cac trang thai trung gian

**Vi du**:

```javascript
// sessionStorage - Luu tam du lieu nhap cua nguoi dung
sessionStorage.setItem('formData', JSON.stringify(form)); // Bi xoa khi dong tab

// Luu tam file upload
const tempFile = await uploadToTemp(file); // Xoa sau khi xu ly
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Bang so sanh

| Dac tinh        | Cache                    | Temporary Storage (Luu tru tam thoi) |
| --------------- | ------------------------ | ------------------------------------- |
| **Muc dich chinh** | Toi uu hoa hieu suat  | Luu tru tam thoi                      |
| **Tai su dung** | Co, doc nhieu lan        | Khong nhat thiet                      |
| **Vong doi**    | Theo chinh sach          | Thuong ngan                           |
| **Su dung dien hinh** | HTTP Cache, Memory Cache | sessionStorage, file tam thoi   |
| **Tuong ung tieng Anh** | Cache              | Temp / Temporary / Buffer             |

#### Su khac biet trong ung dung thuc te

```javascript
// ===== Cac tinh huong su dung Cache =====

// 1. HTTP Cache: Tai su dung phan hoi API
fetch('/api/users') // Yeu cau lan dau
  .then((response) => response.json());

fetch('/api/users') // Lan thu hai doc tu cache
  .then((response) => response.json());

// 2. Cache ket qua tinh toan
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // Tai su dung
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Cac tinh huong su dung Luu tru tam thoi =====

// 1. Luu tam du lieu form (phong truong hop dong nham)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. Luu tam file upload
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // Luu tam
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // Xoa sau khi dung
  return processed;
}

// 3. Luu tam ket qua tinh toan trung gian
const tempResults = []; // Luu tam ket qua trung gian
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // Khong can nua sau khi dung
```

#### Ung dung trong phat trien web

```javascript
// HTTP Cache - Luu tru dai han, tai su dung
Cache-Control: public, max-age=31536000, immutable
// → Trinh duyet se cache file nay trong 1 nam va tai su dung

// sessionStorage (Luu tru tam thoi) - Luu tam, xoa khi dong
sessionStorage.setItem('tempData', data);
// → Chi co hieu luc trong tab hien tai, bi xoa khi dong

// localStorage (Luu tru dai han) - O giua hai loai
localStorage.setItem('userPreferences', prefs);
// → Luu tru vinh vien, nhung khong phai de toi uu hieu suat
```

### Tai sao viec phan biet hai khai niem nay lai quan trong?

1. **Quyet dinh thiet ke**:

   - Can toi uu hieu suat? → Su dung cache
   - Can luu tru tam thoi? → Su dung luu tru tam thoi

2. **Quan ly tai nguyen**:

   - Cache: Tap trung vao ty le trung va chinh sach het han
   - Luu tru tam thoi: Tap trung vao thoi diem don dep va gioi han dung luong

3. **Tra loi phong van**:

   - "Lam the nao de toi uu hieu suat" → Noi ve chien luoc cache
   - "Lam the nao de xu ly du lieu tam thoi" → Noi ve giai phap luu tru tam thoi

Trong bai viet nay, chung ta chu yeu thao luan ve **Cache**, dac biet la co che HTTP caching.

### Loi ich cua cache

1. **Giam yeu cau mang**: Doc truc tiep tu cache cuc bo, khong can gui yeu cau HTTP
2. **Giam tai may chu**: Giam so luong yeu cau ma may chu can xu ly
3. **Tang toc do tai trang**: Toc do doc cache cuc bo nhanh hon nhieu so voi yeu cau mang
4. **Tiet kiem bang thong**: Giam luong truyen du lieu
5. **Cai thien trai nghiem nguoi dung**: Trang phan hoi nhanh hon, su dung muot ma hon

### Cac loai cache

```text
┌─────────────────────────────────────┐
│      Phan cap cache trinh duyet     │
├─────────────────────────────────────┤
│  1. Memory Cache (Cache bo nho)     │
│     - Nhanh nhat, dung luong nho    │
│     - Bi xoa khi dong tab           │
├─────────────────────────────────────┤
│  2. Disk Cache (Cache dia)          │
│     - Cham hon, dung luong lon      │
│     - Luu tru lau dai               │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Lap trinh vien kiem soat      │
│       hoan toan                     │
│     - Ho tro ung dung offline       │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> Cac chien luoc HTTP caching la gi?

### Phan loai chien luoc cache

```text
Chien luoc HTTP caching
├── Cache manh (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── Cache thuong luong (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Cache manh (Strong Cache / Fresh)

**Dac diem**: Trinh duyet doc truc tiep tu cache cuc bo ma khong gui yeu cau den may chu.

#### Cache-Control (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Cac chi thi thuong dung**:

```javascript
// 1. max-age: Thoi gian hieu luc cua cache (giay)
Cache-Control: max-age=3600  // Cache 1 gio

// 2. no-cache: Can xac minh voi may chu (su dung cache thuong luong)
Cache-Control: no-cache

// 3. no-store: Hoan toan khong cache
Cache-Control: no-store

// 4. public: Bat ky cache nao cung co the luu tru (trinh duyet, CDN)
Cache-Control: public, max-age=31536000

// 5. private: Chi trinh duyet moi co the cache
Cache-Control: private, max-age=3600

// 6. immutable: Tai nguyen khong bao gio thay doi (ket hop voi ten file hash)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate: Sau khi het han phai xac minh voi may chu
Cache-Control: max-age=3600, must-revalidate
```

#### Expires (HTTP/1.0, da loi thoi)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Van de**:

- Su dung thoi gian tuyet doi, phu thuoc vao gio cua client
- Gio client khong chinh xac se dan den cache hoat dong sai
- Da bi thay the boi `Cache-Control`

### 2. Cache thuong luong (Negotiation Cache / Validation)

**Dac diem**: Trinh duyet gui yeu cau den may chu de kiem tra tai nguyen da duoc cap nhat chua.

#### Last-Modified / If-Modified-Since

```http
# Phan hoi may chu (yeu cau lan dau)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Yeu cau trinh duyet (cac yeu cau tiep theo)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Quy trinh**:

1. Yeu cau lan dau: May chu tra ve `Last-Modified`
2. Cac yeu cau tiep theo: Trinh duyet gui kem `If-Modified-Since`
3. Tai nguyen chua thay doi: May chu tra ve `304 Not Modified`
4. Tai nguyen da thay doi: May chu tra ve `200 OK` va tai nguyen moi

#### ETag / If-None-Match

```http
# Phan hoi may chu (yeu cau lan dau)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Yeu cau trinh duyet (cac yeu cau tiep theo)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Uu diem**:

- Chinh xac hon `Last-Modified`
- Khong phu thuoc thoi gian, su dung hash noi dung
- Co the phat hien thay doi duoi muc giay

### Last-Modified vs ETag

| Dac tinh       | Last-Modified          | ETag                          |
| -------------- | ---------------------- | ----------------------------- |
| Do chinh xac   | Muc giay               | Hash noi dung, chinh xac hon  |
| Hieu suat      | Nhanh hon              | Can tinh hash, cham hon       |
| Truong hop su dung | Tai nguyen tinh chung | Tai nguyen can kiem soat chinh xac |
| Uu tien        | Thap                   | Cao (ETag uu tien)            |

## 3. How does browser caching work?

> Quy trinh hoat dong cua cache trinh duyet la gi?

### Quy trinh cache day du

```text
┌──────────────────────────────────────────────┐
│    Quy trinh yeu cau tai nguyen cua           │
│            trinh duyet                        │
└──────────────────────────────────────────────┘
                    ↓
         1. Kiem tra Memory Cache
                    ↓
            ┌───────┴────────┐
            │ Tim thay cache? │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Kiem tra Disk Cache
                    ↓
            ┌───────┴────────┐
            │ Tim thay cache? │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Kiem tra Service Worker
                    ↓
            ┌───────┴────────┐
            │ Tim thay cache? │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Kiem tra cache het han chua
                    ↓
            ┌───────┴────────┐
            │   Da het han?   │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Xac minh bang cache thuong luong
                    ↓
            ┌───────┴────────┐
            │ Tai nguyen da   │
            │ thay doi?       │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Yeu cau tai nguyen moi tu may chu
                    ↓
            ┌───────┴────────┐
            │ Tra ve tai      │
            │ nguyen moi      │
            │ (200 OK)        │
            └────────────────┘
```

### Vi du thuc te

```javascript
// Yeu cau lan dau
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== Yeu cau lai trong vong 1 gio ==========
// Cache manh: Doc truc tiep tu cuc bo, khong gui yeu cau
// Status: 200 OK (from disk cache)

// ========== Yeu cau lai sau 1 gio ==========
// Cache thuong luong: Gui yeu cau xac minh
GET /api/data.json
If-None-Match: "abc123"

// Tai nguyen chua thay doi
Response:
  304 Not Modified
  (Khong tra ve body, su dung cache cuc bo)

// Tai nguyen da thay doi
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> Cac chien luoc cache pho bien la gi?

### 1. Chien luoc cache vinh vien (ap dung cho tai nguyen tinh)

```javascript
// HTML: Khong cache, kiem tra moi lan
Cache-Control: no-cache

// CSS/JS (co hash): Cache vinh vien
Cache-Control: public, max-age=31536000, immutable
// Ten file: main.abc123.js
```

**Nguyen ly**:

- HTML khong duoc cache, dam bao nguoi dung nhan duoc phien ban moi nhat
- CSS/JS su dung ten file hash, ten file thay doi khi noi dung thay doi
- Phien ban cu khong duoc su dung, phien ban moi duoc tai lai

### 2. Chien luoc cho tai nguyen cap nhat thuong xuyen

```javascript
// Du lieu API: Cache ngan han + cache thuong luong
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Chien luoc cho tai nguyen hinh anh

```javascript
// Anh dai dien nguoi dung: Cache trung han
Cache-Control: public, max-age=86400  // 1 ngay

// Logo, icon: Cache dai han
Cache-Control: public, max-age=2592000  // 30 ngay

// Hinh anh dong: Cache thuong luong
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Khuyen nghi cache theo loai tai nguyen

```javascript
const cachingStrategies = {
  // File HTML
  html: 'Cache-Control: no-cache',

  // Tai nguyen tinh co hash
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // Tai nguyen tinh it cap nhat
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // Du lieu API
  apiData: 'Cache-Control: private, max-age=60',

  // Du lieu rieng cua nguoi dung
  userData: 'Cache-Control: private, no-cache',

  // Du lieu nhay cam
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Cache voi Service Worker

Service Worker cung cap kha nang kiem soat cache linh hoat nhat, cho phep lap trinh vien kiem soat hoan toan logic cache.

### Su dung co ban

```javascript
// Dang ky Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - File Service Worker
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// Su kien cai dat: Cache tai nguyen tinh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Chan yeu cau: Su dung chien luoc cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Chien luoc Cache First
      return response || fetch(event.request);
    })
  );
});

// Su kien kich hoat: Don dep cache cu
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

### Cac chien luoc cache pho bien

#### 1. Cache First (Uu tien cache)

```javascript
// Phu hop cho: Tai nguyen tinh
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First (Uu tien mang)

```javascript
// Phu hop cho: Yeu cau API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cap nhat cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Mang that bai, su dung cache
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate (Het han va xac minh lai)

```javascript
// Phu hop cho: Tai nguyen can phan hoi nhanh nhung cung can cap nhat
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Tra ve cache, cap nhat o nen
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Lam the nao de thuc hien Cache Busting?

Cache Busting la ky thuat dam bao nguoi dung nhan duoc tai nguyen moi nhat.

### Phuong phap 1: Hash trong ten file (khuyen nghi)

```javascript
// Su dung cong cu dong goi nhu Webpack/Vite
// Dau ra: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- Tu dong cap nhat tham chieu -->
<script src="/js/main.abc123.js"></script>
```

**Uu diem**:

- ✅ Ten file thay doi, buoc tai file moi
- ✅ Phien ban cu van duoc cache, khong lang phi
- ✅ Thuc hanh tot nhat

### Phuong phap 2: So phien ban voi Query String

```html
<!-- Cap nhat so phien ban thu cong -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Nhuoc diem**:

- ❌ Mot so CDN khong cache tai nguyen co query string
- ❌ Can quan ly so phien ban thu cong

### Phuong phap 3: Dau thoi gian

```javascript
// Su dung trong moi truong phat trien
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Muc dich su dung**:

- Tranh cache trong moi truong phat trien
- Khong phu hop cho moi truong san xuat (moi lan la mot yeu cau moi)

## 7. Common caching interview questions

> Cac cau hoi phong van thuong gap ve cache

### Cau hoi 1: Lam sao de HTML khong bi cache?

<details>
<summary>Nhan de xem cau tra loi</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

Hoac su dung the meta:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Cau hoi 2: Tai sao nen su dung ETag thay vi chi dung Last-Modified?

<details>
<summary>Nhan de xem cau tra loi</summary>

**Uu diem cua ETag**:

1. **Chinh xac hon**: Co the phat hien thay doi duoi muc giay
2. **Dua tren noi dung**: Dua tren hash noi dung, khong phai thoi gian
3. **Tranh van de thoi gian**:
   - Noi dung file khong thay doi nhung thoi gian thay doi (nhu khi trien khai lai)
   - Tai nguyen quay lai cung noi dung theo chu ky
4. **He thong phan tan**: Dong ho cua cac may chu khac nhau co the khong dong bo

**Vi du**:

```javascript
// Noi dung file khong thay doi, nhung Last-Modified thay doi
// 2024-01-01 12:00 - Trien khai phien ban A (noi dung: abc)
// 2024-01-02 12:00 - Trien khai lai phien ban A (noi dung: abc)
// Last-Modified thay doi, nhung noi dung van giong!

// ETag khong co van de nay
ETag: 'hash-of-abc'; // Luon giong nhau
```

</details>

### Cau hoi 3: Su khac biet giua from disk cache va from memory cache?

<details>
<summary>Nhan de xem cau tra loi</summary>

| Dac tinh       | Memory Cache           | Disk Cache           |
| -------------- | ---------------------- | -------------------- |
| Vi tri luu tru | Bo nho (RAM)           | O cung               |
| Toc do         | Cuc nhanh             | Cham hon             |
| Dung luong     | Nho (cap MB)           | Lon (cap GB)         |
| Tinh ben vung  | Bi xoa khi dong tab    | Luu tru lau dai      |
| Uu tien        | Cao (uu tien su dung)  | Thap                 |

**Thu tu uu tien tai**:

```text
1. Memory Cache (nhanh nhat)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. Yeu cau mang (cham nhat)
```

**Dieu kien kich hoat**:

- **Memory Cache**: Tai nguyen vua truy cap gan day (nhu tai lai trang)
- **Disk Cache**: Tai nguyen truy cap tu lau hoac file co kich thuoc lon

</details>

### Cau hoi 4: Lam the nao de buoc trinh duyet tai lai tai nguyen?

<details>
<summary>Nhan de xem cau tra loi</summary>

**Giai doan phat trien**:

```javascript
// 1. Hard Reload (Ctrl/Cmd + Shift + R)
// 2. Xoa cache va tai lai

// 3. Them dau thoi gian trong code
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Moi truong san xuat**:

```javascript
// 1. Su dung hash trong ten file (thuc hanh tot nhat)
main.abc123.js  // Webpack/Vite tu dong tao

// 2. Cap nhat so phien ban
<script src="/js/main.js?v=2.0.0"></script>

// 3. Cai dat Cache-Control
Cache-Control: no-cache  // Buoc xac minh
Cache-Control: no-store  // Hoan toan khong cache
```

</details>

### Cau hoi 5: Cache offline PWA duoc thuc hien nhu the nao?

<details>
<summary>Nhan de xem cau tra loi</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// Cache trang offline khi cai dat
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

// Chan yeu cau
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Mang that bai, hien thi trang offline
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Chien luoc cache PWA day du**:

```javascript
// 1. Cache tai nguyen tinh
caches.addAll(['/css/', '/js/', '/images/']);

// 2. Yeu cau API: Network First
// 3. Hinh anh: Cache First
// 4. HTML: Network First, hien thi trang offline neu that bai
```

</details>

## 8. Best practices

> Cac thuc hanh tot nhat

### ✅ Cach lam khuyen nghi

```javascript
// 1. HTML - Khong cache, dam bao nguoi dung nhan duoc phien ban moi nhat
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS (co hash) - Cache vinh vien
// Ten file: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Hinh anh - Cache dai han
Cache-Control: public, max-age=2592000  // 30 ngay

// 4. Du lieu API - Cache ngan han + cache thuong luong
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Su dung Service Worker de ho tro offline
```

### ❌ Cach lam nen tranh

```javascript
// ❌ Xau: Cai dat cache dai han cho HTML
Cache-Control: max-age=31536000  // Nguoi dung co the thay phien ban cu

// ❌ Xau: Su dung Expires thay vi Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, da loi thoi

// ❌ Xau: Hoan toan khong cai dat cache
// Khong co header cache, hanh vi trinh duyet khong xac dinh

// ❌ Xau: Su dung cung chien luoc cho tat ca tai nguyen
Cache-Control: max-age=3600  // Nen dieu chinh theo loai tai nguyen
```

### Cay quyet dinh chien luoc cache

```text
La tai nguyen tinh?
├─ Co → Ten file co hash?
│      ├─ Co → Cache vinh vien (max-age=31536000, immutable)
│      └─ Khong → Cache trung-dai han (max-age=2592000)
└─ Khong → La HTML?
          ├─ Co → Khong cache (no-cache)
          └─ Khong → La API?
                 ├─ Co → Cache ngan han + thuong luong (max-age=60, ETag)
                 └─ Khong → Quyet dinh theo tan suat cap nhat
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
