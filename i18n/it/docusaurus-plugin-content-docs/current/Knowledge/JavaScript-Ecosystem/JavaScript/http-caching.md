---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. Cos'è l'HTTP caching e perché è importante?

> Cos'è l'HTTP caching? Perché è importante?

L'HTTP caching è una tecnica che memorizza temporaneamente le risposte HTTP nei client (browser) o nei server intermedi, in modo che le richieste successive possano riutilizzare i dati memorizzati nella cache invece di contattare nuovamente il server di origine.

### Cache vs archiviazione temporanea (Temporary Storage)

Nel contesto tecnico, questi due termini vengono spesso confusi, ma rappresentano scopi diversi.

#### Cache

**Definizione**: una copia memorizzata utilizzata per l'**ottimizzazione delle prestazioni**, focalizzata sul riutilizzo e sull'accesso più veloce.

**Caratteristiche**:

- ✅ Obiettivo: miglioramento delle prestazioni
- ✅ I dati sono destinati al riutilizzo
- ✅ Strategia esplicita di scadenza/rivalidazione
- ✅ Solitamente una copia dei dati originali

**Esempi**:

```javascript
// HTTP Cache - cache delle risposte API
Cache-Control: max-age=3600 // cache per 1 ora

// Memory Cache - cache del risultato di un calcolo
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n); // riutilizza la cache
  const result = /* calcolo */;
  cache.set(n, result);
  return result;
}
```

#### Archiviazione temporanea (Temporary Storage)

**Definizione**: dati memorizzati per esigenze temporanee del flusso di lavoro, con enfasi sul ciclo di vita breve.

**Caratteristiche**:

- ✅ Obiettivo: conservazione temporanea
- ✅ Il riutilizzo è facoltativo
- ✅ Solitamente ciclo di vita più breve
- ✅ Può contenere stato intermedio

**Esempi**:

```javascript
// sessionStorage - dati temporanei del form
sessionStorage.setItem('formData', JSON.stringify(form));

// percorso temporaneo del file caricato
const tempFile = await uploadToTemp(file);
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Confronto

| Caratteristica | Cache | Archiviazione temporanea |
| ------- | ----- | ----------------- |
| Obiettivo principale | Prestazioni | Conservazione temporanea |
| Riutilizzo | Sì, spesso ripetuto | Non garantito |
| Ciclo di vita | Guidato dalla policy | Solitamente breve |
| Uso tipico | HTTP cache, memory cache | sessionStorage, file temporanei |
| Termine inglese | Cache | Temp / Temporary / Buffer |

#### Distinzione pratica

```javascript
// ===== Scenari di cache =====

// 1) HTTP cache: riutilizza la risposta API
fetch('/api/users').then((response) => response.json());
fetch('/api/users').then((response) => response.json());

// 2) cache di memoizzazione
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Scenari di archiviazione temporanea =====

// 1) salva bozza al momento dell'uscita
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2) elaborazione temporanea del caricamento
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file);
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath);
  return processed;
}

// 3) risultati intermedi temporanei
const tempResults = [];
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults);
```

#### Nello sviluppo web

```javascript
// HTTP Cache (lunga durata, riutilizzabile)
Cache-Control: public, max-age=31536000, immutable

// sessionStorage (temporaneo, limitato alla tab)
sessionStorage.setItem('tempData', data)

// localStorage (archiviazione persistente, non principalmente uno strato di ottimizzazione cache)
localStorage.setItem('userPreferences', prefs)
```

### Perché questa distinzione è importante

1. **Decisioni di progettazione**:
   - Serve ottimizzazione delle prestazioni -> cache
   - Serve persistenza temporanea -> archiviazione temporanea
2. **Gestione delle risorse**:
   - La cache si concentra su hit rate e strategia di scadenza
   - L'archiviazione temporanea si concentra su tempistica di pulizia e limiti di dimensione
3. **Chiarezza nei colloqui**:
   - Domanda sulle prestazioni -> discuti strategia di caching
   - Domanda sui dati temporanei -> discuti strategia di archiviazione temporanea

Questo articolo si concentra principalmente sulla **cache**, in particolare sull'HTTP caching.

### Vantaggi del caching

1. **Meno richieste di rete**
2. **Minor carico sul server**
3. **Caricamento delle pagine più veloce**
4. **Minor utilizzo di banda**
5. **Migliore esperienza utente**

### Livelli di cache del browser

```text
┌─────────────────────────────────────┐
│      Livelli di cache del browser   │
├─────────────────────────────────────┤
│  1. Memory Cache                    │
│     - Più veloce, capacità ridotta  │
│     - Cancellata con fine tab/sess. │
├─────────────────────────────────────┤
│  2. Disk Cache                      │
│     - Più lenta, capacità maggiore  │
│     - Archiviazione persistente     │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Completamente controllata     │
│       dall'app                      │
│     - Abilita il comportamento      │
│       offline                       │
└─────────────────────────────────────┘
```

## 2. Quali sono le strategie di HTTP caching?

> Quali strategie di caching esistono in HTTP?

### Categorie di strategie

```text
Strategie di HTTP Caching
├── Strong Cache (Cache forte)
│   ├── Cache-Control
│   └── Expires
└── Validation Cache (Cache di validazione)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Cache forte (strong cache)

