---
id: element-properties
title: '[Easy] \U0001F3F7️ Propiedades de elementos'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Que son los elementos inline y block? Cual es la diferencia entre ellos?

> Que son los elementos en linea (inline) y de bloque (block)? Cuales son las diferencias?

### Block Elements

> Los siguientes elementos inline o block solo listan las etiquetas mas usadas; las menos comunes se buscan cuando es necesario

Los elementos de nivel de bloque ocupan una linea completa por defecto. Por lo tanto, si hay varios elementos de bloque, sin aplicar CSS para el layout, se alinearan verticalmente de arriba hacia abajo por defecto. Los elementos de bloque solo pueden escribirse dentro de `<body></body>`.

#### Lista de elementos de bloque comunes

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

Los elementos en linea no ocupan toda la linea, por lo que si hay varios elementos en linea adyacentes, se presentaran en disposicion horizontal. Los elementos de bloque no se pueden colocar dentro de elementos en linea; estos solo se usan para presentar datos o informacion. Sin embargo, se pueden cambiar las propiedades de los elementos en linea a traves de `CSS`, por ejemplo, agregar `display: block;` a un `span`.

#### Lista de elementos en linea comunes

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

En display existe una propiedad llamada `inline-block`, que puede convertir un elemento de bloque en un elemento en linea pero manteniendo las caracteristicas del elemento de bloque, como poder establecer ancho, alto, margin, padding y otras propiedades. Esto significa que este elemento se alineara horizontalmente como un elemento en linea en el layout, pero puede usar propiedades de block para empujar a otros elementos en el diseno.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 教學-關於 display:inline、block、inline-block 的差別](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. Que hace `* { box-sizing: border-box; }`?

