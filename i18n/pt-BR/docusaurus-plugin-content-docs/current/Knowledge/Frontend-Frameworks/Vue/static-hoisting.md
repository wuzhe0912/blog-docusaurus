---
id: static-hoisting
title: '[Medium] Static Hoisting no Vue3'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> O que e Static Hoisting no Vue3?

No Vue3, o chamado **Static Hoisting (Elevacao Estatica)** e uma tecnica de otimizacao na fase de compilacao.

### Definicao

**Static Hoisting** e quando o compilador do Vue 3, ao compilar o template, analisa quais nos nao dependem de estado reativo e nunca mudarao, e entao os extrai como constantes no topo do arquivo. Eles sao criados apenas na primeira renderizacao e reutilizados diretamente nas re-renderizacoes seguintes, reduzindo o custo de criacao de VNode e de diff.

### Como Funciona

O compilador analisa o template e extrai nos que sao completamente independentes do estado reativo e nunca mudam, transformando-os em constantes no topo do arquivo, criados apenas uma vez na primeira renderizacao e reutilizados diretamente nas renderizacoes seguintes.

### Comparacao Antes e Depois da Compilacao

**Template Antes da Compilacao**:

<details>
<summary>Clique para expandir o exemplo de Template</summary>

```vue
<template>
  <div>
    <h1>Titulo Estatico</h1>
    <p>Conteudo Estatico</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**JavaScript Apos Compilacao** (versao simplificada):

<details>
<summary>Clique para expandir o JavaScript compilado</summary>

```js
// Nos estaticos elevados ao topo, criados apenas uma vez
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Titulo Estatico');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Conteudo Estatico');

function render() {
  return h('div', null, [
    _hoisted_1, // Reutilizado diretamente, sem recriacao
    _hoisted_2, // Reutilizado diretamente, sem recriacao
    h('div', null, dynamicContent.value), // Conteudo dinamico precisa ser recriado
  ]);
}
```

</details>

### Vantagens

1. **Reduz custo de criacao de VNode**: Nos estaticos criados apenas uma vez, reutilizados depois
2. **Reduz custo de diff**: Nos estaticos nao participam da comparacao diff
3. **Melhora performance de renderizacao**: Efeito especialmente notavel em componentes com muito conteudo estatico
4. **Otimizacao automatica**: Desenvolvedores nao precisam fazer nada especial para aproveitar esta otimizacao

## 2. How Static Hoisting Works

> Como funciona o Static Hoisting?

### Processo de Analise do Compilador

O compilador analisa cada no do template:

1. **Verifica se o no contem ligacoes dinamicas**

   - Verifica se ha `{{ }}`, `v-bind`, `v-if`, `v-for` e outras diretivas dinamicas
   - Verifica se valores de atributos contem variaveis

2. **Marca nos estaticos**

   - Se o no e seus filhos nao tiverem ligacoes dinamicas, marca como no estatico

3. **Eleva nos estaticos**
   - Extrai nos estaticos para fora da funcao render
   - Define como constantes no topo do modulo

### Exemplo 1: Static Hoisting Basico

<details>
<summary>Clique para expandir o exemplo basico</summary>

```vue
<template>
  <div>
    <h1>Titulo</h1>
    <p>Este e conteudo estatico</p>
    <div>Bloco estatico</div>
  </div>
</template>
```

</details>

**Apos compilacao**:

<details>
<summary>Clique para expandir o resultado compilado</summary>

```js
// Todos os nos estaticos sao elevados
const _hoisted_1 = h('h1', null, 'Titulo');
const _hoisted_2 = h('p', null, 'Este e conteudo estatico');
const _hoisted_3 = h('div', null, 'Bloco estatico');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### Exemplo 2: Conteudo Misto Estatico e Dinamico

<details>
<summary>Clique para expandir o exemplo de conteudo misto</summary>

```vue
<template>
  <div>
    <h1>Titulo Estatico</h1>
    <p>{{ message }}</p>
    <div class="static-class">Conteudo Estatico</div>
    <span :class="dynamicClass">Conteudo Dinamico</span>
  </div>
</template>
```

