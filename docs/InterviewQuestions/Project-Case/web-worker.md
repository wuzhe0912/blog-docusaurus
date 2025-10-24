---
id: web-worker
title: '📄 Web Worker'
slug: /web-worker
---

# Web Worker 多執行緒應用

> **Web Worker** 是一個在瀏覽器背景執行緒中運行 JavaScript 的 API，讓你能夠執行耗時的運算而不會阻塞主執行緒（UI 執行緒）。

## 🎯 核心概念

### 問題背景

JavaScript 原本是**單執行緒**的，所有程式碼都在主執行緒執行：

```javascript
// ❌ 耗時運算阻塞主執行緒
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // 複雜計算
  }
  return result;
}

// 執行時整個頁面凍結
const result = heavyComputation(); // UI 無法互動 😢
```

**問題：**

- 頁面卡住，使用者無法點擊、滾動
- 動畫停止
- 使用者體驗極差

### Web Worker 解決方案

Web Worker 提供**多執行緒**能力，讓耗時任務在背景執行：

```javascript
// ✅ 使用 Worker 在背景執行
const worker = new Worker('worker.js');

// 主執行緒不阻塞，頁面依然可以互動
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('背景運算完成:', e.data);
};
```

---

## 情境 1：大數據處理

```javascript
// main.js
const worker = new Worker('worker.js');

// 處理大型 JSON 數據
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('處理結果:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // 執行耗時的數據處理
    const result = data.map((item) => {
      // 複雜運算
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## 情境 2：圖片處理

處理圖片濾鏡、壓縮、像素操作等，避免凍結 UI。

## 情境 3：複雜計算

數學運算（如質數計算、加密解密）
大型檔案的雜湊值計算
數據分析和統計

## 使用限制與注意事項

### 不能在 Worker 中做的事

- 直接操作 DOM
- 存取 window、document、parent 物件
- 使用某些 Web API（如 alert）

### 可以在 Worker 中使用

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- 定時器（setTimeout、setInterval）
- 部分瀏覽器 API

```javascript
// 不適合用 Worker 的情況
// 1. 簡單快速的運算（創建 Worker 本身有開銷）
const result = 1 + 1; // 不需要 Worker

// 2. 需要頻繁與主執行緒通訊
// 通訊本身有成本，可能抵消多執行緒優勢

// 適合用 Worker 的情況
// 1. 單次長時間運算
const result = calculatePrimes(1000000);

// 2. 批次處理大量數據
const processed = largeArray.map(complexOperation);
```

---

## 🎯 實際專案應用案例

### 案例：遊戲資料加密處理

在遊戲平台中，我們需要對敏感資料進行加密/解密：

```javascript
// main.js - 主執行緒
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// 加密玩家資料
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

// 使用
const encrypted = await encryptPlayerData(sensitiveData);
// 頁面不會卡頓，使用者可以繼續操作

// crypto-worker.js - Worker 執行緒
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      // 耗時的加密運算
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### 案例：大量遊戲資料篩選

```javascript
// 在 3000+ 款遊戲中進行複雜篩選
const filterWorker = new Worker('/workers/game-filter.js');

// 篩選條件
const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ 款
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered); // 顯示篩選結果
};

// 主執行緒不卡頓，使用者可以繼續滾動、點擊
```

---

## 💡 面試重點

### 常見面試問題

**Q1: Web Worker 和主執行緒如何通訊？**

A: 透過 `postMessage` 和 `onmessage`：

```javascript
// 主執行緒 → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → 主執行緒
self.postMessage({ type: 'RESULT', result: processedData });

// 注意：資料會被「結構化複製」（Structured Clone）
// 這意味著：
// ✅ 可以傳遞：Number, String, Object, Array, Date, RegExp
// ❌ 不能傳遞：Function, DOM 元素, Symbol
```

**Q2: Web Worker 的效能開銷是什麼？**

A: 主要有兩個開銷：

```javascript
// 1. 創建 Worker 的開銷（約 30-50ms）
const worker = new Worker('worker.js'); // 需要載入檔案

// 2. 通訊的開銷（資料複製）
worker.postMessage(largeData); // 大資料複製耗時

// 解決方案：
// 1. 重用 Worker（不要每次都創建）
// 2. 使用 Transferable Objects（轉移所有權，不複製）
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // 轉移所有權
```

**Q3: Transferable Objects 是什麼？**

A: 轉移資料所有權，而不是複製：

```javascript
// ❌ 一般做法：複製資料（慢）
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // 複製 10MB（耗時）

// ✅ Transferable：轉移所有權（快）
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // 轉移所有權（毫秒級）

// 注意：轉移後，主執行緒無法再使用該資料
console.log(largeArray.length); // 0（已轉移）
```

