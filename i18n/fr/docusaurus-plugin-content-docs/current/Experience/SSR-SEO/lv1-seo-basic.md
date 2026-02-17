---
title: '[Lv1] Implémentation basique du SEO : Modes de Router et Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Dans un projet de plateforme multi-marques, implémentation de la configuration SEO de base : Router History Mode, structure des Meta Tags et SEO des pages statiques.

---

## 1. Points clés de réponse en entretien

1. **Sélection du mode Router** : Utiliser le History Mode plutôt que le Hash Mode pour fournir une structure d'URL propre.
2. **Fondamentaux des Meta Tags** : Implémenter des meta tags SEO complets, incluant Open Graph et Twitter Card.
3. **SEO des pages statiques** : Configurer des éléments SEO complets pour la Landing Page.

---

## 2. Configuration du Router History Mode

### 2.1 Pourquoi choisir le History Mode ?

**Emplacement du fichier :** `quasar.config.js`

```javascript
// Ligne 82
vueRouterMode: "history", // Utiliser le mode history plutôt que le mode hash
```

**Avantages SEO :**

| Mode             | Exemple d'URL | Impact SEO                                |
| ---------------- | ------------- | ----------------------------------------- |
| **Hash Mode**    | `/#/home`     | ❌ Difficile à indexer par les moteurs     |
| **History Mode** | `/home`       | ✅ URL propre, facile à indexer            |

**Différences clés :**

- Le History Mode génère des URLs propres (ex : `/home` au lieu de `/#/home`)
- Les moteurs de recherche peuvent indexer et crawler plus facilement
- Meilleure expérience utilisateur et de partage
- Nécessite une configuration backend (pour éviter les erreurs 404)

### 2.2 Exigences de configuration backend

Lors de l'utilisation du History Mode, une configuration backend est nécessaire :

```nginx
# Exemple Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Cela garantit que toutes les routes renvoient `index.html`, et le Router frontend gère le routage.

---

## 3. Structure basique des Meta Tags

### 3.1 Meta Tags SEO basiques

**Emplacement du fichier :** `template/*/public/landingPage/index.html`

```html
<!-- Meta Tags basiques -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="Mise à jour immédiate partout et à tout moment. Programme test VIP réservé aux 100 premiers membres."
/>
```

**Explication :**

- `title` : Titre de la page, affecte l'affichage dans les résultats de recherche
- `keywords` : Mots-clés (importance moindre dans le SEO moderne, mais configuration recommandée)
- `description` : Description de la page, s'affiche dans les résultats de recherche

### 3.2 Open Graph Tags (partage sur les réseaux sociaux)

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="AMUSE VIP" />
<meta property="og:title" content="AMUSE VIP" />
<meta property="og:type" content="website" />
<meta property="og:url" content="#" />
<meta property="og:description" content="..." />
<meta property="og:image" content="images/amuse.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**Utilisation :**

- Aperçu affiché lors du partage sur les réseaux sociaux comme Facebook, LinkedIn
- Taille recommandée pour `og:image` : 1200x630px
- `og:type` peut être défini comme `website`, `article`, etc.

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Types de Twitter Card :**

- `summary` : Petite carte
- `summary_large_image` : Carte avec grande image (recommandé)

---

## 4. Implémentation SEO pour Landing Page statique

### 4.1 Liste complète des éléments SEO

Dans la Landing Page du projet, les éléments SEO suivants ont été implémentés :

```html
✅ Balise Title ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn, etc.) ✅ Twitter Card tags ✅ Canonical URL ✅ Configuration
Favicon
```

### 4.2 Exemple d'implémentation

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO basique -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="Mise à jour immédiate partout et à tout moment. Programme test VIP réservé aux 100 premiers membres."
    />

    <!-- Open Graph -->
    <meta property="og:site_name" content="AMUSE VIP" />
    <meta property="og:title" content="AMUSE VIP" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="images/amuse.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AMUSE VIP" />
    <meta name="twitter:description" content="..." />
    <meta name="twitter:image" content="images/amuse.webp" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
    <!-- Contenu de la page -->
  </body>
</html>
```

---

## 5. Points clés pour l'entretien

### 5.1 Sélection du mode Router

**Pourquoi choisir le History Mode ?**

- Fournit des URLs propres, améliore l'effet SEO
- Les moteurs de recherche peuvent indexer plus facilement
- Meilleure expérience utilisateur

**Points d'attention ?**

- Nécessite un support de configuration backend (éviter les 404 lors de l'accès direct aux routes)
- Nécessite la configuration d'un mécanisme de fallback

### 5.2 Importance des Meta Tags

**Meta Tags basiques :**

- `title` : Affecte l'affichage dans les résultats de recherche
- `description` : Affecte le taux de clics
- `keywords` : Importance moindre dans le SEO moderne, mais configuration recommandée

**Meta Tags pour réseaux sociaux :**

- Open Graph : Aperçu de partage sur Facebook, LinkedIn et autres plateformes
- Twitter Card : Aperçu de partage sur Twitter
- Taille d'image recommandée : 1200x630px

---

## 6. Meilleures pratiques

1. **Balise Title**

   - Contrôler la longueur entre 50-60 caractères
   - Inclure les mots-clés principaux
   - Chaque page doit avoir un title unique

2. **Description**

   - Contrôler la longueur entre 150-160 caractères
   - Décrire le contenu de la page de façon concise
   - Inclure un appel à l'action (CTA)

3. **Image Open Graph**

   - Taille : 1200x630px
   - Taille de fichier : < 1MB
   - Utiliser des images de haute qualité

4. **Canonical URL**
   - Éviter les problèmes de contenu dupliqué
   - Pointer vers l'URL de la version principale

---

## 7. Résumé d'entretien

**Vous pouvez répondre ainsi :**

> Dans le projet, j'ai choisi d'utiliser le History Mode de Vue Router plutôt que le Hash Mode, car le History Mode fournit une structure d'URL propre plus favorable au SEO. En même temps, j'ai implémenté des meta tags SEO complets pour la Landing Page, incluant les title, description, keywords basiques, ainsi que les Open Graph et Twitter Card tags, garantissant un affichage correct de l'aperçu lors du partage sur les réseaux sociaux.

**Points clés :**

- ✅ Sélection et raisons du Router History Mode
- ✅ Structure complète des Meta Tags
- ✅ Optimisation du partage sur les réseaux sociaux
- ✅ Expérience de projet réelle
