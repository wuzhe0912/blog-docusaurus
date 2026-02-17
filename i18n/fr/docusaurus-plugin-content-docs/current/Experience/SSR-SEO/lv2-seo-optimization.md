---
title: '[Lv2] Optimisation SEO avancée : Meta Tags dynamiques et intégration du tracking'
slug: /experience/ssr-seo/lv2-seo-optimization
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Dans un projet de plateforme multi-marques, implémenter un mécanisme de gestion SEO dynamique : injection dynamique de Meta Tags, intégration du tracking tiers (Google Analytics, Facebook Pixel), et gestion centralisée de la configuration SEO.

---

## 1. Points clés pour l'entretien

1. **Injection dynamique de Meta Tags** : Implémenter un mécanisme permettant la mise à jour dynamique des Meta Tags via l'API backend, supportant la configuration multi-marques/multi-sites.
2. **Intégration du tracking tiers** : Intégrer Google Tag Manager, Google Analytics et Facebook Pixel, avec chargement asynchrone sans bloquer la page.
3. **Gestion centralisée** : Utiliser Pinia Store pour gérer centralement la configuration SEO, facile à maintenir et à étendre.

---

## 2. Mécanisme d'injection dynamique de Meta Tags

### 2.1 Pourquoi des Meta Tags dynamiques sont-ils nécessaires ?

**Scénario problématique :**

- Plateforme multi-marques, chaque marque nécessite des configurations SEO différentes
- Besoin de mettre à jour dynamiquement le contenu SEO via le système de gestion backend
- Éviter de redéployer le frontend à chaque modification

**Solution :** Implémenter un mécanisme d'injection dynamique de Meta Tags

### 2.2 Détails d'implémentation

**Emplacement du fichier :** `src/common/hooks/useTrafficAnalysis.ts`

```typescript
// Lignes 38-47
case TRAFFIC_ANALYSIS.Enums.meta_tag:
  Object.keys(trafficAnalysisConfig).forEach((name) => {
    const metaObj = trafficAnalysisConfig as { [key: string]: string }
    const content = metaObj[name]

    const meta = document.createElement("meta")
    meta.setAttribute("name", name)
    meta.setAttribute("content", content)
    document.head.appendChild(meta)
  })
  break
```

**Description fonctionnelle :**

- Support de l'injection dynamique de plusieurs types de meta tags
- Configuration de différents contenus meta via la configuration backend
- Support des configurations SEO personnalisées pour différentes marques/sites
- Insertion dynamique dans `<head>` lors de l'exécution côté client

### 2.3 Exemple d'utilisation

```typescript
// Configuration obtenue de l'API backend
const trafficAnalysisConfig = {
  description: 'Plateforme de jeux multi-marques',
  keywords: 'jeux,divertissement,jeux en ligne',
  author: 'Company Name',
};

// Injection dynamique de Meta Tags
trafficAnalysisConfig.forEach((config) => {
  // Créer et insérer le meta tag
});
```

**Avantages :**

- ✅ Mise à jour du contenu SEO sans redéploiement
- ✅ Support de la configuration multi-marques
- ✅ Gestion centralisée

**Limitations :**

- ⚠️ Injection côté client, les moteurs de recherche peuvent ne pas crawler complètement
- ⚠️ Recommandé d'utiliser avec SSR pour de meilleurs résultats

---

## 3. Intégration Google Tag Manager / Google Analytics

### 3.1 Mécanisme de chargement asynchrone

**Emplacement du fichier :** `src/common/hooks/useTrafficAnalysis.ts`

```typescript
// Lignes 13-35
case TRAFFIC_ANALYSIS.Enums.google_tag:
  if (!trafficAnalysisConfig.tag_id) {
    console.warn("tag_id is empty")
    return
  }

  try {
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trafficAnalysisConfig.tag_id}`
    document.head.appendChild(script)

    const script2 = document.createElement("script")
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trafficAnalysisConfig.tag_id}');
    `
    document.head.appendChild(script2)
  } catch (error) {
    console.error("Error loading GTM:", error)
  }
  break
```

**Implémentation clé :**

- Utilisation de `script.async = true` pour le chargement asynchrone, sans bloquer le rendu de la page
- Création dynamique et insertion de balises `<script>`
- Support de différents IDs de tracking via la configuration backend
- Inclut un mécanisme de gestion des erreurs

