---
id: vue-basic-api
title: '[Medium] 📄 Vue Basic & API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Bisakah Anda menjelaskan prinsip inti dan keunggulan framework Vue?

> Jelaskan prinsip inti dan kekuatan Vue.

### Prinsip inti

Vue adalah framework JavaScript yang progresif. Konsep intinya meliputi:

#### 1. Virtual DOM

Vue menggunakan diffing Virtual DOM untuk memperbarui hanya bagian yang berubah dari DOM asli.

```js
// konsep Virtual DOM yang disederhanakan
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Reactive data binding (pengikatan data reaktif)

Data reaktif memperbarui UI secara otomatis. Dengan form binding (`v-model`), input UI juga dapat memperbarui state.

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

#### 3. Arsitektur berbasis component

UI dipecah menjadi component yang dapat digunakan ulang dan diuji dengan kepentingan yang terisolasi.

```vue
<!-- Button.vue -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => emit('click');
</script>
```

#### 4. Lifecycle hooks

Hook memungkinkan Anda menjalankan logika pada waktu pembuatan/pemasangan/pembaruan/pelepasan.

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Component mounted');
});

onUpdated(() => {
  console.log('Component updated');
});

onUnmounted(() => {
  console.log('Component unmounted');
});
</script>
```

#### 5. Sistem directive

Directive Vue menyediakan logika UI deklaratif (`v-if`, `v-for`, `v-bind`, `v-model`, dll.).

```vue
<template>
  <div v-if="isVisible">Konten terlihat</div>

  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <img :src="imageUrl" :alt="imageAlt" />

  <input v-model="username" />
</template>
```

#### 6. Sintaks template

Template mendukung interpolasi dan ekspresi sambil menjaga markup tetap mudah dibaca.

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ count + 1 }}</p>
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Kekuatan Vue (sering dibandingkan dengan React)

#### 1. Biaya onboarding lebih rendah

Single-file components (`template/script/style`) intuitif untuk banyak tim.

#### 2. Directive deklaratif bawaan

Tugas UI umum menjadi ringkas dengan directive.

#### 3. Two-way form binding yang mudah

`v-model` menawarkan pola kelas pertama untuk sinkronisasi input.

#### 4. Pemisahan template/logika yang jelas

Beberapa tim lebih suka struktur template-first daripada pola yang banyak JSX.

#### 5. Ekosistem resmi yang kohesif

Vue Router + Pinia + integrasi tooling selaras dengan baik.

## 2. Jelaskan penggunaan `v-model`, `v-bind` dan `v-html`

> Jelaskan penggunaan `v-model`, `v-bind`, dan `v-html`.

### `v-model`: two-way binding untuk kontrol form

```vue
<template>
  <div>
    <input v-model="message" />
    <p>Pesan: {{ message }}</p>

    <input type="checkbox" v-model="checked" />
    <p>Dicentang: {{ checked }}</p>

    <select v-model="selected">
      <option value="A">Opsi A</option>
      <option value="B">Opsi B</option>
    </select>
    <p>Terpilih: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### Modifier `v-model`

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" type="number" />
<input v-model.trim="msg" />
```

### `v-bind`: pengikatan atribut dinamis

```vue
<template>
  <div>
    <div :class="{ active: isActive, 'text-danger': hasError }">Class dinamis</div>

    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Style dinamis</div>

    <img :src="imageUrl" :alt="imageAlt" />

    <a :href="linkUrl">Pergi ke tautan</a>

    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Deskripsi gambar',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### Singkatan `v-bind`

```vue
<img v-bind:src="imageUrl" />
<img :src="imageUrl" />
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: merender string HTML mentah

```vue
<template>
  <div>
    <p>{{ rawHtml }}</p>
    <p v-html="rawHtml"></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Teks merah</span>',
    };
  },
};
</script>
```

#### Peringatan keamanan

Jangan pernah menggunakan `v-html` langsung pada input pengguna yang tidak tepercaya (risiko XSS).

```vue
<!-- tidak aman -->
<div v-html="userProvidedContent"></div>

<!-- lebih aman: konten yang sudah disanitasi -->
<div v-html="sanitizedHtml"></div>
```

#### Pendekatan lebih aman dengan sanitizer

```vue
<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Perbandingan cepat

| Directive | Tujuan | Singkatan | Contoh |
| --- | --- | --- | --- |
| `v-model` | Two-way form binding | Tidak ada | `<input v-model="msg">` |
| `v-bind` | One-way attribute binding | `:` | `<img :src="url">` |
| `v-html` | Merender HTML mentah | Tidak ada | `<div v-html="html"></div>` |

## 3. Bagaimana cara mengakses elemen HTML (Template Refs)?

> Bagaimana cara memanipulasi elemen HTML di Vue (misalnya fokus input)?

Gunakan template refs alih-alih `document.querySelector` di dalam component.

### Options API (Vue 2 / Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Fokus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Fokus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputElement = ref(null);

const focusInput = () => {
  inputElement.value?.focus();
};

onMounted(() => {
  console.log(inputElement.value);
});
</script>
```

Catatan:

- nama ref di template harus cocok dengan variabel script
- akses setelah mount (`onMounted` / `mounted`)
- di dalam `v-for`, refs menjadi array

## 4. Jelaskan perbedaan antara `v-show` dan `v-if`

> Jelaskan perbedaan antara `v-show` dan `v-if`.

### Kesamaan

Keduanya mengontrol visibilitas berdasarkan kondisi.

```vue
<template>
  <div v-if="isVisible">Menggunakan v-if</div>
  <div v-show="isVisible">Menggunakan v-show</div>
</template>
```

### Perbedaan

#### 1) Perilaku DOM

