---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. Что такое ref и reactive?

> Что такое `ref` и `reactive`?

`ref` и `reactive` — это два основных API в Vue 3 Composition API для создания реактивного состояния.

### ref

**Определение**: `ref` создаёт реактивную обёртку для **примитивного значения** или **ссылки на объект**.

<details>
<summary>Нажмите, чтобы развернуть базовый пример ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// примитивы
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// объект тоже работает с ref
const user = ref({
  name: 'John',
  age: 30,
});

// доступ через .value в JavaScript
console.log(count.value); // 0
count.value++;
</script>
```

</details>

### reactive

**Определение**: `reactive` создаёт реактивный **Proxy-объект** (не для примитивных значений напрямую).

<details>
<summary>Нажмите, чтобы развернуть базовый пример reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// прямой доступ к свойствам
console.log(state.count); // 0
state.count++;
</script>
```

</details>

## 2. ref vs reactive: ключевые различия

> Основные различия между `ref` и `reactive`

### 1. Поддерживаемые типы

**ref**: работает с любым типом.

```typescript
const count = ref(0); // number
const message = ref('Hello'); // string
const isActive = ref(true); // boolean
const user = ref({ name: 'John' }); // object
const items = ref([1, 2, 3]); // array
```

**reactive**: работает с объектами (включая массивы), не с примитивами.

```typescript
const state = reactive({ count: 0 }); // object
const list = reactive([1, 2, 3]); // array

const count = reactive(0); // некорректное использование
const message = reactive('Hello'); // некорректное использование
```

### 2. Стиль доступа

**ref**: используйте `.value` в JavaScript.

<details>
<summary>Нажмите, чтобы развернуть пример доступа к ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

console.log(count.value);
count.value = 10;
</script>

<template>
  <div>{{ count }}</div>
  <!-- автоматически разворачивается в шаблоне -->
</template>
```

</details>

**reactive**: прямой доступ к свойствам.

<details>
<summary>Нажмите, чтобы развернуть пример доступа к reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

console.log(state.count);
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Поведение при переприсваивании

**ref**: можно переприсвоить.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // допустимо
```

**reactive**: не следует переприсваивать новую привязку объекта.

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // теряется реактивная связь
```

### 4. Деструктуризация

**ref**: деструктуризация `ref.value` даёт простые значения (не реактивные).

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // простые значения
```

**reactive**: прямая деструктуризация теряет реактивность.

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // теряется реактивность

import { toRefs } from 'vue';
const refs = toRefs(state);
// refs.count и refs.message сохраняют реактивность
```

## 3. Когда использовать ref, а когда reactive?

> Когда следует выбирать каждый API?

### Используйте `ref`, когда

1. Состояние является примитивом.

```typescript
const count = ref(0);
const message = ref('Hello');
```

2. Вам может понадобиться заменить всё значение/объект.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };
```

3. Вам нужны template refs.

```vue
<template>
  <div ref="container"></div>
</template>
<script setup>
const container = ref(null);
</script>
```

4. Вы хотите единообразный стиль `.value` для всех значений.

### Используйте `reactive`, когда

1. Управляете сложным состоянием объекта.

```typescript
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});
```

2. Группируете связанные поля вместе без замены идентичности объекта.

```typescript
const userState = reactive({
  user: null,
  loading: false,
  error: null,
});
```

3. Предпочитаете прямой доступ к свойствам для вложенных структур.

## 4. Частые вопросы на собеседованиях

> Частые вопросы на собеседованиях

### Вопрос 1: базовые различия

Объясните вывод и поведение:

```typescript
// случай 1: ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// случай 2: reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// случай 3: переприсваивание reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```typescript
console.log(count1.value); // 10
console.log(state.count); // 10
console.log(state2.count); // 10 (значение есть, но уже не реактивное)
```

Ключевые моменты:

- `ref` требует `.value`
- `reactive` использует прямой доступ к свойствам
- переприсваивание привязки `reactive` нарушает отслеживание реактивности

</details>

### Вопрос 2: подводный камень деструктуризации

Что здесь не так и как это исправить?

```typescript
// случай 1: деструктуризация ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// случай 2: деструктуризация reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Случай 1 (`ref`)**:

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // не обновляет user.value.name

// правильно
user.value.name = 'Jane';
// или
user.value = { name: 'Jane', age: 30 };
```

**Случай 2 (`reactive`)**:

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // теряется реактивность

// правильный подход 1
state.count = 10;

// правильный подход 2
import { toRefs } from 'vue';
const refs = toRefs(state);
refs.count.value = 10;
```

Резюме:

- деструктурированные простые значения не являются реактивными
- используйте `toRefs` для деструктуризации реактивного объекта

</details>

### Вопрос 3: выбор ref или reactive

Выберите API для каждого сценария:

```typescript
// Сценарий 1: счётчик
const count = ?;

// Сценарий 2: состояние формы
const form = ?;

// Сценарий 3: объект пользователя, который может быть заменён
const user = ?;

// Сценарий 4: template ref
const inputRef = ?;
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```typescript
const count = ref(0); // примитив

const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // сгруппированное состояние объекта

const user = ref({ name: 'John', age: 30 }); // удобнее для полной замены

const inputRef = ref(null); // template ref должен использовать ref
```

Правило:

- примитив -> `ref`
- нужна полная замена объекта -> `ref`
- сложное сгруппированное состояние объекта -> `reactive`
- template refs -> `ref`

</details>

## 5. Лучшие практики

> Лучшие практики

### Рекомендуется

```typescript
// 1) примитивы с ref
const count = ref(0);
const message = ref('Hello');

// 2) структурированное состояние объекта с reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3) используйте ref, когда часто нужна полная замена
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };

// 4) используйте toRefs при деструктуризации reactive объекта
import { toRefs } from 'vue';
const { username, password } = toRefs(formState);
```

### Избегайте

```typescript
// 1) не используйте reactive для примитивов
const count = reactive(0); // некорректно

// 2) не переприсваивайте привязку reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // нарушает отслеживание

// 3) избегайте прямой деструктуризации reactive, когда нужна реактивность
const { count } = reactive({ count: 0 }); // теряется отслеживание
```

## 6. Итоги для собеседования

> Итоги для собеседования

### Быстрое запоминание

**ref**:

- любой тип
- `.value` в JavaScript
- лёгкая полная замена
- автоматическое разворачивание в шаблоне

**reactive**:

- только объекты/массивы
- прямой доступ к свойствам
- сохранение идентичности объекта
- используйте `toRefs` при деструктуризации

**Руководство по выбору**:

- примитив -> `ref`
- объект с частой заменой -> `ref`
- сгруппированное состояние объекта -> `reactive`

### Пример ответа

**В: В чём разница между ref и reactive?**

> `ref` оборачивает значение и доступен через `.value` в JavaScript, а `reactive` возвращает proxy-объект с прямым доступом к свойствам.
> `ref` работает с примитивами и объектами; `reactive` — только для объектов/массивов.
> Переприсваивание `ref.value` допустимо; переприсваивание привязки `reactive` нарушает отслеживание.

**В: Когда следует использовать каждый?**

> Используйте `ref` для примитивов, template refs и состояний объектов, которые часто заменяются целиком.
> Используйте `reactive` для сложного сгруппированного состояния объекта, где важна стабильная идентичность объекта.

## Справочные материалы

- [Vue 3 Основы реактивности](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
