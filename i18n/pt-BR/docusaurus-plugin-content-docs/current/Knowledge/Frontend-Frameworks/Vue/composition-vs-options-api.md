---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> O que é Composition API?

Composition API é uma nova forma de escrever componentes introduzida no Vue 3, oferecendo uma maneira mais flexível de organizar a lógica dos componentes. Diferente da tradicional Options API, a Composition API permite organizar lógicas relacionadas juntas, em vez de dispersa-las em diferentes opções.

### Options API (Escrita Tradicional)

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

### Composition API (Nova Escrita)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Lógicas relacionadas organizadas juntas
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

> Principais diferenças entre Composition API e Options API

### 1. Organização da Lógica

**Options API**: Lógica dispersa em diferentes opções

```vue
<script>
export default {
  // Dados dispersos em varias partes
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // Propriedades computadas dispersas
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // Métodos dispersos
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
    // Lifecycle disperso
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: Lógicas relacionadas organizadas juntas

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Lógica relacionada ao usuario
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// Lógica relacionada a posts
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// Lógica relacionada a comentários
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// Lifecycle
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. Reutilização de Código

**Options API**: Usa Mixins (propenso a conflitos de nomes)

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
  // Com múltiplos mixins, conflitos de nomes podem ocorrer facilmente
};
</script>
```

**Composition API**: Usa Composables (mais flexível)

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
// Pode usar seletivamente, evitando conflitos de nomes
</script>
```

### 3. Suporte a TypeScript

**Options API**: Suporte limitado a TypeScript

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // Inferência de tipo pode ser imprecisa
    };
  },
  methods: {
    increment() {
      this.count++; // Tipo de this pode ser impreciso
    },
  },
});
</script>
```

**Composition API**: Suporte completo a TypeScript

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // Tipo explícito
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. Tabela Comparativa

| Característica | Options API | Composition API |
| --------------- | ------------------ | ------------------- |
| Curva de aprendizado | Mais baixa | Mais alta |
| Organização da lógica | Dispersa em opções | Lógicas relacionadas juntas |
| Reutilização de código | Mixins (propenso a conflitos) | Composables (flexível) |
| Suporte TypeScript | Limitado | Suporte completo |
| Cenário de uso | Componentes simples | Componentes complexos, projetos grandes |
| Compatibilidade | Vue 2/3 suportam | Exclusivo do Vue 3 |

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Pergunta 1: Escolhendo o estilo de API

Explique em quais situações deve-se usar Composition API e em quais usar Options API?

<details>
<summary>Clique para ver a resposta</summary>

**Situações para usar Composition API**:

1. **Componentes complexos**: Lógica complexa que precisa de melhor organização

   ```vue
   <script setup>
   // Múltiplos módulos funcionais, Composition API é mais clara
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Necessidade de reutilização de código**: Varios componentes compartilhando lógica

   ```vue
   <script setup>
   // Funções composable, fáceis de reutilizar
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Projetos TypeScript**: Necessidade de suporte completo de tipos

   ```vue
   <script setup lang="ts">
   // Composition API oferece melhor suporte a TypeScript
   const count = ref<number>(0);
   </script>
   ```

4. **Projetos grandes**: Necessidade de melhor organização lógica e manutenção

**Situações para usar Options API**:

1. **Componentes simples**: Lógica simples, sem necessidade de organização complexa

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

2. **Projetos Vue 2**: Necessidade de compatibilidade retroativa
3. **Familiaridade da equipe**: Equipe mais familiarizada com Options API

**Recomendação**:

- Novos projetos: priorizar Composition API
- Componentes simples: podem continuar usando Options API
- Componentes complexos: recomendado Composition API

</details>

### Pergunta 2: Organização de Lógica

Reescreva o código Options API abaixo para Composition API.

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
<summary>Clique para ver a resposta</summary>

**Escrita com Composition API**:

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Carregando...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Lógicas relacionadas organizadas juntas
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

