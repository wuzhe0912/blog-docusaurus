---
id: basic-types
title: '[Easy] Tipos básicos e anotações de tipo'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Quais são os tipos básicos do TypeScript?

O TypeScript fornece uma variedade de tipos básicos para definir os tipos de variáveis, parâmetros de funções e valores de retorno.

### Tipos básicos

```typescript
// 1. number: números (inteiros, ponto flutuante)
let age: number = 30;
let price: number = 99.99;

// 2. string: strings
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean: valores booleanos
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null: valor nulo
let data: null = null;

// 5. undefined: indefinido
let value: undefined = undefined;

// 6. void: sem valor de retorno (usado principalmente em funções)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: qualquer tipo (deve ser evitado)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: tipo desconhecido (mais seguro que any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Erro: verificação de tipo necessária primeiro

// 9. never: valor que nunca ocorre (para funções que nunca retornam)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: objeto (pouco usado, recomenda-se usar interface)
let user: object = { name: 'John' };

// 11. array: array
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: tupla (array de comprimento é tipos fixos)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Anotações de tipo vs Inferência de tipo

### Anotações de tipo (Type Annotations)

**Definição**: Especificar explicitamente o tipo de uma variável.

```typescript
// Especificar o tipo explicitamente
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Parâmetros de função é valores de retorno
function add(a: number, b: number): number {
  return a + b;
}
```

### Inferência de tipo (Type Inference)

**Definição**: O TypeScript infere automaticamente o tipo com base no valor inicial.

```typescript
// TypeScript infere automaticamente como number
let age = 30;        // age: number

// TypeScript infere automaticamente como string
let name = 'John';   // name: string

// TypeScript infere automaticamente como boolean
let isActive = true;  // isActive: boolean

// O valor de retorno da função também é inferido automaticamente
function add(a: number, b: number) {
  return a + b;  // Valor de retorno inferido automaticamente como number
}
```

### Quando usar anotações de tipo

**Situações em que o tipo deve ser especificado explicitamente**:

```typescript
// 1. Declaração de variável sem valor inicial
let value: number;
value = 10;

// 2. Parâmetros de função (obrigatório)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Valor de retorno de função (recomenda-se especificar explicitamente)
function calculate(): number {
  return 42;
}

// 4. Tipos complexos onde a inferência pode não ser precisa
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Inferência de tipo

Explique o tipo de cada variável no código a seguir.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Explicação**:
- O TypeScript infere automaticamente o tipo com base no valor inicial
- Arrays são inferidos como array do tipo dos elementos
- Objetos são inferidos como o tipo estrutural do objeto

</details>

### Pergunta 2: Erros de tipo

Encontre os erros de tipo no código a seguir.

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**Forma correta de escrever**:
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### Pergunta 3: any vs unknown

Explique a diferença entre `any` e `unknown` e indique qual deve ser usado.

```typescript
// Caso 1: usando any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// Caso 2: usando unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Caso 1: usando any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ Compila com sucesso, mas pode falhar em tempo de execução
}

processAny('hello');  // ✅ Execução normal
processAny(42);       // ❌ Erro em tempo de execução: value.toUpperCase is not a function
```

**Caso 2: usando unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Erro de compilação: Object is of type 'unknown'

  // Verificação de tipo necessária primeiro
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ Seguro
  }
}
```

**Comparação das diferenças**:

| Característica | any | unknown |
| --- | --- | --- |
| Verificação de tipo | Completamente desativada | Verificação necessária antes do uso |
| Segurança | Inseguro | Seguro |
| Recomendação | Evitar uso | Recomendado |

**Melhores práticas**:
```typescript
// ✅ Recomendado: usar unknown é verificar o tipo
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ Evitar: usar any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Inseguro
}
```

</details>

### Pergunta 4: Tipos de array

Explique as diferenças nas seguintes declarações de tipos de array.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
// 1. number[]: array de números (escrita recomendada)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Erro

// 2. Array<number>: array genérico (equivalente a number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Erro

// 3. [number, string]: tupla (Tuple) - comprimento é tipos fixos
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Erro: comprimento excede 2
arr3.push('test');   // ⚠️ TypeScript permite, mas não é recomendado

// 4. any[]: array de qualquer tipo (não recomendado)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (mas perde a verificação de tipo)
```

