---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> ¿Qué es `this` en JavaScript?

`this` es una palabra clave en JavaScript que apunta al objeto de contexto en el que se ejecuta una función. El valor de `this` depende de **cómo se llama a la función**, no de dónde se define.

### Reglas de binding de `this`

Existen cuatro reglas para el binding de `this` en JavaScript (de mayor a menor prioridad):

1. **Binding new**: Llamar a una función constructora con la palabra clave `new`
2. **Binding explícito**: Especificar `this` explícitamente usando `call`, `apply`, `bind`
3. **Binding implícito**: Llamar como método de un objeto
4. **Binding por defecto**: Comportamiento por defecto en otros casos

## 2. Please explain the difference of `this` in different contexts

> Por favor, explique la diferencia de `this` en diferentes contextos

### 1. `this` en el entorno global

```javascript
console.log(this); // Navegador: window, Node.js: global

function globalFunction() {
  console.log(this); // Modo no estricto: window/global, modo estricto: undefined
}

globalFunction();
```

```javascript
'use strict';

function strictFunction() {
  console.log(this); // undefined
}

strictFunction();
```

### 2. `this` en funciones regulares (Function)

El `this` de una función regular depende de **cómo se llama**:

```javascript
function regularFunction() {
  console.log(this);
}

// Llamada directa: this apunta al objeto global (modo no estricto) o undefined (modo estricto)
regularFunction(); // window (modo no estricto) o undefined (modo estricto)

// Llamada como método de objeto: this apunta a ese objeto
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// Usando call/apply/bind: this apunta al objeto especificado
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` en Arrow Functions

**Las Arrow Functions no tienen su propio `this`**. **Heredan el `this` del ámbito externo** (ámbito léxico).

```javascript
const obj = {
  name: 'Object',

  // Función regular
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // Función regular interna: this cambia
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // Arrow Function interna: this se hereda del exterior
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // Arrow Function
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window (hereda del global)
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` en métodos de objeto

```javascript
const person = {
  name: 'John',
  age: 30,

  // Función regular: this apunta a person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // Método abreviado ES6: this apunta a person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // Arrow Function: this hereda del exterior (aquí es global)
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. `this` en funciones constructoras

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet(); // "Hello, I'm John"
console.log(john.name); // "John"
```

### 6. `this` en clases

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // Método regular: this apunta a la instancia
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // Propiedad Arrow Function: this se vincula a la instancia
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// Asignar el método a una variable pierde el binding de this
const greet = john.greet;
greet(); // Error: Cannot read property 'name' of undefined

// La propiedad Arrow Function no pierde el binding de this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> Quiz: ¿Qué imprimirá el siguiente código?

### Pregunta 1: Métodos de objeto y Arrow Functions

```javascript
const obj = {
  name: 'Object',
  regularFunc: function () {
    console.log('A:', this.name);
  },
  arrowFunc: () => {
    console.log('B:', this.name);
  },
};

obj.regularFunc();
obj.arrowFunc();
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// A: Object
// B: undefined
```

**Explicación**:
- `regularFunc` es una función regular, llamada mediante `obj.regularFunc()`, `this` apunta a `obj`, por lo que imprime `"A: Object"`
- `arrowFunc` es una Arrow Function, no tiene su propio `this`, hereda el `this` del exterior (global), no hay propiedad `name` en el global, por lo que imprime `"B: undefined"`

</details>

### Pregunta 2: Función pasada como argumento

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" o error (modo estricto)
// 3: "Hello, undefined" o error (modo estricto)
```

**Explicación**:
1. `person.greet()` - Llamada a través del objeto, `this` apunta a `person`
2. `greet()` - Al asignar el método a una variable y llamarlo directamente, se pierde `this`, apunta a global o `undefined`
3. `setTimeout(person.greet, 1000)` - El método se pasa como callback, se pierde `this`

</details>

### Pregunta 3: Funciones anidadas

```javascript
const obj = {
  name: 'Outer',
  method: function () {
    console.log('A:', this.name);

    function inner() {
      console.log('B:', this.name);
    }
    inner();

    const arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  },
};

obj.method();
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Explicación**:
- `A` - `method` se llama a través de `obj`, `this` apunta a `obj`
- `B` - `inner` es una función regular, llamada directamente, `this` apunta a global o `undefined`
- `C` - `arrow` es una Arrow Function, hereda el `this` del `method` externo, apunta a `obj`

</details>

### Pregunta 4: setTimeout y Arrow Functions

