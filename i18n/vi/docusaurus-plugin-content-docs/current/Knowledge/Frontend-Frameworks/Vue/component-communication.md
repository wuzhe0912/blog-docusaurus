---
id: vue-component-communication
title: '[Medium] Giao tiếp giữa các Component'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Các component Vue có những cách giao tiếp nào?

Việc truyền dữ liệu giữa các component Vue là nhu cầu rất phổ biến trong phát triển. Tùy theo mối quan hệ giữa các component, có nhiều phương thức giao tiếp khác nhau.

### Phân loại mối quan hệ giữa các component

```text
Cha-con: props / $emit
Ông-cháu: provide / inject
Component anh em: Event Bus / Vuex / Pinia
Component bất kỳ: Vuex / Pinia
```

### 1. Props (Cha truyền cho con)

**Mục đích**: Component cha truyền dữ liệu cho component con

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Component cha</h1>
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
const userInfo = ref({
  name: 'John',
  age: 30,
});
const counter = ref(0);
</script>
```

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h2>Component con</h2>
    <p>Tin nhắn nhận được: {{ message }}</p>
    <p>Người dùng: {{ user.name }} ({{ user.age }} tuổi)</p>
    <p>Bộ đếm: {{ count }}</p>
  </div>
</template>

<script setup>
// Xác thực kiểu cơ bản
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // Xác thực kiểu đối tượng
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // Xác thực kiểu số
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // Xác thực tùy chỉnh: phải >= 0
  },
});
</script>
```

#### Lưu ý về Props

```vue
<!-- Cú pháp Vue 3 <script setup> -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ Sai: không nên sửa trực tiếp props
  // props.message = 'new value'; // Sẽ tạo cảnh báo

  // ✅ Đúng: đã sao chép props vào ref ở trên
  localMessage.value = props.message;
});
</script>
```

### 2. $emit (Con truyền cho cha)

**Mục đích**: Component con gửi sự kiện và dữ liệu cho component cha

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">Gửi cho component cha</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // Gửi sự kiện cho component cha
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // Gửi giá trị nhập liệu theo thời gian thực
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Component cha</h1>

    <!-- Lắng nghe sự kiện từ component con -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>Dữ liệu nhận được: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('Nhận sự kiện từ component con:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Giá trị được cập nhật:', value);
};
</script>
```

#### Tùy chọn emits của Vue 3

```vue
<!-- Cú pháp Vue 3 <script setup> -->
<script setup>
const emit = defineEmits({
  // Khai báo các sự kiện sẽ phát
  'custom-event': null,

  // Sự kiện có xác thực
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue phải là chuỗi');
      return false;
    }
    return true;
  },
});

const sendEvent = () => {
  emit('custom-event', 'data');
};
</script>
```

### 3. v-model (Ràng buộc hai chiều)

**Mục đích**: Ràng buộc dữ liệu hai chiều giữa component cha và con

#### v-model trong Vue 2

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- Tương đương với -->
  <custom-input :value="message" @input="message = $event" />
</template>
```

```vue
<!-- CustomInput.vue (Vue 2) -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### v-model trong Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- Tương đương với -->
  <custom-input :modelValue="message" @update:modelValue="message = $event" />
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from './CustomInput.vue';

const message = ref('');
</script>
```

```vue
<!-- CustomInput.vue - Vue 3 <script setup> -->
<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<script setup>
defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
```

#### Nhiều v-model trong Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <user-form v-model:name="userName" v-model:email="userEmail" />
</template>

<script setup>
import { ref } from 'vue';
import UserForm from './UserForm.vue';

const userName = ref('');
const userEmail = ref('');
</script>
```

```vue
<!-- UserForm.vue - Vue 3 <script setup> -->
<template>
  <div>
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Tên"
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

### 4. Provide / Inject (Component ông-cháu)

**Mục đích**: Giao tiếp xuyên cấp giữa các component, tránh truyền props theo từng lớp

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Component ông</h1>
    <parent-component />
  </div>
</template>

<script>
import { ref, provide } from 'vue';
import ParentComponent from './ParentComponent.vue';

export default {
  components: { ParentComponent },

  setup() {
    const userInfo = ref({
      name: 'John',
      role: 'admin',
    });

    const updateUser = (newInfo) => {
      userInfo.value = { ...userInfo.value, ...newInfo };
    };

    // Cung cấp dữ liệu và phương thức cho component con cháu
    provide('userInfo', userInfo);
    provide('updateUser', updateUser);

    return { userInfo };
  },
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h2>Component cha (không dùng inject)</h2>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h3>Component con</h3>
    <p>Người dùng: {{ userInfo.name }}</p>
    <p>Vai trò: {{ userInfo.role }}</p>
    <button @click="changeUser">Sửa người dùng</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // Inject dữ liệu từ component ông
    const userInfo = inject('userInfo');
    const updateUser = inject('updateUser');

    const changeUser = () => {
      updateUser({ name: 'Jane', role: 'user' });
    };

    return {
      userInfo,
      changeUser,
    };
  },
};
</script>
```

#### Lưu ý về Provide / Inject

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ Sai: component con cháu có thể sửa trực tiếp
    provide('state', state);

    // ✅ Đúng: cung cấp dữ liệu chỉ đọc và phương thức sửa đổi
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs (Cha truy cập con)

**Mục đích**: Component cha truy cập trực tiếp thuộc tính và phương thức của component con

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">Gọi phương thức component con</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // Gọi trực tiếp phương thức component con
      this.$refs.childRef.someMethod();

      // Truy cập dữ liệu component con
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ Chỉ truy cập được $refs sau mounted
    console.log(this.$refs.childRef);
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  data() {
    return {
      someData: 'Child data',
    };
  },

  methods: {
    someMethod() {
      console.log('Phương thức component con đã được gọi');
    },
  },
};
</script>
```

