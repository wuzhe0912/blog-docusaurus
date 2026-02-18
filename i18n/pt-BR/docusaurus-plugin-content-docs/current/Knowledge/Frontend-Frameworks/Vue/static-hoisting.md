---
id: static-hoisting
title: '[Medium] Static Hoisting no Vue3'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> O que é Static Hoisting no Vue3?

No Vue3, o chamado **Static Hoisting (Elevação Estática)** é uma técnica de otimização na fase de compilação.

### Definição

**Static Hoisting** é quando o compilador do Vue 3, ao compilar o template, analisa quais nós não dependem de estado reativo e nunca mudarão, e então os extrai como constantes no topo do arquivo. Eles são criados apenas na primeira renderização e reutilizados diretamente nas re-renderizações seguintes, reduzindo o custo de criação de VNode e de diff.

### Como Funciona

O compilador analisa o template e extrai nós que são completamente independentes do estado reativo e nunca mudam, transformando-os em constantes no topo do arquivo, criados apenas uma vez na primeira renderização e reutilizados diretamente nas renderizações seguintes.

### Comparação Antes e Depois da Compilação

**Template Antes da Compilação**:

<details>
<summary>Clique para expandir o exemplo de Template</summary>

```vue
<template>
  <div>
    <h1>Título Estático</h1>
    <p>Conteúdo Estático</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**JavaScript Após Compilação** (versão simplificada):

<details>
<summary>Clique para expandir o JavaScript compilado</summary>

```js
// nós estáticos elevados ao topo, criados apenas uma vez
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Título Estático');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Conteúdo Estático');

function render() {
  return h('div', null, [
    _hoisted_1, // Reutilizado diretamente, sem recriação
    _hoisted_2, // Reutilizado diretamente, sem recriação
    h('div', null, dynamicContent.value), // Conteúdo dinâmico precisa ser recriado
  ]);
}
```

</details>

### Vantagens

1. **Reduz custo de criação de VNode**: Nós estáticos criados apenas uma vez, reutilizados depois
2. **Reduz custo de diff**: Nós estáticos não participam da comparação diff
3. **Melhora performance de renderização**: Efeito especialmente notável em componentes com muito conteúdo estático
4. **Otimização automática**: Desenvolvedores não precisam fazer nada especial para aproveitar esta otimização

## 2. How Static Hoisting Works

> Como funciona o Static Hoisting?

### Processo de Análise do Compilador

O compilador analisa cada nó do template:

1. **Verifica se o no contém ligações dinâmicas**

   - Verifica se há `{{ }}`, `v-bind`, `v-if`, `v-for` e outras diretivas dinâmicas
   - Verifica se valores de atributos contém variáveis

2. **Marca nós estáticos**

   - Se o no e seus filhos não tiverem ligações dinâmicas, marca como no estático

3. **Eleva nós estáticos**
   - Extrai nós estáticos para fora da função render
   - Define como constantes no topo do módulo

### Exemplo 1: Static Hoisting Básico

<details>
<summary>Clique para expandir o exemplo básico</summary>

```vue
<template>
  <div>
    <h1>Título</h1>
    <p>Este e conteúdo estático</p>
    <div>Bloco estático</div>
  </div>
</template>
```

</details>

**Após compilação**:

<details>
<summary>Clique para expandir o resultado compilado</summary>

```js
// Todos os nós estáticos são elevados
const _hoisted_1 = h('h1', null, 'Título');
const _hoisted_2 = h('p', null, 'Este e conteúdo estático');
const _hoisted_3 = h('div', null, 'Bloco estático');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### Exemplo 2: Conteúdo Misto Estático e Dinâmico

<details>
<summary>Clique para expandir o exemplo de conteúdo misto</summary>

```vue
<template>
  <div>
    <h1>Título Estático</h1>
    <p>{{ message }}</p>
    <div class="static-class">Conteúdo Estático</div>
    <span :class="dynamicClass">Conteúdo Dinâmico</span>
  </div>
</template>
```

