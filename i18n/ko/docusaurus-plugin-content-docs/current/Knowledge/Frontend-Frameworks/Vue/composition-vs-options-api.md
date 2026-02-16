---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> Composition API란 무엇인가?

Composition API는 Vue 3에서 도입된 새로운 컴포넌트 작성 방식으로, 컴포넌트 로직을 더 유연하게 구성할 수 있습니다. 기존의 Options API와 달리, Composition API는 관련 로직을 하나로 묶어 구성할 수 있으며, 다양한 옵션에 분산시킬 필요가 없습니다.

### Options API (기존 방식)

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

### Composition API (새로운 방식)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 관련 로직을 하나로 묶어 구성
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

> Composition API와 Options API의 주요 차이점

### 1. 로직 구성 방식

**Options API**: 로직이 다른 옵션에 분산됨

```vue
<script>
export default {
  // 데이터가 여기저기 분산됨
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // 계산 속성 분산
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // 메서드 분산
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
    // 생명주기 분산
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: 관련 로직을 하나로 묶어 구성

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// 사용자 관련 로직
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// 게시글 관련 로직
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// 댓글 관련 로직
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// 생명주기
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. 코드 재사용

**Options API**: Mixins 사용 (이름 충돌이 발생하기 쉬움)

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
  // 여러 mixin이 있으면 이름 충돌이 발생하기 쉬움
};
</script>
```

**Composition API**: Composables 사용 (더 유연)

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
// 선택적으로 사용 가능, 이름 충돌 방지
</script>
```

### 3. TypeScript 지원

**Options API**: TypeScript 지원이 제한적

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // 타입 추론이 정확하지 않을 수 있음
    };
  },
  methods: {
    increment() {
      this.count++; // this의 타입이 정확하지 않을 수 있음
    },
  },
});
</script>
```

**Composition API**: 완전한 TypeScript 지원

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // 명확한 타입
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. 비교표

| 특성            | Options API          | Composition API       |
| --------------- | -------------------- | --------------------- |
| 학습 난이도     | 낮음                 | 높음                  |
| 로직 구성       | 다른 옵션에 분산     | 관련 로직 집중        |
| 코드 재사용     | Mixins (충돌 발생 쉬움) | Composables (유연)   |
| TypeScript 지원 | 제한적               | 완전 지원             |
| 적용 시나리오   | 간단한 컴포넌트      | 복잡한 컴포넌트, 대규모 프로젝트 |
| 하위 호환성     | Vue 2/3 모두 지원    | Vue 3 전용            |

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 질문 1: API 스타일 선택

어떤 상황에서 Composition API를 사용하고, 어떤 상황에서 Options API를 사용해야 하는지 설명하세요.

<details>
<summary>정답 보기</summary>

**Composition API를 사용하는 경우**:

1. **복잡한 컴포넌트**: 로직이 복잡하여 더 나은 구성이 필요한 경우

   ```vue
   <script setup>
   // 여러 기능 모듈, Composition API가 더 명확
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **코드 재사용이 필요한 경우**: 여러 컴포넌트가 로직을 공유

   ```vue
   <script setup>
   // composable 함수를 사용하여 재사용이 용이
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **TypeScript 프로젝트**: 완전한 타입 지원이 필요한 경우

   ```vue
   <script setup lang="ts">
   // Composition API는 TypeScript 지원이 더 좋음
   const count = ref<number>(0);
   </script>
   ```

4. **대규모 프로젝트**: 더 나은 로직 구성과 유지보수가 필요한 경우

**Options API를 사용하는 경우**:

1. **간단한 컴포넌트**: 로직이 간단하여 복잡한 구성이 필요 없는 경우

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

2. **Vue 2 프로젝트**: 하위 호환성이 필요한 경우
3. **팀 친숙도**: 팀이 Options API에 더 익숙한 경우

**권장 사항**:

- 새 프로젝트에서는 Composition API를 우선 사용
- 간단한 컴포넌트는 Options API를 계속 사용 가능
- 복잡한 컴포넌트에서는 Composition API 사용을 권장

</details>

### 질문 2: 로직 구성

다음 Options API 코드를 Composition API로 변환하세요.

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
<summary>정답 보기</summary>

**Composition API 방식**:

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">로딩 중...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 관련 로직을 하나로 묶어 구성
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

**개선: Composable 사용**:

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

### 질문 3: 코드 재사용

