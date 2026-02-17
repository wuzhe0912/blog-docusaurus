---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 먼저 [Promise](/docs/promise)를 읽고 기본 개념을 이해하는 것을 권장합니다

## async/await란 무엇인가?

`async/await`는 ES2017 (ES8)에서 도입된 문법적 설탕(syntactic sugar)으로, Promise 위에 구축되어 비동기 코드를 동기 코드처럼 보이게 하여 읽기 쉽고 유지보수하기 쉽게 만들어줍니다.

**핵심 개념**:

- `async` 함수는 항상 Promise를 반환합니다
- `await`는 `async` 함수 내에서만 사용할 수 있습니다
- `await`는 함수 실행을 일시 중지하고 Promise가 완료될 때까지 기다립니다

## 기본 문법

### async 함수

`async` 키워드는 함수가 자동으로 Promise를 반환하게 합니다:

```js
// 기존 Promise 작성법
function fetchData() {
  return Promise.resolve('자료');
}

// async 작성법 (동일)
async function fetchData() {
  return '자료'; // 자동으로 Promise.resolve('자료')로 래핑
}

// 호출 방식은 동일
fetchData().then((data) => console.log(data)); // '자료'
```

### await 키워드

`await`는 Promise가 완료될 때까지 기다리고 결과를 반환합니다:

```js
async function getData() {
  const result = await Promise.resolve('완료');
  console.log(result); // '완료'
}
```

## Promise vs async/await 비교

### 예제 1: 간단한 API 요청

**Promise 작성법**:

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('오류:', error);
      throw error;
    });
}
```

**async/await 작성법**:

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('오류:', error);
    throw error;
  }
}
```

### 예제 2: 여러 비동기 작업 연쇄 실행

**Promise 작성법**:

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
      console.error('오류:', error);
    });
}
```

**async/await 작성법**:

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('오류:', error);
  }
}
```

## 에러 처리

### try/catch vs .catch()

**async/await에서 try/catch 사용**:

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('요청 실패:', error);
    // 여기서 다양한 유형의 에러를 처리할 수 있습니다
    if (error.name === 'NetworkError') {
      // 네트워크 에러 처리
    }
    throw error; // 다시 던지거나 기본값 반환
  }
}
```

**혼합 사용 (권장하지 않지만 유효함)**:

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('요청 실패:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### 다중 try/catch

서로 다른 단계의 에러에 대해 다중 try/catch를 사용할 수 있습니다:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('사용자 가져오기 실패:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('글 가져오기 실패:', error);
    return []; // 기본값으로 빈 배열 반환
  }
}
```

## 실제 응용 예제

### 예제: 과제 채점 프로세스

> 프로세스: 과제 채점 → 보상 확인 → 보상 지급 → 퇴학 또는 처벌

```js
// 과제 채점
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
        reject('퇴학 기준에 도달했습니다');
      }
    }, 2000);
  });
}

// 보상 확인
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} 영화 티켓 획득`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} 표창 획득`);
      } else {
        reject('보상이 없습니다');
      }
    }, 2000);
  });
}
```

**Promise 작성법**:

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**async/await 리팩토링**:

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

### 예제: 여러 요청 동시 실행

여러 요청 간에 의존 관계가 없을 때는 동시에 실행해야 합니다:

**❌ 잘못된 방법: 순차 실행 (느림)**:

```js
async function fetchAllData() {
  const users = await fetchUsers(); // 1초 대기
  const posts = await fetchPosts(); // 또 1초 대기
  const comments = await fetchComments(); // 또 1초 대기
  // 총 3초
  return { users, posts, comments };
}
```

**✅ 올바른 방법: 동시 실행 (빠름)**:

```js
async function fetchAllData() {
  // 세 요청을 동시에 시작
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // 1초만 필요 (가장 느린 요청의 시간)
  return { users, posts, comments };
}
```

**Promise.allSettled()로 부분 실패 처리**:

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

## 흔한 실수

### 1. 반복문에서 await 사용 (순차 실행)

