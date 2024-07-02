---
id: expressions-operators
title: 📄 Expressions and Operators
slug: /expressions-operators
---

## 1. What is the difference between `==` and `===` ?

兩者都是比較運算符號，`==` 是比較兩個值是否相等，`===` 是比較兩個值是否相等且型別也相等。因此後者也可以視為嚴格模式。

其中前者受限於 JavaScript 的設計，會自動轉換類型，導致出現很多不直覺的結果，例如：

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

這對開發者來說，是很大的心智負擔，因此普遍建議使用 `===` 來取代 `==`，避免預期外的錯誤。
