---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Perbedaan Utama (Key Differences)

- **`undefined`**:
  - Menunjukkan bahwa variabel telah dideklarasikan tetapi belum diberi nilai.
  - Ini adalah nilai default untuk variabel yang belum diinisialisasi.
  - Sebuah fungsi mengembalikan `undefined` jika tidak ada nilai return eksplisit yang diberikan.
- **`null`**:
  - Merepresentasikan nilai kosong atau tidak ada nilai.
  - Biasanya ditetapkan secara eksplisit sebagai `null`.
  - Digunakan untuk menunjukkan bahwa variabel secara sengaja tidak menunjuk ke apapun.

## Contoh (Example)

```js
let x;
console.log(x); // output: undefined

function foo() {}
console.log(foo()); // output: undefined

let y = null;
console.log(y); // output: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // output: null
```

## Validasi dengan `typeof`

```js
console.log(typeof undefined); // output: "undefined"
console.log(typeof null); // output: "object"

console.log(null == undefined); // output: true
console.log(null === undefined); // output: false
```
