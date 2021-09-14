---
id: 06-template-literals
description: 將傳統字串的寫法改寫，更容易插入參數
slug: /template-literals
---

# 06 - Template literals (字符串模板)

> 將傳統字串的寫法改寫，更容易插入參數。

## 傳統寫法

需要透過 `+` 號還有空格來明確區分參數和字串：

```javascript
const playerData = (name, job) => {
  return '玩家名稱：' + name + '，職業：' + job
}
console.log(playerData('Pitt', '戰士'))
```

## 字符串模板寫法

```javascript
// 將 '' 改為 ``，參數則透過 ${} 進行包裹
const playerData = (name, job) => {
  return `玩家名稱：${name}，職業：${job}`
}
console.log(playerData('Pitt', '戰士'))
```

同時字串模板也支援換行功能，當字串模板為換行時，顯示時也同時會換行：

```javascript
const playerData = (name, job) => {
  return `
  玩家名稱：${name}
  ，職業：${job}
  `
}
console.log(playerData('Pitt', '戰士'))
```

也可以應用在加減乘除計算

```javascript
const favoritePhone = 'iPhone 20 Max Pro';
const currentPrice = 60000;
console.log(`${favoritePhone} is ${currentPrice * 0.7} now.`);
```

透過換行的特性，應用在塞入 `HTML` 區塊

```javascript
const group = `
  <div class="container">
    <label>
      <input type="checkbox"> Checked
    </label>
  </div>
`
document.body.innerHTML = group;
```
