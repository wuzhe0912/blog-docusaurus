---
title: '[Lv3] Nuxt 3 Multilingue (i18n) et meilleures pratiques SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Implémenter le multilingue (Internationalization) sous une architecture SSR ne se limite pas à la traduction de texte, mais implique aussi des stratégies de routage, des balises SEO (hreflang), la gestion d'état et la cohérence de Hydration.

---

## 1. Points clés de réponse en entretien

1.  **Stratégie de routage** : Utiliser la stratégie de préfixe URL de `@nuxtjs/i18n` (comme `/en/about`, `/jp/about`) pour distinguer les langues. C'est le plus favorable au SEO.
2.  **Balises SEO** : Assurer la génération automatique correcte de `<link rel="alternate" hreflang="..." />` et Canonical URL, évitant les pénalités pour contenu dupliqué.
3.  **Gestion d'état** : Détecter correctement la langue de l'utilisateur en phase SSR (Cookie/Header) et s'assurer que la langue est cohérente lors de la Hydration côté Client.

---

## 2. Stratégie d'implémentation i18n de Nuxt 3

### 2.1 Pourquoi choisir `@nuxtjs/i18n` ?

Le module officiel `@nuxtjs/i18n` est basé sur `vue-i18n`, optimisé spécifiquement pour Nuxt. Il résout les problèmes courants de l'implémentation manuelle d'i18n :

- Génération automatique de routes avec préfixe de langue (Auto-generated routes).
- Traitement automatique des SEO Meta Tags (hreflang, og:locale).
- Support du Lazy Loading des paquets de langue (optimisation du Bundle Size).

### 2.2 Installation et configuration

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: 'Chinois traditionnel' },
    ],
    defaultLocale: 'tw',
    lazy: true, // Activer le Lazy Loading
    langDir: 'locales', // Répertoire des fichiers de langue
    strategy: 'prefix_and_default', // Stratégie de routage clé
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Détecter et rediriger uniquement sur le chemin racine
    },
  },
});
```

### 2.3 Stratégie de routage (Routing Strategy)

C'est la clé du SEO. `@nuxtjs/i18n` offre plusieurs stratégies :

1.  **prefix_except_default** (recommandé) :

    - La langue par défaut (tw) sans préfixe : `example.com/about`
    - Les autres langues (en) avec préfixe : `example.com/en/about`
    - Avantage : URL propre, poids SEO concentré.

2.  **prefix_and_default** :

    - Toutes les langues avec préfixe : `example.com/tw/about`, `example.com/en/about`
    - Avantage : Structure uniforme, gestion facile des redirections.

3.  **no_prefix** (non recommandé pour le SEO) :
    - Toutes les langues avec la même URL, changement par Cookie.
    - Inconvénient : Les moteurs de recherche ne peuvent pas indexer les différentes versions linguistiques.

---

## 3. Implémentation SEO clé

### 3.1 Balise hreflang

Les moteurs de recherche doivent savoir "quelles versions linguistiques a cette page". `@nuxtjs/i18n` génère automatiquement dans `<head>` :

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Attention :** `baseUrl` doit être défini dans `nuxt.config.ts`, sinon hreflang générera des chemins relatifs (invalides).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Doit être défini !
  },
});
```

### 3.2 Canonical URL

S'assurer que chaque version linguistique de la page a un Canonical URL pointant vers elle-même, évitant d'être considérée comme contenu dupliqué.

### 3.3 Traduction de contenu dynamique (API)

L'API backend doit aussi supporter le multilingue. Habituellement, le header `Accept-Language` est inclus dans les requêtes.

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // Envoyer la langue actuelle au backend
    },
  });
};
```

---

## 4. Défis courants et solutions

### 4.1 Hydration Mismatch

**Problème :** Le Server détecte l'anglais et rend le HTML en anglais ; le navigateur Client a le chinois par défaut, Vue i18n s'initialise en chinois, causant un scintillement d'écran ou une Hydration Error.

**Solution :**

- Utiliser le paramètre `detectBrowserLanguage` pour que le Client lors de l'initialisation respecte la configuration URL ou Cookie, plutôt que la configuration du navigateur.
- S'assurer que le paramètre `defaultLocale` du Server et du Client est cohérent.

### 4.2 Changement de langue

Utiliser `switchLocalePath` pour générer des liens, plutôt que de construire des chaînes manuellement.

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <nav>
    <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="switchLocalePath('tw')">Chinois traditionnel</NuxtLink>
  </nav>
</template>
```

---

## 5. Points clés pour l'entretien

### 5.1 i18n et SEO

**Q : À quoi faut-il faire attention avec le multilingue (i18n) dans un environnement SSR ? Comment gérer le SEO ?**

> **Exemple de réponse :**
> En faisant de l'i18n dans un environnement SSR, le plus important est le **SEO** et la **cohérence de Hydration**.
>
> Concernant le **SEO** :
>
> 1.  **Structure d'URL** : J'utilise la stratégie "sous-chemin" (comme `/en/`, `/tw/`), donnant à chaque langue une URL indépendante pour que les moteurs de recherche puissent indexer.
> 2.  **hreflang** : Il faut configurer correctement `<link rel="alternate" hreflang="..." />`, indiquant à Google que ces pages sont des versions linguistiques différentes du même contenu, évitant les pénalités pour contenu dupliqué. J'utilise normalement le module `@nuxtjs/i18n` pour générer automatiquement ces balises.
>
> Concernant la **Hydration** :
> S'assurer que la langue rendue par le Server et celle initialisée par le Client sont cohérentes. Je configure la détermination de la langue à partir du préfixe URL ou du Cookie, et j'ajoute la locale correspondante dans le header des requêtes API.

### 5.2 Routage et état

**Q : Comment implémenter la fonctionnalité de changement de langue ?**

> **Exemple de réponse :**
> J'utilise le composable `useSwitchLocalePath` fourni par `@nuxtjs/i18n`.
> Il génère automatiquement l'URL de la langue correspondante basée sur la route actuelle (en conservant les query parameters), et gère la conversion des préfixes de route. Cela évite les erreurs de concaténation manuelle de chaînes, et garantit que l'utilisateur reste sur le contenu de la page d'origine lors du changement de langue.

---

## 6. Référence

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
