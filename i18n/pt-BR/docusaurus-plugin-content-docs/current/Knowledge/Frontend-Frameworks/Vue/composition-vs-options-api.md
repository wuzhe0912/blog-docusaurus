---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> O que e Composition API?

Composition API e uma nova forma de escrever componentes introduzida no Vue 3, oferecendo uma maneira mais flexivel de organizar a logica dos componentes. Diferente da tradicional Options API, a Composition API permite organizar logicas relacionadas juntas, em vez de dispersa-las em diferentes opcoes.

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

// Logicas relacionadas organizadas juntas
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

> Principais diferencas entre Composition API e Options API

### 1. Organizacao da Logica

**Options API**: Logica dispersa em diferentes opcoes

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
    // Metodos dispersos
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

**Composition API**: Logicas relacionadas organizadas juntas

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Logica relacionada ao usuario
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// Logica relacionada a posts
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// Logica relacionada a comentarios
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

### 2. Reutilizacao de Codigo

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
  // Com multiplos mixins, conflitos de nomes podem ocorrer facilmente
};
</script>
```

**Composition API**: Usa Composables (mais flexivel)

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
      count: 0, // Inferencia de tipo pode ser imprecisa
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

const count = ref<number>(0); // Tipo explicito
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. Tabela Comparativa

| Caracteristica | Options API | Composition API |
| --------------- | ------------------ | ------------------- |
| Curva de aprendizado | Mais baixa | Mais alta |
| Organizacao da logica | Dispersa em opcoes | Logicas relacionadas juntas |
| Reutilizacao de codigo | Mixins (propenso a conflitos) | Composables (flexivel) |
| Suporte TypeScript | Limitado | Suporte completo |
| Cenario de uso | Componentes simples | Componentes complexos, projetos grandes |
| Compatibilidade | Vue 2/3 suportam | Exclusivo do Vue 3 |

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Pergunta 1: Escolhendo o estilo de API

Explique em quais situacoes deve-se usar Composition API e em quais usar Options API?

<details>
<summary>Clique para ver a resposta</summary>

**Situacoes para usar Composition API**:

1. **Componentes complexos**: Logica complexa que precisa de melhor organizacao

   ```vue
   <script setup>
   // Multiplos modulos funcionais, Composition API e mais clara
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Necessidade de reutilizacao de codigo**: Varios componentes compartilhando logica

   ```vue
   <script setup>
   // Funcoes composable, faceis de reutilizar
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

4. **Projetos grandes**: Necessidade de melhor organizacao logica e manutencao

**Situacoes para usar Options API**:

1. **Componentes simples**: Logica simples, sem necessidade de organizacao complexa

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

**Recomendacao**:

- Novos projetos: priorizar Composition API
- Componentes simples: podem continuar usando Options API
- Componentes complexos: recomendado Composition API

</details>

### Pergunta 2: Organizacao de Logica

Reescreva o codigo Options API abaixo para Composition API.

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

// Logicas relacionadas organizadas juntas
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

### Pergunta 3: Reutilizacao de Codigo

Explique como usar Composition API para reutilizacao de codigo e compare com Mixins.

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
  // 2. Origem dos dados obscura: nao se sabe de qual mixin vem o user
  // 3. Dificil de rastrear: nao e possivel ver claramente todas as propriedades e metodos disponiveis
};
</script>
```

**Solucao com Composition API**:

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
// 1. Nomes explicitos: sabe-se claramente a origem dos dados
// 2. Uso seletivo: usa apenas o que precisa
// 3. Facil de rastrear: IDE pode fazer autocomplete
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Comparacao de diferencas**:

| Caracteristica | Mixins | Composables |
| --------------- | -------- | ----------- |
| Conflito de nomes | Frequente | Evitavel |
| Rastreabilidade | Baixa | Alta |
| Seletividade | Nenhuma | Presente |
| Suporte TypeScript | Limitado | Completo |
| Cenario de uso | Vue 2 | Vue 3 |

</details>

## 5. Best Practices

> Melhores Praticas

### Praticas Recomendadas

```vue
<script setup>
// 1. Usar sintaxe <script setup>
import { ref, computed } from 'vue';

// 2. Organizar logicas relacionadas juntas
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Extrair logica complexa em composables
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. Nomeacao clara
const userName = ref(''); // Claro
const u = ref(''); // Nao claro
</script>
```

### Praticas a Evitar

```vue
<script setup>
// 1. Nao misturar Options API e Composition API (a menos que necessario)
export default {
  setup() {
    // ...
  },
  data() {
    // Misturar causa confusao
  },
};

// 2. Nao extrair composables em excesso
// Logica simples nao precisa ser extraida
const count = ref(0); // Simples, nao precisa extrair

// 3. Nao manipular o DOM diretamente em composables
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // Errado
  return { count };
}
</script>
```

## 6. Interview Summary

> Resumo para Entrevistas

### Memorizacao Rapida

**Conceitos centrais da Composition API**:

- Logicas relacionadas organizadas juntas
- Reutilizacao de codigo com Composables
- Melhor suporte a TypeScript
- Adequado para componentes complexos e projetos grandes

**Recomendacoes de escolha**:

- Novos projetos: priorizar Composition API
- Componentes simples: podem usar Options API
- Componentes complexos: recomendado Composition API
- Projetos TypeScript: recomendado Composition API

### Exemplo de Resposta para Entrevista

**P: Qual e a diferenca entre Composition API e Options API?**

> "Composition API e uma nova escrita introduzida no Vue 3, a principal diferenca esta na organizacao da logica. Options API dispersa a logica em data, computed, methods e outras opcoes, enquanto Composition API permite organizar logicas relacionadas juntas. As vantagens da Composition API incluem: 1) Melhor organizacao logica, codigo relacionado concentrado; 2) Reutilizacao de codigo mais facil com composables em vez de mixins; 3) Suporte completo a TypeScript; 4) Adequado para componentes complexos e projetos grandes. A vantagem da Options API e a curva de aprendizado mais baixa, adequada para componentes simples. Ambas podem coexistir, o Vue 3 suporta ambas as escritas."

**P: Quando se deve usar Composition API?**

> "Recomenda-se usar Composition API nas seguintes situacoes: 1) Componentes complexos que precisam de melhor organizacao logica; 2) Necessidade de reutilizacao de codigo compartilhando logica entre multiplos componentes; 3) Projetos TypeScript que precisam de suporte completo de tipos; 4) Projetos grandes que precisam de melhor manutencao. Para componentes simples ou equipes mais familiarizadas com Options API, pode-se continuar usando Options API. O Vue 3 suporta ambas as escritas, pode-se escolher conforme as necessidades do projeto."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
