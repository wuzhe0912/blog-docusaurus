---
id: 06-forward-message-to-server
description: Send Message To Server
slug: /forward-message-to-server
---

# 06 - Forward Message To Server

[前一章](https://pitt-docusaurus.netlify.app/docs/set-chat-page-II)印出使用者名稱和訊息內容後，接下來要嘗試將其透過 socket.io 轉發給 server。

## 修正使用體驗

在動工前，先調整一下原先 client 端的寫法，之前的作法，只監聽點擊按鈕判斷是否跳轉到 chat。但在使用上，可能會有當輸入名稱後，直接按下鍵盤上的 Enter，所以為了改善使用體驗，按下 Enter 這個動作也需要考量進去。

```js
// client.js
nameInput.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'Enter') {
    validationInput(store.getUserName());
  }
});

chatBtn.addEventListener('click', () => {
  validationInput(store.getUserName());
});

const validationInput = (username) => {
  if (username) {
    ui.goToChat();
    socketHandler.connectSocketIoServer();
  }
};
```

> 修正 element.js 中的 function 名稱，`getChatMessage() -> getChatMessageContent()`

## Build Middleware

> 這邊我將其理解為，利用 socket 建立一個中介層，將收到的 client 端訊息，轉發給 server 端。

先將原本寫在 client.js 的監聽移除

```js
// client.js remove
const socket = io('/');

socket.on('connect', () => {
  console.log(`Client：${socket.id}`);
});
```

重新拉出來在 js 資料夾底下建立一個 folder，命名為 socket，並在底下新增一個 `handler.js`。

```bash
cd js

mkdir socket

cd socket

touch handler.js
```

![handler.js](https://i.imgur.com/4h4875B.png)

將剛剛在 client.js 移除的監聽，重新改寫在此處，保持監聽連線狀況，同時建立一個 `sendGroupChatMessage()` 用來接收 client 端的資訊，並透過 `emit()` 轉發給 server 端。

```js
// handler.js
let socket = null;

const connectSocketIoServer = () => {
  socket = io('/');

  socket.on('connect', () => {
    console.log(`Successfully Connect：${socket.id}`);
  });
};

const sendGroupChatMessage = (author, messageText) => {
  const messageData = {
    author,
    messageText,
  };

  socket.emit('group-chat-message', messageData);
};

export default {
  connectSocketIoServer,
  sendGroupChatMessage,
};
```

回到 ui.js，移除原本測試用的 `console.log`，導入剛剛寫的 handler.js，將使用者名稱和訊息內容發給 socket。

```js
// ui.js
messageInput.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 'Enter') {
    //...
    // send message to socket.io server
    socketHandler.sendGroupChatMessage(author, messageText);
  }
});
```

## Server Receive Message

> 從 handler.js，可以看到 socket 將發出的訊息命名為 `group-chat-message`，所以同理 server.js 這一端監聽的接收的方式也是相同命名。

```js
io.on('connection', (socket) => {
  // ...
  socket.on('group-chat-message', (data) => {
    console.log(data);
  });
});
```

現在回到頁面測試，使用者名稱我輸入 `Pitt`，並在對話框中輸入 `Hello Websocket!`。檢查 terminal，能正常接收到訊息。

![server receive](https://i.imgur.com/vsqD0hi.png)
