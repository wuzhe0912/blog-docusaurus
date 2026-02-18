---
id: vue-basic-api
title: '[Medium] Vue Básico e API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Descreva os princípios centrais e vantagens do framework Vue

### Princípios Centrais

Vue é um framework JavaScript progressivo, cujos princípios centrais incluem os seguintes conceitos importantes:

#### 1. Virtual DOM

Usa Virtual DOM para melhorar a performance. Atualiza apenas os nós do DOM que mudaram, em vez de re-renderizar toda a árvore DOM. Através do algoritmo diff, compara as diferenças entre o Virtual DOM antigo é o novo, realizando operações reais no DOM apenas nas partes diferentes.

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

#### 2. Ligação Bidirecional de Dados (Two-way Data Binding)

Quando o Model muda, a View atualiza automaticamente, e vice-versa. Desenvolvedores não precisam manipular o DOM manualmente.

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

Divide a aplicação inteira em componentes individuais, aumentando a reutilização. Cada componente tem seu próprio estado, estilo e lógica.

#### 4. Lifecycle Hooks

Possui seu próprio ciclo de vida. Quando os dados mudam, hooks específicos são acionados para executar operações correspondentes.

#### 5. Sistema de Diretivas

Fornece diretivas comuns como `v-if`, `v-for`, `v-bind`, `v-model`, permitindo desenvolvimento mais rápido.

#### 6. Sintaxe de Template

Usa templates para escrever HTML, permitindo renderizar dados diretamente no template através de interpolação.

### Vantagens Exclusivas do Vue (comparado ao React)

#### 1. Curva de Aprendizado Mais Baixa

A diferença de nível entre membros da equipe não será grande, é o estilo de escrita e unificado oficialmente.

#### 2. Sintaxe de Diretivas Própria

O sistema de diretivas do Vue oferece formas mais intuitivas de lidar com lógica de UI comum.

#### 3. Ligação Bidirecional de Dados Mais Fácil

Com `v-model`, a ligação bidirecional é muito simples, enquanto React requer tratamento manual.

#### 4. Separação de Template e Lógica

Separar lógica e UI torna a leitura e manutenção mais fáceis.

#### 5. Ecossistema Oficial Completo

Vue fornece soluções oficiais completas (Vue Router, Vuex/Pinia, Vue CLI).

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Explique o uso de `v-model`, `v-bind` e `v-html`

### `v-model`: Ligação Bidirecional de Dados

Ao alterar dados, o conteúdo renderizado no template muda automaticamente, e vice-versa.

```vue
<template>
  <div>
    <!-- Caixa de texto -->
    <input v-model="message" />
    <p>Conteúdo digitado: {{ message }}</p>

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
<!-- .lazy: Atualiza após o evento change -->
<input v-model.lazy="msg" />

<!-- .number: Converte automaticamente para número -->
<input v-model.number="age" type="number" />

<!-- .trim: Remove espacos em branco automaticamente -->
<input v-model.trim="msg" />
```

### `v-bind`: Ligação Dinâmica de Atributos

Comumente usado para vincular classes, links, imagens, etc.

```vue
<template>
  <div>
    <!-- Vincular class (abreviacao :class) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">Class dinamica</div>

    <!-- Vincular style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Estilo dinâmico</div>

    <!-- Vincular caminho de imagem -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- Vincular link -->
    <a :href="linkUrl">Ir para o link</a>
  </div>
</template>
```

### `v-html`: Renderizar String HTML

Usado quando o conteúdo retornado contém tags HTML, como exibir Markdown ou imagens com tags `<img>`.

```vue
<template>
  <div>
    <!-- Interpolação normal: exibe tags HTML como texto -->
    <p>{{ rawHtml }}</p>

    <!-- v-html: renderiza o HTML -->
    <p v-html="rawHtml"></p>
  </div>
</template>
```

**Aviso de segurança**: Nunca use `v-html` com conteúdo fornecido pelo usuario para evitar vulnerabilidades XSS!

