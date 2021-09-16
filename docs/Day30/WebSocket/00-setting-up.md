---
id: 00-setting-up
description: Setting up Environment
slug: /setting-up
---

# 00 - Setting up Environment

## Foreword

過往前後端溝通，需要仰賴 client 端發起請求，譬如 `GET or POST`，但這對 server 端來說，卻無法主動回傳。但當我使用 socket 後，只需要透過一次握手，前後端就能建立持久性的雙向連接，達到數據傳輸的目的，同時 server 端也能主動更新訊息給 client 端。

實作 socket 的作法，目前市場上主流應該是以下兩者：

1. `socket.io`
2. `websocket`

前者是 Node.js 最早實作 websocket 的伺服器，因此兼容性良好，如果有考慮冷門瀏覽器的話，會是首選。後者則是 HTML5 新增的特性，因此在使用上，無需引入套件，可以直接原生使用，但可能會無法兼容冷門瀏覽器。

## Require

需要準備 Node.js 環境，推薦使用 NVM 來安裝管理 Node 版本方便切換，可參考這篇文章 [NVM]

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