### 3.2 Pourquoi utiliser le chargement asynchrone ?

| Méthode de chargement       | Impact                | Recommandation    |
| -------------- | ------------------- | ------- |
| **Chargement synchrone**   | ❌ Bloque le rendu de la page     | Non recommandé  |
| **Chargement asynchrone** | ✅ Ne bloque pas la page       | ✅ Recommandé |
| **Chargement différé**   | ✅ Charge après la page | À considérer  |

**Considérations de performance :**

- Les scripts de tracking ne devraient pas affecter la vitesse de chargement de la page
- L'attribut `async` assure le non-blocage
- La gestion des erreurs évite que les échecs de chargement n'affectent la page

---

## 4. Tracking Facebook Pixel

### 4.1 Tracking des pages vues

**Emplacement du fichier :** `src/router/index.ts`

```typescript
// Lignes 102-106
router.afterEach(() => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
});
```

**Description fonctionnelle :**

- Déclenche le tracking des pages vues Facebook Pixel après chaque changement de route
- Support du tracking de conversion des publicités Facebook
- Utilisation de `router.afterEach` pour s'assurer que le déclenchement se fait après la fin du changement de route

### 4.2 Pourquoi implémenter dans le Router ?

**Avantages :**

- ✅ Gestion centralisée, toutes les routes sont automatiquement trackées
- ✅ Pas besoin d'ajouter manuellement du code de tracking sur chaque page
- ✅ Assure la cohérence du tracking

**Notes :**

- Vérifier que `window.fbq` est chargé
- Éviter l'exécution dans un environnement SSR (vérification de l'environnement nécessaire)

---

## 5. Gestion centralisée de la configuration SEO

### 5.1 Gestion avec Pinia Store

**Emplacement du fichier :** `src/stores/TrafficAnalysisStore.ts`

```typescript
// Lignes 25-38
function updateTrafficAnalysisConfigMap(data: Response.ISetting) {
  if ('digital_analytics' in data) {
    const analytics = JSON.parse(data.digital_analytics);
    Object.keys(analytics).forEach((service) => {
      const analysisKey = service as TrafficAnalysisKey;
      if (analysisKey in trafficAnalysisConfigMap) {
        trafficAnalysisConfigMap[analysisKey] = {
          ...trafficAnalysisConfigMap[analysisKey],
          ...analytics[analysisKey],
        };
      }
    });
  }
}
```

**Description fonctionnelle :**

- Gestion centralisée des configurations liées au SEO via Pinia Store
- Support des mises à jour dynamiques de configuration depuis l'API backend
- Gestion centralisée de multiples configurations de services SEO (Meta Tags, GA, GTM, Facebook Pixel, etc.)

### 5.2 Avantages de l'architecture

```
┌─────────────────────────────────────┐
│   SEO Configuration Store            │
│   (TrafficAnalysisStore.ts)         │
├─────────────────────────────────────┤
│   - Centralized management          │
│   - API-driven updates               │
│   - Multi-service support            │
└─────────────────────────────────────┘
         │
         ├──> Meta Tags Injection
         ├──> Google Analytics
         ├──> Google Tag Manager
         └──> Facebook Pixel
```

**Avantages :**

- ✅ Source de données unique, facile à maintenir
- ✅ Support des mises à jour dynamiques, sans redéploiement
- ✅ Gestion des erreurs et validation unifiées
- ✅ Facile à étendre avec de nouveaux services de tracking

---

## 6. Processus d'implémentation complet

### 6.1 Processus d'initialisation

```typescript
// 1. Au démarrage de l'App, obtenir la configuration du Store
const trafficAnalysisStore = useTrafficAnalysisStore();

// 2. Charger la configuration depuis l'API backend
await trafficAnalysisStore.fetchSettings();

// 3. Exécuter la logique d'injection correspondante selon le type de configuration
const config = trafficAnalysisStore.getConfig('meta_tag');
if (config) {
  injectMetaTags(config);
}

const gaConfig = trafficAnalysisStore.getConfig('google_tag');
if (gaConfig) {
  loadGoogleAnalytics(gaConfig.tag_id);
}
```

### 6.2 Support multi-marques

