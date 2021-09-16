---
id: 01-build-page
description: Build Page
slug: /build-page
---

# 01 - Build Page

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

打開本地的瀏覽器，執行 `http://localhost:5001/`，可以看到 index.html 的內容被渲染出來，同時打開 F12，也能查看到 client.js 的 console 內容，代表目前運行都是正常的。