- `v-if`: mount/unmount node
- `v-show`: selalu di-mount; mengubah CSS `display`

#### 2) Profil performa

- `v-if`: biaya awal lebih rendah saat false, biaya toggle lebih tinggi
- `v-show`: biaya awal lebih tinggi, biaya toggle lebih rendah

#### 3) Dampak lifecycle

- `v-if` memicu lifecycle child penuh saat toggle
- `v-show` tidak melakukan unmount; tidak ada mount/unmount saat toggle

#### 4) Biaya render awal

Untuk component berat yang awalnya tersembunyi:

- `v-if="false"`: component tidak dirender
- `v-show="false"`: component dirender tapi tersembunyi

#### 5) Kombinasi directive

- `v-if` mendukung `v-else-if` / `v-else`
- `v-show` tidak

### Kapan menggunakan masing-masing

#### Gunakan `v-if` ketika

1. kondisi jarang berubah
2. false di awal harus menghindari biaya rendering
3. Anda membutuhkan cabang kondisional dengan `v-else`
4. efek samping mount/unmount diinginkan

#### Gunakan `v-show` ketika

1. visibilitas sering berganti
2. component harus tetap di-mount untuk mempertahankan state internal
3. remounting lifecycle tidak diperlukan

### Tabel ringkasan

| Fitur | `v-if` | `v-show` |
| --- | --- | --- |
| Biaya awal | Lebih rendah (saat false) | Lebih tinggi (selalu merender) |
| Biaya toggle | Lebih tinggi | Lebih rendah |
| Lifecycle saat toggle | Ya | Tidak |
| Terbaik untuk | Toggle jarang | Toggle sering |

### Tips mengingat

- `v-if`: "render hanya saat diperlukan"
- `v-show`: "render sekali, sembunyikan/tampilkan via CSS"

## 5. Apa perbedaan antara `computed` dan `watch`?

> Apa perbedaan antara `computed` dan `watch`?

Keduanya bereaksi terhadap perubahan state tetapi menyelesaikan masalah yang berbeda.

### `computed`

#### Karakteristik inti

1. menurunkan data baru dari state reaktif yang ada
2. di-cache sampai dependensi berubah
3. sinkron dan berorientasi pada nilai kembalian
4. dapat digunakan langsung di template

#### Kasus penggunaan umum

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const emailLowerCase = computed(() => email.value.toLowerCase());
const cartTotal = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
);
const filteredItems = computed(() =>
  !searchText.value
    ? items.value
    : items.value.filter((item) =>
        item.name.toLowerCase().includes(searchText.value.toLowerCase())
      )
);
</script>
```

#### Keunggulan caching

```vue
<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed hanya berjalan saat dependensi berubah');
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method berjalan setiap pemanggilan');
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### Bentuk getter + setter

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});
</script>
```

### `watch`

#### Karakteristik inti

1. secara eksplisit memantau sumber
2. ditujukan untuk efek samping
3. mendukung alur kerja async
4. dapat mengakses `newValue` dan `oldValue`

#### Kasus penggunaan umum

```vue
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);

const username = ref('');
const usernameError = ref('');

const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// 1) pencarian debounce
watch(searchQuery, (newQuery, oldQuery) => {
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 2) efek samping validasi
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'Username harus minimal 3 karakter';
  } else if (newUsername.length > 20) {
    usernameError.value = 'Username harus maksimal 20 karakter';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value =
      'Username hanya boleh mengandung huruf, angka, dan underscore';
  } else {
    usernameError.value = '';
  }
});

// 3) efek samping autosave
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### Opsi `watch`

```vue
<script setup>
import { ref, watch } from 'vue';

const user = ref({
  name: 'John',
  profile: { age: 30, city: 'Taipei' },
});
const items = ref([1, 2, 3]);

// immediate: jalankan sekali langsung
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Nama berubah dari ${oldName} ke ${newName}`);
  },
  { immediate: true }
);

// deep: lacak mutasi bertingkat
watch(
  user,
  (newUser) => {
    console.log('objek user bertingkat berubah', newUser);
  },
  { deep: true }
);

// flush: kontrol waktu (pre/post/sync)
watch(
  items,
  () => {
    console.log('items berubah');
  },
  { flush: 'post' }
);
</script>
```

#### Watch beberapa sumber

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Nama berubah dari ${oldFirst} ${oldLast} ke ${newFirst} ${newLast}`);
});
</script>
```

### `computed` vs `watch`

| Fitur | computed | watch |
| --- | --- | --- |
| Tujuan utama | menurunkan nilai | efek samping saat perubahan |
| Nilai kembalian | diperlukan | opsional/tidak ada |
| Cache | ya | tidak |
| Pelacakan dependensi | otomatis | sumber eksplisit |
| Efek samping async | tidak | ya |
| Nilai lama/baru | tidak | ya |
| Penggunaan langsung di template | ya | tidak |

### Aturan praktis

- **`computed` menghitung data**
- **`watch` melakukan aksi**

### Perbandingan benar/salah

#### Salah

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Benar

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

### Latihan: menghitung `x * y`

Diberikan `x = 0`, `y = 5`, dan tombol menambah `x` sebanyak 1 setiap klik.

#### Solusi A: `computed` (disarankan)

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Hasil (X * Y): {{ result }}</p>
    <button @click="x++">Tambah X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

const result = computed(() => x.value * y.value);
</script>
```

#### Solusi B: `watch` (berfungsi tapi lebih verbose)

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Referensi

- [Dokumentasi Resmi Vue 3](https://vuejs.org/)
- [Panduan Migrasi Vue 2 ke Vue 3](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties dan Watchers](https://vuejs.org/guide/essentials/computed.html)