**Comportamento**: il browser serve direttamente dalla cache locale senza inviare richieste al server di origine.

#### `Cache-Control` (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Direttive comuni**:

```javascript
// 1) max-age: durata di freschezza in secondi
Cache-Control: max-age=3600

// 2) no-cache: permetti il caching ma richiedi la rivalidazione prima del riutilizzo
Cache-Control: no-cache

// 3) no-store: non cachare affatto
Cache-Control: no-store

// 4) public: cachabile da browser/CDN/proxy
Cache-Control: public, max-age=31536000

// 5) private: solo cache del browser
Cache-Control: private, max-age=3600

// 6) immutable: il contenuto non cambierà durante la durata di freschezza
Cache-Control: public, max-age=31536000, immutable

// 7) must-revalidate: una volta scaduto, deve rivalidare
Cache-Control: max-age=3600, must-revalidate
```

#### `Expires` (HTTP/1.0, legacy)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Problemi**:

- Usa tempo assoluto
- Dipende dalla correttezza dell'orologio del client
- Sostanzialmente sostituito da `Cache-Control`

### 2. Cache di validazione (validation cache)

**Comportamento**: il browser chiede al server se la risorsa è cambiata.

#### `Last-Modified` / `If-Modified-Since`

```http
# prima risposta
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# richiesta successiva
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Flusso**:

1. Prima richiesta: il server invia `Last-Modified`
2. Richiesta successiva: il browser invia `If-Modified-Since`
3. Non modificato: il server restituisce `304 Not Modified`
4. Modificato: il server restituisce `200 OK` + nuovo body

#### `ETag` / `If-None-Match`

```http
# prima risposta
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# richiesta successiva
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Vantaggi**:

- Più preciso di `Last-Modified`
- Basato sul contenuto (hash o token di versione)
- Può rilevare cambiamenti non visibili nei timestamp al secondo

### Last-Modified vs ETag

| Caratteristica | Last-Modified | ETag |
| ------- | ------------- | ---- |
| Precisione | Al secondo | Token/hash del contenuto, più preciso |
| Costo | Inferiore | Potrebbe richiedere calcolo aggiuntivo |
| Adatto per | File statici generali | Controllo preciso della validazione |
| Priorità | Inferiore | Superiore (`ETag` preferito quando entrambi presenti) |

## 3. Come funziona il caching del browser?

> Qual è il flusso di lavoro della cache del browser?

### Flusso completo

```text
┌──────────────────────────────────────────────┐
│      Flusso di richiesta risorse del browser │
└──────────────────────────────────────────────┘
                    ↓
         1. Controlla Memory Cache
                    ↓
            ┌───────┴────────┐
            │   Cache hit?   │
            └───────┬────────┘
                Sì  │ No
                    ↓
         2. Controlla Disk Cache
                    ↓
            ┌───────┴────────┐
            │   Cache hit?   │
            └───────┬────────┘
                Sì  │ No
                    ↓
         3. Controlla Service Worker
                    ↓
            ┌───────┴────────┐
            │   Cache hit?   │
            └───────┬────────┘
                Sì  │ No
                    ↓
         4. Controlla freschezza
                    ↓
            ┌───────┴────────┐
            │   È scaduto?   │
            └───────┬────────┘
                Sì  │ No
                    ↓
         5. Rivalidazione con il server
                    ↓
            ┌───────┴────────┐
            │   Modificato?   │
            └───────┬────────┘
                Sì  │ No (304)
                    ↓
         6. Richiedi nuovo contenuto
                    ↓
            ┌───────┴────────┐
            │   Restituisci   │
            │   200 con body  │
            └────────────────┘
```

### Esempio pratico

```javascript
// prima richiesta
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// entro 1 ora
// cache forte hit -> uso locale, nessuna richiesta
// stato mostrato nei devtools: from disk cache o from memory cache

// dopo 1 ora
GET /api/data.json
If-None-Match: "abc123"

// non modificato
Response:
  304 Not Modified

// modificato
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. Quali sono le strategie di caching comuni?

> Strategie di caching pratiche comuni

### 1. Asset statici a lunga durata

```javascript
// HTML: nessuna cache lunga, sempre validare
Cache-Control: no-cache

// CSS/JS con hash: cache lunga immutabile
Cache-Control: public, max-age=31536000, immutable
// filename: main.abc123.js
```

**Principio**:

- L'HTML dovrebbe rimanere fresco per riferire gli hash degli asset più recenti
- Gli asset statici con hash possono essere memorizzati a lungo nella cache
- Cambio del contenuto -> cambio del filename -> nuovo download

### 2. Risorse aggiornate frequentemente

```javascript
// Dati API: cache breve + rivalidazione
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Strategie per le immagini

