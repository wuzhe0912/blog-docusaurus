---
id: find-most-frequent-char-js
title: '[Easy] Temukan Karakter Paling Sering Muncul'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Deskripsi Soal

> Deskripsi Soal

Implementasikan fungsi yang menerima string dan mengembalikan karakter yang paling sering muncul.

### Contoh

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Metode Implementasi

> Metode Implementasi

### Metode 1: Menghitung dengan Object (Dasar)

**Pendekatan**: Iterasi string, gunakan object untuk mencatat jumlah tiap karakter, lalu cari karakter dengan jumlah tertinggi.

```javascript
function findMostFrequentChar(str) {
  // Initialize object to store characters and counts
  const charCount = {};

  // Initialize variables for tracking max count and character
  let maxCount = 0;
  let maxChar = '';

  // Iterate through the string
  for (let char of str) {
    // If the character is not in the object, set count to 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Increment this character's count
    charCount[char]++;

    // If this character's count is greater than the max count,
    // update the max count and max character
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Return the most frequent character
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Kompleksitas Waktu**: O(n), dengan n adalah panjang string
**Kompleksitas Ruang**: O(k), dengan k adalah jumlah karakter unik

### Metode 2: Hitung Dulu, Lalu Cari Maksimum (Dua Tahap)

**Pendekatan**: Iterasi pertama untuk menghitung semua karakter, lalu iterasi kedua untuk mencari nilai maksimum.

```javascript
function findMostFrequentChar(str) {
  // Phase 1: Count occurrences of each character
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2: Find the character with the most occurrences
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Kelebihan**: Logika lebih jelas, pemrosesan bertahap
**Kekurangan**: Membutuhkan dua kali iterasi

### Metode 3: Menggunakan Map (ES6)

**Pendekatan**: Gunakan Map untuk menyimpan pemetaan antara karakter dan jumlah kemunculannya.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Kelebihan**: Penggunaan Map lebih idiomatis di JavaScript modern
**Kekurangan**: Untuk kasus sederhana, object biasa bisa lebih intuitif

### Metode 4: Menggunakan reduce (Gaya Fungsional)

**Pendekatan**: Gunakan `reduce` dan `Object.entries` untuk implementasi.

```javascript
function findMostFrequentChar(str) {
  // Count occurrences of each character
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Find the character with the most occurrences
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Kelebihan**: Gaya fungsional, kode ringkas
**Kekurangan**: Keterbacaan lebih rendah, performa sedikit lebih rendah

### Metode 5: Menangani Banyak Karakter dengan Nilai Maksimum yang Sama

**Pendekatan**: Jika beberapa karakter memiliki jumlah tertinggi yang sama, kembalikan array atau karakter pertama yang ditemukan.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Count occurrences of each character
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Find all characters with the max count
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Return the first encountered (or return the entire array)
  return mostFrequentChars[0];
  // Or return all: return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (first encountered)
```

## 3. Kasus Tepi

> Penanganan Kasus Tepi

### Menangani String Kosong

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Or throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Menangani Sensitivitas Huruf Besar/Kecil

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('Hello', false)); // 'l' (case-insensitive)
console.log(findMostFrequentChar('Hello', true)); // 'l' (case-sensitive)
```

### Menangani Spasi dan Karakter Khusus

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('hello world', true)); // 'l' (ignoring spaces)
console.log(findMostFrequentChar('hello world', false)); // ' ' (space)
```

## 4. Pertanyaan Interview Umum

> Pertanyaan Interview Umum

### Pertanyaan 1: Implementasi Dasar

Implementasikan fungsi yang mencari karakter paling sering muncul dalam string.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Poin penting**:

- Gunakan object atau Map untuk mencatat jumlah setiap karakter
- Perbarui nilai maksimum saat iterasi
- Kompleksitas waktu O(n), kompleksitas ruang O(k)

</details>

### Pertanyaan 2: Versi Teroptimasi

Optimalkan fungsi di atas agar dapat menangani banyak karakter dengan nilai maksimum yang sama.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1: Count occurrences of each character
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2: Find all characters with the max count
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Return first or all based on requirements
  return mostFrequentChars[0]; // Or return mostFrequentChars
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Pertanyaan 3: Menggunakan Map

Implementasikan fungsi ini menggunakan ES6 Map.

<details>
<summary>Klik untuk menampilkan jawaban</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Lebih cocok untuk pasangan key-value dinamis; key dapat berupa tipe apa pun
- **Object**: Lebih sederhana dan intuitif; cocok untuk key bertipe string

</details>

## 5. Praktik Terbaik

> Praktik Terbaik

### Pendekatan yang Direkomendasikan

```javascript
// 1. Use clear variable names
function findMostFrequentChar(str) {
  const charCount = {}; // Clearly expresses purpose
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Handle edge cases
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Update max during iteration (single pass)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Pendekatan yang Harus Dihindari

```javascript
// 1. Don't use two iterations (unless necessary)
// ❌ Lower performance
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Second iteration
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Don't forget to handle empty strings
// ❌ May return undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // maxChar is '' for empty string
}

// 3. Don't use overly complex functional patterns (unless team convention)
// ❌ Less readable
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Ringkasan Interview

> Ringkasan Interview

### Referensi Cepat

**Langkah Implementasi**:

1. Gunakan object atau Map untuk mencatat jumlah tiap karakter
2. Perbarui nilai maksimum saat iterasi
3. Kompleksitas waktu O(n), kompleksitas ruang O(k)
4. Tangani kasus tepi (string kosong, sensitivitas huruf besar/kecil, dll.)

**Arah Optimasi**:

- Selesaikan dalam satu lintasan (hitung dan cari maksimum secara bersamaan)
- Gunakan Map untuk skenario kompleks
- Tangani banyak karakter dengan nilai maksimum yang sama
- Pertimbangkan sensitivitas huruf besar/kecil, spasi, dan kasus khusus lainnya

### Contoh Jawaban Interview

**T: Implementasikan fungsi yang mencari karakter paling sering muncul dalam string.**

> "Saya akan menggunakan object untuk mencatat jumlah setiap karakter, lalu memperbarui nilai maksimum saat melakukan iterasi string. Secara spesifik: inisialisasi object kosong `charCount` untuk menyimpan karakter beserta jumlahnya, lalu inisialisasi variabel `maxCount` dan `maxChar`. Kemudian iterasi string; untuk setiap karakter, inisialisasi ke 0 jika belum ada di object, lalu tambahkan jumlahnya. Jika jumlah karakter saat ini melebihi maxCount, perbarui maxCount dan maxChar. Terakhir, kembalikan maxChar. Pendekatan ini memiliki kompleksitas waktu O(n) dan kompleksitas ruang O(k), dengan n adalah panjang string dan k adalah jumlah karakter unik."

## Referensi

- [MDN - String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
