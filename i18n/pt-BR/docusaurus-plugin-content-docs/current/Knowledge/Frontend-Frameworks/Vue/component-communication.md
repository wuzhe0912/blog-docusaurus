---
id: vue-component-commúnication
title: '[Medium] Comúnicação entre Componentes'
slug: /vue-component-commúnication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to commúnicate with each other?

> Quais são as formas de comúnicação entre componentes Vue?

A transferência de dados entre componentes Vue é uma necessidade muito comum no desenvolvimento. Dependendo da relação entre os componentes, existem varias formas de comúnicação disponíveis.

### Classificação de Relacoes entre Componentes

```text
Pai-filho: props / $emit
Avo-neto: provide / inject
Irmaos: Event Bus / Vuex / Pinia
Qualquer componente: Vuex / Pinia
```

### 1. Props (Pai para Filho)

**Uso**: Componente pai passa dados para o componente filho

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Componente Pai</h1>
    <ChildComponent
      :message="parentMessage"
      :user="userInfo"
      :count="counter"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const parentMessage = ref('Hello from parent');
const userInfo = ref({
  name: 'John',
  age: 30,
});
const counter = ref(0);
</script>
```

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h2>Componente Filho</h2>
    <p>Mensagem recebida: {{ message }}</p>
    <p>Usuario: {{ user.name }} ({{ user.age }} anos)</p>
    <p>Contagem: {{ count }}</p>
  </div>
</template>

<script setup>
// Validação de tipos básicos
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // Validação de tipo objeto
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // Validação de tipo numerico
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // Validação customizada: deve ser >= 0
  },
});
</script>
```

#### Observacoes sobre Props

```vue
<!-- Escrita Vue 3 <script setup> -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // Errado: não se deve modificar props diretamente
  // props.message = 'new value'; // Gera um aviso

  // Correto: já copiamos a prop para um ref acima
  localMessage.value = props.message;
});
</script>
```

### 2. $emit (Filho para Pai)

**Uso**: Componente filho envia eventos e dados para o componente pai

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">Enviar para o pai</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // Envia evento para o componente pai
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // Envia valor de entrada em tempo real
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Componente Pai</h1>

    <!-- Escuta eventos do componente filho -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>Dados recebidos: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('Evento recebido do filho:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Valor de entrada atualizado:', value);
};
</script>
```

#### Opção emits no Vue 3

```vue
<!-- Escrita Vue 3 <script setup> -->
<script setup>
const emit = defineEmits({
  // Declara eventos que serão emitidos
  'custom-event': null,

  // Evento com validação
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue deve ser uma string');
      return false;
    }
    return true;
  },
});

const sendEvent = () => {
  emit('custom-event', 'data');
};
</script>
```

### 3. v-model (Ligação Bidirecional)

**Uso**: Ligação bidirecional de dados entre componentes pai e filho

#### v-model no Vue 2

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- Equivalente a -->
  <custom-input :value="message" @input="message = $event" />
</template>
```

```vue
<!-- CustomInput.vue (Vue 2) -->
<template>
  <input :value="value" @input="$emit('input', $event.target.value)" />
</template>

<script>
export default {
  props: ['value'],
};
</script>
```

#### v-model no Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- Equivalente a -->
  <custom-input :modelValue="message" @update:modelValue="message = $event" />
</template>

<script setup>
import { ref } from 'vue';
import CustomInput from './CustomInput.vue';

const message = ref('');
</script>
```

```vue
<!-- CustomInput.vue - Vue 3 <script setup> -->
<template>
  <input :value="modelValue" @input="updateValue" />
</template>

<script setup>
defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>
```

#### Múltiplos v-model no Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <user-form v-model:name="userName" v-model:email="userEmail" />
</template>

<script setup>
import { ref } from 'vue';
import UserForm from './UserForm.vue';

const userName = ref('');
const userEmail = ref('');
</script>
```

```vue
<!-- UserForm.vue - Vue 3 <script setup> -->
<template>
  <div>
    <input
      :value="name"
      @input="$emit('update:name', $event.target.value)"
      placeholder="Nome"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="E-mail"
    />
  </div>
</template>

<script setup>
defineProps({
  name: String,
  email: String,
});

defineEmits(['update:name', 'update:email']);
</script>
```

### 4. Provide / Inject (Componentes Avo-Neto)

