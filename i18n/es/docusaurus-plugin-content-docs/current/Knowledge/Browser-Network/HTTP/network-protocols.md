---
id: network-protocols
title: "📄 Protocolos de red"
slug: /network-protocols
---

## 1. Describa TCP, HTTP, HTTPS y WebSocket

1. **TCP (Protocolo de Control de Transmisión)**:
   TCP es un protocolo confiable y orientado a conexión, utilizado para transmitir datos de manera confiable entre dos computadoras en Internet. Garantiza el orden y la fiabilidad de los paquetes de datos, lo que significa que sin importar las condiciones de la red, los datos llegarán completos e intactos a su destino.

2. **HTTP (Protocolo de Transferencia de Hipertexto)**:
   HTTP es el protocolo utilizado para transmitir hipertexto (es decir, páginas web). Se construye sobre el protocolo TCP y proporciona una forma de comunicación entre el navegador y el servidor. HTTP es sin estado (stateless), lo que significa que el servidor no guarda ninguna información sobre el usuario.

3. **HTTPS (Protocolo Seguro de Transferencia de Hipertexto)**:
   HTTPS es la versión segura de HTTP. Cifra la transmisión de datos HTTP a través del protocolo SSL/TLS, protegiendo la seguridad de los datos intercambiados, previniendo ataques de intermediario y asegurando la privacidad e integridad de los datos.

4. **WebSocket**:
   El protocolo WebSocket proporciona una forma de establecer una conexión persistente entre el cliente y el servidor, permitiendo la transmisión de datos bidireccional y en tiempo real después de establecer la conexión. Esto difiere de las solicitudes HTTP tradicionales, donde cada transmisión requiere establecer una nueva conexión. WebSocket es más adecuado para mensajería instantánea y aplicaciones que necesitan actualizaciones rápidas de datos.

## 2. Qué es el Three Way Handshake?

El apretón de manos de tres vías se refiere al proceso de establecer una conexión entre el servidor y el cliente en una red `TCP/IP`. Durante el proceso, se pasan por tres pasos para confirmar que las capacidades de recepción y envío de ambas partes son normales, y también se utilizan números de secuencia iniciales (ISN) para garantizar la sincronización y seguridad de los datos.

### TCP Message Type

Antes de entender los pasos, es necesario comprender cuál es la función principal de cada tipo de mensaje.

| Message | Description                                                     |
| ------- | --------------------------------------------------------------- |
| SYN     | Se usa para iniciar y establecer la conexión, y sincronizar números de secuencia |
| ACK     | Se usa para confirmar al otro lado que se recibió el SYN        |
| SYN-ACK | Confirmación de sincronización, envía su propio SYN y un ACK    |
| FIN     | Terminar la conexión                                            |

### Steps

1. El cliente comienza a establecer conexión con el servidor y envía un mensaje SYN, informando al servidor que está listo para comunicarse y cuál es su número de secuencia.
2. El servidor recibe el mensaje SYN, prepara la respuesta al cliente, agrega +1 al número de secuencia SYN recibido y lo devuelve mediante ACK, al mismo tiempo envía su propio mensaje SYN.
3. El cliente confirma que el servidor ha respondido, ambas partes han establecido una conexión estable y comienza la transmisión de datos.

### Example

Host A envía datos TCP SYN al servidor, que incluyen un número de secuencia aleatorio. Aquí asumimos que es 1000.

```bash
Host A ===(SYN=1000)===> Server
```

El Server necesita responder al número de secuencia dado por Host A, por lo que agrega +1 al número de secuencia y envía su propio SYN.

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Host A recibe el SYN del Server y responde enviando el número de secuencia de confirmación, agregando +1 al número de secuencia del Server.

```bash
Host A ===(ACK=2001)===> Server
```

### Es posible con solo dos apretones de manos?

1. El propósito del apretón de manos de tres vías es confirmar que las capacidades de envío y recepción tanto del cliente como del servidor son normales. Con solo dos apretones de manos, el servidor no puede determinar la capacidad de recepción del cliente.
2. Sin el tercer apretón de manos, el cliente no puede recibir el número de secuencia del servidor, por lo que tampoco puede enviar confirmación, lo que puede poner en duda la seguridad de los datos.
3. En entornos de red débil, puede haber diferencias en el tiempo de llegada de los datos. Si datos nuevos y antiguos llegan en orden incorrecto, sin la confirmación SYN del tercer apretón de manos para establecer la conexión, podrían producirse errores de red.

### Qué es ISN?

ISN significa Initial Sequence Number, y se usa para informar al receptor cuál será el número de secuencia al enviar datos. Es un número de secuencia generado dinámicamente de forma aleatoria, para evitar que un tercero invasor pueda adivinar e falsificar mensajes.

### En qué momento del apretón de manos de tres vías comienza la transmisión de datos?

El propósito del primer y segundo apretón de manos es confirmar las capacidades de envío y recepción de ambas partes, por lo que no se pueden transmitir datos. Si fuera posible transmitir datos en el primer apretón de manos, un tercero malicioso podría enviar grandes cantidades de datos falsos, forzando al servidor a consumir espacio de memoria para el almacenamiento en caché, creando una oportunidad de ataque.

Solo en el tercer apretón de manos, cuando ambas partes han completado la confirmación de sincronización y están en estado de conexión, se permite la transmisión de datos.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [Análisis detallado del handshake de tres vías TCP](https://www.eet-china.com/mp/a44399.html)

## 3. Describa el mecanismo de caché HTTP

El mecanismo de caché HTTP es una técnica en el protocolo HTTP utilizada para almacenar temporalmente (o "cachear") datos de páginas web, con el objetivo de reducir la carga del servidor, disminuir la latencia y mejorar la velocidad de carga de las páginas web. Estas son las principales estrategias de caché:

1. **Caché fuerte (Freshness)**: Mediante los encabezados de respuesta `Expires` o `Cache-Control: max-age`, se indica que los datos pueden considerarse frescos durante un tiempo específico, y el cliente puede usarlos directamente sin confirmar con el servidor.

2. **Caché de validación (Validation)**: Usando los encabezados de respuesta `Last-Modified` y `ETag`, el cliente puede enviar una solicitud condicional al servidor. Si los datos no han sido modificados, devuelve el código de estado 304 (Not Modified), indicando que se pueden usar los datos de caché local.

3. **Caché de negociación (Negotiation)**: Esta forma depende del encabezado de respuesta `Vary`. El servidor decide si proporciona diferentes versiones del contenido en caché según la solicitud del cliente (como `Accept-Language`).

4. **Sin caché (No-store)**: Si se establece `Cache-Control: no-store`, los datos no deben ser cacheados, y cada solicitud debe obtener los datos más recientes del servidor.

La elección de la estrategia de caché se determina según factores como el tipo de datos y la frecuencia de actualización. Una estrategia de caché efectiva puede mejorar significativamente el rendimiento de las aplicaciones web.

### Service Worker

Según mi experiencia personal, después de configurar PWA para una Web App, se pueden registrar en el service-worker.js algunos estilos básicos, el logo, e incluso preparar un offline.html para uso sin conexión. De esta manera, incluso si el usuario está desconectado, a través de este mecanismo de caché puede conocer el estado actual del sitio web o de la red, manteniendo un cierto nivel de experiencia de uso.
