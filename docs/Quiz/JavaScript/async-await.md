---
id: async-await
title: '[Medium] 📄 async/await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 建議先閱讀 [Promise](/promise) 了解基礎概念

## 什麼是 async/await？

`async/await` 是 ES2017 (ES8) 引入的語法糖，建立在 Promise 之上，讓非同步程式碼看起來像同步程式碼，更容易閱讀和維護。

**核心概念**：
- `async` 函數總是回傳一個 Promise
- `await` 只能在 `async` 函數內使用
- `await` 會暫停函數執行，等待 Promise 完成

## 基本語法

### async 函數

`async` 關鍵字讓函數自動回傳 Promise：

```js
// 傳統 Promise 寫法
function fetchData() {
  return Promise.resolve('資料');
}

// async 寫法（等價）
async function fetchData() {
  return '資料'; // 自動包裝成 Promise.resolve('資料')
}

// 呼叫方式相同
fetchData().then((data) => console.log(data)); // '資料'
```

### await 關鍵字

`await` 會等待 Promise 完成並回傳結果：

```js
async function getData() {
  const result = await Promise.resolve('完成');
  console.log(result); // '完成'
}
```

## Promise vs async/await 對比

### 範例 1：簡單的 API 請求

**Promise 寫法**：

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('錯誤:', error);
      throw error;
    });
}
```

**async/await 寫法**：

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('錯誤:', error);
    throw error;
  }
}
```

### 範例 2：串聯多個非同步操作

**Promise 寫法**：

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('錯誤:', error);
    });
}
```

**async/await 寫法**：

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('錯誤:', error);
  }
}
```

## 錯誤處理

### try/catch vs .catch()

**async/await 使用 try/catch**：

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('請求失敗:', error);
    // 可以在這裡處理不同類型的錯誤
    if (error.name === 'NetworkError') {
      // 處理網路錯誤
    }
    throw error; // 重新拋出或回傳預設值
  }
}
```

**混合使用（不推薦但有效）**：

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('請求失敗:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### 多層 try/catch

針對不同階段的錯誤，可以使用多層 try/catch：

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('取得使用者失敗:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('取得文章失敗:', error);
    return []; // 回傳空陣列作為預設值
  }
}
```

## 實際應用範例

### 範例：批改作業流程

> 流程：批改作業 → 檢查獎勵 → 給予獎勵 → 退學或懲罰

```js
// 批改作業
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('您已達退學門檻');
      }
    }, 2000);
  });
}

// 檢查獎勵
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} 獲得電影票`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} 獲得嘉獎`);
      } else {
        reject('您沒有獎品');
      }
    }, 2000);
  });
}
```

**Promise 寫法**：

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**async/await 改寫**：

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### 範例：並發執行多個請求

當多個請求之間沒有依賴關係時，應該並發執行：

**❌ 錯誤：依序執行（較慢）**：

```js
async function fetchAllData() {
  const users = await fetchUsers(); // 等待 1 秒
  const posts = await fetchPosts(); // 再等待 1 秒
  const comments = await fetchComments(); // 再等待 1 秒
  // 總共 3 秒
  return { users, posts, comments };
}
```

**✅ 正確：並發執行（較快）**：

```js
async function fetchAllData() {
  // 同時發起三個請求
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // 只需要 1 秒（最慢的那個請求的時間）
  return { users, posts, comments };
}
```

**使用 Promise.allSettled() 處理部分失敗**：

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## 常見陷阱

### 1. 在迴圈中使用 await（序列執行）

**❌ 錯誤：每次迴圈都等待，效率低**：

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // 依序執行，很慢！
    results.push(user);
  }
  return results;
}
// 如果有 10 個使用者，每個請求 1 秒，總共需要 10 秒
```

**✅ 正確：使用 Promise.all() 並發執行**：

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 個使用者並發請求，只需要 1 秒
```

**折衷方案：限制並發數量**：

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// 每次處理 3 個，避免一次發太多請求
```

### 2. 忘記使用 await

忘記 `await` 會得到 Promise 而不是實際值：

```js
// ❌ 錯誤
async function getUser() {
  const user = fetchUser(1); // 忘記 await，user 是 Promise
  console.log(user.name); // undefined（Promise 沒有 name 屬性）
}

// ✅ 正確
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // 正確的名稱
}
```

### 3. 忘記 async 就使用 await

`await` 只能在 `async` 函數內使用：

```js
// ❌ 錯誤：語法錯誤
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ 正確
async function getData() {
  const data = await fetchData();
  return data;
}
```

**頂層 await（Top-level await）**：

在 ES2022 和模組環境中，可以在模組頂層使用 await：

```js
// ES2022 module
const data = await fetchData(); // 可以在模組頂層使用
console.log(data);
```

### 4. 錯誤處理遺漏

沒有 try/catch 會導致錯誤未被捕捉：

```js
// ❌ 可能導致未捕捉的錯誤
async function fetchData() {
  const response = await fetch('/api/data'); // 如果失敗會拋出錯誤
  return response.json();
}

// ✅ 加上錯誤處理
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('錯誤:', error);
    return null; // 或回傳預設值
  }
}
```

### 5. async 函數總是回傳 Promise

即使沒有使用 `await`，`async` 函數也會回傳 Promise：

```js
async function getValue() {
  return 42; // 實際上回傳 Promise.resolve(42)
}

// 必須使用 .then() 或 await 取得值
getValue().then((value) => console.log(value)); // 42

// 或
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## 進階應用

### 處理超時

使用 Promise.race() 實作超時機制：

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('請求超時')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('請求失敗:', error.message);
    throw error;
  }
}

// 使用
fetchWithTimeout('/api/data', 3000); // 3 秒超時
```

### 重試機制

實作失敗自動重試：

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // 最後一次重試失敗，拋出錯誤

      console.log(`第 ${i + 1} 次嘗試失敗，${delay}ms 後重試...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 使用
fetchWithRetry('/api/data', 3, 2000); // 最多重試 3 次，間隔 2 秒
```

### 依序處理但保持狀態

有時需要依序執行但保留所有結果：

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // 可以根據前一個結果決定下一步
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## Event Loop 中的 async/await

async/await 本質上還是 Promise，因此遵循相同的 Event Loop 規則：

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// 輸出順序：1, 2, 4, 3
```

解析：
1. `console.log('1')` - 同步執行
2. `test()` 被調用，`console.log('2')` - 同步執行
3. `await Promise.resolve()` - 將後續程式碼放入 micro task
4. `console.log('4')` - 同步執行
5. micro task 執行，`console.log('3')`

## 面試重點

1. **async/await 是 Promise 的語法糖**：更易讀但本質相同
2. **錯誤處理使用 try/catch**：而非 `.catch()`
3. **注意並發 vs 序列執行**：不要在迴圈中無腦使用 await
4. **async 函數總是回傳 Promise**：即使沒有明確 return Promise
5. **await 只能在 async 函數內使用**：除非是頂層 await（ES2022）
6. **理解 Event Loop**：await 後的程式碼是 micro task

## 相關主題

- [Promise](/promise) - async/await 的基礎
- [Event Loop](/event-loop) - 理解執行順序

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)

