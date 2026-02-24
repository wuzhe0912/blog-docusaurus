---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Ringkasan (Overview)

JavaScript memiliki tiga kata kunci untuk mendeklarasikan variabel: `var`, `let`, dan `const`.
Ketiganya mendeklarasikan variabel, tapi berbeda dalam scope, persyaratan inisialisasi, perilaku redeklarasi, aturan penugasan ulang, dan waktu akses.

## Perbedaan Utama (Key Differences)

| Perilaku             | `var`                     | `let`                     | `const`                   |
| -------------------- | ------------------------- | ------------------------- | ------------------------- |
| Scope                | Function atau global scope | Block scope               | Block scope               |
| Inisialisasi         | Opsional                  | Opsional                  | Wajib                     |
| Redeklarasi          | Diizinkan                 | Tidak diizinkan           | Tidak diizinkan           |
| Penugasan ulang      | Diizinkan                 | Diizinkan                 | Tidak diizinkan           |
| Akses sebelum deklarasi| Mengembalikan `undefined` | Melempar `ReferenceError` | Melempar `ReferenceError` |

## Penjelasan Detail (Detailed Explanation)

### Scope

`var` memiliki function-scope (atau global-scope), sementara `let` dan `const` memiliki block-scope (termasuk blok fungsi, blok `if-else`, dan loop `for`).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var dalam block';
  let letInBlock = 'let dalam block';
  const constInBlock = 'const dalam block';
}

console.log(varInBlock); // 'var dalam block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Inisialisasi (Initialization)

`var` dan `let` bisa dideklarasikan tanpa inisialisasi, tapi `const` harus diinisialisasi saat deklarasi.

```javascript
var varVariable; // valid
let letVariable; // valid
const constVariable; // SyntaxError: Missing initializer in const declaration
```

### Redeklarasi (Redeclaration)

Dalam scope yang sama, `var` mengizinkan redeklarasi variabel yang sama, sementara `let` dan `const` tidak.

```javascript
var x = 1;
var x = 2; // valid, x sekarang 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Penugasan Ulang (Reassignment)

Variabel yang dideklarasikan dengan `var` dan `let` bisa ditugaskan ulang, sementara variabel `const` tidak bisa.

```javascript
var x = 1;
x = 2; // valid

let y = 1;
y = 2; // valid

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Catatan: meskipun variabel `const` tidak bisa ditugaskan ulang, isi objek/array tetap bisa dimutasi.

```javascript
const obj = { key: 'value' };
obj.key = 'nilai baru'; // valid
console.log(obj); // { key: 'nilai baru' }

const arr = [1, 2, 3];
arr.push(4); // valid
console.log(arr); // [1, 2, 3, 4]
```

### Akses Sebelum Deklarasi (Temporal Dead Zone)

Variabel yang dideklarasikan dengan `var` di-hoist dan diinisialisasi ke `undefined`.
`let` dan `const` juga di-hoist, tapi tidak diinisialisasi sebelum deklarasi, sehingga mengaksesnya lebih awal menghasilkan `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Pertanyaan Wawancara (Interview Question)

### Pertanyaan: jebakan klasik `setTimeout + var`

Prediksi output kode ini:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Jawaban salah yang umum

Banyak orang berpikir hasilnya: `1 2 3 4 5`

#### Output sebenarnya

```
6
6
6
6
6
```

#### Mengapa?

Pertanyaan ini melibatkan tiga konsep inti:

**1. Function scope `var`**

```javascript
// `var` tidak membuat block scope di dalam loop
for (var i = 1; i <= 5; i++) {
  // `i` ada di scope luar; semua iterasi berbagi `i` yang sama
}
console.log(i); // 6 (setelah loop berakhir)

