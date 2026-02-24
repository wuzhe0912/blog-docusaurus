---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Apa itu Promise?

Promise adalah fitur ES6 yang diperkenalkan terutama untuk menyelesaikan callback hell dan membuat kode asinkron lebih mudah dibaca dan dipelihara.
Promise merepresentasikan penyelesaian akhir (atau kegagalan) dari operasi asinkron dan nilai yang dihasilkannya.

Promise memiliki tiga state:

- **pending**: state awal
- **fulfilled**: operasi berhasil diselesaikan
- **rejected**: operasi gagal

## Penggunaan Dasar (Basic Usage)

### Membuat Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // operasi asinkron
  const success = true;

  if (success) {
    resolve('Berhasil!'); // Promise menjadi fulfilled
  } else {
    reject('Gagal!'); // Promise menjadi rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Berhasil!'
  })
  .catch((error) => {
    console.log(error); // 'Gagal!'
  });
```

### Contoh dunia nyata: menangani permintaan API

```js
// fungsi bersama untuk permintaan API
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // periksa apakah respons dalam rentang 200~299
      if (!response.ok) {
        throw new Error('Respons jaringan tidak ok ' + response.statusText);
      }
      return response.json(); // ubah respons ke JSON dan kembalikan
    })
    .catch((error) => {
      // tangani masalah jaringan atau kegagalan permintaan
      console.log('Ada masalah dengan operasi fetch Anda:', error);
      throw error; // lempar ulang untuk penanganan upstream
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('Data pengguna diterima:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## Metode Promise (Promise Methods)

### `.then()` / `.catch()` / `.finally()`

```js
promise
  .then((result) => {
    // tangani keberhasilan
    return result;
  })
  .catch((error) => {
    // tangani error
    console.error(error);
  })
  .finally(() => {
    // berjalan terlepas dari berhasil atau gagal
    console.log('Promise selesai');
  });
```

### `Promise.all()`

Resolve saat semua Promise resolve, dan reject langsung saat salah satu Promise reject.

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**Kapan digunakan**: lanjutkan hanya setelah semua pemanggilan API berhasil.

### `Promise.race()`

Mengembalikan hasil dari Promise pertama yang selesai (fulfilled atau rejected).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('pertama'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('kedua'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'kedua' (lebih cepat)
});
```

**Kapan digunakan**: penanganan timeout permintaan, atau mengambil respons tercepat.

### `Promise.allSettled()`

Menunggu semua Promise selesai (fulfilled/rejected), lalu mengembalikan semua hasil.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Error');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Error' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Kapan digunakan**: Anda memerlukan semua hasil, bahkan jika beberapa gagal.

### `Promise.any()`

Resolve dengan Promise pertama yang fulfilled. Reject hanya jika semua Promise reject.

```js
const promise1 = Promise.reject('Error 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Berhasil'), 100)
);
const promise3 = Promise.reject('Error 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Berhasil'
});
```

**Kapan digunakan**: sumber daya fallback di mana satu keberhasilan sudah cukup.

## Pertanyaan Wawancara (Interview Questions)

### Pertanyaan 1: Promise chaining dan penanganan error

Prediksi outputnya:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('Ini tidak akan berjalan'));
```

#### Penjelasan langkah demi langkah

```js
Promise.resolve(1) // mengembalikan 1
  .then((x) => x + 1) // x = 1, mengembalikan 2
  .then(() => {
    throw new Error('My Error'); // throw -> ke catch
  })
  .catch((e) => 1) // menangkap dan mengembalikan nilai normal 1
  .then((x) => x + 1) // x = 1, mengembalikan 2
  .then((x) => console.log(x)) // mencetak 2
  .catch((e) => console.log('Ini tidak akan berjalan')); // tidak dieksekusi
```

**Jawaban: `2`**

#### Konsep Kunci

1. **`catch` bisa memulihkan dengan nilai normal**: saat `catch()` mengembalikan nilai normal, chain berlanjut dalam mode fulfilled.
2. **`then` setelah `catch` tetap berjalan**: karena error telah ditangani.
3. **`catch` terakhir tidak berjalan**: tidak ada error baru yang dilempar.

