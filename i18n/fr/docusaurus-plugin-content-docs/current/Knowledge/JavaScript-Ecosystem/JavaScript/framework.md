---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Expliquez et comparez les avantages et inconvénients du SPA et du SSR

### SPA (Application Monopage)

#### Avantages du SPA

1. Expérience utilisateur : L'essence du SPA est une seule page qui charge dynamiquement les données et combine le routage frontend pour donner l'impression à l'utilisateur de naviguer entre les pages, alors qu'en réalité seuls les components changent. Cette expérience est naturellement plus fluide et rapide.
2. Séparation frontend-backend : Le frontend ne gère que le rendu et l'interaction, tandis que le backend fournit uniquement les APIs de données. Cela réduit la charge de développement des deux côtés et facilite la maintenance.
3. Optimisation réseau : La page ne doit être chargée qu'une seule fois, contrairement à la structure multi-pages traditionnelle qui nécessite un rechargement à chaque changement de page, réduisant ainsi les requêtes et la charge serveur.

#### Inconvénients du SPA

1. SEO : Les pages SPA sont chargées dynamiquement, les moteurs de recherche ne peuvent donc pas capturer directement le contenu (bien que Google affirme améliorer ce point). Face aux robots d'exploration, c'est toujours inférieur au HTML traditionnel.
2. Temps de chargement initial : Le SPA doit charger et exécuter JavaScript côté client avant de rendre la page, le temps de chargement initial est donc plus long, surtout avec de mauvaises conditions réseau.

### SSR (Rendu Côté Serveur)

#### Avantages du SSR

1. SEO : Le SSR rend la page avec les données côté serveur, les moteurs de recherche peuvent donc capturer directement le contenu. C'est le plus grand avantage du SSR.
2. Temps de chargement : Le SSR transfère la charge de rendu côté serveur, ce qui peut raccourcir le temps de rendu lors de la première visite.

#### Inconvénients du SSR

1. Coût d'apprentissage et complexité : En prenant Next et Nuxt comme exemples, bien qu'ils soient basés sur React et Vue, ils ont développé leurs propres écosystèmes, augmentant le coût d'apprentissage. Au vu de la récente révision de Next.js 14, tous les développeurs ne peuvent pas accepter de tels changements.
2. Charge serveur : Le transfert du travail de rendu côté serveur peut causer une charge plus importante, surtout dans les scénarios à fort trafic.

### Conclusion

En principe, pour les systèmes back-office sans besoin de SEO, il n'est pas nécessaire d'utiliser des frameworks SSR. Pour les pages web produit dépendant des moteurs de recherche, il vaut la peine d'évaluer l'adoption d'un framework SSR.

## 2. Décrivez les Web Frameworks utilisés et comparez leurs avantages et inconvénients

**Les deux convergent vers le « développement de composants basé sur les fonctions » :**

> Vue 3 divise la logique en composables réutilisables via la Composition API ; React a les Hooks comme cœur. L'expérience développeur est très similaire, mais globalement Vue a un coût d'entrée plus bas, tandis que React est plus fort en écosystème et flexibilité.

### Vue (principalement Vue 3)

**Avantages :**

- **Courbe d'apprentissage plus douce** : Le SFC (Single File Component) regroupe template / script / style, très accessible pour les développeurs venant du frontend traditionnel (templates backend).
- **Conventions officielles claires, avantageux pour les équipes** : Le guide de style et les conventions officiels sont clairs, facilitant le maintien de la cohérence lors de la reprise de projets par de nouveaux membres.
- **Écosystème central complet** : L'équipe officielle maintient Vue Router, Pinia (ou Vuex), CLI / Vite Plugin, etc., avec des « solutions officielles » de la création de projet à la gestion d'état et au routage.
- **Composition API améliore la maintenabilité** : La logique peut être séparée par fonctionnalité en composables (ex : useAuth, useForm), partageant la logique et réduisant le code dupliqué dans les grands projets.

**Inconvénients :**

- **Écosystème et communauté légèrement plus petits que React** : Le nombre et la diversité des packages tiers sont inférieurs, et certains outils ou intégrations de pointe priorisent React.
- **Marché de l'emploi relativement concentré dans certaines régions/industries** : Comparé à React, les équipes internationales ou multinationales utilisent principalement React, ce qui est relativement désavantageux en flexibilité de carrière (mais dans la sinosphère c'est environ moitié-moitié).

---

### React

**Avantages :**

- **Écosystème énorme avec des mises à jour technologiques rapides** : Presque toutes les nouvelles technologies frontend, systèmes de design ou services tiers offrent en priorité une version React.
- **Haute flexibilité, libre combinaison du stack technologique** : Compatible avec Redux / Zustand / Recoil et d'autres gestionnaires d'état, plus des Meta Frameworks comme Next.js, Remix, avec des solutions matures du SPA au SSR, SSG, CSR.
- **Intégration mature avec TypeScript et l'ingénierie frontend** : Beaucoup de discussions communautaires sur le typage et les bonnes pratiques pour les grands projets, utile pour les projets maintenus à long terme.

**Inconvénients :**

- **Haute liberté nécessite des normes d'équipe** : Sans style de code clair ni conventions d'architecture, différents développeurs peuvent utiliser des méthodes d'écriture et de gestion d'état complètement différentes, augmentant les coûts de maintenance.
- **La courbe d'apprentissage n'est pas vraiment basse** : En plus de React (JSX, pensée Hooks), il faut faire face au Router, gestion d'état, récupération de données, SSR, etc., les débutants se perdent facilement dans « quelle library choisir ».
- **Changements d'API et évolution des bonnes pratiques rapides** : De Class Component à Function Component + Hooks, puis Server Components, quand anciens projets et nouveaux styles coexistent, des coûts supplémentaires de migration et maintenance sont nécessaires.
