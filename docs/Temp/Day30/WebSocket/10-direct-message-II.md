---
id: 10-direct-message-II
description: Emit Direct Message to Server
slug: /direct-message-II
---

# 10 - Emit Direct Message II

繼承[前一章](https://pitt-docusaurus.netlify.app/docs/direct-message-I)的內容，現在需要將 server-side 接收到的訊息，除了轉回到 client-side，同時也要做頁面 render 的動作。

## Page & Style

先將 HTML 和 CSS 進行部分調整，並添加簡單樣式，方便待會直接套用在動態生成的內容上。

```html
  <body>
    <main class="wrapper">
      // ...
      <section class="chat-box display-none">
        <p class="username-text">
          登入的使用者：<span class="username-label"></span>
        </p>
      </section>
    </main>
  </body>
```

```css
.username-text {
  position: absolute;
  top: 20px;
  left: 40px;
  font-size: 36px;
}

.message-left {
  display: inline-block;
  background: white;
  border-radius: 8px 8px 8px 0px;
  border: 1px solid #d5deeb;
  color: black;
  margin: 5px;
  padding: 8px;
}

.message-right {
  float: right;
  background: linear-gradient(168.68deg, #0052c9 1.12%, #0a91db 100%);
  border-radius: 8px 8px 0px 8px;
  color: white;
  margin: 5px;
  padding: 8px;
}
```

## Server

當玩家 A 對玩家 B 發送私人訊息時，server-side 先檢查接收訊息的一方是否還在聊天頁面中，並建立一組 socket 發給中介層。

```javascript
// server.js
socket.on('direct-message', (data) => {
  const { receiverSocketId } = data;
  const hasConnectPeer = connectPeers.find(
    (peer) => peer.socketId === receiverSocketId
  );

  if (hasConnectPeer) {
    const authorData = {
      ...data,
      isAuthor: true,
    };
    socket.emit('direct-message', authorData);
    io.to(receiverSocketId).emit('direct-message', data);
  }
});
```

中介層監聽收到資料後，轉給 ui 的函式 `appendDirectChatMessage()` 使用。

```javascript
// handler.js
socket.on('direct-message', (data) => {
  ui.appendDirectChatMessage(data);
});
```

## Client

在 ui.js 使用資料前，仍要先準備好動態 render 的 HTML。除了傳入文字訊息內容，同時也檢查目前頁面 render 的部分，屬於訊息發送者還是接收者，再根據狀態決定樣式。

```javascript
// element.js
const getDirectChatMessage = (data) => {
  const { textContent, alighRight } = data;
  const messageContent = document.createElement('div');
  const messageClass = alighRight ? 'message-right' : 'message-left';
  messageContent.innerHTML = `
    <p class="${messageClass}">${textContent}
  `;
  return messageContent;
};
```

ui.js 接收到中介層的資料後進行解構，根據狀態決定抓取接收者或是發送者的 ID。

```javascript
// ui.js
const appendDirectChatMessage = (messageData) => {
  const { authorSocketId, author, messageContent, receiverSocketId, isAuthor } =
    messageData;
  const messageWrapper = isAuthor
    ? document.getElementById(`${receiverSocketId}-message`)
    : document.getElementById(`${authorSocketId}-message`);

  if (messageWrapper) {
    const data = {
      author,
      textContent: messageContent,
      alighRight: isAuthor ? true : false,
    };
    const message = element.getDirectChatMessage(data);
    messageWrapper.appendChild(message);
  }
};

export default {
  // ...
  appendDirectChatMessage,
};
```

![direct message II](https://i.imgur.com/eKXkRje.gif)
