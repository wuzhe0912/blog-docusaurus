---
id: virtual-scroll
title: '📄 虛擬滾動'
slug: /virtual-scroll
---

# 虛擬滾動（Virtual Scroll）實戰

> 當頁面需要渲染 1000+ 筆資料時，虛擬滾動可以將 DOM 節點從 1000+ 降至 20-30 個，記憶體使用降低 80%。

## 📋 面試情境題

**Q: 畫面上的 table 有不止一個，且如果各自有超過一百筆資料，同時又有頻繁更新 DOM 的事件，會用什麼方法去優化這頁的效能？**

---

## 🎯 問題分析（Situation）

### 實際專案場景

在遊戲平台中，我們有以下頁面需要處理大量資料：

```
📊 金流歷史紀錄頁面
├─ 儲值記錄表格：1000+ 筆
├─ 提款記錄表格：800+ 筆
├─ 投注記錄表格：5000+ 筆
└─ 每筆記錄 8-10 個欄位（時間、金額、狀態等）

❌ 未優化的問題
├─ DOM 節點數：1000 筆 × 10 欄位 = 10,000+ 個節點
├─ 記憶體佔用：約 150-200 MB
├─ 首次渲染時間：3-5 秒（白屏）
├─ 滾動卡頓：FPS < 20
└─ WebSocket 更新時：整個表格重新渲染（非常卡）
```

### 問題嚴重性

```javascript
// ❌ 傳統做法
<tr v-for="record in allRecords">  // 1000+ 筆全部渲染
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 個欄位
</tr>

// 結果：
// - 初始渲染：10,000+ 個 DOM 節點
// - 使用者實際可見：20-30 筆
// - 浪費：99% 的節點使用者根本看不到
```

---

## ⚡ 解決方案（Action）

### Virtual Scrolling(虛擬滾動) ⭐️

先考慮虛擬滾動的優化問題，從這個角度出發，大概有兩個方向，一個是選擇官方背書的三方套件 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)，根據參數和需求，來決定可視範圍的 row。

```js
// 只渲染可見區域的 row，例如：
// - 100 筆資料，只渲染可見的 20 筆
// - 大幅減少 DOM 節點數量
```

另一種則是選擇自己手刻，但考慮到實際開發的成本，以及涵括的情境，我應該會比較傾向採用官方背書的三方套件。

### 資料更新頻率控制

> ✅ 解法一：requestAnimationFrame（RAF）
> 概念：瀏覽器每秒最多重繪 60 次（60 FPS），更新再快人眼也看不到，所以我們配合螢幕刷新率更新

```js
// ❌ 原本：收到資料就立刻更新（每秒可能 100 次）
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ 改良：收集資料，配合螢幕刷新率一次更新（每秒最多 60 次）
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // 暫存最新價格

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // 在瀏覽器準備重繪時才更新
      isScheduled = false;
    });
  }
});
```

✅ 解法二：throttle（節流）
概念：強制限制更新頻率，例如「每 100ms 最多更新 1 次」

```js
// lodash 的 throttle（如果專案有用）
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // 每 100ms 最多執行 1 次

socket.on('price', updatePrice);
```

### Vue3 特定優化

有一些 Vue3 的語法糖會提供優化效能，例如 v-memo，但我個人很少使用這個情境。

```js
// 1. v-memo - 記憶化不常變動的列
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // 只在這些欄位變化時重新渲染
</tr>

// 2. 凍結靜態資料，避免響應式開銷
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef 處理大陣列
const tableData = shallowRef([...])  // 只追蹤陣列本身，不追蹤內部物件

// 4. 使用 key 優化 diff 算法(讓唯一值的 id 來追蹤每個 item，讓 DOM 的更新可以局限在有變化的節點，節省效能)
<tr v-for="row in data" :key="row.id">  // 穩定的 key**
```

RAF：配合螢幕刷新（約 16ms），適合動畫、滾動
throttle：自訂間隔（如 100ms），適合搜尋、resize

### DOM 渲染優化

```scss
// 使用 CSS transform 而非 top/left
.row-update {
  transform: translateY(0); /* 觸發 GPU 加速 */
  will-change: transform; /* 提示瀏覽器優化 */
}

// CSS containment 隔離渲染範圍
.table-container {
  contain: layout style paint;
}
```

---

## ✅ 優化成效（Result）

### 效能對比

| 指標       | 優化前     | 優化後     | 改善幅度 |
| ---------- | ---------- | ---------- | -------- |
| DOM 節點數 | 10,000+    | 20-30      | ↓ 99.7%  |
| 記憶體使用 | 150-200 MB | 30-40 MB   | ↓ 80%    |
| 首次渲染   | 3-5 秒     | 0.3-0.5 秒 | ↑ 90%    |
| 滾動 FPS   | < 20       | 55-60      | ↑ 200%   |
| 更新響應   | 500-800 ms | 16-33 ms   | ↑ 95%    |

