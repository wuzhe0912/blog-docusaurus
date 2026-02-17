---
title: '[Lv2] Fonctionnalites Nuxt 3 Server : Server Routes et Sitemap dynamique'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Maitriser les fonctionnalites du Nitro Server Engine de Nuxt 3, implementer les Server Routes (API Routes), le Sitemap dynamique et le Robots.txt pour ameliorer le SEO et la flexibilite architecturale du site web.

---

## 1. Points cles de reponse en entretien

1.  **Server Routes (API Routes)** : Utiliser `server/api` ou `server/routes` pour construire la logique backend. Couramment utilise pour masquer les API Keys, gerer le CORS, architecture BFF (Backend for Frontend).
2.  **Sitemap dynamique** : Generation dynamique de XML via Server Routes (`server/routes/sitemap.xml.ts`), garantissant que les moteurs de recherche puissent indexer le contenu le plus recent.
3.  **Robots.txt** : Egalement genere dynamiquement via Server Routes ou configure via Nuxt Config, pour controler les permissions d'acces des crawlers.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Qu'est-ce que Nitro ?

Nitro est le nouveau moteur serveur de Nuxt 3, permettant de deployer les applications Nuxt partout (Universal Deployment). Ce n'est pas seulement un serveur, mais un puissant outil de build et de runtime.

### 2.2 Caracteristiques principales de Nitro

1.  **Deploiement multiplateforme (Universal Deployment)** :
    Peut etre compile en Node.js server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers et autres formats. Deploiement zero-config sur les principales plateformes.

2.  **Leger et rapide (Lightweight & Fast)** :
    Temps de cold start extremement court et bundle size genere tres petit (minimum < 1MB).

3.  **Division automatique du code (Auto Code Splitting)** :
    Analyse automatiquement les dependances des Server Routes et effectue le code splitting pour assurer la vitesse de demarrage.

4.  **HMR (Hot Module Replacement)** :
    Non seulement le frontend a le HMR, Nitro permet aussi le HMR pour le developpement d'API backend. Modification des fichiers `server/` sans redemarrage du serveur.

5.  **Storage Layer (Unstorage)** :
    API Storage unifiee integree, permettant de se connecter facilement a Redis, GitHub, FS, Memory et autres interfaces de stockage.

6.  **Server Assets** :
    Acces pratique aux fichiers de ressources statiques cote Server.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Que sont les Server Routes ?

Nuxt 3 integre le moteur serveur **Nitro**, permettant aux developpeurs d'ecrire des APIs backend directement dans le projet. Ces fichiers sont places dans les repertoires `server/api` ou `server/routes` et sont automatiquement mappes comme endpoints API.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 Dans quelles situations les utiliser ? (Question d'entretien courante)

**1. Masquer les informations sensibles (Secret Management)**
Le frontend ne peut pas stocker les Private API Keys en toute securite. En utilisant les Server Routes comme intermediaire, on peut acceder a la Key via des variables d'environnement cote Server et ne renvoyer que le resultat au frontend.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // L'API Key n'est utilisee que cote Server, non exposee au Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. Gestion des problemes CORS (Proxy)**
Quand une API externe ne supporte pas le CORS, on peut utiliser les Server Routes comme Proxy. Le navigateur envoie des requetes au Nuxt Server (meme origine), le Nuxt Server envoie des requetes a l'API externe (pas de restrictions CORS).

**3. Backend for Frontend (BFF)**
Agreger, filtrer ou convertir le format des donnees de plusieurs APIs backend sur le Nuxt Server, puis les renvoyer au frontend en une seule fois. Reduit le nombre de requetes frontend et la taille du Payload.

**4. Gestion des Webhooks**
Recevoir les notifications Webhook de services tiers (comme les paiements, CMS).

---

## 4. Implementation du Sitemap dynamique

### 3.1 Pourquoi un Sitemap dynamique est-il necessaire ?

Pour les sites web dont le contenu change frequemment (comme l'e-commerce, les sites d'actualites), un `sitemap.xml` genere statiquement devient rapidement obsolete. En utilisant les Server Routes, on peut generer dynamiquement le Sitemap le plus recent a chaque requete.