```javascript
const obj = {
  name: 'Object',

  method1: function () {
    setTimeout(function () {
      console.log('A:', this.name);
    }, 100);
  },

  method2: function () {
    setTimeout(() => {
      console.log('B:', this.name);
    }, 100);
  },
};

obj.method1();
obj.method2();
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// A: undefined
// B: Object
```

**Explicación**:
- `A` - El callback de `setTimeout` es una función regular, al ejecutarse `this` apunta al global
- `B` - El callback de `setTimeout` es una Arrow Function, hereda el `this` del `method2` externo, apunta a `obj`

</details>

### Pregunta 5: Binding complejo de this

```javascript
const obj1 = {
  name: 'obj1',
  getThis: function () {
    return this;
  },
};

const obj2 = {
  name: 'obj2',
};

console.log('A:', obj1.getThis().name);

const getThis = obj1.getThis;
console.log('B:', getThis() === window); // Asumiendo entorno de navegador

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Explicación**:
- `A` - Llamada a través de `obj1`, `this` apunta a `obj1`
- `B` - Llamada directa, `this` apunta a global (window)
- `C` - Llamada a través de `obj2`, `this` apunta a `obj2`
- `D` - Usando `bind` para vincular `this` a `obj2`

</details>

### Pregunta 6: Función constructora y prototipo

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.delayedGreet = function () {
  setTimeout(function () {
    console.log('A:', this.name);
  }, 100);
};

Person.prototype.arrowDelayedGreet = function () {
  setTimeout(() => {
    console.log('B:', this.name);
  }, 100);
};

const john = new Person('John');
john.delayedGreet();
john.arrowDelayedGreet();
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// A: undefined
// B: John
```

**Explicación**:
- `A` - Callback de función regular de `setTimeout`, `this` apunta al global
- `B` - Callback de Arrow Function de `setTimeout`, hereda el `this` del `arrowDelayedGreet` externo, apunta a `john`

</details>

### Pregunta 7: Variable global vs propiedad de objeto

```javascript
var name = 'jjjj';

var obj = {
  a: function () {
    name = 'john';
    console.log(this.name);
  },
};

obj.a();
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// undefined
```

**Explicación**:

La clave de esta pregunta está en entender la diferencia entre **variables globales** y **propiedades de objeto**:

1. **A qué apunta `this` en `obj.a()`**:
   - Llamada mediante `obj.a()`, `this` apunta a `obj`

2. **`name = 'john'` modifica la variable global**:
   ```javascript
   name = 'john'; // Sin var/let/const, modifica el name global
   // Equivale a
   window.name = 'john'; // Entorno de navegador
   ```

3. **`this.name` accede a la propiedad del objeto**:
   ```javascript
   console.log(this.name); // Equivale a console.log(obj.name)
   ```

4. **El objeto `obj` no tiene propiedad `name`**:
   ```javascript
   obj.name; // undefined (name no está definido dentro del objeto obj)
   ```

**Proceso de ejecución completo**:

```javascript
// Estado inicial
window.name = 'jjjj'; // Variable global
obj = {
  a: function () { /* ... */ },
  // Nota: ¡obj no tiene propiedad name!
};

// Ejecución de obj.a()
obj.a();
  ↓
// 1. name = 'john' → Modifica el window.name global
window.name = 'john'; // ✅ Variable global modificada

// 2. this.name → Accede a obj.name
this.name; // Equivale a obj.name
obj.name; // undefined (obj no tiene propiedad name)
```

**Malentendidos comunes**:

Muchos piensan que se imprimirá `'john'`, porque:
- ❌ Creen erróneamente que `name = 'john'` añadirá una propiedad a `obj`
- ❌ Creen erróneamente que `this.name` accederá a la variable global

**Entendimiento correcto**:
- ✅ `name = 'john'` solo modifica la variable global, no afecta a `obj`
- ✅ `this.name` accede a `obj.name`, no al `name` global

**Para imprimir `'john'`, se debería escribir así**:

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ Añade propiedad name a obj
    console.log(this.name); // 'john'
  },
};

obj.a(); // Imprime 'john'
console.log(obj.name); // 'john'
```

</details>

### Pregunta 8: Trampa de variables globales (extensión)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // Nota: sin var/let/const
    console.log('1:', name); // Accede a variable global
    console.log('2:', this.name); // Accede a propiedad del objeto
  },
};

obj.a();
console.log('3:', name); // Variable global
console.log('4:', obj.name); // Propiedad del objeto
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Explicación**:

```javascript
// Estado inicial
window.name = 'global'; // Variable global
obj.name = 'object'; // Propiedad del objeto

