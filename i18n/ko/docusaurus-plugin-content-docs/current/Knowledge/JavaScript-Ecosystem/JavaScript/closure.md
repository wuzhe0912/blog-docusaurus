---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> Closure란 무엇인가요?

클로저를 이해하려면, 먼저 JavaScript의 변수 스코프와 함수가 외부 변수에 어떻게 접근하는지를 이해해야 합니다.

### Variable Scope(변수 스코프)

JavaScript에서 변수의 스코프는 global scope와 function scope 두 가지로 나뉩니다.

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // 에러 발생, function scope 내의 변수에 접근할 수 없음
```

### Closure example

Closure의 발동 조건은, 자식 함수가 부모 함수 내부에 정의되고 return을 통해 반환되어, 자식 함수 내의 환경 변수를 보존하는 것입니다(즉 `Garbage Collection(가비지 컬렉션)`을 회피합니다).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`현재 카운트：${count}`);
  };
}

const counter = parentFunction();

counter(); // print 현재 카운트：1
counter(); // print 현재 카운트：2
// count 변수는 회수되지 않음. childFunction이 여전히 존재하고 호출할 때마다 count 값이 업데이트되기 때문
```

하지만 주의해야 할 점은, 클로저가 변수를 메모리에 보존하기 때문에 변수가 너무 많으면 메모리 사용량이 과도해질 수 있으며(클로저를 남용하면 안 됨), 결과적으로 성능에 영향을 줄 수 있습니다.

## 2. Create a function that meets the following conditions

> 아래 조건을 충족하는 function을 만드세요 (클로저 개념을 사용하여 처리)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

두 개의 function으로 분리하여 처리합니다

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

물론 첫 번째 해법은 reject될 가능성이 높으므로, 하나의 function으로 합쳐야 합니다.

```js
function plus(value, subValue) {
  // 매번 전달되는 매개변수의 수로 판단
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> 클로저의 특성을 이용하여 숫자를 증가시키세요

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

여기서는 Arrow Function을 사용하지 않고, 일반 function 형태를 사용합니다.

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

이전 해법에서, object를 직접 return 안에 포함할 수도 있습니다

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. What will be printed in this nested function call?

> 이 중첩된 함수 호출은 무엇을 출력할까요?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### 분석

**실행 결과**：

```
hello
TypeError: aa is not a function
```

### 상세 실행 흐름

```js
// a(b(c)) 실행
// JavaScript는 안쪽에서 바깥쪽으로 함수를 실행

// 단계 1：가장 안쪽의 b(c) 실행
b(c)
  ↓
// c 함수가 매개변수로 b에 전달됨
// b 함수 내부에서 bb(), 즉 c()가 실행됨
c() // 'hello' 출력
  ↓
// b 함수에는 return 문이 없음
// 따라서 undefined를 반환
return undefined

// 단계 2：a(undefined) 실행
a(undefined)
  ↓
// undefined가 매개변수로 a에 전달됨
// a 함수 내부에서 aa()를 실행하려고 시도
// 즉 undefined()
undefined() // ❌ 에러: TypeError: aa is not a function
```

### 왜 이렇게 되는 걸까요?

#### 1. 함수 실행 순서 (안쪽에서 바깥쪽으로)

```js
// 예시
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. 먼저 multiply(2, 3) 실행 → 6
           └────── 3. 그 다음 add(6) 실행

// 같은 개념
a(b(c))
  ↑ ↑
  | └─ 1. 먼저 b(c) 실행
  └─── 2. 그 다음 a(b(c)의 결과) 실행
```

#### 2. 함수에 return이 없으면 undefined를 반환

```js
function b(bb) {
  bb(); // 실행했지만 return이 없음
} // 암묵적으로 return undefined

// 다음과 동일
function b(bb) {
  bb();
  return undefined; // JavaScript가 자동으로 추가
}
```

#### 3. 함수가 아닌 것을 호출하면 에러 발생

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// 에러가 발생하는 다른 경우
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### 수정 방법

#### 방법 1：b 함수가 함수를 반환하도록 하기

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// 출력:
// hello
// b executed
```

#### 방법 2：함수를 직접 전달하고, 먼저 실행하지 않기

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // 'hello'만 출력

// 또는 이렇게 작성
a(() => b(c)); // 'hello' 출력
```

#### 방법 3：실행 로직 변경

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// 분리하여 실행
b(c); // 'hello' 출력
a(() => console.log('a executed')); // 'a executed' 출력
```

### 관련 문제

#### 문제 1：이렇게 바꾸면 어떻게 될까요?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>클릭하여 답 보기</summary>

```
hello
TypeError: aa is not a function
```

**분석**：

1. `b(c)` → `c()`를 실행하고, `'hello'`를 출력, `'world'`를 반환
2. `a('world')` → `'world'()`를 실행... 잠깐, 이것도 에러가 발생합니다!

**정답**：

```
hello
TypeError: aa is not a function
```

`b(c)`는 `'world'`(문자열)를 반환하고, `a('world')`는 `'world'()`를 실행하려 하지만, 문자열은 함수가 아니므로 에러가 발생합니다.

</details>

#### 문제 2：전부 return이 있다면?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>클릭하여 답 보기</summary>

```
[Function: c]
hello
```

**분석**：

1. `b(c)` → `c` 함수 자체를 반환 (실행하지 않음)
2. `a(c)` → `c` 함수 자체를 반환
3. `result`는 `c` 함수
4. `result()` → `c()`를 실행하고, `'hello'`를 반환

</details>

### 핵심 정리

```javascript
// 함수 호출 우선순위
a(b(c))
  ↓
// 1. 먼저 가장 안쪽을 실행
b(c) // b에 return이 없으면 undefined
  ↓
// 2. 그 다음 바깥쪽을 실행
a(undefined) // undefined()를 실행하려고 하면 에러

// 해결 방법
// ✅ 1. 중간 함수가 함수를 반환하도록 보장
// ✅ 2. 또는 화살표 함수로 감싸기
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript 기초] 가비지 컬렉션 메커니즘](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript 메모리 관리](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
