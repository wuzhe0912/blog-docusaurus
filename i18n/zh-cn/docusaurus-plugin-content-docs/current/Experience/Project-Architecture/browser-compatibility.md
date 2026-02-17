---
id: project-architecture-browser-compatibility
title: '浏览器兼容性处理'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> 处理跨浏览器兼容性问题，特别是 Safari 和移动端的特殊处理。

---

## 浏览器兼容

> 小型可视区域 (Small Viewport Units)：svh
> 大型可视区域 (Large Viewport Units)：lvh
> 动态可视区域 (Dynamic Viewport Units)：dvh

特定情境下，允许使用新的语法 dvh 来解决 Safari 设计不良的浮动 bar 问题。如果需要被迫兼容冷门或旧的浏览器，则转使用 JS 来侦测高度。

## 防止 iOS Safari 自动调整文字大小

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## 前缀词

通过手动 + 自动设定 Autoprefixer 来处理前缀词。