</details>

**Apos compilacao**:

<details>
<summary>Clique para expandir o resultado compilado</summary>

```js
// Apenas nos completamente estaticos sao elevados
const _hoisted_1 = h('h1', null, 'Titulo Estatico');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Conteudo Estatico');

function render() {
  return h('div', null, [
    _hoisted_1, // No estatico, reutilizado
    h('p', null, message.value), // Conteudo dinamico, precisa ser recriado
    _hoisted_3, // No estatico, reutilizado
    h('span', { class: dynamicClass.value }, 'Conteudo Dinamico'), // Atributo dinamico, precisa ser recriado
  ]);
}
```

</details>

### Exemplo 3: Elevacao de Atributos Estaticos

<details>
<summary>Clique para expandir o exemplo de atributos estaticos</summary>

```vue
<template>
  <div>
    <div class="container" id="main">Conteudo</div>
    <button disabled>Botao</button>
  </div>
</template>
```

</details>

**Apos compilacao**:

<details>
<summary>Clique para expandir o resultado compilado</summary>

```js
// Objetos de atributos estaticos tambem sao elevados
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Conteudo');
const _hoisted_4 = h('button', _hoisted_2, 'Botao');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> Diretiva v-once

Se o desenvolvedor quiser marcar manualmente um grande bloco de conteudo que nunca mudara, pode usar a diretiva `v-once`.

### Funcao do v-once

`v-once` diz ao compilador que este elemento e seus filhos devem ser renderizados apenas uma vez, mesmo que contenham ligacoes dinamicas, serao calculados apenas na primeira renderizacao e nao serao atualizados depois.

### Uso Basico

<details>
<summary>Clique para expandir o exemplo basico de v-once</summary>

```vue
<template>
  <div>
    <!-- Usa v-once para marcar conteudo estatico -->
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

const title = ref('Titulo Inicial');
const content = ref('Conteudo Inicial');

// Mesmo alterando estes valores, o bloco v-once nao atualiza
setTimeout(() => {
  title.value = 'Novo Titulo';
  content.value = 'Novo Conteudo';
}, 1000);
</script>
```

</details>

### v-once vs Static Hoisting

| Caracteristica | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Acionamento** | Automatico (analise do compilador) | Manual (marcacao do desenvolvedor) |
| **Cenario** | Conteudo completamente estatico | Contem ligacoes dinamicas mas renderiza uma vez |
| **Performance** | Otima (nao participa do diff) | Boa (renderiza apenas uma vez) |
| **Momento de uso** | Compilador decide automaticamente | Desenvolvedor sabe que nao mudara |

### Cenarios de Uso

```vue
<template>
  <!-- Cenario 1: Dados exibidos uma unica vez -->
  <div v-once>
    <p>Data de criacao: {{ createdAt }}</p>
    <p>Criador: {{ creator }}</p>
  </div>

  <!-- Cenario 2: Estrutura estatica complexa -->
  <div v-once>
    <div class="header">
      <h1>Titulo</h1>
      <nav>Navegacao</nav>
    </div>
  </div>

  <!-- Cenario 3: Itens estaticos em lista -->
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

### Pergunta 1: Principio do Static Hoisting

Explique o principio de funcionamento do Static Hoisting no Vue3 e como ele melhora a performance.

<details>
<summary>Clique para ver a resposta</summary>

**Principio de funcionamento do Static Hoisting**:

1. **Analise na fase de compilacao**: O compilador analisa cada no do template, verifica se contem ligacoes dinamicas, e marca como estaticos os nos sem ligacoes dinamicas
2. **Elevacao de nos**: Extrai nos estaticos para fora da funcao render, define como constantes no topo do modulo, cria apenas uma vez na primeira renderizacao
3. **Mecanismo de reutilizacao**: Re-renderizacoes seguintes reutilizam diretamente estes nos estaticos, sem recriacao de VNode, sem participacao em comparacao diff

