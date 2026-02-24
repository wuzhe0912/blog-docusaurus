---
id: operators
title: '[Easy] 📄 Operator JavaScript'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. Apa perbedaan antara `==` dan `===`?

> Apa perbedaan antara `==` dan `===`?

Keduanya adalah operator perbandingan.
`==` membandingkan nilai dengan type coercion, sementara `===` membandingkan nilai dan tipe (strict equality).

Karena aturan coercion JavaScript, `==` bisa menghasilkan hasil yang mengejutkan:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Ini meningkatkan beban kognitif, jadi dalam sebagian besar kasus `===` direkomendasikan untuk menghindari bug yang tidak terduga.

**Best practice**: selalu gunakan `===` dan `!==`, kecuali Anda tahu jelas mengapa `==` diperlukan.

### Pertanyaan Wawancara (Interview Questions)

#### Pertanyaan 1: perbandingan primitif

Prediksi hasilnya:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Jawaban:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Penjelasan:**

- **`==` (loose equality)** melakukan type coercion
  - `'1'` diubah menjadi `1`
  - lalu membandingkan `1 == 1` -> `true`
- **`===` (strict equality)** tidak melakukan coercion
  - `number` dan `string` adalah tipe berbeda -> `false`

**Aturan coercion (kasus umum):**

```javascript
// contoh prioritas coercion ==
// 1. jika satu sisi number, ubah sisi lain menjadi number
'1' == 1; // true
'2' == 2; // true
'0' == 0; // true

// 2. jika satu sisi boolean, ubah boolean menjadi number
true == 1; // true
false == 0; // true
'1' == true; // true

// 3. jebakan string-ke-number
'' == 0; // true
' ' == 0; // true (string whitespace diubah menjadi 0)
```

#### Pertanyaan 2: `null` vs `undefined`

Prediksi hasilnya:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Jawaban:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Penjelasan:**

Ini adalah **aturan khusus JavaScript**:

- **`undefined == null`** adalah `true`
  - spesifikasi secara eksplisit mendefinisikan loose equality di antara keduanya
  - ini adalah salah satu kasus penggunaan valid untuk `==`: memeriksa baik `null` maupun `undefined`
- **`undefined === null`** adalah `false`
  - tipe berbeda, jadi strict equality gagal

**Penggunaan praktis:**

```javascript
// periksa apakah nilai null atau undefined
function isNullOrUndefined(value) {
  return value == null;
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// bentuk verbose yang setara
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Jebakan:**

```javascript
// null dan undefined hanya loosely equal satu sama lain
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// dengan ===, masing-masing hanya sama dengan dirinya sendiri
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Pertanyaan 3: perbandingan campuran

Prediksi hasilnya:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Jawaban:**

```javascript
0 == false; // true (false -> 0)
0 === false; // false (number vs boolean)
'' == false; // true ('' -> 0, false -> 0)
'' === false; // false (string vs boolean)
null == false; // false (null hanya loosely equal dengan null/undefined)
undefined == false; // false (undefined hanya loosely equal dengan null/undefined)
```

**Alur konversi:**

```javascript
// 0 == false
0 == false;
0 == 0;
true;

// '' == false
'' == false;
'' == 0;
0 == 0;
true;

// null == false
null == false;
// null tidak dikonversi di jalur perbandingan ini
false;
```

#### Pertanyaan 4: perbandingan objek

Prediksi hasilnya:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Jawaban:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Penjelasan:**

- Objek (termasuk array) dibandingkan berdasarkan **referensi**, bukan berdasarkan isi.
- Dua instance objek berbeda tidak pernah sama, bahkan dengan isi yang sama.
- Untuk objek, `==` dan `===` keduanya membandingkan referensi.

```javascript
// referensi sama -> sama
const arr1 = [];
const arr2 = arr1;
arr1 == arr2; // true
arr1 === arr2; // true

// isi sama tapi instance berbeda -> tidak sama
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false
arr3 === arr4; // false

// sama untuk objek
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Panduan cepat wawancara

**Aturan coercion `==` (urutan praktis):**

1. `null == undefined` -> `true` (aturan khusus)
2. `number == string` -> ubah string menjadi number
3. `number == boolean` -> ubah boolean menjadi number
4. `string == boolean` -> keduanya diubah menjadi number
5. Objek dibandingkan berdasarkan referensi

**Aturan `===` (sederhana):**

1. Tipe berbeda -> `false`
2. Tipe sama -> bandingkan nilai (primitif) atau referensi (objek)

**Best practice:**

```javascript
// ✅ gunakan === secara default
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ satu pengecualian umum: pemeriksaan null/undefined
if (value == null) {
  // value adalah null atau undefined
}

// ❌ hindari == secara umum
if (value == 0) {
}
if (name == 'Alice') {
}
```

**Contoh jawaban wawancara:**

> `==` melakukan type coercion dan bisa menghasilkan hasil yang mengejutkan, misalnya `0 == '0'` adalah `true`.
> `===` adalah strict equality, jadi ketidakcocokan tipe langsung mengembalikan `false`.
>
> Best practice adalah menggunakan `===` di mana-mana, kecuali untuk `value == null` saat sengaja memeriksa baik `null` maupun `undefined`.
>
> Perlu diperhatikan juga: `null == undefined` adalah `true`, tapi `null === undefined` adalah `false`.

---

## 2. Apa perbedaan antara `&&` dan `||`? Jelaskan short-circuit evaluation

> Apa perbedaan antara `&&` dan `||`? Jelaskan short-circuit evaluation.

### Ide inti

- **`&&` (AND)**: jika sisi kiri `falsy`, kembalikan sisi kiri langsung (sisi kanan tidak dievaluasi)
- **`||` (OR)**: jika sisi kiri `truthy`, kembalikan sisi kiri langsung (sisi kanan tidak dievaluasi)

### Contoh short-circuit

```js
// short-circuit &&
const user = null;
const name = user && user.name; // user falsy, mengembalikan null, tidak akses user.name
console.log(name); // null (tidak ada error)

