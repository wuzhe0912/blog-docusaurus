---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Descripcion del problema

Implementar funciones de analisis de rutas de objetos que puedan obtener y establecer valores de objetos anidados basandose en cadenas de ruta.

### Requisitos

1. **Funcion `get`**: Obtener el valor de un objeto segun la ruta

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Funcion `set`**: Establecer el valor de un objeto segun la ruta

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Implementacion de la funcion get

### Metodo 1: Usando split y reduce

**Enfoque**: Dividir la cadena de ruta en un array y luego usar `reduce` para acceder al objeto nivel por nivel.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') return defaultValue;
  const keys = path.split('.');
  const result = keys.reduce((current, key) => {
    if (current == null) return undefined;
    return current[key];
  }, obj);
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: { c: 1, d: [2, 3, { e: 4 }] } }, x: null };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (necesita manejar indices de array)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Metodo 2: Soporte para indices de array

**Enfoque**: Manejar indices de array en la ruta, como `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') return defaultValue;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  const result = keys.reduce((current, key) => {
    if (current == null) return undefined;
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }
    return current[key];
  }, obj);
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: { c: 1, d: [2, 3, { e: 4 }] } } };
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Metodo 3: Implementacion completa (manejo de casos limite)

```javascript
function get(obj, path, defaultValue) {
  if (obj == null) return defaultValue;
  if (typeof path !== 'string' || path === '') return obj;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (result == null) return defaultValue;
    if (key.startsWith('[') && key.endsWith(']')) {
      result = result[parseInt(key.slice(1, -1), 10)];
    } else {
      result = result[key];
    }
  }
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: { c: 1, d: [2, 3, { e: 4 }] } }, x: null, y: undefined };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (ruta vacia devuelve el objeto original)
```

## 3. Implementation: set Function

> Implementacion de la funcion set

### Metodo 1: Implementacion basica

**Enfoque**: Crear la estructura de objetos anidados segun la ruta y luego establecer el valor.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') return obj;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) current[index] = {};
      current = current[index];
    } else {
      if (!current[key] || typeof current[key] !== 'object') current[key] = {};
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      const temp = { ...current }; current = [];
      Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }
set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Metodo 2: Implementacion completa (manejo de arrays y objetos)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') return obj;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  if (keys.length === 0) return obj;
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current)) {
        const temp = current; current = [];
        Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
      }
      if (current[index] == null) {
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }
      current = current[index];
    } else {
      if (current[key] == null) {
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      const temp = current; current = [];
      Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1);
set(obj, 'a.b.d[0]', 2);
set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Metodo 3: Version simplificada (solo objetos, sin indices de array)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') return obj;
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }
```

## 4. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Funcion get basica

Implemente una funcion `get` que obtenga el valor de un objeto anidado segun una cadena de ruta.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') return defaultValue;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Puntos clave**: Manejar null/undefined, dividir la ruta con split, acceder a propiedades nivel por nivel, devolver valor por defecto cuando la ruta no existe.

</details>

### Pregunta 2: Funcion get con soporte para indices de array

Extienda la funcion `get` para soportar indices de array como `'a.b[0].c'`.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') return defaultValue;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    if (key.startsWith('[') && key.endsWith(']')) {
      result = result[parseInt(key.slice(1, -1), 10)];
    } else {
      result = result[key];
    }
  }
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: [2, 3, { c: 4 }] } };
console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Puntos clave**: Usar expresion regular `/[^.[\]]+|\[(\d+)\]/g` para analizar la ruta, manejar indices de array en formato `[0]`, convertir indice de string a numero.

</details>

### Pregunta 3: Funcion set

