---
id: vue-component-communication
title: '[Medium] 📄 Component Communication'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> What communication patterns exist between Vue components?

Component communication strategy depends on relationship scope.

### Relationship categories

```text
Parent <-> Child: props / emit / v-model / refs
Ancestor <-> Descendant: provide / inject
Sibling / unrelated components: Pinia/Vuex (or event emitter for simple cases)
```

### 1. Props (parent → child)

**Purpose**: parent passes data to child.

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

#### Props notes

- Props are one-way-down (parent source of truth)
- Do not mutate props directly in child
- If local editing is needed, copy into local `ref`

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

**Purpose**: child notifies parent through events.

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="sendToParent">Send to parent</button>
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
    <p>Received: {{ receivedData }}</p>
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
  console.log('Input updated:', value);
};
</script>
```

#### Vue 3 emits validation

```vue
<script setup>
const emit = defineEmits({
  'custom-event': null,
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue must be a string');
      return false;
    }
    return true;
  },
});

emit('custom-event', 'data');
</script>
```

### 3. v-model (two-way parent-child contract)

#### Vue 2 style

```vue
<!-- Parent -->
<custom-input v-model="message" />
<!-- equivalent -->
<custom-input :value="message" @input="message = $event" />
```

```vue
<!-- Child in Vue 2 -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### Vue 3 style

```vue
<!-- Parent -->
<custom-input v-model="message" />
<!-- equivalent -->
<custom-input :modelValue="message" @update:modelValue="message = $event" />
```

```vue
<!-- Child in Vue 3 -->
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

#### Multiple v-model in Vue 3

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

**Purpose**: cross-level communication without prop drilling.

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
    <button @click="changeUser">Update user</button>
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

#### Provide/Inject notes

- Great for deep tree shared context (theme/i18n/config)
- Less explicit than props, so naming/documentation matters
- Consider readonly + explicit mutation API

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

### 5. Refs (parent directly accesses child instance)

**Purpose**: imperative access (call exposed child methods, read exposed state).

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Call child method</button>
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

Use sparingly. Prefer declarative data flow first.

### 6. `$parent` / `$root` (not recommended)

Accessing parent/root directly increases coupling and makes data flow hard to reason about.
Prefer props/emit/provide or store.

### 7. Event Bus (legacy/simple pub-sub)

Vue 2 often used `new Vue()` event bus.
In Vue 3, use a small emitter like `mitt` only for lightweight event channels.

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
  console.log('received:', data);
};

onMounted(() => emitter.on('message-sent', handleMessage));
onUnmounted(() => emitter.off('message-sent', handleMessage));
</script>
```

### 8. Vuex / Pinia (global state management)

**Purpose**: shared global state for medium/large apps.

Pinia is the recommended Vue 3 store solution.

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

### 9. Slots (content projection)

**Purpose**: parent passes template content into child regions.

#### Basic slots

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Default Header</slot>
    </header>
    <main>
      <slot>Default Content</slot>
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
      <h1>Custom Header</h1>
    </template>

    <p>Main body content</p>

    <template #footer>
      <button>Confirm</button>
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

### Communication selection guide

| Relation | Recommended approach | Typical use |
| --- | --- | --- |
| Parent → Child | Props | Data input |
| Child → Parent | Emit | Event callback |
| Parent ↔ Child | v-model | Form sync |
| Ancestor → Descendant | Provide/Inject | Deep tree context |
| Parent → Child (imperative) | Refs | Rare direct method call |
| Any components | Pinia/Vuex | Shared global state |
| Any components (simple) | Event emitter | Lightweight pub-sub |
| Parent → Child content | Slots | Template composition |

### Practical case: cart feature with Pinia

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

## 2. What's the difference between Props and Provide/Inject?

> What is the difference between Props and Provide/Inject?

### Props

**Characteristics**:

- Clear and explicit parent-child flow
- Stronger type/contract definition
- Great for direct parent-child communication
- Can cause prop drilling across many levels

```vue
<!-- drilling through intermediate components -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Characteristics**:

- Great for cross-level dependencies
- No need to pass through every intermediate layer
- Less explicit source visibility if overused

```vue
<grandparent> <!-- provide -->
  <parent>
    <child>
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Recommendation

- **Use Props** when data flow clarity is most important (especially parent-child)
- **Use Provide/Inject** for deep shared context (theme, i18n, auth/config)
- For application-wide mutable state, prefer Pinia/Vuex

## Reference

- [Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
