---
id: state-management-vue-pinia-best-practices
title: 'Bonnes Pratiques et Erreurs Courantes de Pinia'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Bonnes pratiques et gestion des erreurs courantes de Pinia Store dans un projet de plateforme multi-marques.

---

## 1. Axes principaux de réponse en entretien

1. **Principes de conception**: Principe de responsabilité unique, garder le Store simple, ne pas appeler les APIs directement dans le Store.
2. **Erreurs courantes**: Perte de réactivité par déstructuration directe, appel du Store en dehors de Setup, rupture de la réactivité lors de la modification du State, dépendances circulaires.
3. **Bonnes pratiques**: Utiliser TypeScript, séparation des responsabilités, combiner plusieurs Stores dans les Composables.

---

## 2. Principes de conception du Store

### 2.1 Principe de responsabilité unique

```typescript
// ✅ Bonne conception : Chaque Store ne gère qu'un seul domaine
useAuthStore(); // Uniquement l'authentification
useUserInfoStore(); // Uniquement les informations utilisateur
useGameStore(); // Uniquement les informations de jeu

// ❌ Mauvaise conception : Un Store gère tout
useAppStore(); // Gère l'authentification, l'utilisateur, les jeux, les paramètres...
```

### 2.2 Garder le Store simple

```typescript
// ✅ Recommandé
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ Non recommandé : Store contenant une logique métier complexe
// Devrait être placé dans un composable
```

### 2.3 Ne pas appeler les APIs directement dans le Store

```typescript
// ❌ Non recommandé : Appel API direct dans le Store
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // Appel API
      this.list = data;
    },
  },
});

// ✅ Recommandé : Appeler l'API dans le Composable, Store uniquement pour le stockage
export const useGameStore = defineStore('gameStore', {
  actions: {
    setGameList(list: Game[]) {
      this.list = list;
    },
  },
});

export function useGame() {
  const gameStore = useGameStore();
  async function fetchGames() {
    const { status, data } = await api.getGames(); // Appel API dans le Composable
    if (status) {
      gameStore.setGameList(data); // Store uniquement pour le stockage
    }
  }
  return { fetchGames };
}
```

---

## 3. Utiliser TypeScript

```typescript
// ✅ Définition de types complète
type UserState = {
  info: Response.UserInfo;
  walletList: Response.UserWalletList;
};

export const useUserInfoStore = defineStore('useInfoStore', () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: [],
  });
  return { state };
});
```

---

## 4. Erreurs courantes

### 4.1 Erreur 1 : Perte de réactivité par déstructuration directe

```typescript
// ❌ Incorrect
const { count } = useCounterStore();
count; // Non réactif

// ✅ Correct
const { count } = storeToRefs(useCounterStore());
count.value; // Réactif
```

### 4.2 Erreur 2 : Appel du Store en dehors de Setup

```typescript
// ❌ Incorrect : Appel au niveau du module
const authStore = useAuthStore(); // ❌ Mauvais moment

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ Correct : Appel à l'intérieur de la fonction
export function useAuth() {
  const authStore = useAuthStore(); // ✅ Bon moment
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 Erreur 3 : Rupture de la réactivité lors de la modification du State

```typescript
// ❌ Incorrect : Assignation directe d'un nouveau tableau
function updateList(newList) {
  gameState.list = newList; // Peut perdre la réactivité
}

// ✅ Correct : Utiliser splice ou push
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ Possible aussi : Assignation avec reactive
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 Erreur 4 : Dépendances circulaires

```typescript
// ❌ Incorrect : Dépendance mutuelle entre Stores
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // Dépend de userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // Dépend de authStore ❌ Dépendance circulaire
});

// ✅ Correct : Combiner dans un Composable
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  async function initialize() {
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
    }
  }
  return { initialize };
}
```

### 4.5 Erreur 5 : Oublier le return

```typescript
// ❌ Incorrect : return oublié
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ return oublié, le composant ne peut pas y accéder
});

// ✅ Correct
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ return est obligatoire
});
```

---

## 5. Résumé des points clés d'entretien

### 5.1 Principes de conception du Store

**Réponse possible :**

> Lors de la conception de Pinia Stores, je suis plusieurs principes : 1) Principe de responsabilité unique, chaque Store ne gère qu'un seul domaine ; 2) Garder le Store simple, ne pas inclure de logique métier complexe ; 3) Ne pas appeler les APIs directement dans le Store, appeler les APIs dans les Composables, le Store ne sert qu'au stockage ; 4) Utiliser des définitions de types TypeScript complètes pour améliorer l'expérience de développement.

**Points clés :**
- ✅ Principe de responsabilité unique
- ✅ Store simple
- ✅ Séparation des responsabilités
- ✅ Utilisation de TypeScript

### 5.2 Erreurs courantes et comment les éviter

**Réponse possible :**

> Les erreurs courantes lors de l'utilisation de Pinia incluent : 1) Perte de réactivité par déstructuration directe, il faut utiliser `storeToRefs` ; 2) Appel du Store en dehors de Setup, doit être appelé à l'intérieur de la fonction ; 3) Rupture de la réactivité lors de la modification du State, utiliser `.length = 0` ou `Object.assign` ; 4) Dépendances circulaires, combiner plusieurs Stores dans les Composables ; 5) Oublier le return, les Stores Composition API doivent avoir un return.

**Points clés :**
- ✅ Maintenir la réactivité
- ✅ Moment d'appel correct
- ✅ Méthodes de modification de l'état
- ✅ Éviter les dépendances circulaires

---

## 6. Résumé d'entretien

**Réponse possible :**

> Lors de l'utilisation de Pinia dans le projet, je suis plusieurs bonnes pratiques : 1) La conception du Store suit le principe de responsabilité unique et reste simple ; 2) Ne pas appeler les APIs directement dans le Store, mais dans les Composables ; 3) Utiliser des définitions de types TypeScript complètes ; 4) Prêter attention aux erreurs courantes comme la perte de réactivité, les dépendances circulaires, etc. Ces pratiques assurent la maintenabilité et l'extensibilité du Store.

**Points clés :**
- ✅ Principes de conception du Store
- ✅ Erreurs courantes et comment les éviter
- ✅ Bonnes pratiques
- ✅ Expérience réelle en projet
