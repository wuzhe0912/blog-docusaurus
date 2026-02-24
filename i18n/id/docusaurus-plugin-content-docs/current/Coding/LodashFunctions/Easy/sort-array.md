---
id: sort-array
title: 📄 Urutkan Array
slug: /sort-array
---

## Deskripsi Soal

Diberikan sebuah array angka, gunakan fungsi `sort` untuk mengurutkan array tersebut. Berikan solusi untuk kedua skenario berikut:

1. Urutan naik (terkecil ke terbesar)
2. Urutan turun (terbesar ke terkecil)

### Pengurutan Naik

```js
const numbers = [10, 5, 50, 2, 200];

// Using a comparison function
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Pengurutan Turun

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Menyisipkan String Secara Sengaja

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

Namun, solusi ini tidak dapat menangani string yang tidak bisa dikonversi menjadi angka, seperti `'iphone'`, `'ipad'`, dan sebagainya. String tersebut akan dikonversi menjadi `NaN`, dan meskipun mungkin berada di akhir array hasil pengurutan, hasilnya bisa berbeda di tiap browser. Dalam kasus seperti ini, pertimbangkan memakai `filter` terlebih dahulu untuk menghapus dan menyusun ulang array.

### Pengurutan Object

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
