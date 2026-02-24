---
id: static-hoisting
title: '[Medium] Vue3 Static Hoisting'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. Cos'è lo Static Hoisting in Vue 3?

> Spiega lo static hoisting in Vue 3.

In Vue 3, lo **static hoisting** è un'ottimizzazione a tempo di compilazione.

### Definizione

Durante la compilazione del template, Vue analizza quali nodi sono completamente statici (nessuna dipendenza reattiva).
Quei nodi statici vengono sollevati (hoisted) in costanti a livello di modulo e creati una sola volta.
Nei successivi re-render, Vue li riutilizza invece di ricrearli e confrontarli.

### Come funziona

Il compilatore analizza l'AST del template e solleva i sotto-alberi che non cambiano mai.
Solo le parti dinamiche vengono rigenerate durante gli aggiornamenti.

### Esempio prima/dopo

**Template prima della compilazione**:

```vue
<template>
  <div>
    <h1>Titolo statico</h1>
    <p>Contenuto statico</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

**JavaScript compilato (semplificato)**:

```js
// nodi statici sollevati una sola volta
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Titolo statico');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Contenuto statico');

function render() {
  return h('div', null, [
    _hoisted_1, // riutilizzato
    _hoisted_2, // riutilizzato
    h('div', null, dynamicContent.value), // dinamico
  ]);
}
```

### Vantaggi

1. Costo inferiore di creazione VNode
2. Meno lavoro di diff
3. Migliori prestazioni di rendering
4. Ottimizzazione automatica (nessun codice aggiuntivo richiesto)

## 2. Come Funziona lo Static Hoisting

> Come opera internamente lo static hoisting?

### Flusso del compilatore

1. **Rilevamento dei binding dinamici**
   - `{{ }}`, `v-bind`, `v-if`, `v-for`, props dinamiche, ecc.
2. **Marcatura dei nodi statici**
   - Nodo e figli sono statici -> candidato per l'hoisting
3. **Sollevamento dei nodi statici**
   - Spostamento dei nodi/costanti statici fuori da `render()`

### Esempio 1: sotto-albero completamente statico

```vue
<template>
  <div>
    <h1>Titolo</h1>
    <p>Questo è testo statico</p>
    <div>Blocco statico</div>
  </div>
</template>
```

Compilato (semplificato):

```js
const _hoisted_1 = h('h1', null, 'Titolo');
const _hoisted_2 = h('p', null, 'Questo è testo statico');
const _hoisted_3 = h('div', null, 'Blocco statico');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

### Esempio 2: statico e dinamico misti

```vue
<template>
  <div>
    <h1>Titolo statico</h1>
    <p>{{ message }}</p>
    <div class="static-class">Contenuto statico</div>
    <span :class="dynamicClass">Contenuto dinamico</span>
  </div>
</template>
```

Compilato (semplificato):

```js
const _hoisted_1 = h('h1', null, 'Titolo statico');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Contenuto statico');

function render() {
  return h('div', null, [
    _hoisted_1,
    h('p', null, message.value),
    _hoisted_3,
    h('span', { class: dynamicClass.value }, 'Contenuto dinamico'),
  ]);
}
```

### Esempio 3: hoisting delle props statiche

```vue
<template>
  <div>
    <div class="container" id="main">Contenuto</div>
    <button disabled>Pulsante</button>
  </div>
</template>
```

Compilato (semplificato):

```js
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Contenuto');
const _hoisted_4 = h('button', _hoisted_2, 'Pulsante');
```

## 3. Direttiva `v-once`

> Direttiva `v-once`

Se uno sviluppatore vuole marcare esplicitamente un sotto-albero come render-once, può usare `v-once`.

### Cosa fa `v-once`

`v-once` dice a Vue di renderizzare questo elemento/sotto-albero una sola volta.
Anche se le espressioni sono dinamiche, vengono valutate solo al primo render e non vengono mai aggiornate.

### Utilizzo base

```vue
<template>
  <div>
    <!-- renderizzato una sola volta -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- area reattiva normale -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Titolo iniziale');
const content = ref('Contenuto iniziale');

setTimeout(() => {
  title.value = 'Nuovo titolo';
  content.value = 'Nuovo contenuto';
}, 1000);
</script>
```

### `v-once` vs static hoisting

| Caratteristica | Static Hoisting | `v-once` |
| --- | --- | --- |
| Trigger | Analisi automatica del compilatore | Direttiva manuale |
| Migliore per | Nodi completamente statici | Espressioni dinamiche che dovrebbero renderizzarsi una volta |
| Prestazioni | Migliori per sezioni statiche | Buone per render dinamico una tantum |
| Momento della decisione | Tempo di compilazione | Intenzione dello sviluppatore |

