---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Visão geral

Em JavaScript, existem três palavras-chave para declarar variáveis: `var`, `let` e `const`. Embora todas sejam usadas para declarar variáveis, elas diferem em escopo, inicialização, redeclaração, reatribuição e momento de acesso.

## Principais diferenças

| Comportamento           | `var`                        | `let`                | `const`              |
| ----------------------- | ---------------------------- | -------------------- | -------------------- |
| Escopo                  | Função ou global             | Bloco                | Bloco                |
| Inicialização           | Opcional                     | Opcional             | Obrigatória          |
| Redeclaração            | Permitida                    | Não permitida        | Não permitida        |
| Reatribuição            | Permitida                    | Permitida            | Não permitida        |
| Acesso antes da declaração | Retorna undefined         | Lança ReferenceError | Lança ReferenceError |

## Explicação detalhada

### Escopo

O escopo de `var` é de função ou global, enquanto `let` e `const` têm escopo de bloco (incluindo funções, blocos if-else ou loops for).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Inicialização

`var` e `let` podem ser declarados sem inicialização, enquanto `const` deve ser inicializado no momento da declaração.

```javascript
var varVariable;  // Válido
let letVariable;  // Válido
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Redeclaração

Dentro do mesmo escopo, `var` permite a redeclaração da mesma variável, enquanto `let` e `const` não permitem.

```javascript
var x = 1;
var x = 2; // Válido, x agora é 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Reatribuição

Variáveis declaradas com `var` e `let` podem ser reatribuídas, mas variáveis declaradas com `const` não podem.

```javascript
var x = 1;
x = 2; // Válido

let y = 1;
y = 2; // Válido

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Observação: Embora uma variável declarada com `const` não possa ser reatribuída, se for um objeto ou array, seu conteúdo ainda pode ser modificado.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Válido
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Válido
console.log(arr); // [1, 2, 3, 4]
```

### Acesso antes da declaração (Temporal Dead Zone)

Variáveis declaradas com `var` são elevadas e automaticamente inicializadas como `undefined`. Variáveis declaradas com `let` e `const` também são elevadas, mas não são inicializadas. Acessar antes da declaração lança um `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Perguntas de entrevista

### Pergunta: A armadilha clássica do setTimeout + var

Determine o resultado de saída do seguinte código:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Resposta incorreta (equívoco comum)

Muitas pessoas pensam que a saída é: `1 2 3 4 5`

#### Saída real

```
6
6
6
6
6
```

#### Por quê?

Este problema envolve três conceitos fundamentais:

**1. O escopo de função do var**

```javascript
// var não cria um escopo de bloco dentro do loop
for (var i = 1; i <= 5; i++) {
  // i está no escopo externo, todas as iterações compartilham o mesmo i
}
console.log(i); // 6 (valor de i após o fim do loop)

// No caso do var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // loop encerrado
}
```

**2. A execução assíncrona do setTimeout**

```javascript
// setTimeout é assíncrono, executa após o código síncrono atual terminar
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Este código é colocado na fila de tarefas do Event Loop
    console.log(i);
  }, 0);
}
// O loop executa primeiro (i se torna 6), depois os callbacks do setTimeout começam a executar
```

**3. Referência do Closure**

```javascript
// Todas as funções callback do setTimeout referenciam o mesmo i
// Quando os callbacks executam, i já é 6
```

#### Soluções

**Solução 1: Usar let (recomendado) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Saída: 1 2 3 4 5

// No caso do let
{
  let i = 1; // i da primeira iteração
}
{
  let i = 2; // i da segunda iteração
}
{
  let i = 3; // i da terceira iteração
}
```

**Princípio**: `let` cria um novo escopo de bloco a cada iteração, e cada callback `setTimeout` captura o valor de `i` da iteração atual.

```javascript
// Equivalente a
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... e assim por diante
```

**Solução 2: Usar IIFE (Expressão de Função Imediatamente Invocada)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Saída: 1 2 3 4 5
```

**Princípio**: A IIFE cria um novo escopo de função, e em cada iteração, o valor atual de `i` é passado como parâmetro `j`, formando um Closure.

**Solução 3: Usar o terceiro parâmetro do setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // O terceiro parâmetro é passado para a função callback
}
// Saída: 1 2 3 4 5
```

**Princípio**: O terceiro parâmetro é os seguintes do `setTimeout` são passados como argumentos para a função callback.

**Solução 4: Usar bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Saída: 1 2 3 4 5
```

**Princípio**: `bind` cria uma nova função e vincula o valor atual de `i` como parâmetro.

#### Comparação de soluções

| Solução             | Vantagens                        | Desvantagens            | Recomendação               |
| ------------------- | -------------------------------- | ----------------------- | -------------------------- |
| `let`               | Conciso, moderno, fácil de entender | ES6+                 | 5/5 Altamente recomendado  |
| IIFE                | Boa compatibilidade              | Sintaxe complexa        | 3/5 Pode ser considerado   |
| Parâmetro setTimeout | Simples e direto                | Pouco conhecido         | 4/5 Recomendado            |
| `bind`              | Estilo funcional                 | Legibilidade um pouco menor | 3/5 Pode ser considerado |

#### Perguntas adicionais

**Q1: E se mudarmos para isso?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Resposta**: `6` é impresso uma vez por segundo, totalizando 5 vezes (respectivamente a 1, 2, 3, 4 e 5 segundos).

**Q2: Como imprimir sequencialmente 1, 2, 3, 4, 5 a cada segundo?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Após 1 segundo: 1
// Após 2 segundos: 2
// Após 3 segundos: 3
// Após 4 segundos: 4
// Após 5 segundos: 5
```

#### Pontos-chave em entrevistas

Esta pergunta avalia:

1. **Escopo de var**: Escopo de função vs escopo de bloco
2. **Event Loop**: Execução síncrona vs assíncrona
3. **Closure**: Como as funções capturam variáveis externas
4. **Soluções**: Múltiplas abordagens com vantagens e desvantagens

Ao responder, é recomendado:

- Primeiro dar a resposta correta (6 6 6 6 6)
- Explicar a razão (escopo do var + setTimeout assíncrono)
- Fornecer soluções (preferir let e explicar outras opções)
- Demonstrar compreensão dos mecanismos internos do JavaScript

## Melhores práticas

1. Priorizar `const`: Para variáveis que não precisam ser reatribuídas, `const` melhora a legibilidade é a manutenibilidade do código.
2. Em seguida usar `let`: Quando a reatribuição é necessária, usar `let`.
3. Evitar `var`: Como o escopo é o comportamento de Hoisting do `var` podem causar problemas inesperados, é recomendado evitá-lo no desenvolvimento JavaScript moderno.
4. Atenção à compatibilidade do navegador: Se for necessário suportar navegadores antigos, ferramentas como Babel podem transpilar `let` e `const` para `var`.

## Tópicos relacionados

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
