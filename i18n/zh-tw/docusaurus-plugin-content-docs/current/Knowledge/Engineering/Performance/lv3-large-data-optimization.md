---
id: performance-lv3-large-data-optimization
title: '[Lv3] 大量資料優化策略：方案選擇與實作'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> 當畫面需要顯示上萬筆資料時，如何在效能、使用者體驗和開發成本間取得平衡？

## 📋 面試情境題

**Q: 當畫面上有上萬筆資料時，該如何進行優化處理？**

這是一個開放性問題，面試官期待聽到的不只是單一解決方案，而是：

1. **需求評估**：真的需要一次顯示這麼多資料嗎？
2. **方案選擇**：有哪些方案？各自的優缺點？
3. **全面思考**：前端 + 後端 + UX 的綜合考量
4. **實際經驗**：選擇的理由和實施效果

---

## 第一步：需求評估

在選擇技術方案前，先問自己這些問題：

### 核心問題

```markdown
❓ 使用者真的需要看到所有資料嗎？
→ 大部分情況下，使用者只關心前 50-100 筆
→ 可以透過篩選、搜尋、排序來縮小範圍

❓ 資料是否需要實時更新？
→ WebSocket 即時更新 vs 定時輪詢 vs 僅初次載入

❓ 使用者的操作模式是什麼？
→ 瀏覽為主 → 虛擬滾動
→ 查找特定資料 → 搜尋 + 分頁
→ 逐筆檢視 → 無限滾動

❓ 資料結構是否固定？
→ 高度固定 → 虛擬滾動容易實作
→ 高度不固定 → 需要動態高度計算

❓ 是否需要全部選取、列印、匯出？
→ 需要 → 虛擬滾動會有限制
→ 不需要 → 虛擬滾動最佳選擇
```

### 實際案例分析

```javascript
// 案例 1：歷史交易記錄（10,000+ 筆）
使用者行為：查看最近的交易、偶爾搜尋特定日期
最佳方案：後端分頁 + 搜尋

// 案例 2：即時遊戲列表（3,000+ 款）
使用者行為：瀏覽、分類篩選、流暢滾動
最佳方案：虛擬滾動 + 前端篩選

// 案例 3：社交動態（無限增長）
使用者行為：持續往下滑、不需要跳頁
最佳方案：無限滾動 + 分批載入

// 案例 4：數據報表（複雜表格）
使用者行為：查看、排序、匯出
最佳方案：後端分頁 + 匯出 API
```

---

## 💡 優化方案總覽

### 方案對比表

| 方案           | 適用場景             | 優點                   | 缺點                   | 實作難度 | 效能     |
| -------------- | -------------------- | ---------------------- | ---------------------- | -------- | -------- |
| **後端分頁**   | 大部分場景           | 簡單可靠、SEO 友好     | 需要翻頁、體驗中斷     | 1/5 簡單 | 3/5 中等 |
| **虛擬滾動**   | 大量固定高度資料     | 極致效能、流暢滾動     | 實作複雜、無法原生搜尋 | 4/5 複雜 | 5/5 極佳 |
| **無限滾動**   | 社交媒體、新聞流     | 連續體驗、實作簡單     | 記憶體累積、無法跳頁   | 2/5 簡單 | 3/5 中等 |
| **數據分批**   | 初次載入優化         | 漸進式載入、配合骨架屏 | 需要後端配合           | 2/5 簡單 | 3/5 中等 |
| **Web Worker** | 大量計算、排序、過濾 | 不阻塞主線程           | 通訊開銷、除錯困難     | 3/5 中等 | 4/5 良好 |
| **混合方案**   | 複雜需求             | 結合多種方案優點       | 複雜度高               | 4/5 複雜 | 4/5 良好 |

---

## 📚 方案詳解

### 1. 後端分頁（Pagination）★ 首選方案

> **推薦指數：5/5（強烈推薦）**  
> 最常見、最可靠的方案，適合 80% 的場景

#### 實作方式

```javascript
// 前端請求
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// 後端 API（以 Node.js + MongoDB 為例）
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  const data = await Collection.find().skip(skip).limit(pageSize).lean(); // 只返回純物件，不含 Mongoose 方法

  const total = await Collection.countDocuments();

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});
```

#### 優化技巧

```javascript
// 1. 游標分頁（Cursor-based Pagination）
// 適合實時更新的資料，避免重複或遺漏
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. 快取熱門頁面
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. 只返回必要欄位
const data = await Collection.find()
  .select('id name price status') // 只選取需要的欄位
  .skip(skip)
  .limit(pageSize);
```

#### 適用場景

