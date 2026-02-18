---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> O que é TypeScript?

TypeScript é uma linguagem de programação de código aberto desenvolvida pela Microsoft, e é um **superconjunto (Superset)** de JavaScript. Isso significa que todo código JavaScript válido também é código TypeScript válido.

**Características principais**:

- Adiciona um **sistema de tipos estáticos** sobre o JavaScript
- Realiza verificação de tipos em tempo de compilação
- Converte-se em JavaScript puro após a compilação
- Proporciona melhor experiência de desenvolvimento e suporte de ferramentas

## 2. What are the differences between TypeScript and JavaScript?

> Quais são as diferenças entre TypeScript e JavaScript?

### Diferenças principais

| Característica | JavaScript              | TypeScript              |
| -------------- | ----------------------- | ----------------------- |
| Sistema de tipos | Dinâmico (verificação em execução) | Estático (verificação em compilação) |
| Compilação     | Não necessária          | Requer compilação para JavaScript |
| Anotações      | Não suportadas          | Suporta anotações de tipo |
| Detecção de erros | Em tempo de execução | Em tempo de compilação |
| Suporte IDE    | Básico                  | Autocompletar e refatoração potentes |
| Curva de aprendizado | Baixa              | Alta                    |

### Diferenças do sistema de tipos

**JavaScript (tipos dinâmicos)**:

```javascript
let value = 10;
value = 'hello'; // Pode mudar de tipo
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (concatenação de strings)
add(1, '2'); // '12' (conversão de tipo)
```

**TypeScript (tipos estáticos)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ Erro de compilação

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Erro de compilação
```

### Processo de compilação

```typescript
// Código fonte TypeScript
let message: string = 'Hello World';
console.log(message);

// ↓ Após compilação, convertido em JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Por que usar TypeScript?

### Vantagens

1. **Detecção precoce de erros** - Detectar erros de tipo em compilação
2. **Melhor suporte IDE** - Autocompletar e refatoração
3. **Legibilidade do código** - Anotações de tipo esclarecem a intenção das funções
4. **Refatoração mais segura** - Detecção automática de locais que precisam de atualização

### Desvantagens

1. **Requer etapa de compilação** - Aumenta a complexidade do fluxo de desenvolvimento
2. **Curva de aprendizado** - Precisa aprender o sistema de tipos
3. **Tamanho do arquivo** - Informações de tipo aumentam o tamanho do código fonte (sem efeito após compilar)
4. **Configuração complexa** - Precisa configurar `tsconfig.json`

## 4. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Momento da verificação de tipos

<details>
<summary>Clique para ver a resposta</summary>

- JavaScript realiza conversões de tipo em **tempo de execução**, o que pode produzir resultados inesperados
- TypeScript verifica tipos em **tempo de compilação**, detectando erros antecipadamente

</details>

### Pergunta 2: Inferência de tipos

<details>
<summary>Clique para ver a resposta</summary>

TypeScript infere automaticamente o tipo a partir do valor inicial. Após a inferência, o tipo não pode ser alterado (a menos que declarado explicitamente como `any` ou tipo `union`).

</details>

### Pergunta 3: Comportamento em tempo de execução

<details>
<summary>Clique para ver a resposta</summary>

- As **anotações de tipo do TypeScript desaparecem completamente após a compilação**
- O JavaScript compilado é idêntico ao JavaScript puro
- TypeScript só fornece verificação de tipos na **fase de desenvolvimento**, sem afetar o desempenho em execução

</details>

### Pergunta 4: Erros de tipo vs Erros de execução

<details>
<summary>Clique para ver a resposta</summary>

- **Erro de compilação TypeScript**: Detectado na fase de desenvolvimento, programa não pode ser executado
- **Erro de execução JavaScript**: Detectado durante o uso, causa travamento do programa

TypeScript pode prevenir muitos erros de execução através da verificação de tipos.

</details>

## 5. Best Practices

> Melhores práticas

### Práticas recomendadas

```typescript
// 1. Especificar explicitamente o tipo de retorno das funções
function add(a: number, b: number): number { return a + b; }

// 2. Usar interface para estruturas de objetos complexos
interface User { name: string; age: number; email?: string; }

// 3. Preferir unknown em vez de any
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Usar alias de tipo para melhorar a legibilidade
type UserID = string;
```

## 6. Interview Summary

> Resumo para entrevistas

**Q: Quais são as principais diferenças entre TypeScript e JavaScript?**

> "TypeScript é um superconjunto de JavaScript, a principal diferença é que adiciona um sistema de tipos estáticos. JavaScript é uma linguagem de tipos dinâmicos com verificação em tempo de execução; TypeScript é uma linguagem de tipos estáticos com verificação em tempo de compilação. Isso permite detectar erros relacionados a tipos já na fase de desenvolvimento. Após a compilação, TypeScript se converte em JavaScript puro, portanto o comportamento em execução é idêntico ao do JavaScript."

**Q: Por que usar TypeScript?**

> "As principais vantagens são: 1) Detecção precoce de erros em tempo de compilação; 2) Melhor suporte IDE com autocompletar e refatoração; 3) Melhor legibilidade do código com anotações de tipo; 4) Refatoração mais segura com detecção automática de locais a atualizar. Porém, é preciso considerar a curva de aprendizado é o custo adicional da etapa de compilação."

## Reference

- [Documentação oficial do TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
