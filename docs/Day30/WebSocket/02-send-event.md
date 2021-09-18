---
id: 02-send-event
description: Send Event
slug: /send-event
---

# 02 - Send Event

> 在上一章中，已將 client 端和 server 端進行連線，接下來我們需要開始，讓兩端互相發送訊息。

## Server Send Message

首先，我們在 server.js 使用之前建立的 `connection()` 撰寫要發出的訊息：

```javascript
// server.js
io.on('connection', (socket) => {
  // ...
  socket.emit('hello-client', 'This is Server send message.');
});
```

因為我命名的 event 為 `hello-client`，所以接收訊息的 client.js 也必須使用相同命名。

```javascript
// client.js
socket.on('hello-client', (server) => {
  console.log(`Client Receive：${server}`);
});
```

我在 server 端發送的 message 透過參數向 client 端傳，client 端接收後再印出來，現在啟動 terminal 運行 `yarn dev` 來看看頁面是否如預期結果。

![client receive](https://i.imgur.com/OHEWmZh.png)

從頁面的結果來看，訊息的發送和接收都沒問題，第一步完成。

## Client Send Message

但我們希望是兩端都能接收和發送，所以接下來我需要反向操作，由 client 端傳給 server 端。

```javascript
// client.js
socket.on('hello-client', (server) => {
  // ...
  socket.emit('hello-server', 'This is Client send message.');
});
```

```javascript
// server.js
io.on('connection', (socket) => {
  // ...
  socket.on('hello-server', (client) => {
    console.log(`Server Receive：${client}`);
  });
});
```

寫法上基本一致，透過 `emit()` 來送出訊息，再透過 `on()` 來監聽接收訊息。

同樣的，我們到 terminal 來檢查看看運行的結果：

![server receive](https://i.imgur.com/nuR1ejd.png)

終端機正常顯示我們在 client.js 輸入的訊息，代表 server 端可以正常接收，到此完成兩端的發送和接收訊息的事件。
