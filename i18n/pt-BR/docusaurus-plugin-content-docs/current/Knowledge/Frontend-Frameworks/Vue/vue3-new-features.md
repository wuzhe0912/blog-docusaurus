---
id: vue3-new-features
title: '[Easy] Novos Recursos do Vue3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Quais são os novos recursos do Vue 3?

O Vue 3 introduziu muitos novos recursos é melhorias, incluindo principalmente:

### Principais Novos Recursos

1. **Composition API**: Nova forma de escrever componentes
2. **Teleport**: Renderizar componentes em outras posições do DOM
3. **Fragment**: Componentes podem ter múltiplos nós raiz
4. **Suspense**: Tratar carregamento de componentes assíncronos
5. **Múltiplos v-model**: Suporte a múltiplos v-model
6. **Melhor suporte a TypeScript**
7. **Otimização de performance**: Bundle menor, renderização mais rápida

## 2. Teleport

> O que é Teleport?

**Definição**: `Teleport` permite renderizar o conteúdo de um componente em outra posição da árvore DOM, sem alterar a estrutura lógica do componente.

### Cenários de Uso

**Cenários comuns**: Modal, Tooltip, Notification e outros componentes que precisam ser renderizados no body

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
          <h2>Título do Modal</h2>
          <p>Conteúdo do Modal</p>
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

1. **Resolve problemas de z-index**: Modal renderizado no body, não é afetado pelos estilos do componente pai
2. **Mantém a estrutura lógica**: A lógica do componente permanece no local original, apenas a posição do DOM é diferente
3. **Melhor manutenibilidade**: Código relacionado ao Modal centralizado no componente

## 3. Fragment (Múltiplos Nós Raiz)

> O que é Fragment?

**Definição**: O Vue 3 permite que componentes tenham múltiplos nós raiz, sem necessidade de envolve-los em um único elemento. Este é um Fragment implícito, não necessitando de uma tag `<Fragment>` como no React.

### Vue 2 vs Vue 3

**Vue 2**: Obrigatório ter um único nó raiz

```vue
<!-- Vue 2: obrigatório envolver em um único elemento -->
<template>
  <div>
    <h1>Título</h1>
    <p>Conteúdo</p>
  </div>
</template>
```

**Vue 3**: Pode ter múltiplos nós raiz

```vue
<!-- Vue 3: pode ter múltiplos nós raiz -->
<template>
  <h1>Título</h1>
  <p>Conteúdo</p>
</template>
```

### Por que precisamos de Fragment?

No Vue 2, componentes deviam ter um único nó raiz, o que frequentemente obrigava os desenvolvedores a adicionar elementos wrapper extras (como `<div>`), que:

1. **Quebram HTML semântico**: Adicionam elementos wrapper sem significado
2. **Aumentam níveis do DOM**: Afetam seletores de estilo e performance
3. **Dificultam controle de estilos**: Necessitam tratar estilos do elemento wrapper extra

### Cenários de Uso

#### Cenário 1: Estrutura HTML Semântica

```vue
<template>
  <!-- Sem necessidade de elemento wrapper extra -->
  <header>
    <h1>Título do Site</h1>
  </header>
  <main>
    <p>Conteúdo Principal</p>
  </main>
  <footer>
    <p>Rodape</p>
  </footer>
</template>
```

#### Cenário 2: Componente de Item de Lista

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

#### Cenário 3: Renderização Condicional de Múltiplos Elementos

```vue
<template>
  <div v-if="showHeader" class="header">Título</div>
  <div v-if="showContent" class="content">Conteúdo</div>
  <div v-if="showFooter" class="footer">Rodape</div>
</template>
```

### Herança de Atributos (Attribute Inheritance)

Quando um componente tem múltiplos nós raiz, o comportamento de herança de atributos é diferente.

**Nó raiz único**: Atributos são herdados automaticamente pelo elemento raiz

```vue
<!-- Componente pai -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente filho (raiz único) -->
<template>
  <div>Conteúdo</div>
</template>

<!-- Resultado renderizado -->
<div class="custom-class" id="my-id">Conteúdo</div>
```

**Múltiplos nós raiz**: Atributos não são herdados automaticamente, necessita tratamento manual

```vue
<!-- Componente pai -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente filho (múltiplos raiz) -->
<template>
  <div>Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>

<!-- Resultado renderizado: atributos não são herdados automaticamente -->
<div>Primeiro raiz</div>
<div>Segundo raiz</div>
```

**Solução**: Usar `$attrs` para vincular atributos manualmente

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

**Usar `inheritAttrs: false` para controlar o comportamento de herança**:

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Desabilitar herança automática
});
</script>

<template>
  <div v-bind="$attrs">Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>
