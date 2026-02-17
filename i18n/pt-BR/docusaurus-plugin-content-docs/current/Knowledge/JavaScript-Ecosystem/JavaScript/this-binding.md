---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> O que é `this` em JavaScript?

`this` é uma palavra-chave em JavaScript que aponta para o objeto de contexto no qual uma função é executada. O valor de `this` depende de **como a função é chamada**, e não de onde ela é definida.

### Regras de binding do `this`

Existem quatro regras de binding para `this` em JavaScript (da maior para a menor prioridade):

1. **Binding new**: Chamar uma função construtora com a palavra-chave `new`
2. **Binding explícito**: Especificar `this` explicitamente usando `call`, `apply`, `bind`
3. **Binding implícito**: Chamar como método de um objeto
4. **Binding padrão**: Comportamento padrão em outros casos

## 2. Please explain the difference of `this` in different contexts

> Por favor, explique a diferença do `this` em diferentes contextos

### 1. `this` no ambiente global

```javascript
console.log(this); // Navegador: window, Node.js: global

function globalFunction() {
  console.log(this); // Modo não estrito: window/global, modo estrito: undefined
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

### 2. `this` em funções regulares (Function)

O `this` de uma função regular depende de **como ela é chamada**:

```javascript
function regularFunction() {
  console.log(this);
}

// Chamada direta: this aponta para o objeto global (modo não estrito) ou undefined (modo estrito)
regularFunction(); // window (modo não estrito) ou undefined (modo estrito)

