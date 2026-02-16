---
id: vue-lifecycle
title: '[Medium] Vue Lifecycle Hooks'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Explica los hooks del ciclo de vida de Vue (incluyendo Vue 2 y Vue 3).

Los componentes de Vue atraviesan una serie de procesos desde su creación hasta su destrucción. Durante estos procesos se invocan automáticamente funciones específicas, que son los "hooks del ciclo de vida". Comprender el ciclo de vida es muy importante para dominar el comportamiento de los componentes.

### Diagrama del ciclo de vida de Vue

```
Fase de creación → Fase de montaje → Fase de actualización → Fase de destrucción
       ↓                ↓                   ↓                    ↓
    Created          Mounted            Updated             Unmounted
```

### Tabla comparativa de ciclo de vida Vue 2 vs Vue 3

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | Descripción                        |
| ------------------- | ------------------- | ----------------------- | ---------------------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | Antes de inicializar la instancia  |
| `created`           | `created`           | `setup()`               | Instancia del componente creada    |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | Antes de montar en el DOM          |
| `mounted`           | `mounted`           | `onMounted`             | Después de montar en el DOM        |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | Antes de actualizar datos          |
| `updated`           | `updated`           | `onUpdated`             | Después de actualizar datos        |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | Antes de desmontar el componente   |
| `destroyed`         | `unmounted`         | `onUnmounted`           | Después de desmontar el componente |
| `activated`         | `activated`         | `onActivated`           | Componente keep-alive activado     |
| `deactivated`       | `deactivated`       | `onDeactivated`         | Componente keep-alive desactivado  |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | Error capturado de componente hijo |

### 1. Fase de creación (Creation Phase)

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // ❌ En este punto data y methods aún no están inicializados
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ En este punto data, computed, methods y watch ya están inicializados
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined (aún no montado en el DOM)

    // ✅ Adecuado para enviar solicitudes API aquí
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Cuándo usar:**

- `beforeCreate`: Rara vez se usa, generalmente para desarrollo de plugins
- `created`:
  - ✅ Enviar solicitudes API
  - ✅ Inicializar datos no reactivos
  - ✅ Configurar event listeners
  - ❌ No se puede manipular el DOM (aún no montado)

### 2. Fase de montaje (Mounting Phase)

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // ❌ El Virtual DOM ya está creado, pero aún no se ha renderizado en el DOM real
    console.log('beforeMount');
    console.log(this.$el); // Existe, pero el contenido es antiguo
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ El componente ya está montado en el DOM, se pueden manipular elementos DOM
    console.log('mounted');
    console.log(this.$el); // Elemento DOM real
    console.log(this.$refs.myElement); // Se puede acceder al ref

    // ✅ Adecuado para manipular el DOM aquí
    this.initCanvas();

    // ✅ Adecuado para usar paquetes DOM de terceros aquí
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // Dibujar en canvas...
    },

    initChart() {
      // Inicializar paquete de gráficos (como Chart.js, ECharts)
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**Cuándo usar:**

- `beforeMount`: Rara vez se usa
- `mounted`:
  - ✅ Manipular elementos DOM
  - ✅ Inicializar paquetes DOM de terceros (gráficos, mapas)
  - ✅ Configurar event listeners que necesitan el DOM
  - ✅ Iniciar temporizadores
  - ⚠️ **Nota**: El `mounted` de los componentes hijos se ejecuta antes del `mounted` del padre

### 3. Fase de actualización (Updating Phase)

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Conteo: {{ count }}</p>
    <button @click="count++">Incrementar</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // ✅ Los datos ya se actualizaron, pero el DOM aún no
    console.log('beforeUpdate');
    console.log('data count:', this.count); // Nuevo valor
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Valor anterior

    // Se puede acceder al estado del DOM antes de la actualización
  },

  updated() {
    // ✅ Datos y DOM ya están actualizados
    console.log('updated');
    console.log('data count:', this.count); // Nuevo valor
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Nuevo valor

    // ⚠️ Nota: No modifiques datos aquí, causará un bucle infinito
    // this.count++; // ❌ Error! Causará actualización infinita
  },
};
</script>
```

**Cuándo usar:**

- `beforeUpdate`: Cuando se necesita acceder al estado anterior del DOM antes de la actualización
- `updated`:
  - ✅ Operaciones que necesitan ejecutarse después de la actualización del DOM (como recalcular dimensiones de elementos)
  - ❌ **No modifiques datos aquí**, causará un bucle de actualización infinito
  - ⚠️ Si necesitas ejecutar operaciones después de un cambio de datos, se recomienda usar `watch` o `nextTick`

### 4. Fase de destrucción (Unmounting Phase)

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // Configurar temporizador
    this.timer = setInterval(() => {
      console.log('Temporizador ejecutándose...');
    }, 1000);

    // Crear conexión WebSocket
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data);
    };

    // Configurar event listeners
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 usa beforeUnmount
    // Vue 2 usa beforeDestroy
    console.log('beforeUnmount');
    // El componente está a punto de destruirse, pero aún se puede acceder a datos y DOM
  },

  unmounted() {
    // Vue 3 usa unmounted
    // Vue 2 usa destroyed
    console.log('unmounted');

    // ✅ Limpiar temporizador
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ Cerrar conexión WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ Remover event listeners
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('Tamaño de ventana cambiado');
    },
    handleClick() {
      console.log('Evento de clic');
    },
  },
};
</script>
```

