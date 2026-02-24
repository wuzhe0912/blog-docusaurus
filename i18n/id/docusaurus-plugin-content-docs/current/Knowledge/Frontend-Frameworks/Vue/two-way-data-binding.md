---
id: vue-two-way-data-binding
title: '[Hard] 📄 Two-way Data Binding'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Jelaskan prinsip dasar cara Vue2 dan Vue3 masing-masing mengimplementasikan two-way binding

> Jelaskan mekanisme dasar two-way binding di Vue2 dan Vue3.

Untuk memahami two-way binding Vue, Anda perlu memahami cara kerja sistem reaktivitas dan bagaimana Vue2 serta Vue3 mengimplementasikannya secara berbeda.

### Implementasi Vue2

Vue2 menggunakan `Object.defineProperty` untuk mengimplementasikan reaktivitas. Ia membungkus properti objek dengan `getter` dan `setter`, sehingga pembacaan/penulisan dapat dilacak.

#### 1. Data hijacking (pembajakan data)

Saat data component diinisialisasi di Vue2, Vue menelusuri setiap properti dan mengubahnya menjadi `getter`/`setter` melalui `Object.defineProperty`, sehingga pembacaan dan penulisan dapat diamati.

#### 2. Pengumpulan dependensi

Saat fungsi render dieksekusi dan membaca properti reaktif, `getter` berjalan. Vue mencatat dependensi sehingga component yang terdampak dapat diberitahu nanti.

#### 3. Mengirimkan pembaruan

Saat data berubah, `setter` berjalan. Vue memberitahu watcher/component yang bergantung dan memicu render ulang untuk memperbarui DOM.

#### Contoh Vue2

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // memicu getter
data.name = 'Vue2 Reactivity'; // memicu setter
```

#### Keterbatasan Vue2

`Object.defineProperty` memiliki beberapa keterbatasan:

- **Tidak dapat mendeteksi penambahan/penghapusan properti** tanpa `Vue.set()` / `Vue.delete()`
- **Tidak dapat mendeteksi mutasi indeks array secara langsung** secara andal tanpa method array yang di-patch
- **Overhead performa** dari penelusuran mendalam dan definisi getter/setter di awal

### Implementasi Vue3

Vue3 menggunakan ES6 `Proxy`, yang memberikan kemampuan intersepsi yang lebih luas dan karakteristik performa yang lebih baik.

#### 1. Data hijacking berbasis Proxy

Vue3 membungkus seluruh objek dengan `new Proxy` alih-alih mendefinisikan getter/setter per key. Ini memungkinkan intersepsi lebih banyak operasi, termasuk penambahan/penghapusan properti.

#### 2. Pelacakan dependensi yang lebih efisien

Vue3 tidak lagi membutuhkan definisi getter/setter di awal untuk setiap properti. Trap Proxy dapat menangani operasi secara dinamis (misalnya `get`, `set`, `has`, `deleteProperty`, dll.).

#### 3. Pemicuan pembaruan yang lebih presisi

Vue3 dapat melacak dependensi dengan lebih presisi dan mengurangi render ulang yang tidak perlu.

#### Contoh Vue3

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`get ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`set ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name);
data.name = 'Vue 3 Reactivity';
console.log(data.name);
```

### Perbandingan Vue2 vs Vue3

| Fitur | Vue2 | Vue3 |
| --- | --- | --- |
| Mekanisme inti | `Object.defineProperty` | `Proxy` |
| Mendeteksi properti baru | Membutuhkan `Vue.set()` | Dukungan native |
| Mendeteksi penghapusan properti | Membutuhkan `Vue.delete()` | Dukungan native |
| Mendeteksi penugasan indeks array | Terbatas | Dukungan native |
| Performa | Penelusuran mendalam di awal | Lazy + lebih efisien |
| Dukungan browser | IE9+ | Tidak mendukung IE11 |

### Kesimpulan

Vue2 menggunakan `Object.defineProperty`, yang berfungsi tetapi memiliki keterbatasan yang diketahui.
Vue3 menggunakan `Proxy`, memberikan sistem reaktivitas yang lebih lengkap dan fleksibel dengan performa yang lebih baik.

## 2. Mengapa Vue3 menggunakan `Proxy` alih-alih `Object.defineProperty`?

> Mengapa Vue3 memilih `Proxy` daripada `Object.defineProperty`?

### Alasan utama

#### 1. Kemampuan intersepsi yang lebih kuat

`Proxy` dapat mengintersepsi banyak operasi, sedangkan `Object.defineProperty` hanya mencakup get/set properti.

```js
// Operasi yang dapat diintersepsi Proxy
const handler = {
  get() {},
  set() {},
  has() {},
  deleteProperty() {},
  ownKeys() {},
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},
  construct() {},
};
```

#### 2. Pelacakan indeks array secara native

```js
// Keterbatasan Vue2
const arr = [1, 2, 3];
arr[0] = 10; // sering tidak terlacak di model defineProperty gaya Vue2

// Vue3
const arr2 = reactive([1, 2, 3]);
arr2[0] = 10; // terlacak
```

#### 3. Dukungan native untuk penambahan/penghapusan properti dinamis

```js
// Vue2 membutuhkan API khusus
Vue.set(obj, 'newKey', 'value');

// Vue3 native
const obj = reactive({});
obj.newKey = 'value';
delete obj.newKey;
```

#### 4. Model performa yang lebih baik

```js
// Vue2: penelusuran mendalam + defineReactive untuk setiap key
function observe(obj) {
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: pembungkus proxy
function reactive(obj) {
  return new Proxy(obj, handler);
}
```

#### 5. Implementasi internal yang lebih sederhana

Inti reaktivitas Vue3 lebih bersih dan lebih mudah dipelihara.

### Mengapa Vue2 tidak menggunakan Proxy

Terutama **kompatibilitas browser**:

- Vue2 (dirilis tahun 2016) membutuhkan dukungan luas termasuk IE
- `Proxy` tidak dapat di-polyfill secara penuh
- Vue3 menghentikan dukungan IE11, sehingga Proxy menjadi layak

### Perbandingan praktis

```js
// ===== Keterbatasan Vue2 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3],
  },
});

// tidak andal reaktif di Vue2 tanpa API khusus
vm.obj.b = 2;
delete vm.obj.a;
vm.arr[0] = 10;
vm.arr.length = 0;

// Workaround Vue2
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Dukungan native Vue3 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3],
});

state.obj.b = 2;
delete state.obj.a;
state.arr[0] = 10;
state.arr.length = 0;
```

### Ringkasan

Vue3 menggunakan `Proxy` untuk:

1. Memberikan cakupan reaktivitas yang lengkap (perubahan tambah/hapus/indeks)
2. Meningkatkan performa (lebih sedikit penelusuran di awal)
3. Menyederhanakan implementasi
4. Meningkatkan pengalaman developer (lebih sedikit API khusus)

Tradeoff: tidak mendukung IE11 legacy, yang dapat diterima untuk target web modern.

## Referensi

- [Vue 2 Reaktivitas Mendalam](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reaktivitas Mendalam](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
