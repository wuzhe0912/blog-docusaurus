---
id: performance-lv1-image-optimization
title: '[Lv1] Optimisation du chargement des images : quatre niveaux de Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Grace a une strategie de Lazy Loading des images a quatre niveaux, le trafic d'images du premier ecran est passe de 60 Mo a 2 Mo, soit une amelioration du temps de chargement de 85 %.

---

## Contexte du probleme (Situation)

> Imaginez que vous naviguez sur une page web sur votre telephone : l'ecran ne peut afficher que 10 images, mais la page charge d'un coup les donnees completes de 500 images. Votre telephone va ramer et votre forfait data sera consomme en un instant.

**Situation reelle du projet :**

```markdown
📊 Statistiques d'une page d'accueil
├─ 300+ miniatures (150-300 Ko chacune)
├─ 50+ bannieres promotionnelles
└─ Si tout est charge : 300 × 200 Ko = 60 Mo+ de donnees images

❌ Problemes reels
├─ Seules 8 a 12 images sont visibles au premier ecran
├─ L'utilisateur ne defilera peut-etre que jusqu'a la 30e image
└─ Les 270 images restantes sont chargees pour rien (gaspillage de bande passante + ralentissement)

📉 Impact
├─ Temps de premier chargement : 15-20 secondes
├─ Consommation de donnees : 60 Mo+ (mecontentement des utilisateurs)
├─ Saccades de la page : defilement non fluide
└─ Taux de rebond : 42 % (tres eleve)
```

## Objectif d'optimisation (Task)

1. **Ne charger que les images dans la zone visible**
2. **Pre-charger les images sur le point d'entrer dans la fenetre** (debut du chargement 50px a l'avance)
3. **Controler le nombre de requetes simultanees** (eviter de charger trop d'images en meme temps)
4. **Prevenir le gaspillage de ressources lors de changements rapides**
5. **Trafic d'images du premier ecran < 3 Mo**

## Solution (Action)

### Implementation de v-lazy-load.ts

> Lazy load d'images a quatre niveaux

#### Niveau 1 : Detection de visibilite dans la fenetre (IntersectionObserver)

```js
// Creation de l'observateur pour detecter si l'image entre dans la fenetre
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // L'image est entree dans la zone visible
        // Demarrer le chargement de l'image
      }
    });
  },
  {
    rootMargin: '50px 0px', // Demarrer le chargement 50px a l'avance (pre-chargement)
    threshold: 0.1, // Declenchement des que 10 % de l'image est visible
  }
);
```

- Utilisation de l'API native IntersectionObserver du navigateur (bien plus performante que l'evenement scroll)
- rootMargin: "50px" -> le chargement commence lorsque l'image est encore 50px en dessous, elle est prete quand l'utilisateur y arrive (experience plus fluide)
- Les images hors de la fenetre ne sont pas du tout chargees

#### Niveau 2 : Mecanisme de controle de la concurrence (gestion de file d'attente)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // 6 chargements simultanes maximum
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Place disponible, chargement immediat
    } else {
      this.queue.push(loadFn)   // Pas de place, mise en file d'attente
    }
  }
}
```

- Meme si 20 images entrent dans la fenetre simultanement, seules 6 sont chargees en parallele
- Evite le "chargement en cascade" qui bloque le navigateur (Chrome autorise maximum 6 requetes simultanees par defaut)
- Apres chaque chargement termine, l'image suivante dans la file est automatiquement traitee

```md
L'utilisateur defilte rapidement jusqu'en bas → 30 images declenchees simultanement
Sans gestion de file : 30 requetes simultanees → le navigateur rame
Avec gestion de file : les 6 premieres sont chargees → puis les 6 suivantes → fluide
```

#### Niveau 3 : Resolution des conditions de course (controle de version)

```js
// Definir un numero de version lors du chargement
el.setAttribute('data-version', Date.now().toString());

// Verifier la version a la fin du chargement
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Versions identiques, afficher l'image
  } else {
    // Versions differentes, l'utilisateur a change de categorie, ne pas afficher
  }
};
```

Cas concret :

```md
Actions de l'utilisateur :

1. Clic sur la categorie "Actualites" → declenchement du chargement de 100 images (version 1001)
2. 0,5 seconde plus tard, clic sur "Promotions" → declenchement du chargement de 80 images (version 1002)
3. Les images d'actualites finissent de charger 1 seconde plus tard

