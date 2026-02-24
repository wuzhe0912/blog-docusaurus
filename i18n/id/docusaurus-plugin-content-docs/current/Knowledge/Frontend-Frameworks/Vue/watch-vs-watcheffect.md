---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. Apa itu watch dan watchEffect?

> Apa itu `watch` dan `watchEffect`?

`watch` dan `watchEffect` adalah API Vue 3 untuk bereaksi terhadap perubahan state reaktif.

### watch

**Definisi**: secara eksplisit memantau satu atau beberapa sumber, dan menjalankan callback saat berubah.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// memantau satu sumber
watch(count, (newValue, oldValue) => {
  console.log(`count berubah dari ${oldValue} ke ${newValue}`);
});

// memantau beberapa sumber
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count atau message berubah');
});
</script>
```

### watchEffect

**Definisi**: berjalan segera dan secara otomatis melacak dependensi reaktif yang digunakan di dalam callback-nya.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// otomatis melacak count dan message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // berjalan ulang saat count/message berubah
});
</script>
```

## 2. watch vs watchEffect: Perbedaan Utama

> Perbedaan utama antara `watch` dan `watchEffect`

### 1. Deklarasi sumber

**watch**: sumber eksplisit.

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal, oldVal) => {
  console.log('count berubah');
});

watch([count, message], ([newCount, newMessage]) => {
  console.log('count atau message berubah');
});
```

**watchEffect**: pelacakan dependensi implisit.

```typescript
const count = ref(0);
const message = ref('Hello');

watchEffect(() => {
  console.log(count.value); // dilacak secara otomatis
  console.log(message.value); // dilacak secara otomatis
});
```

### 2. Waktu eksekusi

**watch**: lazy secara default; berjalan hanya setelah sumber berubah.

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('berjalan');
});

count.value = 1; // memicu callback
```

**watchEffect**: berjalan segera, lalu berjalan ulang saat dependensi diperbarui.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('berjalan'); // eksekusi pertama segera
  console.log(count.value);
});

count.value = 1; // berjalan lagi
```

### 3. Akses ke nilai lama

**watch**: memberikan `newValue` dan `oldValue`.

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`dari ${oldVal} ke ${newVal}`);
});
```

**watchEffect**: tidak ada nilai lama secara langsung.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // hanya nilai saat ini
});
```

### 4. Menghentikan watcher

Keduanya mengembalikan fungsi stop.

```typescript
const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

stopWatch();
stopEffect();
```

## 3. Kapan menggunakan watch vs watchEffect?

> Kapan sebaiknya memilih masing-masing API?

### Gunakan `watch` ketika

1. Anda membutuhkan sumber eksplisit.

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

2. Anda membutuhkan nilai lama.

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`dari ${oldVal} ke ${newVal}`);
});
```

3. Anda membutuhkan eksekusi lazy.

```typescript
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    search(newQuery);
  }
});
```

4. Anda membutuhkan kontrol detail (`immediate`, `deep`, dll.).

```typescript
watch(
  () => user.value.id,
  (newId) => {
    fetchUser(newId);
  },
  { immediate: true, deep: true }
);
```

### Gunakan `watchEffect` ketika

1. Anda menginginkan pelacakan dependensi otomatis.

```typescript
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});
```

2. Anda tidak membutuhkan nilai lama.

```typescript
watchEffect(() => {
  console.log(`count saat ini: ${count.value}`);
});
```

3. Anda menginginkan eksekusi pertama segera.

```typescript
watchEffect(() => {
  updateChart(count.value, message.value);
});
```

## 4. Pertanyaan Wawancara Umum

> Pertanyaan wawancara umum

### Pertanyaan 1: urutan eksekusi

Jelaskan output dan urutan:

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal) => {
  console.log('watch:', newVal);
});

watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Klik untuk melihat jawaban</summary>

`watch` bersifat lazy (tidak langsung berjalan), tetapi `watchEffect` berjalan segera.

Urutan yang diharapkan:

1. `watchEffect: 0 Hello` (eksekusi awal)
2. `watch: 1` (count berubah)
3. `watchEffect: 1 Hello` (count berubah)
4. `watchEffect: 1 World` (message berubah)

Poin penting:

- `watch` hanya bereaksi terhadap sumber yang dipantau secara eksplisit
- `watchEffect` bereaksi terhadap semua dependensi reaktif yang digunakan di callback

</details>

### Pertanyaan 2: nilai lama dengan watchEffect

Bagaimana cara mengakses nilai lama saat menggunakan `watchEffect`?

<details>
<summary>Klik untuk melihat jawaban</summary>

`watchEffect` tidak menyediakan nilai lama secara langsung.

**Opsi 1: simpan ref previous sendiri**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`dari ${prevCount.value} ke ${count.value}`);
  prevCount.value = count.value;
});
```

**Opsi 2: gunakan watch**

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`dari ${oldVal} ke ${newVal}`);
});
```

Rekomendasi: jika nilai lama diperlukan, lebih baik gunakan `watch`.

</details>

### Pertanyaan 3: memilih watch atau watchEffect

Pilih API untuk setiap skenario:

```typescript
// Skenario 1: memuat ulang data user saat userId berubah
const userId = ref(1);

// Skenario 2: mengaktifkan submit saat form valid
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// Skenario 3: pencarian dengan debounce saat keyword berubah
const searchQuery = ref('');
```

<details>
<summary>Klik untuk melihat jawaban</summary>

**Skenario 1: userId berubah** -> `watch`

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Skenario 2: efek samping validitas form** -> `watchEffect`

```typescript
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Skenario 3: pencarian debounce** -> `watch`

```typescript
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

Aturan pemilihan:

- sumber eksplisit / nilai lama / opsi kontrol -> `watch`
- pelacakan dependensi otomatis + eksekusi segera -> `watchEffect`

</details>

## 5. Praktik Terbaik

> Praktik terbaik

### Disarankan

```typescript
// 1) sumber eksplisit -> watch
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2) lacak otomatis beberapa dependensi -> watchEffect
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3) butuh nilai lama -> watch
watch(count, (newVal, oldVal) => {
  console.log(`dari ${oldVal} ke ${newVal}`);
});

// 4) pembersihan
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Hindari

```typescript
// 1) hindari efek samping async yang tidak dikelola di watchEffect
watchEffect(async () => {
  const data = await fetchData();
  // potensi race/leak jika tidak dikelola
});

// 2) hindari terlalu sering menggunakan watchEffect
watchEffect(() => {
  console.log(count.value); // watch(count, ...) mungkin lebih jelas
});

// 3) hindari memutasi sumber yang dilacak di efek yang sama (risiko loop)
watchEffect(() => {
  count.value++; // dapat menyebabkan infinite loop
});
```

## 6. Ringkasan Wawancara

> Ringkasan wawancara

### Ingatan cepat

**watch**:

- deklarasi sumber eksplisit
- lazy secara default
- nilai lama tersedia
- terbaik untuk skenario terkontrol

**watchEffect**:

- pelacakan dependensi otomatis
- eksekusi segera
- tidak ada nilai lama
- terbaik untuk efek samping reaktif yang ringkas

**Aturan praktis**:

- kontrol eksplisit -> `watch`
- pelacakan otomatis -> `watchEffect`
- butuh nilai lama -> `watch`
- eksekusi awal segera -> `watchEffect`

### Contoh jawaban

**T: Apa perbedaan antara watch dan watchEffect?**

> Keduanya bereaksi terhadap perubahan reaktif di Vue 3. `watch` melacak sumber yang dideklarasikan secara eksplisit dan memberikan nilai lama/baru; bersifat lazy secara default.
> `watchEffect` berjalan segera dan melacak otomatis dependensi yang digunakan di dalam callback, tetapi tidak menyediakan nilai lama.
> Gunakan `watch` untuk presisi dan kontrol; gunakan `watchEffect` untuk pengumpulan dependensi otomatis.

**T: Kapan saya harus menggunakan masing-masing?**

> Gunakan `watch` ketika Anda membutuhkan kontrol sumber eksplisit, nilai lama, atau opsi seperti debounce/deep/immediate.
> Gunakan `watchEffect` ketika Anda menginginkan eksekusi segera dan pelacakan otomatis di beberapa nilai reaktif terkait.

## Referensi

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Panduan Watchers Vue 3](https://vuejs.org/guide/essentials/watchers.html)
