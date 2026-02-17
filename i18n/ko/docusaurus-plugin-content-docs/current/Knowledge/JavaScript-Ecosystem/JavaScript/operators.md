---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> `==`와 `===`의 차이점은 무엇인가요?

둘 다 비교 연산자이지만, `==`는 두 값이 같은지 비교하고, `===`는 두 값이 같고 타입도 동일한지 비교합니다. 따라서 후자는 엄격 모드라고 볼 수 있습니다.

전자는 JavaScript의 설계상 자동으로 타입 변환을 수행하기 때문에, 직관에 반하는 결과가 많이 발생합니다. 예를 들어:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

이는 개발자에게 큰 인지적 부담이 되므로, `==` 대신 `===`를 사용하여 예기치 않은 버그를 방지하는 것이 일반적으로 권장됩니다.

**모범 사례**: `==`를 사용해야 하는 이유를 매우 명확히 알지 않는 한, 항상 `===`와 `!==`를 사용하세요.

### 면접 문제

#### 문제 1: 기본 타입 비교

다음 표현식의 결과를 판단하세요:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**답:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**해설:**

- **`==` (동등 연산자)**: 타입 변환을 수행
  - 문자열 `'1'`이 숫자 `1`로 변환됨
  - 그 후 `1 == 1`을 비교하여 결과는 `true`
- **`===` (엄격 동등 연산자)**: 타입 변환을 수행하지 않음
  - `number`와 `string`은 타입이 다르므로 바로 `false`를 반환

**타입 변환 규칙:**

```javascript
// == 의 타입 변환 우선순위
// 1. number가 있으면 다른 쪽을 number로 변환
'1' == 1; // '1' → 1, 결과 true
'2' == 2; // '2' → 2, 결과 true
'0' == 0; // '0' → 0, 결과 true

// 2. boolean이 있으면 boolean을 number로 변환
true == 1; // true → 1, 결과 true
false == 0; // false → 0, 결과 true
'1' == true; // '1' → 1, true → 1, 결과 true

// 3. 문자열에서 숫자로의 변환 함정
'' == 0; // '' → 0, 결과 true
' ' == 0; // ' ' → 0, 결과 true (공백 문자열은 0으로 변환됨)
```

#### 문제 2: null과 undefined 비교

다음 표현식의 결과를 판단하세요:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**답:**

```javascript
undefined == null; // true
undefined === null; // false
```

**해설:**

이것은 JavaScript의 **특수 규칙**입니다:

- **`undefined == null`**: `true`
  - ES 명세에서 특별히 규정: `null`과 `undefined`는 `==`로 비교할 때 같음
  - 이것이 `==`가 유용한 유일한 시나리오: 변수가 `null` 또는 `undefined`인지 확인
- **`undefined === null`**: `false`
  - 서로 다른 타입 (`undefined`는 `undefined` 타입, `null`은 `object` 타입)
  - 엄격 비교 시 같지 않음

**실무 응용:**

```javascript
// 변수가 null 또는 undefined인지 확인
function isNullOrUndefined(value) {
  return value == null; // null과 undefined를 동시에 확인
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// 동등하지만 더 간결한 방법
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**주의할 함정:**

```javascript
// null과 undefined는 서로에게만 같음
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// 하지만 ===에서는 자기 자신에게만 같음
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### 문제 3: 종합 비교

다음 표현식의 결과를 판단하세요:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**답:**

```javascript
0 == false; // true (false → 0)
0 === false; // false (타입이 다름: number vs boolean)
'' == false; // true ('' → 0, false → 0)
'' === false; // false (타입이 다름: string vs boolean)
null == false; // false (null은 null과 undefined에만 같음)
undefined == false; // false (undefined는 null과 undefined에만 같음)
```

**변환 흐름도:**

```javascript
// 0 == false 의 변환 과정
0 == false;
0 == 0; // false를 숫자 0으로 변환
true; // 결과

// '' == false 의 변환 과정
'' == false;
'' == 0; // false를 숫자 0으로 변환
0 == 0; // ''를 숫자 0으로 변환
true; // 결과

// null == false 의 특수 경우
null == false;
// null은 변환되지 않음! 명세에 따라, null은 null과 undefined에만 같음
false; // 결과
```