### 實際效果

```
✅ 虛擬滾動
├─ 只渲染可見的 20-30 筆
├─ 滾動時動態更新可見範圍
├─ 使用者無感知（體驗流暢）
└─ 記憶體穩定（不會隨資料量增長）

✅ RAF 資料更新
├─ WebSocket 每秒 100 次更新 → 最多 60 次渲染
├─ 配合螢幕刷新率（60 FPS）
└─ CPU 使用降低 60%

✅ Vue3 優化
├─ v-memo：避免不必要的重新渲染
├─ shallowRef：減少響應式開銷
└─ 穩定的 :key：優化 diff 算法
```

---

## 💡 面試重點

### 常見延伸問題

**Q: 如果不能用第三方 library 怎麼辦？**  
A: 自行實作虛擬滾動的核心邏輯：

```javascript
// 核心概念
const itemHeight = 50; // 每行高度
const containerHeight = 600; // 容器高度
const visibleCount = Math.ceil(containerHeight / itemHeight); // 可見數量

// 計算當前應該顯示哪些項目
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 只渲染可見範圍
const visibleItems = allItems.slice(startIndex, endIndex);

// 用 padding 補償高度（讓滾動條正確）
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**關鍵點：**

- 計算可見範圍（startIndex → endIndex）
- 動態載入資料（slice）
- 補償高度（padding top/bottom）
- 監聽滾動事件（throttle 優化）

**Q: WebSocket 斷線重連如何處理？**  
A: 實作指數退避重連策略：

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 秒

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('無法連線，請重新整理頁面');
    return;
  }

  // 指數退避：1s → 2s → 4s → 8s → 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// 重連成功後
socket.on('connect', () => {
  retryCount = 0; // 重置計數
  syncData(); // 同步資料
  showSuccess('連線已恢復');
});
```

**Q: 如何測試效能優化效果？**  
A: 使用多種工具組合：

```javascript
// 1. Performance API 測量 FPS
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}

// 2. Memory Profiling（Chrome DevTools）
// - 渲染前拍快照
// - 渲染後拍快照
// - 比較記憶體差異

// 3. Lighthouse / Performance Tab
// - Long Task 時間
// - Total Blocking Time
// - Cumulative Layout Shift

// 4. 自動化測試（Playwright）
const { test } = require('@playwright/test');

test('virtual scroll performance', async ({ page }) => {
  await page.goto('/records');

  // 測量首次渲染時間
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // 觸發渲染
    const end = performance.now();
    return end - start;
  });

  expect(renderTime).toBeLessThan(500); // < 500ms
});
```

**Q: Virtual Scroll 有什麼缺點？**  
A: Trade-offs 需要注意：

```
❌ 缺點
├─ 無法使用瀏覽器原生搜尋（Ctrl+F）
├─ 無法使用「全選」功能（需要特殊處理）
├─ 實作複雜度較高
├─ 需要固定高度或提前計算高度
└─ 無障礙功能（Accessibility）需額外處理

✅ 適合場景
├─ 資料量 > 100 筆
├─ 每筆資料結構相似（高度固定）
├─ 需要高效能滾動
└─ 以查看為主（非編輯）

❌ 不適合場景
├─ 資料量 < 50 筆（過度設計）
├─ 高度不固定（實作困難）
├─ 需要大量互動（如多選、拖曳）
└─ 需要列印整個表格
```

**Q: 如何優化不等高的列表？**  
A: 使用動態高度虛擬滾動：

```javascript
// 方案一：預估高度 + 實際測量
const estimatedHeight = 50; // 預估高度
const measuredHeights = {}; // 記錄實際高度

// 渲染後測量
onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// 方案二：使用支援動態高度的套件
// vue-virtual-scroller 支援 dynamic-height
<DynamicScroller
  :items="items"
  :min-item-size="50"  // 最小高度
  :buffer="200"        // 緩衝區
/>
```

---

## 📊 技術對比

### Virtual Scroll vs 分頁

| 比較項目   | Virtual Scroll     | 傳統分頁         |
| ---------- | ------------------ | ---------------- |
| 使用者體驗 | 連續滾動（更好）   | 需要翻頁（中斷） |
| 效能       | 始終只渲染可見範圍 | 每頁全部渲染     |
| 實作難度   | 較複雜             | 簡單             |
| SEO 友好   | 較差               | 較好             |
| 無障礙     | 需特殊處理         | 原生支援         |

**建議：**

- 後台系統、Dashboard → Virtual Scroll
- 公開網站、部落格 → 傳統分頁
- 混合方案：Virtual Scroll + 「載入更多」按鈕

---

## 🔗 相關主題

- [前端效能優化 →](./optimization.md)
- [Web Worker 應用 →](./web-worker.md)
- [專案總覽 →](./project-overview.md)
