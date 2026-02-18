---
id: web-browsing-process
title: "📄 Proceso de navegación web"
slug: /web-browsing-process
---

## 1. Explique cómo el navegador obtiene HTML del servidor y cómo lo renderiza en la pantalla

> Describa cómo el navegador obtiene HTML del servidor y cómo renderiza el HTML en la pantalla

### 1. Iniciar la solicitud

- **Entrada de URL**: Cuando el usuario ingresa una URL en el navegador o hace clic en un enlace, el navegador comienza a analizar la URL para determinar a qué servidor enviar la solicitud.
- **Búsqueda DNS**: El navegador ejecuta una búsqueda DNS para encontrar la dirección IP del servidor correspondiente.
- **Establecer conexión**: El navegador envía una solicitud a la dirección IP del servidor a través de Internet utilizando el protocolo HTTP o HTTPS. Si es HTTPS, también necesita realizar una conexión SSL/TLS.

### 2. Respuesta del servidor

- **Procesar solicitud**: Cuando el servidor recibe la solicitud, lee los datos correspondientes de la base de datos según la ruta y los parámetros de la solicitud.
- **Enviar Response**: Luego envía el archivo HTML como parte del HTTP Response al navegador. El Response también incluye códigos de estado y otros parámetros (CORS, content-type, etc.).

### 3. Análisis del HTML

- **Construir DOM Tree**: El navegador comienza a leer el archivo HTML y, según las etiquetas y atributos del HTML, lo convierte en DOM y construye el DOM Tree en memoria.
- **Solicitar subrecursos (requesting subresources)**: Durante el análisis del HTML, si encuentra recursos externos como CSS, JavaScript, imágenes, etc., el navegador envía solicitudes adicionales al servidor para obtener estos recursos.

### 4. Renderizado de la página (Render Page)

- **Construir CSSOM Tree**: El navegador analiza los archivos CSS y construye el CSSOM Tree.
- **Render Tree**: El navegador fusiona el DOM Tree y el CSSOM Tree en un Render Tree, que contiene todos los nodos a renderizar y sus estilos correspondientes.
- **Layout (diseño)**: El navegador realiza el diseño (Layout o Reflow), calculando la posición y el tamaño de cada nodo.
- **Paint (pintado)**: Finalmente, el navegador pasa por la fase de pintado (painting), dibujando el contenido de cada nodo en la página.

### 5. Interacción con JavaScript

- **Ejecutar JavaScript**: Si el HTML contiene JavaScript, el navegador lo analiza y ejecuta. Esta acción puede modificar el DOM y cambiar los estilos.

Todo el proceso es progresivo. Teóricamente, el usuario verá primero parte del contenido de la página web y finalmente la página completa. Durante este proceso, pueden ocurrir múltiples Reflow y Repaint, especialmente en páginas con estilos complejos o efectos interactivos. Además de las optimizaciones propias del navegador, los desarrolladores suelen emplear diversas técnicas para hacer la experiencia del usuario más fluida.

## 2. Describa Reflow y Repaint

### Reflow (reflujo/reposicionamiento)

Se refiere a cuando el DOM de una página web sufre cambios, lo que obliga al navegador a recalcular la posición de los elementos y colocarlos en la posición correcta. En términos simples, el Layout necesita regenerar la disposición de los elementos.

#### Condiciones que activan Reflow

El Reflow tiene dos escenarios: uno es cuando toda la página cambia, y otro es cuando solo cambia un área parcial de un componente.

- La entrada inicial a la página es el Reflow de mayor impacto
- Agregar o eliminar elementos DOM
- Cambiar el tamaño de un elemento, como agregar contenido o cambiar el tamaño de la fuente
- Ajustar la disposición de un elemento, por ejemplo mediante margin o padding
- Cambios en el tamaño de la ventana del navegador
- Activar pseudo-clases, como el efecto hover

### Repaint (repintado)

No cambia el Layout, solo actualiza o modifica elementos. Dado que los elementos están contenidos en el Layout, si se activa un Reflow inevitablemente se activará un Repaint, pero activar solo un Repaint no necesariamente causa un Reflow.

#### Condiciones que activan Repaint

- Cambiar el color o fondo de un elemento, como agregar color o ajustar propiedades de background
- Cambiar la sombra o el border de un elemento también es Repaint

### Cómo optimizar Reflow o Repaint

- No use table para el diseño. Las propiedades de table tienden a causar reposicionamiento del Layout al cambiar atributos. Si es inevitable usarlas, se recomienda agregar las siguientes propiedades para renderizar solo una fila a la vez y evitar afectar todo el rango de la tabla, por ejemplo: `table-layout: auto;` o `table-layout: fixed;`
- No manipule el DOM para ajustar estilos uno por uno. En su lugar, defina los estilos que necesita cambiar mediante class y luego cámbielos a través de JS.
  - Tomando Vue como ejemplo, puede usar el enlace de class para cambiar estilos en lugar de modificar estilos directamente con funciones.
- Para escenarios que requieren cambios frecuentes, como cambio de pestañas, se debe priorizar el uso de `v-show` sobre `v-if`. El primero solo usa la propiedad CSS `display: none;` para ocultar, mientras que el segundo activa el ciclo de vida, recreando o destruyendo elementos, lo que naturalmente tiene un mayor consumo de rendimiento.
- Si es inevitable activar Reflow, puede optimizar mediante `requestAnimationFrame` (principalmente porque esta API está diseñada para animaciones y puede sincronizarse con la frecuencia de cuadros del navegador), lo que permite combinar múltiples Reflow en uno y reducir el número de Repaint.
  - Por ejemplo, si una animación necesita moverse hacia un objetivo en la página, puede usar `requestAnimationFrame` para calcular cada movimiento.
  - Del mismo modo, algunas propiedades de CSS3 pueden activar la aceleración por hardware del cliente, mejorando el rendimiento de las animaciones, como `transform`, `opacity`, `filters`, `Will-change`.
- Si es posible, modifique los estilos en nodos DOM de nivel inferior para evitar que el cambio de estilo de un elemento padre afecte a todos sus elementos hijos.
- Si necesita ejecutar animaciones, úselas en elementos con posición absoluta (`absolute`, `fixed`), ya que tienen poco impacto en otros elementos y solo activan Repaint, evitando el Reflow.

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [Reflow y Repaint del navegador](https://juejin.cn/post/6844903569087266823)
- [Introducción a Reflow y Repaint, y cómo optimizarlos](https://juejin.cn/post/7064077572132323365)

## 3. Describa cuándo el navegador envía una solicitud OPTIONS al servidor

> Explique cuándo el navegador envía una solicitud OPTIONS al servidor

En la mayoría de los casos, se aplica en escenarios de CORS. Antes de enviar la solicitud real, hay una acción de preflight (verificación previa), donde el navegador envía primero una solicitud OPTIONS para preguntar al servidor si permite esta solicitud de origen cruzado. Si el servidor responde que lo permite, el navegador envía la solicitud real; de lo contrario, el navegador muestra un error.

Además, si el método de la solicitud no es `GET`, `HEAD` o `POST`, también se activará una solicitud OPTIONS.
