---
id: vue-component-communication
title: '[Medium] 📄 Comunicazione tra Componenti'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. Quali sono i modi per far comunicare i componenti Vue tra loro?

> Quali pattern di comunicazione esistono tra i componenti Vue?

La strategia di comunicazione tra componenti dipende dall'ambito della relazione.

### Categorie di relazione

```text
Parent <-> Child: props / emit / v-model / refs
Ancestor <-> Descendant: provide / inject
Sibling / componenti non correlati: Pinia/Vuex (o event emitter per casi semplici)
```

### 1. Props (genitore → figlio)

**Scopo**: il genitore passa dati al figlio.

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Genitore</h1>
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
const userInfo = ref({ name: 'John', age: 30 });
const counter = ref(0);
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Figlio</h2>
    <p>Messaggio: {{ message }}</p>
    <p>Utente: {{ user.name }} ({{ user.age }})</p>
    <p>Contatore: {{ count }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0,
  },
});
</script>
```

#### Note sulle Props

- Le Props sono unidirezionali verso il basso (il genitore è la fonte di verità)
- Non modificare le props direttamente nel figlio
- Se è necessaria una modifica locale, copiare in un `ref` locale

```vue
<script setup>
import { ref } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);
</script>
```

### 2. Emit (figlio → genitore)

**Scopo**: il figlio notifica il genitore attraverso eventi.

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <button @click="sendToParent">Invia al genitore</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);
const inputValue = ref('');

const sendToParent = () => {
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Genitore</h1>
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />
    <p>Ricevuto: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Input aggiornato:', value);
};
</script>
```

#### Validazione degli emits in Vue 3

```vue
<script setup>
const emit = defineEmits({
  'custom-event': null,
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue deve essere una stringa');
      return false;
    }
    return true;
  },
});

emit('custom-event', 'data');
</script>
```

### 3. v-model (contratto bidirezionale genitore-figlio)

#### Stile Vue 2

```vue
<!-- Genitore -->
<custom-input v-model="message" />
<!-- equivalente -->
<custom-input :value="message" @input="message = $event" />
```

```vue
<!-- Figlio in Vue 2 -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### Stile Vue 3

```vue
<!-- Genitore -->
<custom-input v-model="message" />
<!-- equivalente -->
<custom-input :modelValue="message" @update:modelValue="message = $event" />
```

```vue
<!-- Figlio in Vue 3 -->
<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<script setup>
defineProps({ modelValue: String });
const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
```

#### v-model multipli in Vue 3

```vue
<!-- Genitore -->
<user-form v-model:name="userName" v-model:email="userEmail" />
```

```vue
<!-- Figlio -->
<template>
  <div>
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Nome"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="Email"
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

### 4. Provide / Inject (antenato ↔ discendente)

**Scopo**: comunicazione tra livelli senza prop drilling.

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Nonno</h1>
    <parent-component />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue';

const userInfo = ref({ name: 'John', role: 'admin' });

const updateUser = (newInfo) => {
  userInfo.value = { ...userInfo.value, ...newInfo };
};

provide('userInfo', userInfo);
provide('updateUser', updateUser);
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h3>Figlio</h3>
    <p>Utente: {{ userInfo.name }}</p>
    <p>Ruolo: {{ userInfo.role }}</p>
    <button @click="changeUser">Aggiorna utente</button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const userInfo = inject('userInfo');
const updateUser = inject('updateUser');

const changeUser = () => {
  updateUser({ name: 'Jane', role: 'user' });
};
</script>
```

#### Note su Provide/Inject

- Ottimo per contesto condiviso in alberi profondi (tema/i18n/configurazione)
- Meno esplicito delle props, quindi la denominazione/documentazione è importante
- Considerare readonly + API di mutazione esplicita

```vue
<script setup>
import { ref, readonly, provide } from 'vue';