**Melhoria: Usando Composable**:

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

### Pergunta 3: Reutilização de Código

Explique como usar Composition API para reutilização de código e compare com Mixins.

<details>
<summary>Clique para ver a resposta</summary>

**Problemas dos Mixins**:

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
  // Problemas:
  // 1. Conflito de nomes: se dois mixins tiverem propriedades com o mesmo nome
  // 2. Origem dos dados obscura: não se sabe de qual mixin vem o user
  // 3. difícil de rastrear: não é possível ver claramente todas as propriedades é métodos disponíveis
};
</script>
```

**Solução com Composition API**:

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

// Vantagens:
// 1. Nomes explícitos: sabe-se claramente a origem dos dados
// 2. Uso seletivo: usa apenas o que precisa
// 3. Fácil de rastrear: IDE pode fazer autocomplete
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Comparação de diferenças**:

| Característica | Mixins | Composables |
| --------------- | -------- | ----------- |
| Conflito de nomes | Frequente | Evitavel |
| Rastreabilidade | Baixa | Alta |
| Seletividade | Nenhuma | Presente |
| Suporte TypeScript | Limitado | Completo |
| Cenário de uso | Vue 2 | Vue 3 |

</details>

## 5. Best Practices

> Melhores Práticas

### Práticas Recomendadas

```vue
<script setup>
// 1. Usar sintaxe <script setup>
import { ref, computed } from 'vue';

// 2. Organizar lógicas relacionadas juntas
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Extrair lógica complexa em composables
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. Nomeacao clara
const userName = ref(''); // Claro
const u = ref(''); // Não claro
</script>
```

### Práticas a Evitar

```vue
<script setup>
// 1. Não misturar Options API é Composition API (a menos que necessário)
export default {
  setup() {
    // ...
  },
  data() {
    // Misturar causa confusao
  },
};

// 2. Não extrair composables em excesso
// Lógica simples não precisa ser extraida
const count = ref(0); // Simples, não precisa extrair

// 3. Não manipular o DOM diretamente em composables
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // Errado
  return { count };
}
</script>
```

## 6. Interview Summary

> Resumo para Entrevistas

### Memorização Rápida

**Conceitos centrais da Composition API**:

- Lógicas relacionadas organizadas juntas
- Reutilização de código com Composables
- Melhor suporte a TypeScript
- Adequado para componentes complexos e projetos grandes

**Recomendações de escolha**:

- Novos projetos: priorizar Composition API
- Componentes simples: podem usar Options API
- Componentes complexos: recomendado Composition API
- Projetos TypeScript: recomendado Composition API

### Exemplo de Resposta para Entrevista

**P: Qual é a diferença entre Composition API e Options API?**

> "Composition API é uma nova escrita introduzida no Vue 3, a principal diferença está na organização da lógica. Options API dispersa a lógica em data, computed, methods e outras opções, enquanto Composition API permite organizar lógicas relacionadas juntas. As vantagens da Composition API incluem: 1) Melhor organização lógica, código relacionado concentrado; 2) Reutilização de código mais fácil com composables em vez de mixins; 3) Suporte completo a TypeScript; 4) Adequado para componentes complexos e projetos grandes. A vantagem da Options API é a curva de aprendizado mais baixa, adequada para componentes simples. Ambas podem coexistir, o Vue 3 suporta ambas as escritas."

**P: Quando se deve usar Composition API?**

> "Recomenda-se usar Composition API nas seguintes situações: 1) Componentes complexos que precisam de melhor organização lógica; 2) Necessidade de reutilização de código compartilhando lógica entre múltiplos componentes; 3) Projetos TypeScript que precisam de suporte completo de tipos; 4) Projetos grandes que precisam de melhor manutenção. Para componentes simples ou equipes mais familiarizadas com Options API, pode-se continuar usando Options API. O Vue 3 suporta ambas as escritas, pode-se escolher conforme as necessidades do projeto."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
