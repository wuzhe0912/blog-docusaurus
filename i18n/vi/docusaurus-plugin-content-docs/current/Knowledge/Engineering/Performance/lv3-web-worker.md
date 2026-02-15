---
id: performance-lv3-web-worker
title: '[Lv3] Ung dung Web Worker: tinh toan nen khong chan UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** la API cho phep chay JavaScript trong thread nen cua trinh duyet, thuc hien tinh toan nang ma khong chan thread chinh (thread UI).

## Khai niem cot loi

### Boi canh van de

JavaScript von la **don thread**, tat ca code deu chay tren thread chinh:

```javascript
// ❌ Tinh toan nang chan thread chinh
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Tinh toan phuc tap
  }
  return result;
}

// Toan trang bi dong cung khi thuc thi
const result = heavyComputation(); // UI khong the tuong tac
```

**Van de:**

- Trang bi dong cung, nguoi dung khong the click, cuon
- Animation dung lai
- Trai nghiem nguoi dung rat te

### Giai phap Web Worker

Web Worker cung cap kha nang **da thread**, cho phep tac vu nang chay nen:

```javascript
// ✅ Dung Worker chay nen
const worker = new Worker('worker.js');

// Thread chinh khong bi chan, trang van tuong tac duoc
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Tinh toan nen hoan thanh:', e.data);
};
```

---

## Tinh huong 1: Xu ly du lieu lon

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Ket qua xu ly:', e.data);
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

## Tinh huong 2: Xu ly hinh anh

Filter hinh anh, nen, thao tac pixel, khong lam dong cung UI.

## Tinh huong 3: Tinh toan phuc tap

Phep toan (tinh so nguyen to, ma hoa/giai ma)
Tinh hash cho file lon
Phan tich va thong ke du lieu

## Han che va luu y

### Khong the lam trong Worker

- Thao tac truc tiep DOM
- Truy cap object window, document, parent
- Su dung mot so Web API (nhu alert)

### Co the su dung trong Worker

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Timer (setTimeout, setInterval)
- Mot so API trinh duyet

```javascript
// Truong hop khong nen dung Worker
// 1. Tinh toan don gian nhanh (tao Worker ton chi phi hon tinh toan)
const result = 1 + 1; // Khong can Worker

// 2. Can giao tiep thuong xuyen voi thread chinh
// Chi phi giao tiep co the lon hon loi ich da thread

// Truong hop nen dung Worker
// 1. Tinh toan don le thoi gian dai
const result = calculatePrimes(1000000);

// 2. Xu ly lo du lieu lon
const processed = largeArray.map(complexOperation);
```

---

## Truong hop ung dung thuc te

### Truong hop: Ma hoa du lieu game

Trong platform game, can ma hoa/giai ma du lieu nhay cam:

```javascript
// main.js - Thread chinh
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
// Trang khong bi giat, nguoi dung van tuong tac binh thuong

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

### Truong hop: Loc du lieu game lon

```javascript
const filterWorker = new Worker('/workers/game-filter.js');

const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ tua
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered);
};

// Thread chinh khong giat, nguoi dung van cuon va click binh thuong
```

---

## Diem chinh phong van

### Cau hoi phong van thuong gap

**Q1: Web Worker va thread chinh giao tiep nhu the nao?**

A: Qua `postMessage` va `onmessage`:

```javascript
// Thread chinh → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → Thread chinh
self.postMessage({ type: 'RESULT', result: processedData });

// Luu y: du lieu duoc sao chep qua "Structured Clone"
// Nghia la:
// ✅ Co the truyen: Number, String, Object, Array, Date, RegExp
// ❌ Khong the truyen: Function, phan tu DOM, Symbol
```

**Q2: Chi phi hieu nang cua Web Worker la gi?**

A: Hai chi phi chinh:

```javascript
// 1. Chi phi tao Worker (khoang 30-50ms)
const worker = new Worker('worker.js'); // Can tai file

// 2. Chi phi giao tiep (sao chep du lieu)
worker.postMessage(largeData); // Sao chep du lieu lon ton thoi gian

// Giai phap:
// 1. Tai su dung Worker (khong tao moi moi lan)
// 2. Dung Transferable Objects (chuyen quyen so huu, khong sao chep)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Chuyen quyen so huu
```

**Q3: Transferable Objects la gi?**

A: Chuyen quyen so huu du lieu thay vi sao chep:

```javascript
// ❌ Cach thuong: sao chep du lieu (cham)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // Sao chep 10MB (ton thoi gian)

// ✅ Transferable: chuyen quyen so huu (nhanh)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Chuyen quyen so huu (cap mili giay)

