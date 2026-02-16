---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> Composition API là gì?

Composition API là cách viết component mới được giới thiệu trong Vue 3, cung cấp một cách linh hoạt hơn để tổ chức logic của component. Khác với Options API truyền thống, Composition API cho phép nhóm các logic liên quan lại với nhau thay vì phân tán chúng trong các tùy chọn khác nhau.

### Options API (Cách viết truyền thống)

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

### Composition API (Cách viết mới)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Logic liên quan được nhóm lại với nhau
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

> Sự khác biệt chính giữa Composition API và Options API

### 1. Cách tổ chức logic

**Options API**: Logic phân tán trong các tùy chọn khác nhau

```vue
<script>
export default {
  // Dữ liệu phân tán khắp nơi
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // Thuộc tính tính toán phân tán
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // Phương thức phân tán
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
    // Vòng đời phân tán
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: Logic liên quan được nhóm lại

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Logic liên quan đến người dùng
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// Logic liên quan đến bài viết
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// Logic liên quan đến bình luận
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// Vòng đời
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. Tái sử dụng mã

**Options API**: Sử dụng Mixins (dễ xảy ra xung đột tên)

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
  // Nếu có nhiều mixin, dễ xảy ra xung đột tên
};
</script>
```

**Composition API**: Sử dụng Composables (linh hoạt hơn)

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
// Có thể chọn sử dụng, tránh xung đột tên
</script>
```

### 3. Hỗ trợ TypeScript

**Options API**: Hỗ trợ TypeScript hạn chế

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // Suy luận kiểu có thể không chính xác
    };
  },
  methods: {
    increment() {
      this.count++; // Kiểu của this có thể không chính xác
    },
  },
});
</script>
```

**Composition API**: Hỗ trợ TypeScript đầy đủ

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // Kiểu rõ ràng
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. Bảng so sánh

| Đặc điểm | Options API | Composition API |
| --------------- | ------------------ | ------------------- |
| Đường cong học tập | Thấp hơn | Cao hơn |
| Tổ chức logic | Phân tán trong các tùy chọn | Logic liên quan tập trung |
| Tái sử dụng mã | Mixins (dễ xung đột) | Composables (linh hoạt) |
| Hỗ trợ TypeScript | Hạn chế | Đầy đủ |
| Trường hợp sử dụng | Component đơn giản | Component phức tạp, dự án lớn |
| Tương thích ngược | Vue 2/3 đều hỗ trợ | Chỉ Vue 3 |

## 4. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Chọn phong cách API

Giải thích trong trường hợp nào nên sử dụng Composition API và khi nào nên dùng Options API.

<details>
<summary>Nhấp để xem đáp án</summary>

**Trường hợp sử dụng Composition API**:

1. **Component phức tạp**: Logic phức tạp, cần tổ chức tốt hơn

   ```vue
   <script setup>
   // Nhiều module chức năng, Composition API rõ ràng hơn
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Cần tái sử dụng mã**: Nhiều component chia sẻ logic

   ```vue
   <script setup>
   // Hàm composable, dễ tái sử dụng
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Dự án TypeScript**: Cần hỗ trợ kiểu đầy đủ

   ```vue
   <script setup lang="ts">
   // Composition API hỗ trợ TypeScript tốt hơn
   const count = ref<number>(0);
   </script>
   ```

4. **Dự án lớn**: Cần tổ chức logic và bảo trì tốt hơn

**Trường hợp sử dụng Options API**:

1. **Component đơn giản**: Logic đơn giản, không cần tổ chức phức tạp

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

2. **Dự án Vue 2**: Cần tương thích ngược
3. **Mức độ quen thuộc của nhóm**: Nhóm quen thuộc hơn với Options API

**Khuyến nghị**:

- Dự án mới: ưu tiên Composition API
- Component đơn giản: có thể tiếp tục dùng Options API
- Component phức tạp: nên dùng Composition API

</details>

### Câu hỏi 2: Tổ chức logic

Viết lại đoạn mã Options API sau thành Composition API.

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
<summary>Nhấp để xem đáp án</summary>

**Cách viết Composition API**:

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Đang tải...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Logic liên quan được nhóm lại
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

**Cải tiến: Sử dụng Composable**:

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

### Câu hỏi 3: Tái sử dụng mã

