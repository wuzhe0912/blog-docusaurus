---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> HTTP caching là gì? Tại sao nó quan trọng?

HTTP caching là kỹ thuật lưu trữ tạm thời các phản hồi HTTP trên máy khách (trình duyệt) hoặc các máy chủ trung gian, nhằm mục đích sử dụng trực tiếp dữ liệu đã được cache trong các yêu cầu tiếp theo mà không cần gửi lại yêu cầu đến máy chủ.

### Cache vs Lưu trữ tạm thời: Có gì khác nhau?

Trong tài liệu kỹ thuật, hai thuật ngữ này thường được sử dụng lẫn lộn, nhưng thực tế chúng có ý nghĩa khác nhau:

#### Cache

**Định nghĩa**: Bản sao dữ liệu được lưu trữ để **tối ưu hóa hiệu suất**, nhấn mạnh vào "tái sử dụng" và "truy cập nhanh hơn".

**Đặc điểm**:

- ✅ Mục đích là nâng cao hiệu suất
- ✅ Dữ liệu có thể được tái sử dụng
- ✅ Có chính sách hết hạn rõ ràng
- ✅ Thường là bản sao của dữ liệu gốc

**Ví dụ**:

```javascript
// HTTP Cache - Cache phản hồi API
Cache-Control: max-age=3600  // Cache 1 giờ

// Memory Cache - Cache kết quả tính toán
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // Tái sử dụng cache
  const result = /* tính toán */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage (Lưu trữ tạm thời)

**Định nghĩa**: Dữ liệu được lưu trữ **tạm thời**, nhấn mạnh vào "tính tạm thời" và "sẽ bị xóa".

**Đặc điểm**:

- ✅ Mục đích là lưu trữ tạm thời
- ✅ Không nhất thiết được tái sử dụng
- ✅ Vòng đời thường ngắn
- ✅ Có thể chứa các trạng thái trung gian

**Ví dụ**:

```javascript
// sessionStorage - Lưu tạm dữ liệu nhập của người dùng
sessionStorage.setItem('formData', JSON.stringify(form)); // Bị xóa khi đóng tab

// Lưu tạm file upload
const tempFile = await uploadToTemp(file); // Xóa sau khi xử lý
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Bảng so sánh

| Đặc tính        | Cache                    | Temporary Storage (Lưu trữ tạm thời) |
| --------------- | ------------------------ | ------------------------------------- |
| **Mục đích chính** | Tối ưu hóa hiệu suất  | Lưu trữ tạm thời                      |
| **Tái sử dụng** | Có, đọc nhiều lần        | Không nhất thiết                      |
| **Vòng đời**    | Theo chính sách          | Thường ngắn                           |
| **Sử dụng điển hình** | HTTP Cache, Memory Cache | sessionStorage, file tạm thời   |
| **Tương ứng tiếng Anh** | Cache              | Temp / Temporary / Buffer             |

#### Sự khác biệt trong ứng dụng thực tế

```javascript
// ===== Các tình huống sử dụng Cache =====

// 1. HTTP Cache: Tái sử dụng phản hồi API
fetch('/api/users') // Yêu cầu lần đầu
  .then((response) => response.json());

fetch('/api/users') // Lần thứ hai đọc từ cache
  .then((response) => response.json());

// 2. Cache kết quả tính toán
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // Tái sử dụng
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Các tình huống sử dụng Lưu trữ tạm thời =====

// 1. Lưu tạm dữ liệu form (phòng trường hợp đóng nhầm)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. Lưu tạm file upload
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // Lưu tạm
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // Xóa sau khi dùng
  return processed;
}

// 3. Lưu tạm kết quả tính toán trung gian
const tempResults = []; // Lưu tạm kết quả trung gian
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // Không cần nữa sau khi dùng
```

#### Ứng dụng trong phát triển web

```javascript
// HTTP Cache - Lưu trữ dài hạn, tái sử dụng
Cache-Control: public, max-age=31536000, immutable
// → Trình duyệt sẽ cache file này trong 1 năm và tái sử dụng

// sessionStorage (Lưu trữ tạm thời) - Lưu tạm, xóa khi đóng
sessionStorage.setItem('tempData', data);
// → Chỉ có hiệu lực trong tab hiện tại, bị xóa khi đóng

// localStorage (Lưu trữ dài hạn) - Ở giữa hai loại
localStorage.setItem('userPreferences', prefs);
// → Lưu trữ vĩnh viễn, nhưng không phải để tối ưu hiệu suất
```

