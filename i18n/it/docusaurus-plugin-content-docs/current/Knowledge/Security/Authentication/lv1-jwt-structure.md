---
id: login-lv1-jwt-structure
title: '[Lv1] Qual è la Struttura di JWT?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Gli intervistatori spesso chiedono come follow-up: "Come appare un JWT? Perché è progettato così?" Comprendere la struttura, il metodo di codifica e il flusso di verifica ti aiuterà a rispondere rapidamente.

---

## 1. Panoramica Base

JWT (JSON Web Token) è un formato di token **autocontenuto** utilizzato per trasmettere informazioni in modo sicuro tra due parti. È composto da tre stringhe unite da `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Scomponendolo, si tratta di tre segmenti JSON codificati in Base64URL:

1. **Header**: Descrive l'algoritmo e il tipo utilizzati dal token.
2. **Payload**: Contiene le informazioni dell'utente e i claim.
3. **Signature** (Firma): Firmato con una chiave segreta per garantire che il contenuto non sia stato alterato.

---

## 2. Header, Payload e Signature nel Dettaglio

### 2.1 Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: L'algoritmo di firma, ad es. `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: Il tipo di token, tipicamente `JWT`.

### 2.2 Payload

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Claim Registrati (ufficialmente riservati, ma non obbligatori)**:
  - `iss` (Issuer): L'entità che ha emesso il token
  - `sub` (Subject): Il soggetto (di solito l'ID utente)
  - `aud` (Audience): Il destinatario previsto
  - `exp` (Expiration Time): Tempo di scadenza (timestamp Unix, in secondi)
  - `nbf` (Not Before): Il token non è valido prima di questo momento
  - `iat` (Issued At): Il momento in cui il token è stato emesso
  - `jti` (JWT ID): Un identificatore univoco per il token
- **Claim Pubblici / Privati**: È possibile aggiungere campi personalizzati (ad es. `role`, `permissions`), ma evitare di rendere il payload eccessivamente grande.

### 2.3 Signature (Firma)

Il processo di generazione della firma:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- I primi due segmenti vengono firmati utilizzando una chiave segreta (o chiave privata).
- Quando il server riceve il token, ricalcola la firma. Se corrisponde, conferma che il token non è stato alterato e che è stato emesso da una fonte legittima.

> Nota: JWT garantisce solo l'integrità dei dati, non la riservatezza, a meno che non venga applicata una crittografia aggiuntiva.

---

## 3. Cos'è la Codifica Base64URL?

JWT utilizza **Base64URL** invece di Base64, con le seguenti differenze:

- `+` viene sostituito con `-`, e `/` viene sostituito con `_`.
- Il padding `=` finale viene rimosso.

Questo garantisce che il token possa essere inserito in modo sicuro in URL, Cookie o Header senza problemi causati da caratteri speciali.

---

## 4. Panoramica del Flusso di Verifica

1. Il client include `Authorization: Bearer <JWT>` nell'header della richiesta.
2. Il server riceve il token e:
   - Analizza l'Header e il Payload.
   - Recupera l'algoritmo specificato da `alg`.
   - Ricalcola la firma utilizzando il segreto condiviso o la chiave pubblica.
   - Confronta le firme e controlla i campi temporali come `exp` e `nbf`.
3. Solo dopo che la verifica ha successo il server può considerare attendibile il contenuto del Payload.

---

## 5. Schema di Risposta per il Colloquio

> "JWT è composto da tre parti — Header, Payload e Signature — unite da `.`.
> L'Header descrive l'algoritmo e il tipo; il Payload contiene le informazioni dell'utente e campi standard come `iss`, `sub` e `exp`; la Signature firma le prime due parti con una chiave segreta per verificare che il contenuto non sia stato alterato.
> Il contenuto è JSON codificato in Base64URL, ma non è crittografato — solo codificato. Quindi i dati sensibili non dovrebbero essere inseriti direttamente al suo interno. Quando il server riceve il token, ricalcola la firma per il confronto. Se corrisponde e non è scaduto, il token è considerato valido."

---

## 6. Promemoria per i Follow-up del Colloquio

- **Sicurezza**: Il Payload può essere decodificato — non inserire mai password, numeri di carta di credito o altre informazioni sensibili.
- **Scadenza e Rinnovo**: Tipicamente abbinato a un Access Token a breve durata + un Refresh Token a lunga durata.
- **Algoritmi di Firma**: È possibile menzionare la differenza tra approcci simmetrici (HMAC) e asimmetrici (RSA, ECDSA).
- **Perché non può essere infinitamente lungo?**: Un token sovradimensionato aumenta il costo di trasmissione in rete e può essere rifiutato dal browser.

---

## 7. Riferimenti

- [Sito Ufficiale JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomia di un JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
