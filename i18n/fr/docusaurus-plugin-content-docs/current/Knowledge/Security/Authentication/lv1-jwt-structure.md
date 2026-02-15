---
id: login-lv1-jwt-structure
title: "[Lv1] Quelle est la structure d'un JWT ?"
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> L'intervieweur enchaine souvent avec : "A quoi ressemble un JWT ? Pourquoi est-il concu ainsi ?" Comprendre la structure, l'encodage et le flux de verification permet de repondre rapidement.

---

## 1. Apercu general

JWT (JSON Web Token) est un format de Token **auto-contenu (self-contained)** utilise pour transmettre des informations de maniere securisee entre deux parties. Son contenu est compose de trois chaines de caracteres reliees par des `.` :

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Decompose, il s'agit de trois blocs JSON encodes en Base64URL :

1. **Header** : decrit l'algorithme et le type du Token.
2. **Payload** : contient les informations utilisateur et les declarations (claims).
3. **Signature** : signee avec une cle secrete pour garantir que le contenu n'a pas ete falsifie.

---

## 2. Header, Payload, Signature en detail

### 2.1 Header (en-tete)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg` : algorithme de signature, par exemple `HS256` (HMAC + SHA-256) ou `RS256` (RSA + SHA-256).
- `typ` : type du Token, generalement `JWT`.

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

- **Registered Claims (reserves par la specification, mais non obligatoires)** :
  - `iss` (Issuer) : emetteur
  - `sub` (Subject) : sujet (generalement l'ID utilisateur)
  - `aud` (Audience) : destinataire
  - `exp` (Expiration Time) : date d'expiration (Unix timestamp, en secondes)
  - `nbf` (Not Before) : invalide avant cette date
  - `iat` (Issued At) : date d'emission
  - `jti` (JWT ID) : identifiant unique du Token
- **Public / Private Claims** : vous pouvez ajouter des champs personnalises (par exemple `role`, `permissions`), mais evitez qu'ils soient trop volumineux.

### 2.3 Signature

Processus de generation de la signature :

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- La signature est calculee sur les deux premieres parties a l'aide d'une cle secrete (ou d'une cle privee).
- Lorsque le serveur recoit le Token, il recalcule la signature. Si elle correspond, cela signifie que le Token n'a pas ete altere et qu'il a bien ete emis par une source legitime.

> Remarque : le JWT garantit uniquement l'integrite des donnees (Integrity), pas la confidentialite (Confidentiality), sauf en cas de chiffrement supplementaire.

---

## 3. Qu'est-ce que l'encodage Base64URL ?

Le JWT utilise **Base64URL** au lieu de Base64 classique, avec les differences suivantes :

- Le `+` est remplace par `-`, et le `/` par `_`.
- Les `=` en fin de chaine sont supprimes.

Cela permet au Token d'etre utilise en toute securite dans une URL, un Cookie ou un Header, sans poser de problemes lies aux caracteres speciaux.

---

## 4. Schema simplifie du flux de verification

1. Le client envoie le Token dans le Header : `Authorization: Bearer <JWT>`.
2. Le serveur recoit le Token et :
   - Parse le Header et le Payload.
   - Identifie l'algorithme specifie par `alg`.
   - Recalcule la signature avec la cle partagee ou la cle publique.
   - Compare les signatures et verifie les champs temporels (`exp`, `nbf`, etc.).
3. Ce n'est qu'apres verification reussie que le contenu du Payload peut etre considere comme fiable.

---

## 5. Trame de reponse en entretien

> "Un JWT est compose de trois parties : Header, Payload et Signature, reliees par des `.`.
> Le Header decrit l'algorithme et le type ; le Payload contient les informations utilisateur et certains champs standards comme `iss`, `sub`, `exp` ; la Signature signe les deux premieres parties avec une cle secrete pour verifier que le contenu n'a pas ete modifie.
> Le contenu est du JSON encode en Base64URL, mais il n'est pas chiffre, juste encode. Les donnees sensibles ne doivent donc pas y etre stockees directement. Le serveur recalcule la signature pour comparaison : si elle correspond et que le Token n'est pas expire, le Token est valide."

---

## 6. Points a approfondir en entretien

- **Securite** : le Payload est decodable, ne jamais y stocker de mots de passe ou de numeros de carte.
- **Expiration et renouvellement** : on utilise generalement un Access Token a courte duree + un Refresh Token a longue duree.
- **Algorithmes de signature** : mentionner la difference entre symetrique (HMAC) et asymetrique (RSA, ECDSA).
- **Pourquoi ne pas faire un Token infini ?** : un Token trop volumineux augmente le cout de transfert reseau et peut etre rejete par le navigateur.

---

## 7. References

- [Site officiel JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0 : Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