#### ref với Composition API của Vue 3

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Gọi component con</button>
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

### 6. $parent / $root (Con truy cập cha)

**Mục đích**: Component con truy cập component cha hoặc component gốc (không khuyến khích)

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // Truy cập component cha
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // Truy cập component gốc
    console.log(this.$root.globalData);
  },
};
</script>
```

**Lý do không khuyến khích**:

- Tăng sự phụ thuộc giữa các component
- Khó theo dõi luồng dữ liệu
- Không thuận lợi cho việc tái sử dụng component
- Nên dùng props, $emit hoặc provide/inject thay thế

### 7. Event Bus (Component bất kỳ)

**Mục đích**: Giao tiếp giữa các component bất kỳ (phổ biến trong Vue 2, không khuyến khích trong Vue 3)

#### Event Bus trong Vue 2

```js
// eventBus.js
import Vue from 'vue';
export const EventBus = new Vue();
```

```vue
<!-- ComponentA.vue -->
<script>
import { EventBus } from './eventBus';

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message-sent', {
        text: 'Hello',
        from: 'ComponentA',
      });
    },
  },
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script>
import { EventBus } from './eventBus';

export default {
  mounted() {
    EventBus.$on('message-sent', (data) => {
      console.log('Nhận tin nhắn:', data);
    });
  },

  beforeUnmount() {
    // Nhớ xóa trình lắng nghe
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Giải pháp thay thế trong Vue 3: mitt

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
  emitter.emit('message-sent', {
    text: 'Hello',
    from: 'ComponentA',
  });
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handleMessage = (data) => {
  console.log('Nhận tin nhắn:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia (Quản lý trạng thái toàn cục)

**Mục đích**: Quản lý trạng thái toàn cục phức tạp

#### Pinia (Khuyến nghị cho Vue 3)

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

```vue
<!-- ComponentA.vue -->
<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleLogin = () => {
  userStore.login('John', 'john@example.com');
};
</script>

<template>
  <div>
    <button @click="handleLogin">Đăng nhập</button>
  </div>
</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div>
    <p v-if="userStore.isLoggedIn">Chào mừng, {{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots (Phân phối nội dung)

**Mục đích**: Component cha truyền nội dung template cho component con

#### Slot cơ bản

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Tiêu đề mặc định</slot>
    </header>

    <main>
      <slot>Nội dung mặc định</slot>
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
      <h1>Tiêu đề tùy chỉnh</h1>
    </template>

    <p>Đây là nội dung chính</p>

    <template #footer>
      <button>Xác nhận</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots (Slot có phạm vi)

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Truyền dữ liệu cho component cha -->
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['items'],
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <list-component :items="users">
    <!-- Nhận dữ liệu từ component con -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Hướng dẫn chọn phương thức giao tiếp giữa các component

| Quan hệ | Phương thức khuyến nghị | Trường hợp sử dụng |
| -------- | -------------- | -------------------------- |
| Cha sang con | Props | Truyền dữ liệu cho component con |
| Con sang cha | $emit | Thông báo sự kiện cho component cha |
| Cha và con | v-model | Ràng buộc hai chiều dữ liệu form |
| Ông sang cháu | Provide/Inject | Truyền dữ liệu xuyên cấp |
| Cha sang con | $refs | Gọi trực tiếp phương thức con (ít dùng) |
| Component bất kỳ | Pinia/Vuex | Quản lý trạng thái toàn cục |
| Component bất kỳ | Event Bus | Giao tiếp sự kiện đơn giản (không khuyến khích) |
| Cha sang con | Slots | Truyền nội dung template |

### Ví dụ thực tế: Chức năng giỏ hàng

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Dùng Pinia quản lý trạng thái giỏ hàng toàn cục -->
    <header-component />
    <product-list />
    <cart-component />
  </div>
</template>
```

```js
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  getters: {
    totalPrice: (state) => {
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

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
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
  },
});
```

```vue
<!-- ProductList.vue -->
<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const products = [
  { id: 1, name: 'iPhone', price: 30000 },
  { id: 2, name: 'iPad', price: 20000 },
];

const addToCart = (product) => {
  cartStore.addItem(product);
};
</script>

<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>${{ product.price }}</p>
      <button @click="addToCart(product)">Thêm vào giỏ hàng</button>
    </div>
  </div>
</template>
```

```vue
<!-- HeaderComponent.vue -->
<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <header>
    <h1>Cửa hàng trực tuyến</h1>
    <div>Giỏ hàng: {{ cartStore.itemCount }} sản phẩm</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Sự khác biệt giữa Props và Provide/Inject là gì?

### Props

**Đặc điểm**:

- Phù hợp cho giao tiếp trực tiếp cha-con
- Luồng dữ liệu rõ ràng
- Kiểm tra kiểu đầy đủ
- Cần truyền theo từng lớp khi component lồng sâu (props drilling)

```vue
<!-- Cần truyền theo từng lớp -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Đặc điểm**:

- Phù hợp cho giao tiếp xuyên cấp ông-cháu
- Không cần truyền theo từng lớp
- Nguồn dữ liệu không rõ ràng
- Kiểm tra kiểu yếu hơn

```vue
<!-- Truyền xuyên cấp, lớp trung gian không cần nhận -->
<grandparent> <!-- provide -->
  <parent> <!-- không cần xử lý -->
    <child> <!-- không cần xử lý -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Khuyến nghị sử dụng

- **Dùng Props**: component cha-con, khi luồng dữ liệu cần rõ ràng
- **Dùng Provide/Inject**: lồng sâu, theme, ngôn ngữ, xác thực và các cấu hình toàn cục khác

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