```

### Fragment vs React Fragment

| Característica      | Vue 3 Fragment             | React Fragment                    |
| ------------------- | -------------------------- | --------------------------------- |
| **Sintaxe**         | Implícito (sem tag)        | Explícito (necessita `<Fragment>` ou `<>`) |
| **Atributo Key**    | Não necessário             | Quando necessário usa `<Fragment key={...}>` |
| **Herança de atributos** | Necessita tratamento manual | Não suporta atributos        |

**Vue 3**:

```vue
<!-- Vue 3: Fragment implícito -->
<template>
  <h1>Título</h1>
  <p>Conteúdo</p>
</template>
```

**React**:

```jsx
// React: Fragment explícito
function Component() {
  return (
    <>
      <h1>Título</h1>
      <p>Conteúdo</p>
    </>
  );
}
```

### Observacoes

1. **Herança de atributos**: Com múltiplos nós raiz, atributos não são herdados automaticamente, necessita vincular manualmente com `$attrs`
2. **Escopo de estilos**: Com múltiplos nós raiz, estilos `scoped` são aplicados a todos os nós raiz
3. **Wrapper lógico**: Se logicamente precisa de wrapper, ainda deve usar nó raiz único

```vue
<!-- ✅ Boa prática: logicamente necessita wrapper -->
<template>
  <div class="card">
    <h2>Título</h2>
    <p>Conteúdo</p>
  </div>
</template>

<!-- ⚠️ Evitar: múltiplos raiz sem necessidade -->
<template>
  <h2>Título</h2>
  <p>Conteúdo</p>
  <!-- Se estes elementos logicamente devem ser um grupo, devem ser envolvidos -->
</template>
```

## 4. Suspense

> O que é Suspense?

**Definição**: `Suspense` é um componente built-in usado para tratar o estado de carregamento de componentes assíncronos.

### Uso Básico

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

### Cenários de Uso

1. **Carregamento de componentes assíncronos**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **Carregamento assíncrono de dados**
   ```vue
   <script setup>
   const data = await fetchData(); // Usar await no setup
   </script>
   ```

## 5. Multiple v-model

> Múltiplos v-model

**Definição**: O Vue 3 permite que componentes usem múltiplos `v-model`, cada um correspondendo a um prop diferente.

### Vue 2 vs Vue 3

**Vue 2**: Apenas um `v-model`

```vue
<!-- Vue 2: apenas um v-model -->
<CustomInput v-model="value" />
```

**Vue 3**: Pode ter múltiplos `v-model`

```vue
<!-- Vue 3: pode ter múltiplos v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Exemplo de Implementação

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

### Pergunta 1: Cenários de Uso do Teleport

Explique quando devemos usar `Teleport`.

<details>
<summary>Clique para ver a resposta</summary>

**Cenários para usar Teleport**:

1. **Modal (Dialogo)**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - Resolve problemas de z-index
   - Não é afetado pelos estilos do componente pai

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
   - Gerenciamento unificado da posição das notificações

**Quando não usar Teleport**:

- Conteúdo geral não necessita
- Componentes que não precisam de posição especial no DOM

</details>

### Pergunta 2: Vantagens do Fragment

Explique as vantagens de permitir múltiplos nós raiz no Vue 3.

<details>
<summary>Clique para ver a resposta</summary>

**Vantagens**:

1. **Reduz elementos DOM desnecessários**

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

2. **Melhor HTML semântico**

   - Não necessita adicionar elementos wrapper sem significado por limitação do Vue
   - Mantém a semântica da estrutura HTML

3. **Controle de estilos mais flexível**

   - Não necessita tratar estilos de elementos wrapper extras
   - Reduz complexidade dos seletores CSS

4. **Reduz níveis do DOM**

   - Árvore DOM mais rasa, melhor performance
   - Reduz custo de renderização do navegador

5. **Melhor manutenibilidade**
   - Código mais limpo, sem necessidade de elementos wrapper extras
   - Estrutura do componente mais clara

</details>

### Pergunta 3: Problema de Herança de Atributos do Fragment

Explique o comportamento de herança de atributos quando um componente tem múltiplos nós raiz. Como resolver?

<details>
<summary>Clique para ver a resposta</summary>

**Problema**:

Quando um componente tem múltiplos nós raiz, atributos passados pelo componente pai (como `class`, `id`, etc.) não são herdados automaticamente por nenhum nó raiz.

**Exemplo**:

```vue
<!-- Componente pai -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente filho (múltiplos raiz) -->
<template>
  <div>Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>

<!-- Resultado renderizado: atributos não herdados automaticamente -->
<div>Primeiro raiz</div>
<div>Segundo raiz</div>
```

**Soluções**:

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

2. **Usar `inheritAttrs: false` para controlar comportamento de herança**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Desabilitar herança automática
});
</script>

<template>
  <div v-bind="$attrs">Primeiro raiz</div>
  <div>Segundo raiz</div>
</template>
```

3. **Vincular atributos específicos seletivamente**

```vue
<template>
  <div :class="$attrs.class">Primeiro raiz</div>
  <div :id="$attrs.id">Segundo raiz</div>
