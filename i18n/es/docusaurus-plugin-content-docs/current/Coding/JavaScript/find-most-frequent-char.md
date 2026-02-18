---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Descripción del problema

Implementar una función que reciba una cadena de texto y devuelva el carácter que aparece con mayor frecuencia.

### Ejemplos

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Métodos de implementación

### Método 1: Conteo con objeto (versión básica)

**Enfoque**: Recorrer la cadena, usar un objeto para registrar la cantidad de apariciones de cada carácter y luego encontrar el que aparece más veces.

```javascript
function findMostFrequentChar(str) {
  // Inicializar objeto para almacenar caracteres y conteos
  const charCount = {};

  // Inicializar variables para el conteo máximo y el carácter
  let maxCount = 0;
  let maxChar = '';

  // Recorrer la cadena
  for (let char of str) {
    // Si el carácter no esta en el objeto, establecer conteo en 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Incrementar el conteo de este carácter
    charCount[char]++;

    // Si el conteo de este carácter es mayor que el conteo máximo
    // Actualizar conteo máximo y carácter máximo
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Devolver el carácter máximo
  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Complejidad temporal**: O(n), donde n es la longitud de la cadena
**Complejidad espacial**: O(k), donde k es la cantidad de caracteres diferentes

### Método 2: Contar primero y luego encontrar el máximo (dos fases)

**Enfoque**: Primero recorrer una vez para calcular las apariciones de todos los caracteres, luego recorrer otra vez para encontrar el máximo.

```javascript
function findMostFrequentChar(str) {
  // Fase 1: Calcular las apariciones de cada carácter
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Fase 2: Encontrar el carácter con más apariciones
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Ventajas**: Logica más clara, procesamiento por fases
**Desventajas**: Requiere dos recorridos

### Método 3: Usando Map (ES6)

**Enfoque**: Usar Map para almacenar la relacion entre caracteres y conteos.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Ventajas**: Usar Map es más acorde con el estilo moderno de JavaScript
**Desventajas**: Para escenarios simples, un objeto puede ser más intuitivo

### Método 4: Usando reduce (estilo funcional)

**Enfoque**: Usar `reduce` y `Object.entries` para implementar.

```javascript
function findMostFrequentChar(str) {
  // Calcular las apariciones de cada carácter
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Encontrar el carácter con más apariciones
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Prueba
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Ventajas**: Estilo funcional, código conciso
**Desventajas**: Menor legibilidad, rendimiento ligeramente inferior

### Método 5: Manejo de múltiples valores maximos iguales

**Enfoque**: Si varios caracteres tienen la misma frecuencia maxima, devolver un array o el primero encontrado.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Calcular las apariciones de cada carácter
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Encontrar todos los caracteres con frecuencia igual al máximo
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Devolver el primero encontrado (o devolver todo el array)
  return mostFrequentChars[0];
  // O devolver todos: return mostFrequentChars;
}

// Prueba
console.log(findMostFrequentChar('aabbcc')); // 'a' (el primero encontrado)
```

## 3. Edge Cases

> Manejo de casos limite

### Cadena vacia

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // O throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Mayusculas y minusculas

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('Hello', false)); // 'l' (sin distinguir mayusculas/minusculas)
console.log(findMostFrequentChar('Hello', true)); // 'l' (distinguiendo mayusculas/minusculas)
```

### Espacios y caracteres especiales

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('hello world', true)); // 'l' (ignorando espacios)
console.log(findMostFrequentChar('hello world', false)); // ' ' (espacio)
```

## 4. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Implementación básica

Implemente una función que encuentre el carácter más frecuente en una cadena.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Puntos clave**:

- Usar un objeto o Map para registrar la frecuencia de cada carácter
- Actualizar el máximo durante el recorrido
- Complejidad temporal O(n), complejidad espacial O(k)

</details>

### Pregunta 2: Versión optimizada

Optimice la función anterior para manejar múltiples valores maximos iguales.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Fase 1: Calcular las apariciones de cada carácter
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Fase 2: Encontrar todos los caracteres con frecuencia maxima
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Devolver el primero o todos según necesidad
  return mostFrequentChars[0]; // O devolver mostFrequentChars
}

// Prueba
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Pregunta 3: Implementación con Map

Implemente esta función usando Map de ES6.

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Prueba
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Más adecuado para pares clave-valor dinámicos, las claves pueden ser de cualquier tipo
- **Object**: Más simple e intuitivo, adecuado para claves de tipo string

</details>

## 5. Best Practices

> Mejores prácticas

### Prácticas recomendadas

```javascript
// 1. Usar nombres de variables claros
function findMostFrequentChar(str) {
  const charCount = {}; // Expresar claramente el propósito
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Manejar casos limite
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Actualizar el máximo durante el recorrido (un solo recorrido)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Prácticas a evitar

```javascript
// 1. No usar dos recorridos (a menos que sea necesario)
// ❌ Rendimiento inferior
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Segundo recorrido
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. No olvidar manejar cadenas vacias
// ❌ Podría devolver undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Con cadena vacia maxChar es ''
}

// 3. No usar estilos funcionales demasiado complejos (a menos que sea convencion del equipo)
// ❌ Menor legibilidad
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Resumen para entrevistas

### Referencia rápida

**Puntos de implementación**:

1. Usar un objeto o Map para registrar la frecuencia de cada carácter
2. Actualizar el máximo durante el recorrido
3. Complejidad temporal O(n), complejidad espacial O(k)
4. Manejar casos limite (cadena vacia, mayusculas/minusculas, etc.)

**Direcciones de optimización**:

- Completar en un solo recorrido (contar y encontrar el máximo simultaneamente)
- Usar Map para escenarios complejos
- Manejar múltiples valores maximos iguales
- Considerar mayusculas/minusculas, espacios y otros casos especiales

### Ejemplo de respuesta en entrevista

**Q: Implemente una función que encuentre el carácter más frecuente en una cadena.**

> "Usaría un objeto para registrar la frecuencia de cada carácter, y actualizaria el máximo durante el recorrido de la cadena. La implementación concreta es: inicializar un objeto vacio charCount para almacenar caracteres y conteos, inicializar las variables maxCount y maxChar. Luego recorrer la cadena, para cada carácter, si no esta en el objeto inicializarlo en 0, luego incrementar el conteo. Si el conteo del carácter actual es mayor que maxCount, actualizar maxCount y maxChar. Finalmente devolver maxChar. La complejidad temporal de este método es O(n) y la complejidad espacial es O(k), dónde n es la longitud de la cadena y k es la cantidad de caracteres diferentes."

## Reference

- [MDN - String](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
