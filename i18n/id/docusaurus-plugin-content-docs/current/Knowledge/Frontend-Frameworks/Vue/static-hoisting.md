---
id: static-hoisting
title: '[Medium] Vue3 Static Hoisting'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. Apa itu Static Hoisting di Vue 3?

> Jelaskan static hoisting di Vue 3.

Di Vue 3, **static hoisting** adalah optimasi saat kompilasi.

### Definisi

Selama kompilasi template, Vue menganalisis node mana yang sepenuhnya statis (tidak ada dependensi reaktif).
Node statis tersebut diangkat menjadi konstanta tingkat modul dan dibuat sekali saja.
Pada render ulang berikutnya, Vue menggunakannya kembali alih-alih membuat dan membandingkannya lagi.

### Cara kerjanya

Compiler menganalisis AST template dan mengangkat subtree yang tidak pernah berubah.
Hanya bagian dinamis yang diregenerasi saat pembaruan.

### Contoh sebelum/sesudah

**Template sebelum kompilasi**:

```vue
<template>
  <div>
    <h1>Judul statis</h1>
    <p>Konten statis</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

**JavaScript hasil kompilasi (disederhanakan)**:

```js
// node statis diangkat sekali
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Judul statis');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Konten statis');

function render() {
  return h('div', null, [
    _hoisted_1, // digunakan ulang
    _hoisted_2, // digunakan ulang
    h('div', null, dynamicContent.value), // dinamis
  ]);
}
```

### Manfaat

1. Biaya pembuatan VNode lebih rendah
2. Pekerjaan diff lebih sedikit
3. Performa render lebih baik
4. Optimasi otomatis (tidak perlu kode tambahan)

## 2. Cara Kerja Static Hoisting

> Bagaimana static hoisting bekerja secara internal?

### Alur compiler

1. **Mendeteksi binding dinamis**
   - `{{ }}`, `v-bind`, `v-if`, `v-for`, props dinamis, dll.
2. **Menandai node statis**
   - Node dan anak-anaknya statis -> kandidat hoisting
3. **Mengangkat node statis**
   - Memindahkan node/konstanta statis ke luar `render()`

### Contoh 1: subtree yang sepenuhnya statis

```vue
<template>
  <div>
    <h1>Judul</h1>
    <p>Ini adalah teks statis</p>
    <div>Blok statis</div>
  </div>
</template>
```

Hasil kompilasi (disederhanakan):

```js
const _hoisted_1 = h('h1', null, 'Judul');
const _hoisted_2 = h('p', null, 'Ini adalah teks statis');
const _hoisted_3 = h('div', null, 'Blok statis');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

### Contoh 2: campuran statis dan dinamis

```vue
<template>
  <div>
    <h1>Judul statis</h1>
    <p>{{ message }}</p>
    <div class="static-class">Konten statis</div>
    <span :class="dynamicClass">Konten dinamis</span>
  </div>
</template>
```

Hasil kompilasi (disederhanakan):

```js
const _hoisted_1 = h('h1', null, 'Judul statis');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Konten statis');

function render() {
  return h('div', null, [
    _hoisted_1,
    h('p', null, message.value),
    _hoisted_3,
    h('span', { class: dynamicClass.value }, 'Konten dinamis'),
  ]);
}
```

### Contoh 3: hoisting props statis

```vue
<template>
  <div>
    <div class="container" id="main">Konten</div>
    <button disabled>Tombol</button>
  </div>
</template>
```

Hasil kompilasi (disederhanakan):

```js
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Konten');
const _hoisted_4 = h('button', _hoisted_2, 'Tombol');
```

## 3. Direktif `v-once`

> Direktif `v-once`

Jika developer ingin secara eksplisit menandai subtree sebagai render-sekali, gunakan `v-once`.

### Apa yang dilakukan `v-once`

`v-once` memberitahu Vue untuk merender elemen/subtree ini sekali saja.
Meskipun ekspresi bersifat dinamis, mereka hanya dievaluasi pada render pertama dan tidak pernah diperbarui lagi.

### Penggunaan dasar

```vue
<template>
  <div>
    <!-- render sekali -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- area reaktif normal -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Judul awal');
const content = ref('Konten awal');

setTimeout(() => {
  title.value = 'Judul baru';
  content.value = 'Konten baru';
}, 1000);
</script>
```

### `v-once` vs static hoisting

| Fitur | Static Hoisting | `v-once` |
| --- | --- | --- |
| Pemicu | Analisis compiler otomatis | Direktif manual |
| Cocok untuk | Node yang sepenuhnya statis | Ekspresi dinamis yang seharusnya render sekali |
| Performa | Terbaik untuk bagian statis | Baik untuk render dinamis satu kali |
| Waktu keputusan | Saat kompilasi | Niat developer |

