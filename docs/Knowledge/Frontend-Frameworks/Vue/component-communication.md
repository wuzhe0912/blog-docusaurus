---
id: vue-component-communication
title: '[Medium] 📄 Component Communication'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Vue 組件之間有哪些溝通方式？

Vue 組件之間的資料傳遞是開發中非常常見的需求，根據組件之間的關係不同，有多種溝通方式可以選擇。

### 組件關係分類

```text
父子組件：props / $emit
祖孫組件：provide / inject
兄弟組件：Event Bus / Vuex / Pinia
任意組件：Vuex / Pinia
```

### 1. Props（父傳子）

**用途**：父組件向子組件傳遞資料

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>父組件</h1>
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
    <h2>子組件</h2>
    <p>收到的訊息：{{ message }}</p>
    <p>使用者：{{ user.name }}（{{ user.age }} 歲）</p>
    <p>計數：{{ count }}</p>
  </div>
</template>

<script setup>
// 基本型別驗證
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // 物件型別驗證
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 數字型別驗證
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // 自訂驗證：必須 >= 0
  },
});
</script>
```

#### Props 的注意事項

```vue
<!-- Vue 3 <script setup> 寫法 -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ 錯誤：不應該直接修改 props
  // props.message = 'new value'; // 會產生警告

  // ✅ 正確：已經在上方將 props 複製到 ref
  localMessage.value = props.message;
});
</script>
```

### 2. $emit（子傳父）

**用途**：子組件向父組件發送事件與資料

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">發送給父組件</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // 發送事件給父組件
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // 即時發送輸入值
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>父組件</h1>

    <!-- 監聽子組件的事件 -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>收到的資料：{{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('收到子組件的事件:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('輸入值更新:', value);
};
</script>
```

#### Vue 3 的 emits 選項

```vue
<!-- Vue 3 <script setup> 寫法 -->
<script setup>
const emit = defineEmits({
  // 聲明會發送的事件
  'custom-event': null,

  // 帶驗證的事件
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue 必須是字串');
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

### 3. v-model（雙向綁定）

**用途**：父子組件之間的雙向資料綁定

#### Vue 2 的 v-model

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- 等同於 -->
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

#### Vue 3 的 v-model

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- 等同於 -->
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

#### Vue 3 的多個 v-model

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
      placeholder="姓名"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="信箱"
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

### 4. Provide / Inject（祖孫組件）

**用途**：跨層級的組件通訊，避免逐層傳遞 props

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>祖父組件</h1>
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

    // 提供資料和方法給後代組件
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
    <h2>父組件（不使用 inject）</h2>
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
    <h3>子組件</h3>
    <p>使用者：{{ userInfo.name }}</p>
    <p>角色：{{ userInfo.role }}</p>
    <button @click="changeUser">修改使用者</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // 注入祖父組件提供的資料
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

#### Provide / Inject 的注意事項

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ 錯誤：後代組件可以直接修改
    provide('state', state);

    // ✅ 正確：提供唯讀資料和修改方法
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs（父訪問子）

**用途**：父組件直接存取子組件的屬性和方法

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">呼叫子組件方法</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // 直接呼叫子組件的方法
      this.$refs.childRef.someMethod();

      // 存取子組件的資料
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ 在 mounted 後才能存取 $refs
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
      console.log('子組件的方法被呼叫');
    },
  },
};
</script>
```

#### Vue 3 Composition API 的 ref

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">呼叫子組件</button>
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

### 6. $parent / $root（子訪問父）

**用途**：子組件存取父組件或根組件（不建議使用）

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // 存取父組件
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // 存取根組件
    console.log(this.$root.globalData);
  },
};
</script>
```

⚠️ **不建議使用的原因**：

- 增加組件之間的耦合度
- 難以追蹤資料流向
- 不利於組件重用
- 建議改用 props、$emit 或 provide/inject

### 7. Event Bus（任意組件）

**用途**：任意組件之間的通訊（Vue 2 常用，Vue 3 不推薦）

#### Vue 2 的 Event Bus

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
      console.log('收到訊息:', data);
    });
  },

  beforeUnmount() {
    // 記得移除監聽器
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Vue 3 的替代方案：mitt

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
  console.log('收到訊息:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia（全域狀態管理）

**用途**：管理複雜的全域狀態

#### Pinia (Vue 3 推薦)

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
    <button @click="handleLogin">登入</button>
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
    <p v-if="userStore.isLoggedIn">歡迎，{{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots（內容分發）

**用途**：父組件向子組件傳遞模板內容

#### 基本 Slot

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">預設標題</slot>
    </header>

    <main>
      <slot>預設內容</slot>
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
      <h1>自訂標題</h1>
    </template>

    <p>這是主要內容</p>

    <template #footer>
      <button>確定</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots（作用域插槽）

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- 將資料傳遞給父組件 -->
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
    <!-- 接收子組件傳遞的資料 -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### 組件通訊方式選擇指南

| 關係     | 推薦方式       | 使用時機                   |
| -------- | -------------- | -------------------------- |
| 父 → 子  | Props          | 傳遞資料給子組件           |
| 子 → 父  | $emit          | 通知父組件事件發生         |
| 父 ↔ 子  | v-model        | 雙向綁定表單資料           |
| 祖 → 孫  | Provide/Inject | 跨層級傳遞資料             |
| 父 → 子  | $refs          | 直接呼叫子組件方法（少用） |
| 任意組件 | Pinia/Vuex     | 全域狀態管理               |
| 任意組件 | Event Bus      | 簡單的事件通訊（不推薦）   |
| 父 → 子  | Slots          | 傳遞模板內容               |

### 實際案例：購物車功能

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- 使用 Pinia 管理全域購物車狀態 -->
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
      <button @click="addToCart(product)">加入購物車</button>
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
    <h1>購物網站</h1>
    <div>購物車：{{ cartStore.itemCount }} 件商品</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Props 和 Provide/Inject 有什麼差別？

### Props

**特點**：

- ✅ 適合父子組件直接通訊
- ✅ 資料流向清晰
- ✅ 型別檢查完善
- ❌ 跨多層需要逐層傳遞（props drilling）

```vue
<!-- 需要逐層傳遞 -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**特點**：

- ✅ 適合祖孫組件跨層級通訊
- ✅ 不需要逐層傳遞
- ❌ 資料來源不明顯
- ❌ 型別檢查較弱

```vue
<!-- 跨層級傳遞，中間層不需要接收 -->
<grandparent> <!-- provide -->
  <parent> <!-- 不需要處理 -->
    <child> <!-- 不需要處理 -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### 使用建議

- **使用 Props**：父子組件、資料流向需要清晰
- **使用 Provide/Inject**：深層嵌套、主題、語言、認證資訊等全域配置

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
