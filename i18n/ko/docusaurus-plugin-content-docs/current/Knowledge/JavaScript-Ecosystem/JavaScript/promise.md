---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Promise란 무엇인가?

Promise는 ES6의 새로운 기능으로, 주로 callback hell 문제를 해결하고 코드를 더 읽기 쉽게 만들기 위해 사용됩니다. Promise는 비동기 작업의 최종 완료 또는 실패, 그리고 그 결과값을 나타냅니다.

Promise에는 세 가지 상태가 있습니다:

- **pending**(진행 중): 초기 상태
- **fulfilled**(완료됨): 작업이 성공적으로 완료됨
- **rejected**(거부됨): 작업 실패

## 기본 사용법

### Promise 생성

```js
const myPromise = new Promise((resolve, reject) => {
  // 비동기 작업
  const success = true;

  if (success) {
    resolve('성공!'); // Promise 상태를 fulfilled로 변경
  } else {
    reject('실패!'); // Promise 상태를 rejected로 변경
  }
});

myPromise
  .then((result) => {
    console.log(result); // '성공!'
  })
  .catch((error) => {
    console.log(error); // '실패!'
  });
```

### 실제 응용: API 요청 처리

```js
// api 요청을 처리하는 공용 function 생성
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // response가 200 ~ 299 범위에 있는지 확인
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // response를 json으로 변환하여 반환
    })
    .catch((error) => {
      // 네트워크 이상 여부 또는 요청 거부 확인
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // 에러 던지기
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

## Promise의 메서드

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // 성공한 경우 처리
    return result;
  })
  .catch((error) => {
    // 에러 처리
    console.error(error);
  })
  .finally(() => {
    // 성공이든 실패든 항상 실행
    console.log('Promise 완료');
  });
```

### Promise.all()

모든 Promise가 완료되어야 완료되며, 하나라도 실패하면 실패합니다.

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

**사용 시기**: 여러 API 요청이 모두 완료된 후에 계속 실행해야 할 때.

### Promise.race()

첫 번째로 완료된(성공이든 실패든) Promise의 결과를 반환합니다.

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('1번'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('2번'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // '2번' (더 빨리 완료되었기 때문)
});
```

**사용 시기**: 요청 타임아웃 설정, 가장 빠른 응답 결과만 가져올 때.

### Promise.allSettled()

모든 Promise가 완료될 때까지(성공이든 실패든) 기다리고, 모든 결과를 반환합니다.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('에러');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: '에러' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**사용 시기**: 모든 Promise의 실행 결과를 알아야 하며, 일부가 실패해도 계속 처리해야 할 때.

### Promise.any()

첫 번째로 성공한 Promise를 반환하며, 모두 실패해야 실패합니다.

```js
const promise1 = Promise.reject('에러 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('성공'), 100)
);
const promise3 = Promise.reject('에러 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // '성공'
});
```

**사용 시기**: 여러 대체 리소스가 있고, 하나만 성공하면 되는 경우.

## 면접 문제

### 문제 1: Promise 체이닝과 에러 처리

다음 코드의 출력 결과를 판단해 보세요:

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

#### 해설

실행 과정을 단계별로 분석해 봅시다:

```js
Promise.resolve(1) // 반환값: 1
  .then((x) => x + 1) // x = 1, 2 반환
  .then(() => {
    throw new Error('My Error'); // 에러 발생, catch로 이동
  })
  .catch((e) => 1) // 에러 캡처, 1 반환 (중요: 여기서 정상 값을 반환)
  .then((x) => x + 1) // x = 1, 2 반환
  .then((x) => console.log(x)) // 2 출력
  .catch((e) => console.log('This will not run')); // 실행되지 않음
```

**답: 2**

#### 핵심 개념

1. **catch는 에러를 캡처하고 정상 값을 반환**: `catch()`가 정상 값을 반환하면, Promise 체인은 후속 `.then()`을 계속 실행합니다
2. **catch 이후의 then은 계속 실행**: 에러가 이미 처리되었으므로 Promise 체인은 정상 상태로 복귀합니다
3. **마지막 catch는 실행되지 않음**: 새로운 에러가 발생하지 않았기 때문입니다

에러를 계속 전달하려면 `catch`에서 에러를 다시 던져야 합니다:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('에러 캡처됨');
    throw e; // 에러를 다시 던짐
  })
  .then((x) => x + 1) // 실행되지 않음
  .then((x) => console.log(x)) // 실행되지 않음
  .catch((e) => console.log('This will run')); // 실행됨
```

