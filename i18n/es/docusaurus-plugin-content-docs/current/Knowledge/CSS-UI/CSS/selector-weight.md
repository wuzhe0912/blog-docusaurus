---
id: selector-weight
title: '[Easy] \U0001F3F7️ Peso de selectores'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Como se calcula el peso de un selector?

> Como se calcula la prioridad (peso) de los selectores?

La determinacion de la prioridad de los selectores CSS es para resolver el problema de que estilo aplicara finalmente un elemento. Como se muestra:

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

En este ejemplo, el resultado final sera azul. Aqui se aplicaron dos selectores, ID y class, y dado que el peso del ID es mayor que el de class, el estilo de class se sobrescribe.

### Weight Sequence

> inline style > ID > class > tag

Si en el codigo HTML hay un estilo en linea escrito dentro de la etiqueta, por defecto tendra la mayor prioridad, sobrescribiendo los estilos del archivo CSS. Como se muestra:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

Sin embargo, en el desarrollo general no se usa esta forma de escritura, ya que es dificil de mantener y facilmente causa problemas de contaminacion de estilos.

### Caso especial

Si realmente se encuentra un estilo en linea que no se puede eliminar, y se desea sobrescribirlo a traves del archivo CSS, se puede usar `!important`:

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

Por supuesto, si es posible, se recomienda no usar `!important`. Aunque el estilo en linea tambien puede agregar `!important`, personalmente no considero esa forma de escribir estilos. Ademas, a menos que haya un caso especial, tampoco uso selectores de ID; basicamente construyo toda la hoja de estilos con class.

