---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> Qual é a diferença entre `==` e `===`?

Ambos são operadores de comparação. `==` compara se dois valores são iguais, enquanto `===` compara se dois valores são iguais e do mesmo tipo. Portanto, o segundo pode ser considerado como o modo estrito.

O primeiro, devido ao design do JavaScript, realiza conversão automática de tipos, o que gera muitos resultados pouco intuitivos. Por exemplo:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Isso representa uma grande carga cognitiva para os desenvolvedores, por isso é geralmente recomendado usar `===` em vez de `==` para evitar erros inesperados.

**Melhores práticas**: Sempre use `===` e `!==`, a menos que você saiba muito bem por que precisa usar `==`.

### Perguntas de entrevista

#### Pergunta 1: Comparação de tipos básicos

Determine o resultado das seguintes expressões:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Resposta:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Explicação:**

- **`==` (operador de igualdade)**: Realiza conversão de tipo
  - A string `'1'` é convertida para o número `1`
  - Em seguida compara `1 == 1`, o resultado é `true`
- **`===` (operador de igualdade estrita)**: Não realiza conversão de tipo
  - `number` e `string` são tipos diferentes, retorna diretamente `false`

**Regras de conversão de tipo:**

```javascript
// Ordem de prioridade de conversão de tipo com ==
// 1. Se houver um number, converter o outro lado para number
'1' == 1; // '1' → 1, resultado true
'2' == 2; // '2' → 2, resultado true
'0' == 0; // '0' → 0, resultado true

// 2. Se houver um boolean, converter boolean para number
true == 1; // true → 1, resultado true
false == 0; // false → 0, resultado true
'1' == true; // '1' → 1, true → 1, resultado true

// 3. Armadilha na conversão de string para número
'' == 0; // '' → 0, resultado true
' ' == 0; // ' ' → 0, resultado true (string com espaços é convertida para 0)
```

#### Pergunta 2: Comparação de null e undefined

Determine o resultado das seguintes expressões:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Resposta:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Explicação:**

Esta é uma **regra especial** do JavaScript:

- **`undefined == null`**: `true`
  - A especificação ES define especialmente: `null` e `undefined` são iguais quando comparados com `==`
  - Este é o único cenário onde `==` é útil: verificar se uma variável é `null` ou `undefined`
- **`undefined === null`**: `false`
  - São tipos diferentes (`undefined` é do tipo `undefined`, `null` é do tipo `object`)
  - Não são iguais na comparação estrita

**Aplicação prática:**

```javascript
// Verificar se uma variável é null ou undefined
function isNullOrUndefined(value) {
  return value == null; // Verifica null e undefined simultaneamente
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// Equivalente (mas mais conciso)
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Armadilhas a observar:**

```javascript
// null e undefined só são iguais entre si
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// Mas com ===, só são iguais a si mesmos
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Pergunta 3: Comparação abrangente

Determine o resultado das seguintes expressões:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Resposta:**

```javascript
0 == false; // true (false → 0)
0 === false; // false (tipos diferentes: number vs boolean)
'' == false; // true ('' → 0, false → 0)
'' === false; // false (tipos diferentes: string vs boolean)
null == false; // false (null só é igual a null e undefined)
undefined == false; // false (undefined só é igual a null e undefined)
```

**Diagrama do fluxo de conversão:**

```javascript
// Processo de conversão de 0 == false
0 == false;
0 == 0; // false é convertido para o número 0
true; // resultado

// Processo de conversão de '' == false
'' == false;
'' == 0; // false é convertido para o número 0
0 == 0; // '' é convertido para o número 0
true; // resultado

// Caso especial de null == false
null == false;
// null não é convertido! Conforme a especificação, null só é igual a null e undefined
false; // resultado
```

#### Pergunta 4: Comparação de objetos

Determine o resultado das seguintes expressões:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Resposta:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Explicação:**

- A comparação de objetos (incluindo arrays e objetos) é uma **comparação por referência**
- Mesmo que o conteúdo seja o mesmo, se forem instâncias diferentes, não são iguais
- `==` e `===` se comportam da mesma forma para objetos (ambos comparam referências)

```javascript
// Só são iguais se a referência for a mesma
const arr1 = [];
const arr2 = arr1; // Referência ao mesmo array
arr1 == arr2; // true
arr1 === arr2; // true

// Mesmo conteúdo, mas instâncias diferentes
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false (referências diferentes)
arr3 === arr4; // false (referências diferentes)

// O mesmo vale para objetos
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Memorização rápida para entrevistas

**Regras de conversão de tipo do `==` (prioridade de cima para baixo):**

1. `null == undefined` → `true` (regra especial)
2. `number == string` → converter string para number
3. `number == boolean` → converter boolean para number
4. `string == boolean` → converter ambos para number
5. Objetos comparam referências, sem conversão

**Regras do `===` (simples):**

1. Tipos diferentes → `false`
2. Mesmo tipo → comparar valor (tipos básicos) ou referência (tipos de objeto)

**Melhores práticas:**

```javascript
// ✅ Sempre usar ===
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ Única exceção: verificar null/undefined
if (value == null) {
  // value é null ou undefined
}

