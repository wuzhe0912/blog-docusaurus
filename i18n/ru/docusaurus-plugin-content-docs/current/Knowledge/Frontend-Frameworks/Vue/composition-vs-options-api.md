---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. Что такое Composition API?

> Что такое Composition API?

Composition API — это стиль написания компонентов Vue 3, предоставляющий более гибкий способ организации логики.
В отличие от Options API, который разделяет логику по типам опций (`data`, `methods`, `computed` и т.д.), Composition API группирует связанную логику вместе.

### Options API (традиционный стиль)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Счётчик: {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
      count: 0,
    };
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
  methods: {
    increment() {
      this.count++;
    },
  },
  mounted() {
    console.log('Компонент смонтирован');
  },
};
</script>
```

### Composition API (новый стиль)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Счётчик: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// связанная логика сгруппирована вместе
const firstName = ref('John');
const lastName = ref('Doe');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

const count = ref(0);
const increment = () => {
  count.value++;
};

onMounted(() => {
  console.log('Компонент смонтирован');
});
</script>
```

## 2. Composition API vs Options API: ключевые различия

> Основные различия между Composition API и Options API

### 1. Организация логики

**Options API**: логика разделена по блокам опций.

```vue
<script>
export default {
  // состояние распределено между опциями
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // computed находится в другой секции
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // поведение в ещё одной секции
    fetchUser() {
      /* ... */
    },
    fetchPosts() {
      /* ... */
    },
    fetchComments() {
      /* ... */
    },
  },
  mounted() {
    // lifecycle в отдельной секции
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: связанная логика размещена рядом.

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// логика пользователя
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// логика постов
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// логика комментариев
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// lifecycle
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. Переиспользование кода

**Options API**: обычно используются Mixins (могут вызывать конфликты имён).

```vue
<script>
// UserMixin.js
export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    fetchUser() {
      // ...
    },
  },
};

// Component.vue
import UserMixin from './UserMixin';
export default {
  mixins: [UserMixin],
  // несколько mixins могут привести к конфликтам имён
};
</script>
```

**Composition API**: используются Composables (более явные и гибкие).

```vue
<script setup>
// useUser.js
import { ref } from 'vue';

export function useUser() {
  const user = ref(null);
  const fetchUser = async () => {
    // ...
  };
  return { user, fetchUser };
}

// Component.vue
import { useUser } from './useUser';
const { user, fetchUser } = useUser();
// выборочное использование, без неявных конфликтов
</script>
```

### 3. Поддержка TypeScript

**Options API**: поддержка TS работает, но менее удобна в некоторых сценариях с `this`.

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // вывод типов может быть менее прямым в крупных компонентах
    };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
});
</script>
```

**Composition API**: строгая, явная типизация.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0);
const increment = (): void => {
  count.value++;
};
</script>
```

### Сравнительная таблица

| Характеристика | Options API | Composition API |
| --- | --- | --- |
| Кривая обучения | Ниже | Выше |
| Организация логики | Разделение по блокам опций | Группировка по функционалу/домену |
| Переиспользование кода | Mixins (риск конфликтов) | Composables (гибко) |
| Поддержка TypeScript | Ограниченная эргономика в некоторых случаях | Сильная поддержка |
| Лучше подходит | Простые компоненты | Сложные компоненты / крупные проекты |
| Обратная совместимость | Vue 2 и Vue 3 | Vue 3 |

## 4. Частые вопросы на собеседованиях

> Частые вопросы на собеседованиях

### Вопрос 1: Выбор стиля API

Когда следует использовать Composition API, а когда Options API?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Используйте Composition API, когда:**

1. **Сложным компонентам** нужна более чёткая группировка логики.

   ```vue
   <script setup>
   // несколько функциональных модулей легче компоновать
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Переиспользование кода** важно во многих компонентах.

   ```vue
   <script setup>
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Проекты с активным использованием TypeScript** требуют явной типизации.

   ```vue
   <script setup lang="ts">
   const count = ref<number>(0);
   </script>
   ```

4. **Крупные кодовые базы** требуют поддерживаемой структуры логики.

**Используйте Options API, когда:**

1. **Простые компоненты** с прямолинейным поведением.

   ```vue
   <script>
   export default {
     data() {
       return { count: 0 };
     },
     methods: {
       increment() {
         this.count++;
       },
     },
   };
   </script>
   ```

2. Требуется **совместимость с Vue 2**.
3. Команда значительно лучше знакома с Options API.

**Рекомендация:**

- Новые проекты: предпочтительно Composition API
- Простые компоненты: Options API по-прежнему уместен
- Сложные компоненты: Composition API обычно лучше

</details>

### Вопрос 2: Организация логики

Перепишите этот Options API компонент с использованием Composition API.

```vue
<script>
export default {
  data() {
    return {
      searchQuery: '',
      results: [],
      isLoading: false,
    };
  },
  computed: {
    filteredResults() {
      return this.results.filter((item) =>
        item.name.includes(this.searchQuery)
      );
    },
  },
  watch: {
    searchQuery(newQuery) {
      if (newQuery.length > 2) {
        this.search();
      }
    },
  },
  methods: {
    async search() {
      this.isLoading = true;
      try {
        const response = await fetch(`/api/search?q=${this.searchQuery}`);
        this.results = await response.json();
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.search();
  },
};
</script>
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Версия на Composition API:**

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Загрузка...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// связанная логика сгруппирована вместе
const searchQuery = ref('');
const results = ref([]);
const isLoading = ref(false);

const filteredResults = computed(() => {
  return results.value.filter((item) => item.name.includes(searchQuery.value));
});

const search = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(`/api/search?q=${searchQuery.value}`);
    results.value = await response.json();
  } finally {
    isLoading.value = false;
  }
};

watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    search();
  }
});

onMounted(() => {
  search();
});
</script>
```

**Дальнейшее улучшение (вынос в composable):**

```vue
<script setup>
import { useSearch } from './composables/useSearch';

const { searchQuery, filteredResults, isLoading, search } = useSearch();
</script>
```

```javascript
// composables/useSearch.js
import { ref, computed, watch, onMounted } from 'vue';

export function useSearch() {
  const searchQuery = ref('');
  const results = ref([]);
  const isLoading = ref(false);

  const filteredResults = computed(() => {
    return results.value.filter((item) =>
      item.name.includes(searchQuery.value)
    );
  });

  const search = async () => {
    isLoading.value = true;
    try {
      const response = await fetch(`/api/search?q=${searchQuery.value}`);
      results.value = await response.json();
    } finally {
      isLoading.value = false;
    }
  };

  watch(searchQuery, (newQuery) => {
    if (newQuery.length > 2) {
      search();
    }
  });

  onMounted(() => {
    search();
  });

  return {
    searchQuery,
    filteredResults,
    isLoading,
    search,
  };
}
```

</details>

### Вопрос 3: Переиспользование кода

Как использовать Composition API для переиспользования и чем это отличается от Mixins?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Проблемы Mixins:**

```vue
<script>
// UserMixin.js
export default {
  data() {
    return {
      user: null,
    };
  },
  methods: {
    fetchUser() {
      // ...
    },
  },
};

// PostMixin.js
export default {
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    fetchPosts() {
      // ...
    },
  },
};

// Component.vue
import UserMixin from './UserMixin';
import PostMixin from './PostMixin';

export default {
  mixins: [UserMixin, PostMixin],
  // проблемы:
  // 1) конфликты имён
  // 2) неочевидный источник полей/методов
  // 3) сложнее отслеживание/автодополнение
};
</script>
```

**Решение через Composition API:**

```vue
<script setup>
// composables/useUser.js
import { ref } from 'vue';

export function useUser() {
  const user = ref(null);
  const fetchUser = async () => {
    // ...
  };
  return { user, fetchUser };
}

// composables/usePosts.js
import { ref } from 'vue';

export function usePosts() {
  const posts = ref([]);
  const fetchPosts = async () => {
    // ...
  };
  return { posts, fetchPosts };
}

// Component.vue
import { useUser } from './composables/useUser';
import { usePosts } from './composables/usePosts';

// преимущества:
// 1) явные имена и источник
// 2) выборочное использование
// 3) лучшая поддержка IDE и отслеживание
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Сравнение:**

| Характеристика | Mixins | Composables |
| --- | --- | --- |
| Конфликт имён | Легко возникает | Можно избежать |
| Отслеживаемость | Ниже | Выше |
| Выборочное использование | Нет | Да |
| Поддержка TypeScript | Ограниченная | Сильная |
| Лучше подходит | Устаревшее переиспользование Vue 2 | Переиспользование Vue 3 |

</details>

## 5. Лучшие практики

> Лучшие практики

### Рекомендуется

```vue
<script setup>
// 1. Предпочитайте <script setup>
import { ref, computed } from 'vue';

// 2. Группируйте связанную логику вместе
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Выносите сложную логику в composables
import { useCounter } from './composables/useCounter';
const { count: c2, increment: inc2 } = useCounter();

// 4. Используйте понятные имена
const userName = ref(''); // понятно
const u = ref(''); // непонятно
</script>
```

### Избегайте

```vue
<script setup>
// 1. Не смешивайте Options API и Composition API без веской причины
export default {
  setup() {
    // ...
  },
  data() {
    // смешение стилей может затруднить поддержку
  },
};

// 2. Не извлекайте composables чрезмерно
const count = ref(0); // простую логику можно оставить локально

// 3. Не манипулируйте DOM напрямую внутри composables
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // плохо
  return { count };
}
</script>
```

## 6. Итоги для собеседования

> Итоги для собеседования

### Быстрое запоминание

**Ключевые моменты Composition API:**

- Группировка связанной логики вместе
- Переиспользование через composables
- Лучшая поддержка TypeScript
- Лучше подходит для сложных/крупных проектов

**Руководство по выбору:**

- Новые проекты: предпочтительно Composition API
- Простые компоненты: Options API по-прежнему уместен
- Сложные компоненты: рекомендуется Composition API
- Проекты на TypeScript: Composition API обычно лучше

### Примеры ответов на собеседовании

**В: В чём разница между Composition API и Options API?**

> Composition API (появился в Vue 3) меняет способ организации логики.
> Options API разделяет логику по блокам опций (`data`, `computed`, `methods`), а Composition API группирует связанную логику по функционалу.
> Основные преимущества: лучшая организация для сложных компонентов, лучшее переиспользование через composables и более удобная работа с TypeScript.
> Options API имеет более низкий порог входа и хорошо подходит для простых компонентов.

**В: Когда следует использовать Composition API?**

> Используйте его для сложных компонентов, общей переиспользуемой логики, проектов с активным использованием TypeScript и крупных кодовых баз.
> Для простых компонентов или команд, хорошо знакомых с Options API, Options API остаётся допустимым выбором.

## Справочные материалы

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Руководство по миграции на Vue 3](https://v3-migration.vuejs.org/)
