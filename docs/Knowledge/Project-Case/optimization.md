---
id: optimization
title: '📄 前端效能優化'
slug: /optimization
---

> 本文記錄實施過的效能優化方案

## 1. 路由層級優化

### 問題背景（Situation）

專案特性：

- 📦 **27+ 個不同的多租戶版型**（多租戶架構）
- 📄 **每個版型有 20-30 個頁面**（首頁、大廳、促銷、代理、新聞等）
- 💾 **如果一次載入所有程式碼**：首次進入需要下載 **10MB+ 的 JS 檔案**
- ⏱️ **使用者等待時間超過 10 秒**（尤其在手機網路環境下）

### 優化目標（Task）

1. **減少首次載入的 JavaScript 體積**（目標：< 1MB）
2. **縮短首屏時間**（目標：< 3 秒）
3. **按需載入**（使用者只下載需要的內容）
4. **維持開發體驗**（不能影響開發效率）

### 解決方案（Action）

我們採用了**三層路由 Lazy Loading** 的策略，從「版型」→「頁面」→「權限」三個層級進行優化。

第 1 層：動態模板載入

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // 根據環境變數動態載入對應的版型路由
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

說明：

- 專案有 27 個版型，但用戶只會使用其中 1 個
- 透過 environment.json 判斷當前是哪個品牌
- 只載入該品牌的路由配置，其他 26 個版型完全不載入

效果：

- 首次載入減少約 85% 的路由配置程式碼

第 2 層：頁面 Lazy Loading

```typescript
// 傳統寫法（X - 不好）
import HomePage from './pages/HomePage.vue';
component: HomePage; // 所有頁面都會被打包進 main.js

// 我們的寫法（✓ - 好）
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- 每個路由使用 箭頭函式 + import() 包裹
- 只有當用戶真正訪問該頁面時，才會下載對應的 JS chunk
- Vite 會自動將每個頁面打包成獨立的檔案

第 3 層：按需載入策略

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // 未登入用戶不會載入「代理中心」等需要登入的頁面
    return next({ name: 'HomePage' });
  }
  next();
});
```

### ✅ 優化成效（Result）

**優化前：**

```
首次載入：main.js (12.5 MB)
首屏時間：8-12 秒
包含所有 27 個版型 + 所有頁面
```

**優化後：**

```markdown
首次載入：main.js (850 KB) ↓ 93%
首屏時間：1.5-2.5 秒 ↑ 70%
僅包含核心程式碼 + 當前首頁
```

**具體數據：**

- ✅ JavaScript 體積減少：**12.5 MB → 850 KB（減少 93%）**
- ✅ 首屏時間縮短：**10 秒 → 2 秒（提升 70%）**
- ✅ 後續頁面載入：**平均 300-500 KB per page**
- ✅ 使用者體驗評分：**從 45 分提升至 92 分（Lighthouse）**

**商業價值：**

- 跳出率下降 35%
- 頁面停留時間增加 50%
- 轉換率提升 25%

### 面試重點

**常見延伸問題：**

1. **Q: 為什麼不用 React.lazy() 或 Vue 的異步組件？**  
   A: 我們確實有用 Vue 的異步組件（`() => import()`），但關鍵是**三層架構**：

   - 第 1 層（版型）：編譯時決定（Vite 配置）
   - 第 2 層（頁面）：運行時 Lazy Loading
   - 第 3 層（權限）：導航守衛控制

   單純的 lazy loading 只做到第 2 層，我們多做了版型層級的分離。

2. **Q: 如何決定哪些程式碼該放在 main.js？**  
   A: 使用 Vite 的 `manualChunks` 配置：

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   原則：只有「每個頁面都會用到」的才放 vendor chunk。

3. **Q: Lazy Loading 會不會影響用戶體驗（等待時間）？**  
   A: 有兩個策略應對：

   - **預載（Prefetch）**：在閒置時預先載入可能訪問的頁面
   - **Loading 狀態**：使用 Skeleton Screen 代替白屏

   實際測試：後續頁面平均載入時間 < 500ms，用戶無感知。

