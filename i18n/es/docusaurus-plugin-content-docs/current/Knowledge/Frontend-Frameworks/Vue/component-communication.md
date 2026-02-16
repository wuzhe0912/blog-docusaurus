---
id: vue-component-communication
title: '[Medium] Comunicación entre componentes'
slug: /vue-component-communication
tags: [Vue, Quiz, Medium]
---

## 1. What are the ways for Vue components to communicate with each other?

> ¿Cuáles son las formas de comunicación entre componentes Vue?

La transferencia de datos entre componentes Vue es una necesidad muy común en el desarrollo. Según la relación entre los componentes, se pueden elegir diferentes métodos de comunicación.

### Clasificación de relaciones entre componentes

```text
Padre-hijo: props / $emit
Abuelo-nieto: provide / inject
Hermanos: Event Bus / Vuex / Pinia
Cualquier componente: Vuex / Pinia
```

### 1. Props (padre a hijo)

**Uso**: El componente padre transfiere datos al componente hijo

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Componente padre</h1>
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
    <h2>Componente hijo</h2>
    <p>Mensaje recibido: {{ message }}</p>
    <p>Usuario: {{ user.name }} ({{ user.age }} años)</p>
    <p>Conteo: {{ count }}</p>
  </div>
</template>

<script setup>
// Validación de tipo básico
defineProps({
  message: {
    type: String,
    required: true,
    default: '',
  },
  // Validación de tipo objeto
  user: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  // Validación de tipo numérico
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0, // Validación personalizada: debe ser >= 0
  },
});
</script>
```

#### Consideraciones sobre Props

```vue
<!-- Escritura con Vue 3 <script setup> -->
<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  message: String,
});

const localMessage = ref(props.message);

onMounted(() => {
  // ❌ Error: no se deben modificar los props directamente
  // props.message = 'new value'; // Generará una advertencia

  // ✅ Correcto: ya se copió el prop a un ref arriba
  localMessage.value = props.message;
});
</script>
```

### 2. $emit (hijo a padre)

**Uso**: El componente hijo envía eventos y datos al componente padre

```vue
<!-- ChildComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <button @click="sendToParent">Enviar al padre</button>
    <input v-model="inputValue" @input="handleInput" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['custom-event', 'update:modelValue']);

const inputValue = ref('');

const sendToParent = () => {
  // Enviar evento al componente padre
  emit('custom-event', {
    message: 'Hello from child',
    timestamp: Date.now(),
  });
};

const handleInput = () => {
  // Enviar valor de entrada en tiempo real
  emit('update:modelValue', inputValue.value);
};
</script>
```

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <div>
    <h1>Componente padre</h1>

    <!-- Escuchar eventos del componente hijo -->
    <ChildComponent
      @custom-event="handleCustomEvent"
      @update:modelValue="handleUpdate"
    />

    <p>Datos recibidos: {{ receivedData }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const receivedData = ref(null);

const handleCustomEvent = (data) => {
  console.log('Evento recibido del hijo:', data);
  receivedData.value = data;
};

const handleUpdate = (value) => {
  console.log('Valor de entrada actualizado:', value);
};
</script>
```

#### Opción emits de Vue 3

```vue
<!-- Escritura con Vue 3 <script setup> -->
<script setup>
const emit = defineEmits({
  // Declarar eventos que se emitirán
  'custom-event': null,

  // Evento con validación
  'update:modelValue': (value) => {
    if (typeof value !== 'string') {
      console.warn('modelValue debe ser una cadena');
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

### 3. v-model (enlace bidireccional)

**Uso**: Enlace bidireccional de datos entre componentes padre e hijo

#### v-model en Vue 2

```vue
<!-- ParentComponent.vue -->
<template>
  <custom-input v-model="message" />
  <!-- Equivale a -->
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

#### v-model en Vue 3

```vue
<!-- ParentComponent.vue - Vue 3 <script setup> -->
<template>
  <custom-input v-model="message" />
  <!-- Equivale a -->
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

#### Múltiples v-model en Vue 3

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
      placeholder="Nombre"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
      placeholder="Correo electrónico"
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

### 4. Provide / Inject (componentes abuelo-nieto)

**Uso**: Comunicación entre componentes de diferentes niveles, evitando la transferencia de props nivel por nivel

```vue
<!-- GrandparentComponent.vue -->
<template>
  <div>
    <h1>Componente abuelo</h1>
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

    // Proporcionar datos y métodos a los componentes descendientes
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
    <h2>Componente padre (no usa inject)</h2>
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
    <h3>Componente hijo</h3>
    <p>Usuario: {{ userInfo.name }}</p>
    <p>Rol: {{ userInfo.role }}</p>
    <button @click="changeUser">Modificar usuario</button>
  </div>
</template>

<script>
import { inject } from 'vue';

export default {
  setup() {
    // Inyectar datos proporcionados por el componente abuelo
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

#### Consideraciones de Provide / Inject

```vue
<script>
import { ref, readonly, provide } from 'vue';

export default {
  setup() {
    const state = ref({ count: 0 });

    // ❌ Error: los componentes descendientes pueden modificar directamente
    provide('state', state);

    // ✅ Correcto: proporcionar datos de solo lectura y métodos de modificación
    provide('state', readonly(state));
    provide('updateState', (newState) => {
      state.value = newState;
    });
  },
};
</script>
```

### 5. $refs (padre accede al hijo)

**Uso**: El componente padre accede directamente a las propiedades y métodos del componente hijo

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component ref="childRef" />
    <button @click="callChildMethod">Llamar método del hijo</button>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },

  methods: {
    callChildMethod() {
      // Llamar directamente al método del componente hijo
      this.$refs.childRef.someMethod();

      // Acceder a los datos del componente hijo
      console.log(this.$refs.childRef.someData);
    },
  },

  mounted() {
    // ✅ Solo se puede acceder a $refs después de mounted
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
      console.log('Se llamó al método del componente hijo');
    },
  },
};
</script>
```

#### ref con Composition API de Vue 3

```vue
<template>
  <child-component ref="childRef" />
  <button @click="callChild">Llamar componente hijo</button>
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