### Tại sao việc phân biệt hai khái niệm này lại quan trọng?

1. **Quyết định thiết kế**:

   - Cần tối ưu hiệu suất? → Sử dụng cache
   - Cần lưu trữ tạm thời? → Sử dụng lưu trữ tạm thời

2. **Quản lý tài nguyên**:

   - Cache: Tập trung vào tỷ lệ trúng và chính sách hết hạn
   - Lưu trữ tạm thời: Tập trung vào thời điểm dọn dẹp và giới hạn dung lượng

3. **Trả lời phỏng vấn**:

   - "Làm thế nào để tối ưu hiệu suất" → Nói về chiến lược cache
   - "Làm thế nào để xử lý dữ liệu tạm thời" → Nói về giải pháp lưu trữ tạm thời

Trong bài viết này, chúng ta chủ yếu thảo luận về **Cache**, đặc biệt là cơ chế HTTP caching.

### Lợi ích của cache

1. **Giảm yêu cầu mạng**: Đọc trực tiếp từ cache cục bộ, không cần gửi yêu cầu HTTP
2. **Giảm tải máy chủ**: Giảm số lượng yêu cầu mà máy chủ cần xử lý
3. **Tăng tốc độ tải trang**: Tốc độ đọc cache cục bộ nhanh hơn nhiều so với yêu cầu mạng
4. **Tiết kiệm băng thông**: Giảm lượng truyền dữ liệu
5. **Cải thiện trải nghiệm người dùng**: Trang phản hồi nhanh hơn, sử dụng mượt mà hơn

### Các loại cache

