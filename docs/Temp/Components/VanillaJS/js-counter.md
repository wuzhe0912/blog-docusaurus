---
id: js-counter
title: '📁 Counter'
slug: /js-counter
---

## Prepare template and style

### HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Counter</title>
    <link rel="stylesheet" href="./style.css" />
    <script src="./script.js" defer></script>
  </head>
  <body>
    <div class="app">
      <h1>Counter</h1>
      <div class="counter-wrapper">
        <i class="cheveron cheveron-up"></i>
        <div class="cheveron-number">0</div>
        <i class="cheveron cheveron-down"></i>
      </div>
    </div>
  </body>
</html>
```

### CSS

```css
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.cheveron-number {
  font-size: 28px;
}

.cheveron {
  border: solid red;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 6px;
  cursor: pointer;
}

.cheveron-up {
  transform: rotate(-135deg);
}

.cheveron-down {
  transform: rotate(45deg);
}
```

## 操作 DOM 元素

### 抓取指定的元素建立變數

```javascript
// Variables
const addNumber = document.querySelector('.cheveron-up');
const reduceNumber = document.querySelector('.cheveron-down');
const numberDisplay = document.querySelector('.cheveron-number');
```

### 透過 event 事件測試是否成功抓取元素

```javascript
addNumber.addEventListener('click', (e) => {
  console.log('up', e);
});

reduceNumber.addEventListener('click', (e) => {
  console.log('down', e);
});
```

可以看到頁面上都有正常 print 結果，代表抓取元素正常。

### 過濾處理

受限於抓到的數字元素，本身是一個標籤，但需要改變的是標籤內容，所以使用 `textContent` 來獲取內容文字。

不過獲取出來的內容會是 `string`，所以我們必須透過 `Number()` 方法將其轉為 `number`，這樣才能進行加減計算。

```javascript
addNumber.addEventListener('click', () => {
  const currentNumber = Number(numberDisplay.textContent);
  numberDisplay.textContent = currentNumber + 1;
});

reduceNumber.addEventListener('click', () => {
  const currentNumber = Number(numberDisplay.textContent);
  if (currentNumber === 0) return;
  numberDisplay.textContent = currentNumber - 1;
});
```
