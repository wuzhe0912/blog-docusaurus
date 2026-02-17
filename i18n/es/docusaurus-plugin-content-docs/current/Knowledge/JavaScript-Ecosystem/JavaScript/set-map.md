---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> ¿Qué son Set y Map?

`Set` y `Map` son dos nuevas estructuras de datos introducidas en ES6 que proporcionan soluciones más adecuadas para escenarios específicos que los objetos y arrays tradicionales.

### Set (Conjunto)

**Definición**: `Set` es una colección de **valores únicos**, similar al concepto de conjunto en matemáticas.

**Características**:

- Los valores almacenados **no se repiten**
- Usa `===` para determinar la igualdad de valores
- Mantiene el orden de inserción
- Puede almacenar cualquier tipo de valor (primitivos u objetos)

**Uso básico**:

```javascript
// Crear un Set
const set = new Set();

// Agregar valores
set.add(1);
set.add(2);
set.add(2); // Los valores duplicados no se agregan
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// Verificar si un valor existe
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// Eliminar un valor
set.delete(2);
console.log(set.has(2)); // false

// Vaciar el Set
set.clear();
console.log(set.size); // 0
```

**Crear Set desde un array**:

```javascript
// Eliminar valores duplicados de un array
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// Convertir de vuelta a array
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// Forma abreviada
const uniqueArr2 = [...new Set(arr)];
```

### Map (Mapa)

**Definición**: `Map` es una colección de **pares clave-valor**, similar a un objeto, pero las claves pueden ser de cualquier tipo.

**Características**:

- Las claves pueden ser de cualquier tipo (cadenas, números, objetos, funciones, etc.)
- Mantiene el orden de inserción
- Tiene la propiedad `size`
- El orden de iteración coincide con el orden de inserción

**Uso básico**:

```javascript
// Crear un Map
const map = new Map();

// Agregar pares clave-valor
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// Obtener valores
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// Verificar si una clave existe
console.log(map.has('name')); // true

// Eliminar un par clave-valor
map.delete('name');

// Obtener el tamaño
console.log(map.size); // 3

// Vaciar el Map
map.clear();
```

**Crear Map desde un array**:

```javascript
// Crear desde un array bidimensional
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// Crear desde un objeto
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Diferencias entre Set y Array

| Característica   | Set                    | Array                    |
| ---------------- | ---------------------- | ------------------------ |
| Valores duplicados | No permite           | Permite                  |
| Acceso por índice | No soporta           | Soporta                  |
| Rendimiento búsqueda | O(1)              | O(n)                     |
| Orden de inserción | Mantiene             | Mantiene                 |
| Métodos comunes  | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Escenarios de uso**:

```javascript
// ✅ Adecuado para Set: se necesitan valores únicos
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Adecuado para Set: verificación rápida de existencia
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Ya se visitó la página de inicio');
}

// ✅ Adecuado para Array: se necesitan índices o valores duplicados
const scores = [100, 95, 100, 90]; // Permite duplicados
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Diferencias entre Map y Object

| Característica   | Map                | Object                     |
| ---------------- | ------------------ | -------------------------- |
| Tipo de clave    | Cualquier tipo     | Cadena o Symbol            |
| Tamaño           | Propiedad `size`   | Cálculo manual necesario   |
| Claves por defecto | Ninguna          | Tiene cadena de prototipos |
| Orden de iteración | Orden de inserción | ES2015+ mantiene orden de inserción |
| Rendimiento      | Más rápido en adiciones/eliminaciones frecuentes | Más rápido en casos generales |
| JSON             | No soporta directamente | Soporte nativo          |

**Escenarios de uso**:

```javascript
// ✅ Adecuado para Map: las claves no son cadenas
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Adecuado para Map: adiciones/eliminaciones frecuentes
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Adecuado para Object: estructura estática, se necesita JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // Se puede serializar directamente
```

## 4. Common Interview Questions

> Preguntas comunes de entrevista

### Pregunta 1: Eliminar valores duplicados de un array

Implementa una función que elimine los valores duplicados de un array.

```javascript
function removeDuplicates(arr) {
  // Tu implementación
}
```

<details>
<summary>Haz clic para ver la respuesta</summary>

**Método 1: Usando Set (recomendado)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Método 2: Usando filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Método 3: Usando reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Comparación de rendimiento**:

- Método Set: O(n), el más rápido
- filter + indexOf: O(n²), más lento
- reduce + includes: O(n²), más lento

</details>

