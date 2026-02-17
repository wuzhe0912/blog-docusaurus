---
id: state-management-vue-pinia-best-practices
title: 'Mejores Prácticas y Errores Comunes de Pinia'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Mejores prácticas y manejo de errores comunes de Pinia Store en un proyecto de plataforma multi-marca.

---

## 1. Ejes principales de respuesta en entrevista

1. **Principios de diseño**: Principio de responsabilidad única, mantener el Store simple, no llamar APIs directamente en el Store.
2. **Errores comunes**: Pérdida de reactividad al desestructurar directamente, llamar al Store fuera de Setup, romper la reactividad al modificar el State, dependencias circulares.
3. **Mejores prácticas**: Usar TypeScript, separación de responsabilidades, combinar múltiples Stores en Composables.

---

## 2. Principios de diseño del Store

### 2.1 Principio de responsabilidad única

```typescript
// ✅ Buen diseño: Cada Store solo se encarga de un dominio
useAuthStore(); // Solo autenticación
useUserInfoStore(); // Solo información del usuario
useGameStore(); // Solo información del juego

// ❌ Mal diseño: Un Store gestiona todo
useAppStore(); // Gestiona autenticación, usuario, juegos, configuración...
```

### 2.2 Mantener el Store simple

```typescript
// ✅ Recomendado
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ No recomendado: Store con lógica de negocio compleja
// Debería estar en un composable
```

### 2.3 No llamar APIs directamente en el Store

```typescript
// ❌ No recomendado: Llamada directa a API en el Store
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // Llamada API
      this.list = data;
    },
  },
});

// ✅ Recomendado: Llamar API en el Composable, Store solo almacena
export const useGameStore = defineStore('gameStore', {
  actions: {
    setGameList(list: Game[]) {
      this.list = list;
    },
  },
});

export function useGame() {
  const gameStore = useGameStore();
  async function fetchGames() {
    const { status, data } = await api.getGames(); // Llamada API en Composable
    if (status) {
      gameStore.setGameList(data); // Store solo almacena
    }
  }
  return { fetchGames };
}
```

---

## 3. Usar TypeScript

```typescript
// ✅ Definición de tipos completa
type UserState = {
  info: Response.UserInfo;
  walletList: Response.UserWalletList;
};

export const useUserInfoStore = defineStore('useInfoStore', () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: [],
  });
  return { state };
});
```

---

## 4. Errores comunes

### 4.1 Error 1: Pérdida de reactividad al desestructurar directamente

```typescript
// ❌ Incorrecto
const { count } = useCounterStore();
count; // No es reactivo

// ✅ Correcto
const { count } = storeToRefs(useCounterStore());
count.value; // Reactivo
```

### 4.2 Error 2: Llamar al Store fuera de Setup

```typescript
// ❌ Incorrecto: Llamada a nivel de módulo
const authStore = useAuthStore(); // ❌ Momento incorrecto

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ Correcto: Llamada dentro de la función
export function useAuth() {
  const authStore = useAuthStore(); // ✅ Momento correcto
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 Error 3: Romper la reactividad al modificar el State

```typescript
// ❌ Incorrecto: Asignar directamente un nuevo array
function updateList(newList) {
  gameState.list = newList; // Puede perder reactividad
}

// ✅ Correcto: Usar splice o push
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ También se puede usar asignación con reactive
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 Error 4: Dependencias circulares

```typescript
// ❌ Incorrecto: Dependencia mutua entre Stores
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // Depende de userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // Depende de authStore ❌ Dependencia circular
});

// ✅ Correcto: Combinar en Composable
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  async function initialize() {
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
    }
  }
  return { initialize };
}
```

### 4.5 Error 5: Olvidar return

```typescript
// ❌ Incorrecto: Olvidó return
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ Olvidó return, el componente no puede acceder
});

// ✅ Correcto
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ return es obligatorio
});
```

---

## 5. Resumen de puntos clave para entrevista

### 5.1 Principios de diseño del Store

**Posible respuesta:**

> Al diseñar Pinia Stores, sigo varios principios: 1) Principio de responsabilidad única, cada Store solo se encarga de un dominio; 2) Mantener el Store simple, no incluir lógica de negocio compleja; 3) No llamar APIs directamente en el Store, llamar APIs en Composables, el Store solo almacena; 4) Usar definiciones de tipos completas con TypeScript para mejorar la experiencia de desarrollo.

**Puntos clave:**
- ✅ Principio de responsabilidad única
- ✅ Store simple
- ✅ Separación de responsabilidades
- ✅ Uso de TypeScript

### 5.2 Errores comunes y cómo evitarlos

**Posible respuesta:**

> Los errores comunes al usar Pinia incluyen: 1) Pérdida de reactividad al desestructurar directamente, se debe usar `storeToRefs`; 2) Llamar al Store fuera de Setup, debe llamarse dentro de la función; 3) Romper la reactividad al modificar el State, usar `.length = 0` o `Object.assign`; 4) Dependencias circulares, combinar múltiples Stores en Composables; 5) Olvidar return, los Stores con Composition API deben tener return.

**Puntos clave:**
- ✅ Mantener la reactividad
- ✅ Momento de llamada correcto
- ✅ Métodos de modificación de estado
- ✅ Evitar dependencias circulares

---

## 6. Resumen de entrevista

**Posible respuesta:**

> Al usar Pinia en el proyecto, sigo varias mejores prácticas: 1) El diseño del Store sigue el principio de responsabilidad única y se mantiene simple; 2) No llamar APIs directamente en el Store, sino en Composables; 3) Usar definiciones de tipos completas con TypeScript; 4) Prestar atención a errores comunes como pérdida de reactividad, dependencias circulares, etc. Estas prácticas aseguran la mantenibilidad y escalabilidad del Store.

**Puntos clave:**
- ✅ Principios de diseño del Store
- ✅ Errores comunes y cómo evitarlos
- ✅ Mejores prácticas
- ✅ Experiencia real en proyectos