// konsep setara `var`
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4;
  // loop berakhir
}
```

**2. Eksekusi asinkron `setTimeout`**

```javascript
// `setTimeout` bersifat asinkron dan berjalan setelah kode sinkron selesai
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Callback ini diantrekan di event loop
    console.log(i);
  }, 0);
}
// Loop selesai dulu (`i` menjadi 6), lalu callback berjalan
```

**3. Referensi closure**

```javascript
// Semua callback mereferensikan `i` yang sama
// Saat waktu eksekusi, `i` sudah bernilai 6
```

#### Solusi

**Solusi 1: Gunakan `let` (direkomendasikan) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// output: 1 2 3 4 5

// `let` secara konseptual berperilaku seperti:
{
  let i = 1; // iterasi pertama
}
{
  let i = 2; // iterasi kedua
}
{
  let i = 3; // iterasi ketiga
}
```

**Mengapa berhasil**: `let` membuat binding block-scope baru pada setiap iterasi, sehingga setiap callback menangkap nilai iterasi tersebut.

```javascript
// secara konseptual setara dengan:
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ...dan seterusnya
```

**Solusi 2: Gunakan IIFE (Immediately Invoked Function Expression)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// output: 1 2 3 4 5
```

**Mengapa berhasil**: setiap iterasi membuat function scope baru dan meneruskan `i` saat ini sebagai parameter `j`.

**Solusi 3: Gunakan parameter ketiga dari `setTimeout`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // argumen ketiga diteruskan ke callback
}
// output: 1 2 3 4 5
```

**Mengapa berhasil**: parameter setelah delay diteruskan ke fungsi callback.

**Solusi 4: Gunakan `bind`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// output: 1 2 3 4 5
```

**Mengapa berhasil**: `bind` membuat fungsi baru dengan `i` saat ini terikat sebagai argumen.

#### Perbandingan Solusi

| Solusi               | Kelebihan                | Kekurangan               | Rekomendasi |
| -------------------- | ------------------------ | ------------------------ | ----------- |
| `let`                | Ringkas, modern, jelas   | Memerlukan ES6+          | 5/5 sangat direkomendasikan |
| IIFE                 | Kompatibilitas baik      | Sintaks lebih verbose    | 3/5 bisa diterima |
| Argumen `setTimeout` | Sederhana dan langsung   | Kurang dikenal banyak developer | 4/5 direkomendasikan |
| `bind`               | Gaya fungsional          | Sedikit kurang terbaca   | 3/5 bisa diterima |

#### Pertanyaan Lanjutan

**Q1: Bagaimana jika kita ubah menjadi ini?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Jawaban**: mencetak `6` sekali per detik, total 5 kali (pada 1 detik, 2 detik, 3 detik, 4 detik, dan 5 detik).

**Q2: Bagaimana kita mencetak 1, 2, 3, 4, 5 secara berurutan, satu per detik?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// mencetak 1 setelah 1 detik
// mencetak 2 setelah 2 detik
// mencetak 3 setelah 3 detik
// mencetak 4 setelah 4 detik
// mencetak 5 setelah 5 detik
```

#### Fokus Wawancara

Pertanyaan ini menguji:

1. ✅ **Scope `var`**: function scope vs block scope
2. ✅ **Event Loop**: eksekusi sinkron vs asinkron
3. ✅ **Closure**: bagaimana fungsi menangkap variabel luar
4. ✅ **Solusi**: berbagai pendekatan dan pertimbangan

Alur jawaban yang direkomendasikan saat wawancara:

- Nyatakan hasil yang benar terlebih dahulu (`6 6 6 6 6`)
- Jelaskan penyebabnya (scope `var` + `setTimeout` asinkron)
- Berikan perbaikan (utamakan `let`, lalu sebutkan alternatif)
- Tunjukkan pemahaman tentang internal JavaScript

## Best Practice

1. Utamakan `const` terlebih dahulu: jika variabel tidak perlu ditugaskan ulang, `const` meningkatkan keterbacaan dan kemudahan pemeliharaan.
2. Gunakan `let` ketika penugasan ulang diperlukan.
3. Hindari `var` di JavaScript modern: perilaku scope/hoisting-nya sering menyebabkan masalah yang tidak terduga.
4. Pertimbangkan kompatibilitas browser: untuk browser lama, gunakan transpiler seperti Babel untuk mengubah `let`/`const`.

## Topik Terkait (Related Topics)

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
