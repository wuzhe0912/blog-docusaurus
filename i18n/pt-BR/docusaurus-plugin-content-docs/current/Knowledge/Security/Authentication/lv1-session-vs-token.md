---
id: login-lv1-session-vs-token
title: '[Lv1] Qual e a diferenca entre Session-based e Token-based?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Uma pergunta de acompanhamento comum em entrevistas: voce conhece a diferenca entre Session tradicional e Token moderno? Domine os pontos a seguir para organizar rapidamente suas ideias.

---

## 1. Conceitos centrais dos dois modelos de autenticacao

### Session-based Authentication

- **Estado salvo no servidor**: apos o primeiro login do usuario, o servidor cria uma Session na memoria ou banco de dados e retorna um Session ID armazenado em um Cookie.
- **Requisicoes subsequentes dependem do Session ID**: o navegador envia automaticamente o Session Cookie no mesmo dominio; o servidor encontra as informacoes do usuario com base no Session ID.
- **Comum em aplicacoes MVC / monoliticas tradicionais**: o servidor e responsavel por renderizar as paginas e manter o estado do usuario.

### Token-based Authentication (ex: JWT)

- **Estado salvo no cliente**: apos login bem-sucedido, um Token e gerado (contendo informacoes e permissoes do usuario) e armazenado pelo front-end.
- **Cada requisicao inclui o Token**: geralmente no `Authorization: Bearer <token>`; o servidor verifica a assinatura para obter as informacoes do usuario.
- **Comum em SPA / microsservicos**: o back-end so precisa verificar o Token, sem precisar armazenar o estado do usuario.

---

## 2. Comparacao do fluxo de requisicao

| Etapa do fluxo | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login bem-sucedido | Servidor cria Session, retorna `Set-Cookie: session_id=...` | Servidor emite Token, retorna JSON: `{ access_token, expires_in, ... }` |
| Local de armazenamento | Cookie do navegador (geralmente httponly)             | Escolha do front-end: `localStorage`, `sessionStorage`, Cookie, Memory |
| Requisicoes subsequentes | Navegador envia Cookie automaticamente, servidor consulta informacoes do usuario | Front-end inclui manualmente `Authorization` no Header               |
| Metodo de verificacao | Consulta ao Session Store                              | Verificacao da assinatura do Token, ou comparacao com blacklist/whitelist |
| Logout | Deleta Session no servidor, retorna `Set-Cookie` para limpar Cookie | Front-end deleta Token; para invalidacao forcada, registrar em blacklist ou rotacionar chaves |

---

## 3. Resumo de vantagens e desvantagens

| Aspecto    | Session-based                                                                 | Token-based (JWT)                                                                 |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Vantagens  | - Cookie enviado automaticamente, simples no navegador<br />- Session pode armazenar grande volume de dados<br />- Facil revogacao e logout forcado | - Stateless, escalavel horizontalmente<br />- Adequado para SPA, dispositivos moveis, microsservicos<br />- Token pode ser usado entre dominios e dispositivos |
| Desvantagens | - Servidor precisa manter Session Store, consome memoria<br />- Deploy distribuido requer sincronizacao de Session | - Token tem tamanho maior, transmitido em cada requisicao<br />- Dificil de revogar, requer blacklist / rotacao de chaves |
| Riscos de seguranca | - Vulneravel a ataques CSRF (Cookie e enviado automaticamente)<br />- Se o Session ID vazar, deve ser limpo imediatamente | - Vulneravel a XSS (se armazenado em local acessivel)<br />- Se Token for roubado antes de expirar, requisicoes podem ser repetidas |
| Cenarios de uso | - Web tradicional (SSR) + mesmo dominio<br />- Servidor responsavel por renderizar paginas | - RESTful API / GraphQL<br />- Apps moveis, SPA, microsservicos |

---

## 4. Como escolher?

### Faca a si mesmo tres perguntas

1. **E necessario compartilhar estado de login entre dominios ou multiplas plataformas?**
   - Sim -> Token-based e mais flexivel.
   - Nao -> Session-based e mais simples.

2. **O deploy e em multiplos servidores ou microsservicos?**
   - Sim -> Token-based reduz a necessidade de replicacao ou centralizacao de Session.
   - Nao -> Session-based e facil e seguro.

3. **Existem requisitos de alta seguranca (bancos, sistemas corporativos)?**
   - Requisitos mais altos -> Session-based + httponly Cookie + protecao CSRF ainda e mainstream.
   - APIs leves ou servicos moveis -> Token-based + HTTPS + Refresh Token + estrategia de blacklist.

### Estrategias de combinacao comuns

- **Sistemas corporativos internos**: Session-based + sincronizacao via Redis / Database.
- **SPA moderna + App movel**: Token-based (Access Token + Refresh Token).
- **Microsservicos de grande escala**: Token-based (JWT) com verificacao via API Gateway.

---

## 5. Modelo de resposta para entrevista

> "Session tradicional armazena o estado no servidor, retorna um session id no Cookie, e o navegador envia automaticamente o Cookie em cada requisicao, sendo ideal para Web Apps no mesmo dominio. A desvantagem e que o servidor precisa manter um Session Store, e com multiplos servidores e necessario sincronizar.
> Ja o Token-based (como JWT) codifica as informacoes do usuario em um Token armazenado no cliente, e o front-end inclui manualmente no Header em cada requisicao. Esse metodo e stateless, ideal para SPA e microsservicos, e mais facil de escalar.
> Em termos de seguranca, Session deve se preocupar com CSRF, Token deve se preocupar com XSS. Se eu precisar de cross-domain, dispositivos moveis ou integracao de multiplos servicos, escolheria Token; se for um sistema corporativo tradicional com renderizacao no servidor, escolheria Session com httponly Cookie."

---

## 6. Lembretes de extensao para entrevista

- Session -> foco em **protecao contra CSRF, estrategia de sincronizacao de Session, tempo de limpeza**.
- Token -> foco em **local de armazenamento (Cookie vs localStorage)**, **mecanismo de Refresh Token**, **blacklist / rotacao de chaves**.
- Pode-se complementar com a abordagem hibrida comum em empresas: armazenar Token em `httpOnly Cookie`, que tambem pode incluir CSRF Token.

---

## 7. Referencias

- [MDN: HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
