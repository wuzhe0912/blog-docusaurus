---
id: state-management-vue-pinia-setup
title: 'Initialisation et Configuration de Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Configuration d'initialisation de Pinia et conception de la structure du projet dans un projet de plateforme multi-marques.

---

## 1. Axes principaux de réponse en entretien

1. **Raisons du choix de Pinia** : Meilleur support TypeScript, API plus simple, conception modulaire, meilleure expérience de développement.
2. **Configuration d'initialisation** : Utilisation de `piniaPluginPersistedstate` pour la persistance, extension de l'interface `PiniaCustomProperties`.
3. **Structure du projet** : 30+ stores, gérés par catégories de domaine fonctionnel.

---

## 2. Pourquoi Pinia ?

### 2.1 Pinia vs Vuex

**Pinia** est l'outil officiel de gestion d'état pour Vue 3 et, en tant que successeur de Vuex, offre une API plus simple et un meilleur support TypeScript.

**Réponse clé pour l'entretien** :

1. **Meilleur support TypeScript**
   - Pinia fournit une inférence de types complète
   - Pas besoin de fonctions auxiliaires supplémentaires (comme `mapState`, `mapGetters`)

2. **API plus simple**
   - Pas besoin de mutations (couche d'opérations synchrones dans Vuex)
   - Exécuter les opérations synchrones/asynchrones directement dans les actions

3. **Conception modulaire**
   - Pas de modules imbriqués
   - Chaque store est indépendant

4. **Meilleure expérience de développement**
   - Support de Vue Devtools
   - Hot Module Replacement (HMR)
   - Taille plus petite (environ 1KB)

5. **Recommandation officielle de Vue 3**
   - Pinia est l'outil officiel de gestion d'état pour Vue 3

### 2.2 Composants principaux de Pinia

```typescript
// Les trois éléments centraux d'un Store
{
  state: () => ({ ... }),      // Données d'état
  getters: { ... },            // Propriétés calculées
  actions: { ... }             // Méthodes (synchrones/asynchrones)
}
```

**Correspondance avec les composants Vue** :
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Configuration d'initialisation de Pinia

### 3.1 Configuration de base

**Emplacement du fichier :** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Étendre les propriétés personnalisées de Pinia
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // Enregistrer le plugin de persistance
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**Points clés d'entretien** :
- ✅ Utilisation de `piniaPluginPersistedstate` pour la persistance de l'état
- ✅ Extension de l'interface `PiniaCustomProperties` pour que tous les stores accèdent au router
- ✅ Intégration via le wrapper `store` de Quasar

### 3.2 Structure des fichiers Store

```
src/stores/
├── index.ts                    # Configuration de l'instance Pinia
├── store-flag.d.ts            # Déclaration de types TypeScript
│
├── authStore.ts               # Authentification
├── userInfoStore.ts           # Informations utilisateur
├── gameStore.ts               # Informations de jeu
├── productStore.ts            # Informations produit
├── languageStore.ts           # Configuration de la langue
├── darkModeStore.ts          # Mode thème
├── envStore.ts               # Configuration de l'environnement
└── ... (30+ stores au total)
```

**Principes de conception** :
- Chaque Store est responsable d'un seul domaine fonctionnel
- Convention de nommage : `nomDeFonction + Store.ts`
- Utiliser des définitions de types TypeScript complètes

---

## 4. Résumé des points clés d'entretien

### 4.1 Raisons du choix de Pinia

**Réponse possible :**

> Dans le projet, nous avons choisi Pinia plutôt que Vuex pour plusieurs raisons : 1) Meilleur support TypeScript avec une inférence de types complète sans configuration supplémentaire ; 2) API plus simple sans mutations, opérations synchrones/asynchrones directement dans les actions ; 3) Conception modulaire sans modules imbriqués, chaque store est indépendant ; 4) Meilleure expérience de développement avec Vue Devtools, HMR et taille plus petite ; 5) Recommandation officielle de Vue 3.

**Points clés :**
- ✅ Support TypeScript
- ✅ Simplicité de l'API
- ✅ Conception modulaire
- ✅ Expérience de développement

### 4.2 Points clés de la configuration d'initialisation

**Réponse possible :**

> Lors de l'initialisation de Pinia, j'ai effectué plusieurs configurations clés : 1) Utilisation de `piniaPluginPersistedstate` pour la persistance de l'état, permettant au Store de se sauvegarder automatiquement dans localStorage ; 2) Extension de l'interface `PiniaCustomProperties` pour que tous les stores accèdent au router, facilitant les opérations de routage dans les actions ; 3) Intégration via le wrapper `store` de Quasar pour l'intégration au framework.

**Points clés :**
- ✅ Configuration du plugin de persistance
- ✅ Extension des propriétés personnalisées
- ✅ Intégration au framework

---

## 5. Résumé d'entretien

**Réponse possible :**

> Dans le projet, j'utilise Pinia comme outil de gestion d'état. Le choix de Pinia s'explique par son meilleur support TypeScript, son API plus simple et sa meilleure expérience de développement. Lors de la configuration d'initialisation, j'utilise `piniaPluginPersistedstate` pour la persistance et j'étends `PiniaCustomProperties` pour que tous les stores accèdent au router. Le projet comprend 30+ stores gérés par catégories de domaine fonctionnel, où chaque Store est responsable d'un seul domaine.

**Points clés :**
- ✅ Raisons du choix de Pinia
- ✅ Points clés de la configuration
- ✅ Conception de la structure du projet
- ✅ Expérience réelle en projet