### Resumo Comparativo

| Diretiva | Uso | Abreviacao | Exemplo |
| --------- | ---------------- | ---- | --------------------------- |
| `v-model` | Ligação bidirecional de formulários | Nenhuma | `<input v-model="msg">` |
| `v-bind` | Ligação unidirecional de atributos | `:` | `<img :src="url">` |
| `v-html` | Renderizar string HTML | Nenhuma | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> Como acessar elementos HTML no Vue?

No Vue, não é recomendado usar `document.querySelector`. Em vez disso, use **Template Refs**.

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

**Observacoes**: O nome da variável deve ser identico ao valor do atributo `ref` no template. Acesse o elemento DOM somente após `onMounted`.

## 4. Please explain the difference between `v-show` and `v-if`

> Explique a diferença entre `v-show` e `v-if`

### Semelhanças

Ambos controlam a exibição e ocultacao de elementos DOM baseado em condições.

### Diferenças

#### 1. Forma de Manipulação do DOM

- **`v-show`**: Controla através da propriedade CSS `display`. O elemento permanece no DOM.
- **`v-if`**: Remove ou adiciona o elemento diretamente do DOM.

#### 2. Diferenças de Performance

- **`v-show`**: Custo inicial maior (elemento sempre e criado), custo de alternância menor (apenas CSS). Adequado para **alternância frequente**.
- **`v-if`**: Custo inicial menor (não renderiza quando false), custo de alternância maior (destroi/recria). Adequado para **condições que raramente mudam**.

#### 3. Acionamento de Lifecycle

- **`v-if`**: Aciona o ciclo de vida completo do componente
- **`v-show`**: Não aciona o ciclo de vida do componente

### Tabela Comparativa

| Característica | v-if | v-show |
| ------------ | ------------------------- | ---------------- |
| Custo inicial | Baixo (não renderiza se false) | Alto (sempre renderiza) |
| Custo de alternância | Alto (destroi/recria) | Baixo (apenas CSS) |
| Cenário | Condições que raramente mudam | Alternância frequente |
| Lifecycle | Aciona | Não aciona |
| Uso combinado | v-else-if, v-else | Nenhum |

### Ponto de Memorização

> - `v-if`: Não renderiza quando não exibe, adequado para condições que raramente mudam
> - `v-show`: Renderiza desde o início, pronto para exibir, adequado para alternância frequente

## 5. What's the difference between `computed` and `watch`?

> Qual é a diferença entre `computed` e `watch`?

### `computed` (Propriedades Computadas)

- **Mecanismo de cache**: O resultado e armazenado em cache e só e recalculado quando as dependências mudam
- **Rastreamento automático**: Rastreia automaticamente os dados reativos usados
- **Calculo síncrono**: Deve ser síncrono e ter valor de retorno
- Adequado para: formatacao, filtragem, soma de dados

### `watch` (Propriedades de Observação)

- **Rastreamento manual**: Necessita especificar explicitamente quais dados observar
- **Operações assíncronas**: Adequado para chamadas de API, timers, etc.
- **Sem valor de retorno**: Usado principalmente para efeitos colaterais
- **Valores antigo e novo**: Pode acessar valores antes e depois da mudança

### Tabela Comparativa

| Característica | computed | watch |
| ----------------- | ---------------------- | ---------------------- |
| **Uso principal** | Calcular novos dados a partir de existentes | Observar mudanças e executar efeitos |
| **Valor de retorno** | Obrigatório | Não necessário |
| **Cache** | Sim | Não |
| **Rastreamento** | Automático | Manual |
| **Operações assíncronas** | Não suporta | Suporta |
| **Valores antigo/novo** | Não disponível | Disponível |

### Ponto de Memorização

> **"`computed` calcula dados, `watch` executa ações"**
>
> - `computed`: Para **calcular novos dados** (formatacao, filtragem, soma)
> - `watch`: Para **executar ações** (requisições API, salvar dados, exibir notificações)

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
