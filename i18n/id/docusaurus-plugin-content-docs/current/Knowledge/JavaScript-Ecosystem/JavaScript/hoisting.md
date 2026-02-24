---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. Apa itu Hoisting?

Eksekusi JavaScript dapat dilihat sebagai dua fase: pembuatan (creation) dan eksekusi (execution).

```js
var name = 'Pitt';
console.log(name); // mencetak Pitt
```

Dengan hoisting, engine secara konseptual menangani deklarasi terlebih dahulu dan penugasan kemudian:

```js
// pembuatan
var name;

// eksekusi
name = 'Pitt';
console.log(name);
```

Fungsi berperilaku berbeda dari variabel. Deklarasi fungsi diikat selama fase pembuatan:

```js
getName();

function getName() {
  console.log('string'); // mencetak string
}
```

Ini berfungsi karena deklarasi fungsi di-hoist sebelum pemanggilan runtime:

```js
// pembuatan
function getName() {
  console.log('string');
}

// eksekusi
getName();
```

Catatan: dengan function expression, urutan deklarasi dan penugasan tetap penting.

Pada fase pembuatan, deklarasi fungsi memiliki prioritas lebih tinggi daripada deklarasi variabel.

### Benar

```js
name = 'Yumy';
console.log(name); // mencetak Yumy
var name;

// --- Setara dengan ---

// pembuatan
var name;

// eksekusi
name = 'Yumy';
console.log(name); // mencetak Yumy
```

### Salah

```js
console.log(name); // mencetak undefined
var name = 'Jane';

// --- Setara dengan ---

// pembuatan
var name;

// eksekusi
console.log(name); // mencetak undefined, karena penugasan belum terjadi
name = 'Pitt';
```

## 2. Apa yang dicetak untuk `name`?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Jawaban

```js
// pembuatan
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// eksekusi
whoseName();
name = 'Pitt';
console.log(name); // mencetak Pitt
```

Di dalam `whoseName()`, `name` dimulai sebagai `undefined`, sehingga cabang `if (name)` tidak dijalankan.
Setelah itu, `name` diberi nilai `'Pitt'`, sehingga output akhir tetap `Pitt`.

---

## 3. Deklarasi Fungsi vs Deklarasi Variabel: Prioritas Hoisting

### Pertanyaan: fungsi dan variabel dengan nama yang sama

Prediksi output dari kode ini:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Jawaban yang salah yang umum

Banyak orang berpikir hasilnya akan:

- Mencetak `undefined` (mengasumsikan `var` di-hoist lebih dulu)
- Mencetak `'1'` (mengasumsikan penugasan sudah berlaku)
- Menghasilkan error (mengasumsikan konflik nama yang sama)

### Output sebenarnya

```js
[Function: foo]
```

### Mengapa?

Pertanyaan ini menguji **aturan prioritas hoisting**:

**Prioritas hoisting: deklarasi fungsi > deklarasi variabel**

```js
// Kode asli
console.log(foo);
var foo = '1';
function foo() {}

// Setara setelah hoisting
// Fase 1: pembuatan (hoisting)
function foo() {} // 1. deklarasi fungsi di-hoist lebih dulu
var foo; // 2. deklarasi variabel di-hoist (tidak menimpa fungsi)

// Fase 2: eksekusi
console.log(foo); // foo adalah fungsi di sini
foo = '1'; // 3. penugasan menimpa fungsi
```

### Konsep Kunci

**1. Deklarasi fungsi di-hoist sepenuhnya**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. `var` hanya meng-hoist deklarasi, bukan penugasan**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Ketika deklarasi fungsi dan variabel berbagi nama yang sama**

```js
// Urutan hoisting
function foo() {} // fungsi di-hoist dan diinisialisasi lebih dulu
var foo; // deklarasi di-hoist, tapi tidak menimpa fungsi

// Oleh karena itu foo tetap fungsi
console.log(foo); // [Function: foo]
```

### Alur Eksekusi Lengkap

```js
// Kode asli
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Setara ========

// Fase pembuatan (hoisting)
function foo() {} // 1️⃣ deklarasi fungsi di-hoist sepenuhnya
var foo; // 2️⃣ deklarasi variabel di-hoist tapi tidak mengganti fungsi

// Fase eksekusi
console.log(foo); // [Function: foo]
foo = '1'; // 3️⃣ penugasan sekarang menimpa fungsi
console.log(foo); // '1'
```