```markdown
✅ 適合
├─ 管理後台（訂單列表、使用者列表）
├─ 資料查詢系統（歷史記錄）
├─ 公開網站（部落格、新聞）
└─ 需要 SEO 的頁面

❌ 不適合
├─ 需要流暢滾動體驗
├─ 實時更新的列表（分頁可能跳動）
└─ 社交媒體類應用
```

---

### 2. 虛擬滾動（Virtual Scrolling）★ 極致效能

> **推薦指數：4/5（推薦）**  
> 效能最佳，適合大量固定高度資料

虛擬滾動是一種只渲染可見區域的技術，將 DOM 節點從 10,000+ 降至 20-30 個，記憶體使用降低 80%。

#### 核心概念

```javascript
// 只渲染可見範圍的資料
const itemHeight = 50; // 每項高度
const containerHeight = 600; // 容器高度
const visibleCount = Math.ceil(containerHeight / itemHeight); // 可見數量 = 12

// 計算當前應該顯示哪些項目
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 只渲染這個範圍
const visibleItems = allItems.slice(startIndex, endIndex);

// 用 padding 補償高度（讓滾動條正確）
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

#### 實作方式

```vue
<!-- 使用 vue-virtual-scroller -->
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }))
);
</script>
```

#### 效能對比

| 指標       | 傳統渲染 | 虛擬滾動 | 改善幅度 |
| ---------- | -------- | -------- | -------- |
| DOM 節點數 | 10,000+  | 20-30    | ↓ 99.7%  |
| 記憶體使用 | 150 MB   | 30 MB    | ↓ 80%    |
| 首次渲染   | 3-5 秒   | 0.3 秒   | ↑ 90%    |
| 滾動 FPS   | < 20     | 55-60    | ↑ 200%   |

#### 詳細說明

👉 **深入瞭解：[虛擬滾動完整實作 →](/docs/experience/performance/lv3-virtual-scroll)**

---

### 3. 無限滾動（Infinite Scroll）★ 連續體驗

> **推薦指數：3/5（可考慮）**  
> 適合社交媒體、新聞流等連續瀏覽的場景

#### 實作方式

```vue
<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <div v-for="item in displayedItems" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">載入中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const displayedItems = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

// 初次載入
onMounted(() => {
  loadMore();
});

// 載入更多資料
async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const { data, hasNext } = await fetchData(currentPage.value);
  displayedItems.value.push(...data);
  hasMore.value = hasNext;
  currentPage.value++;
  loading.value = false;
}

// 滾動監聽
function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  // 距離底部 100px 時觸發載入
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}
</script>
```

#### 優化技巧

```javascript
// 1. 使用 IntersectionObserver（效能更好）
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  },
  { rootMargin: '100px' } // 提前 100px 觸發
);

// 觀察最後一個元素
const lastItem = document.querySelector('.item:last-child');
observer.observe(lastItem);

// 2. 節流控制（避免快速滾動時多次觸發）
import { throttle } from 'lodash';
const handleScroll = throttle(checkAndLoadMore, 200);

// 3. 虛擬化卸載（避免記憶體累積）
// 當資料超過 500 筆時，卸載最前面的資料
if (displayedItems.value.length > 500) {
  displayedItems.value = displayedItems.value.slice(-500);
}
```

#### 適用場景

```markdown
✅ 適合
├─ 社交媒體動態（Facebook、Twitter）
├─ 新聞列表、文章列表
├─ 商品瀑布流
└─ 連續瀏覽為主的場景

❌ 不適合
├─ 需要跳頁查看特定資料
├─ 資料總量需要顯示（如「共 10,000 筆」）
└─ 需要回到頂部的場景（滑太久回不去）
```

---

### 4. 數據分批載入（Progressive Loading）

> **推薦指數：3/5（可考慮）**  
> 漸進式載入，提升首屏體驗

#### 實作方式

```javascript
// 分批載入策略
async function loadDataInBatches() {
  const batchSize = 50;
  const totalBatches = Math.ceil(totalItems / batchSize);

  // 第一批：立即載入（首屏資料）
  const firstBatch = await fetchBatch(0, batchSize);
  displayedItems.value = firstBatch;

  // 後續批次：延遲載入
  for (let i = 1; i < totalBatches; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // 間隔 100ms
    const batch = await fetchBatch(i * batchSize, batchSize);
    displayedItems.value.push(...batch);
  }
}

// 配合骨架屏
<template>
  <div v-if="loading">
    <SkeletonItem v-for="i in 10" :key="i" />
  </div>
  <div v-else>
    <Item v-for="item in items" :key="item.id" :data="item" />
  </div>
