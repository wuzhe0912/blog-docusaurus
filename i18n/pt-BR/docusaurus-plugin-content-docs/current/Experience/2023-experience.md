---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Qual é o problema técnico mais difícil que você já resolveu?

### Webauthn

O problema técnico que lidei recentemente e que era relativamente novo com pouca experiência relevante foi a implementação do login com Webauthn. A equipe de requisitos desejava que os usuários pudessem acionar o mesmo mecanismo de Face ID / Touch ID do aplicativo ao fazer login no site, proporcionando uma experiência de usuário mais suave e fluida.

Materiais de referência antes da implementação:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Após a confirmação preliminar de viabilidade, foi coordenado com a equipe de PM todo o fluxo de login e registro, incluindo se a verificação biométrica seria acionada no primeiro login e os mecanismos de determinação. O maior desafio durante a implementação foi o ajuste constante de vários parâmetros de entrada, pois os materiais de referência disponíveis ainda eram muito limitados e o significado de muitos parâmetros não era claro, restando apenas tentar continuamente. Em relação aos dispositivos, os telefones iOS foram relativamente fáceis de lidar, mas os telefones Android apresentaram o problema de que o Touch ID era difícil de acionar, exigindo a assistência do backend para ajustar alguns parâmetros de compatibilidade. Após a conclusão da funcionalidade, em combinação com o PWA previamente implementado, o site ofereceu uma experiência de uso mais próxima de um aplicativo.
