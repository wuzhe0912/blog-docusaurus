---
id: http-methods
title: 📄 HTTP Methods
slug: /http-methods
---

## 1. What is the RESTful API ?

撰寫 RESTful API 採用一套標準化的設計風格，便於網路上不同系統之間的進行通訊，為了遵循 REST 原則，API 應該要是可預測且容易理解。而身為前端開發者，較為側重關注以下三點：

- **URL 路徑(url path)**：確認 client 端請求的範圍，例如：
  - `/products` : 可能返回產品列表
  - `/products/abc`：提供產品 ID 為 abc 的產品細節
- **HTTP 方法**：定義具體的執行方式：
  - `GET`：用於取得資料
  - `POST`：用於創建新資料
  - `PUT`： 用於更新現有資料
  - `DELETE`：用於刪除資料
- **狀態碼(status code)**：提供了關於請求是否成功，以及如果不成功，問題可能出在哪裡的快速指示。常見狀態碼包括：
  - `200`：成功
  - `404`：找不到請求的資源
  - `500`：伺服器錯誤

## 2. If GET can also carry data in a request, why should we use POST?

> 既然 `GET` 也能傳送包含資料的請求，為什麼我們還需要使用 `POST` 呢？

主要基於這四點考量：

1. 安全性：因為 `GET` 的資料是附加在 URL 上面，自然也就容易曝露敏感資料，而 `POST` 則是將資料放在請求的 `body` 中，相對更為安全。
2. 資料大小限制：使用 `GET` 由於瀏覽器和服務器對 URL 長度有限制(雖然每個瀏覽器略有不同，但大體落在 2048 bytes 上下浮動)，因此資料量會受到限制。`POST` 雖然名義上沒有限制，但實務上為了避免被惡意攻擊灌入大量資料，通常還是會透過一些中間件的設置來限制資料大小。譬如 `express` 的 `body-parser`。
3. 語意清晰：確保開發者能夠清楚的知道這個請求的目的，`GET` 通常用於獲取資料，而 `POST` 則更適合用於新增或更新資料。
4. 不可變性(Immutability)：在 HTTP 協議中，`GET` 方法被設計為"安全的"，不管發出幾次請求，都不必擔心這會對 server 上的資料造成變動。

## 3. What does the PUT method do in HTTP?

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
