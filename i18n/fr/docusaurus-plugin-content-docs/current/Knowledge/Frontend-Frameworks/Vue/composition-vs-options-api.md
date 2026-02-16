---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> Qu'est-ce que la Composition API ?

La Composition API est une nouvelle façon d'écrire des composants introduite dans Vue 3, offrant une manière plus flexible d'organiser la logique des composants. Contrairement à l'Options API traditionnelle, la Composition API permet de regrouper la logique associée au lieu de la disperser dans différentes options.

### Options API (Écriture traditionnelle)

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

### Composition API (Nouvelle écriture)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// La logique associée est regroupée
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

> Principales différences entre Composition API et Options API

### 1. Organisation de la logique

**Options API** : La logique est dispersée dans différentes options

```vue
<script>
export default {
  // Les données sont dispersées partout
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // Propriétés calculées dispersées
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // Méthodes dispersées
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
    // Cycle de vie dispersé
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API** : La logique associée est regroupée

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Logique liée à l'utilisateur
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// Logique liée aux articles
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// Logique liée aux commentaires
const comments = ref([]);
const fetchComments = async () => {
  // ...
};

// Cycle de vie
onMounted(() => {
  fetchUser();
  fetchPosts();
});
</script>
```

### 2. Réutilisation du code

**Options API** : Utilisation de Mixins (risque de conflits de noms)

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
  // Avec plusieurs mixins, les conflits de noms sont fréquents
};
</script>
```

**Composition API** : Utilisation de Composables (plus flexible)

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
// Utilisation sélective, évite les conflits de noms
</script>
```

### 3. Support TypeScript

**Options API** : Support TypeScript limité

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // L'inférence de type peut être imprécise
    };
  },
  methods: {
    increment() {
      this.count++; // Le type de this peut être imprécis
    },
  },
});
</script>
```

**Composition API** : Support TypeScript complet

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // Type explicite
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. Tableau comparatif

| Caractéristique | Options API | Composition API |
| --------------- | ------------------ | ------------------- |
| Courbe d'apprentissage | Plus basse | Plus élevée |
| Organisation de la logique | Dispersée dans différentes options | Logique associée regroupée |
| Réutilisation du code | Mixins (conflits fréquents) | Composables (flexible) |
| Support TypeScript | Limité | Complet |
| Cas d'utilisation | Composants simples | Composants complexes, grands projets |
| Rétrocompatibilité | Vue 2/3 supporté | Exclusif à Vue 3 |

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Choix du style d'API

Expliquez dans quelles situations utiliser la Composition API et dans quelles situations utiliser l'Options API.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Situations pour utiliser la Composition API** :

1. **Composants complexes** : Logique complexe nécessitant une meilleure organisation

   ```vue
   <script setup>
   // Plusieurs modules fonctionnels, la Composition API est plus claire
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Besoin de réutilisation de code** : Plusieurs composants partagent la même logique

   ```vue
   <script setup>
   // Fonctions composables, faciles à réutiliser
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **Projets TypeScript** : Nécessité d'un support de types complet

   ```vue
   <script setup lang="ts">
   // La Composition API offre un meilleur support TypeScript
   const count = ref<number>(0);
   </script>
   ```

4. **Grands projets** : Nécessité d'une meilleure organisation de la logique et maintenabilité

**Situations pour utiliser l'Options API** :

1. **Composants simples** : Logique simple, pas besoin d'organisation complexe

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

2. **Projets Vue 2** : Nécessité de rétrocompatibilité
3. **Familiarité de l'équipe** : L'équipe est plus familière avec l'Options API

**Recommandations** :

- Nouveaux projets : privilégier la Composition API
- Composants simples : l'Options API reste acceptable
- Composants complexes : la Composition API est recommandée

</details>

### Question 2 : Organisation de la logique

Réécrivez le code Options API suivant en Composition API.

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
<summary>Cliquez pour voir la réponse</summary>

**Écriture Composition API** :

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Chargement...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// La logique associée est regroupée
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

**Amélioration : Utilisation d'un Composable** :

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

### Question 3 : Réutilisation du code

Expliquez comment utiliser la Composition API pour la réutilisation du code et comparez avec les Mixins.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Problèmes des Mixins** :

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
  // Problèmes :
  // 1. Conflits de noms : si deux mixins ont des propriétés du même nom
  // 2. Source des données floue : on ne sait pas d'où vient user
  // 3. Traçabilité difficile : impossible de voir clairement toutes les propriétés et méthodes disponibles
};
</script>
```