Jika Anda ingin error terus merambat, lempar ulang di `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Error tertangkap');
    throw e; // lempar ulang
  })
  .then((x) => x + 1) // tidak akan berjalan
  .then((x) => console.log(x)) // tidak akan berjalan
  .catch((e) => console.log('Ini akan berjalan')); // akan berjalan
```

### Pertanyaan 2: Event Loop dan urutan eksekusi

> Pertanyaan ini juga menguji pemahaman Event Loop.

Prediksi outputnya:

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

#### Pahami urutan di `d()`

```js
function d() {
  setTimeout(c, 100); // 4. macro task (delay 100ms)
  const temp = Promise.resolve().then(a); // 2. micro task (setelah kode sync)
  console.log('Warrior'); // 1. kode sync
  setTimeout(b, 0); // 3. macro task (0ms, tetap macro)
}
```

Urutan eksekusi:

1. **Kode sinkron**: `console.log('Warrior')` -> `Warrior`
2. **Micro task**: `Promise.resolve().then(a)` -> jalankan `a()` -> `Warlock`
3. **Macro task**:
   - `setTimeout(b, 0)` berjalan duluan
   - jalankan `b()` -> `Druid`
   - di dalam `b`, `Promise.resolve().then(...)` adalah micro task -> `Rogue`
4. **Macro task**: `setTimeout(c, 100)` berjalan kemudian -> `Mage`

#### Jawaban

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Konsep Kunci

- **Kode sync** > **Micro task (`Promise`)** > **Macro task (`setTimeout`)**
- Callback `.then()` adalah micro task: berjalan setelah macro task saat ini, sebelum macro task berikutnya
- `setTimeout(..., 0)` tetap macro task dan berjalan setelah micro task

### Pertanyaan 3: perilaku sinkron vs asinkron konstruktor Promise

Prediksi outputnya:

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// output ?
```

#### Detail penting

Poin kunci: **kode di dalam konstruktor Promise berjalan secara sinkron**.
Hanya callback `.then()` / `.catch()` yang bersifat asinkron.

Analisis eksekusi:

```js
console.log(1); // 1. sync
setTimeout(() => console.log(2), 1000); // 5. macro task (1000ms)
setTimeout(() => console.log(3), 0); // 4. macro task (0ms)

new Promise((resolve, reject) => {
  console.log(4); // 2. sync (di dalam konstruktor)
  resolve(5);
}).then((foo) => {
  console.log(6); // micro task
});

console.log(7); // 3. sync
```

Alur eksekusi:

1. **Sync**: 1 -> 4 -> 7
2. **Micro task**: 6
3. **Macro task** (berdasarkan delay): 3 -> 2

#### Jawaban

```
1
4
7
6
3
2
```

#### Konsep Kunci

1. **Body konstruktor Promise bersifat sinkron**: `console.log(4)` bukan async.
2. **Hanya `.then()` dan `.catch()` yang merupakan micro task asinkron**.
3. **Urutan**: kode sync -> micro task -> macro task.

## Jebakan Umum (Common Pitfalls)

### 1. Lupa `return`

Jika Anda lupa `return` dalam chain Promise, `.then()` berikutnya menerima `undefined`.

```js
// ❌ salah
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // lupa return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ benar
fetchUser()
  .then((user) => {
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log(posts); // data yang benar
  });
```

### 2. Lupa menangkap error

Promise rejection yang tidak tertangani bisa merusak alur dan membuat error runtime yang berisik.

```js
// ❌ bisa menyebabkan unhandled rejection
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ tambahkan catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Terjadi error:', error);
  });
```

### 3. Penggunaan berlebihan `new Promise(...)`

Jangan membungkus fungsi yang sudah mengembalikan Promise.

```js
// ❌ pembungkusan yang tidak perlu
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ kembalikan langsung
function fetchData() {
  return fetch(url);
}
```

### 4. Merangkai beberapa catch secara tidak benar

Setiap `catch()` menangani error dari bagian sebelumnya dalam chain.

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Tertangkap:', e.message); // Tertangkap: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Tertangkap:', e.message); // Tertangkap: Error 2
  });
```

## Topik Terkait (Related Topics)

- [async/await](/docs/async-await) - syntax sugar Promise yang lebih bersih
- [Event Loop](/docs/event-loop) - pemahaman model asinkron yang lebih dalam

## Referensi

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