**Cuándo usar:**

- `beforeUnmount` / `beforeDestroy`: Rara vez se usa
- `unmounted` / `destroyed`:
  - ✅ Limpiar temporizadores (`setInterval`, `setTimeout`)
  - ✅ Remover event listeners
  - ✅ Cerrar conexiones WebSocket
  - ✅ Cancelar solicitudes API pendientes
  - ✅ Limpiar instancias de paquetes de terceros

### 5. Componente especial: KeepAlive

#### ¿Qué es `<KeepAlive>`?

`<KeepAlive>` es un componente integrado de Vue cuya función principal es **almacenar en caché instancias de componentes**, evitando que se destruyan al cambiar de vista.

- **Comportamiento predeterminado**: Cuando un componente cambia (por ejemplo, cambio de ruta o `v-if`), Vue destruye el componente anterior y crea uno nuevo.
- **Comportamiento con KeepAlive**: Los componentes envueltos en `<KeepAlive>` conservan su estado en memoria al cambiar, sin ser destruidos.

#### Funcionalidad y características principales

1. **Caché de estado**: Preserva el contenido de formularios, posición de scroll, etc.
2. **Optimización de rendimiento**: Evita renderizados repetidos y solicitudes API repetidas.
3. **Ciclo de vida exclusivo**: Proporciona dos hooks exclusivos: `activated` y `deactivated`.

#### Escenarios de uso

1. **Cambio entre múltiples pestañas**: Por ejemplo, los Tabs de un sistema de administración.
2. **Cambio entre lista y detalle**: Al navegar del listado al detalle y volver, se desea preservar la posición de scroll y las condiciones de filtrado.
3. **Formularios complejos**: Al cambiar a otra página para consultar datos a mitad del llenado, el contenido del formulario no debe perderse al regresar.

#### Ejemplo de uso

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`: Solo los componentes con nombres coincidentes serán almacenados en caché.
- `exclude`: Los componentes con nombres coincidentes **no serán** almacenados en caché.
- `max`: Número máximo de instancias de componentes a almacenar en caché.

### 6. Hooks de ciclo de vida especiales

#### `activated` / `deactivated` (para uso con `<KeepAlive>`)

```vue
<template>
  <div>
    <button @click="toggleComponent">Cambiar componente</button>

    <!-- keep-alive almacena en caché el componente, no lo recrea -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - solo se ejecuta una vez');
  },

  activated() {
    console.log('activated - se ejecuta cada vez que el componente se activa');
    // ✅ Adecuado para volver a obtener datos aquí
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - se ejecuta cada vez que el componente se desactiva');
    // ✅ Adecuado para pausar operaciones aquí (como reproducción de video)
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - no se ejecuta (porque está en caché con keep-alive)');
  },

  methods: {
    refreshData() {
      // Actualizar datos
    },
    pauseVideo() {
      // Pausar reproducción de video
    },
  },
};
</script>
```

#### `errorCaptured` (manejo de errores)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('Error capturado del componente hijo:', err);
    console.log('Componente origen del error:', instance);
    console.log('Información del error:', info);

    // Devolver false evita que el error se propague hacia arriba
    return false;
  },
};
</script>
```

