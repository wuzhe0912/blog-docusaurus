---
id: vue3-new-features
title: '[Easy] Nuove Funzionalità di Vue3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. Quali sono le nuove funzionalità di Vue 3?

> Quali sono le principali nuove funzionalità di Vue 3?

Vue 3 ha introdotto molteplici importanti aggiornamenti:

### Funzionalità principali

1. **Composition API**
2. **Teleport**
3. **Fragment (nodi root multipli)**
4. **Suspense**
5. **Binding `v-model` multipli**
6. **Migliore supporto TypeScript**
7. **Miglioramenti delle prestazioni** (bundle più piccolo, rendering più veloce)

## 2. Teleport

> Cos'è Teleport?

`Teleport` permette di renderizzare parte di un componente in un'altra posizione nell'albero DOM senza cambiare la struttura logica o la proprietà del componente.

### Casi d'uso tipici

Modal, Tooltip, Notification, Popover, livelli overlay.

```vue
<template>
  <div>
    <button @click="showModal = true">Apri Modal</button>

    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Titolo del Modal</h2>
          <p>Contenuto del Modal</p>
          <button @click="showModal = false">Chiudi</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

### Perché Teleport è utile

1. Risolve problemi di stacking context / z-index
2. Evita il clipping causato dall'overflow degli antenati
3. Mantiene la logica del componente collocata insieme mentre renderizza altrove

## 3. Fragment (Nodi Root Multipli)

> Cos'è Fragment in Vue 3?

Vue 3 permette al template di un componente di avere nodi root multipli.
A differenza di React, Vue utilizza fragment impliciti (nessun tag `<Fragment>` aggiuntivo necessario).

### Vue 2 vs Vue 3

**Vue 2**: root singolo obbligatorio.

```vue
<template>
  <div>
    <h1>Titolo</h1>
    <p>Contenuto</p>
  </div>
</template>
```

**Vue 3**: root multipli permessi.

```vue
<template>
  <h1>Titolo</h1>
  <p>Contenuto</p>
</template>
```

### Perché Fragment è importante

1. Meno elementi wrapper non necessari
2. HTML semantico migliore
3. Albero DOM meno profondo
4. Stile e selettori più puliti

### Ereditarietà degli attributi nei componenti multi-root

Con template multi-root, gli attributi del genitore (`class`, `id`, ecc.) non vengono applicati automaticamente a un root specifico.
Usare `$attrs` manualmente.

```vue
<!-- Genitore -->
<MyComponent class="custom-class" id="my-id" />

<!-- Figlio -->
<template>
  <div v-bind="$attrs">Primo root</div>
  <div>Secondo root</div>
</template>
```

Puoi controllare il comportamento con:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
```

### Fragment vs React Fragment

| Caratteristica | Vue 3 Fragment | React Fragment |
| --- | --- | --- |
| Sintassi | Implicito (nessun tag necessario) | Esplicito (`<>` o `<Fragment>`) |
| Gestione key | Regole normali vnode/key nelle liste | Key supportata su `<Fragment key=...>` |
| Inoltro attr | Usare `$attrs` manualmente in multi-root | Nessun attr diretto sui fragment |

## 4. Suspense

> Cos'è Suspense?

`Suspense` è un componente integrato per gli stati di caricamento delle dipendenze asincrone.
Renderizza una UI di fallback mentre il componente/setup asincrono si risolve.

### Utilizzo base

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Caricamento...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Casi d'uso tipici

1. Caricamento di componenti asincroni
2. Requisiti di dati `setup()` asincroni
3. UI skeleton a livello di route o sezione

## 5. v-model Multipli

> Binding `v-model` multipli

Vue 3 supporta binding `v-model` multipli su un singolo componente.
Ogni binding mappa su una prop + evento `update:propName`.

### Vue 2 vs Vue 3

**Vue 2**: un solo pattern `v-model` per componente.

```vue
<CustomInput v-model="value" />
```

**Vue 3**: binding `v-model` multipli con nome.

```vue
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Esempio di implementazione del componente

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
    />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Domande Comuni nei Colloqui

> Domande comuni nei colloqui

### Domanda 1: quando dovresti usare Teleport?

<details>
<summary>Clicca per vedere la risposta</summary>

Usare Teleport quando il rendering visuale deve sfuggire ai vincoli del DOM locale:

1. **Dialog modali** per evitare problemi di stacking/overflow del genitore
2. **Tooltip/popover** che non dovrebbero essere tagliati
3. **Notifiche globali** renderizzate in un container root dedicato

Evitare Teleport per contenuto normale in-flow.

</details>

### Domanda 2: vantaggi di Fragment

<details>
<summary>Clicca per vedere la risposta</summary>

Vantaggi:

1. meno nodi wrapper
2. migliore struttura semantica
3. CSS più semplice in molti layout
4. meno profondità DOM e sovraccarico

</details>

### Domanda 3: ereditarietà degli attributi multi-root

<details>
<summary>Clicca per vedere la risposta</summary>

Per componenti multi-root, gli attrs non vengono auto-ereditati su un singolo root.
Gestirli esplicitamente con `$attrs` e opzionalmente `inheritAttrs: false`.

```vue
<template>
  <div v-bind="$attrs">Root A</div>
  <div>Root B</div>
</template>
```

</details>

### Domanda 4: Fragment in Vue vs React

<details>
<summary>Clicca per vedere la risposta</summary>

Vue utilizza il comportamento fragment implicito nei template.
React richiede una sintassi fragment esplicita (`<>...</>` o `<Fragment>`).

</details>

### Domanda 5: esempio di implementazione Suspense

<details>
<summary>Clicca per vedere la risposta</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Caricamento profilo utente...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

</details>

## 7. Best Practices (Buone Pratiche)

> Buone pratiche

### Raccomandato

```vue
<!-- 1) Usare Teleport per overlay -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2) Mantenere template multi-root semantici dove appropriato -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3) Avvolgere le parti asincrone con Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4) Usare nomi espliciti per v-model multipli -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Da evitare

```vue
<!-- 1) Non abusare di Teleport per contenuto regolare -->
<Teleport to="body">
  <div>Contenuto normale</div>
</Teleport>

<!-- 2) Non usare multi-root solo per stile; mantenere raggruppamento logico -->
<template>
  <h1>Titolo</h1>
  <p>Contenuto</p>
</template>

<!-- 3) Non ignorare la gestione di errori/caricamento asincrono -->
<Suspense>
  <AsyncComponent />
</Suspense>
```

## 8. Riepilogo per i Colloqui

> Riepilogo per i colloqui

### Promemoria rapido

**Funzionalità chiave di Vue 3**:

- Composition API
- Teleport
- Fragment
- Suspense
- `v-model` multipli

### Risposta esempio

**D: Quali sono le principali funzionalità di Vue 3?**

> Composition API per una migliore organizzazione e riutilizzo della logica, Teleport per il rendering di overlay fuori dai container DOM locali, Fragment per nodi root multipli, Suspense per stati di caricamento asincrono, binding `v-model` multipli, e miglioramenti più forti di TypeScript/prestazioni.

**D: Qual è un caso d'uso pratico di Teleport?**

> Rendering di modal/overlay nel `body` per evitare problemi di clipping e stacking, mantenendo la logica del modal all'interno dell'albero dei componenti originale.

## Riferimenti

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 v-model Multipli](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
