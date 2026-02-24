---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. Что такое watch и watchEffect?

> Что такое `watch` и `watchEffect`?

`watch` и `watchEffect` — это API Vue 3 для реакции на изменения реактивного состояния.

### watch

**Определение**: явно наблюдает за одним или несколькими источниками и выполняет callback при их изменении.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// наблюдение за одним источником
watch(count, (newValue, oldValue) => {
  console.log(`count изменился с ${oldValue} на ${newValue}`);
});

// наблюдение за несколькими источниками
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count или message изменились');
});
</script>
```

### watchEffect

**Определение**: выполняется немедленно и автоматически отслеживает реактивные зависимости, используемые внутри callback.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// автоматически отслеживает count и message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // перезапускается при изменении count/message
});
</script>
```

## 2. watch vs watchEffect: ключевые различия

> Основные различия между `watch` и `watchEffect`

### 1. Объявление источника

**watch**: явные источники.

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal, oldVal) => {
  console.log('count изменился');
});

watch([count, message], ([newCount, newMessage]) => {
  console.log('count или message изменились');
});
```

**watchEffect**: неявное отслеживание зависимостей.

```typescript
const count = ref(0);
const message = ref('Hello');

watchEffect(() => {
  console.log(count.value); // отслеживается автоматически
  console.log(message.value); // отслеживается автоматически
});
```

### 2. Время выполнения

**watch**: ленивый по умолчанию; выполняется только после изменения источника.

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('выполнено');
});

count.value = 1; // запускает callback
```

**watchEffect**: выполняется немедленно, затем перезапускается при обновлении зависимостей.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('выполнено'); // немедленный первый запуск
  console.log(count.value);
});

count.value = 1; // выполняется снова
```

### 3. Доступ к старому значению

**watch**: предоставляет `newValue` и `oldValue`.

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`с ${oldVal} на ${newVal}`);
});
```

**watchEffect**: прямого доступа к старому значению нет.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // только текущее значение
});
```

### 4. Остановка наблюдателей

Оба возвращают функцию остановки.

```typescript
const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

stopWatch();
stopEffect();
```

## 3. Когда использовать watch, а когда watchEffect?

> Когда следует выбирать каждый API?

### Используйте `watch`, когда

1. Вам нужны явные источники.

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

2. Вам нужно старое значение.

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`с ${oldVal} на ${newVal}`);
});
```

3. Вам нужно ленивое выполнение.

```typescript
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    search(newQuery);
  }
});
```

4. Вам нужен точный контроль (`immediate`, `deep` и т.д.).

```typescript
watch(
  () => user.value.id,
  (newId) => {
    fetchUser(newId);
  },
  { immediate: true, deep: true }
);
```

### Используйте `watchEffect`, когда

1. Вам нужно автоматическое отслеживание зависимостей.

```typescript
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});
```

2. Вам не нужно старое значение.

```typescript
watchEffect(() => {
  console.log(`текущий count: ${count.value}`);
});
```

3. Вам нужен немедленный первый запуск.

```typescript
watchEffect(() => {
  updateChart(count.value, message.value);
});
```

## 4. Частые вопросы на собеседованиях

> Частые вопросы на собеседованиях

### Вопрос 1: порядок выполнения

Объясните вывод и порядок:

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal) => {
  console.log('watch:', newVal);
});

watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

`watch` ленивый (без немедленного запуска), но `watchEffect` выполняется немедленно.

Ожидаемая последовательность:

1. `watchEffect: 0 Hello` (начальный запуск)
2. `watch: 1` (count изменился)
3. `watchEffect: 1 Hello` (count изменился)
4. `watchEffect: 1 World` (message изменился)

Ключевые моменты:

- `watch` реагирует только на явно наблюдаемый источник
- `watchEffect` реагирует на любую реактивную зависимость, используемую в callback

</details>

### Вопрос 2: старое значение с watchEffect

Как получить доступ к старому значению при использовании `watchEffect`?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

`watchEffect` не предоставляет старое значение напрямую.

**Вариант 1: хранить собственный предыдущий ref**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`с ${prevCount.value} на ${count.value}`);
  prevCount.value = count.value;
});
```

**Вариант 2: использовать watch**

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`с ${oldVal} на ${newVal}`);
});
```

Рекомендация: если нужно старое значение, предпочитайте `watch`.

</details>

### Вопрос 3: выбор watch или watchEffect

Выберите API для каждого сценария:

```typescript
// Сценарий 1: перезагрузка данных пользователя при изменении userId
const userId = ref(1);

// Сценарий 2: активация кнопки отправки при валидности формы
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// Сценарий 3: поиск с debounce при изменении ключевого слова
const searchQuery = ref('');
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Сценарий 1: изменение userId** -> `watch`

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Сценарий 2: побочный эффект валидности формы** -> `watchEffect`

```typescript
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Сценарий 3: поиск с debounce** -> `watch`

```typescript
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

Правило выбора:

- явный источник / старое значение / опции управления -> `watch`
- автоматическое отслеживание зависимостей + немедленный запуск -> `watchEffect`

</details>

## 5. Лучшие практики

> Лучшие практики

### Рекомендуется

```typescript
// 1) явный источник -> watch
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2) автоматическое отслеживание нескольких зависимостей -> watchEffect
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3) нужно старое значение -> watch
watch(count, (newVal, oldVal) => {
  console.log(`с ${oldVal} на ${newVal}`);
});

// 4) очистка
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Избегайте

```typescript
// 1) избегайте неуправляемых асинхронных побочных эффектов в watchEffect
watchEffect(async () => {
  const data = await fetchData();
  // потенциальная гонка/утечка, если не управлять
});

// 2) избегайте чрезмерного использования watchEffect
watchEffect(() => {
  console.log(count.value); // watch(count, ...) может быть понятнее
});

// 3) избегайте мутации отслеживаемого источника в том же эффекте (риск циклов)
watchEffect(() => {
  count.value++; // может вызвать бесконечный цикл
});
```

## 6. Итоги для собеседования

> Итоги для собеседования

### Быстрое запоминание

**watch**:

- явное объявление источника
- ленивый по умолчанию
- старое значение доступно
- лучше для контролируемых сценариев

**watchEffect**:

- автоматическое отслеживание зависимостей
- немедленное выполнение
- старого значения нет
- лучше для лаконичных реактивных побочных эффектов

**Правило**:

- явный контроль -> `watch`
- автоматическое отслеживание -> `watchEffect`
- нужно старое значение -> `watch`
- нужен немедленный начальный запуск -> `watchEffect`

### Пример ответа

**В: В чём разница между watch и watchEffect?**

> Оба реагируют на реактивные изменения в Vue 3. `watch` отслеживает явно объявленные источники и предоставляет старые/новые значения; по умолчанию ленивый.
> `watchEffect` выполняется немедленно и автоматически отслеживает зависимости, используемые внутри callback, но не предоставляет старого значения.
> Используйте `watch` для точности и контроля; используйте `watchEffect` для автоматического сбора зависимостей.

**В: Когда следует использовать каждый?**

> Используйте `watch`, когда вам нужен явный контроль источника, старые значения или опции вроде debounce/deep/immediate.
> Используйте `watchEffect`, когда вам нужен немедленный запуск и автоматическое отслеживание нескольких связанных реактивных значений.

## Справочные материалы

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Руководство по наблюдателям Vue 3](https://vuejs.org/guide/essentials/watchers.html)
