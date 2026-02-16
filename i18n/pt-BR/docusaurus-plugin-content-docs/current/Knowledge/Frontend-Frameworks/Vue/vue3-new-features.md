---
id: vue3-new-features
title: '[Easy] Novos Recursos do Vue3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Quais sao os novos recursos do Vue 3?

O Vue 3 introduziu muitos novos recursos e melhorias, incluindo principalmente:

### Principais Novos Recursos

1. **Composition API**: Nova forma de escrever componentes
2. **Teleport**: Renderizar componentes em outras posicoes do DOM
3. **Fragment**: Componentes podem ter multiplos nos raiz
4. **Suspense**: Tratar carregamento de componentes assincronos
5. **Multiplos v-model**: Suporte a multiplos v-model
6. **Melhor suporte a TypeScript**
7. **Otimizacao de performance**: Bundle menor, renderizacao mais rapida

## 2. Teleport

> O que e Teleport?

**Definicao**: `Teleport` permite renderizar o conteudo de um componente em outra posicao da arvore DOM, sem alterar a estrutura logica do componente.

### Cenarios de Uso

**Cenarios comuns**: Modal, Tooltip, Notification e outros componentes que precisam ser renderizados no body

<details>
<summary>Clique para expandir o exemplo de Teleport</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Abrir Modal</button>

    <!-- Usar Teleport para renderizar o Modal no body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Titulo do Modal</h2>
          <p>Conteudo do Modal</p>
          <button @click="showModal = false">Fechar</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### Vantagens

1. **Resolve problemas de z-index**: Modal renderizado no body, nao e afetado pelos estilos do componente pai
2. **Mantem a estrutura logica**: A logica do componente permanece no local original, apenas a posicao do DOM e diferente
3. **Melhor manutenibilidade**: Codigo relacionado ao Modal centralizado no componente

## 3. Fragment (Multiplos Nos Raiz)

> O que e Fragment?

**Definicao**: O Vue 3 permite que componentes tenham multiplos nos raiz, sem necessidade de envolve-los em um unico elemento. Este e um Fragment implicito, nao necessitando de uma tag `<Fragment>` como no React.

### Vue 2 vs Vue 3

**Vue 2**: Obrigatorio ter um unico no raiz

```vue
<!-- Vue 2: obrigatorio envolver em um unico elemento -->
<template>
  <div>
    <h1>Titulo</h1>
    <p>Conteudo</p>
  </div>
</template>
```

**Vue 3**: Pode ter multiplos nos raiz

```vue
<!-- Vue 3: pode ter multiplos nos raiz -->
<template>
  <h1>Titulo</h1>
  <p>Conteudo</p>
</template>
```

### Por que precisamos de Fragment?

No Vue 2, componentes deviam ter um unico no raiz, o que frequentemente obrigava os desenvolvedores a adicionar elementos wrapper extras (como `<div>`), que:

1. **Quebram HTML semantico**: Adicionam elementos wrapper sem significado
2. **Aumentam niveis do DOM**: Afetam seletores de estilo e performance
3. **Dificultam controle de estilos**: Necessitam tratar estilos do elemento wrapper extra

### Cenarios de Uso

#### Cenario 1: Estrutura HTML Semantica

```vue
<template>
  <!-- Sem necessidade de elemento wrapper extra -->
  <header>
    <h1>Titulo do Site</h1>
  </header>
  <main>
    <p>Conteudo Principal</p>
  </main>
  <footer>
    <p>Rodape</p>
  </footer>
</template>
```

#### Cenario 2: Componente de Item de Lista

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### Cenario 3: Renderizacao Condicional de Multiplos Elementos

```vue
<template>
  <div v-if="showHeader" class="header">Titulo</div>
  <div v-if="showContent" class="content">Conteudo</div>
  <div v-if="showFooter" class="footer">Rodape</div>
</template>
```

### Heranca de Atributos (Attribute Inheritance)

Quando um componente tem multiplos nos raiz, o comportamento de heranca de atributos e diferente.