// short-circuit ||
const defaultName = 'Guest';
const userName = user || defaultName;
console.log(userName); // 'Guest'

// penggunaan praktis
function greet(name) {
  const displayName = name || 'Anonymous';
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Jebakan umum ⚠️

```js
// masalah: 0 dan '' juga falsy
const count = 0;
const result = count || 10; // mengembalikan 10
console.log(result); // 10 (mungkin tidak diinginkan)

// solusi: gunakan ??
const betterResult = count ?? 10; // hanya fallback null/undefined
console.log(betterResult); // 0
```

---

## 3. Apa itu operator `?.` (Optional Chaining)?

> Apa itu optional chaining `?.`?

### Skenario masalah

Akses tradisional bisa menghasilkan error:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ berisiko: throw jika address tidak ada
console.log(user.address.city); // ok
console.log(otherUser.address.city); // TypeError

// ✅ aman tapi verbose
const city = user && user.address && user.address.city;
```

### Penggunaan optional chaining

```js
// ✅ ringkas dan aman
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (tidak ada error)

// untuk pemanggilan metode
user?.getName?.();

// untuk array
const firstItem = users?.[0]?.name;
```

### Penggunaan praktis

```js
// penanganan respons API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Pengguna Tidak Dikenal';
  const email = response?.data?.user?.email ?? 'Tidak ada email';

  console.log(`Pengguna: ${userName}`);
  console.log(`Email: ${email}`);
}

// akses DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. Apa itu operator `??` (Nullish Coalescing)?

> Apa itu nullish coalescing `??`?

### Perbedaan dari `||`

```js
// || memperlakukan semua nilai falsy sebagai pemicu fallback
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? hanya memperlakukan null dan undefined sebagai nullish
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Penggunaan praktis

```js
// pertahankan nilai 0 yang valid
function updateScore(newScore) {
  const score = newScore ?? 100;
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// default konfigurasi
const config = {
  timeout: 0, // konfigurasi valid
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0
const retries = config.maxRetries ?? 3; // 3
```

### Penggunaan gabungan

```js
// ?? dan ?. sering digunakan bersama
const userAge = user?.profile?.age ?? 18;

// default formulir
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0,
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. Apa perbedaan antara `i++` dan `++i`?

> Apa perbedaan antara `i++` dan `++i`?

### Perbedaan inti

- **`i++` (postfix)**: kembalikan nilai saat ini dulu, lalu tambah
- **`++i` (prefix)**: tambah dulu, lalu kembalikan nilai baru

### Contoh

```js
let a = 5;
let b = a++; // b = 5, a = 6
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6
console.log(c, d); // 6, 6
```

### Dampak praktis

```js
// biasanya tidak ada perbedaan di loop jika nilai return tidak digunakan
for (let i = 0; i < 5; i++) {}
for (let i = 0; i < 5; ++i) {}

// tapi ada perbedaan di dalam ekspresi
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1
console.log(arr[++i]); // 3
```

### Best practice

```js
// ✅ lebih jelas: pisahkan menjadi langkah-langkah
let count = 0;
const value = arr[count];
count++;

// ⚠️ kurang terbaca jika digunakan berlebihan
const value2 = arr[count++];
```

---

## 6. Apa itu Operator Ternary? Kapan harus menggunakannya?

> Apa itu operator ternary? Kapan harus menggunakannya?

### Sintaks

```js
kondisi ? nilaiJikaTrue : nilaiJikaFalse;
```

### Contoh sederhana

```js
// if-else
let message;
if (age >= 18) {
  message = 'Dewasa';
} else {
  message = 'Anak di bawah umur';
}

// ✅ ternary
const message2 = age >= 18 ? 'Dewasa' : 'Anak di bawah umur';
```

### Kasus penggunaan yang baik

```js
// 1. penugasan kondisional sederhana
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. rendering kondisional JSX/template
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. pemberian default dengan operator lain
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Selamat datang, ${displayName}!` : `Halo, ${displayName}`;

// 4. nilai return fungsi
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Kasus yang harus dihindari

```js
// ❌ ternary bersarang dalam menurunkan keterbacaan
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ lebih jelas dengan if-else/switch
let result2;
if (condition1) result2 = value1;
else if (condition2) result2 = value2;
else if (condition3) result2 = value3;
else result2 = value4;

// ❌ logika bisnis kompleks di ternary
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ pisahkan menjadi langkah yang terbaca
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess2 = isAdmin || hasReadPermission;
```

---

## Lembar Contekan Cepat (Quick Cheat Sheet)

| Operator            | Tujuan                   | Tips Mengingat |
| ------------------- | ---------------------- | ---------- |
| `===`               | Strict equality        | Gunakan ini secara default, hindari `==` |
| `&&`                | Short-circuit AND      | Berhenti saat kiri falsy |
| `\|\|`            | Short-circuit OR       | Berhenti saat kiri truthy |
| `?.`                | Optional chaining      | Akses aman tanpa throw |
| `??`                | Nullish coalescing     | Hanya fallback null/undefined |
| `++i` / `i++`       | Increment              | Prefix dulu, postfix setelah |
| `? :`               | Operator ternary       | Baik hanya untuk kondisi sederhana |

## Referensi

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
