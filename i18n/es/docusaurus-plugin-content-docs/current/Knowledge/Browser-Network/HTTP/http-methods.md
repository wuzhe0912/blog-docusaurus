---
id: http-methods
title: "📄 HTTP Methods"
slug: /http-methods
---

## 1. Qué es una RESTful API?

Una RESTful API adopta un estilo de diseño estandarizado que facilita la comunicación entre diferentes sistemas en la red. Para seguir los principios REST, la API debe ser predecible y fácil de entender. Como desarrollador frontend, nos enfocamos principalmente en estos tres puntos:

- **Ruta URL (url path)**: Confirma el alcance de la solicitud del cliente, por ejemplo:
  - `/products`: Puede devolver una lista de productos
  - `/products/abc`: Proporciona los detalles del producto con ID abc
- **Métodos HTTP**: Definen la forma específica de ejecución:
  - `GET`: Se usa para obtener datos
  - `POST`: Se usa para crear nuevos datos
  - `PUT`: Se usa para actualizar datos existentes
  - `DELETE`: Se usa para eliminar datos
- **Códigos de estado (status code)**: Proporcionan una indicación rápida sobre si la solicitud fue exitosa y, si no lo fue, dónde podría estar el problema. Los códigos de estado comunes incluyen:
  - `200`: Éxito
  - `404`: Recurso solicitado no encontrado
  - `500`: Error del servidor

## 2. Si GET también puede enviar datos en una solicitud, por qué debemos usar POST?

> Si `GET` también puede enviar solicitudes con datos, por qué necesitamos usar `POST`?

Se basa principalmente en estas cuatro consideraciones:

1. Seguridad: Los datos de `GET` se adjuntan a la URL, por lo que es fácil exponer datos sensibles. `POST` coloca los datos en el `body` de la solicitud, lo que es relativamente más seguro.
2. Límite de tamaño de datos: Al usar `GET`, debido a que los navegadores y servidores tienen límites en la longitud de la URL (aunque varía ligeramente entre navegadores, generalmente ronda los 2048 bytes), la cantidad de datos está limitada. `POST` nominalmente no tiene límite, pero en la práctica, para evitar ataques maliciosos con grandes volúmenes de datos, generalmente se limita el tamaño a través de configuraciones de middleware. Por ejemplo, `body-parser` de `express`.
3. Claridad semántica: Asegura que los desarrolladores puedan conocer claramente el propósito de la solicitud. `GET` generalmente se usa para obtener datos, mientras que `POST` es más adecuado para crear o actualizar datos.
4. Inmutabilidad (Immutability): En el protocolo HTTP, el método `GET` está diseñado como "seguro", sin importar cuántas solicitudes se envíen, no causará cambios en los datos del servidor.

## 3. Qué hace el método PUT en HTTP?

> Cuál es el propósito del método `PUT`?

Tiene principalmente dos usos:

1. Actualizar datos que ya existen (por ejemplo, modificar información de un usuario)
2. Si los datos no existen, crear nuevos datos

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // Ejecutar solicitud PUT
    console.log('User updated:', response.data); // Mostrar información del usuario actualizado
  } catch (error) {
    console.log('Error updating user:', error); // Mostrar información del error
  }
}

updateUser(1, 'Pitt Wu');
```
