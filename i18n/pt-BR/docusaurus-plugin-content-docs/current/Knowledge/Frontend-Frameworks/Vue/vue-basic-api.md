---
id: vue-basic-api
title: '[Medium] Vue Basico e API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Descreva os principios centrais e vantagens do framework Vue

### Principios Centrais

Vue e um framework JavaScript progressivo, cujos principios centrais incluem os seguintes conceitos importantes:

#### 1. Virtual DOM

Usa Virtual DOM para melhorar a performance. Atualiza apenas os nos do DOM que mudaram, em vez de re-renderizar toda a arvore DOM. Atraves do algoritmo diff, compara as diferencas entre o Virtual DOM antigo e o novo, realizando operacoes reais no DOM apenas nas partes diferentes.

```js
// Conceito ilustrativo do Virtual DOM
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Ligacao Bidirecional de Dados (Two-way Data Binding)

Quando o Model muda, a View atualiza automaticamente, e vice-versa. Desenvolvedores nao precisam manipular o DOM manualmente.

```vue
<!-- Escrita recomendada Vue 3: <script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';
const message = ref('Hello Vue');
</script>
```

#### 3. Baseado em Componentes (Component-based)

Divide a aplicacao inteira em componentes individuais, aumentando a reutilizacao. Cada componente tem seu proprio estado, estilo e logica.

#### 4. Lifecycle Hooks

Possui seu proprio ciclo de vida. Quando os dados mudam, hooks especificos sao acionados para executar operacoes correspondentes.

#### 5. Sistema de Diretivas

Fornece diretivas comuns como `v-if`, `v-for`, `v-bind`, `v-model`, permitindo desenvolvimento mais rapido.

#### 6. Sintaxe de Template

Usa templates para escrever HTML, permitindo renderizar dados diretamente no template atraves de interpolacao.

### Vantagens Exclusivas do Vue (comparado ao React)

#### 1. Curva de Aprendizado Mais Baixa

A diferenca de nivel entre membros da equipe nao sera grande, e o estilo de escrita e unificado oficialmente.

#### 2. Sintaxe de Diretivas Propria

O sistema de diretivas do Vue oferece formas mais intuitivas de lidar com logica de UI comum.

#### 3. Ligacao Bidirecional de Dados Mais Facil

Com `v-model`, a ligacao bidirecional e muito simples, enquanto React requer tratamento manual.

#### 4. Separacao de Template e Logica

Separar logica e UI torna a leitura e manutencao mais faceis.

#### 5. Ecossistema Oficial Completo

Vue fornece solucoes oficiais completas (Vue Router, Vuex/Pinia, Vue CLI).

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Explique o uso de `v-model`, `v-bind` e `v-html`

### `v-model`: Ligacao Bidirecional de Dados

Ao alterar dados, o conteudo renderizado no template muda automaticamente, e vice-versa.

```vue
<template>
  <div>
    <!-- Caixa de texto -->
    <input v-model="message" />
    <p>Conteudo digitado: {{ message }}</p>

    <!-- Checkbox -->
    <input type="checkbox" v-model="checked" />
    <p>Selecionado: {{ checked }}</p>

    <!-- Lista de selecao -->
    <select v-model="selected">
      <option value="A">Opcao A</option>
      <option value="B">Opcao B</option>
    </select>
    <p>Opcao selecionada: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### Modificadores do `v-model`

```vue
<!-- .lazy: Atualiza apos o evento change -->
<input v-model.lazy="msg" />

<!-- .number: Converte automaticamente para numero -->
<input v-model.number="age" type="number" />

<!-- .trim: Remove espacos em branco automaticamente -->
<input v-model.trim="msg" />
```

### `v-bind`: Ligacao Dinamica de Atributos

Comumente usado para vincular classes, links, imagens, etc.

```vue
<template>
  <div>
    <!-- Vincular class (abreviacao :class) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">Class dinamica</div>

    <!-- Vincular style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Estilo dinamico</div>

    <!-- Vincular caminho de imagem -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- Vincular link -->
    <a :href="linkUrl">Ir para o link</a>
  </div>
</template>
```

### `v-html`: Renderizar String HTML

Usado quando o conteudo retornado contem tags HTML, como exibir Markdown ou imagens com tags `<img>`.

```vue
<template>
  <div>
    <!-- Interpolacao normal: exibe tags HTML como texto -->
    <p>{{ rawHtml }}</p>

    <!-- v-html: renderiza o HTML -->
    <p v-html="rawHtml"></p>
  </div>
</template>
```

