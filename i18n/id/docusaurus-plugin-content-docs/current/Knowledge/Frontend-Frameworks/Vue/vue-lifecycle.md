---
id: vue-lifecycle
title: '[Medium] 📄 Vue Lifecycle Hooks'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Jelaskan lifecycle hooks Vue (termasuk Vue 2 & Vue 3)

> Jelaskan lifecycle hooks Vue di Vue 2 dan Vue 3.

Sebuah component Vue melewati fase dari pembuatan hingga pelepasan.
Lifecycle hooks adalah callback framework yang dipanggil pada setiap fase.

### Timeline lifecycle

```text
Creation -> Mounting -> Updating -> Unmounting
   ↓           ↓           ↓           ↓
Created     Mounted     Updated    Unmounted
```

### Pemetaan Vue 2 vs Vue 3

| Vue 2 (Options) | Vue 3 (Options) | Vue 3 (Composition) | Arti |
| --- | --- | --- | --- |
| `beforeCreate` | `beforeCreate` | `setup()` | sebelum instance diinisialisasi penuh |
| `created` | `created` | `setup()` | state instance siap |
| `beforeMount` | `beforeMount` | `onBeforeMount` | sebelum mount DOM pertama |
| `mounted` | `mounted` | `onMounted` | setelah mount DOM pertama |
| `beforeUpdate` | `beforeUpdate` | `onBeforeUpdate` | sebelum flush pembaruan reaktif |
| `updated` | `updated` | `onUpdated` | setelah pembaruan DOM |
| `beforeDestroy` | `beforeUnmount` | `onBeforeUnmount` | sebelum pembongkaran component |
| `destroyed` | `unmounted` | `onUnmounted` | setelah pembongkaran |
| `activated` | `activated` | `onActivated` | KeepAlive diaktifkan |
| `deactivated` | `deactivated` | `onDeactivated` | KeepAlive dinonaktifkan |
| `errorCaptured` | `errorCaptured` | `onErrorCaptured` | menangkap error dari descendant |

### 1) Fase creation

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // data/methods belum diinisialisasi
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // API state tersedia, tapi DOM belum di-mount
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined

    // tempat yang baik untuk request API
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Penggunaan umum**:

- `created`: request API, inisialisasi non-DOM
- hindari operasi DOM di sini

### 2) Fase mounting

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return { title: 'Vue Lifecycle' };
  },

  beforeMount() {
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    console.log(this.$refs.myElement); // tersedia

    // setup yang bergantung pada DOM
    this.initCanvas();
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // menggambar...
    },
    initChart() {
      // inisialisasi library DOM pihak ketiga
    },
  },
};
</script>
```

**Penggunaan umum**:

- operasi DOM
- library UI/chart pihak ketiga
- memasang listener DOM

### 3) Fase updating

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Tambah</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 };
  },

  beforeUpdate() {
    // data berubah, DOM belum di-flush
  },

  updated() {
    // DOM diperbarui
    // hindari memutasi state reaktif di sini untuk mencegah loop
  },
};
</script>
```

**Penggunaan umum**:

- pengukuran/reposisi pasca-pembaruan-DOM
- hindari mutasi reaktif langsung di `updated`

### 4) Fase unmounting

#### `beforeUnmount` / `unmounted` (Vue 3)
#### `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    this.timer = setInterval(() => {}, 1000);
    this.ws = new WebSocket('ws://example.com');
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    if (this.timer) clearInterval(this.timer);
    if (this.ws) this.ws.close();
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {},
  },
};
</script>
```

**Penggunaan umum**:

- membersihkan timer
- menghapus listener
- menutup socket/subscription
- membuang instance pihak ketiga

### 5) Kasus khusus: KeepAlive

`<KeepAlive>` menyimpan instance component di cache alih-alih menghancurkannya saat berpindah.

#### Mengapa menggunakannya

1. Mempertahankan state lokal (input form, posisi scroll)
2. Menghindari inisialisasi/request API berulang
3. Meningkatkan UX perpindahan tab/halaman

#### Contoh

```vue
<template>
  <KeepAlive include="UserList,ProductList" :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

### 6) Lifecycle hooks khusus

#### `activated` / `deactivated` (dengan KeepAlive)

```vue
<script>
export default {
  mounted() {
    console.log('mounted sekali');
  },
  activated() {
    // dipanggil setiap kali component menjadi aktif dari cache
    this.refreshData();
  },
  deactivated() {
    // dipanggil setiap kali component di-cache/dinonaktifkan
    this.pauseTasks();
  },
  methods: {
    refreshData() {},
    pauseTasks() {},
  },
};
</script>
```

#### `errorCaptured`

```vue
<script>
export default {
  errorCaptured(err, instance, info) {
    console.error('error child tertangkap:', err, info);
    return false; // hentikan propagasi ke atas jika diperlukan
  },
};
</script>
```

