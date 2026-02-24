---
id: vue3-new-features
title: '[Easy] Новые возможности Vue3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. Какие новые возможности появились в Vue 3?

> Какие основные новые возможности появились в Vue 3?

Vue 3 представил множество важных обновлений:

### Основные возможности

1. **Composition API**
2. **Teleport**
3. **Fragment (множественные корневые узлы)**
4. **Suspense**
5. **Множественные привязки `v-model`**
6. **Улучшенная поддержка TypeScript**
7. **Улучшения производительности** (меньший размер бандла, более быстрый рендеринг)

## 2. Teleport

> Что такое Teleport?

`Teleport` позволяет рендерить часть компонента в другом месте дерева DOM без изменения принадлежности компонента или структуры логики.

### Типичные случаи использования

Modal, Tooltip, Notification, Popover, оверлейные слои.

```vue
<template>
  <div>
    <button @click="showModal = true">Открыть модальное окно</button>

    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Заголовок модального окна</h2>
          <p>Содержимое модального окна</p>
          <button @click="showModal = false">Закрыть</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

### Почему Teleport полезен

1. Решает проблемы stacking context / z-index
2. Избегает обрезки из-за overflow предка
3. Сохраняет логику компонента рядом, рендеря в другом месте

## 3. Fragment (множественные корневые узлы)

> Что такое Fragment в Vue 3?

Vue 3 позволяет шаблону компонента иметь множественные корневые узлы.
В отличие от React, Vue использует неявные fragments (дополнительный тег `<Fragment>` не нужен).

### Vue 2 vs Vue 3

**Vue 2**: требуется единственный корень.

```vue
<template>
  <div>
    <h1>Заголовок</h1>
    <p>Содержимое</p>
  </div>
</template>
```

**Vue 3**: множественные корни допустимы.

```vue
<template>
  <h1>Заголовок</h1>
  <p>Содержимое</p>
</template>
```

### Почему Fragment важен

1. Меньше лишних элементов-обёрток
2. Лучшая семантика HTML
3. Менее глубокое дерево DOM
4. Чище стили и селекторы

### Наследование атрибутов в компонентах с множественными корнями

При использовании шаблонов с множественными корнями атрибуты родителя (`class`, `id` и т.д.) не применяются автоматически к конкретному корню.
Используйте `$attrs` вручную.

```vue
<!-- Родитель -->
<MyComponent class="custom-class" id="my-id" />

<!-- Дочерний -->
<template>
  <div v-bind="$attrs">Первый корень</div>
  <div>Второй корень</div>
</template>
```

Вы можете управлять поведением с помощью:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
```

### Fragment в Vue vs React Fragment

| Характеристика | Vue 3 Fragment | React Fragment |
| --- | --- | --- |
| Синтаксис | Неявный (тег не нужен) | Явный (`<>` или `<Fragment>`) |
| Обработка ключей | Обычные правила vnode/key в списках | Key поддерживается на `<Fragment key=...>` |
| Проброс атрибутов | Используйте `$attrs` вручную при множественных корнях | Нет прямых атрибутов fragment |

## 4. Suspense

> Что такое Suspense?

`Suspense` — встроенный компонент для состояний загрузки асинхронных зависимостей.
Он рендерит резервный UI, пока разрешается асинхронный компонент/setup.

### Базовое использование

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Загрузка...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Типичные случаи использования

1. Загрузка асинхронных компонентов
2. Асинхронные требования данных в `setup()`
3. Скелетонные UI на уровне маршрутов или секций

## 5. Множественные v-model

> Множественные привязки `v-model`

Vue 3 поддерживает множественные привязки `v-model` на одном компоненте.
Каждая привязка соответствует prop + событию `update:propName`.

### Vue 2 vs Vue 3

**Vue 2**: один паттерн `v-model` на компонент.

```vue
<CustomInput v-model="value" />
```

**Vue 3**: множественные именованные привязки `v-model`.

```vue
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Пример реализации компонента

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
    />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Частые вопросы на собеседованиях

> Частые вопросы на собеседованиях

### Вопрос 1: когда следует использовать Teleport?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

Используйте Teleport, когда визуальный рендеринг должен выйти за пределы локальных ограничений DOM:

1. **Модальные диалоги** для избежания проблем со stacking/overflow родителя
2. **Tooltip/popover**, которые не должны обрезаться
3. **Глобальные уведомления**, рендерящиеся в выделенном корневом контейнере

Не используйте Teleport для обычного содержимого в потоке.

</details>

### Вопрос 2: преимущества Fragment

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

Преимущества:

1. Меньше узлов-обёрток
2. Лучшая семантическая структура
3. Более простой CSS во многих раскладках
4. Меньшая глубина DOM и накладные расходы

</details>

### Вопрос 3: наследование атрибутов при множественных корнях

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

Для компонентов с множественными корнями attrs не наследуются автоматически на один корень.
Обрабатывайте их явно с помощью `$attrs` и при необходимости `inheritAttrs: false`.

```vue
<template>
  <div v-bind="$attrs">Корень A</div>
  <div>Корень B</div>
</template>
```

</details>

### Вопрос 4: Fragment в Vue vs React

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

Vue использует неявное поведение fragment в шаблонах.
React требует явный синтаксис fragment (`<>...</>` или `<Fragment>`).

</details>

### Вопрос 5: пример реализации Suspense

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Загрузка профиля пользователя...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

</details>

## 7. Лучшие практики

> Лучшие практики

### Рекомендуется

```vue
<!-- 1) Используйте Teleport для оверлеев -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2) Сохраняйте семантические шаблоны с множественными корнями, где уместно -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3) Оборачивайте асинхронные части в Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4) Используйте явные имена для множественных v-model -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Избегайте

```vue
<!-- 1) Не злоупотребляйте Teleport для обычного содержимого -->
<Teleport to="body">
  <div>Обычное содержимое</div>
</Teleport>

<!-- 2) Не используйте множественные корни только для стиля; сохраняйте логическую группировку -->
<template>
  <h1>Заголовок</h1>
  <p>Содержимое</p>
</template>

<!-- 3) Не игнорируйте обработку ошибок/загрузки для асинхронных компонентов -->
<Suspense>
  <AsyncComponent />
</Suspense>
```

## 8. Итоги для собеседования

> Итоги для собеседования

### Быстрое запоминание

**Ключевые возможности Vue 3**:

- Composition API
- Teleport
- Fragment
- Suspense
- Множественные `v-model`

### Пример ответа

**В: Какие основные возможности Vue 3?**

> Composition API для лучшей организации и переиспользования логики, Teleport для рендеринга оверлеев вне локальных DOM-контейнеров, Fragment для множественных корневых узлов, Suspense для состояний асинхронной загрузки, множественные привязки `v-model`, а также улучшенная поддержка TypeScript и производительности.

**В: Какой практический случай использования Teleport?**

> Рендеринг модального/оверлейного окна в `body` для избежания проблем с обрезкой и stacking, сохраняя при этом логику модала внутри исходного дерева компонентов.

## Справочные материалы

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Множественные v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
