---
id: css-pseudo-elements
title: '[Easy] 🏷️ Pseudoelementos (Pseudo-elements)'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## Qué son los pseudoelementos

Los pseudoelementos (Pseudo-elements) son palabras clave de CSS que se utilizan para seleccionar partes específicas de un elemento o insertar contenido antes o después de un elemento. Utilizan la sintaxis de **doble dos puntos** `::` (estándar CSS3), para distinguirlos de las pseudoclases (pseudo-classes) que usan un solo dos puntos `:`.

## Pseudoelementos comunes

### 1. ::before y ::after

Los pseudoelementos más utilizados, se usan para insertar contenido antes o después del contenido de un elemento.

```css
.icon::before {
  content: '📌';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**Características**:

- Debe incluir la propiedad `content` (incluso si es una cadena vacía)
- Por defecto son elementos `inline`
- No aparecen en el DOM, no se pueden seleccionar con JavaScript

### 2. ::first-letter

Selecciona la primera letra del elemento, comúnmente usado para el efecto de letra capital estilo revista.

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

Selecciona la primera línea de texto del elemento.

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**Nota**: `::first-line` solo se puede usar con elementos de nivel de bloque.

### 4. ::selection

Personaliza el estilo cuando el usuario selecciona texto.

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox necesita prefijo */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

Personaliza el estilo del placeholder de formularios.

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

Personaliza el estilo del marcador de lista (list marker).

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

Se usa para el fondo superpuesto de elementos en pantalla completa (como `<dialog>` o videos en pantalla completa).

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## Escenarios de aplicación práctica

### 1. Iconos decorativos

Implementación pura con CSS sin necesidad de elementos HTML adicionales:

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**Cuándo usar**: Cuando no se quiere agregar elementos puramente decorativos en el HTML.

### 2. Limpiar flotaciones (Clearfix)

Técnica clásica de limpieza de flotaciones:

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**Cuándo usar**: Cuando el elemento padre tiene hijos flotantes y necesita expandir la altura del padre.

### 3. Decoración de citas

Agregar comillas automáticamente al texto citado:

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**Cuándo usar**: Para embellecer bloques de citas sin ingresar comillas manualmente.

### 4. Figuras geométricas puras con CSS

Crear formas geométricas usando pseudoelementos:

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**Cuándo usar**: Para crear flechas, triángulos y otras figuras simples, sin necesidad de imágenes o SVG.

### 5. Marcador de campo obligatorio

Agregar un asterisco rojo a los campos de formulario obligatorios:

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**Cuándo usar**: Para marcar campos obligatorios manteniendo la semántica del HTML limpia.

### 6. Indicador de enlace externo

Agregar automáticamente un icono a los enlaces externos:

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* O usar icon font */
a[target='_blank']::after {
  content: '\f08e'; /* Icono de enlace externo de Font Awesome */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**Cuándo usar**: Para mejorar la experiencia del usuario, informándole que se abrirá una nueva pestaña.

### 7. Numeración con contadores

Numeración automática usando contadores CSS:

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**Cuándo usar**: Para generar numeración automática sin mantenimiento manual.

### 8. Efecto de superposición

Agregar una superposición hover a imágenes:

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**Cuándo usar**: Cuando no se quiere agregar elementos HTML adicionales para implementar el efecto de superposición.

## Pseudoelementos vs Pseudoclases

| Característica | Pseudoelementos (::)                    | Pseudoclases (:)                      |
| -------------- | --------------------------------------- | ------------------------------------- |
| **Sintaxis**   | Doble dos puntos `::before`             | Un solo dos puntos `:hover`           |
| **Función**    | Crear/seleccionar partes del elemento   | Seleccionar estados del elemento      |
| **Ejemplos**   | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()`   |
| **DOM**        | No existe en el DOM                     | Selecciona elementos reales del DOM   |

## Trampas comunes

### 1. La propiedad content debe existir

`::before` y `::after` deben tener la propiedad `content`, de lo contrario no se mostrarán:

```css
/* ❌ No se mostrará */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* ✅ Correcto */
.box::before {
  content: ''; /* Incluso una cadena vacía es necesaria */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. No se pueden usar en elementos reemplazados

Algunos elementos (como `<img>`, `<input>`, `<iframe>`) no pueden usar `::before` y `::after`:

```css
/* ❌ Inválido */
img::before {
  content: 'Photo:';
}

/* ✅ Usar elemento envolvente */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. Son elementos inline por defecto

`::before` y `::after` son elementos `inline` por defecto, hay que tener cuidado al establecer ancho y alto:

```css
.box::before {
  content: '';
  display: block; /* o inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. Problemas con z-index

El `z-index` de los pseudoelementos es relativo al elemento padre:

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* Estará debajo del padre, pero encima del fondo del padre */
}
```

### 5. Compatibilidad con un solo dos puntos

La especificación CSS3 usa doble dos puntos `::` para distinguir pseudoelementos de pseudoclases, pero un solo dos puntos `:` todavía funciona (compatibilidad con CSS2):

```css
/* Notación estándar CSS3 (recomendada) */
.box::before {
}

/* Notación CSS2 (todavía funciona) */
.box:before {
}
```

## Puntos clave para entrevistas

1. **Sintaxis de doble dos puntos para pseudoelementos**: Distinguir pseudoelementos `::` de pseudoclases `:`
2. **La propiedad content debe existir**: La clave de `::before` y `::after`
3. **No están en el DOM**: No se pueden seleccionar ni manipular directamente con JavaScript
4. **No se pueden usar en elementos reemplazados**: Inválido para `<img>`, `<input>`, etc.
5. **Escenarios de aplicación práctica**: Iconos decorativos, limpieza de flotaciones, dibujo de figuras, etc.

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