**支援的 Transferable 類型：**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4: 什麼時候應該使用 Web Worker？**

A: 使用決策樹：

```
是否為耗時運算（> 50ms）？
├─ 否 → 不需要 Worker
└─ 是 → 繼續判斷
    │
    ├─ 是否需要操作 DOM？
    │   ├─ 是 → 不能用 Worker（考慮 requestIdleCallback）
    │   └─ 否 → 繼續判斷
    │
    └─ 通訊頻率是否很高（> 60次/秒）？
        ├─ 是 → 可能不適合（通訊開銷大）
        └─ 否 → ✅ 適合使用 Worker
```

**適合的場景：**

- ✅ 加密/解密
- ✅ 圖片處理（濾鏡、壓縮）
- ✅ 大資料排序/篩選
- ✅ 複雜數學運算
- ✅ 檔案解析（JSON、CSV）

**不適合的場景：**

- ❌ 簡單計算（開銷大於收益）
- ❌ 需要頻繁通訊
- ❌ 需要操作 DOM
- ❌ 需要使用不支援的 API

**Q5: Web Worker 有哪些類型？**

A: 三種類型：

```javascript
// 1. Dedicated Worker（專用）
const worker = new Worker('worker.js');
// 只能與創建它的頁面通訊

// 2. Shared Worker（共享）
const sharedWorker = new SharedWorker('shared-worker.js');
// 可以被多個頁面/標籤共享

// 3. Service Worker（服務）
navigator.serviceWorker.register('sw.js');
// 用於快取、離線支援、推送通知
```

**比較：**

| 特性     | Dedicated  | Shared           | Service    |
| -------- | ---------- | ---------------- | ---------- |
| 共享性   | 單一頁面   | 多頁面共享       | 全站共享   |
| 生命週期 | 隨頁面關閉 | 最後一個頁面關閉 | 獨立於頁面 |
| 主要用途 | 背景運算   | 跨頁面通訊       | 快取、離線 |

**Q6: 如何除錯 Web Worker？**

A: Chrome DevTools 支援：

```javascript
// 1. 在 Sources 面板可以看到 Worker 檔案
// 2. 可以設置斷點
// 3. 可以在 Console 執行程式碼

// 實用技巧：在 Worker 中使用 console
self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // 可以在 DevTools Console 看到
});

// 錯誤處理
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## 📊 效能對比

### 實測數據（處理 100 萬筆資料）

| 方法                 | 執行時間 | UI 是否卡頓 | 記憶體峰值 |
| -------------------- | -------- | ----------- | ---------- |
| 主執行緒（同步）     | 2.5 秒   | ❌ 完全卡死 | 250 MB     |
| 主執行緒（時間切片） | 3.2 秒   | ⚠️ 偶爾卡頓 | 280 MB     |
| Web Worker           | 2.3 秒   | ✅ 完全流暢 | 180 MB     |

**結論：**

- Web Worker 不僅不卡 UI，還因為多核心並行而更快
- 記憶體使用更少（主執行緒不需要保留大量資料）

---

## 🔗 相關技術

### Web Worker vs 其他方案

```javascript
// 1. setTimeout（偽異步）
setTimeout(() => heavyTask(), 0);
// ❌ 還是在主執行緒，會卡

// 2. requestIdleCallback（空閒時執行）
requestIdleCallback(() => heavyTask());
// ⚠️ 只在閒置時執行，不保證完成時間

// 3. Web Worker（真正多執行緒）
worker.postMessage(task);
// ✅ 真正並行，不阻塞 UI
```

### 進階：使用 Comlink 簡化 Worker 通訊

[Comlink](https://github.com/GoogleChromeLabs/comlink) 讓 Worker 使用起來像普通函式：

```javascript
// 傳統方式（繁瑣）
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// 使用 Comlink（簡潔）
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// 像調用普通函式一樣
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## 🎓 學習建議

**面試準備：**

1. 理解「為什麼需要 Worker」（單執行緒問題）
2. 知道「什麼時候用」（耗時運算）
3. 了解「通訊機制」（postMessage）
4. 認識「限制」（無法操作 DOM）
5. 實作過至少一個 Worker 案例

**實戰建議：**

- 從簡單案例開始（如質數計算）
- 使用 Chrome DevTools 除錯
- 測量效能差異
- 考慮 Comlink 等工具

---

## 🔗 相關主題

- [前端效能優化 →](./optimization.md)
- [虛擬滾動 →](./virtual-scroll.md)
- [專案總覽 →](./project-overview.md)
