---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> ¿Por que JavaScript necesita procesamiento asincrono? Explique callback y event loop

JavaScript es esencialmente un lenguaje de un solo hilo, ya que una de sus tareas es modificar la estructura DOM del navegador. Si multiples hilos modificaran el mismo nodo simultaneamente, la situacion se volveria muy compleja. Para evitar esto, se adopto el modelo de un solo hilo.

El procesamiento asincrono es una solucion viable en el contexto de un solo hilo. Si una accion necesita esperar 2 segundos, el navegador no puede quedarse esperando 2 segundos. Por lo tanto, primero ejecuta todo el trabajo sincrono, mientras que las tareas asincronas se colocan en la task queue (cola de tareas).

El entorno donde el navegador ejecuta el trabajo sincrono puede entenderse como el call stack. El navegador ejecuta secuencialmente las tareas en el call stack. Cuando detecta que el call stack esta vacio, toma las tareas en espera de la task queue y las coloca en el call stack para ejecutarlas secuencialmente.

1. El navegador verifica si el call stack esta vacio => No => Continua ejecutando tareas en el call stack
2. El navegador verifica si el call stack esta vacio => Si => Verifica si hay tareas en espera en la task queue => Si => Las mueve al call stack para ejecutar

Este proceso de repeticion continua es el concepto del event loop.

```js
console.log(1);

// Esta funcion asincrona es el callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Se imprime en orden 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> ¿Por que `setInterval` no es preciso en cuanto al tiempo?

1. Dado que JavaScript es un lenguaje de un solo hilo (solo puede ejecutar una tarea a la vez, las demas deben esperar en la Queue), cuando el tiempo de ejecucion del callback de setInterval excede el intervalo configurado, la siguiente ejecucion se retrasa. Por ejemplo, si setInterval esta configurado para ejecutar una funcion cada segundo, pero una accion dentro de la funcion tarda dos segundos, la siguiente ejecucion se retrasara un segundo. Con el tiempo, el setInterval se vuelve cada vez mas impreciso.

2. Los navegadores o entornos de ejecucion tambien imponen limitaciones. En la mayoria de los navegadores principales (Chrome, Firefox, Safari, etc.), el intervalo minimo es de aproximadamente 4 milisegundos. Incluso si se configura a 1 milisegundo, en realidad se ejecutara cada 4 milisegundos.

3. Cuando el sistema ejecuta tareas que consumen mucha memoria o CPU, tambien causa retrasos. Acciones como edicion de video o procesamiento de imagenes tienen alta probabilidad de causar retrasos.

4. JavaScript tiene un mecanismo de Garbage Collection. Si dentro de la funcion del setInterval se crean muchos objetos que no se usan despues de la ejecucion, seran recolectados por el GC, lo que tambien causa retrasos.

### Alternativas

#### requestAnimationFrame

Si actualmente se usa `setInterval` para implementar animaciones, se puede considerar usar `requestAnimationFrame` como reemplazo.

- Sincronizado con el repintado del navegador: Se ejecuta cuando el navegador esta listo para dibujar un nuevo frame. Es mucho mas preciso que intentar adivinar el momento del repintado con setInterval o setTimeout.
- Rendimiento: Al estar sincronizado con el repintado, no se ejecuta cuando el navegador considera que no necesita repintar. Esto ahorra recursos de calculo, especialmente cuando la pestana no esta en foco o esta minimizada.
- Estrangulamiento automatico: Ajusta automaticamente la frecuencia de ejecucion segun el dispositivo y la situacion, normalmente 60 frames por segundo.
- Parametro de tiempo de alta precision: Puede recibir un parametro de tiempo de alta precision (tipo DOMHighResTimeStamp, con precision de microsegundos) para controlar animaciones u otras operaciones sensibles al tiempo con mayor precision.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Si el elemento aun no ha llegado al destino, continuar la animacion
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` actualiza la posicion del elemento en cada frame (normalmente 60 frames por segundo) hasta alcanzar los 500 pixeles. Este metodo logra un efecto de animacion mas suave y natural que `setInterval`.
