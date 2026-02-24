---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. Cosa sono ref e reactive?

> Cosa sono `ref` e `reactive`?

`ref` e `reactive` sono due API fondamentali nella Composition API di Vue 3 per creare stato reattivo.

### ref

**Definizione**: `ref` crea un wrapper reattivo per un **valore primitivo** o un **riferimento a oggetto**.

<details>
<summary>Clicca per espandere l'esempio base di ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// primitivi
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// anche gli oggetti funzionano con ref
const user = ref({
  name: 'John',
  age: 30,
});

// accesso con .value in JavaScript
console.log(count.value); // 0
count.value++;
</script>
```

</details>

### reactive

**Definizione**: `reactive` crea un **proxy oggetto** reattivo (non per valori primitivi direttamente).

<details>
<summary>Clicca per espandere l'esempio base di reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// accesso diretto alle proprietà
console.log(state.count); // 0
state.count++;
</script>
```

</details>

## 2. ref vs reactive: Differenze Principali

> Differenze principali tra `ref` e `reactive`

### 1. Tipi supportati

**ref**: funziona con qualsiasi tipo.

```typescript
const count = ref(0); // number
const message = ref('Hello'); // string
const isActive = ref(true); // boolean
const user = ref({ name: 'John' }); // oggetto
const items = ref([1, 2, 3]); // array
```

**reactive**: funziona con oggetti (inclusi array), non con primitivi.

```typescript
const state = reactive({ count: 0 }); // oggetto
const list = reactive([1, 2, 3]); // array

const count = reactive(0); // utilizzo non valido
const message = reactive('Hello'); // utilizzo non valido
```

### 2. Stile di accesso

**ref**: usare `.value` in JavaScript.

<details>
<summary>Clicca per espandere l'esempio di accesso ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

console.log(count.value);
count.value = 10;
</script>

<template>
  <div>{{ count }}</div>
  <!-- auto-unwrapped nel template -->
</template>
```

</details>

**reactive**: accesso diretto alle proprietà.

<details>
<summary>Clicca per espandere l'esempio di accesso reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

console.log(state.count);
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Comportamento alla riassegnazione

**ref**: può essere riassegnato.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // valido
```

**reactive**: non dovrebbe essere riassegnato a un nuovo binding di variabile oggetto.

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // perde la connessione reattiva
```

### 4. Destrutturazione

**ref**: destrutturare `ref.value` restituisce valori semplici (non reattivi).

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // valori semplici
```

**reactive**: la destrutturazione diretta perde la reattività.

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // perde la reattività

import { toRefs } from 'vue';
const refs = toRefs(state);
// refs.count e refs.message mantengono la reattività
```

## 3. Quando usare ref vs reactive?

> Quando dovresti scegliere ciascuna API?

### Usa `ref` quando

1. Lo stato è primitivo.

```typescript
const count = ref(0);
const message = ref('Hello');
```

2. Potresti sostituire l'intero valore/oggetto.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };
```

3. Hai bisogno di template refs.

```vue
<template>
  <div ref="container"></div>
</template>
<script setup>
const container = ref(null);
</script>
```

4. Vuoi uno stile `.value` coerente per tutti i valori.

### Usa `reactive` quando

1. Gestisci stato oggetto complesso.

```typescript
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});
```

2. Raggruppi campi correlati insieme senza sostituire l'identità dell'oggetto.

```typescript
const userState = reactive({
  user: null,
  loading: false,
  error: null,
});
```

3. Preferisci l'accesso diretto alle proprietà per strutture annidate.

## 4. Domande Comuni nei Colloqui

> Domande comuni nei colloqui

### Domanda 1: differenze base

Spiega output e comportamento:

```typescript
// caso 1: ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// caso 2: reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// caso 3: riassegnazione reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Clicca per vedere la risposta</summary>

```typescript
console.log(count1.value); // 10
console.log(state.count); // 10
console.log(state2.count); // 10 (il valore esiste ma non è più reattivo)
```

Punti chiave:

- `ref` richiede `.value`
- `reactive` usa l'accesso diretto alle proprietà
- riassegnare il binding dell'oggetto `reactive` interrompe il tracciamento reattivo

</details>

### Domanda 2: trappola della destrutturazione

Cosa c'è di sbagliato qui e come correggerlo?

```typescript
// caso 1: destrutturazione ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// caso 2: destrutturazione reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Caso 1 (`ref`)**:

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // non aggiorna user.value.name

// corretto
user.value.name = 'Jane';
// oppure
user.value = { name: 'Jane', age: 30 };
```

**Caso 2 (`reactive`)**:

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // perde la reattività

// approccio corretto 1
state.count = 10;

// approccio corretto 2
import { toRefs } from 'vue';
const refs = toRefs(state);
refs.count.value = 10;
```

Riepilogo:

- i valori semplici destrutturati non sono reattivi
- usare `toRefs` per la destrutturazione di oggetti reattivi

</details>

### Domanda 3: scegliere ref o reactive

Scegli l'API per ogni scenario:

```typescript
// Scenario 1: contatore
const count = ?;

// Scenario 2: stato del form
const form = ?;

// Scenario 3: oggetto utente che potrebbe essere sostituito
const user = ?;

// Scenario 4: template ref
const inputRef = ?;
```

<details>
<summary>Clicca per vedere la risposta</summary>

```typescript
const count = ref(0); // primitivo

const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // stato oggetto raggruppato

const user = ref({ name: 'John', age: 30 }); // sostituzione completa più facile

const inputRef = ref(null); // i template ref devono usare ref
```

Regola pratica:

- primitivo -> `ref`
- sostituzione completa dell'oggetto necessaria -> `ref`
- stato oggetto complesso raggruppato -> `reactive`
- template refs -> `ref`

</details>

## 5. Best Practices (Buone Pratiche)

> Buone pratiche

### Raccomandato

```typescript
// 1) primitivi con ref
const count = ref(0);
const message = ref('Hello');

// 2) stato oggetto strutturato con reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3) usare ref quando la sostituzione completa è comune
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };

// 4) usare toRefs quando si destruttura un oggetto reactive
import { toRefs } from 'vue';
const { username, password } = toRefs(formState);
```

### Da evitare

```typescript
// 1) non usare reactive per primitivi
const count = reactive(0); // non valido

// 2) non riassegnare il binding reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // interrompe il tracciamento

// 3) evitare la destrutturazione diretta di reactive quando serve la reattività
const { count } = reactive({ count: 0 }); // perde il tracciamento
```

## 6. Riepilogo per i Colloqui

> Riepilogo per i colloqui

### Promemoria rapido

**ref**:

- qualsiasi tipo
- `.value` in JavaScript
- sostituzione completa facile
- auto-unwrapped nel template

**reactive**:

- solo oggetti/array
- accesso diretto alle proprietà
- mantiene l'identità dell'oggetto
- usare `toRefs` per la destrutturazione

**Guida alla scelta**:

- primitivo -> `ref`
- oggetto con sostituzione frequente -> `ref`
- stato oggetto raggruppato -> `reactive`

### Risposta esempio

**D: Qual è la differenza tra ref e reactive?**

> `ref` avvolge un valore e vi si accede tramite `.value` in JavaScript, mentre `reactive` restituisce un oggetto proxy con accesso diretto alle proprietà.
> `ref` funziona con primitivi e oggetti; `reactive` è per oggetti/array.
> Riassegnare `ref.value` è valido; riassegnare un binding `reactive` interrompe il tracciamento.

**D: Quando dovrei usare ciascuno?**

> Usare `ref` per primitivi, template refs e stati oggetto che vengono spesso sostituiti interamente.
> Usare `reactive` per stato oggetto complesso raggruppato dove è preferita un'identità dell'oggetto stabile.

## Riferimenti

- [Vue 3 Fondamenti di Reattività](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