**No raiz unico**: Atributos sao herdados automaticamente pelo elemento raiz

```vue
<!-- Componente pai -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente filho (raiz unico) -->
<template>
  <div>Conteudo</div>
</template>

<!-- Resultado renderizado -->
<div class="custom-class" id="my-id">Conteudo</div>
```

**Multiplos nos raiz**: Atributos nao sao herdados automaticamente, necessita tratamento manual

```vue
<!-- Componente pai -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente filho (multiplos raiz) -->
<template>
  <div>Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>

<!-- Resultado renderizado: atributos nao sao herdados automaticamente -->
<div>Primeiro raiz</div>
<div>Segundo raiz</div>
```

**Solucao**: Usar `$attrs` para vincular atributos manualmente

```vue
<!-- Componente filho -->
<template>
  <div v-bind="$attrs">Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>

<!-- Resultado renderizado -->
<div class="custom-class" id="my-id">Primeiro raiz</div>
<div>Segundo raiz</div>
```

**Usar `inheritAttrs: false` para controlar o comportamento de heranca**:

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Desabilitar heranca automatica
});
</script>

<template>
  <div v-bind="$attrs">Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>
```

### Fragment vs React Fragment

| Caracteristica      | Vue 3 Fragment             | React Fragment                    |
| ------------------- | -------------------------- | --------------------------------- |
| **Sintaxe**         | Implicito (sem tag)        | Explicito (necessita `<Fragment>` ou `<>`) |
| **Atributo Key**    | Nao necessario             | Quando necessario usa `<Fragment key={...}>` |
| **Heranca de atributos** | Necessita tratamento manual | Nao suporta atributos        |

**Vue 3**:

```vue
<!-- Vue 3: Fragment implicito -->
<template>
  <h1>Titulo</h1>
  <p>Conteudo</p>
</template>
```

**React**:

```jsx
// React: Fragment explicito
function Component() {
  return (
    <>
      <h1>Titulo</h1>
      <p>Conteudo</p>
    </>
  );
}
```

### Observacoes

1. **Heranca de atributos**: Com multiplos nos raiz, atributos nao sao herdados automaticamente, necessita vincular manualmente com `$attrs`
2. **Escopo de estilos**: Com multiplos nos raiz, estilos `scoped` sao aplicados a todos os nos raiz
3. **Wrapper logico**: Se logicamente precisa de wrapper, ainda deve usar no raiz unico

```vue
<!-- ✅ Boa pratica: logicamente necessita wrapper -->
<template>
  <div class="card">
    <h2>Titulo</h2>
    <p>Conteudo</p>
  </div>
</template>

<!-- ⚠️ Evitar: multiplos raiz sem necessidade -->
<template>
  <h2>Titulo</h2>
  <p>Conteudo</p>
  <!-- Se estes elementos logicamente devem ser um grupo, devem ser envolvidos -->
</template>
```

## 4. Suspense

> O que e Suspense?

**Definicao**: `Suspense` e um componente built-in usado para tratar o estado de carregamento de componentes assincronos.

### Uso Basico

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Carregando...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Cenarios de Uso

1. **Carregamento de componentes assincronos**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **Carregamento assincrono de dados**
   ```vue
   <script setup>
   const data = await fetchData(); // Usar await no setup
   </script>
   ```

## 5. Multiple v-model

> Multiplos v-model

**Definicao**: O Vue 3 permite que componentes usem multiplos `v-model`, cada um correspondendo a um prop diferente.

### Vue 2 vs Vue 3

**Vue 2**: Apenas um `v-model`

```vue
<!-- Vue 2: apenas um v-model -->
<CustomInput v-model="value" />
```

**Vue 3**: Pode ter multiplos `v-model`

```vue
<!-- Vue 3: pode ter multiplos v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Exemplo de Implementacao

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> Perguntas Comuns de Entrevista

### Pergunta 1: Cenarios de Uso do Teleport

Explique quando devemos usar `Teleport`.

<details>
<summary>Clique para ver a resposta</summary>

