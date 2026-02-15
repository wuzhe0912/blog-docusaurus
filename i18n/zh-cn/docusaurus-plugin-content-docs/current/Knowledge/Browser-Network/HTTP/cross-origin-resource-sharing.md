---
id: cross-origin-resource-sharing
title: 📄 CORS
slug: /cross-origin-resource-sharing
---

## 1. What is between JSONP and CORS ?

JSONP（JSON with Padding）和 CORS（跨来源资源共享）是两种实现跨来源请求的技术，允许网页从不同的域名（网站）请求数据。

### JSONP

JSONP 是一种较为老旧的技术，用来解决早期的同源政策限制，允许网页从不同的来源（域、协议或端口）请求数据。因为 `<script>` 标签的加载不受同源政策限制，JSONP 通过动态添加 `<script>` 标签并指向一个返回 JSON 数据的 URL 来工作。该 URL 的响应会包裹在一个函数调用中，网页上的 JavaScript 会提前定义这个函数以接收数据。

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

缺点是安全风险较高（因为可执行任意 JavaScript）且仅支持 GET 请求。

### CORS

CORS 是一种比 JSONP 更安全、更现代的技术。它通过 HTTP 头部 `Access-Control-Allow-Origin` 来告诉浏览器该请求是被允许的。服务器设定相关的 CORS 头部信息来决定哪些来源可以访问它的资源。

假如 `http://client.com` 的前端想要访问 `http://api.example.com` 的资源，`api.example.com` 需要在其响应中包含下列 HTTP header：

```http
Access-Control-Allow-Origin: http://client.com
```

或者如果允许任何来源：

```http
Access-Control-Allow-Origin: *
```

CORS 可以用于任何类型的 HTTP 请求，是一种标准化且安全的方式来执行跨来源请求。
