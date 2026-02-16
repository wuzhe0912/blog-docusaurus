---
id: vue-component-communication
title: '[Medium] 컴포넌트 통신'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Vue 컴포넌트 간 통신 방법에는 어떤 것들이 있는가?

Vue 컴포넌트 간의 데이터 전달은 개발에서 매우 흔한 요구사항이며, 컴포넌트 간의 관계에 따라 다양한 통신 방법을 선택할 수 있습니다.

### 컴포넌트 관계 분류

```text
부모-자식 컴포넌트: props / $emit
조상-손자 컴포넌트: provide / inject
형제 컴포넌트: Event Bus / Vuex / Pinia
임의 컴포넌트: Vuex / Pinia
```

### 1. Props (부모에서 자식으로)

**용도**: 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>부모 컴포넌트</h1>
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
    <h2>자식 컴포넌트</h2>
    <p>받은 메시지: {{ message }}</p>
    <p>사용자: {{ user.name }} ({{ user.age }}세)</p>
    <p>카운트: {{ count }}</p>
  </div>
</template>

<script setup>
// 기본 타입 검증
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // 객체 타입 검증
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // 숫자 타입 검증
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // 커스텀 검증: 0 이상이어야 함
  },
});
</script>
```

#### Props 주의사항

```vue
<!-- Vue 3 <script setup> 방식 -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ 잘못됨: props를 직접 수정해서는 안 됨
  // props.message = 'new value'; // 경고가 발생함

  // ✅ 올바름: 위에서 이미 props를 ref로 복사함
  localMessage.value = props.message;
});
</script>
```

### 2. $emit (자식에서 부모로)

**용도**: 자식 컴포넌트가 부모 컴포넌트에 이벤트와 데이터를 전달

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">부모 컴포넌트에 전송</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // 부모 컴포넌트에 이벤트 전송
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // 실시간으로 입력값 전송
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>부모 컴포넌트</h1>

    <!-- 자식 컴포넌트의 이벤트 수신 -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>받은 데이터: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('자식 컴포넌트의 이벤트 수신:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('입력값 업데이트:', value);
};
</script>
```

#### Vue 3의 emits 옵션

```vue
<!-- Vue 3 <script setup> 방식 -->
<script setup>
const emit = defineEmits({
  // 전송할 이벤트 선언
  'custom-event': null,

  // 검증이 포함된 이벤트
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue는 문자열이어야 합니다');
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

### 3. v-model (양방향 바인딩)

**용도**: 부모-자식 컴포넌트 간 양방향 데이터 바인딩

#### Vue 2의 v-model

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- 이것과 동일 -->
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

#### Vue 3의 v-model

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- 이것과 동일 -->
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

#### Vue 3의 다중 v-model

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
      placeholder="이름"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="이메일"
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

### 4. Provide / Inject (조상-손자 컴포넌트)

**용도**: 계층 간 컴포넌트 통신, props를 단계별로 전달하는 것을 방지

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>조부모 컴포넌트</h1>
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

    // 후손 컴포넌트에 데이터와 메서드 제공
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
    <h2>부모 컴포넌트 (inject 사용하지 않음)</h2>
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
    <h3>자식 컴포넌트</h3>
    <p>사용자: {{ userInfo.name }}</p>
    <p>역할: {{ userInfo.role }}</p>
    <button @click="changeUser">사용자 수정</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // 조부모 컴포넌트가 제공한 데이터 주입
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

#### Provide / Inject 주의사항

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ 잘못됨: 후손 컴포넌트가 직접 수정할 수 있음
    provide('state', state);

    // ✅ 올바름: 읽기 전용 데이터와 수정 메서드 제공
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs (부모가 자식에 접근)

**용도**: 부모 컴포넌트가 자식 컴포넌트의 속성과 메서드에 직접 접근

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">자식 컴포넌트 메서드 호출</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // 자식 컴포넌트의 메서드 직접 호출
      this.$refs.childRef.someMethod();

      // 자식 컴포넌트의 데이터 접근
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ mounted 후에야 $refs에 접근 가능
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
      console.log('자식 컴포넌트의 메서드가 호출됨');
    },
  },
};
</script>
```

#### Vue 3 Composition API의 ref

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">자식 컴포넌트 호출</button>
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

