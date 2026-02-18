---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> O que são ref e reactive?

`ref` e `reactive` são duas APIs centrais da Composition API do Vue 3 para criar dados reativos.

### ref

**Definição**: `ref` é usado para criar um **valor de tipo primitivo** ou **referência de objeto** reativo.

<details>
<summary>Clique para expandir o exemplo básico de ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// Tipos primitivos
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// Objetos (também podem usar ref)
const user = ref({
  name: 'John',
  age: 30,
});

// Precisa usar .value para acessar
console.log(count.value); // 0
count.value++; // Modificar valor
</script>
```

</details>

### reactive

**Definição**: `reactive` é usado para criar um **objeto** reativo (não pode ser usado diretamente com tipos primitivos).

<details>
<summary>Clique para expandir o exemplo básico de reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

// Apenas para objetos
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// Acessa propriedades diretamente, sem .value
console.log(state.count); // 0
state.count++; // Modificar valor
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Principais diferenças entre ref e reactive

### 1. Tipos Aplicáveis

**ref**: Pode ser usado com qualquer tipo

```typescript
const count = ref(0); // Número
const message = ref('Hello'); // String
const isActive = ref(true); // Booleano
const user = ref({ name: 'John' }); // Objeto
const items = ref([1, 2, 3]); // Array
```

**reactive**: Apenas para objetos

```typescript
const state = reactive({ count: 0 }); // Objeto
const state = reactive([1, 2, 3]); // Array (também é um objeto)
const count = reactive(0); // Erro: tipos primitivos não funcionam
const message = reactive('Hello'); // Erro: tipos primitivos não funcionam
```

### 2. Forma de Acesso

**ref**: Precisa usar `.value` para acessar

<details>
<summary>Clique para expandir o exemplo de acesso ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// No JavaScript precisa usar .value
console.log(count.value); // 0
count.value = 10;

// No template é desembrulhado automaticamente, sem .value
</script>

<template>
  <div>{{ count }}</div>
  <!-- Desembrulhado automaticamente, sem .value -->
</template>
```

</details>

**reactive**: Acessa propriedades diretamente

<details>
<summary>Clique para expandir o exemplo de acesso reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// Acessa propriedades diretamente
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Reatribuição

**ref**: Pode ser reatribuido

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Pode reatribuir
```

**reactive**: Não pode ser reatribuido (perde a reatividade)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // Perde a reatividade, não aciona atualizações
```

### 4. Desestruturação

**ref**: Mantém reatividade após desestruturação

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Desestrutura valores primitivos, perde reatividade

// Mas pode desestruturar o próprio ref
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: Perde reatividade após desestruturação

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // Perde reatividade

// Precisa usar toRefs para manter a reatividade
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // mantém reatividade
```

## 3. When to Use ref vs reactive?

> Quando usar ref? Quando usar reactive?

### Situações para usar ref

1. **Valores de tipos primitivos**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Objetos que precisam de reatribuição**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Pode reatribuir
   ```

3. **Template Refs (Referências de Template)**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **Situações que requerem desestruturação**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // Desestruturar valores primitivos sem problema
   ```

### Situações para usar reactive

1. **Estado de objeto complexo**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **Estado que não precisa de reatribuição**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **Múltiplas propriedades relacionadas organizadas juntas**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Pergunta 1: Diferenças Básicas

Explique as diferenças é os resultados do código abaixo.

```typescript
// Caso 1: Usando ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// Caso 2: Usando reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// Caso 3: Reatribuição com reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
// Caso 1: Usando ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10

// Caso 2: Usando reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10

// Caso 3: Reatribuição com reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // Perde a reatividade
console.log(state2.count); // 10 (valor correto, mas perde reatividade)
// modificações subsequentes em state2.count não acionam atualização da view
```

**Diferenças-chave**:

- `ref` precisa de `.value` para acessar
- `reactive` acessa propriedades diretamente
- `reactive` não pode ser reatribuido, perde a reatividade

</details>

### Pergunta 2: Problema de Desestruturação

Explique o problema do código abaixo e forneca a solução.

```typescript
// Caso 1: Desestruturação de ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// Caso 2: Desestruturação de reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Clique para ver a resposta</summary>

**Caso 1: Desestruturação de ref**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // Não atualiza user.value.name

