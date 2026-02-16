---
id: vue-basic-api
title: '[Medium] Vue Basic & API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Describe los principios fundamentales y las ventajas de Vue.

### Principios fundamentales

Vue es un framework progresivo de JavaScript cuyos principios fundamentales incluyen los siguientes conceptos importantes:

#### 1. Virtual DOM

Utiliza el Virtual DOM para mejorar el rendimiento. Solo actualiza los nodos DOM que han cambiado, en lugar de re-renderizar todo el DOM Tree. A través del algoritmo diff compara las diferencias entre el Virtual DOM anterior y el nuevo, y solo realiza operaciones DOM reales en las partes que difieren.

```js
// Concepto ilustrativo del Virtual DOM
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Enlace bidireccional de datos (Two-way Data Binding)

Utiliza enlace bidireccional de datos: cuando el modelo (Model) cambia, la vista (View) se actualiza automáticamente y viceversa. Esto permite que los desarrolladores no necesiten manipular el DOM manualmente, sino solo enfocarse en los cambios de datos.

```vue
<!-- Vue 3 escritura recomendada: <script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

<details>
<summary>Escritura con Options API</summary>

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },
};
</script>
```

</details>

#### 3. Basado en componentes (Component-based)

Divide toda la aplicación en componentes individuales, lo que aumenta la reutilización y hace que el mantenimiento y desarrollo sean más eficientes. Cada componente tiene su propio estado, estilos y lógica, y puede desarrollarse y probarse de forma independiente.

```vue
<!-- Button.vue - Vue 3 <script setup> -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>
```

#### 4. Lifecycle Hooks

Tiene su propio ciclo de vida; cuando los datos cambian, se activan los hooks de ciclo de vida correspondientes, permitiendo realizar operaciones específicas en cada fase del ciclo de vida.

```vue
<!-- Vue 3 <script setup> -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // Se ejecuta después de montar el componente
  console.log('Component mounted!');
});

onUpdated(() => {
  // Se ejecuta después de actualizar datos
  console.log('Component updated!');
});

onUnmounted(() => {
  // Se ejecuta después de desmontar el componente
  console.log('Component unmounted!');
});
</script>
```

#### 5. Sistema de directivas (Directives)

Proporciona directivas de uso común como `v-if`, `v-for`, `v-bind`, `v-model`, que permiten a los desarrolladores desarrollar más rápidamente.

```vue
<template>
  <!-- Renderizado condicional -->
  <div v-if="isVisible">Mostrar contenido</div>

  <!-- Renderizado de listas -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- Enlace de atributos -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- Enlace bidireccional -->
  <input v-model="username" />
</template>
```

#### 6. Sintaxis de plantilla (Template Syntax)

Usa template para escribir HTML, permitiendo renderizar datos directamente en el template a través de interpolación.

```vue
<template>
  <div>
    <!-- Interpolación de texto -->
    <p>{{ message }}</p>

    <!-- Expresiones -->
    <p>{{ count + 1 }}</p>

    <!-- Llamada a métodos -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Ventajas únicas de Vue (comparado con React)

#### 1. Curva de aprendizaje más baja

La brecha de nivel entre los miembros del equipo no es tan grande, y el estilo de escritura está unificado oficialmente, evitando un exceso de libertad. Además, el mantenimiento de diferentes proyectos se facilita.

```vue
<!-- La estructura de componentes de archivo único de Vue es clara -->
<template>
  <!-- Plantilla HTML -->
</template>

<script>
// Lógica JavaScript
</script>

<style>
/* Estilos CSS */
</style>
```

#### 2. Sintaxis de directivas propia

Aunque este punto puede ser subjetivo, el sistema de directivas de Vue proporciona una forma más intuitiva de manejar la lógica común de la UI:

```vue
<!-- Directivas de Vue -->
<div v-if="isLoggedIn">Bienvenido de vuelta</div>
<button @click="handleClick">Clic</button>

<!-- React JSX -->
<div>{isLoggedIn && 'Bienvenido de vuelta'}</div>
<button onClick="{handleClick}">Clic</button>
```

