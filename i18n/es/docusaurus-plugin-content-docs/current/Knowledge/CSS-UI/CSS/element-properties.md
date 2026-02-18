---
id: element-properties
title: '[Easy] 🏷️ Propiedades de elementos'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Qué son los elementos inline y block? Cuál es la diferencia entre ellos?

> Qué son los elementos en línea (inline) y de bloque (block)? Cuáles son las diferencias?

### Block Elements

> Los siguientes elementos inline o block solo listan las etiquetas más usadas; las menos comunes se buscan cuando es necesario

Los elementos de nivel de bloque ocupan una línea completa por defecto. Por lo tanto, si hay varios elementos de bloque, sin aplicar CSS para el layout, se alinearán verticalmente de arriba hacia abajo por defecto. Los elementos de bloque solo pueden escribirse dentro de `<body></body>`.

#### Lista de elementos de bloque comunes

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

Los elementos en línea no ocupan toda la línea, por lo que si hay varios elementos en línea adyacentes, se presentarán en disposición horizontal. Los elementos de bloque no se pueden colocar dentro de elementos en línea; estos solo se usan para presentar datos o información. Sin embargo, se pueden cambiar las propiedades de los elementos en línea a través de `CSS`, por ejemplo, agregar `display: block;` a un `span`.

#### Lista de elementos en línea comunes

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

En display existe una propiedad llamada `inline-block`, que puede convertir un elemento de bloque en un elemento en línea pero manteniendo las características del elemento de bloque, como poder establecer ancho, alto, margin, padding y otras propiedades. Esto significa que este elemento se alineará horizontalmente como un elemento en línea en el layout, pero puede usar propiedades de block para empujar a otros elementos en el diseño.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [Tutorial CSS - Diferencias entre display: inline, block e inline-block](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. Qué hace `* { box-sizing: border-box; }`?
