---
id: performance-lv1-image-optimization
title: '[Lv1] Optimisation du chargement des images : quatre niveaux de Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Grâce à une stratégie de Lazy Loading des images à quatre niveaux, le trafic d'images du premier écran est passé de 60 Mo à 2 Mo, soit une amélioration du temps de chargement de 85 %.

---

## Contexte du problème (Situation)

> Imaginez que vous naviguez sur une page web sur votre téléphone : l'écran ne peut afficher que 10 images, mais la page charge d'un coup les données complètes de 500 images. Votre téléphone va ramer et votre forfait data sera consommé en un instant.

**Situation réelle du projet :**

```markdown
📊 Statistiques d'une page d'accueil
├─ 300+ miniatures (150-300 Ko chacune)
├─ 50+ bannières promotionnelles
└─ Si tout est chargé : 300 × 200 Ko = 60 Mo+ de données images

❌ Problèmes réels
├─ Seules 8 à 12 images sont visibles au premier écran
├─ L'utilisateur ne défilera peut-être que jusqu'à la 30e image
└─ Les 270 images restantes sont chargées pour rien (gaspillage de bande passante + ralentissement)

📉 Impact
├─ Temps de premier chargement : 15-20 secondes
├─ Consommation de données : 60 Mo+ (mécontentement des utilisateurs)
├─ Saccades de la page : défilement non fluide
└─ Taux de rebond : 42 % (très élevé)
```

## Objectif d'optimisation (Task)

1. **Ne charger que les images dans la zone visible**
2. **Pré-charger les images sur le point d'entrer dans la fenêtre** (début du chargement 50px à l'avance)
3. **Contrôler le nombre de requêtes simultanées** (éviter de charger trop d'images en même temps)
4. **Prévenir le gaspillage de ressources lors de changements rapides**
5. **Trafic d'images du premier écran < 3 Mo**

## Solution (Action)

### Implémentation de v-lazy-load.ts

> Lazy load d'images à quatre niveaux

#### Niveau 1 : Détection de visibilité dans la fenêtre (IntersectionObserver)

```js
// Création de l'observateur pour détecter si l'image entre dans la fenêtre
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // L'image est entrée dans la zone visible
        // Démarrer le chargement de l'image
      }
    });
  },
  {
    rootMargin: '50px 0px', // Démarrer le chargement 50px à l'avance (pré-chargement)
    threshold: 0.1, // Déclenchement dès que 10 % de l'image est visible
  }
);
```

- Utilisation de l'API native IntersectionObserver du navigateur (bien plus performante que l'événement scroll)
- rootMargin: "50px" -> le chargement commence lorsque l'image est encore 50px en dessous, elle est prête quand l'utilisateur y arrive (expérience plus fluide)
- Les images hors de la fenêtre ne sont pas du tout chargées

#### Niveau 2 : Mécanisme de contrôle de la concurrence (gestion de file d'attente)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // 6 chargements simultanés maximum
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Place disponible, chargement immédiat
    } else {
      this.queue.push(loadFn)   // Pas de place, mise en file d'attente
    }
  }
}
```

- Même si 20 images entrent dans la fenêtre simultanément, seules 6 sont chargées en parallèle
- Évite le "chargement en cascade" qui bloque le navigateur (Chrome autorise maximum 6 requêtes simultanées par défaut)
- Après chaque chargement terminé, l'image suivante dans la file est automatiquement traitée

```md
L'utilisateur défilte rapidement jusqu'en bas → 30 images déclenchées simultanément
Sans gestion de file : 30 requêtes simultanées → le navigateur rame
Avec gestion de file : les 6 premières sont chargées → puis les 6 suivantes → fluide
```

#### Niveau 3 : Résolution des conditions de course (contrôle de version)

```js
// Définir un numéro de version lors du chargement
el.setAttribute('data-version', Date.now().toString());

// Vérifier la version à la fin du chargement
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Versions identiques, afficher l'image
  } else {
    // Versions différentes, l'utilisateur a changé de catégorie, ne pas afficher
  }
};
```

Cas concret :

```md
Actions de l'utilisateur :

1. Clic sur la catégorie "Actualités" → déclenchement du chargement de 100 images (version 1001)
2. 0,5 seconde plus tard, clic sur "Promotions" → déclenchement du chargement de 80 images (version 1002)
3. Les images d'actualités finissent de charger 1 seconde plus tard

