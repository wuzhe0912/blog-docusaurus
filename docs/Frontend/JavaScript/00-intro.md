---
id: javascript-intro
description: JS Note
slug: /javascript-intro
---

# JavaScript

## What is DOM?

我們所撰寫的 `HTML` 文件，瀏覽器會解析成樹狀結構，父層包覆子層形成一個 `document` 文件，每一個元素都可以理解為物件，`DOM` 操作就是透過 `JS` 去操作這些物件去執行行為。同時為了避免操作過程中，污染相同屬性的元素，譬如兩個 `p` 標籤，所以我們會透過 `id` 或 `class` 來指定操作，如下：

```javascript
document.getElementById(id)
document.querySelector(.className)
```

## Why place JavaScript at the bottom of HTML body?

瀏覽器在解析 `HTML` 文件時，如果遇到 `script` 標籤，會先將 `JS` 檔案執行完畢才繼續執行解析 `HTML`。如果 `JS` 內容龐大，那對頁面來說載入時間就相對拉長，這是很不利於使用體驗的，更糟的是，如果 `JS` 執行過程中出錯，有很大機率會卡住呈現空白頁面。基於瀏覽者的使用體驗，我們必須確保最低使用體驗，優先讓靜態 `HTML` 結構搭建完成，再執行動態的 `JS`。

- Reference：[All about script](https://levelup.gitconnected.com/all-about-script-87fea475b976)