</template>
```

#### 使用 requestIdleCallback

```javascript
// 在瀏覽器空閒時載入後續資料
function loadBatchWhenIdle(batch) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      displayedItems.value.push(...batch);
    });
  } else {
    // Fallback: 使用 setTimeout
    setTimeout(() => {
      displayedItems.value.push(...batch);
    }, 0);
  }
}
```

---

### 5. Web Worker 處理（Heavy Computation）

> **推薦指數：4/5（推薦）**  
> 大量計算不阻塞主線程

#### 適用場景

```markdown
✅ 適合
├─ 大量資料排序（10,000+ 筆）
├─ 複雜過濾、搜尋
├─ 資料格式轉換
└─ 統計計算（如圖表資料處理）

❌ 不適合
├─ 需要操作 DOM（Worker 中無法訪問）
├─ 簡單計算（通訊開銷大於計算本身）
└─ 需要即時回饋的互動
```

#### 實作方式

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { data, keyword } = e.data;

  // 在 Worker 中處理大量資料過濾
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // 回傳結果
  self.postMessage(filtered);
});

// main.js
const worker = new Worker('/worker.js');

function searchData(keyword) {
  worker.postMessage({ data: allData, keyword });

  worker.onmessage = (e) => {
    displayedItems.value = e.data;
    console.log('過濾完成，主線程不卡頓');
  };
}
```

👉 **詳細說明：[Web Worker 應用 →](/docs/experience/performance/lv3-web-worker)**

---

### 6. 混合方案（Hybrid Approach）

針對複雜場景，結合多種方案：

#### 方案 A：虛擬滾動 + 後端分頁

```javascript
// 每次從後端拿 500 筆資料
// 前端使用虛擬滾動渲染
// 滾動到底部時載入下一批 500 筆

const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}

// 使用虛擬滾動渲染 currentBatch
```

#### 方案 B：無限滾動 + 虛擬化卸載

```javascript
// 無限滾動載入資料
// 但當資料超過 1000 筆時，卸載最前面的資料

function loadMore() {
  // 載入更多資料
  items.value.push(...newItems);

  // 虛擬化卸載（保留最新 1000 筆）
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### 方案 C：搜尋優化 + 虛擬滾動

```javascript
// 搜尋時使用後端 API
// 搜尋結果使用虛擬滾動渲染

async function search(keyword) {
  if (keyword) {
    // 有關鍵字：後端搜尋（支援模糊搜尋、全文檢索）
    searchResults.value = await apiSearch(keyword);
  } else {
    // 無關鍵字：顯示全部（虛擬滾動）
    searchResults.value = allItems.value;
  }
}
```

---

## 🎯 決策流程圖

```
開始：上萬筆資料需要顯示
    ↓
Q1: 使用者是否需要看到所有資料？
    ├─ 否 → 後端分頁 + 搜尋/篩選 ✅
    ↓
    是
    ↓
Q2: 資料高度是否固定？
    ├─ 是 → 虛擬滾動 ✅
    ├─ 否 → 動態高度虛擬滾動（複雜）或無限滾動 ✅
    ↓
Q3: 是否需要連續瀏覽體驗？
    ├─ 是 → 無限滾動 ✅
    ├─ 否 → 後端分頁 ✅
    ↓
Q4: 是否有大量計算需求（排序、過濾）？
    ├─ 是 → Web Worker + 虛擬滾動 ✅
    ├─ 否 → 虛擬滾動 ✅
```

---

## 🔧 配套優化策略

無論選擇哪種方案，都可以搭配這些優化：

### 1. 資料更新頻率控制

```javascript
// RequestAnimationFrame（適合動畫、滾動）
let latestData = null;
let scheduled = false;

socket.on('update', (data) => {
  latestData = data;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => {
      updateUI(latestData);
      scheduled = false;
    });
  }
});

// Throttle（適合搜尋、resize）
import { throttle } from 'lodash';
const handleSearch = throttle(performSearch, 300);
```

### 2. 骨架屏（Skeleton Screen）

```vue
<template>
  <div v-if="loading">
    <!-- 載入中顯示骨架屏 -->
    <div class="skeleton-item" v-for="i in 10" :key="i">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-text"></div>
    </div>
  </div>
  <div v-else>
    <!-- 實際資料 -->
    <Item v-for="item in items" :key="item.id" />
  </div>
</template>

<style>
.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
```

### 3. 索引與快取

```javascript
// 前端建立索引（加速查找）
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

// 快速查找
const item = indexedData.get(targetId); // O(1) 而非 O(n)

// 使用 IndexedDB 快取大量資料
import { openDB } from 'idb';

const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  },
});

// 儲存資料
await db.put('items', item);

// 讀取資料
const item = await db.get('items', id);
```

### 4. 後端 API 優化

```javascript
// 1. 只返回必要欄位
GET /api/items?fields=id,name,price

// 2. 使用壓縮（gzip/brotli）
// 在 Express 中啟用
app.use(compression());

