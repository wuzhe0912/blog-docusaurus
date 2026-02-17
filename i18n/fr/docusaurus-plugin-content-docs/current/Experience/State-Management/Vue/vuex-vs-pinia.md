---
id: state-management-vue-vuex-vs-pinia
title: 'Comparaison des differences entre Vuex et Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Comparaison des differences fondamentales entre Vuex et Pinia: design API, support TypeScript, modularisation et guide de migration.

---

## 1. Axes clefs pour l'entretien

1. **Differences fondamentales**: Vuex impose les mutations, Pinia non; Pinia offre un meilleur support TypeScript; la modularisation est differente.
2. **Recommendation de choix**: pour un nouveau projet Vue 3, privilegier Pinia; pour Vue 2, Vuex reste pertinent.
3. **Migration**: etapes et points d'attention pour passer de Vuex a Pinia.

---

## 2. Vue d'ensemble des differences

| Caracteristique      | Vuex                           | Pinia                          |
| -------------------- | ------------------------------ | ------------------------------ |
| **Version Vue**      | Vue 2                          | Vue 3                          |
| **Complexite API**   | Plus verbeuse (mutations)      | Plus simple (sans mutations)   |
| **Support TypeScript** | Configuration supplementaire | Support natif complet          |
| **Modularisation**   | Modules imbriques              | Structure plate, stores independants |
| **Taille**           | Plus lourde                    | Plus legere (environ 1KB)      |
| **Experience dev**   | Bonne                          | Meilleure (HMR, Devtools)      |

---

## 3. Comparaison des APIs

### 3.1 Mutations vs Actions

**Vuex**: les `mutations` sont necessaires pour modifier le state de facon synchrone.

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

**Difference clef**:
- **Vuex**: `actions` appellent `mutations` via `commit`.
- **Pinia**: les `actions` modifient le state directement (sync/async).

### 3.2 Definition du state

**Vuex**: `state` peut etre un objet ou une fonction.

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **doit etre une fonction** pour eviter le partage d'etat entre instances.

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: les getters recoivent `(state, getters)`.

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**: les getters peuvent utiliser `this` pour acceder a d'autres getters.

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

**Pinia**: usage direct du store; `storeToRefs` pour conserver la reactivite.

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Differences de modularisation

### 4.1 Modules Vuex (imbriques)

**Vuex**: modules imbriques avec `namespaced: true`.

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

**Pinia**: chaque store est independant, sans imbrication.

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

**Difference clef**:
- **Vuex**: prefixes de namespace necessaires.
- **Pinia**: API directe sans namespace prefixe.

---

## 5. Differences de support TypeScript

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

**Pinia**: infererence de types native et autocompletion plus robuste.

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // type infere automatiquement
  },
  actions: {
    increment() {
      this.count++; // inference et autocompletion complete
    },
  },
});

// Utilisation dans un composant
const store = useCounterStore();
store.count;
store.doubleCount;
store.increment();
```

**Difference clef**:
- **Vuex**: plus de definitions manuelles, inference limitee.
- **Pinia**: inference native plus fiable.

---

## 6. Guide de migration

### 6.1 Etapes de base

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

3. **Convertir les definitions de store**

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

4. **Mettre a jour l'usage dans les composants**

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

### 6.2 Questions frequentes lors de la migration

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
// Vuex: prefixe de namespace
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia: appel direct
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. Pourquoi Pinia n'a pas besoin de mutations?

**Raisons**:

1. **Systeme reactif de Vue 3**
   - Vue 3 s'appuie sur Proxy et suit les modifications directement.
   - Le detour par mutations n'est plus necessaire.

2. **API simplifiee**
   - Moins de boilerplate.
   - Les actions couvrent les mises a jour sync et async.

3. **Meilleure experience de dev**
   - Moins de concepts a memoriser.
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
   - Vue 3: **Pinia recommande**
   - Vue 2: Vuex reste le choix naturel

2. **Projet existant**
   - Vue 2 + Vuex: possible de rester sur Vuex, ou migrer plus tard
   - Vue 3 + Vuex: migration vers Pinia envisageable, pas obligatoire

3. **Besoins projet**
   - Fort besoin TypeScript: **Pinia**
   - API plus lisible: **Pinia**
   - Equipe experte Vuex: continuer Vuex peut etre pragmatique

**Resume**:
- Nouveau projet Vue 3: **Pinia fortement recommande**
- Projet Vue 2: Vuex
- Projet Vue 3 existant avec Vuex: migration selon ROI, pas par reflexe

---

## 9. Synthese pour entretien

### 9.1 Differences essentielles

**Reponse possible:**

> Vuex et Pinia resolvent le meme probleme, mais Pinia simplifie fortement l'approche: pas de mutations, stores independants, meilleure inference TypeScript, et une experience de dev plus fluide dans Vue 3. Pour un nouveau projet Vue 3, je recommande Pinia.

**Points clefs:**
- ✅ Complexite API
- ✅ Qualite du support TypeScript
- ✅ Strategie de modularisation
- ✅ Recommandation selon le contexte

### 9.2 Pourquoi pas de mutations dans Pinia?

**Reponse possible:**

> Pinia s'appuie sur la reactivite de Vue 3 (Proxy), qui permet de suivre les changements de state directement. Cela reduit le boilerplate, simplifie l'API et rend le code plus lisible, tout en gardant les cas sync/async dans les actions.

**Points clefs:**
- ✅ Reactivite de Vue 3
- ✅ Simplification API
- ✅ DX amelioree

---

## 10. Conclusion

**Reponse possible:**

> La difference principale entre Vuex et Pinia tient au design API, a TypeScript et a la modularisation. Pinia est plus moderne pour Vue 3: moins de ceremonie, meilleure inference, stores clairs. En migration, il faut retirer les mutations, convertir les modules en stores independants et mettre a jour l'acces composant avec `storeToRefs` + actions directes.

**Points clefs:**
- ✅ Differences bien structurees
- ✅ Conseils de choix
- ✅ Etapes de migration
- ✅ Retour d'experience concret

## References

- [Documentation Vuex](https://vuex.vuejs.org/)
- [Documentation Pinia](https://pinia.vuejs.org/)
- [Migration de Vuex vers Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
