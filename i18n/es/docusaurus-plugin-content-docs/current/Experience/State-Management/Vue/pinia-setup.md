---
id: state-management-vue-pinia-setup
title: 'Inicialización y Configuración de Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Configuración de inicialización de Pinia y diseño de estructura del proyecto en un proyecto de plataforma multi-marca.

---

## 1. Ejes principales de respuesta en entrevista

1. **Razones para elegir Pinia**: Mejor soporte de TypeScript, API más simple, diseño modular, mejor experiencia de desarrollo.
2. **Configuración de inicialización**: Uso de `piniaPluginPersistedstate` para persistencia, extensión de la interfaz `PiniaCustomProperties`.
3. **Estructura del proyecto**: 30+ stores, gestionados por categorías de dominio funcional.

---

## 2. ¿Por qué Pinia?

### 2.1 Pinia vs Vuex

**Pinia** es la herramienta oficial de gestión de estado para Vue 3 y, como sucesor de Vuex, ofrece una API más simple y mejor soporte de TypeScript.

**Respuesta clave para entrevista**:

1. **Mejor soporte de TypeScript**
   - Pinia proporciona inferencia de tipos completa
   - No necesita funciones auxiliares adicionales (como `mapState`, `mapGetters`)

2. **API más simple**
   - No necesita mutations (capa de operaciones síncronas en Vuex)
   - Ejecutar operaciones síncronas/asíncronas directamente en actions

3. **Diseño modular**
   - Sin módulos anidados
   - Cada store es independiente

4. **Mejor experiencia de desarrollo**
   - Soporte de Vue Devtools
   - Hot Module Replacement (HMR)
   - Tamaño más pequeño (aprox. 1KB)

5. **Recomendación oficial de Vue 3**
   - Pinia es la herramienta oficial de gestión de estado para Vue 3

### 2.2 Componentes principales de Pinia

```typescript
// Los tres elementos centrales de un Store
{
  state: () => ({ ... }),      // Datos de estado
  getters: { ... },            // Propiedades computadas
  actions: { ... }             // Métodos (síncronos/asíncronos)
}
```

**Correspondencia con componentes Vue**:
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Configuración de inicialización de Pinia

### 3.1 Configuración básica

**Ubicación del archivo:** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Extender propiedades personalizadas de Pinia
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // Registrar plugin de persistencia
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**Puntos clave de entrevista**:
- ✅ Uso de `piniaPluginPersistedstate` para persistencia de estado
- ✅ Extensión de la interfaz `PiniaCustomProperties` para que todos los stores accedan al router
- ✅ Integración a través del wrapper `store` de Quasar

### 3.2 Estructura de archivos del Store

```
src/stores/
├── index.ts                    # Configuración de instancia Pinia
├── store-flag.d.ts            # Declaración de tipos TypeScript
│
├── authStore.ts               # Autenticación
├── userInfoStore.ts           # Información del usuario
├── gameStore.ts               # Información del juego
├── productStore.ts            # Información del producto
├── languageStore.ts           # Configuración de idioma
├── darkModeStore.ts          # Modo de tema
├── envStore.ts               # Configuración de entorno
└── ... (30+ stores en total)
```

**Principios de diseño**:
- Cada Store es responsable de un único dominio funcional
- Convención de nombres: `nombreDeFunción + Store.ts`
- Usar definiciones de tipos TypeScript completas

---

## 4. Resumen de puntos clave para entrevista

### 4.1 Razones para elegir Pinia

**Posible respuesta:**

> En el proyecto elegimos Pinia en lugar de Vuex principalmente por varias razones: 1) Mejor soporte de TypeScript con inferencia de tipos completa sin configuración adicional; 2) API más simple sin mutations, operaciones síncronas/asíncronas directamente en actions; 3) Diseño modular sin módulos anidados, cada store es independiente; 4) Mejor experiencia de desarrollo con Vue Devtools, HMR y menor tamaño; 5) Recomendación oficial de Vue 3.

**Puntos clave:**
- ✅ Soporte TypeScript
- ✅ Simplicidad de API
- ✅ Diseño modular
- ✅ Experiencia de desarrollo

### 4.2 Puntos clave de configuración de inicialización

**Posible respuesta:**

> En la inicialización de Pinia, realicé varias configuraciones clave: 1) Uso de `piniaPluginPersistedstate` para persistencia de estado, permitiendo que el Store se guarde automáticamente en localStorage; 2) Extensión de la interfaz `PiniaCustomProperties` para que todos los stores accedan al router, facilitando operaciones de enrutamiento en actions; 3) Integración a través del wrapper `store` de Quasar para la integración con el framework.

**Puntos clave:**
- ✅ Configuración del plugin de persistencia
- ✅ Extensión de propiedades personalizadas
- ✅ Integración con el framework

---

## 5. Resumen de entrevista

**Posible respuesta:**

> En el proyecto uso Pinia como herramienta de gestión de estado. Elegí Pinia por su mejor soporte de TypeScript, API más simple y mejor experiencia de desarrollo. En la configuración de inicialización, uso `piniaPluginPersistedstate` para persistencia y extiendo `PiniaCustomProperties` para que todos los stores accedan al router. El proyecto tiene 30+ stores gestionados por categorías de dominio funcional, donde cada Store es responsable de un único dominio.

**Puntos clave:**
- ✅ Razones para elegir Pinia
- ✅ Puntos clave de configuración
- ✅ Diseño de estructura del proyecto
- ✅ Experiencia real en proyectos
