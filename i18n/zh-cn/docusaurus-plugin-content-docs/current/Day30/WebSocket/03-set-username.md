---
id: 03-set-username
description: Set User Name
slug: /set-username
---

# 03 - Set User Name

> 在這一章中，主要處理下述兩個問題：

1. 初始進入頁面的建立

2. 存放使用者輸入的名稱

## Introduction Page

建立 HTML 結構

```html
<body>
  <main class="wrapper">
    <div class="enter-box">
      <input type="text" class="enter-input" placeholder="Create New Name" />
      <button type="button" class="enter-btn">Enter Chat</button>
    </div>
  </main>
</body>
```

設置基礎樣式

```css
.wrapper {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.enter-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 580px;
  height: 300px;
  background: linear-gradient(96.78deg, #7cb8f7 0%, #2a8bf2 100%);
  border-radius: 6px;
}

.enter-input {
  width: 200px;
  height: 30px;
  border-radius: 6px;
}

.enter-btn {
  width: 120px;
  height: 30px;
  background: linear-gradient(92.68deg, #7cb8f7 0%, #2a8bf2 100%);
  border-radius: 6px;
  color: #fff;
  margin-top: 12px;
  cursor: pointer;
}
```

現在頁面上已經有了靜態的 input 和 button，先針對 input 做處理。

## Set Name

切換到 client.js，先抓取 input 的 class

```js
const nameInput = document.querySelector('.enter-input');
```

因為可以預期這個輸入框的動作，是讓使用者輸入名稱，所以需要監聽輸入的動作

```js
nameInput.addEventListener('keyup', (e) => {
  console.log(e.target.value);
});
```

運行 terminal 後，測試輸入結果

![keyup text](https://i.imgur.com/gJIUP8H.png)

可以正常監聽輸入的文字沒問題。

### Store.js

再來，建立一個 store.js 用來管理未來存取使用者名稱的狀態

![store](https://i.imgur.com/aqoJkaU.png)

切到 store.js 輸入以下內容

```js
let username = null;

const getUserName = () => {
  return username;
};

const setUserName = (value) => {
  username = value;
};

export default {
  getUserName,
  setUserName,
};
```

回到 client.js 進行引入，不過在引入前需要注意，module 直接使用的話，瀏覽器編譯上會解析失敗，所以需要替 index.html 引入 js 的地方加入 `type="module"`：

```html
<script type="module" src="./js/client.js"></script>
```

```js
// client.js
import store from './store.js';

// ...

nameInput.addEventListener('keyup', (e) => {
  store.setUserName(e.target.value);
});
```

```js
// store.js

const setUserName = (value) => {
  // ...
  console.log(username);
};
```

現在運行測試看看，可以發現輸入的文字，已經被改存在 store.js 中。

![store username](https://i.imgur.com/gaYtij5.png)
