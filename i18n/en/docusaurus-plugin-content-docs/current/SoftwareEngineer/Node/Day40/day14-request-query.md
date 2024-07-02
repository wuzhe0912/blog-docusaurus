---
id: day14-request-query
title: '📜 Day-14 Request Query'
slug: /day14-request-query
---

## Requirements Specification

將以下 url 中的參數使用 req.query 取出，並回傳取出的參數

```js
http://localhost:3003/products?category=music&page=1
```

## Answer

`app.js`

```js
const express = require('express');
const app = express();
const PORT = 3003;

// ...

app.get('/products', function (req, res) {
  // 取出參數
  const category = req.query.category;
  const page = req.query.page;

  res.status(200).json({
    status: 'success',
    data: {
      category: category,
      page: page,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
```

當 Postman 發出 `GET` 請求 `http://localhost:3003/products?category=music&page=1`

```json
{
  "status": "success",
  "data": {
    "category": "music",
    "page": "1"
  }
}
```
