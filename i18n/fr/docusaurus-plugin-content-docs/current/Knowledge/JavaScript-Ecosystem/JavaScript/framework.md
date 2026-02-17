---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Expliquez et comparez les avantages et inconvenients du SPA et du SSR

### SPA (Application Monopage)

#### Avantages du SPA

1. Experience utilisateur : L'essence du SPA est une seule page qui charge dynamiquement les donnees et combine le routage frontend pour donner l'impression a l'utilisateur de naviguer entre les pages, alors qu'en realite seuls les components changent. Cette experience est naturellement plus fluide et rapide.
2. Separation frontend-backend : Le frontend ne gere que le rendu et l'interaction, tandis que le backend fournit uniquement les APIs de donnees. Cela reduit la charge de developpement des deux cotes et facilite la maintenance.
3. Optimisation reseau : La page ne doit etre chargee qu'une seule fois, contrairement a la structure multi-pages traditionnelle qui necessite un rechargement a chaque changement de page, reduisant ainsi les requetes et la charge serveur.

#### Inconvenients du SPA

1. SEO : Les pages SPA sont chargees dynamiquement, les moteurs de recherche ne peuvent donc pas capturer directement le contenu (bien que Google affirme ameliorer ce point). Face aux robots d'exploration, c'est toujours inferieur au HTML traditionnel.
2. Temps de chargement initial : Le SPA doit charger et executer JavaScript cote client avant de rendre la page, le temps de chargement initial est donc plus long, surtout avec de mauvaises conditions reseau.

### SSR (Rendu Cote Serveur)

#### Avantages du SSR

1. SEO : Le SSR rend la page avec les donnees cote serveur, les moteurs de recherche peuvent donc capturer directement le contenu. C'est le plus grand avantage du SSR.
2. Temps de chargement : Le SSR transfere la charge de rendu cote serveur, ce qui peut raccourcir le temps de rendu lors de la premiere visite.

#### Inconvenients du SSR

1. Cout d'apprentissage et complexite : En prenant Next et Nuxt comme exemples, bien qu'ils soient bases sur React et Vue, ils ont developpe leurs propres ecosystemes, augmentant le cout d'apprentissage. Au vu de la recente revision de Next.js 14, tous les developpeurs ne peuvent pas accepter de tels changements.
2. Charge serveur : Le transfert du travail de rendu cote serveur peut causer une charge plus importante, surtout dans les scenarios a fort trafic.

### Conclusion

En principe, pour les systemes back-office sans besoin de SEO, il n'est pas necessaire d'utiliser des frameworks SSR. Pour les pages web produit dependant des moteurs de recherche, il vaut la peine d'evaluer l'adoption d'un framework SSR.

## 2. Decrivez les Web Frameworks utilises et comparez leurs avantages et inconvenients

**Les deux convergent vers le « developpement de composants base sur les fonctions » :**

> Vue 3 divise la logique en composables reutilisables via la Composition API ; React a les Hooks comme coeur. L'experience developpeur est tres similaire, mais globalement Vue a un cout d'entree plus bas, tandis que React est plus fort en ecosysteme et flexibilite.

### Vue (principalement Vue 3)

**Avantages :**

- **Courbe d'apprentissage plus douce** : Le SFC (Single File Component) regroupe template / script / style, tres accessible pour les developpeurs venant du frontend traditionnel (templates backend).
- **Conventions officielles claires, avantageux pour les equipes** : Le guide de style et les conventions officiels sont clairs, facilitant le maintien de la coherence lors de la reprise de projets par de nouveaux membres.
- **Ecosysteme central complet** : L'equipe officielle maintient Vue Router, Pinia (ou Vuex), CLI / Vite Plugin, etc., avec des « solutions officielles » de la creation de projet a la gestion d'etat et au routage.
- **Composition API ameliore la maintenabilite** : La logique peut etre separee par fonctionnalite en composables (ex : useAuth, useForm), partageant la logique et reduisant le code duplique dans les grands projets.

**Inconvenients :**

- **Ecosysteme et communaute legerement plus petits que React** : Le nombre et la diversite des packages tiers sont inferieurs, et certains outils ou integrations de pointe priorisent React.
- **Marche de l'emploi relativement concentre dans certaines regions/industries** : Compare a React, les equipes internationales ou multinationales utilisent principalement React, ce qui est relativement desavantageux en flexibilite de carriere (mais dans la sinosphere c'est environ moitie-moitie).

---

### React

**Avantages :**

- **Ecosysteme enorme avec des mises a jour technologiques rapides** : Presque toutes les nouvelles technologies frontend, systemes de design ou services tiers offrent en priorite une version React.
- **Haute flexibilite, libre combinaison du stack technologique** : Compatible avec Redux / Zustand / Recoil et d'autres gestionnaires d'etat, plus des Meta Frameworks comme Next.js, Remix, avec des solutions matures du SPA au SSR, SSG, CSR.
- **Integration mature avec TypeScript et l'ingenierie frontend** : Beaucoup de discussions communautaires sur le typage et les bonnes pratiques pour les grands projets, utile pour les projets maintenus a long terme.

**Inconvenients :**

- **Haute liberte necessite des normes d'equipe** : Sans style de code clair ni conventions d'architecture, differents developpeurs peuvent utiliser des methodes d'ecriture et de gestion d'etat completement differentes, augmentant les couts de maintenance.
- **La courbe d'apprentissage n'est pas vraiment basse** : En plus de React (JSX, pensee Hooks), il faut faire face au Router, gestion d'etat, recuperation de donnees, SSR, etc., les debutants se perdent facilement dans « quelle library choisir ».
- **Changements d'API et evolution des bonnes pratiques rapides** : De Class Component a Function Component + Hooks, puis Server Components, quand anciens projets et nouveaux styles coexistent, des couts supplementaires de migration et maintenance sont necessaires.
