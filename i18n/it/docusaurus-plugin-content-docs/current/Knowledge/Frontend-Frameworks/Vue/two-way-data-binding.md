---
id: vue-two-way-data-binding
title: '[Hard] 📄 Two-way Data Binding (Binding Bidirezionale dei Dati)'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Spiega il principio sottostante di come Vue2 e Vue3 implementano il binding bidirezionale

> Spiega il meccanismo sottostante del binding bidirezionale in Vue2 e Vue3.

Per comprendere il binding bidirezionale di Vue, è necessario capire come funziona il sistema di reattività e come Vue2 e Vue3 lo implementano in modo diverso.

### Implementazione di Vue2

Vue2 utilizza `Object.defineProperty` per implementare la reattività. Avvolge le proprietà degli oggetti con `getter` e `setter`, in modo che letture/scritture possano essere tracciate.

#### 1. Data hijacking (intercettazione dei dati)

Quando i dati del componente vengono inizializzati in Vue2, Vue attraversa ogni proprietà e la converte in `getter`/`setter` tramite `Object.defineProperty`, in modo che letture e scritture possano essere osservate.

#### 2. Raccolta delle dipendenze

Quando una funzione di render viene eseguita e legge proprietà reattive, il `getter` viene eseguito. Vue registra le dipendenze in modo che i componenti interessati possano essere notificati successivamente.

#### 3. Invio degli aggiornamenti

Quando i dati cambiano, il `setter` viene eseguito. Vue notifica i watcher/componenti dipendenti e attiva il re-render per aggiornare il DOM.

#### Esempio Vue2

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // attiva il getter
data.name = 'Vue2 Reactivity'; // attiva il setter
```

#### Limitazioni di Vue2

`Object.defineProperty` ha diverse limitazioni:

- **Non riesce a rilevare l'aggiunta/eliminazione di proprietà** senza `Vue.set()` / `Vue.delete()`
- **Non riesce a rilevare in modo affidabile la mutazione diretta dell'indice dell'array** senza metodi array patchati
- **Sovraccarico prestazionale** dal deep traversal e dalla definizione anticipata di getter/setter

### Implementazione di Vue3

Vue3 utilizza `Proxy` di ES6, che fornisce una capacità di intercettazione più ampia e migliori caratteristiche prestazionali.

#### 1. Data hijacking basato su Proxy

Vue3 avvolge interi oggetti con `new Proxy` invece di definire getter/setter per ogni chiave. Questo permette l'intercettazione di più operazioni, inclusa l'aggiunta/eliminazione di proprietà.

#### 2. Tracciamento delle dipendenze più efficiente

Vue3 non necessita più della definizione anticipata di getter/setter per ogni proprietà. Le trap del Proxy possono gestire le operazioni dinamicamente (es. `get`, `set`, `has`, `deleteProperty`, ecc.).

#### 3. Attivazione degli aggiornamenti più precisa

Vue3 può tracciare le dipendenze con maggiore precisione e ridurre i re-render non necessari.

#### Esempio Vue3

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`get ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`set ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name);
data.name = 'Vue 3 Reactivity';
console.log(data.name);
```

### Confronto Vue2 vs Vue3

| Caratteristica | Vue2 | Vue3 |
| --- | --- | --- |
| Meccanismo principale | `Object.defineProperty` | `Proxy` |
| Rilevamento nuove proprietà | ❌ richiede `Vue.set()` | ✅ supporto nativo |
| Rilevamento eliminazione proprietà | ❌ richiede `Vue.delete()` | ✅ supporto nativo |
| Rilevamento assegnazione indice array | ❌ limitato | ✅ supporto nativo |
| Prestazioni | deep walk anticipato | lazy + più efficiente |
| Supporto browser | IE9+ | nessun supporto IE11 |

### Conclusione

Vue2 utilizza `Object.defineProperty`, che funziona ma ha limitazioni note.
Vue3 utilizza `Proxy`, offrendo un sistema di reattività più completo e flessibile con migliori prestazioni.

## 2. Perché Vue3 usa `Proxy` invece di `Object.defineProperty`?

> Perché Vue3 ha scelto `Proxy` rispetto a `Object.defineProperty`?

### Motivazioni principali

#### 1. Capacità di intercettazione più forte

`Proxy` può intercettare molte operazioni, mentre `Object.defineProperty` copre solo get/set delle proprietà.

```js
// Operazioni che Proxy può intercettare
const handler = {
  get() {},
  set() {},
  has() {},
  deleteProperty() {},
  ownKeys() {},
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},
  construct() {},
};
```

#### 2. Tracciamento nativo degli indici array

```js
// Limitazione di Vue2
const arr = [1, 2, 3];
arr[0] = 10; // spesso non tracciato nel modello defineProperty stile Vue2

// Vue3
const arr2 = reactive([1, 2, 3]);
arr2[0] = 10; // tracciato
```

#### 3. Supporto nativo per aggiunta/eliminazione dinamica di proprietà

```js
// Vue2 necessita di API speciali
Vue.set(obj, 'newKey', 'value');

// Vue3 nativo
const obj = reactive({});
obj.newKey = 'value';
delete obj.newKey;
```

#### 4. Modello prestazionale migliore

```js
// Vue2: deep traversal + defineReactive per ogni chiave
function observe(obj) {
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: wrapper proxy
function reactive(obj) {
  return new Proxy(obj, handler);
}
```

#### 5. Implementazione interna più semplice

Il core della reattività di Vue3 è più pulito e più facile da mantenere.

### Perché Vue2 non ha usato Proxy

Principalmente per **compatibilità browser**:

- Vue2 (rilasciato nel 2016) necessitava di ampio supporto incluso IE
- `Proxy` non può essere completamente polyfillato
- Vue3 ha abbandonato il supporto IE11, rendendo Proxy utilizzabile

### Confronto pratico

```js
// ===== Limitazioni Vue2 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3],
  },
});

// non reattivo in modo affidabile in Vue2 senza API speciali
vm.obj.b = 2;
delete vm.obj.a;
vm.arr[0] = 10;
vm.arr.length = 0;

// Workaround Vue2
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Supporto nativo Vue3 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3],
});

state.obj.b = 2;
delete state.obj.a;
state.arr[0] = 10;
state.arr.length = 0;
```

### Riepilogo

Vue3 utilizza `Proxy` per:

1. ✅ Fornire copertura di reattività completa (aggiunta/eliminazione/modifiche indice)
2. ✅ Migliorare le prestazioni (meno traversal anticipato)
3. ✅ Semplificare l'implementazione
4. ✅ Migliorare l'esperienza sviluppatore (meno API speciali)

Compromesso: nessun supporto per IE11 legacy, che è accettabile per target web moderni.

## Riferimenti

- [Vue 2 Reattività in Profondità](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reattività in Profondità](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