</details>

**Após compilação**:

<details>
<summary>Clique para expandir o resultado compilado</summary>

```js
// Apenas nós completamente estáticos são elevados
const _hoisted_1 = h('h1', null, 'Título Estático');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Conteúdo Estático');

function render() {
  return h('div', null, [
    _hoisted_1, // No estático, reutilizado
    h('p', null, message.value), // Conteúdo dinâmico, precisa ser recriado
    _hoisted_3, // No estático, reutilizado
    h('span', { class: dynamicClass.value }, 'Conteúdo Dinâmico'), // Atributo dinâmico, precisa ser recriado
  ]);
}
```

</details>

### Exemplo 3: Elevação de Atributos Estáticos

<details>
<summary>Clique para expandir o exemplo de atributos estáticos</summary>

```vue
<template>
  <div>
    <div class="container" id="main">Conteúdo</div>
    <button disabled>Botão</button>
  </div>
</template>
```

</details>

**Após compilação**:

<details>
<summary>Clique para expandir o resultado compilado</summary>

```js
// Objetos de atributos estáticos também são elevados
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Conteúdo');
const _hoisted_4 = h('button', _hoisted_2, 'Botão');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> Diretiva v-once

Se o desenvolvedor quiser marcar manualmente um grande bloco de conteúdo que nunca mudara, pode usar a diretiva `v-once`.

### Função do v-once

`v-once` diz ao compilador que este elemento e seus filhos devem ser renderizados apenas uma vez, mesmo que contenham ligações dinâmicas, serão calculados apenas na primeira renderização e não serão atualizados depois.

### Uso Básico

<details>
<summary>Clique para expandir o exemplo básico de v-once</summary>

```vue
<template>
  <div>
    <!-- Usa v-once para marcar conteúdo estático -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- Sem v-once, atualiza reativamente -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Título Inicial');
const content = ref('Conteúdo Inicial');

// Mesmo alterando estes valores, o bloco v-once não atualiza
setTimeout(() => {
  title.value = 'Novo Título';
  content.value = 'Novo Conteúdo';
}, 1000);
</script>
```

</details>

### v-once vs Static Hoisting

| Característica | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Acionamento** | Automático (análise do compilador) | Manual (marcação do desenvolvedor) |
| **Cenário** | Conteúdo completamente estático | Contém ligações dinâmicas mas renderiza uma vez |
| **Performance** | Ótima (não participa do diff) | Boa (renderiza apenas uma vez) |
| **Momento de uso** | Compilador decide automaticamente | Desenvolvedor sabe que não mudara |

### Cenários de Uso

```vue
<template>
  <!-- Cenário 1: Dados exibidos uma única vez -->
  <div v-once>
    <p>Data de criação: {{ createdAt }}</p>
    <p>Criador: {{ creator }}</p>
  </div>

  <!-- Cenário 2: Estrutura estática complexa -->
  <div v-once>
    <div class="header">
      <h1>Título</h1>
      <nav>Navegação</nav>
    </div>
  </div>

  <!-- Cenário 3: Itens estáticos em lista -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Pergunta 1: Princípio do Static Hoisting

Explique o princípio de funcionamento do Static Hoisting no Vue3 é como ele melhora a performance.

<details>
<summary>Clique para ver a resposta</summary>

**Princípio de funcionamento do Static Hoisting**:

1. **Análise na fase de compilação**: O compilador analisa cada nó do template, verifica se contém ligações dinâmicas, e marca como estáticos os nós sem ligações dinâmicas
2. **Elevação de nós**: Extrai nós estáticos para fora da função render, define como constantes no topo do módulo, cria apenas uma vez na primeira renderização
3. **Mecanismo de reutilização**: Re-renderizações seguintes reutilizam diretamente estes nós estáticos, sem recriação de VNode, sem participacao em comparação diff

