---
id: string-operation
title: 📄 String Operation
slug: /string-operation
---

## 1. Répéter un String un nombre spécifié de fois

Essayez de concevoir une fonction qui permet de répéter un string un nombre spécifié de fois.

### I. Utilisation de `repeat()` solution(ES6+)

Comme String supporte désormais `repeat()`, on peut l'utiliser directement.

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

#### Reference

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### II. Utilisation d'une boucle

Si on n'utilise pas `repeat()`, on peut aussi utiliser une boucle, en limitant via les paramètres aux entiers positifs.

```js
function repeatString(str, num) {
  // Vérifier si ce n'est pas un entier positif
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('Veuillez entrer un entier positif');
  }

  let repeatedString = '';
  for (let i = 0; i < num; i++) {
    repeatedString += str;
  }
  return repeatedString;
}
```

## 2. Traiter le nom de fichier ou l'extension dans un string

Essayez de concevoir une fonction `getFileExtension()` qui récupère l'extension du fichier depuis le paramètre. S'il n'y a pas d'extension, elle retourne le nom du fichier.

```js
const fileName = 'video.mp4';
const fileNameWithoutExtension = 'file';
const fileNameWithoutExtension2 = 'example.flv';
const fileNameWithoutExtension3 = 'movie.mov';
const fileNameWithoutExtension4 = '.gitignore';
```

### I. Utilisation de split pour obtenir le nom du fichier

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

## 3. Trouver la chaîne la plus longue dans un tableau

### I. Utilisation de la méthode `sort()`

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.sort((a, b) => b.length - a.length)[0];
};

console.log(longestString(stringArray)); // "strawberry"
```

### II. Utilisation de la méthode `reduce()`

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

## 4. Convertir une chaîne en camelCase

Essayez de concevoir une fonction qui convertit une chaîne en camelCase.

### I. Utilisation de la méthode `replace()`

```js
const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
};

console.log(camelCase('hello-world')); // "helloWorld"
```

### II. Utilisation de la méthode `split()`

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

## 5. Trouver la fréquence des chaînes dupliquées dans un tableau

### I. Utilisation de la méthode `Map()`

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

### II. Utilisation de la méthode `reduce()` pour compter les chaînes dupliquées

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

### III. Utilisation de la méthode `Object.groupBy()`(ES2023+)

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const countDuplicateString = (stringArray) => {
  return Object.groupBy(stringArray);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

## 6. Trouver les extensions de fichiers dans un tableau et filtrer les extensions dupliquées

### I. Utilisation de la méthode `split()`

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
