---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Puedes explicar qué es CSP (Content Security Policy)?

> Can you explain what CSP (Content Security Policy) is?

En principio, CSP es un mecanismo para reforzar la seguridad de las páginas web. Permite configurar headers HTTP para restringir las fuentes de datos que el contenido de la página puede cargar (lista blanca), previniendo que atacantes maliciosos inyecten scripts maliciosos para robar datos del usuario.

Desde la perspectiva del frontend, para prevenir ataques XSS (Cross-site scripting), generalmente se utilizan frameworks modernos para el desarrollo, ya que proporcionan mecanismos de protección básicos. Por ejemplo, JSX de React realiza automáticamente el escape de HTML, mientras que Vue lo hace a través del binding de datos con `{{ data }}`, realizando simultaneamente el escape automático de etiquetas HTML.

Aunque el frontend tiene un alcance limitado en este aspecto, aún se pueden realizar algunas optimizaciones:

1. Para formularios que requieren entrada de contenido, se puede validar caracteres especiales para evitar ataques (aunque es difícil prever todos los escenarios), por lo que generalmente se opta por limitar la longitud para controlar el contenido ingresado en el cliente, o restringir el tipo de entrada.
2. Al referenciar enlaces externos, evitar URLs http y usar URLs https.
3. Para sitios web de páginas estáticas, se puede configurar una meta tag para restringir:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: Por defecto, solo permite cargar datos del mismo origen (mismo dominio).
- `img-src https://*`: Solo permite cargar imágenes desde protocolo HTTPS.
- `child-src 'none'`: No permite incrustar recursos externos secundarios, como `<iframe>`.

## 2. Qué es un ataque XSS (Cross-site scripting)?

> What is XSS (Cross-site scripting) attack?

XSS, o ataque de scripting entre sitios, se refiere a cuando un atacante inyecta scripts maliciosos que se ejecutan en el navegador del usuario, obteniendo datos sensibles como cookies, o modificando directamente el contenido de la página para redirigir al usuario a sitios maliciosos.

### Prevención de XSS almacenado

Un atacante podría, a través de comentarios, insertar intencionalmente HTML o scripts maliciosos en la base de datos. Además del escape que realiza el backend, los frameworks modernos de frontend como JSX de React o el template `{{ data }}` de Vue también ayudan a realizar el escape, reduciendo la probabilidad de ataques XSS.

### Prevención de XSS reflejado

Evitar usar `innerHTML` para manipular el DOM, ya que permite la ejecución de etiquetas HTML. Generalmente se recomienda usar `textContent` para las manipulaciones.

### Prevención de XSS basado en DOM

En principio, debemos evitar que los usuarios inserten HTML directamente en la página. Si hay necesidad por el escenario, los frameworks tienen directivas similares para ayudar, como `dangerouslySetInnerHTML` de React y `v-html` de Vue, que intentan prevenir XSS automáticamente. Si se necesita desarrollar con JS nativo, es preferible usar `textContent`, `createElement`, `setAttribute` para manipular el DOM.