```typescript
// Différentes marques peuvent avoir différentes configurations SEO
const brandAConfig = {
  meta_tag: {
    description: 'Description de la Marque A',
    keywords: 'MarqueA,jeux',
  },
  google_tag: {
    tag_id: 'GA-XXXXX-A',
  },
};

const brandBConfig = {
  meta_tag: {
    description: 'Description de la Marque B',
    keywords: 'MarqueB,divertissement',
  },
  google_tag: {
    tag_id: 'GA-YYYYY-B',
  },
};
```

---

## 7. Points clés pour l'entretien

### 7.1 Meta Tags dynamiques

**Vous pouvez répondre ainsi :**

> Dans le projet, j'ai implémenté un mécanisme d'injection dynamique de Meta Tags. Comme c'était une plateforme multi-marques, chaque marque nécessitait des configurations SEO différentes, et il fallait pouvoir les mettre à jour dynamiquement via le système de gestion backend. En utilisant JavaScript pour créer dynamiquement des balises `<meta>` et les insérer dans `<head>`, nous pouvons mettre à jour le contenu SEO sans redéploiement.

**Points clés :**

- ✅ Méthode d'implémentation de l'injection dynamique
- ✅ Support multi-marques/multi-sites
- ✅ Intégration de la gestion backend

### 7.2 Intégration du tracking tiers

**Vous pouvez répondre ainsi :**

> J'ai intégré Google Analytics, Google Tag Manager et Facebook Pixel. Pour ne pas affecter les performances de la page, j'ai utilisé le chargement asynchrone avec `script.async = true`, assurant que les scripts de tracking ne bloquent pas le rendu de la page. De plus, j'ai ajouté le tracking des pages vues Facebook Pixel dans le hook `afterEach` du Router, assurant que tous les changements de route sont correctement trackés.

**Points clés :**

- ✅ Implémentation du chargement asynchrone
- ✅ Considérations de performance
- ✅ Intégration avec le Router

### 7.3 Gestion centralisée

**Vous pouvez répondre ainsi :**

> J'utilise Pinia Store pour gérer centralement toutes les configurations liées au SEO, incluant Meta Tags, Google Analytics, Facebook Pixel, etc. L'avantage est une source de données unique facile à maintenir, et la possibilité de mettre à jour dynamiquement la configuration depuis l'API backend sans redéployer le frontend.

**Points clés :**

- ✅ Avantages de la gestion centralisée
- ✅ Mécanisme de mise à jour piloté par API
- ✅ Facile à étendre

---

## 8. Suggestions d'amélioration

### 8.1 Support SSR

**Limitations actuelles :**

- Les Meta Tags dynamiques sont injectés côté client, les moteurs de recherche peuvent ne pas crawler complètement

**Direction d'amélioration :**

- Passer l'injection des Meta Tags en mode SSR
- Générer le HTML complet côté serveur au lieu de l'injection côté client

### 8.2 Données structurées

**Implémentation suggérée :**

- Données structurées JSON-LD
- Support du balisage Schema.org
- Améliorer la richesse des résultats de recherche

### 8.3 Sitemap et Robots.txt

**Implémentation suggérée :**

- Génération automatique du XML sitemap
- Mise à jour dynamique des informations de routes
- Configuration du robots.txt

---

## 9. Résumé pour l'entretien

**Vous pouvez répondre ainsi :**

> Dans le projet, j'ai implémenté un mécanisme complet d'optimisation SEO. Premièrement, j'ai implémenté l'injection dynamique de Meta Tags permettant de mettre à jour dynamiquement le contenu SEO via l'API backend, ce qui est particulièrement important pour les plateformes multi-marques. Deuxièmement, j'ai intégré Google Analytics, Google Tag Manager et Facebook Pixel, en utilisant le chargement asynchrone pour ne pas affecter les performances de la page. Enfin, j'utilise Pinia Store pour gérer centralement toutes les configurations SEO, facilitant la maintenance et l'extension.

**Points clés :**

- ✅ Mécanisme d'injection dynamique de Meta Tags
- ✅ Intégration du tracking tiers (chargement asynchrone)
- ✅ Architecture de gestion centralisée
- ✅ Support multi-marques/multi-sites
- ✅ Expérience pratique en projet
