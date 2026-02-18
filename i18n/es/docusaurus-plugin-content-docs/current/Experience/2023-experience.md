---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Cuál es el problema técnico más difícil que has resuelto?

### Webauthn

El problema técnico que maneje recientemente y que era relativamente nuevo con poca experiencia relevante fue la implementación del inicio de sesión con Webauthn. El equipo de requisitos deseaba que los usuarios pudieran activar el mismo mecanismo de Face ID / Touch ID que en la App al iniciar sesión en el sitio web, para una experiencia de usuario más fluida.

Materiales de referencia previos a la implementación:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Tras la confirmación preliminar de viabilidad, se coordino con el equipo de PM todo el flujo de inicio de sesión y registro, incluyendo si se activa la verificación biometrica en el primer inicio de sesión y los mecanismos de determinación. El mayor desafio durante la implementación fue el ajuste constante de varios parametros de entrada, ya que los materiales de referencia disponibles eran aún muy limitados y el significado de muchos parametros no era claro, quedando solo la opcion de probar continuamente. En cuanto a los dispositivos, los telefonos iOS fueron relativamente faciles de manejar, pero los telefonos Android presentaron el problema de que Touch ID era difícil de activar, requiriendo la asistencia del backend para ajustar algunos parametros de compatibilidad. Tras completar la funcionalidad, en combinación con PWA que se habia implementado previamente, la página web ofrecio una experiencia de uso más cercana a una App.
