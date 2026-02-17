---
id: state-management-vue-vuex-vs-pinia
title: 'Comparacion de diferencias entre Vuex y Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Comparacion de las diferencias principales entre Vuex y Pinia, incluyendo diseno de API, soporte de TypeScript, modularizacion, y guia de migracion.

---

## 1. Eje principal de respuesta en entrevista

1. **Diferencias principales**: Vuex requiere mutations, Pinia no; Pinia tiene mejor soporte de TypeScript; la forma de modularizacion es diferente.
2. **Recomendacion de eleccion**: Para proyectos nuevos con Vue 3 se recomienda Pinia, para proyectos con Vue 2 se usa Vuex.
3. **Consideraciones de migracion**: Pasos y puntos a tener en cuenta al migrar de Vuex a Pinia.

---

## 2. Resumen de diferencias principales

| Caracteristica      | Vuex                        | Pinia                           |
| ------------------- | --------------------------- | ------------------------------- |
| **Version de Vue**  | Vue 2                       | Vue 3                           |
| **Complejidad API** | Mas compleja (requiere mutations) | Mas simple (no requiere mutations) |
| **Soporte TypeScript** | Requiere configuracion adicional | Soporte nativo completo      |
| **Modularizacion**  | Modulos anidados            | Aplanado, cada store es independiente |
| **Tamano**          | Mas grande                  | Mas pequeno (aprox. 1KB)        |
| **Experiencia de desarrollo** | Buena              | Mejor (HMR, Devtools)          |

---

## 3. Comparacion de diferencias de API

### 3.1 Mutations vs Actions

**Vuex**: Requiere `mutations` para modificar el state de forma sincrona

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});
```

**Pinia**: No requiere `mutations`, se modifica el state directamente en `actions`

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++; // Modificar directamente
    },
  },
});
```

**Diferencia clave**:
- **Vuex**: Debe modificar el state de forma sincrona a traves de `mutations`, `actions` llama a `mutations` mediante `commit`
- **Pinia**: No requiere `mutations`, `actions` puede modificar el state directamente (tanto sincrona como asincronamente)

### 3.2 Definicion de State

**Vuex**: `state` puede ser un objeto o una funcion

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **debe ser una funcion**, para evitar compartir estado entre multiples instancias

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: los getters reciben `(state, getters)` como parametros

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**: los getters pueden usar `this` para acceder a otros getters

```typescript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne(): number {
    return this.doubleCount + 1;
  },
}
```

### 3.4 Uso en componentes

**Vuex**: Usa funciones auxiliares `mapState`, `mapGetters`, `mapActions`

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**: Usa directamente la instancia del store, utiliza `storeToRefs` para mantener la reactividad

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Diferencias de modularizacion

### 4.1 Vuex Modules (modulos anidados)

**Vuex**: Usa modulos anidados, requiere `namespaced: true`

```javascript
// stores/user.js
export default {
  namespaced: true,
  state: { name: 'John' },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
  },
};

// Uso en componentes
this.$store.dispatch('user/SET_NAME', 'Jane'); // Requiere prefijo de namespace
```

### 4.2 Pinia Stores (aplanado)

**Pinia**: Cada store es independiente, sin necesidad de anidamiento

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'John' }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});

// Uso en componentes
const userStore = useUserStore();
userStore.setName('Jane'); // Llamada directa, sin necesidad de namespace
```

**Diferencia clave**:
- **Vuex**: Requiere modulos anidados, usa `namespaced: true`, necesita prefijo de namespace al llamar
- **Pinia**: Cada store es independiente, sin necesidad de namespace, llamada directa

---

## 5. Diferencias en soporte de TypeScript

### 5.1 Soporte TypeScript en Vuex

**Vuex**: Requiere configuracion adicional de tipos

```typescript
// stores/types.ts
export interface State {
  count: number;
  user: { name: string; age: number };
}

// stores/index.ts
import { createStore, Store } from 'vuex';
import { State } from './types';

export default createStore<State>({
  state: { count: 0, user: { name: 'John', age: 30 } },
});

// Uso en componentes
const store = useStore<State>();
// Se necesita definir tipos manualmente, sin inferencia de tipos completa
```

### 5.2 Soporte TypeScript en Pinia

**Pinia**: Soporte nativo completo, inferencia de tipos automatica

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // Inferencia de tipos automatica
  },
  actions: {
    increment() {
      this.count++; // Inferencia de tipos completa y autocompletado
    },
  },
});

// Uso en componentes
const store = useCounterStore();
store.count; // Inferencia de tipos completa
store.doubleCount; // Inferencia de tipos completa
store.increment(); // Inferencia de tipos completa
```

**Diferencia clave**:
- **Vuex**: Necesita definir tipos manualmente, inferencia de tipos incompleta
- **Pinia**: Soporte nativo completo, inferencia de tipos automatica, mejor experiencia de desarrollo

---

## 6. Guia de migracion

### 6.1 Pasos basicos de migracion

1. **Instalar Pinia**

```bash
npm install pinia
```

2. **Reemplazar Vuex Store**

```javascript
// Vuex antiguo
import { createStore } from 'vuex';
export default createStore({ ... });

// Pinia nuevo
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **Convertir la definicion del Store**

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

4. **Actualizar el uso en componentes**

```javascript
// Vuex
import { mapState, mapActions } from 'vuex';
computed: { ...mapState(['count']) },
methods: { ...mapActions(['increment']) },