```javascript
// avatar utente: cache media
Cache-Control: public, max-age=86400

// logo/icone: cache più lunga
Cache-Control: public, max-age=2592000

// immagini dinamiche: validazione
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Policy suggerite per tipo di risorsa

```javascript
const cachingStrategies = {
  html: 'Cache-Control: no-cache',
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',
  staticAssets: 'Cache-Control: public, max-age=2592000',
  apiData: 'Cache-Control: private, max-age=60',
  userData: 'Cache-Control: private, no-cache',
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker caching

Il Service Worker offre il pieno controllo sul caching a runtime e sul comportamento offline.

### Uso di base

```javascript
// registra il Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// install: precache degli asset statici
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch: esempio cache-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// activate: pulizia delle vecchie cache
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

### Strategie SW comuni

#### 1. Cache First

```javascript
// migliore per asset statici
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First

```javascript
// migliore per richieste API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate

```javascript
// migliore per risposta veloce + aggiornamento in background
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. Come implementare il cache busting?

> Come implementare il cache busting?

Il cache busting assicura che gli utenti scarichino gli asset più recenti quando il contenuto cambia.

### Metodo 1: hashing del filename (raccomandato)

```javascript
// con Webpack/Vite
// output: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<script src="/js/main.abc123.js"></script>
```

**Pro**:

- ✅ Il nuovo filename forza il download
- ✅ I vecchi file rimangono cachabili
- ✅ Best practice del settore

### Metodo 2: versione tramite query

```html
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Contro**:

- ❌ Alcuni CDN/proxy trattano il caching con query string in modo diverso
- ❌ Manutenzione manuale della versione

### Metodo 3: timestamp

```javascript
// comune solo in sviluppo
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Caso d'uso**:

- bypass della cache in sviluppo
- non ideale per la produzione

## 7. Domande comuni di colloquio sul caching

> Domande comuni di colloquio sul caching

### Domanda 1: Come impedire che l'HTML venga memorizzato nella cache?

<details>
<summary>Clicca per vedere la risposta</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

oppure meta tag HTML:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Domanda 2: Perché usare ETag invece del solo Last-Modified?

<details>
<summary>Clicca per vedere la risposta</summary>

**Vantaggi di ETag**:

1. Più preciso
2. Validazione basata sul contenuto
3. Evita casi limite dei timestamp (re-deploy con lo stesso contenuto)
4. Migliore nei sistemi distribuiti con orologi non sincronizzati

**Esempio**:

```javascript
// contenuto invariato, tempo di deploy cambiato
// Last-Modified cambia, ma il contenuto è identico

ETag: 'hash-of-abc'; // stabile se il contenuto non è cambiato
```

</details>

### Domanda 3: differenza tra `from disk cache` e `from memory cache`?

<details>
<summary>Clicca per vedere la risposta</summary>

| Caratteristica | Memory Cache | Disk Cache |
| ------- | ------------ | ---------- |
| Archiviazione | RAM | Disco |
| Velocità | Molto veloce | Più lento |
| Capacità | Inferiore | Maggiore |
| Persistenza | Solitamente breve | Persistente |
| Priorità | Superiore | Inferiore |

Ordine di caricamento tipico (concettuale):

```text
1. Memory Cache
2. Service Worker Cache
3. Disk Cache
4. Rivalidazione / Network
```

</details>

### Domanda 4: come forzare il browser a ricaricare le risorse?

<details>
<summary>Clicca per vedere la risposta</summary>

**Sviluppo**:

```javascript
// Hard Reload
// Disabilita la cache nei DevTools

const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Produzione**:

```javascript
// filename con hash (migliore)
main.abc123.js

// query di versione
<script src="/js/main.js?v=2.0.0"></script>

// policy di cache
Cache-Control: no-cache
Cache-Control: no-store
```

</details>

### Domanda 5: come implementare la cache offline in una PWA?

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// sw.js
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

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

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

Una strategia PWA completa spesso combina:

```javascript
// 1) asset statici: cache-first
// 2) API: network-first
// 3) immagini: cache-first
// 4) navigazione HTML: network-first + fallback offline
```

</details>

## 8. Best practice

> Best practice

### ✅ Raccomandato

```javascript
// 1. HTML: nessuna cache lunga per garantire il documento di ingresso più recente
Cache-Control: no-cache

// 2. CSS/JS con hash: cache lunga immutabile
// esempio filename: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Immagini: cache media/lunga
Cache-Control: public, max-age=2592000

// 4. Dati API: cache breve + validazione
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker per il supporto offline
```

### ❌ Da evitare

```javascript
// male: cache lunga per il documento HTML di ingresso
Cache-Control: max-age=31536000

// male: affidarsi solo a Expires
Expires: Wed, 21 Oct 2025 07:28:00 GMT

// male: nessun header di cache esplicito

// male: stessa policy per tutti i tipi di risorsa
Cache-Control: max-age=3600
```

### Albero decisionale della strategia di cache

```text
È un asset statico?
├─ Sì -> il filename ha un hash?
│        ├─ Sì -> cache lunga immutabile (max-age=31536000, immutable)
│        └─ No -> cache media/lunga (es. max-age=2592000)
└─ No -> È HTML?
         ├─ Sì -> no-cache
         └─ No -> È un'API?
                ├─ Sì -> cache breve + validazione (max-age=60 + ETag)
                └─ No -> decidi in base alla frequenza di aggiornamento
```

## Riferimenti

- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