### 문제 2: Event Loop와 실행 순서

> 이 문제는 Event Loop 개념을 포함합니다

다음 코드의 출력 결과를 판단해 보세요:

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

#### 실행 순서 이해

먼저 `d()`를 봅시다:

```js
function d() {
  setTimeout(c, 100); // 4. Macro task, 100ms 지연, 마지막에 실행
  const temp = Promise.resolve().then(a); // 2. Micro task, 동기 코드 완료 후 실행
  console.log('Warrior'); // 1. 동기 실행, 즉시 출력
  setTimeout(b, 0); // 3. Macro task, 0ms 지연, 하지만 여전히 macro task
}
```

실행 순서 분석:

1. **동기 코드**: `console.log('Warrior')` → `Warrior` 출력
2. **Micro task**: `Promise.resolve().then(a)` → `a()` 실행, `Warlock` 출력
3. **Macro task**:
   - `setTimeout(b, 0)` 먼저 실행 (0ms 지연)
   - `b()` 실행, `Druid` 출력
   - `b()` 내의 `Promise.resolve().then(...)`은 micro task, 즉시 실행, `Rogue` 출력
4. **Macro task**: `setTimeout(c, 100)` 마지막 실행 (100ms 지연), `Mage` 출력

#### 답

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### 핵심 개념

- **동기 코드** > **Micro task (Promise)** > **Macro task (setTimeout)**
- Promise의 `.then()`은 micro task에 속하며, 현재 macro task가 끝난 후, 다음 macro task가 시작되기 전에 실행됩니다
- `setTimeout`은 지연 시간이 0이어도 macro task에 속하며, 모든 micro task 이후에 실행됩니다

### 문제 3: Promise 생성자의 동기와 비동기

다음 코드의 출력 결과를 판단해 보세요:

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

#### Promise 블록에 주의

이 문제의 핵심은: **Promise 생성자 내의 코드는 동기적으로 실행된다**는 것입니다. `.then()`과 `.catch()`만 비동기입니다.

실행 순서 분석:

```js
console.log(1); // 1. 동기, 1 출력
setTimeout(() => console.log(2), 1000); // 5. Macro task, 1000ms 지연
setTimeout(() => console.log(3), 0); // 4. Macro task, 0ms 지연

new Promise((resolve, reject) => {
  console.log(4); // 2. 동기! Promise 생성자 내부는 동기적, 4 출력
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task, 6 출력
});

console.log(7); // 3. 동기, 7 출력
```

실행 흐름:

1. **동기 실행**: 1 → 4 → 7
2. **Micro task**: 6
3. **Macro task** (지연 시간 순): 3 → 2

#### 답

```
1
4
7
6
3
2
```

#### 핵심 개념

1. **Promise 생성자 내의 코드는 동기적으로 실행**: `console.log(4)`는 비동기가 아닙니다
2. **`.then()`과 `.catch()`만 비동기**: micro task에 속합니다
3. **실행 순서**: 동기 코드 → micro task → macro task

## 흔한 실수

### 1. return 잊기

Promise 체인에서 `return`을 잊으면 후속 `.then()`이 `undefined`를 받게 됩니다:

```js
// ❌ 잘못된 방법
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // return 잊음
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ 올바른 방법
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // return 기억
  })
  .then((posts) => {
    console.log(posts); // 올바른 데이터
  });
```

### 2. catch로 에러 처리 잊기

캡처되지 않은 Promise 에러는 UnhandledPromiseRejection을 발생시킵니다:

```js
// ❌ 캡처되지 않는 에러 발생 가능
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ catch 추가
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('에러 발생:', error);
  });
```

### 3. Promise 생성자 남용

이미 Promise인 함수를 Promise로 다시 감쌀 필요가 없습니다:

```js
// ❌ 불필요한 래핑
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ 직접 반환
function fetchData() {
  return fetch(url);
}
```

### 4. 여러 catch 연결

각 `catch()`는 그 이전의 에러만 캡처할 수 있습니다:

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('캡처됨:', e.message); // 캡처됨: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('캡처됨:', e.message); // 캡처됨: Error 2
  });
```

## 관련 주제

- [async/await](/docs/async-await) - 더 우아한 Promise 문법적 설탕
- [Event Loop](/docs/event-loop) - JavaScript의 비동기 메커니즘 심층 이해

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
