---
id: vue-basic-api
title: '[Medium] 📄 Vue Base & API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Puoi descrivere i principi fondamentali e i vantaggi del framework Vue?

> Descrivi i principi fondamentali e i punti di forza di Vue.

### Principi fondamentali

Vue è un framework JavaScript progressivo. I suoi concetti fondamentali includono:

#### 1. Virtual DOM

Vue utilizza il diffing del Virtual DOM per aggiornare solo le parti modificate del DOM reale.

```js
// concetto semplificato di Virtual DOM
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Binding reattivo dei dati

I dati reattivi aggiornano automaticamente la UI. Con i binding dei form (`v-model`), l'input della UI può anche aggiornare lo stato.

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

#### 3. Architettura basata su componenti

La UI è suddivisa in componenti riutilizzabili e testabili con responsabilità isolate.

```vue
<!-- Button.vue -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => emit('click');
</script>
```

#### 4. Lifecycle hooks

Gli hooks permettono di eseguire logica nei momenti di creazione/montaggio/aggiornamento/smontaggio.

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Componente montato');
});

onUpdated(() => {
  console.log('Componente aggiornato');
});

onUnmounted(() => {
  console.log('Componente smontato');
});
</script>
```

#### 5. Sistema di direttive

Le direttive Vue forniscono logica UI dichiarativa (`v-if`, `v-for`, `v-bind`, `v-model`, ecc.).

```vue
<template>
  <div v-if="isVisible">Contenuto visibile</div>

  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <img :src="imageUrl" :alt="imageAlt" />

  <input v-model="username" />
</template>
```

#### 6. Sintassi dei template

I template supportano interpolazione ed espressioni mantenendo il markup leggibile.

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ count + 1 }}</p>
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Punti di forza di Vue (spesso confrontati con React)

#### 1. Costo di onboarding inferiore

I single-file components (`template/script/style`) sono intuitivi per molti team.

#### 2. Direttive dichiarative integrate

Le attività UI comuni sono concise con le direttive.

#### 3. Binding bidirezionale facile per i form

`v-model` offre un pattern di prima classe per la sincronizzazione degli input.

#### 4. Chiara separazione tra template e logica

Alcuni team preferiscono la struttura template-first rispetto ai pattern pesanti in JSX.

#### 5. Ecosistema ufficiale coeso

Vue Router + Pinia + strumenti di integrazione sono ben allineati.

## 2. Spiega l'utilizzo di `v-model`, `v-bind` e `v-html`

> Spiega l'utilizzo di `v-model`, `v-bind` e `v-html`.

### `v-model`: binding bidirezionale per controlli form

```vue
<template>
  <div>
    <input v-model="message" />
    <p>Messaggio: {{ message }}</p>

    <input type="checkbox" v-model="checked" />
    <p>Selezionato: {{ checked }}</p>

    <select v-model="selected">
      <option value="A">Opzione A</option>
      <option value="B">Opzione B</option>
    </select>
    <p>Selezionato: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### Modificatori di `v-model`

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" type="number" />
<input v-model.trim="msg" />
```

### `v-bind`: binding dinamico degli attributi

```vue
<template>
  <div>
    <div :class="{ active: isActive, 'text-danger': hasError }">Classe dinamica</div>

    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Stile dinamico</div>

    <img :src="imageUrl" :alt="imageAlt" />

    <a :href="linkUrl">Vai al link</a>

    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Descrizione immagine',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### Abbreviazione di `v-bind`

```vue
<img v-bind:src="imageUrl" />
<img :src="imageUrl" />
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: renderizzare stringhe HTML raw

```vue
<template>
  <div>
    <p>{{ rawHtml }}</p>
    <p v-html="rawHtml"></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Testo rosso</span>',
    };
  },
};
</script>
```

#### Avviso di sicurezza

Non usare mai `v-html` direttamente su input utente non affidabile (rischio XSS).

```vue
<!-- non sicuro -->
<div v-html="userProvidedContent"></div>

<!-- più sicuro: contenuto sanitizzato -->
<div v-html="sanitizedHtml"></div>
```

#### Approccio più sicuro con sanitizer

```vue
<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Confronto rapido

| Direttiva | Scopo | Abbreviazione | Esempio |
| --- | --- | --- | --- |
| `v-model` | Binding bidirezionale form | Nessuna | `<input v-model="msg">` |
| `v-bind` | Binding unidirezionale attributi | `:` | `<img :src="url">` |
| `v-html` | Renderizzare HTML raw | Nessuna | `<div v-html="html"></div>` |

## 3. Come accedere agli elementi HTML (Template Refs)?

> Come manipolare gli elementi HTML in Vue (ad esempio dare il focus a un input)?

Usare i template refs invece di `document.querySelector` nei componenti.

### Options API (Vue 2 / Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputElement = ref(null);

const focusInput = () => {
  inputElement.value?.focus();
};

onMounted(() => {
  console.log(inputElement.value);
});
</script>
```

Note:

- il nome ref nel template deve corrispondere alla variabile nello script
- accedere dopo il mount (`onMounted` / `mounted`)
- all'interno di `v-for`, i refs diventano array

## 4. Spiega la differenza tra `v-show` e `v-if`

> Spiega le differenze tra `v-show` e `v-if`.

### Somiglianza

Entrambi controllano la visibilità in base a condizioni.

```vue
<template>
  <div v-if="isVisible">Usando v-if</div>
  <div v-show="isVisible">Usando v-show</div>
</template>
```

### Differenze

#### 1) Comportamento DOM

- `v-if`: monta/smonta il nodo
- `v-show`: sempre montato; alterna il CSS `display`

#### 2) Profilo prestazionale

