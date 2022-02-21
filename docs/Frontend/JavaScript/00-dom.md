---
id: 00-js-dom
title: '📜 DOM'
slug: /js-dom
---

> 關聯 : [TikTok Questions](../Interview/Jobs/00-tiktok.md)

## 什麼是 DOM ?

`DOM` 的全名是 `Document Object Model`，可以理解為一個介面接口，瀏覽器透過這個接口來讀取 `HTML` 文件，並依此生成樹狀結構，所以又通常稱為 `DOM Tree`。

而開發者則能透過 `JavaScript` 這個語言來進行操作，決定要移動或增加刪除其中的元素，進而達到改變 `HTML` 文件的目的。

### DOM Tree

在整個樹狀結構中，最重要的就是各個節點(node)，可以分成四種重要的元素 :

- Document : 即指整份文件，也就是整個`HTML`檔案的開端，因此可以看到操作 `api` 時，起手都是 `document.xxx`。
- Element : 泛指所有標籤，例如 `h1`, `div`, `p` 等等。
- Text : 指標籤中包含的內容，譬如 `<h1>Hello!</h1>` 中，`Hello` 這段文字就是指內容。
- Attribute : 指標籤本身特定的屬性，又或者是添加 `class` 也屬於這一範疇。

## DOM 操作

操作的 `api` 有很多種，這邊僅列出幾個常見的，其他的則是當需要時，才做查詢應用。

### getElementById

抓取對應 `id` 名稱的元素，而通常 `id` 應為唯一值，所以這會是一個有效獲取元素的方法 :

```javascript
const myApp = document.getElementById('app');
```

### getElementsByClassName

雖然是抓取 `class name`，但會回傳一個陣列，陣列中會包含所有相同 `class name` 的元素。

```javascript
const container = document.getElementsByClassName('container');
```

### getElementsByTagName

承上，同樣是回傳陣列，但差別在於，他抓取指定名稱的標籤。

```javascript
const buttons = document.getElementsByTagName('button');
```

### document.querySelector

字如其名，查詢選擇器的名稱，因此寫法上就如同 `CSS` :

```javascript
const btns = document.querySelector('.btn');
```

### document.querySelectorAll

查找所有相同選擇器名稱的元素，並回傳到同一陣列中 :

```javascript
const btn = document.querySelectorAll('.btn');
```

## Reference

- [What’s the Document Object Model, and why you should know how to use it.](https://www.freecodecamp.org/news/whats-the-document-object-model-and-why-you-should-know-how-to-use-it-1a2d0bc5429d/)
