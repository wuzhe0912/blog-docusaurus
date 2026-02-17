---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> Set과 Map이란 무엇인가?

`Set`과 `Map`은 ES6에서 도입된 두 가지 새로운 데이터 구조로, 기존의 객체와 배열보다 특정 시나리오에 더 적합한 솔루션을 제공합니다.

### Set (집합)

**정의**: `Set`은 **값이 고유한** 집합으로, 수학에서의 집합 개념과 유사합니다.

**특징**:

- 저장된 값은 **중복되지 않음**
- `===`를 사용하여 값의 동등성을 판단
- 삽입 순서를 유지
- 모든 유형의 값을 저장할 수 있음 (원시 타입 또는 객체)

**기본 사용법**:

```javascript
// Set 생성
const set = new Set();

// 값 추가
set.add(1);
set.add(2);
set.add(2); // 중복 값은 추가되지 않음
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// 값이 존재하는지 확인
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// 값 삭제
set.delete(2);
console.log(set.has(2)); // false

// Set 비우기
set.clear();
console.log(set.size); // 0
```

**배열에서 Set 생성**:

```javascript
// 배열에서 중복 값 제거
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// 배열로 변환
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// 축약형
const uniqueArr2 = [...new Set(arr)];
```

### Map (맵)

**정의**: `Map`은 **키-값 쌍**의 집합으로, 객체와 유사하지만 키에 모든 유형을 사용할 수 있습니다.

**특징**:

- 키에 모든 유형을 사용할 수 있음 (문자열, 숫자, 객체, 함수 등)
- 삽입 순서를 유지
- `size` 속성이 있음
- 반복 순서가 삽입 순서와 일치

**기본 사용법**:

```javascript
// Map 생성
const map = new Map();

// 키-값 쌍 추가
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// 값 가져오기
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// 키가 존재하는지 확인
console.log(map.has('name')); // true

// 키-값 쌍 삭제
map.delete('name');

// 크기 가져오기
console.log(map.size); // 3

// Map 비우기
map.clear();
```

**배열에서 Map 생성**:

```javascript
// 2차원 배열에서 생성
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// 객체에서 생성
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Set과 배열의 차이

| 특성        | Set                    | Array                    |
| ----------- | ---------------------- | ------------------------ |
| 중복 값     | 허용하지 않음          | 허용                     |
| 인덱스 접근 | 지원하지 않음          | 지원                     |
| 검색 성능   | O(1)                   | O(n)                     |
| 삽입 순서   | 유지                   | 유지                     |
| 주요 메서드 | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**사용 시나리오**:

```javascript
// ✅ Set 사용에 적합: 고유한 값이 필요
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Set 사용에 적합: 빠른 존재 여부 확인
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('홈페이지를 이미 방문함');
}

// ✅ Array 사용에 적합: 인덱스나 중복 값이 필요
const scores = [100, 95, 100, 90]; // 중복 허용
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Map과 객체의 차이

| 특성        | Map          | Object                  |
| ----------- | ------------ | ----------------------- |
| 키 유형     | 모든 유형    | 문자열 또는 Symbol      |
| 크기        | `size` 속성  | 수동 계산 필요          |
| 기본 키     | 없음         | 프로토타입 체인 있음    |
| 반복 순서   | 삽입 순서    | ES2015+ 삽입 순서 유지  |
| 성능        | 빈번한 추가/삭제 시 빠름 | 일반적인 경우 빠름 |
| JSON        | 직접 지원하지 않음 | 네이티브 지원      |

**사용 시나리오**:

```javascript
// ✅ Map 사용에 적합: 키가 문자열이 아닌 경우
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Map 사용에 적합: 빈번한 추가/삭제가 필요
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Object 사용에 적합: 정적 구조, JSON이 필요
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // 직접 직렬화 가능
```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 배열 중복 값 제거

배열에서 중복 값을 제거하는 함수를 구현하세요.

