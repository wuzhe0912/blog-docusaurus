---
id: cross-origin-resource-sharing
title: 📄 CORS
slug: /cross-origin-resource-sharing
---

## 1. What is between JSONP and CORS ?

JSONP (JSON with Padding) and CORS (Cross-Origin Resource Sharing) are two techniques for implementing cross-origin requests, allowing web pages to request data from different domains.

### JSONP

JSONP is an older technique used to work around the same-origin policy restrictions, allowing web pages to request data from different origins (domain, protocol, or port). Since `<script>` tag loading is not subject to the same-origin policy, JSONP works by dynamically adding a `<script>` tag that points to a URL returning JSON data. The response from that URL is wrapped in a function call, and the JavaScript on the page defines this function in advance to receive the data.

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

The downside is a higher security risk (since it can execute arbitrary JavaScript) and it only supports GET requests.

### CORS

CORS is a safer and more modern technique than JSONP. It uses the HTTP header `Access-Control-Allow-Origin` to inform the browser that the request is permitted. The server configures the relevant CORS headers to determine which origins can access its resources.

For example, if the frontend at `http://client.com` wants to access resources at `http://api.example.com`, `api.example.com` needs to include the following HTTP header in its response:

```http
Access-Control-Allow-Origin: http://client.com
```

Or to allow any origin:

```http
Access-Control-Allow-Origin: *
```

CORS can be used with any type of HTTP request and is a standardized, secure way to perform cross-origin requests.
