---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. Apa itu Composition API?

> Apa itu Composition API?

Composition API adalah gaya penulisan component Vue 3 yang menyediakan cara yang lebih fleksibel untuk mengorganisir logika.
Berbeda dengan Options API yang memisahkan logika berdasarkan jenis opsi (`data`, `methods`, `computed`, dll.), Composition API mengelompokkan logika yang saling terkait.

### Options API (gaya tradisional)

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

### Composition API (gaya baru)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// logika terkait dikelompokkan bersama
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

## 2. Composition API vs Options API: Perbedaan Utama

> Perbedaan utama antara Composition API dan Options API

### 1. Organisasi logika

**Options API**: logika dipecah ke seluruh blok opsi.

```vue
<script>
export default {
  // state tersebar di seluruh opsi
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // computed ada di bagian terpisah
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // perilaku ada di bagian lain
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
    // lifecycle ada di bagian lain
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: logika terkait disatukan.

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// logika user
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// logika post
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// logika komentar
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

### 2. Penggunaan ulang kode

**Options API**: umumnya menggunakan Mixins (dapat menyebabkan konflik penamaan).

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
  // beberapa mixin dapat menyebabkan konflik nama
};
</script>
```

**Composition API**: menggunakan Composables (lebih eksplisit dan fleksibel).

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
// penggunaan selektif, menghindari konflik implisit
</script>
```

### 3. Dukungan TypeScript

**Options API**: dukungan TS dapat digunakan tetapi kurang ergonomis dalam beberapa skenario `this`.

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // inferensi bisa kurang langsung di component besar
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

**Composition API**: typing yang kuat dan eksplisit.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0);
const increment = (): void => {
  count.value++;
};
</script>
```

### Tabel perbandingan

| Fitur | Options API | Composition API |
| --- | --- | --- |
| Kurva pembelajaran | Lebih rendah | Lebih tinggi |
| Organisasi logika | Dipecah berdasarkan blok opsi | Dikelompokkan berdasarkan fitur/domain |
| Penggunaan ulang kode | Mixins (risiko konflik) | Composables (fleksibel) |
| Dukungan TypeScript | Ergonomi terbatas dalam beberapa kasus | Dukungan kuat |
| Paling cocok untuk | Component sederhana | Component kompleks / proyek besar |
| Kompatibilitas mundur | Vue 2 dan Vue 3 | Vue 3 |

## 4. Pertanyaan Wawancara Umum

> Pertanyaan wawancara umum

### Pertanyaan 1: Memilih gaya API

Kapan sebaiknya menggunakan Composition API, dan kapan sebaiknya menggunakan Options API?

<details>
<summary>Klik untuk melihat jawaban</summary>

**Gunakan Composition API ketika:**

1. **Component kompleks** membutuhkan pengelompokan logika yang lebih jelas.

   ```vue
   <script setup>
   // beberapa modul fitur lebih mudah dikomposisi
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Penggunaan ulang kode** penting di banyak component.

   ```vue
   <script setup>
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Proyek yang banyak TypeScript** membutuhkan typing eksplisit.

   ```vue
   <script setup lang="ts">
   const count = ref<number>(0);
   </script>
   ```

4. **Codebase besar** membutuhkan struktur logika yang mudah dipelihara.

**Gunakan Options API ketika:**

1. **Component sederhana** dengan perilaku yang lugas.

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

2. **Kompatibilitas Vue 2** diperlukan.
3. Tim secara signifikan lebih familiar dengan Options API.

**Rekomendasi:**

- Proyek baru: lebih baik gunakan Composition API
- Component sederhana: Options API tetap boleh
- Component kompleks: Composition API biasanya lebih baik

</details>

### Pertanyaan 2: Organisasi logika

Tulis ulang component Options API ini dengan Composition API.

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
<summary>Klik untuk melihat jawaban</summary>

**Versi Composition API:**

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Memuat...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// logika terkait dikelompokkan bersama
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

**Peningkatan lebih lanjut (ekstrak ke composable):**

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

### Pertanyaan 3: Penggunaan ulang kode

Bagaimana cara menggunakan Composition API untuk penggunaan ulang, dan apa bedanya dengan Mixins?

<details>
<summary>Klik untuk melihat jawaban</summary>

**Masalah dengan Mixins:**

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
  // masalah:
  // 1) konflik penamaan
  // 2) sumber field/method tidak jelas
  // 3) pelacakan/autocomplete lebih sulit
};
</script>
```

**Solusi Composition API:**

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

// keuntungan:
// 1) penamaan dan sumber eksplisit
// 2) penggunaan selektif
// 3) dukungan IDE dan pelacakan lebih baik
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Perbandingan:**

| Fitur | Mixins | Composables |
| --- | --- | --- |
| Konflik penamaan | Mudah terjadi | Dapat dihindari |
| Keterlacakan | Lebih rendah | Lebih tinggi |
| Penggunaan selektif | Tidak | Ya |
| Dukungan TypeScript | Terbatas | Kuat |
| Paling cocok untuk | Penggunaan ulang legacy Vue 2 | Penggunaan ulang Vue 3 |

</details>

## 5. Praktik Terbaik

> Praktik terbaik

### Disarankan

```vue
<script setup>
// 1. Utamakan <script setup>
import { ref, computed } from 'vue';

// 2. Kelompokkan logika terkait bersama
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Ekstrak logika kompleks ke composables
import { useCounter } from './composables/useCounter';
const { count: c2, increment: inc2 } = useCounter();

// 4. Gunakan nama yang eksplisit
const userName = ref(''); // ✅ jelas
const u = ref(''); // ❌ tidak jelas
</script>
```

### Hindari

```vue
<script setup>
// 1. Hindari mencampur Options API dan Composition API tanpa alasan jelas
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ mencampur gaya bisa membingungkan pemeliharaan
  },
};

// 2. Hindari over-extracting composables
const count = ref(0); // logika sederhana bisa tetap lokal

// 3. Hindari manipulasi DOM langsung di dalam composables
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Ringkasan Wawancara

> Ringkasan wawancara

### Ingatan cepat

**Poin inti Composition API:**

- Mengelompokkan logika terkait bersama
- Penggunaan ulang dengan composables
- Dukungan TypeScript yang lebih baik
- Lebih cocok untuk proyek kompleks/besar

**Panduan pemilihan:**

- Proyek baru: lebih baik Composition API
- Component sederhana: Options API tetap boleh
- Component kompleks: Composition API disarankan
- Proyek TypeScript: Composition API biasanya lebih baik

### Contoh jawaban wawancara

**T: Apa perbedaan antara Composition API dan Options API?**

> Composition API (diperkenalkan di Vue 3) mengubah cara logika diorganisir.
> Options API memisahkan logika berdasarkan blok opsi (`data`, `computed`, `methods`), sedangkan Composition API mengelompokkan logika terkait berdasarkan fitur.
> Keuntungan utama: organisasi yang lebih baik untuk component kompleks, penggunaan ulang yang lebih baik dengan composables, dan ergonomi TypeScript yang lebih kuat.
> Options API memiliki kurva pembelajaran yang lebih rendah dan bekerja baik untuk component sederhana.

**T: Kapan saya harus menggunakan Composition API?**

> Gunakan untuk component kompleks, logika yang dapat digunakan ulang bersama, proyek yang banyak TypeScript, dan codebase besar.
> Untuk component sederhana atau tim yang sangat familiar dengan Options API, Options API tetap valid.

## Referensi

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Panduan Migrasi Vue 3](https://v3-migration.vuejs.org/)
