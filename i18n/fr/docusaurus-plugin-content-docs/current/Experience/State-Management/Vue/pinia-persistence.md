---
id: state-management-vue-pinia-persistence
title: 'Stratégies de Persistance de Pinia'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Stratégies de persistance pour Pinia Store dans un projet de plateforme multi-marques : utilisation de `piniaPluginPersistedstate` et `useSessionStorage` de VueUse.

---

## 1. Axes principaux de réponse en entretien

1. **Trois méthodes de persistance**: `persist: true`, `useSessionStorage`, persistance manuelle.
2. **Stratégie de sélection**: Pour tout le Store utiliser `persist: true`, pour des champs spécifiques utiliser `useSessionStorage`.
3. **Considérations de sécurité**: Ne pas persister les informations sensibles, persister les préférences utilisateur.

---

## 2. Méthodes de persistance

### 2.1 Pinia Plugin Persistedstate

**Options API :**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // Persistance automatique dans localStorage
});
```

**Configuration personnalisée :**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // Persister uniquement certains champs
}
```

### 2.2 useSessionStorage / useLocalStorage de VueUse

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Persistance automatique dans sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 Persistance manuelle (non recommandé)

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // Sauvegarde manuelle
    },
  },
});
```

---

## 3. Tableau comparatif

| Méthode               | Avantages              | Inconvénients                    | Cas d'utilisation                    |
| --------------------- | ---------------------- | -------------------------------- | ------------------------------------ |
| **persist: true**     | Automatique, simple    | Tout le state est persisté       | Le Store entier nécessite la persistance |
| **useSessionStorage** | Flexible, type-safe    | Doit être défini individuellement | Champs spécifiques                   |
| **Persistance manuelle** | Contrôle total      | Sujet aux erreurs, difficile à maintenir | Non recommandé                 |

---

## 4. Réinitialiser l'état du Store

### 4.1 `$reset()` intégré de Pinia

```typescript
// Supporté par les Options API Store
const store = useMyStore();
store.$reset(); // Réinitialiser à l'état initial
```

### 4.2 Méthode de réinitialisation personnalisée

```typescript
// Composition API Store
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({
    list: [],
    favoriteList: [],
  });

  function resetGameStore() {
    gameState.list = [];
    gameState.favoriteList = [];
  }

  return { gameState, resetGameStore };
});
```

### 4.3 Réinitialisation par lots (cas réel)

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // Réinitialiser plusieurs stores
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // Réinitialiser tous les états à la déconnexion
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. Bonnes pratiques

### 5.1 Stratégie de persistance

```typescript
// ✅ Ne pas persister les informations sensibles
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // Persister
    user_password: undefined, // ❌ Ne jamais persister les mots de passe
  }),
  persist: {
    paths: ['access_token'], // Persister uniquement le token
  },
});
```

### 5.2 Mise à jour par lots avec `$patch`

```typescript
// ❌ Non recommandé : Mises à jour multiples (déclenche plusieurs réactions)
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ Recommandé : Mise à jour par lots (déclenche une seule réaction)
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ La forme fonctionnelle est aussi possible
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. Résumé des points clés d'entretien

### 6.1 Choix de la méthode de persistance

**Réponse possible :**

> Dans le projet, j'utilise trois méthodes de persistance : 1) `persist: true`, le Store entier est automatiquement persisté dans localStorage, adapté aux Stores nécessitant une persistance complète ; 2) `useSessionStorage` ou `useLocalStorage`, persistance de champs spécifiques, plus flexible et type-safe ; 3) Persistance manuelle, non recommandé. Pour le choix : les informations sensibles ne sont pas persistées, les préférences utilisateur sont persistées.

**Points clés :**
- ✅ Trois méthodes de persistance
- ✅ Stratégie de sélection
- ✅ Considérations de sécurité

### 6.2 Mise à jour par lots et réinitialisation

**Réponse possible :**

> Lors de la mise à jour de l'état du Store, j'utilise `$patch` pour les mises à jour par lots qui ne déclenchent qu'une seule réaction, améliorant les performances. Pour la réinitialisation de l'état, les Options API Stores peuvent utiliser `$reset()`, les Composition API Stores nécessitent une méthode de réinitialisation personnalisée. Lors de la déconnexion, on peut réinitialiser plusieurs Stores par lots pour assurer un nettoyage complet de l'état.

**Points clés :**
- ✅ `$patch` pour la mise à jour par lots
- ✅ Méthodes de réinitialisation de l'état
- ✅ Stratégie de réinitialisation par lots

---

## 7. Résumé d'entretien

**Réponse possible :**

> Lors de l'implémentation de la persistance Pinia Store dans le projet, j'utilise `persist: true` pour la persistance automatique du Store entier ou `useSessionStorage` pour la persistance de champs spécifiques. La stratégie de sélection est : les informations sensibles ne sont pas persistées, les préférences utilisateur sont persistées. Lors de la mise à jour de l'état, j'utilise `$patch` pour les mises à jour par lots afin d'améliorer les performances. Pour la réinitialisation de l'état, Options API utilise `$reset()`, Composition API utilise des méthodes de réinitialisation personnalisées.

**Points clés :**
- ✅ Méthodes de persistance et sélection
- ✅ Stratégie de mise à jour par lots
- ✅ Méthodes de réinitialisation de l'état
- ✅ Expérience réelle en projet