### 3.2 Methode d'implementation : Generation manuelle

Creer `server/routes/sitemap.xml.ts` :

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. Obtenir toutes les donnees de routes dynamiques depuis la base de donnees ou l'API
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

  // 4. Definir le Header et renvoyer le XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 Methode d'implementation : Utilisation d'un module (`@nuxtjs/sitemap`)

Pour les besoins standards, l'utilisation du module officiel est recommandee :

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // Specifier une API pour fournir la liste d'URLs dynamiques
    ],
  },
});
```

---

## 5. Implementation du Robots.txt dynamique

### 4.1 Methode d'implementation

Creer `server/routes/robots.txt.ts` :

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // Determiner les regles dynamiquement selon l'environnement
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

## 6. Points cles pour l'entretien

### 5.1 Nitro Engine & Server Routes

**Q : Quel est le server engine de Nuxt 3 ? Quelles sont les caracteristiques de Nitro ?**

> **Exemple de reponse :**
> Le server engine de Nuxt 3 s'appelle **Nitro**.
> Sa plus grande caracteristique est l'**Universal Deployment**, c'est-a-dire qu'il peut etre deploye sans configuration dans n'importe quel environnement (Node.js, Vercel, AWS Lambda, Edge Workers, etc.).
> D'autres caracteristiques incluent : le **HMR** pour les APIs backend (pas de redemarrage lors des modifications), l'**Auto Code Splitting** (acceleration de la vitesse de demarrage) et un **Storage Layer** integre (connexion facile a Redis ou KV Storage).

**Q : Que sont les Server Routes de Nuxt 3 ? Les avez-vous implementes ?**

> **Exemple de reponse :**
> Oui, je les ai implementes. Les Server Routes sont des fonctionnalites backend fournies par Nuxt 3 via le moteur Nitro, placees dans le repertoire `server/api`.
> Je les ai principalement utilises dans ces scenarios :
>
> 1.  **Masquer les API Keys** : Lors de l'integration de services tiers, eviter d'exposer les Secret Keys dans le code frontend.
> 2.  **CORS Proxy** : Resoudre les problemes de requetes cross-origin.
> 3.  **BFF (Backend for Frontend)** : Consolider plusieurs requetes API en une, reduire les requetes frontend et optimiser la structure de donnees.

### 5.2 Sitemap et Robots.txt

**Q : Comment implementer un sitemap et robots.txt dynamiques dans Nuxt 3 ?**

> **Exemple de reponse :**
> J'utiliserais les Server Routes de Nuxt pour les implementer.
> Pour le **Sitemap**, je creerais `server/routes/sitemap.xml.ts`, en appelant l'API backend pour obtenir la liste la plus recente d'articles ou de produits, puis en utilisant le package `sitemap` pour generer la chaine XML et la renvoyer. Cela garantit que les moteurs de recherche obtiennent les liens les plus recents a chaque crawl.
> Pour le **Robots.txt**, je creerais `server/routes/robots.txt.ts`, renvoyant dynamiquement differentes regles selon les variables d'environnement (Production ou Staging), par exemple en configurant `Disallow: /` dans l'environnement Staging pour empecher l'indexation.

### 5.3 SEO Meta Tags (complement)

**Q : Comment gerez-vous les SEO meta tags dans Nuxt 3 ? Avez-vous utilise useHead ou useSeoMeta ?**

> **Exemple de reponse :**
> J'utilise principalement les Composables `useHead` et `useSeoMeta` integres dans Nuxt 3.
> `useHead` me permet de definir des balises `title`, `meta`, `link`, etc. Pour la configuration SEO pure, je prefere utiliser `useSeoMeta` car sa syntaxe est plus concise et Type-safe (indications de type), comme la definition directe des proprietes `ogTitle`, `description`, etc.
> Sur les pages dynamiques (comme les pages produits), je passe une Getter Function (par exemple `title: () => product.value.name`), pour que les Meta Tags se mettent a jour de facon reactive quand les donnees changent.

---

## 7. References associees

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
