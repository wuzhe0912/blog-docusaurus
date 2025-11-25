---
id: performance-lv1-image-optimization
title: '[Lv1] 圖片載入優化：四層 Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 透過四層圖片懶加載策略，將首屏圖片流量從 60MB 降至 2MB，載入時間提升 85%。

---

## 問題背景 (Situation)

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

## 優化目標 (Task)

1. **只載入可視範圍內的圖片**
2. **預載即將進入視窗的圖片**（提前 50px 開始載入）
3. **控制併發數量**（避免同時載入過多圖片）
4. **防止快速切換導致的資源浪費**
5. **首屏圖片流量 < 3MB**

## 解決方案（Action）

### v-lazy-load.ts 實作

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

## 優化成效（Result）

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

## 面試重點

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

