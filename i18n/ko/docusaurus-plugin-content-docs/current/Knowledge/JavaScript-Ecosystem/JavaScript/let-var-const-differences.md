---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## 개요

JavaScript에는 변수를 선언하는 세 가지 키워드가 있습니다: `var`, `let`, `const`. 모두 변수 선언에 사용되지만, 스코프, 초기화, 중복 선언, 재할당, 접근 시점 등에서 차이가 있습니다.

## 주요 차이점

| 동작         | `var`                  | `let`               | `const`             |
| ------------ | ---------------------- | ------------------- | ------------------- |
| 스코프       | 함수 스코프 또는 전역  | 블록 스코프         | 블록 스코프         |
| 초기화       | 선택                   | 선택                | 필수                |
| 중복 선언    | 허용                   | 불허                | 불허                |
| 재할당       | 허용                   | 허용                | 불허                |
| 선언 전 접근 | undefined 반환         | ReferenceError 발생 | ReferenceError 발생 |

## 상세 설명

### 스코프

`var`의 스코프는 함수 스코프 또는 전역 스코프이며, `let`과 `const`는 블록 스코프(함수, if-else 블록, for 루프 포함)입니다.

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### 초기화

`var`와 `let`은 선언 시 초기화하지 않아도 되지만, `const`는 반드시 선언 시 초기화해야 합니다.

```javascript
var varVariable;  // 유효
let letVariable;  // 유효
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### 중복 선언

같은 스코프 내에서 `var`는 동일한 변수의 중복 선언을 허용하지만, `let`과 `const`는 허용하지 않습니다.

```javascript
var x = 1;
var x = 2; // 유효, x는 이제 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### 재할당

`var`와 `let`으로 선언된 변수는 재할당이 가능하지만, `const`로 선언된 변수는 재할당할 수 없습니다.

```javascript
var x = 1;
x = 2; // 유효

let y = 1;
y = 2; // 유효

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

참고: `const`로 선언된 변수는 재할당할 수 없지만, 객체나 배열인 경우 그 내용은 수정할 수 있습니다.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // 유효
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // 유효
console.log(arr); // [1, 2, 3, 4]
```

### 선언 전 접근 (Temporal Dead Zone)

`var`로 선언된 변수는 Hoisting되어 자동으로 `undefined`로 초기화됩니다. 반면, `let`과 `const`로 선언된 변수도 Hoisting되지만 초기화되지 않으므로, 선언 전에 접근하면 `ReferenceError`가 발생합니다.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## 면접 문제

### 문제: setTimeout + var의 대표적 함정

다음 코드의 출력 결과를 판단하세요:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### 오답 (흔한 오해)

많은 사람들이 출력이 `1 2 3 4 5`라고 생각합니다.

#### 실제 출력

```
6
6
6
6
6
```

#### 왜 그럴까?

이 문제는 세 가지 핵심 개념과 관련됩니다:

**1. var의 함수 스코프**

```javascript
// var는 루프 내에서 블록 스코프를 생성하지 않음
for (var i = 1; i <= 5; i++) {
  // i는 외부 스코프에 있으며, 모든 이터레이션이 같은 i를 공유
}
console.log(i); // 6 (루프 종료 후 i의 값)

// var의 경우
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // 루프 종료
}
```

**2. setTimeout의 비동기 실행**

```javascript
// setTimeout은 비동기로, 현재 동기 코드 실행이 완료된 후에 실행됨
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // 이 코드는 Event Loop의 태스크 큐에 들어감
    console.log(i);
  }, 0);
}
// 루프가 먼저 완료되고(i가 6이 됨), 그 다음에 setTimeout 콜백이 실행됨
```

**3. Closure 참조**

```javascript
// 모든 setTimeout 콜백 함수가 같은 i를 참조함
// 콜백이 실행될 때, i는 이미 6이 되어 있음
```

#### 해결 방법

**방법 1: let 사용 (권장) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// 출력: 1 2 3 4 5

// let의 경우
{
  let i = 1; // 첫 번째 이터레이션의 i
}
{
  let i = 2; // 두 번째 이터레이션의 i
}
{
  let i = 3; // 세 번째 이터레이션의 i
}
```

**원리**: `let`은 매 이터레이션마다 새로운 블록 스코프를 생성하여, 각 `setTimeout` 콜백이 현재 이터레이션의 `i` 값을 캡처합니다.

```javascript
// 등가
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... 이하 동일
```

**방법 2: IIFE (즉시 실행 함수) 사용**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// 출력: 1 2 3 4 5
```

**원리**: IIFE가 새로운 함수 스코프를 생성하며, 매 이터레이션마다 현재의 `i` 값이 매개변수 `j`로 전달되어 Closure를 형성합니다.

**방법 3: setTimeout의 세 번째 인수 사용**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // 세 번째 인수가 콜백 함수에 전달됨
}
// 출력: 1 2 3 4 5
```

**원리**: `setTimeout`의 세 번째 인수 이후는 콜백 함수의 인수로 전달됩니다.

**방법 4: bind 사용**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// 출력: 1 2 3 4 5
```

**원리**: `bind`는 새로운 함수를 생성하고 현재의 `i` 값을 인수로 바인딩합니다.

#### 방법 비교

| 방법            | 장점                   | 단점             | 권장도             |
| --------------- | ---------------------- | ---------------- | ------------------ |
| `let`           | 간결, 현대적, 이해하기 쉬움 | ES6+         | 5/5 강력 권장      |
| IIFE            | 호환성 좋음            | 구문이 복잡      | 3/5 고려 가능      |
| setTimeout 인수 | 간단하고 직접적        | 잘 알려지지 않음 | 4/5 권장           |
| `bind`          | 함수형 스타일          | 가독성이 다소 떨어짐 | 3/5 고려 가능  |

#### 심화 문제

**Q1: 다음과 같이 변경하면?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**답**: 매초 `6`이 출력되며, 총 5번 출력됩니다(각각 1초, 2초, 3초, 4초, 5초에 출력).

**Q2: 매초 순서대로 1, 2, 3, 4, 5를 출력하려면?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// 1초 후 1 출력
// 2초 후 2 출력
// 3초 후 3 출력
// 4초 후 4 출력
// 5초 후 5 출력
```

#### 면접 포인트

이 문제가 테스트하는 것:

1. **var의 스코프**: 함수 스코프 vs 블록 스코프
2. **Event Loop**: 동기 vs 비동기 실행
3. **Closure**: 함수가 외부 변수를 어떻게 캡처하는지
4. **해결 방법**: 다양한 해법과 장단점 비교

답변 시 권장사항:

- 먼저 정답을 말함 (6 6 6 6 6)
- 이유를 설명함 (var 스코프 + setTimeout 비동기)
- 해결 방법을 제시함 (let 우선, 다른 방법도 설명)
- JavaScript 내부 메커니즘에 대한 이해를 보여줌

## 모범 사례

1. 우선적으로 `const` 사용: 재할당이 필요 없는 변수에는 `const`를 사용하여 코드의 가독성과 유지보수성을 높입니다.
2. 다음으로 `let` 사용: 재할당이 필요한 경우 `let`을 사용합니다.
3. `var` 사용을 피함: `var`의 스코프와 Hoisting 동작이 예상치 못한 문제를 일으킬 수 있으므로, 현대 JavaScript 개발에서는 사용을 피하는 것이 좋습니다.
4. 브라우저 호환성 주의: 구형 브라우저를 지원해야 하는 경우, Babel 등의 도구를 사용하여 `let`과 `const`를 `var`로 트랜스파일할 수 있습니다.

## 관련 주제

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