### Ciclo de vida con Vue 3 Composition API

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() en sí equivale a beforeCreate + created
console.log('setup ejecutado');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ Manipular DOM, inicializar paquetes
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // ✅ Limpiar recursos
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('Error:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> ¿Cuál es el orden de ejecución del ciclo de vida de componentes padre e hijo?

Esta es una pregunta de entrevista muy importante. Comprender el orden de ejecución del ciclo de vida de componentes padre e hijo ayuda a entender la interacción entre componentes.

### Orden de ejecución

```
Padre beforeCreate
→ Padre created
→ Padre beforeMount
→ Hijo beforeCreate
→ Hijo created
→ Hijo beforeMount
→ Hijo mounted
→ Padre mounted
```

**Punto clave: "Creación de afuera hacia adentro, montaje de adentro hacia afuera"**

### Ejemplo práctico

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Componente padre</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. Padre beforeCreate');
  },
  created() {
    console.log('2. Padre created');
  },
  beforeMount() {
    console.log('3. Padre beforeMount');
  },
  mounted() {
    console.log('8. Padre mounted');
  },
  beforeUpdate() {
    console.log('Padre beforeUpdate');
  },
  updated() {
    console.log('Padre updated');
  },
  beforeUnmount() {
    console.log('9. Padre beforeUnmount');
  },
  unmounted() {
    console.log('12. Padre unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Componente hijo</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. Hijo beforeCreate');
  },
  created() {
    console.log('5. Hijo created');
  },
  beforeMount() {
    console.log('6. Hijo beforeMount');
  },
  mounted() {
    console.log('7. Hijo mounted');
  },
  beforeUpdate() {
    console.log('Hijo beforeUpdate');
  },
  updated() {
    console.log('Hijo updated');
  },
  beforeUnmount() {
    console.log('10. Hijo beforeUnmount');
  },
  unmounted() {
    console.log('11. Hijo unmounted');
  },
};
</script>
```

### Orden de ejecución por fase

#### 1. Fase de creación y montaje

```
1. Padre beforeCreate
2. Padre created
3. Padre beforeMount
4. Hijo beforeCreate
5. Hijo created
6. Hijo beforeMount
7. Hijo mounted        ← El hijo completa el montaje primero
8. Padre mounted       ← El padre completa el montaje después
```

**Razón**: El componente padre necesita esperar a que los componentes hijos completen su montaje para asegurar que todo el árbol de componentes se haya renderizado completamente.

#### 2. Fase de actualización

```
Cambio de datos del padre:
1. Padre beforeUpdate
2. Hijo beforeUpdate  ← Si el hijo usa datos del padre
3. Hijo updated
4. Padre updated

Cambio de datos del hijo:
1. Hijo beforeUpdate
2. Hijo updated
(El padre no se actualiza)
```

#### 3. Fase de destrucción

```
9. Padre beforeUnmount
10. Hijo beforeUnmount
11. Hijo unmounted     ← El hijo se destruye primero
12. Padre unmounted    ← El padre se destruye después
```

### Caso con múltiples componentes hijos

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

Orden de ejecución:

```
1. Padre beforeCreate
2. Padre created
3. Padre beforeMount
4. HijoA beforeCreate
5. HijoA created
6. HijoA beforeMount
7. HijoB beforeCreate
8. HijoB created
9. HijoB beforeMount
10. HijoC beforeCreate
11. HijoC created
12. HijoC beforeMount
13. HijoA mounted
14. HijoB mounted
15. HijoC mounted
16. Padre mounted
```

### ¿Por qué este orden?

#### Fase de montaje (Mounting)

El proceso de montaje de Vue es similar a un "recorrido en profundidad":

1. El componente padre comienza su creación
2. Al analizar la plantilla descubre componentes hijos
3. Primero completa el montaje completo de los hijos
4. Después de que todos los hijos están montados, el padre completa el montaje

```
Padre preparándose para montar
    ↓
