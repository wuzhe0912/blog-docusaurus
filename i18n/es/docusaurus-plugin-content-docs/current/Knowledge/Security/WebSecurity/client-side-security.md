---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Puedes explicar que es CSP (Content Security Policy)?

> Can you explain what CSP (Content Security Policy) is?

En principio, CSP es un mecanismo para reforzar la seguridad de las paginas web. Permite configurar headers HTTP para restringir las fuentes de datos que el contenido de la pagina puede cargar (lista blanca), previniendo que atacantes maliciosos inyecten scripts maliciosos para robar datos del usuario.

Desde la perspectiva del frontend, para prevenir ataques XSS (Cross-site scripting), generalmente se utilizan frameworks modernos para el desarrollo, ya que proporcionan mecanismos de proteccion basicos. Por ejemplo, JSX de React realiza automaticamente el escape de HTML, mientras que Vue lo hace a traves del binding de datos con `{{ data }}`, realizando simultaneamente el escape automatico de etiquetas HTML.

Aunque el frontend tiene un alcance limitado en este aspecto, aun se pueden realizar algunas optimizaciones:

1. Para formularios que requieren entrada de contenido, se puede validar caracteres especiales para evitar ataques (aunque es dificil prever todos los escenarios), por lo que generalmente se opta por limitar la longitud para controlar el contenido ingresado en el cliente, o restringir el tipo de entrada.
2. Al referenciar enlaces externos, evitar URLs http y usar URLs https.
3. Para sitios web de paginas estaticas, se puede configurar una meta tag para restringir:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: Por defecto, solo permite cargar datos del mismo origen (mismo dominio).
- `img-src https://*`: Solo permite cargar imagenes desde protocolo HTTPS.
- `child-src 'none'`: No permite incrustar recursos externos secundarios, como `<iframe>`.

## 2. Que es un ataque XSS (Cross-site scripting)?

> What is XSS (Cross-site scripting) attack?

XSS, o ataque de scripting entre sitios, se refiere a cuando un atacante inyecta scripts maliciosos que se ejecutan en el navegador del usuario, obteniendo datos sensibles como cookies, o modificando directamente el contenido de la pagina para redirigir al usuario a sitios maliciosos.

### Prevencion de XSS almacenado

Un atacante podria, a traves de comentarios, insertar intencionalmente HTML o scripts maliciosos en la base de datos. Ademas del escape que realiza el backend, los frameworks modernos de frontend como JSX de React o el template `{{ data }}` de Vue tambien ayudan a realizar el escape, reduciendo la probabilidad de ataques XSS.

### Prevencion de XSS reflejado

Evitar usar `innerHTML` para manipular el DOM, ya que permite la ejecucion de etiquetas HTML. Generalmente se recomienda usar `textContent` para las manipulaciones.

### Prevencion de XSS basado en DOM

En principio, debemos evitar que los usuarios inserten HTML directamente en la pagina. Si hay necesidad por el escenario, los frameworks tienen directivas similares para ayudar, como `dangerouslySetInnerHTML` de React y `v-html` de Vue, que intentan prevenir XSS automaticamente. Si se necesita desarrollar con JS nativo, es preferible usar `textContent`, `createElement`, `setAttribute` para manipular el DOM.
