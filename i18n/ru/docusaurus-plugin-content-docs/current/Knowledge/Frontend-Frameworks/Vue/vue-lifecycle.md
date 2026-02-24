---
id: vue-lifecycle
title: '[Medium] 📄 Хуки жизненного цикла Vue'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Объясните хуки жизненного цикла Vue (включая Vue 2 и Vue 3)

> Объясните хуки жизненного цикла Vue как в Vue 2, так и в Vue 3.

Компонент Vue проходит через фазы от создания до размонтирования.
Хуки жизненного цикла — это обратные вызовы фреймворка, срабатывающие на каждой фазе.

### Временная шкала жизненного цикла

```text
Создание -> Монтирование -> Обновление -> Размонтирование
   ↓           ↓           ↓           ↓
Created     Mounted     Updated    Unmounted
```

### Соответствие Vue 2 и Vue 3

| Vue 2 (Options) | Vue 3 (Options) | Vue 3 (Composition) | Значение |
| --- | --- | --- | --- |
| `beforeCreate` | `beforeCreate` | `setup()` | до полной инициализации экземпляра |
| `created` | `created` | `setup()` | состояние экземпляра готово |
| `beforeMount` | `beforeMount` | `onBeforeMount` | перед первым монтированием DOM |
| `mounted` | `mounted` | `onMounted` | после первого монтирования DOM |
| `beforeUpdate` | `beforeUpdate` | `onBeforeUpdate` | перед применением реактивного обновления |
| `updated` | `updated` | `onUpdated` | после обновления DOM |
| `beforeDestroy` | `beforeUnmount` | `onBeforeUnmount` | перед разрушением компонента |
| `destroyed` | `unmounted` | `onUnmounted` | после разрушения |
| `activated` | `activated` | `onActivated` | KeepAlive активирован |
| `deactivated` | `deactivated` | `onDeactivated` | KeepAlive деактивирован |
| `errorCaptured` | `errorCaptured` | `onErrorCaptured` | перехват ошибок потомков |

### 1) Фаза создания

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // data/methods ещё не инициализированы
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // API состояния доступны, но DOM ещё не смонтирован
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined

    // подходящее место для API-запросов
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Типичное использование**:

- `created`: API-запросы, инициализация без DOM
- Избегайте операций с DOM здесь

### 2) Фаза монтирования

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return { title: 'Жизненный цикл Vue' };
  },

  beforeMount() {
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    console.log(this.$refs.myElement); // доступен

    // Настройка, зависящая от DOM
    this.initCanvas();
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // рисование...
    },
    initChart() {
      // инициализация сторонней библиотеки DOM
    },
  },
};
</script>
```

**Типичное использование**:

- Операции с DOM
- Сторонние UI/графические библиотеки
- Подключение слушателей DOM

### 3) Фаза обновления

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Счётчик: {{ count }}</p>
    <button @click="count++">Увеличить</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 };
  },

  beforeUpdate() {
    // данные изменились, DOM ещё не обновлён
  },

  updated() {
    // DOM обновлён
    // избегайте мутаций реактивного состояния здесь во избежание циклов
  },
};
</script>
```

**Типичное использование**:

- Измерения/перепозиционирование после обновления DOM
- Избегайте реактивных мутаций непосредственно в `updated`

### 4) Фаза размонтирования

#### `beforeUnmount` / `unmounted` (Vue 3)
#### `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    this.timer = setInterval(() => {}, 1000);
    this.ws = new WebSocket('ws://example.com');
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    if (this.timer) clearInterval(this.timer);
    if (this.ws) this.ws.close();
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {},
  },
};
</script>
```

**Типичное использование**:

- Очистка таймеров
- Удаление слушателей
- Закрытие сокетов/подписок
- Уничтожение сторонних экземпляров

### 5) Особый случай: KeepAlive

`<KeepAlive>` кеширует экземпляры компонентов вместо их уничтожения при переключении.

#### Зачем это использовать

1. Сохранение локального состояния (ввод формы, положение прокрутки)
2. Избежание повторной инициализации/API-вызовов
3. Улучшение UX при переключении вкладок/страниц

#### Пример

```vue
<template>
  <KeepAlive include="UserList,ProductList" :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

### 6) Специальные хуки жизненного цикла

#### `activated` / `deactivated` (с KeepAlive)

```vue
<script>
export default {
  mounted() {
    console.log('смонтирован один раз');
  },
  activated() {
    // вызывается каждый раз, когда компонент становится активным из кеша
    this.refreshData();
  },
  deactivated() {
    // вызывается каждый раз, когда компонент кешируется/деактивируется
    this.pauseTasks();
  },
  methods: {
    refreshData() {},
    pauseTasks() {},
  },
};
</script>
```

#### `errorCaptured`

```vue
<script>
export default {
  errorCaptured(err, instance, info) {
    console.error('перехвачена ошибка дочернего компонента:', err, info);
    return false; // при необходимости остановить дальнейшее распространение
  },
};
</script>
```

