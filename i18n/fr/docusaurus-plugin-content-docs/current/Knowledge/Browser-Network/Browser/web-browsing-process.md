---
id: web-browsing-process
title: "\U0001F4C4 Processus de navigation web"
slug: /web-browsing-process
---

## 1. Expliquez comment le navigateur obtient le HTML depuis le serveur et comment il le rend à l'écran

> Décrivez comment le navigateur récupère le HTML côté serveur et comment il effectue le rendu du HTML.

### 1. Envoi de la requête

- **Saisie de l'URL** : L'utilisateur saisit une URL dans le navigateur ou clique sur un lien. Le navigateur commence alors à analyser cette URL pour déterminer à quel serveur envoyer la requête.
- **Résolution DNS** : Le navigateur effectue une recherche DNS pour trouver l'adresse IP du serveur correspondant.
- **Établissement de la connexion** : Le navigateur envoie une requête à l'adresse IP du serveur via le protocole HTTP ou HTTPS. Dans le cas du HTTPS, une connexion SSL/TLS doit également être établie.

### 2. Réponse du serveur

- **Traitement de la requête** : Le serveur reçoit la requête et, en fonction du chemin et des paramètres, lit les données correspondantes depuis la base de données.
- **Envoi de la Response** : Le serveur renvoie ensuite le document HTML en tant que partie de la HTTP Response au navigateur. Cette réponse contient également des informations telles que le code de statut et d'autres paramètres (CORS, content-type), etc.

### 3. Analyse du HTML

- **Construction du DOM Tree** : Le navigateur commence à lire le document HTML et, en fonction des balises et attributs HTML, le convertit en DOM et commence à construire le DOM Tree en mémoire.
- **Requesting subresources (requête de sous-ressources)** : Lors de l'analyse du HTML, si le navigateur rencontre des ressources externes telles que des fichiers CSS, JavaScript ou des images, il envoie des requêtes supplémentaires au serveur pour les récupérer.

### 4. Render Page (rendu de la page)

- **Construction du CSSOM Tree** : Le navigateur analyse les fichiers CSS et construit le CSSOM Tree.
- **Render Tree** : Le navigateur fusionne le DOM Tree et le CSSOM Tree en un Render Tree, contenant tous les noeuds à rendre avec leurs styles correspondants.
- **Layout (mise en page)** : Le navigateur effectue la mise en page (Layout ou Reflow), calculant la position et la taille de chaque noeud.
- **Paint (peinture)** : Enfin, le navigateur passe par la phase de peinture (painting), dessinant le contenu de chaque noeud sur la page.

### 5. Interaction JavaScript

- **Exécution du JavaScript** : Si le HTML contient du JavaScript, le navigateur l'analyse et l'exécute. Cette action peut modifier le DOM et changer les styles.

L'ensemble du processus est progressif. En théorie, l'utilisateur verra d'abord une partie du contenu de la page, puis la page complète au fur et à mesure. Durant ce processus, plusieurs reflows et repaints peuvent être déclenchés, surtout lorsque la page contient des styles complexes ou des effets interactifs. En plus des optimisations intégrées du navigateur, les développeurs emploient généralement diverses techniques pour rendre l'expérience utilisateur plus fluide.

## 2. Décrivez le Reflow et le Repaint

### Reflow (redistribution)

Le Reflow désigne les changements dans le DOM d'une page web qui obligent le navigateur à recalculer les positions des éléments et à les placer correctement. En termes simples, le Layout doit réorganiser les éléments.

#### Déclencheurs du Reflow

Le reflow se produit dans deux scénarios : soit un changement global affectant toute la page, soit un changement partiel affectant un bloc de composant.

- Le chargement initial de la page constitue le reflow le plus impactant.
- Ajout ou suppression d'éléments DOM.
- Modification de la taille d'un élément, comme l'ajout de contenu ou le changement de taille de police.
- Modification de la disposition d'un élément, par exemple via margin ou padding.
- Redimensionnement de la fenêtre du navigateur.
- Déclenchement de pseudo-classes, comme l'effet hover.

### Repaint (repeinture)

Le Repaint se produit lorsqu'il n'y a pas de modification du Layout, mais simplement une mise à jour ou un changement d'apparence de l'élément. Puisque les éléments sont contenus dans le Layout, un reflow entraîne nécessairement un repaint. En revanche, un repaint seul ne déclenche pas forcément un reflow.

#### Déclencheurs du Repaint

- Modification de la couleur ou de l'arrière-plan d'un élément, par exemple en ajoutant une propriété color ou en modifiant les propriétés background.
- Modification de l'ombre ou du border d'un élément relève également du repaint.

### Comment optimiser le Reflow ou le Repaint

- Ne pas utiliser de table pour la mise en page. Les propriétés des tables sont susceptibles de déclencher une réorganisation de la mise en page lors de modifications. Si l'utilisation d'une table est inévitable, il est recommandé d'ajouter les propriétés suivantes pour ne rendre qu'une ligne à la fois et éviter d'affecter l'ensemble du tableau : `table-layout: auto;` ou `table-layout: fixed;`.
- Il ne faut pas manipuler le DOM pour ajuster les styles un par un. Il est préférable de définir les styles nécessaires dans une class, puis de basculer entre les classes via JavaScript.
  - Par exemple, avec le framework Vue, on peut utiliser le binding de class pour changer les styles, plutôt que de modifier directement les styles via une fonction.
- Pour les scénarios nécessitant des changements fréquents, comme un système d'onglets, il est préférable d'utiliser `v-show` plutôt que `v-if`. Le premier utilise simplement la propriété CSS `display: none;` pour masquer l'élément, tandis que le second déclenche le cycle de vie, recréant ou détruisant les éléments, ce qui entraîne une consommation de performances plus importante.
- Si un reflow est vraiment inévitable, vous pouvez l'optimiser avec `requestAnimationFrame` (principalement parce que cette API est conçue pour les animations et se synchronise avec le taux de rafraîchissement du navigateur), ce qui permet de regrouper plusieurs reflows en un seul et de réduire le nombre de repaints.
  - Par exemple, pour une animation nécessitant le déplacement vers une cible sur la page, `requestAnimationFrame` peut être utilisé pour calculer chaque mouvement.
  - De même, certaines propriétés CSS3 peuvent déclencher l'accélération matérielle côté client, améliorant les performances d'animation : `transform`, `opacity`, `filters`, `Will-change`.
- Si possible, appliquez les changements de style sur les noeuds DOM de niveau inférieur pour éviter qu'un changement de style sur l'élément parent n'affecte tous ses éléments enfants.
- Si vous devez exécuter des animations, faites-le sur des éléments en positionnement absolu (`absolute`, `fixed`), ce qui a peu d'impact sur les autres éléments et ne déclenche qu'un repaint, évitant ainsi le reflow.

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Décrivez quand le navigateur envoie une requête OPTIONS au serveur

> Expliquez dans quelles circonstances le navigateur envoie une requête OPTIONS au serveur.

Dans la plupart des cas, cela s'applique dans le cadre du CORS. Avant d'envoyer la requête réelle, une action de preflight (pré-vérification) a lieu : le navigateur envoie d'abord une requête OPTIONS pour demander au serveur s'il autorise cette requête cross-origin. Si le serveur répond favorablement, le navigateur envoie alors la véritable requête. Dans le cas contraire, le navigateur affiche une erreur.

De plus, si la méthode de la requête n'est pas `GET`, `HEAD` ou `POST`, cela déclenchera également une requête OPTIONS.
