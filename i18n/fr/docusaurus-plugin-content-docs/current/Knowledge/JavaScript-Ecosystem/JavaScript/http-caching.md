---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> Qu'est-ce que le cache HTTP ? Pourquoi est-il important ?

Le cache HTTP est une technique qui stocke temporairement les réponses HTTP côté client (navigateur) ou sur des serveurs intermédiaires, afin de pouvoir utiliser directement les données mises en cache lors des requêtes suivantes, sans avoir à les redemander au serveur.

### Cache vs stockage temporaire : quelle est la différence ?

Dans la documentation technique, ces deux termes sont souvent utilisés de manière interchangeable, mais ils ont en réalité des significations différentes :

#### Cache

**Définition** : Copies de données stockées pour l'**optimisation des performances**, mettant l'accent sur la "réutilisation" et l'"accès plus rapide".

**Caractéristiques** :

- ✅ L'objectif est d'améliorer les performances
- ✅ Les données peuvent être réutilisées
- ✅ Politiques d'expiration clairement définies
- ✅ Généralement des copies des données originales

**Exemple** :

```javascript
// HTTP Cache - Mettre en cache les réponses d'API
Cache-Control: max-age=3600  // Cache pendant 1 heure

// Memory Cache - Mettre en cache les résultats de calcul
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // Réutiliser le cache
  const result = /* calcul */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage (Stockage temporaire)

**Définition** : Données stockées **temporairement**, mettant l'accent sur la "temporalité" et "seront supprimées".

**Caractéristiques** :

- ✅ L'objectif est le stockage temporaire
- ✅ Pas nécessairement réutilisé
- ✅ Cycle de vie généralement court
- ✅ Peut contenir des états intermédiaires

**Exemple** :

```javascript
// sessionStorage - Stocker temporairement les entrées utilisateur
sessionStorage.setItem('formData', JSON.stringify(form)); // Supprimé à la fermeture de l'onglet

// Stockage temporaire des fichiers téléchargés
const tempFile = await uploadToTemp(file); // Supprimer après traitement
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Tableau comparatif

| Caractéristique | Cache                    | Temporary Storage (Stockage temporaire) |
| --------------- | ------------------------ | --------------------------------------- |
| **Objectif principal** | Optimisation des performances | Stockage temporaire              |
| **Réutilisation** | Oui, lectures multiples | Pas nécessairement                      |
| **Cycle de vie** | Basé sur la politique   | Généralement court                      |
| **Usage typique** | HTTP Cache, Memory Cache | sessionStorage, fichiers temporaires   |
| **Équivalent anglais** | Cache                | Temp / Temporary / Buffer               |

#### Différences dans l'application pratique

```javascript
// ===== Scénarios d'utilisation du Cache =====

// 1. HTTP Cache : Réutiliser les réponses d'API
fetch('/api/users') // Première requête
  .then((response) => response.json());

fetch('/api/users') // Deuxième lecture depuis le cache
  .then((response) => response.json());

// 2. Cache des résultats de calcul
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // Réutiliser
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Scénarios d'utilisation du Stockage temporaire =====

// 1. Stockage temporaire des données de formulaire (prévenir la fermeture accidentelle)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. Stockage temporaire des fichiers téléchargés
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // Stockage temporaire
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // Supprimer après utilisation
  return processed;
}

// 3. Stockage temporaire des résultats intermédiaires
const tempResults = []; // Stocker les résultats intermédiaires
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // Plus nécessaire après utilisation
```

#### Application dans le développement web

```javascript
// HTTP Cache - Stockage à long terme, réutilisation
Cache-Control: public, max-age=31536000, immutable
// → Le navigateur mettra ce fichier en cache pendant un an et le réutilisera

// sessionStorage (Stockage temporaire) - Stockage temporaire, supprimé à la fermeture
sessionStorage.setItem('tempData', data);
// → Valide uniquement dans l'onglet actuel, supprimé à la fermeture

// localStorage (Stockage à long terme) - Entre les deux
localStorage.setItem('userPreferences', prefs);
// → Stockage persistant, mais pas pour l'optimisation des performances
```

### Pourquoi est-il important de distinguer ces deux concepts ?

1. **Décisions de conception** :

   - Besoin d'optimisation des performances ? → Utiliser le cache
   - Besoin de stockage temporaire ? → Utiliser le stockage temporaire

2. **Gestion des ressources** :

   - Cache : Focus sur le taux de réussite et les politiques d'expiration
   - Stockage temporaire : Focus sur le moment du nettoyage et les limites de capacité

3. **Réponses en entretien** :

   - "Comment optimiser les performances" → Parler des stratégies de cache
   - "Comment gérer les données temporaires" → Parler des solutions de stockage temporaire

Dans cet article, nous discutons principalement du **Cache**, en particulier du mécanisme de cache HTTP.

