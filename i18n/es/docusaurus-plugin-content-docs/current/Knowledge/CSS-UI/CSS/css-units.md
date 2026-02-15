---
id: css-units
title: '[Medium] \U0001F3F7️ Unidades CSS'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Explique la diferencia entre `px`, `em`, `rem`, `vw`, `vh`

### Tabla de comparacion rapida

| Unidad | Tipo     | Relativo a                  | Afectado por padre | Usos comunes                         |
| ------ | -------- | --------------------------- | ------------------ | ------------------------------------ |
| `px`   | Absoluta | Pixeles de pantalla         | ❌                 | Bordes, sombras, detalles pequenos   |
| `em`   | Relativa | font-size del **padre**     | ✅                 | Padding, margin (seguir fuente)      |
| `rem`  | Relativa | font-size del **root**      | ❌                 | Fuentes, espaciado, tamano general   |
| `vw`   | Relativa | 1% del ancho del viewport   | ❌                 | Ancho responsivo, elementos de ancho completo |
| `vh`   | Relativa | 1% del alto del viewport    | ❌                 | Alto responsivo, secciones de pantalla completa |

### Explicacion detallada

#### `px` (Pixels)

**Definicion**: Unidad absoluta, 1px = un punto de pixel en la pantalla

**Caracteristicas**:

- Tamano fijo, no cambia por ninguna configuracion
- Control preciso, pero carece de flexibilidad
- No es favorable para diseno responsivo ni accesibilidad

**Cuando usar**:

```css
/* ✅ Adecuado para */
border: 1px solid #000; /* Bordes */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombras */
border-radius: 4px; /* Bordes redondeados pequenos */

/* ❌ No recomendado para */
font-size: 16px; /* Para fuentes se recomienda rem */
width: 1200px; /* Para ancho se recomienda % o vw */
```

#### `em`

**Definicion**: Multiplo del font-size del **elemento padre**

**Caracteristicas**:

- Se acumula por herencia (las estructuras anidadas se apilan)
- Alta flexibilidad pero puede descontrolarse facilmente
- Adecuado para escenarios que necesitan escalar con el padre

**Ejemplo de calculo**:

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px (relativo a su propio font-size) */
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px (efecto acumulativo!) */
}
```

**Cuando usar**:

```css
/* ✅ Adecuado para */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* Padding sigue el tamano de fuente del boton */
}

.card-title {
  font-size: 1.2em; /* Relativo a la fuente base de la tarjeta */
  margin-bottom: 0.5em; /* Espaciado sigue el tamano del titulo */
}

/* ⚠️ Cuidado con la acumulacion por anidamiento */
```

#### `rem` (Root em)

**Definicion**: Multiplo del font-size del **elemento raiz** (`<html>`)

**Caracteristicas**:

- No se acumula por herencia (siempre relativo al root)
- Facil de gestionar y mantener
- Conveniente para implementar escalado global
- Una de las unidades mas recomendadas

**Ejemplo de calculo**:

```css
html {
  font-size: 16px; /* Valor predeterminado del navegador */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* Sigue siendo 24px, no se acumula! */
}
```

**Cuando usar**:

```css
/* ✅ Mas recomendado para */
html {
  font-size: 16px; /* Establecer base */
}

body {
  font-size: 1rem; /* Texto principal 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* ✅ Conveniente para modo oscuro o ajustes de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* Todas las unidades rem se amplian automaticamente */
  }
}
```

#### `vw` (Viewport Width)

**Definicion**: 1% del ancho del viewport (100vw = ancho del viewport)

**Caracteristicas**:

- Verdadera unidad responsiva
- Cambia en tiempo real con el tamano del viewport del navegador
- Nota: 100vw incluye el ancho de la barra de desplazamiento

**Ejemplo de calculo**:

```css
/* Asumiendo ancho de viewport 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* Asumiendo ancho de viewport 375px (movil) */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**Cuando usar**:

```css
/* ✅ Adecuado para */
.hero {
  width: 100vw; /* Banner de ancho completo */
  margin-left: calc(-50vw + 50%); /* Romper limite del contenedor */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* Fuente responsiva */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* Agregar limite maximo */
}

/* ❌ Evitar */
body {
  width: 100vw; /* Causara barra de desplazamiento horizontal (incluye barra de desplazamiento) */
}
```

#### `vh` (Viewport Height)

**Definicion**: 1% del alto del viewport (100vh = alto del viewport)

**Caracteristicas**:

- Adecuado para crear efectos de pantalla completa
- En dispositivos moviles hay que tener en cuenta el problema de la barra de direcciones
- Puede verse afectado por la aparicion del teclado

**Cuando usar**:

```css
/* ✅ Adecuado para */
.hero-section {
  height: 100vh; /* Pagina principal de pantalla completa */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* ⚠️ Alternativa para dispositivos moviles */
.hero-section {
  height: 100vh;
  height: 100dvh; /* Alto dinamico del viewport (unidad mas nueva) */
}

/* ✅ Centrado vertical */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Consejos practicos y mejores practicas

#### 1. Construir sistema de fuentes responsivo

```css
/* Establecer base */
html {
  font-size: 16px; /* Valor predeterminado de escritorio */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* Tableta */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* Movil */
  }
}

/* Todos los elementos que usan rem se escalan automaticamente */
h1 {
  font-size: 2.5rem;
} /* Escritorio 40px, movil 30px */
p {
  font-size: 1rem;
} /* Escritorio 16px, movil 12px */
```

#### 2. Uso mixto de diferentes unidades

```css
.card {
  /* Ancho responsivo + rango limitado */
  width: 90vw;
  max-width: 75rem;

  /* rem para espaciado */
  padding: 2rem;
  margin: 1rem auto;

  /* px para detalles */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp combina multiples unidades, escalado fluido */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### Ejemplo de respuesta para entrevista

**Estructura de respuesta**:

```markdown
1. **px**: Detalles en pixeles → bordes, sombras, bordes redondeados
2. **rem**: Base estable desde la raiz → fuentes, espaciado, tamanos principales
3. **em**: Sigue al padre
4. **vw**: Cambia con el ancho del viewport → ancho responsivo
5. **vh**: Llena el alto del viewport → secciones de pantalla completa
```

1. **Definicion rapida**

   - px es unidad absoluta, las demas son relativas
   - em es relativo al padre, rem es relativo al root
   - vw/vh son relativos al tamano del viewport

2. **Diferencia clave**

   - rem no se acumula, em si (esta es la diferencia principal)
   - vw/vh son verdaderamente responsivos, pero hay que tener cuidado con la barra de desplazamiento

3. **Aplicacion practica**

   - **px**: Bordes de 1px, sombras y otros detalles
   - **rem**: Fuentes, espaciado, contenedores (el mas usado, facil de mantener)
   - **em**: Padding de botones (cuando necesita escalar con la fuente)
   - **vw/vh**: Banners de ancho completo, secciones de pantalla completa, fuentes responsivas con clamp

4. **Mejores practicas**
   - Establecer html font-size como base
   - Usar clamp() para combinar diferentes unidades
   - Tener cuidado con el problema de vh en dispositivos moviles (se puede usar dvh)

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
