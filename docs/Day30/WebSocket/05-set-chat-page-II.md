---
id: 05-set-chat-page-II
description: Set Chat Page II
slug: /set-chat-page-II
---

# 05 - Set Chat Page II

> 在本章中，要達成兩個目標：

1. 使用 JS 來動態 render HTML 頁面，產生一個小的對話框

2. 當使用者輸入名稱進入 chat 後，當他在對話框輸入訊息時， console.log 印出訊息發出者是誰?輸入什麼內容?

## HTML & CSS

結構相較[上一章](https://pitt-docusaurus.netlify.app/docs/set-chat-page-I)，調整一個標籤的 class，將 `chat-container -> chat-list`

```html
  <body>
    <main class="wrapper">
      // ...
      <section class="chat-box display-none">
        // ...
        <div class="chat-list"></div>
      </section>
    </main>
  </body>
```

預先準備好一些簡單的樣式

```css
.chat-list {
  height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  bottom: 1px;
  right: 5px;
}

.chat-container {
  margin: 0 10px;
  width: 300px;
  height: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #e5e5e5;
  background: #f2f8fd;
}

.chat-title-wrapper {
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(168.68deg, #0052c9 1.12%, #0a91db 100%);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.chat-title {
  width: 100%;
  margin: 0;
  padding: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  text-align: center;
  font-size: 18px;
  color: #fff;
}

.message-container {
  width: 100%;
  height: 70%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.message-input-wrapper {
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.message-input {
  width: 100%;
  height: 40px;
  border: 1px solid #d5deeb;
  background-color: #fff;
  font-size: 16px;
}

.message-content {
  width: 100%;
}

.message-paragraph {
  font-size: 16px;
  margin-left: 5px;
  margin-top: 5px;
  margin-right: 5px;
}

.message-author {
  font-weight: bold;
}
```

## 修正進入頁驗證

原先的 client.js 在驗證進入時，寫法存在瑕疵，會出現輸入使用者名稱時不斷觸發的問題，所以調整成當點擊進入時，才進行驗證和跳轉。

```js
// client.js
nameInput.addEventListener('keyup', (e) => {
  store.setUserName(e.target.value);
});

chatBtn.addEventListener('click', () => {
  const checkName = store.getUserName();
  // validation can't be empty
  if (checkName) {
    ui.goToChat();
  }
});
```

## Render HTML

```bash
touch element.js
```

![element.js](https://i.imgur.com/0PTJ8Bd.png)

在原先的 `.chat-list` 標籤底下，動態 render，同時預計傳入數個參數，用於抓取動態生成的標籤。

```js
const getChatList = (data) => {
  const { chatTitle, messageContainerID, messageInputID, chatContainerID } =
    data;

  const chatContainer = document.createElement('div');
  chatContainer.classList.add('chat-container');
  chatContainer.setAttribute('id', chatContainerID);

  // render
  chatContainer.innerHTML = `
    <div class="chat-title-wrapper">
      <p class="chat-title">${chatTitle}</p>
    </div>
    <div class="message-container" id="${messageContainerID}">
      <div class="message-content">
        <p class="message-paragraph">
          <span class="message-author">Pitt：</span>Hello Websocket
        </p>
      </div>
    </div>
    <div class="message-input-wrapper">
      <input
        type="text"
        class="message-input"
        id="${messageInputID}"
        placeholder="Type Something"
      />
    </div>
  `;

  return chatContainer;
};

export default {
  getChatList,
};
```

## Get User Name & Message

建立 data 的預設值

```js
// ui.js
const messageContainerID = 'message-container-id';
const messageInputID = 'message-input-id';
const chatContainerID = 'chatContainerID';

const createChatList = () => {
  // default value
  const data = {
    chatTitle: 'Group Name',
    messageContainerID,
    messageInputID,
    chatContainerID,
  };
};
```

導入剛剛的用來 render 的 elemednt.js，抓取最外層的 `.chat-list`，透過 `appendChild()` 來添加子元素。

```js
import element from './element.js';

const createChatList = () => {
  // ...
  const chatContainer = element.getChatList(data);
  const chatListElement = document.querySelector('.chat-list');
  chatListElement.appendChild(chatContainer);
};
```

抓取輸入框的 DOM，監聽使用者觸發的事件，當輸入完成按下 Enter 按鈕時，除了抓取使用者名稱，同時也印出輸入內容。

```js
const createChatList = () => {
  // ...
  const messageInput = document.getElementById(messageInputID);
  messageInput.addEventListener('keydown', (event) => {
    const key = event.key;

    if (key === 'Enter') {
      const author = store.getUserName();
      const messageContent = event.target.value;

      messageInput.value = '';
      console.log({
        author,
        messageContent,
      });
    }
  });
};
```