const state = ref({ count: 0 });
provide('state', readonly(state));
provide('updateState', (newState) => {
  state.value = newState;
});
</script>
```

### 5. Refs (il genitore accede direttamente all'istanza del figlio)

**Scopo**: accesso imperativo (chiamare metodi esposti dal figlio, leggere lo stato esposto).

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Chiama metodo del figlio</button>
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

Usare con parsimonia. Preferire prima il flusso di dati dichiarativo.

### 6. `$parent` / `$root` (non raccomandato)

Accedere direttamente al genitore/root aumenta l'accoppiamento e rende il flusso di dati difficile da comprendere.
Preferire props/emit/provide o store.

### 7. Event Bus (legacy/semplice pub-sub)

Vue 2 usava spesso `new Vue()` come event bus.
In Vue 3, usare un piccolo emitter come `mitt` solo per canali di eventi leggeri.

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
  emitter.emit('message-sent', { text: 'Hello', from: 'ComponentA' });
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handleMessage = (data) => {
  console.log('ricevuto:', data);
};

onMounted(() => emitter.on('message-sent', handleMessage));
onUnmounted(() => emitter.off('message-sent', handleMessage));
</script>
```

### 8. Vuex / Pinia (gestione dello stato globale)

**Scopo**: stato globale condiviso per app medie/grandi.

Pinia è la soluzione store raccomandata per Vue 3.

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

### 9. Slots (proiezione di contenuto)

**Scopo**: il genitore passa contenuto template nelle regioni del figlio.

#### Slots base

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Header Predefinito</slot>
    </header>
    <main>
      <slot>Contenuto Predefinito</slot>
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
      <h1>Header Personalizzato</h1>
    </template>

    <p>Contenuto del corpo principale</p>

    <template #footer>
      <button>Conferma</button>
    </template>
  </child-component>
</template>
```

#### Scoped slots

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script setup>
defineProps({ items: Array });
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <list-component :items="users">
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Guida alla scelta della comunicazione

| Relazione | Approccio raccomandato | Uso tipico |
| --- | --- | --- |
| Genitore → Figlio | Props | Input di dati |
| Figlio → Genitore | Emit | Callback di eventi |
| Genitore ↔ Figlio | v-model | Sincronizzazione form |
| Antenato → Discendente | Provide/Inject | Contesto in albero profondo |
| Genitore → Figlio (imperativo) | Refs | Chiamata diretta rara di metodi |
| Qualsiasi componente | Pinia/Vuex | Stato globale condiviso |
| Qualsiasi componente (semplice) | Event emitter | Pub-sub leggero |
| Genitore → Figlio contenuto | Slots | Composizione di template |

### Caso pratico: funzionalità carrello con Pinia

```js
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    totalPrice: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
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
      if (index > -1) this.items.splice(index, 1);
    },
  },
});
```

## 2. Qual è la differenza tra Props e Provide/Inject?

> Qual è la differenza tra Props e Provide/Inject?

### Props

**Caratteristiche**:

- Flusso genitore-figlio chiaro ed esplicito
- Definizione di tipo/contratto più forte
- Ottimo per la comunicazione diretta genitore-figlio
- Può causare prop drilling attraverso molti livelli

```vue
<!-- drilling attraverso componenti intermedi -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Caratteristiche**:

- Ottimo per dipendenze tra livelli diversi
- Non è necessario passare attraverso ogni livello intermedio
- Visibilità della sorgente meno esplicita se usato eccessivamente

```vue
<grandparent> <!-- provide -->
  <parent>
    <child>
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Raccomandazione

- **Usare Props** quando la chiarezza del flusso dati è più importante (specialmente genitore-figlio)
- **Usare Provide/Inject** per contesto condiviso profondo (tema, i18n, auth/configurazione)
- Per stato mutabile a livello di applicazione, preferire Pinia/Vuex

## Riferimenti

- [Vue 3 Provide/Inject](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Documentazione Pinia](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
