---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> 문제 설명

객체 경로 파싱 함수를 구현하여, 경로 문자열을 기반으로 중첩된 객체의 값을 가져오고 설정할 수 있도록 합니다.

### 요구사항

1. **`get` 함수**: 경로를 기반으로 객체 값 가져오기

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **`set` 함수**: 경로를 기반으로 객체 값 설정하기

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> get 함수 구현

### 방법 1: split과 reduce 사용

**아이디어**: 경로 문자열을 배열로 분할한 후, `reduce`를 사용하여 객체에 계층적으로 접근합니다.

```javascript
function get(obj, path, defaultValue) {
  // 엣지 케이스 처리
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 경로 문자열을 배열로 분할
  const keys = path.split('.');

  // reduce를 사용하여 계층적으로 접근
  const result = keys.reduce((current, key) => {
    // 현재 값이 null 또는 undefined이면 undefined 반환
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // 결과가 undefined이면 기본값 반환
  return result !== undefined ? result : defaultValue;
}

// 테스트
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (배열 인덱스 처리 필요)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### 방법 2: 배열 인덱스 지원

**아이디어**: 경로 내의 배열 인덱스 (`'a.b[0].c'` 등)를 처리합니다.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 정규식 매칭: 속성명 또는 배열 인덱스
  // 'a', 'b', '[0]', 'c' 등에 매칭
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // 배열 인덱스 처리 [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// 테스트
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### 방법 3: 완전한 구현 (엣지 케이스 처리)

```javascript
function get(obj, path, defaultValue) {
  // 엣지 케이스 처리
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // 경로 파싱: 'a.b.c'와 'a.b[0].c' 형식 지원
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // 현재 값이 null 또는 undefined이면 기본값 반환
    if (result == null) {
      return defaultValue;
    }

    // 배열 인덱스 처리
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// 테스트
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (빈 경로는 원본 객체 반환)
```

## 3. Implementation: set Function

> set 함수 구현

### 방법 1: 기본 구현

**아이디어**: 경로를 기반으로 중첩된 객체 구조를 생성한 후 값을 설정합니다.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // 경로 파싱
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // 중첩 구조 생성
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 배열 인덱스 처리
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // 키가 존재하지 않거나 객체가 아닌 경우, 새 객체 생성
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // 마지막 키의 값 설정
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // 현재가 배열이 아닌 경우, 변환 필요
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 테스트
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### 방법 2: 완전한 구현 (배열과 객체 처리)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // 마지막에서 두 번째 키까지 순회하며 중첩 구조 생성
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 배열 인덱스 처리
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // 배열인지 확인
      if (!Array.isArray(current)) {
        // 객체를 배열로 변환 (기존 인덱스 유지)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // 인덱스가 존재하는지 확인
      if (current[index] == null) {
        // 다음 키가 배열인지 객체인지 판단
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // 객체 키 처리
      if (current[key] == null) {
        // 다음 키가 배열인지 객체인지 판단
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // 이미 존재하지만 객체가 아닌 경우, 변환 필요
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 마지막 키의 값 설정
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 테스트
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### 방법 3: 간소화 버전 (객체만 처리, 배열 인덱스 없음)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // 중첩 구조 생성 (마지막 키 제외)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 마지막 키의 값 설정
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 테스트
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 기본 get 함수 구현

경로 문자열을 기반으로 중첩된 객체의 값을 가져오는 `get` 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// 테스트
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**핵심 포인트**:

- null/undefined 케이스 처리
- split으로 경로 분할
- 객체 속성에 계층적으로 접근
- 경로가 존재하지 않을 때 기본값 반환

</details>

### 문제 2: 배열 인덱스를 지원하는 get 함수

`get` 함수를 확장하여 `'a.b[0].c'`와 같은 배열 인덱스를 지원하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // 정규식으로 경로 파싱
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // 배열 인덱스 처리
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// 테스트
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**핵심 포인트**:

- 정규식 `/[^.[\]]+|\[(\d+)\]/g`로 경로 파싱
- `[0]` 형식의 배열 인덱스 처리
- 문자열 인덱스를 숫자로 변환

</details>

### 문제 3: set 함수 구현

경로 문자열을 기반으로 중첩된 객체의 값을 설정하는 `set` 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // 중첩 구조 생성 (마지막 키 제외)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 마지막 키의 값 설정
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 테스트
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**핵심 포인트**:

- 중첩된 객체 구조를 계층적으로 생성
- 중간 경로의 객체가 존재하는지 확인
- 마지막에 목표 값 설정

</details>

### 문제 4: get과 set의 완전한 구현

배열 인덱스 지원과 다양한 엣지 케이스 처리를 포함한 완전한 `get`과 `set` 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
// get 함수
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// set 함수
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // 중첩 구조 생성
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 값 설정
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 테스트
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> 모범 사례

### 권장 방법

```javascript
// 1. 엣지 케이스 처리
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. 정규식으로 복잡한 경로 파싱
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. set에서 다음 키의 타입 판단
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. nullish coalescing으로 기본값 처리
return result ?? defaultValue;
```

### 피해야 할 방법

```javascript
// 1. ❌ null/undefined 처리를 잊지 않기
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // 오류 가능성
}

