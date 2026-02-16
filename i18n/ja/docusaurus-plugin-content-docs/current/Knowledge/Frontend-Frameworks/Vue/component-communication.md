---
id: vue-component-communication
title: '[Medium] 📄 コンポーネント間通信'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Vue コンポーネント間の通信方法にはどのようなものがあるか？

Vue コンポーネント間のデータ受け渡しは開発で非常によくある要件で、コンポーネント間の関係に応じて複数の通信方法を選択できます。

### コンポーネント関係の分類

```text
親子コンポーネント：props / $emit
祖先・子孫コンポーネント：provide / inject
兄弟コンポーネント：Event Bus / Vuex / Pinia
任意のコンポーネント：Vuex / Pinia
```

### 1. Props（親から子へ）

**用途**：親コンポーネントから子コンポーネントへデータを渡す

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>親コンポーネント</h1>
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
    <h2>子コンポーネント</h2>
    <p>受け取ったメッセージ：{{ message }}</p>
    <p>ユーザー：{{ user.name }}（{{ user.age }} 歳）</p>
    <p>カウント：{{ count }}</p>
  </div>
</template>

<script setup>
// 基本型のバリデーション
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // オブジェクト型のバリデーション
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 数値型のバリデーション
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // カスタムバリデーション：0以上
  },
});
</script>
```

#### Props の注意点

```vue
<!-- Vue 3 <script setup> の書き方 -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ 誤り：props を直接変更してはいけない
  // props.message = 'new value'; // 警告が出る

  // ✅ 正解：上記で props を ref にコピー済み
  localMessage.value = props.message;
});
</script>
```

### 2. $emit（子から親へ）

**用途**：子コンポーネントから親コンポーネントへイベントとデータを送信する

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">親コンポーネントに送信</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // 親コンポーネントにイベントを送信
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // 入力値をリアルタイムで送信
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>親コンポーネント</h1>

    <!-- 子コンポーネントのイベントをリッスン -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>受け取ったデータ：{{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('子コンポーネントからイベントを受信:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('入力値が更新:', value);
};
</script>
```

#### Vue 3 の emits オプション

```vue
<!-- Vue 3 <script setup> の書き方 -->
<script setup>
const emit = defineEmits({
  // 送信するイベントを宣言
  'custom-event': null,

  // バリデーション付きイベント
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue は文字列でなければなりません');
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

### 3. v-model（双方向バインディング）

**用途**：親子コンポーネント間の双方向データバインディング

#### Vue 2 の v-model

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- 以下と同等 -->
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

#### Vue 3 の v-model

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- 以下と同等 -->
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

#### Vue 3 の複数 v-model

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
      placeholder="名前"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="メール"
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

### 4. Provide / Inject（祖先・子孫コンポーネント）

**用途**：階層をまたぐコンポーネント通信、props のバケツリレーを回避

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>祖父コンポーネント</h1>
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

    // 子孫コンポーネントにデータとメソッドを提供
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
    <h2>親コンポーネント（inject 不使用）</h2>
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
    <h3>子コンポーネント</h3>
    <p>ユーザー：{{ userInfo.name }}</p>
    <p>ロール：{{ userInfo.role }}</p>
    <button @click="changeUser">ユーザーを変更</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // 祖父コンポーネントが提供するデータを注入
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

#### Provide / Inject の注意点

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ 誤り：子孫コンポーネントが直接変更できてしまう
    provide('state', state);

    // ✅ 正解：読み取り専用のデータと変更メソッドを提供
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs（親から子へのアクセス）

**用途**：親コンポーネントから子コンポーネントのプロパティやメソッドに直接アクセスする

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">子コンポーネントのメソッドを呼び出す</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // 子コンポーネントのメソッドを直接呼び出す
      this.$refs.childRef.someMethod();

      // 子コンポーネントのデータにアクセス
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ mounted 後でなければ $refs にアクセスできない
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
      console.log('子コンポーネントのメソッドが呼び出された');
    },
  },
};
</script>
```

