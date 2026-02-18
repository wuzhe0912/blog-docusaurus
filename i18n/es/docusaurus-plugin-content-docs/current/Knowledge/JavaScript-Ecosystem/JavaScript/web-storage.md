---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparación

| Propiedad | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Ciclo de vida | Se elimina al cerrar la página por defecto, a menos que se establezca un tiempo de expiración (Expires) o tiempo máximo de almacenamiento (Max-Age) | Se elimina al cerrar la página | Se almacena permanentemente hasta que se elimine explícitamente |
| HTTP Request | Sí, se puede enviar al servidor a través del header Cookie | No | No |
| Capacidad total | 4KB | 5MB | 5MB |
| Ámbito de acceso | Entre ventanas/pestañas | Solo la misma pestaña | Entre ventanas/pestañas |
| Seguridad | JavaScript no puede acceder a `HttpOnly cookies` | Ninguna | Ninguna |

## Explicación de términos

> ¿Qué son las Persistent cookies?

Las cookies persistentes son una forma de almacenar datos a largo plazo en el navegador del usuario. La implementación concreta es mediante el establecimiento de un tiempo de expiración como se mencionó anteriormente (`Expires` o `Max-Age`).

## Experiencia personal de implementación

### `cookie`

#### 1. Verificación de seguridad

Algunos proyectos legacy tenían una mala situación de seguridad, con frecuentes problemas de robo de cuentas que elevaron significativamente los costos operativos. Primero se adoptó la librería [Fingerprint](https://fingerprint.com/) (la versión comunitaria tiene una precisión de aproximadamente 60%, la versión de pago ofrece una cuota mensual gratuita de 20,000), identificando a cada usuario que inicia sesión como un visitID único mediante parámetros de dispositivo y ubicación geográfica. Luego, aprovechando la característica de las cookies de enviarse con cada solicitud HTTP, se permitió al backend verificar la situación actual del usuario (cambio de dispositivo o desviación anormal de ubicación). Al detectar anomalías, se forzaba la verificación OTP (email o SMS según los requisitos de la empresa) en el flujo de inicio de sesión.

#### 2. URL de código promocional

Al gestionar sitios web de productos, se proporcionaban frecuentemente estrategias de marketing de afiliados, ofreciendo URLs exclusivas a los promotores colaboradores para facilitar la captación y promoción. Para asegurar que los clientes llegados por captación pertenecieran al rendimiento del promotor, se implementó usando la propiedad `expires` de `cookie`. Desde que el usuario entra al sitio por la captación, durante 24 horas (el tiempo límite puede ser decidido por el operador) el código promocional se mantiene vigente obligatoriamente. Incluso si el usuario elimina intencionalmente el parámetro del código promocional de la URL, al registrarse se obtiene el parámetro correspondiente del `cookie`, expirando automáticamente después de 24 horas.

### `localStorage`

#### 1. Almacenamiento de preferencias del usuario

- Se usa frecuentemente para almacenar las preferencias personales del usuario, como dark mode, configuración de idioma i18n, etc.
- O para almacenar el token de inicio de sesión.
