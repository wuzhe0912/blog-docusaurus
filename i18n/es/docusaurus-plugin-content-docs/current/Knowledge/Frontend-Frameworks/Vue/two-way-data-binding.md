---
id: vue-two-way-data-binding
title: '[Hard] Enlace bidireccional de datos'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Explica el principio subyacente de cómo Vue2 y Vue3 implementan el enlace bidireccional.

Para entender el enlace bidireccional de Vue, primero hay que comprender el mecanismo del sistema reactivo y las diferencias de implementación entre Vue2 y Vue3.

### Implementación de Vue2

Vue2 usa `Object.defineProperty` para implementar el enlace bidireccional. Este método puede envolver las propiedades de un objeto como `getter` y `setter`, permitiendo monitorear los cambios en las propiedades. El flujo es el siguiente:

#### 1. Data Hijacking (Secuestro de datos)

En Vue2, cuando se crea el objeto de datos de un componente, Vue recorre todas las propiedades del objeto y usa `Object.defineProperty` para convertirlas en `getter` y `setter`, lo que permite a Vue rastrear la lectura y modificación de los datos.

#### 2. Dependency Collection (Recolección de dependencias)

Cada vez que se ejecuta la función de renderizado del componente, se leen las propiedades de data, lo que activa el `getter`. Vue registra estas dependencias para poder notificar a los componentes que dependen de esos datos cuando cambien.

#### 3. Dispatching Updates (Despacho de actualizaciones)

Cuando se modifican los datos, se activa el `setter`, y Vue notifica a todos los componentes que dependen de esos datos para re-ejecutar la función de renderizado y actualizar el DOM.

#### Ejemplo de código Vue2

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // Activa getter, imprime "get name: Pitt"
data.name = 'Vue2 Reactivity'; // Activa setter, imprime "set name: Vue2 Reactivity"
```

#### Limitaciones de Vue2

El uso de `Object.defineProperty` tiene algunas limitaciones:

- **No puede detectar la adición o eliminación de propiedades**: Se debe usar `Vue.set()` o `Vue.delete()`
- **No puede detectar cambios en índices de arreglos**: Se deben usar los métodos de arreglo proporcionados por Vue (como `push`, `pop`, etc.)
- **Problemas de rendimiento**: Necesita recorrer recursivamente todas las propiedades para definir getter y setter por adelantado

### Implementación de Vue3

Vue3 introdujo `Proxy` de ES6, que puede envolver un objeto como un proxy y monitorear los cambios en sus propiedades, con un rendimiento más optimizado. El flujo es el siguiente:

#### 1. Secuestro de datos usando Proxy

En Vue3 se usa `new Proxy` para crear un proxy de los datos, en lugar de definir `getter` y `setter` propiedad por propiedad. Esto permite rastrear cambios de datos a un nivel más granular e interceptar más tipos de operaciones, como la adición o eliminación de propiedades.

#### 2. Rastreo de dependencias más eficiente

Con Proxy, Vue3 puede rastrear dependencias de manera más eficiente, ya que no necesita definir `getter/setter` por adelantado, y la capacidad de intercepción de Proxy es más potente, pudiendo interceptar hasta 13 tipos de operaciones (`get`, `set`, `has`, `deleteProperty`, etc.).

#### 3. Re-renderizado mínimo automático

Cuando los datos cambian, Vue3 puede determinar con más precisión qué parte de la UI necesita actualizarse, reduciendo re-renderizados innecesarios y mejorando el rendimiento.

#### Ejemplo de código Vue3

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`Obtener ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`Establecer ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // Lee datos, activa get del Proxy, imprime "Obtener name: Vue 3"
data.name = 'Vue 3 Reactivity'; // Modifica datos, activa set del Proxy, imprime "Establecer name: Vue 3 Reactivity"
console.log(data.name); // Imprime "Obtener name: Vue 3 Reactivity"
```

### Tabla comparativa Vue2 vs Vue3

