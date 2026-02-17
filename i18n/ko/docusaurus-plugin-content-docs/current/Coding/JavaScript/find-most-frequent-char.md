---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> 문제 설명

문자열을 받아서 가장 많이 나타나는 문자를 반환하는 함수를 구현하세요.

### 예시

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> 구현 방법

### 방법 1: 객체를 사용한 카운팅 (기본 버전)

**아이디어**: 문자열을 순회하며 객체로 각 문자의 출현 횟수를 기록한 후, 가장 많이 나타나는 문자를 찾습니다.

```javascript
function findMostFrequentChar(str) {
  // 문자와 카운트를 저장할 객체 초기화
  const charCount = {};

  // 최대 카운트와 문자를 기록할 변수 초기화
  let maxCount = 0;
  let maxChar = '';

  // 문자열 순회
  for (let char of str) {
    // 문자가 객체에 없으면 카운트를 0으로 설정
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // 이 문자의 카운트 증가
    charCount[char]++;

    // 이 문자의 카운트가 최대 카운트보다 크면
    // 최대 카운트와 최대 문자 업데이트
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // 최대 문자 반환
  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**시간 복잡도**: O(n), n은 문자열 길이
**공간 복잡도**: O(k), k는 서로 다른 문자의 수

### 방법 2: 먼저 카운트한 후 최대값 찾기 (2단계)

**아이디어**: 먼저 한 번 순회하여 모든 문자의 출현 횟수를 계산하고, 다시 한 번 순회하여 최대값을 찾습니다.

```javascript
function findMostFrequentChar(str) {
  // 1단계: 각 문자의 출현 횟수 계산
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // 2단계: 가장 많이 나타나는 문자 찾기
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**장점**: 로직이 더 명확하고 단계별로 처리
**단점**: 두 번의 순회가 필요

### 방법 3: Map 사용 (ES6)

**아이디어**: Map을 사용하여 문자와 카운트의 매핑 관계를 저장합니다.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**장점**: Map을 사용하여 더 현대적인 JavaScript 스타일에 부합
**단점**: 간단한 시나리오에서는 객체가 더 직관적일 수 있음

### 방법 4: reduce 사용 (함수형 스타일)

**아이디어**: `reduce`와 `Object.entries`를 사용하여 구현합니다.

```javascript
function findMostFrequentChar(str) {
  // 각 문자의 출현 횟수 계산
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // 가장 많이 나타나는 문자 찾기
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// 테스트
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**장점**: 함수형 스타일, 코드가 간결
**단점**: 가독성이 떨어지고 성능도 약간 낮음

### 방법 5: 동일한 최대값이 여러 개인 경우 처리

**아이디어**: 여러 문자의 출현 횟수가 같고 모두 최대값인 경우, 배열을 반환하거나 처음 만난 것을 반환합니다.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 각 문자의 출현 횟수 계산
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 출현 횟수가 최대값과 같은 모든 문자 찾기
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 처음 만난 것을 반환 (또는 전체 배열 반환)
  return mostFrequentChars[0];
  // 또는 전체 반환: return mostFrequentChars;
}

// 테스트
console.log(findMostFrequentChar('aabbcc')); // 'a' (처음 만난 것)
```

## 3. Edge Cases

> 엣지 케이스 처리

### 빈 문자열 처리

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // 또는 throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### 대소문자 처리

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('Hello', false)); // 'l' (대소문자 구분 안 함)
console.log(findMostFrequentChar('Hello', true)); // 'l' (대소문자 구분)
```

### 공백과 특수 문자 처리

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('hello world', true)); // 'l' (공백 무시)
console.log(findMostFrequentChar('hello world', false)); // ' ' (공백)
```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 문제 1: 기본 구현

문자열에서 가장 많이 나타나는 문자를 찾는 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**핵심 포인트**:

- 객체 또는 Map을 사용하여 각 문자의 출현 횟수 기록
- 순회하면서 동시에 최대값 업데이트
- 시간 복잡도 O(n), 공간 복잡도 O(k)

</details>

### 문제 2: 최적화 버전

위 함수를 최적화하여 동일한 최대값이 여러 개인 경우를 처리할 수 있게 하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 1단계: 각 문자의 출현 횟수 계산
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 2단계: 출현 횟수가 최대값과 같은 모든 문자 찾기
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 필요에 따라 첫 번째 또는 전체 반환
  return mostFrequentChars[0]; // 또는 mostFrequentChars 반환
}

// 테스트
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### 문제 3: Map을 사용한 구현

ES6의 Map을 사용하여 이 함수를 구현하세요.

<details>
<summary>클릭하여 답안 보기</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// 테스트
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: 동적 키-값 쌍에 더 적합하며, 키가 모든 타입이 될 수 있음
- **Object**: 더 간단하고 직관적이며, 문자열 키에 적합

</details>

## 5. Best Practices

> 모범 사례

### 권장 방법

```javascript
// 1. 명확한 변수 이름 사용
function findMostFrequentChar(str) {
  const charCount = {}; // 용도를 명확히 표현
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. 엣지 케이스 처리
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. 순회하면서 동시에 최대값 업데이트 (한 번의 순회)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### 피해야 할 방법

```javascript
// 1. 두 번의 순회를 사용하지 않기 (필요한 경우 제외)
// ❌ 성능이 떨어짐
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // 두 번째 순회
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. 빈 문자열 처리를 잊지 않기
// ❌ undefined를 반환할 수 있음
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // 빈 문자열일 때 maxChar는 ''
}

// 3. 지나치게 복잡한 함수형 작성법을 사용하지 않기 (팀 관행이 아닌 한)
// ❌ 가독성이 떨어짐
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> 면접 요약

### 빠른 정리

**구현 요점**:

1. 객체 또는 Map을 사용하여 각 문자의 출현 횟수 기록
2. 순회하면서 동시에 최대값 업데이트
3. 시간 복잡도 O(n), 공간 복잡도 O(k)
4. 엣지 케이스 처리 (빈 문자열, 대소문자 등)

**최적화 방향**:

- 한 번의 순회로 완료 (카운팅과 최대값 찾기를 동시에)
- Map을 사용하여 복잡한 시나리오 처리
- 동일한 최대값이 여러 개인 경우 처리
- 대소문자, 공백 등 특수한 경우 고려

### 면접 답변 예시

**Q: 문자열에서 가장 많이 나타나는 문자를 찾는 함수를 구현해 주세요.**

> "객체를 사용하여 각 문자의 출현 횟수를 기록하고, 문자열을 순회하면서 동시에 최대값을 업데이트합니다. 구체적인 구현은: 빈 객체 charCount를 초기화하여 문자와 카운트를 저장하고, maxCount와 maxChar 변수를 초기화합니다. 그런 다음 문자열을 순회하며, 각 문자에 대해 객체에 없으면 0으로 초기화하고 카운트를 증가시킵니다. 현재 문자의 카운트가 maxCount보다 크면 maxCount와 maxChar를 업데이트합니다. 마지막으로 maxChar를 반환합니다. 이 방법의 시간 복잡도는 O(n), 공간 복잡도는 O(k)입니다. 여기서 n은 문자열 길이, k는 서로 다른 문자의 수입니다."

## Reference

- [MDN - String](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
