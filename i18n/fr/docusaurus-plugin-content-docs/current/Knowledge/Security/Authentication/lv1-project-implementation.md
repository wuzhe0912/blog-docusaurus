---
id: login-lv1-project-implementation
title: "[Lv1] Comment le mecanisme de login a-t-il ete implemente dans vos projets precedents ?"
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Objectif : expliquer clairement en 3 a 5 minutes comment le front-end gere le login, le maintien de l'etat et la protection des pages, pour s'en rappeler rapidement en entretien.

---

## 1. Axes principaux de la reponse en entretien

1. **Les trois etapes du login** : soumission du formulaire -> verification back-end -> stockage du Token et redirection.
2. **Gestion de l'etat et du Token** : Pinia avec persistance, Axios Interceptor pour attacher automatiquement le Bearer Token.
3. **Traitements ulterieurs et protection** : initialisation des donnees partagees, route guards, deconnexion et cas particuliers (OTP, changement de mot de passe force).

Commencez par ces trois points cles, puis developpez selon les besoins pour montrer a l'intervieweur votre vision d'ensemble.

---

## 2. Composition du systeme et repartition des responsabilites

| Module           | Emplacement                         | Role                                                    |
| ---------------- | ----------------------------------- | ------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Stocke l'etat de connexion, persiste le Token, fournit des getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsule le flux login / logout, format de retour unifie |
| API de login     | `src/api/login.ts`                  | Appelle `POST /login`, `POST /logout` cote back-end      |
| Utilitaire Axios | `src/common/utils/request.ts`       | Request / Response Interceptor, gestion unifiee des erreurs |
| Route Guard      | `src/router/index.ts`               | Determine selon `meta` si l'authentification est requise  |
| Flux d'init      | `src/common/composables/useInit.ts` | Verifie au demarrage si un Token existe, charge les donnees necessaires |

> Moyen mnemotechnique : **"Store gere l'etat, Hook gere le flux, Interceptor gere le canal, Guard gere les pages"**.

---

## 3. Flux de login (etape par etape)

### Step 0. Formulaire et validation prealable

- Prise en charge de deux modes de login : mot de passe classique et code de verification SMS.
- Validation basique avant envoi (champs obligatoires, format, protection contre la double soumission).

### Step 1. Appel a l'API de login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` gere uniformement les erreurs et le loading.
- En cas de succes, `data` contient le Token et les informations essentielles de l'utilisateur.

### Step 2. Traitement de la reponse back-end

| Situation                                          | Comportement                                               |
| -------------------------------------------------- | ---------------------------------------------------------- |
| **Verification supplementaire requise** (ex. premiere connexion avec confirmation d'identite) | `authStore.onBoarding` passe a `true`, redirection vers la page de verification |
| **Changement de mot de passe force**               | Redirection vers le flux de changement de mot de passe avec les parametres necessaires |
| **Succes standard**                                | Appel de `authStore.$patch()` pour sauvegarder le Token et les informations utilisateur |

### Step 3. Actions communes apres le login

1. Recuperation du profil utilisateur et de la liste des portefeuilles.
2. Initialisation du contenu personnalise (par ex. liste de cadeaux, notifications).
3. Redirection vers la page interne selon `redirect` ou la route prevue.

> Le succes du login n'est que la premiere moitie : **les donnees partagees doivent etre completees a ce moment-la** pour eviter que chaque page fasse ses propres appels API.

---

## 4. Gestion du cycle de vie du Token

### 4.1 Strategie de stockage

- `authStore` avec `persist: true`, les champs cles sont ecrits dans `localStorage`.
- Avantage : l'etat est automatiquement restaure apres un rafraichissement ; inconvenient : il faut gerer soi-meme les risques XSS.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Les API necessitant une autorisation incluent automatiquement le Bearer Token.
- Si une API est explicitement marquee `needToken: false` (login, inscription, etc.), le Token n'est pas attache.

### 4.3 Gestion de l'expiration et des exceptions

- Si le back-end renvoie un Token expire ou invalide, le Response Interceptor transforme uniformement la reponse en message d'erreur et declenche la deconnexion.
- Un mecanisme de Refresh Token peut etre ajoute en extension ; le projet actuel utilise une strategie simplifiee.

---

## 5. Protection des routes et initialisation

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- La propriete `meta.needAuth` determine si l'etat de connexion doit etre verifie.
- Si l'utilisateur n'est pas connecte, il est redirige vers la page de login ou une page publique specifiee.

### 5.2 Initialisation de l'application au demarrage

`useInit` gere au demarrage de l'application :

1. Verification si l'URL contient un `login_token` ou un `platform_token` ; si oui, connexion automatique ou configuration du Token.
2. Si le Store contient deja un Token, chargement des informations utilisateur et des donnees partagees.
3. Sans Token, l'utilisateur reste sur la page publique en attendant de se connecter manuellement.

---

## 6. Flux de deconnexion (nettoyage et finalisation)

1. Appel a `POST /logout` pour informer le back-end.
2. Execution de `reset()` :
   - `authStore.$reset()` efface les informations de connexion.
   - Les Stores associes (informations utilisateur, favoris, codes d'invitation, etc.) sont egalement reinitialises.
3. Nettoyage du cache cote navigateur (par ex. le cache dans `localStorage`).
4. Redirection vers la page de login ou la page d'accueil.

> La deconnexion est le miroir du login : il ne suffit pas de supprimer le Token, il faut aussi s'assurer que tous les etats dependants sont nettoyes pour eviter les donnees residuelles.

---

## 7. Questions frequentes et bonnes pratiques

- **Decoupage du flux** : separer le login et l'initialisation post-login pour garder le hook concis.
- **Gestion des erreurs** : de maniere unifiee via `useApi` et le Response Interceptor, pour garantir une interface utilisateur coherente.
- **Securite** :
  - Utilisation exclusive de HTTPS.
  - Lorsque le Token est stocke dans `localStorage`, attention aux risques XSS pour les operations sensibles.
  - Envisager des httpOnly Cookies ou un Refresh Token selon les besoins.
- **Cas particuliers** : les scenarios OTP, changement de mot de passe force, etc. sont geres de maniere flexible via le hook qui renvoie un etat traite par l'interface.

---

## 8. Aide-memoire rapide pour l'entretien

1. **"Saisie -> Verification -> Stockage -> Redirection"** : decrivez le flux global dans cet ordre.
2. **"Store retient l'etat, Interceptor attache le header, Guard bloque les intrus"** : mettez en valeur la separation des responsabilites.
3. **"Completer les donnees partagees immediatement apres le login"** : montrez votre sensibilite a l'experience utilisateur.
4. **"La deconnexion est une reinitialisation complete + retour a une page securisee"** : couvrez la securite et la cloture du flux.
