---
title: '[Lv2] Fonctionnalités Nuxt 3 Server : Server Routes et Sitemap dynamique'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Maîtriser les fonctionnalités du Nitro Server Engine de Nuxt 3, implémenter les Server Routes (API Routes), le Sitemap dynamique et le Robots.txt pour améliorer le SEO et la flexibilité architecturale du site web.

---

## 1. Points clés de réponse en entretien

1.  **Server Routes (API Routes)** : Utiliser `server/api` ou `server/routes` pour construire la logique backend. Couramment utilisé pour masquer les API Keys, gérer le CORS, architecture BFF (Backend for Frontend).
2.  **Sitemap dynamique** : Génération dynamique de XML via Server Routes (`server/routes/sitemap.xml.ts`), garantissant que les moteurs de recherche puissent indexer le contenu le plus récent.
3.  **Robots.txt** : Également généré dynamiquement via Server Routes ou configuré via Nuxt Config, pour contrôler les permissions d'accès des crawlers.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Qu'est-ce que Nitro ?

Nitro est le nouveau moteur serveur de Nuxt 3, permettant de déployer les applications Nuxt partout (Universal Deployment). Ce n'est pas seulement un serveur, mais un puissant outil de build et de runtime.

### 2.2 Caractéristiques principales de Nitro

1.  **Déploiement multiplateforme (Universal Deployment)** :
    Peut être compilé en Node.js server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers et autres formats. Déploiement zero-config sur les principales plateformes.

2.  **Léger et rapide (Lightweight & Fast)** :
    Temps de cold start extrêmement court et bundle size généré très petit (minimum < 1MB).

3.  **Division automatique du code (Auto Code Splitting)** :
    Analyse automatiquement les dépendances des Server Routes et effectue le code splitting pour assurer la vitesse de démarrage.

4.  **HMR (Hot Module Replacement)** :
    Non seulement le frontend a le HMR, Nitro permet aussi le HMR pour le développement d'API backend. Modification des fichiers `server/` sans redémarrage du serveur.

5.  **Storage Layer (Unstorage)** :
    API Storage unifiée intégrée, permettant de se connecter facilement à Redis, GitHub, FS, Memory et autres interfaces de stockage.

6.  **Server Assets** :
    Accès pratique aux fichiers de ressources statiques côté Server.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Que sont les Server Routes ?

Nuxt 3 intègre le moteur serveur **Nitro**, permettant aux développeurs d'écrire des APIs backend directement dans le projet. Ces fichiers sont placés dans les répertoires `server/api` ou `server/routes` et sont automatiquement mappés comme endpoints API.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 Dans quelles situations les utiliser ? (Question d'entretien courante)

**1. Masquer les informations sensibles (Secret Management)**
Le frontend ne peut pas stocker les Private API Keys en toute sécurité. En utilisant les Server Routes comme intermédiaire, on peut accéder à la Key via des variables d'environnement côté Server et ne renvoyer que le résultat au frontend.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // L'API Key n'est utilisée que côté Server, non exposée au Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. Gestion des problèmes CORS (Proxy)**
Quand une API externe ne supporte pas le CORS, on peut utiliser les Server Routes comme Proxy. Le navigateur envoie des requêtes au Nuxt Server (même origine), le Nuxt Server envoie des requêtes à l'API externe (pas de restrictions CORS).

**3. Backend for Frontend (BFF)**
Agréger, filtrer ou convertir le format des données de plusieurs APIs backend sur le Nuxt Server, puis les renvoyer au frontend en une seule fois. Réduit le nombre de requêtes frontend et la taille du Payload.

**4. Gestion des Webhooks**
Recevoir les notifications Webhook de services tiers (comme les paiements, CMS).

---

## 4. Implémentation du Sitemap dynamique

### 3.1 Pourquoi un Sitemap dynamique est-il nécessaire ?

Pour les sites web dont le contenu change fréquemment (comme l'e-commerce, les sites d'actualités), un `sitemap.xml` généré statiquement devient rapidement obsolète. En utilisant les Server Routes, on peut générer dynamiquement le Sitemap le plus récent à chaque requête.

