---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> O que sao ref e reactive?

`ref` e `reactive` sao duas APIs centrais da Composition API do Vue 3 para criar dados reativos.

### ref

**Definicao**: `ref` e usado para criar um **valor de tipo primitivo** ou **referencia de objeto** reativo.

<details>
<summary>Clique para expandir o exemplo basico de ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// Tipos primitivos
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// Objetos (tambem podem usar ref)
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

**Definicao**: `reactive` e usado para criar um **objeto** reativo (nao pode ser usado diretamente com tipos primitivos).

<details>
<summary>Clique para expandir o exemplo basico de reactive</summary>

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

> Principais diferencas entre ref e reactive

### 1. Tipos Aplicaveis

**ref**: Pode ser usado com qualquer tipo

```typescript
const count = ref(0); // Numero
const message = ref('Hello'); // String
const isActive = ref(true); // Booleano
const user = ref({ name: 'John' }); // Objeto
const items = ref([1, 2, 3]); // Array
```

**reactive**: Apenas para objetos

```typescript
const state = reactive({ count: 0 }); // Objeto
const state = reactive([1, 2, 3]); // Array (tambem e um objeto)
const count = reactive(0); // Erro: tipos primitivos nao funcionam
const message = reactive('Hello'); // Erro: tipos primitivos nao funcionam
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

// No template e desembrulhado automaticamente, sem .value
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

### 3. Reatribuicao

**ref**: Pode ser reatribuido

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Pode reatribuir
```

**reactive**: Nao pode ser reatribuido (perde a reatividade)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // Perde a reatividade, nao aciona atualizacoes
```

### 4. Desestruturacao

**ref**: Mantem reatividade apos desestruturacao

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Desestrutura valores primitivos, perde reatividade

// Mas pode desestruturar o proprio ref
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: Perde reatividade apos desestruturacao

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // Perde reatividade

// Precisa usar toRefs para manter a reatividade
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // Mantem reatividade
```

## 3. When to Use ref vs reactive?

> Quando usar ref? Quando usar reactive?

### Situacoes para usar ref

1. **Valores de tipos primitivos**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Objetos que precisam de reatribuicao**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Pode reatribuir
   ```

3. **Template Refs (Referencias de Template)**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **Situacoes que requerem desestruturacao**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // Desestruturar valores primitivos sem problema
   ```

### Situacoes para usar reactive

1. **Estado de objeto complexo**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **Estado que nao precisa de reatribuicao**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **Multiplas propriedades relacionadas organizadas juntas**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Pergunta 1: Diferencas Basicas

Explique as diferencas e os resultados do codigo abaixo.

```typescript
// Caso 1: Usando ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// Caso 2: Usando reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// Caso 3: Reatribuicao com reactive
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

// Caso 3: Reatribuicao com reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // Perde a reatividade
console.log(state2.count); // 10 (valor correto, mas perde reatividade)
// Modificacoes subsequentes em state2.count nao acionam atualizacao da view
```

**Diferencas-chave**:

- `ref` precisa de `.value` para acessar
- `reactive` acessa propriedades diretamente
- `reactive` nao pode ser reatribuido, perde a reatividade

</details>

### Pergunta 2: Problema de Desestruturacao

Explique o problema do codigo abaixo e forneca a solucao.

```typescript
// Caso 1: Desestruturacao de ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// Caso 2: Desestruturacao de reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Clique para ver a resposta</summary>

**Caso 1: Desestruturacao de ref**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // Nao atualiza user.value.name

// Forma correta: modificar o valor do ref
user.value.name = 'Jane'; // Correto
// Ou reatribuir
user.value = { name: 'Jane', age: 30 }; // Correto
```

**Caso 2: Desestruturacao de reactive**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // Perde reatividade, nao aciona atualizacao

// Forma correta 1: modificar propriedade diretamente
state.count = 10; // Correto

