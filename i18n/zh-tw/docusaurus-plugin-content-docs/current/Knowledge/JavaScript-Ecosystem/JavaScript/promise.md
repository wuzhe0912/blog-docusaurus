---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## 什麼是 Promise？

Promise 是 ES6 的新特性，主要是用來解決 callback hell 的問題，並且讓程式碼更容易閱讀。Promise 代表一個非同步操作的最終完成或失敗，以及其結果值。

Promise 有三種狀態：

- **pending**（進行中）：初始狀態
- **fulfilled**（已完成）：操作成功完成
- **rejected**（已拒絕）：操作失敗

## 基本用法

### 建立 Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // 非同步操作
  const success = true;

  if (success) {
    resolve('成功！'); // 將 Promise 狀態改為 fulfilled
  } else {
    reject('失敗！'); // 將 Promise 狀態改為 rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // '成功！'
  })
  .catch((error) => {
    console.log(error); // '失敗！'
  });
```

### 實際應用：處理 API 請求

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

## Promise 的方法

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // 處理成功的情況
    return result;
  })
  .catch((error) => {
    // 處理錯誤
    console.error(error);
  })
  .finally(() => {
    // 無論成功或失敗都會執行
    console.log('Promise 完成');
  });
```

### Promise.all()

當所有 Promise 都完成時才會完成，只要有一個失敗就會失敗。

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**使用時機**：需要等待多個 API 請求都完成後才繼續執行。

### Promise.race()

回傳第一個完成（無論成功或失敗）的 Promise 結果。

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('一號'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('二號'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // '二號'（因為較快完成）
});
```

**使用時機**：設定請求超時、只取最快回應的結果。

### Promise.allSettled()

等待所有 Promise 完成（無論成功或失敗），回傳所有結果。

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('錯誤');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: '錯誤' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**使用時機**：需要知道所有 Promise 的執行結果，即使某些失敗也要繼續處理。

### Promise.any()

回傳第一個成功的 Promise，所有都失敗才會失敗。

```js
const promise1 = Promise.reject('錯誤 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('成功'), 100)
);
const promise3 = Promise.reject('錯誤 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // '成功'
});
```

**使用時機**：多個備用資源，只要有一個成功即可。

## 面試題目

### 題目 1：Promise 鏈式調用與錯誤處理

試判斷以下程式碼的輸出結果：

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('This will not run'));
```

#### 解析

讓我們逐步分析執行過程：

```js
Promise.resolve(1) // 回傳值：1
  .then((x) => x + 1) // x = 1，回傳 2
  .then(() => {
    throw new Error('My Error'); // 拋出錯誤，進入 catch
  })
  .catch((e) => 1) // 捕捉錯誤，回傳 1（重要：這裡回傳的是正常值）
  .then((x) => x + 1) // x = 1，回傳 2
  .then((x) => console.log(x)) // 輸出 2
  .catch((e) => console.log('This will not run')); // 不會執行
```

**答案：2**

#### 關鍵概念

1. **catch 會捕捉錯誤並回傳正常值**：當 `catch()` 回傳一個正常值時，Promise 鏈會繼續執行後續的 `.then()`
2. **catch 之後的 then 會繼續執行**：因為錯誤已經被處理，Promise 鏈恢復正常狀態
3. **最後的 catch 不會執行**：因為沒有新的錯誤被拋出

如果想讓錯誤繼續傳遞，需要在 `catch` 中重新拋出錯誤：

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('捕捉到錯誤');
    throw e; // 重新拋出錯誤
  })
  .then((x) => x + 1) // 不會執行
  .then((x) => console.log(x)) // 不會執行
  .catch((e) => console.log('This will run')); // 會執行
```

### 題目 2：Event Loop 與執行順序

> 本題包含 Event Loop 的觀念

試判斷以下程式碼的輸出結果：

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

#### 理解執行順序

首先看 `d()`：

```js
function d() {
  setTimeout(c, 100); // 4. Macro task，延遲 100ms，最後執行
  const temp = Promise.resolve().then(a); // 2. Micro task，同步執行完後執行
  console.log('Warrior'); // 1. 同步執行，立即輸出
  setTimeout(b, 0); // 3. Macro task，延遲 0ms，但仍是 macro task
}
```

執行順序分析：

1. **同步程式碼**：`console.log('Warrior')` → 輸出 `Warrior`
2. **Micro task**：`Promise.resolve().then(a)` → 執行 `a()`，輸出 `Warlock`
3. **Macro task**：
   - `setTimeout(b, 0)` 先執行（延遲 0ms）
   - 執行 `b()`，輸出 `Druid`
   - `b()` 內的 `Promise.resolve().then(...)` 是 micro task，立即執行，輸出 `Rogue`
4. **Macro task**：`setTimeout(c, 100)` 最後執行（延遲 100ms），輸出 `Mage`

#### 答案

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### 關鍵概念

- **同步程式碼** > **Micro task (Promise)** > **Macro task (setTimeout)**
- Promise 的 `.then()` 屬於 micro task，會在當前 macro task 結束後、下一個 macro task 開始前執行
- `setTimeout` 即使延遲時間為 0，仍屬於 macro task，會在所有 micro task 之後執行

### 題目 3：Promise 建構函數的同步與非同步

試判斷以下程式碼的輸出結果：

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

#### 注意 Promise 的區塊

這題的關鍵在於：**Promise 建構函數內的程式碼是同步執行的**，只有 `.then()` 和 `.catch()` 才是非同步。

執行順序分析：

```js
console.log(1); // 1. 同步，輸出 1
setTimeout(() => console.log(2), 1000); // 5. Macro task，延遲 1000ms
setTimeout(() => console.log(3), 0); // 4. Macro task，延遲 0ms

new Promise((resolve, reject) => {
  console.log(4); // 2. 同步！Promise 建構函數內是同步的，輸出 4
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task，輸出 6
});

console.log(7); // 3. 同步，輸出 7
```

執行流程：

1. **同步執行**：1 → 4 → 7
2. **Micro task**：6
3. **Macro task**（依延遲時間）：3 → 2

#### 答案

```
1
4
7
6
3
2
```

#### 關鍵概念

1. **Promise 建構函數內的程式碼是同步執行的**：`console.log(4)` 不屬於非同步狀態
2. **只有 `.then()` 和 `.catch()` 才是非同步**：它們屬於 micro task
3. **執行順序**：同步程式碼 → micro task → macro task

## 常見陷阱

### 1. 忘記 return

在 Promise 鏈中忘記 `return` 會導致後續的 `.then()` 收到 `undefined`：

```js
// ❌ 錯誤
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // 忘記 return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ 正確
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // 記得 return
  })
  .then((posts) => {
    console.log(posts); // 正確的資料
  });
```

### 2. 忘記 catch 錯誤

未捕捉的 Promise 錯誤會導致 UnhandledPromiseRejection：

```js
// ❌ 可能導致未捕捉的錯誤
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ 加上 catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('發生錯誤:', error);
  });
```

### 3. Promise 建構函數濫用

不需要用 Promise 包裝已經是 Promise 的函數：

```js
// ❌ 不必要的包裝
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ 直接回傳
function fetchData() {
  return fetch(url);
}
```

### 4. 串聯多個 catch

每個 `catch()` 只能捕捉它之前的錯誤：

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('捕捉到:', e.message); // 捕捉到: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('捕捉到:', e.message); // 捕捉到: Error 2
  });
```

## 相關主題

- [async/await](/docs/async-await) - 更優雅的 Promise 語法糖
- [Event Loop](/docs/event-loop) - 深入理解 JavaScript 的非同步機制

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
