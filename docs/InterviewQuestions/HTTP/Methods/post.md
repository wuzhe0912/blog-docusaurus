---
id: http-methods-post
title: 📄 POST
slug: /http-methods-post
---

## 1. What does the PUT method do in HTTP?

> `PUT` 方法的用途是什麼？

主要是兩個用途：

1. 更新一個已經存在的資料(例如，修改使用者訊息)
2. 如果資料不存在，則新增一個資料

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // 執行 PUT 請求
    console.log('User updated:', response.data); // 輸出更新後的用戶信息
  } catch (error) {
    console.log('Error updating user:', error); // 輸出錯誤信息
  }
}

updateUser(1, 'Pitt Wu');
```
