---
id: state-management-vue-pinia-store-patterns
title: 'Patrones de Implementación de Pinia Store'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> En un proyecto de plataforma multi-marca, se implementan Pinia Stores con Options API y Composition API, eligiendo el patrón adecuado según el escenario.

---

## 1. Ejes principales de respuesta en entrevista

1. **Dos formas de escritura**: Options API y Composition API, se eligen según el escenario.
2. **Estrategia de selección**: Stores simples con Composition API, stores con persistencia con Options API, lógica compleja con Composition API.
3. **Diferencias clave**: State debe ser una función, `this` en Actions apunta a la instancia del store, dos formas de escribir Getters.

---

## 2. Options API (Escritura tradicional)

### 2.1 Estructura básica

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: Definir estado
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: Definir métodos
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: Definir propiedades computadas
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ Configuración de persistencia
  persist: true, // Persistencia automática en localStorage
});
```

### 2.2 Puntos clave

**1. State debe ser una función**

```typescript
// ✅ Correcto
state: () => ({ count: 0 });

// ❌ Incorrecto (hace que múltiples instancias compartan estado)
state: {
  count: 0;
}
```

**2. `this` en Actions apunta a la instancia del store**

```typescript
actions: {
  increment() {
    this.count++; // Modificación directa del state
  },
};
```

**3. Dos formas de escribir Getters**

```typescript
getters: {
  // Forma 1: Retornar valor directamente (recomendado)
  doubleCount: (state) => state.count * 2,

  // Forma 2: Retornar computed (actualización reactiva)
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup (Escritura moderna)

### 3.1 Ejemplo de Store simple

```typescript
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

**Puntos clave de entrevista**:
- Uso de `useSessionStorage` de `@vueuse/core` para persistencia
- Más cercano a la escritura Composition API
- Todos los `ref` o `reactive` son state
- Todas las funciones son actions
- Todos los `computed` son getters

### 3.2 Ejemplo de Store complejo

```typescript
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';

type GameState = {
  list: Response.GameList;
  allGameList: Response.AllGameList;
  favoriteList: Response.FavoriteList;
  favoriteMap: Response.FavoriteMap;
};

export const useGameStore = defineStore('gameStore', () => {
  // 📦 State (usando reactive)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: [],
    },
    favoriteList: [],
    favoriteMap: {},
  });

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING;
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO;
    gameState.allGameList.SLOT = data.SLOT;
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data;
    gameState.favoriteMap = {};
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true;
    });
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0; // Mantener reactividad
    gameState.favoriteMap = {};
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList,
  };
});
```

**Puntos clave**:

**1. Uso de `reactive` vs `ref`**

```typescript
// 📌 Usar reactive (recomendado para objetos complejos)
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // Acceso directo

// 📌 Usar ref (recomendado para tipos primitivos)
const count = ref(0);
count.value++; // Necesita .value
```

**2. ¿Por qué usar `.length = 0` para vaciar arrays?**

```typescript
// ✅ Mantiene reactividad (recomendado)
gameState.favoriteList.length = 0;

// ❌ Pierde reactividad
gameState.favoriteList = [];
```

---

## 4. Comparación de las dos formas de escritura

| Característica          | Options API              | Composition API (Setup)          |
| ----------------------- | ------------------------ | -------------------------------- |
| **Estilo de sintaxis**  | Configuración de objeto  | Funcional                        |
| **Curva de aprendizaje** | Menor (similar a Vue 2) | Mayor (requiere entender Composition API) |
| **Soporte TypeScript**  | Bueno                    | Mejor                           |
| **Flexibilidad**        | Media                    | Alta (composición libre de lógica) |
| **Legibilidad**         | Estructura clara         | Necesita buena organización      |
| **Escenario recomendado** | Stores simples         | Lógica compleja, composición de funciones |

**Estrategia de selección del proyecto**:
- **Stores simples (< 5 states)**: Composition API
- **Stores con persistencia**: Options API + `persist: true`
- **Lógica de negocio compleja**: Composition API (más flexible)
- **Stores con Getters**: Options API (sintaxis más clara)

---

## 5. Resumen de puntos clave para entrevista

### 5.1 Elección entre las dos formas de escritura

**Posible respuesta:**

> En el proyecto uso dos métodos de definición de Store: Options API y Composition API. Options API usa configuración de objeto, sintaxis similar a Vue 2, curva de aprendizaje menor, adecuado para stores simples y stores con persistencia. Composition API usa escritura funcional, más flexible, mejor soporte TypeScript, adecuado para lógica compleja. La estrategia de selección: stores simples con Composition API, stores con persistencia con Options API, lógica de negocio compleja con Composition API.

**Puntos clave:**
- ✅ Diferencias entre las dos formas de escritura
- ✅ Estrategia de selección
- ✅ Experiencia real en proyectos

### 5.2 Puntos técnicos clave

**Posible respuesta:**

> Al implementar Stores, hay varios puntos técnicos clave: 1) State debe ser una función para evitar compartir estado entre múltiples instancias; 2) `this` en Actions apunta a la instancia del store, puede modificar state directamente; 3) Getters tiene dos formas de escritura, puede retornar valores directamente o retornar computed; 4) Usar `reactive` para objetos complejos, `ref` para tipos primitivos; 5) Vaciar arrays con `.length = 0` para mantener la reactividad.

**Puntos clave:**
- ✅ State debe ser una función
- ✅ Uso de `this` en Actions
- ✅ Formas de escritura de Getters
- ✅ reactive vs ref
- ✅ Mantener la reactividad

---

## 6. Resumen de entrevista

**Posible respuesta:**

> En el proyecto uso Options API y Composition API para implementar Pinia Stores. Options API es adecuado para stores simples y stores con persistencia, sintaxis clara. Composition API es adecuado para lógica compleja, más flexible y mejor soporte TypeScript. La estrategia de selección se basa en la complejidad y necesidades del Store. Los puntos técnicos clave incluyen: State debe ser una función, uso de `this` en Actions, dos formas de escritura de Getters y mantener la reactividad.

**Puntos clave:**
- ✅ Diferencias y elección entre las dos formas de escritura
- ✅ Puntos técnicos clave
- ✅ Experiencia real en proyectos