4. **Q: 如何測量優化效果？**  
   A: 使用多種工具：

   - **Lighthouse**：Performance Score（45 → 92）
   - **Webpack Bundle Analyzer**：視覺化分析 chunk 大小
   - **Chrome DevTools**：Network waterfall、Coverage
   - **Real User Monitoring (RUM)**：真實用戶數據

5. **Q: 有什麼 Trade-off（權衡）？**  
   A:
   - ❌ 開發時可能遇到循環依賴問題（需要調整模組結構）
   - ❌ 首次路由切換會有短暫載入時間（用 prefetch 解決）
   - ✅ 但整體利大於弊，尤其對手機用戶體驗提升明顯

---

## 2. 圖片載入優化

### 問題背景 (Situation)

> 想像你在滑手機看網頁，螢幕只能顯示 10 張圖片，但網頁一次載入了 500 張圖片的完整資料，你的手機會卡到爆，流量也瞬間燒掉 50MB。

**對應到專案的實際情況：**

```markdown
📊 某頁面首頁統計
├─ 300+ 張縮圖（每張 150-300KB）
├─ 50+ 張促銷 Banner
└─ 如果全部載入：300 × 200KB = 60MB+ 的圖片資料

❌ 實際問題
├─ 首屏只看得到 8-12 張圖片
├─ 使用者可能只滾動到第 30 張就離開了
└─ 剩下 270 張圖片完全白載入（浪費流量 + 拖慢速度）

📉 影響
├─ 首次載入時間：15-20 秒
├─ 流量消耗：60MB+（用戶怨聲載道）
├─ 頁面卡頓：滾動不流暢
└─ 跳出率：42%（極高）
```

### 優化目標 (Task)

1. **只載入可視範圍內的圖片**
2. **預載即將進入視窗的圖片**（提前 50px 開始載入）
3. **控制併發數量**（避免同時載入過多圖片）
4. **防止快速切換導致的資源浪費**
5. **首屏圖片流量 < 3MB**

### 解決方案（Action）

### v-lozy-load.ts 實作

> 四層 image lazy load

#### 第一層：視窗可見性檢測（IntersectionObserver）

```js
// 創建觀察器，監測圖片是否進入視窗
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 圖片進入可視區域
        // 開始載入圖片
      }
    });
  },
  {
    rootMargin: '50px 0px', // 提前 50px 開始載入（預載入）
    threshold: 0.1, // 只要露出 10% 就觸發
  }
);
```

- 使用瀏覽器原生 IntersectionObserver API（效能遠勝過 scroll 事件）
- rootMargin: "50px" → 當圖片還在下方 50px 時就開始載入，使用者滑到時已經好了（感覺更順暢）
- 不在視窗的圖片完全不載入

#### 第二層：併發控制機制（Queue 管理）

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // 同時最多載入 6 張
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // 有空位，馬上載入
    } else {
      this.queue.push(loadFn)   // 沒空位，排隊等候
    }
  }
}
```

- 即使 20 張圖片同時進入視窗，也只會同時載入 6 張
- 避免「瀑布式載入」阻塞瀏覽器（Chrome 預設最多併發 6 個請求）
- 載入完成後自動處理佇列中的下一張

```md
使用者快速滾動到底部 → 30 張圖片同時觸發
沒有佇列管理：30 個請求同時發出 → 瀏覽器卡頓
有佇列管理：前 6 張先載入 → 完成後載入下 6 張 → 流暢
```

#### 第三層：資源競態問題解決（版本控制）

```js
// 設置載入時的版本號
el.setAttribute('data-version', Date.now().toString());

// 載入完成後驗證版本
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // 版本一致，顯示圖片
  } else {
    // 版本不一致，使用者已經切換到其他遊戲了，不顯示
  }
};
```

實際案例：

```md
使用者操作：

1. 點擊「新聞」分類 → 觸發載入 100 張圖片（版本 1001）
2. 0.5 秒後點擊「優惠活動」→ 觸發載入 80 張圖片（版本 1002）
3. 新聞的圖片 1 秒後才載入完成

