---
id: state-management-vue-vuex-vs-pinia
title: 'Vuex vs Pinia: Unterschiede im Vergleich'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Vergleich der Kernunterschiede zwischen Vuex und Pinia: API-Design, TypeScript-Support, Modularisierung und Migrationshinweise.

---

## 1. Interview-Kernpunkte

1. **Kernunterschiede**: Vuex benoetigt mutations, Pinia nicht; Pinia hat besseren TypeScript-Support; die Modularisierung ist unterschiedlich.
2. **Empfehlung zur Auswahl**: Fuer neue Vue-3-Projekte Pinia, fuer Vue-2-Projekte Vuex.
3. **Migration**: Schritte und Stolperfallen beim Umstieg von Vuex auf Pinia.

---

## 2. Ueberblick der Kernunterschiede

| Merkmal             | Vuex                           | Pinia                         |
| ------------------- | ------------------------------ | ----------------------------- |
| **Vue-Version**     | Vue 2                          | Vue 3                         |
| **API-Komplexitaet**| Hoeher (mutations erforderlich)| Schlanker (keine mutations)   |
| **TypeScript**      | Zusaetzliche Konfiguration     | Native, vollstaendige Unterstuetzung |
| **Modularisierung** | Verschachtelte Module          | Flach, jeder Store ist eigenstaendig |
| **Bundle-Groesse**  | Groesser                       | Kleiner (ca. 1KB)             |
| **DX**              | Gut                            | Besser (HMR, Devtools)        |

---

## 3. API-Unterschiede

### 3.1 Mutations vs Actions

**Vuex**: `mutations` sind fuer synchrone State-Aenderungen erforderlich.

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});
```

**Pinia**: Keine `mutations`, State wird direkt in `actions` geaendert.

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++; // direkte Aenderung
    },
  },
});
```

**Wesentliche Differenz**:
- **Vuex**: State wird synchron ueber `mutations` geaendert, `actions` rufen via `commit` auf.
- **Pinia**: `actions` duerfen den State direkt aendern, synchron und asynchron.

### 3.2 State-Definition

**Vuex**: `state` kann Objekt oder Funktion sein.

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **muss eine Funktion sein**, um Shared State ueber Instanzen zu vermeiden.

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: getters erhalten `(state, getters)`.

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**: getters koennen `this` verwenden, um auf andere getters zuzugreifen.

```typescript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne(): number {
    return this.doubleCount + 1;
  },
}
```

### 3.4 Nutzung in Komponenten

**Vuex**: Verwendung von `mapState`, `mapGetters`, `mapActions`.

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**: Store-Instanz direkt nutzen, mit `storeToRefs` reaktive Werte extrahieren.

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Unterschiede bei der Modularisierung

### 4.1 Vuex Modules (verschachtelt)

**Vuex**: Verschachtelte Module, meist mit `namespaced: true`.

```javascript
// stores/user.js
export default {
  namespaced: true,
  state: { name: 'John' },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
  },
};

// Verwendung in der Komponente
this.$store.dispatch('user/SET_NAME', 'Jane');
```

### 4.2 Pinia Stores (flach)

**Pinia**: Jeder Store ist unabhaengig, keine Verschachtelung notwendig.

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'John' }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});

// Verwendung in der Komponente
const userStore = useUserStore();
userStore.setName('Jane');
```

**Wesentliche Differenz**:
- **Vuex**: Namensraeume und Modul-Praefixe notwendig.
- **Pinia**: Unabhaengige Stores ohne Namespace-Praefix.

---

## 5. TypeScript-Unterstuetzung

### 5.1 Vuex mit TypeScript

**Vuex**: Zusatzauswand fuer Typen und oft unvollstaendige Inferenz.

```typescript
// stores/types.ts
export interface State {
  count: number;
  user: { name: string; age: number };
}

// stores/index.ts
import { createStore, Store } from 'vuex';
import { State } from './types';

export default createStore<State>({
  state: { count: 0, user: { name: 'John', age: 30 } },
});

// Verwendung in der Komponente
const store = useStore<State>();
```

### 5.2 Pinia mit TypeScript

**Pinia**: Native Typinferenz und gute Autovervollstaendigung.

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // automatische Typinferenz
  },
  actions: {
    increment() {
      this.count++; // vollstaendige Typinferenz
    },
  },
});

// Verwendung in der Komponente
const store = useCounterStore();
store.count;
store.doubleCount;
store.increment();
```

**Wesentliche Differenz**:
- **Vuex**: Mehr manuelle Typdefinition, eingeschraenktere Inferenz.
- **Pinia**: Bessere Inferenz und DX out of the box.

---

## 6. Migrationsleitfaden

### 6.1 Grundlegende Schritte

1. **Pinia installieren**

```bash
npm install pinia
```

2. **Vuex Store ersetzen**

