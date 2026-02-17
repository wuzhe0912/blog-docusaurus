---
id: performance-lv3-web-worker
title: '[Lv3] Ứng dụng Web Worker: tính toán nền không chặn UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** là API cho phép chạy JavaScript trong thread nền của trình duyệt, thực hiện tính toán nặng mà không chặn thread chính (thread UI).

## Khái niệm cốt lõi

### Bối cảnh vấn đề

JavaScript vốn là **đơn thread**, tất cả code đều chạy trên thread chính:

```javascript
// ❌ Tính toán nặng chặn thread chính
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Tính toán phức tạp
  }
  return result;
}

// Toàn trang bị đóng cứng khi thực thi
const result = heavyComputation(); // UI không thể tương tác
```

**Vấn đề:**

- Trang bị đóng cứng, người dùng không thể click, cuộn
- Animation dừng lại
- Trải nghiệm người dùng rất tệ

### Giải pháp Web Worker

Web Worker cung cấp khả năng **đa thread**, cho phép tác vụ nặng chạy nền:

```javascript
// ✅ Dùng Worker chạy nền
const worker = new Worker('worker.js');

// Thread chính không bị chặn, trang vẫn tương tác được
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Tính toán nền hoàn thành:', e.data);
};
```

---

## Tình huống 1: Xử lý dữ liệu lớn

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Kết quả xử lý:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    const result = data.map((item) => {
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## Tình huống 2: Xử lý hình ảnh

Filter hình ảnh, nén, thao tác pixel, không làm đóng cứng UI.

## Tình huống 3: Tính toán phức tạp

Phép toán (tính số nguyên tố, mã hóa/giải mã)
Tính hash cho file lớn
Phân tích và thống kê dữ liệu

## Hạn chế và lưu ý

### Không thể làm trong Worker

- Thao tác trực tiếp DOM
- Truy cập object window, document, parent
- Sử dụng một số Web API (như alert)

### Có thể sử dụng trong Worker

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Timer (setTimeout, setInterval)
- Một số API trình duyệt

```javascript
// Trường hợp không nên dùng Worker
// 1. Tính toán đơn giản nhanh (tạo Worker tốn chi phí hơn tính toán)
const result = 1 + 1; // Không cần Worker

// 2. Cần giao tiếp thường xuyên với thread chính
// Chi phí giao tiếp có thể lớn hơn lợi ích đa thread

// Trường hợp nên dùng Worker
// 1. Tính toán đơn lẻ thời gian dài
const result = calculatePrimes(1000000);

// 2. Xử lý lô dữ liệu lớn
const processed = largeArray.map(complexOperation);
```

---

## Trường hợp ứng dụng thực tế

### Trường hợp: Mã hóa dữ liệu game

Trong platform game, cần mã hóa/giải mã dữ liệu nhạy cảm:

```javascript
// main.js - Thread chính
const cryptoWorker = new Worker('/workers/crypto-worker.js');

function encryptPlayerData(data) {
  return new Promise((resolve, reject) => {
    cryptoWorker.postMessage({
      action: 'encrypt',
      data: data,
      key: SECRET_KEY,
    });

    cryptoWorker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.encrypted);
      } else {
        reject(e.data.error);
      }
    };
  });
}

const encrypted = await encryptPlayerData(sensitiveData);
// Trang không bị giật, người dùng vẫn tương tác bình thường

// crypto-worker.js - Thread Worker
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### Trường hợp: Lọc dữ liệu game lớn

```javascript
const filterWorker = new Worker('/workers/game-filter.js');

const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ tựa
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered);
};

// Thread chính không giật, người dùng vẫn cuộn và click bình thường
```

---

## Điểm chính phỏng vấn

### Câu hỏi phỏng vấn thường gặp

**Q1: Web Worker và thread chính giao tiếp như thế nào?**

A: Qua `postMessage` và `onmessage`:

```javascript
// Thread chính → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → Thread chính
self.postMessage({ type: 'RESULT', result: processedData });

// Lưu ý: dữ liệu được sao chép qua "Structured Clone"
// Nghĩa là:
// ✅ Có thể truyền: Number, String, Object, Array, Date, RegExp
// ❌ Không thể truyền: Function, phần tử DOM, Symbol
```

**Q2: Chi phí hiệu năng của Web Worker là gì?**

A: Hai chi phí chính:

```javascript
// 1. Chi phí tạo Worker (khoảng 30-50ms)
const worker = new Worker('worker.js'); // Cần tải file

// 2. Chi phí giao tiếp (sao chép dữ liệu)
worker.postMessage(largeData); // Sao chép dữ liệu lớn tốn thời gian

// Giải pháp:
// 1. Tái sử dụng Worker (không tạo mới mỗi lần)
// 2. Dùng Transferable Objects (chuyển quyền sở hữu, không sao chép)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Chuyển quyền sở hữu
```

**Q3: Transferable Objects là gì?**

A: Chuyển quyền sở hữu dữ liệu thay vì sao chép:

```javascript
// ❌ Cách thường: sao chép dữ liệu (chậm)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // Sao chép 10MB (tốn thời gian)

// ✅ Transferable: chuyển quyền sở hữu (nhanh)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Chuyển quyền sở hữu (cấp mili giây)

