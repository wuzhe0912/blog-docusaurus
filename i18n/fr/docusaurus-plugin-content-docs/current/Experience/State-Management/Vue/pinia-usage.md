---
id: state-management-vue-pinia-usage
title: 'Pinia en pratique'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Dans un projet multi-marques: comment utiliser les stores Pinia dans les composants et les composables, et comment organiser la communication entre stores.

---

## 1. Points clefs pour l'entretien

1. **Usage dans les composants**: utiliser `storeToRefs` pour conserver la réactivité; les actions peuvent être destructurées directement.
2. **Composition via composables**: combiner plusieurs stores dans des composables pour encapsuler la logique métier.
3. **Communication entre stores**: privilégier l'orchestration dans les composables pour éviter les dépendances circulaires.

---

## 2. Utiliser un store dans un composant

### 2.1 Usage de base

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// Utiliser directement l'instance du store
const authStore = useAuthStore();

// Lire le state
console.log(authStore.access_token);

// Appeler une action
authStore.setToptVerified(true);

// Lire un getter
console.log(authStore.isLogin);
</script>
```

### 2.2 Destructurer avec `storeToRefs` (important)

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// ❌ Incorrect: perte de réactivité
const { access_token, isLogin } = authStore;

// ✅ Correct: réactivité préservée
const { access_token, isLogin } = storeToRefs(authStore);

// ✅ Les actions peuvent être destructurées directement
const { setToptVerified } = authStore;
</script>
```

**Pourquoi la destructuration directe casse la réactivité?**

- Le state et les getters Pinia sont réactifs
- La destructuration directe coupe le lien réactif
- `storeToRefs` convertit les propriétés en `ref` et préserve la réactivité
- Les actions ne sont pas réactives, donc destructuration directe possible

---

## 3. Utiliser les stores dans des composables

### 3.1 Cas pratique: useGame.ts

Les composables sont le meilleur endroit pour combiner la logique de plusieurs stores.

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1) Importer plusieurs stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2) Destructurer state/getters avec storeToRefs
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3) Destructurer les actions directement
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4) Composer la logique métier
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5) Retourner ce dont le composant a besoin
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**Points d'entretien**:
- Les composables orchestrent la logique de plusieurs stores
- `storeToRefs` pour les valeurs réactives
- Les actions peuvent être destructurées directement
- La logique métier complexe doit sortir des composants

---

## 4. Communication entre stores

### 4.1 Méthode 1: appeler un autre store depuis un store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Appeler une méthode d'un autre store
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Méthode 2: combiner plusieurs stores dans un composable (recommandé)

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // Initialiser chaque store dans l'ordre
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**Points d'entretien**:
- ✅ Combiner les stores dans les composables
- ❌ Éviter les dépendances circulaires entre stores
- 🎯 Respecter la responsabilité unique de chaque store

---

## 5. Cas pratique: flow de connexion utilisateur

Exemple complet de collaboration entre plusieurs stores.

### 5.1 Schéma de flux

```
L'utilisateur clique sur Connexion
     ↓
Appel de useAuth().handleLogin()
     ↓
Requête API de connexion
     ↓
Succès -> authStore stocke le token
     ↓
useUserInfo().getUserInfo()
     ↓
userInfoStore stocke les infos utilisateur
     ↓
useGame().initGameList()
     ↓
gameStore stocke la liste de jeux
     ↓
Redirection vers la page d'accueil
```

### 5.2 Exemple de code

```typescript
// 1) authStore.ts - Gestion de l'état d'authentification
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // Persistance des informations d'auth
});

// 2) userInfoStore.ts - Gestion des infos utilisateur
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // Pas de persistance pour les données sensibles
});

// 3) useAuth.ts - Composition de la logique d'auth
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // Mettre à jour authStore
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id,
      });
      return true;
    }
    return false;
  }

  return {
    access_token,
    isLogin,
    handleLogin,
  };
}

// 4) LoginPage.vue - Page de connexion
<script setup lang="ts">
import { useAuth } from 'src/common/hooks/useAuth';
import { useUserInfo } from 'src/common/composables/useUserInfo';
import { useGame } from 'src/common/composables/useGame';
import { useRouter } from 'vue-router';

const { handleLogin } = useAuth();
const { getUserInfo } = useUserInfo();
const { initGameList } = useGame();
const router = useRouter();

const onSubmit = async (formData: LoginForm) => {
  // Étape 1: connexion
  const success = await handleLogin(formData);
  if (success) {
    // Étape 2: récupérer les infos utilisateur
    await getUserInfo();
    // Étape 3: initialiser la liste de jeux
    await initGameList();
    // Étape 4: rediriger vers l'accueil
    router.push('/');
  }
};
</script>
```

**Points d'entretien**:

1. **Séparation des responsabilités**
   - `authStore`: uniquement l'état d'authentification
   - `userInfoStore`: uniquement les informations utilisateur
   - `useAuth`: logique métier liée à l'auth
   - `useUserInfo`: logique métier liée aux informations utilisateur

2. **Flux de données réactif**
   - `storeToRefs` préserve la réactivité
   - Les mises à jour store re-rendent automatiquement les composants

3. **Stratégie de persistance**
   - `authStore` persiste (session maintenue après refresh)
   - `userInfoStore` ne persiste pas (sécurité)

---

## 6. Réponse d'entretien (version courte)

### 6.1 Usage de `storeToRefs`

**Réponse possible:**

> Dans un composant, si je destructure state/getters d'un store Pinia, j'utilise `storeToRefs` pour conserver la réactivité. La destructuration directe casse la liaison réactive. En revanche, les actions peuvent être destructurées directement car elles ne sont pas réactives.

**Points clefs:**
- ✅ Rôle de `storeToRefs`
- ✅ Pourquoi il est nécessaire
- ✅ Différence avec les actions

### 6.2 Communication entre stores

**Réponse possible:**

> Il existe deux approches: appeler un store depuis un autre store, ou orchestrer plusieurs stores dans un composable. En pratique, je privilégie les composables pour limiter les dépendances circulaires et garder des responsabilités claires.

**Points clefs:**
- ✅ Deux modèles de communication
- ✅ Approche composable recommandée
- ✅ Éviter les dépendances circulaires

---

## 7. Résumé final

**Réponse possible:**

> Pour bien utiliser Pinia, je m'appuie sur quatre principes: utiliser `storeToRefs` pour les données réactives dans les composants, combiner les stores dans des composables, clarifier les frontières de communication entre stores, et séparer clairement état technique et logique métier.

**Points clefs:**
- ✅ Utilisation correcte de `storeToRefs`
- ✅ Composition des stores via composables
- ✅ Communication inter-stores maîtrisée
- ✅ Séparation claire des responsabilités
