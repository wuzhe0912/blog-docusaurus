---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> O que é uma Closure?

Para entender closures, é necessário primeiro compreender o escopo de variáveis em JavaScript e como as funções acessam variáveis externas.

### Variable Scope (Escopo de variáveis)

Em JavaScript, o escopo de variáveis se divide em dois tipos: global scope e function scope.

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // Erro gerado, não é possível acessar variáveis dentro do function scope
```

### Closure example

A condição para acionar uma Closure é que uma função filha seja definida dentro de uma função pai e retornada através de return, preservando assim as variáveis de ambiente da função filha (ou seja, evitando o `Garbage Collection`).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Contagem atual: ${count}`);
  };
}

const counter = parentFunction();

counter(); // print Contagem atual: 1
counter(); // print Contagem atual: 2
// A variável count não é coletada, pois childFunction ainda existe e a cada chamada atualiza o valor de count
```

No entanto, é preciso ter cuidado, pois as closures mantêm as variáveis na memória. Se houver muitas variáveis, o uso de memória pode se tornar excessivo (não se deve abusar de closures), afetando o desempenho.

## 2. Create a function that meets the following conditions

> Crie uma função que atenda às seguintes condições (usando o conceito de closure)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

Separar em duas funções para processamento

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

Claro que a primeira solução tem uma alta probabilidade de ser rejeitada, então é necessário tentar combinar em uma única função.

```js
function plus(value, subValue) {
  // Determinar com base na quantidade de parâmetros passados a cada vez
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> Utilize a característica de closure para incrementar um número

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

Aqui não usamos Arrow Function, mas sim a forma normal de function.

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

Na solução anterior, também é possível incluir o object diretamente dentro do return

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. What will be printed in this nested function call?

> O que será impresso nesta chamada de funções aninhadas?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Análise

**Resultado da execução**:

```
hello
TypeError: aa is not a function
```

### Fluxo de execução detalhado

```js
// Executar a(b(c))
// JavaScript executa funções de dentro para fora

// Passo 1: Executar a função mais interna b(c)
b(c)
  ↓
// A função c é passada como parâmetro para b
// Dentro de b, bb() é executado, ou seja, c()
c() // Imprime 'hello'
  ↓
// A função b não tem instrução return
// Portanto retorna undefined
return undefined

// Passo 2: Executar a(undefined)
a(undefined)
  ↓
// undefined é passado como parâmetro para a
// Dentro de a, tenta-se executar aa()
// Ou seja, undefined()
undefined() // ❌ Erro: TypeError: aa is not a function
```

### Por que isso acontece?

#### 1. Ordem de execução das funções (de dentro para fora)

```js
// Exemplo
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. Primeiro executa multiply(2, 3) → 6
           └────── 3. Depois executa add(6)

// Mesmo conceito
a(b(c))
  ↑ ↑
  | └─ 1. Primeiro executa b(c)
  └─── 2. Depois executa a(resultado de b(c))
```

#### 2. Funções sem return retornam undefined

```js
function b(bb) {
  bb(); // Executou, mas não tem return
} // return undefined implícito

// Equivalente a
function b(bb) {
  bb();
  return undefined; // JavaScript adiciona automaticamente
}
```

#### 3. Tentar chamar algo que não é uma função gera um erro

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// Outros casos que geram erro
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Como corrigir?

#### Método 1: Fazer a função b retornar uma função

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// Saída:
// hello
// b executed
```

#### Método 2: Passar a função diretamente, sem executá-la primeiro

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // Imprime apenas 'hello'

// Ou escrever assim
a(() => b(c)); // Imprime 'hello'
```

#### Método 3: Alterar a lógica de execução

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// Executar separadamente
b(c); // Imprime 'hello'
a(() => console.log('a executed')); // Imprime 'a executed'
```

### Questões relacionadas

#### Questão 1: E se mudar para isso?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Clique para ver a resposta</summary>

```
hello
TypeError: aa is not a function
```

**Análise**:

1. `b(c)` → Executa `c()`, imprime `'hello'`, retorna `'world'`
2. `a('world')` → Executa `'world'()`... espere, isso também gera erro!

**Resposta correta**:

```
hello
TypeError: aa is not a function
```

Porque `b(c)` retorna `'world'` (uma string), `a('world')` tenta executar `'world'()`, uma string não é uma função, portanto gera um erro.

</details>

#### Questão 2: E se todos tiverem return?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Clique para ver a resposta</summary>

```
[Function: c]
hello
```

**Análise**:

1. `b(c)` → Retorna a função `c` em si (sem executá-la)
2. `a(c)` → Retorna a função `c` em si
3. `result` é a função `c`
4. `result()` → Executa `c()`, retorna `'hello'`

</details>

### Pontos-chave para memorizar

```javascript
// Prioridade de chamadas de funções
a(b(c))
  ↓
// 1. Primeiro executar a mais interna
b(c) // Se b não tem return, é undefined
  ↓
// 2. Depois executar a externa
a(undefined) // Tentar executar undefined() gera um erro

// Soluções
// ✅ 1. Garantir que funções intermediárias retornem uma função
// ✅ 2. Ou usar arrow functions para encapsular
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript Fundamentos] Mecanismo de coleta de lixo](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - Gerenciamento de memória em JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