**Melhoria de performance**:

- **Reduz custo de criacao de VNode**: Nos estaticos criados apenas uma vez
- **Reduz custo de diff**: Nos estaticos pulam comparacao diff
- **Reduz uso de memoria**: Multiplas instancias do componente compartilham nos estaticos
- **Aumenta velocidade de renderizacao**: Efeito especialmente notavel em componentes com muito conteudo estatico

</details>

### Pergunta 2: Diferenca entre Static Hoisting e v-once

Explique a diferenca entre Static Hoisting e `v-once`, e seus respectivos cenarios de uso.

<details>
<summary>Clique para ver a resposta</summary>

**Principais diferencas**:

| Caracteristica | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Acionamento** | Automatico (analise do compilador) | Manual (marcacao do desenvolvedor) |
| **Conteudo aplicavel** | Conteudo completamente estatico | Contem ligacoes dinamicas mas renderiza uma vez |
| **Momento de compilacao** | Compilador decide automaticamente | Desenvolvedor marca explicitamente |
| **Performance** | Otima (nao participa do diff) | Boa (renderiza apenas uma vez) |
| **Comportamento de atualizacao** | Nunca atualiza | Nao atualiza apos primeira renderizacao |

**Recomendacao de escolha**:

- Se o conteudo e completamente estatico -> Deixar o compilador tratar automaticamente (Static Hoisting)
- Se o conteudo tem ligacoes dinamicas mas renderiza uma vez -> Usar `v-once`
- Se o conteudo precisa de atualizacao reativa -> Nao usar `v-once`

</details>

## 5. Best Practices

> Melhores Praticas

### Praticas Recomendadas

```vue
<!-- 1. Deixar o compilador tratar automaticamente conteudo estatico -->
<template>
  <div>
    <h1>Titulo</h1>
    <p>Conteudo estatico</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. Usar v-once explicitamente para conteudo que renderiza uma vez -->
<template>
  <div v-once>
    <p>Data de criacao: {{ createdAt }}</p>
    <p>Criador: {{ creator }}</p>
  </div>
</template>

<!-- 3. Separar estrutura estatica de conteudo dinamico -->
<template>
  <div>
    <!-- Estrutura estatica -->
    <div class="container">
      <header>Titulo</header>
      <!-- Conteudo dinamico -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### Praticas a Evitar

```vue
<!-- 1. Nao usar v-once em excesso -->
<template>
  <!-- Se o conteudo precisa atualizar, nao usar v-once -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. Nao usar v-once em conteudo dinamico -->
<template>
  <!-- Se itens da lista precisam atualizar, nao usar v-once -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Interview Summary

> Resumo para Entrevistas

### Memorizacao Rapida

**Static Hoisting**:

- **Definicao**: Na fase de compilacao, eleva nos estaticos como constantes, cria apenas uma vez
- **Vantagem**: Reduz custo de criacao de VNode e de diff
- **Automatico**: Compilador processa automaticamente, desenvolvedor nao percebe
- **Aplicavel**: Nos que nao dependem de estado reativo

**v-once**:

- **Definicao**: Marca manualmente conteudo que renderiza apenas uma vez
- **Aplicavel**: Blocos com ligacoes dinamicas mas que renderizam apenas uma vez
- **Performance**: Reduz atualizacoes desnecessarias

### Exemplo de Resposta para Entrevista

**P: O que e Static Hoisting no Vue3?**

> "No Vue3, Static Hoisting e uma otimizacao na fase de compilacao. O compilador analisa o template e extrai nos que nao dependem de estado reativo e nunca mudam, transformando-os em constantes no topo do arquivo, criados apenas uma vez na primeira renderizacao e reutilizados nas renderizacoes seguintes, reduzindo o custo de criacao de VNode e de diff. O desenvolvedor nao precisa fazer nada especial para aproveitar esta otimizacao, basta escrever o template normalmente e o compilador decide automaticamente quais nos podem ser elevados. Se quiser marcar manualmente um grande bloco que nunca muda, pode usar v-once."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
