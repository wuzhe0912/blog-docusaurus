---
id: state-management-vue-vuex-vs-pinia
title: 'Comparaison des différences entre Vuex et Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Comparaison des différences fondamentales entre Vuex et Pinia: design API, support TypeScript, modularisation et guide de migration.

---

## 1. Axes clefs pour l'entretien

1. **Différences fondamentales**: Vuex impose les mutations, Pinia non; Pinia offre un meilleur support TypeScript; la modularisation est différente.
2. **Recommendation de choix**: pour un nouveau projet Vue 3, privilégier Pinia; pour Vue 2, Vuex reste pertinent.
3. **Migration**: étapes et points d'attention pour passer de Vuex à Pinia.

---

## 2. Vue d'ensemble des différences

| Caractéristique      | Vuex                           | Pinia                          |
| -------------------- | ------------------------------ | ------------------------------ |
| **Version Vue**      | Vue 2                          | Vue 3                          |
| **Complexité API**   | Plus verbeuse (mutations)      | Plus simple (sans mutations)   |
| **Support TypeScript** | Configuration supplémentaire | Support natif complet          |
| **Modularisation**   | Modules imbriqués              | Structure plate, stores indépendants |
| **Taille**           | Plus lourde                    | Plus légère (environ 1KB)      |
| **Expérience dev**   | Bonne                          | Meilleure (HMR, Devtools)      |

---

## 3. Comparaison des APIs

### 3.1 Mutations vs Actions

**Vuex**: les `mutations` sont nécessaires pour modifier le state de façon synchrone.

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

**Pinia**: pas de `mutations`, on modifie le state directement dans `actions`.

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++; // modification directe
    },
  },
});
```

**Différence clef**:
- **Vuex**: `actions` appellent `mutations` via `commit`.
- **Pinia**: les `actions` modifient le state directement (sync/async).

### 3.2 Définition du state

**Vuex**: `state` peut être un objet ou une fonction.

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **doit être une fonction** pour éviter le partage d'état entre instances.

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: les getters reçoivent `(state, getters)`.

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**: les getters peuvent utiliser `this` pour accéder à d'autres getters.

```typescript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne(): number {
    return this.doubleCount + 1;
  },
}
```

### 3.4 Utilisation dans les composants

**Vuex**: via `mapState`, `mapGetters`, `mapActions`.

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**: usage direct du store; `storeToRefs` pour conserver la réactivité.

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Différences de modularisation

### 4.1 Modules Vuex (imbriqués)

**Vuex**: modules imbriqués avec `namespaced: true`.

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

// Utilisation dans un composant
this.$store.dispatch('user/SET_NAME', 'Jane');
```

### 4.2 Stores Pinia (plats)

**Pinia**: chaque store est indépendant, sans imbrication.

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

// Utilisation dans un composant
const userStore = useUserStore();
userStore.setName('Jane');
```

**Différence clef**:
- **Vuex**: préfixes de namespace nécessaires.
- **Pinia**: API directe sans namespace préfixé.

---

## 5. Différences de support TypeScript

### 5.1 TypeScript avec Vuex

**Vuex**: demande plus de typage manuel.

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

// Utilisation dans un composant
const store = useStore<State>();
```

### 5.2 TypeScript avec Pinia

**Pinia**: inférence de types native et autocomplétion plus robuste.

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // type inféré automatiquement
  },
  actions: {
    increment() {
      this.count++; // inférence et autocomplétion complète
    },
  },
});

// Utilisation dans un composant
const store = useCounterStore();
store.count;
store.doubleCount;
store.increment();
```

**Différence clef**:
- **Vuex**: plus de définitions manuelles, inférence limitée.
- **Pinia**: inférence native plus fiable.

---

## 6. Guide de migration

### 6.1 Étapes de base

1. **Installer Pinia**

```bash
npm install pinia
```

2. **Remplacer le store Vuex**

```javascript
// Ancien: Vuex
import { createStore } from 'vuex';
export default createStore({ ... });

// Nouveau: Pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **Convertir les définitions de store**

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

4. **Mettre à jour l'usage dans les composants**

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

### 6.2 Questions fréquentes lors de la migration

**Question 1: que faire des modules Vuex?**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia: un store par module
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**Question 2: comment remplacer les namespaces?**

```javascript
// Vuex: préfixe de namespace
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia: appel direct
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. Pourquoi Pinia n'a pas besoin de mutations?

**Raisons**:

1. **Système réactif de Vue 3**
   - Vue 3 s'appuie sur Proxy et suit les modifications directement.
   - Le détour par mutations n'est plus nécessaire.

2. **API simplifiée**
   - Moins de boilerplate.
   - Les actions couvrent les mises à jour sync et async.

3. **Meilleure expérience de dev**
   - Moins de concepts à mémoriser.
   - Plus besoin de distinguer sans cesse `commit` et `dispatch`.

**Exemple**:

```typescript
// Vuex: avec mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia: modification directe
actions: { setCount(count) { this.count = count; } },
```

---

## 8. Comment choisir entre Vuex et Pinia?

**Recommandations**:

1. **Nouveau projet**
   - Vue 3: **Pinia recommandé**
   - Vue 2: Vuex reste le choix naturel

2. **Projet existant**
   - Vue 2 + Vuex: possible de rester sur Vuex, ou migrer plus tard
   - Vue 3 + Vuex: migration vers Pinia envisageable, pas obligatoire

3. **Besoins projet**
   - Fort besoin TypeScript: **Pinia**
   - API plus lisible: **Pinia**
   - Équipe experte Vuex: continuer Vuex peut être pragmatique

**Résumé**:
- Nouveau projet Vue 3: **Pinia fortement recommandé**
- Projet Vue 2: Vuex
- Projet Vue 3 existant avec Vuex: migration selon ROI, pas par réflexe

---

## 9. Synthèse pour entretien

### 9.1 Différences essentielles

**Réponse possible:**

> Vuex et Pinia résolvent le même problème, mais Pinia simplifie fortement l'approche: pas de mutations, stores indépendants, meilleure inférence TypeScript, et une expérience de dev plus fluide dans Vue 3. Pour un nouveau projet Vue 3, je recommande Pinia.

**Points clefs:**
- ✅ Complexité API
- ✅ Qualité du support TypeScript
- ✅ Stratégie de modularisation
- ✅ Recommandation selon le contexte

### 9.2 Pourquoi pas de mutations dans Pinia?

**Réponse possible:**

> Pinia s'appuie sur la réactivité de Vue 3 (Proxy), qui permet de suivre les changements de state directement. Cela réduit le boilerplate, simplifie l'API et rend le code plus lisible, tout en gardant les cas sync/async dans les actions.

**Points clefs:**
- ✅ Réactivité de Vue 3
- ✅ Simplification API
- ✅ DX améliorée

---

## 10. Conclusion

**Réponse possible:**

> La différence principale entre Vuex et Pinia tient au design API, à TypeScript et à la modularisation. Pinia est plus moderne pour Vue 3: moins de cérémonie, meilleure inférence, stores clairs. En migration, il faut retirer les mutations, convertir les modules en stores indépendants et mettre à jour l'accès composant avec `storeToRefs` + actions directes.

**Points clefs:**
- ✅ Différences bien structurées
- ✅ Conseils de choix
- ✅ Étapes de migration
- ✅ Retour d'expérience concret

## Références

- [Documentation Vuex](https://vuex.vuejs.org/)
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Migration de Vuex vers Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
