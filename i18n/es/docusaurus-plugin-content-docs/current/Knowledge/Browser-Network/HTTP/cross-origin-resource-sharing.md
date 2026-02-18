---
id: cross-origin-resource-sharing
title: "📄 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Cuál es la diferencia entre JSONP y CORS?

JSONP (JSON with Padding) y CORS (Cross-Origin Resource Sharing) son dos técnicas para implementar solicitudes de origen cruzado, que permiten a las páginas web solicitar datos desde diferentes dominios (sitios web).

### JSONP

JSONP es una técnica relativamente antigua utilizada para resolver las restricciones de la política del mismo origen en sus inicios, permitiendo a las páginas web solicitar datos desde diferentes orígenes (dominio, protocolo o puerto). Dado que la carga de etiquetas `<script>` no está restringida por la política del mismo origen, JSONP funciona agregando dinámicamente una etiqueta `<script>` que apunta a una URL que devuelve datos JSON. La respuesta de esa URL está envuelta en una llamada a función, y el JavaScript de la página web define previamente esta función para recibir los datos.

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

CORS es una técnica más segura y moderna que JSONP. Utiliza el encabezado HTTP `Access-Control-Allow-Origin` para informar al navegador que la solicitud está permitida. El servidor configura los encabezados CORS correspondientes para determinar qué orígenes pueden acceder a sus recursos.

Si el frontend de `http://client.com` quiere acceder a los recursos de `http://api.example.com`, `api.example.com` necesita incluir el siguiente HTTP header en su respuesta:

```http
Access-Control-Allow-Origin: http://client.com
```

O si permite cualquier origen:

```http
Access-Control-Allow-Origin: *
```

CORS puede usarse con cualquier tipo de solicitud HTTP y es una forma estandarizada y segura de realizar solicitudes de origen cruzado.
