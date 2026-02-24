---
id: deep-clone
title: '[Medium] Deep Clone Mendalam'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. Apa Itu Deep Clone?

> Apa Itu Deep Clone?

**Deep Clone** membuat objek baru dan menyalin semua properti objek asli secara rekursif, termasuk semua objek bertingkat dan array. Setelah deep clone, objek baru sepenuhnya independen dari objek asli; mengubah salah satunya tidak akan memengaruhi yang lain.

### Shallow Clone vs Deep Clone

**Shallow Clone**: Hanya menyalin level pertama dari properti objek. Objek bertingkat masih berbagi referensi.

```javascript
// Shallow clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Original object was also modified
```

**Deep Clone**: Menyalin semua level properti secara rekursif, sepenuhnya independen.

```javascript
// Deep clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Original object is unaffected
```

## 2. Metode Implementasi

> Metode Implementasi

### Metode 1: Menggunakan JSON.parse dan JSON.stringify

**Kelebihan**: Sederhana dan cepat
**Kekurangan**: Tidak dapat menangani function, undefined, Symbol, Date, RegExp, Map, Set, dan tipe khusus lainnya

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Keterbatasan**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date becomes an empty object
console.log(cloned.func); // undefined ❌ Function is lost
console.log(cloned.undefined); // undefined ✅ But JSON.stringify removes it
console.log(cloned.symbol); // undefined ❌ Symbol is lost
console.log(cloned.regex); // {} ❌ RegExp becomes an empty object
```

### Metode 2: Implementasi Rekursif (menangani tipe dasar dan objek)

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Unaffected
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Metode 3: Implementasi Lengkap (menangani Map, Set, Symbol, dll.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  // Handle Symbol properties
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copy regular properties
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copy Symbol properties
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Test
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Metode 4: Menangani Circular Reference

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Circular reference handled correctly
console.log(cloned !== original); // true ✅ It's a different object
```

## 3. Pertanyaan Interview Umum

> Pertanyaan Interview Umum

### Pertanyaan 1: Implementasi Deep Clone Dasar

Implementasikan fungsi `deepClone` yang dapat melakukan deep clone pada objek dan array.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Pertanyaan 2: Menangani Circular Reference

Implementasikan fungsi `deepClone` yang dapat menangani circular reference.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Poin penting**:

- Gunakan `WeakMap` untuk melacak objek yang sudah diproses
- Periksa apakah objek sudah ada di map sebelum membuat objek baru
- Jika sudah ada, kembalikan referensi dari map untuk menghindari rekursi tak hingga

</details>

### Pertanyaan 3: Keterbatasan JSON.parse dan JSON.stringify

Jelaskan keterbatasan penggunaan `JSON.parse(JSON.stringify())` untuk deep cloning, lalu berikan solusinya.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

**Keterbatasan**:

1. **Tidak dapat menangani function**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Tidak dapat menangani undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (but the property is removed) ❌
   ```

3. **Tidak dapat menangani Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol property is lost
   ```

4. **Date menjadi string**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Becomes a string
   ```

5. **RegExp menjadi objek kosong**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Becomes an empty object
   ```

6. **Tidak dapat menangani Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Becomes an empty object
   ```

7. **Tidak dapat menangani circular reference**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Error: Converting circular structure to JSON
   ```

**Solusi**: Gunakan implementasi rekursif dengan penanganan khusus untuk berbagai tipe.

</details>

## 4. Praktik Terbaik

> Praktik Terbaik

### Pendekatan yang Direkomendasikan

```javascript
// 1. Choose the appropriate method based on requirements
// For basic objects and arrays only, use a simple recursive implementation
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. For complex types, use the complete implementation
function completeDeepClone(obj, map = new WeakMap()) {
  // ... complete implementation
}

// 3. Use WeakMap to handle circular references
// WeakMap doesn't prevent garbage collection, making it suitable for tracking object references
```

### Pendekatan yang Harus Dihindari

```javascript
// 1. Don't overuse JSON.parse(JSON.stringify())
// ❌ Loses functions, Symbol, Date, and other special types
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Don't forget to handle circular references
// ❌ Will cause stack overflow
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Infinite recursion
  }
  return cloned;
}

// 3. Don't forget to handle Date, RegExp, and other special types
// ❌ These types require special handling
```

## 5. Ringkasan Interview

> Ringkasan Interview

### Referensi Cepat

**Deep Clone**:

- **Definisi**: Menyalin objek beserta semua properti bertingkatnya secara rekursif untuk membuat salinan yang sepenuhnya independen
- **Metode**: Implementasi rekursif, JSON.parse(JSON.stringify()), structuredClone()
- **Poin penting**: Menangani tipe khusus, circular reference, dan properti Symbol

**Langkah Implementasi**:

1. Tangani tipe primitif dan null
2. Tangani Date, RegExp, dan objek khusus lainnya
3. Tangani array dan objek
4. Tangani circular reference (menggunakan WeakMap)
5. Tangani properti Symbol

### Contoh Jawaban Interview

**T: Tolong implementasikan fungsi Deep Clone.**

> "Deep clone membuat objek baru yang sepenuhnya independen dengan menyalin semua properti bertingkat secara rekursif. Implementasi saya pertama-tama menangani tipe primitif dan null, lalu menerapkan penanganan khusus untuk tipe berbeda seperti Date, RegExp, array, dan objek. Untuk menangani circular reference, saya menggunakan WeakMap untuk melacak objek yang sudah diproses. Untuk properti Symbol, saya menggunakan Object.getOwnPropertySymbols untuk mengambil dan menyalinnya. Ini memastikan objek hasil deep clone benar-benar independen dari objek asli; mengubah salah satunya tidak akan memengaruhi yang lain."

**T: Apa keterbatasan JSON.parse(JSON.stringify())?**

> "Keterbatasan utamanya meliputi: 1) Tidak dapat menangani function; function akan hilang; 2) Tidak dapat menangani undefined dan Symbol; properti ini diabaikan; 3) Objek Date menjadi string; 4) RegExp menjadi objek kosong; 5) Tidak dapat menangani Map, Set, dan struktur data khusus lainnya; 6) Tidak dapat menangani circular reference; akan melempar error. Untuk kasus-kasus khusus ini, sebaiknya gunakan implementasi rekursif."

## Referensi

- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