### Avantages du cache

1. **Réduction des requêtes réseau** : Lire directement depuis le cache local, sans envoyer de requêtes HTTP
2. **Réduction de la charge serveur** : Moins de requêtes à traiter par le serveur
3. **Vitesse de chargement des pages plus rapide** : La lecture du cache local est beaucoup plus rapide que les requêtes réseau
4. **Économie de bande passante** : Réduction du volume de transfert de données
5. **Amélioration de l'expérience utilisateur** : Réponses de page plus rapides, utilisation plus fluide

### Types de cache

```text
┌─────────────────────────────────────┐
│    Hiérarchie du cache navigateur   │
├─────────────────────────────────────┤
│  1. Memory Cache (Cache mémoire)    │
│     - Le plus rapide, petite        │
│       capacité                      │
│     - Supprimé à la fermeture       │
│       de l'onglet                   │
├─────────────────────────────────────┤
│  2. Disk Cache (Cache disque)       │
│     - Plus lent, grande capacité    │
│     - Stockage persistant           │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Contrôle total du             │
│       développeur                   │
│     - Support des applications      │
│       hors ligne                    │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> Quelles sont les stratégies de cache HTTP ?

### Classification des stratégies de cache

```text
Stratégies de cache HTTP
├── Cache fort (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── Cache de négociation (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Cache fort (Strong Cache / Fresh)

**Caractéristique** : Le navigateur lit directement depuis le cache local sans envoyer de requête au serveur.

#### Cache-Control (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Directives courantes** :

```javascript
// 1. max-age : Durée de validité du cache (secondes)
Cache-Control: max-age=3600  // Cache pendant 1 heure

// 2. no-cache : Validation auprès du serveur requise (cache de négociation)
Cache-Control: no-cache

// 3. no-store : Ne pas mettre en cache du tout
Cache-Control: no-store

// 4. public : Peut être mis en cache par n'importe quel cache (navigateur, CDN)
Cache-Control: public, max-age=31536000

// 5. private : Seul le navigateur peut mettre en cache
Cache-Control: private, max-age=3600

// 6. immutable : La ressource ne change jamais (avec nom de fichier hash)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate : Après expiration, validation auprès du serveur obligatoire
Cache-Control: max-age=3600, must-revalidate
```

#### Expires (HTTP/1.0, obsolète)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Problèmes** :

- Utilise un temps absolu, dépend de l'heure du client
- Une heure client inexacte entraîne un dysfonctionnement du cache
- Remplacé par `Cache-Control`

### 2. Cache de négociation (Negotiation Cache / Validation)

**Caractéristique** : Le navigateur envoie une requête au serveur pour vérifier si la ressource a été mise à jour.

#### Last-Modified / If-Modified-Since

```http
# Réponse du serveur (première requête)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Requête du navigateur (requêtes suivantes)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Processus** :

1. Première requête : Le serveur renvoie `Last-Modified`
2. Requêtes suivantes : Le navigateur inclut `If-Modified-Since`
3. Ressource non modifiée : Le serveur renvoie `304 Not Modified`
4. Ressource modifiée : Le serveur renvoie `200 OK` et la nouvelle ressource

#### ETag / If-None-Match

```http
# Réponse du serveur (première requête)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Requête du navigateur (requêtes suivantes)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Avantages** :

- Plus précis que `Last-Modified`
- Ne dépend pas du temps, utilise le hash du contenu
- Peut détecter les changements en dessous de la seconde

### Last-Modified vs ETag

| Caractéristique | Last-Modified            | ETag                             |
| --------------- | ------------------------ | -------------------------------- |
| Précision       | Niveau seconde           | Hash du contenu, plus précis     |
| Performance     | Plus rapide              | Calcul de hash nécessaire, plus lent |
| Cas d'utilisation | Ressources statiques générales | Ressources nécessitant un contrôle précis |
| Priorité        | Basse                    | Haute (ETag prioritaire)         |

## 3. How does browser caching work?

> Comment fonctionne le cache du navigateur ?

### Flux de cache complet

```text
┌──────────────────────────────────────────────┐
│    Flux de requête de ressources du           │
│             navigateur                        │
└──────────────────────────────────────────────┘
                    ↓
         1. Vérifier Memory Cache
                    ↓
            ┌───────┴────────┐
            │ Cache trouvé ?  │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Vérifier Disk Cache
                    ↓
            ┌───────┴────────┐
            │ Cache trouvé ?  │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Vérifier Service Worker
                    ↓
            ┌───────┴────────┐
            │ Cache trouvé ?  │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Vérifier l'expiration du cache
                    ↓
            ┌───────┴────────┐
            │    Expiré ?     │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Valider avec le cache de négociation
                    ↓
            ┌───────┴────────┐
            │   Ressource     │
            │   modifiée ?    │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Demander une nouvelle ressource au serveur
                    ↓
            ┌───────┴────────┐
            │ Renvoyer        │
            │ nouvelle        │
            │ ressource       │
            │ (200 OK)        │
            └────────────────┘
```

### Exemple pratique

```javascript
// Première requête
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== Nouvelle requête dans l'heure ==========
// Cache fort : Lire directement depuis le local, sans envoyer de requête
// Status: 200 OK (from disk cache)

// ========== Nouvelle requête après 1 heure ==========
// Cache de négociation : Envoyer une requête de validation
GET /api/data.json
If-None-Match: "abc123"

// Ressource non modifiée
Response:
  304 Not Modified
  (Pas de body, utiliser le cache local)

// Ressource modifiée
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> Quelles sont les stratégies de cache les plus courantes ?

### 1. Stratégie de cache permanent (pour les ressources statiques)

```javascript
// HTML : Ne pas mettre en cache, vérifier à chaque fois
Cache-Control: no-cache

// CSS/JS (avec hash) : Cache permanent
Cache-Control: public, max-age=31536000, immutable
// Nom de fichier : main.abc123.js
```

**Principe** :

- Le HTML n'est pas mis en cache, garantissant que l'utilisateur obtient la dernière version
- CSS/JS utilisent des noms de fichiers avec hash, le nom change quand le contenu change
- Les anciennes versions ne sont pas utilisées, les nouvelles sont retéléchargées

### 2. Stratégie pour les ressources fréquemment mises à jour

```javascript
// Données d'API : Cache de courte durée + cache de négociation
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Stratégie pour les ressources d'images

```javascript
// Avatar utilisateur : Cache à moyen terme
Cache-Control: public, max-age=86400  // 1 jour

// Logo, icônes : Cache à long terme
Cache-Control: public, max-age=2592000  // 30 jours

// Images dynamiques : Cache de négociation
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Recommandations de cache par type de ressource

```javascript
const cachingStrategies = {
  // Fichiers HTML
  html: 'Cache-Control: no-cache',

  // Ressources statiques avec hash
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // Ressources statiques rarement mises à jour
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // Données d'API
  apiData: 'Cache-Control: private, max-age=60',

  // Données spécifiques à l'utilisateur
  userData: 'Cache-Control: private, no-cache',

  // Données sensibles
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Cache Service Worker

Le Service Worker offre le contrôle de cache le plus flexible, permettant aux développeurs de contrôler entièrement la logique de cache.

### Utilisation de base

```javascript
// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Fichier Service Worker
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// Événement d'installation : Mettre en cache les ressources statiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interception des requêtes : Utiliser la stratégie de cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Stratégie Cache First
      return response || fetch(event.request);
    })
  );
});

// Événement d'activation : Nettoyer l'ancien cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Stratégies de cache courantes

#### 1. Cache First (Cache en premier)

```javascript
// Adapté pour : Ressources statiques
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First (Réseau en premier)

```javascript
// Adapté pour : Requêtes d'API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre à jour le cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Réseau échoué, utiliser le cache
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate (Obsolète pendant la revalidation)

```javascript
// Adapté pour : Ressources nécessitant des réponses rapides tout en restant à jour
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Renvoyer le cache, mettre à jour en arrière-plan
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Comment implémenter le Cache Busting ?

Le Cache Busting est une technique qui garantit que les utilisateurs obtiennent les ressources les plus récentes.

### Méthode 1 : Hash dans le nom de fichier (recommandée)

```javascript
// Utiliser des outils de bundling comme Webpack/Vite
// Sortie : main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- Mettre à jour automatiquement la référence -->
<script src="/js/main.abc123.js"></script>
```

**Avantages** :

- ✅ Le nom de fichier change, forçant le téléchargement du nouveau fichier
- ✅ L'ancienne version reste en cache, pas de gaspillage
- ✅ Meilleure pratique

### Méthode 2 : Numéro de version dans le Query String

```html
<!-- Mettre à jour manuellement le numéro de version -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Inconvénients** :

- ❌ Certains CDN ne mettent pas en cache les ressources avec un query string
- ❌ Maintenance manuelle du numéro de version nécessaire

### Méthode 3 : Horodatage

```javascript
// Utiliser en environnement de développement
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Usage** :

- Éviter le cache en environnement de développement
- Inadapté à l'environnement de production (chaque fois une nouvelle requête)

## 7. Common caching interview questions

> Questions d'entretien courantes sur le cache

### Question 1 : Comment empêcher le HTML d'être mis en cache ?

<details>
<summary>Cliquez pour voir la réponse</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

Ou utiliser des balises meta :

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Question 2 : Pourquoi utiliser ETag plutôt que seulement Last-Modified ?

<details>
<summary>Cliquez pour voir la réponse</summary>

**Avantages de l'ETag** :

1. **Plus précis** : Peut détecter les changements en dessous de la seconde
2. **Basé sur le contenu** : Basé sur le hash du contenu, pas sur le temps
3. **Éviter les problèmes de temps** :
   - Le contenu du fichier n'a pas changé mais l'heure a changé (comme lors d'un redéploiement)
   - Ressources mises à jour cycliquement (retour périodique au même contenu)
4. **Systèmes distribués** : Les horloges de différents serveurs peuvent ne pas être synchronisées

**Exemple** :

```javascript
// Le contenu du fichier n'a pas changé, mais Last-Modified a changé
// 2024-01-01 12:00 - Déployer version A (contenu : abc)
// 2024-01-02 12:00 - Redéployer version A (contenu : abc)
// Last-Modified a changé, mais le contenu est le même !

// ETag n'a pas ce problème
ETag: 'hash-of-abc'; // Toujours identique
```

</details>

### Question 3 : Quelle est la différence entre from disk cache et from memory cache ?

<details>
<summary>Cliquez pour voir la réponse</summary>

| Caractéristique | Memory Cache           | Disk Cache               |
| --------------- | ---------------------- | ------------------------ |
| Emplacement     | Mémoire (RAM)          | Disque dur               |
| Vitesse         | Extrêmement rapide     | Plus lent                |
| Capacité        | Petite (niveau Mo)     | Grande (niveau Go)       |
| Persistance     | Supprimé à la fermeture de l'onglet | Stockage persistant |
| Priorité        | Haute (prioritaire)    | Basse                    |

**Ordre de priorité de chargement** :

```text
1. Memory Cache (le plus rapide)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. Requête réseau (le plus lent)
```

**Conditions de déclenchement** :

- **Memory Cache** : Ressources récemment accédées (comme le rechargement de la page)
- **Disk Cache** : Ressources accédées il y a longtemps ou fichiers volumineux

</details>

### Question 4 : Comment forcer le navigateur à recharger les ressources ?

<details>
<summary>Cliquez pour voir la réponse</summary>

**Phase de développement** :

```javascript
// 1. Hard Reload (Ctrl/Cmd + Shift + R)
// 2. Vider le cache et recharger

// 3. Ajouter un horodatage dans le code
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Environnement de production** :

```javascript
// 1. Utiliser le hash dans le nom de fichier (meilleure pratique)
main.abc123.js  // Généré automatiquement par Webpack/Vite

// 2. Mettre à jour le numéro de version
<script src="/js/main.js?v=2.0.0"></script>

// 3. Configurer Cache-Control
Cache-Control: no-cache  // Forcer la validation
Cache-Control: no-store  // Ne pas mettre en cache du tout
```

</details>

### Question 5 : Comment implémenter le cache hors ligne PWA ?

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// Mettre en cache la page hors ligne lors de l'installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Réseau échoué, afficher la page hors ligne
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Stratégie de cache PWA complète** :

```javascript
// 1. Mettre en cache les ressources statiques
caches.addAll(['/css/', '/js/', '/images/']);

// 2. Requêtes d'API : Network First
// 3. Images : Cache First
// 4. HTML : Network First, afficher la page hors ligne en cas d'échec
```

</details>

## 8. Best practices

> Bonnes pratiques

### ✅ Pratiques recommandées

```javascript
// 1. HTML - Ne pas mettre en cache, garantir que l'utilisateur obtient la dernière version
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS (avec hash) - Cache permanent
// Nom de fichier : main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Images - Cache à long terme
Cache-Control: public, max-age=2592000  // 30 jours

// 4. Données d'API - Cache à court terme + cache de négociation
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Utiliser le Service Worker pour le support hors ligne
```

### ❌ Pratiques à éviter

```javascript
// ❌ Mauvais : Configurer un cache à long terme pour le HTML
Cache-Control: max-age=31536000  // L'utilisateur pourrait voir une ancienne version

// ❌ Mauvais : Utiliser Expires au lieu de Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, obsolète

// ❌ Mauvais : Ne configurer aucun cache
// Sans en-têtes de cache, le comportement du navigateur est indéterminé

// ❌ Mauvais : Utiliser la même stratégie pour toutes les ressources
Cache-Control: max-age=3600  // Devrait être ajusté selon le type de ressource
```

### Arbre de décision de la stratégie de cache

```text
Ressource statique ?
├─ Oui → Le nom de fichier a un hash ?
│       ├─ Oui → Cache permanent (max-age=31536000, immutable)
│       └─ Non → Cache à moyen-long terme (max-age=2592000)
└─ Non → Est-ce du HTML ?
        ├─ Oui → Ne pas mettre en cache (no-cache)
        └─ Non → Est-ce une API ?
               ├─ Oui → Cache à court terme + négociation (max-age=60, ETag)
               └─ Non → Décider selon la fréquence de mise à jour
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/fr/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
