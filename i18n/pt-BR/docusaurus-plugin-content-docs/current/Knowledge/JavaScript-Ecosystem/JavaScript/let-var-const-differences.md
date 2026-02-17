---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Visao geral

Em JavaScript, existem tres palavras-chave para declarar variaveis: `var`, `let` e `const`. Embora todas sejam usadas para declarar variaveis, elas diferem em escopo, inicializacao, redeclaracao, reatribuicao e momento de acesso.

## Principais diferencas

| Comportamento           | `var`                        | `let`                | `const`              |
| ----------------------- | ---------------------------- | -------------------- | -------------------- |
| Escopo                  | Funcao ou global             | Bloco                | Bloco                |
| Inicializacao           | Opcional                     | Opcional             | Obrigatoria          |
| Redeclaracao            | Permitida                    | Nao permitida        | Nao permitida        |
| Reatribuicao            | Permitida                    | Permitida            | Nao permitida        |
| Acesso antes da declaracao | Retorna undefined         | Lanca ReferenceError | Lanca ReferenceError |

## Explicacao detalhada

### Escopo

O escopo de `var` e de funcao ou global, enquanto `let` e `const` tem escopo de bloco (incluindo funcoes, blocos if-else ou loops for).

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

### Inicializacao

`var` e `let` podem ser declarados sem inicializacao, enquanto `const` deve ser inicializado no momento da declaracao.

```javascript
var varVariable;  // Valido
let letVariable;  // Valido
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Redeclaracao

Dentro do mesmo escopo, `var` permite a redeclaracao da mesma variavel, enquanto `let` e `const` nao permitem.

```javascript
var x = 1;
var x = 2; // Valido, x agora e 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Reatribuicao

Variaveis declaradas com `var` e `let` podem ser reatribuidas, mas variaveis declaradas com `const` nao podem.

```javascript
var x = 1;
x = 2; // Valido

let y = 1;
y = 2; // Valido

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Observacao: Embora uma variavel declarada com `const` nao possa ser reatribuida, se for um objeto ou array, seu conteudo ainda pode ser modificado.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Valido
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Valido
console.log(arr); // [1, 2, 3, 4]
```

### Acesso antes da declaracao (Temporal Dead Zone)

Variaveis declaradas com `var` sao elevadas e automaticamente inicializadas como `undefined`. Variaveis declaradas com `let` e `const` tambem sao elevadas, mas nao sao inicializadas. Acessar antes da declaracao lanca um `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Perguntas de entrevista

### Pergunta: A armadilha classica do setTimeout + var

Determine o resultado de saida do seguinte codigo:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Resposta incorreta (equivoco comum)

Muitas pessoas pensam que a saida e: `1 2 3 4 5`

#### Saida real

```
6
6
6
6
6
```

#### Por que?

Este problema envolve tres conceitos fundamentais:

**1. O escopo de funcao do var**

```javascript
// var nao cria um escopo de bloco dentro do loop
for (var i = 1; i <= 5; i++) {
  // i esta no escopo externo, todas as iteracoes compartilham o mesmo i
}
console.log(i); // 6 (valor de i apos o fim do loop)

// No caso do var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // loop encerrado
}
```

**2. A execucao assincrona do setTimeout**

```javascript
// setTimeout e assincrono, executa apos o codigo sincrono atual terminar
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Este codigo e colocado na fila de tarefas do Event Loop
    console.log(i);
  }, 0);
}
// O loop executa primeiro (i se torna 6), depois os callbacks do setTimeout comecam a executar
```

**3. Referencia do Closure**

```javascript
// Todas as funcoes callback do setTimeout referenciam o mesmo i
// Quando os callbacks executam, i ja e 6
```

#### Solucoes

**Solucao 1: Usar let (recomendado) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Saida: 1 2 3 4 5

// No caso do let
{
  let i = 1; // i da primeira iteracao
}
{
  let i = 2; // i da segunda iteracao
}
{
  let i = 3; // i da terceira iteracao
}
```

**Principio**: `let` cria um novo escopo de bloco a cada iteracao, e cada callback `setTimeout` captura o valor de `i` da iteracao atual.

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

**Solucao 2: Usar IIFE (Expressao de Funcao Imediatamente Invocada)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Saida: 1 2 3 4 5
```

**Principio**: A IIFE cria um novo escopo de funcao, e em cada iteracao, o valor atual de `i` e passado como parametro `j`, formando um Closure.

**Solucao 3: Usar o terceiro parametro do setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // O terceiro parametro e passado para a funcao callback
}
// Saida: 1 2 3 4 5
```

**Principio**: O terceiro parametro e os seguintes do `setTimeout` sao passados como argumentos para a funcao callback.

**Solucao 4: Usar bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Saida: 1 2 3 4 5
```

**Principio**: `bind` cria uma nova funcao e vincula o valor atual de `i` como parametro.

#### Comparacao de solucoes

| Solucao             | Vantagens                        | Desvantagens            | Recomendacao               |
| ------------------- | -------------------------------- | ----------------------- | -------------------------- |
| `let`               | Conciso, moderno, facil de entender | ES6+                 | 5/5 Altamente recomendado  |
| IIFE                | Boa compatibilidade              | Sintaxe complexa        | 3/5 Pode ser considerado   |
| Parametro setTimeout | Simples e direto                | Pouco conhecido         | 4/5 Recomendado            |
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

**Resposta**: `6` e impresso uma vez por segundo, totalizando 5 vezes (respectivamente a 1, 2, 3, 4 e 5 segundos).

**Q2: Como imprimir sequencialmente 1, 2, 3, 4, 5 a cada segundo?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Apos 1 segundo: 1
// Apos 2 segundos: 2
// Apos 3 segundos: 3
// Apos 4 segundos: 4
// Apos 5 segundos: 5
```

#### Pontos-chave em entrevistas

Esta pergunta avalia:

1. **Escopo de var**: Escopo de funcao vs escopo de bloco
2. **Event Loop**: Execucao sincrona vs assincrona
3. **Closure**: Como as funcoes capturam variaveis externas
4. **Solucoes**: Multiplas abordagens com vantagens e desvantagens

Ao responder, e recomendado:

- Primeiro dar a resposta correta (6 6 6 6 6)
- Explicar a razao (escopo do var + setTimeout assincrono)
- Fornecer solucoes (preferir let e explicar outras opcoes)
- Demonstrar compreensao dos mecanismos internos do JavaScript

## Melhores praticas

1. Priorizar `const`: Para variaveis que nao precisam ser reatribuidas, `const` melhora a legibilidade e a manutenibilidade do codigo.
2. Em seguida usar `let`: Quando a reatribuicao e necessaria, usar `let`.
3. Evitar `var`: Como o escopo e o comportamento de Hoisting do `var` podem causar problemas inesperados, e recomendado evita-lo no desenvolvimento JavaScript moderno.
4. Atencao a compatibilidade do navegador: Se for necessario suportar navegadores antigos, ferramentas como Babel podem transpilar `let` e `const` para `var`.

## Topicos relacionados

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
