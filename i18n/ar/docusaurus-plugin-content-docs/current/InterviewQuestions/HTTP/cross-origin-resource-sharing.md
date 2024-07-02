---
id: cross-origin-resource-sharing
title: 📄 CORS
slug: /cross-origin-resource-sharing
---

## 1. What is between JSONP and CORS ?

JSONP（JSON with Padding）和 CORS（跨來源資源共享）是兩種實現跨來源請求的技術，允許網頁從不同的域名（網站）請求資料。

### JSONP

JSONP 是一種較為老舊的技術，用來解決早期的同源政策限制，允許網頁從不同的來源（域、協議或端口）請求數據。因為 `<script>` 標籤的載入不受同源政策限制，JSONP 通過動態添加 `<script>` 標籤並指向一個返回 JSON 數據的 URL 來工作。該 URL 的響應會包裹在一個函式調用中，網頁上的 JavaScript 會提前定義這個函式以接收數據。

```javascript
// client-side
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// server-side
receiveData({ name: 'PittWu', type: 'player' });
```

缺點是安全風險較高（因為可執行任意 JavaScript）且僅支援 GET 請求。

### CORS

CORS 是一種比 JSONP 更安全、更現代的技術。它通過 HTTP 頭部 `Access-Control-Allow-Origin` 來告訴瀏覽器該請求是被允許的。伺服器設定相關的 CORS 頭部信息來決定哪些來源可以訪問它的資源。

假如 `http://client.com` 的前端想要訪問 `http://api.example.com` 的資源，`api.example.com` 需要在其響應中包含下列 HTTP header：

```http
Access-Control-Allow-Origin: http://client.com
```

或者如果允許任何來源：

```http
Access-Control-Allow-Origin: *
```

CORS 可以用於任何類型的 HTTP 請求，是一種標準化且安全的方式來執行跨來源請求。
