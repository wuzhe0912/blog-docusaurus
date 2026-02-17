---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> O que são tipos primitivos (Primitive Types) e tipos de referência (Reference Types)?

Os tipos de dados em JavaScript são divididos em duas grandes categorias: **tipos primitivos** e **tipos de referência**. Eles possuem diferenças fundamentais na forma como são armazenados na memória e no comportamento de passagem.

### Tipos primitivos (Primitive Types)

**Características**:

- Armazenados na **Stack (pilha)**
- Na passagem, **o valor em si é copiado** (Call by Value)
- São imutáveis (Immutable)

**Incluem 7 tipos**:

```javascript
// 1. String (cadeia de caracteres)
const str = 'hello';

// 2. Number (número)
const num = 42;

// 3. Boolean (booleano)
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Tipos de referência (Reference Types)

**Características**:

- Armazenados no **Heap (monte)**
- Na passagem, **a referência (endereço de memória) é copiada** (Call by Reference)
- São mutáveis (Mutable)

**Incluem**:

```javascript
// 1. Object (objeto)
const obj = { name: 'John' };

// 2. Array (array)
const arr = [1, 2, 3];

// 3. Function (função)
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Passagem por valor (Call by Value) vs Passagem por referência (Call by Reference)

### Passagem por valor (Call by Value) - Tipos primitivos

**Comportamento**: O valor em si é copiado; modificar a cópia não afeta o valor original.

```javascript
// Tipo primitivo: passagem por valor
let a = 10;
let b = a; // Copiar valor

b = 20; // Modificar b

console.log(a); // 10 (não afetado)
console.log(b); // 20
```

**Diagrama de memória**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← Valor independente
├─────────┤
│ b: 20   │ ← Valor independente (modificado após cópia)
└─────────┘
```

### Passagem por referência (Call by Reference) - Tipos de referência

**Comportamento**: O endereço de memória é copiado; duas variáveis apontam para o mesmo objeto.

```javascript
// Tipo de referência: passagem por referência
let obj1 = { name: 'John' };
let obj2 = obj1; // Copiar endereço de memória

obj2.name = 'Jane'; // Modificar através de obj2

console.log(obj1.name); // 'Jane' (afetado!)
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true (apontam para o mesmo objeto)
```

**Diagrama de memória**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (mesmo objeto)   │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> Perguntas frequentes de quiz

### Pergunta 1: Passagem de tipos primitivos

```javascript
function changeValue(x) {
  x = 100;
  console.log('x dentro da função:', x);
}

let num = 50;
changeValue(num);
console.log('num fora da função:', num);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// x dentro da função: 100
// num fora da função: 50
```

**Explicação**:

- `num` é um tipo primitivo (Number)
- Ao passar para a função, **o valor é copiado**, `x` e `num` são variáveis independentes
- Modificar `x` não afeta `num`

```javascript
// Fluxo de execução
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (cópia)
x = 100; // Stack: x = 100 (somente x é modificado)
console.log(num); // Stack: num = 50 (não afetado)
```

</details>

### Pergunta 2: Passagem de tipos de referência

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('obj.name dentro da função:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('person.name fora da função:', person.name);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// obj.name dentro da função: Changed
// person.name fora da função: Changed
```

**Explicação**:

- `person` é um tipo de referência (Object)
- Ao passar para a função, **o endereço de memória é copiado**
- `obj` e `person` apontam para o **mesmo objeto**
- Modificar o conteúdo do objeto através de `obj` também afeta `person`

```javascript
// Diagrama de memória
let person = { name: 'Original' }; // Heap: criar objeto @0x001
changeObject(person); // Stack: obj = @0x001 (copiar endereço)
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name (mesmo objeto)
```

</details>

### Pergunta 3: Reatribuição vs modificação de propriedade

```javascript
function test1(obj) {
  obj.name = 'Modified'; // Modificar propriedade
}

function test2(obj) {
  obj = { name: 'New Object' }; // Reatribuir
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// A: Modified
// B: Modified (não é 'New Object'!)
```

**Explicação**:

**test1: Modificação de propriedade**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ Modifica a propriedade do objeto original
}
// person e obj apontam para o mesmo objeto, portanto é modificado
```

**test2: Reatribuição**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ Apenas muda a referência de obj
}
// obj agora aponta para um novo objeto, mas person ainda aponta para o original
```

