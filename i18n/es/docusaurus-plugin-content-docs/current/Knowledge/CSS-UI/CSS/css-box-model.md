---
id: css-box-model
title: '[Easy] \U0001F3F7️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Default

`Box Model` es un termino utilizado en `CSS` para discutir el diseno de layout. Se puede entender como una caja que envuelve un elemento `HTML`, con cuatro propiedades principales:

- content: Se utiliza principalmente para mostrar el contenido del elemento, como texto.
- padding: La distancia entre el contenido del elemento y el borde del elemento
- margin: La distancia entre el elemento y otros elementos externos
- border: La linea del borde del propio elemento

## box-sizing

La propiedad `box-sizing` determina el tipo de `Box Model` que se utiliza.

Significa que, al calcular el ancho y alto de un elemento, si las propiedades `padding` y `border` se rellenan hacia adentro o se expanden hacia afuera.

Su valor predeterminado es `content-box`, que adopta la expansion hacia afuera. Bajo esta condicion, ademas del ancho y alto propios del elemento, tambien se deben incluir `padding` y `border` adicionales en el calculo. Como se muestra:

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

El calculo del ancho de este `div` es `100px(width)` + `20px(padding izquierdo y derecho)` + `2px(border izquierdo y derecho)` = `122px`.

## border-box

Obviamente, el metodo anterior no es confiable, ya que obliga al desarrollador frontend a calcular constantemente el ancho y alto de los elementos. Para mejorar la experiencia de desarrollo, se debe adoptar otro modo: `border-box`.

Como en el siguiente ejemplo, al inicializar estilos se establece el valor de `box-sizing` de todos los elementos en `border-box`:

```css
* {
  box-sizing: border-box; // global style
}
```

De esta manera, se cambia a la forma de relleno hacia adentro, el diseno del ancho y alto del elemento es mas intuitivo, sin necesidad de sumar o restar numeros por `padding` o `border`.

## Ejemplo comparativo

Supongamos la siguiente configuracion de estilos identica:

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
- **Area de content** = `100px x 100px`
- **Nota**: `margin` no se incluye en el ancho del elemento, pero afecta la distancia con otros elementos

### border-box

- **Ancho real ocupado** = `100px` (padding y border se comprimen hacia adentro)
- **Alto real ocupado** = `100px`
- **Area de content** = `100px` - `20px(padding izquierdo y derecho)` - `10px(border izquierdo y derecho)` = `70px x 70px`
- **Nota**: `margin` igualmente no se incluye en el ancho del elemento

### Comparacion visual

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
/* El ancho real ocupado del elemento sigue siendo 100px, pero la distancia con otros elementos sera 20px mas */
```

### 2. Ancho en porcentaje

Al usar ancho en porcentaje, la forma de calculo tambien se ve afectada por `box-sizing`:

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

`box-sizing` no funciona con elementos `inline`, porque las configuraciones de `width` y `height` de los elementos inline son invalidas por si mismas.

```css
span {
  display: inline;
  width: 100px; /* Invalido */
  box-sizing: border-box; /* Tambien invalido */
}
```

### 4. min-width / max-width

`min-width` y `max-width` tambien se ven afectados por `box-sizing`:

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* Incluye padding y border */
  padding: 10px;
  border: 5px solid;
}
/* Ancho minimo de content = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [學習 CSS 版面配置](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
