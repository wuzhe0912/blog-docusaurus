---
id: http-methods
title: "\U0001F4C4 HTTP Methods"
slug: /http-methods
---

## 1. Que es una RESTful API?

Una RESTful API adopta un estilo de diseno estandarizado que facilita la comunicacion entre diferentes sistemas en la red. Para seguir los principios REST, la API debe ser predecible y facil de entender. Como desarrollador frontend, nos enfocamos principalmente en estos tres puntos:

- **Ruta URL (url path)**: Confirma el alcance de la solicitud del cliente, por ejemplo:
  - `/products`: Puede devolver una lista de productos
  - `/products/abc`: Proporciona los detalles del producto con ID abc
- **Metodos HTTP**: Definen la forma especifica de ejecucion:
  - `GET`: Se usa para obtener datos
  - `POST`: Se usa para crear nuevos datos
  - `PUT`: Se usa para actualizar datos existentes
  - `DELETE`: Se usa para eliminar datos
- **Codigos de estado (status code)**: Proporcionan una indicacion rapida sobre si la solicitud fue exitosa y, si no lo fue, donde podria estar el problema. Los codigos de estado comunes incluyen:
  - `200`: Exito
  - `404`: Recurso solicitado no encontrado
  - `500`: Error del servidor

## 2. Si GET tambien puede enviar datos en una solicitud, por que debemos usar POST?

> Si `GET` tambien puede enviar solicitudes con datos, por que necesitamos usar `POST`?

Se basa principalmente en estas cuatro consideraciones:

1. Seguridad: Los datos de `GET` se adjuntan a la URL, por lo que es facil exponer datos sensibles. `POST` coloca los datos en el `body` de la solicitud, lo que es relativamente mas seguro.
2. Limite de tamano de datos: Al usar `GET`, debido a que los navegadores y servidores tienen limites en la longitud de la URL (aunque varia ligeramente entre navegadores, generalmente ronda los 2048 bytes), la cantidad de datos esta limitada. `POST` nominalmente no tiene limite, pero en la practica, para evitar ataques maliciosos con grandes volumenes de datos, generalmente se limita el tamano a traves de configuraciones de middleware. Por ejemplo, `body-parser` de `express`.
3. Claridad semantica: Asegura que los desarrolladores puedan conocer claramente el proposito de la solicitud. `GET` generalmente se usa para obtener datos, mientras que `POST` es mas adecuado para crear o actualizar datos.
4. Inmutabilidad (Immutability): En el protocolo HTTP, el metodo `GET` esta disenado como "seguro", sin importar cuantas solicitudes se envien, no causara cambios en los datos del servidor.

## 3. Que hace el metodo PUT en HTTP?

> Cual es el proposito del metodo `PUT`?

Tiene principalmente dos usos:

1. Actualizar datos que ya existen (por ejemplo, modificar informacion de un usuario)
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
    console.log('User updated:', response.data); // Mostrar informacion del usuario actualizado
  } catch (error) {
    console.log('Error updating user:', error); // Mostrar informacion del error
  }
}

updateUser(1, 'Pitt Wu');
```
