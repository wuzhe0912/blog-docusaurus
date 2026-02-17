---
title: '[Lv3] Nuxt 3 Multilingue (i18n) et meilleures pratiques SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Implementer le multilingue (Internationalization) sous une architecture SSR ne se limite pas a la traduction de texte, mais implique aussi des strategies de routage, des balises SEO (hreflang), la gestion d'etat et la coherence de Hydration.

---

## 1. Points cles de reponse en entretien

1.  **Strategie de routage** : Utiliser la strategie de prefixe URL de `@nuxtjs/i18n` (comme `/en/about`, `/jp/about`) pour distinguer les langues. C'est le plus favorable au SEO.
2.  **Balises SEO** : Assurer la generation automatique correcte de `<link rel="alternate" hreflang="..." />` et Canonical URL, evitant les penalites pour contenu duplique.
3.  **Gestion d'etat** : Detecter correctement la langue de l'utilisateur en phase SSR (Cookie/Header) et s'assurer que la langue est coherente lors de la Hydration cote Client.

---

## 2. Strategie d'implementation i18n de Nuxt 3

### 2.1 Pourquoi choisir `@nuxtjs/i18n` ?

Le module officiel `@nuxtjs/i18n` est base sur `vue-i18n`, optimise specifiquement pour Nuxt. Il resout les problemes courants de l'implementation manuelle d'i18n :

- Generation automatique de routes avec prefixe de langue (Auto-generated routes).
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
    langDir: 'locales', // Repertoire des fichiers de langue
    strategy: 'prefix_and_default', // Strategie de routage cle
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Detecter et rediriger uniquement sur le chemin racine
    },
  },
});
```

### 2.3 Strategie de routage (Routing Strategy)

C'est la cle du SEO. `@nuxtjs/i18n` offre plusieurs strategies :

1.  **prefix_except_default** (recommande) :

    - La langue par defaut (tw) sans prefixe : `example.com/about`
    - Les autres langues (en) avec prefixe : `example.com/en/about`
    - Avantage : URL propre, poids SEO concentre.

2.  **prefix_and_default** :

    - Toutes les langues avec prefixe : `example.com/tw/about`, `example.com/en/about`
    - Avantage : Structure uniforme, gestion facile des redirections.

3.  **no_prefix** (non recommande pour le SEO) :
    - Toutes les langues avec la meme URL, changement par Cookie.
    - Inconvenient : Les moteurs de recherche ne peuvent pas indexer les differentes versions linguistiques.

---

## 3. Implementation SEO cle

### 3.1 Balise hreflang

Les moteurs de recherche doivent savoir "quelles versions linguistiques a cette page". `@nuxtjs/i18n` genere automatiquement dans `<head>` :

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Attention :** `baseUrl` doit etre defini dans `nuxt.config.ts`, sinon hreflang generera des chemins relatifs (invalides).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Doit etre defini !
  },
});
```

### 3.2 Canonical URL

S'assurer que chaque version linguistique de la page a un Canonical URL pointant vers elle-meme, evitant d'etre consideree comme contenu duplique.

### 3.3 Traduction de contenu dynamique (API)

L'API backend doit aussi supporter le multilingue. Habituellement, le header `Accept-Language` est inclus dans les requetes.

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

## 4. Defis courants et solutions

### 4.1 Hydration Mismatch

**Probleme :** Le Server detecte l'anglais et rend le HTML en anglais ; le navigateur Client a le chinois par defaut, Vue i18n s'initialise en chinois, causant un scintillement d'ecran ou une Hydration Error.

**Solution :**

- Utiliser le parametre `detectBrowserLanguage` pour que le Client lors de l'initialisation respecte la configuration URL ou Cookie, plutot que la configuration du navigateur.
- S'assurer que le parametre `defaultLocale` du Server et du Client est coherent.

### 4.2 Changement de langue

Utiliser `switchLocalePath` pour generer des liens, plutot que de construire des chaines manuellement.

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

## 5. Points cles pour l'entretien

### 5.1 i18n et SEO

**Q : A quoi faut-il faire attention avec le multilingue (i18n) dans un environnement SSR ? Comment gerer le SEO ?**

> **Exemple de reponse :**
> En faisant de l'i18n dans un environnement SSR, le plus important est le **SEO** et la **coherence de Hydration**.
>
> Concernant le **SEO** :
>
> 1.  **Structure d'URL** : J'utilise la strategie "sous-chemin" (comme `/en/`, `/tw/`), donnant a chaque langue une URL independante pour que les moteurs de recherche puissent indexer.
> 2.  **hreflang** : Il faut configurer correctement `<link rel="alternate" hreflang="..." />`, indiquant a Google que ces pages sont des versions linguistiques differentes du meme contenu, evitant les penalites pour contenu duplique. J'utilise normalement le module `@nuxtjs/i18n` pour generer automatiquement ces balises.
>
> Concernant la **Hydration** :
> S'assurer que la langue rendue par le Server et celle initialisee par le Client sont coherentes. Je configure la determination de la langue a partir du prefixe URL ou du Cookie, et j'ajoute la locale correspondante dans le header des requetes API.

### 5.2 Routage et etat

**Q : Comment implementer la fonctionnalite de changement de langue ?**

> **Exemple de reponse :**
> J'utilise le composable `useSwitchLocalePath` fourni par `@nuxtjs/i18n`.
> Il genere automatiquement l'URL de la langue correspondante basee sur la route actuelle (en conservant les query parameters), et gere la conversion des prefixes de route. Cela evite les erreurs de concatenation manuelle de chaines, et garantit que l'utilisateur reste sur le contenu de la page d'origine lors du changement de langue.

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
