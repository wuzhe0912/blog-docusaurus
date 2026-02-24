---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. Apa itu Set dan Map?

> Apa itu Set dan Map?

`Set` dan `Map` adalah dua struktur data yang diperkenalkan di ES6.
Keduanya menyelesaikan kasus penggunaan tertentu lebih baik daripada array/objek biasa.

### Set

**Definisi**: `Set` adalah koleksi **nilai unik**, mirip dengan himpunan matematika.

**Karakteristik**:

- Nilai yang disimpan bersifat **unik**
- Pemeriksaan kesetaraan menggunakan semantik `===` untuk sebagian besar nilai
- Menjaga urutan penyisipan
- Bisa menyimpan tipe nilai apapun (primitif atau objek)

**Penggunaan dasar**:

```javascript
// buat Set
const set = new Set();

// tambah nilai
set.add(1);
set.add(2);
set.add(2); // duplikat diabaikan
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// pemeriksaan keberadaan
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// hapus
set.delete(2);
console.log(set.has(2)); // false

// bersihkan
set.clear();
console.log(set.size); // 0
```

**Buat Set dari array**:

```javascript
// hapus duplikat dari array
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// ubah kembali ke array
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// singkatan
const uniqueArr2 = [...new Set(arr)];
```

### Map

**Definisi**: `Map` adalah koleksi key-value mirip objek, tapi key bisa bertipe apapun.

**Karakteristik**:

- Key bisa bertipe apapun (string, number, objek, fungsi, dll.)
- Menjaga urutan penyisipan
- Memiliki properti `size`
- Iterasi mengikuti urutan penyisipan

**Penggunaan dasar**:

```javascript
// buat Map
const map = new Map();

// atur pasangan key-value
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// ambil nilai
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// keberadaan key
console.log(map.has('name')); // true

// hapus
map.delete('name');

// ukuran
console.log(map.size); // 3

// bersihkan
map.clear();
```

**Buat Map dari array**:

```javascript
// dari array 2D
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// dari objek
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Perbedaan antara Set dan Array

| Fitur | Set | Array |
| ------- | --- | ----- |
| Duplikat | Tidak diizinkan | Diizinkan |
| Akses indeks | Tidak didukung | Didukung |
| Kompleksitas pencarian | O(1) rata-rata | O(n) |
| Urutan penyisipan | Dipertahankan | Dipertahankan |
| Metode umum | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Kasus penggunaan**:

```javascript
// ✅ Set untuk nilai unik
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Set untuk pemeriksaan keberadaan yang cepat
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Halaman utama sudah dikunjungi');
}

// ✅ Array ketika indeks atau duplikat diperlukan
const scores = [100, 95, 100, 90];
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Perbedaan antara Map dan Object

| Fitur | Map | Object |
| ------- | --- | ------ |
| Tipe key | Tipe apapun | String atau Symbol |
| Ukuran | Properti `size` | Perhitungan manual |
| Key default | Tidak ada | Prototype chain ada |
| Urutan iterasi | Urutan penyisipan | Urutan penyisipan di JS modern |
| Performa | Lebih baik untuk sering tambah/hapus | Sering baik untuk struktur statis/sederhana |
| JSON | Tidak bisa langsung diserialisasi | Dukungan JSON native |

**Kasus penggunaan**:

```javascript
// ✅ Map ketika key bukan string
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Map untuk sering tambah/hapus
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Object untuk struktur statis + JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config);
```

## 4. Pertanyaan Wawancara Umum (Common Interview Questions)

> Pertanyaan wawancara umum

### Pertanyaan 1: hapus duplikat dari array

Implementasikan fungsi untuk menghapus duplikat.

```javascript
function removeDuplicates(arr) {
  // implementasi Anda
}
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Metode 1: Set (direkomendasikan)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Metode 2: filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Metode 3: reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Performa**:

- Set: O(n), tercepat
- filter + indexOf: O(n²), lebih lambat
- reduce + includes: O(n²), lebih lambat

</details>

### Pertanyaan 2: periksa duplikat dalam array

Implementasikan fungsi untuk memeriksa apakah array memiliki duplikat.

```javascript
function hasDuplicates(arr) {
  // implementasi Anda
}
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Metode 1: Set (direkomendasikan)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Metode 2: Set dengan keluar awal**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Metode 3: indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Performa**:

- Set metode 1: O(n), tercepat
- Set metode 2: O(n), bisa berhenti lebih awal
- indexOf: O(n²), lebih lambat

</details>

### Pertanyaan 3: hitung kemunculan

Implementasikan fungsi untuk menghitung kemunculan setiap elemen.

```javascript
function countOccurrences(arr) {
  // implementasi Anda
}
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Metode 1: Map (direkomendasikan)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Metode 2: reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Metode 3: objek biasa**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Mengapa Map membantu**:

- Key bisa bertipe apapun
- Built-in `size`
- Iterasi urutan penyisipan yang stabil

</details>

### Pertanyaan 4: irisan dua array

Implementasikan irisan array.

```javascript
function intersection(arr1, arr2) {
  // implementasi Anda
}
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Metode 1: Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Metode 2: filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Metode 3: filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Performa**:

- Set: O(n + m), lebih cepat
- filter + includes: O(n × m), lebih lambat

</details>

### Pertanyaan 5: selisih dua array

Implementasikan selisih array (nilai di `arr1` tapi tidak di `arr2`).

