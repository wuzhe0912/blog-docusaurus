---
id: vue-basic-api
title: '[Medium] 📄 Основы Vue и API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Можете ли вы описать основные принципы и преимущества фреймворка Vue?

> Опишите основные принципы и сильные стороны Vue.

### Основные принципы

Vue — прогрессивный JavaScript-фреймворк. Его ключевые концепции включают:

#### 1. Virtual DOM

Vue использует Virtual DOM diffing для обновления только изменённых частей реального DOM.

```js
// упрощённая концепция Virtual DOM
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Реактивное связывание данных

Реактивные данные автоматически обновляют UI. С привязками форм (`v-model`) ввод пользователя также может обновлять состояние.

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

#### 3. Компонентная архитектура

UI разделяется на переиспользуемые, тестируемые компоненты с изолированными ответственностями.

```vue
<!-- Button.vue -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => emit('click');
</script>
```

#### 4. Хуки жизненного цикла

Хуки позволяют выполнять логику на этапах создания/монтирования/обновления/размонтирования.

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Компонент смонтирован');
});

onUpdated(() => {
  console.log('Компонент обновлён');
});

onUnmounted(() => {
  console.log('Компонент размонтирован');
});
</script>
```

#### 5. Система директив

Директивы Vue предоставляют декларативную логику UI (`v-if`, `v-for`, `v-bind`, `v-model` и т.д.).

```vue
<template>
  <div v-if="isVisible">Видимое содержимое</div>

  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <img :src="imageUrl" :alt="imageAlt" />

  <input v-model="username" />
</template>
```

#### 6. Синтаксис шаблонов

Шаблоны поддерживают интерполяцию и выражения, сохраняя читаемость разметки.

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ count + 1 }}</p>
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Сильные стороны Vue (часто сравнивается с React)

#### 1. Более низкий порог входа

Однофайловые компоненты (`template/script/style`) интуитивны для многих команд.

#### 2. Встроенные декларативные директивы

Типичные задачи UI лаконичны с директивами.

#### 3. Простое двустороннее связывание форм

`v-model` предлагает первоклассный паттерн для синхронизации ввода.

#### 4. Чёткое разделение шаблона и логики

Некоторые команды предпочитают структуру с приоритетом шаблона по сравнению с паттернами, насыщенными JSX.

#### 5. Целостная официальная экосистема

Vue Router + Pinia + интеграция инструментов хорошо согласованы.

## 2. Объясните использование `v-model`, `v-bind` и `v-html`

> Объясните использование `v-model`, `v-bind` и `v-html`.

### `v-model`: двустороннее связывание для элементов форм

```vue
<template>
  <div>
    <input v-model="message" />
    <p>Сообщение: {{ message }}</p>

    <input type="checkbox" v-model="checked" />
    <p>Отмечено: {{ checked }}</p>

    <select v-model="selected">
      <option value="A">Вариант A</option>
      <option value="B">Вариант B</option>
    </select>
    <p>Выбрано: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### Модификаторы `v-model`

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" type="number" />
<input v-model.trim="msg" />
```

### `v-bind`: динамическая привязка атрибутов

```vue
<template>
  <div>
    <div :class="{ active: isActive, 'text-danger': hasError }">Динамический класс</div>

    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Динамический стиль</div>

    <img :src="imageUrl" :alt="imageAlt" />

    <a :href="linkUrl">Перейти по ссылке</a>

    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Описание изображения',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### Сокращение `v-bind`

```vue
<img v-bind:src="imageUrl" />
<img :src="imageUrl" />
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: рендеринг сырой HTML-строки

```vue
<template>
  <div>
    <p>{{ rawHtml }}</p>
    <p v-html="rawHtml"></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Красный текст</span>',
    };
  },
};
</script>
```

#### Предупреждение о безопасности

Никогда не используйте `v-html` напрямую для непроверенного пользовательского ввода (риск XSS).

```vue
<!-- небезопасно -->
<div v-html="userProvidedContent"></div>

<!-- безопаснее: санитизированное содержимое -->
<div v-html="sanitizedHtml"></div>
```

#### Более безопасный подход с санитайзером

```vue
<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Краткое сравнение

| Директива | Назначение | Сокращение | Пример |
| --- | --- | --- | --- |
| `v-model` | Двустороннее связывание форм | Нет | `<input v-model="msg">` |
| `v-bind` | Одностороннее связывание атрибутов | `:` | `<img :src="url">` |
| `v-html` | Рендеринг сырого HTML | Нет | `<div v-html="html"></div>` |

## 3. Как получить доступ к HTML-элементам (Template Refs)?

> Как манипулировать HTML-элементами в Vue (например, установить фокус на input)?

Используйте template refs вместо `document.querySelector` в компонентах.

### Options API (Vue 2 / Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Установить фокус</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Установить фокус</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputElement = ref(null);

const focusInput = () => {
  inputElement.value?.focus();
};

onMounted(() => {
  console.log(inputElement.value);
});
</script>
```

Замечания:

- Имя ref в шаблоне должно совпадать с переменной в скрипте
- Доступ после монтирования (`onMounted` / `mounted`)
- Внутри `v-for` refs становятся массивами

## 4. В чём разница между `v-show` и `v-if`?

> Объясните различия между `v-show` и `v-if`.

### Сходство

Оба управляют видимостью на основе условий.

```vue
<template>
  <div v-if="isVisible">Используется v-if</div>
  <div v-show="isVisible">Используется v-show</div>
</template>
```

### Различия

#### 1) Поведение DOM

- `v-if`: монтирование/размонтирование узла
- `v-show`: всегда смонтирован; переключает CSS `display`