Descubre componentes hijos
    ↓
Hijos completan montaje (beforeMount → mounted)
    ↓
Padre completa montaje (mounted)
```

#### Fase de destrucción (Unmounting)

El orden de destrucción es "primero notificar al padre que se va a destruir, luego destruir los hijos en orden":

```
Padre se prepara para destruir (beforeUnmount)
    ↓
Notifica a los hijos que se preparen para destruir (beforeUnmount)
    ↓
Hijos completan destrucción (unmounted)
    ↓
Padre completa destrucción (unmounted)
```

### Escenarios de aplicación práctica

#### Escenario 1: El padre necesita esperar a que se complete la carga de datos del hijo

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // ✅ En este punto todos los hijos ya están montados
    console.log('Todos los componentes hijos están listos');
    this.childrenReady = true;
  },
};
</script>
```

#### Escenario 2: El hijo necesita acceder a datos proporcionados por el padre

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // Recibe datos proporcionados por el padre

  created() {
    // ✅ En este punto se puede acceder a datos del padre (el created del padre ya se ejecutó)
    console.log('Datos del padre:', this.parentData);
  },
};
</script>
```

#### Escenario 3: Evitar acceder a componentes hijos no montados en `mounted`

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ En este punto el hijo ya está montado, se puede acceder de forma segura
    this.$refs.child.someMethod();
  },
};
</script>
```

### Errores comunes

#### Error 1: Acceder al ref del hijo en el `created` del padre

```vue
<!-- ❌ Incorrecto -->
<script>
export default {
  created() {
    // En este punto el hijo aún no se ha creado
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ Correcto -->
<script>
export default {
  mounted() {
    // En este punto el hijo ya está montado
    console.log(this.$refs.child); // Se puede acceder
  },
};
</script>
```

#### Error 2: Asumir que el hijo se monta antes que el padre

```vue
<!-- ❌ Incorrecto -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Asumir que el padre ya está montado (¡incorrecto!)
    this.$parent.someMethod(); // Puede causar error
  },
};
</script>

<!-- ✅ Correcto -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Usar $nextTick para asegurar que el padre también esté montado
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> ¿Cuándo deberíamos usar cada hook del ciclo de vida?

Aquí se resumen los mejores escenarios de uso para cada hook del ciclo de vida.

### Tabla resumen de escenarios de uso

| Ciclo de vida | Uso común                    | Contenido accesible             |
| ------------- | ---------------------------- | ------------------------------- |
| `created`     | Solicitudes API, inicializar datos | ✅ data, methods ❌ DOM    |
| `mounted`     | Manipular DOM, inicializar paquetes | ✅ data, methods, DOM     |
| `updated`     | Operaciones post-actualización del DOM | ✅ DOM actualizado       |
| `unmounted`   | Limpiar recursos             | ✅ Limpiar temporizadores, eventos |
| `activated`   | Activación de keep-alive     | ✅ Volver a obtener datos       |

### Ejemplos de aplicación práctica

#### 1. `created`: Enviar solicitudes API

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // ✅ Adecuado para enviar solicitudes API aquí
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted`: Inicializar paquetes de terceros

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // ✅ Adecuado para inicializar paquetes que necesitan el DOM aquí
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: 'Datos de ventas' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ Recuerda limpiar la instancia del gráfico
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`: Limpiar recursos

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // Iniciar temporizador
    this.intervalId = setInterval(() => {
      console.log('Ejecutándose...');
    }, 1000);

    // Crear Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // Escuchar evento global
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ Limpiar temporizador
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ Limpiar Observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ Remover event listener
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('Tamaño de ventana cambiado');
    },
  },
};
</script>
```

### Técnica de memorización

1. **`created`**: "Creación completa, datos disponibles" → Solicitudes API
2. **`mounted`**: "Montaje completo, DOM disponible" → Manipulación de DOM, paquetes de terceros
3. **`updated`**: "Actualización completa, DOM sincronizado" → Operaciones post-actualización del DOM
4. **`unmounted`**: "Desmontaje completo, recuerda limpiar" → Limpiar recursos

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