#### 3. Enlace bidireccional de datos más fácil

Al tener sus propias directivas, los desarrolladores pueden implementar el enlace bidireccional de datos de forma muy sencilla (`v-model`). Aunque React también puede implementar funcionalidad similar, no es tan intuitivo como Vue.

```vue
<!-- Vue enlace bidireccional -->
<input v-model="username" />

<!-- React necesita manejo manual -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. Separación de plantilla y lógica

El JSX de React sigue siendo criticado por algunos desarrolladores; en ciertos contextos de desarrollo, separar la lógica de la UI resulta más legible y fácil de mantener.

```vue
<!-- Vue: estructura clara -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    };
  },
};
</script>
```

#### 5. Ecosistema oficial completo

Vue proporciona oficialmente soluciones completas (Vue Router, Vuex/Pinia, Vue CLI), sin necesidad de elegir entre numerosos paquetes de terceros.

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Explica el uso de `v-model`, `v-bind` y `v-html`.

### `v-model`: Enlace bidireccional de datos

Al cambiar los datos, el contenido renderizado en el template se actualiza simultáneamente, y viceversa, al cambiar el contenido del template, los datos también se actualizan.

```vue
<template>
  <div>
    <!-- Campo de texto -->
    <input v-model="message" />
    <p>Contenido ingresado: {{ message }}</p>

    <!-- Casilla de verificación -->
    <input type="checkbox" v-model="checked" />
    <p>Marcado: {{ checked }}</p>

    <!-- Lista de selección -->
    <select v-model="selected">
      <option value="A">Opción A</option>
      <option value="B">Opción B</option>
    </select>
    <p>Opción seleccionada: {{ selected }}</p>
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

#### Modificadores de `v-model`

```vue
<!-- .lazy: actualiza después del evento change -->
<input v-model.lazy="msg" />

<!-- .number: convierte automáticamente a número -->
<input v-model.number="age" type="number" />

<!-- .trim: elimina automáticamente espacios al inicio y final -->
<input v-model.trim="msg" />
```

### `v-bind`: Enlace dinámico de atributos

Se usa comúnmente para enlazar clases, enlaces, imágenes, etc. Al enlazar una clase con `v-bind`, se puede decidir si esa clase se aplica o no según los cambios en los datos. De igual forma, las rutas de imágenes o URLs de enlaces devueltos por una API pueden mantener la actualización dinámica a través del enlace.

```vue
<template>
  <div>
    <!-- Enlace de class (se puede abreviar como :class) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">Class dinámica</div>

    <!-- Enlace de style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Estilo dinámico</div>

    <!-- Enlace de ruta de imagen -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- Enlace de enlace -->
    <a :href="linkUrl">Ir al enlace</a>

    <!-- Enlace de atributos personalizados -->
    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Descripción de imagen',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### Abreviatura de `v-bind`

```vue
<!-- Escritura completa -->
<img v-bind:src="imageUrl" />

<!-- Abreviatura -->
<img :src="imageUrl" />

<!-- Enlazar múltiples atributos -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: Renderizar cadenas HTML

Si el contenido devuelto por los datos contiene etiquetas HTML, se puede usar esta directiva para renderizarlos. Por ejemplo, para mostrar sintaxis Markdown o cuando se devuelve directamente una ruta de imagen con la etiqueta `<img>`.

```vue
<template>
  <div>
    <!-- Interpolación normal: muestra las etiquetas HTML -->
    <p>{{ rawHtml }}</p>
    <!-- Salida: <span style="color: red">Texto rojo</span> -->

    <!-- v-html: renderiza el HTML -->
    <p v-html="rawHtml"></p>
    <!-- Salida: Texto rojo (renderizado en rojo) -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Texto rojo</span>',
    };
  },
};
</script>
```

#### Advertencia de seguridad