// Luu y: sau khi chuyen, thread chinh khong the su dung du lieu do nua
console.log(largeArray.length); // 0 (da chuyen)
```

**Cac loai Transferable duoc ho tro:**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4: Khi nao nen dung Web Worker?**

A: Cay quyet dinh:

```
Tinh toan co ton thoi gian (> 50ms) khong?
├─ Khong → Khong can Worker
└─ Co → Tiep tuc danh gia
    │
    ├─ Co can thao tac DOM khong?
    │   ├─ Co → Khong the dung Worker (can nhac requestIdleCallback)
    │   └─ Khong → Tiep tuc danh gia
    │
    └─ Tan suat giao tiep co rat cao (> 60 lan/giay) khong?
        ├─ Co → Co le khong phu hop (chi phi giao tiep lon)
        └─ Khong → ✅ Phu hop dung Worker
```

**Truong hop phu hop:**

- Ma hoa/giai ma
- Xu ly hinh anh (filter, nen)
- Sap xep/loc du lieu lon
- Tinh toan toan hoc phuc tap
- Parse file (JSON, CSV)

**Truong hop khong phu hop:**

- Tinh toan don gian (chi phi lon hon loi ich)
- Can giao tiep thuong xuyen
- Can thao tac DOM
- Can API khong duoc ho tro

**Q5: Co nhung loai Web Worker nao?**

A: Ba loai:

```javascript
// 1. Dedicated Worker (rieng)
const worker = new Worker('worker.js');
// Chi giao tiep voi trang da tao no

// 2. Shared Worker (chia se)
const sharedWorker = new SharedWorker('shared-worker.js');
// Co the duoc chia se boi nhieu trang/tab

// 3. Service Worker
navigator.serviceWorker.register('sw.js');
// Dung cho cache, ho tro offline, push notification
```

**So sanh:**

| Dac diem        | Dedicated  | Shared               | Service    |
| --------------- | ---------- | -------------------- | ---------- |
| Chia se         | Mot trang  | Nhieu trang          | Toan trang |
| Vong doi        | Dong voi trang | Dong trang cuoi cung | Doc lap voi trang |
| Cong dung chinh | Tinh toan nen | Giao tiep giua cac trang | Cache, offline |

**Q6: Debug Web Worker nhu the nao?**

A: Chrome DevTools ho tro:

```javascript
// 1. File Worker hien thi trong panel Sources
// 2. Co the dat breakpoint
// 3. Co the chay code trong Console

self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // Hien thi trong Console DevTools
});

worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## So sanh hieu nang

### Du lieu test thuc te (xu ly 1 trieu dong)

| Phuong phap                | Thoi gian thuc thi | UI bi dong cung?        | Bo nho dinh |
| -------------------------- | ------------------ | ----------------------- | ----------- |
| Thread chinh (dong bo)     | 2.5 giay           | Dong cung hoan toan     | 250 MB      |
| Thread chinh (Time Slicing) | 3.2 giay          | Thinh thoang giat       | 280 MB      |
| Web Worker                 | 2.3 giay           | Muot hoan toan          | 180 MB      |

**Ket luan:**

- Web Worker khong chi khong chan UI ma con nhanh hon nho tinh toan song song da nhan
- Su dung bo nho it hon (thread chinh khong can giu du lieu lon)

---

## Cong nghe lien quan

### Web Worker vs cac giai phap khac

```javascript
// 1. setTimeout (bat dong bo gia)
setTimeout(() => heavyTask(), 0);
// ❌ Van tren thread chinh, co the chan

// 2. requestIdleCallback (thuc thi khi ranh)
requestIdleCallback(() => heavyTask());
// ⚠️ Chi thuc thi khi ranh roi, khong dam bao thoi gian

// 3. Web Worker (da thread thuc su)
worker.postMessage(task);
// ✅ Song song thuc su, khong chan UI
```

### Nang cao: don gian hoa giao tiep Worker voi Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) cho phep dung Worker nhu ham thuong:

```javascript
// Cach truyen thong (phuc tap)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Dung Comlink (gon gang)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

const result = await api.add(1, 2);
console.log(result); // 3
```

---

## Goi y hoc tap

**Chuan bi phong van:**

1. Hieu "tai sao can Worker" (van de don thread)
2. Biet "khi nao dung" (tinh toan ton thoi gian)
3. Hieu "co che giao tiep" (postMessage)
4. Biet "han che" (khong the thao tac DOM)
5. Da trien khai it nhat mot truong hop voi Worker

**Goi y thuc hanh:**

- Bat dau tu truong hop don gian (nhu tinh so nguyen to)
- Dung Chrome DevTools de debug
- Do luong su khac biet hieu nang
- Can nhac cong cu nhu Comlink

---

## Chu de lien quan

- [Toi uu hoa cap route ->](/docs/experience/performance/lv1-route-optimization)
- [Toi uu hoa tai hinh anh ->](/docs/experience/performance/lv1-image-optimization)
- [Trien khai Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)
- [Chien luoc toi uu du lieu lon ->](/docs/experience/performance/lv3-large-data-optimization)
