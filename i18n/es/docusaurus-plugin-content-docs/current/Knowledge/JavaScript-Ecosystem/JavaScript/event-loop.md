---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> ¿Por qué JavaScript necesita procesamiento asíncrono? Explique callback y event loop

JavaScript es esencialmente un lenguaje de un solo hilo, ya que una de sus tareas es modificar la estructura DOM del navegador. Si múltiples hilos modificaran el mismo nodo simultáneamente, la situación se volvería muy compleja. Para evitar esto, se adoptó el modelo de un solo hilo.

El procesamiento asíncrono es una solución viable en el contexto de un solo hilo. Si una acción necesita esperar 2 segundos, el navegador no puede quedarse esperando 2 segundos. Por lo tanto, primero ejecuta todo el trabajo síncrono, mientras que las tareas asíncronas se colocan en la task queue (cola de tareas).

El entorno donde el navegador ejecuta el trabajo síncrono puede entenderse como el call stack. El navegador ejecuta secuencialmente las tareas en el call stack. Cuando detecta que el call stack está vacío, toma las tareas en espera de la task queue y las coloca en el call stack para ejecutarlas secuencialmente.

1. El navegador verifica si el call stack está vacío => No => Continúa ejecutando tareas en el call stack
2. El navegador verifica si el call stack está vacío => Sí => Verifica si hay tareas en espera en la task queue => Sí => Las mueve al call stack para ejecutar

Este proceso de repetición continua es el concepto del event loop.

```js
console.log(1);

// Esta función asíncrona es el callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Se imprime en orden 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> ¿Por qué `setInterval` no es preciso en cuanto al tiempo?

1. Dado que JavaScript es un lenguaje de un solo hilo (solo puede ejecutar una tarea a la vez, las demás deben esperar en la Queue), cuando el tiempo de ejecución del callback de setInterval excede el intervalo configurado, la siguiente ejecución se retrasa. Por ejemplo, si setInterval está configurado para ejecutar una función cada segundo, pero una acción dentro de la función tarda dos segundos, la siguiente ejecución se retrasará un segundo. Con el tiempo, el setInterval se vuelve cada vez más impreciso.

2. Los navegadores o entornos de ejecución también imponen limitaciones. En la mayoría de los navegadores principales (Chrome, Firefox, Safari, etc.), el intervalo mínimo es de aproximadamente 4 milisegundos. Incluso si se configura a 1 milisegundo, en realidad se ejecutará cada 4 milisegundos.

3. Cuando el sistema ejecuta tareas que consumen mucha memoria o CPU, también causa retrasos. Acciones como edición de video o procesamiento de imágenes tienen alta probabilidad de causar retrasos.

4. JavaScript tiene un mecanismo de Garbage Collection. Si dentro de la función del setInterval se crean muchos objetos que no se usan después de la ejecución, serán recolectados por el GC, lo que también causa retrasos.

### Alternativas

#### requestAnimationFrame

Si actualmente se usa `setInterval` para implementar animaciones, se puede considerar usar `requestAnimationFrame` como reemplazo.

- Sincronizado con el repintado del navegador: Se ejecuta cuando el navegador está listo para dibujar un nuevo frame. Es mucho más preciso que intentar adivinar el momento del repintado con setInterval o setTimeout.
- Rendimiento: Al estar sincronizado con el repintado, no se ejecuta cuando el navegador considera que no necesita repintar. Esto ahorra recursos de cálculo, especialmente cuando la pestaña no está en foco o está minimizada.
- Estrangulamiento automático: Ajusta automáticamente la frecuencia de ejecución según el dispositivo y la situación, normalmente 60 frames por segundo.
- Parámetro de tiempo de alta precisión: Puede recibir un parámetro de tiempo de alta precisión (tipo DOMHighResTimeStamp, con precisión de microsegundos) para controlar animaciones u otras operaciones sensibles al tiempo con mayor precisión.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Si el elemento aún no ha llegado al destino, continuar la animación
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` actualiza la posición del elemento en cada frame (normalmente 60 frames por segundo) hasta alcanzar los 500 píxeles. Este método logra un efecto de animación más suave y natural que `setInterval`.