// Forma correta 2: usar toRefs para manter reatividade
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // Agora e um ref, precisa usar .value
```

**Resumo**:

- Desestruturar valores primitivos perde a reatividade
- Desestruturacao de `reactive` precisa usar `toRefs` para manter a reatividade
- Desestruturar propriedades de objeto de `ref` tambem perde reatividade, deve-se modificar `.value` diretamente

</details>

### Pergunta 3: Escolher ref ou reactive?

Indique se deve usar `ref` ou `reactive` nos cenarios abaixo.

```typescript
// Cenario 1: Contador
const count = ?;

// Cenario 2: Estado do formulario
const form = ?;

// Cenario 3: Dados do usuario (pode precisar reatribuir)
const user = ?;

// Cenario 4: Referencia de template
const inputRef = ?;
```

<details>
<summary>Clique para ver a resposta</summary>

```typescript
// Cenario 1: Contador (tipo primitivo)
const count = ref(0); // ref

// Cenario 2: Estado do formulario (objeto complexo, sem reatribuicao)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // reactive

// Cenario 3: Dados do usuario (pode precisar reatribuir)
const user = ref({ name: 'John', age: 30 }); // ref (pode reatribuir)

// Cenario 4: Referencia de template
const inputRef = ref(null); // ref (template refs devem usar ref)
```

**Principios de escolha**:

- Tipo primitivo -> `ref`
- Precisa de reatribuicao -> `ref`
- Referencia de template -> `ref`
- Estado de objeto complexo, sem reatribuicao -> `reactive`

</details>

## 5. Best Practices

> Melhores Praticas

### Praticas Recomendadas

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

// 3. Reatribuicao usa ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Correto

// 4. Desestruturacao de reactive usa toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. Estilo uniforme: a equipe pode escolher usar principalmente ref ou reactive
```

### Praticas a Evitar

```typescript
// 1. Nao usar reactive para tipos primitivos
const count = reactive(0); // Erro

// 2. Nao reatribuir reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // Perde reatividade

// 3. Nao desestruturar reactive diretamente
const { count } = reactive({ count: 0 }); // Perde reatividade

// 4. Nao esquecer .value no template (caso de ref)
// No template nao precisa de .value, mas no JavaScript precisa
```

## 6. Interview Summary

> Resumo para Entrevistas

### Memorizacao Rapida

**ref**:

- Aplicavel a qualquer tipo
- Precisa usar `.value` para acessar
- Pode ser reatribuido
- Desembrulhado automaticamente no template

**reactive**:

- Apenas para objetos
- Acessa propriedades diretamente
- Nao pode ser reatribuido
- Desestruturacao precisa usar `toRefs`

**Principios de escolha**:

- Tipo primitivo -> `ref`
- Precisa de reatribuicao -> `ref`
- Estado de objeto complexo -> `reactive`

### Exemplo de Resposta para Entrevista

**P: Qual e a diferenca entre ref e reactive?**

> "ref e reactive sao ambas APIs do Vue 3 para criar dados reativos. As principais diferencas incluem: 1) Tipos aplicaveis: ref pode ser usado com qualquer tipo, reactive apenas para objetos; 2) Forma de acesso: ref precisa de .value, reactive acessa propriedades diretamente; 3) Reatribuicao: ref pode ser reatribuido, reactive nao pode ser reatribuido senao perde a reatividade; 4) Desestruturacao: desestruturacao de reactive precisa usar toRefs para manter a reatividade. Em geral, tipos primitivos e objetos que precisam de reatribuicao usam ref, estado de objeto complexo usa reactive."

**P: Quando usar ref? Quando usar reactive?**

> "Usar ref: 1) Valores de tipos primitivos (numeros, strings, booleanos); 2) Objetos que precisam de reatribuicao; 3) Template refs. Usar reactive: 1) Estado de objeto complexo com multiplas propriedades relacionadas; 2) Estado que nao precisa de reatribuicao. Na pratica, muitas equipes usam ref uniformemente, pois e mais flexivel e tem escopo mais amplo."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
