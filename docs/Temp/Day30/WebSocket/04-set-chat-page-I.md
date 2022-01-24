---
id: 04-set-chat-page-I
description: Set Chat Page I
slug: /set-chat-page-I
---

# 04 - Set Chat Page I

> 在處理完輸入使用者名稱後，下一步，自然就是進入 Chat 的觸發事件。

## HTML

先處理結構

```html
  <body>
    <main class="wrapper">
      <section class="enter-box">
        <input type="text" class="enter-input" placeholder="Create New Name" />
        <button type="button" class="enter-btn">Enter Chat</button>
      </section>
      <section class="chat-box display-none">
        <span class="username-label"></span>
        <div class="chat-container"></div>
      </section>
    </main>
  </body>
```

這兩個 section 可以理解為兩個 component，前者用來顯示進入頁面，後者則是聊天頁面。另外，為了處理轉換頁面後的差異，添加簡單的 CSS 來隱藏或顯示內容。

```css
.display-none {
  display: none;
}

.display-flex {
  display: flex;
}
```

## Enter Button

當點擊進入聊天室的按鈕時，應該要觸發兩件事

1. 使用者已輸入名稱，且不得為空

2. 當前的進入頁切換成聊天頁

同樣使用[上一章](https://pitt-docusaurus.netlify.app/docs/set-username#set-name)寫的 `nameInput()` 來進一步監聽 click 事件。

```javascript
nameInput.addEventListener('keyup', (e) => {
  store.setUserName(e.target.value);

  // validation can't be empty
  if (e.target.value) {
    chatBtn.addEventListener('click', () => {
      console.log('log');
    });
  }
});
```

先確認使用者是否有輸入名稱，若有，才允許往下走。

## Go To Chat Page

接下來，透過操作 DOM 來替 section 之間增刪改變 class，達到轉換頁面的目的。

```bash
touch ui.js
```

![ui.js](https://i.imgur.com/1FFbpjy.png)

```javascript
// ui.js
const goToChat = () => {
  const enterPage = document.querySelector('.enter-box');
  const chatPage = document.querySelector('.chat-box');

  enterPage.classList.add('display-none');

  chatPage.classList.remove('display-none');
  chatPage.classList.add('display-flex');
};
```

除了切換頁面外，也需要將剛剛輸入的使用者名稱顯示出來，所以這時就要調用 `store.js` 中預存的 username，使用 `getUserName()`。再取得 username 之後，同樣是操作 DOM 來進行顯示，最後則是匯出，準備讓 client.js 使用。

```javascript
// ui.js
import store from './store.js';

const goToChat = () => {
  // ...
  const username = store.getUserName();
  updateUserName(username);
};

const updateUserName = (username) => {
  const usernameLabel = document.querySelector('.username-label');
  usernameLabel.innerHTML = username;
};

export default {
  goToChat,
};
```

回到 client.js，讓 click 事件觸發時，調用 `goToChat()`，進而達到我們的目的。

```javascript
import ui from './ui.js';

// ...

nameInput.addEventListener('keyup', (e) => {
  // ...
  if (e.target.value) {
    chatBtn.addEventListener('click', () => {
      ui.goToChat();
    });
  }
});
```
