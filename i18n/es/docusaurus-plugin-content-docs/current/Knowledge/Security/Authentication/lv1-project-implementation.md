---
id: login-lv1-project-implementation
title: '[Lv1] Cómo implementaste el mecanismo de inicio de sesión en proyectos anteriores?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Objetivo: Explicar claramente en 3-5 minutos "como el frontend maneja el inicio de sesión, mantenimiento de estado y protección de páginas", para recordarlo rápidamente durante una entrevista.

---

## 1. Ejes principales de la respuesta

1. **Flujo de inicio de sesión en 3 etapas**: Enviar formulario → Verificación del backend → Almacenar Token y redirigir.
2. **Gestión de estado y Token**: Pinia con persistencia, Axios Interceptor para adjuntar automáticamente el Bearer Token.
3. **Procesamiento posterior y protección**: Inicializacion de datos compartidos, guardias de ruta, cierre de sesión y escenarios excepcionales (OTP, cambio de contraseña forzado).

Comienza con estos tres puntos clave y luego expande los detalles según sea necesario, para que el entrevistador perciba tu vision integral.

---

## 2. Composicion del sistema y división de responsabilidades

| Modulo           | Ubicación                           | Rol                                          |
| ---------------- | ----------------------------------- | -------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Almacenar estado de sesión, persistir Token, proveer getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsular flujo de login/logout, formato de retorno unificado |
| API de Login     | `src/api/login.ts`                  | Llamar al backend `POST /login`, `POST /logout` |
| Utilidades Axios | `src/common/utils/request.ts`       | Request/Response Interceptor, manejo unificado de errores |
| Guardia de ruta  | `src/router/index.ts`               | Determinar si se requiere inicio de sesión según `meta`, redirigir a login |
| Flujo de inicio  | `src/common/composables/useInit.ts` | Al iniciar la App, verificar si existe Token, cargar datos necesarios |

> Regla mnemotécnica: **"Store gestiona estado, Hook gestiona flujo, Interceptor gestiona canal, Guard gestiona páginas"**.

---

## 3. Flujo de inicio de sesión (paso a paso)

### Step 0. Formulario y validación previa

- Soporta dos métodos de inicio de sesión: contraseña y código de verificación SMS.
- Antes de enviar, se realiza validación básica (campos obligatorios, formato, prevención de envio doble).

### Step 1. Llamada a la API de login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` unifica el manejo de errores y la gestión de loading.
- En caso de exito, `data` contiene el Token e información esencial del usuario.

### Step 2. Manejo de la respuesta del backend

| Situacion                                     | Accion                                            |
| --------------------------------------------- | ------------------------------------------------- |
| **Verificación adicional requerida** (ej: confirmación de identidad en primer inicio) | Establecer `authStore.onBoarding` en `true`, redirigir a página de verificación |
| **Cambio de contraseña forzado**              | Redirigir al flujo de cambio de contraseña con parametros necesarios |
| **Exito normal**                              | Llamar `authStore.$patch()` para almacenar Token e información del usuario |

### Step 3. Acciones comunes post-inicio de sesión

1. Obtener información básica del usuario y lista de billeteras.
2. Inicializar contenido personalizado (ej: lista de regalos, notificaciones).
3. Redirigir a página interna según `redirect` o ruta predeterminada.

> El inicio de sesión exitoso es solo la mitad; **los datos compartidos posteriores deben completarse en este momento**, evitando que cada página haga llamadas API individuales.

---

## 4. Gestión del ciclo de vida del Token

### 4.1 Estrategia de almacenamiento

- `authStore` con `persist: true` activado, escribe campos clave en `localStorage`.
- Ventaja: El estado se restaura automáticamente tras recargar. Desventaja: Se debe prestar atencion a XSS y seguridad.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Las APIs que requieren autorizacion incluyen automáticamente el Bearer Token.
- Si la API esta marcada como `needToken: false` (login, registro, etc.), se omite el proceso de inclusion.

### 4.3 Manejo de expiración y excepciones

- Si el backend retorna Token expirado o inválido, el Response Interceptor lo transforma en un mensaje de error y desencadena el flujo de cierre de sesión.
- Para extensión, se puede agregar el mecanismo de Refresh Token; el proyecto actual adopta una estrategia simplificada.

---

## 5. Protección de rutas e inicializacion

### 5.1 Guardia de ruta

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- A través de `meta.needAuth` se decide si verificar el estado de sesión.
- Sin sesión iniciada, redirige a la página de login o a una página pública especificada.

### 5.2 Inicializacion al arrancar la aplicación

`useInit` maneja al iniciar la App:

1. Verificar si la URL contiene `login_token` o `platform_token`; si es así, realizar login automático o configurar el Token.
2. Si el Store ya tiene Token, cargar información del usuario y datos compartidos.
3. Sin Token, permanecer en la página pública esperando que el usuario inicie sesión manualmente.

---

## 6. Flujo de cierre de sesión (limpieza)

1. Llamar `POST /logout` para notificar al backend.
2. Ejecutar `reset()`:
   - `authStore.$reset()` para limpiar información de sesión.
   - Reiniciar Stores relacionados (información del usuario, favoritos, codigos de invitacion, etc.).
3. Limpiar cache del navegador (ej: cache en localStorage).
4. Redirigir a la página de login o inicio.

> El cierre de sesión es el reflejo del inicio de sesión: no basta con eliminar el Token, hay que asegurarse de que todos los estados dependientes se limpien para evitar datos residuales.

---

## 7. Preguntas frecuentes y mejores prácticas

- **Separación de flujos**: Separar el login de la inicializacion post-login para mantener los hooks concisos.
- **Manejo de errores**: Unificado a través de `useApi` y Response Interceptor, asegurando consistencia en la UI.
- **Seguridad**:
  - HTTPS en todo el proceso.
  - Cuándo el Token esta en `localStorage`, tener cuidado con XSS en operaciones sensibles.
  - Según la situacion, extender con httpOnly Cookie o Refresh Token.
- **Plan de contingencia**: Mantener flexibilidad para escenarios como OTP y cambio de contraseña forzado, delegando el estado al componente de interfaz a través del retorno del hook.

---

## 8. Resumen rápido para entrevistas

1. **"Entrada → Verificación → Almacenamiento → Redirección"**: Usar este orden para describir el flujo completo.
2. **"Store registra estado, Interceptor adjunta headers, Guard bloquea acceso no autorizado"**: Destacar la división arquitectonica.
3. **"Completar datos compartidos inmediatamente después del login"**: Demostrar sensibilidad hacia la experiencia del usuario.
4. **"Cierre de sesión es reinicio total + redirección a página segura"**: Cubrir seguridad y cierre del flujo.