### Pregunta 2: Verificar si un array tiene valores duplicados

Implementa una función que verifique si un array tiene valores duplicados.

```javascript
function hasDuplicates(arr) {
  // Tu implementación
}
```

<details>
<summary>Haz clic para ver la respuesta</summary>

**Método 1: Usando Set (recomendado)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Método 2: Usando el método has de Set**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Método 3: Usando indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Comparación de rendimiento**:

- Método Set 1: O(n), el más rápido
- Método Set 2: O(n), puede terminar antes en promedio
- Método indexOf: O(n²), más lento

</details>

### Pregunta 3: Contar la frecuencia de elementos

Implementa una función que cuente cuántas veces aparece cada elemento en un array.

```javascript
function countOccurrences(arr) {
  // Tu implementación
}
```

<details>
<summary>Haz clic para ver la respuesta</summary>

**Método 1: Usando Map (recomendado)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Método 2: Usando reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Método 3: Convertir a objeto**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Ventajas de usar Map**:

- Las claves pueden ser de cualquier tipo (objetos, funciones, etc.)
- Tiene la propiedad `size`
- El orden de iteración coincide con el orden de inserción

</details>

### Pregunta 4: Encontrar la intersección de dos arrays

Implementa una función que encuentre la intersección (elementos comunes) de dos arrays.

```javascript
function intersection(arr1, arr2) {
  // Tu implementación
}
```

<details>
<summary>Haz clic para ver la respuesta</summary>

**Método 1: Usando Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Método 2: Usando filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Método 3: Usando filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Comparación de rendimiento**:

- Método Set: O(n + m), el más rápido
- filter + includes: O(n × m), más lento

</details>

### Pregunta 5: Encontrar la diferencia de dos arrays

Implementa una función que encuentre la diferencia de dos arrays (elementos en arr1 que no están en arr2).

```javascript
function difference(arr1, arr2) {
  // Tu implementación
}
```

<details>
<summary>Haz clic para ver la respuesta</summary>

**Método 1: Usando Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Método 2: Usando Set para deduplicar y luego filtrar**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Método 3: Usando includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Comparación de rendimiento**:

- Método Set: O(n + m), el más rápido
- Método includes: O(n × m), más lento

</details>

### Pregunta 6: Implementar LRU Cache

Usa Map para implementar un caché LRU (Least Recently Used).

```javascript
class LRUCache {
  constructor(capacity) {
    // Tu implementación
  }

  get(key) {
    // Tu implementación
  }

  put(key, value) {
    // Tu implementación
  }
}
```

<details>
<summary>Haz clic para ver la respuesta</summary>

**Implementación**:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // Mover la clave al final (indica uso reciente)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // Si la clave ya existe, eliminarla primero
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Si la capacidad está llena, eliminar la clave más antigua (la primera)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Agregar par clave-valor (se coloca automáticamente al final)
    this.cache.set(key, value);
  }
}

// Ejemplo de uso
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // Elimina la clave 2
console.log(cache.get(2)); // -1 (ya fue eliminada)
console.log(cache.get(3)); // 'three'
```

**Explicación**:

- Map mantiene el orden de inserción, la primera clave es la más antigua
- Al hacer `get`, la clave se mueve al final para indicar uso reciente
- Al hacer `put`, si la capacidad está llena, se elimina la primera clave

</details>

### Pregunta 7: Usar objetos como claves de Map

Explica el resultado de salida del siguiente código.

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Explicación**:

- `obj1` y `obj2` tienen el mismo contenido, pero son **instancias de objetos diferentes**
- Map usa **comparación por referencia** (reference comparison), no comparación por valor
- Por lo tanto, `obj1` y `obj2` se tratan como claves diferentes
- Si se usa un objeto normal como Map, el objeto se convierte a la cadena `[object Object]`, haciendo que todos los objetos se conviertan en la misma clave

**Comparación con objetos normales**:

```javascript
// Objeto normal: las claves se convierten a cadena
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (sobrescrito)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]'] (solo una clave)

// Map: mantiene la referencia del objeto
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet y WeakMap

> Diferencias entre WeakSet y WeakMap

### WeakSet

**Características**:

- Solo puede almacenar **objetos** (no puede almacenar tipos primitivos)
- **Referencia débil**: si el objeto no tiene otras referencias, será recolectado por el garbage collector
- No tiene la propiedad `size`
- No es iterable
- No tiene el método `clear`

