---
id: vue-component-communication
title: '[Medium] 📄 Komunikasi Antar Component'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. Apa saja cara komunikasi antar component di Vue?

> Pola komunikasi apa saja yang ada di antara component Vue?

Strategi komunikasi component bergantung pada cakupan hubungan.

### Kategori hubungan

```text
Parent <-> Child: props / emit / v-model / refs
Ancestor <-> Descendant: provide / inject
Sibling / component tidak berhubungan: Pinia/Vuex (atau event emitter untuk kasus sederhana)
```

### 1. Props (parent → child)

**Tujuan**: parent mengirimkan data ke child.

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Parent</h1>
    <ChildComponent
      :message="parentMessage"
      :user="userInfo"
      :count="counter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const parentMessage = ref('Hello from parent');
const userInfo = ref({ name: 'John', age: 30 });
const counter = ref(0);
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Child</h2>
    <p>Message: {{ message }}</p>
    <p>User: {{ user.name }} ({{ user.age }})</p>
    <p>Count: {{ count }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0,
  },
});
</script>
```

#### Catatan tentang Props

- Props bersifat satu arah ke bawah (parent sebagai sumber kebenaran)
- Jangan mengubah props secara langsung di child
- Jika perlu mengedit secara lokal, salin ke `ref` lokal

```vue
<script setup>
import { ref } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);
</script>
```

### 2. Emit (child → parent)

**Tujuan**: child memberitahu parent melalui event.

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="sendToParent">Kirim ke parent</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);
const inputValue = ref('');

const sendToParent = () => {
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Parent</h1>
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />
    <p>Diterima: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Input diperbarui:', value);
};
</script>
```

#### Validasi emits di Vue 3

```vue
<script setup>
const emit = defineEmits({
  'custom-event': null,
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue harus berupa string');
      return false;
    }
    return true;
  },
});

emit('custom-event', 'data');
</script>
```

### 3. v-model (kontrak dua arah parent-child)

#### Gaya Vue 2

```vue
<!-- Parent -->
<custom-input v-model="message" />
<!-- setara dengan -->
<custom-input :value="message" @input="message = $event" />
```

```vue
<!-- Child di Vue 2 -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### Gaya Vue 3

```vue
<!-- Parent -->
<custom-input v-model="message" />
<!-- setara dengan -->
<custom-input :modelValue="message" @update:modelValue="message = $event" />
```

```vue
<!-- Child di Vue 3 -->
<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<script setup>
defineProps({ modelValue: String });
const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
```

#### Multiple v-model di Vue 3

```vue
<!-- Parent -->
<user-form v-model:name="userName" v-model:email="userEmail" />
```

```vue
<!-- Child -->
<template>
  <div>
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Name"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="Email"
    />
  </div>
</template>

<script setup>
defineProps({
  name: String,
  email: String,
});
defineEmits(['update:name', 'update:email']);
</script>
```

### 4. Provide / Inject (ancestor ↔ descendant)

**Tujuan**: komunikasi lintas level tanpa prop drilling.

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Grandparent</h1>
    <parent-component />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';

const userInfo = ref({ name: 'John', role: 'admin' });

const updateUser = (newInfo) => {
  userInfo.value = { ...userInfo.value, ...newInfo };
};

provide('userInfo', userInfo);
provide('updateUser', updateUser);
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h3>Child</h3>
    <p>User: {{ userInfo.name }}</p>
    <p>Role: {{ userInfo.role }}</p>
    <button @click="changeUser">Perbarui user</button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const userInfo = inject('userInfo');
const updateUser = inject('updateUser');

const changeUser = () => {
  updateUser({ name: 'Jane', role: 'user' });
};
</script>
```

#### Catatan Provide/Inject

- Cocok untuk konteks bersama di pohon yang dalam (theme/i18n/konfigurasi)
- Kurang eksplisit dibanding props, jadi penamaan/dokumentasi penting
- Pertimbangkan readonly + API mutasi yang eksplisit

```vue
<script setup>
import { ref, readonly, provide } from 'vue';

const state = ref({ count: 0 });
provide('state', readonly(state));
provide('updateState', (newState) => {
  state.value = newState;
});
</script>
```

### 5. Refs (parent mengakses langsung instance child)

**Tujuan**: akses imperatif (memanggil method child yang diekspos, membaca state yang diekspos).

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Panggil method child</button>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref(null);

