---
id: 01-IIFE
title: '📜 IIFE'
slug: /IIFE
---

## Intro

> IIFE 又稱立即執行函式，與一般函式的寫法有所差異，外層需多包裹一層 `()`，並且具有立即被執行的特性 :

```javascript
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```