**Recomendações de uso**:
- Arrays gerais: usar `number[]` ou `Array<number>`
- Estrutura fixa: usar tupla `[type1, type2]`
- Evitar `any[]`, preferir tipos concretos ou `unknown[]`

</details>

### Pergunta 5: void vs never

Explique as diferenças e cenários de uso de `void` e `never`.

```typescript
// Caso 1: void
function logMessage(): void {
  console.log('Hello');
}

// Caso 2: never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // Loop infinito
  }
}
```

<details>
<summary>Clique para ver a resposta</summary>

**void**:
- **Uso**: Indica que uma função não retorna um valor
- **Característica**: A função termina normalmente, apenas não retorna um valor
- **Cenários de uso**: Manipuladores de eventos, funções com efeitos colaterais

```typescript
function logMessage(): void {
  console.log('Hello');
  // A função termina normalmente, não retorna um valor
}

function onClick(): void {
  // Trata o evento de clique, não precisa de valor de retorno
}
```

**never**:
- **Uso**: Indica que uma função nunca termina normalmente
- **Característica**: A função lança um erro ou entra em um loop infinito
- **Cenários de uso**: Tratamento de erros, loops infinitos, type guards

```typescript
function throwError(): never {
  throw new Error('Error');
  // Nunca chegará aqui
}

function infiniteLoop(): never {
  while (true) {
    // Nunca termina
  }
}

// Uso em type guards
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**Comparação das diferenças**:

| Característica | void | never |
| --- | --- | --- |
| Fim da função | Termina normalmente | Nunca termina |
| Valor de retorno | undefined | Sem valor de retorno |
| Cenários de uso | Funções sem valor de retorno | Tratamento de erros, loops infinitos |

</details>

## 4. Best Practices

> Melhores práticas

### Práticas recomendadas

```typescript
// 1. Preferir a inferência de tipo
let age = 30;  // ✅ Deixar o TypeScript inferir
let name = 'John';  // ✅

// 2. Especificar explicitamente o tipo de parâmetros é retornos de funções
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Usar unknown em vez de any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Usar tipos de array específicos
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Usar tuplas para estruturas fixas
let person: [string, number] = ['John', 30];  // ✅
```

### Práticas a evitar

```typescript
// 1. Evitar o uso de any
let value: any = 'hello';  // ❌

// 2. Evitar anotações de tipo desnecessárias
let age: number = 30;  // ⚠️ Pode ser simplificado para let age = 30;

// 3. Evitar o tipo object
let user: object = { name: 'John' };  // ❌ Usar interface é melhor

// 4. Evitar arrays de tipos mistos (a menos que necessário)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Considerar se é realmente necessário
```

## 5. Interview Summary

> Resumo para entrevistas

### Referência rápida

**Tipos básicos**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (sem valor de retorno), `never` (nunca retorna)
- `any` (qualquer tipo, evitar uso), `unknown` (tipo desconhecido, uso recomendado)

**Anotações de tipo vs Inferência**:
- Anotação de tipo: especificar explicitamente `let age: number = 30`
- Inferência de tipo: inferência automática `let age = 30`

**Tipos de array**:
- `number[]` ou `Array<number>`: array geral
- `[number, string]`: tupla (estrutura fixa)

### Exemplos de respostas para entrevistas

**Q: Quais são os tipos básicos do TypeScript?**

> "O TypeScript fornece muitos tipos básicos, incluindo number, string, boolean, null, undefined. Também existem alguns tipos especiais: void indica ausência de valor de retorno, usado principalmente em funções; never indica um valor que nunca ocorre, usado para funções que nunca retornam; any é qualquer tipo, mas deve ser evitado; unknown é um tipo desconhecido, mais seguro que any, requerendo verificação de tipo antes do uso. Além disso, existem o tipo de array number[] é o tipo de tupla [number, string]."

**Q: Qual é a diferença entre any e unknown?**

> "any desativa completamente a verificação de tipo, permitindo usar diretamente qualquer propriedade ou método, o que é inseguro. unknown requer uma verificação de tipo antes do uso, sendo mais seguro. Por exemplo, ao usar unknown, é necessário primeiro verificar o tipo com typeof antes de poder chamar os métodos correspondentes. Recomenda-se preferir unknown em vez de any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
