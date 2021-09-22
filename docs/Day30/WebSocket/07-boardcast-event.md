---
id: 07-boardcast-event
description: Boardcast Event
slug: /boardcast-event
---

# 07 - Boardcast Event

> 當某個使用者輸入訊息發送到 server 後，若當前環境為留言板或公共頻道，server 端則必須推播訊息給該名使用者以外的所有人。雖然聽起來好像不好處理，但其實只要利用 socket 建立連線後永久傳輸的特性，server 端透過 `broadcast.emit()` 向 client 推播轉發，client 則保持用 `on()` 監聽變化。

```javascript
// server.js
io.on('connection', (socket) => {
  // ...
  socket.on('group-chat-message', (data) => {
    socket.broadcast.emit('group-chat-message', data);
  });
});
```

```javascript
// handler.js
const connectSocketIoServer = () => {
  socket = io('/');

  // ...

  socket.on('group-chat-message', (data) => {
    console.log(data)
  })
};
```

由於此前使用 `group-chat-message` 這一組 socket 傳送訊息給 server，所以自然就是監聽它。現在可以打開兩個 browser 來測試看看是否可行。

![boardcast](https://i.imgur.com/Ufqd5ym.png)
