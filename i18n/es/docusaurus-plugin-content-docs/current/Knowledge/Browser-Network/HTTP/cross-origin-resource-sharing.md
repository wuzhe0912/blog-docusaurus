---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Cual es la diferencia entre JSONP y CORS?

JSONP (JSON with Padding) y CORS (Cross-Origin Resource Sharing) son dos tecnicas para implementar solicitudes de origen cruzado, que permiten a las paginas web solicitar datos desde diferentes dominios (sitios web).

### JSONP

JSONP es una tecnica relativamente antigua utilizada para resolver las restricciones de la politica del mismo origen en sus inicios, permitiendo a las paginas web solicitar datos desde diferentes origenes (dominio, protocolo o puerto). Dado que la carga de etiquetas `<script>` no esta restringida por la politica del mismo origen, JSONP funciona agregando dinamicamente una etiqueta `<script>` que apunta a una URL que devuelve datos JSON. La respuesta de esa URL esta envuelta en una llamada a funcion, y el JavaScript de la pagina web define previamente esta funcion para recibir los datos.

```javascript
// client-side
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// server-side
receiveData({ name: 'PittWu', type: 'player' });
```

Las desventajas son que tiene un mayor riesgo de seguridad (ya que puede ejecutar JavaScript arbitrario) y solo soporta solicitudes GET.

### CORS

CORS es una tecnica mas segura y moderna que JSONP. Utiliza el encabezado HTTP `Access-Control-Allow-Origin` para informar al navegador que la solicitud esta permitida. El servidor configura los encabezados CORS correspondientes para determinar que origenes pueden acceder a sus recursos.

Si el frontend de `http://client.com` quiere acceder a los recursos de `http://api.example.com`, `api.example.com` necesita incluir el siguiente HTTP header en su respuesta:

```http
Access-Control-Allow-Origin: http://client.com
```

O si permite cualquier origen:

```http
Access-Control-Allow-Origin: *
```

CORS puede usarse con cualquier tipo de solicitud HTTP y es una forma estandarizada y segura de realizar solicitudes de origen cruzado.
