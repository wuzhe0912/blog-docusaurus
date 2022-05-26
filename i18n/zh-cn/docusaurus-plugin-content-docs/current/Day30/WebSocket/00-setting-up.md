---
id: 00-setting-up
description: Setting up Environment
slug: /setting-up
---

# 00 - Setting up Environment

## Foreword

過往前後端溝通，需要仰賴 client 端發起請求，譬如 `GET or POST`，但這對 server 端來說，卻無法主動回傳。但當我使用 socket 後，只需要透過一次握手(採用 ws 協議，而非 http 協議)，前後端就能建立持久性的雙向連接(full-duplex)，達到數據傳輸的目的，同時 server 端也能主動更新訊息給 client 端。

實作 socket 的作法，目前市場上主流應該是以下兩者：

1. `socket.io`
2. `websocket`

前者是 Node.js 老牌實作 websocket 的伺服器，因此兼容性良好，如果有考慮冷門瀏覽器的話，會是首選。後者則是 HTML5 新增的特性，因此在使用上，有可能會無法兼容冷門瀏覽器。

## Require

- Node.js
- Visual Studio Code(任一編輯器)

第一項需要準備 Node.js 環境，推薦使用 NVM 來安裝管理 Node 版本方便切換，可參考這篇文章 [NVM](https://pitt-docusaurus.netlify.app/docs/nvm)，至於編輯器則看個人習慣即可。

## Build

> 建立基礎環境

```bash
mkdir chat

cd chat

# init project, use npm or yarn

yarn init
```

### plugin

安裝 express 來建立 server，同時使用老牌的 socket.io 來實作。

```bash
yarn add express socket.io
```

### touch file

開始著手建立 js 檔案來寫寫看

```bash
touch server.js

# package.json 的 main 改為 server.js
```

## Running Server

在 server.js 寫入以下內容來建立本地的 server

```js
const express = require('express');
const app = express();

const Port = 5000;

app.listen(Port, () => {
  console.log(`Server listening on ${Port}`);
});
```

切換到終端機，執行以下指令，確認 server 已經被建立，印出 console

```js
node server.js
```

![check server running](https://i.imgur.com/cZyCn3s.png)

但如果每次都需要執行 `node server.js` 頗麻煩，所以這邊安裝一個 plugin `nodemon`，讓它幫我 auto reload。

```bash
yarn add nodemon -D
```

同時我在 `package.json` 建立 scripts:

```json
"scripts": {
  "dev": "nodemon server.js"
},
```

此後，我只需要執行 `yarn dev`，就可以達到想要自動更新 server 的目的，現在測試看看是否可行。

```bash
# start server
yarn dev
```

接著回到 server.js，將 port 改為 5001，檢查終端機，確定正常同步更新，代表沒問題了。

![nodemon](https://i.imgur.com/aQ9lECR.png)
