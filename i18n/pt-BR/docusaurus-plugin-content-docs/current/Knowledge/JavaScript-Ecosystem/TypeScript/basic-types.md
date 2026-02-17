---
id: basic-types
title: '[Easy] Tipos basicos e anotacoes de tipo'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Quais sao os tipos basicos do TypeScript?

O TypeScript fornece uma variedade de tipos basicos para definir os tipos de variaveis, parametros de funcoes e valores de retorno.

### Tipos basicos

```typescript
// 1. number: numeros (inteiros, ponto flutuante)
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

// 6. void: sem valor de retorno (usado principalmente em funcoes)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: qualquer tipo (deve ser evitado)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: tipo desconhecido (mais seguro que any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Erro: verificacao de tipo necessaria primeiro

// 9. never: valor que nunca ocorre (para funcoes que nunca retornam)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: objeto (pouco usado, recomenda-se usar interface)
let user: object = { name: 'John' };

// 11. array: array
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: tupla (array de comprimento e tipos fixos)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Anotacoes de tipo vs Inferencia de tipo

### Anotacoes de tipo (Type Annotations)

**Definicao**: Especificar explicitamente o tipo de uma variavel.

```typescript
// Especificar o tipo explicitamente
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Parametros de funcao e valores de retorno
function add(a: number, b: number): number {
  return a + b;
}
```

### Inferencia de tipo (Type Inference)

**Definicao**: O TypeScript infere automaticamente o tipo com base no valor inicial.

```typescript
// TypeScript infere automaticamente como number
let age = 30;        // age: number

// TypeScript infere automaticamente como string
let name = 'John';   // name: string

// TypeScript infere automaticamente como boolean
let isActive = true;  // isActive: boolean

// O valor de retorno da funcao tambem e inferido automaticamente
function add(a: number, b: number) {
  return a + b;  // Valor de retorno inferido automaticamente como number
}
```

### Quando usar anotacoes de tipo

**Situacoes em que o tipo deve ser especificado explicitamente**:

```typescript
// 1. Declaracao de variavel sem valor inicial
let value: number;
value = 10;

// 2. Parametros de funcao (obrigatorio)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Valor de retorno de funcao (recomenda-se especificar explicitamente)
function calculate(): number {
  return 42;
}

// 4. Tipos complexos onde a inferencia pode nao ser precisa
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Inferencia de tipo

Explique o tipo de cada variavel no codigo a seguir.

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

**Explicacao**:
- O TypeScript infere automaticamente o tipo com base no valor inicial
- Arrays sao inferidos como array do tipo dos elementos
- Objetos sao inferidos como o tipo estrutural do objeto

</details>

### Pergunta 2: Erros de tipo

Encontre os erros de tipo no codigo a seguir.

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

Explique a diferenca entre `any` e `unknown` e indique qual deve ser usado.

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
  console.log(value.toUpperCase()); // ⚠️ Compila com sucesso, mas pode falhar em tempo de execucao
}

processAny('hello');  // ✅ Execucao normal
processAny(42);       // ❌ Erro em tempo de execucao: value.toUpperCase is not a function
```

**Caso 2: usando unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Erro de compilacao: Object is of type 'unknown'

  // Verificacao de tipo necessaria primeiro
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ Seguro
  }
}
```

**Comparacao das diferencas**:

| Caracteristica | any | unknown |
| --- | --- | --- |
| Verificacao de tipo | Completamente desativada | Verificacao necessaria antes do uso |
| Seguranca | Inseguro | Seguro |
| Recomendacao | Evitar uso | Recomendado |

**Melhores praticas**:
```typescript
// ✅ Recomendado: usar unknown e verificar o tipo
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

Explique as diferencas nas seguintes declaracoes de tipos de array.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
// 1. number[]: array de numeros (escrita recomendada)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Erro

// 2. Array<number>: array generico (equivalente a number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Erro

// 3. [number, string]: tupla (Tuple) - comprimento e tipos fixos
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Erro: comprimento excede 2
arr3.push('test');   // ⚠️ TypeScript permite, mas nao e recomendado

// 4. any[]: array de qualquer tipo (nao recomendado)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (mas perde a verificacao de tipo)
```

