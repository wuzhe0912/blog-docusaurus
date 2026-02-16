---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> ¿Qué es Composition API?

Composition API es una nueva forma de escribir componentes introducida en Vue 3, que ofrece una manera más flexible de organizar la lógica del componente. A diferencia del tradicional Options API, Composition API permite organizar la lógica relacionada en un solo lugar en vez de dispersarla en diferentes opciones.

### Options API (forma tradicional)

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

### Composition API (nueva forma)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// La lógica relacionada se organiza junta
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

> Principales diferencias entre Composition API y Options API

### 1. Forma de organizar la lógica

**Options API**: La lógica se dispersa en diferentes opciones

```vue
<script>
export default {
  // Los datos se dispersan en diferentes lugares
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // Propiedades computadas dispersas
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
    // Ciclo de vida disperso
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: La lógica relacionada se organiza junta

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Lógica relacionada con el usuario
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// Lógica relacionada con publicaciones
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// Lógica relacionada con comentarios
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// Ciclo de vida
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. Reutilización de código

**Options API**: Uso de Mixins (propenso a conflictos de nombres)

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
  // Si hay múltiples mixins, es fácil que haya conflictos de nombres
};
</script>
```

**Composition API**: Uso de Composables (más flexible)

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
// Se puede usar selectivamente, evitando conflictos de nombres
</script>
```

### 3. Soporte para TypeScript

**Options API**: Soporte limitado para TypeScript

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // La inferencia de tipos puede no ser precisa
    };
  },
  methods: {
    increment() {
      this.count++; // El tipo de this puede no ser preciso
    },
  },
});
</script>
```

**Composition API**: Soporte completo para TypeScript

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // Tipo explícito
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. Tabla comparativa

| Característica  | Options API          | Composition API       |
| --------------- | -------------------- | --------------------- |
| Curva de aprendizaje | Baja             | Alta                  |
| Organización lógica | Dispersa en opciones | Lógica relacionada concentrada |
| Reutilización   | Mixins (propenso a conflictos) | Composables (flexible) |
| Soporte TypeScript | Limitado          | Soporte completo      |
| Escenario aplicable | Componentes simples | Componentes complejos, proyectos grandes |
| Compatibilidad  | Vue 2/3              | Exclusivo de Vue 3    |

## 4. Common Interview Questions

> Preguntas comunes de entrevista

### Pregunta 1: Elegir el estilo de API

Explica en qué situaciones se debe usar Composition API y en cuáles Options API.

<details>
<summary>Clic para ver la respuesta</summary>

**Situaciones para usar Composition API**:

1. **Componentes complejos**: Lógica compleja que necesita mejor organización

   ```vue
   <script setup>
   // Múltiples módulos funcionales, Composition API es más claro
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Necesidad de reutilización de código**: Varios componentes comparten lógica

   ```vue
   <script setup>
   // Usar funciones composable, fáciles de reutilizar
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Proyectos TypeScript**: Se necesita soporte completo de tipos

   ```vue
   <script setup lang="ts">
   // Composition API tiene mejor soporte para TypeScript
   const count = ref<number>(0);
   </script>
   ```

4. **Proyectos grandes**: Se necesita mejor organización lógica y mantenimiento

**Situaciones para usar Options API**:

1. **Componentes simples**: Lógica simple que no necesita organización compleja

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

2. **Proyectos Vue 2**: Se necesita compatibilidad hacia atrás
3. **Familiaridad del equipo**: El equipo está más familiarizado con Options API

**Recomendación**:

- Nuevos proyectos: priorizar Composition API
- Componentes simples: pueden seguir usando Options API
- Componentes complejos: se recomienda usar Composition API

</details>

### Pregunta 2: Organización lógica

Reescribe el siguiente código de Options API a Composition API.

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
<summary>Clic para ver la respuesta</summary>

**Escritura con Composition API**:

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Cargando...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// La lógica relacionada se organiza junta
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

**Mejora: Usando Composable**:

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

### Pregunta 3: Reutilización de código

Explica cómo implementar la reutilización de código con Composition API y compara con Mixins.

<details>
<summary>Clic para ver la respuesta</summary>

**Problemas de Mixins**:

```vue
<script>
// UserMixin.js
export default {
  data() {
    return { user: null };
  },
  methods: {
    fetchUser() { /* ... */ },
  },
};

// PostMixin.js
export default {
  data() {
    return { posts: [] };
  },
  methods: {
    fetchPosts() { /* ... */ },
  },
};

// Component.vue
import UserMixin from './UserMixin';
import PostMixin from './PostMixin';

export default {
  mixins: [UserMixin, PostMixin],
  // Problemas:
  // 1. Conflictos de nombres: si dos mixins tienen propiedades con el mismo nombre
  // 2. Origen de datos poco claro: no se sabe de qué mixin viene user
  // 3. Difícil de rastrear: no se pueden ver claramente todas las propiedades y métodos disponibles
};
</script>
```

**Solución con Composition API**:

```vue
<script setup>
// composables/useUser.js
import { ref } from 'vue';

export function useUser() {
  const user = ref(null);
  const fetchUser = async () => { /* ... */ };
  return { user, fetchUser };
}

// composables/usePosts.js
import { ref } from 'vue';

export function usePosts() {
  const posts = ref([]);
  const fetchPosts = async () => { /* ... */ };
  return { posts, fetchPosts };
}

// Component.vue
import { useUser } from './composables/useUser';
import { usePosts } from './composables/usePosts';

// Ventajas:
// 1. Nombres claros: se sabe de dónde vienen los datos
// 2. Uso selectivo: solo se usa lo necesario
// 3. Fácil de rastrear: el IDE puede autocompletar
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Comparación de diferencias**:

| Característica  | Mixins        | Composables |
| --------------- | ------------- | ----------- |
| Conflictos de nombres | Frecuentes | Se pueden evitar |
| Rastreabilidad  | Baja          | Alta        |
| Uso selectivo   | No            | Sí          |
| Soporte TypeScript | Limitado   | Completo    |
| Escenario       | Vue 2         | Vue 3       |

</details>

## 5. Best Practices

> Mejores prácticas

### Recomendaciones

```vue
<script setup>
// 1. Usar la sintaxis <script setup>
import { ref, computed } from 'vue';

// 2. Organizar la lógica relacionada junta
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Extraer lógica compleja como composable
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. Nombres claros
const userName = ref(''); // ✅ Claro
const u = ref(''); // ❌ No es claro
</script>
```

### Prácticas a evitar

```vue
<script setup>
// 1. No mezclar Options API y Composition API (salvo que sea necesario)
export default {
  setup() {
    // ...
  },
  data() {
    // ❌ Mezclar puede causar confusión
  },
};

// 2. No extraer composables en exceso
// La lógica simple no necesita ser extraída
const count = ref(0); // ✅ Simple, no necesita extracción

// 3. No manipular el DOM directamente en un composable
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // ❌
  return { count };
}
</script>
```

## 6. Interview Summary

> Resumen de entrevista

### Puntos clave para recordar

**Conceptos clave de Composition API**:

- La lógica relacionada se organiza junta
- Se usan composables para reutilizar código
- Mejor soporte para TypeScript
- Adecuado para componentes complejos y proyectos grandes

**Recomendaciones de elección**:

- Nuevos proyectos: priorizar Composition API
- Componentes simples: se puede usar Options API
- Componentes complejos: se recomienda Composition API
- Proyectos TypeScript: se recomienda Composition API

### Ejemplo de respuesta para entrevista

**Q: ¿Cuál es la diferencia entre Composition API y Options API?**

> "Composition API es la nueva forma de escritura introducida en Vue 3. La principal diferencia está en la organización lógica. Options API dispersa la lógica en data, computed, methods y otras opciones, mientras que Composition API permite organizar la lógica relacionada junta. Las ventajas de Composition API incluyen: 1) mejor organización lógica con código relacionado concentrado; 2) reutilización de código más fácil usando composables en lugar de mixins; 3) soporte completo para TypeScript; 4) adecuado para componentes complejos y proyectos grandes. La ventaja de Options API es que tiene una curva de aprendizaje más baja y es adecuado para componentes simples. Ambos pueden coexistir, y Vue 3 soporta ambas formas de escritura."

**Q: ¿Cuándo se debe usar Composition API?**

> "Se recomienda usar Composition API en las siguientes situaciones: 1) componentes complejos que necesitan mejor organización lógica; 2) cuando se necesita reutilizar código entre varios componentes; 3) proyectos TypeScript que necesitan soporte completo de tipos; 4) proyectos grandes que necesitan mejor mantenibilidad. Para componentes simples o cuando el equipo está más familiarizado con Options API, se puede seguir usando Options API. Vue 3 soporta ambas formas de escritura y se puede elegir según las necesidades del proyecto."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