// 3. HTTP/2 Server Push
// 預先推送可能需要的資料

// 4. GraphQL（精確查詢需要的資料）
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## 📊 效能評估指標

選擇方案後，使用這些指標評估效果：

### 技術指標

```markdown
1. 首次渲染時間（FCP）：< 1 秒
2. 可互動時間（TTI）：< 3 秒
3. 滾動 FPS：> 50（目標 60）
4. 記憶體使用：< 50 MB
5. DOM 節點數：< 1000
```

### 使用者體驗指標

```markdown
1. 跳出率：降低 20%+
2. 停留時間：增加 30%+
3. 互動次數：增加 40%+
4. 錯誤率：< 0.1%
```

### 測量工具

```markdown
1. Chrome DevTools
   ├─ Performance：Long Task、FPS
   ├─ Memory：記憶體使用
   └─ Network：請求數量、大小

2. Lighthouse
   ├─ Performance Score
   ├─ FCP / LCP / TTI
   └─ CLS

3. 自訂監控
   ├─ Performance API
   ├─ User Timing API
   └─ RUM（Real User Monitoring）
```

---

## 💬 面試回答範本

### 結構化回答（STAR 方法）

**面試官：當畫面上有上萬筆資料時，該如何優化？**

**回答：**

> "這是個很好的問題。在選擇方案前，我會先評估實際需求：
>
> **1. 需求分析（30 秒）**
>
> - 使用者是否需要看到所有資料？大多數情況下不需要
> - 資料的高度是否固定？這會影響技術選擇
> - 使用者的主要操作是什麼？瀏覽、搜尋還是查找特定項目
>
> **2. 方案選擇（1 分鐘）**
>
> 根據不同場景，我會選擇：
>
> - **一般管理後台** → 後端分頁（最簡單可靠）
> - **需要流暢滾動** → 虛擬滾動（效能最佳）
> - **社交媒體類型** → 無限滾動（體驗最好）
> - **複雜計算需求** → Web Worker + 虛擬滾動
>
> **3. 實際案例（1 分鐘）**
>
> 在我之前的專案中，遇到遊戲列表需要顯示 3000+ 款遊戲的情況。
> 我選擇使用虛擬滾動方案，最終：
>
> - DOM 節點從 10,000+ 降至 20-30 個（↓ 99.7%）
> - 記憶體使用降低 80%（150MB → 30MB）
> - 首次渲染時間從 3-5 秒縮短至 0.3 秒
> - 滾動流暢度達到 60 FPS
>
> 配合前端篩選、RAF 更新控制、骨架屏等優化，使用者體驗提升明顯。
>
> **4. 配套優化（30 秒）**
>
> 無論選擇哪種方案，我都會搭配：
>
> - 後端 API 優化（只返回必要欄位、壓縮、快取）
> - 骨架屏提升載入體驗
> - 防抖節流控制更新頻率
> - Lighthouse 等工具持續監控效能"

### 常見追問

**Q: 如果不能用第三方套件怎麼辦？**

A: 虛擬滾動的核心原理不複雜，可以自己實作。主要是計算可見範圍（startIndex/endIndex）、動態載入資料、用 padding 補償高度。實際專案中我會評估開發成本，如果時程允許可以自己實作，但建議優先使用成熟套件避免踩坑。

**Q: 虛擬滾動有什麼缺點？**

A: 主要有幾個 trade-offs：

1. 無法使用瀏覽器原生搜尋（Ctrl+F）
2. 無法全選所有項目（需特殊處理）
3. 實作複雜度較高
4. 無障礙功能需額外處理

因此要根據實際需求評估是否值得使用。

**Q: 如何測試優化效果？**

A: 使用多種工具組合：

- Chrome DevTools Performance（Long Task、FPS）
- Lighthouse（整體評分）
- 自訂效能監控（Performance API）
- 使用者行為追蹤（跳出率、停留時間）

---

## 📚 相關筆記

- [虛擬滾動完整實作 →](/docs/experience/performance/lv3-virtual-scroll)
- [網頁效能優化總覽 →](/docs/experience/performance)
- [Web Worker 應用 →](/docs/experience/performance/lv3-web-worker)

---

## 🎯 總結

面對"上萬筆資料優化"這個問題：

1. ✅ **先評估需求**：不要急著選技術
2. ✅ **了解多種方案**：後端分頁、虛擬滾動、無限滾動等
3. ✅ **權衡取捨**：效能 vs 開發成本 vs 使用者體驗
4. ✅ **持續優化**：配合監控工具，持續改進
5. ✅ **數據說話**：用實際效能數據證明優化成效

記住：**沒有銀彈，只有最適合當前場景的方案**。
