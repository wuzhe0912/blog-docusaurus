---
id: event-loop
title: 📄 Event Loop
slug: /event-loop
---

## Why is setInterval not accurate in terms of timing?

> 為什麼 `setInterval` 在時間上不精確？

1. 受限於 javascript 本身是單線程的程式語言(一次只能執行一個任務，其他任務必須在 Queue 中等待)，所以當 setInterval 的 callback 執行時間超過了設定的時間間隔時，就會導致下一次的 callback 執行時間延遲。舉例來說，如果 setInterval 設定為每隔一秒執行一次 function，但是 function 內有某個動作需要花費兩秒的時間，那麼下一次 setInterval 的執行時間就會延遲一秒。日積月累之下，就會導致 setInterval 的執行時間越來越不準確。

2. 瀏覽器或運行環境也會限制或影響，目前多數主流瀏覽器（如 Chrome、Firefox、Safari 等）中，最小間隔時間大致為 4 毫秒。所以即使我設定為每隔 1 毫秒執行一次，實際上也只會每隔 4 毫秒執行一次。

3. 系統在執行非常佔用記憶體或 CPU 的任務時，也會導致執行時間延遲。譬如，像是剪影片或是做圖像處理之類的動作時，很大概率會導致執行時間延遲。

4. 因為 javascript 本身也有 Garbage Collection 的機制，假設執行 setInterval 的 function 內建立了大量 object，如果執行完畢後就沒有被使用到，那這些物件就會被 GC 回收，這也會導致執行時間延遲。

### 替代方案

#### requestAnimationFrame

如果目前使用 `setInterval` 是以動畫實作為考量，那麼可以考慮使用 `requestAnimationFrame` 來取代。

- 同步於瀏覽器重繪：會在瀏覽器準備繪製新一幀的時候執行，這意味著它是與瀏覽器重繪（repaint）或重繪成一個新的畫面（frame）同步的。這比用 setInterval 或 setTimeout 來猜測什麼時候會發生重繪要精確得多。
- 效能：由於是與瀏覽器重繪同步的，因此它不會在瀏覽器認為不需要重繪的時候運行。這節省了計算資料，尤其是當該標籤頁不是當前焦點或者最小化時。
- 自動節流：能自動調整執行頻率以匹配不同的裝置和情況，通常是每秒 60 幀。這避免了過度使用 CPU 和 GPU 資源。
- 高精度的時間參數：允許接收一個高精度的時間參數(DOMHighResTimeStamp 類型，能精確到微秒)，這可以用來更精確地控制動畫或其他時間敏感的操作。

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素還沒有到達目的地，繼續動畫
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` 會在每一幀（通常是每秒 60 幀）更新元素的位置，直到達到 500 pixel。這種做法通常會比使用 `setInterval` 達到更平滑、更自然的動畫效果。
