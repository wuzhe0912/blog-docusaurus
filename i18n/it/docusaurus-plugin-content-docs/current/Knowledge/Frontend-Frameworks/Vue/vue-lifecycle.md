---
id: vue-lifecycle
title: '[Medium] 📄 Lifecycle Hooks di Vue'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Spiega i lifecycle hooks di Vue (inclusi Vue 2 e Vue 3)

> Spiega i lifecycle hooks di Vue sia in Vue 2 che in Vue 3.

Un componente Vue attraversa fasi dalla creazione allo smontaggio.
I lifecycle hooks sono callback del framework eseguiti in ogni fase.

### Timeline del lifecycle

```text
Creazione -> Montaggio -> Aggiornamento -> Smontaggio
   ↓           ↓           ↓           ↓
Created     Mounted     Updated    Unmounted
```

### Mappatura Vue 2 vs Vue 3

| Vue 2 (Options) | Vue 3 (Options) | Vue 3 (Composition) | Significato |
| --- | --- | --- | --- |
| `beforeCreate` | `beforeCreate` | `setup()` | prima dell'inizializzazione completa dell'istanza |
| `created` | `created` | `setup()` | stato dell'istanza pronto |
| `beforeMount` | `beforeMount` | `onBeforeMount` | prima del primo montaggio DOM |
| `mounted` | `mounted` | `onMounted` | dopo il primo montaggio DOM |
| `beforeUpdate` | `beforeUpdate` | `onBeforeUpdate` | prima del flush dell'aggiornamento reattivo |
| `updated` | `updated` | `onUpdated` | dopo l'aggiornamento DOM |
| `beforeDestroy` | `beforeUnmount` | `onBeforeUnmount` | prima dello smontaggio del componente |
| `destroyed` | `unmounted` | `onUnmounted` | dopo lo smontaggio |
| `activated` | `activated` | `onActivated` | KeepAlive attivato |
| `deactivated` | `deactivated` | `onDeactivated` | KeepAlive disattivato |
| `errorCaptured` | `errorCaptured` | `onErrorCaptured` | cattura errori dei discendenti |

### 1) Fase di creazione

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // data/methods non ancora inizializzati
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // API di stato disponibili, ma DOM non ancora montato
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined

    // buon posto per richieste API
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Utilizzo tipico**:

- `created`: richieste API, inizializzazione non-DOM
- evitare operazioni DOM qui

### 2) Fase di montaggio

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return { title: 'Vue Lifecycle' };
  },

  beforeMount() {
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    console.log(this.$refs.myElement); // disponibile

    // setup dipendente dal DOM
    this.initCanvas();
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // disegno...
    },
    initChart() {
      // inizializzazione libreria DOM di terze parti
    },
  },
};
</script>
```

**Utilizzo tipico**:

- operazioni DOM
- librerie UI/grafici di terze parti
- collegamento listener DOM

### 3) Fase di aggiornamento

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Contatore: {{ count }}</p>
    <button @click="count++">Incrementa</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 };
  },

  beforeUpdate() {
    // dati cambiati, DOM non ancora aggiornato
  },

  updated() {
    // DOM aggiornato
    // evitare di mutare lo stato reattivo qui per prevenire loop
  },
};
</script>
```

**Utilizzo tipico**:

- misurazioni/riposizionamento post-aggiornamento DOM
- evitare mutazioni reattive direttamente in `updated`

### 4) Fase di smontaggio

#### `beforeUnmount` / `unmounted` (Vue 3)
#### `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    this.timer = setInterval(() => {}, 1000);
    this.ws = new WebSocket('ws://example.com');
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    if (this.timer) clearInterval(this.timer);
    if (this.ws) this.ws.close();
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {},
  },
};
</script>
```

**Utilizzo tipico**:

- cancellare timer
- rimuovere listener
- chiudere socket/sottoscrizioni
- disporre istanze di terze parti

### 5) Caso speciale: KeepAlive

`<KeepAlive>` mette in cache le istanze dei componenti invece di distruggerle al cambio.

#### Perché usarlo

1. Preservare lo stato locale (input form, stato di scroll)
2. Evitare inizializzazioni/chiamate API ripetute
3. Migliorare la UX nel cambio tab/pagina

#### Esempio

```vue
<template>
  <KeepAlive include="UserList,ProductList" :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

### 6) Lifecycle hooks speciali

#### `activated` / `deactivated` (con KeepAlive)

```vue
<script>
export default {
  mounted() {
    console.log('montato una volta');
  },
  activated() {
    // chiamato ogni volta che il componente diventa attivo dalla cache
    this.refreshData();
  },
  deactivated() {
    // chiamato ogni volta che il componente viene messo in cache/disattivato
    this.pauseTasks();
  },
  methods: {
    refreshData() {},
    pauseTasks() {},
  },
};
</script>
```

#### `errorCaptured`

```vue
<script>
export default {
  errorCaptured(err, instance, info) {
    console.error('errore figlio catturato:', err, info);
    return false; // fermare la propagazione verso l'alto se necessario
  },
};
</script>
```