Implemente una funcion `set` que establezca el valor de un objeto anidado segun una cadena de ruta.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') return obj;
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }
```

**Puntos clave**: Crear estructura anidada nivel por nivel, asegurar que los objetos intermedios existan, establecer el valor objetivo al final.

</details>

### Pregunta 4: Implementacion completa de get y set

Implemente funciones `get` y `set` completas con soporte para indices de array y manejo de casos limite.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') return obj ?? defaultValue;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    if (key.startsWith('[') && key.endsWith(']')) {
      result = result[parseInt(key.slice(1, -1), 10)];
    } else { result = result[key]; }
  }
  return result !== undefined ? result : defaultValue;
}

function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') return obj;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  if (keys.length === 0) return obj;
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]; const nextKey = keys[i + 1];
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current)) { const temp = current; current = []; Object.keys(temp).forEach((k) => { current[k] = temp[k]; }); }
      if (current[index] == null) current[index] = nextKey.startsWith('[') ? [] : {};
      current = current[index];
    } else {
      if (current[key] == null) current[key] = nextKey.startsWith('[') ? [] : {};
      else if (typeof current[key] !== 'object') current[key] = nextKey.startsWith('[') ? [] : {};
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) { const temp = current; current = []; Object.keys(temp).forEach((k) => { current[k] = temp[k]; }); }
    current[index] = value;
  } else { current[lastKey] = value; }
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1); console.log(get(obj, 'a.b.c')); // 1
set(obj, 'a.b.d[0]', 2); console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> Mejores practicas

### Practicas recomendadas

```javascript
// 1. Manejar casos limite
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') return defaultValue;
}

// 2. Usar expresiones regulares para rutas complejas
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. En set, determinar el tipo de la siguiente clave
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Usar nullish coalescing para valores por defecto
return result ?? defaultValue;
```

### Practicas a evitar

```javascript
// 1. ❌ No olvidar manejar null/undefined
// 2. ❌ No modificar directamente el objeto original (a menos que se requiera explicitamente)
// 3. ❌ No ignorar la diferencia entre arrays y objetos
```

## 6. Interview Summary

> Resumen para entrevistas

### Referencia rapida

**Analisis de rutas de objetos**:

- **Funcion get**: Obtener valor segun ruta, manejar null/undefined, soportar valor por defecto
- **Funcion set**: Establecer valor segun ruta, crear estructura anidada automaticamente
- **Analisis de ruta**: Usar expresiones regulares para formatos `'a.b.c'` y `'a.b[0].c'`
- **Manejo de limites**: Manejar null, undefined, cadenas vacias, etc.

**Puntos de implementacion**:

1. Analisis de ruta: `split('.')` o expresion regular
2. Acceso por niveles: Usar bucle o `reduce`
3. Manejo de limites: Verificar null/undefined
4. Soporte de arrays: Manejar indices en formato `[0]`

### Ejemplo de respuesta en entrevista

**Q: Implemente una funcion que obtenga el valor de un objeto segun una ruta.**

> "Implemento una funcion `get` que recibe un objeto, una cadena de ruta y un valor por defecto. Primero manejo los casos limite: si el objeto es null o la ruta no es un string, devuelvo el valor por defecto. Luego divido la ruta en un array de claves con `split('.')` y accedo a las propiedades del objeto nivel por nivel usando un bucle. En cada acceso verifico si el valor actual es null o undefined, y en ese caso devuelvo el valor por defecto. Finalmente, si el resultado es undefined devuelvo el valor por defecto, de lo contrario el resultado. Para soportar indices de array, puedo usar la expresion regular `/[^.[\]]+|\[(\d+)\]/g` para analizar la ruta."

**Q: Como implementar una funcion que establezca el valor de un objeto segun una ruta?**

> "Implemento una funcion `set` que recibe un objeto, una cadena de ruta y un valor. Primero analizo la ruta en un array de claves, luego recorro hasta la penultima clave, creando la estructura de objetos anidados nivel por nivel. Para cada clave intermedia que no existe o no es un objeto, creo un nuevo objeto. Si la siguiente clave tiene formato de indice de array, creo un array. Finalmente establezco el valor de la ultima clave."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