// 2. ❌ 원본 객체를 직접 수정하지 않기 (명시적으로 요구되지 않는 한)
function set(obj, path, value) {
  // 직접 수정하는 것이 아니라 수정된 객체를 반환해야 함
}

// 3. ❌ 배열과 객체의 차이를 무시하지 않기
// 다음 키가 배열 인덱스인지 객체 키인지 판단해야 함
```

## 6. Interview Summary

> 면접 요약

### 빠른 정리

**객체 경로 파싱**:

- **get 함수**: 경로를 기반으로 값 가져오기, null/undefined 처리, 기본값 지원
- **set 함수**: 경로를 기반으로 값 설정, 중첩 구조 자동 생성
- **경로 파싱**: 정규식으로 `'a.b.c'`와 `'a.b[0].c'` 형식 처리
- **엣지 처리**: null, undefined, 빈 문자열 등의 케이스 처리

**구현 요점**:

1. 경로 파싱: `split('.')` 또는 정규식
2. 계층적 접근: 루프 또는 `reduce` 사용
3. 엣지 처리: null/undefined 체크
4. 배열 지원: `[0]` 형식의 인덱스 처리

### 면접 답변 예시

**Q: 경로를 기반으로 객체 값을 가져오는 함수를 구현해 주세요.**

> "`get` 함수를 구현합니다. 객체, 경로 문자열, 기본값을 받습니다. 먼저 엣지 케이스를 처리하여, 객체가 null이거나 경로가 문자열이 아닌 경우 기본값을 반환합니다. 그런 다음 `split('.')`으로 경로를 키 배열로 분할하고, 루프를 사용하여 객체 속성에 계층적으로 접근합니다. 매번 접근할 때 현재 값이 null 또는 undefined인지 체크하고, 그렇다면 기본값을 반환합니다. 마지막으로 결과가 undefined이면 기본값을, 아니면 결과를 반환합니다. 배열 인덱스를 지원해야 하는 경우, 정규식 `/[^.[\]]+|\[(\d+)\]/g`를 사용하여 경로를 파싱하고, `[0]` 형식의 인덱스를 처리할 수 있습니다."

**Q: 경로를 기반으로 객체 값을 설정하는 함수는 어떻게 구현하나요?**

> "`set` 함수를 구현합니다. 객체, 경로 문자열, 값을 받습니다. 먼저 경로를 키 배열로 파싱한 다음, 마지막에서 두 번째 키까지 순회하며 중첩된 객체 구조를 계층적으로 생성합니다. 각 중간 키에 대해 존재하지 않거나 객체가 아닌 경우 새 객체를 생성합니다. 다음 키가 배열 인덱스 형식인 경우 배열을 생성합니다. 마지막으로 마지막 키의 값을 설정합니다. 이를 통해 경로 내의 모든 중간 객체가 존재하도록 보장하고, 목표 값을 올바르게 설정합니다."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
