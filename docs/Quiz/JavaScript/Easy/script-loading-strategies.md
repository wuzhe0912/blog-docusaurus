---
id: script-loading-strategies
title: 📄 請說明 <script>, <script async>, <script defer> 三者區別
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## 概述

在 HTML 中，我們有三種主要的方式來載入 JavaScript 檔案：

1. `<script>`
2. `<script async>`
3. `<script defer>`

這三種方式在載入和執行腳本時有不同的行為。

## 詳細比較

### `<script>`

- **行為**：當瀏覽器遇到這種標籤時，會停止解析 HTML，下載並執行腳本，然後再繼續解析 HTML。
- **使用時機**：適用於對頁面渲染至關重要的腳本。
- **優點**：確保腳本按順序執行。
- **缺點**：可能會延遲頁面的渲染。

```html
<script src="important.js"></script>
```

### `<script async>`

- **行為**：瀏覽器會在背景下載腳本，同時繼續解析 HTML。腳本下載完成後立即執行，可能會中斷 HTML 的解析。
- **使用時機**：適用於獨立的腳本，如分析或廣告腳本。
- **優點**：不會阻塞 HTML 解析，可以提高頁面載入速度。
- **缺點**：執行順序不保證，可能在 DOM 未完全載入時執行。

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **行為**：瀏覽器會在背景下載腳本，但會等到 HTML 解析完成後才執行。多個 defer 腳本會按照它們在 HTML 中的順序執行。
- **使用時機**：適用於需要完整 DOM 結構，但不是立即需要的腳本。
- **優點**：不會阻塞 HTML 解析，保證執行順序，適合依賴 DOM 的腳本。
- **缺點**：如果腳本很重要，可能會延遲頁面的互動時間。

```html
<script defer src="ui-enhancements.js"></script>
```

## 案例

假設以你正在準備一場約會：

1. **`<script>`**：
   就像你停下所有準備工作，專心打電話給另一半確認約會細節。雖然確保了溝通，但可能會延誤你的準備時間。

2. **`<script async>`**：
   相當於你一邊準備一邊用藍牙耳機與另一半通話。效率提高了，但可能會因為太專注通話而穿錯衣服。

3. **`<script defer>`**：
   等同於你先發訊息給另一半，告訴他們你會在準備完畢後回電。這樣你可以專心準備，等一切就緒後再好好溝通。
