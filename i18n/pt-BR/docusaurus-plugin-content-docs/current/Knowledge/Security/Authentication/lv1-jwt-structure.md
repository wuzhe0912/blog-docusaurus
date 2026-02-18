---
id: login-lv1-jwt-structure
title: '[Lv1] Qual é a estrutura de um JWT?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> O entrevistador costuma perguntar em seguida: "Como e a aparencia de um JWT? Por que foi projetado assim?" Entender a estrutura, o método de codificação e o fluxo de verificação permite responder rapidamente.

---

## 1. Visão geral

JWT (JSON Web Token) é um formato de Token **autocontido (self-contained)**, usado para transmitir informações de forma segura entre duas partes. O conteúdo é composto por três partes de strings, concatenadas com `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Separando, temos três JSONs codificados em Base64URL:

1. **Header**: descreve o algoritmo e o tipo do Token.
2. **Payload**: armazena informações do usuário e claims (declarações).
3. **Signature**: assinatura com chave secreta, garantindo que o conteúdo não foi alterado.

---

## 2. Detalhes de Header, Payload e Signature

### 2.1 Header (Cabeçalho)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: algoritmo de assinatura, por exemplo `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: tipo do Token, geralmente `JWT`.

### 2.2 Payload (Carga útil)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (reservadas oficialmente, mas não obrigatórias)**:
  - `iss` (Issuer): emissor
  - `sub` (Subject): assunto (geralmente o ID do usuário)
  - `aud` (Audience): destinatário
  - `exp` (Expiration Time): tempo de expiração (Unix timestamp, em segundos)
  - `nbf` (Not Before): inválido antes deste momento
  - `iat` (Issued At): momento da emissao
  - `jti` (JWT ID): identificador único do Token
- **Public / Private Claims**: você pode adicionar campos personalizados (como `role`, `permissions`), mas evite torna-los excessivamente longos.

### 2.3 Signature (Assinatura)

Fluxo de geração da assinatura:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Utiliza uma chave secreta (`secret` ou chave privada) para assinar as duas primeiras partes.
- O servidor recalcula a assinatura ao receber o Token. Se coincidir, significa que o Token não foi adulterado e foi emitido por uma fonte legítima.

> Observação: JWT garante apenas a integridade dos dados (Integrity), não a confidencialidade (Confidentiality), a menos que haja criptografia adicional.

---

## 3. O que é a codificação Base64URL?

JWT utiliza **Base64URL** em vez de Base64, com as seguintes diferenças:

- Substitui `+` por `-` e `/` por `_`.
- Remove o `=` final.

A vantagem é que o Token pode ser colocado com segurança em URLs, Cookies ou Headers, sem problemas causados por caracteres especiais.

---

## 4. Diagrama simplificado do fluxo de verificação

1. O cliente inclui no Header `Authorization: Bearer <JWT>`.
2. O servidor ao receber:
   - Analisa o Header e o Payload.
   - Obtem o algoritmo especificado em `alg`.
   - Recalcula a assinatura usando a chave compartilhada ou chave pública.
   - Compara se a assinatura confere e verifica campos de tempo como `exp` e `nbf`.
3. So após a verificação bem-sucedida o conteúdo do Payload pode ser confiável.

---

## 5. Modelo de resposta para entrevista

> "JWT é composto por três partes: Header, Payload e Signature, concatenadas com `.`.
> O Header descreve o algoritmo e o tipo; o Payload armazena informações do usuário e alguns campos padrão, como `iss`, `sub`, `exp`; a Signature usa uma chave secreta para assinar as duas primeiras partes, confirmando que o conteúdo não foi alterado.
> O conteúdo é JSON codificado em Base64URL, mas não é criptografado, apenas codificado, então dados sensíveis não devem ser colocados diretamente nele. O servidor recalcula a assinatura para comparação ao receber o Token. Se for idêntica e não estiver expirado, o Token é válido."

---

## 6. Lembretes para extensão na entrevista

- **Seguranca**: o Payload pode ser decodificado; não coloque senhas, cartoes de crédito ou outras informações sensíveis.
- **Expiracao e renovacao**: geralmente combinado com Access Token de curta duração + Refresh Token de longa duração.
- **Algoritmos de assinatura**: mencione a diferença entre simétricos (HMAC) e assimétricos (RSA, ECDSA).
- **Por que não pode ser infinitamente longo?**: Tokens muito grandes aumentam o custo de transmissão na rede e podem ser rejeitados pelo navegador.

---

## 7. Referencias

- [Site oficial do JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
