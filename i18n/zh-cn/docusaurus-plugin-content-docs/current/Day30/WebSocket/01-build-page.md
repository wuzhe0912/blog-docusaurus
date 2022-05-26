---
id: 01-build-page
description: Build Page
slug: /build-page
---

# 01 - Build Page

> 建立靜態頁面，並將頁面和 terminal 之間建立連線。

## Public

> 首先創建靜態資料，結構如下：

```markdown
📦public
┣ 📂js
┃ ┗ 📜client.js
┗ 📜index.html
```

> 切到 root 下的 server.js 改寫部分內容，透過 use() 這個中介層來掛載剛剛建立的靜態資料。

```js
const express = require('express');
const http = require('http');

const PORT = 5000;

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

## Client

> 現在開始著手處理 client 端

先在 client.js 埋下 `console.log()`，並在 index.html 引入 client.js。

```js
// client.js
console.log('this is client');
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Websocket</title>
  </head>
  <body>
    <h3>This is Client Side.</h3>
    <script src="./js/client.js"></script>
  </body>
</html>
```

現在我需要運行測試一下是否正常。

```bash
yarn dev

open localhost:5000
```

打開本地的瀏覽器，執行 `http://localhost:5000/`，可以看到 index.html 的內容被渲染出來，同時打開 F12，也能查看到 client.js 的 console 內容，代表靜態資料已被成功掛載到本地的 server 上。

## Connection

> 現在我需要將 client 端和 server 端進行串接，這裡選擇使用 cdn 的方式在 client 端引入。

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

進到 client.js，寫入以下內容

```js
// listen client
const socket = io('/');

socket.on('connect', (server) => {
  console.log(server);
  console.log(`Client Successfully connected：${socket.id}`);
});
```

回到 server.js：

```js
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
