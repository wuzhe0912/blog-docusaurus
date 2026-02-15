---
id: css-pseudo-elements
title: "[Easy] \U0001F3F7️ Pseudo-éléments"
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## Qu'est-ce qu'un pseudo-élément

Les pseudo-éléments sont un mot-clé CSS utilisé pour sélectionner une partie spécifique d'un élément ou insérer du contenu avant ou après un élément. Ils utilisent la syntaxe **double deux-points** `::` (standard CSS3), pour les distinguer des pseudo-classes (pseudo-classes) qui utilisent un simple deux-points `:`.

## Pseudo-éléments courants

### 1. ::before et ::after

Les pseudo-éléments les plus couramment utilisés, servant à insérer du contenu avant ou après le contenu d'un élément.

```css
.icon::before {
  content: '📌';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**Caractéristiques** :

- Doit contenir la propriété `content` (même une chaîne vide)
- Par défaut, c'est un élément `inline`
- N'apparaît pas dans le DOM, ne peut pas être sélectionné par JavaScript

### 2. ::first-letter

Sélectionne la première lettre d'un élément, souvent utilisé pour l'effet de lettrine style magazine.

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

Sélectionne la première ligne de texte d'un élément.

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**Remarque** : `::first-line` ne peut être utilisé qu'avec des éléments de type bloc.

### 4. ::selection

Personnalise le style du texte sélectionné par l'utilisateur.

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox nécessite un préfixe */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

Personnalise le style du placeholder des formulaires.

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

Personnalise le style des marqueurs de liste (list marker).

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

Utilisé pour le masque d'arrière-plan des éléments en plein écran (comme `<dialog>` ou les vidéos en plein écran).

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## Cas d'utilisation pratiques

### 1. Icônes décoratives

Pas besoin d'éléments HTML supplémentaires, réalisation en pur CSS :

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**Quand l'utiliser** : Lorsqu'on ne veut pas ajouter d'éléments purement décoratifs dans le HTML.

### 2. Clearfix (nettoyage des flottants)

La technique classique de nettoyage des flottants :

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**Quand l'utiliser** : Lorsque l'élément parent contient des éléments enfants flottants et doit s'étendre pour les contenir.

### 3. Décoration de citations

Ajout automatique de guillemets au texte cité :

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**Quand l'utiliser** : Pour embellir les blocs de citation sans saisir manuellement les guillemets.

### 4. Formes CSS pures

Création de formes géométriques avec les pseudo-éléments :

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**Quand l'utiliser** : Pour créer des flèches, triangles et autres formes simples sans images ni SVG.

### 5. Marquage des champs obligatoires

Ajout d'un astérisque rouge aux champs de formulaire obligatoires :

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**Quand l'utiliser** : Pour indiquer les champs obligatoires tout en gardant le HTML sémantiquement propre.

### 6. Indication de liens externes

Ajout automatique d'icônes aux liens externes :

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* Ou avec une icon font */
a[target='_blank']::after {
  content: '\f08e'; /* Icône lien externe Font Awesome */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**Quand l'utiliser** : Pour améliorer l'expérience utilisateur en signalant l'ouverture d'un nouvel onglet.

### 7. Numérotation avec compteurs

Numérotation automatique avec les compteurs CSS :

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**Quand l'utiliser** : Pour générer automatiquement des numéros sans maintenance manuelle.

### 8. Effet de superposition (overlay)

Ajout d'une superposition au survol d'une image :

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**Quand l'utiliser** : Lorsqu'on ne veut pas ajouter d'éléments HTML supplémentaires pour réaliser un effet de superposition.

## Pseudo-éléments vs Pseudo-classes

| Caractéristique | Pseudo-éléments (::)                    | Pseudo-classes (:)                  |
| --------------- | --------------------------------------- | ----------------------------------- |
| **Syntaxe**     | Double deux-points `::before`           | Simple deux-points `:hover`         |
| **Fonction**    | Créent/sélectionnent une partie de l'élément | Sélectionnent un état de l'élément  |
| **Exemples**    | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()` |
| **DOM**         | N'existent pas dans le DOM              | Sélectionnent de vrais éléments DOM |

## Pièges courants

### 1. La propriété content doit être présente

`::before` et `::after` doivent avoir la propriété `content`, sinon ils ne s'afficheront pas :

```css
/* Ne s'affichera pas */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* Correct */
.box::before {
  content: ''; /* Même une chaîne vide doit être ajoutée */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. Inutilisable avec les éléments remplacés

Certains éléments (comme `<img>`, `<input>`, `<iframe>`) ne peuvent pas utiliser `::before` et `::after` :

```css
/* Invalide */
img::before {
  content: 'Photo:';
}

/* Utiliser un élément enveloppant */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. Éléments inline par défaut

`::before` et `::after` sont par défaut des éléments `inline`. Attention lors de la définition de la largeur et de la hauteur :

```css
.box::before {
  content: '';
  display: block; /* ou inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. Problème de z-index

Le `z-index` des pseudo-éléments est relatif à l'élément parent :

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* Sera sous le parent, mais au-dessus de l'arrière-plan du parent */
}
```

### 5. Rétrocompatibilité avec le simple deux-points

La spécification CSS3 utilise le double deux-points `::` pour distinguer les pseudo-éléments des pseudo-classes, mais le simple deux-points `:` fonctionne toujours (rétrocompatibilité CSS2) :

```css
/* Écriture standard CSS3 (recommandée) */
.box::before {
}

/* Écriture CSS2 (fonctionne toujours) */
.box:before {
}
```

## Points clés pour l'entretien

1. **Syntaxe double deux-points des pseudo-éléments** : Distinguer les pseudo-éléments `::` et les pseudo-classes `:`
2. **La propriété content doit être présente** : Élément clé de `::before` et `::after`
3. **N'existe pas dans le DOM** : Ne peut pas être sélectionné ou manipulé directement par JavaScript
4. **Inutilisable avec les éléments remplacés** : Invalide pour `<img>`, `<input>`, etc.
5. **Cas d'utilisation pratiques** : Icônes décoratives, nettoyage des flottants, dessin de formes, etc.

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