#### Vue 3 Composition API の ref

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">子コンポーネントを呼び出す</button>
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

### 6. $parent / $root（子から親へのアクセス）

**用途**：子コンポーネントから親コンポーネントやルートコンポーネントにアクセス（非推奨）

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // 親コンポーネントにアクセス
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // ルートコンポーネントにアクセス
    console.log(this.$root.globalData);
  },
};
</script>
```

⚠️ **非推奨の理由**：

- コンポーネント間の結合度が増す
- データフローの追跡が困難
- コンポーネントの再利用性が低下
- props、$emit、provide/inject の使用を推奨

### 7. Event Bus（任意のコンポーネント）

**用途**：任意のコンポーネント間の通信（Vue 2 でよく使用、Vue 3 では非推奨）

#### Vue 2 の Event Bus

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
      console.log('メッセージを受信:', data);
    });
  },

  beforeUnmount() {
    // リスナーの解除を忘れずに
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Vue 3 の代替手段：mitt

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
  console.log('メッセージを受信:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia（グローバル状態管理）

**用途**：複雑なグローバル状態の管理

#### Pinia（Vue 3 推奨）

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
    <button @click="handleLogin">ログイン</button>
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
    <p v-if="userStore.isLoggedIn">ようこそ、{{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots（コンテンツ配信）

**用途**：親コンポーネントから子コンポーネントへテンプレートコンテンツを渡す

#### 基本 Slot

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">デフォルトタイトル</slot>
    </header>

    <main>
      <slot>デフォルトコンテンツ</slot>
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
      <h1>カスタムタイトル</h1>
    </template>

    <p>メインコンテンツ</p>

    <template #footer>
      <button>確定</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots（スコープ付きスロット）

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- 親コンポーネントにデータを渡す -->
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
    <!-- 子コンポーネントから渡されたデータを受け取る -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### コンポーネント通信方式の選択ガイド

| 関係             | 推奨方式       | 使用場面                         |
| ---------------- | -------------- | -------------------------------- |
| 親 → 子          | Props          | 子コンポーネントへデータを渡す   |
| 子 → 親          | $emit          | 親コンポーネントにイベントを通知 |
| 親 ↔ 子          | v-model        | フォームデータの双方向バインド   |
| 祖先 → 子孫      | Provide/Inject | 階層をまたぐデータ受け渡し       |
| 親 → 子          | $refs          | 子コンポーネントのメソッド直接呼出（少用） |
| 任意コンポーネント | Pinia/Vuex    | グローバル状態管理               |
| 任意コンポーネント | Event Bus     | シンプルなイベント通信（非推奨） |
| 親 → 子          | Slots          | テンプレートコンテンツの受け渡し |

### 実際の例：ショッピングカート機能

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Pinia でグローバルなカート状態を管理 -->
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
      <button @click="addToCart(product)">カートに追加</button>
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
    <h1>ショッピングサイト</h1>
    <div>カート：{{ cartStore.itemCount }} 点の商品</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Props と Provide/Inject の違いは？

### Props

**特徴**：

- ✅ 親子コンポーネントの直接通信に適している
- ✅ データフローが明確
- ✅ 型チェックが充実
- ❌ 多階層にわたる場合はバケツリレーが必要（props drilling）

```vue
<!-- 各階層でバケツリレーが必要 -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**特徴**：

- ✅ 祖先・子孫コンポーネント間の階層横断通信に適している
- ✅ バケツリレー不要
- ❌ データの出所がわかりにくい
- ❌ 型チェックが弱い

```vue
<!-- 階層横断で受け渡し、中間層は処理不要 -->
<grandparent> <!-- provide -->
  <parent> <!-- 処理不要 -->
    <child> <!-- 処理不要 -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### 使用上のアドバイス

- **Props を使用**：親子コンポーネント間、データフローを明確にしたい場合
- **Provide/Inject を使用**：深いネスト、テーマ、言語、認証情報などグローバル設定

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