| Característica | Vue2 | Vue3 |
| --- | --- | --- |
| Implementación | `Object.defineProperty` | `Proxy` |
| Detectar nuevas propiedades | ❌ Necesita `Vue.set()` | ✅ Soporte nativo |
| Detectar eliminación de propiedades | ❌ Necesita `Vue.delete()` | ✅ Soporte nativo |
| Detectar índices de arreglos | ❌ Necesita métodos específicos | ✅ Soporte nativo |
| Rendimiento | Recorre recursivamente todas las propiedades | Procesamiento diferido, mejor rendimiento |
| Soporte de navegadores | IE9+ | No soporta IE11 |

### Conclusión

Vue2 usa `Object.defineProperty` para implementar el enlace bidireccional, pero este método tiene ciertas limitaciones (como no poder detectar la adición o eliminación de propiedades de objetos). Vue3 introdujo `Proxy` de ES6, proporcionando un sistema reactivo más potente y flexible, mejorando también el rendimiento. Esta es una de las mejoras más significativas de Vue3 respecto a Vue2.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> ¿Por qué Vue3 usa `Proxy` en lugar de `Object.defineProperty`?

### Razones principales

#### 1. Capacidad de intercepción más potente

`Proxy` puede interceptar hasta 13 tipos de operaciones, mientras que `Object.defineProperty` solo puede interceptar la lectura y escritura de propiedades:

```js
// Operaciones que Proxy puede interceptar
const handler = {
  get() {},              // Lectura de propiedad
  set() {},              // Escritura de propiedad
  has() {},              // Operador in
  deleteProperty() {},   // Operador delete
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // Llamada a función
  construct() {}         // Operador new
};
```

#### 2. Soporte nativo para monitoreo de índices de arreglos

```js
// Vue2 no puede detectar
const arr = [1, 2, 3];
arr[0] = 10; // ❌ No activa actualización

// Vue3 puede detectar
const arr = reactive([1, 2, 3]);
arr[0] = 10; // ✅ Puede activar actualización
```

#### 3. Soporte nativo para adición/eliminación dinámica de propiedades

```js
// Vue2 necesita procesamiento especial
Vue.set(obj, 'newKey', 'value'); // ✅
obj.newKey = 'value'; // ❌ No activa actualización

// Vue3 soporte nativo
const obj = reactive({});
obj.newKey = 'value'; // ✅ Puede activar actualización
delete obj.newKey; // ✅ También puede activar actualización
```

#### 4. Mejor rendimiento

```js
// Vue2: Necesita recorrer recursivamente todas las propiedades
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: Procesamiento diferido, solo crea el proxy al acceder
function reactive(obj) {
  return new Proxy(obj, handler); // No necesita recursión
}
```

#### 5. Código más conciso

La cantidad de código de la implementación reactiva de Vue3 se redujo significativamente, con menores costos de mantenimiento.

### ¿Por qué Vue2 no usó Proxy?

La razón principal es la **compatibilidad de navegadores**:

- Cuando se lanzó Vue2 (2016), Proxy aún no tenía soporte amplio
- Vue2 necesitaba soportar IE9+, y Proxy no se puede hacer polyfill
- Vue3 abandonó el soporte para IE11, por lo que pudo adoptar Proxy

### Comparación de ejemplos prácticos

```js
// ===== Limitaciones de Vue2 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// ❌ Las siguientes operaciones no activan actualización
vm.obj.b = 2;           // Agregar propiedad
delete vm.obj.a;        // Eliminar propiedad
vm.arr[0] = 10;         // Modificar índice de arreglo
vm.arr.length = 0;      // Modificar longitud de arreglo

// ✅ Se necesitan métodos especiales
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Soporte nativo de Vue3 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// ✅ Todas las siguientes operaciones activan actualización
state.obj.b = 2;        // Agregar propiedad
delete state.obj.a;     // Eliminar propiedad
state.arr[0] = 10;      // Modificar índice de arreglo
state.arr.length = 0;   // Modificar longitud de arreglo
```

### Resumen

Vue3 usa `Proxy` para:

1. ✅ Proporcionar soporte reactivo más completo (adición/eliminación de propiedades, índices de arreglos, etc.)
2. ✅ Mejorar el rendimiento (procesamiento diferido, sin necesidad de recursión previa)
3. ✅ Simplificar el código (implementación más concisa)
4. ✅ Proporcionar mejor experiencia de desarrollo (no necesita recordar APIs especiales)

El único costo es abandonar el soporte para navegadores antiguos (IE11), pero es un compromiso que vale la pena.

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
