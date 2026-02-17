---
id: state-management-vue-pinia-store-patterns
title: "Modèles d'Implémentation de Pinia Store"
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Dans un projet de plateforme multi-marques, les Pinia Stores sont implémentés avec Options API et Composition API, en choisissant le modèle approprié selon le scénario.

---

## 1. Axes principaux de réponse en entretien

1. **Deux méthodes d'écriture** : Options API et Composition API, à choisir selon le scénario.
2. **Stratégie de sélection** : Stores simples avec Composition API, stores avec persistance avec Options API, logique complexe avec Composition API.
3. **Différences clés** : State doit être une fonction, `this` dans les Actions pointe vers l'instance du store, deux méthodes d'écriture pour les Getters.

---

## 2. Options API (Écriture traditionnelle)

### 2.1 Structure de base

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State : Définir l'état
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions : Définir les méthodes
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters : Définir les propriétés calculées
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ Configuration de persistance
  persist: true, // Persistance automatique dans localStorage
});
```

### 2.2 Points clés

**1. State doit être une fonction**

```typescript
// ✅ Correct
state: () => ({ count: 0 });

// ❌ Incorrect (entraîne le partage d'état entre plusieurs instances)
state: {
  count: 0;
}
```

**2. `this` dans les Actions pointe vers l'instance du store**

```typescript
actions: {
  increment() {
    this.count++; // Modification directe du state
  },
};
```

**3. Deux méthodes d'écriture pour les Getters**

```typescript
getters: {
  // Méthode 1 : Retourner la valeur directement (recommandé)
  doubleCount: (state) => state.count * 2,

  // Méthode 2 : Retourner un computed (mise à jour réactive)
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup (Écriture moderne)

### 3.1 Exemple de Store simple

```typescript
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

**Points clés d'entretien** :
- Utilisation de `useSessionStorage` de `@vueuse/core` pour la persistance
- Plus proche de l'écriture Composition API
- Tous les `ref` ou `reactive` sont le state
- Toutes les fonctions sont des actions
- Tous les `computed` sont des getters

### 3.2 Exemple de Store complexe

```typescript
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';

type GameState = {
  list: Response.GameList;
  allGameList: Response.AllGameList;
  favoriteList: Response.FavoriteList;
  favoriteMap: Response.FavoriteMap;
};

export const useGameStore = defineStore('gameStore', () => {
  // 📦 State (avec reactive)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: [],
    },
    favoriteList: [],
    favoriteMap: {},
  });

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING;
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO;
    gameState.allGameList.SLOT = data.SLOT;
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data;
    gameState.favoriteMap = {};
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true;
    });
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0; // Maintenir la réactivité
    gameState.favoriteMap = {};
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList,
  };
});
```

**Points clés** :

**1. Utilisation de `reactive` vs `ref`**

```typescript
// 📌 Utiliser reactive (recommandé pour les objets complexes)
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // Accès direct

// 📌 Utiliser ref (recommandé pour les types primitifs)
const count = ref(0);
count.value++; // Nécessite .value
```

**2. Pourquoi utiliser `.length = 0` pour vider un tableau ?**

```typescript
// ✅ Maintient la réactivité (recommandé)
gameState.favoriteList.length = 0;

// ❌ Perd la réactivité
gameState.favoriteList = [];
```

---

## 4. Comparaison des deux méthodes d'écriture

| Caractéristique         | Options API              | Composition API (Setup)            |
| ----------------------- | ------------------------ | ---------------------------------- |
| **Style de syntaxe**    | Configuration objet      | Fonctionnel                        |
| **Courbe d'apprentissage** | Plus basse (similaire à Vue 2) | Plus haute (nécessite de comprendre Composition API) |
| **Support TypeScript**  | Bon                      | Meilleur                           |
| **Flexibilité**         | Moyenne                  | Haute (composition libre de logique) |
| **Lisibilité**          | Structure claire         | Nécessite une bonne organisation   |
| **Scénario recommandé** | Stores simples           | Logique complexe, composition de fonctions |

**Stratégie de sélection du projet** :
- **Stores simples (< 5 states)** : Composition API
- **Stores avec persistance** : Options API + `persist: true`
- **Logique métier complexe** : Composition API (plus flexible)
- **Stores avec Getters** : Options API (syntaxe plus claire)

---

## 5. Résumé des points clés d'entretien

### 5.1 Choix entre les deux méthodes d'écriture

**Réponse possible :**

> Dans le projet, j'utilise deux méthodes de définition de Store : Options API et Composition API. Options API utilise la configuration objet, syntaxe similaire à Vue 2, courbe d'apprentissage plus basse, adaptée aux stores simples et stores avec persistance. Composition API utilise l'écriture fonctionnelle, plus flexible, meilleur support TypeScript, adaptée à la logique complexe. La stratégie de sélection : stores simples avec Composition API, stores avec persistance avec Options API, logique métier complexe avec Composition API.

**Points clés :**
- ✅ Différences entre les deux méthodes d'écriture
- ✅ Stratégie de sélection
- ✅ Expérience réelle en projet

### 5.2 Points techniques clés

**Réponse possible :**

> Lors de l'implémentation des Stores, il y a plusieurs points techniques clés : 1) State doit être une fonction pour éviter le partage d'état entre plusieurs instances ; 2) `this` dans les Actions pointe vers l'instance du store, peut modifier le state directement ; 3) Les Getters ont deux méthodes d'écriture, peuvent retourner des valeurs directement ou retourner un computed ; 4) Utiliser `reactive` pour les objets complexes, `ref` pour les types primitifs ; 5) Vider les tableaux avec `.length = 0` pour maintenir la réactivité.

**Points clés :**
- ✅ State doit être une fonction
- ✅ Utilisation de `this` dans les Actions
- ✅ Méthodes d'écriture des Getters
- ✅ reactive vs ref
- ✅ Maintenir la réactivité

---

## 6. Résumé d'entretien

**Réponse possible :**

> Dans le projet, j'utilise Options API et Composition API pour implémenter les Pinia Stores. Options API convient aux stores simples et stores avec persistance, syntaxe claire. Composition API convient à la logique complexe, plus flexible et meilleur support TypeScript. La stratégie de sélection est basée sur la complexité et les besoins du Store. Les points techniques clés incluent : State doit être une fonction, utilisation de `this` dans les Actions, deux méthodes d'écriture des Getters et le maintien de la réactivité.

**Points clés :**
- ✅ Différences et choix entre les deux méthodes d'écriture
- ✅ Points techniques clés
- ✅ Expérience réelle en projet
