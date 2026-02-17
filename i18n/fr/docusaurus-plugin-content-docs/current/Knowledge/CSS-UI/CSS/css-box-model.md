---
id: css-box-model
title: '[Easy] \U0001F3F7️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Default

Le `Box Model` en `CSS` est un terme utilisé pour discuter de la conception de mise en page. Il peut être compris comme une boîte qui enveloppe un élément `HTML`, avec quatre propriétés principales :

- content : principalement utilisé pour afficher le contenu de l'élément, comme le texte.
- padding : la distance entre le contenu de l'élément et sa bordure.
- margin : la distance entre l'élément et les autres éléments environnants.
- border : la bordure de l'élément lui-même.

## box-sizing

Le type de `Box Model` utilisé est déterminé par la propriété `box-sizing`.

Cela signifie que lors du calcul de la largeur et de la hauteur d'un élément, les propriétés `padding` et `border` sont calculées vers l'intérieur ou vers l'extérieur.

La valeur par défaut est `content-box`, qui calcule vers l'extérieur. Dans ce cas, en plus de la largeur et de la hauteur propres de l'élément, le `padding` et le `border` doivent être ajoutés au calcul. Par exemple :

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

La largeur de ce `div` est calculée ainsi : `100px(width)` + `20px(padding gauche-droite)` + `2px(border gauche-droite)` = `122px`.

## border-box

Il est évident que cette méthode n'est pas fiable, car elle oblige les développeurs front-end à calculer constamment la largeur et la hauteur des éléments. Pour améliorer l'expérience de développement, il faut adopter un autre mode : `border-box`.

Comme dans l'exemple ci-dessous, lors de l'initialisation des styles, on définit le `box-sizing` de tous les éléments sur `border-box` :

```css
* {
  box-sizing: border-box; // global style
}
```

Ainsi, le calcul se fait vers l'intérieur, la conception de la largeur et de la hauteur des éléments est plus intuitive, sans avoir à ajouter ou soustraire des valeurs pour le `padding` ou le `border`.

## Exercice de comparaison

Supposons les mêmes paramètres de style suivants :

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box (valeur par défaut)

- **Largeur réelle occupée** = `100px(width)` + `20px(padding gauche-droite)` + `10px(border gauche-droite)` = `130px`
- **Hauteur réelle occupée** = `100px(height)` + `20px(padding haut-bas)` + `10px(border haut-bas)` = `130px`
- **Zone content** = `100px x 100px`
- **Remarque** : le `margin` n'est pas inclus dans la largeur de l'élément, mais affecte la distance avec les autres éléments.

### border-box

- **Largeur réelle occupée** = `100px` (padding et border comprimés vers l'intérieur)
- **Hauteur réelle occupée** = `100px`
- **Zone content** = `100px` - `20px(padding gauche-droite)` - `10px(border gauche-droite)` = `70px x 70px`
- **Remarque** : le `margin` n'est pas non plus inclus dans la largeur de l'élément.

### Comparaison visuelle

```
content-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (100×100)       │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Largeur totale : 130px (hors margin)

border-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (70×70)         │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Largeur totale : 100px (hors margin)
```

## Pièges courants

### 1. Gestion du margin

Que ce soit en `content-box` ou `border-box`, **le margin n'est jamais inclus dans la largeur et la hauteur de l'élément**. Les deux modes n'affectent que la façon dont `padding` et `border` sont calculés.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* Non inclus dans width */
}
/* La largeur réelle de l'élément reste 100px, mais la distance avec les autres éléments augmente de 20px */
```

### 2. Largeur en pourcentage

Lorsqu'on utilise une largeur en pourcentage, le mode de calcul est également affecté par `box-sizing` :

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* 50% du parent = 100px */
  padding: 10px;
  border: 5px solid;
}

/* content-box : largeur réelle 130px (peut dépasser le parent) */
/* border-box : largeur réelle 100px (exactement 50% du parent) */
```

### 3. Éléments inline

`box-sizing` n'a aucun effet sur les éléments `inline`, car les propriétés `width` et `height` des éléments inline sont tout simplement inopérantes.

```css
span {
  display: inline;
  width: 100px; /* Inopérant */
  box-sizing: border-box; /* Également inopérant */
}
```

### 4. min-width / max-width

`min-width` et `max-width` sont également affectés par `box-sizing` :

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* Inclut padding et border */
  padding: 10px;
  border: 5px solid;
}
/* Largeur minimale du content = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [Apprendre la mise en page CSS](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
