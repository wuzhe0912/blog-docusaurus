---
id: login-lv1-session-vs-token
title: '[Lv1] Was ist der Unterschied zwischen Session-based und Token-based?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Eine haeufige Nachfrage im Interview: Kennen Sie den Unterschied zwischen traditioneller Session und modernem Token? Beherrschen Sie die folgenden Punkte, um Ihre Gedanken schnell zu ordnen.

---

## 1. Kernkonzepte der zwei Authentifizierungsmodelle

### Session-based Authentication

- **Zustand wird auf dem Server gespeichert**: Nach dem ersten Login erstellt der Server eine Session im Speicher oder in der Datenbank und gibt eine Session ID als Cookie zurueck.
- **Nachfolgende Anfragen haengen von der Session ID ab**: Der Browser sendet automatisch das Session Cookie in derselben Domain; der Server findet die Benutzerinformationen anhand der Session ID.
- **Ueblich bei traditionellen MVC / monolithischen Anwendungen**: Der Server ist fuer das Rendern der Seiten und die Zustandsverwaltung zustaendig.

### Token-based Authentication (z.B. JWT)

- **Zustand wird beim Client gespeichert**: Nach erfolgreichem Login wird ein Token generiert (mit Benutzerinformationen und Berechtigungen), der vom Front-end gespeichert wird.
- **Jede Anfrage enthaelt den Token**: Normalerweise in `Authorization: Bearer <token>`; der Server verifiziert die Signatur, um die Benutzerinformationen zu erhalten.
- **Ueblich bei SPA / Microservices**: Das Backend muss nur den Token verifizieren, ohne den Benutzerzustand zu speichern.

---

## 2. Vergleich des Anfrageablaufs

| Ablaufschritt | Session-based                                           | Token-based (JWT)                                                     |
| ------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Erfolgreicher Login | Server erstellt Session, gibt `Set-Cookie: session_id=...` zurueck | Server stellt Token aus, gibt JSON zurueck: `{ access_token, expires_in, ... }` |
| Speicherort | Browser Cookie (normalerweise httponly)                  | Front-end waehlt: `localStorage`, `sessionStorage`, Cookie, Memory     |
| Nachfolgende Anfragen | Browser sendet Cookie automatisch, Server sucht Benutzerinformationen | Front-end fuegt manuell `Authorization` im Header ein                |
| Verifizierungsmethode | Abfrage des Session Store                              | Verifizierung der Token-Signatur oder Abgleich mit Blacklist/Whitelist |
| Logout | Server-Session loeschen, `Set-Cookie` zum Loeschen des Cookies zurueckgeben | Front-end loescht Token; fuer erzwungene Invalidierung muss in Blacklist eingetragen oder Schluessel rotiert werden |

---

## 3. Zusammenfassung der Vor- und Nachteile

| Aspekt | Session-based                                                                 | Token-based (JWT)                                                                 |
| ------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Vorteile | - Cookie wird automatisch gesendet, einfach im Browser<br />- Session kann große Datenmengen speichern<br />- Einfacher Widerruf und erzwungener Logout | - Zustandslos, horizontal skalierbar<br />- Geeignet fuer SPA, mobile Geraete, Microservices<br />- Token kann domainuebergreifend und geraeteuebergreifend verwendet werden |
| Nachteile | - Server muss Session Store pflegen, verbraucht Speicher<br />- Verteiltes Deployment erfordert Session-Synchronisation | - Token hat groesseres Volumen, wird bei jeder Anfrage uebertragen<br />- Schwer widerrufbar, erfordert Blacklist / Schluesselrotation |
| Sicherheitsrisiken | - Anfaellig fuer CSRF-Angriffe (Cookie wird automatisch gesendet)<br />- Bei Session ID-Leak sofortige Bereinigung erforderlich | - Anfaellig fuer XSS (wenn an lesbarem Ort gespeichert)<br />- Gestohlener Token kann vor Ablauf fuer Replay-Angriffe genutzt werden |
| Einsatzszenarien | - Traditionelles Web (SSR) + gleiche Domain<br />- Server rendert Seiten | - RESTful API / GraphQL<br />- Mobile Apps, SPA, Microservices |

---

## 4. Wie waehlen?

### Stellen Sie sich drei Fragen

1. **Muss der Login-Zustand domainuebergreifend oder auf mehreren Plattformen geteilt werden?**
   - Ja -> Token-based ist flexibler.
   - Nein -> Session-based ist einfacher.

2. **Wird auf mehreren Servern oder als Microservices deployed?**
   - Ja -> Token-based reduziert den Bedarf an Session-Replikation oder -Zentralisierung.
   - Nein -> Session-based ist einfach und sicher.

3. **Gibt es hohe Sicherheitsanforderungen (Banken, Unternehmenssysteme)?**
   - Hoehere Anforderungen -> Session-based + httponly Cookie + CSRF-Schutz ist weiterhin Mainstream.
   - Leichte APIs oder mobile Dienste -> Token-based + HTTPS + Refresh Token + Blacklist-Strategie.

### Gaengige Kombinationsstrategien

- **Interne Unternehmenssysteme**: Session-based + Synchronisation ueber Redis / Datenbank.
- **Moderne SPA + Mobile App**: Token-based (Access Token + Refresh Token).
- **Große Microservice-Systeme**: Token-based (JWT) mit Verifizierung ueber API Gateway.

---

## 5. Interview-Antwortvorlage

> "Traditionelle Session speichert den Zustand auf dem Server, gibt eine Session ID als Cookie zurueck, und der Browser sendet das Cookie automatisch bei jeder Anfrage, was gut fuer Web Apps in derselben Domain geeignet ist. Der Nachteil ist, dass der Server einen Session Store pflegen muss, und bei mehreren Servern eine Synchronisation noetig ist.
> Im Gegensatz dazu kodiert Token-based (z.B. JWT) die Benutzerinformationen in einen Token auf dem Client, und das Front-end fuegt ihn manuell im Header ein. Diese Methode ist zustandslos, ideal fuer SPA und Microservices, und laesst sich leichter skalieren.
> Hinsichtlich der Sicherheit muss man bei Session auf CSRF achten, bei Token auf XSS. Wenn ich domainuebergreifend, mobile Geraete oder Multi-Service-Integration braeuchte, wuerde ich Token waehlen; bei traditionellen Unternehmenssystemen mit serverseitigem Rendering wuerde ich Session mit httponly Cookie waehlen."

---

## 6. Erweiterungshinweise fuers Interview

- Session -> Fokus auf **CSRF-Schutz, Session-Synchronisierungsstrategie, Bereinigungsintervall**.
- Token -> Fokus auf **Speicherort (Cookie vs localStorage)**, **Refresh Token-Mechanismus**, **Blacklist / Schluesselrotation**.
- Man kann den gaengigen Unternehmenskompromiss ergaenzen: Token in `httpOnly Cookie` speichern, was auch mit CSRF Token kombiniert werden kann.

---

## 7. Referenzen

- [MDN: HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