#### 문제 4: 객체 비교

다음 표현식의 결과를 판단하세요:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**답:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**해설:**

- 객체(배열, 객체 포함)의 비교는 **참조 비교**
- 내용이 같더라도, 다른 객체 인스턴스이면 같지 않음
- `==`와 `===`는 객체에 대해 동일하게 동작 (모두 참조를 비교)

```javascript
// 참조가 같을 때만 같음
const arr1 = [];
const arr2 = arr1; // 같은 배열에 대한 참조
arr1 == arr2; // true
arr1 === arr2; // true

// 내용이 같지만 다른 인스턴스
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false (다른 참조)
arr3 === arr4; // false (다른 참조)

// 객체도 마찬가지
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### 면접 빠른 암기

**`==`의 타입 변환 규칙 (위에서부터 우선):**

1. `null == undefined` → `true` (특수 규칙)
2. `number == string` → string을 number로 변환
3. `number == boolean` → boolean을 number로 변환
4. `string == boolean` → 모두 number로 변환
5. 객체는 참조를 비교, 변환 없음

**`===`의 규칙 (간단):**

1. 타입이 다름 → `false`
2. 타입이 같음 → 값(기본 타입) 또는 참조(객체 타입) 비교

**모범 사례:**

```javascript
// ✅ 항상 === 사용
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ 유일한 예외: null/undefined 확인
if (value == null) {
  // value는 null 또는 undefined
}

// ❌ == 사용 피하기 (위의 예외 제외)
if (value == 0) {
} // 비추천
if (name == 'Alice') {
} // 비추천
```

**면접 답변 예시:**

> "`==`는 타입 변환을 수행하여 `0 == '0'`이 `true`가 되는 것처럼 직관에 반하는 결과를 초래할 수 있습니다. `===`는 엄격 비교로, 타입 변환을 수행하지 않으며 타입이 다르면 바로 `false`를 반환합니다.
>
> 모범 사례는 항상 `===`를 사용하는 것이고, 유일한 예외는 `value == null`로 `null`과 `undefined`를 동시에 확인할 수 있다는 것입니다.
>
> 특히 주의할 점은 `null == undefined`가 `true`이지만 `null === undefined`는 `false`라는 것으로, 이는 JavaScript의 특수 규정입니다."

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> `&&`와 `||`의 차이점은 무엇인가요? 단축 평가에 대해 설명해 주세요

### 기본 개념

- **`&&` (AND)**: 왼쪽이 `falsy`일 때 왼쪽 값을 바로 반환하고, 오른쪽은 실행하지 않음
- **`||` (OR)**: 왼쪽이 `truthy`일 때 왼쪽 값을 바로 반환하고, 오른쪽은 실행하지 않음

### 단축 평가 예시

```js
// && 단축 평가
const user = null;
const name = user && user.name; // user가 falsy이므로 null을 바로 반환, user.name에 접근하지 않음
console.log(name); // null (에러 없음)

// || 단축 평가
const defaultName = 'Guest';
const userName = user || defaultName; // user가 falsy이므로 오른쪽의 defaultName을 반환
console.log(userName); // 'Guest'

