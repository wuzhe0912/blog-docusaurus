---
id: state-management-vue-pinia-store-patterns
title: 'Pattern di implementazione degli store Pinia'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Scegli lo stile dello store in base alla complessità: Options API per store lineari, sintassi Setup per scenari ricchi di composability.

---

## 1. Focus da colloquio

1. Sintassi store Options vs Setup
2. Considerazioni su reattività e typing
3. Scelta del pattern in base allo scenario

## 2. Pattern store Options

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubled: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count += 1;
    },
  },
});
```

Adatto a moduli di stato semplici ed espliciti.

## 3. Pattern store Setup

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value += 1;
  }

  return { count, doubled, increment };
});
```

Adatto quando ti servono direttamente primitive della Composition API (`watch`, `computed`, composable condivisi).

## 4. Guida alla scelta del pattern

Usa la sintassi Options quando:

- La logica dello store è lineare
- Il team preferisce la coerenza dello stile a oggetti

Usa la sintassi Setup quando:

- Ti servono pattern di composizione avanzati
- Lo stato deriva da più composable
- Ti serve controllo fine sulle primitive reattive

## 5. Errori comuni

- Restituire per errore primitive non reattive in uno store setup
- Mescolare troppe responsabilità in un unico store
- Riutilizzare accidentalmente gli ID store

## 6. Sintesi pronta per il colloquio

> Scelgo la sintassi dello store in base a complessità e chiarezza per il team. La sintassi Options è ottima per store di dominio semplici, mentre la sintassi setup è più forte per logiche ricche di composable.
