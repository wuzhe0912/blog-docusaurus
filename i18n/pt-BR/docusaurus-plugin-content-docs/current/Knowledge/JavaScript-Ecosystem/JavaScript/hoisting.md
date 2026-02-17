---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

A execução do JS pode ser dividida em duas fases: a fase de criação e a fase de execução:

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

Devido à característica do Hoisting, o código acima deve ser entendido como: primeiro a variável é declarada e depois o valor é atribuído.

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

As funções são diferentes das variáveis — elas são alocadas na memória durante a fase de criação. A declaração de função é a seguinte:

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

O código acima consegue executar normalmente e imprimir o console.log sem gerar erro por causa da seguinte lógica: a function é primeiro elevada ao topo, e só depois a chamada da function é executada.

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

No entanto, é preciso notar que essa característica de Hoisting exige atenção à ordem de escrita ao usar expressões.

Na fase de criação, a function tem a maior prioridade, seguida pelas variáveis.

### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，pois o valor ainda não foi atribuído, apenas o undefined padrão é retornado
name = 'Pitt';
```

## 2. What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name em `whoseName()` recebe undefined, portanto a condição não é atendida.

Porém, como há outra atribuição abaixo da declaração de função, mesmo que a condição dentro da function fosse atendida, o resultado final seria a impressão de Pitt.

---

## 3. Declaração de função vs Declaração de variável: Prioridade do Hoisting

### Questão: Função e variável com o mesmo nome

Determine o resultado de saída do seguinte código:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Resposta incorreta (equívoco comum)

Muitas pessoas pensam que:

- A saída é `undefined` (achando que var é elevado primeiro)
- A saída é `'1'` (achando que a atribuição tem impacto)
- Ocorre um erro (achando que nomes iguais causam conflito)

### Saída real

```js
[Function: foo]
```

### Por quê?

Esta questão examina as **regras de prioridade** do Hoisting:

**Prioridade do Hoisting: Declaração de função > Declaração de variável**

```js
// Codigo original
console.log(foo);
var foo = '1';
function foo() {}

// Equivalente a (apos Hoisting)
// Fase 1: Fase de criacao (Hoisting)
function foo() {} // 1. Declaracao de funcao elevada primeiro
var foo; // 2. Declaracao de variavel elevada (mas nao sobrescreve a funcao existente)

// Fase 2: Fase de execucao
console.log(foo); // Neste momento foo e uma funcao, saida [Function: foo]
foo = '1'; // 3. Atribuicao de variavel (sobrescreve a funcao)
```

### Conceitos-chave

**1. Declarações de função são completamente elevadas**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. Declarações de variável com var só elevam a declaração, não a atribuição**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Quando declaração de função e declaração de variável têm o mesmo nome**

```js
// Ordem apos a elevacao
function foo() {} // Funcao elevada primeiro e atribuida
var foo; // Declaracao de variavel elevada, mas nao sobrescreve a funcao existente

// Portanto foo e uma funcao
console.log(foo); // [Function: foo]
```

### Fluxo de execução completo

```js
// Codigo original
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Equivalente a ========

// Fase de criacao (Hoisting)
function foo() {} // 1. Declaracao de funcao elevada (elevacao completa, incluindo o corpo da funcao)
var foo; // 2. Declaracao de variavel elevada (mas nao sobrescreve foo, pois ja e uma funcao)

// Fase de execucao
console.log(foo); // [Function: foo] - foo e uma funcao
foo = '1'; // 3. Atribuicao de variavel (somente agora sobrescreve a funcao)
console.log(foo); // '1' - foo se torna uma string
```

### Exercícios avançados

#### Exercício A: Influência da ordem

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Resposta:**

```js
[Function: foo] // Primeira saida
'1' // Segunda saida
```

**Razão:** A ordem do código não afeta o resultado do Hoisting. A prioridade de elevação continua sendo: função > variável.

#### Exercício B: Múltiplas funções com o mesmo nome

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**Resposta:**

```js
[Function: foo] { return 2; } // Primeira saida (a funcao posterior sobrescreve a anterior)
'1' // Segunda saida (atribuicao de variavel sobrescreve a funcao)
```

**Razão:**

```js
// Apos a elevacao
function foo() {
  return 1;
} // Primeira funcao

function foo() {
  return 2;
} // Segunda funcao sobrescreve a primeira

var foo; // Declaracao de variavel (nao sobrescreve a funcao)

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // Atribuicao de variavel (sobrescreve a funcao)
console.log(foo); // '1'
```

#### Exercício C: Expressão de função vs Declaração de função

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**Resposta:**

```js
undefined; // foo e undefined
[Function: bar] // bar e uma funcao
```

**Razão:**

```js
// Apos a elevacao
var foo; // Declaracao de variavel elevada (expressao de funcao so eleva o nome da variavel)
function bar() {
  return 2;
} // Declaracao de funcao elevada completamente

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // Atribuicao da expressao de funcao
```

**Diferença fundamental:**

- **Declaração de função**: `function foo() {}` → elevada completamente (incluindo o corpo da função)
- **Expressão de função**: `var foo = function() {}` → apenas o nome da variável é elevado, o corpo da função não

### let/const não têm esse problema

```js
// var tem problemas de elevacao
console.log(foo); // undefined
var foo = '1';

// let/const tem Zona Morta Temporal (TDZ)
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// let/const com mesmo nome de funcao causa erro
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Resumo da prioridade do Hoisting

```
Prioridade do Hoisting (da mais alta para a mais baixa):

1. Declaração de função (Function Declaration)
   ├─ function foo() {} ✅ elevação completa
   └─ prioridade mais alta

2. Declaração de variável (Variable Declaration)
   ├─ var foo ⚠️ apenas a declaração é elevada, não a atribuição
   └─ não sobrescreve funções existentes

3. Atribuição de variável (Variable Assignment)
   ├─ foo = '1' ✅ sobrescreve a função
   └─ ocorre na fase de execução

4. Expressão de função (Function Expression)
   ├─ var foo = function() {} ⚠️ tratada como atribuição de variável
   └─ apenas o nome da variável é elevado, não o corpo da função
```

### Pontos-chave em entrevistas

Ao responder este tipo de pergunta, é recomendado:

1. **Explicar o mecanismo do Hoisting**: Dividido em fase de criação e fase de execução
2. **Enfatizar a prioridade**: Declaração de função > Declaração de variável
3. **Desenhar o código após o Hoisting**: Mostrar ao entrevistador sua compreensão
4. **Mencionar as melhores práticas**: Usar let/const para evitar problemas de Hoisting com var

**Exemplo de resposta em entrevista:**

> "Esta questão examina a prioridade do Hoisting. Em JavaScript, a declaração de função tem prioridade de elevação maior que a declaração de variável.
>
> O processo de execução se divide em duas fases:
>
> 1. Fase de criação: `function foo() {}` é completamente elevada ao topo, depois a declaração `var foo` é elevada, mas não sobrescreve a função existente.
> 2. Fase de execução: Em `console.log(foo)`, foo é uma função neste momento, então `[Function: foo]` é exibido. Depois, `foo = '1'` sobrescreve foo com uma string.
>
> A melhor prática é usar `let`/`const` no lugar de `var`, e colocar as declarações de função no topo para evitar esse tipo de confusão."

---

## Tópicos relacionados

- [Diferenças entre var, let, const](/docs/let-var-const-differences)
