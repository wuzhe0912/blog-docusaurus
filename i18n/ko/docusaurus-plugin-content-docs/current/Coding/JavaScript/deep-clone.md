---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Deep Clone이란?

**깊은 복사(Deep Clone)**란 새로운 객체를 생성하고, 원본 객체와 그 모든 중첩된 객체 및 배열의 모든 속성을 재귀적으로 복사하는 것입니다. 깊은 복사 후의 객체는 원본 객체와 완전히 독립적이며, 하나를 수정해도 다른 하나에 영향을 미치지 않습니다.

### 얕은 복사 vs 깊은 복사

**얕은 복사(Shallow Clone)**: 객체의 첫 번째 레벨 속성만 복사하며, 중첩된 객체는 여전히 참조를 공유합니다.

```javascript
// 얕은 복사 예시
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ 원본 객체도 수정됨
```

**깊은 복사(Deep Clone)**: 모든 레벨의 속성을 재귀적으로 복사하여 완전히 독립적으로 만듭니다.

```javascript
// 깊은 복사 예시
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ 원본 객체는 영향을 받지 않음
```

## 2. Implementation Methods

> 구현 방법

### 방법 1: JSON.parse와 JSON.stringify 사용

**장점**: 간단하고 빠름
**단점**: 함수, undefined, Symbol, Date, RegExp, Map, Set 등 특수 타입을 처리할 수 없음

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 테스트
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**제한 사항**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date가 빈 객체가 됨
console.log(cloned.func); // undefined ❌ 함수가 손실됨
console.log(cloned.undefined); // undefined ✅ 하지만 JSON.stringify가 제거함
console.log(cloned.symbol); // undefined ❌ Symbol이 손실됨
console.log(cloned.regex); // {} ❌ RegExp가 빈 객체가 됨
```

### 방법 2: 재귀 구현 (기본 타입과 객체 처리)

```javascript
function deepClone(obj) {
  // null과 기본 타입 처리
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Date 처리
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp 처리
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 배열 처리
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 객체 처리
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 테스트
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ 영향을 받지 않음
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### 방법 3: 완전한 구현 (Map, Set, Symbol 등 처리)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // null과 기본 타입 처리
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 순환 참조 처리
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Date 처리
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp 처리
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Map 처리
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Set 처리
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // 배열 처리
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 객체 처리
  const cloned = {};
  map.set(obj, cloned);

  // Symbol 속성 처리
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // 일반 속성 복사
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Symbol 속성 복사
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// 테스트
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### 방법 4: 순환 참조 처리

```javascript
function deepClone(obj, map = new WeakMap()) {
  // null과 기본 타입 처리
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 순환 참조 처리
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Date 처리
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp 처리
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 배열 처리
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 객체 처리
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 순환 참조 테스트
const original = {
  name: 'John',
};
original.self = original; // 순환 참조

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ 순환 참조를 올바르게 처리
console.log(cloned !== original); // true ✅ 서로 다른 객체
```

## 3. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 기본 깊은 복사 구현

객체와 배열을 깊은 복사할 수 있는 `deepClone` 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function deepClone(obj) {
  // null과 기본 타입 처리
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Date 처리
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp 처리
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 배열 처리
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 객체 처리
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 테스트
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### 문제 2: 순환 참조 처리

순환 참조를 처리할 수 있는 `deepClone` 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // null과 기본 타입 처리
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 순환 참조 처리
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Date 처리
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp 처리
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 배열 처리
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 객체 처리
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 순환 참조 테스트
const original = {
  name: 'John',
};
original.self = original; // 순환 참조

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**핵심 포인트**:

- `WeakMap`을 사용하여 이미 처리한 객체를 추적
- 새 객체를 만들기 전에 이미 map에 존재하는지 확인
- 존재하면 map의 참조를 직접 반환하여 무한 재귀를 방지

</details>

### 문제 3: JSON.parse와 JSON.stringify의 제한 사항

`JSON.parse(JSON.stringify())`를 사용한 깊은 복사의 제한 사항을 설명하고 해결 방법을 제시하세요.

<details>
<summary>클릭하여 답안 보기</summary>

**제한 사항**:

1. **함수를 처리할 수 없음**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **undefined를 처리할 수 없음**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (하지만 속성이 제거됨) ❌
   ```

3. **Symbol을 처리할 수 없음**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol 속성이 손실됨
   ```

4. **Date가 문자열이 됨**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ 문자열이 됨
   ```

5. **RegExp가 빈 객체가 됨**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ 빈 객체가 됨
   ```

6. **Map, Set을 처리할 수 없음**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ 빈 객체가 됨
   ```

7. **순환 참조를 처리할 수 없음**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ 오류: Converting circular structure to JSON
   ```

**해결 방법**: 재귀 구현을 사용하여 다양한 타입에 대해 특별한 처리를 수행합니다.

</details>

## 4. Best Practices

> 모범 사례

### 권장 방법

```javascript
// 1. 요구 사항에 맞는 방법 선택
// 기본 객체와 배열만 처리하면 되는 경우, 간단한 재귀 구현 사용
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. 복잡한 타입을 처리해야 하는 경우, 완전한 구현 사용
function completeDeepClone(obj, map = new WeakMap()) {
  // ... 완전한 구현
}

// 3. WeakMap을 사용하여 순환 참조 처리
// WeakMap은 가비지 컬렉션을 방해하지 않으므로 객체 참조 추적에 적합
```

### 피해야 할 방법

```javascript
// 1. JSON.parse(JSON.stringify())를 과도하게 사용하지 않기
// ❌ 함수, Symbol, Date 등 특수 타입이 손실됨
const cloned = JSON.parse(JSON.stringify(obj));

// 2. 순환 참조 처리를 잊지 않기
// ❌ 스택 오버플로우가 발생함
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // 무한 재귀
  }
  return cloned;
}

// 3. Date, RegExp 등 특수 타입 처리를 잊지 않기
// ❌ 이러한 타입은 특별한 처리가 필요
```

## 5. Interview Summary

> 면접 요약

### 빠른 정리

**깊은 복사**:

- **정의**: 객체와 모든 중첩된 속성을 재귀적으로 복사하여 완전히 독립적으로 만듦
- **방법**: 재귀 구현, JSON.parse(JSON.stringify()), structuredClone()
- **핵심**: 특수 타입 처리, 순환 참조, Symbol 속성

**구현 요점**:

1. 기본 타입과 null 처리
2. Date, RegExp 등 특수 객체 처리
3. 배열과 객체 처리
4. 순환 참조 처리 (WeakMap 사용)
5. Symbol 속성 처리

### 면접 답변 예시

**Q: Deep Clone 함수를 구현해 주세요.**

> "깊은 복사란 완전히 독립적인 새로운 객체를 생성하고, 모든 중첩된 속성을 재귀적으로 복사하는 것입니다. 제 구현에서는 먼저 기본 타입과 null을 처리한 다음, Date, RegExp, 배열, 객체 등 다양한 타입에 대해 특별한 처리를 수행합니다. 순환 참조를 처리하기 위해 WeakMap을 사용하여 이미 처리한 객체를 추적합니다. Symbol 속성의 경우 Object.getOwnPropertySymbols를 사용하여 가져오고 복사합니다. 이를 통해 깊은 복사 후의 객체가 원본 객체와 완전히 독립적이며, 하나를 수정해도 다른 하나에 영향을 미치지 않음을 보장할 수 있습니다."

**Q: JSON.parse(JSON.stringify())에는 어떤 제한 사항이 있나요?**

> "이 방법의 주요 제한 사항은 다음과 같습니다: 1) 함수를 처리할 수 없으며 함수가 제거됨; 2) undefined와 Symbol을 처리할 수 없으며 이 속성들이 무시됨; 3) Date 객체가 문자열이 됨; 4) RegExp가 빈 객체가 됨; 5) Map, Set 등 특수 데이터 구조를 처리할 수 없음; 6) 순환 참조를 처리할 수 없으며 오류가 발생함. 이러한 특수한 경우를 처리해야 한다면 재귀 구현 방식을 사용해야 합니다."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/ko/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
