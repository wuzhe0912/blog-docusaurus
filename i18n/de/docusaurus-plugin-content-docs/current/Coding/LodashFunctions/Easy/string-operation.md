---
id: string-operation
title: 📄 String Operation
slug: /string-operation
---

## 1. Einen String eine bestimmte Anzahl von Malen wiederholen

Versuche eine Funktion zu entwerfen, die einen String eine bestimmte Anzahl von Malen wiederholt.

### I. Verwendung der `repeat()` solution(ES6+)

Da String jetzt `repeat()` unterstützt, kann es direkt verwendet werden.

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

#### Reference

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### II. Verwendung einer Schleife

Wenn `repeat()` nicht verwendet wird, kann man auch eine Schleife verwenden und durch Parameterübergabe auf positive Ganzzahlen beschränken.

```js
function repeatString(str, num) {
  // Prüfe ob es keine positive Ganzzahl ist
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('Bitte geben Sie eine positive Ganzzahl ein');
  }

  let repeatedString = '';
  for (let i = 0; i < num; i++) {
    repeatedString += str;
  }
  return repeatedString;
}
```

## 2. Dateiname oder Dateierweiterung in einem String verarbeiten

Entwirf eine `getFileExtension()`-Funktion, die die Dateierweiterung aus dem Parameter extrahiert. Falls keine Erweiterung vorhanden ist, wird der Dateiname zurückgegeben.

```js
const fileName = 'video.mp4';
const fileNameWithoutExtension = 'file';
const fileNameWithoutExtension2 = 'example.flv';
const fileNameWithoutExtension3 = 'movie.mov';
const fileNameWithoutExtension4 = '.gitignore';
```

### I. Verwendung von split zum Abrufen des Dateinamens

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

## 3. Den längsten String in einem Array finden

### I. Verwendung der `sort()`-Methode

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.sort((a, b) => b.length - a.length)[0];
};

console.log(longestString(stringArray)); // "strawberry"
```

### II. Verwendung der `reduce()`-Methode

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

## 4. String in camelCase umwandeln

Versuche eine Funktion zu entwerfen, die einen String in camelCase umwandelt.

### I. Verwendung der `replace()`-Methode

```js
const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
};

console.log(camelCase('hello-world')); // "helloWorld"
```

### II. Verwendung der `split()`-Methode

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

## 5. Häufigkeit doppelter Strings in einem Array finden

### I. Verwendung der `Map()`-Methode

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

### II. Verwendung der `reduce()`-Methode zum Zählen doppelter Strings

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

### III. Verwendung der `Object.groupBy()`-Methode(ES2023+)

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const countDuplicateString = (stringArray) => {
  return Object.groupBy(stringArray);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

## 6. Dateierweiterungen in einem Array finden und doppelte Erweiterungen filtern

### I. Verwendung der `split()`-Methode

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
