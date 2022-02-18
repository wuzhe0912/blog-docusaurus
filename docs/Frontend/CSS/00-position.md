---
id: 00-position
title: '📃 Position'
slug: /css-position
---

> 關聯 : [TikTok Questions](../Interview/Jobs/00-tiktok.md)

`static`, `relative`, `absolute`, `sticky`, `fixed` 這些是較為常用的語法。

## static

`element` 的預設值，會依據瀏覽器預設的配置，自動排列在網頁上，同時也不會受到其他屬性影像，譬如 `right`, `top` 等等。

## relative

當 `element` 添加這一語法時，若額外加入屬性，則會根據屬性的值移動位置，譬如加入 `top: 10px;`，則會從現有位置，從上往下移動 `10px`。

## absolute (絕對定位)

在沒有屬性的條件下，預設會排列在自己的父元素的左上角，如果這個元素外層找不到父元素，則會抓網頁的 root，即 `<body>` 標籤，自然也就會跑到網頁的左上角。

## fixed (固定定位)

依據瀏覽器來決定自己的位置，不管外層有沒有父元素，一但添加 `fixed` 屬性，都會產生脫離。

## sticky (黏性定位)

如同字義，類似貼在網頁上的便條或標籤，至少需要給予一項屬性，才能產生效果，譬如 `top: 0;`。當頁面滾動時，可以看到他會懸浮貼在該位置上。

## fixed vs sticky

1. 在瀏覽器兼容上，`fixed` 對舊版本的瀏覽器兼容性更好。
2. `sticky` 不會脫離父元素。
3. `sticky` 至少需要一個屬性才會生效，而 `fixed` 則不需要。
4. 同上 `sticky` 需要等網頁到達屬性設定的位置時，才會生效。

## Reference

- [CodePen](https://codepen.io/wuzhe0912/pen/vYWeJmz)
- [position](https://zh-tw.learnlayout.com/position.html)