// Pinia
import { storeToRefs } from 'pinia';
const store = useCounterStore();
const { count } = storeToRefs(store);
const { increment } = store;
```

### 6.2 Problemas comunes de migracion

**Problema 1: Como manejar los Vuex modules?**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia: Cada modulo se convierte en un store independiente
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**Problema 2: Como manejar los namespaces?**

```javascript
// Vuex: Requiere prefijo de namespace
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia: Llamada directa, sin necesidad de namespace
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. Por que Pinia no necesita mutations?

**Razones**:

1. **Sistema reactivo de Vue 3**
   - Vue 3 usa Proxy, puede rastrear directamente las modificaciones de objetos
   - No necesita rastrear cambios de estado a traves de mutations como en Vue 2

2. **Simplificacion de API**
   - Eliminar mutations simplifica la API y reduce el codigo boilerplate
   - Actions puede modificar el state directamente, ya sean operaciones sincronas o asincronas

3. **Experiencia de desarrollo**
   - Reduce una capa de abstraccion, mas facil de entender y usar para los desarrolladores
   - No es necesario recordar la diferencia entre `commit` y `dispatch`

**Ejemplo**:

```typescript
// Vuex: Requiere mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia: Modificar directamente
actions: { setCount(count) { this.count = count; } },
```

---

## 8. Como elegir entre Vuex y Pinia?

**Recomendaciones de eleccion**:

1. **Proyectos nuevos**
   - Proyectos Vue 3: **Se recomienda usar Pinia**
   - Proyectos Vue 2: Usar Vuex

2. **Proyectos existentes**
   - Vue 2 + Vuex: Se puede continuar usando Vuex, o considerar actualizar a Vue 3 + Pinia
   - Vue 3 + Vuex: Se puede considerar migrar a Pinia (pero no es obligatorio)

3. **Requisitos del proyecto**
   - Se necesita soporte completo de TypeScript: **Elegir Pinia**
   - Se necesita una API mas simple: **Elegir Pinia**
   - El equipo esta familiarizado con Vuex: Se puede continuar usando Vuex

**Resumen**:
- Proyectos nuevos con Vue 3: **Se recomienda encarecidamente Pinia**
- Proyectos Vue 2: Usar Vuex
- Proyectos existentes con Vue 3 + Vuex: Se puede considerar migrar, pero no es obligatorio

---

## 9. Puntos clave de entrevista

### 9.1 Diferencias principales

**Se puede responder asi:**

> Vuex y Pinia son herramientas de gestion de estado para Vue, las principales diferencias incluyen: 1) Complejidad de API: Vuex requiere mutations para modificar el state de forma sincrona, Pinia no requiere mutations, actions puede modificar el state directamente; 2) Soporte TypeScript: Vuex requiere configuracion adicional, la inferencia de tipos es incompleta, Pinia tiene soporte nativo completo con inferencia de tipos automatica; 3) Modularizacion: Vuex usa modulos anidados con namespaced, Pinia cada store es independiente sin necesidad de namespace; 4) Experiencia de desarrollo: Pinia es mas pequeno, soporta HMR, mejor soporte de Devtools; 5) Version de Vue: Vuex se usa principalmente con Vue 2, Pinia es la recomendacion oficial para Vue 3. Para proyectos nuevos con Vue 3, recomiendo usar Pinia.

**Puntos clave:**
- API: diferencias de complejidad
- TypeScript: diferencias de soporte
- Modularizacion: diferencias de enfoque
- Recomendacion de eleccion

### 9.2 Por que Pinia no necesita mutations?

**Se puede responder asi:**

> Pinia no necesita mutations por tres razones principales: 1) Vue 3 usa Proxy como sistema reactivo, puede rastrear directamente las modificaciones de objetos, no necesita rastrear cambios de estado a traves de mutations como en Vue 2; 2) Simplificacion de API, eliminar mutations reduce el codigo boilerplate, actions puede modificar el state directamente, ya sean operaciones sincronas o asincronas; 3) Mejor experiencia de desarrollo, reduce una capa de abstraccion, mas facil de entender y usar, no es necesario recordar la diferencia entre commit y dispatch.

**Puntos clave:**
- Sistema reactivo de Vue 3
- Simplificacion de API
- Mejora en la experiencia de desarrollo

---

## 10. Resumen de entrevista

**Se puede responder asi:**

> Las principales diferencias entre Vuex y Pinia estan en el diseno de API, soporte de TypeScript y forma de modularizacion. Vuex requiere mutations, Pinia no; Pinia tiene mejor soporte de TypeScript; Vuex usa modulos anidados, Pinia usa diseno aplanado. Para proyectos nuevos con Vue 3, recomiendo usar Pinia porque ofrece mejor experiencia de desarrollo y una API mas simple. Si un proyecto necesita migrar de Vuex a Pinia, los pasos principales son eliminar mutations, convertir los modules en stores independientes y actualizar el uso en componentes.

**Puntos clave:**
- Resumen de diferencias principales
- Recomendacion de eleccion
- Guia de migracion
- Experiencia en proyectos reales

## Reference

- [Documentacion oficial de Vuex](https://vuex.vuejs.org/)
- [Documentacion oficial de Pinia](https://pinia.vuejs.org/)
- [Migrar de Vuex a Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
