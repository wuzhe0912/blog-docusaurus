---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## 두 가지 차이점 비교

- **`undefined`**：
  - 변수가 선언되었지만 아직 값이 할당되지 않았음을 나타냅니다.
  - 초기화되지 않은 변수의 기본값입니다.
  - 함수가 명시적으로 값을 반환하지 않으면 기본적으로 `undefined`를 반환합니다.
- **`null`**：
  - 빈 값 또는 값이 없음을 나타냅니다.
  - 일반적으로 명시적으로 `null`을 할당해야 합니다.
  - 변수가 의도적으로 어떤 객체나 값도 가리키지 않음을 나타내는 데 사용됩니다.

## 예시

```js
let x;
console.log(x); // 輸出：undefined

function foo() {}
console.log(foo()); // 輸出：undefined

let y = null;
console.log(y); // 輸出：null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // 輸出：null
```

## typeof를 이용한 검증

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