// Lưu ý: sau khi chuyển, thread chính không thể sử dụng dữ liệu đó nữa
console.log(largeArray.length); // 0 (đã chuyển)
```

**Các loại Transferable được hỗ trợ:**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4: Khi nào nên dùng Web Worker?**

A: Cây quyết định:

```
Tính toán có tốn thời gian (> 50ms) không?
├─ Không → Không cần Worker
└─ Có → Tiếp tục đánh giá
    │
    ├─ Có cần thao tác DOM không?
    │   ├─ Có → Không thể dùng Worker (cân nhắc requestIdleCallback)
    │   └─ Không → Tiếp tục đánh giá
    │
    └─ Tần suất giao tiếp có rất cao (> 60 lần/giây) không?
        ├─ Có → Có lẽ không phù hợp (chi phí giao tiếp lớn)
        └─ Không → ✅ Phù hợp dùng Worker
```

**Trường hợp phù hợp:**

- Mã hóa/giải mã
- Xử lý hình ảnh (filter, nén)
- Sắp xếp/lọc dữ liệu lớn
- Tính toán toán học phức tạp
- Parse file (JSON, CSV)

**Trường hợp không phù hợp:**

- Tính toán đơn giản (chi phí lớn hơn lợi ích)
- Cần giao tiếp thường xuyên
- Cần thao tác DOM
- Cần API không được hỗ trợ

**Q5: Có những loại Web Worker nào?**

A: Ba loại:

```javascript
// 1. Dedicated Worker (riêng)
const worker = new Worker('worker.js');
// Chỉ giao tiếp với trang đã tạo nó

// 2. Shared Worker (chia sẻ)
const sharedWorker = new SharedWorker('shared-worker.js');
// Có thể được chia sẻ bởi nhiều trang/tab

// 3. Service Worker
navigator.serviceWorker.register('sw.js');
// Dùng cho cache, hỗ trợ offline, push notification
```

**So sánh:**

| Đặc điểm        | Dedicated  | Shared               | Service    |
| --------------- | ---------- | -------------------- | ---------- |
| Chia sẻ         | Một trang  | Nhiều trang          | Toàn trang |
| Vòng đời        | Đóng với trang | Đóng trang cuối cùng | Độc lập với trang |
| Công dụng chính | Tính toán nền | Giao tiếp giữa các trang | Cache, offline |

**Q6: Debug Web Worker như thế nào?**

A: Chrome DevTools hỗ trợ:

```javascript
// 1. File Worker hiển thị trong panel Sources
// 2. Có thể đặt breakpoint
// 3. Có thể chạy code trong Console

self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // Hiển thị trong Console DevTools
});

worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## So sánh hiệu năng

### Dữ liệu test thực tế (xử lý 1 triệu dòng)

| Phương pháp                | Thời gian thực thi | UI bị đóng cứng?        | Bộ nhớ đỉnh |
| -------------------------- | ------------------ | ----------------------- | ----------- |
| Thread chính (đồng bộ)     | 2.5 giây           | Đóng cứng hoàn toàn     | 250 MB      |
| Thread chính (Time Slicing) | 3.2 giây          | Thỉnh thoảng giật       | 280 MB      |
| Web Worker                 | 2.3 giây           | Mượt hoàn toàn          | 180 MB      |

**Kết luận:**

- Web Worker không chỉ không chặn UI mà còn nhanh hơn nhờ tính toán song song đa nhân
- Sử dụng bộ nhớ ít hơn (thread chính không cần giữ dữ liệu lớn)

---

## Công nghệ liên quan

### Web Worker vs các giải pháp khác

```javascript
// 1. setTimeout (bất đồng bộ giả)
setTimeout(() => heavyTask(), 0);
// ❌ Vẫn trên thread chính, có thể chặn

// 2. requestIdleCallback (thực thi khi rảnh)
requestIdleCallback(() => heavyTask());
// ⚠️ Chỉ thực thi khi rảnh rỗi, không đảm bảo thời gian

// 3. Web Worker (đa thread thực sự)
worker.postMessage(task);
// ✅ Song song thực sự, không chặn UI
```

### Nâng cao: đơn giản hóa giao tiếp Worker với Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) cho phép dùng Worker như hàm thường:

```javascript
// Cách truyền thống (phức tạp)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Dùng Comlink (gọn gàng)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

const result = await api.add(1, 2);
console.log(result); // 3
```

---

## Gợi ý học tập

**Chuẩn bị phỏng vấn:**

1. Hiểu "tại sao cần Worker" (vấn đề đơn thread)
2. Biết "khi nào dùng" (tính toán tốn thời gian)
3. Hiểu "cơ chế giao tiếp" (postMessage)
4. Biết "hạn chế" (không thể thao tác DOM)
5. Đã triển khai ít nhất một trường hợp với Worker

**Gợi ý thực hành:**

- Bắt đầu từ trường hợp đơn giản (như tính số nguyên tố)
- Dùng Chrome DevTools để debug
- Đo lường sự khác biệt hiệu năng
- Cân nhắc công cụ như Comlink

---

## Chủ đề liên quan

- [Tối ưu hóa cấp route ->](/docs/experience/performance/lv1-route-optimization)
- [Tối ưu hóa tải hình ảnh ->](/docs/experience/performance/lv1-image-optimization)
- [Triển khai Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)
- [Chiến lược tối ưu dữ liệu lớn ->](/docs/experience/performance/lv3-large-data-optimization)
