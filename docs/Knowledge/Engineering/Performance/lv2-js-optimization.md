---
id: performance-lv2-js-optimization
title: '[Lv2] JavaScript 運算效能優化：防抖、節流、時間切片'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> 透過防抖、節流、時間切片和 requestAnimationFrame 等技術，優化 JavaScript 運算效能，提升使用者體驗。

---

## 問題背景

在平台專案中，使用者會頻繁進行以下操作：

- 🔍 **搜尋**（輸入關鍵字即時過濾 3000+ 款產品）
- 📜 **滾動列表**（滾動時追蹤位置、載入更多）
- 🎮 **切換分類**（篩選顯示特定類型的產品）
- 🎨 **動畫效果**（平滑滾動、禮物特效）

這些操作如果沒有優化，會導致頁面卡頓、CPU 佔用過高。

---

## 策略 1：防抖（Debounce） - 搜尋輸入優化

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

## 策略 2：節流（Throttle）— 滾動事件優化

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

## 策略 3：時間切片（Time Slicing）— 大量資料處理

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

## 策略 4：requestAnimationFrame — 動畫優化

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

## 面試重點

### 防抖 vs 節流

| 特性     | 防抖（Debounce）              | 節流（Throttle）              |
| -------- | ----------------------------- | ----------------------------- |
| 觸發時機 | 停止操作後等待一段時間        | 固定時間間隔內只執行一次      |
| 適用場景 | 搜尋輸入、視窗 resize         | 滾動事件、滑鼠移動            |
| 執行次數 | 可能不執行（如果持續觸發）    | 保證執行（固定頻率）          |
| 延遲     | 有延遲（等待停止）            | 立即執行，後續限制            |

### 時間切片 vs Web Worker

| 特性         | 時間切片（Time Slicing）      | Web Worker                    |
| ------------ | ----------------------------- | ----------------------------- |
| 執行環境     | 主執行緒                      | 背景執行緒                    |
| 適用場景     | 需要操作 DOM 的任務          | 純計算任務                    |
| 實作複雜度   | 較簡單                        | 較複雜（需要通訊）            |
| 效能提升     | 避免阻塞主執行緒              | 真正並行運算                  |

### 常見面試問題

**Q: 防抖和節流如何選擇？**

A: 根據使用場景：

- **防抖**：適合「等待使用者完成操作」的場景（如搜尋輸入）
- **節流**：適合「需要持續更新但不需要太頻繁」的場景（如滾動追蹤）

**Q: 時間切片和 Web Worker 如何選擇？**

A: 

- **時間切片**：需要操作 DOM、簡單的資料處理
- **Web Worker**：純計算、大量資料處理、不需要 DOM 操作

**Q: requestAnimationFrame 的優勢是什麼？**

A:

1. 與瀏覽器重繪同步（60fps）
2. 頁籤不可見時自動暫停（省電）
3. 避免掉幀（Jank）
4. 效能優於 setInterval/setTimeout

