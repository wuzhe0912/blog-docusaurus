---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. Cosa sono watch e watchEffect?

> Cosa sono `watch` e `watchEffect`?

`watch` e `watchEffect` sono API di Vue 3 per reagire ai cambiamenti nello stato reattivo.

### watch

**Definizione**: osserva esplicitamente una o più sorgenti e esegue una callback quando cambiano.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// osservare una singola sorgente
watch(count, (newValue, oldValue) => {
  console.log(`count cambiato da ${oldValue} a ${newValue}`);
});

// osservare sorgenti multiple
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count o message cambiato');
});
</script>
```

### watchEffect

**Definizione**: viene eseguito immediatamente e traccia automaticamente le dipendenze reattive utilizzate all'interno della sua callback.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// traccia automaticamente count e message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // si ri-esegue quando count/message cambia
});
</script>
```

## 2. watch vs watchEffect: Differenze Principali

> Differenze principali tra `watch` e `watchEffect`

### 1. Dichiarazione della sorgente

**watch**: sorgente/i esplicita/e.

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal, oldVal) => {
  console.log('count cambiato');
});

watch([count, message], ([newCount, newMessage]) => {
  console.log('count o message cambiato');
});
```

**watchEffect**: tracciamento implicito delle dipendenze.

```typescript
const count = ref(0);
const message = ref('Hello');

watchEffect(() => {
  console.log(count.value); // tracciato automaticamente
  console.log(message.value); // tracciato automaticamente
});
```

### 2. Tempistica di esecuzione

**watch**: lazy di default; viene eseguito solo dopo il cambiamento della sorgente.

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('eseguito');
});

count.value = 1; // attiva la callback
```

**watchEffect**: viene eseguito immediatamente, poi si ri-esegue agli aggiornamenti delle dipendenze.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('eseguito'); // prima esecuzione immediata
  console.log(count.value);
});

count.value = 1; // si esegue di nuovo
```

### 3. Accesso al valore precedente

**watch**: fornisce `newValue` e `oldValue`.

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`da ${oldVal} a ${newVal}`);
});
```

**watchEffect**: nessun valore precedente diretto.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // solo valore corrente
});
```

### 4. Fermare i watcher

Entrambi restituiscono una funzione di stop.

```typescript
const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

stopWatch();
stopEffect();
```

## 3. Quando usare watch vs watchEffect?

> Quando dovresti scegliere ciascuna API?

### Usa `watch` quando

1. Hai bisogno di sorgenti esplicite.

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

2. Hai bisogno del valore precedente.

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`da ${oldVal} a ${newVal}`);
});
```

3. Hai bisogno di esecuzione lazy.

```typescript
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    search(newQuery);
  }
});
```

4. Hai bisogno di controllo a grana fine (`immediate`, `deep`, ecc.).

```typescript
watch(
  () => user.value.id,
  (newId) => {
    fetchUser(newId);
  },
  { immediate: true, deep: true }
);
```

### Usa `watchEffect` quando

1. Vuoi il tracciamento automatico delle dipendenze.

```typescript
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});
```

2. Non hai bisogno del valore precedente.

```typescript
watchEffect(() => {
  console.log(`conteggio corrente: ${count.value}`);
});
```

3. Vuoi la prima esecuzione immediata.

```typescript
watchEffect(() => {
  updateChart(count.value, message.value);
});
```

## 4. Domande Comuni nei Colloqui

> Domande comuni nei colloqui

### Domanda 1: ordine di esecuzione

Spiega output e ordine:

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal) => {
  console.log('watch:', newVal);
});

watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Clicca per vedere la risposta</summary>

`watch` è lazy (nessuna esecuzione immediata), ma `watchEffect` viene eseguito immediatamente.

Sequenza attesa:

1. `watchEffect: 0 Hello` (esecuzione iniziale)
2. `watch: 1` (count cambiato)
3. `watchEffect: 1 Hello` (count cambiato)
4. `watchEffect: 1 World` (message cambiato)

Punti chiave:

