---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Descripción del problema

Implementar funciones de análisis de rutas de objetos que puedan obtener y establecer valores de objetos anidados basándose en cadenas de ruta.

### Requisitos

1. **Función `get`**: Obtener el valor de un objeto según la ruta

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Función `set`**: Establecer el valor de un objeto según la ruta

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Implementación de la función get

### Método 1: Usando split y reduce

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
console.log(get(obj, 'a.b.d[2].e')); // undefined (necesita manejar índices de array)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Método 2: Soporte para índices de array

**Enfoque**: Manejar índices de array en la ruta, como `'a.b[0].c'`.

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

### Método 3: Implementación completa (manejo de casos límite)

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
console.log(get(obj, '', obj)); // obj (ruta vacía devuelve el objeto original)
```

## 3. Implementation: set Function

> Implementación de la función set

### Método 1: Implementación básica

**Enfoque**: Crear la estructura de objetos anidados según la ruta y luego establecer el valor.

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

### Método 2: Implementación completa (manejo de arrays y objetos)

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

### Método 3: Versión simplificada (solo objetos, sin índices de array)

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

### Pregunta 1: Función get básica

Implemente una función `get` que obtenga el valor de un objeto anidado según una cadena de ruta.

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

### Pregunta 2: Función get con soporte para índices de array

Extienda la función `get` para soportar índices de array como `'a.b[0].c'`.

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

**Puntos clave**: Usar expresión regular `/[^.[\]]+|\[(\d+)\]/g` para analizar la ruta, manejar índices de array en formato `[0]`, convertir índice de string a número.

</details>

### Pregunta 3: Función set

Implemente una función `set` que establezca el valor de un objeto anidado según una cadena de ruta.

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

### Pregunta 4: Implementación completa de get y set

Implemente funciones `get` y `set` completas con soporte para índices de array y manejo de casos límite.

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

> Mejores prácticas

### Prácticas recomendadas

```javascript
// 1. Manejar casos límite
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

### Prácticas a evitar

```javascript
// 1. ❌ No olvidar manejar null/undefined
// 2. ❌ No modificar directamente el objeto original (a menos que se requiera explicitamente)
// 3. ❌ No ignorar la diferencia entre arrays y objetos
```

## 6. Interview Summary

> Resumen para entrevistas

### Referencia rápida

**Analisis de rutas de objetos**:

- **Función get**: Obtener valor según ruta, manejar null/undefined, soportar valor por defecto
- **Función set**: Establecer valor según ruta, crear estructura anidada automáticamente
- **Analisis de ruta**: Usar expresiones regulares para formatos `'a.b.c'` y `'a.b[0].c'`
- **Manejo de limites**: Manejar null, undefined, cadenas vacias, etc.

**Puntos de implementación**:

1. Analisis de ruta: `split('.')` o expresión regular
2. Acceso por niveles: Usar bucle o `reduce`
3. Manejo de limites: Verificar null/undefined
4. Soporte de arrays: Manejar índices en formato `[0]`

### Ejemplo de respuesta en entrevista

**Q: Implemente una función que obtenga el valor de un objeto según una ruta.**

> "Implemento una función `get` que recibe un objeto, una cadena de ruta y un valor por defecto. Primero manejo los casos límite: si el objeto es null o la ruta no es un string, devuelvo el valor por defecto. Luego divido la ruta en un array de claves con `split('.')` y accedo a las propiedades del objeto nivel por nivel usando un bucle. En cada acceso verifico si el valor actual es null o undefined, y en ese caso devuelvo el valor por defecto. Finalmente, si el resultado es undefined devuelvo el valor por defecto, de lo contrario el resultado. Para soportar índices de array, puedo usar la expresión regular `/[^.[\]]+|\[(\d+)\]/g` para analizar la ruta."

**Q: Cómo implementar una función que establezca el valor de un objeto según una ruta?**

> "Implemento una función `set` que recibe un objeto, una cadena de ruta y un valor. Primero analizo la ruta en un array de claves, luego recorro hasta la penúltima clave, creando la estructura de objetos anidados nivel por nivel. Para cada clave intermedia que no existe o no es un objeto, creo un nuevo objeto. Si la siguiente clave tiene formato de índice de array, creo un array. Finalmente establezco el valor de la última clave."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
