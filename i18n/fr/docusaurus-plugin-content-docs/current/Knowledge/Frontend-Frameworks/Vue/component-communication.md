---
id: vue-component-communication
title: '[Medium] Communication entre composants'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Quels sont les moyens de communication entre les composants Vue ?

La transmission de données entre composants Vue est un besoin très courant en développement. Selon la relation entre les composants, il existe plusieurs moyens de communication.

### Classification des relations entre composants

```text
Parent-enfant : props / $emit
Ancêtre-descendant : provide / inject
Composants frères : Event Bus / Vuex / Pinia
Composants quelconques : Vuex / Pinia
```

### 1. Props (Parent vers enfant)

**Usage** : Le composant parent transmet des données au composant enfant

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Composant parent</h1>
    <ChildComponent
      :message="parentMessage"
      :user="userInfo"
      :count="counter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const parentMessage = ref('Hello from parent');
const userInfo = ref({
  name: 'John',
  age: 30,
});
const counter = ref(0);
</script>
```

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h2>Composant enfant</h2>
    <p>Message reçu : {{ message }}</p>
    <p>Utilisateur : {{ user.name }} ({{ user.age }} ans)</p>
    <p>Compteur : {{ count }}</p>
  </div>
</template>

<script setup>
// Validation de type basique
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // Validation de type objet
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // Validation de type nombre
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // Validation personnalisée : doit être >= 0
  },
});
</script>
```

#### Points d'attention pour les Props

```vue
<!-- Écriture Vue 3 <script setup> -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ Erreur : ne pas modifier directement les props
  // props.message = 'new value'; // Provoque un avertissement

  // ✅ Correct : copier les props dans un ref comme ci-dessus
  localMessage.value = props.message;
});
</script>
```

### 2. $emit (Enfant vers parent)

**Usage** : Le composant enfant envoie des événements et des données au composant parent

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">Envoyer au parent</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // Envoyer un événement au composant parent
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // Envoyer la valeur d'entrée en temps réel
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Composant parent</h1>

    <!-- Écouter les événements du composant enfant -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>Données reçues : {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('Événement reçu du composant enfant:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Valeur mise à jour:', value);
};
</script>
```

#### L'option emits de Vue 3

```vue
<!-- Écriture Vue 3 <script setup> -->
<script setup>
const emit = defineEmits({
  // Déclaration des événements émis
  'custom-event': null,

  // Événement avec validation
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue doit être une chaîne de caractères');
      return false;
    }
    return true;
  },
});

const sendEvent = () => {
  emit('custom-event', 'data');
};
</script>
```

### 3. v-model (Liaison bidirectionnelle)

**Usage** : Liaison bidirectionnelle de données entre composants parent et enfant

#### v-model dans Vue 2

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- Équivalent à -->
  <custom-input :value="message" @input="message = $event" />
</template>
```

```vue
<!-- CustomInput.vue (Vue 2) -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### v-model dans Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- Équivalent à -->
  <custom-input :modelValue="message" @update:modelValue="message = $event" />
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from './CustomInput.vue';

const message = ref('');
</script>
```

```vue
<!-- CustomInput.vue - Vue 3 <script setup> -->
<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<script setup>
defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
```

#### Multiples v-model dans Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <user-form v-model:name="userName" v-model:email="userEmail" />
</template>

<script setup>
import { ref } from 'vue';
import UserForm from './UserForm.vue';

const userName = ref('');
const userEmail = ref('');
</script>
```

```vue
<!-- UserForm.vue - Vue 3 <script setup> -->
<template>
  <div>
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Nom"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="E-mail"
    />
  </div>
</template>

<script setup>
defineProps({
  name: String,
  email: String,
});

