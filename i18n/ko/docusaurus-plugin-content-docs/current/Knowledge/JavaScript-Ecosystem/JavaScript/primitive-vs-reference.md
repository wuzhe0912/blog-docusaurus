---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> 원시 타입(Primitive Types)과 참조 타입(Reference Types)이란 무엇인가?

JavaScript의 데이터 타입은 **원시 타입**과 **참조 타입** 두 가지로 나뉩니다. 메모리 저장 방식과 전달 동작에 본질적인 차이가 있습니다.

### 원시 타입(Primitive Types)

**특징**:

- **스택(Stack)**에 저장
- 전달 시 **값 자체를 복사**(Call by Value)
- 불변(Immutable)

**7가지 종류**:

```javascript
// 1. String(문자열)
const str = 'hello';

// 2. Number(숫자)
const num = 42;

// 3. Boolean(불리언)
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol(ES6)
const sym = Symbol('unique');

// 7. BigInt(ES2020)
const bigInt = 9007199254740991n;
```

### 참조 타입(Reference Types)

**특징**:

- **힙(Heap)**에 저장
- 전달 시 **참조(메모리 주소)를 복사**(Call by Reference)
- 가변(Mutable)

**종류**:

```javascript
// 1. Object(객체)
const obj = { name: 'John' };

// 2. Array(배열)
const arr = [1, 2, 3];

// 3. Function(함수)
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> 값에 의한 전달(Call by Value) vs 참조에 의한 전달(Call by Reference)

### 값에 의한 전달(Call by Value) - 원시 타입

**동작**: 값 자체를 복사하며, 복사본을 수정해도 원래 값에 영향을 주지 않는다.

```javascript
// 원시 타입: 값 전달
let a = 10;
let b = a; // 값 복사

b = 20; // b 수정

console.log(a); // 10 (영향 없음)
console.log(b); // 20
```

**메모리 다이어그램**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← 독립적인 값
├─────────┤
│ b: 20   │ ← 독립적인 값 (복사 후 수정)
└─────────┘
```

### 참조에 의한 전달(Call by Reference) - 참조 타입

**동작**: 메모리 주소를 복사하며, 두 변수가 같은 객체를 가리킨다.

```javascript
// 참조 타입: 참조 전달
let obj1 = { name: 'John' };
let obj2 = obj1; // 메모리 주소 복사

obj2.name = 'Jane'; // obj2를 통해 수정

console.log(obj1.name); // 'Jane' (영향 받음!)
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true (같은 객체를 가리킴)
```

**메모리 다이어그램**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (같은 객체)      │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> 자주 나오는 퀴즈 문제

### 문제 1: 원시 타입의 전달

```javascript
function changeValue(x) {
  x = 100;
  console.log('함수 내 x:', x);
}

let num = 50;
changeValue(num);
console.log('함수 외 num:', num);
```

<details>
<summary>클릭하여 답 보기</summary>

```javascript
// 함수 내 x: 100
// 함수 외 num: 50
```

**설명**:

- `num`은 원시 타입(Number)
- 함수에 전달할 때 **값을 복사**하므로, `x`와 `num`은 독립적인 변수
- `x`를 수정해도 `num`에 영향을 주지 않음

```javascript
// 실행 흐름
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (복사)
x = 100; // Stack: x = 100 (x만 수정)
console.log(num); // Stack: num = 50 (영향 없음)
```

</details>