**Solution avec la Composition API** :

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

// Avantages :
// 1. Nommage explicite : on sait clairement d'où viennent les données
// 2. Utilisation sélective : on utilise seulement ce dont on a besoin
// 3. Traçabilité facile : l'IDE peut auto-compléter
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Comparaison** :

| Caractéristique | Mixins | Composables |
| --------------- | -------- | ----------- |
| Conflits de noms | Fréquents | Évitables |
| Traçabilité | Faible | Élevée |
| Utilisation sélective | Non | Oui |
| Support TypeScript | Limité | Complet |
| Cas d'utilisation | Vue 2 | Vue 3 |

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```vue
<script setup>
// 1. Utiliser le sucre syntaxique <script setup>
import { ref, computed } from 'vue';

// 2. Regrouper la logique associée
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Extraire la logique complexe en composable
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. Nommage explicite
const userName = ref(''); // Clair
const u = ref(''); // Pas clair
</script>
```

### Pratiques à éviter

```vue
<script setup>
// 1. Ne pas mélanger Options API et Composition API (sauf si nécessaire)
export default {
  setup() {
    // ...
  },
  data() {
    // Mélanger peut créer de la confusion
  },
};

// 2. Ne pas extraire excessivement en composables
// La logique simple n'a pas besoin d'extraction
const count = ref(0); // Simple, pas besoin d'extraction

// 3. Ne pas manipuler le DOM directement dans un composable
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // Non recommandé
  return { count };
}
</script>
```

## 6. Interview Summary

> Résumé d'entretien

### Aide-mémoire

**Concepts clés de la Composition API** :

- Logique associée regroupée
- Réutilisation du code via les composables
- Meilleur support TypeScript
- Adapté aux composants complexes et grands projets

**Recommandations** :

- Nouveau projet : privilégier la Composition API
- Composant simple : l'Options API convient
- Composant complexe : la Composition API est recommandée
- Projet TypeScript : la Composition API est recommandée

### Exemples de réponses en entretien

**Q: Quelle est la différence entre Composition API et Options API ?**

> "La Composition API est une nouvelle écriture introduite dans Vue 3. La principale différence réside dans l'organisation de la logique. L'Options API disperse la logique dans data, computed, methods, etc., tandis que la Composition API permet de regrouper la logique associée. Les avantages de la Composition API incluent : 1) une meilleure organisation de la logique ; 2) une réutilisation du code plus facile via les composables plutôt que les mixins ; 3) un support TypeScript complet ; 4) adaptée aux composants complexes et aux grands projets. L'avantage de l'Options API est sa courbe d'apprentissage plus basse, adaptée aux composants simples. Les deux peuvent coexister, Vue 3 supporte les deux écritures."

**Q: Quand utiliser la Composition API ?**

> "Il est recommandé d'utiliser la Composition API dans les situations suivantes : 1) composants complexes nécessitant une meilleure organisation ; 2) besoin de réutilisation du code entre plusieurs composants ; 3) projets TypeScript nécessitant un support de types complet ; 4) grands projets nécessitant une meilleure maintenabilité. Pour les composants simples ou lorsque l'équipe est plus familière avec l'Options API, on peut continuer à utiliser l'Options API. Vue 3 supporte les deux écritures, le choix dépend des besoins du projet."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