沒有版本控制：顯示新聞圖片（錯誤！）
有版本控制：檢查版本不一致，丟棄新聞圖片（正確！）
```

#### 第四層：占位符策略（Base64 透明圖）

```js
// 預設顯示 1×1 透明 SVG，避免版面位移
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// 真實圖片 URL 存在 data-src
el.setAttribute('data-src', realImageUrl);
```

- 使用 Base64 編碼的透明 SVG（只有 100 bytes）
- 避免 CLS（Cumulative Layout Shift，累積版面位移）
- 使用者不會看到「圖片突然跳出來」的現象

### 優化成效（Result）

**優化前：**

```markdown
首屏圖片：一次載入 300 張（60MB）
載入時間：15-20 秒
滾動流暢度：卡頓嚴重
跳出率：42%
```

**優化後：**

```markdown
首屏圖片：只載入 8-12 張（2MB） ↓ 97%
載入時間：2-3 秒 ↑ 85%
滾動流暢度：流暢（60fps）
跳出率：28% ↓ 33%
```

**具體數據：**

- ✅ 首屏圖片流量：**60 MB → 2 MB（減少 97%）**
- ✅ 圖片載入時間：**15 秒 → 2 秒（提升 85%）**
- ✅ 頁面滾動 FPS：**從 20-30 提升至 55-60**
- ✅ 記憶體使用：**降低 65%**（因為未載入的圖片不佔記憶體）

**技術指標：**

- IntersectionObserver 效能：遠勝於傳統 scroll 事件（CPU 使用降低 80%）
- 併發控制效果：避免瀏覽器請求阻塞
- 版本控制命中率：99.5%（極少出現錯誤圖片）

### 面試重點

**常見延伸問題：**

1. **Q: 為什麼不直接用 `loading="lazy"` 屬性？**  
   A: 原生 `loading="lazy"` 有幾個限制：

   - ❌ 無法控制預載距離（瀏覽器決定）
   - ❌ 無法控制併發數量
   - ❌ 無法處理版本控制（快速切換問題）
   - ❌ 舊版瀏覽器不支援

   自定義指令提供更精細的控制，適合我們的複雜場景。

2. **Q: IntersectionObserver 相比 scroll 事件好在哪？**  
   A:

   ```javascript
   // ❌ 傳統 scroll 事件
   window.addEventListener('scroll', () => {
     // 每次滾動都觸發（60次/秒）
     // 需要計算元素位置（getBoundingClientRect）
     // 可能導致強制 reflow（效能殺手）
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // 只在元素進出視窗時觸發
   // 瀏覽器原生優化，不阻塞主線程
   // 效能提升 80%
   ```

3. **Q: 併發控制的 6 張限制是怎麼來的？**  
   A: 這是基於瀏覽器的 **HTTP/1.1 同源併發限制**：

   - Chrome/Firefox：每個域名最多 6 個併發連接
   - 超過限制的請求會排隊等待
   - HTTP/2 可以更多，但考慮相容性還是控制在 6
   - 實際測試：6 張併發是效能與體驗的最佳平衡點

4. **Q: 版本控制為什麼用時間戳而不是 UUID？**  
   A:

   - 時間戳：`Date.now()`（簡單、夠用、可排序）
   - UUID：`crypto.randomUUID()`（更嚴謹，但過度設計）
   - 我們的場景：時間戳已經足夠唯一（毫秒級別）
   - 效能考量：時間戳生成更快

5. **Q: 如何處理圖片載入失敗？**  
   A: 實作了多層 fallback：

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. 重試 3 次
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. 顯示預設圖片
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q: 會不會遇到 CLS（累積版面位移）問題？**  
   A: 有三個策略避免：

   ```html
   <!-- 1. 預設佔位 SVG -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio 固定比例 -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   最終 CLS 分數：< 0.1（優秀）

---

## 3. JavaScript 運算效能優化

### 問題背景

在平台專案中，使用者會頻繁進行以下操作：

- 🔍 **搜尋**（輸入關鍵字即時過濾 3000+ 款產品）
- 📜 **滾動列表**（滾動時追蹤位置、載入更多）
- 🎮 **切換分類**（篩選顯示特定類型的產品）
- 🎨 **動畫效果**（平滑滾動、禮物特效）

這些操作如果沒有優化，會導致頁面卡頓、CPU 佔用過高。

---

### 策略 1：防抖（Debounce） - 搜尋輸入優化

```javascript
import { useDebounceFn } from '@vueuse/core';

// 防抖函式：500ms 內如果再次輸入，重新計時
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // 只在停止輸入 500ms 後執行
  }
);
```

```md
優化前：輸入 "slot game" (9 字元)

- 觸發 9 次搜尋
- 過濾 3000 款遊戲 × 9 次 = 27,000 次運算
- 耗時：約 1.8 秒（頁面卡頓）

優化後：輸入 "slot game"

- 觸發 1 次搜尋（停止輸入後）
- 過濾 3000 款遊戲 × 1 次 = 3,000 次運算
- 耗時：約 0.2 秒
- 效能提升：90%
```

### 策略 2：節流（Throttle）— 滾動事件優化

> 應用場景： 滾動位置追蹤、無限滾動載入

```javascript
import { throttle } from 'lodash';

// 節流函式：100ms 內只執行 1 次
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
優化前：

- 滾動事件每秒觸發 60 次（60 FPS）
- 每次觸發都計算滾動位置
- 耗時：約 600ms（頁面卡頓）

優化後：

- 滾動事件每秒最多觸發 1 次（100ms 內只執行 1 次）
- 耗時：約 100ms
- 效能提升：90%
```

### 時間切片（Time Slicing）— 大量資料處理

> 應用場景：標籤雲、選單組合、3000+ 款遊戲篩選、金流歷史紀錄渲染

```javascript
// 自定義時間切片函式
function processInBatches(
  array: GameList, // 3000 款遊戲
  batchSize: number, // 每批處理 200 款
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // 處理完成

    const batch = array.slice(index, index + batchSize); // 切片
    callback(batch); // 處理這一批
    index += batchSize;

    setTimeout(processNextBatch, 0); // 下一批放到微任務佇列
  }

  processNextBatch();
}
```

使用範例：

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // 將 3000 款遊戲分成 15 批，每批 200 款
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

### 策略 4：requestAnimationFrame — 動畫優化

> 應用場景： 平滑滾動、Canvas 動畫、禮物特效

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // 使用緩動函式（Easing Function）
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // 遞迴呼叫
    }
  };

  requestAnimationFrame(animateScroll);
};
```

為什麼用 requestAnimationFrame？

```javascript
// 錯誤做法：使用 setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // 想要 60fps (1000ms / 60 ≈ 16ms)
// 問題：
// 1. 不會跟瀏覽器重繪同步（可能在重繪之間執行多次）
// 2. 在背景頁籤也會執行（浪費資源）
// 3. 可能導致掉幀（Jank）