**Escenario de uso**: Marcar objetos, evitar fugas de memoria

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// Cuando obj1 no tiene otras referencias, será recolectado
// La referencia en weakSet también se limpiará automáticamente
```

### WeakMap

**Características**:

- Las claves solo pueden ser **objetos** (no pueden ser tipos primitivos)
- **Referencia débil**: si el objeto clave no tiene otras referencias, será recolectado por el garbage collector
- No tiene la propiedad `size`
- No es iterable
- No tiene el método `clear`

**Escenario de uso**: Almacenar datos privados de objetos, evitar fugas de memoria

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// Cuando obj1 no tiene otras referencias, será recolectado
// El par clave-valor en weakMap también se limpiará automáticamente
```

### Comparación WeakSet/WeakMap vs Set/Map

| Característica       | Set/Map            | WeakSet/WeakMap      |
| -------------------- | ------------------ | -------------------- |
| Tipo de clave/valor  | Cualquier tipo     | Solo objetos         |
| Referencia débil     | No                 | Sí                   |
| Iterable             | Sí                 | No                   |
| Propiedad size       | Sí                 | No                   |
| Método clear         | Sí                 | No                   |
| Garbage collection   | No limpia automáticamente | Limpia automáticamente |

## 6. Best Practices

> Mejores prácticas

### Prácticas recomendadas

```javascript
// 1. Usar Set cuando se necesitan valores únicos
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Usar Set cuando se necesita búsqueda rápida
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // Permitir acceso
}

// 3. Usar Map cuando las claves no son cadenas
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Usar Map cuando se necesitan adiciones/eliminaciones frecuentes
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Usar WeakMap para asociar datos de objetos y evitar fugas de memoria
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Prácticas a evitar

```javascript
// 1. No usar Set para reemplazar todas las funciones de arrays
// ❌ Malo: usar Set cuando se necesitan índices
const set = new Set([1, 2, 3]);
// set[0] // undefined, no se puede acceder por índice

// ✅ Bueno: usar array cuando se necesitan índices
const arr = [1, 2, 3];
arr[0]; // 1

// 2. No usar Map para reemplazar todas las funciones de objetos
// ❌ Malo: usar Map para estructuras estáticas simples
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ Bueno: usar objeto para estructuras simples
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. No confundir Set y Map
// ❌ Error: Set no tiene pares clave-valor
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ Correcto: Map tiene pares clave-valor
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> Resumen de entrevista

### Memoria rápida

**Set (Conjunto)**:

- Valores únicos, sin duplicados
- Búsqueda rápida: O(1)
- Adecuado para: deduplicación, verificación rápida de existencia

**Map (Mapa)**:

- Pares clave-valor, las claves pueden ser de cualquier tipo
- Mantiene el orden de inserción
- Adecuado para: claves no string, adiciones/eliminaciones frecuentes

**WeakSet/WeakMap**:

- Referencia débil, garbage collection automático
- Claves/valores solo pueden ser objetos
- Adecuado para: evitar fugas de memoria

### Ejemplo de respuesta en entrevista

**Q: ¿Cuándo se debe usar Set en lugar de un array?**

> "Se debe usar Set cuando se necesita garantizar la unicidad de los valores o verificar rápidamente si un valor existe. El método `has` de Set tiene una complejidad temporal O(1), mientras que `includes` de un array es O(n). Por ejemplo, al eliminar valores duplicados de un array o verificar permisos de usuario, Set es más eficiente."

**Q: ¿Cuál es la diferencia entre Map y Object?**

> "Las claves de Map pueden ser de cualquier tipo, incluyendo objetos, funciones, etc., mientras que las claves de un objeto solo pueden ser cadenas o Symbol. Map tiene la propiedad `size` para obtener directamente el tamaño, mientras que un objeto requiere cálculo manual. Map mantiene el orden de inserción y no tiene cadena de prototipos, lo que lo hace adecuado para almacenar datos puros. Cuando se necesita usar objetos como claves o se requieren adiciones/eliminaciones frecuentes, Map es la mejor opción."

**Q: ¿Cuál es la diferencia entre WeakMap y Map?**

> "Las claves de WeakMap solo pueden ser objetos y usa referencias débiles. Cuando el objeto clave no tiene otras referencias, la entrada correspondiente en WeakMap será automáticamente recolectada, lo que evita fugas de memoria. WeakMap no es iterable y no tiene la propiedad `size`. Es adecuado para almacenar datos privados o metadatos de objetos; cuando el objeto se destruye, los datos relacionados también se limpian automáticamente."

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
