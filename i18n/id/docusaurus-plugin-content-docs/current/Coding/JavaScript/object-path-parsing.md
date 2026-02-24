---
id: object-path-parsing
title: '[Medium] Parsing Path Objek'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Deskripsi Soal

> Deskripsi Soal

Implementasikan fungsi parsing path objek yang dapat mengambil dan menetapkan nilai objek bertingkat berdasarkan string path.

### Persyaratan

1. **Fungsi `get`**: Mengambil nilai dari objek berdasarkan path

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Fungsi `set`**: Menetapkan nilai ke objek berdasarkan path

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementasi: Fungsi get

> Implementasi fungsi get

### Metode 1: Menggunakan split dan reduce

**Pendekatan**: Pecah string path menjadi array, lalu gunakan `reduce` untuk mengakses objek level demi level.

```javascript
function get(obj, path, defaultValue) {
  // Handle edge cases
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Split the path string into an array
  const keys = path.split('.');

  // Use reduce to access level by level
  const result = keys.reduce((current, key) => {
    // If current value is null or undefined, return undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // If result is undefined, return the default value
  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (need to handle array indices)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Metode 2: Mendukung Indeks Array

**Pendekatan**: Menangani indeks array pada path, seperti `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Regex to match: property names or array indices
  // Matches 'a', 'b', '[0]', 'c', etc.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Handle array index [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Metode 3: Implementasi Lengkap (menangani kasus tepi)

```javascript
function get(obj, path, defaultValue) {
  // Handle edge cases
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Parse path: supports 'a.b.c' and 'a.b[0].c' formats
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // If current value is null or undefined, return default value
    if (result == null) {
      return defaultValue;
    }

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (empty path returns original object)
```

## 3. Implementasi: Fungsi set

> Implementasi fungsi set

### Metode 1: Implementasi Dasar

**Pendekatan**: Buat struktur objek bertingkat berdasarkan path, lalu tetapkan nilainya.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Parse path
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Create nested structure
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // If key doesn't exist or isn't an object, create a new object
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // If current is not an array, convert it
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Metode 2: Implementasi Lengkap (menangani array dan objek)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Iterate to the second-to-last key, creating nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // Ensure it's an array
      if (!Array.isArray(current)) {
        // Convert object to array (preserving existing indices)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // Ensure index exists
      if (current[index] == null) {
        // Determine if next key is array or object
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Handle object key
      if (current[key] == null) {
        // Determine if next key is array or object
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // If exists but not an object, convert it
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Metode 3: Versi Sederhana (khusus objek, tanpa penanganan indeks array)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Create nested structure (except for the last key)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Pertanyaan Interview Umum

> Pertanyaan Interview Umum

### Pertanyaan 1: Fungsi get Dasar

Implementasikan fungsi `get` yang mengambil nilai objek bertingkat berdasarkan string path.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Poin penting**:

- Tangani kasus null/undefined
- Gunakan split untuk membagi path
- Akses properti objek level demi level
- Kembalikan default value jika path tidak ada

</details>

### Pertanyaan 2: Fungsi get dengan Dukungan Indeks Array

Perluas fungsi `get` agar mendukung indeks array seperti `'a.b[0].c'`.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Use regex to parse the path
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Poin penting**:

- Gunakan regex `/[^.[\]]+|\[(\d+)\]/g` untuk mem-parsing path
- Tangani indeks array format `[0]`
- Konversi indeks string menjadi angka

</details>

### Pertanyaan 3: Fungsi set

Implementasikan fungsi `set` yang menetapkan nilai objek bertingkat berdasarkan string path.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Create nested structure (except for the last key)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Poin penting**:

- Buat struktur objek bertingkat level demi level
- Pastikan objek pada path perantara ada
- Tetapkan nilai target di akhir

</details>

### Pertanyaan 4: Implementasi Lengkap get dan set

Implementasikan fungsi `get` dan `set` lengkap dengan dukungan indeks array dan penanganan kasus tepi.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
// get function
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// set function
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Create nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Set value
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Praktik Terbaik

> Praktik Terbaik

### Pendekatan yang Direkomendasikan

```javascript
// 1. Handle edge cases
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Use regex to parse complex paths
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Determine the next key's type in set
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Use nullish coalescing for default values
return result ?? defaultValue;
```

### Pendekatan yang Harus Dihindari

```javascript
// 1. ❌ Don't forget to handle null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // May throw
}

// 2. ❌ Don't directly mutate the original object (unless explicitly required)
function set(obj, path, value) {
  // Should return the modified object, not just mutate directly
}

// 3. ❌ Don't ignore the difference between arrays and objects
// Need to determine if the next key is an array index or object key
```

## 6. Ringkasan Interview

> Ringkasan Interview

### Referensi Cepat

**Parsing Path Objek**:

- **fungsi get**: Ambil nilai berdasarkan path, tangani null/undefined, dukung default value
- **fungsi set**: Tetapkan nilai berdasarkan path, buat struktur bertingkat secara otomatis
- **Parsing path**: Gunakan regex untuk menangani format `'a.b.c'` dan `'a.b[0].c'`
- **Penanganan kasus tepi**: Tangani null, undefined, string kosong, dll.

**Langkah Implementasi**:

1. Parsing path: `split('.')` atau regex
2. Akses level demi level: Gunakan loop atau `reduce`
3. Penanganan kasus tepi: Periksa null/undefined
4. Dukungan array: Tangani indeks format `[0]`

### Contoh Jawaban Interview

**T: Implementasikan fungsi yang mengambil nilai objek berdasarkan path.**

> "Saya akan mengimplementasikan fungsi `get` yang menerima objek, string path, dan default value. Pertama, tangani kasus tepi: jika objek null atau path bukan string, kembalikan default value. Lalu gunakan `split('.')` untuk memecah path menjadi array key, dan gunakan loop untuk mengakses properti objek level demi level. Pada setiap akses, cek apakah nilai saat ini null atau undefined; jika iya, kembalikan default value. Terakhir, jika hasilnya undefined, kembalikan default value; jika tidak, kembalikan hasilnya. Untuk mendukung indeks array, gunakan regex `/[^.[\]]+|\[(\d+)\]/g` untuk mem-parsing path dan menangani indeks format `[0]`."

**T: Bagaimana Anda mengimplementasikan fungsi yang menetapkan nilai objek berdasarkan path?**

> "Saya akan mengimplementasikan fungsi `set` yang menerima objek, string path, dan value. Pertama, parsing path menjadi array key, lalu iterasi hingga key kedua terakhir sambil membuat struktur objek bertingkat level demi level. Untuk setiap key perantara, jika belum ada atau bukan objek, buat objek baru. Jika key berikutnya berformat indeks array, buat array sebagai gantinya. Terakhir, tetapkan value pada key terakhir. Ini memastikan semua objek perantara di path sudah ada sebelum nilai target ditetapkan dengan benar."

## Referensi

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