- `watch` reagisce solo alla sorgente osservata esplicitamente
- `watchEffect` reagisce a qualsiasi dipendenza reattiva utilizzata nella callback

</details>

### Domanda 2: valore precedente con watchEffect

Come si accede al valore precedente usando `watchEffect`?

<details>
<summary>Clicca per vedere la risposta</summary>

`watchEffect` non fornisce direttamente il valore precedente.

**Opzione 1: mantenere il proprio ref precedente**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`da ${prevCount.value} a ${count.value}`);
  prevCount.value = count.value;
});
```

**Opzione 2: usare watch**

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`da ${oldVal} a ${newVal}`);
});
```

Raccomandazione: se il valore precedente è necessario, preferire `watch`.

</details>

### Domanda 3: scegliere watch o watchEffect

Scegli l'API per ogni scenario:

```typescript
// Scenario 1: ricaricare dati utente quando userId cambia
const userId = ref(1);

// Scenario 2: abilitare invio quando il form è valido
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// Scenario 3: ricerca con debounce al cambio di keyword
const searchQuery = ref('');
```

<details>
<summary>Clicca per vedere la risposta</summary>

**Scenario 1: cambio userId** -> `watch`

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Scenario 2: effetto collaterale validità form** -> `watchEffect`

```typescript
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Scenario 3: ricerca con debounce** -> `watch`

```typescript
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

Regola di scelta:

- sorgente esplicita / valore precedente / opzioni di controllo -> `watch`
- tracciamento automatico delle dipendenze + esecuzione immediata -> `watchEffect`

</details>

## 5. Best Practices (Buone Pratiche)

> Buone pratiche

### Raccomandato

```typescript
// 1) sorgente esplicita -> watch
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2) tracciamento automatico di dipendenze multiple -> watchEffect
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3) valore precedente necessario -> watch
watch(count, (newVal, oldVal) => {
  console.log(`da ${oldVal} a ${newVal}`);
});

// 4) pulizia
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Da evitare

```typescript
// 1) evitare effetti collaterali asincroni non gestiti in watchEffect
watchEffect(async () => {
  const data = await fetchData();
  // potenziale race condition/leak se non gestito
});

// 2) evitare l'uso eccessivo di watchEffect
watchEffect(() => {
  console.log(count.value); // watch(count, ...) potrebbe essere più chiaro
});

// 3) evitare di mutare la sorgente tracciata nello stesso effetto (rischio loop)
watchEffect(() => {
  count.value++; // potrebbe causare un loop infinito
});
```

## 6. Riepilogo per i Colloqui

> Riepilogo per i colloqui

### Promemoria rapido

**watch**:

- dichiarazione esplicita della sorgente
- lazy di default
- valore precedente disponibile
- migliore per scenari controllati

**watchEffect**:

- tracciamento automatico delle dipendenze
- esecuzione immediata
- nessun valore precedente
- migliore per effetti collaterali reattivi concisi

**Regola pratica**:

- controllo esplicito -> `watch`
- tracciamento automatico -> `watchEffect`
- valore precedente necessario -> `watch`
- esecuzione iniziale immediata -> `watchEffect`

### Risposta esempio

**D: Qual è la differenza tra watch e watchEffect?**

> Entrambi reagiscono ai cambiamenti reattivi in Vue 3. `watch` traccia sorgenti dichiarate esplicitamente e fornisce valori vecchi/nuovi; è lazy di default.
> `watchEffect` viene eseguito immediatamente e traccia automaticamente le dipendenze utilizzate all'interno della callback, ma non fornisce il valore precedente.
> Usare `watch` per precisione e controllo; usare `watchEffect` per la raccolta automatica delle dipendenze.

**D: Quando dovrei usare ciascuno?**

> Usare `watch` quando servono controllo esplicito della sorgente, valori precedenti, o opzioni come debounce/deep/immediate.
> Usare `watchEffect` quando si vuole un'esecuzione immediata e tracciamento automatico tra molteplici valori reattivi correlati.

## Riferimenti

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Guida Watchers Vue 3](https://vuejs.org/guide/essentials/watchers.html)
