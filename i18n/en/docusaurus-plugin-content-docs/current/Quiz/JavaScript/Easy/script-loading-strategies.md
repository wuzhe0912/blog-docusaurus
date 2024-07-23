---
id: script-loading-strategies
title: 📄 Please explain the differences between <script>, <script async>, and <script defer>
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Overview

In HTML, we have three main ways to load JavaScript files:

1. `<script>`
2. `<script async>`
3. `<script defer>`

These three methods have different behaviors when loading and executing scripts.

## Detailed Comparison

### `<script>`

- **Behavior**: When the browser encounters this tag, it stops parsing HTML, downloads and executes the script, then continues parsing HTML.
- **When to use**: Suitable for scripts that are critical to page rendering.
- **Advantages**: Ensures scripts are executed in order.
- **Disadvantages**: May delay page rendering.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Behavior**：The browser downloads the script in the background while continuing to parse HTML. The script is executed immediately after download, which may interrupt HTML parsing.
- **When to use**：Suitable for independent scripts, such as analytics or advertising scripts.
- **Advantages**：Does not block HTML parsing, can improve page load speed.
- **Disadvantages**：Execution order is not guaranteed, may execute before the DOM is fully loaded.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Behavior**：The browser downloads the script in the background but waits until HTML parsing is complete before executing. Multiple deferred scripts are executed in the order they appear in the HTML.
- **When to use**：Suitable for scripts that need the complete DOM structure but are not immediately necessary.
- **Advantages**：Does not block HTML parsing, guarantees execution order, suitable for DOM-dependent scripts.
- **Disadvantages**：If the script is important, it may delay the page's interactive time.

```html
<script defer src="ui-enhancements.js"></script>
```

## Case Study

Imagine you're preparing for a date：

1. **`<script>`**：
   It's like stopping all your preparations to make a phone call to your partner to confirm date details. While it ensures communication, it might delay your preparation time.

2. **`<script async>`**：
   This is equivalent to using a Bluetooth headset to talk to your partner while preparing. Efficiency is improved, but you might wear the wrong clothes because you're too focused on the call.

3. **`<script defer>`**：
   This is like sending a message to your partner, telling them you'll call back after you're done preparing. This way, you can focus on preparing and communicate properly when everything is ready.