**Uso**: Comúnicação entre componentes de níveis diferentes, evitando passar props camada por camada

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Componente Avo</h1>
    <parent-component />
  </div>
</template>

<script>
import { ref, provide } from 'vue';
import ParentComponent from './ParentComponent.vue';

export default {
  components: { ParentComponent },

  setup() {
    const userInfo = ref({
      name: 'John',
      role: 'admin',
    });

    const updateUser = (newInfo) => {
      userInfo.value = { ...userInfo.value, ...newInfo };
    };

    // Fornece dados é métodos para componentes descendentes
    provide('userInfo', userInfo);
    provide('updateUser', updateUser);

    return { userInfo };
  },
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h2>Componente Pai (não usa inject)</h2>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h3>Componente Filho</h3>
    <p>Usuario: {{ userInfo.name }}</p>
    <p>Função: {{ userInfo.role }}</p>
    <button @click="changeUser">Modificar usuario</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // Injeta dados fornecidos pelo componente avo
    const userInfo = inject('userInfo');
    const updateUser = inject('updateUser');

    const changeUser = () => {
      updateUser({ name: 'Jane', role: 'user' });
    };

    return {
      userInfo,
      changeUser,
    };
  },
};
</script>
```

#### Observacoes sobre Provide / Inject

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // Errado: componentes descendentes podem modificar diretamente
    provide('state', state);

    // Correto: fornecer dados somente leitura é métodos de modificacao
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs (Pai acessa Filho)

**Uso**: Componente pai acessa diretamente propriedades e métodos do componente filho

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">Chamar metodo do filho</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // Chama diretamente o método do componente filho
      this.$refs.childRef.someMethod();

      // Acessa dados do componente filho
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // Acessa $refs somente após o mounted
    console.log(this.$refs.childRef);
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  data() {
    return {
      someData: 'Child data',
    };
  },

  methods: {
    someMethod() {
      console.log('Metodo do componente filho foi chamado');
    },
  },
};
</script>
```

#### ref com Composition API no Vue 3

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Chamar componente filho</button>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const childRef = ref(null);

const callChild = () => {
  childRef.value.someMethod();
};
</script>
```

### 6. $parent / $root (Filho acessa Pai)

**Uso**: Componente filho acessa o componente pai ou o componente raiz (não recomendado)

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // Acessa o componente pai
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // Acessa o componente raiz
    console.log(this.$root.globalData);
  },
};
</script>
```

**Razoes para não recomendar**:

- Aumenta o acoplamento entre componentes
- Difícil rastrear o fluxo de dados
- Desfavoravel para reutilização de componentes
- Recomenda-se usar props, $emit ou provide/inject

### 7. Event Bus (Qualquer Componente)

**Uso**: Comúnicação entre quaisquer componentes (comum no Vue 2, não recomendado no Vue 3)

#### Event Bus no Vue 2

```js
// eventBus.js
import Vue from 'vue';
export const EventBus = new Vue();
```

```vue
<!-- ComponentA.vue -->
<script>
import { EventBus } from './eventBus';

export default {
  methods: {
    sendMessage() {
      EventBus.$emit('message-sent', {
        text: 'Hello',
        from: 'ComponentA',
      });
    },
  },
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script>
import { EventBus } from './eventBus';

export default {
  mounted() {
    EventBus.$on('message-sent', (data) => {
      console.log('Mensagem recebida:', data);
    });
  },

  beforeUnmount() {
    // Lembre-se de remover o listener
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Alternativa no Vue 3: mitt

```js
// eventBus.js
import mitt from 'mitt';
export const emitter = mitt();
```

```vue
<!-- ComponentA.vue -->
<script setup>
import { emitter } from './eventBus';

const sendMessage = () => {
  emitter.emit('message-sent', {
    text: 'Hello',
    from: 'ComponentA',
  });
};
</script>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { onMounted, onUnmounted } from 'vue';
import { emitter } from './eventBus';