### 6. $parent / $root (hijo accede al padre)

**Uso**: El componente hijo accede al componente padre o al componente raíz (no recomendado)

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  mounted() {
    // Acceder al componente padre
    console.log(this.$parent.someData);
    this.$parent.someMethod();

    // Acceder al componente raíz
    console.log(this.$root.globalData);
  },
};
</script>
```

**Razones por las que no se recomienda**:

- Aumenta el acoplamiento entre componentes
- Dificulta el seguimiento del flujo de datos
- Perjudica la reutilización de componentes
- Se recomienda usar props, $emit o provide/inject en su lugar

### 7. Event Bus (cualquier componente)

**Uso**: Comunicación entre cualquier componente (común en Vue 2, no recomendado en Vue 3)

#### Event Bus en Vue 2

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
      console.log('Mensaje recibido:', data);
    });
  },

  beforeUnmount() {
    // Recuerda eliminar el listener
    EventBus.$off('message-sent');
  },
};
</script>
```

#### Alternativa en Vue 3: mitt

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
  console.log('Mensaje recibido:', data);
};

onMounted(() => {
  emitter.on('message-sent', handleMessage);
});

onUnmounted(() => {
  emitter.off('message-sent', handleMessage);
});
</script>
```

### 8. Vuex / Pinia (gestión de estado global)

**Uso**: Gestionar estado global complejo

#### Pinia (recomendado para Vue 3)

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
    <button @click="handleLogin">Iniciar sesión</button>
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
    <p v-if="userStore.isLoggedIn">Bienvenido, {{ userStore.fullInfo }}</p>
  </div>
</template>
```

### 9. Slots (distribución de contenido)

**Uso**: El componente padre transfiere contenido de plantilla al componente hijo

#### Slot básico

```vue
<!-- ChildComponent.vue -->
<template>
  <div class="card">
    <header>
      <slot name="header">Título predeterminado</slot>
    </header>

    <main>
      <slot>Contenido predeterminado</slot>
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

    <p>Este es el contenido principal</p>

    <template #footer>
      <button>Aceptar</button>
    </template>
  </child-component>
</template>
```

#### Scoped Slots (slots con alcance)

```vue
<!-- ListComponent.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Transferir datos al componente padre -->
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
    <!-- Recibir datos transferidos por el componente hijo -->
    <template #default="{ item, index }">
      <span>{{ index + 1 }}. {{ item.name }}</span>
    </template>
  </list-component>
</template>
```

### Guía de selección de métodos de comunicación entre componentes

| Relación     | Método recomendado | Momento de uso                  |
| ------------ | ------------------ | ------------------------------- |
| Padre → Hijo | Props              | Transferir datos al hijo        |
| Hijo → Padre | $emit              | Notificar eventos al padre      |
| Padre ↔ Hijo | v-model            | Enlace bidireccional de formularios |
| Abuelo → Nieto | Provide/Inject   | Transferencia de datos entre niveles |
| Padre → Hijo | $refs              | Llamar métodos del hijo directamente (poco uso) |
| Cualquier componente | Pinia/Vuex | Gestión de estado global        |
| Cualquier componente | Event Bus  | Comunicación simple de eventos (no recomendado) |
| Padre → Hijo | Slots              | Transferir contenido de plantilla |

### Caso práctico: Funcionalidad de carrito de compras

```vue
<!-- App.vue -->
<template>
  <div>
    <!-- Usar Pinia para gestionar el estado global del carrito -->
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
      <button @click="addToCart(product)">Agregar al carrito</button>
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
    <h1>Tienda en línea</h1>
    <div>Carrito: {{ cartStore.itemCount }} productos</div>
  </header>
</template>
```

## 2. What's the difference between Props and Provide/Inject?

> ¿Cuál es la diferencia entre Props y Provide/Inject?

### Props

**Características**:

- ✅ Adecuado para comunicación directa padre-hijo
- ✅ Flujo de datos claro
- ✅ Verificación de tipos completa
- ❌ Requiere transferencia nivel por nivel en múltiples capas (props drilling)

```vue
<!-- Se necesita transferencia nivel por nivel -->
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

- ✅ Adecuado para comunicación entre componentes abuelo-nieto de diferentes niveles
- ✅ No necesita transferencia nivel por nivel
- ❌ El origen de los datos no es obvio
- ❌ Verificación de tipos más débil

```vue
<!-- Transferencia entre niveles, las capas intermedias no necesitan procesamiento -->
<grandparent> <!-- provide -->
  <parent> <!-- No necesita procesamiento -->
    <child> <!-- No necesita procesamiento -->
      <grandchild /> <!-- inject -->
    </child>
  </parent>
</grandparent>
```

### Recomendaciones de uso

- **Usar Props**: Componentes padre-hijo, cuando el flujo de datos necesita ser claro
- **Usar Provide/Inject**: Anidamiento profundo, tema, idioma, información de autenticación y otras configuraciones globales

## Reference

- [Vue 3 Component Communication](https://vuejs.org/guide/components/provide-inject.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [mitt - Event Emitter](https://github.com/developit/mitt)
