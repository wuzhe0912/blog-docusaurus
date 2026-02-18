---
id: login-lv1-jwt-structure
title: '[Lv1] Cuál es la estructura de JWT?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Los entrevistadores suelen preguntar: "Cómo luce un JWT? Por que se diseño así?" Entender la estructura, la codificación y el flujo de verificación te permitira responder rápidamente.

---

## 1. Estructura básica

JWT (JSON Web Token) es un formato de Token **autocontenido (self-contained)** utilizado para transmitir información de forma segura entre dos partes. Se compone de tres cadenas de texto conectadas por `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Al separarlo, son tres JSON codificados en Base64URL:

1. **Header**: Describe el algoritmo y el tipo del Token.
2. **Payload**: Almacena la información del usuario y los claims.
3. **Signature**: Firmado con una clave secreta para asegurar que el contenido no ha sido alterado.

---

## 2. Detalle de Header, Payload y Signature

### 2.1 Header (Encabezado)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: Algoritmo de firma, por ejemplo `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: Tipo de Token, generalmente `JWT`.

### 2.2 Payload (Carga útil)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (Claims reservados oficialmente, no obligatorios)**:
  - `iss` (Issuer): Emisor
  - `sub` (Subject): Sujeto (generalmente el ID del usuario)
  - `aud` (Audience): Destinatario
  - `exp` (Expiration Time): Tiempo de expiración (Unix timestamp, en segundos)
  - `nbf` (Not Before): No válido antes de este tiempo
  - `iat` (Issued At): Tiempo de emisión
  - `jti` (JWT ID): Identificador único del Token
- **Public / Private Claims**: Se pueden agregar campos personalizados (como `role`, `permissions`), pero evitando que sean excesivamente largos.

### 2.3 Signature (Firma)

Proceso de generación de la firma:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Se utiliza una clave secreta (`secret` o clave privada) para firmar las dos primeras partes.
- Cuándo el servidor recibe el Token, recalcula la firma. Si coincide, significa que el Token no ha sido alterado y fue emitido por una fuente legítima.

> Nota: JWT solo garantiza la integridad de los datos (Integrity), no la confidencialidad (Confidentiality), a menos que se aplique cifrado adicional.

---

## 3. Qué es la codificación Base64URL?

JWT usa **Base64URL** en lugar de Base64, con las siguientes diferencias:

- Se reemplaza `+` por `-` y `/` por `_`.
- Se eliminan los `=` finales.

Esto permite que el Token se pueda incluir de forma segura en URLs, Cookies o Headers sin problemas causados por caracteres especiales.

---

## 4. Diagrama del flujo de verificación

1. El cliente incluye `Authorization: Bearer <JWT>` en el Header.
2. El servidor al recibirlo:
   - Parsea el Header y Payload.
   - Obtiene el algoritmo especificado en `alg`.
   - Recalcula la firma usando la clave compartida o clave pública.
   - Compara si la firma coincide y verifica campos temporales como `exp` y `nbf`.
3. Solo después de pasar la verificación se confia en el contenido del Payload.

---

## 5. Marco de respuesta para entrevistas

> "JWT se compone de tres partes: Header, Payload y Signature, conectadas por `.`.
> El Header describe el algoritmo y tipo; el Payload almacena información del usuario y campos estándar como `iss`, `sub`, `exp`; la Signature firma las dos primeras partes con una clave secreta para confirmar que el contenido no ha sido modificado.
> El contenido es JSON codificado en Base64URL, pero no esta cifrado, solo codificado, por lo que no se deben incluir datos sensibles directamente. El servidor recalcula la firma al recibir el Token, y si coincide y no ha expirado, el Token es válido."

---

## 6. Puntos de extensión para entrevistas

- **Seguridad**: El Payload puede ser decodificado, no incluyas contraseñas, tarjetas de crédito u otra información sensible.
- **Expiración y renovación**: Generalmente se combina un Access Token de corta duración con un Refresh Token de larga duración.
- **Algoritmos de firma**: Se puede mencionar la diferencia entre simétricos (HMAC) y asimétricos (RSA, ECDSA).
- **Por que no puede ser infinitamente largo?**: Un Token demasiado grande aumenta el costo de transmisión y puede ser rechazado por el navegador.

---

## 7. Referencias

- [Sitio oficial de JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
