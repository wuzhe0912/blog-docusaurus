---
id: login-lv1-project-implementation
title: '[Lv1] Como implementaste el mecanismo de inicio de sesion en proyectos anteriores?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Objetivo: Explicar claramente en 3-5 minutos "como el frontend maneja el inicio de sesion, mantenimiento de estado y proteccion de paginas", para recordarlo rapidamente durante una entrevista.

---

## 1. Ejes principales de la respuesta

1. **Flujo de inicio de sesion en 3 etapas**: Enviar formulario → Verificacion del backend → Almacenar Token y redirigir.
2. **Gestion de estado y Token**: Pinia con persistencia, Axios Interceptor para adjuntar automaticamente el Bearer Token.
3. **Procesamiento posterior y proteccion**: Inicializacion de datos compartidos, guardias de ruta, cierre de sesion y escenarios excepcionales (OTP, cambio de contrasena forzado).

Comienza con estos tres puntos clave y luego expande los detalles segun sea necesario, para que el entrevistador perciba tu vision integral.

---

## 2. Composicion del sistema y division de responsabilidades

| Modulo           | Ubicacion                           | Rol                                          |
| ---------------- | ----------------------------------- | -------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Almacenar estado de sesion, persistir Token, proveer getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsular flujo de login/logout, formato de retorno unificado |
| API de Login     | `src/api/login.ts`                  | Llamar al backend `POST /login`, `POST /logout` |
| Utilidades Axios | `src/common/utils/request.ts`       | Request/Response Interceptor, manejo unificado de errores |
| Guardia de ruta  | `src/router/index.ts`               | Determinar si se requiere inicio de sesion segun `meta`, redirigir a login |
| Flujo de inicio  | `src/common/composables/useInit.ts` | Al iniciar la App, verificar si existe Token, cargar datos necesarios |

> Regla mnemotecnica: **"Store gestiona estado, Hook gestiona flujo, Interceptor gestiona canal, Guard gestiona paginas"**.

---

## 3. Flujo de inicio de sesion (paso a paso)

### Step 0. Formulario y validacion previa

- Soporta dos metodos de inicio de sesion: contrasena y codigo de verificacion SMS.
- Antes de enviar, se realiza validacion basica (campos obligatorios, formato, prevencion de envio doble).

### Step 1. Llamada a la API de login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` unifica el manejo de errores y la gestion de loading.
- En caso de exito, `data` contiene el Token e informacion esencial del usuario.

### Step 2. Manejo de la respuesta del backend

| Situacion                                     | Accion                                            |
| --------------------------------------------- | ------------------------------------------------- |
| **Verificacion adicional requerida** (ej: confirmacion de identidad en primer inicio) | Establecer `authStore.onBoarding` en `true`, redirigir a pagina de verificacion |
| **Cambio de contrasena forzado**              | Redirigir al flujo de cambio de contrasena con parametros necesarios |
| **Exito normal**                              | Llamar `authStore.$patch()` para almacenar Token e informacion del usuario |

### Step 3. Acciones comunes post-inicio de sesion

1. Obtener informacion basica del usuario y lista de billeteras.
2. Inicializar contenido personalizado (ej: lista de regalos, notificaciones).
3. Redirigir a pagina interna segun `redirect` o ruta predeterminada.

> El inicio de sesion exitoso es solo la mitad; **los datos compartidos posteriores deben completarse en este momento**, evitando que cada pagina haga llamadas API individuales.

---

## 4. Gestion del ciclo de vida del Token

### 4.1 Estrategia de almacenamiento

- `authStore` con `persist: true` activado, escribe campos clave en `localStorage`.
- Ventaja: El estado se restaura automaticamente tras recargar. Desventaja: Se debe prestar atencion a XSS y seguridad.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Las APIs que requieren autorizacion incluyen automaticamente el Bearer Token.
- Si la API esta marcada como `needToken: false` (login, registro, etc.), se omite el proceso de inclusion.

### 4.3 Manejo de expiracion y excepciones

- Si el backend retorna Token expirado o invalido, el Response Interceptor lo transforma en un mensaje de error y desencadena el flujo de cierre de sesion.
- Para extension, se puede agregar el mecanismo de Refresh Token; el proyecto actual adopta una estrategia simplificada.

---

## 5. Proteccion de rutas e inicializacion

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

- A traves de `meta.needAuth` se decide si verificar el estado de sesion.
- Sin sesion iniciada, redirige a la pagina de login o a una pagina publica especificada.

### 5.2 Inicializacion al arrancar la aplicacion

`useInit` maneja al iniciar la App:

1. Verificar si la URL contiene `login_token` o `platform_token`; si es asi, realizar login automatico o configurar el Token.
2. Si el Store ya tiene Token, cargar informacion del usuario y datos compartidos.
3. Sin Token, permanecer en la pagina publica esperando que el usuario inicie sesion manualmente.

---

## 6. Flujo de cierre de sesion (limpieza)

1. Llamar `POST /logout` para notificar al backend.
2. Ejecutar `reset()`:
   - `authStore.$reset()` para limpiar informacion de sesion.
   - Reiniciar Stores relacionados (informacion del usuario, favoritos, codigos de invitacion, etc.).
3. Limpiar cache del navegador (ej: cache en localStorage).
4. Redirigir a la pagina de login o inicio.

> El cierre de sesion es el reflejo del inicio de sesion: no basta con eliminar el Token, hay que asegurarse de que todos los estados dependientes se limpien para evitar datos residuales.

---

## 7. Preguntas frecuentes y mejores practicas

- **Separacion de flujos**: Separar el login de la inicializacion post-login para mantener los hooks concisos.
- **Manejo de errores**: Unificado a traves de `useApi` y Response Interceptor, asegurando consistencia en la UI.
- **Seguridad**:
  - HTTPS en todo el proceso.
  - Cuando el Token esta en `localStorage`, tener cuidado con XSS en operaciones sensibles.
  - Segun la situacion, extender con httpOnly Cookie o Refresh Token.
- **Plan de contingencia**: Mantener flexibilidad para escenarios como OTP y cambio de contrasena forzado, delegando el estado al componente de interfaz a traves del retorno del hook.

---

## 8. Resumen rapido para entrevistas

1. **"Entrada → Verificacion → Almacenamiento → Redireccion"**: Usar este orden para describir el flujo completo.
2. **"Store registra estado, Interceptor adjunta headers, Guard bloquea acceso no autorizado"**: Destacar la division arquitectonica.
3. **"Completar datos compartidos inmediatamente despues del login"**: Demostrar sensibilidad hacia la experiencia del usuario.
4. **"Cierre de sesion es reinicio total + redireccion a pagina segura"**: Cubrir seguridad y cierre del flujo.