### Lifecycle Composition API Vue 3

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() bertindak seperti logika fase beforeCreate + created

onBeforeMount(() => {});
onMounted(() => {});
onBeforeUpdate(() => {});
onUpdated(() => {});
onBeforeUnmount(() => {});
onUnmounted(() => {});
onActivated(() => {});
onDeactivated(() => {});
onErrorCaptured((err, instance, info) => {
  return false;
});
</script>
```

## 2. Bagaimana urutan eksekusi lifecycle hooks parent dan child component?

> Apa urutan eksekusi lifecycle untuk parent dan child component?

### Urutan mount

```text
Parent beforeCreate
→ Parent created
→ Parent beforeMount
→ Child beforeCreate
→ Child created
→ Child beforeMount
→ Child mounted
→ Parent mounted
```

Trik mengingat: **creation dimulai dari luar ke dalam, mounting selesai dari dalam ke luar**.

### Contoh konkret

```vue
<!-- ParentComponent.vue -->
<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
  beforeCreate() { console.log('1. parent beforeCreate'); },
  created() { console.log('2. parent created'); },
  beforeMount() { console.log('3. parent beforeMount'); },
  mounted() { console.log('8. parent mounted'); },
  beforeUnmount() { console.log('9. parent beforeUnmount'); },
  unmounted() { console.log('12. parent unmounted'); },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  beforeCreate() { console.log('4. child beforeCreate'); },
  created() { console.log('5. child created'); },
  beforeMount() { console.log('6. child beforeMount'); },
  mounted() { console.log('7. child mounted'); },
  beforeUnmount() { console.log('10. child beforeUnmount'); },
  unmounted() { console.log('11. child unmounted'); },
};
</script>
```

### Urutan update

Jika data reaktif parent yang mempengaruhi child berubah:

```text
Parent beforeUpdate
→ Child beforeUpdate
→ Child updated
→ Parent updated
```

Jika hanya state lokal child yang berubah, hook update parent tidak dipicu.

### Urutan unmount

```text
Parent beforeUnmount
→ Child beforeUnmount
→ Child unmounted
→ Parent unmounted
```

### Mengapa urutan ini

- Mounting bersifat depth-first: render parent menemukan children, children selesai mount terlebih dahulu
- Unmounting memberitahu niat parent terlebih dahulu, lalu membongkar children, lalu menyelesaikan parent

### Implikasi praktis

1. Mengakses child refs aman di parent `mounted`, bukan di `created`
2. Child `mounted` dapat berjalan sebelum parent `mounted`
3. Untuk koordinasi kesiapan parent-child, gunakan event/props atau `nextTick`

### Kesalahan umum

1. Mengakses `this.$refs.child` di parent `created`
2. Mengasumsikan parent sudah sepenuhnya mounted saat child `mounted` berjalan

## 3. Kapan sebaiknya kita menggunakan setiap lifecycle hook?

> Kapan setiap lifecycle hook sebaiknya digunakan?

### Tabel penggunaan cepat

| Hook | Penggunaan umum | Ketersediaan DOM |
| --- | --- | --- |
| `created` / `setup` | Request API, inisialisasi state | Tidak |
| `mounted` / `onMounted` | Kerja DOM, inisialisasi pihak ketiga | Ya |
| `updated` / `onUpdated` | Sinkronisasi DOM pasca-pembaruan | Ya (diperbarui) |
| `unmounted` / `onUnmounted` | Membersihkan resource | Fase pembongkaran |
| `activated` | Masuk kembali ke view yang di-cache | Ya |

### Contoh praktis

#### 1) `created`: mengambil data API

```vue
<script>
export default {
  data() {
    return { users: [], loading: true, error: null };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2) `mounted`: inisialisasi library pihak ketiga

```vue
<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return { chartInstance: null };
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.chartInstance.setOption({
      title: { text: 'Penjualan' },
      xAxis: { data: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'] },
      yAxis: {},
      series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
    });
  },
  unmounted() {
    if (this.chartInstance) this.chartInstance.dispose();
  },
};
</script>
```

#### 3) `unmounted`: membersihkan resource

```vue
<script>
export default {
  data() {
    return { intervalId: null, observer: null };
  },
  mounted() {
    this.intervalId = setInterval(() => {}, 1000);
    this.observer = new IntersectionObserver(() => {});
    this.observer.observe(this.$el);
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {},
  },
};
</script>
```

### Tips mengingat

1. `created`: state siap, DOM belum siap
2. `mounted`: DOM siap
3. `updated`: DOM diperbarui
4. `unmounted`: bersihkan semuanya

## Referensi

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Diagram Lifecycle Vue 2](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Panduan Lifecycle Vue 3](https://vuejs.org/guide/essentials/lifecycle.html)