### Kasus penggunaan umum

```vue
<template>
  <!-- Kasus 1: data tampilan satu kali -->
  <div v-once>
    <p>Dibuat pada: {{ createdAt }}</p>
    <p>Dibuat oleh: {{ creator }}</p>
  </div>

  <!-- Kasus 2: subtree berat tapi stabil -->
  <div v-once>
    <div class="header">
      <h1>Judul</h1>
      <nav>Navigasi</nav>
    </div>
  </div>

  <!-- Kasus 3: snapshot satu kali di item list -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Pertanyaan Wawancara Umum

> Pertanyaan wawancara umum

### Pertanyaan 1: cara kerja internal static hoisting

Jelaskan static hoisting dan bagaimana ia meningkatkan performa.

<details>
<summary>Klik untuk melihat jawaban</summary>

Static hoisting adalah optimasi saat kompilasi:

1. compiler memindai template untuk node statis vs dinamis
2. node statis dipindahkan ke luar `render()` sebagai konstanta
3. fase pembaruan menggunakan ulang node yang diangkat dan melewati pekerjaan diff-nya

Peningkatan performa datang dari:

- lebih sedikit alokasi VNode
- lebih sedikit traversal patch/diff
- lebih sedikit pembuatan objek berulang

</details>

### Pertanyaan 2: static hoisting vs `v-once`

Jelaskan perbedaan dan kasus penggunaan.

<details>
<summary>Klik untuk melihat jawaban</summary>

- **Static hoisting**: otomatis, untuk segmen template yang sepenuhnya statis
- **`v-once`**: manual, untuk ekspresi dinamis yang seharusnya tidak pernah diperbarui setelah render pertama

Gunakan static hoisting secara default (otomatis).
Gunakan `v-once` hanya ketika Anda sengaja menginginkan perilaku render-pertama-saja.

</details>

### Pertanyaan 3: kapan peningkatan performa terlihat

Dalam skenario apa static hoisting paling efektif?

<details>
<summary>Klik untuk melihat jawaban</summary>

Paling terlihat ketika:

1. Component mengandung banyak markup statis
2. Component sering diperbarui tetapi hanya sebagian kecil yang dinamis
3. Banyak instance berbagi struktur statis serupa

Semakin tinggi rasio statis-terhadap-dinamis dan frekuensi pembaruan, semakin besar keuntungannya.

</details>

## 5. Praktik Terbaik

> Praktik terbaik

### Disarankan

```vue
<!-- 1) Biarkan compiler mengangkat konten statis secara otomatis -->
<template>
  <div>
    <h1>Judul</h1>
    <p>Konten statis</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2) Gunakan v-once hanya untuk rendering satu kali yang disengaja -->
<template>
  <div v-once>
    <p>Dibuat pada: {{ createdAt }}</p>
    <p>Dibuat oleh: {{ creator }}</p>
  </div>
</template>

<!-- 3) Pisahkan layout stabil dari area dinamis jika memungkinkan -->
<template>
  <div class="container">
    <header>Header statis</header>
    <main>{{ content }}</main>
  </div>
</template>
```

### Hindari

```vue
<!-- 1) Jangan gunakan v-once pada konten yang harus diperbarui -->
<template>
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2) Jangan blindly menerapkan v-once pada node list dinamis -->
<template>
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Ringkasan Wawancara

> Ringkasan wawancara

### Ingatan cepat

**Static hoisting**:

- optimasi otomatis saat kompilasi
- mengangkat node/konstanta statis
- mengurangi biaya pembuatan VNode dan diff

**`v-once`**:

- perilaku render-sekali yang dikontrol developer
- dapat menyertakan ekspresi dinamis
- tidak ada pembaruan setelah render pertama

### Contoh jawaban

**T: Apa itu static hoisting di Vue 3?**

> Ini adalah optimasi compiler di mana node template yang sepenuhnya statis diangkat keluar dari fungsi render menjadi konstanta. Mereka dibuat sekali dan digunakan ulang di seluruh pembaruan, mengurangi overhead pembuatan VNode dan diff.

**T: Apa bedanya dengan `v-once`?**

> Static hoisting bersifat otomatis dan berlaku untuk konten yang sepenuhnya statis. `v-once` bersifat manual dan dapat menyertakan ekspresi dinamis, tetapi blok tersebut hanya dirender sekali dan tidak pernah diperbarui setelahnya.

## Referensi

- [Optimasi Compiler Vue 3](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Kompilasi Template Vue 3](https://vuejs.org/guide/extras/rendering-mechanism.html)
