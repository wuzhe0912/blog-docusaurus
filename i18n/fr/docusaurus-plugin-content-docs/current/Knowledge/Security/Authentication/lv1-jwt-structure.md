---
id: login-lv1-jwt-structure
title: "[Lv1] Quelle est la structure d'un JWT ?"
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> L'intervieweur enchaîne souvent avec : "À quoi ressemble un JWT ? Pourquoi est-il conçu ainsi ?" Comprendre la structure, l'encodage et le flux de vérification permet de répondre rapidement.

---

## 1. Aperçu général

JWT (JSON Web Token) est un format de Token **auto-contenu (self-contained)** utilisé pour transmettre des informations de manière sécurisée entre deux parties. Son contenu est composé de trois chaînes de caractères reliées par des `.` :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Décomposé, il s'agit de trois blocs JSON encodés en Base64URL :

1. **Header** : décrit l'algorithme et le type du Token.
2. **Payload** : contient les informations utilisateur et les déclarations (claims).
3. **Signature** : signée avec une clé secrète pour garantir que le contenu n'a pas été falsifié.

---

## 2. Header, Payload, Signature en détail

### 2.1 Header (en-tête)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg` : algorithme de signature, par exemple `HS256` (HMAC + SHA-256) ou `RS256` (RSA + SHA-256).
- `typ` : type du Token, généralement `JWT`.

### 2.2 Payload (charge utile)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (réservés par la spécification, mais non obligatoires)** :
  - `iss` (Issuer) : émetteur
  - `sub` (Subject) : sujet (généralement l'ID utilisateur)
  - `aud` (Audience) : destinataire
  - `exp` (Expiration Time) : date d'expiration (Unix timestamp, en secondes)
  - `nbf` (Not Before) : invalide avant cette date
  - `iat` (Issued At) : date d'émission
  - `jti` (JWT ID) : identifiant unique du Token
- **Public / Private Claims** : vous pouvez ajouter des champs personnalisés (par exemple `role`, `permissions`), mais évitez qu'ils soient trop volumineux.

### 2.3 Signature

Processus de génération de la signature :

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- La signature est calculée sur les deux premières parties à l'aide d'une clé secrète (ou d'une clé privée).
- Lorsque le serveur reçoit le Token, il recalcule la signature. Si elle correspond, cela signifie que le Token n'a pas été altéré et qu'il a bien été émis par une source légitime.

> Remarque : le JWT garantit uniquement l'intégrité des données (Integrity), pas la confidentialité (Confidentiality), sauf en cas de chiffrement supplémentaire.

---

## 3. Qu'est-ce que l'encodage Base64URL ?

Le JWT utilise **Base64URL** au lieu de Base64 classique, avec les différences suivantes :

- Le `+` est remplacé par `-`, et le `/` par `_`.
- Les `=` en fin de chaîne sont supprimés.

Cela permet au Token d'être utilisé en toute sécurité dans une URL, un Cookie ou un Header, sans poser de problèmes liés aux caractères spéciaux.

---

## 4. Schéma simplifié du flux de vérification

1. Le client envoie le Token dans le Header : `Authorization: Bearer <JWT>`.
2. Le serveur reçoit le Token et :
   - Parse le Header et le Payload.
   - Identifie l'algorithme spécifié par `alg`.
   - Recalcule la signature avec la clé partagée ou la clé publique.
   - Compare les signatures et vérifie les champs temporels (`exp`, `nbf`, etc.).
3. Ce n'est qu'après vérification réussie que le contenu du Payload peut être considéré comme fiable.

---

## 5. Trame de réponse en entretien

> "Un JWT est composé de trois parties : Header, Payload et Signature, reliées par des `.`.
> Le Header décrit l'algorithme et le type ; le Payload contient les informations utilisateur et certains champs standards comme `iss`, `sub`, `exp` ; la Signature signe les deux premières parties avec une clé secrète pour vérifier que le contenu n'a pas été modifié.
> Le contenu est du JSON encodé en Base64URL, mais il n'est pas chiffré, juste encodé. Les données sensibles ne doivent donc pas y être stockées directement. Le serveur recalcule la signature pour comparaison : si elle correspond et que le Token n'est pas expiré, le Token est valide."

---

## 6. Points à approfondir en entretien

- **Sécurité** : le Payload est décodable, ne jamais y stocker de mots de passe ou de numéros de carte.
- **Expiration et renouvellement** : on utilise généralement un Access Token à courte durée + un Refresh Token à longue durée.
- **Algorithmes de signature** : mentionner la différence entre symétrique (HMAC) et asymétrique (RSA, ECDSA).
- **Pourquoi ne pas faire un Token infini ?** : un Token trop volumineux augmente le coût de transfert réseau et peut être rejeté par le navigateur.

---

## 7. Références

- [Site officiel JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0 : Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
