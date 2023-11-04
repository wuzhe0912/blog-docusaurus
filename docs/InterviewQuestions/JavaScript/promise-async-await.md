---
id: promise-async-await
title: 📄 Promise & async await
slug: /promise-async-await
---

## 1. What is Promise ?

Promise 是 ES6 的新特性，主要是用來解決 callback hell 的問題，並且讓程式碼更容易閱讀。主要透過 `.then` 和 `.catch` 兩種方法來處理。例如：

```js
// 建立一個共用 function 來處理 api 請求
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // 檢查 response 是否落在 200 ~ 299 的區間
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // 將 response 轉成 json，並回傳
    })
    .catch((error) => {
      // 檢查網路是否異常，或者請求被拒絕
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // 將錯誤拋出
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('User data received:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## 2. 試判斷以下程式碼的輸出結果

> 本題包含有 event loop 的觀念

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

### Answer

首先看 function d

```js
function d() {
  setTimeout(c, 100); // 4. 非同步執行，延遲秒數為 100，故最後執行
  const temp = Promise.resolve().then(a); // 2. 接續執行，並觸發 a()
  console.log('Warrior'); // 1. 同步執行輸出
  setTimeout(b, 0); // 3. 非同步執行，延遲秒數為 0
}
```

最終會拿到結果如下：

```js
Warrior;
Warlock;
Druid;
Rogue;
Mage;
```
