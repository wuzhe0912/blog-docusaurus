---
id: css-box-model
title: '[Easy] 🏷️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Default

`Box Model` es un término utilizado en `CSS` para discutir el diseño de layout. Se puede entender como una caja que envuelve un elemento `HTML`, con cuatro propiedades principales:

- content: Se utiliza principalmente para mostrar el contenido del elemento, como texto.
- padding: La distancia entre el contenido del elemento y el borde del elemento
- margin: La distancia entre el elemento y otros elementos externos
- border: La línea del borde del propio elemento

## box-sizing

La propiedad `box-sizing` determina el tipo de `Box Model` que se utiliza.

Significa que, al calcular el ancho y alto de un elemento, si las propiedades `padding` y `border` se rellenan hacia adentro o se expanden hacia afuera.

Su valor predeterminado es `content-box`, que adopta la expansión hacia afuera. Bajo esta condición, además del ancho y alto propios del elemento, también se deben incluir `padding` y `border` adicionales en el cálculo. Como se muestra:

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

El cálculo del ancho de este `div` es `100px(width)` + `20px(padding izquierdo y derecho)` + `2px(border izquierdo y derecho)` = `122px`.

## border-box

Obviamente, el método anterior no es confiable, ya que obliga al desarrollador frontend a calcular constantemente el ancho y alto de los elementos. Para mejorar la experiencia de desarrollo, se debe adoptar otro modo: `border-box`.

Como en el siguiente ejemplo, al inicializar estilos se establece el valor de `box-sizing` de todos los elementos en `border-box`:

```css
* {
  box-sizing: border-box; // global style
}
```

De esta manera, se cambia a la forma de relleno hacia adentro, el diseño del ancho y alto del elemento es más intuitivo, sin necesidad de sumar o restar números por `padding` o `border`.

## Ejemplo comparativo

Supongamos la siguiente configuración de estilos idéntica:

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box (valor predeterminado)

- **Ancho real ocupado** = `100px(width)` + `20px(padding izquierdo y derecho)` + `10px(border izquierdo y derecho)` = `130px`
- **Alto real ocupado** = `100px(height)` + `20px(padding superior e inferior)` + `10px(border superior e inferior)` = `130px`
- **Área de content** = `100px x 100px`
- **Nota**: `margin` no se incluye en el ancho del elemento, pero afecta la distancia con otros elementos

### border-box

- **Ancho real ocupado** = `100px` (padding y border se comprimen hacia adentro)
- **Alto real ocupado** = `100px`
- **Área de content** = `100px` - `20px(padding izquierdo y derecho)` - `10px(border izquierdo y derecho)` = `70px x 70px`
- **Nota**: `margin` igualmente no se incluye en el ancho del elemento

### Comparación visual

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
Ancho total: 130px (sin incluir margin)

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
Ancho total: 100px (sin incluir margin)
```

## Trampas comunes

### 1. Manejo de margin

Ya sea `content-box` o `border-box`, **margin nunca se incluye en el ancho y alto del elemento**. Ambos modos solo afectan la forma de calcular `padding` y `border`.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* No se incluye en width */
}
/* El ancho real ocupado del elemento sigue siendo 100px, pero la distancia con otros elementos será 20px más */
```

### 2. Ancho en porcentaje

Al usar ancho en porcentaje, la forma de cálculo también se ve afectada por `box-sizing`:

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* Hereda el 50% del padre = 100px */
  padding: 10px;
  border: 5px solid;
}

/* content-box: Ocupa realmente 130px (puede exceder el padre) */
/* border-box: Ocupa realmente 100px (exactamente el 50% del padre) */
```

### 3. Elementos inline

`box-sizing` no funciona con elementos `inline`, porque las configuraciones de `width` y `height` de los elementos inline son inválidas por sí mismas.

```css
span {
  display: inline;
  width: 100px; /* Inválido */
  box-sizing: border-box; /* También inválido */
}
```

### 4. min-width / max-width

`min-width` y `max-width` también se ven afectados por `box-sizing`:

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* Incluye padding y border */
  padding: 10px;
  border: 5px solid;
}
/* Ancho mínimo de content = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [Aprender diseño CSS](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
