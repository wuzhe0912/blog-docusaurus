---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Overview

In HTML, there are three primary ways to load JavaScript files:

1. `<script>`
2. `<script async>`
3. `<script defer>`

These three methods behave differently during script loading and execution.

## Detailed Comparison

### `<script>`

- **Behavior**: When the browser encounters this tag, it pauses HTML parsing, downloads and executes the script, then continues parsing.
- **When to use**: For scripts that are critical to rendering.
- **Pros**: Ensures scripts execute in order.
- **Cons**: Can delay page rendering.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Behavior**: The browser downloads the script in the background while continuing to parse HTML. Once downloaded, the script executes immediately and may interrupt parsing.
- **When to use**: For independent scripts such as analytics or ads.
- **Pros**: Does not block HTML parsing and can improve loading speed.
- **Cons**: Execution order is not guaranteed and the script may run before the DOM is fully ready.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Behavior**: The browser downloads the script in the background but executes it only after HTML parsing completes. Multiple deferred scripts execute in document order.
- **When to use**: For scripts that need a complete DOM but are not needed immediately.
- **Pros**: Does not block HTML parsing, preserves order, and works well for DOM-dependent scripts.
- **Cons**: If the script is critical, it may delay interactivity.

```html
<script defer src="ui-enhancements.js"></script>
```

## Analogy

Imagine you are preparing for a date:

1. **`<script>`**：
   You stop everything and call your partner to confirm details. Communication is clear, but preparation is delayed.

2. **`<script async>`**：
   You prepare while talking through Bluetooth earbuds. It's efficient, but you might lose focus and make mistakes.

3. **`<script defer>`**：
   You send a message saying you'll call after getting ready. You can finish preparation first, then communicate properly.

## Current Usage

In modern frameworks, you usually do not configure `<script>` behavior manually.  
For example, Vite defaults to `type="module"`, which behaves similarly to `defer`.

```javascript
<script type="module" src="/src/main.js"></script>
```

Exceptions are third-party scripts, such as Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
