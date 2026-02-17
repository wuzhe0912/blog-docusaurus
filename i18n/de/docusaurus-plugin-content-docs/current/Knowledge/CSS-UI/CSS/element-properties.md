---
id: element-properties
title: '[Easy] 🏷️ Element-Eigenschaften'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Was sind inline- und block-Elemente? Was ist der Unterschied zwischen ihnen?

> Was sind inline- und block-Elemente? Was ist der Unterschied zwischen ihnen?

### Block Elements

> Die folgenden inline- und block-Elemente listen nur die gängigsten Tags auf. Seltenere Tags sollten bei Bedarf nachgeschlagen werden.

Block-Level-Elemente belegen standardmäßig eine ganze Zeile. Wenn es also mehrere Block-Elemente gibt und kein CSS-Layout verwendet wird, werden sie standardmäßig vertikal von oben nach unten angeordnet. Block-Elemente können nur innerhalb von `<body></body>` geschrieben werden.

#### Liste gängiger Block-Elemente

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

Inline-Elemente belegen nicht eine ganze Zeile. Wenn mehrere Inline-Elemente nebeneinander stehen, werden sie horizontal angeordnet. Block-Elemente können nicht innerhalb von Inline-Elementen platziert werden; Inline-Elemente können nur zur Darstellung von Daten oder Informationen verwendet werden. Die Eigenschaften von Inline-Elementen können jedoch über `CSS` geändert werden, z.B. indem man einem `span` `display: block;` hinzufügt.

#### Liste gängiger Inline-Elemente

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

In display gibt es eine `inline-block`-Eigenschaft, die Block-Elemente in Inline-Elemente umwandeln kann, wobei die Eigenschaften von Block-Elementen erhalten bleiben, z.B. die Möglichkeit, Breite, Höhe, margin, padding usw. festzulegen. Das bedeutet, dass sich dieses Element im Layout wie ein Inline-Element horizontal anordnet, aber Block-Eigenschaften nutzen kann, um andere Elemente im Layout zu verdrängen.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS-Tutorial: Unterschiede zwischen display:inline, block und inline-block](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. Was bewirkt `* { box-sizing: border-box; }`?
