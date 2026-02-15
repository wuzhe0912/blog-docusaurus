---
id: performance-lv1-route-optimization
title: '[Lv1] Optimisation au niveau des routes : trois niveaux de Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Grace a trois niveaux de Lazy Loading des routes, le chargement initial est passe de 12,5 Mo a 850 Ko, et le temps du premier ecran a ete reduit de 70 %.

---

## Contexte du probleme (Situation)

Caracteristiques du projet :

- **27+ templates multi-tenants differents** (architecture multi-tenant)
- **Chaque template comporte 20 a 30 pages** (accueil, hall, promotions, affiliation, actualites, etc.)
- **Si tout le code est charge d'un coup** : le premier acces necessite le telechargement de **10 Mo+ de fichiers JS**
- **Temps d'attente superieur a 10 secondes** (surtout en reseau mobile)

## Objectif d'optimisation (Task)

1. **Reduire la taille du JavaScript au premier chargement** (objectif : < 1 Mo)
2. **Raccourcir le temps du premier ecran** (objectif : < 3 secondes)
3. **Chargement a la demande** (l'utilisateur ne telecharge que ce dont il a besoin)
4. **Maintenir l'experience de developpement** (ne pas impacter l'efficacite du developpement)

## Solution (Action)

Nous avons adopte une strategie de **Lazy Loading des routes a trois niveaux**, optimisant du "template" a la "page" puis aux "permissions".

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
- Seule la configuration de routes du template concerne est chargee, les 26 autres ne sont pas chargees du tout

Resultat :

- Reduction d'environ 85 % du code de configuration des routes au premier chargement

### Niveau 2 : Lazy Loading des pages

```typescript
// Methode traditionnelle (❌ - a eviter)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Toutes les pages sont incluses dans main.js

// Notre methode (✅ - recommandee)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Chaque route utilise une fonction flechee + `import()`
- Le JS correspondant n'est telecharge que lorsque l'utilisateur accede reellement a la page
- Vite genere automatiquement un fichier independant pour chaque page

### Niveau 3 : Strategie de chargement conditionnel

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Les utilisateurs non connectes ne chargent pas les pages comme le "Centre d'affiliation"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Resultats de l'optimisation (Result)

**Avant optimisation :**

```
Premier chargement : main.js (12,5 Mo)
Temps du premier ecran : 8-12 secondes
Inclut les 27 templates + toutes les pages
```

**Apres optimisation :**

```markdown
Premier chargement : main.js (850 Ko) ↓ 93 %
Temps du premier ecran : 1,5-2,5 secondes ↑ 70 %
Inclut uniquement le code essentiel + la page d'accueil courante
```

**Donnees concretes :**

- Reduction de la taille JavaScript : **12,5 Mo → 850 Ko (reduction de 93 %)**
- Raccourcissement du temps du premier ecran : **10 s → 2 s (amelioration de 70 %)**
- Chargement des pages suivantes : **300-500 Ko en moyenne par page**
- Score d'experience utilisateur : **de 45 a 92 points (Lighthouse)**

**Valeur commerciale :**

- Taux de rebond en baisse de 35 %
- Temps de sejour en augmentation de 50 %
- Taux de conversion en hausse de 25 %

## Points cles pour l'entretien

**Questions d'approfondissement courantes :**

1. **Q : Pourquoi ne pas utiliser React.lazy() ou les composants asynchrones de Vue ?**
   R : Nous utilisons effectivement les composants asynchrones de Vue (`() => import()`), mais la cle reside dans l'**architecture a trois niveaux** :

   - Niveau 1 (template) : decide a la compilation (configuration Vite)
   - Niveau 2 (page) : Lazy Loading a l'execution
   - Niveau 3 (permissions) : controle par les navigation guards

   Le simple lazy loading ne couvre que le niveau 2 ; nous avons ajoute la separation au niveau des templates.

2. **Q : Comment decidez-vous quel code doit etre dans main.js ?**
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

   Principe : seul ce qui est utilise sur chaque page va dans le vendor chunk.

3. **Q : Le Lazy Loading n'affecte-t-il pas l'experience utilisateur (temps d'attente) ?**
   R : Deux strategies pour y remedier :

   - **Prefetch** : pre-chargement des pages susceptibles d'etre visitees pendant les temps d'inactivite
   - **Etat de chargement** : utilisation de Skeleton Screen au lieu d'un ecran blanc

   Tests reels : le temps de chargement moyen des pages suivantes est < 500 ms, imperceptible pour l'utilisateur.

4. **Q : Comment mesurer l'effet de l'optimisation ?**
   R : Avec une combinaison d'outils :

   - **Lighthouse** : Performance Score (45 → 92)
   - **Webpack Bundle Analyzer** : analyse visuelle de la taille des chunks
   - **Chrome DevTools** : Network waterfall, Coverage
   - **Real User Monitoring (RUM)** : donnees des utilisateurs reels

5. **Q : Quels sont les compromis (Trade-offs) ?**
   R :
   - Les dependances circulaires peuvent poser probleme lors du developpement (restructuration des modules necessaire)
   - Un bref temps de chargement lors du premier changement de route (resolu avec prefetch)
   - Mais globalement les avantages l'emportent largement, surtout pour l'experience des utilisateurs mobiles
