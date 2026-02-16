---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect y Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> ¿Qué es `useEffect`?

### Concepto clave

`useEffect` es un Hook encargado de gestionar los efectos secundarios (side effects) en los componentes funcionales de React. Se ejecuta después del renderizado del componente para realizar solicitudes de datos asíncronas, suscripciones, manipulación del DOM o sincronización manual de estado, correspondiendo a los métodos de ciclo de vida `componentDidMount`, `componentDidUpdate` y `componentWillUnmount` de los componentes de clase.

### Usos comunes

- Obtener datos remotos y actualizar el estado del componente
- Mantener suscripciones o escuchadores de eventos (como `resize`, `scroll`)
- Interactuar con APIs del navegador (como actualizar `document.title`, manipular `localStorage`)
- Limpiar recursos dejados por renderizados anteriores (como cancelar solicitudes, eliminar listeners)

<details>
<summary>Clic para ver ejemplo básico de uso</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Número de clics: ${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      Clic aquí
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> ¿Cuándo se ejecuta `useEffect`?

El segundo argumento de `useEffect` es el **arreglo de dependencias (dependency array)**, que controla el momento de ejecución del efecto secundario. React compara cada valor del arreglo uno por uno y, al detectar cambios, vuelve a ejecutar el efecto secundario, activando la función de limpieza antes de la siguiente ejecución.

### 2.1 Patrones comunes de dependencias

```javascript
// 1. Se ejecuta después de cada renderizado (incluido el primero)
useEffect(() => {
  console.log('Se activa ante cualquier cambio de state');
});

// 2. Se ejecuta solo una vez en el renderizado inicial
useEffect(() => {
  console.log('Solo se ejecuta cuando el componente se monta');
}, []);

// 3. Se especifican variables de dependencia
useEffect(() => {
  console.log('Solo se activa cuando selectedId cambia');
}, [selectedId]);
```

### 2.2 Función de limpieza y liberación de recursos

```javascript
useEffect(() => {
  const handler = () => {
    console.log('Escuchando');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('Listener eliminado');
  };
}, []);
```

El ejemplo anterior utiliza la función de limpieza para eliminar el listener de eventos. React ejecuta la función de limpieza antes de desmontar el componente o antes de actualizar las variables de dependencia, asegurando que no queden fugas de memoria ni listeners duplicados.

## 3. What is the difference between Real DOM and Virtual DOM?

> ¿Cuál es la diferencia entre Real DOM y Virtual DOM?

| Aspecto         | Real DOM                              | Virtual DOM                         |
| --------------- | ------------------------------------- | ----------------------------------- |
| Estructura      | Nodos reales mantenidos por el navegador | Nodos descritos por objetos JavaScript |
| Costo de actualización | La manipulación directa provoca reflow y repaint, alto costo | Primero calcula diferencias y las aplica en lote, bajo costo |
| Estrategia de actualización | Se refleja inmediatamente en la pantalla | Primero crea un nuevo árbol en memoria y compara diferencias |
| Extensibilidad  | Requiere control manual del flujo de actualización | Permite insertar lógica intermedia (Diff, procesamiento en lote) |

### Por qué React adopta Virtual DOM

```javascript
// Diagrama de flujo simplificado (no es el código fuente real de React)
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

Virtual DOM permite a React realizar primero el Diff en memoria para obtener la lista mínima de actualizaciones, y luego sincronizarlas de una vez con el Real DOM, evitando reflows y repaints frecuentes.

## 4. How to coordinate `useEffect` and Virtual DOM?

> ¿Cómo colaboran `useEffect` y Virtual DOM?

El flujo de renderizado de React se divide en Render Phase y Commit Phase. El punto clave de la colaboración entre `useEffect` y Virtual DOM es que los efectos secundarios deben esperar hasta que la actualización del Real DOM esté completa antes de ejecutarse.

### Render Phase (Fase de renderizado)

- React crea el nuevo Virtual DOM y calcula las diferencias con la versión anterior
- Esta fase es una operación de función pura que puede ser interrumpida o re-ejecutada

### Commit Phase (Fase de confirmación)

- React aplica las diferencias al Real DOM
- `useLayoutEffect` se ejecuta sincrónicamente en esta fase para garantizar que el DOM ya está actualizado

### Effect Execution (Momento de ejecución de efectos secundarios)

- `useEffect` se ejecuta después de que termina el Commit Phase y el navegador ha completado el pintado
- Esto evita que los efectos secundarios bloqueen la actualización de la pantalla, mejorando la experiencia del usuario

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Error al cargar', error);
      }
    });

  return () => {
    controller.abort(); // Garantiza la cancelación de la solicitud al actualizar dependencias o desmontar el componente
  };
}, [userId]);
```

## 5. Quiz Time

> Hora del quiz
> Simulación de escenario de entrevista

### Pregunta: Explica el orden de ejecución del siguiente código y escribe el resultado de la salida

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>Estado: {visible ? 'Visible' : 'Oculto'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        Alternar
      </button>
    </>
  );
}
```

<details>
<summary>Clic para ver la respuesta</summary>

- Después del renderizado inicial se imprimen en orden `effect 1`, `effect 2`. El primer `useEffect` no tiene arreglo de dependencias, el segundo `useEffect` depende de `visible`, y aunque el valor inicial es `false`, se ejecuta una vez.
- Al hacer clic en el botón de alternar y activar `setVisible`, en el siguiente renderizado primero se ejecuta la función de limpieza del renderizado anterior, imprimiendo `cleanup 1`, y luego se ejecutan los nuevos `effect 1` y `effect 2`.
- Como `visible` cambia con cada alternado, `effect 2` se re-ejecuta en cada alternado.

Orden final de salida: `effect 1` → `effect 2` → (después del clic) `cleanup 1` → `effect 1` → `effect 2`.

</details>

## 6. Best Practices

> Mejores prácticas

### Recomendaciones

- Mantener cuidadosamente el arreglo de dependencias, combinado con la regla ESLint `react-hooks/exhaustive-deps`.
- Dividir en múltiples `useEffect` según la responsabilidad, reduciendo el acoplamiento causado por efectos secundarios grandes.
- Liberar listeners o cancelar solicitudes asíncronas en la función de limpieza para evitar fugas de memoria.
- Usar `useLayoutEffect` cuando necesites leer información de layout inmediatamente después de la actualización del DOM, pero evaluando el impacto en el rendimiento.

### Ejemplo: Separación por responsabilidades

```javascript
useEffect(() => {
  document.title = `Usuario actual: ${user.name}`;
}, [user.name]); // Gestión de document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // Gestión de conexión a sala de chat
```

## 7. Interview Summary

> Resumen de entrevista

### Repaso rápido

1. `useEffect` controla el momento de ejecución a través del arreglo de dependencias, y la función de limpieza se encarga de la liberación de recursos.
2. Virtual DOM encuentra el conjunto mínimo de actualizaciones mediante el algoritmo Diff, reduciendo el costo de operaciones en el Real DOM.
3. Comprender Render Phase y Commit Phase permite responder con precisión la relación entre efectos secundarios y el flujo de renderizado.
4. En la entrevista se pueden complementar estrategias de mejora de rendimiento, como actualizaciones en lote, carga diferida y memoization.

### Plantilla de respuesta para entrevista

> "React primero crea un Virtual DOM durante el renderizado, calcula las diferencias y luego entra en el Commit Phase para actualizar el Real DOM. `useEffect` se ejecuta después de completar la confirmación y el pintado del navegador, por lo que es adecuado para manejar solicitudes asíncronas o listeners de eventos. Mientras se mantenga un arreglo de dependencias correcto y se recuerde la función de limpieza, se pueden evitar fugas de memoria y problemas de condiciones de carrera."

## Reference

> Referencias

- [Documentación oficial de React: Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [Documentación oficial de React: Rendering](https://react.dev/learn/rendering)
- [Documentación oficial de React: Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