**Diagrama de memória**:

```text
// Antes de test1
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (o mesmo)

// Depois de test1
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (o mesmo)

// Execução de test2
person ────> { name: 'Modified' }    (sem alteração)
obj    ────> { name: 'New Object' }  (novo objeto)

// Depois de test2
person ────> { name: 'Modified' }    (ainda sem alteração)
// obj é destruído, o novo objeto é coletado pelo garbage collector
```

</details>

### Pergunta 4: Passagem de arrays

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Explicação**:

- `modifyArray`: Modifica o conteúdo do array original, `numbers` é afetado
- `reassignArray`: Apenas muda a referência do parâmetro, `numbers` não é afetado

</details>

### Pergunta 5: Operações de comparação

```javascript
// Comparação de tipos primitivos
let a = 10;
let b = 10;
console.log('A:', a === b);

// Comparação de tipos de referência
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// A: true
// B: false
// C: true
```

**Explicação**:

**Tipos primitivos**: Comparam valores

```javascript
10 === 10; // true (mesmo valor)
```

**Tipos de referência**: Comparam endereços de memória

```javascript
obj1 === obj2; // false (objetos diferentes, endereços diferentes)
obj1 === obj3; // true (apontam para o mesmo objeto)
```

**Diagrama de memória**:

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (mesmo conteúdo mas endereço diferente)
obj3 ────> @0x001: { value: 10 } (mesmo endereço que obj1)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Cópia superficial vs Cópia profunda

### Cópia superficial (Shallow Copy)

**Definição**: Copia apenas o primeiro nível; objetos aninhados continuam sendo referências.

#### Método 1: Operador de espalhamento (Spread Operator)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// Modificar primeiro nível: não afeta o objeto original
copy.name = 'Jane';
console.log(original.name); // 'John' (não afetado)

// Modificar objeto aninhado: afeta o objeto original!
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (afetado!)
```

#### Método 2: Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John' (não afetado)
```

#### Método 3: Cópia superficial de arrays

```javascript
const arr1 = [1, 2, 3];

// Método 1: Operador de espalhamento
const arr2 = [...arr1];

// Método 2: slice()
const arr3 = arr1.slice();

// Método 3: Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1 (não afetado)
```

### Cópia profunda (Deep Copy)

**Definição**: Copia completamente todos os níveis, incluindo objetos aninhados.

#### Método 1: JSON.parse + JSON.stringify (mais comum)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// Modificar objeto aninhado: não afeta o objeto original
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (não afetado)

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming'] (não afetado)
```

**Limitações**:

```javascript
const obj = {
  date: new Date(), // ❌ Será convertido em string
  func: () => {}, // ❌ Será ignorado
  undef: undefined, // ❌ Será ignorado
  symbol: Symbol('test'), // ❌ Será ignorado
  regexp: /abc/, // ❌ Será convertido em {}
  circular: null, // ❌ Referências circulares causam erro
};
obj.circular = obj; // Referência circular

JSON.parse(JSON.stringify(obj)); // Erro ou perda de dados
```

#### Método 2: structuredClone() (navegadores modernos)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Pode copiar corretamente objetos especiais como Date
console.log(copy.date instanceof Date); // true
```

**Vantagens**:

- ✅ Suporta Date, RegExp, Map, Set, etc.
- ✅ Suporta referências circulares
- ✅ Melhor desempenho

**Limitações**:

- ❌ Não suporta funções
- ❌ Não suporta Symbol

#### Método 3: Implementação recursiva de cópia profunda

```javascript
function deepClone(obj) {
  // Tratar null e não-objetos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Tratar arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Tratar Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Tratar RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Tratar objetos
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Exemplo de uso
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (não afetado)
```

#### Método 4: Usar Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Comparação: Cópia superficial vs Cópia profunda

| Característica   | Cópia superficial    | Cópia profunda              |
| ---------------- | -------------------- | --------------------------- |
| Níveis copiados  | Apenas primeiro nível| Todos os níveis             |
| Objetos aninhados| Continuam referências| Completamente independentes |
| Desempenho       | Rápido               | Lento                       |
| Memória          | Pouca                | Muita                       |
| Caso de uso      | Objetos simples      | Estruturas aninhadas complexas |

