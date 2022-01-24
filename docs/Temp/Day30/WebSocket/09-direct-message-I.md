---
id: 09-direct-message-I
description: Emit Direct Message to Server
slug: /direct-message-I
---

# 09 - Emit Direct Message I

當建立私人頻道後，下一步，便是將私人頻道的訊息發往 server-side，透過 server 轉給指定的使用者，所以同樣是三個基本步驟。

1. A 使用者發出訊息
2. handler.js 做為中介接收訊息，轉發給 server-side
3. server-side 監聽並接受訊息資料，準備回傳

## Emit Message

抓取輸入框的 DOM，監聽輸入訊息的動作，當送出時(即按下 Enter 事件)，記錄訊息的作者名，作者ID，訊息內容，接收方的ID。並且同樣轉給中介層。

```javascript
// ui.js
const newMessageInput = document.getElementById(messageInputID);
newMessageInput.addEventListener('keydown', (e) => {
  const key = e.key;

  if (key === 'Enter') {
    const author = store.getUserName();
    const messageContent = e.target.value;
    const receiverSocketId = peer.socketId;
    const authorSocketId = store.getSocketId();

    const data = {
      author,
      messageContent,
      receiverSocketId,
      authorSocketId,
    };

    socketHandler.sendDirectMessage(data);
    newMessageInput.value = '';
  }
});
```

## Handler

中介層透過同一組 `sendDirectMessage()` 拿到資料後，一樣透過 emit 發給 server-side。並且建立一組 socket(`direct-message`)。

```javascript
const sendDirectMessage = (data) => {
  socket.emit('direct-message', data);
};
```

## Server

server-side 很單純地透過 `on()` 達到監聽的目的，並輸出在 terminal 上。

```javascript
socket.on('direct-message', (data) => {
  console.log('direct-message', data);
});
```

![direct message to server](https://i.imgur.com/wRMUejn.gif)
