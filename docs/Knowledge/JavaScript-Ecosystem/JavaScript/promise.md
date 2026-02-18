---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## What is a Promise?

Promise is an ES6 feature mainly introduced to solve callback hell and make asynchronous code easier to read and maintain.
A Promise represents the eventual completion (or failure) of an async operation and its resulting value.

A Promise has three states:

- **pending**: initial state
- **fulfilled**: operation completed successfully
- **rejected**: operation failed

## Basic Usage

### Create a Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // asynchronous operation
  const success = true;

  if (success) {
    resolve('Success!'); // Promise becomes fulfilled
  } else {
    reject('Failed!'); // Promise becomes rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Success!'
  })
  .catch((error) => {
    console.log(error); // 'Failed!'
  });
```

### Real-world Example: handling API requests

```js
// shared function for API requests
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // check whether response is in the 200~299 range
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // convert response to JSON and return
    })
    .catch((error) => {
      // handle network issues or request failures
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // rethrow for upstream handling
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

## Promise Methods

### `.then()` / `.catch()` / `.finally()`

```js
promise
  .then((result) => {
    // handle success
    return result;
  })
  .catch((error) => {
    // handle error
    console.error(error);
  })
  .finally(() => {
    // runs regardless of success or failure
    console.log('Promise completed');
  });
```

### `Promise.all()`

Resolves when all Promises resolve, and rejects immediately when any Promise rejects.

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

**When to use**: continue only after multiple API calls all succeed.

### `Promise.race()`

Returns the result of the first Promise that settles (fulfilled or rejected).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('first'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('second'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'second' (faster)
});
```

**When to use**: request timeout handling, or taking the fastest response.

### `Promise.allSettled()`

Waits for all Promises to settle (fulfilled/rejected), then returns all outcomes.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Error');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Error' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**When to use**: you need all outcomes, even if some fail.

### `Promise.any()`

Resolves with the first fulfilled Promise. Rejects only if all Promises reject.

```js
const promise1 = Promise.reject('Error 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Success'), 100)
);
const promise3 = Promise.reject('Error 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Success'
});
```

**When to use**: fallback resources where one success is enough.

## Interview Questions

### Question 1: Promise chaining and error handling

Predict the output:

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

#### Walkthrough

```js
Promise.resolve(1) // returns 1
  .then((x) => x + 1) // x = 1, returns 2
  .then(() => {
    throw new Error('My Error'); // throws -> go to catch
  })
  .catch((e) => 1) // catches and returns normal value 1
  .then((x) => x + 1) // x = 1, returns 2
  .then((x) => console.log(x)) // prints 2
  .catch((e) => console.log('This will not run')); // not executed
```

**Answer: `2`**

#### Key Concepts

1. **`catch` can recover with a normal value**: when `catch()` returns a normal value, the chain continues in fulfilled mode.
2. **`then` after `catch` still runs**: because the error has been handled.
3. **Final `catch` does not run**: no new error is thrown.

If you want the error to keep propagating, rethrow it in `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Error caught');
    throw e; // rethrow
  })
  .then((x) => x + 1) // will not run
  .then((x) => console.log(x)) // will not run
  .catch((e) => console.log('This will run')); // will run
```

### Question 2: Event Loop and execution order

> This question also tests Event Loop understanding.

Predict the output:

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

#### Understand order in `d()`

```js
function d() {
  setTimeout(c, 100); // 4. macro task (100ms delay)
  const temp = Promise.resolve().then(a); // 2. micro task (after sync code)
  console.log('Warrior'); // 1. sync code
  setTimeout(b, 0); // 3. macro task (0ms, still macro)
}
```

Execution order:

1. **Synchronous code**: `console.log('Warrior')` -> `Warrior`
2. **Micro task**: `Promise.resolve().then(a)` -> run `a()` -> `Warlock`
3. **Macro tasks**:
   - `setTimeout(b, 0)` runs first
   - run `b()` -> `Druid`
   - inside `b`, `Promise.resolve().then(...)` is a micro task -> `Rogue`
4. **Macro task**: `setTimeout(c, 100)` runs later -> `Mage`

#### Answer

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Key Concepts

- **Sync code** > **Micro tasks (`Promise`)** > **Macro tasks (`setTimeout`)**
- `.then()` callbacks are micro tasks: they run after current macro task, before next macro task
- `setTimeout(..., 0)` is still macro task and runs after micro tasks

### Question 3: Promise constructor sync vs async behavior

Predict the output:

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

#### Important detail

The key point: **code inside the Promise constructor runs synchronously**.
Only `.then()` / `.catch()` callbacks are asynchronous.

Execution analysis:

```js
console.log(1); // 1. sync
setTimeout(() => console.log(2), 1000); // 5. macro task (1000ms)
setTimeout(() => console.log(3), 0); // 4. macro task (0ms)

new Promise((resolve, reject) => {
  console.log(4); // 2. sync (inside constructor)
  resolve(5);
}).then((foo) => {
  console.log(6); // micro task
});

console.log(7); // 3. sync
```

Execution flow:

1. **Sync**: 1 -> 4 -> 7
2. **Micro task**: 6
3. **Macro tasks** (by delay): 3 -> 2

#### Answer

```
1
4
7
6
3
2
```

#### Key Concepts

1. **Promise constructor body is synchronous**: `console.log(4)` is not async.
2. **Only `.then()` and `.catch()` are asynchronous micro tasks**.
3. **Order**: sync code -> micro tasks -> macro tasks.

## Common Pitfalls

### 1. Forgetting to `return`

If you forget `return` in a Promise chain, the next `.then()` receives `undefined`.

```js
// ❌ wrong
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // forgot return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ correct
fetchUser()
  .then((user) => {
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log(posts); // correct data
  });
```

### 2. Forgetting to catch errors

Unhandled Promise rejections can crash flow and create noisy runtime errors.

```js
// ❌ may cause unhandled rejection
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ add catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
```

### 3. Overusing `new Promise(...)`

Do not wrap a function that already returns a Promise.

```js
// ❌ unnecessary wrapping
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ return directly
function fetchData() {
  return fetch(url);
}
```

### 4. Chaining multiple catches incorrectly

Each `catch()` handles errors from earlier parts of the chain.

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Caught:', e.message); // Caught: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Caught:', e.message); // Caught: Error 2
  });
```

## Related Topics

- [async/await](/docs/async-await) - cleaner Promise syntax sugar
- [Event Loop](/docs/event-loop) - deeper async model understanding

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