**Cenarios para usar Teleport**:

1. **Modal (Dialogo)**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - Resolve problemas de z-index
   - Nao e afetado pelos estilos do componente pai

2. **Tooltip**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - Evita ser oculto pelo overflow do componente pai

3. **Notification**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - Gerenciamento unificado da posicao das notificacoes

**Quando nao usar Teleport**:

- Conteudo geral nao necessita
- Componentes que nao precisam de posicao especial no DOM

</details>

### Pergunta 2: Vantagens do Fragment

Explique as vantagens de permitir multiplos nos raiz no Vue 3.

<details>
<summary>Clique para ver a resposta</summary>

**Vantagens**:

1. **Reduz elementos DOM desnecessarios**

   ```vue
   <!-- Vue 2: necessita div extra -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3: sem necessidade de elemento extra -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **Melhor HTML semantico**

   - Nao necessita adicionar elementos wrapper sem significado por limitacao do Vue
   - Mantem a semantica da estrutura HTML

3. **Controle de estilos mais flexivel**

   - Nao necessita tratar estilos de elementos wrapper extras
   - Reduz complexidade dos seletores CSS

4. **Reduz niveis do DOM**

   - Arvore DOM mais rasa, melhor performance
   - Reduz custo de renderizacao do navegador

5. **Melhor manutenibilidade**
   - Codigo mais limpo, sem necessidade de elementos wrapper extras
   - Estrutura do componente mais clara

</details>

### Pergunta 3: Problema de Heranca de Atributos do Fragment

Explique o comportamento de heranca de atributos quando um componente tem multiplos nos raiz. Como resolver?

<details>
<summary>Clique para ver a resposta</summary>

**Problema**:

Quando um componente tem multiplos nos raiz, atributos passados pelo componente pai (como `class`, `id`, etc.) nao sao herdados automaticamente por nenhum no raiz.

**Exemplo**:

```vue
<!-- Componente pai -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente filho (multiplos raiz) -->
<template>
  <div>Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>

<!-- Resultado renderizado: atributos nao herdados automaticamente -->
<div>Primeiro raiz</div>
<div>Segundo raiz</div>
```

**Solucoes**:

1. **Usar `$attrs` para vincular atributos manualmente**

```vue
<!-- Componente filho -->
<template>
  <div v-bind="$attrs">Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>

<!-- Resultado renderizado -->
<div class="custom-class" id="my-id">Primeiro raiz</div>
<div>Segundo raiz</div>
```

2. **Usar `inheritAttrs: false` para controlar comportamento de heranca**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Desabilitar heranca automatica
});
</script>

<template>
  <div v-bind="$attrs">Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>
```

3. **Vincular atributos especificos seletivamente**

```vue
<template>
  <div :class="$attrs.class">Primeiro raiz</div>
  <div :id="$attrs.id">Segundo raiz</div>
</template>
```

**Pontos-chave**:

- No raiz unico: atributos sao herdados automaticamente
- Multiplos nos raiz: atributos nao sao herdados automaticamente, necessita tratamento manual
- Usar `$attrs` pode acessar todos os atributos nao definidos em `props`

</details>

### Pergunta 4: Fragment vs React Fragment

Compare as diferencas entre Vue 3 Fragment e React Fragment.

<details>
<summary>Clique para ver a resposta</summary>

**Principais diferencas**:

| Caracteristica      | Vue 3 Fragment               | React Fragment                    |
| ------------------- | ---------------------------- | --------------------------------- |
| **Sintaxe**         | Implicito (sem tag)          | Explicito (necessita `<Fragment>` ou `<>`) |
| **Atributo Key**    | Nao necessario               | Quando necessario usa `<Fragment key={...}>` |
| **Heranca de atributos** | Necessita tratamento manual (`$attrs`) | Nao suporta atributos   |

**Vue 3**:

```vue
<!-- Vue 3: Fragment implicito, escreva multiplos nos raiz diretamente -->
<template>
  <h1>Titulo</h1>
  <p>Conteudo</p>
</template>
```

