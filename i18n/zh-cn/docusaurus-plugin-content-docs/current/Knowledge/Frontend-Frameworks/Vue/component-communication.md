---
id: vue-component-communication
title: '[Medium] 📄 组件通信'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Vue 组件之间有哪些通信方式？

Vue 组件之间的数据传递是开发中非常常见的需求，根据组件之间的关系不同，有多种通信方式可以选择。

### 组件关系分类

```text
父子组件：props / $emit
祖孙组件：provide / inject
兄弟组件：Event Bus / Vuex / Pinia
任意组件：Vuex / Pinia
```

### 1. Props（父传子）

**用途**：父组件向子组件传递数据

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>父组件</h1>
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
    <h2>子组件</h2>
    <p>收到的消息：{{ message }}</p>
    <p>用户：{{ user.name }}（{{ user.age }} 岁）</p>
    <p>计数：{{ count }}</p>
  </div>
</template>

<script setup>
// 基本类型验证
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // 对象类型验证
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 数字类型验证
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // 自定义验证：必须 >= 0
  },
});
</script>
```

#### Props 的注意事项

```vue
<!-- Vue 3 <script setup> 写法 -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ 错误：不应该直接修改 props
  // props.message = 'new value'; // 会产生警告

  // ✅ 正确：已经在上方将 props 复制到 ref
  localMessage.value = props.message;
});
</script>
```

### 2. $emit（子传父）

**用途**：子组件向父组件发送事件与数据

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">发送给父组件</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // 发送事件给父组件
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // 即时发送输入值
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>父组件</h1>

    <!-- 监听子组件的事件 -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>收到的数据：{{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('收到子组件的事件:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('输入值更新:', value);
};
</script>
```

#### Vue 3 的 emits 选项

```vue
<!-- Vue 3 <script setup> 写法 -->
<script setup>
const emit = defineEmits({
  // 声明会发送的事件
  'custom-event': null,

  // 带验证的事件
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue 必须是字符串');
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

### 3. v-model（双向绑定）

**用途**：父子组件之间的双向数据绑定

#### Vue 2 的 v-model

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- 等同于 -->
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
  <!-- 等同于 -->
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

#### Vue 3 的多个 v-model

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
      placeholder="邮箱"
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

### 4. Provide / Inject（祖孙组件）

**用途**：跨层级的组件通信，避免逐层传递 props

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>祖父组件</h1>
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

    // 提供数据和方法给后代组件
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
    <h2>父组件（不使用 inject）</h2>
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
    <h3>子组件</h3>
    <p>用户：{{ userInfo.name }}</p>
    <p>角色：{{ userInfo.role }}</p>
    <button @click="changeUser">修改用户</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // 注入祖父组件提供的数据
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

#### Provide / Inject 的注意事项

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ 错误：后代组件可以直接修改
    provide('state', state);

    // ✅ 正确：提供只读数据和修改方法
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs（父访问子）

**用途**：父组件直接访问子组件的属性和方法

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">调用子组件方法</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // 直接调用子组件的方法
      this.$refs.childRef.someMethod();

      // 访问子组件的数据
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ 在 mounted 后才能访问 $refs
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
      console.log('子组件的方法被调用');
    },
  },
};
</script>
```

#### Vue 3 Composition API 的 ref

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">调用子组件</button>
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

### 6. $parent / $root（子访问父）

**用途**：子组件访问父组件或根组件（不建议使用）

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // 访问父组件
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // 访问根组件
    console.log(this.$root.globalData);
  },
};
</script>
```

⚠️ **不建议使用的原因**：

- 增加组件之间的耦合度
- 难以追踪数据流向
- 不利于组件复用
- 建议改用 props、$emit 或 provide/inject

### 7. Event Bus（任意组件）

**用途**：任意组件之间的通信（Vue 2 常用，Vue 3 不推荐）

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
      console.log('收到消息:', data);
    });
  },

  beforeUnmount() {
    // 记得移除监听器
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
  console.log('收到消息:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia（全局状态管理）

**用途**：管理复杂的全局状态

#### Pinia (Vue 3 推荐)

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
    <button @click="handleLogin">登录</button>
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
    <p v-if="userStore.isLoggedIn">欢迎，{{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots（内容分发）

**用途**：父组件向子组件传递模板内容

#### 基本 Slot

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">默认标题</slot>
    </header>

    <main>
      <slot>默认内容</slot>
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
      <h1>自定义标题</h1>
    </template>

    <p>这是主要内容</p>

    <template #footer>
      <button>确定</button>
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
      <!-- 将数据传递给父组件 -->
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
    <!-- 接收子组件传递的数据 -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### 组件通信方式选择指南

| 关系     | 推荐方式       | 使用时机                   |
| -------- | -------------- | -------------------------- |
| 父 → 子  | Props          | 传递数据给子组件           |
| 子 → 父  | $emit          | 通知父组件事件发生         |
| 父 ↔ 子  | v-model        | 双向绑定表单数据           |
| 祖 → 孙  | Provide/Inject | 跨层级传递数据             |
| 父 → 子  | $refs          | 直接调用子组件方法（少用） |
| 任意组件 | Pinia/Vuex     | 全局状态管理               |
| 任意组件 | Event Bus      | 简单的事件通信（不推荐）   |
| 父 → 子  | Slots          | 传递模板内容               |

### 实际案例：购物车功能

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- 使用 Pinia 管理全局购物车状态 -->
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
      <button @click="addToCart(product)">加入购物车</button>
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
    <h1>购物网站</h1>
    <div>购物车：{{ cartStore.itemCount }} 件商品</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Props 和 Provide/Inject 有什么区别？

### Props

**特点**：

- ✅ 适合父子组件直接通信
- ✅ 数据流向清晰
- ✅ 类型检查完善
- ❌ 跨多层需要逐层传递（props drilling）

```vue
<!-- 需要逐层传递 -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**特点**：

- ✅ 适合祖孙组件跨层级通信
- ✅ 不需要逐层传递
- ❌ 数据来源不明显
- ❌ 类型检查较弱

```vue
<!-- 跨层级传递，中间层不需要接收 -->
<grandparent> <!-- provide -->
  <parent> <!-- 不需要处理 -->
    <child> <!-- 不需要处理 -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### 使用建议

- **使用 Props**：父子组件、数据流向需要清晰
- **使用 Provide/Inject**：深层嵌套、主题、语言、认证信息等全局配置

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