### 문제 2: 참조 타입의 전달

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('함수 내 obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('함수 외 person.name:', person.name);
```

<details>
<summary>클릭하여 답 보기</summary>

```javascript
// 함수 내 obj.name: Changed
// 함수 외 person.name: Changed
```

**설명**:

- `person`은 참조 타입(Object)
- 함수에 전달할 때 **메모리 주소를 복사**
- `obj`와 `person`은 **같은 객체**를 가리킴
- `obj`를 통해 객체 내용을 수정하면 `person`도 영향을 받음

```javascript
// 메모리 다이어그램
let person = { name: 'Original' }; // Heap: 객체 생성 @0x001
changeObject(person); // Stack: obj = @0x001 (주소 복사)
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name (같은 객체)
```

</details>

### 문제 3: 재할당 vs 속성 수정

```javascript
function test1(obj) {
  obj.name = 'Modified'; // 속성 수정
}

function test2(obj) {
  obj = { name: 'New Object' }; // 재할당
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>클릭하여 답 보기</summary>

```javascript
// A: Modified
// B: Modified ('New Object'가 아님!)
```

**설명**:

**test1: 속성 수정**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ 원래 객체의 속성을 수정
}
// person과 obj는 같은 객체를 가리키므로 수정됨
```

**test2: 재할당**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ obj의 참조만 변경
}
// obj는 이제 새 객체를 가리키지만, person은 여전히 원래 객체를 가리킴
```

**메모리 다이어그램**:

```text
// test1 이전
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (같은 것)

// test1 이후
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (같은 것)

// test2 실행
person ────> { name: 'Modified' }    (변경 없음)
obj    ────> { name: 'New Object' }  (새 객체)

// test2 종료 후
person ────> { name: 'Modified' }    (여전히 변경 없음)
// obj는 소멸되고, 새 객체는 가비지 컬렉션됨
```

</details>

### 문제 4: 배열의 전달

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>클릭하여 답 보기</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**설명**:

- `modifyArray`: 원래 배열의 내용을 수정하므로 `numbers`가 영향을 받음
- `reassignArray`: 매개변수의 참조만 변경하므로 `numbers`는 영향 없음

</details>

### 문제 5: 비교 연산

```javascript
// 원시 타입 비교
let a = 10;
let b = 10;
console.log('A:', a === b);

// 참조 타입 비교
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>클릭하여 답 보기</summary>

```javascript
// A: true
// B: false
// C: true
```

**설명**:

**원시 타입**: 값을 비교

```javascript
10 === 10; // true (값이 동일)
```

**참조 타입**: 메모리 주소를 비교

```javascript
obj1 === obj2; // false (다른 객체, 다른 주소)
obj1 === obj3; // true (같은 객체를 가리킴)
```

**메모리 다이어그램**:

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (내용은 같지만 주소가 다름)
obj3 ────> @0x001: { value: 10 } (obj1과 같은 주소)
```

</details>

## 4. Shallow Copy vs Deep Copy

> 얕은 복사 vs 깊은 복사

### 얕은 복사(Shallow Copy)

**정의**: 첫 번째 단계만 복사하며, 중첩된 객체는 여전히 참조 상태이다.

#### 방법 1: 전개 연산자(Spread Operator)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// 첫 번째 단계 수정: 원래 객체에 영향 없음
copy.name = 'Jane';
console.log(original.name); // 'John' (영향 없음)

// 중첩 객체 수정: 원래 객체에 영향!
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (영향 받음!)
```

#### 방법 2: Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John' (영향 없음)
```

#### 방법 3: 배열의 얕은 복사

```javascript
const arr1 = [1, 2, 3];

// 방법 1: 전개 연산자
const arr2 = [...arr1];

// 방법 2: slice()
const arr3 = arr1.slice();

// 방법 3: Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1 (영향 없음)
```

### 깊은 복사(Deep Copy)

**정의**: 중첩된 객체를 포함한 모든 단계를 완전히 복사한다.

#### 방법 1: JSON.parse + JSON.stringify (가장 일반적)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// 중첩 객체 수정: 원래 객체에 영향 없음
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (영향 없음)

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming'] (영향 없음)
```

**제한사항**:

```javascript
const obj = {
  date: new Date(), // ❌ 문자열로 변환됨
  func: () => {}, // ❌ 무시됨
  undef: undefined, // ❌ 무시됨
  symbol: Symbol('test'), // ❌ 무시됨
  regexp: /abc/, // ❌ {}로 변환됨
  circular: null, // ❌ 순환 참조 시 에러 발생
};
obj.circular = obj; // 순환 참조

JSON.parse(JSON.stringify(obj)); // 에러 또는 데이터 손실
```

#### 방법 2: structuredClone() (모던 브라우저)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Date 등 특수 객체도 정확하게 복사 가능
console.log(copy.date instanceof Date); // true
```

**장점**:

- ✅ Date, RegExp, Map, Set 등 지원
- ✅ 순환 참조 지원
- ✅ 성능이 좋음

**제한사항**:

- ❌ 함수 미지원
- ❌ Symbol 미지원

#### 방법 3: 재귀로 깊은 복사 구현

```javascript
function deepClone(obj) {
  // null과 비객체 처리
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 배열 처리
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Date 처리
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // RegExp 처리
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 객체 처리
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 사용 예시
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (영향 없음)
```

#### 방법 4: Lodash 사용

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### 얕은 복사 vs 깊은 복사 비교

| 특성        | 얕은 복사           | 깊은 복사        |
| ----------- | ------------------- | ---------------- |
| 복사 단계   | 첫 번째 단계만      | 모든 단계        |
| 중첩 객체   | 여전히 참조         | 완전히 독립      |
| 성능        | 빠름                | 느림             |
| 메모리      | 적음                | 많음             |
| 사용 시나리오| 단순한 객체         | 복잡한 중첩 구조 |

## 5. Common Pitfalls

> 흔한 함정

### 함정 1: 매개변수 전달로 원시 타입을 변경할 수 있다고 착각

```javascript
// ❌ 잘못된 이해
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5 (6이 되지 않음!)

// ✅ 올바른 작성법
count = increment(count); // 반환값을 받아야 함
console.log(count); // 6
```

### 함정 2: 재할당으로 외부 객체를 변경할 수 있다고 착각

```javascript
// ❌ 잘못된 이해
function resetObject(obj) {
  obj = { name: 'Reset' }; // 매개변수의 참조만 변경
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original' (리셋되지 않음!)

// ✅ 올바른 작성법 1: 속성 수정
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ 올바른 작성법 2: 새 객체 반환
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### 함정 3: 전개 연산자가 깊은 복사라고 착각

```javascript
// ❌ 잘못된 이해
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // 얕은 복사!

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane' (영향 받음!)

// ✅ 올바른 작성법: 깊은 복사
const copy = JSON.parse(JSON.stringify(original));
// 또는
const copy = structuredClone(original);
```

### 함정 4: const에 대한 오해

```javascript
// const는 재할당만 안 되는 것이지, 불변이 아님!

const obj = { name: 'John' };

// ❌ 재할당 불가
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ 속성 수정 가능
obj.name = 'Jane'; // 정상 동작
obj.age = 30; // 정상 동작

// 진정한 불변을 원한다면
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // 조용히 실패 (strict 모드에서는 에러)
console.log(immutableObj.name); // 'John' (수정되지 않음)
```

### 함정 5: 루프 내 참조 문제

```javascript
// ❌ 흔한 실수
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // 모두 같은 객체를 가리킴!
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// 모두 같은 객체이며 최종값은 전부 2

// ✅ 올바른 작성법: 매번 새 객체 생성
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // 매번 새 객체 생성
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> 모범 사례

### ✅ 권장 방법

```javascript
// 1. 객체를 복사할 때 명시적으로 복사 방법 사용
const original = { name: 'John', age: 30 };

// 얕은 복사 (단순한 객체)
const copy1 = { ...original };

// 깊은 복사 (중첩 객체)
const copy2 = structuredClone(original);

// 2. 함수에서 부작용으로 매개변수를 수정하지 않기
// ❌ 나쁨
function addItem(arr, item) {
  arr.push(item); // 원래 배열 수정
}

// ✅ 좋음
function addItem(arr, item) {
  return [...arr, item]; // 새 배열 반환
}

// 3. const를 사용하여 의도치 않은 재할당 방지
const config = { theme: 'dark' };
// config = {}; // 에러 발생

// 4. 불변 객체가 필요할 때 Object.freeze 사용
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ 피해야 할 방법

```javascript
// 1. 매개변수 전달로 원시 타입을 수정하려 하지 않기
function increment(num) {
  num++; // ❌ 효과 없음
}

// 2. 얕은 복사와 깊은 복사를 혼동하지 않기
const copy = { ...nested }; // ❌ 깊은 복사라고 착각

// 3. 루프에서 같은 객체 참조를 반복 사용하지 않기
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ 모두 같은 객체를 가리킴
}
```

## 7. Interview Summary

> 면접 요약

### 빠른 암기

**원시 타입(Primitive)**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- 값 전달(Call by Value)
- Stack에 저장
- 불변(Immutable)

**참조 타입(Reference)**:

- Object, Array, Function, Date, RegExp, etc.
- 참조 전달(Call by Reference)
- Heap에 저장
- 가변(Mutable)

### 면접 답변 예시

**Q: JavaScript는 Call by Value인가 Call by Reference인가?**

> JavaScript는 **모든 타입에 대해 Call by Value**이지만, 참조 타입이 전달하는 "값"은 메모리 주소입니다.
>
> - 원시 타입: 값의 복사본을 전달하므로 수정해도 원래 값에 영향 없음
> - 참조 타입: 주소의 복사본을 전달하므로 주소를 통해 원래 객체를 수정 가능
> - 단, 재할당(주소 변경)은 원래 객체에 영향을 주지 않음

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript 깊이 이해하기](https://javascript.info/object-copy)
