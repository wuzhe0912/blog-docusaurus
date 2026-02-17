---
id: element-properties
title: "[Easy] \U0001F3F7️ Propriétés des éléments"
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Que sont les éléments inline et block ? Quelle est la différence entre eux ?

> Que sont les éléments en ligne (inline) et les éléments de bloc (block) ? Quelle est la différence entre eux ?

### Block Elements

> Les éléments inline ou block listés ci-dessous ne comprennent que les balises les plus courantes. Les balises moins courantes sont à consulter en cas de besoin.

Les éléments de type bloc occupent par défaut une ligne entière. Par conséquent, s'il y a plusieurs éléments de bloc, sans utilisation de CSS pour la mise en page, ils s'empileront verticalement de haut en bas par défaut. Les éléments de bloc ne peuvent être écrits qu'à l'intérieur de `<body></body>`.

#### Liste des éléments de bloc courants

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

Les éléments en ligne n'occupent pas une ligne entière. Par conséquent, lorsque plusieurs éléments en ligne sont adjacents, ils s'affichent horizontalement. Les éléments de bloc ne peuvent pas être placés à l'intérieur d'éléments en ligne, qui ne servent qu'à présenter des données. Cependant, on peut modifier les propriétés d'un élément inline via `CSS`, par exemple en ajoutant `display : block;` à un `span`.

#### Liste des éléments inline courants

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

Dans la propriété display, il existe un type `inline-block` qui permet de convertir un élément de bloc en élément en ligne tout en conservant les caractéristiques des éléments de bloc, comme la possibilité de définir la largeur, la hauteur, le margin et le padding. Cela signifie que cet élément se comporte comme un élément inline pour la mise en page (arrangement horizontal), tout en pouvant utiliser les propriétés block pour repousser les autres éléments.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [Tutoriel CSS : differences entre display:inline, block et inline-block](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. Que fait `* { box-sizing: border-box; }` ?
