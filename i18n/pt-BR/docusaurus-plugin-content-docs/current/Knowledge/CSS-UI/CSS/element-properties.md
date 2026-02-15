---
id: element-properties
title: '[Easy] 🏷️ Propriedades de Elementos'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. O que são elementos inline e block? Qual é a diferença entre eles?

> O que são elementos inline e block? Qual é a diferença entre eles?

### Block Elements

> Os elementos inline e block listados a seguir incluem apenas as tags mais comuns. Tags menos comuns devem ser pesquisadas conforme a necessidade.

Elementos de nível de bloco ocupam uma linha inteira por padrão, portanto, se houver vários elementos block, sem uso de CSS para layout, eles serão dispostos verticalmente de cima para baixo por padrão. Elementos block só podem ser escritos dentro de `<body></body>`.

#### Lista de Elementos Block Comuns

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

Elementos inline não ocupam uma linha inteira, portanto, quando há vários elementos inline adjacentes, eles se dispõem horizontalmente. Elementos block não podem ser colocados dentro de elementos inline, que só podem ser usados para apresentar dados ou informações. No entanto, é possível alterar as propriedades de elementos inline via `CSS`, por exemplo, adicionando `display: block;` a um `span`.

#### Lista de Elementos Inline Comuns

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

No display existe uma propriedade `inline-block` que pode converter elementos block em elementos inline, mas mantendo as características de elementos block, como a possibilidade de definir largura, altura, margin, padding, etc. Isso significa que o elemento se comportará como um elemento inline no layout, dispondo-se horizontalmente, mas poderá usar propriedades de block para afastar outros elementos.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 教學-關於 display:inline、block、inline-block 的差別](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. O que `* { box-sizing: border-box; }` faz?

