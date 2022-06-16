---
id: temp-01
title: '🏷️ Temp 01'
slug: /temp-01
---

目前還沒想好分類上如何擺放的題目，先統一存放在 other。

## HTML & CSS

### 1. What's the difference between .jpg, .png, and .webp files ?

#### jpg

採用有損壓縮的方式來儲存圖片，既然為了縮減圖片體積，自然就也就犧牲細節，因此圖片質量會隨之下滑。

#### png

使用無損壓縮，因此在保留最小細節的同時，相對檔案體積也就變大，但好處是可以擁有 jpg 缺少的特性，譬如圖片本身的透明度。

#### webp

2010 年 google 創建的新格式，同時支援無損和有損壓縮，且壓縮的體積和效率都優於前兩者，可以節省儲存空間。兼容性方面，雖然已支援多數瀏覽器，但舊版本則不支援。

#### 應用

考慮到 webp 可以大幅縮減圖片體積同時又能不失真，理論上來說，如果移動端的網頁遊戲，需要大量圖片時，採用這種方案，應該會是不錯的選擇。

### 2. 如何透過 html, css 將兩張圖片進行重疊 ?

- 使用 position 來定位，再結合 z-index 來決定要將哪一張圖片置於上方。
- 早期的備選方案，會使用 float 語法來進行浮動，接著可以透過負邊距的方式推擠。

### 3. 請敘述如何處理切版 ?

- 原生語法，採用 flex 為基底處理，會適當搭配 grid，預處理器的部分則使用 scss 來協助控管樣式變數。
- 框架，依據使用的 js 框架，尋找相應的配套 Library，但目前也會考慮採用市場主流的 TailwindCSS。

## Vue.js

### 1. Vue2 和 Vue3 生命週期對比

### 2. Vue 如何處理跨域問題 ?

### 3. 如何使用 JS 實作 Vue 框架

## Network

### CDN 是什麼 ? 對前端有什麼效能幫助 ?

### XSS 是什麼 ? 如何解決 ?

## Tools

### 能否使用 webpack ? 請敘述你的使用經驗

### 請敘述對 git 的理解，以及所知道的指令

#### 解釋為何要使用 git ? 使用上有那些優點 ?

#### 闡述一些使用情境

## 已分類至筆記

- [Vue2 的生命週期](./../JS-Frameworks/Lifecycle/vue-lifecycle.md)
- [Vue 組件之間的傳遞資料方式](./../JS-Frameworks/Props/vue-props.md)
- [watch 和 computed 的差異](./../JS-Frameworks/Vue/api.md#4-whats-the-difference-between-computed-and-watch-)
- [在 vuex 中, state, action, mutation 如何互動彼此關係 ?](./../JS-Frameworks/Store/vuex.md)