Composition API를 사용한 코드 재사용 방법을 설명하고, Mixins과의 차이점을 비교하세요.

<details>
<summary>정답 보기</summary>

**Mixins의 문제점**:

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
  // 문제점:
  // 1. 이름 충돌: 두 mixin에 같은 이름의 속성이 있을 경우
  // 2. 데이터 출처 불명확: user가 어떤 mixin에서 온 것인지 모름
  // 3. 추적 어려움: 사용 가능한 모든 속성과 메서드를 명확히 볼 수 없음
};
</script>
```

**Composition API의 해결 방법**:

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

// 장점:
// 1. 명확한 이름 지정: 데이터 출처를 명확히 알 수 있음
// 2. 선택적 사용: 필요한 부분만 사용 가능
// 3. 추적 용이: IDE에서 자동 완성 가능
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**차이점 비교**:

| 특성            | Mixins     | Composables |
| --------------- | ---------- | ----------- |
| 이름 충돌       | 발생하기 쉬움 | 방지 가능    |
| 추적 가능성     | 낮음       | 높음        |
| 선택적 사용     | 불가       | 가능        |
| TypeScript 지원 | 제한적     | 완전        |
| 적용 시나리오   | Vue 2      | Vue 3       |

</details>

## 5. Best Practices

> 모범 사례

### 권장 사항

```vue
<script setup>
// 1. <script setup> 문법 설탕 사용
import { ref, computed } from 'vue';

// 2. 관련 로직을 하나로 묶어 구성
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. 복잡한 로직은 composable로 추출
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. 명확한 이름 지정
const userName = ref(''); // ✅ 명확
const u = ref(''); // ❌ 불명확
</script>
```

### 피해야 할 사항

```vue
<script setup>
// 1. Options API와 Composition API를 혼용하지 않기 (불가피한 경우 제외)
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ 혼용하면 혼란을 초래
  },
};

// 2. composable을 과도하게 추출하지 않기
// 간단한 로직은 추출할 필요 없음
const count = ref(0); // ✅ 간단, 추출 불필요

// 3. composable에서 직접 DOM 조작하지 않기
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Interview Summary

> 면접 요약

### 빠른 기억

**Composition API 핵심 개념**:

- 관련 로직을 하나로 묶어 구성
- composables를 사용하여 코드 재사용 구현
- 더 나은 TypeScript 지원
- 복잡한 컴포넌트와 대규모 프로젝트에 적합

**선택 권장**:

- 새 프로젝트: Composition API 우선 사용
- 간단한 컴포넌트: Options API 사용 가능
- 복잡한 컴포넌트: Composition API 사용 권장
- TypeScript 프로젝트: Composition API 사용 추천

### 면접 답변 예시

**Q: Composition API와 Options API의 차이점은 무엇인가?**

> "Composition API는 Vue 3에서 도입된 새로운 작성 방식으로, 주요 차이점은 로직 구성 방식에 있습니다. Options API는 로직을 data, computed, methods 등의 옵션에 분산시키지만, Composition API는 관련 로직을 하나로 묶어 구성할 수 있습니다. Composition API의 장점은 1) 더 나은 로직 구성으로 관련 코드가 집중되고, 2) composables를 사용하여 mixins 대신 더 쉬운 코드 재사용이 가능하며, 3) 완전한 TypeScript 지원, 4) 복잡한 컴포넌트와 대규모 프로젝트에 적합합니다. Options API의 장점은 학습 난이도가 낮고 간단한 컴포넌트에 적합합니다. 두 가지는 공존할 수 있으며, Vue 3은 두 가지 방식을 모두 지원합니다."

**Q: 언제 Composition API를 사용해야 하는가?**

> "다음과 같은 상황에서 Composition API 사용을 권장합니다: 1) 복잡한 컴포넌트로 로직이 복잡하여 더 나은 구성이 필요할 때, 2) 코드 재사용이 필요하여 여러 컴포넌트가 로직을 공유할 때, 3) TypeScript 프로젝트에서 완전한 타입 지원이 필요할 때, 4) 대규모 프로젝트에서 더 나은 유지보수성이 필요할 때입니다. 간단한 컴포넌트이거나 팀이 Options API에 더 익숙한 경우에는 Options API를 계속 사용할 수 있습니다. Vue 3은 두 가지 방식을 모두 지원하므로 프로젝트 요구에 따라 선택할 수 있습니다."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
