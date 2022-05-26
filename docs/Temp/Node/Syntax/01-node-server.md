---
id: 01-node-server
title: 📦 Server
slug: /node-server
---

> _Put money aside for a rain day._

## Build Server

I want to build a basic server in localhost.

```js
// app.js

const http = require('http');

const server = http.createServer((req, res) => {
  res.write('Hello Node.js!');
  res.end();
});

const PORT = 3002;

server.listen(PORT, () => {
  console.log(`listening on : ${PORT}`);
});
```

Run terminal `node app.js` and open browser, you will see the output on page.

## Url

Sometimes we want to switch between different page, such as home or product. Therefore we need get the URL parameters from current page.

```js
const url = require('url');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.write('Welcome Homepage.');
    res.end();
  } else {
    let parsedURL = url.parse(req.url);
    res.write(`Welcome ${parsedURL.pathname}`);
    res.end();
  }
});
```

## HTML Tag

If I want to return HTML tag, I must follow the writing format.

```js
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<h1>Welcome Homepage.</h1>`);
    res.end();
  } else {
    // ...
  }
});
```

Restart Cmder and refresh browser, can see h1 tag is render on page.

## Return HTML Page

Under the structure of MVC, HTML is passed to the client through the server. So we can use `fs` to read the html file.

```js
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      }
    });
  } else {
    // ...
  }
});
```
