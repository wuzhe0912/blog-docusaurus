---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Descripción general

En HTML, tenemos tres formas principales de cargar archivos JavaScript:

1. `<script>`
2. `<script async>`
3. `<script defer>`

Estas tres formas tienen comportamientos diferentes al cargar y ejecutar scripts.

## Comparación detallada

### `<script>`

- **Comportamiento**: Cuando el navegador encuentra esta etiqueta, detiene el análisis de HTML, descarga y ejecuta el script, y luego continúa analizando el HTML.
- **Cuándo usarlo**: Adecuado para scripts que son esenciales para el renderizado de la página.
- **Ventaja**: Garantiza que los scripts se ejecuten en orden.
- **Desventaja**: Puede retrasar el renderizado de la página.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Comportamiento**: El navegador descarga el script en segundo plano mientras continúa analizando el HTML. Una vez completada la descarga, el script se ejecuta inmediatamente, lo que puede interrumpir el análisis del HTML.
- **Cuándo usarlo**: Adecuado para scripts independientes, como scripts de análisis o publicidad.
- **Ventaja**: No bloquea el análisis de HTML y puede mejorar la velocidad de carga de la página.
- **Desventaja**: No se garantiza el orden de ejecución; puede ejecutarse antes de que el DOM se haya cargado completamente.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Comportamiento**: El navegador descarga el script en segundo plano, pero espera a que se complete el análisis de HTML antes de ejecutarlo. Múltiples scripts defer se ejecutan en el orden en que aparecen en el HTML.
- **Cuándo usarlo**: Adecuado para scripts que necesitan la estructura completa del DOM, pero que no se necesitan de inmediato.
- **Ventaja**: No bloquea el análisis de HTML, garantiza el orden de ejecución y es ideal para scripts que dependen del DOM.
- **Desventaja**: Si el script es importante, puede retrasar el tiempo de interactividad de la página.

```html
<script defer src="ui-enhancements.js"></script>
```

## Ejemplo

Imagina que te estás preparando para una cita:

1. **`<script>`**:
   Es como dejar de prepararte por completo para llamar a tu pareja y confirmar los detalles de la cita. La comunicación queda asegurada, pero tu tiempo de preparación puede retrasarse.

2. **`<script async>`**:
   Es como prepararte mientras hablas con tu pareja por auriculares Bluetooth. La eficiencia aumenta, pero podrías ponerte la ropa equivocada por estar demasiado concentrado en la llamada.

3. **`<script defer>`**:
   Es como enviar un mensaje a tu pareja diciendo que le devolverás la llamada cuando termines de prepararte. Así puedes concentrarte en la preparación y comunicarte tranquilamente cuando todo esté listo.

## Uso actual

En el desarrollo con frameworks modernos, generalmente no es necesario configurar `<script>` manualmente. Por ejemplo, Vite utiliza module por defecto, que equivale al comportamiento de defer.

```javascript
<script type="module" src="/src/main.js"></script>
```

A menos que se trate de scripts de terceros especiales, como Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
