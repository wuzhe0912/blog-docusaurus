---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Que es Deep Clone?

**Deep Clone (Copia profunda)** se refiere a crear un nuevo objeto y copiar recursivamente todas las propiedades del objeto original y todos sus objetos y arrays anidados. El objeto resultante del Deep Clone es completamente independiente del original: modificar uno no afecta al otro.

### Copia superficial vs Copia profunda

**Shallow Clone (Copia superficial)**: Solo copia las propiedades del primer nivel del objeto; los objetos anidados siguen compartiendo la misma referencia.

```javascript
// Ejemplo de copia superficial
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ El objeto original tambien fue modificado
```

**Deep Clone (Copia profunda)**: Copia recursivamente todas las capas de propiedades, completamente independiente.

```javascript
// Ejemplo de copia profunda
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ El objeto original no se ve afectado
```

## 2. Implementation Methods

> Metodos de implementacion

### Metodo 1: Usando JSON.parse y JSON.stringify

**Ventajas**: Simple y rapido
**Desventajas**: No puede manejar funciones, undefined, Symbol, Date, RegExp, Map, Set y otros tipos especiales

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Prueba
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Limitaciones**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date se convierte en objeto vacio
console.log(cloned.func); // undefined ❌ La funcion se pierde
console.log(cloned.undefined); // undefined ✅ Pero JSON.stringify lo elimina
console.log(cloned.symbol); // undefined ❌ Symbol se pierde
console.log(cloned.regex); // {} ❌ RegExp se convierte en objeto vacio
```

### Metodo 2: Implementacion recursiva (manejo de tipos basicos y objetos)

```javascript
function deepClone(obj) {
  // Manejo de null y tipos basicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Manejo de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Manejo de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Manejo de arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Manejo de objetos
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Prueba
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ No se ve afectado
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Metodo 3: Implementacion completa (manejo de Map, Set, Symbol, etc.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Manejo de null y tipos basicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Manejo de referencias circulares
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Manejo de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Manejo de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Manejo de Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Manejo de Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Manejo de arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Manejo de objetos
  const cloned = {};
  map.set(obj, cloned);

  // Manejo de propiedades Symbol
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copiar propiedades normales
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copiar propiedades Symbol
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Prueba
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Metodo 4: Manejo de referencias circulares

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Manejo de null y tipos basicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Manejo de referencias circulares
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Manejo de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Manejo de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Manejo de arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Manejo de objetos
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Prueba de referencias circulares
const original = {
  name: 'John',
};
original.self = original; // Referencia circular

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Referencia circular manejada correctamente
console.log(cloned !== original); // true ✅ Son objetos diferentes
```

## 3. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Implementacion basica de Deep Clone

Implemente una funcion `deepClone` que pueda copiar profundamente objetos y arrays.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function deepClone(obj) {
  // Manejo de null y tipos basicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Manejo de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Manejo de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Manejo de arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Manejo de objetos
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Prueba
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Pregunta 2: Manejo de referencias circulares

Implemente una funcion `deepClone` que pueda manejar referencias circulares.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Manejo de null y tipos basicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Manejo de referencias circulares
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Manejo de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Manejo de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Manejo de arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Manejo de objetos
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Prueba de referencias circulares
const original = {
  name: 'John',
};
original.self = original; // Referencia circular

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Puntos clave**:

- Usar `WeakMap` para rastrear los objetos ya procesados
- Antes de crear un nuevo objeto, verificar si ya existe en el map
- Si existe, devolver directamente la referencia del map para evitar recursion infinita

</details>

### Pregunta 3: Limitaciones de JSON.parse y JSON.stringify

Explique las limitaciones de usar `JSON.parse(JSON.stringify())` para Deep Clone y proporcione soluciones.

<details>
<summary>Haga clic para ver la respuesta</summary>

**Limitaciones**:

1. **No puede manejar funciones**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **No puede manejar undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (pero la propiedad se elimina) ❌
   ```

3. **No puede manejar Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ La propiedad Symbol se pierde
   ```

4. **Date se convierte en string**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Se convierte en string
   ```

5. **RegExp se convierte en objeto vacio**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Se convierte en objeto vacio
   ```

6. **No puede manejar Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Se convierte en objeto vacio
   ```

7. **No puede manejar referencias circulares**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Error: Converting circular structure to JSON
   ```

**Solucion**: Usar una implementacion recursiva con tratamiento especial para diferentes tipos.

</details>

## 4. Best Practices

> Mejores practicas

### Practicas recomendadas

```javascript
// 1. Elegir el metodo adecuado segun los requisitos
// Si solo se necesita manejar objetos basicos y arrays, usar una implementacion recursiva simple
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. Si se necesita manejar tipos complejos, usar la implementacion completa
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Implementacion completa
}

// 3. Usar WeakMap para manejar referencias circulares
// WeakMap no impide la recoleccion de basura, adecuado para rastrear referencias de objetos
```

### Practicas a evitar

```javascript
// 1. No abusar de JSON.parse(JSON.stringify())
// ❌ Se pierden funciones, Symbol, Date y otros tipos especiales
const cloned = JSON.parse(JSON.stringify(obj));

// 2. No olvidar manejar referencias circulares
// ❌ Causa desbordamiento de pila
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Recursion infinita
  }
  return cloned;
}

// 3. No olvidar manejar Date, RegExp y otros tipos especiales
// ❌ Estos tipos requieren tratamiento especial
```

## 5. Interview Summary

> Resumen para entrevistas

### Referencia rapida

**Deep Clone**:

- **Definicion**: Copiar recursivamente un objeto y todas sus propiedades anidadas, completamente independiente
- **Metodos**: Implementacion recursiva, JSON.parse(JSON.stringify()), structuredClone()
- **Puntos clave**: Manejo de tipos especiales, referencias circulares, propiedades Symbol

**Puntos de implementacion**:

1. Manejar tipos basicos y null
2. Manejar Date, RegExp y otros objetos especiales
3. Manejar arrays y objetos
4. Manejar referencias circulares (usando WeakMap)
5. Manejar propiedades Symbol

### Ejemplo de respuesta en entrevista

**Q: Por favor implemente una funcion Deep Clone.**

> "Deep Clone significa crear un nuevo objeto completamente independiente, copiando recursivamente todas las propiedades anidadas. Mi implementacion primero maneja los tipos basicos y null, luego realiza un tratamiento especial para diferentes tipos como Date, RegExp, arrays y objetos. Para manejar referencias circulares, uso un WeakMap para rastrear los objetos ya procesados. Para las propiedades Symbol, uso Object.getOwnPropertySymbols para obtenerlas y copiarlas. Esto asegura que el objeto copiado profundamente sea completamente independiente del objeto original, y que modificar uno no afecte al otro."

**Q: Cuales son las limitaciones de JSON.parse(JSON.stringify())?**

> "Las principales limitaciones de este metodo incluyen: 1) No puede manejar funciones, que se eliminan; 2) No puede manejar undefined y Symbol, estas propiedades se ignoran; 3) Los objetos Date se convierten en strings; 4) RegExp se convierte en objeto vacio; 5) No puede manejar Map, Set y otras estructuras de datos especiales; 6) No puede manejar referencias circulares, lo que causa un error. Si se necesita manejar estos casos especiales, se debe usar una implementacion recursiva."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/es/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
