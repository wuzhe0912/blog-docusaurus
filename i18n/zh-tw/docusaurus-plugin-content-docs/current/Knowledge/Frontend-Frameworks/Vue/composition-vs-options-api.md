---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> 什麼是 Composition API？

Composition API 是 Vue 3 引入的一種新的組件寫法，它提供了一種更靈活的方式來組織組件邏輯。與傳統的 Options API 不同，Composition API 允許我們將相關的邏輯組織在一起，而不是分散在不同的選項中。

### Options API（傳統寫法）

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

### Composition API（新寫法）

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 相關的邏輯組織在一起
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

> Composition API 與 Options API 的主要差異

### 1. 邏輯組織方式

**Options API**：邏輯分散在不同的選項中

```vue
<script>
export default {
  // 資料分散在各處
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // 計算屬性分散
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
    // 生命週期分散
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**：相關邏輯組織在一起

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// 使用者相關邏輯
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// 文章相關邏輯
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// 評論相關邏輯
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// 生命週期
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. 程式碼重用

**Options API**：使用 Mixins（容易產生命名衝突）

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
  // 如果有多個 mixin，容易產生命名衝突
};
</script>
```

**Composition API**：使用 Composables（更靈活）

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
// 可以選擇性地使用，避免命名衝突
</script>
```

### 3. TypeScript 支援

**Options API**：TypeScript 支援有限

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // 型別推斷可能不準確
    };
  },
  methods: {
    increment() {
      this.count++; // this 的型別可能不準確
    },
  },
});
</script>
```

**Composition API**：完整的 TypeScript 支援

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // 明確的型別
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. 比較表

| 特性            | Options API        | Composition API     |
| --------------- | ------------------ | ------------------- |
| 學習曲線        | 較低               | 較高                |
| 邏輯組織        | 分散在不同選項     | 相關邏輯集中        |
| 程式碼重用      | Mixins（容易衝突） | Composables（靈活） |
| TypeScript 支援 | 有限               | 完整支援            |
| 適用場景        | 簡單組件           | 複雜組件、大型專案  |
| 向後相容        | Vue 2/3 都支援     | Vue 3 專屬          |

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：選擇 API 風格

請說明在什麼情況下應該使用 Composition API，什麼情況下使用 Options API？

<details>
<summary>點擊查看答案</summary>

**使用 Composition API 的情況**：

1. **複雜組件**：邏輯複雜，需要更好的組織

   ```vue
   <script setup>
   // 多個功能模組，使用 Composition API 更清晰
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **需要程式碼重用**：多個組件共享邏輯

   ```vue
   <script setup>
   // 使用 composable 函式，易於重用
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **TypeScript 專案**：需要完整的型別支援

   ```vue
   <script setup lang="ts">
   // Composition API 對 TypeScript 支援更好
   const count = ref<number>(0);
   </script>
   ```

4. **大型專案**：需要更好的邏輯組織和維護

**使用 Options API 的情況**：

1. **簡單組件**：邏輯簡單，不需要複雜組織

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

2. **Vue 2 專案**：需要向後相容
3. **團隊熟悉度**：團隊更熟悉 Options API

**建議**：

- 新專案優先使用 Composition API
- 簡單組件可以繼續使用 Options API
- 複雜組件建議使用 Composition API

</details>

### 題目 2：邏輯組織

請將以下 Options API 的程式碼改寫為 Composition API。

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
<summary>點擊查看答案</summary>

**Composition API 寫法**：

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">載入中...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 相關的邏輯組織在一起
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

**改進：使用 Composable**：

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

### 題目 3：程式碼重用

請說明如何使用 Composition API 實現程式碼重用，並比較與 Mixins 的差異。

<details>
<summary>點擊查看答案</summary>

**Mixins 的問題**：

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
  // 問題：
  // 1. 命名衝突：如果兩個 mixin 有同名屬性
  // 2. 不清楚資料來源：不知道 user 來自哪個 mixin
  // 3. 難以追蹤：無法清楚看到所有可用的屬性和方法
};
</script>
```

**Composition API 的解決方案**：

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

// 優點：
// 1. 明確的命名：清楚知道資料來源
// 2. 可選擇性使用：只使用需要的部分
// 3. 易於追蹤：IDE 可以自動完成
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**差異比較**：

| 特性            | Mixins   | Composables |
| --------------- | -------- | ----------- |
| 命名衝突        | 容易發生 | 可以避免    |
| 可追蹤性        | 低       | 高          |
| 可選擇性        | 無       | 有          |
| TypeScript 支援 | 有限     | 完整        |
| 適用場景        | Vue 2    | Vue 3       |

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```vue
<script setup>
// 1. 使用 <script setup> 語法糖
import { ref, computed } from 'vue';

// 2. 相關邏輯組織在一起
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. 複雜邏輯抽取為 composable
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. 明確的命名
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

// 2. 不要過度抽取 composable
// 簡單的邏輯不需要抽取
const count = ref(0); // ✅ 簡單，不需要抽取

// 3. 不要在 composable 中直接操作 DOM
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**Composition API 核心概念**：

- 相關邏輯組織在一起
- 使用 composables 實現程式碼重用
- 更好的 TypeScript 支援
- 適用於複雜組件和大型專案

**選擇建議**：

- 新專案：優先使用 Composition API
- 簡單組件：可以使用 Options API
- 複雜組件：建議使用 Composition API
- TypeScript 專案：推薦使用 Composition API

### 面試回答範例

**Q: Composition API 和 Options API 的差異是什麼？**

> "Composition API 是 Vue 3 引入的新寫法，主要差異在於邏輯組織方式。Options API 將邏輯分散在 data、computed、methods 等選項中，而 Composition API 允許將相關邏輯組織在一起。Composition API 的優點包括：1) 更好的邏輯組織，相關程式碼集中；2) 更容易實現程式碼重用，使用 composables 而非 mixins；3) 完整的 TypeScript 支援；4) 適用於複雜組件和大型專案。Options API 的優點是學習曲線較低，適合簡單組件。兩者可以共存，Vue 3 同時支援兩種寫法。"

**Q: 什麼時候應該使用 Composition API？**

> "建議在以下情況使用 Composition API：1) 複雜組件，邏輯複雜需要更好的組織；2) 需要程式碼重用，多個組件共享邏輯時；3) TypeScript 專案，需要完整的型別支援；4) 大型專案，需要更好的維護性。對於簡單組件或團隊更熟悉 Options API 的情況，可以繼續使用 Options API。Vue 3 同時支援兩種寫法，可以根據專案需求選擇。"

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