## 5. Common Pitfalls

> Armadilhas comuns

### Armadilha 1: Acreditar que a passagem de parâmetros pode alterar tipos primitivos

```javascript
// ❌ Entendimento incorreto
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5 (não se torna 6!)

// ✅ Forma correta
count = increment(count); // Precisa receber o valor de retorno
console.log(count); // 6
```

### Armadilha 2: Acreditar que reatribuição pode alterar o objeto externo

```javascript
// ❌ Entendimento incorreto
function resetObject(obj) {
  obj = { name: 'Reset' }; // Apenas muda a referência do parâmetro
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original' (não foi resetado!)

// ✅ Forma correta 1: Modificar propriedades
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ Forma correta 2: Retornar novo objeto
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### Armadilha 3: Acreditar que o operador de espalhamento é cópia profunda

```javascript
// ❌ Entendimento incorreto
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // Cópia superficial!

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane' (foi afetado!)

// ✅ Forma correta: Cópia profunda
const copy = JSON.parse(JSON.stringify(original));
// ou
const copy = structuredClone(original);
```

### Armadilha 4: Mal-entendido sobre const

```javascript
// const apenas impede a reatribuição, não é imutabilidade!

const obj = { name: 'John' };

// ❌ Não pode ser reatribuído
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ Propriedades podem ser modificadas
obj.name = 'Jane'; // Funciona normalmente
obj.age = 30; // Funciona normalmente

// Para verdadeira imutabilidade
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // Falha silenciosamente (no modo estrito, lança erro)
console.log(immutableObj.name); // 'John' (não foi modificado)
```

### Armadilha 5: Problema de referência em loops

```javascript
// ❌ Erro comum
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // Todos apontam para o mesmo objeto!
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// Todos são o mesmo objeto, o valor final é sempre 2

// ✅ Forma correta: Criar novo objeto a cada vez
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // Criar novo objeto a cada vez
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> Melhores práticas

### ✅ Abordagens recomendadas

```javascript
// 1. Ao copiar objetos, usar explicitamente métodos de cópia
const original = { name: 'John', age: 30 };

// Cópia superficial (objetos simples)
const copy1 = { ...original };

// Cópia profunda (objetos aninhados)
const copy2 = structuredClone(original);

// 2. Funções não devem depender de efeitos colaterais para modificar parâmetros
// ❌ Ruim
function addItem(arr, item) {
  arr.push(item); // Modifica o array original
}

// ✅ Bom
function addItem(arr, item) {
  return [...arr, item]; // Retorna novo array
}

// 3. Usar const para prevenir reatribuição acidental
const config = { theme: 'dark' };
// config = {}; // Vai lançar erro

// 4. Usar Object.freeze quando objetos imutáveis são necessários
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Abordagens a evitar

```javascript
// 1. Não depender da passagem de parâmetros para modificar tipos primitivos
function increment(num) {
  num++; // ❌ Sem efeito
}

// 2. Não confundir cópia superficial com cópia profunda
const copy = { ...nested }; // ❌ Acreditar que é cópia profunda

// 3. Não reutilizar a mesma referência de objeto em loops
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ Todos apontam para o mesmo objeto
}
```

## 7. Interview Summary

> Resumo para entrevistas

### Memorização rápida

**Tipos primitivos (Primitive)**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Passagem por valor (Call by Value)
- Armazenados na Stack
- Imutáveis (Immutable)

**Tipos de referência (Reference)**:

- Object, Array, Function, Date, RegExp, etc.
- Passagem por referência (Call by Reference)
- Armazenados no Heap
- Mutáveis (Mutable)

### Exemplo de resposta em entrevista

**Q: JavaScript é Call by Value ou Call by Reference?**

> JavaScript é **Call by Value para todos os tipos**, mas o "valor" passado para tipos de referência é o endereço de memória.
>
> - Tipos primitivos: Uma cópia do valor é passada, modificações não afetam o valor original
> - Tipos de referência: Uma cópia do endereço é passada, através do endereço é possível modificar o objeto original
> - No entanto, se for reatribuído (mudar o endereço), o objeto original não é afetado

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript em profundidade](https://javascript.info/object-copy)
