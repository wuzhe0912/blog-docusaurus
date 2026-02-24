---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. Cos'è la Composition API?

> Cos'è la Composition API?

La Composition API è uno stile di scrittura dei componenti Vue 3 che offre un modo più flessibile per organizzare la logica.
A differenza della Options API, che divide la logica per tipo di opzione (`data`, `methods`, `computed`, ecc.), la Composition API raggruppa la logica correlata insieme.

### Options API (stile tradizionale)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Conteggio: {{ count }}</button>
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
    console.log('Componente montato');
  },
};
</script>
```

### Composition API (nuovo stile)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Conteggio: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// logica correlata raggruppata insieme
const firstName = ref('John');
const lastName = ref('Doe');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

const count = ref(0);
const increment = () => {
  count.value++;
};

onMounted(() => {
  console.log('Componente montato');
});
</script>
```

## 2. Composition API vs Options API: Differenze Principali

> Differenze principali tra Composition API e Options API

### 1. Organizzazione della logica

**Options API**: la logica è distribuita tra blocchi di opzioni.

```vue
<script>
export default {
  // lo stato è distribuito tra le opzioni
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // computed è in una sezione diversa
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // il comportamento è in un'altra sezione
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
    // il lifecycle è in un'altra sezione
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: la logica correlata è collocata insieme.

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// logica utente
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// logica post
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// logica commenti
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

### 2. Riutilizzo del codice

**Options API**: comunemente usa i Mixins (possono causare conflitti di nomi).

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
  // molteplici mixins possono portare a collisioni di nomi
};
</script>
```

**Composition API**: usa i Composables (più espliciti e flessibili).

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
// utilizzo selettivo, evita collisioni implicite
</script>
```

### 3. Supporto TypeScript

**Options API**: il supporto TS è utilizzabile ma meno ergonomico in alcuni scenari con `this`.

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // l'inferenza può essere meno diretta in componenti grandi
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

**Composition API**: tipizzazione forte ed esplicita.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0);
const increment = (): void => {
  count.value++;
};
</script>
```

### Tabella comparativa

| Caratteristica | Options API | Composition API |
| --- | --- | --- |
| Curva di apprendimento | Più bassa | Più alta |
| Organizzazione della logica | Divisa per blocchi di opzioni | Raggruppata per funzionalità/dominio |
| Riutilizzo del codice | Mixins (rischio di collisioni) | Composables (flessibili) |
| Supporto TypeScript | Ergonomia limitata in alcuni casi | Supporto forte |
| Più adatta per | Componenti semplici | Componenti complessi / progetti grandi |
| Compatibilità retroattiva | Vue 2 e Vue 3 | Vue 3 |

## 4. Domande Comuni nei Colloqui

> Domande comuni nei colloqui

### Domanda 1: Scelta dello stile API

Quando dovresti usare la Composition API e quando la Options API?

<details>
<summary>Clicca per vedere la risposta</summary>

**Usa la Composition API quando:**

1. **Componenti complessi** necessitano di un raggruppamento logico più chiaro.

   ```vue
   <script setup>
   // molteplici moduli funzionali sono più facili da comporre
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Il riutilizzo del codice** è importante tra molti componenti.

   ```vue
   <script setup>
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Progetti pesantemente tipizzati con TypeScript** necessitano di tipizzazione esplicita.

   ```vue
   <script setup lang="ts">
   const count = ref<number>(0);
   </script>
   ```

4. **Grandi codebase** richiedono una struttura logica manutenibile.

**Usa la Options API quando:**

1. **Componenti semplici** con comportamento diretto.

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

2. È richiesta la **compatibilità con Vue 2**.
3. Il team ha significativamente più familiarità con la Options API.

**Raccomandazione:**

- Nuovi progetti: preferire la Composition API
- Componenti semplici: la Options API resta valida
- Componenti complessi: la Composition API è solitamente migliore

</details>

### Domanda 2: Organizzazione della logica

Riscrivi questo componente Options API con la Composition API.

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
<summary>Clicca per vedere la risposta</summary>

**Versione Composition API:**

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Caricamento...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// logica correlata raggruppata insieme
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

**Ulteriore miglioramento (estrazione in composable):**

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

### Domanda 3: Riutilizzo del codice

Come si usa la Composition API per il riutilizzo e in cosa differisce dai Mixins?

<details>
<summary>Clicca per vedere la risposta</summary>

**Problemi con i Mixins:**

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
  // problemi:
  // 1) conflitti di nomi
  // 2) sorgente dei campi/metodi poco chiara
  // 3) tracciamento/autocompletamento più difficile
};
</script>
```

**Soluzione Composition API:**

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

// vantaggi:
// 1) denominazione e sorgente esplicite
// 2) utilizzo selettivo
// 3) migliore supporto IDE e tracciamento
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Confronto:**

| Caratteristica | Mixins | Composables |
| --- | --- | --- |
| Collisione di nomi | Facile che accada | Evitabile |
| Tracciabilità | Più bassa | Più alta |
| Utilizzo selettivo | No | Sì |
| Supporto TypeScript | Limitato | Forte |
| Più adatto per | Riutilizzo legacy Vue 2 | Riutilizzo Vue 3 |

</details>

## 5. Best Practices (Buone Pratiche)

> Buone pratiche

### Raccomandato

```vue
<script setup>
// 1. Preferire <script setup>
import { ref, computed } from 'vue';

// 2. Raggruppare la logica correlata insieme
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Estrarre la logica complessa in composables
import { useCounter } from './composables/useCounter';
const { count: c2, increment: inc2 } = useCounter();

// 4. Usare nomi espliciti
const userName = ref(''); // ✅ chiaro
const u = ref(''); // ❌ poco chiaro
</script>
```

### Da evitare

```vue
<script setup>
// 1. Evitare di mescolare Options API e Composition API senza una ragione chiara
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ mescolare gli stili può confondere la manutenzione
  },
};

// 2. Evitare di estrarre eccessivamente i composables
const count = ref(0); // la logica semplice può rimanere locale

// 3. Evitare la manipolazione diretta del DOM nei composables
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Riepilogo per i Colloqui

> Riepilogo per i colloqui

### Promemoria rapido

**Punti chiave della Composition API:**

- Raggruppare la logica correlata insieme
- Riutilizzare con composables
- Migliore supporto TypeScript
- Più adatta per progetti complessi/grandi

**Guida alla scelta:**

- Nuovi progetti: preferire la Composition API
- Componenti semplici: la Options API va ancora bene
- Componenti complessi: la Composition API è raccomandata
- Progetti TypeScript: la Composition API è tipicamente migliore

### Risposte esempio per i colloqui

**D: Qual è la differenza tra Composition API e Options API?**

> La Composition API (introdotta in Vue 3) cambia il modo in cui la logica è organizzata.
> La Options API divide la logica per blocchi di opzioni (`data`, `computed`, `methods`), mentre la Composition API raggruppa la logica correlata per funzionalità.
> Vantaggi principali: migliore organizzazione per componenti complessi, migliore riutilizzo con composables e migliore ergonomia TypeScript.
> La Options API ha una curva di apprendimento più bassa e funziona bene per componenti semplici.

**D: Quando dovrei usare la Composition API?**

> Usala per componenti complessi, logica riutilizzabile condivisa, progetti pesantemente tipizzati con TypeScript e grandi codebase.
> Per componenti semplici o team molto familiari con la Options API, la Options API resta valida.

## Riferimenti

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Guida alla migrazione Vue 3](https://v3-migration.vuejs.org/)
