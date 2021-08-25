---
id: 0-arrow-function
description: 縮減傳統函式寫法，更為簡潔便利
slug: /arrow-function
---

# Arrow Function (箭頭函式)

> 縮減傳統函式寫法，更為簡潔便利。

## 新舊兩種寫法比較

傳統函式寫法：

```html
<!-- html -->
<div class="click1">click1</div>
```

```javascript
// js
document.querySelector(".click1").addEventListener("click", function () {
  console.log("click1");
});
```

箭頭函式寫法：

```html
<!-- html -->
<div class="click2">click2</div>
```

```javascript
// js
document.querySelector(".click2").addEventListener("click", () => {
  console.log("click2");
});
```

可以看到，將過往 `function()` 改為 `() =>`。

## this 指向

傳統函式中，`this` 會指向 `DOM` 元素本身：

```javascript
document.querySelector(".click1").addEventListener("click", function () {
  console.log(this); // 印出整個 a 標籤
});
```

但是箭頭函式中 `this` 指向會往上一層跑到全域環境，所以也可以理解為在 `arrow function` 中沒有 `this`：

```javascript
document.querySelector(".click2").addEventListener("click", () => {
  console.log(this); // 印出整個 window 物件
});
```

因此如果需要找到該 `DOM` 元素，需要透過傳值的方式：

```javascript
document.querySelector(".click2").addEventListener("click", (e) => {
  console.log(e.target); // // 印出 a 標籤
});
```

## 變數指定

函式若在前方有宣告變數的情況下，可以簡寫成 `arrow function`：

```javascript
// 但需要注意，若沒有聲明變數，則無法改寫為 arrow function
const plus = () => {
  console.log("test");
};
plus();
```

傳值的寫法：

```javascript
const plus = (val, subVal) => {
  return val + subVal;
};
console.log(plus(4, 14)); // 印出 18
```

若 `return` 僅一行的情況下，還可簡寫成：

```javascript
const plus = (val, subVal) => val + subVal;
console.log(plus(2, 8)); // 印出 10
```
