---
id: 04-function-default
description: 透過設定 Default 值來精簡程式，並迴避一些基礎錯誤
slug: /function-default
---

# 04 - Function Default

> 透過設定 Default 值來精簡程式，並迴避一些基礎錯誤。

## 傳統的傳值

假設建立一組 `function` 將陣列中的每個元素轉為 `string`：

```javascript
const ArrayToString = (array) => {
  if(!array) array = []
  const mapString = array.map((item) => {
    return item.toString()
  })
  return mapString
}
console.log(ArrayToString([1, 2, 3]))
```

如果 `API` 送的資料為空陣列，則會造成執行 `map` 時跳 `error`，因此過往需要在函式，添加`if`來進行判斷。

## default 設定

透過設定 `default` 值，則可以省略 `if` 判斷式：

```javascript
const ArrayToString = (array = []) => {
  const mapString = array.map((item) => {
    return item.toString()
  })
  return mapString
}
console.log(ArrayToString())
```

如此則會回傳預設值，不至於報錯卡住無法執行。

## 簡寫寫法

```javascript
const ArrayToString = (array = []) => {
  const mapString = array.map((item) => item.toString())
  return mapString
}
console.log(ArrayToString([2, 4, 6]))
```