const handleMessage = (data) => {
  console.log('Mensagem recebida:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia (Gerenciamento de Estado Global)

**Uso**: Gerenciar estado global complexo

#### Pinia (Recomendado para Vue 3)

```js
// stores/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    isLoggedIn: false,
  }),

  getters: {
    fullInfo: (state) => `${state.name} (${state.email})`,
  },

  actions: {
    login(name, email) {
      this.name = name;
      this.email = email;
      this.isLoggedIn = true;
    },

    logout() {
      this.name = '';
      this.email = '';
      this.isLoggedIn = false;
    },
  },
});
```

```vue
<!-- ComponentA.vue -->
<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const handleLogin = () => {
  userStore.login('John', 'john@example.com');
};
</script>

<template>
  <div>
    <button @click="handleLogin">Login</button>
  </div>
</template>
```

```vue
<!-- ComponentB.vue -->
<script setup>
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div>
    <p v-if="userStore.isLoggedIn">Bem-vindo, {{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots (Distribuição de Conteúdo)

**Uso**: Componente pai passa conteúdo de template para o componente filho

#### Slot Básico

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Título padrão</slot>
    </header>

    <main>
      <slot>Conteúdo padrão</slot>
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component>
    <template #header>
      <h1>Título personalizado</h1>
    </template>

    <p>Este é o conteúdo principal</p>

    <template #footer>
      <button>Confirmar</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots (Slots com Escopo)

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Passa dados para o componente pai -->
      <slot :item="item" :index="index"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['items'],
};
</script>
```

```vue
<!-- ParentComponent.vue -->
<template>
  <list-component :items="users">
    <!-- Recebe dados passados pelo componente filho -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Guia de Escolha de Comúnicação entre Componentes

| Relação | Método Recomendado | Quando Usar |
| -------- | -------------- | -------------------------- |
| Pai -> Filho | Props | Passar dados para o filho |
| Filho -> Pai | $emit | Notificar o pai sobre eventos |
| Pai ↔ Filho | v-model | Ligação bidirecional de formulários |
| Avo -> Neto | Provide/Inject | Transferir dados entre níveis |
| Pai -> Filho | $refs | Chamar métodos do filho diretamente (pouco usado) |
| Qualquer | Pinia/Vuex | Gerenciamento de estado global |
| Qualquer | Event Bus | Comúnicação simples de eventos (não recomendado) |
| Pai -> Filho | Slots | Passar conteúdo de template |

### Caso Prático: Funcionalidade de Carrinho de Compras

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Usando Pinia para gerenciar estado global do carrinho -->
    <header-component />
    <product-list />
    <cart-component />
  </div>
</template>
```

```js
// stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),

  getters: {
    totalPrice: (state) => {
      return state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    itemCount: (state) => state.items.length,
  },

  actions: {
    addItem(product) {
      const existing = this.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },

    removeItem(productId) {
      const index = this.items.findIndex((item) => item.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },
  },
});
```

```vue
<!-- ProductList.vue -->
<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const products = [
  { id: 1, name: 'iPhone', price: 30000 },
  { id: 2, name: 'iPad', price: 20000 },
];

const addToCart = (product) => {
  cartStore.addItem(product);
};
</script>

<template>
  <div>
    <div v-for="product in products" :key="product.id">
      <h3>{{ product.name }}</h3>
      <p>${{ product.price }}</p>
      <button @click="addToCart(product)">Adicionar ao carrinho</button>
    </div>
  </div>
</template>
```

```vue
<!-- HeaderComponent.vue -->
<script setup>
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
</script>

<template>
  <header>
    <h1>Loja Online</h1>
    <div>Carrinho: {{ cartStore.itemCount }} itens</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> Qual é a diferença entre Props e Provide/Inject?

### Props

**Características**:

- Adequado para comúnicação direta pai-filho
- Fluxo de dados claro
- Verificação de tipo completa
- Necessita passagem camada por camada em níveis profundos (props drilling)

```vue
<!-- Necessita passagem camada por camada -->
<grandparent>
  <parent :data="grandparentData">
    <child :data="parentData">
      <grandchild :data="childData" />
    </child>
  </parent>
</grandparent>
```

### Provide/Inject

**Características**:

- Adequado para comúnicação entre componentes avo-neto
- Não necessita passagem camada por camada
- Origem dos dados não é óbvia
- Verificação de tipo mais fraca

```vue
<!-- Transferência entre níveis, camadas intermediárias não precisam receber -->
<grandparent> <!-- provide -->
  <parent> <!-- não precisa tratar -->
    <child> <!-- não precisa tratar -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Recomendações de Uso

- **Usar Props**: comúnicação pai-filho, quando o fluxo de dados precisa ser claro
- **Usar Provide/Inject**: aninhamento profundo, tema, idioma, informações de autenticação e outras configurações globais

## Reference

- [Vue 3 Component Commúnication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