// Chamada como método de objeto: this aponta para esse objeto
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// Usando call/apply/bind: this aponta para o objeto especificado
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` em Arrow Functions

**Arrow Functions não possuem seu próprio `this`**. Elas **herdam o `this` do escopo externo** (escopo léxico).

```javascript
const obj = {
  name: 'Object',

  // Função regular
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // Função regular interna: this muda
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // Arrow Function interna: this é herdado do exterior
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // Arrow Function
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window (herda do global)
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` em métodos de objeto

```javascript
const person = {
  name: 'John',
  age: 30,

  // Função regular: this aponta para person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // Método abreviado ES6: this aponta para person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // Arrow Function: this herda do exterior (aqui é o global)
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. `this` em funções construtoras

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

### 6. `this` em classes

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // Método regular: this aponta para a instância
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // Propriedade Arrow Function: this é vinculado à instância
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// Atribuir o método a uma variável perde o binding do this
const greet = john.greet;
greet(); // Erro: Cannot read property 'name' of undefined

// A propriedade Arrow Function não perde o binding do this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> Quiz: O que o código a seguir imprimirá?

### Questão 1: Métodos de objeto e Arrow Functions

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
<summary>Clique para ver a resposta</summary>

```javascript
// A: Object
// B: undefined
```

**Explicação**:
- `regularFunc` é uma função regular, chamada via `obj.regularFunc()`, `this` aponta para `obj`, então imprime `"A: Object"`
- `arrowFunc` é uma Arrow Function, não tem seu próprio `this`, herda o `this` do exterior (global). Não existe propriedade `name` no global, então imprime `"B: undefined"`

</details>

### Questão 2: Função passada como argumento

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
<summary>Clique para ver a resposta</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" ou erro (modo estrito)
// 3: "Hello, undefined" ou erro (modo estrito)
```

**Explicação**:
1. `person.greet()` - Chamada através do objeto, `this` aponta para `person`
2. `greet()` - Após atribuir o método a uma variável e chamá-lo diretamente, `this` é perdido, aponta para global ou `undefined`
3. `setTimeout(person.greet, 1000)` - O método é passado como callback, `this` é perdido

</details>

### Questão 3: Funções aninhadas

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
<summary>Clique para ver a resposta</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Explicação**:
- `A` - `method` é chamada via `obj`, `this` aponta para `obj`
- `B` - `inner` é uma função regular, chamada diretamente, `this` aponta para global ou `undefined`
- `C` - `arrow` é uma Arrow Function, herda o `this` do `method` externo, aponta para `obj`

</details>

### Questão 4: setTimeout e Arrow Functions

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
<summary>Clique para ver a resposta</summary>

```javascript
// A: undefined
// B: Object
```

**Explicação**:
- `A` - O callback do `setTimeout` é uma função regular, na execução `this` aponta para o global
- `B` - O callback do `setTimeout` é uma Arrow Function, herda o `this` do `method2` externo, aponta para `obj`

</details>

### Questão 5: Binding complexo do this

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
console.log('B:', getThis() === window); // Assumindo ambiente de navegador

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Explicação**:
- `A` - Chamada via `obj1`, `this` aponta para `obj1`
- `B` - Chamada direta, `this` aponta para global (window)
- `C` - Chamada via `obj2`, `this` aponta para `obj2`
- `D` - Usando `bind` para vincular `this` a `obj2`

</details>

### Questão 6: Função construtora e protótipo

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
<summary>Clique para ver a resposta</summary>

```javascript
// A: undefined
// B: John
```

**Explicação**:
- `A` - Callback de função regular do `setTimeout`, `this` aponta para o global
- `B` - Callback de Arrow Function do `setTimeout`, herda o `this` do `arrowDelayedGreet` externo, aponta para `john`

</details>

### Questão 7: Variável global vs propriedade de objeto

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
<summary>Clique para ver a resposta</summary>

```javascript
// undefined
```

**Explicação**:

A chave desta questão está em entender a diferença entre **variáveis globais** e **propriedades de objeto**:

1. **Para onde `this` aponta em `obj.a()`**:
   - Chamada via `obj.a()`, `this` aponta para `obj`

2. **`name = 'john'` modifica a variável global**:
   ```javascript
   name = 'john'; // Sem var/let/const, modifica o name global
   // Equivale a
   window.name = 'john'; // Ambiente de navegador
   ```

3. **`this.name` acessa a propriedade do objeto**:
   ```javascript
   console.log(this.name); // Equivale a console.log(obj.name)
   ```

4. **O objeto `obj` não tem propriedade `name`**:
   ```javascript
   obj.name; // undefined (name não está definido dentro do objeto obj)
   ```

**Processo de execução completo**:

```javascript
// Estado inicial
window.name = 'jjjj'; // Variável global
obj = {
  a: function () { /* ... */ },
  // Nota: obj não tem propriedade name!
};

// Execução de obj.a()
obj.a();
  ↓
// 1. name = 'john' → Modifica o window.name global
window.name = 'john'; // ✅ Variável global modificada

// 2. this.name → Acessa obj.name
this.name; // Equivale a obj.name
obj.name; // undefined (obj não tem propriedade name)
```

**Mal-entendidos comuns**:

Muitos pensam que será impresso `'john'`, porque:
- ❌ Acreditam erroneamente que `name = 'john'` adicionará uma propriedade a `obj`
- ❌ Acreditam erroneamente que `this.name` acessará a variável global

**Entendimento correto**:
- ✅ `name = 'john'` apenas modifica a variável global, não afeta `obj`
- ✅ `this.name` acessa `obj.name`, não o `name` global

**Para imprimir `'john'`, deveria ser escrito assim**:

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ Adiciona propriedade name a obj
    console.log(this.name); // 'john'
  },
};

obj.a(); // Imprime 'john'
console.log(obj.name); // 'john'
```

</details>

### Questão 8: Armadilha de variáveis globais (extensão)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // Nota: sem var/let/const
    console.log('1:', name); // Acessa variável global
    console.log('2:', this.name); // Acessa propriedade do objeto
  },
};

obj.a();
console.log('3:', name); // Variável global
console.log('4:', obj.name); // Propriedade do objeto
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Explicação**:

