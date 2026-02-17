---
id: performance-lv1-route-optimization
title: '[Lv1] Optimisation au niveau des routes : trois niveaux de Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Grâce à trois niveaux de Lazy Loading des routes, le chargement initial est passé de 12,5 Mo à 850 Ko, et le temps du premier écran a été réduit de 70 %.

---

## Contexte du problème (Situation)

Caractéristiques du projet :

- **27+ templates multi-tenants différents** (architecture multi-tenant)
- **Chaque template comporte 20 à 30 pages** (accueil, hall, promotions, affiliation, actualités, etc.)
- **Si tout le code est chargé d'un coup** : le premier accès nécessite le téléchargement de **10 Mo+ de fichiers JS**
- **Temps d'attente supérieur à 10 secondes** (surtout en réseau mobile)

## Objectif d'optimisation (Task)

1. **Réduire la taille du JavaScript au premier chargement** (objectif : < 1 Mo)
2. **Raccourcir le temps du premier écran** (objectif : < 3 secondes)
3. **Chargement à la demande** (l'utilisateur ne télécharge que ce dont il a besoin)
4. **Maintenir l'expérience de développement** (ne pas impacter l'efficacité du développement)

## Solution (Action)

Nous avons adopté une stratégie de **Lazy Loading des routes à trois niveaux**, optimisant du "template" à la "page" puis aux "permissions".

### Niveau 1 : Chargement dynamique des templates

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Chargement dynamique des routes du template correspondant selon la variable d'environnement
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Explication :

- Le projet comprend 27 templates, mais l'utilisateur n'en utilise qu'un seul
- L'identification du template se fait via environment.json
- Seule la configuration de routes du template concerné est chargée, les 26 autres ne sont pas chargées du tout

Résultat :

- Réduction d'environ 85 % du code de configuration des routes au premier chargement

### Niveau 2 : Lazy Loading des pages

```typescript
// Méthode traditionnelle (❌ - à éviter)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Toutes les pages sont incluses dans main.js

// Notre méthode (✅ - recommandée)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Chaque route utilise une fonction fléchée + `import()`
- Le JS correspondant n'est téléchargé que lorsque l'utilisateur accède réellement à la page
- Vite génère automatiquement un fichier indépendant pour chaque page

### Niveau 3 : Stratégie de chargement conditionnel

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Les utilisateurs non connectés ne chargent pas les pages comme le "Centre d'affiliation"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Résultats de l'optimisation (Result)

**Avant optimisation :**

```
Premier chargement : main.js (12,5 Mo)
Temps du premier écran : 8-12 secondes
Inclut les 27 templates + toutes les pages
```

**Après optimisation :**

```markdown
Premier chargement : main.js (850 Ko) ↓ 93 %
Temps du premier écran : 1,5-2,5 secondes ↑ 70 %
Inclut uniquement le code essentiel + la page d'accueil courante
```

**Données concrètes :**

- Réduction de la taille JavaScript : **12,5 Mo → 850 Ko (réduction de 93 %)**
- Raccourcissement du temps du premier écran : **10 s → 2 s (amélioration de 70 %)**
- Chargement des pages suivantes : **300-500 Ko en moyenne par page**
- Score d'expérience utilisateur : **de 45 à 92 points (Lighthouse)**

**Valeur commerciale :**

- Taux de rebond en baisse de 35 %
- Temps de séjour en augmentation de 50 %
- Taux de conversion en hausse de 25 %

## Points clés pour l'entretien

**Questions d'approfondissement courantes :**

1. **Q : Pourquoi ne pas utiliser React.lazy() ou les composants asynchrones de Vue ?**
   R : Nous utilisons effectivement les composants asynchrones de Vue (`() => import()`), mais la clé réside dans l'**architecture à trois niveaux** :

   - Niveau 1 (template) : décidé à la compilation (configuration Vite)
   - Niveau 2 (page) : Lazy Loading à l'exécution
   - Niveau 3 (permissions) : contrôle par les navigation guards

   Le simple lazy loading ne couvre que le niveau 2 ; nous avons ajouté la séparation au niveau des templates.

2. **Q : Comment décidez-vous quel code doit être dans main.js ?**
   R : Via la configuration `manualChunks` de Vite :

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   Principe : seul ce qui est utilisé sur chaque page va dans le vendor chunk.

3. **Q : Le Lazy Loading n'affecte-t-il pas l'expérience utilisateur (temps d'attente) ?**
   R : Deux stratégies pour y remédier :

   - **Prefetch** : pré-chargement des pages susceptibles d'être visitées pendant les temps d'inactivité
   - **État de chargement** : utilisation de Skeleton Screen au lieu d'un écran blanc

   Tests réels : le temps de chargement moyen des pages suivantes est < 500 ms, imperceptible pour l'utilisateur.

4. **Q : Comment mesurer l'effet de l'optimisation ?**
   R : Avec une combinaison d'outils :

   - **Lighthouse** : Performance Score (45 → 92)
   - **Webpack Bundle Analyzer** : analyse visuelle de la taille des chunks
   - **Chrome DevTools** : Network waterfall, Coverage
   - **Real User Monitoring (RUM)** : données des utilisateurs réels

5. **Q : Quels sont les compromis (Trade-offs) ?**
   R :
   - Les dépendances circulaires peuvent poser problème lors du développement (restructuration des modules nécessaire)
   - Un bref temps de chargement lors du premier changement de route (résolu avec prefetch)
   - Mais globalement les avantages l'emportent largement, surtout pour l'expérience des utilisateurs mobiles
