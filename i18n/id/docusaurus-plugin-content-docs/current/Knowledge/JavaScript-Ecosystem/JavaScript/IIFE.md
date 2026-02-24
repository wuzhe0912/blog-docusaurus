---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. Apa itu IIFE?

IIFE adalah singkatan dari Immediately Invoked Function Expression (Ekspresi Fungsi yang Langsung Dieksekusi).
Dibandingkan dengan deklarasi fungsi biasa, IIFE membungkus fungsi dengan tambahan `()` dan langsung mengeksekusinya:

```js
(() => {
  console.log(1);
})();

# atau

(function () {
  console.log(2);
})();
```

IIFE juga bisa berjalan berulang melalui rekursi sampai kondisi berhenti tercapai, dan tanda `()` di akhir bisa menerima parameter.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('selesai!!');
})((num = 0));
```

Perlu diperhatikan bahwa IIFE berjalan saat inisialisasi (atau melalui pemanggilan diri internal), tapi tidak bisa dipanggil lagi secara langsung dari luar.

## 2. Mengapa menggunakan IIFE?

### Scope

Karena variabel yang dideklarasikan di dalam fungsi memiliki scope pada fungsi tersebut, IIFE bisa mengisolasi state dan menghindari pencemaran global:

```js
// global
const name = 'Yumi';
const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // hasil Pitt
  console.log(Hello()); // hasil Hello Pitt!
})();

console.log(name); // hasil Yumi
console.log(Hello()); // hasil Hello Yumi!
```

### Variabel dan metode privat (Private Variable and Methods)

Menggunakan IIFE dengan closure bisa membuat variabel dan metode privat.
Artinya state bisa dipertahankan di dalam fungsi dan diperbarui pada setiap pemanggilan (misalnya, menambah/mengurangi).

```js
const increment = (() => {
  let result = 0;
  console.log(result);
  const credits = (num) => {
    console.log(`Saya punya ${num} kredit.`);
  };
  return () => {
    result += 1;
    credits(result);
  };
})();

increment(); // Saya punya 1 kredit.
increment(); // Saya punya 2 kredit.
```

Hati-hati: karena variabel tersebut bertahan, penggunaan berlebihan bisa mengonsumsi memori dan menurunkan performa.

### Module

Anda bisa mengekspos fungsionalitas dalam bentuk objek sebagai pola module.
Pada contoh di bawah, Anda bisa menambah dan juga mereset state:

```js
const Score = (() => {
  let result = 0;

  return {
    current: () => {
      return result;
    },

    increment: () => {
      result += 1;
    },

    reset: () => {
      result = 0;
    },
  };
})();

Score.increment();
console.log(Score.current()); // hasil 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // hasil 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // hasil 0 => reset = 0
```

Gaya lainnya:

```js
const Score = (() => {
  let result = 0;
  const current = () => {
    return result;
  };

  const increment = () => {
    result += 1;
  };

  const reset = () => {
    result = 0;
  };

  return {
    current: current,
    increment: increment,
    reset: reset,
  };
})();

Score.increment();
console.log(Score.current());
Score.increment();
console.log(Score.current());
Score.reset();
console.log(Score.current());
```

Satu catatan lagi: karena IIFE langsung dieksekusi, menempatkan dua IIFE berturut-turut bisa merusak `ASI` (Automatic Semicolon Insertion).
Saat merangkai IIFE, tambahkan titik koma secara eksplisit.