**Melhoria de performance**:

- **Reduz custo de criação de VNode**: Nós estáticos criados apenas uma vez
- **Reduz custo de diff**: Nós estáticos pulam comparação diff
- **Reduz uso de memória**: Múltiplas instâncias do componente compartilham nós estáticos
- **Aumenta velocidade de renderização**: Efeito especialmente notável em componentes com muito conteúdo estático

</details>

### Pergunta 2: Diferença entre Static Hoisting e v-once

Explique a diferença entre Static Hoisting e `v-once`, e seus respectivos cenários de uso.

<details>
<summary>Clique para ver a resposta</summary>

**Principais diferenças**:

| Característica | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Acionamento** | Automático (análise do compilador) | Manual (marcação do desenvolvedor) |
| **Conteúdo Aplicável** | Conteúdo completamente estático | Contém ligações dinâmicas mas renderiza uma vez |
| **Momento de compilação** | Compilador decide automaticamente | Desenvolvedor marca explicitamente |
| **Performance** | Ótima (não participa do diff) | Boa (renderiza apenas uma vez) |
| **Comportamento de atualização** | Nunca atualiza | Não atualiza após primeira renderização |

**Recomendação de escolha**:

- Se o conteúdo e completamente estático -> Deixar o compilador tratar automaticamente (Static Hoisting)
- Se o conteúdo tem ligações dinâmicas mas renderiza uma vez -> Usar `v-once`
- Se o conteúdo precisa de atualização reativa -> Não usar `v-once`

</details>

## 5. Best Practices

> Melhores Práticas

### Práticas Recomendadas

```vue
<!-- 1. Deixar o compilador tratar automaticamente conteúdo estático -->
<template>
  <div>
    <h1>Título</h1>
    <p>Conteúdo estático</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. Usar v-once explicitamente para conteúdo que renderiza uma vez -->
<template>
  <div v-once>
    <p>Data de criação: {{ createdAt }}</p>
    <p>Criador: {{ creator }}</p>
  </div>
</template>

<!-- 3. Separar estrutura estática de conteúdo dinâmico -->
<template>
  <div>
    <!-- Estrutura estática -->
    <div class="container">
      <header>Título</header>
      <!-- Conteúdo dinâmico -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### Práticas a Evitar

```vue
<!-- 1. Não usar v-once em excesso -->
<template>
  <!-- Se o conteúdo precisa atualizar, não usar v-once -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. Não usar v-once em conteúdo dinâmico -->
<template>
  <!-- Se itens da lista precisam atualizar, não usar v-once -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Interview Summary

> Resumo para Entrevistas

### Memorização Rápida

**Static Hoisting**:

- **Definição**: Na fase de compilação, eleva nós estáticos como constantes, cria apenas uma vez
- **Vantagem**: Reduz custo de criação de VNode e de diff
- **Automático**: Compilador processa automaticamente, desenvolvedor não percebe
- **Aplicável**: Nós que não dependem de estado reativo

**v-once**:

- **Definição**: Marca manualmente conteúdo que renderiza apenas uma vez
- **Aplicável**: Blocos com ligações dinâmicas mas que renderizam apenas uma vez
- **Performance**: Reduz atualizações desnecessárias

### Exemplo de Resposta para Entrevista

**P: O que é Static Hoisting no Vue3?**

> "No Vue3, Static Hoisting é uma otimização na fase de compilação. O compilador analisa o template e extrai nós que não dependem de estado reativo e nunca mudam, transformando-os em constantes no topo do arquivo, criados apenas uma vez na primeira renderização e reutilizados nas renderizações seguintes, reduzindo o custo de criação de VNode e de diff. O desenvolvedor não precisa fazer nada especial para aproveitar esta otimização, basta escrever o template normalmente é o compilador decide automaticamente quais nós podem ser elevados. Se quiser marcar manualmente um grande bloco que nunca muda, pode usar v-once."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