### 6. $parent / $root (자식이 부모에 접근)

**용도**: 자식 컴포넌트가 부모 컴포넌트 또는 루트 컴포넌트에 접근 (권장하지 않음)

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // 부모 컴포넌트에 접근
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // 루트 컴포넌트에 접근
    console.log(this.$root.globalData);
  },
};
</script>
```

**권장하지 않는 이유**:

- 컴포넌트 간 결합도 증가
- 데이터 흐름 추적이 어려움
- 컴포넌트 재사용에 불리
- props, $emit 또는 provide/inject 사용을 권장

### 7. Event Bus (임의 컴포넌트)

**용도**: 임의 컴포넌트 간 통신 (Vue 2에서 자주 사용, Vue 3에서는 권장하지 않음)

#### Vue 2의 Event Bus

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
      console.log('메시지 수신:', data);
    });
  },

  beforeUnmount() {
    // 리스너 제거를 잊지 마세요
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Vue 3의 대안: mitt

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
  console.log('메시지 수신:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia (전역 상태 관리)

**용도**: 복잡한 전역 상태 관리

#### Pinia (Vue 3 권장)

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
    <button @click="handleLogin">로그인</button>
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
    <p v-if="userStore.isLoggedIn">환영합니다, {{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots (콘텐츠 배포)

**용도**: 부모 컴포넌트가 자식 컴포넌트에 템플릿 콘텐츠를 전달

#### 기본 Slot

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">기본 제목</slot>
    </header>

    <main>
      <slot>기본 콘텐츠</slot>
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
      <h1>커스텀 제목</h1>
    </template>

    <p>이것은 메인 콘텐츠입니다</p>

    <template #footer>
      <button>확인</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots (스코프드 슬롯)

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- 부모 컴포넌트에 데이터 전달 -->
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
    <!-- 자식 컴포넌트가 전달한 데이터 수신 -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### 컴포넌트 통신 방법 선택 가이드

| 관계     | 권장 방법      | 사용 시기                  |
| -------- | -------------- | -------------------------- |
| 부모 → 자식 | Props          | 자식 컴포넌트에 데이터 전달 |
| 자식 → 부모 | $emit          | 부모 컴포넌트에 이벤트 알림 |
| 부모 ↔ 자식 | v-model        | 양방향 바인딩 폼 데이터     |
| 조상 → 손자 | Provide/Inject | 계층 간 데이터 전달         |
| 부모 → 자식 | $refs          | 자식 컴포넌트 메서드 직접 호출 (드물게 사용) |
| 임의 컴포넌트 | Pinia/Vuex   | 전역 상태 관리             |
| 임의 컴포넌트 | Event Bus    | 간단한 이벤트 통신 (권장하지 않음) |
| 부모 → 자식 | Slots          | 템플릿 콘텐츠 전달         |

### 실제 사례: 장바구니 기능

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Pinia를 사용하여 전역 장바구니 상태 관리 -->
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
      <button @click="addToCart(product)">장바구니에 추가</button>
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
    <h1>쇼핑 사이트</h1>
    <div>장바구니: {{ cartStore.itemCount }}개 상품</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Props와 Provide/Inject의 차이점은 무엇인가?

### Props

**특징**:

- ✅ 부모-자식 컴포넌트 직접 통신에 적합
- ✅ 데이터 흐름이 명확
- ✅ 타입 검사가 완벽
- ❌ 여러 계층을 거쳐 단계별로 전달해야 함 (props drilling)

```vue
<!-- 단계별 전달 필요 -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**특징**:

- ✅ 조상-손자 컴포넌트 계층 간 통신에 적합
- ✅ 단계별 전달 불필요
- ❌ 데이터 출처가 명확하지 않음
- ❌ 타입 검사가 약함

```vue
<!-- 계층 간 전달, 중간 레이어는 처리 불필요 -->
<grandparent> <!-- provide -->
  <parent> <!-- 처리 불필요 -->
    <child> <!-- 처리 불필요 -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### 사용 권장

- **Props 사용**: 부모-자식 컴포넌트, 데이터 흐름이 명확해야 할 때
- **Provide/Inject 사용**: 깊은 중첩, 테마, 언어, 인증 정보 등 전역 설정

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