**❌ 잘못된 방법: 매번 반복마다 대기, 비효율적**:

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // 순차 실행, 매우 느림!
    results.push(user);
  }
  return results;
}
// 사용자가 10명이고, 각 요청이 1초이면, 총 10초 소요
```

**✅ 올바른 방법: Promise.all()로 동시 실행**:

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10명의 사용자를 동시 요청, 1초만 소요
```

**절충안: 동시 실행 수 제한**:

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
// 한 번에 3개씩 처리, 너무 많은 요청을 한꺼번에 보내는 것을 방지
```

### 2. await 사용 잊어버리기

`await`를 잊으면 실제 값이 아닌 Promise를 받게 됩니다:

```js
// ❌ 잘못된 방법
async function getUser() {
  const user = fetchUser(1); // await 잊음, user는 Promise
  console.log(user.name); // undefined (Promise에는 name 속성이 없음)
}

// ✅ 올바른 방법
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // 올바른 이름
}
```

### 3. async 없이 await 사용

`await`는 `async` 함수 내에서만 사용할 수 있습니다:

```js
// ❌ 잘못된 방법: 문법 에러
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ 올바른 방법
async function getData() {
  const data = await fetchData();
  return data;
}
```

**최상위 await (Top-level await)**:

ES2022와 모듈 환경에서는 모듈 최상위에서 await를 사용할 수 있습니다:

```js
// ES2022 module
const data = await fetchData(); // 모듈 최상위에서 사용 가능
console.log(data);
```

### 4. 에러 처리 누락

try/catch가 없으면 에러가 잡히지 않습니다:

```js
// ❌ 잡히지 않는 에러 발생 가능
async function fetchData() {
  const response = await fetch('/api/data'); // 실패하면 에러를 던짐
  return response.json();
}

// ✅ 에러 처리 추가
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('오류:', error);
    return null; // 또는 기본값 반환
  }
}
```

### 5. async 함수는 항상 Promise를 반환

`await`를 사용하지 않더라도 `async` 함수는 Promise를 반환합니다:

```js
async function getValue() {
  return 42; // 실제로는 Promise.resolve(42)를 반환
}

// .then() 또는 await로 값을 가져와야 함
getValue().then((value) => console.log(value)); // 42

// 또는
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## 고급 응용

### 타임아웃 처리

Promise.race()를 사용한 타임아웃 메커니즘 구현:

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('요청 시간 초과')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('요청 실패:', error.message);
    throw error;
  }
}

// 사용
fetchWithTimeout('/api/data', 3000); // 3초 타임아웃
```

### 재시도 메커니즘

실패 시 자동 재시도 구현:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // 마지막 재시도 실패, 에러 던지기

      console.log(`${i + 1}번째 시도 실패, ${delay}ms 후 재시도...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 사용
fetchWithRetry('/api/data', 3, 2000); // 최대 3회 재시도, 2초 간격
```

### 순차 처리하면서 상태 유지

순차적으로 실행하되 모든 결과를 보존해야 할 때:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // 이전 결과에 따라 다음 단계를 결정할 수 있음
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## Event Loop에서의 async/await

async/await는 본질적으로 여전히 Promise이므로 동일한 Event Loop 규칙을 따릅니다:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// 출력 순서: 1, 2, 4, 3
```

분석:

1. `console.log('1')` - 동기 실행
2. `test()`가 호출되고, `console.log('2')` - 동기 실행
3. `await Promise.resolve()` - 이후 코드를 micro task에 추가
4. `console.log('4')` - 동기 실행
5. micro task 실행, `console.log('3')`

## 면접 핵심 포인트

1. **async/await는 Promise의 문법적 설탕**: 더 읽기 쉽지만 본질은 동일
2. **에러 처리는 try/catch 사용**: `.catch()` 대신
3. **동시 실행 vs 순차 실행에 주의**: 반복문에서 무분별하게 await 사용하지 않기
4. **async 함수는 항상 Promise를 반환**: 명시적으로 return Promise하지 않아도
5. **await는 async 함수 내에서만 사용 가능**: 최상위 await (ES2022) 제외
6. **Event Loop 이해**: await 이후의 코드는 micro task

## 관련 주제

- [Promise](/docs/promise) - async/await의 기초
- [Event Loop](/docs/event-loop) - 실행 순서 이해

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
