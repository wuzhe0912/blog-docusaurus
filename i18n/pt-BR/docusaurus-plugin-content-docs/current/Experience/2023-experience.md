---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Qual e o problema tecnico mais dificil que voce ja resolveu?

### Webauthn

O problema tecnico que lidei recentemente e que era relativamente novo com pouca experiencia relevante foi a implementacao do login com Webauthn. A equipe de requisitos desejava que os usuarios pudessem acionar o mesmo mecanismo de Face ID / Touch ID do aplicativo ao fazer login no site, proporcionando uma experiencia de usuario mais suave e fluida.

Materiais de referencia antes da implementacao:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Apos a confirmacao preliminar de viabilidade, foi coordenado com a equipe de PM todo o fluxo de login e registro, incluindo se a verificacao biometrica seria acionada no primeiro login e os mecanismos de determinacao. O maior desafio durante a implementacao foi o ajuste constante de varios parametros de entrada, pois os materiais de referencia disponiveis ainda eram muito limitados e o significado de muitos parametros nao era claro, restando apenas tentar continuamente. Em relacao aos dispositivos, os telefones iOS foram relativamente faceis de lidar, mas os telefones Android apresentaram o problema de que o Touch ID era dificil de acionar, exigindo a assistencia do backend para ajustar alguns parametros de compatibilidade. Apos a conclusao da funcionalidade, em combinacao com o PWA previamente implementado, o site ofereceu uma experiencia de uso mais proxima de um aplicativo.
