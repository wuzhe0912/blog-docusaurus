---
id: 01-build-page
description: Build Page
slug: /build-page
---

# 01 - Build Page

> 建立靜態頁面，並將頁面和 terminal 之間建立連線。

## public

> 首先創建靜態資料，結構如下：

```markdown
📦public
 ┣ 📂js
 ┃ ┗ 📜client.js
 ┗ 📜index.html
```

> 切到 server.js 改寫部分內容，透過 use() 這個中介層來掛載靜態資料。

```javascript
const express = require('express');
const http = require('http');

const PORT = 5001;

const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

// when user go to the website return index.html
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

const io = require('socket.io')(server);

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
```

同時在 client.js 先埋一個 `console.log()`，並在 index.html 引入 client.js。

現在我需要運行測試一下是否正常。

```bash
yarn dev

open localhost:5001
```

打開本地的瀏覽器，執行 `http://localhost:5001/`，可以看到 index.html 的內容被渲染出來，同時打開 F12，也能查看到 client.js 的 console 內容，代表靜態資料已被成功掛載到本地的 server 上。

## client & server

> 現在我們需要將 client 端和 server 端，兩邊進行串接，這邊選擇使用 cdn 的方式在 client 端引入。

[copy socket.io cdn script](https://socket.io/docs/v4/client-api/)

切到 index.html 並貼上 script

```html
  <body>
    <h3>This is Client Side.</h3>
    //...

    <script src="/socket.io/socket.io.js"></script>
    <script src="./js/client.js"></script>
  </body>
```

接著進到 client.js，寫入以下內容

```javascript
// listen client
const socket = io('/');

socket.on('connect', (server) => {
  console.log(server)
  console.log(`Client Successfully connected：${socket.id}`);
});
```

再回到 server.js：

```javascript
// listen & receive client connection
io.on('connection', (socket) => {
  console.log(`Server：${socket.id}`);
});
```

上面這些動作是透過 socket.io，將前後兩端進行連接，並透過 `on ()` 來監聽。

現在執行 `yarn dev`，打開 browser 輸入 `localhost:5000`，查看頁面的 console 和 terminal，可以發現兩端都拿到同一組 id，代表兩者間已經建立起連線。如下圖所示：

### terminal

![terminal socket](https://i.imgur.com/XNPY9ac.png)

### HTML

![html socket](https://i.imgur.com/PRzCJJp.png)

若我們在 HTML 頁面進行重整，也可以看到連線進行刷新，重取新的 id。