</template>
```

**Pontos-chave**:

- Nó raiz único: atributos são herdados automaticamente
- Múltiplos nós raiz: atributos não são herdados automaticamente, necessita tratamento manual
- Usar `$attrs` pode acessar todos os atributos não definidos em `props`

</details>

### Pergunta 4: Fragment vs React Fragment

Compare as diferenças entre Vue 3 Fragment e React Fragment.

<details>
<summary>Clique para ver a resposta</summary>

**Principais diferenças**:

| Característica      | Vue 3 Fragment               | React Fragment                    |
| ------------------- | ---------------------------- | --------------------------------- |
| **Sintaxe**         | Implícito (sem tag)          | Explícito (necessita `<Fragment>` ou `<>`) |
| **Atributo Key**    | Não necessário               | Quando necessário usa `<Fragment key={...}>` |
| **Herança de atributos** | Necessita tratamento manual (`$attrs`) | Não suporta atributos   |

**Vue 3**:

```vue
<!-- Vue 3: Fragment implícito, escreva múltiplos nós raiz diretamente -->
<template>
  <h1>Título</h1>
  <p>Conteúdo</p>
</template>
```

**React**:

```jsx
// React: Fragment explícito, necessita usar tags
function Component() {
  return (
    <>
      <h1>Título</h1>
      <p>Conteúdo</p>
    </>
  );
}

// Ou usando Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>Título</h1>
      <p>Conteúdo</p>
    </Fragment>
  );
}
```

**Comparação de vantagens**:

- **Vue 3**: Sintaxe mais concisa, sem tags extras
- **React**: Mais explícito, pode adicionar atributo key

</details>

### Pergunta 5: Uso do Suspense

Implemente um exemplo usando `Suspense` para carregar um componente assíncrono.

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

// Definir componente assíncrono
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

> Melhores Práticas

### Práticas Recomendadas

```vue
<!-- 1. Modal usando Teleport -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. Múltiplos nós raiz mantendo semântica -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. Componentes assíncronos usando Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. Múltiplos v-model com nomes explicitos -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Práticas a Evitar

```vue
<!-- 1. Não usar Teleport excessivamente -->
<Teleport to="body">
  <div>Conteúdo geral</div> <!-- ❌ Não necessário -->
</Teleport>

<!-- 2. Não quebrar a estrutura para ter múltiplos raiz -->
<template>
  <h1>Título</h1>
  <p>Conteúdo</p>
  <!-- ⚠️ Se logicamente precisa de wrapper, use nó raiz único -->
</template>

<!-- 3. Não ignorar tratamento de erros do Suspense -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ Deve tratar situações de falha de carregamento -->
</Suspense>
```

## 8. Interview Summary

> Resumo para Entrevista

### Memorização Rápida

**Principais novos recursos do Vue 3**:

- **Composition API**: Nova forma de escrever componentes
- **Teleport**: Renderizar componentes em outras posições do DOM
- **Fragment**: Suporte a múltiplos nós raiz
- **Suspense**: Tratar carregamento de componentes assíncronos
- **Múltiplos v-model**: Suporte a múltiplas ligações v-model

**Cenários de uso**:

- Modal/Tooltip → `Teleport`
- HTML semântico → `Fragment`
- Componentes assíncronos → `Suspense`
- Componentes de formulário → Múltiplos `v-model`

### Exemplo de Resposta para Entrevista

**P: Quais são os principais novos recursos do Vue 3?**

> "O Vue 3 introduziu muitos novos recursos, incluindo principalmente: 1) Composition API, oferecendo nova forma de escrever componentes com melhor organização lógica e reutilização de código; 2) Teleport, permitindo renderizar conteúdo de componentes em outras posições da árvore DOM, comumente usado para Modal, Tooltip, etc.; 3) Fragment, componentes podem ter múltiplos nós raiz sem necessidade de elementos wrapper extras; 4) Suspense, trata o estado de carregamento de componentes assíncronos; 5) Múltiplos v-model, suporte a múltiplas ligações v-model em componentes; 6) Melhor suporte a TypeScript e otimização de performance. Esses novos recursos tornam o Vue 3 mais poderoso e flexível, mantendo a compatibilidade."

**P: Quais são os cenários de uso do Teleport?**

> "O Teleport é usado principalmente em cenários onde o componente precisa ser renderizado em outra posição da árvore DOM. Cenários comuns incluem: 1) Modal (dialogos), renderizado no body para evitar problemas de z-index; 2) Tooltip, evitando ser oculto pelo overflow do componente pai; 3) Notification, gerenciamento unificado da posição. A vantagem do Teleport e manter a estrutura lógica do componente inalterada, apenas alterando a posição de renderização do DOM, resolvendo problemas de estilo e mantendo a manutenibilidade do código."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
