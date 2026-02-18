---
id: login-lv1-session-vs-token
title: '[Lv1] Cuál es la diferencia entre Session-based y Token-based?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Pregunta frecuente en entrevistas: Conoces la diferencia entre Session tradicional y Token moderno? Domina los siguientes puntos clave para organizar tus ideas rápidamente.

---

## 1. Conceptos centrales de los dos modelos de autenticación

### Session-based Authentication

- **Estado almacenado en el servidor**: Tras el primer inicio de sesión, el servidor crea una Session en memoria o base de datos, y devuelve un Session ID almacenado en una Cookie.
- **Solicitudes posteriores dependen del Session ID**: El navegador envía automáticamente la Session Cookie en el mismo dominio, y el servidor busca la información del usuario correspondiente mediante el Session ID.
- **Común en aplicaciones MVC / monoliticas tradicionales**: El servidor se encarga de renderizar páginas y mantener el estado del usuario.

### Token-based Authentication (por ejemplo JWT)

- **Estado almacenado en el cliente**: Tras un inicio de sesión exitoso se genera un Token (que puede contener información del usuario y permisos), almacenado por el frontend.
- **Token enviado en cada solicitud**: Normalmente en `Authorization: Bearer <token>`, el servidor verifica la firma para obtener la información del usuario.
- **Común en SPA / microservicios**: El backend solo necesita verificar el Token, sin almacenar el estado del usuario.

---

## 2. Comparación del flujo de solicitudes

| Paso del flujo | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login exitoso  | El servidor crea Session, devuelve `Set-Cookie: session_id=...` | El servidor emite Token, devuelve JSON: `{ access_token, expires_in, ... }` |
| Ubicación de almacenamiento | Cookie del navegador (generalmente httponly) | El frontend elige: `localStorage`, `sessionStorage`, Cookie, Memory |
| Solicitudes posteriores | El navegador envía Cookie automáticamente, el servidor consulta para obtener info del usuario | El frontend incluye manualmente `Authorization` en el Header |
| Método de verificación | Consultar el Session Store | Verificar firma del Token, o comparar con lista negra/blanca |
| Cierre de sesión | Eliminar Session del servidor, devolver `Set-Cookie` para limpiar Cookie | Frontend elimina Token; para invalidación forzada se necesita lista negra o rotación de claves |

---

## 3. Resumen de ventajas y desventajas

| Aspecto    | Session-based                                                                 | Token-based (JWT)                                                                 |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Ventajas   | - Cookie se envía automáticamente, simple en el navegador<br />- Session puede almacenar gran cantidad de datos<br />- Fácil revocar y forzar cierre de sesión | - Sin estado, escalable horizontalmente<br />- Adecuado para SPA, móviles, microservicios<br />- Token puede usarse entre dominios y dispositivos |
| Desventajas | - El servidor debe mantener el Session Store, consume memoria<br />- Despliegue distribuido requiere sincronización de Session | - Token más grande, se transmite en cada solicitud<br />- No se puede revocar fácilmente, necesita mecanismo de lista negra/rotación de claves |
| Riesgos de seguridad | - Vulnerable a CSRF (Cookie se envía automáticamente)<br />- Si se filtra el Session ID, debe eliminarse inmediatamente | - Vulnerable a XSS (si se almacena en ubicación accesible)<br />- Si el Token es robado antes de expirar, se pueden reenviar solicitudes |
| Escenarios de uso | - Web tradicional (SSR) + mismo dominio<br />- Servidor renderiza páginas | - RESTful API / GraphQL<br />- App móvil, SPA, microservicios |

---

## 4. Cómo elegir?

### Hazte tres preguntas

1. **Necesitas compartir estado de sesión entre dominios o múltiples plataformas?**
   - Si → Token-based es más flexible.
   - No → Session-based es más simple.

2. **El despliegue es en múltiples servidores o microservicios?**
   - Si → Token-based reduce la necesidad de replicación o centralización de Session.
   - No → Session-based es fácil y seguro.

3. **Hay requisitos de alta seguridad (bancos, sistemas empresariales)?**
   - Alta seguridad → Session-based + httponly Cookie + protección CSRF sigue siendo el estándar.
   - API ligeras o servicios móviles → Token-based + HTTPS + Refresh Token + estrategia de lista negra.

### Estrategias de combinación comunes

- **Sistemas empresariales internos**: Session-based + sincronización con Redis / Base de datos.
- **SPA moderno + App móvil**: Token-based (Access Token + Refresh Token).
- **Microservicios a gran escala**: Token-based (JWT) con verificación en API Gateway.

---

## 5. Plantilla de respuesta para entrevistas

> "La Session tradicional almacena el estado en el servidor, devuelve un session id en una Cookie, y el navegador lo envía automáticamente en cada solicitud, por lo que es muy adecuado para Web Apps del mismo dominio. La desventaja es que el servidor debe mantener el Session Store, y si hay múltiples servidores, se necesita sincronización.
> En cambio, Token-based (como JWT) codifica la información del usuario en un Token almacenado en el cliente, y el frontend lo incluye manualmente en el Header en cada solicitud. Este enfoque es sin estado, adecuado para SPA y microservicios, y más fácil de escalar.
> En cuanto a seguridad, Session debe preocuparse por CSRF, y Token por XSS. Si necesito hacer integración entre dominios, dispositivos móviles o múltiples servicios, elegiría Token; si es un sistema empresarial tradicional con renderizado del lado del servidor, elegiría Session con httponly Cookie."

---

## 6. Notas de extensión para entrevistas

- Session → Enfoque en **protección CSRF, estrategia de sincronización de Session, cuando limpiar**.
- Token → Enfoque en **ubicación de almacenamiento (Cookie vs localStorage)**, **mecanismo de Refresh Token**, **lista negra / rotación de claves**.
- Se puede complementar con la solución híbrida común en empresas: almacenar Token en `httpOnly Cookie`, combinándolo también con CSRF Token.

---

## 7. Referencias

- [MDN: HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
