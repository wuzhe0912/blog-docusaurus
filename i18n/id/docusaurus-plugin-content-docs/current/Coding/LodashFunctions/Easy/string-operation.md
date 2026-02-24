---
id: string-operation
title: 📄 Operasi String
slug: /string-operation
---

## 1. Mengulang String Sejumlah Kali Tertentu

Rancang fungsi yang mengulang sebuah string sejumlah kali tertentu.

### I. Menggunakan `repeat()` (ES6+)

Karena String sekarang mendukung `repeat()`, Anda bisa langsung menggunakannya.

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

#### Referensi

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### II. Menggunakan Loop

Jika tidak menggunakan `repeat()`, Anda juga bisa menggunakan loop dengan validasi parameter, dibatasi pada bilangan bulat positif.

```js
function repeatString(str, num) {
  // Check if not a positive integer
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('Please enter a positive integer');
  }

  let repeatedString = '';
  for (let i = 0; i < num; i++) {
    repeatedString += str;
  }
  return repeatedString;
}
```

## 2. Mengekstrak Nama File atau Ekstensi dari String

Rancang `getFileExtension()` yang mengekstrak ekstensi file dari parameter. Jika tidak ada ekstensi, kembalikan nama filenya.

```js
const fileName = 'video.mp4';
const fileNameWithoutExtension = 'file';
const fileNameWithoutExtension2 = 'example.flv';
const fileNameWithoutExtension3 = 'movie.mov';
const fileNameWithoutExtension4 = '.gitignore';
```

### I. Menggunakan split untuk Mendapatkan Ekstensi File

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

## 3. Mencari String Terpanjang dalam Array

### I. Menggunakan Metode `sort()`

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.sort((a, b) => b.length - a.length)[0];
};

console.log(longestString(stringArray)); // "strawberry"
```

### II. Menggunakan Metode `reduce()`

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

## 4. Mengubah String menjadi camelCase

Rancang fungsi yang mengubah string menjadi camelCase.

### I. Menggunakan Metode `replace()`

```js
const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
};

console.log(camelCase('hello-world')); // "helloWorld"
```

### II. Menggunakan Metode `split()`

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

## 5. Menghitung Kemunculan String Duplikat dalam Array

### I. Menggunakan Metode `Map()`

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

### II. Menggunakan Metode `reduce()`

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

### III. Menggunakan `Object.groupBy()` (ES2023+)

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const countDuplicateString = (stringArray) => {
  return Object.groupBy(stringArray);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

## 6. Mengekstrak dan Menghapus Duplikasi Ekstensi File dari Array String

### I. Menggunakan Metode `split()`

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