```text
┌─────────────────────────────────────┐
│      Phân cấp cache trình duyệt     │
├─────────────────────────────────────┤
│  1. Memory Cache (Cache bộ nhớ)     │
│     - Nhanh nhất, dung lượng nhỏ    │
│     - Bị xóa khi đóng tab           │
├─────────────────────────────────────┤
│  2. Disk Cache (Cache đĩa)          │
│     - Chậm hơn, dung lượng lớn      │
│     - Lưu trữ lâu dài               │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Lập trình viên kiểm soát      │
│       hoàn toàn                     │
│     - Hỗ trợ ứng dụng offline       │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> Các chiến lược HTTP caching là gì?

### Phân loại chiến lược cache

```text
Chiến lược HTTP caching
├── Cache mạnh (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── Cache thương lượng (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Cache mạnh (Strong Cache / Fresh)

**Đặc điểm**: Trình duyệt đọc trực tiếp từ cache cục bộ mà không gửi yêu cầu đến máy chủ.

#### Cache-Control (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Các chỉ thị thường dùng**:

```javascript
// 1. max-age: Thời gian hiệu lực của cache (giây)
Cache-Control: max-age=3600  // Cache 1 giờ

// 2. no-cache: Cần xác minh với máy chủ (sử dụng cache thương lượng)
Cache-Control: no-cache

// 3. no-store: Hoàn toàn không cache
Cache-Control: no-store

// 4. public: Bất kỳ cache nào cũng có thể lưu trữ (trình duyệt, CDN)
Cache-Control: public, max-age=31536000

// 5. private: Chỉ trình duyệt mới có thể cache
Cache-Control: private, max-age=3600

// 6. immutable: Tài nguyên không bao giờ thay đổi (kết hợp với tên file hash)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate: Sau khi hết hạn phải xác minh với máy chủ
Cache-Control: max-age=3600, must-revalidate
```

#### Expires (HTTP/1.0, đã lỗi thời)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Vấn đề**:

- Sử dụng thời gian tuyệt đối, phụ thuộc vào giờ của client
- Giờ client không chính xác sẽ dẫn đến cache hoạt động sai
- Đã bị thay thế bởi `Cache-Control`

### 2. Cache thương lượng (Negotiation Cache / Validation)

**Đặc điểm**: Trình duyệt gửi yêu cầu đến máy chủ để kiểm tra tài nguyên đã được cập nhật chưa.

#### Last-Modified / If-Modified-Since

```http
# Phản hồi máy chủ (yêu cầu lần đầu)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Yêu cầu trình duyệt (các yêu cầu tiếp theo)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Quy trình**:

1. Yêu cầu lần đầu: Máy chủ trả về `Last-Modified`
2. Các yêu cầu tiếp theo: Trình duyệt gửi kèm `If-Modified-Since`
3. Tài nguyên chưa thay đổi: Máy chủ trả về `304 Not Modified`
4. Tài nguyên đã thay đổi: Máy chủ trả về `200 OK` và tài nguyên mới

#### ETag / If-None-Match

```http
# Phản hồi máy chủ (yêu cầu lần đầu)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Yêu cầu trình duyệt (các yêu cầu tiếp theo)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Ưu điểm**:

- Chính xác hơn `Last-Modified`
- Không phụ thuộc thời gian, sử dụng hash nội dung
- Có thể phát hiện thay đổi dưới mức giây

### Last-Modified vs ETag

| Đặc tính       | Last-Modified          | ETag                          |
| -------------- | ---------------------- | ----------------------------- |
| Độ chính xác   | Mức giây               | Hash nội dung, chính xác hơn  |
| Hiệu suất      | Nhanh hơn              | Cần tính hash, chậm hơn       |
| Trường hợp sử dụng | Tài nguyên tĩnh chung | Tài nguyên cần kiểm soát chính xác |
| Ưu tiên        | Thấp                   | Cao (ETag ưu tiên)            |

## 3. How does browser caching work?

> Quy trình hoạt động của cache trình duyệt là gì?

### Quy trình cache đầy đủ

```text
┌──────────────────────────────────────────────┐
│    Quy trình yêu cầu tài nguyên của           │
│            trình duyệt                        │
└──────────────────────────────────────────────┘
                    ↓
         1. Kiểm tra Memory Cache
                    ↓
            ┌───────┴────────┐
            │ Tìm thấy cache? │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Kiểm tra Disk Cache
                    ↓
            ┌───────┴────────┐
            │ Tìm thấy cache? │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Kiểm tra Service Worker
                    ↓
            ┌───────┴────────┐
            │ Tìm thấy cache? │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Kiểm tra cache hết hạn chưa
                    ↓
            ┌───────┴────────┐
            │   Đã hết hạn?   │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Xác minh bằng cache thương lượng
                    ↓
            ┌───────┴────────┐
            │ Tài nguyên đã   │
            │ thay đổi?       │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Yêu cầu tài nguyên mới từ máy chủ
                    ↓
            ┌───────┴────────┐
            │ Trả về tài      │
            │ nguyên mới      │
            │ (200 OK)        │
            └────────────────┘
```

### Ví dụ thực tế

```javascript
// Yêu cầu lần đầu
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== Yêu cầu lại trong vòng 1 giờ ==========
// Cache mạnh: Đọc trực tiếp từ cục bộ, không gửi yêu cầu
// Status: 200 OK (from disk cache)

// ========== Yêu cầu lại sau 1 giờ ==========
// Cache thương lượng: Gửi yêu cầu xác minh
GET /api/data.json
If-None-Match: "abc123"

// Tài nguyên chưa thay đổi
Response:
  304 Not Modified
  (Không trả về body, sử dụng cache cục bộ)

// Tài nguyên đã thay đổi
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> Các chiến lược cache phổ biến là gì?

### 1. Chiến lược cache vĩnh viễn (áp dụng cho tài nguyên tĩnh)

```javascript
// HTML: Không cache, kiểm tra mỗi lần
Cache-Control: no-cache

// CSS/JS (có hash): Cache vĩnh viễn
Cache-Control: public, max-age=31536000, immutable
// Tên file: main.abc123.js
```

**Nguyên lý**:

- HTML không được cache, đảm bảo người dùng nhận được phiên bản mới nhất
- CSS/JS sử dụng tên file hash, tên file thay đổi khi nội dung thay đổi
- Phiên bản cũ không được sử dụng, phiên bản mới được tải lại

### 2. Chiến lược cho tài nguyên cập nhật thường xuyên

```javascript
// Dữ liệu API: Cache ngắn hạn + cache thương lượng
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Chiến lược cho tài nguyên hình ảnh

```javascript
// Ảnh đại diện người dùng: Cache trung hạn
Cache-Control: public, max-age=86400  // 1 ngày

// Logo, icon: Cache dài hạn
Cache-Control: public, max-age=2592000  // 30 ngày

// Hình ảnh động: Cache thương lượng
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Khuyến nghị cache theo loại tài nguyên

```javascript
const cachingStrategies = {
  // File HTML
  html: 'Cache-Control: no-cache',

  // Tài nguyên tĩnh có hash
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // Tài nguyên tĩnh ít cập nhật
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // Dữ liệu API
  apiData: 'Cache-Control: private, max-age=60',

  // Dữ liệu riêng của người dùng
  userData: 'Cache-Control: private, no-cache',

  // Dữ liệu nhạy cảm
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Cache với Service Worker

Service Worker cung cấp khả năng kiểm soát cache linh hoạt nhất, cho phép lập trình viên kiểm soát hoàn toàn logic cache.

### Sử dụng cơ bản

```javascript
// Đăng ký Service Worker
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

// Sự kiện cài đặt: Cache tài nguyên tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Chặn yêu cầu: Sử dụng chiến lược cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Chiến lược Cache First
      return response || fetch(event.request);
    })
  );
});

// Sự kiện kích hoạt: Dọn dẹp cache cũ
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

### Các chiến lược cache phổ biến

#### 1. Cache First (Ưu tiên cache)

```javascript
// Phù hợp cho: Tài nguyên tĩnh
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First (Ưu tiên mạng)

```javascript
// Phù hợp cho: Yêu cầu API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cập nhật cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Mạng thất bại, sử dụng cache
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate (Hết hạn và xác minh lại)

```javascript
// Phù hợp cho: Tài nguyên cần phản hồi nhanh nhưng cũng cần cập nhật
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Trả về cache, cập nhật ở nền
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Làm thế nào để thực hiện Cache Busting?

Cache Busting là kỹ thuật đảm bảo người dùng nhận được tài nguyên mới nhất.

### Phương pháp 1: Hash trong tên file (khuyến nghị)

```javascript
// Sử dụng công cụ đóng gói như Webpack/Vite
// Đầu ra: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- Tự động cập nhật tham chiếu -->
<script src="/js/main.abc123.js"></script>
```

**Ưu điểm**:

- ✅ Tên file thay đổi, buộc tải file mới
- ✅ Phiên bản cũ vẫn được cache, không lãng phí
- ✅ Thực hành tốt nhất

### Phương pháp 2: Số phiên bản với Query String

```html
<!-- Cập nhật số phiên bản thủ công -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Nhược điểm**:

- ❌ Một số CDN không cache tài nguyên có query string
- ❌ Cần quản lý số phiên bản thủ công

### Phương pháp 3: Dấu thời gian

```javascript
// Sử dụng trong môi trường phát triển
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Mục đích sử dụng**:

- Tránh cache trong môi trường phát triển
- Không phù hợp cho môi trường sản xuất (mỗi lần là một yêu cầu mới)

## 7. Common caching interview questions

> Các câu hỏi phỏng vấn thường gặp về cache

### Câu hỏi 1: Làm sao để HTML không bị cache?

<details>
<summary>Nhấn để xem câu trả lời</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

Hoặc sử dụng thẻ meta:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Câu hỏi 2: Tại sao nên sử dụng ETag thay vì chỉ dùng Last-Modified?

<details>
<summary>Nhấn để xem câu trả lời</summary>

**Ưu điểm của ETag**:

1. **Chính xác hơn**: Có thể phát hiện thay đổi dưới mức giây
2. **Dựa trên nội dung**: Dựa trên hash nội dung, không phải thời gian
3. **Tránh vấn đề thời gian**:
   - Nội dung file không thay đổi nhưng thời gian thay đổi (như khi triển khai lại)
   - Tài nguyên quay lại cùng nội dung theo chu kỳ
4. **Hệ thống phân tán**: Đồng hồ của các máy chủ khác nhau có thể không đồng bộ

**Ví dụ**:

```javascript
// Nội dung file không thay đổi, nhưng Last-Modified thay đổi
// 2024-01-01 12:00 - Triển khai phiên bản A (nội dung: abc)
// 2024-01-02 12:00 - Triển khai lại phiên bản A (nội dung: abc)
// Last-Modified thay đổi, nhưng nội dung vẫn giống!

// ETag không có vấn đề này
ETag: 'hash-of-abc'; // Luôn giống nhau
```

</details>

### Câu hỏi 3: Sự khác biệt giữa from disk cache và from memory cache?

<details>
<summary>Nhấn để xem câu trả lời</summary>

| Đặc tính       | Memory Cache           | Disk Cache           |
| -------------- | ---------------------- | -------------------- |
| Vị trí lưu trữ | Bộ nhớ (RAM)           | Ổ cứng               |
| Tốc độ         | Cực nhanh             | Chậm hơn             |
| Dung lượng     | Nhỏ (cấp MB)           | Lớn (cấp GB)         |
| Tính bền vững  | Bị xóa khi đóng tab    | Lưu trữ lâu dài      |
| Ưu tiên        | Cao (ưu tiên sử dụng)  | Thấp                 |

**Thứ tự ưu tiên tải**:

```text
1. Memory Cache (nhanh nhất)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. Yêu cầu mạng (chậm nhất)
```

**Điều kiện kích hoạt**:

- **Memory Cache**: Tài nguyên vừa truy cập gần đây (như tải lại trang)
- **Disk Cache**: Tài nguyên truy cập từ lâu hoặc file có kích thước lớn

</details>

### Câu hỏi 4: Làm thế nào để buộc trình duyệt tải lại tài nguyên?

<details>
<summary>Nhấn để xem câu trả lời</summary>

**Giai đoạn phát triển**:

```javascript
// 1. Hard Reload (Ctrl/Cmd + Shift + R)
// 2. Xóa cache và tải lại

// 3. Thêm dấu thời gian trong code
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Môi trường sản xuất**:

```javascript
// 1. Sử dụng hash trong tên file (thực hành tốt nhất)
main.abc123.js  // Webpack/Vite tự động tạo

// 2. Cập nhật số phiên bản
<script src="/js/main.js?v=2.0.0"></script>

// 3. Cài đặt Cache-Control
Cache-Control: no-cache  // Buộc xác minh
Cache-Control: no-store  // Hoàn toàn không cache
```

</details>

### Câu hỏi 5: Cache offline PWA được thực hiện như thế nào?

<details>
<summary>Nhấn để xem câu trả lời</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// Cache trang offline khi cài đặt
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

// Chặn yêu cầu
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Mạng thất bại, hiển thị trang offline
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Chiến lược cache PWA đầy đủ**:

```javascript
// 1. Cache tài nguyên tĩnh
caches.addAll(['/css/', '/js/', '/images/']);

// 2. Yêu cầu API: Network First
// 3. Hình ảnh: Cache First
// 4. HTML: Network First, hiển thị trang offline nếu thất bại
```

</details>

## 8. Best practices

> Các thực hành tốt nhất

### ✅ Cách làm khuyến nghị

```javascript
// 1. HTML - Không cache, đảm bảo người dùng nhận được phiên bản mới nhất
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS (có hash) - Cache vĩnh viễn
// Tên file: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Hình ảnh - Cache dài hạn
Cache-Control: public, max-age=2592000  // 30 ngày

// 4. Dữ liệu API - Cache ngắn hạn + cache thương lượng
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Sử dụng Service Worker để hỗ trợ offline
```

### ❌ Cách làm nên tránh

```javascript
// ❌ Xấu: Cài đặt cache dài hạn cho HTML
Cache-Control: max-age=31536000  // Người dùng có thể thấy phiên bản cũ

// ❌ Xấu: Sử dụng Expires thay vì Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, đã lỗi thời

// ❌ Xấu: Hoàn toàn không cài đặt cache
// Không có header cache, hành vi trình duyệt không xác định

// ❌ Xấu: Sử dụng cùng chiến lược cho tất cả tài nguyên
Cache-Control: max-age=3600  // Nên điều chỉnh theo loại tài nguyên
```

### Cây quyết định chiến lược cache

```text
Là tài nguyên tĩnh?
├─ Có → Tên file có hash?
│      ├─ Có → Cache vĩnh viễn (max-age=31536000, immutable)
│      └─ Không → Cache trung-dài hạn (max-age=2592000)
└─ Không → Là HTML?
          ├─ Có → Không cache (no-cache)
          └─ Không → Là API?
                 ├─ Có → Cache ngắn hạn + thương lượng (max-age=60, ETag)
                 └─ Không → Quyết định theo tần suất cập nhật
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