Sans contrôle de version : les images d'actualités sont affichées (incorrect !)
Avec contrôle de version : la version ne correspond pas, les images d'actualités sont rejetées (correct !)
```

#### Niveau 4 : Stratégie de placeholder (image transparente en Base64)

```js
// Affichage par défaut d'un SVG transparent 1×1 pour éviter le décalage de mise en page
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// L'URL réelle de l'image est stockée dans data-src
el.setAttribute('data-src', realImageUrl);
```

- Utilisation d'un SVG transparent encodé en Base64 (seulement 100 octets)
- Évite le CLS (Cumulative Layout Shift)
- L'utilisateur ne voit pas les images "apparaître brusquement"

## Résultats de l'optimisation (Result)

**Avant optimisation :**

```markdown
Images du premier écran : chargement de 300 images d'un coup (60 Mo)
Temps de chargement : 15-20 secondes
Fluidité du défilement : saccades sévères
Taux de rebond : 42 %
```

**Après optimisation :**

```markdown
Images du premier écran : seulement 8-12 images chargées (2 Mo) ↓ 97 %
Temps de chargement : 2-3 secondes ↑ 85 %
Fluidité du défilement : fluide (60fps)
Taux de rebond : 28 % ↓ 33 %
```

**Données concrètes :**

- Trafic d'images du premier écran : **60 Mo → 2 Mo (réduction de 97 %)**
- Temps de chargement des images : **15 s → 2 s (amélioration de 85 %)**
- FPS du défilement : **de 20-30 à 55-60**
- Utilisation mémoire : **réduction de 65 %** (les images non chargées n'occupent pas de mémoire)

**Indicateurs techniques :**

- Performance d'IntersectionObserver : bien supérieure à l'événement scroll traditionnel (utilisation CPU réduite de 80 %)
- Effet du contrôle de concurrence : évite le blocage des requêtes du navigateur
- Taux de réussite du contrôle de version : 99,5 % (très peu d'images erronées)

## Points clés pour l'entretien

**Questions d'approfondissement courantes :**

1. **Q : Pourquoi ne pas simplement utiliser l'attribut `loading="lazy"` ?**
   R : L'attribut natif `loading="lazy"` a plusieurs limitations :

   - Impossible de contrôler la distance de pré-chargement (décidée par le navigateur)
   - Impossible de contrôler le nombre de chargements simultanés
   - Impossible de gérer le contrôle de version (problème de changement rapide)
   - Non supporté par les anciens navigateurs

   La directive personnalisée offre un contrôle plus fin, adapté à nos scénarios complexes.

2. **Q : En quoi IntersectionObserver est-il meilleur que l'événement scroll ?**
   R :

   ```javascript
   // ❌ Événement scroll traditionnel
   window.addEventListener('scroll', () => {
     // Déclenché à chaque défilement (60 fois/seconde)
     // Nécessite de calculer la position de l'élément (getBoundingClientRect)
     // Peut provoquer un reflow forcé (tueur de performances)
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Ne se déclenche que lorsque l'élément entre ou sort de la fenêtre
   // Optimisé nativement par le navigateur, ne bloque pas le thread principal
   // Amélioration de 80 % des performances
   ```

3. **Q : D'où vient la limite de 6 images simultanées ?**
   R : C'est basé sur la **limite de concurrence HTTP/1.1 par même origine** des navigateurs :

   - Chrome/Firefox : maximum 6 connexions simultanées par nom de domaine
   - Les requêtes supplémentaires sont mises en file d'attente
   - HTTP/2 permet davantage, mais pour la compatibilité on reste à 6
   - Tests réels : 6 chargements simultanés constituent le meilleur équilibre performance/expérience

4. **Q : Pourquoi un timestamp plutôt qu'un UUID pour le contrôle de version ?**
   R :

   - Timestamp : `Date.now()` (simple, suffisant, triable)
   - UUID : `crypto.randomUUID()` (plus rigoureux, mais sur-ingénierie)
   - Notre cas d'usage : le timestamp est déjà suffisamment unique (précision à la milliseconde)
   - Considération de performance : la génération du timestamp est plus rapide

5. **Q : Comment gérer l'échec du chargement d'une image ?**
   R : Nous avons implémenté un fallback à plusieurs niveaux :

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. Réessayer 3 fois
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Afficher une image par défaut
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q : Y a-t-il un risque de CLS (Cumulative Layout Shift) ?**
   R : Trois stratégies pour l'éviter :

   ```html
   <!-- 1. SVG de placeholder par défaut -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio pour fixer les proportions -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Score CLS final : < 0,1 (excellent)