### Casi d'uso tipici

```vue
<template>
  <!-- Caso 1: dati visualizzati una sola volta -->
  <div v-once>
    <p>Creato il: {{ createdAt }}</p>
    <p>Creato da: {{ creator }}</p>
  </div>

  <!-- Caso 2: sotto-albero pesante ma stabile -->
  <div v-once>
    <div class="header">
      <h1>Titolo</h1>
      <nav>Navigazione</nav>
    </div>
  </div>

  <!-- Caso 3: snapshot una tantum in un elemento lista -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Domande Comuni nei Colloqui

> Domande comuni nei colloqui

### Domanda 1: meccanismo interno dello static hoisting

Spiega lo static hoisting e come migliora le prestazioni.

<details>
<summary>Clicca per vedere la risposta</summary>

Lo static hoisting è un'ottimizzazione a tempo di compilazione:

1. il compilatore analizza il template per individuare nodi statici vs dinamici
2. i nodi statici vengono spostati fuori da `render()` come costanti
3. la fase di aggiornamento riutilizza i nodi sollevati e ne salta il lavoro di diff

I guadagni in prestazioni derivano da:

- meno allocazione di VNode
- meno attraversamento di patch/diff
- meno creazione ripetuta di oggetti

</details>

### Domanda 2: static hoisting vs `v-once`

Spiega differenze e casi d'uso.

<details>
<summary>Clicca per vedere la risposta</summary>

- **Static hoisting**: automatico, per segmenti di template completamente statici
- **`v-once`**: manuale, per espressioni dinamiche che non dovrebbero mai aggiornarsi dopo il primo render

Usare lo static hoisting di default (automatico).
Usare `v-once` solo quando si vuole intenzionalmente il comportamento di primo-render-only.

</details>

### Domanda 3: quando i guadagni prestazionali sono visibili

In quali scenari lo static hoisting è più efficace?

<details>
<summary>Clicca per vedere la risposta</summary>

Più visibile quando:

1. Il componente contiene molto markup statico
2. Il componente si aggiorna frequentemente ma solo una piccola parte è dinamica
3. Molte istanze condividono una struttura statica simile

Più alto è il rapporto statico/dinamico e la frequenza di aggiornamento, maggiore è il vantaggio.

</details>

## 5. Best Practices (Buone Pratiche)

> Buone pratiche

### Raccomandato

```vue
<!-- 1) Lasciare che il compilatore sollevi automaticamente il contenuto statico -->
<template>
  <div>
    <h1>Titolo</h1>
    <p>Contenuto statico</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2) Usare v-once solo per rendering intenzionalmente una tantum -->
<template>
  <div v-once>
    <p>Creato il: {{ createdAt }}</p>
    <p>Creato da: {{ creator }}</p>
  </div>
</template>

<!-- 3) Separare il layout stabile dalla regione dinamica quando possibile -->
<template>
  <div class="container">
    <header>Header statico</header>
    <main>{{ content }}</main>
  </div>
</template>
```

### Da evitare

```vue
<!-- 1) Non usare v-once su contenuto che deve aggiornarsi -->
<template>
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2) Non applicare ciecamente v-once su nodi di lista dinamici -->
<template>
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Riepilogo per i Colloqui

> Riepilogo per i colloqui

### Promemoria rapido

**Static hoisting**:

- ottimizzazione automatica a tempo di compilazione
- solleva nodi/costanti statici
- riduce il costo di creazione VNode e di diff

**`v-once`**:

- comportamento render-once controllato dallo sviluppatore
- può includere espressioni dinamiche
- nessun aggiornamento dopo il primo render

### Risposta esempio

**D: Cos'è lo static hoisting in Vue 3?**

> È un'ottimizzazione del compilatore in cui i nodi del template completamente statici vengono sollevati fuori dalla funzione render in costanti. Vengono creati una sola volta e riutilizzati durante gli aggiornamenti, riducendo il costo di creazione VNode e il sovraccarico del diff.

**D: In cosa differisce da `v-once`?**

> Lo static hoisting è automatico e si applica al contenuto completamente statico. `v-once` è manuale e può includere espressioni dinamiche, ma quel blocco viene renderizzato solo una volta e non viene mai più aggiornato successivamente.

## Riferimenti

- [Ottimizzazione del Compilatore Vue 3](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Compilazione dei Template Vue 3](https://vuejs.org/guide/extras/rendering-mechanism.html)