```javascript
function difference(arr1, arr2) {
  // implementasi Anda
}
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Metode 1: Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Metode 2: deduplikasi dulu lalu filter**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Metode 3: includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Performa**:

- Set: O(n + m), lebih cepat
- includes: O(n × m), lebih lambat

</details>

### Pertanyaan 6: implementasikan LRU cache

Implementasikan LRU cache dengan `Map`.

```javascript
class LRUCache {
  constructor(capacity) {
    // implementasi Anda
  }

  get(key) {
    // implementasi Anda
  }

  put(key, value) {
    // implementasi Anda
  }
}
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Implementasi:**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // pindahkan key ke akhir (paling baru digunakan)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // jika key ada, hapus dulu
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // jika penuh, hapus yang paling lama (key pertama)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // tambah ke akhir (paling baru)
    this.cache.set(key, value);
  }
}

// penggunaan
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // menghapus key 2
console.log(cache.get(2)); // -1
console.log(cache.get(3)); // 'three'
```

**Penjelasan:**

- Map menjaga urutan penyisipan
- key pertama adalah yang paling lama
- `get` menyegarkan keterbaruan dengan delete+set
- `put` menghapus yang paling lama saat kapasitas penuh

</details>

### Pertanyaan 7: objek sebagai key Map

Jelaskan outputnya:

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Penjelasan:**

- `obj1` dan `obj2` adalah instance objek yang berbeda
- `Map` membandingkan key objek berdasarkan referensi
- jadi mereka diperlakukan sebagai key yang berbeda

**Kontras dengan objek biasa:**

```javascript
// key objek biasa menjadi string
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (ditimpa)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']

// Map menjaga referensi
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet dan WeakMap

> Perbedaan antara WeakSet dan WeakMap

### WeakSet

**Karakteristik**:

- Hanya bisa menyimpan **objek**
- Menggunakan **weak reference**
- Tidak ada `size`
- Tidak bisa diiterasi
- Tidak ada `clear`

**Kasus penggunaan**: penandaan objek tanpa kebocoran memori.

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// jika obj1 tidak punya referensi lain, bisa di-garbage-collect
```

### WeakMap

**Karakteristik**:

- Key harus berupa **objek**
- Menggunakan **weak reference** untuk key
- Tidak ada `size`
- Tidak bisa diiterasi
- Tidak ada `clear`

**Kasus penggunaan**: metadata privat yang terikat pada siklus hidup objek.

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// jika obj1 tidak punya referensi lain, entry bisa di-garbage-collect
```

### Koleksi weak vs strong

| Fitur | Set/Map | WeakSet/WeakMap |
| ------- | ------- | --------------- |
| Tipe key/value | Tipe apapun | Hanya objek |
| Weak reference | Tidak | Ya |
| Bisa diiterasi | Ya | Tidak |
| `size` | Ya | Tidak |
| `clear` | Ya | Tidak |
| Pembersihan GC otomatis | Tidak | Ya |

## 6. Best Practice

> Best practice

### Direkomendasikan

```javascript
// 1. Gunakan Set untuk keunikan
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Gunakan Set untuk pencarian cepat
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // akses diberikan
}

// 3. Gunakan Map ketika key bukan string
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Gunakan Map untuk sering tambah/hapus
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Gunakan WeakMap untuk data privat yang terkait objek
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Hindari

```javascript
// 1. Jangan gunakan Set sebagai pengganti penuh array
const set = new Set([1, 2, 3]);
// set[0] -> undefined

const arr = [1, 2, 3];
arr[0]; // 1

// 2. Jangan gunakan Map untuk struktur statis sederhana
const configMap = new Map();
configMap.set('apiUrl', 'https://api.example.com');
configMap.set('timeout', 5000);

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Jangan bingungkan API Set dan Map
const set2 = new Set();
// set2.set('key', 'value'); // TypeError

const map = new Map();
map.set('key', 'value');
```

## 7. Ringkasan Wawancara (Interview Summary)

> Ringkasan wawancara

### Panduan cepat

**Set**:

- Hanya nilai unik
- Pencarian cepat O(1)
- Bagus untuk deduplikasi dan pemeriksaan keanggotaan

**Map**:

- Penyimpanan key-value dengan key bertipe apapun
- Mempertahankan urutan penyisipan
- Bagus untuk key non-string dan pembaruan yang sering

**WeakSet / WeakMap**:

- Weak reference, ramah GC
- Key/value hanya objek
- Bagus untuk metadata objek yang aman dari kebocoran

### Contoh jawaban wawancara

**Q: Kapan harus menggunakan Set daripada Array?**

> Gunakan Set ketika Anda memerlukan keunikan atau pemeriksaan keberadaan yang cepat.
> `Set.has` adalah O(1) rata-rata, sementara array `includes` adalah O(n).
> Contoh umum adalah deduplikasi dan pemeriksaan izin.

**Q: Apa perbedaan antara Map dan Object?**

> Key Map bisa bertipe apapun, termasuk objek/fungsi.
> Key Object hanya string atau Symbol.
> Map memiliki `size`, mempertahankan urutan penyisipan, dan menghindari masalah key prototype-chain.
> Map lebih baik ketika key bersifat dinamis atau pembaruan sering dilakukan.

**Q: Apa perbedaan antara WeakMap dan Map?**

> Key WeakMap harus berupa objek dan direferensikan secara lemah.
> Jika objek key tidak lagi direferensikan di tempat lain, entry-nya bisa di-garbage-collect secara otomatis.
> WeakMap tidak bisa diiterasi dan tidak punya `size`.
> Berguna untuk data privat dan pencegahan kebocoran memori.

## Referensi

- [MDN - Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