const callChild = () => {
  childRef.value.someMethod();
};
</script>
```

Gunakan secara hemat. Utamakan aliran data deklaratif terlebih dahulu.

### 6. `$parent` / `$root` (tidak disarankan)

Mengakses parent/root secara langsung meningkatkan coupling dan membuat aliran data sulit dipahami.
Lebih baik gunakan props/emit/provide atau store.

### 7. Event Bus (legacy/pub-sub sederhana)

Vue 2 sering menggunakan `new Vue()` event bus.
Di Vue 3, gunakan emitter kecil seperti `mitt` hanya untuk channel event yang ringan.

```js
// eventBus.js
import mitt from 'mitt';
export const emitter = mitt();
```

```vue
<!-- ComponentA.vue -->
<script setup>
import { emitter } from './eventBus';

const sendMessage = () => {
  emitter.emit('message-sent', { text: 'Hello', from: 'ComponentA' });
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handleMessage = (data) => {
  console.log('diterima:', data);
};

onMounted(() => emitter.on('message-sent', handleMessage));
onUnmounted(() => emitter.off('message-sent', handleMessage));
</script>
```

### 8. Vuex / Pinia (manajemen state global)

**Tujuan**: state global bersama untuk aplikasi menengah/besar.

Pinia adalah solusi store yang direkomendasikan untuk Vue 3.

```js
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    isLoggedIn: false,
  }),
  getters: {
    fullInfo: (state) => `${state.name} (${state.email})`,
  },
  actions: {
    login(name, email) {
      this.name = name;
      this.email = email;
      this.isLoggedIn = true;
    },
    logout() {
      this.name = '';
      this.email = '';
      this.isLoggedIn = false;
    },
  },
});
```

### 9. Slots (proyeksi konten)

**Tujuan**: parent mengirimkan konten template ke area child.

#### Slot dasar

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Header Default</slot>
    </header>
    <main>
      <slot>Konten Default</slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component>
    <template #header>
      <h1>Header Kustom</h1>
    </template>

    <p>Konten bagian utama</p>

    <template #footer>
      <button>Konfirmasi</button>
    </template>
  </child-component>
</template>
```

#### Scoped slots

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup>
defineProps({ items: Array });
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <list-component :items="users">
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Panduan pemilihan komunikasi

| Hubungan | Pendekatan yang disarankan | Penggunaan umum |
| --- | --- | --- |
| Parent → Child | Props | Input data |
| Child → Parent | Emit | Callback event |
| Parent ↔ Child | v-model | Sinkronisasi form |
| Ancestor → Descendant | Provide/Inject | Konteks pohon yang dalam |
| Parent → Child (imperatif) | Refs | Pemanggilan method langsung (jarang) |
| Semua component | Pinia/Vuex | State global bersama |
| Semua component (sederhana) | Event emitter | Pub-sub ringan |
| Parent → konten Child | Slots | Komposisi template |

### Kasus praktis: fitur keranjang dengan Pinia

```js
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    itemCount: (state) => state.items.length,
  },
  actions: {
    addItem(product) {
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeItem(productId) {
      const index = this.items.findIndex((item) => item.id === productId);
      if (index > -1) this.items.splice(index, 1);
    },
  },
});
```

## 2. Apa perbedaan antara Props dan Provide/Inject?

> Apa perbedaan antara Props dan Provide/Inject?

### Props

**Karakteristik**:

- Aliran parent-child yang jelas dan eksplisit
- Definisi tipe/kontrak yang lebih kuat
- Cocok untuk komunikasi langsung parent-child
- Dapat menyebabkan prop drilling melalui banyak level

```vue
<!-- drilling melalui component perantara -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Karakteristik**:

- Cocok untuk dependensi lintas level
- Tidak perlu melewatkan setiap lapisan perantara
- Visibilitas sumber kurang eksplisit jika terlalu sering digunakan

```vue
<grandparent> <!-- provide -->
  <parent>
    <child>
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Rekomendasi

- **Gunakan Props** ketika kejelasan aliran data paling penting (terutama parent-child)
- **Gunakan Provide/Inject** untuk konteks bersama yang dalam (theme, i18n, auth/konfigurasi)
- Untuk state global yang dapat diubah di seluruh aplikasi, lebih baik gunakan Pinia/Vuex

## Referensi

- [Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Dokumentasi Pinia](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