```javascript
// Estado inicial
window.name = 'global'; // Variável global
obj.name = 'object'; // Propriedade do objeto

// Execução de obj.a()
name = 'modified'; // Modifica o window.name global

console.log('1:', name); // Acesso global: 'modified'
console.log('2:', this.name); // Acesso a obj.name: 'object'

// Após a execução
console.log('3:', name); // Global: 'modified'
console.log('4:', obj.name); // Objeto: 'object' (não modificado)
```

**Conceitos-chave**:
- `name` (sem `this.`) → Acessa a variável global
- `this.name` (com `this.`) → Acessa a propriedade do objeto
- Os dois são **variáveis completamente diferentes**!

</details>

## 4. How to preserve `this` in callbacks?

> Como preservar `this` em funções callback?

### Método 1: Usar Arrow Functions

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Arrow Function herda this do exterior
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

### Método 3: Salvar `this` em uma variável (método antigo)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Salvar this em uma variável
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Método 4: Usar `call()` ou `apply()`

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

> Armadilhas comuns do `this`

### Armadilha 1: Atribuir método de objeto a uma variável

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined (this é perdido)

// Solução: usar bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Armadilha 2: `this` em event listeners

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ Arrow Function: this não aponta para button
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ Função regular: this aponta para o elemento que disparou o evento
  handleClick2: function () {
    console.log(this); // elemento button
  },

  // ✅ Se precisar acessar o this do objeto, envolva com Arrow Function
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Armadilha 3: Callbacks em métodos de arrays

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ Callback de função regular perde this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ Callback de Arrow Function preserva this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ Usar o parâmetro thisArg do forEach
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // O segundo parâmetro especifica this
  },
};
```

## 6. `this` binding rules summary

> Resumo das regras de binding do `this`

### Prioridade (da mais alta para a mais baixa)

```javascript
// 1. Binding new (maior prioridade)
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

// 4. Binding padrão (menor prioridade)
greet(); // undefined (modo estrito) ou window.name
```

### Tabela comparativa: Function vs Arrow Function

| Característica | Function | Arrow Function |
| --- | --- | --- |
| Tem seu próprio `this` | ✅ Sim | ❌ Não |
| `this` depende de | Forma de chamada | Local de definição (escopo léxico) |
| Pode mudar `this` com `call`/`apply`/`bind` | ✅ Sim | ❌ Não |
| Pode ser usada como construtora | ✅ Sim | ❌ Não |
| Tem objeto `arguments` | ✅ Sim | ❌ Não |
| Adequada para | Métodos de objeto, construtoras | Callbacks, quando precisa herdar this externo |

### Dica de memorização

> **"Arrow herda, função chama"**
>
> - **Arrow Function**: `this` herda do escopo externo, determinado na definição
> - **Função regular**: `this` depende de como é chamada, determinado na execução

## 7. Best practices

> Boas práticas

### ✅ Práticas recomendadas

```javascript
// 1. Usar funções regulares ou sintaxe abreviada ES6 para métodos de objeto
const obj = {
  name: 'Object',

  // ✅ Bom: Função regular
  greet: function () {
    console.log(this.name);
  },

  // ✅ Bom: Abreviação ES6
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
    // ✅ Bom: Arrow Function preserva this
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Usar funções regulares quando this dinâmico é necessário
const button = {
  label: 'Click me',

  // ✅ Bom: Precisa acessar o this do elemento DOM
  handleClick: function () {
    console.log(this); // elemento DOM button
  },
};
```

### ❌ Práticas não recomendadas

```javascript
// 1. Não usar Arrow Functions para métodos de objeto
const obj = {
  name: 'Object',

  // ❌ Ruim: this não aponta para obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. Não usar Arrow Functions como construtoras
// ❌ Ruim: Arrow Functions não podem ser construtoras
const Person = (name) => {
  this.name = name; // Erro!
};

// 3. Não usar Arrow Functions quando precisa acessar arguments
// ❌ Ruim: Arrow Functions não têm arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
