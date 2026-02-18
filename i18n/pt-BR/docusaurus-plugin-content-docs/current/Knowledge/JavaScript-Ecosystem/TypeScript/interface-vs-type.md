---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> O que são Interface e Type Alias?

### Interface

**Definição**: Usada para definir a estrutura de um objeto, descrevendo quais propriedades e métodos o objeto deve ter.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // propriedade opcional
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Alias de tipo)

**Definição**: Cria um alias para um tipo, que pode ser usado com qualquer tipo, não apenas objetos.

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

> Principais diferenças entre Interface e Type Alias

### 1. Método de extensão

**Interface: usando extends**

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

**Type Alias: usando tipo de interseção**

```typescript
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

### 2. Fusão (Declaration Merging)

**Interface: suporta fusão**

```typescript
interface User { name: string; }
interface User { age: number; }
// Automaticamente fundido em { name: string; age: number; }
const user: User = { name: 'John', age: 30 };
```

**Type Alias: não suporta fusão**

```typescript
type User = { name: string; };
type User = { age: number; };  // ❌ Erro: Duplicate identifier 'User'
```

### 3. Escopo de aplicação

**Interface: principalmente para estruturas de objetos**

```typescript
interface User { name: string; age: number; }
```

**Type Alias: utilizável com qualquer tipo**

```typescript
type ID = string | number;
type Greet = (name: string) => string;
type Status = 'active' | 'inactive' | 'pending';
type Point = [number, number];
type User = { name: string; age: number; };
```

### 4. Propriedades computadas

**Interface: não suporta propriedades computadas**

```typescript
interface User { [key: string]: any; }
```

**Type Alias: suporta operações de tipo mais complexas**

```typescript
type Keys = 'name' | 'age' | 'email';
type User = { [K in Keys]: string; };
```

## 3. When to Use Interface vs Type Alias?

> Quando usar Interface? Quando usar Type Alias?

### Usar Interface quando

1. **Definir estruturas de objetos** (mais comum)
2. **Fusão de declarações é necessária** (ex. estender tipos de pacotes de terceiros)
3. **Definir contratos de classe**

### Usar Type Alias quando

1. **Definir tipos union ou interseção**: `type ID = string | number;`
2. **Definir tipos de função**: `type EventHandler = (event: Event) => void;`
3. **Definir tuplas**: `type Point = [number, number];`
4. **Tipos mapeados ou condicionais são necessários**

## 4. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Diferenças básicas

Explique as diferenças entre as duas formas de definição a seguir.

```typescript
interface User { name: string; age: number; }
type User = { name: string; age: number; };
```

<details>
<summary>Clique para ver a resposta</summary>

**Semelhanças**: Ambos podem definir estruturas de objetos, usam-se da mesma forma, ambos podem ser estendidos.

**Diferenças**:
1. **Fusão de declarações**: Interface suporta; Type Alias não.
2. **Escopo**: Interface é principalmente para objetos; Type Alias para qualquer tipo.

**Recomendação**: Para estruturas de objetos, ambos servem. Para fusão de declarações, use Interface. Para tipos não-objeto, use Type Alias.

</details>

### Pergunta 2: Métodos de extensão

Explique as diferenças entre `extends` e interseção `&`.

<details>
<summary>Clique para ver a resposta</summary>

- **Sintaxe**: Interface usa `extends`, Type usa `&`
- **Resultado**: Ambos produzem o mesmo resultado
- **Legibilidade**: `extends` de Interface é mais intuitivo
- **Flexibilidade**: `&` de Type pode combinar múltiplos tipos

</details>

### Pergunta 3: Fusão de declarações

```typescript
interface User { name: string; }
interface User { age: number; }
const user: User = { name: 'John' };  // Falta age?
```

<details>
<summary>Clique para ver a resposta</summary>

As duas declarações são automaticamente fundidas. A falta de `age` gera um erro. Type Alias não suporta fusão de declarações.

</details>

### Pergunta 4: Implementação (implements)

<details>
<summary>Clique para ver a resposta</summary>

Ambos podem ser usados com `implements`. Interface é mais comum para contratos de classe. Type Alias de funções não pode ser implementado.

</details>

## 5. Best Practices

> Melhores práticas

### Práticas recomendadas

```typescript
// 1. Para objetos, preferir Interface
interface User { name: string; age: number; }

// 2. Para tipos union, usar Type Alias
type Status = 'active' | 'inactive' | 'pending';

// 3. Para tipos de função, usar Type Alias
type EventHandler = (event: Event) => void;

// 4. Para fusão de declarações, usar Interface
interface Window { customProperty: string; }

// 5. Para contratos de classe, usar Interface
interface Flyable { fly(): void; }
class Bird implements Flyable { fly(): void {} }
```

### Práticas a evitar

```typescript
// 1. Não misturar Interface e Type Alias para a mesma estrutura
// 2. Não usar Type Alias para objetos simples (Interface é mais apropriado)
// 3. Não usar Interface para tipos não-objeto
```

## 6. Interview Summary

> Resumo para entrevistas

### Referência rápida

**Interface**: objetos, Declaration Merging, `extends`, contratos de classe.

**Type Alias**: qualquer tipo, sem Declaration Merging, `&` interseção, union/função/tupla.

### Exemplos de respostas para entrevistas

**Q: Quais são as diferenças entre Interface e Type Alias?**

> "Interface e Type Alias podem ser usados para definir estruturas de objetos, mas têm diferenças chave: 1) Interface suporta fusão de declarações; Type Alias não. 2) Interface é para objetos; Type Alias para qualquer tipo. 3) Interface usa extends; Type Alias usa &. 4) Interface é melhor para contratos de classe. Para objetos, ambos servem. Para fusão, use Interface. Para tipos não-objeto, use Type Alias."

**Q: Quando usar Interface é quando Type Alias?**

> "Use Interface para: estruturas de objetos, fusão de declarações, contratos de classe. Use Type Alias para: tipos union/interseção, tipos de função, tuplas, tipos mapeados/condicionais. Em resumo, prefira Interface para objetos e Type Alias para o resto."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