### 3.2 Méthode d'implémentation : Génération manuelle

Créer `server/routes/sitemap.xml.ts` :

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. Obtenir toutes les données de routes dynamiques depuis la base de données ou l'API
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. Ajouter les pages statiques
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. Ajouter les pages dynamiques
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Définir le Header et renvoyer le XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 Méthode d'implémentation : Utilisation d'un module (`@nuxtjs/sitemap`)

Pour les besoins standards, l'utilisation du module officiel est recommandée :

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // Spécifier une API pour fournir la liste d'URLs dynamiques
    ],
  },
});
```

---

## 5. Implémentation du Robots.txt dynamique

### 4.1 Méthode d'implémentation

Créer `server/routes/robots.txt.ts` :

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // Déterminer les règles dynamiquement selon l'environnement
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // Interdire l'indexation dans les environnements non-production

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. Points clés pour l'entretien

### 5.1 Nitro Engine & Server Routes

**Q : Quel est le server engine de Nuxt 3 ? Quelles sont les caractéristiques de Nitro ?**

> **Exemple de réponse :**
> Le server engine de Nuxt 3 s'appelle **Nitro**.
> Sa plus grande caractéristique est l'**Universal Deployment**, c'est-à-dire qu'il peut être déployé sans configuration dans n'importe quel environnement (Node.js, Vercel, AWS Lambda, Edge Workers, etc.).
> D'autres caractéristiques incluent : le **HMR** pour les APIs backend (pas de redémarrage lors des modifications), l'**Auto Code Splitting** (accélération de la vitesse de démarrage) et un **Storage Layer** intégré (connexion facile à Redis ou KV Storage).

**Q : Que sont les Server Routes de Nuxt 3 ? Les avez-vous implémentés ?**

> **Exemple de réponse :**
> Oui, je les ai implémentés. Les Server Routes sont des fonctionnalités backend fournies par Nuxt 3 via le moteur Nitro, placées dans le répertoire `server/api`.
> Je les ai principalement utilisés dans ces scénarios :
>
> 1.  **Masquer les API Keys** : Lors de l'intégration de services tiers, éviter d'exposer les Secret Keys dans le code frontend.
> 2.  **CORS Proxy** : Résoudre les problèmes de requêtes cross-origin.
> 3.  **BFF (Backend for Frontend)** : Consolider plusieurs requêtes API en une, réduire les requêtes frontend et optimiser la structure de données.

### 5.2 Sitemap et Robots.txt

**Q : Comment implémenter un sitemap et robots.txt dynamiques dans Nuxt 3 ?**

> **Exemple de réponse :**
> J'utiliserais les Server Routes de Nuxt pour les implémenter.
> Pour le **Sitemap**, je créerais `server/routes/sitemap.xml.ts`, en appelant l'API backend pour obtenir la liste la plus récente d'articles ou de produits, puis en utilisant le package `sitemap` pour générer la chaîne XML et la renvoyer. Cela garantit que les moteurs de recherche obtiennent les liens les plus récents à chaque crawl.
> Pour le **Robots.txt**, je créerais `server/routes/robots.txt.ts`, renvoyant dynamiquement différentes règles selon les variables d'environnement (Production ou Staging), par exemple en configurant `Disallow: /` dans l'environnement Staging pour empêcher l'indexation.

### 5.3 SEO Meta Tags (complément)

**Q : Comment gérez-vous les SEO meta tags dans Nuxt 3 ? Avez-vous utilisé useHead ou useSeoMeta ?**

> **Exemple de réponse :**
> J'utilise principalement les Composables `useHead` et `useSeoMeta` intégrés dans Nuxt 3.
> `useHead` me permet de définir des balises `title`, `meta`, `link`, etc. Pour la configuration SEO pure, je préfère utiliser `useSeoMeta` car sa syntaxe est plus concise et Type-safe (indications de type), comme la définition directe des propriétés `ogTitle`, `description`, etc.
> Sur les pages dynamiques (comme les pages produits), je passe une Getter Function (par exemple `title: () => product.value.name`), pour que les Meta Tags se mettent à jour de façon réactive quand les données changent.

---

## 7. Références associées

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
