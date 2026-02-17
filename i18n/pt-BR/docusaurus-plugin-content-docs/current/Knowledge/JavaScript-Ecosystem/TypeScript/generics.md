---
id: generics
title: '[Medium] Genericos (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> O que sao genericos?

Genericos (Generics) sao uma funcionalidade poderosa do TypeScript que permite criar componentes reutilizaveis capazes de lidar com multiplos tipos em vez de apenas um unico tipo.

**Conceito central**: Ao definir funcoes, interfaces ou classes, nao se especifica um tipo concreto previamente, mas sim no momento do uso.

### Por que genericos sao necessarios?

**Problema sem genericos**:

```typescript
// Problema: precisa escrever uma funcao para cada tipo
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**Solucao com genericos**:

```typescript
// Uma funcao para todos os tipos
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Sintaxe basica de genericos

### Funcoes genericas

```typescript
// Sintaxe: <T> representa o parametro de tipo
function identity<T>(arg: T): T {
  return arg;
}

// Uso 1: especificar o tipo explicitamente
let output1 = identity<string>('hello');  // output1: string

// Uso 2: deixar o TypeScript inferir o tipo
let output2 = identity('hello');  // output2: string (inferencia automatica)
```

### Interfaces genericas

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### Classes genericas

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> Restricoes genericas

### Restricoes basicas

**Sintaxe**: Uso da palavra-chave `extends` para restringir o tipo generico.

```typescript
// T deve ter a propriedade length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Erro: number nao tem a propriedade length
```

### Restricao com keyof

```typescript
// K deve ser uma chave de T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ Erro: 'id' nao e uma chave de user
```

### Multiplas restricoes

```typescript
// T deve satisfazer multiplas condicoes simultaneamente
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Erro: boolean esta fora do escopo da restricao
```

## 4. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Implementar funcao generica

Implemente uma funcao generica `first` que retorne o primeiro elemento de um array.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Sua implementacao
}
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Exemplo de uso
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**Explicacao**:
- `<T>` define o parametro de tipo generico
- `arr: T[]` representa um array do tipo T
- O valor de retorno `T | undefined` indica que pode ser do tipo T ou undefined

</details>

### Pergunta 2: Restricoes genericas

Implemente uma funcao que mescle dois objetos, mas apenas mesclando as propriedades existentes no primeiro objeto.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Sua implementacao
}
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// Exemplo de uso
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**Versao avancada (mesclar apenas propriedades do primeiro objeto)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // So pode conter propriedades de obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Pergunta 3: Interface generica

Defina uma interface generica `Repository` para operacoes de acesso a dados.

```typescript
interface Repository<T> {
  // Sua definicao
}
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Exemplo de implementacao
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### Pergunta 4: Restricoes genericas e keyof

Implemente uma funcao que obtenha o valor de uma propriedade de um objeto com base no nome da chave, garantindo a seguranca de tipos.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Sua implementacao
}
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Exemplo de uso
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ Erro: 'id' nao e uma chave de user
```

**Explicacao**:
- `K extends keyof T` garante que K deve ser uma das chaves de T
- `T[K]` representa o tipo do valor correspondente a chave K no objeto T
- Isso garante a seguranca de tipos, permitindo descobrir erros em tempo de compilacao

</details>

### Pergunta 5: Tipos condicionais e genericos

Explique os resultados da inferencia de tipos do codigo a seguir.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Explicacao**:
- `NonNullable<T>` e um tipo condicional (Conditional Type)
- Se T e atribuivel a `null | undefined`, retorna `never`; caso contrario, retorna `T`
- Em `string | null`, `string` nao atende a condicao e `null` atende, portanto o resultado e `string`
- Em `string | number`, nenhum dos dois atende a condicao, portanto o resultado e `string | number`

**Aplicacao pratica**:
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> Padroes avancados de genericos

### Parametros de tipo padrao

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Usa o tipo padrao string
const container2: Container<number> = { value: 42 };
```

### Multiplos parametros de tipo

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Tipos utilitarios genericos

```typescript
// Partial: todas as propriedades se tornam opcionais
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: todas as propriedades se tornam obrigatorias
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: selecionar propriedades especificas
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: excluir propriedades especificas
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Melhores praticas

### Praticas recomendadas

```typescript
// 1. Usar nomes de genericos significativos
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Usar restricoes para limitar o escopo dos genericos
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Fornecer parametros de tipo padrao
interface Config<T = string> {
  value: T;
}

// 4. Usar tipos utilitarios genericos
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Praticas a evitar

```typescript
// 1. Nao abusar de genericos
function process<T>(value: T): T {  // ⚠️ Se ha apenas um tipo, genericos nao sao necessarios
  return value;
}

// 2. Nao usar nomes de genericos de uma unica letra (exceto em casos simples)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Significado pouco claro
  // ...
}

// 3. Nao ignorar restricoes
function process<T>(value: T) {  // ⚠️ Se ha limitacoes, restricoes devem ser adicionadas
  return value.length;  // Possivel erro
}
```

## 7. Interview Summary

> Resumo para entrevistas

### Referencia rapida

**Conceitos centrais de genericos**:
- Nao especificar um tipo concreto ao definir, mas ao usar
- Sintaxe: `<T>` define o parametro de tipo
- Aplicavel a funcoes, interfaces, classes

**Restricoes genericas**:
- Usar `extends` para limitar o escopo dos genericos
- `K extends keyof T` garante que K e uma chave de T
- Possivel combinar multiplas restricoes

**Padroes comuns**:
- Funcao generica: `function identity<T>(arg: T): T`
- Interface generica: `interface Box<T> { value: T; }`
- Classe generica: `class Container<T> { ... }`

### Exemplos de respostas para entrevistas

**Q: O que sao genericos? Por que sao necessarios?**

> "Genericos sao um mecanismo no TypeScript para criar componentes reutilizaveis, onde o tipo concreto nao e especificado na definicao, mas no uso. As principais vantagens dos genericos sao: 1) Maior reutilizacao de codigo - uma funcao pode lidar com multiplos tipos; 2) Manter a seguranca de tipos - verificar erros de tipo em tempo de compilacao; 3) Reduzir codigo duplicado - nao e necessario escrever uma funcao para cada tipo. Por exemplo, `function identity<T>(arg: T): T` pode lidar com qualquer tipo sem precisar escrever funcoes separadas para string, number, etc."

**Q: O que sao restricoes genericas? Como usa-las?**

> "Restricoes genericas usam a palavra-chave `extends` para limitar o escopo do tipo generico. Por exemplo, `function getLength<T extends { length: number }>(arg: T)` garante que T deve ter a propriedade length. Outra restricao comum e `K extends keyof T`, que garante que K deve ser uma das chaves de T, permitindo acesso a propriedades com seguranca de tipos. Restricoes ajudam a manter a seguranca de tipos ao usar genericos, fornecendo as informacoes de tipo necessarias."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