defineEmits(['update:name', 'update:email']);
</script>
```

### 4. Provide / Inject (Composants ancêtre-descendant)

**Usage** : Communication inter-niveaux entre composants, évitant le passage en cascade des props

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Composant grand-parent</h1>
    <parent-component />
  </div>
</template>

<script>
import { ref, provide } from 'vue';
import ParentComponent from './ParentComponent.vue';

export default {
  components: { ParentComponent },

  setup() {
    const userInfo = ref({
      name: 'John',
      role: 'admin',
    });

    const updateUser = (newInfo) => {
      userInfo.value = { ...userInfo.value, ...newInfo };
    };

    // Fournir des données et méthodes aux composants descendants
    provide('userInfo', userInfo);
    provide('updateUser', updateUser);

    return { userInfo };
  },
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h2>Composant parent (n'utilise pas inject)</h2>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h3>Composant enfant</h3>
    <p>Utilisateur : {{ userInfo.name }}</p>
    <p>Rôle : {{ userInfo.role }}</p>
    <button @click="changeUser">Modifier l'utilisateur</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // Injecter les données fournies par le composant grand-parent
    const userInfo = inject('userInfo');
    const updateUser = inject('updateUser');

    const changeUser = () => {
      updateUser({ name: 'Jane', role: 'user' });
    };

    return {
      userInfo,
      changeUser,
    };
  },
};
</script>
```

#### Points d'attention pour Provide / Inject

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ Erreur : les descendants peuvent modifier directement
    provide('state', state);

    // ✅ Correct : fournir des données en lecture seule et des méthodes de modification
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs (Parent accède à l'enfant)

**Usage** : Le composant parent accède directement aux propriétés et méthodes du composant enfant

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">Appeler la méthode du composant enfant</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // Appeler directement la méthode du composant enfant
      this.$refs.childRef.someMethod();

      // Accéder aux données du composant enfant
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ $refs n'est accessible qu'après mounted
    console.log(this.$refs.childRef);
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  data() {
    return {
      someData: 'Child data',
    };
  },

  methods: {
    someMethod() {
      console.log('La méthode du composant enfant a été appelée');
    },
  },
};
</script>
```

#### ref avec Composition API de Vue 3

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Appeler le composant enfant</button>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref(null);

const callChild = () => {
  childRef.value.someMethod();
};
</script>
```

### 6. $parent / $root (Enfant accède au parent)

**Usage** : Le composant enfant accède au composant parent ou au composant racine (déconseillé)

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // Accéder au composant parent
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // Accéder au composant racine
    console.log(this.$root.globalData);
  },
};
</script>
```

**Raisons pour lesquelles c'est déconseillé** :

- Augmente le couplage entre les composants
- Difficile de tracer le flux de données
- Défavorable à la réutilisation des composants
- Il est recommandé d'utiliser props, $emit ou provide/inject à la place

### 7. Event Bus (Composants quelconques)

**Usage** : Communication entre composants quelconques (courant en Vue 2, déconseillé en Vue 3)

#### Event Bus en Vue 2

```js
// eventBus.js
import Vue from 'vue';
export const EventBus = new Vue();
```

```vue
<!-- ComponentA.vue -->
<script>
import { EventBus } from './eventBus';

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message-sent', {
        text: 'Hello',
        from: 'ComponentA',
      });
    },
  },
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script>
import { EventBus } from './eventBus';

export default {
  mounted() {
    EventBus.$on('message-sent', (data) => {
      console.log('Message reçu:', data);
    });
  },

  beforeUnmount() {
    // N'oubliez pas de supprimer l'écouteur
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Alternative en Vue 3 : mitt

```js
// eventBus.js
import mitt from 'mitt';
export const emitter = mitt();
```

```vue
<!-- ComponentA.vue -->
<script setup>
import { emitter } from './eventBus';

const sendMessage = () => {
  emitter.emit('message-sent', {
    text: 'Hello',
    from: 'ComponentA',
  });
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handleMessage = (data) => {
  console.log('Message reçu:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia (Gestion d'état global)

**Usage** : Gérer un état global complexe

#### Pinia (Recommandé pour Vue 3)

```js
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    isLoggedIn: false,
  }),

  getters: {
    fullInfo: (state) => `${state.name} (${state.email})`,
  },

  actions: {
    login(name, email) {
      this.name = name;
      this.email = email;
      this.isLoggedIn = true;
    },

    logout() {
      this.name = '';
      this.email = '';
      this.isLoggedIn = false;
    },
  },
});
```

```vue
<!-- ComponentA.vue -->
<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleLogin = () => {
  userStore.login('John', 'john@example.com');
};
</script>