// 正確做法：使用 requestAnimationFrame
requestAnimationFrame(animateScroll);
// 優勢：
// 1. 與瀏覽器重繪同步（60fps 或 120fps）
// 2. 頁籤不可見時自動暫停（省電）
// 3. 更流暢，不會掉幀
```

---

## 📊 效能優化總結

### 優化前後對比表

| 指標                | 優化前  | 優化後     | 改善幅度 |
| ------------------- | ------- | ---------- | -------- |
| **首次載入**        | 12.5 MB | 850 KB     | ↓ 93%    |
| **首屏時間**        | 8-12 秒 | 1.5-2.5 秒 | ↑ 70%    |
| **圖片流量**        | 60 MB   | 2 MB       | ↓ 97%    |
| **滾動 FPS**        | 20-30   | 55-60      | ↑ 100%   |
| **搜尋響應**        | 1.8 秒  | 0.2 秒     | ↑ 90%    |
| **Lighthouse 分數** | 45      | 92         | ↑ 104%   |
| **跳出率**          | 42%     | 28%        | ↓ 33%    |

### 優化方法論總結

```
效能優化四層架構

1. 構建層級（Build Time）
   ├─ Vite 配置優化
   ├─ Code Splitting（路由懶加載）
   ├─ Tree Shaking
   └─ Chunk 分割策略

2. 網路層級（Network）
   ├─ 資源懶加載（Lazy Loading）
   ├─ 預載（Prefetch / Preload）
   ├─ 圖片優化（格式、壓縮、CDN）
   └─ HTTP/2 多路複用

