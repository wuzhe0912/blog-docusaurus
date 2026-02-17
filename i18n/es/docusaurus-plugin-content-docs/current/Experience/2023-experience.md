---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Cual es el problema tecnico mas dificil que has resuelto?

### Webauthn

El problema tecnico que maneje recientemente y que era relativamente nuevo con poca experiencia relevante fue la implementacion del inicio de sesion con Webauthn. El equipo de requisitos deseaba que los usuarios pudieran activar el mismo mecanismo de Face ID / Touch ID que en la App al iniciar sesion en el sitio web, para una experiencia de usuario mas fluida.

Materiales de referencia previos a la implementacion:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Tras la confirmacion preliminar de viabilidad, se coordino con el equipo de PM todo el flujo de inicio de sesion y registro, incluyendo si se activa la verificacion biometrica en el primer inicio de sesion y los mecanismos de determinacion. El mayor desafio durante la implementacion fue el ajuste constante de varios parametros de entrada, ya que los materiales de referencia disponibles eran aun muy limitados y el significado de muchos parametros no era claro, quedando solo la opcion de probar continuamente. En cuanto a los dispositivos, los telefonos iOS fueron relativamente faciles de manejar, pero los telefonos Android presentaron el problema de que Touch ID era dificil de activar, requiriendo la asistencia del backend para ajustar algunos parametros de compatibilidad. Tras completar la funcionalidad, en combinacion con PWA que se habia implementado previamente, la pagina web ofrecio una experiencia de uso mas cercana a una App.