<template>
  <div>
    <button @click="handleLogin">Connexion</button>
  </div>
</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div>
    <p v-if="userStore.isLoggedIn">Bienvenue, {{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots (Distribution de contenu)

**Usage** : Le composant parent transmet du contenu de template au composant enfant

#### Slot de base

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Titre par défaut</slot>
    </header>

    <main>
      <slot>Contenu par défaut</slot>
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component>
    <template #header>
      <h1>Titre personnalisé</h1>
    </template>

    <p>Ceci est le contenu principal</p>

    <template #footer>
      <button>Confirmer</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots (Slots à portée)

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Transmettre les données au composant parent -->
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['items'],
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <list-component :items="users">
    <!-- Recevoir les données transmises par le composant enfant -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Guide de choix des modes de communication entre composants

| Relation | Méthode recommandée | Cas d'utilisation |
| -------- | -------------- | -------------------------- |
| Parent vers enfant | Props | Transmettre des données au composant enfant |
| Enfant vers parent | $emit | Notifier le parent d'un événement |
| Parent et enfant | v-model | Liaison bidirectionnelle de formulaire |
| Ancêtre vers descendant | Provide/Inject | Transmission de données inter-niveaux |
| Parent vers enfant | $refs | Appeler directement des méthodes enfant (rare) |
| Composants quelconques | Pinia/Vuex | Gestion d'état global |
| Composants quelconques | Event Bus | Communication simple (déconseillé) |
| Parent vers enfant | Slots | Transmettre du contenu de template |

### Cas pratique : Fonctionnalité de panier d'achat

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Gestion de l'état global du panier avec Pinia -->
    <header-component />
    <product-list />
    <cart-component />
  </div>
</template>
```

```js
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  getters: {
    totalPrice: (state) => {
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    itemCount: (state) => state.items.length,
  },

  actions: {
    addItem(product) {
      const existing = this.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },

    removeItem(productId) {
      const index = this.items.findIndex((item) => item.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
  },
});
```

```vue
<!-- ProductList.vue -->
<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const products = [
  { id: 1, name: 'iPhone', price: 30000 },
  { id: 2, name: 'iPad', price: 20000 },
];

const addToCart = (product) => {
  cartStore.addItem(product);
};
</script>

<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>${{ product.price }}</p>
      <button @click="addToCart(product)">Ajouter au panier</button>
    </div>
  </div>
</template>
```

```vue
<!-- HeaderComponent.vue -->
<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <header>
    <h1>Boutique en ligne</h1>
    <div>Panier : {{ cartStore.itemCount }} article(s)</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Quelle est la différence entre Props et Provide/Inject ?

### Props

**Caractéristiques** :

- Adapté à la communication directe parent-enfant
- Flux de données clair
- Vérification de type complète
- Nécessite un passage en cascade pour les composants profondément imbriqués (props drilling)

```vue
<!-- Passage en cascade nécessaire -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Caractéristiques** :

- Adapté à la communication inter-niveaux ancêtre-descendant
- Pas besoin de passage en cascade
- Source des données moins évidente
- Vérification de type plus faible

```vue
<!-- Transmission inter-niveaux, les couches intermédiaires n'ont pas besoin de recevoir -->
<grandparent> <!-- provide -->
  <parent> <!-- pas besoin de traiter -->
    <child> <!-- pas besoin de traiter -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Recommandations d'utilisation

- **Utiliser Props** : composants parent-enfant, quand le flux de données doit être clair
- **Utiliser Provide/Inject** : imbrication profonde, thème, langue, authentification et autres configurations globales

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
