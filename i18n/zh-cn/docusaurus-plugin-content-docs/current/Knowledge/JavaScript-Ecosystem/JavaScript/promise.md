---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## 什么是 Promise？

Promise 是 ES6 的新特性，主要是用来解决 callback hell 的问题，并且让代码更容易阅读。Promise 代表一个异步操作的最终完成或失败，以及其结果值。

Promise 有三种状态：

- **pending**（进行中）：初始状态
- **fulfilled**（已完成）：操作成功完成
- **rejected**（已拒绝）：操作失败

## 基本用法

### 创建 Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // 异步操作
  const success = true;

  if (success) {
    resolve('成功！'); // 将 Promise 状态改为 fulfilled
  } else {
    reject('失败！'); // 将 Promise 状态改为 rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // '成功！'
  })
  .catch((error) => {
    console.log(error); // '失败！'
  });
```

### 实际应用：处理 API 请求

```js
// 创建一个共用 function 来处理 api 请求
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // 检查 response 是否落在 200 ~ 299 的区间
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // 将 response 转成 json，并返回
    })
    .catch((error) => {
      // 检查网络是否异常，或者请求被拒绝
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // 将错误抛出
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
    // 处理成功的情况
    return result;
  })
  .catch((error) => {
    // 处理错误
    console.error(error);
  })
  .finally(() => {
    // 无论成功或失败都会执行
    console.log('Promise 完成');
  });
```

### Promise.all()

当所有 Promise 都完成时才会完成，只要有一个失败就会失败。

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

**使用时机**：需要等待多个 API 请求都完成后才继续执行。

### Promise.race()

返回第一个完成（无论成功或失败）的 Promise 结果。

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('一号'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('二号'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // '二号'（因为较快完成）
});
```

**使用时机**：设定请求超时、只取最快回应的结果。

### Promise.allSettled()

等待所有 Promise 完成（无论成功或失败），返回所有结果。

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('错误');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: '错误' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**使用时机**：需要知道所有 Promise 的执行结果，即使某些失败也要继续处理。

### Promise.any()

返回第一个成功的 Promise，所有都失败才会失败。

```js
const promise1 = Promise.reject('错误 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('成功'), 100)
);
const promise3 = Promise.reject('错误 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // '成功'
});
```

**使用时机**：多个备用资源，只要有一个成功即可。

## 面试题目

### 题目 1：Promise 链式调用与错误处理

试判断以下代码的输出结果：

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

让我们逐步分析执行过程：

```js
Promise.resolve(1) // 返回值：1
  .then((x) => x + 1) // x = 1，返回 2
  .then(() => {
    throw new Error('My Error'); // 抛出错误，进入 catch
  })
  .catch((e) => 1) // 捕获错误，返回 1（重要：这里返回的是正常值）
  .then((x) => x + 1) // x = 1，返回 2
  .then((x) => console.log(x)) // 输出 2
  .catch((e) => console.log('This will not run')); // 不会执行
```

**答案：2**

#### 关键概念

1. **catch 会捕获错误并返回正常值**：当 `catch()` 返回一个正常值时，Promise 链会继续执行后续的 `.then()`
2. **catch 之后的 then 会继续执行**：因为错误已经被处理，Promise 链恢复正常状态
3. **最后的 catch 不会执行**：因为没有新的错误被抛出

如果想让错误继续传递，需要在 `catch` 中重新抛出错误：

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('捕获到错误');
    throw e; // 重新抛出错误
  })
  .then((x) => x + 1) // 不会执行
  .then((x) => console.log(x)) // 不会执行
  .catch((e) => console.log('This will run')); // 会执行
```

### 题目 2：Event Loop 与执行顺序

> 本题包含 Event Loop 的概念

试判断以下代码的输出结果：

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

#### 理解执行顺序

首先看 `d()`：

```js
function d() {
  setTimeout(c, 100); // 4. Macro task，延迟 100ms，最后执行
  const temp = Promise.resolve().then(a); // 2. Micro task，同步执行完后执行
  console.log('Warrior'); // 1. 同步执行，立即输出
  setTimeout(b, 0); // 3. Macro task，延迟 0ms，但仍是 macro task
}
```

执行顺序分析：

1. **同步代码**：`console.log('Warrior')` → 输出 `Warrior`
2. **Micro task**：`Promise.resolve().then(a)` → 执行 `a()`，输出 `Warlock`
3. **Macro task**：
   - `setTimeout(b, 0)` 先执行（延迟 0ms）
   - 执行 `b()`，输出 `Druid`
   - `b()` 内的 `Promise.resolve().then(...)` 是 micro task，立即执行，输出 `Rogue`
4. **Macro task**：`setTimeout(c, 100)` 最后执行（延迟 100ms），输出 `Mage`

#### 答案

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### 关键概念

- **同步代码** > **Micro task (Promise)** > **Macro task (setTimeout)**
- Promise 的 `.then()` 属于 micro task，会在当前 macro task 结束后、下一个 macro task 开始前执行
- `setTimeout` 即使延迟时间为 0，仍属于 macro task，会在所有 micro task 之后执行

### 题目 3：Promise 构造函数的同步与异步

试判断以下代码的输出结果：

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

#### 注意 Promise 的区块

这题的关键在于：**Promise 构造函数内的代码是同步执行的**，只有 `.then()` 和 `.catch()` 才是异步。

执行顺序分析：

```js
console.log(1); // 1. 同步，输出 1
setTimeout(() => console.log(2), 1000); // 5. Macro task，延迟 1000ms
setTimeout(() => console.log(3), 0); // 4. Macro task，延迟 0ms

new Promise((resolve, reject) => {
  console.log(4); // 2. 同步！Promise 构造函数内是同步的，输出 4
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task，输出 6
});

console.log(7); // 3. 同步，输出 7
```

执行流程：

1. **同步执行**：1 → 4 → 7
2. **Micro task**：6
3. **Macro task**（按延迟时间）：3 → 2

#### 答案

```
1
4
7
6
3
2
```

#### 关键概念

1. **Promise 构造函数内的代码是同步执行的**：`console.log(4)` 不属于异步状态
2. **只有 `.then()` 和 `.catch()` 才是异步**：它们属于 micro task
3. **执行顺序**：同步代码 → micro task → macro task

## 常见陷阱

### 1. 忘记 return

在 Promise 链中忘记 `return` 会导致后续的 `.then()` 收到 `undefined`：

```js
// ❌ 错误
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // 忘记 return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ 正确
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // 记得 return
  })
  .then((posts) => {
    console.log(posts); // 正确的数据
  });
```

### 2. 忘记 catch 错误

未捕获的 Promise 错误会导致 UnhandledPromiseRejection：

```js
// ❌ 可能导致未捕获的错误
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
    console.error('发生错误:', error);
  });
```

### 3. Promise 构造函数滥用

不需要用 Promise 包装已经是 Promise 的函数：

```js
// ❌ 不必要的包装
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ 直接返回
function fetchData() {
  return fetch(url);
}
```

### 4. 串联多个 catch

每个 `catch()` 只能捕获它之前的错误：

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('捕获到:', e.message); // 捕获到: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('捕获到:', e.message); // 捕获到: Error 2
  });
```

## 相关主题

- [async/await](/docs/async-await) - 更优雅的 Promise 语法糖
- [Event Loop](/docs/event-loop) - 深入理解 JavaScript 的异步机制

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
