---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> What is Composition API?

Composition API is a Vue 3 component authoring style that provides a more flexible way to organize logic.
Unlike Options API, which splits logic by option type (`data`, `methods`, `computed`, etc.), Composition API groups related logic together.

### Options API (traditional style)

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

### Composition API (new style)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// related logic grouped together
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

> Main differences between Composition API and Options API

### 1. Logic organization

**Options API**: logic is split across option blocks.

```vue
<script>
export default {
  // state is spread across options
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // computed is in a different section
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // behavior is in another section
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
    // lifecycle is in another section
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: related logic is colocated.

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// user logic
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// post logic
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// comment logic
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

### 2. Code reuse

**Options API**: commonly uses Mixins (can cause naming collisions).

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
  // multiple mixins can lead to name collisions
};
</script>
```

**Composition API**: uses Composables (more explicit and flexible).

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
// selective usage, avoids implicit collisions
</script>
```

### 3. TypeScript support

**Options API**: TS support is usable but less ergonomic in some `this` scenarios.

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // inference can be less direct in larger components
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

**Composition API**: strong, explicit typing.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0);
const increment = (): void => {
  count.value++;
};
</script>
```

### Comparison table

| Feature | Options API | Composition API |
| --- | --- | --- |
| Learning curve | Lower | Higher |
| Logic organization | Split by option blocks | Grouped by feature/domain |
| Code reuse | Mixins (collision risk) | Composables (flexible) |
| TypeScript support | Limited ergonomics in some cases | Strong support |
| Best fit | Simple components | Complex components / large projects |
| Backward compatibility | Vue 2 and Vue 3 | Vue 3 |

## 4. Common Interview Questions

> Common interview questions

### Question 1: Choosing API style

When should you use Composition API, and when should you use Options API?

<details>
<summary>Click to view answer</summary>

**Use Composition API when:**

1. **Complex components** need clearer logic grouping.

   ```vue
   <script setup>
   // multiple feature modules are easier to compose
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Code reuse** is important across many components.

   ```vue
   <script setup>
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **TypeScript-heavy projects** need explicit typing.

   ```vue
   <script setup lang="ts">
   const count = ref<number>(0);
   </script>
   ```

4. **Large codebases** require maintainable logic structure.

**Use Options API when:**

1. **Simple components** with straightforward behavior.

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

2. **Vue 2 compatibility** is required.
3. Team is significantly more familiar with Options API.

**Recommendation:**

- New projects: prefer Composition API
- Simple components: Options API remains fine
- Complex components: Composition API is usually better

</details>

### Question 2: Logic organization

Rewrite this Options API component with Composition API.

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
<summary>Click to view answer</summary>

**Composition API version:**

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Loading...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// related logic grouped together
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

**Further improvement (extract to composable):**

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

### Question 3: Code reuse

How do you use Composition API for reuse, and how is it different from Mixins?

<details>
<summary>Click to view answer</summary>

**Problems with Mixins:**

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
  // problems:
  // 1) naming conflicts
  // 2) unclear source of fields/methods
  // 3) harder tracing/autocomplete
};
</script>
```

**Composition API solution:**

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

// benefits:
// 1) explicit naming and source
// 2) selective usage
// 3) better IDE support and tracing
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Comparison:**

| Feature | Mixins | Composables |
| --- | --- | --- |
| Naming collision | Easy to happen | Avoidable |
| Traceability | Lower | Higher |
| Selective usage | No | Yes |
| TypeScript support | Limited | Strong |
| Best fit | Vue 2 legacy reuse | Vue 3 reuse |

</details>

## 5. Best Practices

> Best practices

### Recommended

```vue
<script setup>
// 1. Prefer <script setup>
import { ref, computed } from 'vue';

// 2. Group related logic together
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Extract complex logic into composables
import { useCounter } from './composables/useCounter';
const { count: c2, increment: inc2 } = useCounter();

// 4. Use explicit names
const userName = ref(''); // ✅ clear
const u = ref(''); // ❌ unclear
</script>
```

### Avoid

```vue
<script setup>
// 1. Avoid mixing Options API and Composition API without clear reason
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ mixing styles may confuse maintenance
  },
};

// 2. Avoid over-extracting composables
const count = ref(0); // simple logic can stay local

// 3. Avoid direct DOM manipulation inside composables
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Interview Summary

> Interview summary

### Quick memory

**Composition API core points:**

- Group related logic together
- Reuse with composables
- Better TypeScript support
- Better fit for complex/large projects

**Selection guide:**

- New projects: prefer Composition API
- Simple components: Options API is still fine
- Complex components: Composition API is recommended
- TypeScript projects: Composition API is typically better

### Sample interview answers

**Q: What is the difference between Composition API and Options API?**

> Composition API (introduced in Vue 3) changes how logic is organized.
> Options API splits logic by option blocks (`data`, `computed`, `methods`), while Composition API groups related logic by feature.
> Main benefits: better organization for complex components, better reuse with composables, and stronger TypeScript ergonomics.
> Options API has a lower learning curve and works well for simple components.

**Q: When should I use Composition API?**

> Use it for complex components, shared reusable logic, TypeScript-heavy projects, and large codebases.
> For simple components or teams heavily familiar with Options API, Options API remains valid.

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