**Nunca uses `v-html` con contenido proporcionado por el usuario**. Esto puede causar vulnerabilidades XSS (Cross-Site Scripting).

```vue
<!-- ❌ Peligroso: el usuario puede inyectar scripts maliciosos -->
<div v-html="userProvidedContent"></div>

<!-- ✅ Seguro: solo usar con contenido confiable -->
<div v-html="markdownRenderedContent"></div>
```

#### Alternativa segura

```vue
<template>
  <div>
    <!-- Usar un paquete para sanitizar HTML -->
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      // Usar DOMPurify para limpiar el HTML
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Resumen comparativo de las tres directivas

| Directiva | Uso                          | Abreviatura | Ejemplo                     |
| --------- | ---------------------------- | ----------- | --------------------------- |
| `v-model` | Enlace bidireccional de formularios | Ninguna | `<input v-model="msg">`     |
| `v-bind`  | Enlace unidireccional de atributos | `:`    | `<img :src="url">`          |
| `v-html`  | Renderizar cadenas HTML      | Ninguna     | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> En Vue, si deseas manipular elementos HTML, por ejemplo obtener un elemento input y darle foco (focus), ¿cómo se hace?

En Vue, no se recomienda usar `document.querySelector` para obtener elementos DOM, sino usar **Template Refs**.

### Options API (Vue 2 / Vue 3)

Se usa el atributo `ref` para marcar el elemento en el template, y luego se accede a través de `this.$refs`.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      // Acceder al elemento DOM
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    // Asegurar acceso después de montar el componente
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

En `<script setup>`, se declara una variable `ref` con el mismo nombre para obtener el elemento.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. Declarar variable con el mismo nombre que el template ref, valor inicial null
const inputElement = ref(null);

const focusInput = () => {
  // 2. Acceder al DOM a través de .value
  inputElement.value?.focus();
};

onMounted(() => {
  // 3. Asegurar acceso después de montar el componente
  console.log(inputElement.value);
});
</script>
```

**Notas**:

- El nombre de la variable debe coincidir exactamente con el valor del atributo `ref` en el template.
- Solo se puede acceder al elemento DOM después del montaje del componente (`onMounted`), de lo contrario será `null`.
- Si se usa dentro de un bucle `v-for`, ref será un arreglo.

## 4. Please explain the difference between `v-show` and `v-if`

> Explica la diferencia entre `v-show` y `v-if`.

### Similitudes

Ambos se usan para controlar la visibilidad de elementos DOM, decidiendo si mostrar el contenido según la condición.

```vue
<template>
  <!-- Cuando isVisible es true, ambos muestran el contenido -->
  <div v-if="isVisible">Usando v-if</div>
  <div v-show="isVisible">Usando v-show</div>
</template>
```

### Diferencias

#### 1. Modo de operación DOM diferente

```vue
<template>
  <div>
    <!-- v-show: controla mediante la propiedad CSS display -->
    <div v-show="false">Este elemento existe en el DOM, solo está display: none</div>

    <!-- v-if: remueve o agrega directamente del DOM -->
    <div v-if="false">Este elemento no aparece en el DOM</div>
  </div>
</template>
```

Resultado de renderizado real:

```html
<!-- Resultado de v-show -->
<div style="display: none;">Este elemento existe en el DOM, solo está display: none</div>

<!-- Resultado de v-if: cuando es false, no existe completamente -->
<!-- No hay ningún nodo DOM -->
```

#### 2. Diferencia de rendimiento

**`v-show`**:

- Costo de renderizado inicial mayor (el elemento siempre se crea)
- Costo de alternancia menor (solo cambia CSS)
- Adecuado para **alternancia frecuente**

**`v-if`**:

- Costo de renderizado inicial menor (no renderiza cuando la condición es false)
- Costo de alternancia mayor (necesita destruir/recrear elementos)
- Adecuado para **condiciones que cambian poco**

