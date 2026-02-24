---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Disarankan: baca [Promise](/docs/promise) terlebih dahulu untuk memahami konsep dasarnya.

## Apa itu async/await?

`async/await` adalah syntax sugar yang diperkenalkan di ES2017 (ES8), dibangun di atas Promise.
Fitur ini membuat kode asinkron terlihat lebih seperti kode sinkron, sehingga meningkatkan keterbacaan dan kemudahan pemeliharaan.

**Konsep inti:**

- Fungsi `async` selalu mengembalikan sebuah Promise.
- `await` hanya bisa digunakan di dalam fungsi `async`.
- `await` menghentikan sementara eksekusi fungsi sampai Promise selesai.

## Sintaks Dasar (Basic Syntax)

### Fungsi `async`

Kata kunci `async` membuat sebuah fungsi otomatis mengembalikan Promise:

```js
// Gaya Promise tradisional
function fetchData() {
  return Promise.resolve('data');
}

// Gaya async (setara)
async function fetchData() {
  return 'data'; // otomatis dibungkus menjadi Promise.resolve('data')
}

// pola pemanggilan yang sama
fetchData().then((data) => console.log(data)); // 'data'
```

### Kata kunci `await`

`await` menunggu Promise dan mengembalikan nilai yang di-resolve:

```js
async function getData() {
  const result = await Promise.resolve('done');
  console.log(result); // 'done'
}
```

## Promise vs async/await

### Contoh 1: permintaan API sederhana

**Gaya Promise:**

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}
```

**Gaya async/await:**

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Contoh 2: merangkai beberapa operasi asinkron

**Gaya Promise:**

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
```

**Gaya async/await:**

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Penanganan Error (Error Handling)

### `try/catch` vs `.catch()`

**Gunakan `try/catch` dengan async/await:**

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Permintaan gagal:', error);
    // Anda bisa menangani berbagai jenis error di sini
    if (error.name === 'NetworkError') {
      // tangani error jaringan
    }
    throw error; // lempar ulang atau kembalikan nilai fallback
  }
}
```

**Penggunaan campuran (tidak disarankan, tapi bisa jalan):**

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Permintaan gagal:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### `try/catch` Bersarang (Nested)

Gunakan `try/catch` berlapis ketika langkah-langkah berbeda memerlukan perilaku fallback yang berbeda:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Gagal mengambil data user:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Gagal mengambil postingan:', error);
    return []; // fallback array kosong
  }
}
```

## Contoh Praktis (Practical Examples)

### Contoh: alur kerja penilaian

> Alur: menilai tugas -> cek hadiah -> berikan hadiah -> pemberhentian atau hukuman

```js
// menilai tugas
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('Anda telah mencapai ambang batas pemberhentian');
      }
    }, 2000);
  });
}

// cek hadiah
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} mendapat tiket bioskop`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} mendapat penghargaan prestasi`);
      } else {
        reject('Tidak ada hadiah');
      }
    }, 2000);
  });
}
```

**Gaya Promise:**

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Ditulis ulang dengan async/await:**

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### Contoh: permintaan bersamaan (concurrent requests)

Ketika permintaan bersifat independen, jalankan secara bersamaan.

**❌ Salah: eksekusi berurutan (lebih lambat):**

```js
async function fetchAllData() {
  const users = await fetchUsers(); // tunggu 1 detik
  const posts = await fetchPosts(); // 1 detik lagi
  const comments = await fetchComments(); // 1 detik lagi
  // total 3 detik
  return { users, posts, comments };
}
```

**✅ Benar: eksekusi bersamaan (lebih cepat):**

```js
async function fetchAllData() {
  // mulai tiga permintaan secara bersamaan
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // hanya memakan waktu selama permintaan paling lambat
  return { users, posts, comments };
}
```

**Gunakan `Promise.allSettled()` untuk kegagalan parsial:**

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## Kesalahan Umum (Common Pitfalls)

### 1. Menggunakan `await` di dalam loop (berurutan tanpa sengaja)