// Forma correta: modificar o valor do ref
user.value.name = 'Jane'; // Correto
// Ou reatribuir
user.value = { name: 'Jane', age: 30 }; // Correto
```

**Caso 2: Desestruturação de reactive**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // Perde reatividade, não aciona atualização

// Forma correta 1: modificar propriedade diretamente
state.count = 10; // Correto

// Forma correta 2: usar toRefs para manter reatividade
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // Agora é um ref, precisa usar .value
```

**Resumo**:

- Desestruturar valores primitivos perde a reatividade
- Desestruturação de `reactive` precisa usar `toRefs` para manter a reatividade
- Desestruturar propriedades de objeto de `ref` também perde reatividade, deve-se modificar `.value` diretamente

</details>

### Pergunta 3: Escolher ref ou reactive?

Indique se deve usar `ref` ou `reactive` nós cenários abaixo.

```typescript
// Cenário 1: Contador
const count = ?;

// Cenário 2: Estado do formulário
const form = ?;

// Cenário 3: Dados do usuario (pode precisar reatribuir)
const user = ?;

// Cenário 4: Referência de template
const inputRef = ?;
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
// Cenário 1: Contador (tipo primitivo)
const count = ref(0); // ref

// Cenário 2: Estado do formulário (objeto complexo, sem reatribuição)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // reactive

// Cenário 3: Dados do usuario (pode precisar reatribuir)
const user = ref({ name: 'John', age: 30 }); // ref (pode reatribuir)

// Cenário 4: Referência de template
const inputRef = ref(null); // ref (template refs devem usar ref)
```

**Princípios de escolha**:

- Tipo primitivo -> `ref`
- Precisa de reatribuição -> `ref`
- Referência de template -> `ref`
- Estado de objeto complexo, sem reatribuição -> `reactive`

</details>

## 5. Best Practices

> Melhores Práticas

### Práticas Recomendadas

```typescript
// 1. Tipos primitivos usam ref
const count = ref(0);
const message = ref('Hello');

// 2. Estado complexo usa reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. Reatribuição usa ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Correto

// 4. Desestruturação de reactive usa toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. Estilo uniforme: a equipe pode escolher usar principalmente ref ou reactive
```

### Práticas a Evitar

```typescript
// 1. Não usar reactive para tipos primitivos
const count = reactive(0); // Erro

// 2. Não reatribuir reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // Perde reatividade

// 3. Não desestruturar reactive diretamente
const { count } = reactive({ count: 0 }); // Perde reatividade

// 4. Não esquecer .value no template (caso de ref)
// No template não precisa de .value, mas no JavaScript precisa
```

## 6. Interview Summary

> Resumo para Entrevistas

### Memorização Rápida

**ref**:

- Aplicável a qualquer tipo
- Precisa usar `.value` para acessar
- Pode ser reatribuido
- Desembrulhado automaticamente no template

**reactive**:

- Apenas para objetos
- Acessa propriedades diretamente
- Não pode ser reatribuido
- Desestruturação precisa usar `toRefs`

**Princípios de escolha**:

- Tipo primitivo -> `ref`
- Precisa de reatribuição -> `ref`
- Estado de objeto complexo -> `reactive`

### Exemplo de Resposta para Entrevista

**P: Qual é a diferença entre ref e reactive?**

> "ref e reactive são ambas APIs do Vue 3 para criar dados reativos. As principais diferenças incluem: 1) Tipos Aplicáveis: ref pode ser usado com qualquer tipo, reactive apenas para objetos; 2) Forma de acesso: ref precisa de .value, reactive acessa propriedades diretamente; 3) Reatribuição: ref pode ser reatribuido, reactive não pode ser reatribuido senao perde a reatividade; 4) Desestruturação: desestruturação de reactive precisa usar toRefs para manter a reatividade. Em geral, tipos primitivos e objetos que precisam de reatribuição usam ref, estado de objeto complexo usa reactive."

**P: Quando usar ref? Quando usar reactive?**

> "Usar ref: 1) Valores de tipos primitivos (números, strings, booleanos); 2) Objetos que precisam de reatribuição; 3) Template refs. Usar reactive: 1) Estado de objeto complexo com múltiplas propriedades relacionadas; 2) Estado que não precisa de reatribuição. Na prática, muitas equipes usam ref uniformemente, pois é mais flexível e tem escopo mais amplo."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