```vue
<template>
  <div>
    <!-- Alternancia frecuente: usar v-show -->
    <button @click="toggleModal">Alternar modal</button>
    <div v-show="showModal" class="modal">
      Contenido del modal (se abre y cierra frecuentemente, v-show tiene mejor rendimiento)
    </div>

    <!-- Cambia poco: usar v-if -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      Panel de administrador (casi no cambia después de iniciar sesión, usar v-if)
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      userRole: 'user',
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>
```

#### 3. Activación del ciclo de vida

**`v-if`**:

- Activa el **ciclo de vida completo** del componente
- Cuando la condición es false, se ejecuta el hook `unmounted`
- Cuando la condición es true, se ejecuta el hook `mounted`

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('Componente montado'); // Se ejecuta cuando v-if cambia de false a true
  },
  unmounted() {
    console.log('Componente desmontado'); // Se ejecuta cuando v-if cambia de true a false
  },
};
</script>
```

**`v-show`**:

- **No activa** el ciclo de vida del componente
- El componente permanece montado
- Solo se oculta mediante CSS

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('Componente montado'); // Solo se ejecuta una vez en el primer renderizado
  },
  unmounted() {
    console.log('Componente desmontado'); // No se ejecuta (a menos que el padre se destruya)
  },
};
</script>
```

#### 4. Costo de renderizado inicial

```vue
<template>
  <div>
    <!-- v-if: si el valor inicial es false, no renderiza nada -->
    <heavy-component v-if="false" />

    <!-- v-show: si el valor inicial es false, renderiza pero oculta -->
    <heavy-component v-show="false" />
  </div>
</template>
```

Si `heavy-component` es un componente pesado:

- `v-if="false"`: carga inicial más rápida (no renderiza)
- `v-show="false"`: carga inicial más lenta (renderiza pero oculta)

#### 5. Combinación con otras directivas

`v-if` puede combinarse con `v-else-if` y `v-else`:

```vue
<template>
  <div>
    <div v-if="type === 'A'">Tipo A</div>
    <div v-else-if="type === 'B'">Tipo B</div>
    <div v-else>Otro tipo</div>
  </div>
</template>
```

`v-show` no puede combinarse con `v-else`:

```vue
<!-- ❌ Error: v-show no puede usar v-else -->
<div v-show="type === 'A'">Tipo A</div>
<div v-else>Otro tipo</div>

<!-- ✅ Correcto: se deben configurar condiciones por separado -->
<div v-show="type === 'A'">Tipo A</div>
<div v-show="type !== 'A'">Otro tipo</div>
```

### Recomendaciones de uso de computed y watch

#### Situaciones para usar `v-if`

1. La condición rara vez cambia
2. La condición inicial es false y posiblemente nunca será true
3. Se necesita usar con `v-else-if` o `v-else`
4. El componente tiene recursos que limpiar (temporizadores, event listeners)

```vue
<template>
  <!-- Control de permisos: casi no cambia después de iniciar sesión -->
  <admin-panel v-if="isAdmin" />

  <!-- Relacionado con rutas: solo cambia al navegar -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### Situaciones para usar `v-show`

1. Se necesita alternar frecuentemente el estado de visibilidad
2. El costo de inicialización del componente es alto y se desea preservar el estado
3. No se necesita activar hooks de ciclo de vida

```vue
<template>
  <!-- Cambio de pestañas: el usuario cambia frecuentemente -->
  <div v-show="activeTab === 'profile'">Perfil</div>
  <div v-show="activeTab === 'settings'">Configuración</div>

  <!-- Modal: se abre y cierra frecuentemente -->
  <modal v-show="isModalVisible" />

  <!-- Animación de carga: se muestra/oculta frecuentemente -->
  <loading-spinner v-show="isLoading" />