**❌ Salah: menunggu setiap iterasi, performa buruk:**

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // berurutan, lambat
    results.push(user);
  }
  return results;
}
// 10 user * 1 detik setiap = 10 detik
```

**✅ Benar: `Promise.all()` untuk konkurensi:**

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// permintaan bersamaan, sekitar 1 detik total
```

**Kompromi: batasi konkurensi:**

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// proses 3 sekaligus untuk menghindari terlalu banyak permintaan simultan
```

### 2. Lupa menggunakan `await`

Tanpa `await`, Anda mendapatkan Promise, bukan nilai yang di-resolve.

```js
// ❌ salah
async function getUser() {
  const user = fetchUser(1); // lupa await, user adalah Promise
  console.log(user.name); // undefined (Promise tidak punya properti name)
}

// ✅ benar
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // nama yang benar
}
```

### 3. Menggunakan `await` tanpa `async`

`await` hanya bisa digunakan di dalam fungsi `async`.

```js
// ❌ salah: syntax error
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ benar
async function getData() {
  const data = await fetchData();
  return data;
}
```

**Top-level await:**

Di lingkungan modul ES2022, Anda bisa menggunakan `await` di level teratas modul:

```js
// modul ES2022
const data = await fetchData();
console.log(data);
```

### 4. Tidak menangani error

Tanpa `try/catch`, error bisa menjadi unhandled rejection.

```js
// ❌ bisa menyebabkan error yang tidak tertangani
async function fetchData() {
  const response = await fetch('/api/data'); // throw jika permintaan gagal
  return response.json();
}

// ✅ tambahkan penanganan error
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    return null; // atau nilai fallback
  }
}
```

### 5. `async` selalu mengembalikan Promise

Bahkan tanpa `await`, fungsi `async` tetap mengembalikan Promise.

```js
async function getValue() {
  return 42; // sebenarnya Promise.resolve(42)
}

// gunakan .then() atau await untuk mendapatkan nilai
getValue().then((value) => console.log(value)); // 42

// atau
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Penggunaan Lanjutan (Advanced Usage)

### Penanganan timeout

Implementasi timeout dengan `Promise.race()`:

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Permintaan timeout')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Permintaan gagal:', error.message);
    throw error;
  }
}

// penggunaan
fetchWithTimeout('/api/data', 3000); // timeout 3 detik
```

### Mekanisme retry

Retry otomatis saat gagal:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;

      console.log(`Percobaan ${i + 1} gagal, mencoba ulang dalam ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// penggunaan
fetchWithRetry('/api/data', 3, 2000); // hingga 3 percobaan, interval 2 detik
```

### Pemrosesan berurutan dengan penyimpanan state

Terkadang eksekusi berurutan diperlukan, sambil menyimpan semua hasil antara:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // tentukan langkah berikutnya berdasarkan hasil sebelumnya
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await dalam Event Loop

`async/await` tetap berbasis Promise, sehingga mengikuti aturan Event Loop yang sama:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// urutan output: 1, 2, 4, 3
```

Penjelasan:

1. `console.log('1')` - sinkron
2. `test()` dipanggil, `console.log('2')` - sinkron
3. `await Promise.resolve()` - menjadwalkan kode sisanya sebagai micro task
4. `console.log('4')` - sinkron
5. micro task berjalan, `console.log('3')`

## Poin Penting untuk Wawancara (Interview Key Points)

1. **`async/await` adalah syntax sugar dari Promise**: sintaks lebih bersih, model dasar yang sama.
2. **Gunakan `try/catch` untuk penanganan error**: lebih disukai daripada chained `.catch()` dalam gaya async/await.
3. **Konkurensi vs urutan itu penting**: hindari `await` secara buta di dalam loop.
4. **`async` selalu mengembalikan Promise**: bahkan tanpa return Promise secara eksplisit.
5. **`await` memerlukan konteks async**: kecuali top-level await di modul ES2022.
6. **Pahami perilaku Event Loop**: kode setelah `await` berjalan sebagai micro task.

## Topik Terkait (Related Topics)

- [Promise](/docs/promise) - fondasi async/await
- [Event Loop](/docs/event-loop) - model urutan eksekusi

## Referensi

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
