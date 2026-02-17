---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## 概述

在 HTML 中，我们有三种主要的方式来加载 JavaScript 文件：

1. `<script>`
2. `<script async>`
3. `<script defer>`

这三种方式在加载和执行脚本时有不同的行为。

## 详细比较

### `<script>`

- **行为**：当浏览器遇到这种标签时，会停止解析 HTML，下载并执行脚本，然后再继续解析 HTML。
- **使用时机**：适用于对页面渲染至关重要的脚本。
- **优点**：确保脚本按顺序执行。
- **缺点**：可能会延迟页面的渲染。

```html
<script src="important.js"></script>
```

### `<script async>`

- **行为**：浏览器会在后台下载脚本，同时继续解析 HTML。脚本下载完成后立即执行，可能会中断 HTML 的解析。
- **使用时机**：适用于独立的脚本，如分析或广告脚本。
- **优点**：不会阻塞 HTML 解析，可以提高页面加载速度。
- **缺点**：执行顺序不保证，可能在 DOM 未完全加载时执行。

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **行为**：浏览器会在后台下载脚本，但会等到 HTML 解析完成后才执行。多个 defer 脚本会按照它们在 HTML 中的顺序执行。
- **使用时机**：适用于需要完整 DOM 结构，但不是立即需要的脚本。
- **优点**：不会阻塞 HTML 解析，保证执行顺序，适合依赖 DOM 的脚本。
- **缺点**：如果脚本很重要，可能会延迟页面的交互时间。

```html
<script defer src="ui-enhancements.js"></script>
```

## 案例

假设你正在准备一场约会：

1. **`<script>`**：
   就像你停下所有准备工作，专心打电话给另一半确认约会细节。虽然确保了沟通，但可能会延误你的准备时间。

2. **`<script async>`**：
   相当于你一边准备一边用蓝牙耳机与另一半通话。效率提高了，但可能会因为太专注通话而穿错衣服。

3. **`<script defer>`**：
   等同于你先发消息给另一半，告诉他们你会在准备完毕后回电。这样你可以专心准备，等一切就绪后再好好沟通。

## 目前使用概况

现代框架的开发体系下，通常不需要手动设定 `<script>`，例如 Vite 默认采用 module 即 defer 的行为。

```javascript
<script type="module" src="/src/main.js"></script>
```

除非是特例的第三方脚本，例如 Google Analytics 等。

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
