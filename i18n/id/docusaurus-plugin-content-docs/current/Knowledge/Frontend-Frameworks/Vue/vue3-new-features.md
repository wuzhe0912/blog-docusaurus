---
id: vue3-new-features
title: '[Easy] Fitur Baru Vue3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. Apa saja fitur baru di Vue 3?

> Apa saja fitur baru utama di Vue 3?

Vue 3 memperkenalkan beberapa peningkatan penting:

### Fitur utama

1. **Composition API**
2. **Teleport**
3. **Fragment (beberapa root node)**
4. **Suspense**
5. **Multiple `v-model` binding**
6. **Dukungan TypeScript yang lebih baik**
7. **Peningkatan performa** (bundle lebih kecil, rendering lebih cepat)

## 2. Teleport

> Apa itu Teleport?

`Teleport` memungkinkan Anda merender bagian dari component ke lokasi lain di pohon DOM tanpa mengubah kepemilikan component atau struktur logika.

### Kasus penggunaan umum

Modal, Tooltip, Notification, Popover, layer overlay.

```vue
<template>
  <div>
    <button @click="showModal = true">Buka Modal</button>

    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Judul Modal</h2>
          <p>Konten Modal</p>
          <button @click="showModal = false">Tutup</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

### Mengapa Teleport membantu

1. Mengatasi masalah stacking context / z-index
2. Menghindari clipping oleh overflow ancestor
3. Menjaga logika component tetap di satu tempat sambil merender di tempat lain

## 3. Fragment (Beberapa Root Node)

> Apa itu Fragment di Vue 3?

Vue 3 memungkinkan template component memiliki beberapa root node.
Berbeda dengan React, Vue menggunakan fragment implisit (tidak perlu tag `<Fragment>` tambahan).

### Vue 2 vs Vue 3

**Vue 2**: memerlukan satu root.

```vue
<template>
  <div>
    <h1>Judul</h1>
    <p>Konten</p>
  </div>
</template>
```

**Vue 3**: beberapa root diperbolehkan.

```vue
<template>
  <h1>Judul</h1>
  <p>Konten</p>
</template>
```

### Mengapa Fragment penting

1. Lebih sedikit elemen pembungkus yang tidak perlu
2. HTML yang lebih semantis
3. Pohon DOM yang lebih dangkal
4. Styling dan selector yang lebih bersih

### Pewarisan atribut di component multi-root

Dengan template multi-root, atribut parent (`class`, `id`, dll.) tidak otomatis diterapkan ke root tertentu.
Gunakan `$attrs` secara manual.

```vue
<!-- Parent -->
<MyComponent class="custom-class" id="my-id" />

<!-- Child -->
<template>
  <div v-bind="$attrs">Root pertama</div>
  <div>Root kedua</div>
</template>
```

Anda dapat mengontrol perilaku dengan:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
```

### Fragment vs React Fragment

| Fitur | Vue 3 Fragment | React Fragment |
| --- | --- | --- |
| Sintaks | Implisit (tidak perlu tag) | Eksplisit (`<>` atau `<Fragment>`) |
| Penanganan key | Aturan normal vnode/key di list | Key didukung pada `<Fragment key=...>` |
| Penerusan atribut | Gunakan `$attrs` secara manual di multi-root | Tidak ada atribut fragment langsung |

## 4. Suspense

> Apa itu Suspense?

`Suspense` adalah component bawaan untuk state loading dependensi async.
Ia merender UI fallback saat component/setup async sedang di-resolve.

### Penggunaan dasar

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Memuat...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Kasus penggunaan umum

1. Pemuatan component async
2. Kebutuhan data async `setup()`
3. UI skeleton tingkat route atau bagian

## 5. Multiple v-model

> Multiple `v-model` binding

Vue 3 mendukung beberapa binding `v-model` pada satu component.
Setiap binding dipetakan ke prop + event `update:propName`.

### Vue 2 vs Vue 3

**Vue 2**: satu pola `v-model` per component.

```vue
<CustomInput v-model="value" />
```

**Vue 3**: beberapa binding `v-model` bernama.

```vue
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Contoh implementasi component

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
    />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Pertanyaan Wawancara Umum

> Pertanyaan wawancara umum

### Pertanyaan 1: kapan sebaiknya menggunakan Teleport?

<details>
<summary>Klik untuk melihat jawaban</summary>

Gunakan Teleport ketika rendering visual harus keluar dari batasan DOM lokal:

1. **Dialog modal** untuk menghindari masalah stacking/overflow parent
2. **Tooltip/popover** yang tidak boleh terpotong
3. **Notifikasi global** yang dirender di container root khusus

Hindari Teleport untuk konten in-flow normal.

</details>

### Pertanyaan 2: manfaat Fragment

<details>
<summary>Klik untuk melihat jawaban</summary>

Manfaat:

1. lebih sedikit node pembungkus
2. struktur semantik yang lebih baik
3. CSS yang lebih sederhana di banyak layout
4. kedalaman DOM dan overhead yang lebih sedikit

</details>

### Pertanyaan 3: pewarisan atribut multi-root

<details>
<summary>Klik untuk melihat jawaban</summary>

Untuk component multi-root, atribut tidak diwariskan otomatis ke satu root.
Tangani secara eksplisit dengan `$attrs` dan opsional `inheritAttrs: false`.

```vue
<template>
  <div v-bind="$attrs">Root A</div>
  <div>Root B</div>
</template>
```

</details>

### Pertanyaan 4: Fragment di Vue vs React

<details>
<summary>Klik untuk melihat jawaban</summary>

Vue menggunakan perilaku fragment implisit di template.
React memerlukan sintaks fragment eksplisit (`<>...</>` atau `<Fragment>`).

</details>

### Pertanyaan 5: contoh implementasi Suspense

<details>
<summary>Klik untuk melihat jawaban</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Memuat profil pengguna...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

</details>

## 7. Praktik Terbaik

> Praktik terbaik

### Disarankan

```vue
<!-- 1) Gunakan Teleport untuk overlay -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2) Jaga template multi-root yang semantis jika sesuai -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3) Bungkus bagian async dengan Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4) Gunakan nama eksplisit untuk multiple v-model -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Hindari

```vue
<!-- 1) Jangan terlalu sering menggunakan Teleport untuk konten biasa -->
<Teleport to="body">
  <div>Konten normal</div>
</Teleport>

<!-- 2) Jangan gunakan multi-root hanya untuk style; jaga pengelompokan logis -->
<template>
  <h1>Judul</h1>
  <p>Konten</p>
</template>

<!-- 3) Jangan abaikan penanganan error/loading async -->
<Suspense>
  <AsyncComponent />
</Suspense>
```

## 8. Ringkasan Wawancara

> Ringkasan wawancara

### Ingatan cepat

**Fitur utama Vue 3**:

- Composition API
- Teleport
- Fragment
- Suspense
- Multiple `v-model`

### Contoh jawaban

**T: Apa saja fitur utama Vue 3?**

> Composition API untuk organisasi logika dan penggunaan ulang yang lebih baik, Teleport untuk merender overlay di luar container DOM lokal, Fragment untuk beberapa root node, Suspense untuk state loading async, multiple `v-model` binding, dan peningkatan TypeScript/performa yang lebih kuat.

**T: Apa kasus penggunaan praktis Teleport?**

> Merender modal/overlay ke `body` untuk menghindari masalah clipping dan stacking, sambil menjaga logika modal di dalam pohon component asli.

## Referensi

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
