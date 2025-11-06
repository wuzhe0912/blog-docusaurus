---
id: promise-async-await
title: '[Medium] 📄 Promise & async await'
slug: /promise-async-await
tags: [JavaScript, Quiz, Medium]
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

### 理解執行順序

首先看 `d()`

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

## 3. What is the output of the following snippet?

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// output ?
```

### 注意 Promise 的區塊

這題當初在面試時，對 Promise 的原理不夠熟悉，忽略了在 Promise 中 `console.log(4)` 所屬的區塊，不屬於非同步狀態(非 `.then()` 和 `.catch()`)，因此在撰寫答案上，出現不小瑕疵。

```js
1;
4;
7;
6;
3;
2;
```

這個運作順序邏輯如下，首先跑同步執行序，即 1, 4, 7 三組數字，而 `setTimeout` 中的 `console.log` 則依照 event loop 的機制，會先將非同步的程式碼放到 queue 中。同步任務執行完畢後，接著先執行 `microtask queue` 中的程式碼，因此會先執行 `Promise` 中的 `console.log(6)`。最後，開始執行非同步的任務，依照延遲秒數決定先後順序，因此印出 3, 2。
