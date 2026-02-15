---
id: login-lv1-session-vs-token
title: '[Lv1] Quelle est la difference entre Session-based et Token-based ?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Question frequente en entretien : connaissez-vous la difference entre Session traditionnelle et Token moderne ? Maitrisez les points ci-dessous pour structurer rapidement votre reponse.

---

## 1. Concepts fondamentaux des deux modes d'authentification

### Session-based Authentication

- **L'etat est conserve cote serveur** : apres la premiere connexion, le serveur cree une Session en memoire ou en base de donnees et renvoie un Session ID stocke dans un Cookie.
- **Les requetes suivantes dependent du Session ID** : le navigateur envoie automatiquement le Cookie de Session sur le meme domaine ; le serveur retrouve les informations utilisateur grace au Session ID.
- **Courant dans les applications MVC / monolithiques traditionnelles** : le serveur gere le rendu des pages et maintient l'etat utilisateur.

### Token-based Authentication (par ex. JWT)

- **L'etat est conserve cote client** : apres une connexion reussie, un Token est genere (pouvant contenir les informations utilisateur et les permissions), stocke par le front-end.
- **Le Token est envoye a chaque requete** : generalement dans `Authorization: Bearer <token>` ; le serveur verifie la signature pour obtenir les informations utilisateur.
- **Courant dans les SPA / microservices** : le back-end n'a qu'a verifier le Token, sans stocker l'etat utilisateur.

---

## 2. Comparaison des flux de requetes

| Etape du flux | Session-based                                           | Token-based (JWT)                                                     |
| ------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login reussi  | Le serveur cree une Session, renvoie `Set-Cookie: session_id=...` | Le serveur signe un Token, renvoie du JSON : `{ access_token, expires_in, ... }` |
| Emplacement de stockage | Cookie du navigateur (generalement httponly)     | Au choix du front-end : `localStorage`, `sessionStorage`, Cookie, Memory |
| Requetes suivantes | Le navigateur envoie automatiquement le Cookie ; le serveur consulte la table pour obtenir les infos utilisateur | Le front-end attache manuellement `Authorization` dans le Header |
| Methode de verification | Consultation du Session Store                    | Verification de la signature du Token, ou comparaison avec une liste noire / blanche |
| Deconnexion   | Suppression de la Session serveur, envoi de `Set-Cookie` pour effacer le Cookie | Le front-end supprime le Token ; pour une invalidation forcee, il faut une liste noire ou une rotation des cles |

---

## 3. Resume des avantages et inconvenients

| Aspect         | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Avantages      | - Cookie envoye automatiquement, simple cote navigateur<br />- La Session peut stocker beaucoup de donnees<br />- Facile a revoquer et a forcer la deconnexion | - Sans etat, facilement scalable horizontalement<br />- Adapte aux SPA, mobiles, microservices<br />- Le Token peut etre utilise entre domaines et appareils |
| Inconvenients  | - Le serveur doit maintenir un Session Store, consomme de la memoire<br />- En deploiement distribue, synchronisation des Sessions necessaire | - Le Token est plus volumineux, transmis a chaque requete<br />- Difficile a revoquer, necessite une liste noire / rotation des cles |
| Risques de securite | - Vulnerable aux attaques CSRF (le Cookie est envoye automatiquement)<br />- En cas de fuite du Session ID, suppression immediate necessaire | - Vulnerable aux attaques XSS (si stocke dans un emplacement lisible)<br />- Si le Token est vole avant expiration, les requetes peuvent etre rejouees |
| Cas d'usage    | - Web traditionnel (SSR) + meme domaine<br />- Le serveur gere le rendu des pages | - API RESTful / GraphQL<br />- Applications mobiles, SPA, microservices |

---

## 4. Comment choisir ?

### Posez-vous trois questions

1. **Avez-vous besoin d'un etat de connexion partage entre domaines ou appareils ?**
   - Oui -> Token-based est plus flexible.
   - Non -> Session-based est plus simple.

2. **Le deploiement implique-t-il plusieurs serveurs ou des microservices ?**
   - Oui -> Token-based reduit le besoin de replication ou de centralisation des Sessions.
   - Non -> Session-based est simple et securise.

3. **Y a-t-il des exigences de haute securite (banque, systeme d'entreprise) ?**
   - Exigences elevees -> Session-based + httponly Cookie + protection CSRF reste la norme.
   - API legere ou service mobile -> Token-based + HTTPS + Refresh Token + strategie de liste noire.

### Strategies courantes

- **Systemes internes d'entreprise** : Session-based + synchronisation Redis / base de donnees.
- **SPA moderne + application mobile** : Token-based (Access Token + Refresh Token).
- **Grands microservices** : Token-based (JWT) avec verification via API Gateway.

---

## 5. Modele de reponse en entretien

> "La Session traditionnelle stocke l'etat cote serveur, renvoie un session id dans un Cookie, et le navigateur l'envoie automatiquement a chaque requete. C'est donc tres adapte aux Web Apps sur un meme domaine. L'inconvenient est que le serveur doit maintenir un Session Store, et s'il y a plusieurs serveurs, il faut synchroniser.
> A l'inverse, le Token-based (par exemple JWT) encode les informations utilisateur dans un Token stocke cote client, et le front-end l'attache manuellement dans le Header a chaque requete. Cette approche est sans etat, adaptee aux SPA et microservices, et se met facilement a l'echelle.
> En termes de securite, il faut se premunir contre le CSRF pour les Sessions, et contre le XSS pour les Tokens. Si j'ai besoin de fonctionner entre domaines, sur mobile ou avec plusieurs services, je choisis le Token ; pour un systeme d'entreprise traditionnel avec du rendu serveur, je choisis Session avec httponly Cookie."

---

## 6. Points a approfondir en entretien

- Session -> se concentrer sur la **protection CSRF, la strategie de synchronisation des Sessions, la frequence de nettoyage**.
- Token -> se concentrer sur **l'emplacement de stockage (Cookie vs localStorage)**, le **mecanisme de Refresh Token**, la **liste noire / rotation des cles**.
- On peut mentionner le compromis courant en entreprise : stocker le Token dans un `httpOnly Cookie`, eventuellement associe a un CSRF Token.

---

## 7. References

- [MDN : HTTP Cookies](https://developer.mozilla.org/fr/docs/Web/HTTP/Cookies)
- [Auth0 : Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP : Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
