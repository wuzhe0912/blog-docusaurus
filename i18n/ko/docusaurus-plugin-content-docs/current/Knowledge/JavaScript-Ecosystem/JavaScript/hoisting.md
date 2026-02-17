---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

JS의 실행은 생성 단계와 실행 단계, 두 단계로 나눌 수 있습니다:

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

Hoisting 특성으로 인해, 위 코드는 실제로 먼저 변수를 선언하고 그 다음에 값을 할당하는 것으로 이해해야 합니다.

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

반면 function은 변수와 다르게, 생성 단계에서 메모리에 할당됩니다. 함수 선언문은 다음과 같습니다:

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

위 코드가 정상적으로 실행되어 console.log를 출력할 수 있는 이유는 다음 로직 때문입니다. function이 먼저 최상단으로 끌어올려지고, 그 다음에 function 호출이 이루어집니다.

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

하지만 주의할 점은, 이러한 Hoisting 특성에서 표현식을 사용할 때는 작성 순서에 주의해야 한다는 것입니다.

생성 단계에서는 function이 가장 우선이며, 그 다음이 변수입니다.

### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，아직 값이 할당되지 않아 기본값인 undefined만 받음
name = 'Pitt';
```

## 2. What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name은 `whoseName()` 안에서 undefined를 받기 때문에 조건문으로 들어가지 않습니다.

하지만 함수 선언문 아래에 다시 값 할당이 있기 때문에, 설령 function 내에서 조건문에 진입하더라도 최종적으로는 Pitt가 출력됩니다.

---

## 3. 함수 선언 vs 변수 선언: Hoisting 우선순위

### 문제: 같은 이름의 함수와 변수

다음 코드의 출력 결과를 판단하세요:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### 오답 (흔한 오해)

많은 사람들이 다음과 같이 생각합니다:

- `undefined` 출력 (var가 먼저 끌어올려진다고 생각)
- `'1'` 출력 (할당이 영향을 미친다고 생각)
- 에러 발생 (같은 이름이 충돌한다고 생각)

### 실제 출력

```js
[Function: foo]
```

### 왜 그럴까?

이 문제는 Hoisting의 **우선순위 규칙**을 테스트합니다:

**Hoisting 우선순위: 함수 선언 > 변수 선언**

```js
// 原始程式碼
console.log(foo);
var foo = '1';
function foo() {}

// 等價於（經過 Hoisting）
// 階段 1：創造階段（Hoisting）
function foo() {} // 1. 函式聲明先提升
var foo; // 2. 變數聲明提升（但不覆蓋已存在的函式）

// 階段 2：執行階段
console.log(foo); // 此時 foo 是函式，輸出 [Function: foo]
foo = '1'; // 3. 變數賦值（會覆蓋函式）
```

### 핵심 개념

**1. 함수 선언은 완전히 끌어올려진다**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. var 변수 선언은 선언만 끌어올려지고, 할당은 끌어올려지지 않는다**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. 함수 선언과 변수 선언이 같은 이름일 때**

```js
// 提升後的順序
function foo() {} // 函式先提升並賦值
var foo; // 變數聲明提升，但不會覆蓋已存在的函式

// 因此 foo 是函式
console.log(foo); // [Function: foo]
```

### 전체 실행 흐름

```js
// 原始程式碼
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== 等價於 ========

// 創造階段（Hoisting）
function foo() {} // 1️⃣ 函式聲明提升（完整提升，包含函式體）
var foo; // 2️⃣ 變數聲明提升（但不覆蓋 foo，因為已經是函式了）

