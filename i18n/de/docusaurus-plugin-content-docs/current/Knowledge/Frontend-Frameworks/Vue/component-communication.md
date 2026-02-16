---
id: vue-component-communication
title: '[Medium] Komponentenkommunikation'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> Welche Moeglichkeiten gibt es fuer die Kommunikation zwischen Vue-Komponenten?

Die Datenuebertragung zwischen Vue-Komponenten ist eine sehr haeufige Anforderung in der Entwicklung. Je nach Beziehung zwischen den Komponenten stehen verschiedene Kommunikationsmethoden zur Verfuegung.

### Klassifizierung der Komponentenbeziehungen

```text
Eltern-Kind: props / $emit
Grosseltern-Enkel: provide / inject
Geschwister: Event Bus / Vuex / Pinia
Beliebige Komponenten: Vuex / Pinia
```

### 1. Props (Eltern an Kind)

**Verwendung**: Elternkomponente uebergibt Daten an die Kindkomponente

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Elternkomponente</h1>
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
    <h2>Kindkomponente</h2>
    <p>Empfangene Nachricht: {{ message }}</p>
    <p>Benutzer: {{ user.name }} ({{ user.age }} Jahre)</p>
    <p>Zaehler: {{ count }}</p>
  </div>
</template>

<script setup>
// Grundlegende Typvalidierung
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // Objekt-Typvalidierung
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // Numerische Typvalidierung
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // Benutzerdefinierte Validierung: muss >= 0 sein
  },
});
</script>
```

#### Hinweise zu Props

```vue
<!-- Vue 3 <script setup> Schreibweise -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // Falsch: Props sollten nicht direkt modifiziert werden
  // props.message = 'new value'; // Erzeugt eine Warnung

  // Richtig: Props wurden oben bereits in ein ref kopiert
  localMessage.value = props.message;
});
</script>
```

### 2. $emit (Kind an Eltern)

**Verwendung**: Kindkomponente sendet Events und Daten an die Elternkomponente

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">An Eltern senden</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // Event an die Elternkomponente senden
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // Eingabewert in Echtzeit senden
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Elternkomponente</h1>

    <!-- Events der Kindkomponente abhoeren -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>Empfangene Daten: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('Event vom Kind empfangen:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Eingabewert aktualisiert:', value);
};
</script>
```

#### emits-Option in Vue 3

```vue
<!-- Vue 3 <script setup> Schreibweise -->
<script setup>
const emit = defineEmits({
  // Events deklarieren, die gesendet werden
  'custom-event': null,

  // Event mit Validierung
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue muss ein String sein');
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

### 3. v-model (Bidirektionale Bindung)

**Verwendung**: Bidirektionale Datenbindung zwischen Eltern- und Kindkomponenten

#### v-model in Vue 2

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- Entspricht -->
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

#### v-model in Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- Entspricht -->
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

#### Mehrere v-model in Vue 3

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
      placeholder="Name"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="E-Mail"
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

### 4. Provide / Inject (Grosseltern-Enkel-Komponenten)

**Verwendung**: Kommunikation ueber mehrere Ebenen hinweg, vermeidet schichtweises Weiterreichen von Props

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Grosselternkomponente</h1>
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

    // Daten und Methoden fuer Nachfahrenkomponenten bereitstellen
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
    <h2>Elternkomponente (verwendet kein inject)</h2>
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
    <h3>Kindkomponente</h3>
    <p>Benutzer: {{ userInfo.name }}</p>
    <p>Rolle: {{ userInfo.role }}</p>
    <button @click="changeUser">Benutzer aendern</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // Daten der Grosselternkomponente injizieren
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

#### Hinweise zu Provide / Inject

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // Falsch: Nachfahrenkomponenten koennen direkt aendern
    provide('state', state);

    // Richtig: Schreibgeschuetzte Daten und Aenderungsmethoden bereitstellen
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs (Eltern greift auf Kind zu)

**Verwendung**: Elternkomponente greift direkt auf Eigenschaften und Methoden der Kindkomponente zu

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">Kind-Methode aufrufen</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // Methode der Kindkomponente direkt aufrufen
      this.$refs.childRef.someMethod();

      // Auf Daten der Kindkomponente zugreifen
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // $refs erst nach mounted zugreifbar
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
      console.log('Methode der Kindkomponente wurde aufgerufen');
    },
  },
};
</script>
```

#### ref mit Composition API in Vue 3

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Kindkomponente aufrufen</button>
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

