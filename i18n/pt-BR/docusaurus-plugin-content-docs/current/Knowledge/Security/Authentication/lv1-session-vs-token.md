---
id: login-lv1-session-vs-token
title: '[Lv1] Qual é a diferença entre Session-based e Token-based?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Uma pergunta de acompanhamento comum em entrevistas: você conhece a diferença entre Session tradicional e Token moderno? Domine os pontos a seguir para organizar rapidamente suas ideias.

---

## 1. Conceitos centrais dos dois modelos de autenticação

### Session-based Authentication

- **Estado salvo no servidor**: após o primeiro login do usuário, o servidor cria uma Session na memória ou banco de dados e retorna um Session ID armazenado em um Cookie.
- **Requisicoes subsequentes dependem do Session ID**: o navegador envia automaticamente o Session Cookie no mesmo domínio; o servidor encontra as informações do usuário com base no Session ID.
- **Comum em aplicações MVC / monoliticas tradicionais**: o servidor é responsável por renderizar as páginas e manter o estado do usuário.

### Token-based Authentication (ex: JWT)

- **Estado salvo no cliente**: após login bem-sucedido, um Token é gerado (contendo informações e permissões do usuário) é armazenado pelo front-end.
- **Cada requisição inclui o Token**: geralmente no `Authorization: Bearer <token>`; o servidor verifica a assinatura para obter as informações do usuário.
- **Comum em SPA / microsservicos**: o back-end so precisa verificar o Token, sem precisar armazenar o estado do usuário.

---

## 2. Comparação do fluxo de requisição

| Etapa do fluxo | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login bem-sucedido | Servidor cria Session, retorna `Set-Cookie: session_id=...` | Servidor emite Token, retorna JSON: `{ access_token, expires_in, ... }` |
| Local de armazenamento | Cookie do navegador (geralmente httponly)             | Escolha do front-end: `localStorage`, `sessionStorage`, Cookie, Memory |
| Requisicoes subsequentes | Navegador envia Cookie automaticamente, servidor consulta informações do usuário | Front-end inclui manualmente `Authorization` no Header               |
| Método de verificação | Consulta ao Session Store                              | Verificação da assinatura do Token, ou comparação com blacklist/whitelist |
| Logout | Deleta Session no servidor, retorna `Set-Cookie` para limpar Cookie | Front-end deleta Token; para invalidação forçada, registrar em blacklist ou rotacionar chaves |

---

## 3. Resumo de vantagens e desvantagens

| Aspecto    | Session-based                                                                 | Token-based (JWT)                                                                 |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Vantagens  | - Cookie enviado automaticamente, simples no navegador<br />- Session pode armazenar grande volume de dados<br />- Facil revogação e logout forçado | - Stateless, escalável horizontalmente<br />- Adequado para SPA, dispositivos móveis, microsservicos<br />- Token pode ser usado entre domínios e dispositivos |
| Desvantagens | - Servidor precisa manter Session Store, consome memória<br />- Deploy distribuído requer sincronização de Session | - Token tem tamanho maior, transmitido em cada requisição<br />- Dificil de revogar, requer blacklist / rotação de chaves |
| Riscos de segurança | - Vulneravel a ataques CSRF (Cookie é enviado automaticamente)<br />- Se o Session ID vazar, deve ser limpo imediatamente | - Vulneravel a XSS (se armazenado em local acessível)<br />- Se Token for roubado antes de expirar, requisições podem ser repetidas |
| Cenários de uso | - Web tradicional (SSR) + mesmo domínio<br />- Servidor responsável por renderizar páginas | - RESTful API / GraphQL<br />- Apps móveis, SPA, microsservicos |

---

## 4. Como escolher?

### Faca a si mesmo três perguntas

1. **É necessário compartilhar estado de login entre domínios ou múltiplas plataformas?**
   - Sim -> Token-based é mais flexível.
   - Não -> Session-based é mais simples.

2. **O deploy e em múltiplos servidores ou microsservicos?**
   - Sim -> Token-based reduz a necessidade de replicação ou centralizacao de Session.
   - Não -> Session-based é fácil e seguro.

3. **Existem requisitos de alta segurança (bancos, sistemas corporativos)?**
   - Requisitos mais altos -> Session-based + httponly Cookie + proteção CSRF ainda é mainstream.
   - APIs leves ou serviços móveis -> Token-based + HTTPS + Refresh Token + estratégia de blacklist.

### Estratégias de combinação comuns

- **Sistemas corporativos internos**: Session-based + sincronização via Redis / Database.
- **SPA moderna + App móvel**: Token-based (Access Token + Refresh Token).
- **Microsservicos de grande escala**: Token-based (JWT) com verificação via API Gateway.

---

## 5. Modelo de resposta para entrevista

> "Session tradicional armazena o estado no servidor, retorna um session id no Cookie, e o navegador envia automaticamente o Cookie em cada requisição, sendo ideal para Web Apps no mesmo domínio. A desvantagem é que o servidor precisa manter um Session Store, e com múltiplos servidores é necessário sincronizar.
> Já o Token-based (como JWT) codifica as informações do usuário em um Token armazenado no cliente, e o front-end inclui manualmente no Header em cada requisição. Esse método é stateless, ideal para SPA e microsservicos, é mais fácil de escalar.
> Em termos de segurança, Session deve se preocupar com CSRF, Token deve se preocupar com XSS. Se eu precisar de cross-domain, dispositivos móveis ou integração de múltiplos serviços, escolheria Token; se for um sistema corporativo tradicional com renderizacao no servidor, escolheria Session com httponly Cookie."

---

## 6. Lembretes de extensão para entrevista

- Session -> foco em **proteção contra CSRF, estratégia de sincronização de Session, tempo de limpeza**.
- Token -> foco em **local de armazenamento (Cookie vs localStorage)**, **mecanismo de Refresh Token**, **blacklist / rotação de chaves**.
- Pode-se complementar com a abordagem híbrida comum em empresas: armazenar Token em `httpOnly Cookie`, que também pode incluir CSRF Token.

---

## 7. Referencias

- [MDN: HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
