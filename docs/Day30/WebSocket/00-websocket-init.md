---
id: 00-websocket-init
description: Setting up Environment
slug: /websocket-init
---

# 00 - Setting up Environment

## Foreword

過往前後端溝通，需要仰賴 client 端發起請求，譬如 `GET or POST`，但這對 server 端來說，卻無法主動回傳。但當我使用 socket 後，只需要透過一次握手，前後端就能建立持久性的雙向連接，達到數據傳輸的目的，同時 server 端也能主動更新訊息給 client 端。

實作 socket 的作法，目前市場上主流應該是以下兩者：

1. `socket.io`
2. `websocket`

前者是 Node.js 最早實作 websocket 的伺服器，因此兼容性良好，如果有考慮冷門瀏覽器的話，會是首選。後者則是 HTML5 新增的特性，因此在使用上，無需引入套件，可以直接原生使用，但可能會無法兼容冷門瀏覽器。

## Build

> 建立基礎環境

```bash
mkdir chat

cd chat

touch server.js client.js index.html style.css

# init project

yarn init

yarn add mongodb socket.io
```

## Require

<!-- ## Step

實作 socket 之前，我需要先梳理一下可能有的步驟，預計拆成三個區塊。

- 前後端是如何進行連接?
  1. 建立 socket 的 server
  2. 前端連接 server

- 兩端能不能都主動傳輸數據?
  1. 前端主動發送訊息
  2. 後端主動發送訊息

- 如果其中一端突然斷掉了，該如何處理?
  1. 連結斷開後的處理

``` bash
📦demo
 ┣ 📜index.html
 ┗ 📜server.js
```

## Create Server

```javascript
// cd server.js
const ws = require('ws');
const server = new ws.Server({ port: 5500 }, () => {
  console.log('socket is connection');
});


// terminal
yarn dev
```

測試一下，terminal 可以正常運行印出 `socket is connection`。

### server.js 調整寫法

```javascript
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 5500;
const server = http.createServer(express);
const websocketServer = new WebSocket.Server({ server });

websocketServer.on('connection', function connection(client) {
  console.log(1, client);
  client.on('message', function incoming(data) {
    console.log(2, data);
    websocketServer.clients.forEach(function each(subClient) {
      console.log(3, subClient);
    });
  });
});

server.listen(port, function () {
  console.log(`listening on port: ${port}`);
});
```

## Create Client

```html
<!-- index.html -->
<h1>Real Time Messaging</h1>
<pre class="messages"></pre>
<input type="text" class="messageBox" placeholder="Type Something..." />
<button class="send-btn" title="Send">Send</button>

<!-- style.css -->
```

```javascript
// 使用 IIFE 包裹，主要是為了限制作用域範圍


``` -->
