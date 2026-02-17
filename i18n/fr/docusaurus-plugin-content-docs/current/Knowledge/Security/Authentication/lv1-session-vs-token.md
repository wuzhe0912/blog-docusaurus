---
id: login-lv1-session-vs-token
title: '[Lv1] Quelle est la différence entre Session-based et Token-based ?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Question fréquente en entretien : connaissez-vous la différence entre Session traditionnelle et Token moderne ? Maîtrisez les points ci-dessous pour structurer rapidement votre réponse.

---

## 1. Concepts fondamentaux des deux modes d'authentification

### Session-based Authentication

- **L'état est conservé côté serveur** : après la première connexion, le serveur crée une Session en mémoire ou en base de données et renvoie un Session ID stocké dans un Cookie.
- **Les requêtes suivantes dépendent du Session ID** : le navigateur envoie automatiquement le Cookie de Session sur le même domaine ; le serveur retrouve les informations utilisateur grâce au Session ID.
- **Courant dans les applications MVC / monolithiques traditionnelles** : le serveur gère le rendu des pages et maintient l'état utilisateur.

### Token-based Authentication (par ex. JWT)

- **L'état est conservé côté client** : après une connexion réussie, un Token est généré (pouvant contenir les informations utilisateur et les permissions), stocké par le front-end.
- **Le Token est envoyé à chaque requête** : généralement dans `Authorization: Bearer <token>` ; le serveur vérifie la signature pour obtenir les informations utilisateur.
- **Courant dans les SPA / microservices** : le back-end n'a qu'à vérifier le Token, sans stocker l'état utilisateur.

---

## 2. Comparaison des flux de requêtes

| Étape du flux | Session-based                                           | Token-based (JWT)                                                     |
| ------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login réussi  | Le serveur crée une Session, renvoie `Set-Cookie: session_id=...` | Le serveur signe un Token, renvoie du JSON : `{ access_token, expires_in, ... }` |
| Emplacement de stockage | Cookie du navigateur (généralement httponly)     | Au choix du front-end : `localStorage`, `sessionStorage`, Cookie, Memory |
| Requêtes suivantes | Le navigateur envoie automatiquement le Cookie ; le serveur consulte la table pour obtenir les infos utilisateur | Le front-end attache manuellement `Authorization` dans le Header |
| Méthode de vérification | Consultation du Session Store                    | Vérification de la signature du Token, ou comparaison avec une liste noire / blanche |
| Déconnexion   | Suppression de la Session serveur, envoi de `Set-Cookie` pour effacer le Cookie | Le front-end supprime le Token ; pour une invalidation forcée, il faut une liste noire ou une rotation des clés |

---

## 3. Résumé des avantages et inconvénients

| Aspect         | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Avantages      | - Cookie envoyé automatiquement, simple côté navigateur<br />- La Session peut stocker beaucoup de données<br />- Facile à révoquer et à forcer la déconnexion | - Sans état, facilement scalable horizontalement<br />- Adapté aux SPA, mobiles, microservices<br />- Le Token peut être utilisé entre domaines et appareils |
| Inconvénients  | - Le serveur doit maintenir un Session Store, consomme de la mémoire<br />- En déploiement distribué, synchronisation des Sessions nécessaire | - Le Token est plus volumineux, transmis à chaque requête<br />- Difficile à révoquer, nécessite une liste noire / rotation des clés |
| Risques de sécurité | - Vulnérable aux attaques CSRF (le Cookie est envoyé automatiquement)<br />- En cas de fuite du Session ID, suppression immédiate nécessaire | - Vulnérable aux attaques XSS (si stocké dans un emplacement lisible)<br />- Si le Token est volé avant expiration, les requêtes peuvent être rejouées |
| Cas d'usage    | - Web traditionnel (SSR) + même domaine<br />- Le serveur gère le rendu des pages | - API RESTful / GraphQL<br />- Applications mobiles, SPA, microservices |

---

## 4. Comment choisir ?

### Posez-vous trois questions

1. **Avez-vous besoin d'un état de connexion partagé entre domaines ou appareils ?**
   - Oui -> Token-based est plus flexible.
   - Non -> Session-based est plus simple.

2. **Le déploiement implique-t-il plusieurs serveurs ou des microservices ?**
   - Oui -> Token-based réduit le besoin de réplication ou de centralisation des Sessions.
   - Non -> Session-based est simple et sécurisé.

3. **Y a-t-il des exigences de haute sécurité (banque, système d'entreprise) ?**
   - Exigences élevées -> Session-based + httponly Cookie + protection CSRF reste la norme.
   - API légère ou service mobile -> Token-based + HTTPS + Refresh Token + stratégie de liste noire.

### Stratégies courantes

- **Systèmes internes d'entreprise** : Session-based + synchronisation Redis / base de données.
- **SPA moderne + application mobile** : Token-based (Access Token + Refresh Token).
- **Grands microservices** : Token-based (JWT) avec vérification via API Gateway.

---

## 5. Modèle de réponse en entretien

> "La Session traditionnelle stocke l'état côté serveur, renvoie un session id dans un Cookie, et le navigateur l'envoie automatiquement à chaque requête. C'est donc très adapté aux Web Apps sur un même domaine. L'inconvénient est que le serveur doit maintenir un Session Store, et s'il y a plusieurs serveurs, il faut synchroniser.
> À l'inverse, le Token-based (par exemple JWT) encode les informations utilisateur dans un Token stocké côté client, et le front-end l'attache manuellement dans le Header à chaque requête. Cette approche est sans état, adaptée aux SPA et microservices, et se met facilement à l'échelle.
> En termes de sécurité, il faut se prémunir contre le CSRF pour les Sessions, et contre le XSS pour les Tokens. Si j'ai besoin de fonctionner entre domaines, sur mobile ou avec plusieurs services, je choisis le Token ; pour un système d'entreprise traditionnel avec du rendu serveur, je choisis Session avec httponly Cookie."

---

## 6. Points à approfondir en entretien

- Session -> se concentrer sur la **protection CSRF, la stratégie de synchronisation des Sessions, la fréquence de nettoyage**.
- Token -> se concentrer sur **l'emplacement de stockage (Cookie vs localStorage)**, le **mécanisme de Refresh Token**, la **liste noire / rotation des clés**.
- On peut mentionner le compromis courant en entreprise : stocker le Token dans un `httpOnly Cookie`, éventuellement associé à un CSRF Token.

---

## 7. Références

- [MDN : HTTP Cookies](https://developer.mozilla.org/fr/docs/Web/HTTP/Cookies)
- [Auth0 : Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP : Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