</template>
```

### Resumen comparativo de rendimiento

| Característica    | v-if                              | v-show               |
| ----------------- | --------------------------------- | -------------------- |
| Costo de renderizado inicial | Bajo (no renderiza si es false) | Alto (siempre renderiza) |
| Costo de alternancia | Alto (destruir/recrear elementos) | Bajo (solo cambia CSS) |
| Escenario adecuado | Condición que cambia poco        | Alternancia frecuente |
| Ciclo de vida      | Se activa                        | No se activa          |
| Combinación        | v-else-if, v-else                | Ninguna               |

### Ejemplo práctico comparativo

```vue
<template>
  <div>
    <!-- Ejemplo 1: Panel de admin (usar v-if) -->
    <!-- Razón: casi no cambia después de iniciar sesión, tiene control de permisos -->
    <div v-if="userRole === 'admin'">
      <h2>Panel de administrador</h2>
      <button @click="deleteUser">Eliminar usuario</button>
    </div>

    <!-- Ejemplo 2: Modal (usar v-show) -->
    <!-- Razón: el usuario abre y cierra frecuentemente el modal -->
    <div v-show="isModalOpen" class="modal">
      <h2>Título del modal</h2>
      <p>Contenido del modal</p>
      <button @click="isModalOpen = false">Cerrar</button>
    </div>

    <!-- Ejemplo 3: Animación de carga (usar v-show) -->
    <!-- Razón: se muestra/oculta frecuentemente durante las solicitudes API -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- Ejemplo 4: Mensaje de error (usar v-if) -->
    <!-- Razón: no aparece frecuentemente, y cuando aparece necesita re-renderizarse -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'user',
      isModalOpen: false,
      isLoading: false,
      errorMessage: '',
    };
  },
};
</script>
```

### Puntos clave de v-if y v-show

> - `v-if`: no renderiza cuando no se muestra, adecuado para condiciones que cambian poco
> - `v-show`: se renderiza desde el inicio, siempre listo para mostrarse, adecuado para alternancia frecuente

## 5. What's the difference between `computed` and `watch`?

> ¿Cuál es la diferencia entre `computed` y `watch`?

Estas son dos funcionalidades reactivas muy importantes en Vue. Aunque ambas pueden monitorear cambios en los datos, sus escenarios de uso y características son completamente diferentes.

### `computed` (propiedades computadas)

#### Características principales (computed)

1. **Mecanismo de caché**: Los resultados calculados por `computed` se almacenan en caché, y solo se recalculan cuando los datos reactivos de los que dependen cambian
2. **Rastreo automático de dependencias**: Rastrea automáticamente los datos reactivos utilizados en el cálculo
3. **Cálculo síncrono**: Debe ser una operación síncrona y debe tener un valor de retorno
4. **Sintaxis concisa**: Se puede usar directamente en el template, como una propiedad de data

#### Escenarios de uso comunes (computed)

```vue
<!-- Vue 3 <script setup> -->
<template>
  <div>
    <!-- Ejemplo 1: Formateo de datos -->
    <p>Nombre completo: {{ fullName }}</p>
    <p>Correo: {{ emailLowerCase }}</p>

    <!-- Ejemplo 2: Calcular total del carrito -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>Total: ${{ cartTotal }}</p>

    <!-- Ejemplo 3: Filtrar lista -->
    <input v-model="searchText" placeholder="Buscar..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

// Ejemplo 1: Combinar datos
const fullName = computed(() => {
  console.log('Calculando fullName'); // Solo se ejecuta cuando cambian las dependencias
  return `${firstName.value} ${lastName.value}`;
});

