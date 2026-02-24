---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. Apa itu ref dan reactive?

> Apa itu `ref` dan `reactive`?

`ref` dan `reactive` adalah dua API inti di Vue 3 Composition API untuk membuat state reaktif.

### ref

**Definisi**: `ref` membuat pembungkus reaktif untuk **nilai primitif** atau **referensi objek**.

<details>
<summary>Klik untuk melihat contoh dasar ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// primitif
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// objek juga bisa menggunakan ref
const user = ref({
  name: 'John',
  age: 30,
});

// akses dengan .value di JavaScript
console.log(count.value); // 0
count.value++;
</script>
```

</details>

### reactive

**Definisi**: `reactive` membuat **proxy objek** reaktif (tidak untuk nilai primitif secara langsung).

<details>
<summary>Klik untuk melihat contoh dasar reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// akses properti langsung
console.log(state.count); // 0
state.count++;
</script>
```

</details>

## 2. ref vs reactive: Perbedaan Utama

> Perbedaan utama antara `ref` dan `reactive`

### 1. Tipe yang didukung

**ref**: berfungsi dengan semua tipe.

```typescript
const count = ref(0); // number
const message = ref('Hello'); // string
const isActive = ref(true); // boolean
const user = ref({ name: 'John' }); // objek
const items = ref([1, 2, 3]); // array
```

**reactive**: berfungsi dengan objek (termasuk array), bukan primitif.

```typescript
const state = reactive({ count: 0 }); // objek
const list = reactive([1, 2, 3]); // array

const count = reactive(0); // penggunaan tidak valid
const message = reactive('Hello'); // penggunaan tidak valid
```

### 2. Gaya akses

**ref**: gunakan `.value` di JavaScript.

<details>
<summary>Klik untuk melihat contoh akses ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

console.log(count.value);
count.value = 10;
</script>

<template>
  <div>{{ count }}</div>
  <!-- di-unwrap otomatis di template -->
</template>
```

</details>

**reactive**: akses properti langsung.

<details>
<summary>Klik untuk melihat contoh akses reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

console.log(state.count);
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Perilaku penugasan ulang

**ref**: bisa ditugaskan ulang.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // valid
```

**reactive**: sebaiknya tidak ditugaskan ulang ke binding variabel objek baru.

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // kehilangan koneksi reaktivitas
```

### 4. Destructuring

**ref**: destructuring `ref.value` menghasilkan nilai biasa (tidak reaktif).

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // nilai biasa
```

**reactive**: destructuring langsung kehilangan reaktivitas.

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // kehilangan reaktivitas

import { toRefs } from 'vue';
const refs = toRefs(state);
// refs.count dan refs.message mempertahankan reaktivitas
```

## 3. Kapan menggunakan ref vs reactive?

> Kapan sebaiknya memilih masing-masing API?

### Gunakan `ref` ketika

1. State berupa primitif.

```typescript
const count = ref(0);
const message = ref('Hello');
```

2. Anda mungkin mengganti seluruh nilai/objek.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };
```

3. Anda membutuhkan template refs.

```vue
<template>
  <div ref="container"></div>
</template>
<script setup>
const container = ref(null);
</script>
```

4. Anda menginginkan gaya `.value` yang konsisten di semua nilai.

### Gunakan `reactive` ketika

1. Mengelola state objek yang kompleks.

```typescript
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});
```

2. Mengelompokkan field terkait bersama tanpa mengganti identitas objek.

```typescript
const userState = reactive({
  user: null,
  loading: false,
  error: null,
});
```

3. Anda lebih suka akses properti langsung untuk struktur bertingkat.

## 4. Pertanyaan Wawancara Umum

> Pertanyaan wawancara umum

### Pertanyaan 1: perbedaan dasar

Jelaskan output dan perilaku:

```typescript
// kasus 1: ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// kasus 2: reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// kasus 3: penugasan ulang reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```typescript
console.log(count1.value); // 10
console.log(state.count); // 10
console.log(state2.count); // 10 (nilai ada tapi tidak lagi reaktif)
```

Poin penting:

- `ref` membutuhkan `.value`
- `reactive` menggunakan akses properti langsung
- menugaskan ulang binding objek `reactive` memutus pelacakan reaktif

</details>

### Pertanyaan 2: jebakan destructuring

Apa yang salah di sini dan bagaimana memperbaikinya?

```typescript
// kasus 1: destructuring ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// kasus 2: destructuring reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Kasus 1 (`ref`)**:

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // tidak memperbarui user.value.name

// benar
user.value.name = 'Jane';
// atau
user.value = { name: 'Jane', age: 30 };
```

**Kasus 2 (`reactive`)**:

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // kehilangan reaktivitas

// pendekatan benar 1
state.count = 10;

// pendekatan benar 2
import { toRefs } from 'vue';
const refs = toRefs(state);
refs.count.value = 10;
```

Ringkasan:

- nilai biasa hasil destructuring tidak reaktif
- gunakan `toRefs` untuk destructuring objek reaktif

</details>

### Pertanyaan 3: memilih ref atau reactive

Pilih API untuk setiap skenario:

```typescript
// Skenario 1: counter
const count = ?;

// Skenario 2: state form
const form = ?;

// Skenario 3: objek user yang mungkin diganti
const user = ?;

// Skenario 4: template ref
const inputRef = ?;
```

<details>
<summary>Klik untuk melihat jawaban</summary>

```typescript
const count = ref(0); // primitif

const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // state objek yang dikelompokkan

const user = ref({ name: 'John', age: 30 }); // penggantian penuh lebih mudah

const inputRef = ref(null); // template ref harus menggunakan ref
```

Aturan praktis:

- primitif -> `ref`
- penggantian objek penuh diperlukan -> `ref`
- state objek yang dikelompokkan secara kompleks -> `reactive`
- template refs -> `ref`

</details>

## 5. Praktik Terbaik

> Praktik terbaik

### Disarankan

```typescript
// 1) primitif dengan ref
const count = ref(0);
const message = ref('Hello');

// 2) state objek terstruktur dengan reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3) gunakan ref ketika penggantian penuh sering dilakukan
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };

// 4) gunakan toRefs saat destructuring objek reactive
import { toRefs } from 'vue';
const { username, password } = toRefs(formState);
```

### Hindari

```typescript
// 1) jangan gunakan reactive untuk primitif
const count = reactive(0); // tidak valid

// 2) jangan tugaskan ulang binding reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // memutus pelacakan

// 3) hindari destructuring langsung reactive jika butuh reaktivitas
const { count } = reactive({ count: 0 }); // kehilangan pelacakan
```

## 6. Ringkasan Wawancara

> Ringkasan wawancara

### Ingatan cepat

**ref**:

- semua tipe
- `.value` di JavaScript
- penggantian penuh mudah
- di-unwrap otomatis di template

**reactive**:

- hanya objek/array
- akses properti langsung
- mempertahankan identitas objek
- gunakan `toRefs` saat destructuring

**Panduan pemilihan**:

- primitif -> `ref`
- objek yang sering diganti -> `ref`
- state objek yang dikelompokkan -> `reactive`

### Contoh jawaban

**T: Apa perbedaan antara ref dan reactive?**

> `ref` membungkus nilai dan diakses melalui `.value` di JavaScript, sedangkan `reactive` mengembalikan objek proxy dengan akses properti langsung.
> `ref` berfungsi dengan primitif dan objek; `reactive` untuk objek/array.
> Menugaskan ulang `ref.value` tidak masalah; menugaskan ulang binding `reactive` memutus pelacakan.

**T: Kapan saya harus menggunakan masing-masing?**

> Gunakan `ref` untuk primitif, template refs, dan state objek yang sering diganti secara keseluruhan.
> Gunakan `reactive` untuk state objek kompleks yang dikelompokkan di mana identitas objek yang stabil lebih diutamakan.

## Referensi

- [Vue 3 Dasar Reaktivitas](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
