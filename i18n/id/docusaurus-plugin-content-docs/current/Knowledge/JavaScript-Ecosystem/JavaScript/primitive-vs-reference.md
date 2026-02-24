---
id: primitive-vs-reference
title: '[Medium] 📄 Tipe Primitif vs Tipe Referensi'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. Apa itu Tipe Primitif dan Tipe Referensi?

> Apa itu Tipe Primitif dan Tipe Referensi?

Tipe data JavaScript dapat dikelompokkan menjadi dua kategori: **tipe primitif** dan **tipe referensi**.
Keduanya berbeda secara fundamental dalam perilaku memori dan semantik penerusan.

### Tipe Primitif (Primitive Types)

**Karakteristik**:

- Disimpan sebagai nilai langsung (umumnya dikonseptualisasikan di **stack**)
- Diteruskan melalui **salinan nilai** (pass by value)
- Immutable (tidak bisa diubah)

**7 tipe primitif**:

```javascript
// 1. String
const str = 'hello';

// 2. Number
const num = 42;

// 3. Boolean
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Tipe Referensi (Reference Types)

**Karakteristik**:

- Objek dialokasikan di memori **heap**
- Variabel menyimpan referensi (alamat)
- Mutable (bisa diubah)

**Contoh**:

```javascript
// 1. Object
const obj = { name: 'John' };

// 2. Array
const arr = [1, 2, 3];

// 3. Function
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Call by Value vs Call by Reference

### Call by Value (perilaku primitif)

**Perilaku**: nilai disalin; mengedit salinan tidak mempengaruhi aslinya.

```javascript
let a = 10;
let b = a; // salin nilai

b = 20;

console.log(a); // 10
console.log(b); // 20
```

**Diagram memori**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ <- nilai independen
├─────────┤
│ b: 20   │ <- nilai independen setelah salin/perbarui
└─────────┘
```

### Perilaku referensi (objek)

**Perilaku**: referensi disalin; kedua variabel bisa menunjuk ke objek yang sama.

```javascript
let obj1 = { name: 'John' };
let obj2 = obj1; // salin referensi

obj2.name = 'Jane';

console.log(obj1.name); // 'Jane'
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true
```

**Diagram memori**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (objek sama)     │
└─────────┘                    └──────────────────┘
```

## 3. Pertanyaan Kuis Umum (Common Quiz Questions)

> Pertanyaan kuis umum

### Pertanyaan 1: meneruskan nilai primitif

```javascript
function changeValue(x) {
  x = 100;
  console.log('Di dalam fungsi x:', x);
}

let num = 50;
changeValue(num);
console.log('Di luar fungsi num:', num);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// Di dalam fungsi x: 100
// Di luar fungsi num: 50
```

**Penjelasan:**

- `num` adalah primitif (`Number`)
- argumen fungsi mendapat salinan nilai
- mengubah `x` tidak mengubah `num`

```javascript
// alur
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (salinan)
x = 100; // hanya x yang berubah
console.log(num); // tetap 50
```

</details>

