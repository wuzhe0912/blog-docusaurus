---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> O que e TypeScript?

TypeScript e uma linguagem de programacao de codigo aberto desenvolvida pela Microsoft, e e um **superconjunto (Superset)** de JavaScript. Isso significa que todo codigo JavaScript valido tambem e codigo TypeScript valido.

**Caracteristicas principais**:

- Adiciona um **sistema de tipos estaticos** sobre o JavaScript
- Realiza verificacao de tipos em tempo de compilacao
- Converte-se em JavaScript puro apos a compilacao
- Proporciona melhor experiencia de desenvolvimento e suporte de ferramentas

## 2. What are the differences between TypeScript and JavaScript?

> Quais sao as diferencas entre TypeScript e JavaScript?

### Diferencas principais

| Caracteristica | JavaScript              | TypeScript              |
| -------------- | ----------------------- | ----------------------- |
| Sistema de tipos | Dinamico (verificacao em execucao) | Estatico (verificacao em compilacao) |
| Compilacao     | Nao necessaria          | Requer compilacao para JavaScript |
| Anotacoes      | Nao suportadas          | Suporta anotacoes de tipo |
| Deteccao de erros | Em tempo de execucao | Em tempo de compilacao |
| Suporte IDE    | Basico                  | Autocompletar e refatoracao potentes |
| Curva de aprendizado | Baixa              | Alta                    |

### Diferencas do sistema de tipos

**JavaScript (tipos dinamicos)**:

```javascript
let value = 10;
value = 'hello'; // Pode mudar de tipo
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (concatenacao de strings)
add(1, '2'); // '12' (conversao de tipo)
```

**TypeScript (tipos estaticos)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ Erro de compilacao

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Erro de compilacao
```

### Processo de compilacao

```typescript
// Codigo fonte TypeScript
let message: string = 'Hello World';
console.log(message);

// ↓ Apos compilacao, convertido em JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Por que usar TypeScript?

### Vantagens

1. **Deteccao precoce de erros** - Detectar erros de tipo em compilacao
2. **Melhor suporte IDE** - Autocompletar e refatoracao
3. **Legibilidade do codigo** - Anotacoes de tipo esclarecem a intencao das funcoes
4. **Refatoracao mais segura** - Deteccao automatica de locais que precisam de atualizacao

### Desvantagens

1. **Requer etapa de compilacao** - Aumenta a complexidade do fluxo de desenvolvimento
2. **Curva de aprendizado** - Precisa aprender o sistema de tipos
3. **Tamanho do arquivo** - Informacoes de tipo aumentam o tamanho do codigo fonte (sem efeito apos compilar)
4. **Configuracao complexa** - Precisa configurar `tsconfig.json`

## 4. Common Interview Questions

> Perguntas comuns em entrevistas

### Pergunta 1: Momento da verificacao de tipos

<details>
<summary>Clique para ver a resposta</summary>

- JavaScript realiza conversoes de tipo em **tempo de execucao**, o que pode produzir resultados inesperados
- TypeScript verifica tipos em **tempo de compilacao**, detectando erros antecipadamente

</details>

### Pergunta 2: Inferencia de tipos

<details>
<summary>Clique para ver a resposta</summary>

TypeScript infere automaticamente o tipo a partir do valor inicial. Apos a inferencia, o tipo nao pode ser alterado (a menos que declarado explicitamente como `any` ou tipo `union`).

</details>

### Pergunta 3: Comportamento em tempo de execucao

<details>
<summary>Clique para ver a resposta</summary>

- As **anotacoes de tipo do TypeScript desaparecem completamente apos a compilacao**
- O JavaScript compilado e identico ao JavaScript puro
- TypeScript so fornece verificacao de tipos na **fase de desenvolvimento**, sem afetar o desempenho em execucao

</details>

### Pergunta 4: Erros de tipo vs Erros de execucao

<details>
<summary>Clique para ver a resposta</summary>

- **Erro de compilacao TypeScript**: Detectado na fase de desenvolvimento, programa nao pode ser executado
- **Erro de execucao JavaScript**: Detectado durante o uso, causa travamento do programa

TypeScript pode prevenir muitos erros de execucao atraves da verificacao de tipos.

</details>

## 5. Best Practices

> Melhores praticas

### Praticas recomendadas

```typescript
// 1. Especificar explicitamente o tipo de retorno das funcoes
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

**Q: Quais sao as principais diferencas entre TypeScript e JavaScript?**

> "TypeScript e um superconjunto de JavaScript, a principal diferenca e que adiciona um sistema de tipos estaticos. JavaScript e uma linguagem de tipos dinamicos com verificacao em tempo de execucao; TypeScript e uma linguagem de tipos estaticos com verificacao em tempo de compilacao. Isso permite detectar erros relacionados a tipos ja na fase de desenvolvimento. Apos a compilacao, TypeScript se converte em JavaScript puro, portanto o comportamento em execucao e identico ao do JavaScript."

**Q: Por que usar TypeScript?**

> "As principais vantagens sao: 1) Deteccao precoce de erros em tempo de compilacao; 2) Melhor suporte IDE com autocompletar e refatoracao; 3) Melhor legibilidade do codigo com anotacoes de tipo; 4) Refatoracao mais segura com deteccao automatica de locais a atualizar. Porem, e preciso considerar a curva de aprendizado e o custo adicional da etapa de compilacao."

## Reference

- [Documentacao oficial do TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