### Жизненный цикл Vue 3 Composition API

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() действует как логика фазы beforeCreate + created

onBeforeMount(() => {});
onMounted(() => {});
onBeforeUpdate(() => {});
onUpdated(() => {});
onBeforeUnmount(() => {});
onUnmounted(() => {});
onActivated(() => {});
onDeactivated(() => {});
onErrorCaptured((err, instance, info) => {
  return false;
});
</script>
```

## 2. Каков порядок выполнения хуков жизненного цикла родительского и дочернего компонентов?

> Каков порядок выполнения жизненного цикла для родительского и дочернего компонентов?

### Порядок монтирования

```text
Родитель beforeCreate
→ Родитель created
→ Родитель beforeMount
→ Дочерний beforeCreate
→ Дочерний created
→ Дочерний beforeMount
→ Дочерний mounted
→ Родитель mounted
```

Мнемоника: **создание начинается снаружи внутрь, монтирование завершается изнутри наружу**.

### Конкретный пример

```vue
<!-- ParentComponent.vue -->
<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
  beforeCreate() { console.log('1. родитель beforeCreate'); },
  created() { console.log('2. родитель created'); },
  beforeMount() { console.log('3. родитель beforeMount'); },
  mounted() { console.log('8. родитель mounted'); },
  beforeUnmount() { console.log('9. родитель beforeUnmount'); },
  unmounted() { console.log('12. родитель unmounted'); },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  beforeCreate() { console.log('4. дочерний beforeCreate'); },
  created() { console.log('5. дочерний created'); },
  beforeMount() { console.log('6. дочерний beforeMount'); },
  mounted() { console.log('7. дочерний mounted'); },
  beforeUnmount() { console.log('10. дочерний beforeUnmount'); },
  unmounted() { console.log('11. дочерний unmounted'); },
};
</script>
```

### Порядок обновления

Если реактивные данные родителя, влияющие на дочерний компонент, изменяются:

```text
Родитель beforeUpdate
→ Дочерний beforeUpdate
→ Дочерний updated
→ Родитель updated
```

Если изменяется только локальное состояние дочернего компонента, хуки обновления родителя не срабатывают.

### Порядок размонтирования

```text
Родитель beforeUnmount
→ Дочерний beforeUnmount
→ Дочерний unmounted
→ Родитель unmounted
```

### Почему такой порядок

- Монтирование выполняется в глубину: рендер родителя обнаруживает дочерние компоненты, дочерние завершают монтирование первыми
- Размонтирование сначала уведомляет родителя, затем разрушает дочерние, затем завершает родителя

### Практические последствия

1. Доступ к дочерним refs безопасен в родительском `mounted`, но не в `created`
2. Дочерний `mounted` может выполниться до родительского `mounted`
3. Для координации готовности родителя и дочернего используйте события/props или `nextTick`

### Частые ошибки

1. Обращение к `this.$refs.child` в родительском `created`
2. Предположение, что родитель уже полностью смонтирован, когда выполняется дочерний `mounted`

## 3. Когда следует использовать каждый хук жизненного цикла?

> Когда должен использоваться каждый хук жизненного цикла?

### Краткая таблица использования

| Хук | Типичное использование | Доступность DOM |
| --- | --- | --- |
| `created` / `setup` | API-запрос, инициализация состояния | Нет |
| `mounted` / `onMounted` | Работа с DOM, инициализация сторонних библиотек | Да |
| `updated` / `onUpdated` | Синхронизация DOM после обновления | Да (обновлён) |
| `unmounted` / `onUnmounted` | Очистка ресурсов | Фаза разрушения |
| `activated` | Повторный вход в кешированный вид | Да |

### Практические примеры

#### 1) `created`: загрузка данных API

```vue
<script>
export default {
  data() {
    return { users: [], loading: true, error: null };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2) `mounted`: инициализация сторонней библиотеки

```vue
<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return { chartInstance: null };
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.chartInstance.setOption({
      title: { text: 'Продажи' },
      xAxis: { data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'] },
      yAxis: {},
      series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
    });
  },
  unmounted() {
    if (this.chartInstance) this.chartInstance.dispose();
  },
};
</script>
```

#### 3) `unmounted`: очистка ресурсов

```vue
<script>
export default {
  data() {
    return { intervalId: null, observer: null };
  },
  mounted() {
    this.intervalId = setInterval(() => {}, 1000);
    this.observer = new IntersectionObserver(() => {});
    this.observer.observe(this.$el);
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {},
  },
};
</script>
```

### Мнемоника

1. `created`: состояние готово, DOM не готов
2. `mounted`: DOM готов
3. `updated`: DOM обновлён
4. `unmounted`: очищаем всё

## Справочные материалы

- [Хуки жизненного цикла Vue 3](https://vuejs.org/api/composition-api-lifecycle.html)
- [Диаграмма жизненного цикла Vue 2](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Руководство по жизненному циклу Vue 3](https://vuejs.org/guide/essentials/lifecycle.html)
