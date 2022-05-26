---
id: es6-template-literals
title: '☕ Template literals'
slug: /es6-template-literals
---

## What is Template literals ?

將傳統字串的寫法改寫，更容易插入參數。

### 傳統寫法

需要透過 `+` 號還有空格來明確區分參數和字串：

```js
const playerData = (name, job) => {
  return '玩家名稱：' + name + '，職業：' + job;
};
console.log(playerData('Pitt', '戰士'));
```

### 字符串模板寫法

```js
// 將 '' 改為 ``，參數則透過 ${} 進行包裹
const playerData = (name, job) => {
  return `玩家名稱：${name}，職業：${job}`;
};
console.log(playerData('Pitt', '戰士'));
```

#### 同時字串模板也支援換行功能，當字串模板為換行時，顯示時也同時會換行

```js
const playerData = (name, job) => {
  return `
  玩家名稱：${name}
  ，職業：${job}
  `;
};
console.log(playerData('Pitt', '戰士'));
```

#### 也能用於加減乘除計算

```js
const favoritePhone = 'iPhone 20 Max Pro';
const currentPrice = 60000;
console.log(`${favoritePhone} is ${currentPrice * 0.7} now.`);
```

#### 或是直接塞入 HTML

```js
const group = `
  <div class="container">
    <label>
      <input type="checkbox"> Checked
    </label>
  </div>
`;
document.body.innerHTML = group;
```

## Question

### 1. What's the result of the following code block ?

```js
const player = {
  name: 'Juila',
};

const newPlayer = player;
newPlayer.name = 'Alanna';

console.log(`There are two players who are ${player.name} and newPlayer.name`);
```

#### Output

```js
There are two players who are Alanna and newPlayer.name
```

這邊需要注意 JS 傳值或是傳址的問題，將記憶體位址被覆寫的狀況考慮進去，同時另外注意變數在字符串模板的書寫格式。
