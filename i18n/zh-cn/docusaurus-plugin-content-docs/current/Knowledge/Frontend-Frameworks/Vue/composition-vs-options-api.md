---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> 什么是 Composition API？

Composition API 是 Vue 3 引入的一种新的组件写法，它提供了一种更灵活的方式来组织组件逻辑。与传统的 Options API 不同，Composition API 允许我们将相关的逻辑组织在一起，而不是分散在不同的选项中。

### Options API（传统写法）

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
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
    console.log('Component mounted');
  },
};
</script>
```

### Composition API（新写法）

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 相关的逻辑组织在一起
const firstName = ref('John');
const lastName = ref('Doe');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

const count = ref(0);
const increment = () => {
  count.value++;
};

onMounted(() => {
  console.log('Component mounted');
});
</script>
```

## 2. Composition API vs Options API: Key Differences

> Composition API 与 Options API 的主要差异

### 1. 逻辑组织方式

**Options API**：逻辑分散在不同的选项中

```vue
<script>
export default {
  // 数据分散在各处
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // 计算属性分散
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // 方法分散
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
    // 生命周期分散
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**：相关逻辑组织在一起

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// 用户相关逻辑
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// 文章相关逻辑
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// 评论相关逻辑
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// 生命周期
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. 代码复用

**Options API**：使用 Mixins（容易产生命名冲突）

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
  // 如果有多个 mixin，容易产生命名冲突
};
</script>
```

**Composition API**：使用 Composables（更灵活）

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
// 可以选择性地使用，避免命名冲突
</script>
```

### 3. TypeScript 支持

**Options API**：TypeScript 支持有限

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // 类型推断可能不准确
    };
  },
  methods: {
    increment() {
      this.count++; // this 的类型可能不准确
    },
  },
});
</script>
```

**Composition API**：完整的 TypeScript 支持

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // 明确的类型
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. 比较表

| 特性            | Options API        | Composition API     |
| --------------- | ------------------ | ------------------- |
| 学习曲线        | 较低               | 较高                |
| 逻辑组织        | 分散在不同选项     | 相关逻辑集中        |
| 代码复用        | Mixins（容易冲突） | Composables（灵活） |
| TypeScript 支持 | 有限               | 完整支持            |
| 适用场景        | 简单组件           | 复杂组件、大型项目  |
| 向后兼容        | Vue 2/3 都支持     | Vue 3 专属          |

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：选择 API 风格

请说明在什么情况下应该使用 Composition API，什么情况下使用 Options API？

<details>
<summary>点击查看答案</summary>

**使用 Composition API 的情况**：

1. **复杂组件**：逻辑复杂，需要更好的组织

   ```vue
   <script setup>
   // 多个功能模块，使用 Composition API 更清晰
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **需要代码复用**：多个组件共享逻辑

   ```vue
   <script setup>
   // 使用 composable 函数，易于复用
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **TypeScript 项目**：需要完整的类型支持

   ```vue
   <script setup lang="ts">
   // Composition API 对 TypeScript 支持更好
   const count = ref<number>(0);
   </script>
   ```

4. **大型项目**：需要更好的逻辑组织和维护

**使用 Options API 的情况**：

1. **简单组件**：逻辑简单，不需要复杂组织

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

2. **Vue 2 项目**：需要向后兼容
3. **团队熟悉度**：团队更熟悉 Options API

**建议**：

- 新项目优先使用 Composition API
- 简单组件可以继续使用 Options API
- 复杂组件建议使用 Composition API

</details>

### 题目 2：逻辑组织

请将以下 Options API 的代码改写为 Composition API。

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
<summary>点击查看答案</summary>

**Composition API 写法**：

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">加载中...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 相关的逻辑组织在一起
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

**改进：使用 Composable**：

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

### 题目 3：代码复用

请说明如何使用 Composition API 实现代码复用，并比较与 Mixins 的差异。

<details>
<summary>点击查看答案</summary>

**Mixins 的问题**：

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
  // 问题：
  // 1. 命名冲突：如果两个 mixin 有同名属性
  // 2. 不清楚数据来源：不知道 user 来自哪个 mixin
  // 3. 难以追踪：无法清楚看到所有可用的属性和方法
};
</script>
```

**Composition API 的解决方案**：

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

// 优点：
// 1. 明确的命名：清楚知道数据来源
// 2. 可选择性使用：只使用需要的部分
// 3. 易于追踪：IDE 可以自动补全
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**差异比较**：

| 特性            | Mixins   | Composables |
| --------------- | -------- | ----------- |
| 命名冲突        | 容易发生 | 可以避免    |
| 可追踪性        | 低       | 高          |
| 可选择性        | 无       | 有          |
| TypeScript 支持 | 有限     | 完整        |
| 适用场景        | Vue 2    | Vue 3       |

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```vue
<script setup>
// 1. 使用 <script setup> 语法糖
import { ref, computed } from 'vue';

// 2. 相关逻辑组织在一起
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. 复杂逻辑抽取为 composable
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. 明确的命名
const userName = ref(''); // ✅ 清楚
const u = ref(''); // ❌ 不清楚
</script>
```

### 避免的做法

```vue
<script setup>
// 1. 不要混用 Options API 和 Composition API（除非必要）
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ 混用容易造成混淆
  },
};

// 2. 不要过度抽取 composable
// 简单的逻辑不需要抽取
const count = ref(0); // ✅ 简单，不需要抽取

// 3. 不要在 composable 中直接操作 DOM
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**Composition API 核心概念**：

- 相关逻辑组织在一起
- 使用 composables 实现代码复用
- 更好的 TypeScript 支持
- 适用于复杂组件和大型项目

**选择建议**：

- 新项目：优先使用 Composition API
- 简单组件：可以使用 Options API
- 复杂组件：建议使用 Composition API
- TypeScript 项目：推荐使用 Composition API

### 面试回答示例

**Q: Composition API 和 Options API 的差异是什么？**

> "Composition API 是 Vue 3 引入的新写法，主要差异在于逻辑组织方式。Options API 将逻辑分散在 data、computed、methods 等选项中，而 Composition API 允许将相关逻辑组织在一起。Composition API 的优点包括：1) 更好的逻辑组织，相关代码集中；2) 更容易实现代码复用，使用 composables 而非 mixins；3) 完整的 TypeScript 支持；4) 适用于复杂组件和大型项目。Options API 的优点是学习曲线较低，适合简单组件。两者可以共存，Vue 3 同时支持两种写法。"

**Q: 什么时候应该使用 Composition API？**

> "建议在以下情况使用 Composition API：1) 复杂组件，逻辑复杂需要更好的组织；2) 需要代码复用，多个组件共享逻辑时；3) TypeScript 项目，需要完整的类型支持；4) 大型项目，需要更好的维护性。对于简单组件或团队更熟悉 Options API 的情况，可以继续使用 Options API。Vue 3 同时支持两种写法，可以根据项目需求选择。"

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
