---
id: state-management-vue-pinia-usage
title: 'Pinia en pratique'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Dans un projet multi-marques: comment utiliser les stores Pinia dans les composants et les composables, et comment organiser la communication entre stores.

---

## 1. Points clefs pour l'entretien

1. **Usage dans les composants**: utiliser `storeToRefs` pour conserver la reactivite; les actions peuvent etre destructurees directement.
2. **Composition via composables**: combiner plusieurs stores dans des composables pour encapsuler la logique metier.
3. **Communication entre stores**: privilegier l'orchestration dans les composables pour eviter les dependances circulaires.

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

// ❌ Incorrect: perte de reactivite
const { access_token, isLogin } = authStore;

// ✅ Correct: reactivite preservee
const { access_token, isLogin } = storeToRefs(authStore);

// ✅ Les actions peuvent etre destructurees directement
const { setToptVerified } = authStore;
</script>
```

**Pourquoi la destructuration directe casse la reactivite?**

- Le state et les getters Pinia sont reactifs
- La destructuration directe coupe le lien reactif
- `storeToRefs` convertit les proprietes en `ref` et preserve la reactivite
- Les actions ne sont pas reactives, donc destructuration directe possible

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

  // 4) Composer la logique metier
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
- `storeToRefs` pour les valeurs reactives
- Les actions peuvent etre destructurees directement
- La logique metier complexe doit sortir des composants

---

## 4. Communication entre stores

### 4.1 Methode 1: appeler un autre store depuis un store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Appeler une methode d'un autre store
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Methode 2: combiner plusieurs stores dans un composable (recommande)

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
- ❌ Eviter les dependances circulaires entre stores
- 🎯 Respecter la responsabilite unique de chaque store

---

## 5. Cas pratique: flow de connexion utilisateur

Exemple complet de collaboration entre plusieurs stores.

### 5.1 Schema de flux

```
L'utilisateur clique sur Connexion
     ↓
Appel de useAuth().handleLogin()
     ↓
Requete API de connexion
     ↓
Succes -> authStore stocke le token
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
// 1) authStore.ts - Gestion de l'etat d'authentification
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
  persist: false, // Pas de persistance pour les donnees sensibles
});

// 3) useAuth.ts - Composition de la logique d'auth
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // Mettre a jour authStore
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
  // Etape 1: connexion
  const success = await handleLogin(formData);
  if (success) {
    // Etape 2: recuperer les infos utilisateur
    await getUserInfo();
    // Etape 3: initialiser la liste de jeux
    await initGameList();
    // Etape 4: rediriger vers l'accueil
    router.push('/');
  }
};
</script>
```

**Points d'entretien**:

1. **Separation des responsabilites**
   - `authStore`: uniquement l'etat d'authentification
   - `userInfoStore`: uniquement les informations utilisateur
   - `useAuth`: logique metier liee a l'auth
   - `useUserInfo`: logique metier liee aux informations utilisateur

2. **Flux de donnees reactif**
   - `storeToRefs` preserve la reactivite
   - Les mises a jour store re-rendent automatiquement les composants

3. **Strategie de persistance**
   - `authStore` persiste (session maintenue apres refresh)
   - `userInfoStore` ne persiste pas (securite)

---

## 6. Reponse d'entretien (version courte)

### 6.1 Usage de `storeToRefs`

**Reponse possible:**

> Dans un composant, si je destructure state/getters d'un store Pinia, j'utilise `storeToRefs` pour conserver la reactivite. La destructuration directe casse la liaison reactive. En revanche, les actions peuvent etre destructurees directement car elles ne sont pas reactives.

**Points clefs:**
- ✅ Role de `storeToRefs`
- ✅ Pourquoi il est necessaire
- ✅ Difference avec les actions

### 6.2 Communication entre stores

**Reponse possible:**

> Il existe deux approches: appeler un store depuis un autre store, ou orchestrer plusieurs stores dans un composable. En pratique, je privilegie les composables pour limiter les dependances circulaires et garder des responsabilites claires.

**Points clefs:**
- ✅ Deux modeles de communication
- ✅ Approche composable recommandee
- ✅ Eviter les dependances circulaires

---

## 7. Resume final

**Reponse possible:**

> Pour bien utiliser Pinia, je m'appuie sur quatre principes: utiliser `storeToRefs` pour les donnees reactives dans les composants, combiner les stores dans des composables, clarifier les frontieres de communication entre stores, et separer clairement etat technique et logique metier.

**Points clefs:**
- ✅ Utilisation correcte de `storeToRefs`
- ✅ Composition des stores via composables
- ✅ Communication inter-stores maitrisee
- ✅ Separation claire des responsabilites
