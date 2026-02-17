---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparacion

| Propiedad | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Ciclo de vida | Se elimina al cerrar la pagina por defecto, a menos que se establezca un tiempo de expiracion (Expires) o tiempo maximo de almacenamiento (Max-Age) | Se elimina al cerrar la pagina | Se almacena permanentemente hasta que se elimine explicitamente |
| HTTP Request | Si, se puede enviar al servidor a traves del header Cookie | No | No |
| Capacidad total | 4KB | 5MB | 5MB |
| Ambito de acceso | Entre ventanas/pestanas | Solo la misma pestana | Entre ventanas/pestanas |
| Seguridad | JavaScript no puede acceder a `HttpOnly cookies` | Ninguna | Ninguna |

## Explicacion de terminos

> ¿Que son las Persistent cookies?

Las cookies persistentes son una forma de almacenar datos a largo plazo en el navegador del usuario. La implementacion concreta es mediante el establecimiento de un tiempo de expiracion como se menciono anteriormente (`Expires` o `Max-Age`).

## Experiencia personal de implementacion

### `cookie`

#### 1. Verificacion de seguridad

Algunos proyectos legacy tenian una mala situacion de seguridad, con frecuentes problemas de robo de cuentas que elevaron significativamente los costos operativos. Primero se adopto la libreria [Fingerprint](https://fingerprint.com/) (la version comunitaria tiene una precision de aproximadamente 60%, la version de pago ofrece una cuota mensual gratuita de 20,000), identificando a cada usuario que inicia sesion como un visitID unico mediante parametros de dispositivo y ubicacion geografica. Luego, aprovechando la caracteristica de las cookies de enviarse con cada solicitud HTTP, se permitio al backend verificar la situacion actual del usuario (cambio de dispositivo o desviacion anormal de ubicacion). Al detectar anomalias, se forzaba la verificacion OTP (email o SMS segun los requisitos de la empresa) en el flujo de inicio de sesion.

#### 2. URL de codigo promocional

Al gestionar sitios web de productos, se proporcionaban frecuentemente estrategias de marketing de afiliados, ofreciendo URLs exclusivas a los promotores colaboradores para facilitar la captacion y promocion. Para asegurar que los clientes llegados por captacion pertenecieran al rendimiento del promotor, se implemento usando la propiedad `expires` de `cookie`. Desde que el usuario entra al sitio por la captacion, durante 24 horas (el tiempo limite puede ser decidido por el operador) el codigo promocional se mantiene vigente obligatoriamente. Incluso si el usuario elimina intencionalmente el parametro del codigo promocional de la URL, al registrarse se obtiene el parametro correspondiente del `cookie`, expirando automaticamente despues de 24 horas.

### `localStorage`

#### 1. Almacenamiento de preferencias del usuario

- Se usa frecuentemente para almacenar las preferencias personales del usuario, como dark mode, configuracion de idioma i18n, etc.
- O para almacenar el token de inicio de sesion.
