---
id: project-architecture-browser-compatibility
title: '瀏覽器兼容性處理'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> 處理跨瀏覽器兼容性問題，特別是 Safari 和移動端的特殊處理。

---

## 瀏覽器兼容

> 小型可視區域 (Small Viewport Units)：svh
> 大型可視區域 (Large Viewport Units)：lvh
> 動態可視區域 (Dynamic Viewport Units)：dvh

特定情境下，允許使用新的語法 dvh 來解決 safari 設計不良的浮動 bar 問題。如果需要被迫兼容冷門或舊的瀏覽器，則轉使用 JS 來偵測高度。

## 防止 iOS Safari 自動調整文字大小

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## 前綴詞

透過手動 + 自動設定 Autoprefixer 來處理前綴詞。