```javascript
// Alt: Vuex
import { createStore } from 'vuex';
export default createStore({ ... });

// Neu: Pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **Store-Definition umstellen**

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

4. **Komponentennutzung aktualisieren**

```javascript
// Vuex
import { mapState, mapActions } from 'vuex';
computed: { ...mapState(['count']) },
methods: { ...mapActions(['increment']) },

// Pinia
import { storeToRefs } from 'pinia';
const store = useCounterStore();
const { count } = storeToRefs(store);
const { increment } = store;
```

### 6.2 Haeufige Migrationsfragen

**Frage 1: Was passiert mit Vuex-Modulen?**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia: pro Modul ein eigener Store
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**Frage 2: Wie mit Namespaces umgehen?**

```javascript
// Vuex: Namespace-Praefix notwendig
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia: direkte API
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. Warum braucht Pinia keine mutations?

**Gruende**:

1. **Reaktivitaet in Vue 3**
   - Vue 3 nutzt Proxy und kann Aenderungen direkt verfolgen.
   - Der Umweg ueber mutations ist nicht mehr notwendig.

2. **Einfachere API**
   - Ohne mutations weniger Boilerplate.
   - Actions duerfen state direkt aendern, synchron wie asynchron.

3. **Bessere Developer Experience**
   - Weniger Konzepte und weniger indirekte Aufrufe.
   - Kein staendiges Unterscheiden zwischen `commit` und `dispatch`.

**Beispiel**:

```typescript
// Vuex: mit mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia: direkt aendern
actions: { setCount(count) { this.count = count; } },
```

---

## 8. Wann Vuex, wann Pinia?

**Empfehlungen**:

1. **Neuprojekt**
   - Vue 3: **Pinia bevorzugen**
   - Vue 2: Vuex verwenden

2. **Bestehendes Projekt**
   - Vue 2 + Vuex: Kann weiterlaufen, ggf. spaeter auf Vue 3 + Pinia migrieren
   - Vue 3 + Vuex: Migration zu Pinia optional, nicht zwingend

3. **Projektanforderungen**
   - Starker TypeScript-Fokus: **Pinia**
   - Schlanke API gewuenscht: **Pinia**
   - Team tief in Vuex eingearbeitet: Vuex ist weiterhin moeglich

**Kurzfazit**:
- Neue Vue-3-Projekte: **Pinia klar empfohlen**
- Vue-2-Projekte: Vuex pragmatisch beibehalten
- Vue-3-Bestandsprojekte mit Vuex: Migration abwaegen, aber nicht erzwingen

---

## 9. Interview-Zusammenfassung

### 9.1 Kernunterschiede

**Moegliche Antwort:**

> Vuex und Pinia loesen beide State-Management in Vue, unterscheiden sich aber deutlich bei API, TypeScript und Modularisierung. Vuex nutzt mutations und oft Namespaces, Pinia arbeitet schlanker mit direkten actions und unabhaengigen Stores. Dazu bietet Pinia in Vue 3 eine deutlich bessere Typinferenz. Fuer neue Vue-3-Projekte empfehle ich deshalb Pinia.

**Wichtige Punkte:**
- ✅ API-Komplexitaet
- ✅ TypeScript-Support
- ✅ Modularisierungsmodell
- ✅ Empfehlung je nach Projekttyp

### 9.2 Warum keine mutations in Pinia?

**Moegliche Antwort:**

> Pinia verzichtet auf mutations, weil Vue 3 durch Proxy Aenderungen direkt verfolgen kann. Dadurch wird die API schlanker, Boilerplate reduziert sich und die Arbeit mit Stores ist direkter. Actions reichen fuer synchrone und asynchrone Aenderungen voll aus.

**Wichtige Punkte:**
- ✅ Vue-3-Reaktivitaet als Basis
- ✅ API-Vereinfachung
- ✅ Bessere DX

---

## 10. Abschluss

**Moegliche Antwort:**

> Der Hauptunterschied zwischen Vuex und Pinia liegt in API-Design, TypeScript-Erlebnis und Modulstruktur. Pinia ist fuer Vue 3 die zeitgemaesse Wahl: weniger Boilerplate, bessere Typinferenz und flache, klare Store-Struktur. Bei Migrationen gilt: mutations entfernen, Module in einzelne Stores aufteilen und Komponentenzugriffe auf `storeToRefs` plus direkte actions umstellen.

**Wichtige Punkte:**
- ✅ Unterschiede kompakt erklaeren
- ✅ Auswahlkriterien nennen
- ✅ Migrationspfad beschreiben
- ✅ Praxiserfahrung betonen

## Referenzen

- [Vuex Dokumentation](https://vuex.vuejs.org/)
- [Pinia Dokumentation](https://pinia.vuejs.org/)
- [Migration von Vuex zu Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
