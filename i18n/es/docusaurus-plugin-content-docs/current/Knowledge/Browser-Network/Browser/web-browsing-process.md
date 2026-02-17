---
id: web-browsing-process
title: "\U0001F4C4 Proceso de navegacion web"
slug: /web-browsing-process
---

## 1. Explique como el navegador obtiene HTML del servidor y como lo renderiza en la pantalla

> Describa como el navegador obtiene HTML del servidor y como renderiza el HTML en la pantalla

### 1. Iniciar la solicitud

- **Entrada de URL**: Cuando el usuario ingresa una URL en el navegador o hace clic en un enlace, el navegador comienza a analizar la URL para determinar a que servidor enviar la solicitud.
- **Busqueda DNS**: El navegador ejecuta una busqueda DNS para encontrar la direccion IP del servidor correspondiente.
- **Establecer conexion**: El navegador envia una solicitud a la direccion IP del servidor a traves de Internet utilizando el protocolo HTTP o HTTPS. Si es HTTPS, tambien necesita realizar una conexion SSL/TLS.

### 2. Respuesta del servidor

- **Procesar solicitud**: Cuando el servidor recibe la solicitud, lee los datos correspondientes de la base de datos segun la ruta y los parametros de la solicitud.
- **Enviar Response**: Luego envia el archivo HTML como parte del HTTP Response al navegador. El Response tambien incluye codigos de estado y otros parametros (CORS, content-type, etc.).

### 3. Analisis del HTML

- **Construir DOM Tree**: El navegador comienza a leer el archivo HTML y, segun las etiquetas y atributos del HTML, lo convierte en DOM y construye el DOM Tree en memoria.
- **Solicitar subrecursos (requesting subresources)**: Durante el analisis del HTML, si encuentra recursos externos como CSS, JavaScript, imagenes, etc., el navegador envia solicitudes adicionales al servidor para obtener estos recursos.

### 4. Renderizado de la pagina (Render Page)

- **Construir CSSOM Tree**: El navegador analiza los archivos CSS y construye el CSSOM Tree.
- **Render Tree**: El navegador fusiona el DOM Tree y el CSSOM Tree en un Render Tree, que contiene todos los nodos a renderizar y sus estilos correspondientes.
- **Layout (diseno)**: El navegador realiza el diseno (Layout o Reflow), calculando la posicion y el tamano de cada nodo.
- **Paint (pintado)**: Finalmente, el navegador pasa por la fase de pintado (painting), dibujando el contenido de cada nodo en la pagina.

### 5. Interaccion con JavaScript

- **Ejecutar JavaScript**: Si el HTML contiene JavaScript, el navegador lo analiza y ejecuta. Esta accion puede modificar el DOM y cambiar los estilos.

Todo el proceso es progresivo. Teoricamente, el usuario vera primero parte del contenido de la pagina web y finalmente la pagina completa. Durante este proceso, pueden ocurrir multiples Reflow y Repaint, especialmente en paginas con estilos complejos o efectos interactivos. Ademas de las optimizaciones propias del navegador, los desarrolladores suelen emplear diversas tecnicas para hacer la experiencia del usuario mas fluida.

## 2. Describa Reflow y Repaint

### Reflow (reflujo/reposicionamiento)

Se refiere a cuando el DOM de una pagina web sufre cambios, lo que obliga al navegador a recalcular la posicion de los elementos y colocarlos en la posicion correcta. En terminos simples, el Layout necesita regenerar la disposicion de los elementos.

#### Condiciones que activan Reflow

El Reflow tiene dos escenarios: uno es cuando toda la pagina cambia, y otro es cuando solo cambia un area parcial de un componente.

- La entrada inicial a la pagina es el Reflow de mayor impacto
- Agregar o eliminar elementos DOM
- Cambiar el tamano de un elemento, como agregar contenido o cambiar el tamano de la fuente
- Ajustar la disposicion de un elemento, por ejemplo mediante margin o padding
- Cambios en el tamano de la ventana del navegador
- Activar pseudo-clases, como el efecto hover

### Repaint (repintado)

No cambia el Layout, solo actualiza o modifica elementos. Dado que los elementos estan contenidos en el Layout, si se activa un Reflow inevitablemente se activara un Repaint, pero activar solo un Repaint no necesariamente causa un Reflow.

#### Condiciones que activan Repaint

- Cambiar el color o fondo de un elemento, como agregar color o ajustar propiedades de background
- Cambiar la sombra o el border de un elemento tambien es Repaint

### Como optimizar Reflow o Repaint

- No use table para el diseno. Las propiedades de table tienden a causar reposicionamiento del Layout al cambiar atributos. Si es inevitable usarlas, se recomienda agregar las siguientes propiedades para renderizar solo una fila a la vez y evitar afectar todo el rango de la tabla, por ejemplo: `table-layout: auto;` o `table-layout: fixed;`
- No manipule el DOM para ajustar estilos uno por uno. En su lugar, defina los estilos que necesita cambiar mediante class y luego cambielos a traves de JS.
  - Tomando Vue como ejemplo, puede usar el enlace de class para cambiar estilos en lugar de modificar estilos directamente con funciones.
- Para escenarios que requieren cambios frecuentes, como cambio de pestanas, se debe priorizar el uso de `v-show` sobre `v-if`. El primero solo usa la propiedad CSS `display: none;` para ocultar, mientras que el segundo activa el ciclo de vida, recreando o destruyendo elementos, lo que naturalmente tiene un mayor consumo de rendimiento.
- Si es inevitable activar Reflow, puede optimizar mediante `requestAnimationFrame` (principalmente porque esta API esta disenada para animaciones y puede sincronizarse con la frecuencia de cuadros del navegador), lo que permite combinar multiples Reflow en uno y reducir el numero de Repaint.
  - Por ejemplo, si una animacion necesita moverse hacia un objetivo en la pagina, puede usar `requestAnimationFrame` para calcular cada movimiento.
  - Del mismo modo, algunas propiedades de CSS3 pueden activar la aceleracion por hardware del cliente, mejorando el rendimiento de las animaciones, como `transform`, `opacity`, `filters`, `Will-change`.
- Si es posible, modifique los estilos en nodos DOM de nivel inferior para evitar que el cambio de estilo de un elemento padre afecte a todos sus elementos hijos.
- Si necesita ejecutar animaciones, uselas en elementos con posicion absoluta (`absolute`, `fixed`), ya que tienen poco impacto en otros elementos y solo activan Repaint, evitando el Reflow.

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
- [Introduccion a Reflow y Repaint, y como optimizarlos](https://juejin.cn/post/7064077572132323365)

## 3. Describa cuando el navegador envia una solicitud OPTIONS al servidor

> Explique cuando el navegador envia una solicitud OPTIONS al servidor

En la mayoria de los casos, se aplica en escenarios de CORS. Antes de enviar la solicitud real, hay una accion de preflight (verificacion previa), donde el navegador envia primero una solicitud OPTIONS para preguntar al servidor si permite esta solicitud de origen cruzado. Si el servidor responde que lo permite, el navegador envia la solicitud real; de lo contrario, el navegador muestra un error.

Ademas, si el metodo de la solicitud no es `GET`, `HEAD` o `POST`, tambien se activara una solicitud OPTIONS.