**Aviso de seguranca**: Nunca use `v-html` com conteudo fornecido pelo usuario para evitar vulnerabilidades XSS!

### Resumo Comparativo

| Diretiva | Uso | Abreviacao | Exemplo |
| --------- | ---------------- | ---- | --------------------------- |
| `v-model` | Ligacao bidirecional de formularios | Nenhuma | `<input v-model="msg">` |
| `v-bind` | Ligacao unidirecional de atributos | `:` | `<img :src="url">` |
| `v-html` | Renderizar string HTML | Nenhuma | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> Como acessar elementos HTML no Vue?

No Vue, nao e recomendado usar `document.querySelector`. Em vez disso, use **Template Refs**.

### Composition API (Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputElement = ref(null);

const focusInput = () => {
  inputElement.value?.focus();
};

onMounted(() => {
  console.log(inputElement.value);
});
</script>
```

**Observacoes**: O nome da variavel deve ser identico ao valor do atributo `ref` no template. Acesse o elemento DOM somente apos `onMounted`.

## 4. Please explain the difference between `v-show` and `v-if`

> Explique a diferenca entre `v-show` e `v-if`

### Semelhancas

Ambos controlam a exibicao e ocultacao de elementos DOM baseado em condicoes.

### Diferencas

#### 1. Forma de Manipulacao do DOM

- **`v-show`**: Controla atraves da propriedade CSS `display`. O elemento permanece no DOM.
- **`v-if`**: Remove ou adiciona o elemento diretamente do DOM.

#### 2. Diferencas de Performance

- **`v-show`**: Custo inicial maior (elemento sempre e criado), custo de alternancia menor (apenas CSS). Adequado para **alternancia frequente**.
- **`v-if`**: Custo inicial menor (nao renderiza quando false), custo de alternancia maior (destroi/recria). Adequado para **condicoes que raramente mudam**.

#### 3. Acionamento de Lifecycle

- **`v-if`**: Aciona o ciclo de vida completo do componente
- **`v-show`**: Nao aciona o ciclo de vida do componente

### Tabela Comparativa

| Caracteristica | v-if | v-show |
| ------------ | ------------------------- | ---------------- |
| Custo inicial | Baixo (nao renderiza se false) | Alto (sempre renderiza) |
| Custo de alternancia | Alto (destroi/recria) | Baixo (apenas CSS) |
| Cenario | Condicoes que raramente mudam | Alternancia frequente |
| Lifecycle | Aciona | Nao aciona |
| Uso combinado | v-else-if, v-else | Nenhum |

### Ponto de Memorizacao

> - `v-if`: Nao renderiza quando nao exibe, adequado para condicoes que raramente mudam
> - `v-show`: Renderiza desde o inicio, pronto para exibir, adequado para alternancia frequente

## 5. What's the difference between `computed` and `watch`?

> Qual e a diferenca entre `computed` e `watch`?

### `computed` (Propriedades Computadas)

- **Mecanismo de cache**: O resultado e armazenado em cache e so e recalculado quando as dependencias mudam
- **Rastreamento automatico**: Rastreia automaticamente os dados reativos usados
- **Calculo sincrono**: Deve ser sincrono e ter valor de retorno
- Adequado para: formatacao, filtragem, soma de dados

### `watch` (Propriedades de Observacao)

- **Rastreamento manual**: Necessita especificar explicitamente quais dados observar
- **Operacoes assincronas**: Adequado para chamadas de API, timers, etc.
- **Sem valor de retorno**: Usado principalmente para efeitos colaterais
- **Valores antigo e novo**: Pode acessar valores antes e depois da mudanca

### Tabela Comparativa

| Caracteristica | computed | watch |
| ----------------- | ---------------------- | ---------------------- |
| **Uso principal** | Calcular novos dados a partir de existentes | Observar mudancas e executar efeitos |
| **Valor de retorno** | Obrigatorio | Nao necessario |
| **Cache** | Sim | Nao |
| **Rastreamento** | Automatico | Manual |
| **Operacoes assincronas** | Nao suporta | Suporta |
| **Valores antigo/novo** | Nao disponivel | Disponivel |

### Ponto de Memorizacao

> **"`computed` calcula dados, `watch` executa acoes"**
>
> - `computed`: Para **calcular novos dados** (formatacao, filtragem, soma)
> - `watch`: Para **executar acoes** (requisicoes API, salvar dados, exibir notificacoes)

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