Sans controle de version : les images d'actualites sont affichees (incorrect !)
Avec controle de version : la version ne correspond pas, les images d'actualites sont rejetees (correct !)
```

#### Niveau 4 : Strategie de placeholder (image transparente en Base64)

```js
// Affichage par defaut d'un SVG transparent 1×1 pour eviter le decalage de mise en page
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// L'URL reelle de l'image est stockee dans data-src
el.setAttribute('data-src', realImageUrl);
```

- Utilisation d'un SVG transparent encode en Base64 (seulement 100 octets)
- Evite le CLS (Cumulative Layout Shift)
- L'utilisateur ne voit pas les images "apparaitre brusquement"

## Resultats de l'optimisation (Result)

**Avant optimisation :**

```markdown
Images du premier ecran : chargement de 300 images d'un coup (60 Mo)
Temps de chargement : 15-20 secondes
Fluidite du defilement : saccades severes
Taux de rebond : 42 %
```

**Apres optimisation :**

```markdown
Images du premier ecran : seulement 8-12 images chargees (2 Mo) ↓ 97 %
Temps de chargement : 2-3 secondes ↑ 85 %
Fluidite du defilement : fluide (60fps)
Taux de rebond : 28 % ↓ 33 %
```

**Donnees concretes :**

- Trafic d'images du premier ecran : **60 Mo → 2 Mo (reduction de 97 %)**
- Temps de chargement des images : **15 s → 2 s (amelioration de 85 %)**
- FPS du defilement : **de 20-30 a 55-60**
- Utilisation memoire : **reduction de 65 %** (les images non chargees n'occupent pas de memoire)

**Indicateurs techniques :**

- Performance d'IntersectionObserver : bien superieure a l'evenement scroll traditionnel (utilisation CPU reduite de 80 %)
- Effet du controle de concurrence : evite le blocage des requetes du navigateur
- Taux de reussite du controle de version : 99,5 % (tres peu d'images erronees)

## Points cles pour l'entretien

**Questions d'approfondissement courantes :**

1. **Q : Pourquoi ne pas simplement utiliser l'attribut `loading="lazy"` ?**
   R : L'attribut natif `loading="lazy"` a plusieurs limitations :

   - Impossible de controler la distance de pre-chargement (decidee par le navigateur)
   - Impossible de controler le nombre de chargements simultanes
   - Impossible de gerer le controle de version (probleme de changement rapide)
   - Non supporte par les anciens navigateurs

   La directive personnalisee offre un controle plus fin, adapte a nos scenarios complexes.

2. **Q : En quoi IntersectionObserver est-il meilleur que l'evenement scroll ?**
   R :

   ```javascript
   // ❌ Evenement scroll traditionnel
   window.addEventListener('scroll', () => {
     // Declenche a chaque defilement (60 fois/seconde)
     // Necessite de calculer la position de l'element (getBoundingClientRect)
     // Peut provoquer un reflow force (tueur de performances)
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Ne se declenche que lorsque l'element entre ou sort de la fenetre
   // Optimise nativement par le navigateur, ne bloque pas le thread principal
   // Amelioration de 80 % des performances
   ```

3. **Q : D'ou vient la limite de 6 images simultanees ?**
   R : C'est base sur la **limite de concurrence HTTP/1.1 par meme origine** des navigateurs :

   - Chrome/Firefox : maximum 6 connexions simultanees par nom de domaine
   - Les requetes supplementaires sont mises en file d'attente
   - HTTP/2 permet davantage, mais pour la compatibilite on reste a 6
   - Tests reels : 6 chargements simultanees constituent le meilleur equilibre performance/experience

4. **Q : Pourquoi un timestamp plutot qu'un UUID pour le controle de version ?**
   R :

   - Timestamp : `Date.now()` (simple, suffisant, triable)
   - UUID : `crypto.randomUUID()` (plus rigoureux, mais sur-ingenierie)
   - Notre cas d'usage : le timestamp est deja suffisamment unique (precision a la milliseconde)
   - Consideration de performance : la generation du timestamp est plus rapide

5. **Q : Comment gerer l'echec du chargement d'une image ?**
   R : Nous avons implemente un fallback a plusieurs niveaux :

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. Reessayer 3 fois
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Afficher une image par defaut
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q : Y a-t-il un risque de CLS (Cumulative Layout Shift) ?**
   R : Trois strategies pour l'eviter :

   ```html
   <!-- 1. SVG de placeholder par defaut -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio pour fixer les proportions -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Score CLS final : < 0,1 (excellent)
