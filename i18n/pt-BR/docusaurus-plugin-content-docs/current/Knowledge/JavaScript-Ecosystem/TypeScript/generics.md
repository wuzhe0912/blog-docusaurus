---
id: generics
title: '[Medium] Genéricos (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> O que são genéricos?

Genéricos (Generics) são uma funcionalidade poderosa do TypeScript que permite criar componentes reutilizáveis capazes de lidar com múltiplos tipos em vez de apenas um único tipo.

**Conceito central**: Ao definir funções, interfaces ou classes, não se específica um tipo concreto previamente, mas sim no momento do uso.

### Por que genéricos são necessários?

**Problema sem genéricos**:

```typescript
// Problema: precisa escrever uma função para cada tipo
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

**Solução com genéricos**:

```typescript
// Uma função para todos os tipos
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Sintaxe básica de genéricos

### Funções genéricas

```typescript
// Sintaxe: <T> representa o parâmetro de tipo
function identity<T>(arg: T): T {
  return arg;
}

// Uso 1: especificar o tipo explicitamente
let output1 = identity<string>('hello');  // output1: string

// Uso 2: deixar o TypeScript inferir o tipo
let output2 = identity('hello');  // output2: string (inferência automática)
```

### Interfaces genéricas

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

### Classes genéricas

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

> Restrições genéricas

### Restrições básicas

**Sintaxe**: Uso da palavra-chave `extends` para restringir o tipo genérico.

```typescript
// T deve ter a propriedade length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Erro: number não tem a propriedade length
```

### Restrição com keyof

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
getProperty(user, 'id');    // ❌ Erro: 'id' não é uma chave de user
```

### Múltiplas restrições

```typescript
// T deve satisfazer múltiplas condições simultaneamente
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Erro: boolean está fora do escopo da restrição
```

## 4. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Implementar função genérica

Implemente uma função genérica `first` que retorne o primeiro elemento de um array.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Sua implementação
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

**Explicação**:
- `<T>` define o parâmetro de tipo genérico
- `arr: T[]` representa um array do tipo T
- O valor de retorno `T | undefined` indica que pode ser do tipo T ou undefined

</details>

### Pergunta 2: Restrições genéricas

Implemente uma função que mescle dois objetos, mas apenas mesclando as propriedades existentes no primeiro objeto.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Sua implementação
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

**Versão avançada (mesclar apenas propriedades do primeiro objeto)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Só pode conter propriedades de obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Pergunta 3: Interface genérica

Defina uma interface genérica `Repository` para operações de acesso a dados.

```typescript
interface Repository<T> {
  // Sua definição
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

// Exemplo de implementação
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

### Pergunta 4: Restrições genéricas e keyof

Implemente uma função que obtenha o valor de uma propriedade de um objeto com base no nome da chave, garantindo a segurança de tipos.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Sua implementação
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
// const id = getValue(user, 'id');    // ❌ Erro: 'id' não é uma chave de user
```

**Explicação**:
- `K extends keyof T` garante que K deve ser uma das chaves de T
- `T[K]` representa o tipo do valor correspondente à chave K no objeto T
- Isso garante a segurança de tipos, permitindo descobrir erros em tempo de compilação

</details>

### Pergunta 5: Tipos condicionais e genéricos

Explique os resultados da inferência de tipos do código a seguir.

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

**Explicação**:
- `NonNullable<T>` é um tipo condicional (Conditional Type)
- Se T é atribuível a `null | undefined`, retorna `never`; caso contrário, retorna `T`
- Em `string | null`, `string` não atende à condição e `null` atende, portanto o resultado é `string`
- Em `string | number`, nenhum dos dois atende à condição, portanto o resultado é `string | number`

**Aplicação prática**:
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

> Padrões avançados de genéricos

### Parâmetros de tipo padrão

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Usa o tipo padrão string
const container2: Container<number> = { value: 42 };
```

### Múltiplos parâmetros de tipo

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Tipos utilitários genéricos

```typescript
// Partial: todas as propriedades se tornam opcionais
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: todas as propriedades se tornam obrigatórias
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: selecionar propriedades específicas
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: excluir propriedades específicas
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Melhores práticas

### Práticas recomendadas

```typescript
// 1. Usar nomes de genéricos significativos
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Usar restrições para limitar o escopo dos genéricos
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Fornecer parâmetros de tipo padrão
interface Config<T = string> {
  value: T;
}

// 4. Usar tipos utilitários genéricos
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Práticas a evitar

```typescript
// 1. Não abusar de genéricos
function process<T>(value: T): T {  // ⚠️ Se há apenas um tipo, genéricos não são necessários
  return value;
}

// 2. Não usar nomes de genéricos de uma única letra (exceto em casos simples)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Significado pouco claro
  // ...
}

// 3. Não ignorar restrições
function process<T>(value: T) {  // ⚠️ Se há limitações, restrições devem ser adicionadas
  return value.length;  // Possível erro
}
```

## 7. Interview Summary

> Resumo para entrevistas

### Referência rápida

**Conceitos centrais de genéricos**:
- Não especificar um tipo concreto ao definir, mas ao usar
- Sintaxe: `<T>` define o parâmetro de tipo
- Aplicável a funções, interfaces, classes

**Restrições genéricas**:
- Usar `extends` para limitar o escopo dos genéricos
- `K extends keyof T` garante que K é uma chave de T
- Possível combinar múltiplas restrições

**Padrões comuns**:
- Função genérica: `function identity<T>(arg: T): T`
- Interface genérica: `interface Box<T> { value: T; }`
- Classe genérica: `class Container<T> { ... }`

### Exemplos de respostas para entrevistas

**Q: O que são genéricos? Por que são necessários?**

> "Genéricos são um mecanismo no TypeScript para criar componentes reutilizáveis, onde o tipo concreto não é especificado na definição, mas no uso. As principais vantagens dos genéricos são: 1) Maior reutilização de código - uma função pode lidar com múltiplos tipos; 2) Manter a segurança de tipos - verificar erros de tipo em tempo de compilação; 3) Reduzir código duplicado - não é necessário escrever uma função para cada tipo. Por exemplo, `function identity<T>(arg: T): T` pode lidar com qualquer tipo sem precisar escrever funções separadas para string, number, etc."

**Q: O que são restrições genéricas? Como usá-las?**

> "Restrições genéricas usam a palavra-chave `extends` para limitar o escopo do tipo genérico. Por exemplo, `function getLength<T extends { length: number }>(arg: T)` garante que T deve ter a propriedade length. Outra restrição comum é `K extends keyof T`, que garante que K deve ser uma das chaves de T, permitindo acesso a propriedades com segurança de tipos. Restrições ajudam a manter a segurança de tipos ao usar genéricos, fornecendo as informações de tipo necessárias."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