// 실무 응용
function greet(name) {
  const displayName = name || 'Anonymous'; // name이 전달되지 않으면 기본값 사용
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### 자주 빠지는 함정 ⚠️

```js
// 문제: 0과 ''도 falsy
const count = 0;
const result = count || 10; // 0은 falsy이므로 10을 반환
console.log(result); // 10 (원하는 결과가 아닐 수 있음)

// 해결책: ?? (Nullish Coalescing) 사용
const betterResult = count ?? 10; // null/undefined인 경우에만 10을 반환
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> Optional Chaining 연산자 `?.`란 무엇인가요?

### 문제 시나리오

기존 작성법은 에러가 발생하기 쉬움:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ 위험: address가 존재하지 않으면 에러 발생
console.log(user.address.city); // 정상
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ 안전하지만 장황함
const city = user && user.address && user.address.city;
```

### Optional Chaining 사용

```js
// ✅ 간결하고 안전
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (에러 없음)

// 메서드 호출에도 사용 가능
user?.getName?.(); // getName이 존재하면 실행

// 배열에도 사용 가능
const firstItem = users?.[0]?.name; // 첫 번째 사용자의 이름에 안전하게 접근
```

### 실무 응용

```js
// API 응답 처리
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// DOM 조작
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> Nullish Coalescing 연산자 `??`란 무엇인가요?

### `||`와의 차이

```js
// ||는 모든 falsy 값을 거짓으로 취급
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ??는 null과 undefined만 빈 값으로 취급
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### 실무 응용

```js
// 0이 될 수 있는 숫자 처리
function updateScore(newScore) {
  // ✅ 올바름: 0은 유효한 점수
  const score = newScore ?? 100; // 0이면 0을 유지, null/undefined인 경우에만 100 사용
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// 설정값 처리
const config = {
  timeout: 0, // 0밀리초는 유효한 설정
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0 (0 설정을 유지)
const retries = config.maxRetries ?? 3; // 3 (null이면 기본값 사용)
```

### 조합 사용

```js
// ??와 ?.는 자주 함께 사용됨
const userAge = user?.profile?.age ?? 18; // 나이 데이터가 없으면 기본값 18

// 실무 사례: 폼 기본값
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0은 유효한 나이
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> `i++`와 `++i`의 차이점은 무엇인가요?

### 기본 차이

- **`i++` (후위)**: 현재 값을 먼저 반환한 후 1을 더함
- **`++i` (전위)**: 먼저 1을 더한 후 새로운 값을 반환

### 예시

```js
let a = 5;
let b = a++; // b = 5, a = 6 (먼저 b에 할당한 후 증가)
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6 (먼저 증가한 후 d에 할당)
console.log(c, d); // 6, 6
```

### 실무 영향

```js
// 루프에서는 보통 차이 없음 (반환값을 사용하지 않으므로)
for (let i = 0; i < 5; i++) {} // ✅ 일반적
for (let i = 0; i < 5; ++i) {} // ✅ 이것도 가능, 일부는 약간 더 빠르다고 생각 (실제로 현대 JS 엔진에서는 차이 없음)

// 하지만 표현식에서는 차이가 있음
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1 (먼저 i=0으로 값을 가져온 후 i가 1이 됨)
console.log(arr[++i]); // 3 (i가 먼저 2가 된 후 값을 가져옴)
```

### 모범 사례

```js
// ✅ 명확함: 분리해서 작성
let count = 0;
const value = arr[count];
count++;

// ⚠️ 비추천: 혼동하기 쉬움
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> 삼항 연산자란 무엇인가요? 언제 사용해야 하나요?

### 기본 구문

```js
condition ? valueIfTrue : valueIfFalse;
```

### 간단한 예시

```js
// 기존 if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ 삼항 연산자: 더 간결
const message = age >= 18 ? 'Adult' : 'Minor';
```

### 적합한 사용 시나리오

```js
// 1. 간단한 조건부 할당
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. JSX/템플릿에서의 조건부 렌더링
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. 기본값 설정 (다른 연산자와 조합)
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. 함수 반환값
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### 사용을 피해야 할 시나리오

```js
// ❌ 중첩이 너무 깊어 읽기 어려움
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ if-else 또는 switch가 더 명확
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ 복잡한 로직
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ 여러 줄로 분리
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## 빠른 암기 카드

| 연산자        | 용도           | 기억 포인트                            |
| ------------- | -------------- | ------------------------------------- |
| `===`         | 엄격 동등      | 항상 이것을 사용, `==`는 잊기          |
| `&&`          | 단축 AND       | 왼쪽이 거짓이면 멈추고 거짓값 반환      |
| `\|\|`        | 단축 OR        | 왼쪽이 참이면 멈추고 참값 반환          |
| `?.`          | Optional Chaining | 안전한 접근, 에러 없음              |
| `??`          | Nullish Coalescing | null/undefined만 처리             |
| `++i` / `i++` | 자기 증가      | 전위는 먼저 증가, 후위는 나중에 증가    |
| `? :`         | 삼항 연산자    | 간단한 조건에 사용, 중첩은 피하기       |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