// Ejemplo 2: Formatear datos
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// Ejemplo 3: Calcular total
const cartTotal = computed(() => {
  console.log('Calculando cartTotal'); // Solo se ejecuta cuando cart cambia
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// Ejemplo 4: Filtrar lista
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### Ventaja de `computed`: mecanismo de caché

```vue
<template>
  <div>
    <!-- Usar computed múltiples veces, pero solo calcula una vez -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- Usar method, recalcula cada vez -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed ejecutado'); // Solo se ejecuta una vez
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method ejecutado'); // Se recalcula en cada llamada
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### getter y setter de `computed`

```vue
<script setup>
import { computed, onMounted, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  // getter: se ejecuta al leer
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // setter: se ejecuta al asignar
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});

onMounted(() => {
  console.log(fullName.value); // 'John Doe' (activa getter)
  fullName.value = 'Jane Smith'; // Activa setter
  console.log(firstName.value); // 'Jane'
  console.log(lastName.value); // 'Smith'
});
</script>
```

### `watch` (propiedad de observación)

#### Características principales (watch)

1. **Rastreo manual de cambios**: Se debe especificar explícitamente qué datos observar
2. **Puede ejecutar operaciones asíncronas**: Adecuado para llamadas API, temporizadores, etc.
3. **No necesita valor de retorno**: Se usa principalmente para ejecutar efectos secundarios (side effects)
4. **Puede observar múltiples datos**: A través de arreglos u observación profunda de objetos
5. **Proporciona valores antiguo y nuevo**: Se puede obtener el valor antes y después del cambio

#### Escenarios de uso comunes (watch)

```vue
<!-- Vue 3 <script setup> -->
<template>
  <div>
    <!-- Ejemplo 1: Búsqueda en tiempo real -->
    <input v-model="searchQuery" placeholder="Buscar usuarios..." />
    <div v-if="isSearching">Buscando...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- Ejemplo 2: Validación de formulario -->
    <input v-model="username" placeholder="Nombre de usuario" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- Ejemplo 3: Guardado automático -->
    <textarea v-model="content" placeholder="Ingresa contenido..."></textarea>
    <p v-if="isSaving">Guardando...</p>
    <p v-if="lastSaved">Último guardado: {{ lastSaved }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const username = ref('');
const usernameError = ref('');
const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// Ejemplo 1: Búsqueda en tiempo real (debounce)
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`Búsqueda cambió de "${oldQuery}" a "${newQuery}"`);

  // Limpiar temporizador anterior
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // Configurar debounce: ejecutar búsqueda después de 500ms
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('Error en búsqueda', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// Ejemplo 2: Validación de formulario
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'El nombre de usuario debe tener al menos 3 caracteres';
  } else if (newUsername.length > 20) {
    usernameError.value = 'El nombre de usuario no puede exceder 20 caracteres';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
  } else {
    usernameError.value = '';
  }
});

// Ejemplo 3: Guardado automático
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } catch (error) {
      console.error('Error al guardar', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // Limpiar temporizadores
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### Opciones de `watch`

```vue
<!-- Vue 3 <script setup> -->
<script setup>
import { ref, watch, onMounted } from 'vue';

const user = ref({
  name: 'John',
  profile: {
    age: 30,
    city: 'Taipei',
  },
});
const items = ref([1, 2, 3]);

// Opción 1: immediate (ejecución inmediata)
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Nombre cambió de ${oldName} a ${newName}`);
  },
  { immediate: true } // Se ejecuta inmediatamente al crear el componente
);

// Opción 2: deep (observación profunda)
watch(
  user,
  (newUser, oldUser) => {
    console.log('El objeto user cambió internamente');
    console.log('Nuevo valor:', newUser);
  },
  { deep: true } // Observa los cambios en todas las propiedades internas del objeto
);

// Opción 3: flush (momento de ejecución)
watch(
  items,
  (newItems) => {
    console.log('items cambió');
  },
  { flush: 'post' } // Se ejecuta después de la actualización del DOM (por defecto es 'pre')
);

onMounted(() => {
  // Probar observación profunda
  setTimeout(() => {
    user.value.profile.age = 31; // Activa deep watch
  }, 1000);
});
</script>
```

#### Observar múltiples fuentes de datos

```vue
<!-- Vue 3 <script setup> -->
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Vue 3 Composition API: observar múltiples datos
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Nombre cambió de ${oldFirst} ${oldLast} a ${newFirst} ${newLast}`);
});
</script>
```

### Comparación `computed` vs `watch`