Giải thích cách sử dụng Composition API để tái sử dụng mã và so sánh với Mixins.

<details>
<summary>Nhấp để xem đáp án</summary>

**Vấn đề của Mixins**:

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
  // Vấn đề:
  // 1. Xung đột tên: nếu hai mixin có thuộc tính cùng tên
  // 2. Nguồn dữ liệu không rõ ràng: không biết user đến từ mixin nào
  // 3. Khó theo dõi: không thể thấy rõ tất cả thuộc tính và phương thức có sẵn
};
</script>
```

**Giải pháp với Composition API**:

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

// Ưu điểm:
// 1. Đặt tên rõ ràng: biết rõ nguồn dữ liệu
// 2. Sử dụng có chọn lọc: chỉ dùng phần cần thiết
// 3. Dễ theo dõi: IDE có thể tự động hoàn thành
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**So sánh**:

| Đặc điểm | Mixins | Composables |
| --------------- | -------- | ----------- |
| Xung đột tên | Dễ xảy ra | Có thể tránh |
| Khả năng theo dõi | Thấp | Cao |
| Sử dụng có chọn lọc | Không | Có |
| Hỗ trợ TypeScript | Hạn chế | Đầy đủ |
| Trường hợp sử dụng | Vue 2 | Vue 3 |

</details>

## 5. Best Practices

> Thực hành tốt nhất

### Phương pháp được khuyến nghị

```vue
<script setup>
// 1. Sử dụng cú pháp <script setup>
import { ref, computed } from 'vue';

// 2. Nhóm logic liên quan lại với nhau
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Tách logic phức tạp thành composable
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. Đặt tên rõ ràng
const userName = ref(''); // Rõ ràng
const u = ref(''); // Không rõ ràng
</script>
```

### Phương pháp cần tránh

```vue
<script setup>
// 1. Không trộn lẫn Options API và Composition API (trừ khi cần thiết)
export default {
  setup() {
    // ...
  },
  data() {
    // Trộn lẫn dễ gây nhầm lẫn
  },
};

// 2. Không tách composable quá mức
// Logic đơn giản không cần tách
const count = ref(0); // Đơn giản, không cần tách

// 3. Không thao tác DOM trực tiếp trong composable
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // Không nên
  return { count };
}
</script>
```

## 6. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

**Khái niệm cốt lõi của Composition API**:

- Logic liên quan được nhóm lại
- Tái sử dụng mã thông qua composables
- Hỗ trợ TypeScript tốt hơn
- Phù hợp với component phức tạp và dự án lớn

**Khuyến nghị**:

- Dự án mới: ưu tiên Composition API
- Component đơn giản: có thể dùng Options API
- Component phức tạp: nên dùng Composition API
- Dự án TypeScript: khuyến nghị dùng Composition API

### Ví dụ trả lời phỏng vấn

**Q: Sự khác biệt giữa Composition API và Options API là gì?**

> "Composition API là cách viết mới được giới thiệu trong Vue 3. Sự khác biệt chính nằm ở cách tổ chức logic. Options API phân tán logic trong data, computed, methods, v.v., trong khi Composition API cho phép nhóm logic liên quan lại với nhau. Ưu điểm của Composition API bao gồm: 1) tổ chức logic tốt hơn; 2) tái sử dụng mã dễ dàng hơn qua composables thay vì mixins; 3) hỗ trợ TypeScript đầy đủ; 4) phù hợp với component phức tạp và dự án lớn. Ưu điểm của Options API là đường cong học tập thấp hơn, phù hợp với component đơn giản. Cả hai có thể cùng tồn tại, Vue 3 hỗ trợ cả hai cách viết."

**Q: Khi nào nên sử dụng Composition API?**

> "Nên sử dụng Composition API trong các trường hợp sau: 1) component phức tạp, cần tổ chức logic tốt hơn; 2) cần tái sử dụng mã giữa nhiều component; 3) dự án TypeScript, cần hỗ trợ kiểu đầy đủ; 4) dự án lớn, cần khả năng bảo trì tốt hơn. Với component đơn giản hoặc khi nhóm quen thuộc hơn với Options API, có thể tiếp tục dùng Options API. Vue 3 hỗ trợ cả hai cách viết, có thể chọn theo nhu cầu dự án."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
