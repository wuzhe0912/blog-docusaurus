---
id: composition-vs-options-api
title: '[Medium] Composition API vs Options API'
slug: /composition-vs-options-api
tags: [Vue, Quiz, Medium]
---

## 1. What is Composition API?

> Was ist die Composition API?

Die Composition API ist eine neue Art der Komponentenentwicklung, die in Vue 3 eingefuehrt wurde. Sie bietet eine flexiblere Moeglichkeit, die Komponentenlogik zu organisieren. Im Gegensatz zur traditionellen Options API ermoeglicht die Composition API, zusammengehoerige Logik gemeinsam zu organisieren, anstatt sie auf verschiedene Optionen zu verteilen.

### Options API (Traditionelle Schreibweise)

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

### Composition API (Neue Schreibweise)

```vue
<template>
  <div>
    <p>{{ fullName }}</p>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Zusammengehoerige Logik gemeinsam organisiert
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

> Hauptunterschiede zwischen Composition API und Options API

### 1. Logikorganisation

**Options API**: Logik auf verschiedene Optionen verteilt

```vue
<script>
export default {
  // Daten ueberall verstreut
  data() {
    return {
      user: null,
      posts: [],
      comments: [],
    };
  },
  computed: {
    // Berechnete Eigenschaften verstreut
    userName() {
      return this.user?.name;
    },
    postCount() {
      return this.posts.length;
    },
  },
  methods: {
    // Methoden verstreut
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
    // Lifecycle verstreut
    this.fetchUser();
    this.fetchPosts();
  },
};
</script>
```

**Composition API**: Zusammengehoerige Logik gemeinsam organisiert

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

// Benutzerbezogene Logik
const user = ref(null);
const userName = computed(() => user.value?.name);
const fetchUser = async () => {
  // ...
};

// Beitragsbezogene Logik
const posts = ref([]);
const postCount = computed(() => posts.value.length);
const fetchPosts = async () => {
  // ...
};

// Kommentarbezogene Logik
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

### 2. Code-Wiederverwendung

**Options API**: Verwendet Mixins (anfaellig fuer Namenskonflikte)

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
  // Bei mehreren Mixins koennen leicht Namenskonflikte auftreten
};
</script>
```

**Composition API**: Verwendet Composables (flexibler)

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
// Selektive Nutzung moeglich, Namenskonflikte vermeidbar
</script>
```

### 3. TypeScript-Unterstuetzung

**Options API**: Eingeschraenkte TypeScript-Unterstuetzung

```vue
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      count: 0, // Typinferenz kann ungenau sein
    };
  },
  methods: {
    increment() {
      this.count++; // Typ von this kann ungenau sein
    },
  },
});
</script>
```

**Composition API**: Vollstaendige TypeScript-Unterstuetzung

```vue
<script setup lang="ts">
import { ref } from 'vue';

const count = ref<number>(0); // Expliziter Typ
const increment = (): void => {
  count.value++;
};
</script>
```

### 3. Vergleichstabelle

| Eigenschaft | Options API | Composition API |
| --------------- | ------------------ | ------------------- |
| Lernkurve | Niedriger | Hoeher |
| Logikorganisation | Auf Optionen verteilt | Zusammengehoerige Logik zusammen |
| Code-Wiederverwendung | Mixins (konfliktanfaellig) | Composables (flexibel) |
| TypeScript-Unterstuetzung | Eingeschraenkt | Vollstaendig |
| Anwendungsfall | Einfache Komponenten | Komplexe Komponenten, grosse Projekte |
| Abwaertskompatibilitaet | Vue 2/3 unterstuetzt | Exklusiv fuer Vue 3 |

## 4. Common Interview Questions

> Haeufige Interviewfragen

### Frage 1: API-Stil waehlen

Erklaeren Sie, in welchen Situationen Composition API und in welchen Options API verwendet werden sollte.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Situationen fuer Composition API**:

1. **Komplexe Komponenten**: Komplexe Logik, die bessere Organisation benoetigt

   ```vue
   <script setup>
   // Mehrere Funktionsmodule, Composition API ist klarer
   const { user, fetchUser } = useUser();
   const { posts, fetchPosts } = usePosts();
   const { comments, fetchComments } = useComments();
   </script>
   ```

2. **Code-Wiederverwendung noetig**: Mehrere Komponenten teilen sich Logik

   ```vue
   <script setup>
   // Composable-Funktionen, einfach wiederverwendbar
   const { count, increment, decrement } = useCounter();
   </script>
   ```

3. **TypeScript-Projekte**: Vollstaendige Typunterstuetzung erforderlich

   ```vue
   <script setup lang="ts">
   // Composition API bietet bessere TypeScript-Unterstuetzung
   const count = ref<number>(0);
   </script>
   ```

4. **Grosse Projekte**: Bessere Logikorganisation und Wartbarkeit noetig

**Situationen fuer Options API**:

1. **Einfache Komponenten**: Einfache Logik, keine komplexe Organisation noetig

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

2. **Vue 2-Projekte**: Abwaertskompatibilitaet erforderlich
3. **Team-Vertrautheit**: Team ist mit Options API vertrauter

**Empfehlung**:

- Neue Projekte: Composition API bevorzugen
- Einfache Komponenten: Options API kann weiter verwendet werden
- Komplexe Komponenten: Composition API empfohlen

</details>

### Frage 2: Logikorganisation

Schreiben Sie den folgenden Options-API-Code in Composition API um.

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
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Composition API Schreibweise**:

```vue
<template>
  <div>
    <input v-model="searchQuery" />
    <div v-if="isLoading">Laden...</div>
    <ul>
      <li v-for="item in filteredResults" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Zusammengehoerige Logik gemeinsam organisiert
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

