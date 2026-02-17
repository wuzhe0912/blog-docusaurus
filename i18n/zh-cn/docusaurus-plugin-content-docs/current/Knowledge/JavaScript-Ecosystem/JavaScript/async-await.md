---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 建议先阅读 [Promise](/docs/promise) 了解基础概念

## 什么是 async/await？

`async/await` 是 ES2017 (ES8) 引入的语法糖，建立在 Promise 之上，让异步代码看起来像同步代码，更容易阅读和维护。

**核心概念**：

- `async` 函数总是返回一个 Promise
- `await` 只能在 `async` 函数内使用
- `await` 会暂停函数执行，等待 Promise 完成

## 基本语法

### async 函数

`async` 关键字让函数自动返回 Promise：

```js
// 传统 Promise 写法
function fetchData() {
  return Promise.resolve('资料');
}

// async 写法（等价）
async function fetchData() {
  return '资料'; // 自动包装成 Promise.resolve('资料')
}

// 调用方式相同
fetchData().then((data) => console.log(data)); // '资料'
```

### await 关键字

`await` 会等待 Promise 完成并返回结果：

```js
async function getData() {
  const result = await Promise.resolve('完成');
  console.log(result); // '完成'
}
```

## Promise vs async/await 对比

### 范例 1：简单的 API 请求

**Promise 写法**：

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('错误:', error);
      throw error;
    });
}
```

**async/await 写法**：

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('错误:', error);
    throw error;
  }
}
```

### 范例 2：串联多个异步操作

**Promise 写法**：

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
      console.error('错误:', error);
    });
}
```

**async/await 写法**：

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('错误:', error);
  }
}
```

## 错误处理

### try/catch vs .catch()

**async/await 使用 try/catch**：

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    // 可以在这里处理不同类型的错误
    if (error.name === 'NetworkError') {
      // 处理网络错误
    }
    throw error; // 重新抛出或返回默认值
  }
}
```

**混合使用（不推荐但有效）**：

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('请求失败:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### 多层 try/catch

针对不同阶段的错误，可以使用多层 try/catch：

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('获取用户失败:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('获取文章失败:', error);
    return []; // 返回空数组作为默认值
  }
}
```

## 实际应用范例

### 范例：批改作业流程

> 流程：批改作业 → 检查奖励 → 给予奖励 → 退学或惩罚

```js
// 批改作业
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
        reject('您已达退学门槛');
      }
    }, 2000);
  });
}

// 检查奖励
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} 获得电影票`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} 获得嘉奖`);
      } else {
        reject('您没有奖品');
      }
    }, 2000);
  });
}
```

**Promise 写法**：

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**async/await 改写**：

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

### 范例：并发执行多个请求

当多个请求之间没有依赖关系时，应该并发执行：

**❌ 错误：依序执行（较慢）**：

```js
async function fetchAllData() {
  const users = await fetchUsers(); // 等待 1 秒
  const posts = await fetchPosts(); // 再等待 1 秒
  const comments = await fetchComments(); // 再等待 1 秒
  // 总共 3 秒
  return { users, posts, comments };
}
```

**✅ 正确：并发执行（较快）**：

```js
async function fetchAllData() {
  // 同时发起三个请求
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // 只需要 1 秒（最慢的那个请求的时间）
  return { users, posts, comments };
}
```

**使用 Promise.allSettled() 处理部分失败**：

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

## 常见陷阱

### 1. 在循环中使用 await（序列执行）

**❌ 错误：每次循环都等待，效率低**：

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // 依序执行，很慢！
    results.push(user);
  }
  return results;
}
// 如果有 10 个用户，每个请求 1 秒，总共需要 10 秒
```

**✅ 正确：使用 Promise.all() 并发执行**：

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 个用户并发请求，只需要 1 秒
```

**折中方案：限制并发数量**：

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
// 每次处理 3 个，避免一次发太多请求
```

### 2. 忘记使用 await

忘记 `await` 会得到 Promise 而不是实际值：

```js
// ❌ 错误
async function getUser() {
  const user = fetchUser(1); // 忘记 await，user 是 Promise
  console.log(user.name); // undefined（Promise 没有 name 属性）
}

// ✅ 正确
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // 正确的名称
}
```

### 3. 忘记 async 就使用 await

`await` 只能在 `async` 函数内使用：

```js
// ❌ 错误：语法错误
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ 正确
async function getData() {
  const data = await fetchData();
  return data;
}
```

**顶层 await（Top-level await）**：

在 ES2022 和模块环境中，可以在模块顶层使用 await：

```js
// ES2022 module
const data = await fetchData(); // 可以在模块顶层使用
console.log(data);
```

### 4. 错误处理遗漏

没有 try/catch 会导致错误未被捕获：

```js
// ❌ 可能导致未捕获的错误
async function fetchData() {
  const response = await fetch('/api/data'); // 如果失败会抛出错误
  return response.json();
}

// ✅ 加上错误处理
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('错误:', error);
    return null; // 或返回默认值
  }
}
```

### 5. async 函数总是返回 Promise

即使没有使用 `await`，`async` 函数也会返回 Promise：

```js
async function getValue() {
  return 42; // 实际上返回 Promise.resolve(42)
}

// 必须使用 .then() 或 await 获取值
getValue().then((value) => console.log(value)); // 42

// 或
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## 进阶应用

### 处理超时

使用 Promise.race() 实现超时机制：

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error;
  }
}

// 使用
fetchWithTimeout('/api/data', 3000); // 3 秒超时
```

### 重试机制

实现失败自动重试：

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // 最后一次重试失败，抛出错误

      console.log(`第 ${i + 1} 次尝试失败，${delay}ms 后重试...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 使用
fetchWithRetry('/api/data', 3, 2000); // 最多重试 3 次，间隔 2 秒
```

### 依序处理但保持状态

有时需要依序执行但保留所有结果：

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // 可以根据前一个结果决定下一步
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## Event Loop 中的 async/await

async/await 本质上还是 Promise，因此遵循相同的 Event Loop 规则：

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// 输出顺序：1, 2, 4, 3
```

解析：

1. `console.log('1')` - 同步执行
2. `test()` 被调用，`console.log('2')` - 同步执行
3. `await Promise.resolve()` - 将后续代码放入 micro task
4. `console.log('4')` - 同步执行
5. micro task 执行，`console.log('3')`

## 面试重点

1. **async/await 是 Promise 的语法糖**：更易读但本质相同
2. **错误处理使用 try/catch**：而非 `.catch()`
3. **注意并发 vs 序列执行**：不要在循环中无脑使用 await
4. **async 函数总是返回 Promise**：即使没有明确 return Promise
5. **await 只能在 async 函数内使用**：除非是顶层 await（ES2022）
6. **理解 Event Loop**：await 后的代码是 micro task

## 相关主题

- [Promise](/docs/promise) - async/await 的基础
- [Event Loop](/docs/event-loop) - 理解执行顺序

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
