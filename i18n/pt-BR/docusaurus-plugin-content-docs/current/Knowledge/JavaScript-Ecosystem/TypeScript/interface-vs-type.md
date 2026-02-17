---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> O que sao Interface e Type Alias?

### Interface

**Definicao**: Usada para definir a estrutura de um objeto, descrevendo quais propriedades e metodos o objeto deve ter.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Propriedade opcional
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Alias de tipo)

**Definicao**: Cria um alias para um tipo, que pode ser usado com qualquer tipo, nao apenas objetos.

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Principais diferencas entre Interface e Type Alias

### 1. Metodo de extensao

**Interface: usando extends**

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

**Type Alias: usando tipo de intersecao**

```typescript
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

### 2. Fusao (Declaration Merging)

**Interface: suporta fusao**

```typescript
interface User { name: string; }
interface User { age: number; }
// Automaticamente fundido em { name: string; age: number; }
const user: User = { name: 'John', age: 30 };
```

**Type Alias: nao suporta fusao**

```typescript
type User = { name: string; };
type User = { age: number; };  // ❌ Erro: Duplicate identifier 'User'
```

### 3. Escopo de aplicacao

**Interface: principalmente para estruturas de objetos**

```typescript
interface User { name: string; age: number; }
```

**Type Alias: utilizavel com qualquer tipo**

```typescript
type ID = string | number;
type Greet = (name: string) => string;
type Status = 'active' | 'inactive' | 'pending';
type Point = [number, number];
type User = { name: string; age: number; };
```

### 4. Propriedades computadas

**Interface: nao suporta propriedades computadas**

```typescript
interface User { [key: string]: any; }
```

**Type Alias: suporta operacoes de tipo mais complexas**

```typescript
type Keys = 'name' | 'age' | 'email';
type User = { [K in Keys]: string; };
```

## 3. When to Use Interface vs Type Alias?

> Quando usar Interface? Quando usar Type Alias?

### Usar Interface quando

1. **Definir estruturas de objetos** (mais comum)
2. **Fusao de declaracoes e necessaria** (ex. estender tipos de pacotes de terceiros)
3. **Definir contratos de classe**

### Usar Type Alias quando

1. **Definir tipos union ou intersecao**: `type ID = string | number;`
2. **Definir tipos de funcao**: `type EventHandler = (event: Event) => void;`
3. **Definir tuplas**: `type Point = [number, number];`
4. **Tipos mapeados ou condicionais sao necessarios**

## 4. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Diferencas basicas

Explique as diferencas entre as duas formas de definicao a seguir.

```typescript
interface User { name: string; age: number; }
type User = { name: string; age: number; };
```

<details>
<summary>Clique para ver a resposta</summary>

**Semelhancas**: Ambos podem definir estruturas de objetos, usam-se da mesma forma, ambos podem ser estendidos.

**Diferencas**:
1. **Fusao de declaracoes**: Interface suporta; Type Alias nao.
2. **Escopo**: Interface e principalmente para objetos; Type Alias para qualquer tipo.

**Recomendacao**: Para estruturas de objetos, ambos servem. Para fusao de declaracoes, use Interface. Para tipos nao-objeto, use Type Alias.

</details>

### Pergunta 2: Metodos de extensao

Explique as diferencas entre `extends` e intersecao `&`.

<details>
<summary>Clique para ver a resposta</summary>

- **Sintaxe**: Interface usa `extends`, Type usa `&`
- **Resultado**: Ambos produzem o mesmo resultado
- **Legibilidade**: `extends` de Interface e mais intuitivo
- **Flexibilidade**: `&` de Type pode combinar multiplos tipos

</details>

### Pergunta 3: Fusao de declaracoes

```typescript
interface User { name: string; }
interface User { age: number; }
const user: User = { name: 'John' };  // Falta age?
```

<details>
<summary>Clique para ver a resposta</summary>

As duas declaracoes sao automaticamente fundidas. A falta de `age` gera um erro. Type Alias nao suporta fusao de declaracoes.

</details>

### Pergunta 4: Implementacao (implements)

<details>
<summary>Clique para ver a resposta</summary>

Ambos podem ser usados com `implements`. Interface e mais comum para contratos de classe. Type Alias de funcoes nao pode ser implementado.

</details>

## 5. Best Practices

> Melhores praticas

### Praticas recomendadas

```typescript
// 1. Para objetos, preferir Interface
interface User { name: string; age: number; }

// 2. Para tipos union, usar Type Alias
type Status = 'active' | 'inactive' | 'pending';

// 3. Para tipos de funcao, usar Type Alias
type EventHandler = (event: Event) => void;

// 4. Para fusao de declaracoes, usar Interface
interface Window { customProperty: string; }

// 5. Para contratos de classe, usar Interface
interface Flyable { fly(): void; }
class Bird implements Flyable { fly(): void {} }
```

### Praticas a evitar

```typescript
// 1. Nao misturar Interface e Type Alias para a mesma estrutura
// 2. Nao usar Type Alias para objetos simples (Interface e mais apropriado)
// 3. Nao usar Interface para tipos nao-objeto
```

## 6. Interview Summary

> Resumo para entrevistas

### Referencia rapida

**Interface**: objetos, Declaration Merging, `extends`, contratos de classe.

**Type Alias**: qualquer tipo, sem Declaration Merging, `&` intersecao, union/funcao/tupla.

### Exemplos de respostas para entrevistas

**Q: Quais sao as diferencas entre Interface e Type Alias?**

> "Interface e Type Alias podem ser usados para definir estruturas de objetos, mas tem diferencas chave: 1) Interface suporta fusao de declaracoes; Type Alias nao. 2) Interface e para objetos; Type Alias para qualquer tipo. 3) Interface usa extends; Type Alias usa &. 4) Interface e melhor para contratos de classe. Para objetos, ambos servem. Para fusao, use Interface. Para tipos nao-objeto, use Type Alias."

**Q: Quando usar Interface e quando Type Alias?**

> "Use Interface para: estruturas de objetos, fusao de declaracoes, contratos de classe. Use Type Alias para: tipos union/intersecao, tipos de funcao, tuplas, tipos mapeados/condicionais. Em resumo, prefira Interface para objetos e Type Alias para o resto."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
