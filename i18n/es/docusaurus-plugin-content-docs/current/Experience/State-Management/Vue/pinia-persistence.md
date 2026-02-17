---
id: state-management-vue-pinia-persistence
title: 'Estrategias de Persistencia de Pinia'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Estrategias de persistencia para Pinia Store en un proyecto de plataforma multi-marca: uso de `piniaPluginPersistedstate` y `useSessionStorage` de VueUse.

---

## 1. Ejes principales de respuesta en entrevista

1. **Tres métodos de persistencia**: `persist: true`, `useSessionStorage`, persistencia manual.
2. **Estrategia de selección**: Para todo el Store usar `persist: true`, para campos específicos usar `useSessionStorage`.
3. **Consideraciones de seguridad**: No persistir información sensible, sí persistir preferencias del usuario.

---

## 2. Métodos de persistencia

### 2.1 Pinia Plugin Persistedstate

**Options API:**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // Persistencia automática en localStorage
});
```

**Configuración personalizada:**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // Solo persistir campos específicos
}
```

### 2.2 useSessionStorage / useLocalStorage de VueUse

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Persistencia automática en sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 Persistencia manual (no recomendado)

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // Guardado manual
    },
  },
});
```

---

## 3. Tabla comparativa

| Método                | Ventajas                 | Desventajas                    | Caso de uso                        |
| --------------------- | ------------------------ | ------------------------------ | ---------------------------------- |
| **persist: true**     | Automático, simple       | Todo el state se persiste      | Todo el Store necesita persistencia |
| **useSessionStorage** | Flexible, type-safe      | Se define individualmente      | Campos específicos                 |
| **Persistencia manual** | Control total          | Propenso a errores, difícil mantenimiento | No recomendado              |

---

## 4. Resetear el estado del Store

### 4.1 `$reset()` integrado de Pinia

```typescript
// Soportado por Options API Store
const store = useMyStore();
store.$reset(); // Resetear al estado inicial
```

### 4.2 Método de reset personalizado

```typescript
// Composition API Store
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({
    list: [],
    favoriteList: [],
  });

  function resetGameStore() {
    gameState.list = [];
    gameState.favoriteList = [];
  }

  return { gameState, resetGameStore };
});
```

### 4.3 Reset por lotes (caso real)

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // Resetear múltiples stores
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // Resetear todos los estados al cerrar sesión
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. Mejores prácticas

### 5.1 Estrategia de persistencia

```typescript
// ✅ No persistir información sensible
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // Persistir
    user_password: undefined, // ❌ Nunca persistir contraseñas
  }),
  persist: {
    paths: ['access_token'], // Solo persistir token
  },
});
```

### 5.2 Actualización por lotes con `$patch`

```typescript
// ❌ No recomendado: Múltiples actualizaciones (dispara múltiples reacciones)
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ Recomendado: Actualización por lotes (solo dispara una reacción)
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ También se puede usar la forma funcional
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. Resumen de puntos clave para entrevista

### 6.1 Selección del método de persistencia

**Posible respuesta:**

> En el proyecto uso tres métodos de persistencia: 1) `persist: true`, todo el Store se persiste automáticamente en localStorage, adecuado para Stores que necesitan persistencia completa; 2) `useSessionStorage` o `useLocalStorage`, persistencia de campos específicos, más flexible y type-safe; 3) Persistencia manual, no recomendado. En la selección: información sensible no se persiste, preferencias del usuario sí se persisten.

**Puntos clave:**
- ✅ Tres métodos de persistencia
- ✅ Estrategia de selección
- ✅ Consideraciones de seguridad

### 6.2 Actualización por lotes y reset

**Posible respuesta:**

> Al actualizar el estado del Store, uso `$patch` para actualizaciones por lotes que solo disparan una reacción, mejorando el rendimiento. Al resetear estados, los Options API Stores pueden usar `$reset()`, los Composition API Stores necesitan un método de reset personalizado. Al cerrar sesión se pueden resetear múltiples Stores por lotes para asegurar una limpieza completa del estado.

**Puntos clave:**
- ✅ `$patch` para actualización por lotes
- ✅ Métodos de reset de estado
- ✅ Estrategia de reset por lotes

---

## 7. Resumen de entrevista

**Posible respuesta:**

> Al implementar la persistencia de Pinia Store en el proyecto, uso `persist: true` para la persistencia automática de todo el Store o `useSessionStorage` para la persistencia de campos específicos. La estrategia de selección es: información sensible no se persiste, preferencias del usuario sí se persisten. Al actualizar estados uso `$patch` para actualizaciones por lotes y mejorar el rendimiento. Al resetear estados, Options API usa `$reset()`, Composition API usa métodos de reset personalizados.

**Puntos clave:**
- ✅ Métodos de persistencia y selección
- ✅ Estrategia de actualización por lotes
- ✅ Métodos de reset de estado
- ✅ Experiencia real en proyectos
