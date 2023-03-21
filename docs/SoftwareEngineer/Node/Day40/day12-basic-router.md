---
id: day12-basic-router
title: '📜 Day-12 Basic Router'
slug: /day12-basic-router
---

## Requirements Specification

設計當使用者造訪以下頁面（GET）時的路由， response 可先回傳一段簡單的文字

- 登入
- 註冊
- 全體動態牆
- 個人牆
- 個人追蹤名單

## Answer

### Login

```js
app.get('/login', (req, res) => {
  res.send('Welcome to the login page');
});
```

### Register

```js
app.get('/register', (req, res) => {
  res.send('Welcome to the register page');
});
```

### Main feed

```js
app.get('/feed', (req, res) => {
  res.send('Welcome to the main feed page');
});
```

### Personal wall

```js
app.get('/profile', (req, res) => {
  res.send('Welcome to the personal wall page');
});
```

### Personal follow list

```js
app.get('/following', (req, res) => {
  res.send('Welcome to the personal follow list page');
});
```