**Verbesserung: Composable verwenden**:

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

### Frage 3: Code-Wiederverwendung

Erklaeren Sie, wie man mit der Composition API Code-Wiederverwendung implementiert, und vergleichen Sie mit Mixins.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Probleme mit Mixins**:

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
  // Probleme:
  // 1. Namenskonflikte: Wenn zwei Mixins gleichnamige Eigenschaften haben
  // 2. Unklare Datenherkunft: Unklar, woher user stammt
  // 3. Schwer nachverfolgbar: Verfuegbare Eigenschaften und Methoden nicht klar ersichtlich
};
</script>
```

**Loesung mit Composition API**:

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

// Vorteile:
// 1. Eindeutige Benennung: Datenherkunft klar
// 2. Selektive Nutzung: Nur benoetigte Teile verwenden
// 3. Einfach nachverfolgbar: IDE kann automatisch vervollstaendigen
const { user, fetchUser } = useUser();
const { posts, fetchPosts } = usePosts();
</script>
```

**Unterschiede**:

| Eigenschaft | Mixins | Composables |
| --------------- | -------- | ----------- |
| Namenskonflikte | Haeufig | Vermeidbar |
| Nachverfolgbarkeit | Niedrig | Hoch |
| Selektivitaet | Keine | Vorhanden |
| TypeScript-Unterstuetzung | Eingeschraenkt | Vollstaendig |
| Anwendungsfall | Vue 2 | Vue 3 |

</details>

## 5. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

```vue
<script setup>
// 1. <script setup>-Syntax verwenden
import { ref, computed } from 'vue';

// 2. Zusammengehoerige Logik gemeinsam organisieren
const count = ref(0);
const doubleCount = computed(() => count.value * 2);
const increment = () => count.value++;

// 3. Komplexe Logik in Composables auslagern
import { useCounter } from './composables/useCounter';
const { count, increment } = useCounter();

// 4. Eindeutige Benennung
const userName = ref(''); // Klar
const u = ref(''); // Unklar
</script>
```

### Zu vermeidende Vorgehensweisen

```vue
<script setup>
// 1. Options API und Composition API nicht mischen (es sei denn noetig)
export default {
  setup() {
    // ...
  },
  data() {
    // Mischen verursacht Verwirrung
  },
};

// 2. Composables nicht uebertrieben auslagern
// Einfache Logik muss nicht ausgelagert werden
const count = ref(0); // Einfach, keine Auslagerung noetig

// 3. DOM nicht direkt in Composables manipulieren
function useCounter() {
  const count = ref(0);
  document.getElementById('counter').textContent = count.value; // Falsch
  return { count };
}
</script>
```

## 6. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**Kernkonzepte der Composition API**:

- Zusammengehoerige Logik gemeinsam organisieren
- Code-Wiederverwendung mit Composables
- Bessere TypeScript-Unterstuetzung
- Geeignet fuer komplexe Komponenten und grosse Projekte

**Auswahlempfehlungen**:

- Neue Projekte: Composition API bevorzugen
- Einfache Komponenten: Options API kann verwendet werden
- Komplexe Komponenten: Composition API empfohlen
- TypeScript-Projekte: Composition API empfohlen

### Beispielantwort fuer Interviews

**F: Was ist der Unterschied zwischen Composition API und Options API?**

> "Die Composition API ist eine neue Schreibweise, die in Vue 3 eingefuehrt wurde. Der Hauptunterschied liegt in der Logikorganisation. Die Options API verteilt die Logik auf data, computed, methods und andere Optionen, waehrend die Composition API es ermoeglicht, zusammengehoerige Logik gemeinsam zu organisieren. Zu den Vorteilen der Composition API gehoeren: 1) Bessere Logikorganisation mit zusammengehoeriger Code-Konzentration; 2) Einfachere Code-Wiederverwendung mit Composables statt Mixins; 3) Vollstaendige TypeScript-Unterstuetzung; 4) Geeignet fuer komplexe Komponenten und grosse Projekte. Der Vorteil der Options API ist die niedrigere Lernkurve, geeignet fuer einfache Komponenten. Beide koennen koexistieren, Vue 3 unterstuetzt beide Schreibweisen."

**F: Wann sollte man die Composition API verwenden?**

> "Die Composition API wird in folgenden Situationen empfohlen: 1) Komplexe Komponenten, die bessere Logikorganisation benoetigen; 2) Code-Wiederverwendung bei mehreren Komponenten; 3) TypeScript-Projekte mit vollstaendiger Typunterstuetzung; 4) Grosse Projekte mit besserer Wartbarkeit. Fuer einfache Komponenten oder Teams, die mit Options API vertrauter sind, kann die Options API weiter verwendet werden. Vue 3 unterstuetzt beide Schreibweisen, die je nach Projektanforderungen gewaehlt werden koennen."

## Reference

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Composition API RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0013-composition-api.md)
- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
