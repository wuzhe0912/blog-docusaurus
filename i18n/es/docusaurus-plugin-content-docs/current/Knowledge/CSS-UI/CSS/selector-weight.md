---
id: selector-weight
title: '[Easy] 🏷️ Peso de selectores'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Cómo se calcula el peso de un selector?

> Cómo se calcula la prioridad (peso) de los selectores?

La determinación de la prioridad de los selectores CSS es para resolver el problema de qué estilo aplicará finalmente un elemento. Como se muestra:

```html
<div id="app" class="wrapper">What color ?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

En este ejemplo, el resultado final será azul. Aquí se aplicaron dos selectores, ID y class, y dado que el peso del ID es mayor que el de class, el estilo de class se sobrescribe.

### Weight Sequence

> inline style > ID > class > tag

Si en el código HTML hay un estilo en línea escrito dentro de la etiqueta, por defecto tendrá la mayor prioridad, sobrescribiendo los estilos del archivo CSS. Como se muestra:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

Sin embargo, en el desarrollo general no se usa esta forma de escritura, ya que es difícil de mantener y fácilmente causa problemas de contaminación de estilos.

### Caso especial

Si realmente se encuentra un estilo en línea que no se puede eliminar, y se desea sobrescribirlo a través del archivo CSS, se puede usar `!important`:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

Por supuesto, si es posible, se recomienda no usar `!important`. Aunque el estilo en línea también puede agregar `!important`, personalmente no considero esa forma de escribir estilos. Además, a menos que haya un caso especial, tampoco uso selectores de ID; básicamente construyo toda la hoja de estilos con class.
