---
id: vue-component-communication
title: '[Medium] 📄 Коммуникация между компонентами'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. Какие существуют способы коммуникации между Vue-компонентами?

> Какие паттерны коммуникации существуют между Vue-компонентами?

Стратегия коммуникации зависит от типа отношений между компонентами.

### Категории отношений

```text
Родитель <-> Дочерний: props / emit / v-model / refs
Предок <-> Потомок: provide / inject
Соседние / несвязанные компоненты: Pinia/Vuex (или event emitter для простых случаев)
```

### 1. Props (родитель → дочерний)

**Назначение**: родитель передаёт данные дочернему компоненту.

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Родитель</h1>
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

const parentMessage = ref('Привет от родителя');
const userInfo = ref({ name: 'John', age: 30 });
const counter = ref(0);
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Дочерний</h2>
    <p>Сообщение: {{ message }}</p>
    <p>Пользователь: {{ user.name }} ({{ user.age }})</p>
    <p>Счётчик: {{ count }}</p>
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

#### Замечания о props

- Props являются однонаправленными (источник истины — родитель)
- Не изменяйте props напрямую в дочернем компоненте
- Если нужно локальное редактирование, скопируйте значение в локальный `ref`

```vue
<script setup>
import { ref } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);
</script>
```

### 2. Emit (дочерний → родитель)

**Назначение**: дочерний компонент уведомляет родителя через события.

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="sendToParent">Отправить родителю</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);
const inputValue = ref('');

const sendToParent = () => {
  emit('custom-event', {
    message: 'Привет от дочернего компонента',
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
    <h1>Родитель</h1>
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />
    <p>Получено: {{ receivedData }}</p>
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
  console.log('Ввод обновлён:', value);
};
</script>
```

#### Валидация emits в Vue 3

```vue
<script setup>
const emit = defineEmits({
  'custom-event': null,
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue должен быть строкой');
      return false;
    }
    return true;
  },
});

emit('custom-event', 'data');
</script>
```

### 3. v-model (двусторонний контракт родитель-дочерний)

#### Стиль Vue 2

```vue
<!-- Родитель -->
<custom-input v-model="message" />
<!-- эквивалент -->
<custom-input :value="message" @input="message = $event" />
```

```vue
<!-- Дочерний в Vue 2 -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### Стиль Vue 3

```vue
<!-- Родитель -->
<custom-input v-model="message" />
<!-- эквивалент -->
<custom-input :modelValue="message" @update:modelValue="message = $event" />
```

```vue
<!-- Дочерний в Vue 3 -->
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

#### Множественные v-model в Vue 3

```vue
<!-- Родитель -->
<user-form v-model:name="userName" v-model:email="userEmail" />
```

```vue
<!-- Дочерний -->
<template>
  <div>
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Имя"
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

### 4. Provide / Inject (предок ↔ потомок)

**Назначение**: межуровневая коммуникация без сквозной передачи props.

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Прародитель</h1>
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
    <h3>Дочерний</h3>
    <p>Пользователь: {{ userInfo.name }}</p>
    <p>Роль: {{ userInfo.role }}</p>
    <button @click="changeUser">Обновить пользователя</button>
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

#### Замечания о Provide/Inject

- Отлично подходит для общего контекста глубокого дерева (тема/i18n/конфигурация)
- Менее явный, чем props, поэтому важны именование и документация
- Рассмотрите использование readonly + явный API для мутаций

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

### 5. Refs (родитель напрямую обращается к экземпляру дочернего)

**Назначение**: императивный доступ (вызов открытых методов дочернего компонента, чтение открытого состояния).

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Вызвать метод дочернего</button>
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

Используйте с осторожностью. Сначала предпочитайте декларативный поток данных.

### 6. `$parent` / `$root` (не рекомендуется)

Прямой доступ к родителю/корню увеличивает связанность и усложняет отслеживание потока данных.
Предпочитайте props/emit/provide или хранилище.

### 7. Event Bus (устаревший/простой pub-sub)

В Vue 2 часто использовался `new Vue()` как шина событий.
В Vue 3 используйте небольшой эмиттер, например `mitt`, только для лёгких каналов событий.

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
  emitter.emit('message-sent', { text: 'Привет', from: 'ComponentA' });
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handleMessage = (data) => {
  console.log('получено:', data);
};

onMounted(() => emitter.on('message-sent', handleMessage));
onUnmounted(() => emitter.off('message-sent', handleMessage));
</script>
```

### 8. Vuex / Pinia (глобальное управление состоянием)

**Назначение**: общее глобальное состояние для средних/крупных приложений.

Pinia — рекомендуемое решение для хранилища в Vue 3.

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

### 9. Slots (проекция содержимого)

**Назначение**: родитель передаёт шаблонное содержимое в определённые области дочернего компонента.

#### Базовые слоты

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Заголовок по умолчанию</slot>
    </header>
    <main>
      <slot>Содержимое по умолчанию</slot>
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
      <h1>Пользовательский заголовок</h1>
    </template>

    <p>Основное содержимое</p>

    <template #footer>
      <button>Подтвердить</button>
    </template>
  </child-component>
</template>
```

#### Scoped slots (слоты с областью видимости)

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

### Руководство по выбору способа коммуникации

| Отношение | Рекомендуемый подход | Типичное использование |
| --- | --- | --- |
| Родитель → Дочерний | Props | Входные данные |
| Дочерний → Родитель | Emit | Обратный вызов события |
| Родитель ↔ Дочерний | v-model | Синхронизация формы |
| Предок → Потомок | Provide/Inject | Глубокий контекст дерева |
| Родитель → Дочерний (императивно) | Refs | Редкий прямой вызов метода |
| Любые компоненты | Pinia/Vuex | Общее глобальное состояние |
| Любые компоненты (просто) | Event emitter | Лёгкий pub-sub |
| Родитель → Дочерний содержимое | Slots | Композиция шаблонов |

### Практический пример: функция корзины с Pinia

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

## 2. В чём разница между Props и Provide/Inject?

> В чём разница между Props и Provide/Inject?

### Props

**Характеристики**:

- Явный и чёткий поток данных родитель-дочерний
- Более строгое определение типов/контрактов
- Отлично подходит для прямой коммуникации родитель-дочерний
- Может вызывать сквозную передачу props через множество уровней

```vue
<!-- сквозная передача через промежуточные компоненты -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Характеристики**:

- Отлично подходит для межуровневых зависимостей
- Не нужно передавать через каждый промежуточный слой
- При чрезмерном использовании менее очевиден источник данных

```vue
<grandparent> <!-- provide -->
  <parent>
    <child>
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Рекомендация

- **Используйте Props**, когда важнее всего ясность потока данных (особенно родитель-дочерний)
- **Используйте Provide/Inject** для глубокого общего контекста (тема, i18n, авторизация/конфигурация)
- Для изменяемого состояния всего приложения предпочитайте Pinia/Vuex

## Справочные материалы

- [Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Документация Pinia](https://pinia.vuejs.org/)
- [mitt — Event Emitter](https://github.com/developit/mitt)
