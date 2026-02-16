---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> Composition API とは何か？

Composition API は Vue 3 で導入された新しいコンポーネントの書き方で、コンポーネントロジックをより柔軟に整理できます。従来の Options API とは異なり、関連するロジックを一箇所にまとめることができます。

### Options API（従来の書き方）

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

### Composition API（新しい書き方）

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 関連するロジックをまとめて記述
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

> Composition API と Options API の主な違い

### 1. ロジックの整理方法

**Options API**：ロジックが異なるオプションに分散する

```vue
<script>
export default {
  // データが各所に分散
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // 算出プロパティが分散
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // メソッドが分散
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
    // ライフサイクルが分散
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**：関連ロジックをまとめて記述

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// ユーザー関連ロジック
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// 記事関連ロジック
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// コメント関連ロジック
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// ライフサイクル
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. コードの再利用

**Options API**：Mixins を使用（命名衝突が起こりやすい）

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
  // 複数の mixin がある場合、命名衝突が起こりやすい
};
</script>
```

**Composition API**：Composables を使用（より柔軟）

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
// 必要な部分だけ選択的に使用でき、命名衝突を回避
</script>
```

### 3. TypeScript サポート

**Options API**：TypeScript サポートが限定的

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // 型推論が不正確な場合がある
    };
  },
  methods: {
    increment() {
      this.count++; // this の型が不正確な場合がある
    },
  },
});
</script>
```

**Composition API**：完全な TypeScript サポート

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // 明示的な型指定
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. 比較表

| 特性            | Options API            | Composition API       |
| --------------- | ---------------------- | --------------------- |
| 学習コスト      | 低い                   | 高い                  |
| ロジック整理    | 異なるオプションに分散 | 関連ロジックを集約    |
| コード再利用    | Mixins（衝突しやすい） | Composables（柔軟）   |
| TypeScript 対応 | 限定的                 | 完全サポート          |
| 適用場面        | シンプルなコンポーネント | 複雑なコンポーネント、大規模プロジェクト |
| 後方互換性      | Vue 2/3 両対応         | Vue 3 専用            |

## 4. Common Interview Questions

> よくある面接質問

### 問題 1：API スタイルの選択

どのような場合に Composition API を使い、どのような場合に Options API を使うべきか説明してください。

<details>
<summary>回答を表示</summary>

**Composition API を使う場合**：

1. **複雑なコンポーネント**：ロジックが複雑で、より良い整理が必要

   ```vue
   <script setup>
   // 複数の機能モジュール、Composition API のほうが明確
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **コード再利用が必要**：複数のコンポーネントでロジックを共有

   ```vue
   <script setup>
   // composable 関数で再利用が容易
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **TypeScript プロジェクト**：完全な型サポートが必要

   ```vue
   <script setup lang="ts">
   // Composition API は TypeScript サポートが優れている
   const count = ref<number>(0);
   </script>
   ```

4. **大規模プロジェクト**：より良いロジック整理と保守性が必要

**Options API を使う場合**：

1. **シンプルなコンポーネント**：ロジックがシンプルで複雑な整理が不要

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

2. **Vue 2 プロジェクト**：後方互換性が必要
3. **チームの習熟度**：チームが Options API に慣れている

**推奨**：

- 新規プロジェクトは Composition API を優先
- シンプルなコンポーネントは Options API を継続使用可
- 複雑なコンポーネントは Composition API を推奨

</details>

### 問題 2：ロジック整理

以下の Options API のコードを Composition API に書き換えてください。

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
<summary>回答を表示</summary>

**Composition API の書き方**：

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">読み込み中...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 関連ロジックをまとめて記述
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

**改善：Composable を使用**：

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

### 問題 3：コード再利用

Composition API を使ったコード再利用の方法を説明し、Mixins との違いを比較してください。

<details>
<summary>回答を表示</summary>

**Mixins の問題点**：

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
  // 問題点：
  // 1. 命名衝突：2つの mixin に同名プロパティがある場合
  // 2. データの出所が不明：user がどの mixin から来たかわからない
  // 3. 追跡困難：利用可能なプロパティやメソッドの全体が見えない
};
</script>
```

**Composition API の解決策**：

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

// メリット：
// 1. 明確な命名：データの出所が明確
// 2. 選択的に使用：必要な部分だけ使用
// 3. 追跡が容易：IDE の自動補完が効く
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**違いの比較**：

| 特性            | Mixins       | Composables |
| --------------- | ------------ | ----------- |
| 命名衝突        | 起こりやすい | 回避可能    |
| 追跡性          | 低い         | 高い        |
| 選択性          | なし         | あり        |
| TypeScript 対応 | 限定的       | 完全        |
| 適用場面        | Vue 2        | Vue 3       |

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨事項

```vue
<script setup>
// 1. <script setup> シンタックスシュガーを使用
import { ref, computed } from 'vue';

// 2. 関連ロジックをまとめて記述
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. 複雑なロジックは composable に抽出
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. 明確な命名
const userName = ref(''); // ✅ 明確
const u = ref(''); // ❌ 不明確
</script>
```

### 避けるべき事項

```vue
<script setup>
// 1. Options API と Composition API を混在させない（必要な場合を除く）
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ 混在は混乱を招く
  },
};

// 2. composable を過度に抽出しない
// シンプルなロジックは抽出不要
const count = ref(0); // ✅ シンプル、抽出不要

// 3. composable 内で直接 DOM を操作しない
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Interview Summary

> 面接まとめ

### クイックメモ

**Composition API の核心概念**：

- 関連ロジックをまとめて記述
- composables でコード再利用を実現
- より優れた TypeScript サポート
- 複雑なコンポーネントや大規模プロジェクトに適している

**選択ガイド**：

- 新規プロジェクト：Composition API を優先
- シンプルなコンポーネント：Options API でも可
- 複雑なコンポーネント：Composition API を推奨
- TypeScript プロジェクト：Composition API を推奨

### 面接回答例

**Q: Composition API と Options API の違いは？**

> 「Composition API は Vue 3 で導入された新しい書き方で、主な違いはロジックの整理方法です。Options API はロジックを data、computed、methods などのオプションに分散させますが、Composition API は関連するロジックをまとめて記述できます。Composition API のメリットは：1) より良いロジック整理、関連コードの集約；2) composables による容易なコード再利用（mixins の代替）；3) 完全な TypeScript サポート；4) 複雑なコンポーネントや大規模プロジェクトへの適性です。Options API のメリットは学習コストが低く、シンプルなコンポーネントに適していることです。両者は共存でき、Vue 3 は両方の書き方をサポートしています。」

**Q: いつ Composition API を使うべきか？**

> 「以下の場合に Composition API の使用を推奨します：1) 複雑なコンポーネントで、ロジック整理を改善したい場合；2) コード再利用が必要で、複数コンポーネントでロジックを共有する場合；3) TypeScript プロジェクトで完全な型サポートが必要な場合；4) 大規模プロジェクトでより良い保守性が必要な場合。シンプルなコンポーネントやチームが Options API に慣れている場合は、Options API を引き続き使用できます。Vue 3 は両方の書き方をサポートしているため、プロジェクトの要件に応じて選択できます。」

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
