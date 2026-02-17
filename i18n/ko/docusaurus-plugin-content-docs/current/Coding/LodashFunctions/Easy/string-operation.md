---
id: string-operation
title: 📄 String Operation
slug: /string-operation
---

## 1. String을 지정된 횟수만큼 반복 조작

문자열을 지정된 횟수만큼 반복하는 함수를 설계해 보세요.

### I. `repeat()` solution(ES6+) 사용

현재 String은 `repeat()`를 지원하므로 직접 사용할 수 있습니다.

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

#### Reference

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### II. 루프 사용

`repeat()`를 사용하지 않는 경우, 루프를 사용하여 매개변수를 통해 양의 정수 조건에서만 동작하도록 제약할 수 있습니다.

```js
function repeatString(str, num) {
  // 양의 정수가 아닌지 검사
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('양의 정수를 입력해 주세요');
  }

  let repeatedString = '';
  for (let i = 0; i < num; i++) {
    repeatedString += str;
  }
  return repeatedString;
}
```

## 2. String에서 파일명 또는 확장자 처리

`getFileExtension()`을 설계하여 매개변수에서 동영상의 확장자 형식을 가져옵니다. 확장자가 없으면 파일명을 반환합니다.

```js
const fileName = 'video.mp4';
const fileNameWithoutExtension = 'file';
const fileNameWithoutExtension2 = 'example.flv';
const fileNameWithoutExtension3 = 'movie.mov';
const fileNameWithoutExtension4 = '.gitignore';
```

### I. split을 사용하여 파일명 가져오기

```js
const getFileExtension = (fileName) => {
  const fileNameSplit = fileName.split('.');
  return fileNameSplit[fileNameSplit.length - 1];
};

console.log(getFileExtension(fileName)); // "mp4"
console.log(getFileExtension(fileNameWithoutExtension)); // "file"
console.log(getFileExtension(fileNameWithoutExtension2)); // "flv"
console.log(getFileExtension(fileNameWithoutExtension3)); // "mov"
console.log(getFileExtension(fileNameWithoutExtension4)); // ""
```

## 3. 배열에서 가장 긴 문자열 찾기

### I. `sort()` 메서드 사용

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.sort((a, b) => b.length - a.length)[0];
};

console.log(longestString(stringArray)); // "strawberry"
```

### II. `reduce()` 메서드 사용

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.reduce(
    (acc, cur) => (acc.length > cur.length ? acc : cur),
    ''
  );
};

console.log(longestString(stringArray)); // "strawberry"
```

## 4. 문자열을 카멜케이스로 변환

문자열을 카멜케이스로 변환하는 함수를 설계해 보세요.

### I. `replace()` 메서드 사용

```js
const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
};

console.log(camelCase('hello-world')); // "helloWorld"
```

### II. `split()` 메서드 사용

```js
const camelCase = (str) => {
  return str
    .split('-')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
};

console.log(camelCase('hello-world')); // "helloWorld"
```

## 5. 배열에서 중복 문자열의 출현 횟수 찾기

### I. `Map()` 메서드 사용

```js
const stringArray = [
  'apple',
  'banana',
  'orange',
  'kiwi',
  'strawberry',
  'apple',
];

const countDuplicateString = (stringArray) => {
  const map = new Map();
  stringArray.forEach((item) => {
    map.set(item, (map.get(item) || 0) + 1);
  });
  return Object.fromEntries(map);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

### II. `reduce()` 메서드로 중복 문자열 횟수 찾기

```js
const stringArray = [
  'apple',
  'banana',
  'orange',
  'kiwi',
  'strawberry',
  'apple',
];

const countDuplicateString = (stringArray) => {
  return stringArray.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

### III. `Object.groupBy()` 메서드 사용(ES2023+)

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const countDuplicateString = (stringArray) => {
  return Object.groupBy(stringArray);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

## 6. 배열에서 문자열의 확장자를 찾고 중복 확장자 필터링

### I. `split()` 메서드 사용

```js
const files = [
  'document.docx',
  'image.jpg',
  'script.js',
  'style.css',
  'data.json',
  'image.png',
  'new-image.png',
];

const getFileExtension = (files) => {
  return files
    .map((file) => file.split('.').pop())
    .filter((file, index, self) => self.indexOf(file) === index);
};

console.log(getFileExtension(files)); // ["docx", "jpg", "js", "css", "json", "png"]
```
