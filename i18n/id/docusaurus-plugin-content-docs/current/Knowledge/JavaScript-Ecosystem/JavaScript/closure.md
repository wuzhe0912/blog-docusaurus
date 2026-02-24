---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. Apa itu Closure?

> Apa itu closure?

Untuk memahami closure, Anda harus terlebih dahulu memahami scope variabel JavaScript dan bagaimana sebuah fungsi mengakses variabel luar.

### Scope Variabel (Variable Scope)

Di JavaScript, scope variabel umumnya dibahas sebagai global scope dan function scope (serta block scope dengan `let`/`const`).

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // mencetak 1 2 3, bisa mengakses global + scope fungsi luar
  }

  childFunction();
}

parentFunction();
console.log(a); // mencetak 1, bisa mengakses global scope
console.log(b, c); // error: tidak bisa mengakses variabel di dalam function scope
```

### Contoh Closure

Closure terbentuk ketika fungsi anak didefinisikan di dalam fungsi induk dan dikembalikan, sehingga fungsi anak tetap memiliki akses ke lingkungan leksikal induk (yang menghindari garbage collection langsung untuk variabel yang ditangkap).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Hitungan saat ini: ${count}`);
  };
}

const counter = parentFunction();

counter(); // mencetak Hitungan saat ini: 1
counter(); // mencetak Hitungan saat ini: 2
// `count` dipertahankan karena childFunction masih ada dan menyimpan referensi
```

Hati-hati: closure menyimpan variabel di memori. Penggunaan berlebihan bisa meningkatkan penggunaan memori dan menurunkan performa.

## 2. Buat fungsi yang memenuhi kondisi berikut

> Buat fungsi (menggunakan konsep closure) yang memenuhi:

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### Solusi Pertama: dua fungsi

Pisahkan menjadi dua gaya fungsi:

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// gunakan closure untuk menyimpan value
function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Solusi Kedua: satu fungsi

Pendekatan pertama mungkin ditolak saat wawancara jika mereka meminta satu fungsi yang menangani kedua gaya.

```js
function plus(value, subValue) {
  // tentukan perilaku berdasarkan jumlah argumen
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Manfaatkan fitur closure untuk menambah angka

> Gunakan closure untuk mengimplementasikan penghitungan bertahap:

```js
function plus() {
  // kode
}

var obj = plus();
obj.add(); // mencetak 1
obj.add(); // mencetak 2
```

### Solusi Pertama: kembalikan wadah variabel

Gunakan gaya fungsi biasa di sini (arrow function tidak diperlukan).

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Solusi Kedua: kembalikan objek secara langsung

Anda juga bisa membungkus objek langsung di dalam `return`.

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. Apa yang akan dicetak pada pemanggilan fungsi bersarang ini?

> Apa output dari pemanggilan fungsi bersarang ini?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Analisis

**Output:**

```
hello
TypeError: aa is not a function
```

### Alur Eksekusi Detail

```js
// Eksekusi a(b(c))
// JavaScript mengevaluasi pemanggilan fungsi dari dalam ke luar

// Langkah 1: evaluasi b(c) di dalam
b(c)
  ↓
// c diteruskan ke b
// di dalam b, bb() berarti c()
c() // mencetak 'hello'
  ↓
// b tidak punya pernyataan return
// jadi mengembalikan undefined
return undefined

// Langkah 2: evaluasi a(undefined)
a(undefined)
  ↓
// undefined diteruskan ke a
// a mencoba aa(), yaitu undefined()
undefined() // ❌ TypeError: aa is not a function
```

### Mengapa?

#### 1. Urutan evaluasi fungsi (dalam -> luar)

```js
// Contoh
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. eksekusi multiply(2, 3) dulu -> 6
           └────── 3. lalu eksekusi add(6)

// Ide yang sama
a(b(c))
  ↑ ↑
  | └─ 1. evaluasi b(c)
  └─── 2. lalu evaluasi a(hasil dari b(c))
```

#### 2. Fungsi tanpa `return` mengembalikan `undefined`

```js
function b(bb) {
  bb(); // dieksekusi, tapi tidak ada return
} // implicit return undefined

// Setara dengan
function b(bb) {
  bb();
  return undefined; // ditambahkan secara implisit oleh JavaScript
}
```

#### 3. Memanggil non-function menghasilkan TypeError

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// kasus error lainnya
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Bagaimana cara memperbaikinya?

#### Metode 1: buat `b` mengembalikan sebuah fungsi

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b dieksekusi');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// output:
// hello
// b dieksekusi
```

#### Metode 2: teruskan referensi fungsi, jangan eksekusi terlalu dini

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // mencetak 'hello'

// atau
a(() => b(c)); // mencetak 'hello'
```

#### Metode 3: ubah alur eksekusi

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// eksekusi secara terpisah
b(c); // mencetak 'hello'
a(() => console.log('a dieksekusi')); // mencetak 'a dieksekusi'
```

### Variasi Wawancara Terkait

#### Pertanyaan 1: bagaimana jika kita ubah seperti ini?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```
hello
TypeError: aa is not a function
```

**Penjelasan:**

1. `b(c)` -> menjalankan `c()`, mencetak `'hello'`, mengembalikan `'world'`
2. `a('world')` -> mencoba mengeksekusi `'world'()`
3. `'world'` adalah string, bukan fungsi, jadi menghasilkan TypeError

</details>

#### Pertanyaan 2: bagaimana jika semua fungsi mengembalikan nilai?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```
[Function: c]
hello
```

**Penjelasan:**

1. `b(c)` -> mengembalikan fungsi `c` itu sendiri (tidak dieksekusi)
2. `a(c)` -> mengembalikan fungsi `c`
3. `result` adalah fungsi `c`
4. `result()` -> mengeksekusi `c()`, mengembalikan `'hello'`

</details>

### Poin Penting (Key Takeaways)

```javascript
// prioritas pemanggilan fungsi
a(b(c))
  ↓
// 1. evaluasi pemanggilan dalam terlebih dahulu
b(c) // jika b tidak punya return, hasilnya undefined
  ↓
// 2. lalu evaluasi pemanggilan luar
a(undefined) // memanggil undefined() menghasilkan error

// perbaikan
// ✅ 1. pastikan fungsi tengah mengembalikan sebuah fungsi
// ✅ 2. atau bungkus dengan arrow function
a(() => b(c))
```

## Referensi

- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
