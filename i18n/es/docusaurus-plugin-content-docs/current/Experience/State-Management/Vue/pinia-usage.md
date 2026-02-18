---
id: state-management-vue-pinia-usage
title: 'Práctica de uso de Pinia'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> En un proyecto de plataforma multimarca, formas de uso de Pinia Store en componentes y Composables, así como patrones de comunicación entre Stores.

---

## 1. Eje principal de respuesta en entrevista

1. **Uso en componentes**: Usar `storeToRefs` para mantener la reactividad, Actions se pueden desestructurar directamente.
2. **Composicion con Composables**: Componer múltiples Stores en Composables, encapsulando la logica de negocio.
3. **Comunicación entre Stores**: Se recomienda componer en Composable, evitando dependencias circulares.

---

## 2. Uso del Store en componentes

### 2.1 Uso básico

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// Usar directamente la instancia del store
const authStore = useAuthStore();

// Acceder al state
console.log(authStore.access_token);

// Llamar a una action
authStore.setToptVerified(true);

// Acceder a un getter
console.log(authStore.isLogin);
</script>
```

### 2.2 Desestructuración con `storeToRefs` (importante!)

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// Incorrecto: Se pierde la reactividad
const { access_token, isLogin } = authStore;

// Correcto: Mantiene la reactividad
const { access_token, isLogin } = storeToRefs(authStore);

// Las Actions se pueden desestructurar directamente (no necesitan storeToRefs)
const { setToptVerified } = authStore;
</script>
```

**Por que la desestructuración directa pierde la reactividad?**

- El state y los getters de Pinia son reactivos
- La desestructuración directa rompe la conexión reactiva
- `storeToRefs` convierte cada propiedad en un `ref`, manteniendo la reactividad
- Las Actions en si no son reactivas, por lo que se pueden desestructurar directamente

---

## 3. Uso del Store en Composables

### 3.1 Caso real: useGame.ts

Los Composables son el mejor lugar para componer la logica del Store.

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1. Importar múltiples stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2. Desestructurar state y getters (usando storeToRefs)
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3. Desestructurar actions (desestructuración directa)
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4. Componer logica
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5. Devolver para uso en componentes
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**Puntos clave de entrevista**:
- Los Composables son el mejor lugar para componer la logica del Store
- Usar `storeToRefs` para asegurar la reactividad
- Las Actions se pueden desestructurar directamente
- Encapsular la logica de negocio compleja en el composable

---

## 4. Comunicación entre Stores

### 4.1 Método 1: Llamar a otro Store dentro de un Store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Llamar al método de otro store
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Método 2: Componer múltiples Stores en Composable (recomendado)

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // Ejecutar la inicializacion de múltiples stores en secuencia
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**Puntos clave de entrevista**:
- Se recomienda componer múltiples Stores en Composable
- Evitar dependencias circulares entre Stores
- Mantener el principio de responsabilidad única del Store

---

## 5. Caso práctico: Flujo de inicio de sesión de usuario

Este es un flujo completo de uso del Store, que abarca la colaboracion de múltiples Stores.

### 5.1 Diagrama de flujo

```
El usuario hace clic en el botón de inicio de sesión
     |
Llamar a useAuth().handleLogin()
     |
Solicitud API de inicio de sesión
     |
Exito -> authStore guarda el token
     |
useUserInfo().getUserInfo()
     |
userInfoStore guarda la información del usuario
     |
useGame().initGameList()
     |
gameStore guarda la lista de juegos
     |
Redirigir a la página principal
```

### 5.2 Implementación del código

```typescript
// 1. authStore.ts - Gestionar el estado de autenticación
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // Persistir la información de autenticación
});

// 2. userInfoStore.ts - Gestionar la información del usuario
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // No persistir (información sensible)
});

// 3. useAuth.ts - Componer la logica de autenticación
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // Actualizar authStore
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id,
      });
      return true;
    }
    return false;
  }

  return {
    access_token,
    isLogin,
    handleLogin,
  };
}

// 4. LoginPage.vue - Página de inicio de sesión
<script setup lang="ts">
import { useAuth } from 'src/common/hooks/useAuth';
import { useUserInfo } from 'src/common/composables/useUserInfo';
import { useGame } from 'src/common/composables/useGame';
import { useRouter } from 'vue-router';

const { handleLogin } = useAuth();
const { getUserInfo } = useUserInfo();
const { initGameList } = useGame();
const router = useRouter();

const onSubmit = async (formData: LoginForm) => {
  // Paso 1: Iniciar sesión
  const success = await handleLogin(formData);
  if (success) {
    // Paso 2: Obtener información del usuario
    await getUserInfo();
    // Paso 3: Inicializar la lista de juegos
    await initGameList();
    // Paso 4: Redirigir a la página principal
    router.push('/');
  }
};
</script>
```

**Puntos clave de entrevista**:

1. **Separación de responsabilidades**
   - `authStore`: Solo gestiona el estado de autenticación
   - `userInfoStore`: Solo gestiona la información del usuario
   - `useAuth`: Encapsula la logica de negocio relacionada con la autenticación
   - `useUserInfo`: Encapsula la logica de negocio relacionada con la información del usuario

2. **Flujo de datos reactivo**
   - Usar `storeToRefs` para mantener la reactividad
   - Las actualizaciones del Store activan automáticamente las actualizaciones del componente

3. **Estrategia de persistencia**
   - `authStore` se persiste (el usuario mantiene la sesión después de refrescar la página)
   - `userInfoStore` no se persiste (por consideraciones de seguridad)

---

## 6. Puntos clave de entrevista

### 6.1 Uso de storeToRefs

**Se puede responder así:**

> Al usar Pinia Store en componentes, si se quiere desestructurar state y getters, se debe usar `storeToRefs` para mantener la reactividad. La desestructuración directa rompe la conexión reactiva porque el state y los getters de Pinia son reactivos. `storeToRefs` convierte cada propiedad en un `ref`, manteniendo la reactividad. Las Actions se pueden desestructurar directamente, sin necesidad de `storeToRefs`, porque no son reactivas en si mismas.

**Puntos clave:**
- Función de `storeToRefs`
- Por que se necesita `storeToRefs`
- Las Actions se pueden desestructurar directamente

### 6.2 Comunicación entre Stores

**Se puede responder así:**

> La comunicación entre Stores tiene dos formas: 1) Llamar a otro Store dentro de un Store, pero hay que tener cuidado de evitar dependencias circulares; 2) Componer múltiples Stores en Composable, esta es la forma recomendada. La mejor práctica es mantener el principio de responsabilidad única del Store, encapsular la logica de negocio compleja en el Composable y evitar dependencias directas entre Stores.

**Puntos clave:**
- Dos formas de comunicación
- Se recomienda componer en Composable
- Evitar dependencias circulares

---

## 7. Resumen de entrevista

**Se puede responder así:**

> Al usar Pinia Store en proyectos, hay varias prácticas clave: 1) Usar `storeToRefs` en componentes para desestructurar state y getters, manteniendo la reactividad; 2) Componer múltiples Stores en Composables, encapsulando la logica de negocio; 3) La comunicación entre Stores se recomienda componer en Composable, evitando dependencias circulares; 4) Mantener el principio de responsabilidad única del Store, colocando la logica compleja en el Composable.

**Puntos clave:**
- Uso de `storeToRefs`
- Composicion de Stores con Composables
- Patrones de comunicación entre Stores
- Principio de separación de responsabilidades