**React**:

```jsx
// React: Fragment explicito, necessita usar tags
function Component() {
  return (
    <>
      <h1>Titulo</h1>
      <p>Conteudo</p>
    </>
  );
}

// Ou usando Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>Titulo</h1>
      <p>Conteudo</p>
    </Fragment>
  );
}
```

**Comparacao de vantagens**:

- **Vue 3**: Sintaxe mais concisa, sem tags extras
- **React**: Mais explicito, pode adicionar atributo key

</details>

### Pergunta 5: Uso do Suspense

Implemente um exemplo usando `Suspense` para carregar um componente assincrono.

<details>
<summary>Clique para ver a resposta</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Carregando dados do usuario...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// Definir componente assincrono
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**Uso avancado: Tratamento de erros**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Carregando...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('Componente carregado com sucesso');
};

const onReject = (error) => {
  console.error('Falha ao carregar componente:', error);
};
</script>
```

</details>

## 7. Best Practices

> Melhores Praticas

### Praticas Recomendadas

```vue
<!-- 1. Modal usando Teleport -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. Multiplos nos raiz mantendo semantica -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. Componentes assincronos usando Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. Multiplos v-model com nomes explicitos -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Praticas a Evitar

```vue
<!-- 1. Nao usar Teleport excessivamente -->
<Teleport to="body">
  <div>Conteudo geral</div> <!-- ❌ Nao necessario -->
</Teleport>

<!-- 2. Nao quebrar a estrutura para ter multiplos raiz -->
<template>
  <h1>Titulo</h1>
  <p>Conteudo</p>
  <!-- ⚠️ Se logicamente precisa de wrapper, use no raiz unico -->
</template>

<!-- 3. Nao ignorar tratamento de erros do Suspense -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ Deve tratar situacoes de falha de carregamento -->
</Suspense>
```

## 8. Interview Summary

> Resumo para Entrevista

### Memorizacao Rapida

**Principais novos recursos do Vue 3**:

- **Composition API**: Nova forma de escrever componentes
- **Teleport**: Renderizar componentes em outras posicoes do DOM
- **Fragment**: Suporte a multiplos nos raiz
- **Suspense**: Tratar carregamento de componentes assincronos
- **Multiplos v-model**: Suporte a multiplas ligacoes v-model

**Cenarios de uso**:

- Modal/Tooltip → `Teleport`
- HTML semantico → `Fragment`
- Componentes assincronos → `Suspense`
- Componentes de formulario → Multiplos `v-model`

### Exemplo de Resposta para Entrevista

**P: Quais sao os principais novos recursos do Vue 3?**

> "O Vue 3 introduziu muitos novos recursos, incluindo principalmente: 1) Composition API, oferecendo nova forma de escrever componentes com melhor organizacao logica e reutilizacao de codigo; 2) Teleport, permitindo renderizar conteudo de componentes em outras posicoes da arvore DOM, comumente usado para Modal, Tooltip, etc.; 3) Fragment, componentes podem ter multiplos nos raiz sem necessidade de elementos wrapper extras; 4) Suspense, trata o estado de carregamento de componentes assincronos; 5) Multiplos v-model, suporte a multiplas ligacoes v-model em componentes; 6) Melhor suporte a TypeScript e otimizacao de performance. Esses novos recursos tornam o Vue 3 mais poderoso e flexivel, mantendo a compatibilidade."

**P: Quais sao os cenarios de uso do Teleport?**

> "O Teleport e usado principalmente em cenarios onde o componente precisa ser renderizado em outra posicao da arvore DOM. Cenarios comuns incluem: 1) Modal (dialogos), renderizado no body para evitar problemas de z-index; 2) Tooltip, evitando ser oculto pelo overflow do componente pai; 3) Notification, gerenciamento unificado da posicao. A vantagem do Teleport e manter a estrutura logica do componente inalterada, apenas alterando a posicao de renderizacao do DOM, resolvendo problemas de estilo e mantendo a manutenibilidade do codigo."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
