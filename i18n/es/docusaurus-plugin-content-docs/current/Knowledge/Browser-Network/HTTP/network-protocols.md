---
id: network-protocols
title: "\U0001F4C4 Protocolos de red"
slug: /network-protocols
---

## 1. Describa TCP, HTTP, HTTPS y WebSocket

1. **TCP (Protocolo de Control de Transmision)**:
   TCP es un protocolo confiable y orientado a conexion, utilizado para transmitir datos de manera confiable entre dos computadoras en Internet. Garantiza el orden y la fiabilidad de los paquetes de datos, lo que significa que sin importar las condiciones de la red, los datos llegaran completos e intactos a su destino.

2. **HTTP (Protocolo de Transferencia de Hipertexto)**:
   HTTP es el protocolo utilizado para transmitir hipertexto (es decir, paginas web). Se construye sobre el protocolo TCP y proporciona una forma de comunicacion entre el navegador y el servidor. HTTP es sin estado (stateless), lo que significa que el servidor no guarda ninguna informacion sobre el usuario.

3. **HTTPS (Protocolo Seguro de Transferencia de Hipertexto)**:
   HTTPS es la version segura de HTTP. Cifra la transmision de datos HTTP a traves del protocolo SSL/TLS, protegiendo la seguridad de los datos intercambiados, previniendo ataques de intermediario y asegurando la privacidad e integridad de los datos.

4. **WebSocket**:
   El protocolo WebSocket proporciona una forma de establecer una conexion persistente entre el cliente y el servidor, permitiendo la transmision de datos bidireccional y en tiempo real despues de establecer la conexion. Esto difiere de las solicitudes HTTP tradicionales, donde cada transmision requiere establecer una nueva conexion. WebSocket es mas adecuado para mensajeria instantanea y aplicaciones que necesitan actualizaciones rapidas de datos.

## 2. Que es el Three Way Handshake?

El apretón de manos de tres vias se refiere al proceso de establecer una conexion entre el servidor y el cliente en una red `TCP/IP`. Durante el proceso, se pasan por tres pasos para confirmar que las capacidades de recepcion y envio de ambas partes son normales, y tambien se utilizan numeros de secuencia iniciales (ISN) para garantizar la sincronizacion y seguridad de los datos.

### TCP Message Type

Antes de entender los pasos, es necesario comprender cual es la funcion principal de cada tipo de mensaje.

| Message | Description                                                     |
| ------- | --------------------------------------------------------------- |
| SYN     | Se usa para iniciar y establecer la conexion, y sincronizar numeros de secuencia |
| ACK     | Se usa para confirmar al otro lado que se recibio el SYN        |
| SYN-ACK | Confirmacion de sincronizacion, envia su propio SYN y un ACK    |
| FIN     | Terminar la conexion                                            |

### Steps

1. El cliente comienza a establecer conexion con el servidor y envia un mensaje SYN, informando al servidor que esta listo para comunicarse y cual es su numero de secuencia.
2. El servidor recibe el mensaje SYN, prepara la respuesta al cliente, agrega +1 al numero de secuencia SYN recibido y lo devuelve mediante ACK, al mismo tiempo envia su propio mensaje SYN.
3. El cliente confirma que el servidor ha respondido, ambas partes han establecido una conexion estable y comienza la transmision de datos.

### Example

Host A envia datos TCP SYN al servidor, que incluyen un numero de secuencia aleatorio. Aqui asumimos que es 1000.

```bash
Host A ===(SYN=1000)===> Server
```

El Server necesita responder al numero de secuencia dado por Host A, por lo que agrega +1 al numero de secuencia y envia su propio SYN.

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Host A recibe el SYN del Server y responde enviando el numero de secuencia de confirmacion, agregando +1 al numero de secuencia del Server.

```bash
Host A ===(ACK=2001)===> Server
```

### Es posible con solo dos apretones de manos?

1. El proposito del apretón de manos de tres vias es confirmar que las capacidades de envio y recepcion tanto del cliente como del servidor son normales. Con solo dos apretones de manos, el servidor no puede determinar la capacidad de recepcion del cliente.
2. Sin el tercer apretón de manos, el cliente no puede recibir el numero de secuencia del servidor, por lo que tampoco puede enviar confirmacion, lo que puede poner en duda la seguridad de los datos.
3. En entornos de red debil, puede haber diferencias en el tiempo de llegada de los datos. Si datos nuevos y antiguos llegan en orden incorrecto, sin la confirmacion SYN del tercer apretón de manos para establecer la conexion, podrian producirse errores de red.

### Que es ISN?

ISN significa Initial Sequence Number, y se usa para informar al receptor cual sera el numero de secuencia al enviar datos. Es un numero de secuencia generado dinamicamente de forma aleatoria, para evitar que un tercero invasor pueda adivinar e falsificar mensajes.

### En que momento del apretón de manos de tres vias comienza la transmision de datos?

El proposito del primer y segundo apretón de manos es confirmar las capacidades de envio y recepcion de ambas partes, por lo que no se pueden transmitir datos. Si fuera posible transmitir datos en el primer apretón de manos, un tercero malicioso podria enviar grandes cantidades de datos falsos, forzando al servidor a consumir espacio de memoria para el almacenamiento en cache, creando una oportunidad de ataque.

Solo en el tercer apretón de manos, cuando ambas partes han completado la confirmacion de sincronizacion y estan en estado de conexion, se permite la transmision de datos.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [Analisis detallado del handshake de tres vias TCP](https://www.eet-china.com/mp/a44399.html)

## 3. Describa el mecanismo de cache HTTP

El mecanismo de cache HTTP es una tecnica en el protocolo HTTP utilizada para almacenar temporalmente (o "cachear") datos de paginas web, con el objetivo de reducir la carga del servidor, disminuir la latencia y mejorar la velocidad de carga de las paginas web. Estas son las principales estrategias de cache:

1. **Cache fuerte (Freshness)**: Mediante los encabezados de respuesta `Expires` o `Cache-Control: max-age`, se indica que los datos pueden considerarse frescos durante un tiempo especifico, y el cliente puede usarlos directamente sin confirmar con el servidor.

2. **Cache de validacion (Validation)**: Usando los encabezados de respuesta `Last-Modified` y `ETag`, el cliente puede enviar una solicitud condicional al servidor. Si los datos no han sido modificados, devuelve el codigo de estado 304 (Not Modified), indicando que se pueden usar los datos de cache local.

3. **Cache de negociacion (Negotiation)**: Esta forma depende del encabezado de respuesta `Vary`. El servidor decide si proporciona diferentes versiones del contenido en cache segun la solicitud del cliente (como `Accept-Language`).

4. **Sin cache (No-store)**: Si se establece `Cache-Control: no-store`, los datos no deben ser cacheados, y cada solicitud debe obtener los datos mas recientes del servidor.

La eleccion de la estrategia de cache se determina segun factores como el tipo de datos y la frecuencia de actualizacion. Una estrategia de cache efectiva puede mejorar significativamente el rendimiento de las aplicaciones web.

### Service Worker

Segun mi experiencia personal, despues de configurar PWA para una Web App, se pueden registrar en el service-worker.js algunos estilos basicos, el logo, e incluso preparar un offline.html para uso sin conexion. De esta manera, incluso si el usuario esta desconectado, a traves de este mecanismo de cache puede conocer el estado actual del sitio web o de la red, manteniendo un cierto nivel de experiencia de uso.
