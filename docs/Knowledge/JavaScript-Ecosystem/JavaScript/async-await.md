---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Recommended: read [Promise](/docs/promise) first for the core concepts.

## What is async/await?

`async/await` is syntax sugar introduced in ES2017 (ES8), built on top of Promise.
It makes asynchronous code look more like synchronous code, which improves readability and maintainability.

**Core concepts:**

- An `async` function always returns a Promise.
- `await` can only be used inside an `async` function.
- `await` pauses function execution until the Promise settles.

## Basic Syntax

### `async` function

The `async` keyword makes a function return a Promise automatically:

```js
// Traditional Promise style
function fetchData() {
  return Promise.resolve('data');
}

// async style (equivalent)
async function fetchData() {
  return 'data'; // automatically wrapped as Promise.resolve('data')
}

// same calling pattern
fetchData().then((data) => console.log(data)); // 'data'
```

### `await` keyword

`await` waits for a Promise and returns its resolved value:

```js
async function getData() {
  const result = await Promise.resolve('done');
  console.log(result); // 'done'
}
```

## Promise vs async/await

### Example 1: simple API request

**Promise style:**

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}
```

**async/await style:**

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Example 2: chaining multiple async operations

**Promise style:**

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
      console.error('Error:', error);
    });
}
```

**async/await style:**

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Error Handling

### `try/catch` vs `.catch()`

**Use `try/catch` with async/await:**

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Request failed:', error);
    // You can handle different error types here
    if (error.name === 'NetworkError') {
      // handle network error
    }
    throw error; // rethrow or return fallback value
  }
}
```

**Mixed usage (not recommended, but works):**

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Request failed:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### Nested `try/catch`

Use layered `try/catch` when different steps need different fallback behavior:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return []; // fallback empty array
  }
}
```

## Practical Examples

### Example: grading workflow

> Flow: grade assignment -> check reward -> grant reward -> dismissal or penalty

```js
// grade assignment
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
        reject('You have reached the dismissal threshold');
      }
    }, 2000);
  });
}

// check reward
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} receives movie tickets`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} receives a merit award`);
      } else {
        reject('No reward');
      }
    }, 2000);
  });
}
```

**Promise style:**

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**async/await rewrite:**

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

### Example: concurrent requests

When requests are independent, run them concurrently.

**❌ Wrong: sequential execution (slower):**

```js
async function fetchAllData() {
  const users = await fetchUsers(); // wait 1 sec
  const posts = await fetchPosts(); // another 1 sec
  const comments = await fetchComments(); // another 1 sec
  // total 3 sec
  return { users, posts, comments };
}
```

**✅ Correct: concurrent execution (faster):**

```js
async function fetchAllData() {
  // start three requests at the same time
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // only takes the slowest request time
  return { users, posts, comments };
}
```

**Use `Promise.allSettled()` for partial failures:**

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

## Common Pitfalls

### 1. Using `await` inside loops (sequential by accident)

**❌ Wrong: waits per iteration, poor performance:**

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // sequential, slow
    results.push(user);
  }
  return results;
}
// 10 users * 1s each = 10 seconds
```

**✅ Correct: `Promise.all()` for concurrency:**

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// concurrent requests, around 1 second total
```

**Compromise: limit concurrency:**

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
// process 3 at a time to avoid too many simultaneous requests
```

### 2. Forgetting `await`

Without `await`, you get a Promise instead of the resolved value.

```js
// ❌ wrong
async function getUser() {
  const user = fetchUser(1); // forgot await, user is Promise
  console.log(user.name); // undefined (Promise has no name property)
}

// ✅ correct
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // correct name
}
```

### 3. Using `await` without `async`

`await` can only be used inside an `async` function.

```js
// ❌ wrong: syntax error
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ correct
async function getData() {
  const data = await fetchData();
  return data;
}
```

**Top-level await:**

In ES2022 module environments, you can use `await` at module top level:

```js
// ES2022 module
const data = await fetchData();
console.log(data);
```

### 4. Missing error handling

Without `try/catch`, errors may become unhandled rejections.

```js
// ❌ may cause unhandled errors
async function fetchData() {
  const response = await fetch('/api/data'); // throws if request fails
  return response.json();
}

// ✅ add error handling
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    return null; // or fallback value
  }
}
```

### 5. `async` always returns Promise

Even without `await`, an `async` function still returns Promise.

```js
async function getValue() {
  return 42; // actually Promise.resolve(42)
}

// use .then() or await to get value
getValue().then((value) => console.log(value)); // 42

// or
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Advanced Usage

### Timeout handling

Implement timeout with `Promise.race()`:

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

// usage
fetchWithTimeout('/api/data', 3000); // 3-second timeout
```

### Retry mechanism

Auto-retry on failure:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;

      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// usage
fetchWithRetry('/api/data', 3, 2000); // up to 3 attempts, 2s interval
```

### Sequential processing with state retention

Sometimes sequential execution is required, while keeping all intermediate results:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // decide next step based on previous result
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await in the Event Loop

`async/await` is still Promise-based, so it follows the same Event Loop rules:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// output order: 1, 2, 4, 3
```

Explanation:

1. `console.log('1')` - synchronous
2. `test()` is called, `console.log('2')` - synchronous
3. `await Promise.resolve()` - schedules remaining code as micro task
4. `console.log('4')` - synchronous
5. micro task runs, `console.log('3')`

## Interview Key Points

1. **`async/await` is syntax sugar over Promise**: cleaner syntax, same underlying model.
2. **Use `try/catch` for error handling**: preferred over chained `.catch()` in async/await style.
3. **Concurrency vs sequence matters**: avoid blind `await` inside loops.
4. **`async` always returns Promise**: even without explicit Promise returns.
5. **`await` requires async context**: except top-level await in ES2022 modules.
6. **Understand Event Loop behavior**: code after `await` runs as micro task.

## Related Topics

- [Promise](/docs/promise) - async/await foundation
- [Event Loop](/docs/event-loop) - execution order model

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