**Recomendacoes de uso**:
- Arrays gerais: usar `number[]` ou `Array<number>`
- Estrutura fixa: usar tupla `[type1, type2]`
- Evitar `any[]`, preferir tipos concretos ou `unknown[]`

</details>

### Pergunta 5: void vs never

Explique as diferencas e cenarios de uso de `void` e `never`.

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
- **Uso**: Indica que uma funcao nao retorna um valor
- **Caracteristica**: A funcao termina normalmente, apenas nao retorna um valor
- **Cenarios de uso**: Manipuladores de eventos, funcoes com efeitos colaterais

```typescript
function logMessage(): void {
  console.log('Hello');
  // A funcao termina normalmente, nao retorna um valor
}

function onClick(): void {
  // Trata o evento de clique, nao precisa de valor de retorno
}
```

**never**:
- **Uso**: Indica que uma funcao nunca termina normalmente
- **Caracteristica**: A funcao lanca um erro ou entra em um loop infinito
- **Cenarios de uso**: Tratamento de erros, loops infinitos, type guards

```typescript
function throwError(): never {
  throw new Error('Error');
  // Nunca chegara aqui
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

**Comparacao das diferencas**:

| Caracteristica | void | never |
| --- | --- | --- |
| Fim da funcao | Termina normalmente | Nunca termina |
| Valor de retorno | undefined | Sem valor de retorno |
| Cenarios de uso | Funcoes sem valor de retorno | Tratamento de erros, loops infinitos |

</details>

## 4. Best Practices

> Melhores praticas

### Praticas recomendadas

```typescript
// 1. Preferir a inferencia de tipo
let age = 30;  // ✅ Deixar o TypeScript inferir
let name = 'John';  // ✅

// 2. Especificar explicitamente o tipo de parametros e retornos de funcoes
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Usar unknown em vez de any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Usar tipos de array especificos
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Usar tuplas para estruturas fixas
let person: [string, number] = ['John', 30];  // ✅
```

### Praticas a evitar

```typescript
// 1. Evitar o uso de any
let value: any = 'hello';  // ❌

// 2. Evitar anotacoes de tipo desnecessarias
let age: number = 30;  // ⚠️ Pode ser simplificado para let age = 30;

// 3. Evitar o tipo object
let user: object = { name: 'John' };  // ❌ Usar interface e melhor

// 4. Evitar arrays de tipos mistos (a menos que necessario)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Considerar se e realmente necessario
```

## 5. Interview Summary

> Resumo para entrevistas

### Referencia rapida

**Tipos basicos**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (sem valor de retorno), `never` (nunca retorna)
- `any` (qualquer tipo, evitar uso), `unknown` (tipo desconhecido, uso recomendado)

**Anotacoes de tipo vs Inferencia**:
- Anotacao de tipo: especificar explicitamente `let age: number = 30`
- Inferencia de tipo: inferencia automatica `let age = 30`

**Tipos de array**:
- `number[]` ou `Array<number>`: array geral
- `[number, string]`: tupla (estrutura fixa)

### Exemplos de respostas para entrevistas

**Q: Quais sao os tipos basicos do TypeScript?**

> "O TypeScript fornece muitos tipos basicos, incluindo number, string, boolean, null, undefined. Tambem existem alguns tipos especiais: void indica ausencia de valor de retorno, usado principalmente em funcoes; never indica um valor que nunca ocorre, usado para funcoes que nunca retornam; any e qualquer tipo, mas deve ser evitado; unknown e um tipo desconhecido, mais seguro que any, requerendo verificacao de tipo antes do uso. Alem disso, existem o tipo de array number[] e o tipo de tupla [number, string]."

**Q: Qual e a diferenca entre any e unknown?**

> "any desativa completamente a verificacao de tipo, permitindo usar diretamente qualquer propriedade ou metodo, o que e inseguro. unknown requer uma verificacao de tipo antes do uso, sendo mais seguro. Por exemplo, ao usar unknown, e necessario primeiro verificar o tipo com typeof antes de poder chamar os metodos correspondentes. Recomenda-se preferir unknown em vez de any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