| Característica      | computed                           | watch                              |
| ------------------- | ---------------------------------- | ---------------------------------- |
| **Uso principal**   | Calcular nuevos datos a partir de existentes | Observar cambios y ejecutar efectos secundarios |
| **Valor de retorno** | Debe tener valor de retorno       | No necesita valor de retorno       |
| **Caché**           | Tiene mecanismo de caché           | No tiene caché                     |
| **Rastreo de dependencias** | Automático                 | Manual                             |
| **Operaciones asíncronas** | No soporta                  | Soporta                            |
| **Valores antiguo/nuevo** | No se puede obtener          | Se puede obtener                   |
| **Uso en Template** | Se puede usar directamente         | No se puede usar directamente      |
| **Momento de ejecución** | Cuando cambian las dependencias | Cuando cambian los datos observados |

### Recomendaciones de uso

#### Situaciones para usar `computed`

1. Se necesita **calcular nuevos datos basados en datos existentes**
2. El resultado calculado se usará **múltiples veces** en el template (aprovechando el caché)
3. **Cálculo síncrono**, sin necesidad de operaciones asíncronas
4. Se necesita **formatear, filtrar o ordenar** datos

```vue
<script setup>
import { computed, ref } from 'vue';

const timestamp = ref(Date.now());
const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Carol', isActive: true },
]);
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);

// ✅ Formatear datos
const formattedDate = computed(() => {
  return new Date(timestamp.value).toLocaleDateString();
});

// ✅ Filtrar lista
const activeUsers = computed(() => {
  return users.value.filter((user) => user.isActive);
});

// ✅ Calcular suma
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});
</script>
```

#### Situaciones para usar `watch`

1. Se necesitan **operaciones asíncronas** (como solicitudes API)
2. Se necesitan **ejecutar efectos secundarios** (como actualizar localStorage)
3. Se necesita **debounce o throttle**
4. Se necesita **comparar valores antiguo y nuevo**
5. Se necesita **ejecutar lógica compleja condicionalmente**

```vue
<script setup>
import { ref, watch } from 'vue';

const userId = ref(1);
const user = ref(null);

// ✅ Solicitud API
watch(userId, async (newId) => {
  user.value = await fetch(`/api/users/${newId}`).then((response) =>
    response.json()
  );
});

const settings = ref({
  theme: 'dark',
  notifications: true,
});

// ✅ Sincronización con localStorage
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);

const searchQuery = ref('');
let searchTimer = null;

const performSearch = (keyword) => {
  console.log(`Buscando: ${keyword}`);
};

// ✅ Búsqueda con debounce
watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    performSearch(newQuery);
  }, 500);
});
</script>
```

### Comparación de casos reales

#### Uso incorrecto ❌

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

// ❌ Incorrecto: se debería usar computed en lugar de watch
watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Uso correcto ✅

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// ✅ Correcto: usar computed para calcular datos derivados
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>
```

### Puntos clave de computed y watch

> **"`computed` calcula datos, `watch` ejecuta acciones"**
>
> - `computed`: para **calcular nuevos datos** (formateo, filtrado, sumas)
> - `watch`: para **ejecutar acciones** (solicitudes API, guardar datos, mostrar notificaciones)

### Ejercicio práctico: Calcular x \* y

> Enunciado: x=0, y=5 y hay un botón que incrementa x en 1 con cada clic. Usa computed o watch de Vue para implementar "el resultado de x \* y".

#### Solución 1: Usando `computed` (recomendado)

Este es el escenario más adecuado, porque el resultado es un nuevo dato calculado que depende de x e y.

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Result (X * Y): {{ result }}</p>
    <button @click="x++">Increment X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

// ✅ Recomendado: simple, intuitivo, rastreo automático de dependencias
const result = computed(() => x.value * y.value);
</script>
```

#### Solución 2: Usando `watch` (más tedioso)

Aunque también funciona, se necesita mantener manualmente la variable `result` y considerar el problema del valor inicial.

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

// ❌ Menos recomendado: necesita actualización manual y configurar immediate para calcular inicialmente
watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