// ❌ Evitar usar == (exceto no caso acima)
if (value == 0) {
} // não recomendado
if (name == 'Alice') {
} // não recomendado
```

**Exemplo de resposta em entrevista:**

> "`==` realiza conversão de tipo, o que pode levar a resultados pouco intuitivos, como `0 == '0'` ser `true`. `===` é uma comparação estrita que não realiza conversão de tipo; se os tipos forem diferentes, retorna diretamente `false`.
>
> A melhor prática é sempre usar `===`, com a única exceção de `value == null` para verificar `null` e `undefined` simultaneamente.
>
> É importante notar que `null == undefined` é `true`, mas `null === undefined` é `false`, isso é uma regra especial do JavaScript."

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> Qual é a diferença entre `&&` e `||`? Explique a avaliação de curto-circuito

### Conceito básico

- **`&&` (AND)**: Quando o lado esquerdo é `falsy`, retorna diretamente o valor da esquerda sem executar o lado direito
- **`||` (OR)**: Quando o lado esquerdo é `truthy`, retorna diretamente o valor da esquerda sem executar o lado direito

### Exemplo de avaliação de curto-circuito

```js
// && avaliação de curto-circuito
const user = null;
const name = user && user.name; // user é falsy, retorna null diretamente, não acessa user.name
console.log(name); // null (sem erro)

// || avaliação de curto-circuito
const defaultName = 'Guest';
const userName = user || defaultName; // user é falsy, retorna o defaultName da direita
console.log(userName); // 'Guest'

// Aplicação prática
function greet(name) {
  const displayName = name || 'Anonymous'; // Se name não for passado, usa o valor padrão
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Armadilhas comuns ⚠️

```js
// Problema: 0 e '' também são falsy
const count = 0;
const result = count || 10; // 0 é falsy, retorna 10
console.log(result); // 10 (pode não ser o resultado desejado)

// Solução: Usar ?? (Nullish Coalescing)
const betterResult = count ?? 10; // Só retorna 10 para null/undefined
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> O que é o operador Optional Chaining `?.`?

### Cenário do problema

A forma tradicional de escrever é propensa a erros:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ Perigoso: Se address não existir, gera um erro
console.log(user.address.city); // Normal
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ Seguro mas verboso
const city = user && user.address && user.address.city;
```

### Uso do Optional Chaining

```js
// ✅ Conciso e seguro
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (sem erro)

// Também pode ser usado para chamadas de métodos
user?.getName?.(); // Só executa se getName existir

// Também pode ser usado para arrays
const firstItem = users?.[0]?.name; // Acesso seguro ao nome do primeiro usuário
```

### Aplicação prática

```js
// Processamento de resposta da API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// Operações DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> O que é o operador Nullish Coalescing `??`?

### Diferença em relação ao `||`

```js
// || trata todos os valores falsy como falsos
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? trata apenas null e undefined como valores vazios
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Aplicação prática

```js
// Tratamento de valores que podem ser 0
function updateScore(newScore) {
  // ✅ Correto: 0 é uma pontuação válida
  const score = newScore ?? 100; // Se for 0, mantém 0; usa 100 apenas para null/undefined
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// Tratamento de valores de configuração
const config = {
  timeout: 0, // 0 milissegundos é uma configuração válida
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0 (mantém a configuração de 0)
const retries = config.maxRetries ?? 3; // 3 (null usa o valor padrão)
```

### Uso combinado

```js
// ?? e ?. são frequentemente usados juntos
const userAge = user?.profile?.age ?? 18; // Se não houver dados de idade, padrão 18

// Caso prático: Valores padrão de formulário
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 é uma idade válida
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> Qual é a diferença entre `i++` e `++i`?

### Diferença básica

- **`i++` (pós-fixo)**: Primeiro retorna o valor atual, depois adiciona 1
- **`++i` (pré-fixo)**: Primeiro adiciona 1, depois retorna o novo valor

### Exemplo

```js
let a = 5;
let b = a++; // b = 5, a = 6 (primeiro atribui a b, depois incrementa)
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6 (primeiro incrementa, depois atribui a d)
console.log(c, d); // 6, 6
```

### Impacto prático

```js
// Em loops normalmente não há diferença (porque o valor de retorno não é usado)
for (let i = 0; i < 5; i++) {} // ✅ Comum
for (let i = 0; i < 5; ++i) {} // ✅ Também válido, alguns acreditam ser ligeiramente mais rápido (na prática não há diferença nos motores JS modernos)

// Mas em expressões há diferença
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1 (primeiro obtém o valor com i=0, depois i se torna 1)
console.log(arr[++i]); // 3 (i primeiro se torna 2, depois obtém o valor)
```

### Melhores práticas

```js
// ✅ Claro: escrever separadamente
let count = 0;
const value = arr[count];
count++;

// ⚠️ Não recomendado: fácil de confundir
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> O que é o operador ternário? Quando deve ser usado?

### Sintaxe básica

```js
condition ? valueIfTrue : valueIfFalse;
```

### Exemplo simples

```js
// if-else tradicional
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ Operador ternário: mais conciso
const message = age >= 18 ? 'Adult' : 'Minor';
```

### Cenários adequados para uso

```js
// 1. Atribuição condicional simples
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. Renderização condicional em JSX/templates
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. Definir valores padrão (combinado com outros operadores)
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. Valor de retorno de função
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Cenários a evitar

```js
// ❌ Aninhamento muito profundo, difícil de ler
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ Usar if-else ou switch é mais claro
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ Lógica complexa
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ Dividir em várias linhas
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## Cartão de memorização rápida

| Operador      | Uso                  | Ponto chave                                  |
| ------------- | -------------------- | -------------------------------------------- |
| `===`         | Igualdade estrita    | Sempre use este, esqueça o `==`              |
| `&&`          | Curto-circuito AND   | Esquerda falso: para e retorna valor falso   |
| `\|\|`        | Curto-circuito OR    | Esquerda verdadeiro: para e retorna valor verdadeiro |
| `?.`          | Optional Chaining    | Acesso seguro, sem erros                     |
| `??`          | Nullish Coalescing   | Só lida com null/undefined                   |
| `++i` / `i++` | Auto-incremento     | Pré-fixo: incrementa primeiro; pós-fixo: depois |
| `? :`         | Operador ternário    | Para condições simples, evitar aninhamento   |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