### 6. $parent / $root (Kind greift auf Eltern zu)

**Verwendung**: Kindkomponente greift auf Eltern- oder Wurzelkomponente zu (nicht empfohlen)

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // Auf Elternkomponente zugreifen
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // Auf Wurzelkomponente zugreifen
    console.log(this.$root.globalData);
  },
};
</script>
```

**Gruende, warum es nicht empfohlen wird**:

- Erhoeht die Kopplung zwischen Komponenten
- Datenfluss schwer nachverfolgbar
- Nachteilig fuer die Wiederverwendbarkeit von Komponenten
- Verwenden Sie stattdessen Props, $emit oder Provide/Inject

### 7. Event Bus (Beliebige Komponenten)

**Verwendung**: Kommunikation zwischen beliebigen Komponenten (in Vue 2 ueblich, in Vue 3 nicht empfohlen)

#### Event Bus in Vue 2

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
      console.log('Nachricht empfangen:', data);
    });
  },

  beforeUnmount() {
    // Listener entfernen nicht vergessen
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Alternative in Vue 3: mitt

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
  console.log('Nachricht empfangen:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia (Globale Zustandsverwaltung)

**Verwendung**: Komplexen globalen Zustand verwalten

#### Pinia (Empfohlen fuer Vue 3)

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
    <button @click="handleLogin">Anmelden</button>
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
    <p v-if="userStore.isLoggedIn">Willkommen, {{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots (Inhaltsverteilung)

**Verwendung**: Elternkomponente uebergibt Template-Inhalte an die Kindkomponente

#### Grundlegender Slot

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Standardtitel</slot>
    </header>

    <main>
      <slot>Standardinhalt</slot>
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
      <h1>Benutzerdefinierter Titel</h1>
    </template>

    <p>Dies ist der Hauptinhalt</p>

    <template #footer>
      <button>Bestaetigen</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots (Slots mit Gueltigkeitsbereich)

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Daten an die Elternkomponente uebergeben -->
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
    <!-- Von der Kindkomponente uebergebene Daten empfangen -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Leitfaden zur Auswahl der Kommunikationsmethode

| Beziehung | Empfohlene Methode | Anwendungsfall |
| -------- | -------------- | -------------------------- |
| Eltern -> Kind | Props | Daten an Kind uebergeben |
| Kind -> Eltern | $emit | Eltern ueber Events benachrichtigen |
| Eltern ↔ Kind | v-model | Bidirektionale Formularbindung |
| Grosseltern -> Enkel | Provide/Inject | Ebenuebergreifende Datenuebertragung |
| Eltern -> Kind | $refs | Kind-Methoden direkt aufrufen (selten) |
| Beliebig | Pinia/Vuex | Globale Zustandsverwaltung |
| Beliebig | Event Bus | Einfache Eventkommunikation (nicht empfohlen) |
| Eltern -> Kind | Slots | Template-Inhalte uebergeben |

### Praxisbeispiel: Warenkorb-Funktionalitaet

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Pinia fuer globale Warenkorb-Zustandsverwaltung verwenden -->
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
      <button @click="addToCart(product)">In den Warenkorb</button>
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
    <h1>Online-Shop</h1>
    <div>Warenkorb: {{ cartStore.itemCount }} Artikel</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Was ist der Unterschied zwischen Props und Provide/Inject?

### Props

**Eigenschaften**:

- Geeignet fuer direkte Eltern-Kind-Kommunikation
- Klarer Datenfluss
- Umfassende Typueberpruefung
- Bei tiefer Verschachtelung schichtweises Weiterreichen erforderlich (Props Drilling)

```vue
<!-- Schichtweises Weiterreichen erforderlich -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Eigenschaften**:

- Geeignet fuer ebenuebergreifende Kommunikation zwischen Grosseltern und Enkeln
- Kein schichtweises Weiterreichen erforderlich
- Datenherkunft nicht offensichtlich
- Schwaeachere Typueberpruefung

```vue
<!-- Ebenuebergreifende Uebertragung, Zwischenschichten muessen nicht empfangen -->
<grandparent> <!-- provide -->
  <parent> <!-- muss nicht behandeln -->
    <child> <!-- muss nicht behandeln -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Verwendungsempfehlungen

- **Props verwenden**: Eltern-Kind-Kommunikation, wenn der Datenfluss klar sein muss
- **Provide/Inject verwenden**: Tiefe Verschachtelung, Theme, Sprache, Authentifizierungsinformationen und andere globale Konfigurationen

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