// Ejecución de obj.a()
name = 'modified'; // Modifica el window.name global

console.log('1:', name); // Acceso global: 'modified'
console.log('2:', this.name); // Acceso a obj.name: 'object'

// Después de la ejecución
console.log('3:', name); // Global: 'modified'
console.log('4:', obj.name); // Objeto: 'object' (no modificado)
```

**Conceptos clave**:
- `name` (sin `this.`) → Accede a la variable global
- `this.name` (con `this.`) → Accede a la propiedad del objeto
- ¡Son **variables completamente diferentes**!

</details>

## 4. How to preserve `this` in callbacks?

> ¿Cómo preservar `this` en funciones callback?

### Método 1: Usar Arrow Functions

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ La Arrow Function hereda this del exterior
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Método 2: Usar `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind vincula this
    setTimeout(
      function () {
        console.log(this.name); // "Object"
      }.bind(this),
      1000
    );
  },
};

obj.method();
```

### Método 3: Guardar `this` en una variable (método antiguo)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Guardar this en una variable
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Método 4: Usar `call()` o `apply()`

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Hello, I'm John"
greet.apply(person2); // "Hello, I'm Jane"
```

## 5. Common `this` pitfalls

> Trampas comunes de `this`

### Trampa 1: Asignar método de objeto a una variable

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined (this se pierde)

// Solución: usar bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Trampa 2: `this` en event listeners

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ Arrow Function: this no apunta a button
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ Función regular: this apunta al elemento que disparó el evento
  handleClick2: function () {
    console.log(this); // elemento button
  },

  // ✅ Si necesita acceder al this del objeto, envolver con Arrow Function
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Trampa 3: Callbacks en métodos de arrays

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ El callback de función regular pierde this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ El callback de Arrow Function preserva this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ Usar el parámetro thisArg de forEach
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // El segundo parámetro especifica this
  },
};
```

## 6. `this` binding rules summary

> Resumen de las reglas de binding de `this`

### Prioridad (de mayor a menor)

```javascript
// 1. Binding new (mayor prioridad)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. Binding explícito (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. Binding implícito (método de objeto)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. Binding por defecto (menor prioridad)
greet(); // undefined (modo estricto) o window.name
```

### Tabla comparativa: Function vs Arrow Function

| Característica | Function | Arrow Function |
| --- | --- | --- |
| Tiene su propio `this` | ✅ Sí | ❌ No |
| `this` depende de | Forma de llamada | Lugar de definición (ámbito léxico) |
| Se puede cambiar `this` con `call`/`apply`/`bind` | ✅ Sí | ❌ No |
| Se puede usar como constructor | ✅ Sí | ❌ No |
| Tiene objeto `arguments` | ✅ Sí | ❌ No |
| Adecuada para | Métodos de objeto, constructores | Callbacks, cuando se necesita heredar this externo |

### Regla mnemotécnica

> **"Arrow hereda, función llama"**
>
> - **Arrow Function**: `this` hereda del ámbito externo, se determina en la definición
> - **Función regular**: `this` depende de cómo se llama, se determina en la ejecución

## 7. Best practices

> Mejores prácticas

### ✅ Prácticas recomendadas

```javascript
// 1. Usar funciones regulares o métodos abreviados ES6 para métodos de objeto
const obj = {
  name: 'Object',

  // ✅ Bien: Función regular
  greet: function () {
    console.log(this.name);
  },

  // ✅ Bien: Abreviatura ES6
  introduce() {
    console.log(this.name);
  },
};

// 2. Usar Arrow Functions para callbacks
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ Bien: Arrow Function preserva this
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Usar funciones regulares cuando se necesita this dinámico
const button = {
  label: 'Click me',

  // ✅ Bien: Necesita acceder al this del elemento DOM
  handleClick: function () {
    console.log(this); // elemento DOM button
  },
};
```

### ❌ Prácticas no recomendadas

```javascript
// 1. No usar Arrow Functions para métodos de objeto
const obj = {
  name: 'Object',

  // ❌ Mal: this no apunta a obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. No usar Arrow Functions como constructores
// ❌ Mal: Arrow Functions no pueden ser constructores
const Person = (name) => {
  this.name = name; // ¡Error!
};

// 3. No usar Arrow Functions cuando se necesita acceder a arguments
// ❌ Mal: Arrow Functions no tienen arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