3. 運算層級（Runtime）
   ├─ 防抖（Debounce）
   ├─ 節流（Throttle）
   ├─ 時間切片（Time Slicing）
   └─ Web Worker（多執行緒）

4. 渲染層級（Rendering）
   ├─ 虛擬滾動（Virtual Scroll）
   ├─ CSS 優化（GPU 加速）
   ├─ RAF（requestAnimationFrame）
   └─ 避免強制 Reflow
```

---

## 面試技巧與常見問題

### 1. STAR 結構敘述（2-3 分鐘）

> **Situation（背景）：**  
> "專案有 27 個多租戶版型，首次載入需要 12.5MB 的 JavaScript，導致首屏時間超過 10 秒，跳出率高達 42%。"
>
> **Task（任務）：**  
> "目標是將首次載入降至 1MB 以下，首屏時間縮短至 3 秒內，降低跳出率。"
>
> **Action（行動）：**  
> "實施了三大優化策略：
>
> 1. 路由三層懶加載 — 只載入當前品牌和頁面
> 2. 圖片四層優化 — IntersectionObserver + 併發控制
> 3. JavaScript 效能優化 — 防抖、節流、時間切片"
>
> **Result（結果）：**  
> "最終 JavaScript 體積減少 93%，首屏時間縮短 70%，Lighthouse 分數從 45 提升至 92，跳出率降低 33%。"

### **數據驅動**

- 不只說「優化了效能」，要說「減少了 93%」
- 提供 Before/After 對比數據
- 展示 Lighthouse、Coverage 等工具截圖

### **Trade-off 思維**

```markdown
"防抖節流會有短暫延遲，但換來流暢體驗"
"圖片懶加載增加了程式碼複雜度，但流量節省 97%"
"虛擬滾動實作成本高，但記憶體使用降低 80%"
```

### **持續優化意識**

```markdown
"我們建立了效能監控系統（RUM）"
"定期使用 Lighthouse CI 自動化檢測"
"設定效能預算（Performance Budget）"
```

### 如何發現效能瓶頸？

```markdown
使用以下工具組合：

1. Chrome DevTools Performance → 找 Long Task
2. Coverage → 找未使用的程式碼
3. Network Waterfall → 找阻塞請求
4. Lighthouse → 整體評分與建議
5. Bundle Analyzer → 視覺化分析 chunk 大小
```

### 如何說服投資方投入時間優化效能？

```markdown
準備三個維度的數據：

1. 技術指標：Lighthouse 分數、載入時間
2. 用戶體驗：跳出率、停留時間
3. 商業價值：轉換率提升 25%、營收增加

用商業價值說服管理層，用技術指標說服工程師。
```

**Q: 效能優化的優先順序如何決定？**

```markdown
A: 我使用「影響範圍 × 優化效益 / 實作成本」公式：

高優先級：

- 路由懶加載（影響所有頁面、效益大、成本中）
- 圖片懶加載（影響首屏、效益大、成本中）

低優先級：

- 微優化（如 inline SVG）→ 效益小
- 過度優化（如手寫壓縮演算法）→ 成本高
```

**Q: 遇到最困難的效能問題是什麼？**

```markdown
A: 圖片快速切換的版本控制問題。

問題：用戶快速切換分類時，舊請求的圖片會覆蓋新請求
解決：為每次載入分配版本號（時間戳），只顯示最新版本
學到：非同步操作要注意競態問題（Race Condition）
```

**Q: 如果重做會怎麼改進？**

```
A: 我會考慮：
1. 使用 Service Worker 做更積極的快取
2. 嘗試 WebP / AVIF 等現代圖片格式
3. 實作 Adaptive Loading（根據網速調整策略）
4. 使用 React Server Components（如果用 React）
```

---

## 📚 相關筆記

- [Web.dev - Performance](https://web.dev/performance/)
- [MDN - Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

**推薦工具：**

- Chrome DevTools Performance
- Webpack Bundle Analyzer / Vite Bundle Visualizer
- WebPageTest
- GTmetrix

**相關主題：**

- [虛擬滾動實作 →](./virtual-scroll.md)
- [Web Worker 應用 →](./web-worker.md)
- [Vite 配置優化 →](./vite-setting.md)