// 執行階段
console.log(foo); // [Function: foo] - foo 是函式
foo = '1'; // 3️⃣ 變數賦值（此時才覆蓋函式）
console.log(foo); // '1' - foo 變成字串
```

### 심화 문제

#### 문제 A: 순서의 영향

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**답:**

```js
[Function: foo] // 第一次輸出
'1' // 第二次輸出
```

**이유:** 코드 순서는 Hoisting 결과에 영향을 미치지 않습니다. 끌어올림 우선순위는 여전히 함수 > 변수입니다.

#### 문제 B: 같은 이름의 여러 함수

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**답:**

```js
[Function: foo] { return 2; } // 第一次輸出（後面的函式覆蓋前面的）
'1' // 第二次輸出（變數賦值覆蓋函式）
```

**이유:**

```js
// 提升後
function foo() {
  return 1;
} // 第一個函式

function foo() {
  return 2;
} // 第二個函式覆蓋第一個

var foo; // 變數聲明（不覆蓋函式）

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // 變數賦值（覆蓋函式）
console.log(foo); // '1'
```

#### 문제 C: 함수 표현식 vs 함수 선언

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**답:**

```js
undefined; // foo 是 undefined
[Function: bar] // bar 是函式
```

**이유:**

```js
// 提升後
var foo; // 變數聲明提升（函式表達式只提升變數名）
function bar() {
  return 2;
} // 函式聲明完整提升

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // 函式表達式賦值
```

**핵심 차이점:**

- **함수 선언**: `function foo() {}` → 완전히 끌어올려짐 (함수 본문 포함)
- **함수 표현식**: `var foo = function() {}` → 변수 이름만 끌어올려지고, 함수 본문은 끌어올려지지 않음

### let/const에서는 이 문제가 발생하지 않는다

```js
// ❌ var 會有提升問題
console.log(foo); // undefined
var foo = '1';

// ✅ let/const 有暫時性死區（TDZ）
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/const 與函式同名會報錯
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Hoisting 우선순위 요약

```
Hoisting 우선순위 (높은 순서대로):

1. 함수 선언 (Function Declaration)
   ├─ function foo() {} ✅ 완전히 끌어올려짐
   └─ 우선순위 가장 높음

2. 변수 선언 (Variable Declaration)
   ├─ var foo ⚠️ 선언만 끌어올려지고, 할당은 끌어올려지지 않음
   └─ 기존 함수를 덮어쓰지 않음

3. 변수 할당 (Variable Assignment)
   ├─ foo = '1' ✅ 함수를 덮어씀
   └─ 실행 단계에서 발생

4. 함수 표현식 (Function Expression)
   ├─ var foo = function() {} ⚠️ 변수 할당으로 취급됨
   └─ 변수 이름만 끌어올려지고, 함수 본문은 끌어올려지지 않음
```

### 면접 포인트

이런 유형의 문제에 답할 때 권장사항:

1. **Hoisting 메커니즘 설명**: 생성과 실행 두 단계로 나뉨
2. **우선순위 강조**: 함수 선언 > 변수 선언
3. **끌어올림 후의 코드 그리기**: 면접관에게 이해도를 보여주기
4. **모범 사례 언급**: let/const를 사용하여 var의 Hoisting 문제 회피

**면접 답변 예시:**

> "이 문제는 Hoisting의 우선순위를 테스트합니다. JavaScript에서 함수 선언의 끌어올림 우선순위는 변수 선언보다 높습니다.
>
> 실행 과정은 두 단계로 나뉩니다:
>
> 1. 생성 단계: `function foo() {}`가 완전히 최상단으로 끌어올려지고, 다음으로 `var foo` 선언이 끌어올려지지만 기존 함수를 덮어쓰지 않습니다.
> 2. 실행 단계: `console.log(foo)` 시점에서 foo는 함수이므로 `[Function: foo]`가 출력됩니다. 이후 `foo = '1'`에서 foo가 문자열로 덮어써집니다.
>
> 모범 사례는 `let`/`const`로 `var`를 대체하고, 함수 선언을 최상단에 배치하여 이러한 혼란을 피하는 것입니다."

---

## 관련 주제

- [var, let, const 차이점](/docs/let-var-const-differences)
