---
id: login-lv1-jwt-structure
title: '[Lv1] Qual e a estrutura de um JWT?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> O entrevistador costuma perguntar em seguida: "Como e a aparencia de um JWT? Por que foi projetado assim?" Entender a estrutura, o metodo de codificacao e o fluxo de verificacao permite responder rapidamente.

---

## 1. Visao geral

JWT (JSON Web Token) e um formato de Token **autocontido (self-contained)**, usado para transmitir informacoes de forma segura entre duas partes. O conteudo e composto por tres partes de strings, concatenadas com `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Separando, temos tres JSONs codificados em Base64URL:

1. **Header**: descreve o algoritmo e o tipo do Token.
2. **Payload**: armazena informacoes do usuario e claims (declaracoes).
3. **Signature**: assinatura com chave secreta, garantindo que o conteudo nao foi alterado.

---

## 2. Detalhes de Header, Payload e Signature

### 2.1 Header (Cabecalho)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: algoritmo de assinatura, por exemplo `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: tipo do Token, geralmente `JWT`.

### 2.2 Payload (Carga util)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (reservadas oficialmente, mas nao obrigatorias)**:
  - `iss` (Issuer): emissor
  - `sub` (Subject): assunto (geralmente o ID do usuario)
  - `aud` (Audience): destinatario
  - `exp` (Expiration Time): tempo de expiracao (Unix timestamp, em segundos)
  - `nbf` (Not Before): invalido antes deste momento
  - `iat` (Issued At): momento da emissao
  - `jti` (JWT ID): identificador unico do Token
- **Public / Private Claims**: voce pode adicionar campos personalizados (como `role`, `permissions`), mas evite torna-los excessivamente longos.

### 2.3 Signature (Assinatura)

Fluxo de geracao da assinatura:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Utiliza uma chave secreta (`secret` ou chave privada) para assinar as duas primeiras partes.
- O servidor recalcula a assinatura ao receber o Token. Se coincidir, significa que o Token nao foi adulterado e foi emitido por uma fonte legitima.

> Observacao: JWT garante apenas a integridade dos dados (Integrity), nao a confidencialidade (Confidentiality), a menos que haja criptografia adicional.

---

## 3. O que e a codificacao Base64URL?

JWT utiliza **Base64URL** em vez de Base64, com as seguintes diferencas:

- Substitui `+` por `-` e `/` por `_`.
- Remove o `=` final.

A vantagem e que o Token pode ser colocado com seguranca em URLs, Cookies ou Headers, sem problemas causados por caracteres especiais.

---

## 4. Diagrama simplificado do fluxo de verificacao

1. O cliente inclui no Header `Authorization: Bearer <JWT>`.
2. O servidor ao receber:
   - Analisa o Header e o Payload.
   - Obtem o algoritmo especificado em `alg`.
   - Recalcula a assinatura usando a chave compartilhada ou chave publica.
   - Compara se a assinatura confere e verifica campos de tempo como `exp` e `nbf`.
3. So apos a verificacao bem-sucedida o conteudo do Payload pode ser confiavel.

---

## 5. Modelo de resposta para entrevista

> "JWT e composto por tres partes: Header, Payload e Signature, concatenadas com `.`.
> O Header descreve o algoritmo e o tipo; o Payload armazena informacoes do usuario e alguns campos padrao, como `iss`, `sub`, `exp`; a Signature usa uma chave secreta para assinar as duas primeiras partes, confirmando que o conteudo nao foi alterado.
> O conteudo e JSON codificado em Base64URL, mas nao e criptografado, apenas codificado, entao dados sensiveis nao devem ser colocados diretamente nele. O servidor recalcula a assinatura para comparacao ao receber o Token. Se for identica e nao estiver expirado, o Token e valido."

---

## 6. Lembretes para extensao na entrevista

- **Seguranca**: o Payload pode ser decodificado; nao coloque senhas, cartoes de credito ou outras informacoes sensiveis.
- **Expiracao e renovacao**: geralmente combinado com Access Token de curta duracao + Refresh Token de longa duracao.
- **Algoritmos de assinatura**: mencione a diferenca entre simetricos (HMAC) e assimetricos (RSA, ECDSA).
- **Por que nao pode ser infinitamente longo?**: Tokens muito grandes aumentam o custo de transmissao na rede e podem ser rejeitados pelo navegador.

---

## 7. Referencias

- [Site oficial do JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
