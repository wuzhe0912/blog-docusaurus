---
id: login-lv1-jwt-structure
title: '[Lv1] Wie ist ein JWT aufgebaut?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Interviewer fragen häufig: "Wie sieht ein JWT aus? Warum wurde es so designed?" Wenn man die Struktur, die Kodierungsmethode und den Verifizierungsablauf versteht, kann man schnell antworten.

---

## 1. Grundriss

JWT (JSON Web Token) ist ein **selbstenthaltendes (self-contained)** Token-Format, das zum sicheren Austausch von Informationen zwischen zwei Parteien verwendet wird. Der Inhalt besteht aus drei Zeichenketten, die mit `.` verbunden sind:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Aufgeteilt sind es drei Base64URL-kodierte JSON-Objekte:

1. **Header**: beschreibt den Algorithmus und Typ des Tokens.
2. **Payload**: speichert Benutzerinformationen und Claims (Ansprüche).
3. **Signature**: Signatur mit einem geheimen Schlüssel, die sicherstellt, dass der Inhalt nicht verändert wurde.

---

## 2. Header, Payload und Signature im Detail

### 2.1 Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: Signaturalgorithmus, z.B. `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: Token-Typ, üblicherweise `JWT`.

### 2.2 Payload (Nutzlast)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (offiziell reserviert, aber nicht erforderlich)**:
  - `iss` (Issuer): Aussteller
  - `sub` (Subject): Subjekt (normalerweise die Benutzer-ID)
  - `aud` (Audience): Empfänger
  - `exp` (Expiration Time): Ablaufzeit (Unix Timestamp, in Sekunden)
  - `nbf` (Not Before): vor diesem Zeitpunkt ungültig
  - `iat` (Issued At): Ausstellungszeitpunkt
  - `jti` (JWT ID): eindeutige Token-Kennung
- **Public / Private Claims**: Man kann benutzerdefinierte Felder hinzufügen (z.B. `role`, `permissions`), sollte aber übermäßig lange Einträge vermeiden.

### 2.3 Signature (Signatur)

Ablauf der Signaturgenerierung:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Verwendet einen geheimen Schlüssel (`secret` oder privaten Schlüssel), um die ersten beiden Teile zu signieren.
- Der Server berechnet die Signatur beim Empfang des Tokens neu. Stimmt sie überein, wurde der Token nicht manipuliert und stammt von einer legitimen Quelle.

> Hinweis: JWT garantiert nur die Datenintegrität (Integrity), nicht die Vertraulichkeit (Confidentiality), es sei denn, es wird zusätzlich verschlüsselt.

---

## 3. Was ist Base64URL-Kodierung?

JWT verwendet **Base64URL** anstatt Base64, mit folgenden Unterschieden:

- `+` wird durch `-` ersetzt, `/` durch `_`.
- Das abschließende `=` wird entfernt.

Der Vorteil ist, dass der Token sicher in URLs, Cookies oder Headers platziert werden kann, ohne Probleme durch Sonderzeichen.

---

## 4. Vereinfachtes Diagramm des Verifizierungsablaufs

1. Der Client fügt im Header `Authorization: Bearer <JWT>` ein.
2. Der Server nach dem Empfang:
   - Parst Header und Payload.
   - Ermittelt den in `alg` angegebenen Algorithmus.
   - Berechnet die Signatur mit dem gemeinsamen Schlüssel oder öffentlichen Schlüssel neu.
   - Vergleicht, ob die Signaturen übereinstimmen und prüft Zeitfelder wie `exp` und `nbf`.
3. Erst nach erfolgreicher Verifizierung kann dem Payload-Inhalt vertraut werden.

---

## 5. Antwortvorlage für das Interview

> "JWT besteht aus drei Teilen: Header, Payload und Signature, verbunden mit `.`.
> Der Header beschreibt den Algorithmus und Typ; der Payload speichert Benutzerinformationen und einige Standardfelder wie `iss`, `sub`, `exp`; die Signature verwendet einen geheimen Schlüssel, um die ersten beiden Teile zu signieren und zu bestätigen, dass der Inhalt nicht verändert wurde.
> Der Inhalt ist Base64URL-kodiertes JSON, aber nicht verschlüsselt, sondern nur kodiert, daher sollten sensible Daten nicht direkt darin gespeichert werden. Der Server berechnet beim Empfang des Tokens die Signatur neu zum Vergleich. Stimmt sie überein und ist der Token nicht abgelaufen, ist er gültig."

---

## 6. Hinweise für erweiterte Interview-Fragen

- **Sicherheit**: Der Payload kann dekodiert werden; speichern Sie keine Passwörter, Kreditkarten oder andere sensible Informationen.
- **Ablauf und Erneuerung**: Normalerweise kombiniert mit kurzlebigem Access Token + langlebigem Refresh Token.
- **Signaturalgorithmen**: Erwähnen Sie den Unterschied zwischen symmetrisch (HMAC) und asymmetrisch (RSA, ECDSA).
- **Warum kann er nicht unendlich lang sein?**: Zu große Tokens erhöhen die Netzwerkübertragungskosten und können vom Browser abgelehnt werden.

---

## 7. Referenzen

- [JWT offizielle Website](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