### Pertanyaan Lanjutan

#### Pertanyaan A: apakah urutan mengubah hasil?

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Jawaban:**

```js
[Function: foo] // output pertama
'1' // output kedua
```

**Alasan:** urutan kode sumber tidak mengubah prioritas hoisting. Deklarasi fungsi tetap menang atas deklarasi variabel pada fase pembuatan.

#### Pertanyaan B: beberapa fungsi dengan nama yang sama

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**Jawaban:**

```js
[Function: foo] // output pertama (deklarasi fungsi yang lebih belakang menimpa yang sebelumnya)
'1' // output kedua (penugasan menimpa fungsi)
```

**Alasan:**

```js
// Setelah hoisting
function foo() {
  return 1;
} // fungsi pertama

function foo() {
  return 2;
} // fungsi kedua menimpa yang pertama

var foo; // hanya deklarasi (tidak menimpa fungsi)

console.log(foo); // fungsi yang mengembalikan 2
foo = '1'; // penugasan menimpa fungsi
console.log(foo); // '1'
```

#### Pertanyaan C: function expression vs deklarasi fungsi

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**Jawaban:**

```js
undefined // foo adalah undefined
[Function: bar] // bar adalah fungsi
```

**Alasan:**

```js
// Setelah hoisting
var foo; // deklarasi variabel di-hoist (body fungsi tidak)
function bar() {
  return 2;
} // deklarasi fungsi di-hoist sepenuhnya

console.log(foo); // undefined
console.log(bar); // fungsi

foo = function () {
  return 1;
}; // penugasan saat runtime
```

**Perbedaan kunci:**

- **Deklarasi fungsi**: `function foo() {}` -> di-hoist sepenuhnya (termasuk body)
- **Function expression**: `var foo = function() {}` -> hanya nama variabel yang di-hoist

### `let`/`const` menghindari pola ini

```js
// ❌ `var` memiliki jebakan hoisting
console.log(foo); // undefined
var foo = '1';

// ✅ let/const berada di TDZ sebelum inisialisasi
console.log(bar); // ReferenceError
let bar = '1';

// ✅ menggunakan nama yang sama dengan fungsi dan let/const menghasilkan error
function baz() {}
let baz = '1'; // SyntaxError: Identifier 'baz' has already been declared
```

### Ringkasan Prioritas Hoisting

```
Prioritas hoisting (tinggi -> rendah):

1. Deklarasi Fungsi
   - function foo() {} ✅ di-hoist sepenuhnya
   - prioritas tertinggi

2. Deklarasi Variabel
   - var foo ⚠️ hanya deklarasi (tanpa penugasan)
   - tidak menimpa deklarasi fungsi yang sudah ada

3. Penugasan Variabel
   - foo = '1' ✅ bisa menimpa fungsi
   - hanya terjadi pada fase eksekusi

4. Function Expression
   - var foo = function() {} ⚠️ diperlakukan sebagai penugasan
   - hanya nama variabel yang di-hoist
```

### Fokus Wawancara

Saat menjawab pertanyaan jenis ini, Anda bisa mengikuti struktur ini:

1. Jelaskan hoisting sebagai dua fase: pembuatan dan eksekusi.
2. Tekankan prioritas: deklarasi fungsi > deklarasi variabel.
3. Tulis ulang kode ke bentuk setelah hoisting untuk menunjukkan penalaran.
4. Sebutkan best practice: gunakan `let`/`const`, dan hindari pola `var` yang membingungkan.

**Contoh jawaban wawancara:**

> Pertanyaan ini tentang prioritas hoisting. Di JavaScript, deklarasi fungsi di-hoist sebelum deklarasi variabel.
>
> Engine melalui dua fase:
>
> 1. Fase pembuatan: `function foo() {}` di-hoist lebih dulu, lalu `var foo` di-hoist tanpa menimpa fungsi.
> 2. Fase eksekusi: `console.log(foo)` mencetak fungsi, dan baru kemudian `foo = '1'` menimpanya.
>
> Dalam praktik, gunakan `let`/`const` sebagai pengganti `var` untuk menghindari kebingungan ini.

---

## Topik Terkait (Related Topics)

- [Perbedaan var, let, const](/docs/let-var-const-differences)
