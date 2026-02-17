---
id: login-lv1-project-implementation
title: "[Lv1] Comment le mécanisme de login a-t-il été implémenté dans vos projets précédents ?"
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Objectif : expliquer clairement en 3 à 5 minutes comment le front-end gère le login, le maintien de l'état et la protection des pages, pour s'en rappeler rapidement en entretien.

---

## 1. Axes principaux de la réponse en entretien

1. **Les trois étapes du login** : soumission du formulaire -> vérification back-end -> stockage du Token et redirection.
2. **Gestion de l'état et du Token** : Pinia avec persistance, Axios Interceptor pour attacher automatiquement le Bearer Token.
3. **Traitements ultérieurs et protection** : initialisation des données partagées, route guards, déconnexion et cas particuliers (OTP, changement de mot de passe forcé).

Commencez par ces trois points clés, puis développez selon les besoins pour montrer à l'intervieweur votre vision d'ensemble.

---

## 2. Composition du système et répartition des responsabilités

| Module           | Emplacement                         | Rôle                                                    |
| ---------------- | ----------------------------------- | ------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Stocke l'état de connexion, persiste le Token, fournit des getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Encapsule le flux login / logout, format de retour unifié |
| API de login     | `src/api/login.ts`                  | Appelle `POST /login`, `POST /logout` côté back-end      |
| Utilitaire Axios | `src/common/utils/request.ts`       | Request / Response Interceptor, gestion unifiée des erreurs |
| Route Guard      | `src/router/index.ts`               | Détermine selon `meta` si l'authentification est requise  |
| Flux d'init      | `src/common/composables/useInit.ts` | Vérifie au démarrage si un Token existe, charge les données nécessaires |

> Moyen mnémotechnique : **"Store gère l'état, Hook gère le flux, Interceptor gère le canal, Guard gère les pages"**.

---

## 3. Flux de login (étape par étape)

### Step 0. Formulaire et validation préalable

- Prise en charge de deux modes de login : mot de passe classique et code de vérification SMS.
- Validation basique avant envoi (champs obligatoires, format, protection contre la double soumission).

### Step 1. Appel à l'API de login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` gère uniformément les erreurs et le loading.
- En cas de succès, `data` contient le Token et les informations essentielles de l'utilisateur.

### Step 2. Traitement de la réponse back-end

| Situation                                          | Comportement                                               |
| -------------------------------------------------- | ---------------------------------------------------------- |
| **Vérification supplémentaire requise** (ex. première connexion avec confirmation d'identité) | `authStore.onBoarding` passe à `true`, redirection vers la page de vérification |
| **Changement de mot de passe forcé**               | Redirection vers le flux de changement de mot de passe avec les paramètres nécessaires |
| **Succès standard**                                | Appel de `authStore.$patch()` pour sauvegarder le Token et les informations utilisateur |

### Step 3. Actions communes après le login

1. Récupération du profil utilisateur et de la liste des portefeuilles.
2. Initialisation du contenu personnalisé (par ex. liste de cadeaux, notifications).
3. Redirection vers la page interne selon `redirect` ou la route prévue.

> Le succès du login n'est que la première moitié : **les données partagées doivent être complétées à ce moment-là** pour éviter que chaque page fasse ses propres appels API.

---

## 4. Gestion du cycle de vie du Token

### 4.1 Stratégie de stockage

- `authStore` avec `persist: true`, les champs clés sont écrits dans `localStorage`.
- Avantage : l'état est automatiquement restauré après un rafraîchissement ; inconvénient : il faut gérer soi-même les risques XSS.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Les API nécessitant une autorisation incluent automatiquement le Bearer Token.
- Si une API est explicitement marquée `needToken: false` (login, inscription, etc.), le Token n'est pas attaché.

### 4.3 Gestion de l'expiration et des exceptions

- Si le back-end renvoie un Token expiré ou invalide, le Response Interceptor transforme uniformément la réponse en message d'erreur et déclenche la déconnexion.
- Un mécanisme de Refresh Token peut être ajouté en extension ; le projet actuel utilise une stratégie simplifiée.

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

- La propriété `meta.needAuth` détermine si l'état de connexion doit être vérifié.
- Si l'utilisateur n'est pas connecté, il est redirigé vers la page de login ou une page publique spécifiée.

### 5.2 Initialisation de l'application au démarrage

`useInit` gère au démarrage de l'application :

1. Vérification si l'URL contient un `login_token` ou un `platform_token` ; si oui, connexion automatique ou configuration du Token.
2. Si le Store contient déjà un Token, chargement des informations utilisateur et des données partagées.
3. Sans Token, l'utilisateur reste sur la page publique en attendant de se connecter manuellement.

---

## 6. Flux de déconnexion (nettoyage et finalisation)

1. Appel à `POST /logout` pour informer le back-end.
2. Exécution de `reset()` :
   - `authStore.$reset()` efface les informations de connexion.
   - Les Stores associés (informations utilisateur, favoris, codes d'invitation, etc.) sont également réinitialisés.
3. Nettoyage du cache côté navigateur (par ex. le cache dans `localStorage`).
4. Redirection vers la page de login ou la page d'accueil.

> La déconnexion est le miroir du login : il ne suffit pas de supprimer le Token, il faut aussi s'assurer que tous les états dépendants sont nettoyés pour éviter les données résiduelles.

---

## 7. Questions fréquentes et bonnes pratiques

- **Découpage du flux** : séparer le login et l'initialisation post-login pour garder le hook concis.
- **Gestion des erreurs** : de manière unifiée via `useApi` et le Response Interceptor, pour garantir une interface utilisateur cohérente.
- **Sécurité** :
  - Utilisation exclusive de HTTPS.
  - Lorsque le Token est stocké dans `localStorage`, attention aux risques XSS pour les opérations sensibles.
  - Envisager des httpOnly Cookies ou un Refresh Token selon les besoins.
- **Cas particuliers** : les scénarios OTP, changement de mot de passe forcé, etc. sont gérés de manière flexible via le hook qui renvoie un état traité par l'interface.

---

## 8. Aide-mémoire rapide pour l'entretien

1. **"Saisie -> Vérification -> Stockage -> Redirection"** : décrivez le flux global dans cet ordre.
2. **"Store retient l'état, Interceptor attache le header, Guard bloque les intrus"** : mettez en valeur la séparation des responsabilités.
3. **"Compléter les données partagées immédiatement après le login"** : montrez votre sensibilité à l'expérience utilisateur.
4. **"La déconnexion est une réinitialisation complète + retour à une page sécurisée"** : couvrez la sécurité et la clôture du flux.
