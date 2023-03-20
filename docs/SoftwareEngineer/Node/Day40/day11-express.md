---
id: day11-express
title: '📜 Day-11 Express'
slug: /day11-express
---

## Requirements Specification

初始化一個 Express 專案，並在本地端啟動一個 Server，回傳一個 string 到首頁。

## Answer

### Init Project

```bash
mkdir init-express

cd init-express
```

### Install Express

```bash
yarn init -y

yarn add express

yarn add nodemon -D
```

### Create Server

```js
touch app.js
```

```js
const express = require('express');

const app = express();
const PORT = 3002;

app.get('/', (req, res) => {
  res.send('Hello Express');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Scripts

change `package.json`

```json
{
  "scripts": {
    "dev": "nodemon app.js"
  }
}
```

### Start Server

```bash
yarn dev
```