#### 2) Профиль производительности

- `v-if`: низкая начальная стоимость при false, высокая стоимость переключения
- `v-show`: высокая начальная стоимость, низкая стоимость переключения

#### 3) Влияние на жизненный цикл

- `v-if` запускает полный жизненный цикл дочерних элементов при переключении
- `v-show` не размонтирует; нет монтирования/размонтирования при переключении

#### 4) Стоимость начального рендера

Для тяжёлых компонентов, изначально скрытых:

- `v-if="false"`: компонент не рендерится
- `v-show="false"`: компонент рендерится, но скрыт

#### 5) Комбинации директив

- `v-if` поддерживает `v-else-if` / `v-else`
- `v-show` — нет

### Когда использовать каждый

#### Используйте `v-if`, когда

1. Условие меняется редко
2. Начальное false должно избежать стоимости рендеринга
3. Вам нужны условные ветки с `v-else`
4. Нужны побочные эффекты монтирования/размонтирования

#### Используйте `v-show`, когда

1. Видимость переключается часто
2. Компонент должен оставаться смонтированным для сохранения внутреннего состояния
3. Повторное монтирование не требуется

### Сводная таблица

| Характеристика | `v-if` | `v-show` |
| --- | --- | --- |
| Начальная стоимость | Ниже (при false) | Выше (всегда рендерится) |
| Стоимость переключения | Выше | Ниже |
| Lifecycle при переключении | Да | Нет |
| Лучше для | Редких переключений | Частых переключений |

### Мнемоника

- `v-if`: «рендерить только при необходимости»
- `v-show`: «рендерить один раз, скрывать/показывать через CSS»

## 5. В чём разница между `computed` и `watch`?

> В чём разница между `computed` и `watch`?

Оба реагируют на изменения состояния, но решают разные задачи.

### `computed`

#### Основные характеристики

1. Вычисляет новые данные из существующего реактивного состояния
2. Кешируется до изменения зависимостей
3. Синхронный и ориентирован на возвращаемое значение
4. Напрямую используется в шаблоне

#### Типичные случаи использования

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const emailLowerCase = computed(() => email.value.toLowerCase());
const cartTotal = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
);
const filteredItems = computed(() =>
  !searchText.value
    ? items.value
    : items.value.filter((item) =>
        item.name.toLowerCase().includes(searchText.value.toLowerCase())
      )
);
</script>
```

#### Преимущество кеширования

```vue
<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed выполняется только при изменении зависимости');
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('метод выполняется при каждом вызове');
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### Форма getter + setter

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});
</script>
```

### `watch`

#### Основные характеристики

1. Явно наблюдает за источником(ами)
2. Предназначен для побочных эффектов
3. Поддерживает асинхронные рабочие процессы
4. Может получить доступ к `newValue` и `oldValue`

#### Типичные случаи использования

```vue
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);

const username = ref('');
const usernameError = ref('');

const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// 1) поиск с задержкой
watch(searchQuery, (newQuery, oldQuery) => {
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 2) побочный эффект валидации
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'Имя пользователя должно содержать не менее 3 символов';
  } else if (newUsername.length > 20) {
    usernameError.value = 'Имя пользователя должно содержать не более 20 символов';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value =
      'Имя пользователя может содержать только буквы, цифры и нижнее подчёркивание';
  } else {
    usernameError.value = '';
  }
});

// 3) побочный эффект автосохранения
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### Опции `watch`

```vue
<script setup>
import { ref, watch } from 'vue';

const user = ref({
  name: 'John',
  profile: { age: 30, city: 'Taipei' },
});
const items = ref([1, 2, 3]);

// immediate: выполнить сразу
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Имя изменилось с ${oldName} на ${newName}`);
  },
  { immediate: true }
);

// deep: отслеживать вложенные мутации
watch(
  user,
  (newUser) => {
    console.log('вложенный объект user изменён', newUser);
  },
  { deep: true }
);

// flush: управление таймингом (pre/post/sync)
watch(
  items,
  () => {
    console.log('items изменился');
  },
  { flush: 'post' }
);
</script>
```

#### Наблюдение за несколькими источниками

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Имя изменилось с ${oldFirst} ${oldLast} на ${newFirst} ${newLast}`);
});
</script>
```

### `computed` vs `watch`

| Характеристика | computed | watch |
| --- | --- | --- |
| Основная цель | Вычисление значения | Побочный эффект при изменении |
| Возвращаемое значение | Обязательно | Необязательно/нет |
| Кеш | Да | Нет |
| Отслеживание зависимостей | Автоматическое | Явный источник |
| Асинхронные побочные эффекты | Нет | Да |
| Старое/новое значения | Нет | Да |
| Прямое использование в шаблоне | Да | Нет |

### Правило

- **`computed` вычисляет данные**
- **`watch` выполняет действия**

### Правильное/неправильное сравнение

#### Неправильно

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Правильно

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

### Практика: вычислить `x * y`

Дано `x = 0`, `y = 5`, кнопка увеличивает `x` на 1 при каждом клике.

#### Решение A: `computed` (рекомендуется)

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Результат (X * Y): {{ result }}</p>
    <button @click="x++">Увеличить X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

const result = computed(() => x.value * y.value);
</script>
```

#### Решение B: `watch` (работает, но более многословно)

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Справочные материалы

- [Официальная документация Vue 3](https://vuejs.org/)
- [Руководство по миграции с Vue 2 на Vue 3](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Директивы Vue](https://vuejs.org/api/built-in-directives.html)
- [Вычисляемые свойства и наблюдатели](https://vuejs.org/guide/essentials/computed.html)
