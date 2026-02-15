---
id: login-lv1-session-vs-token
title: '[Lv1] Cual es la diferencia entre Session-based y Token-based?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Pregunta frecuente en entrevistas: Conoces la diferencia entre Session tradicional y Token moderno? Domina los siguientes puntos clave para organizar tus ideas rapidamente.

---

## 1. Conceptos centrales de los dos modelos de autenticacion

### Session-based Authentication

- **Estado almacenado en el servidor**: Tras el primer inicio de sesion, el servidor crea una Session en memoria o base de datos, y devuelve un Session ID almacenado en una Cookie.
- **Solicitudes posteriores dependen del Session ID**: El navegador envia automaticamente la Session Cookie en el mismo dominio, y el servidor busca la informacion del usuario correspondiente mediante el Session ID.
- **Comun en aplicaciones MVC / monoliticas tradicionales**: El servidor se encarga de renderizar paginas y mantener el estado del usuario.

### Token-based Authentication (por ejemplo JWT)

- **Estado almacenado en el cliente**: Tras un inicio de sesion exitoso se genera un Token (que puede contener informacion del usuario y permisos), almacenado por el frontend.
- **Token enviado en cada solicitud**: Normalmente en `Authorization: Bearer <token>`, el servidor verifica la firma para obtener la informacion del usuario.
- **Comun en SPA / microservicios**: El backend solo necesita verificar el Token, sin almacenar el estado del usuario.

---

## 2. Comparacion del flujo de solicitudes

| Paso del flujo | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login exitoso  | El servidor crea Session, devuelve `Set-Cookie: session_id=...` | El servidor emite Token, devuelve JSON: `{ access_token, expires_in, ... }` |
| Ubicacion de almacenamiento | Cookie del navegador (generalmente httponly) | El frontend elige: `localStorage`, `sessionStorage`, Cookie, Memory |
| Solicitudes posteriores | El navegador envia Cookie automaticamente, el servidor consulta para obtener info del usuario | El frontend incluye manualmente `Authorization` en el Header |
| Metodo de verificacion | Consultar el Session Store | Verificar firma del Token, o comparar con lista negra/blanca |
| Cierre de sesion | Eliminar Session del servidor, devolver `Set-Cookie` para limpiar Cookie | Frontend elimina Token; para invalidacion forzada se necesita lista negra o rotacion de claves |

---

## 3. Resumen de ventajas y desventajas

| Aspecto    | Session-based                                                                 | Token-based (JWT)                                                                 |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Ventajas   | - Cookie se envia automaticamente, simple en el navegador<br />- Session puede almacenar gran cantidad de datos<br />- Facil revocar y forzar cierre de sesion | - Sin estado, escalable horizontalmente<br />- Adecuado para SPA, moviles, microservicios<br />- Token puede usarse entre dominios y dispositivos |
| Desventajas | - El servidor debe mantener el Session Store, consume memoria<br />- Despliegue distribuido requiere sincronizacion de Session | - Token mas grande, se transmite en cada solicitud<br />- No se puede revocar facilmente, necesita mecanismo de lista negra/rotacion de claves |
| Riesgos de seguridad | - Vulnerable a CSRF (Cookie se envia automaticamente)<br />- Si se filtra el Session ID, debe eliminarse inmediatamente | - Vulnerable a XSS (si se almacena en ubicacion accesible)<br />- Si el Token es robado antes de expirar, se pueden reenviar solicitudes |
| Escenarios de uso | - Web tradicional (SSR) + mismo dominio<br />- Servidor renderiza paginas | - RESTful API / GraphQL<br />- App movil, SPA, microservicios |

---

## 4. Como elegir?

### Hazte tres preguntas

1. **Necesitas compartir estado de sesion entre dominios o multiples plataformas?**
   - Si → Token-based es mas flexible.
   - No → Session-based es mas simple.

2. **El despliegue es en multiples servidores o microservicios?**
   - Si → Token-based reduce la necesidad de replicacion o centralizacion de Session.
   - No → Session-based es facil y seguro.

3. **Hay requisitos de alta seguridad (bancos, sistemas empresariales)?**
   - Alta seguridad → Session-based + httponly Cookie + proteccion CSRF sigue siendo el estandar.
   - API ligeras o servicios moviles → Token-based + HTTPS + Refresh Token + estrategia de lista negra.

### Estrategias de combinacion comunes

- **Sistemas empresariales internos**: Session-based + sincronizacion con Redis / Base de datos.
- **SPA moderno + App movil**: Token-based (Access Token + Refresh Token).
- **Microservicios a gran escala**: Token-based (JWT) con verificacion en API Gateway.

---

## 5. Plantilla de respuesta para entrevistas

> "La Session tradicional almacena el estado en el servidor, devuelve un session id en una Cookie, y el navegador lo envia automaticamente en cada solicitud, por lo que es muy adecuado para Web Apps del mismo dominio. La desventaja es que el servidor debe mantener el Session Store, y si hay multiples servidores, se necesita sincronizacion.
> En cambio, Token-based (como JWT) codifica la informacion del usuario en un Token almacenado en el cliente, y el frontend lo incluye manualmente en el Header en cada solicitud. Este enfoque es sin estado, adecuado para SPA y microservicios, y mas facil de escalar.
> En cuanto a seguridad, Session debe preocuparse por CSRF, y Token por XSS. Si necesito hacer integracion entre dominios, dispositivos moviles o multiples servicios, elegiria Token; si es un sistema empresarial tradicional con renderizado del lado del servidor, elegiria Session con httponly Cookie."

---

## 6. Notas de extension para entrevistas

- Session → Enfoque en **proteccion CSRF, estrategia de sincronizacion de Session, cuando limpiar**.
- Token → Enfoque en **ubicacion de almacenamiento (Cookie vs localStorage)**, **mecanismo de Refresh Token**, **lista negra / rotacion de claves**.
- Se puede complementar con la solucion hibrida comun en empresas: almacenar Token en `httpOnly Cookie`, combinandolo tambien con CSRF Token.

---

## 7. Referencias

- [MDN: HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