### Pertanyaan 2: meneruskan objek

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('Di dalam fungsi obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('Di luar fungsi person.name:', person.name);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// Di dalam fungsi obj.name: Changed
// Di luar fungsi person.name: Changed
```

**Penjelasan:**

- `person` adalah tipe referensi (`Object`)
- argumen fungsi menyalin referensi
- `obj` dan `person` menunjuk ke objek yang sama

```javascript
// sketsa memori
let person = { name: 'Original' }; // heap @0x001
changeObject(person); // obj -> @0x001
obj.name = 'Changed'; // mutasi @0x001
console.log(person.name); // membaca dari @0x001
```

</details>

### Pertanyaan 3: penugasan ulang vs mutasi properti

```javascript
function test1(obj) {
  obj.name = 'Modified'; // mutasi properti
}

function test2(obj) {
  obj = { name: 'New Object' }; // tugaskan ulang parameter lokal
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: Modified
// B: Modified (bukan 'New Object')
```

**Penjelasan:**

**test1: mutasi properti**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // memutasi objek asli
}
```

**test2: penugasan ulang**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // hanya mengubah binding lokal
}
// person tetap menunjuk ke objek asli
```

**Sketsa memori**:

```text
// sebelum test1
person ---> { name: 'Original' }
obj    ---> { name: 'Original' } (sama)

// setelah test1
person ---> { name: 'Modified' }
obj    ---> { name: 'Modified' } (sama)

// di dalam test2
person ---> { name: 'Modified' } (tidak berubah)
obj    ---> { name: 'New Object' } (objek baru)

// setelah test2
person ---> { name: 'Modified' }
// obj lokal sudah hilang
```

</details>

### Pertanyaan 4: penerusan array

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Penjelasan:**

- `modifyArray`: memutasi array asli
- `reassignArray`: hanya mengikat ulang parameter lokal

</details>

### Pertanyaan 5: perbandingan kesetaraan

```javascript
// primitif
let a = 10;
let b = 10;
console.log('A:', a === b);

// referensi
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// A: true
// B: false
// C: true
```

**Penjelasan:**

Primitif dibandingkan berdasarkan nilai; objek dibandingkan berdasarkan referensi.

```javascript
obj1 === obj2; // false (referensi berbeda)
obj1 === obj3; // true (referensi sama)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Shallow copy vs deep copy

### Shallow Copy (Salinan Dangkal)

**Definisi**: hanya level atas yang disalin; objek bersarang tetap berbagi referensi.

#### Metode 1: spread operator

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

copy.name = 'Jane';
console.log(original.name); // 'John'

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (terpengaruh)
```

#### Metode 2: `Object.assign()`

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'
```

#### Metode 3: shallow copy array

```javascript
const arr1 = [1, 2, 3];

const arr2 = [...arr1];
const arr3 = arr1.slice();
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1
```

### Deep Copy (Salinan Dalam)

**Definisi**: semua level disalin secara rekursif.

#### Metode 1: `JSON.parse(JSON.stringify(...))`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']
```

**Keterbatasan**:

```javascript
const obj = {
  date: new Date(), // -> string
  func: () => {}, // diabaikan
  undef: undefined, // diabaikan
  symbol: Symbol('test'), // diabaikan
  regexp: /abc/, // -> {}
  circular: null, // referensi circular menghasilkan error
};
obj.circular = obj;

JSON.parse(JSON.stringify(obj)); // error atau kehilangan data
```

#### Metode 2: `structuredClone()`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

console.log(copy.date instanceof Date); // true
```

**Kelebihan**:

- Mendukung Date, RegExp, Map, Set, dll.
- Mendukung referensi circular
- Biasanya performa lebih baik dari deep clone manual

**Keterbatasan**:

- Tidak mengkloning fungsi
- Tidak mengkloning nilai Symbol di semua pola penggunaan

#### Metode 3: deep clone rekursif

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'
```

#### Metode 4: Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Perbandingan shallow vs deep

| Fitur | Shallow Copy | Deep Copy |
| ------- | ------------ | --------- |
| Kedalaman salinan | Hanya level atas | Semua level |
| Objek bersarang | Referensi berbagi | Sepenuhnya independen |
| Performa | Lebih cepat | Lebih lambat |
| Penggunaan memori | Lebih rendah | Lebih tinggi |
| Kasus penggunaan | Struktur sederhana | Struktur bersarang kompleks |

## 5. Jebakan Umum (Common Pitfalls)

> Jebakan umum

### Jebakan 1: mengharapkan argumen primitif memutasi nilai luar

```javascript
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5

count = increment(count);
console.log(count); // 6
```

### Jebakan 2: mengharapkan penugasan ulang mengganti objek luar

```javascript
function resetObject(obj) {
  obj = { name: 'Reset' }; // hanya binding ulang lokal
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'

// pendekatan yang benar 1: mutasi properti
function resetObject1(obj) {
  obj.name = 'Reset';
}

// pendekatan yang benar 2: kembalikan objek baru
function resetObject2(obj) {
  return { name: 'Reset' };
}
person = resetObject2(person);
```

### Jebakan 3: mengasumsikan spread adalah deep copy

```javascript
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // shallow

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'

const deep = structuredClone(original);
```

### Jebakan 4: salah memahami `const`

```javascript
const obj = { name: 'John' };

// obj = { name: 'Jane' }; // TypeError

obj.name = 'Jane'; // diizinkan
obj.age = 30; // diizinkan

const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane';
console.log(immutableObj.name); // 'John'
```

### Jebakan 5: referensi berbagi di loop

```javascript
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // referensi objek sama setiap kali
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]

const arr2 = [];
for (let i = 0; i < 3; i++) {
  arr2.push({ value: i }); // objek baru setiap iterasi
}

console.log(arr2);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practice

> Best practice

### ✅ Direkomendasikan

```javascript
// 1. pilih strategi salinan yang eksplisit
const original = { name: 'John', age: 30 };

const copy1 = { ...original }; // shallow
const copy2 = structuredClone(original); // deep

// 2. hindari efek samping mutasi di fungsi
function addItem(arr, item) {
  return [...arr, item]; // gaya immutable
}

// 3. gunakan const untuk mencegah binding ulang yang tidak disengaja
const config = { theme: 'dark' };

// 4. gunakan Object.freeze untuk konstanta immutable
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Hindari

```javascript
function increment(num) {
  num++; // tidak efektif untuk primitif luar
}

const copy = { ...nested }; // bukan deep copy

for (let i = 0; i < 3; i++) {
  arr.push(obj); // referensi objek sama digunakan ulang
}
```

## 7. Ringkasan Wawancara (Interview Summary)

> Ringkasan wawancara

### Panduan cepat

**Primitif**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Diteruskan berdasarkan nilai
- Immutable

**Referensi**:

- Object, Array, Function, Date, RegExp, dll.
- Variabel menyimpan referensi ke objek heap
- Mutable

### Contoh jawaban wawancara

**Q: Apakah JavaScript call-by-value atau call-by-reference?**

> JavaScript adalah call-by-value untuk semua argumen.
> Untuk objek, nilai yang disalin adalah referensi (alamat memori).
>
> - Argumen primitif: menyalin nilai tidak mempengaruhi variabel luar.
> - Argumen objek: menyalin referensi memungkinkan mutasi objek yang sama.
> - Menugaskan ulang parameter lokal tidak mengubah binding luar.

## Referensi

- [MDN - Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript.info - Object copy](https://javascript.info/object-copy)