### Lifecycle della Composition API di Vue 3

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() agisce come la logica della fase beforeCreate + created

onBeforeMount(() => {});
onMounted(() => {});
onBeforeUpdate(() => {});
onUpdated(() => {});
onBeforeUnmount(() => {});
onUnmounted(() => {});
onActivated(() => {});
onDeactivated(() => {});
onErrorCaptured((err, instance, info) => {
  return false;
});
</script>
```

## 2. Qual è l'ordine di esecuzione dei lifecycle hooks tra componente genitore e figlio?

> Qual è l'ordine di esecuzione del lifecycle per i componenti genitore e figlio?

### Ordine di montaggio

```text
Parent beforeCreate
→ Parent created
→ Parent beforeMount
→ Child beforeCreate
→ Child created
→ Child beforeMount
→ Child mounted
→ Parent mounted
```

Trucco mnemonico: **la creazione inizia dall'esterno verso l'interno, il montaggio si completa dall'interno verso l'esterno**.

### Esempio concreto

```vue
<!-- ParentComponent.vue -->
<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
  beforeCreate() { console.log('1. parent beforeCreate'); },
  created() { console.log('2. parent created'); },
  beforeMount() { console.log('3. parent beforeMount'); },
  mounted() { console.log('8. parent mounted'); },
  beforeUnmount() { console.log('9. parent beforeUnmount'); },
  unmounted() { console.log('12. parent unmounted'); },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  beforeCreate() { console.log('4. child beforeCreate'); },
  created() { console.log('5. child created'); },
  beforeMount() { console.log('6. child beforeMount'); },
  mounted() { console.log('7. child mounted'); },
  beforeUnmount() { console.log('10. child beforeUnmount'); },
  unmounted() { console.log('11. child unmounted'); },
};
</script>
```

### Ordine di aggiornamento

Se i dati reattivi del genitore che influenzano il figlio cambiano:

```text
Parent beforeUpdate
→ Child beforeUpdate
→ Child updated
→ Parent updated
```

Se cambia solo lo stato locale del figlio, gli hooks di aggiornamento del genitore non vengono attivati.

### Ordine di smontaggio

```text
Parent beforeUnmount
→ Child beforeUnmount
→ Child unmounted
→ Parent unmounted
```

### Perché questo ordine

- Il montaggio è depth-first: il render del genitore scopre i figli, i figli completano il mount per primi
- Lo smontaggio notifica prima l'intenzione del genitore, poi smonta i figli, poi finalizza il genitore

### Implicazioni pratiche

1. L'accesso ai refs dei figli è sicuro nel `mounted` del genitore, non in `created`
2. Il `mounted` del figlio può essere eseguito prima del `mounted` del genitore
3. Per la coordinazione di prontezza genitore-figlio, usare eventi/props o `nextTick`

### Errori comuni

1. Accedere a `this.$refs.child` nel `created` del genitore
2. Assumere che il genitore sia completamente montato quando viene eseguito il `mounted` del figlio

## 3. Quando dovremmo usare ogni lifecycle hook?

> Quando dovrebbe essere usato ogni lifecycle hook?

### Tabella di utilizzo rapido

| Hook | Utilizzo tipico | Disponibilità DOM |
| --- | --- | --- |
| `created` / `setup` | Richiesta API, init stato | No |
| `mounted` / `onMounted` | Lavoro DOM, init terze parti | Sì |
| `updated` / `onUpdated` | Sincronizzazione DOM post-aggiornamento | Sì (aggiornato) |
| `unmounted` / `onUnmounted` | Pulizia risorse | Fase di smontaggio |
| `activated` | Rientro nella vista in cache | Sì |

### Esempi pratici

#### 1) `created`: recuperare dati API

```vue
<script>
export default {
  data() {
    return { users: [], loading: true, error: null };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2) `mounted`: inizializzare libreria di terze parti

```vue
<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return { chartInstance: null };
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.chartInstance.setOption({
      title: { text: 'Vendite' },
      xAxis: { data: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'] },
      yAxis: {},
      series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
    });
  },
  unmounted() {
    if (this.chartInstance) this.chartInstance.dispose();
  },
};
</script>
```

#### 3) `unmounted`: pulizia delle risorse

```vue
<script>
export default {
  data() {
    return { intervalId: null, observer: null };
  },
  mounted() {
    this.intervalId = setInterval(() => {}, 1000);
    this.observer = new IntersectionObserver(() => {});
    this.observer.observe(this.$el);
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {},
  },
};
</script>
```

### Suggerimenti mnemonici

1. `created`: stato pronto, DOM non pronto
2. `mounted`: DOM pronto
3. `updated`: DOM aggiornato
4. `unmounted`: pulisci tutto

## Riferimenti

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Diagramma Lifecycle Vue 2](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Guida Lifecycle Vue 3](https://vuejs.org/guide/essentials/lifecycle.html)