- `v-if`: costo iniziale inferiore quando è false, costo di alternanza superiore
- `v-show`: costo iniziale superiore, costo di alternanza inferiore

#### 3) Impatto sul lifecycle

- `v-if` attiva l'intero lifecycle dei figli all'alternanza
- `v-show` non smonta; nessun mount/unmount all'alternanza

#### 4) Costo del render iniziale

Per componenti pesanti inizialmente nascosti:

- `v-if="false"`: il componente non viene renderizzato
- `v-show="false"`: il componente viene renderizzato ma nascosto

#### 5) Combinazioni di direttive

- `v-if` supporta `v-else-if` / `v-else`
- `v-show` no

### Quando usare ciascuno

#### Usa `v-if` quando

1. la condizione cambia raramente
2. un false iniziale dovrebbe evitare il costo di rendering
3. hai bisogno di rami condizionali con `v-else`
4. gli effetti collaterali di mount/unmount sono desiderati

#### Usa `v-show` quando

1. la visibilità viene alternata frequentemente
2. il componente dovrebbe rimanere montato per preservare lo stato interno
3. il remounting del lifecycle non è necessario

### Tabella riepilogativa

| Caratteristica | `v-if` | `v-show` |
| --- | --- | --- |
| Costo iniziale | Inferiore (quando false) | Superiore (renderizza sempre) |
| Costo di alternanza | Superiore | Inferiore |
| Lifecycle all'alternanza | Sì | No |
| Migliore per | Alternanze rare | Alternanze frequenti |

### Suggerimento mnemonico

- `v-if`: "renderizza solo quando necessario"
- `v-show`: "renderizza una volta, nascondi/mostra via CSS"

## 5. Qual è la differenza tra `computed` e `watch`?

> Qual è la differenza tra `computed` e `watch`?

Entrambi reagiscono ai cambiamenti di stato ma risolvono problemi diversi.

### `computed`

#### Caratteristiche principali

1. deriva nuovi dati dallo stato reattivo esistente
2. memorizzato in cache finché le dipendenze non cambiano
3. sincrono e orientato al valore di ritorno
4. utilizzabile direttamente nel template

#### Casi d'uso tipici

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const emailLowerCase = computed(() => email.value.toLowerCase());
const cartTotal = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
);
const filteredItems = computed(() =>
  !searchText.value
    ? items.value
    : items.value.filter((item) =>
        item.name.toLowerCase().includes(searchText.value.toLowerCase())
      )
);
</script>
```

#### Vantaggio della cache

```vue
<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed eseguito solo quando la dipendenza cambia');
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('metodo eseguito ad ogni chiamata');
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### Forma getter + setter

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});
</script>
```

### `watch`

#### Caratteristiche principali

1. osserva esplicitamente sorgente/i
2. destinato agli effetti collaterali
3. supporta workflow asincroni
4. può accedere a `newValue` e `oldValue`

#### Casi d'uso tipici

```vue
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);

const username = ref('');
const usernameError = ref('');

const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// 1) ricerca con debounce
watch(searchQuery, (newQuery, oldQuery) => {
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 2) effetto collaterale di validazione
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'Il nome utente deve avere almeno 3 caratteri';
  } else if (newUsername.length > 20) {
    usernameError.value = 'Il nome utente deve avere al massimo 20 caratteri';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value =
      'Il nome utente può includere solo lettere, numeri e underscore';
  } else {
    usernameError.value = '';
  }
});

// 3) effetto collaterale di salvataggio automatico
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### Opzioni di `watch`

```vue
<script setup>
import { ref, watch } from 'vue';

const user = ref({
  name: 'John',
  profile: { age: 30, city: 'Taipei' },
});
const items = ref([1, 2, 3]);

// immediate: eseguire subito una volta
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Nome cambiato da ${oldName} a ${newName}`);
  },
  { immediate: true }
);

// deep: tracciare mutazioni annidate
watch(
  user,
  (newUser) => {
    console.log('oggetto utente annidato cambiato', newUser);
  },
  { deep: true }
);

// flush: controllare il timing (pre/post/sync)
watch(
  items,
  () => {
    console.log('items cambiato');
  },
  { flush: 'post' }
);
</script>
```

#### Osservare sorgenti multiple

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Nome cambiato da ${oldFirst} ${oldLast} a ${newFirst} ${newLast}`);
});
</script>
```

### `computed` vs `watch`

| Caratteristica | computed | watch |
| --- | --- | --- |
| Obiettivo principale | derivare un valore | effetto collaterale al cambiamento |
| Valore di ritorno | richiesto | opzionale/nessuno |
| Cache | sì | no |
| Tracciamento dipendenze | automatico | sorgente esplicita |
| Effetti collaterali asincroni | no | sì |
| Valori vecchi/nuovi | no | sì |
| Uso diretto nel template | sì | no |

### Regola pratica

- **`computed` calcola dati**
- **`watch` esegue azioni**

### Confronto corretto/scorretto

#### Scorretto ❌

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Corretto ✅

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

### Esercizio: calcolare `x * y`

Dati `x = 0`, `y = 5`, e un pulsante che incrementa `x` di 1 ad ogni click.

#### Soluzione A: `computed` (raccomandata)

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Risultato (X * Y): {{ result }}</p>
    <button @click="x++">Incrementa X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

const result = computed(() => x.value * y.value);
</script>
```

#### Soluzione B: `watch` (funziona ma più verbosa)

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Riferimenti

- [Documentazione Ufficiale Vue 3](https://vuejs.org/)
- [Guida alla Migrazione da Vue 2 a Vue 3](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Direttive Vue](https://vuejs.org/api/built-in-directives.html)
- [Proprietà Computed e Watchers](https://vuejs.org/guide/essentials/computed.html)
