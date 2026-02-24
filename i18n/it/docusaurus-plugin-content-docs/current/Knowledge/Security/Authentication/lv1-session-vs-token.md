---
id: login-lv1-session-vs-token
title: '[Lv1] Quali Sono le Differenze tra Autenticazione Basata su Session e su Token?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Una domanda di follow-up comune nei colloqui: Conosci le differenze tra Session tradizionale e Token moderno? Padroneggia i seguenti punti chiave per organizzare rapidamente le tue idee.

---

## 1. Concetti Fondamentali dei Due Modelli di Autenticazione

### Autenticazione Basata su Session

- **Lo stato è memorizzato sul server**: Dopo il primo login dell'utente, il server crea una Session in memoria o in un database e restituisce un Session ID memorizzato in un Cookie.
- **Le richieste successive si basano sul Session ID**: Il browser invia automaticamente il Session Cookie per lo stesso dominio, e il server cerca le informazioni utente corrispondenti tramite il Session ID.
- **Comune nelle applicazioni MVC tradizionali / monolitiche**: Il server è responsabile del rendering delle pagine e del mantenimento dello stato utente.

### Autenticazione Basata su Token (es. JWT)

- **Lo stato è memorizzato sul client**: Dopo un login riuscito, viene generato un Token (che può contenere informazioni utente e permessi) e memorizzato dal frontend.
- **Il Token viene inviato con ogni richiesta**: Tipicamente inserito in `Authorization: Bearer <token>`. Il server verifica la firma per recuperare le informazioni utente.
- **Comune in SPA / microservizi**: Il backend deve solo verificare il Token senza memorizzare lo stato utente.

---

## 2. Confronto del Flusso di Richiesta

| Passo           | Basata su Session                                       | Basata su Token (JWT)                                                 |
| --------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login riuscito  | Il server crea la Session, restituisce `Set-Cookie: session_id=...` | Il server emette il Token, restituisce JSON: `{ access_token, expires_in, ... }` |
| Archiviazione   | Cookie del browser (di solito httpOnly)                 | Scelta del frontend: `localStorage`, `sessionStorage`, Cookie, Memory |
| Richieste successive | Il browser invia automaticamente il Cookie; il server cerca le info utente | Il frontend aggiunge manualmente l'header `Authorization`            |
| Verifica        | Interrogazione del Session Store                        | Verifica della firma del Token, o controllo blacklist/whitelist       |
| Logout          | Elimina la Session sul server; restituisce `Set-Cookie` per cancellare il Cookie | Il frontend elimina il Token; l'invalidazione forzata richiede blacklist o rotazione delle chiavi |

---

## 3. Riepilogo Pro e Contro

| Aspetto         | Basata su Session                                                            | Basata su Token (JWT)                                                             |
| --------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Pro             | - Il Cookie viene inviato automaticamente, semplice lato browser<br />- La Session può memorizzare grandi quantità di dati<br />- Facile revocare e forzare il logout | - Stateless, scalabile orizzontalmente<br />- Adatto per SPA, mobile, microservizi<br />- Il Token funziona cross-domain e cross-device |
| Contro          | - Il server deve mantenere il Session Store, consumando memoria<br />- I deployment distribuiti richiedono la sincronizzazione delle Session | - Il Token è più grande, trasmesso con ogni richiesta<br />- Non può essere facilmente revocato; richiede meccanismi di blacklist/rotazione delle chiavi |
| Rischi di Sicurezza | - Vulnerabile ad attacchi CSRF (il Cookie viene inviato automaticamente)<br />- Se il Session ID viene trapelato, deve essere cancellato immediatamente | - Vulnerabile a XSS (se memorizzato in una posizione leggibile)<br />- Se il Token viene rubato prima della scadenza, le richieste possono essere replicate |
| Casi d'Uso      | - Web tradizionale (SSR) + stesso dominio<br />- Pagine renderizzate dal server | - RESTful API / GraphQL<br />- App mobile, SPA, microservizi                      |

---

## 4. Come Scegliere?

### Poniti Tre Domande

1. **Hai bisogno di condividere lo stato di login cross-domain o multi-piattaforma?**
   - Sì → Il Token è più flessibile.
   - No → La Session è più semplice.

2. **Il deployment è multi-server o microservizi?**
   - Sì → Il Token riduce la necessità di replicazione o centralizzazione delle Session.
   - No → La Session è facile e sicura.

3. **Ci sono requisiti di sicurezza elevati (banche, sistemi aziendali)?**
   - Requisiti più alti → Session + httpOnly Cookie + protezione CSRF resta la scelta principale.
   - API leggere o servizi mobile → Token + HTTPS + Refresh Token + strategia di blacklist.

### Strategie di Combinazione Comuni

- **Sistemi interni aziendali**: Session + sincronizzazione Redis / Database.
- **SPA moderna + App Mobile**: Token (Access Token + Refresh Token).
- **Microservizi su larga scala**: Token (JWT) con verifica API Gateway.

---

## 5. Template di Risposta per il Colloquio

> "La Session tradizionale memorizza lo stato sul server e restituisce un session ID in un Cookie. Il browser invia automaticamente il Cookie con ogni richiesta, rendendola adatta per le Web App sullo stesso dominio. Lo svantaggio è che il server deve mantenere un Session Store, e i deployment multi-server richiedono sincronizzazione.
> Al contrario, il Token (es. JWT) codifica le informazioni utente in un Token memorizzato sul client, e il frontend lo include manualmente nell'Header con ogni richiesta. Questo approccio è stateless, rendendolo adatto per SPA e microservizi, e più facile da scalare.
> Per quanto riguarda la sicurezza, la Session deve proteggersi da CSRF, mentre il Token deve fare attenzione a XSS. Se ho bisogno di cross-domain, dispositivi mobili o integrazione multi-servizio, sceglierei il Token. Per i sistemi aziendali tradizionali con rendering lato server, sceglierei la Session con httpOnly Cookie."

---

## 6. Note sui Follow-up del Colloquio

- Session → Concentrarsi su **protezione CSRF, strategie di sincronizzazione delle Session e frequenza di pulizia**.
- Token → Concentrarsi su **posizione di archiviazione (Cookie vs localStorage)**, **meccanismo di Refresh Token** e **blacklist / rotazione delle chiavi**.
- Si può menzionare l'approccio di compromesso comune nelle aziende: memorizzare il Token in un `httpOnly Cookie`, che può anche essere abbinato a un CSRF Token.

---

## 7. Riferimenti

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