```javascript
function removeDuplicates(arr) {
  // 구현하세요
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**방법 1: Set 사용 (권장)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**방법 2: filter + indexOf 사용**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**방법 3: reduce 사용**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**성능 비교**:

- Set 방법: O(n), 가장 빠름
- filter + indexOf: O(n²), 느림
- reduce + includes: O(n²), 느림

</details>

### 문제 2: 배열에 중복 값이 있는지 확인

배열에 중복 값이 있는지 확인하는 함수를 구현하세요.

```javascript
function hasDuplicates(arr) {
  // 구현하세요
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**방법 1: Set 사용 (권장)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**방법 2: Set의 has 메서드 사용**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**방법 3: indexOf 사용**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**성능 비교**:

- Set 방법 1: O(n), 가장 빠름
- Set 방법 2: O(n), 평균적으로 조기 종료 가능
- indexOf 방법: O(n²), 느림

</details>

### 문제 3: 요소 출현 횟수 세기

배열에서 각 요소의 출현 횟수를 세는 함수를 구현하세요.

```javascript
function countOccurrences(arr) {
  // 구현하세요
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**방법 1: Map 사용 (권장)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**방법 2: reduce + Map 사용**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**방법 3: 객체로 변환**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Map 사용의 장점**:

- 키에 모든 유형을 사용할 수 있음 (객체, 함수 등)
- `size` 속성이 있음
- 반복 순서가 삽입 순서와 일치

</details>

### 문제 4: 두 배열의 교집합 찾기

두 배열의 교집합(공통 요소)을 찾는 함수를 구현하세요.

```javascript
function intersection(arr1, arr2) {
  // 구현하세요
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**방법 1: Set 사용**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**방법 2: filter + Set 사용**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**방법 3: filter + includes 사용**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**성능 비교**:

- Set 방법: O(n + m), 가장 빠름
- filter + includes: O(n × m), 느림

</details>

### 문제 5: 두 배열의 차집합 찾기

두 배열의 차집합(arr1에는 있지만 arr2에는 없는 요소)을 찾는 함수를 구현하세요.

```javascript
function difference(arr1, arr2) {
  // 구현하세요
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**방법 1: Set 사용**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**방법 2: Set으로 중복 제거 후 필터링**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**방법 3: includes 사용**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**성능 비교**:

- Set 방법: O(n + m), 가장 빠름
- includes 방법: O(n × m), 느림

</details>

### 문제 6: LRU Cache 구현

Map을 사용하여 LRU(Least Recently Used) 캐시를 구현하세요.

```javascript
class LRUCache {
  constructor(capacity) {
    // 구현하세요
  }

  get(key) {
    // 구현하세요
  }

  put(key, value) {
    // 구현하세요
  }
}
```

<details>
<summary>클릭하여 답변 보기</summary>

**구현**:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // 해당 키를 맨 뒤로 이동 (최근 사용을 나타냄)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // 키가 이미 존재하면 먼저 삭제
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 용량이 가득 차면 가장 오래된 키(첫 번째)를 삭제
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // 키-값 쌍 추가 (자동으로 맨 뒤에 배치)
    this.cache.set(key, value);
  }
}

// 사용 예제
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // 키 2 제거
console.log(cache.get(2)); // -1 (이미 제거됨)
console.log(cache.get(3)); // 'three'
```

**설명**:

- Map은 삽입 순서를 유지하며, 첫 번째 키가 가장 오래된 것
- `get` 시 키를 맨 뒤로 이동하여 최근 사용을 나타냄
- `put` 시 용량이 가득 차면 첫 번째 키를 삭제

</details>

### 문제 7: 객체를 Map의 키로 사용

다음 코드의 출력 결과를 설명하세요.

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>클릭하여 답변 보기</summary>

```javascript
// 'first'
// 'second'
// 2
```

**설명**:

- `obj1`과 `obj2`는 내용이 같지만 **다른 객체 인스턴스**임
- Map은 **참조 비교**(reference comparison)를 사용하며, 값 비교가 아님
- 따라서 `obj1`과 `obj2`는 다른 키로 취급됨
- 일반 객체를 Map으로 사용하면, 객체가 문자열 `[object Object]`로 변환되어 모든 객체가 같은 키가 됨

**일반 객체와의 비교**:

```javascript
// 일반 객체: 키가 문자열로 변환됨
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (덮어씌워짐)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]'] (키가 하나뿐)

// Map: 객체 참조를 유지
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet과 WeakMap

> WeakSet과 WeakMap의 차이

### WeakSet

**특징**:

- **객체**만 저장 가능 (원시 타입은 저장 불가)
- **약한 참조**: 객체에 다른 참조가 없으면 가비지 컬렉션됨
- `size` 속성이 없음
- 반복 불가
- `clear` 메서드가 없음

**사용 시나리오**: 객체 마킹, 메모리 누수 방지

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// obj1에 다른 참조가 없으면 가비지 컬렉션됨
// weakSet의 참조도 자동으로 제거됨
```

### WeakMap

**특징**:

- 키는 **객체**만 가능 (원시 타입 불가)
- **약한 참조**: 키 객체에 다른 참조가 없으면 가비지 컬렉션됨
- `size` 속성이 없음
- 반복 불가
- `clear` 메서드가 없음

**사용 시나리오**: 객체의 프라이빗 데이터 저장, 메모리 누수 방지

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// obj1에 다른 참조가 없으면 가비지 컬렉션됨
// weakMap의 키-값 쌍도 자동으로 제거됨
```

### WeakSet/WeakMap vs Set/Map 비교

| 특성            | Set/Map        | WeakSet/WeakMap |
| --------------- | -------------- | --------------- |
| 키/값 유형      | 모든 유형      | 객체만          |
| 약한 참조       | 아니오         | 예              |
| 반복 가능       | 예             | 아니오          |
| size 속성       | 있음           | 없음            |
| clear 메서드    | 있음           | 없음            |
| 가비지 컬렉션   | 자동 제거 안 됨 | 자동 제거됨    |

## 6. Best Practices

> 모범 사례

### 권장 방법

```javascript
// 1. 고유한 값이 필요하면 Set 사용
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. 빠른 검색이 필요하면 Set 사용
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // 접근 허용
}

// 3. 키가 문자열이 아니면 Map 사용
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. 빈번한 추가/삭제가 필요하면 Map 사용
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. 객체 데이터를 연결하면서 메모리 누수를 피하려면 WeakMap 사용
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### 피해야 할 방법

```javascript
// 1. Set을 배열의 모든 기능 대체로 사용하지 않기
// ❌ 나쁨: 인덱스가 필요한데 Set 사용
const set = new Set([1, 2, 3]);
// set[0] // undefined, 인덱스로 접근 불가

// ✅ 좋음: 인덱스가 필요하면 배열 사용
const arr = [1, 2, 3];
arr[0]; // 1

// 2. Map을 객체의 모든 기능 대체로 사용하지 않기
// ❌ 나쁨: 단순한 정적 구조에 Map 사용
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ 좋음: 단순한 구조에는 객체 사용
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Set과 Map을 혼동하지 않기
// ❌ 오류: Set에는 키-값 쌍이 없음
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ 올바름: Map에는 키-값 쌍이 있음
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> 면접 요약

### 빠른 기억

**Set (집합)**:

- 값이 고유하며 중복 없음
- 빠른 검색: O(1)
- 적합: 중복 제거, 빠른 존재 여부 확인

**Map (맵)**:

- 키-값 쌍, 키에 모든 유형 사용 가능
- 삽입 순서 유지
- 적합: 문자열이 아닌 키, 빈번한 추가/삭제

**WeakSet/WeakMap**:

- 약한 참조, 자동 가비지 컬렉션
- 키/값은 객체만 가능
- 적합: 메모리 누수 방지

### 면접 답변 예시

**Q: 언제 배열 대신 Set을 사용해야 하나요?**

> "값의 고유성을 보장해야 하거나 값의 존재 여부를 빠르게 확인해야 할 때 Set을 사용해야 합니다. Set의 `has` 메서드는 O(1) 시간 복잡도이며, 배열의 `includes`는 O(n)입니다. 예를 들어, 배열의 중복 값을 제거하거나 사용자 권한을 확인할 때 Set이 더 효율적입니다."

**Q: Map과 객체의 차이는 무엇인가요?**

> "Map의 키에는 객체, 함수 등 모든 유형을 사용할 수 있지만, 객체의 키는 문자열 또는 Symbol만 가능합니다. Map에는 `size` 속성이 있어 직접 크기를 가져올 수 있지만, 객체는 수동으로 계산해야 합니다. Map은 삽입 순서를 유지하며 프로토타입 체인이 없어 순수 데이터 저장에 적합합니다. 객체를 키로 사용해야 하거나 빈번한 추가/삭제가 필요한 경우 Map이 더 나은 선택입니다."

**Q: WeakMap과 Map의 차이는 무엇인가요?**

> "WeakMap의 키는 객체만 가능하며 약한 참조를 사용합니다. 키 객체에 다른 참조가 없으면 WeakMap의 해당 항목이 자동으로 가비지 컬렉션되어 메모리 누수를 방지할 수 있습니다. WeakMap은 반복이 불가능하며 `size` 속성도 없습니다. 객체의 프라이빗 데이터나 메타데이터 저장에 적합하며, 객체가 소멸되면 관련 데이터도 자동으로 제거됩니다."

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
