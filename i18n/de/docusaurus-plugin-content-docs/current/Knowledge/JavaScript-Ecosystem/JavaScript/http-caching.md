---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> Was ist HTTP-Caching? Warum ist es wichtig?

HTTP-Caching ist eine Technik, bei der HTTP-Antworten vorübergehend auf dem Client (Browser) oder auf Zwischenservern gespeichert werden, damit bei nachfolgenden Anfragen die gecachten Daten direkt verwendet werden können, ohne den Server erneut anzufragen.

### Cache vs. temporäre Speicherung: Was ist der Unterschied?

In technischen Dokumentationen werden diese beiden Begriffe oft synonym verwendet, haben aber tatsächlich unterschiedliche Bedeutungen:

#### Cache

**Definition**: Datenkopien, die zur **Leistungsoptimierung** gespeichert werden, mit Schwerpunkt auf „Wiederverwendung" und „schnellerem Zugriff".

**Merkmale**:

- ✅ Ziel ist die Leistungssteigerung
- ✅ Daten können wiederholt verwendet werden
- ✅ Klare Ablaufrichtlinien vorhanden
- ✅ In der Regel Kopien der Originaldaten

**Beispiel**:

```javascript
// HTTP Cache - API-Antworten cachen
Cache-Control: max-age=3600  // 1 Stunde cachen

// Memory Cache - Berechnungsergebnisse cachen
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // Cache wiederverwenden
  const result = /* Berechnung */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage (Temporäre Speicherung)

**Definition**: **Vorübergehend gespeicherte** Daten, mit Schwerpunkt auf „Temporalität" und „werden gelöscht".

**Merkmale**:

- ✅ Ziel ist die vorübergehende Speicherung
- ✅ Wird nicht unbedingt wiederverwendet
- ✅ Lebenszyklus ist in der Regel kurz
- ✅ Kann Zwischenzustände enthalten

**Beispiel**:

```javascript
// sessionStorage - Benutzereingaben temporär speichern
sessionStorage.setItem('formData', JSON.stringify(form)); // Wird beim Schließen des Tabs gelöscht

// Datei-Upload temporär speichern
const tempFile = await uploadToTemp(file); // Nach Verarbeitung löschen
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Vergleichstabelle

| Eigenschaft    | Cache                    | Temporary Storage (Temporäre Speicherung) |
| -------------- | ------------------------ | ----------------------------------------- |
| **Hauptzweck** | Leistungsoptimierung     | Vorübergehende Speicherung                |
| **Wiederverwendung** | Ja, mehrfaches Lesen | Nicht unbedingt                           |
| **Lebenszyklus** | Richtlinienbasiert    | In der Regel kurz                         |
| **Typische Verwendung** | HTTP Cache, Memory Cache | sessionStorage, temporäre Dateien |
| **Englische Entsprechung** | Cache             | Temp / Temporary / Buffer                 |

#### Unterschiede in der praktischen Anwendung

```javascript
// ===== Cache-Szenarien =====

// 1. HTTP Cache: API-Antworten wiederverwenden
fetch('/api/users') // Erste Anfrage
  .then((response) => response.json());

fetch('/api/users') // Zweite Anfrage aus dem Cache
  .then((response) => response.json());

// 2. Berechnungsergebnisse cachen
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // Wiederverwenden
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Temporary Storage-Szenarien =====

// 1. Formulardaten temporär speichern (versehentliches Schließen verhindern)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. Upload-Dateien temporär speichern
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // Temporär speichern
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // Nach Verwendung löschen
  return processed;
}

// 3. Zwischenergebnisse temporär speichern
const tempResults = []; // Zwischenergebnisse temporär speichern
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // Nach Verwendung nicht mehr benötigt
```

#### Anwendung in der Webentwicklung

```javascript
// HTTP Cache - Langzeitspeicherung, Wiederverwendung
Cache-Control: public, max-age=31536000, immutable
// → Browser cached diese Datei ein Jahr lang und verwendet sie wieder

// sessionStorage (temporäre Speicherung) - Vorübergehende Speicherung, beim Schließen gelöscht
sessionStorage.setItem('tempData', data);
// → Nur im aktuellen Tab gültig, wird beim Schließen gelöscht

// localStorage (Langzeitspeicherung) - Zwischen beiden
localStorage.setItem('userPreferences', prefs);
// → Dauerhafte Speicherung, aber nicht zur Leistungsoptimierung
```

### Warum ist die Unterscheidung dieser beiden Konzepte wichtig?

1. **Designentscheidungen**:

   - Leistungsoptimierung nötig? → Cache verwenden
   - Vorübergehende Speicherung nötig? → Temporäre Speicherung verwenden

2. **Ressourcenmanagement**:

   - Cache: Fokus auf Trefferquote und Ablaufrichtlinien
   - Temporäre Speicherung: Fokus auf Bereinigungszeitpunkt und Kapazitätsgrenzen

3. **Antworten im Vorstellungsgespräch**:

   - „Wie optimiert man die Leistung" → Cache-Strategien besprechen
   - „Wie behandelt man temporäre Daten" → Temporäre Speicherlösungen besprechen

In diesem Artikel besprechen wir hauptsächlich **Cache**, insbesondere den HTTP-Caching-Mechanismus.

### Vorteile von Caching

1. **Reduzierung von Netzwerkanfragen**: Direkt aus dem lokalen Cache lesen, keine HTTP-Anfragen senden
2. **Verringerung der Serverlast**: Weniger Anfragen, die der Server verarbeiten muss
3. **Schnellere Seitenladezeiten**: Lokaler Cache-Zugriff ist viel schneller als Netzwerkanfragen
4. **Bandbreiteneinsparung**: Reduzierte Datenübertragung
5. **Verbesserte Benutzererfahrung**: Schnellere Seitenreaktionen, flüssigere Nutzung

### Cache-Typen

```text
┌─────────────────────────────────────┐
│      Browser-Cache-Hierarchie       │
├─────────────────────────────────────┤
│  1. Memory Cache (Speicher-Cache)   │
│     - Am schnellsten, geringe       │
│       Kapazität                     │
│     - Wird beim Schließen des       │
│       Tabs gelöscht                 │
├─────────────────────────────────────┤
│  2. Disk Cache (Festplatten-Cache)  │
│     - Langsamer, große Kapazität    │
│     - Dauerhafte Speicherung        │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Volle Kontrolle durch         │
│       Entwickler                    │
│     - Unterstützung für Offline-    │
│       Anwendungen                   │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> Welche HTTP-Caching-Strategien gibt es?

### Klassifizierung der Cache-Strategien

```text
HTTP-Caching-Strategien
├── Starker Cache (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── Verhandlungs-Cache (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Starker Cache (Strong Cache / Fresh)

**Merkmal**: Der Browser liest direkt aus dem lokalen Cache, ohne eine Anfrage an den Server zu senden.

#### Cache-Control (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Häufig verwendete Direktiven**:

```javascript
// 1. max-age: Cache-Gültigkeitsdauer (Sekunden)
Cache-Control: max-age=3600  // 1 Stunde cachen

// 2. no-cache: Servervalidierung erforderlich (Verhandlungs-Cache verwenden)
Cache-Control: no-cache

// 3. no-store: Überhaupt nicht cachen
Cache-Control: no-store

// 4. public: Kann von jedem Cache gespeichert werden (Browser, CDN)
Cache-Control: public, max-age=31536000

// 5. private: Nur vom Browser cachbar
Cache-Control: private, max-age=3600

// 6. immutable: Ressource ändert sich nie (mit Hash-Dateiname)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate: Nach Ablauf muss beim Server validiert werden
Cache-Control: max-age=3600, must-revalidate
```

#### Expires (HTTP/1.0, veraltet)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Probleme**:

- Verwendet absolute Zeit, abhängig von der Client-Zeit
- Ungenaue Client-Zeit führt zu fehlerhaftem Cache-Verhalten
- Wurde durch `Cache-Control` ersetzt

### 2. Verhandlungs-Cache (Negotiation Cache / Validation)

**Merkmal**: Der Browser sendet eine Anfrage an den Server, um zu prüfen, ob die Ressource aktualisiert wurde.

#### Last-Modified / If-Modified-Since

```http
# Serverantwort (erste Anfrage)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Browseranfrage (nachfolgende Anfrage)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Ablauf**:

1. Erste Anfrage: Server sendet `Last-Modified`
2. Nachfolgende Anfrage: Browser sendet `If-Modified-Since`
3. Ressource nicht geändert: Server antwortet mit `304 Not Modified`
4. Ressource geändert: Server antwortet mit `200 OK` und neuer Ressource

#### ETag / If-None-Match

```http
# Serverantwort (erste Anfrage)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Browseranfrage (nachfolgende Anfrage)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Vorteile**:

- Genauer als `Last-Modified`
- Nicht zeitabhängig, verwendet Inhalts-Hash
- Kann Änderungen unterhalb der Sekundenebene erkennen

### Last-Modified vs ETag

| Eigenschaft   | Last-Modified          | ETag                          |
| ------------- | ---------------------- | ----------------------------- |
| Genauigkeit   | Sekundenebene          | Inhalts-Hash, genauer         |
| Leistung      | Schneller              | Hash-Berechnung nötig, langsamer |
| Anwendungsfall | Allgemeine statische Ressourcen | Ressourcen mit präziser Kontrolle |
| Priorität     | Niedrig                | Hoch (ETag hat Vorrang)       |

## 3. How does browser caching work?

> Wie funktioniert Browser-Caching?

### Vollständiger Cache-Ablauf

```text
┌──────────────────────────────────────────────┐
│     Browser-Ressourcenanfrage-Ablauf          │
└──────────────────────────────────────────────┘
                    ↓
         1. Memory Cache prüfen
                    ↓
            ┌───────┴────────┐
            │ Cache gefunden? │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Disk Cache prüfen
                    ↓
            ┌───────┴────────┐
            │ Cache gefunden? │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Service Worker prüfen
                    ↓
            ┌───────┴────────┐
            │ Cache gefunden? │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Cache-Ablauf prüfen
                    ↓
            ┌───────┴────────┐
            │   Abgelaufen?   │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Verhandlungs-Cache validieren
                    ↓
            ┌───────┴────────┐
            │ Ressource       │
            │ geändert?       │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Neue Ressource vom Server anfragen
                    ↓
            ┌───────┴────────┐
            │ Neue Ressource  │
            │ zurückgeben     │
            │ (200 OK)        │
            └────────────────┘
```

### Praktisches Beispiel

```javascript
// Erste Anfrage
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== Erneute Anfrage innerhalb 1 Stunde ==========
// Starker Cache: Direkt lokal lesen, keine Anfrage senden
// Status: 200 OK (from disk cache)

// ========== Erneute Anfrage nach 1 Stunde ==========
// Verhandlungs-Cache: Validierungsanfrage senden
GET /api/data.json
If-None-Match: "abc123"

// Ressource nicht geändert
Response:
  304 Not Modified
  (Kein Body, lokalen Cache verwenden)

// Ressource geändert
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> Welche gängigen Cache-Strategien gibt es?

### 1. Permanente Cache-Strategie (für statische Ressourcen)

```javascript
// HTML: Nicht cachen, jedes Mal prüfen
Cache-Control: no-cache

// CSS/JS (mit Hash): Permanent cachen
Cache-Control: public, max-age=31536000, immutable
// Dateiname: main.abc123.js
```

**Prinzip**:

- HTML wird nicht gecacht, damit Benutzer die neueste Version erhalten
- CSS/JS verwenden Hash-Dateinamen, bei Inhaltsänderung ändert sich der Dateiname
- Alte Versionen werden nicht verwendet, neue Versionen werden neu heruntergeladen

### 2. Strategie für häufig aktualisierte Ressourcen

```javascript
// API-Daten: Kurzzeit-Cache + Verhandlungs-Cache
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Strategie für Bildressourcen

```javascript
// Benutzer-Avatar: Mittelfristiger Cache
Cache-Control: public, max-age=86400  // 1 Tag

// Logo, Icons: Langfristiger Cache
Cache-Control: public, max-age=2592000  // 30 Tage

// Dynamische Bilder: Verhandlungs-Cache
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Cache-Empfehlungen nach Ressourcentyp

```javascript
const cachingStrategies = {
  // HTML-Dateien
  html: 'Cache-Control: no-cache',

  // Statische Ressourcen mit Hash
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // Selten aktualisierte statische Ressourcen
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // API-Daten
  apiData: 'Cache-Control: private, max-age=60',

  // Benutzerspezifische Daten
  userData: 'Cache-Control: private, no-cache',

  // Sensible Daten
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker Caching

Service Worker bieten die flexibelste Cache-Kontrolle, bei der Entwickler die Cache-Logik vollständig kontrollieren können.

### Grundlegende Verwendung

```javascript
// Service Worker registrieren
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Service Worker-Datei
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// Install-Event: Statische Ressourcen cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Anfrage abfangen: Cache-Strategie verwenden
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache-First-Strategie
      return response || fetch(event.request);
    })
  );
});

// Activate-Event: Alten Cache bereinigen
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

### Gängige Cache-Strategien

#### 1. Cache First (Cache zuerst)

```javascript
// Geeignet für: Statische Ressourcen
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First (Netzwerk zuerst)

```javascript
// Geeignet für: API-Anfragen
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache aktualisieren
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Netzwerk fehlgeschlagen, Cache verwenden
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate (Veraltet während der Revalidierung)

```javascript
// Geeignet für: Ressourcen, die schnelle Antworten brauchen, aber aktuell bleiben sollen
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Cache zurückgeben, im Hintergrund aktualisieren
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Wie implementiert man Cache Busting?

Cache Busting ist eine Technik, die sicherstellt, dass Benutzer die neuesten Ressourcen erhalten.

### Methode 1: Dateiname mit Hash (empfohlen)

```javascript
// Bundling-Tools wie Webpack/Vite verwenden
// Ausgabe: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- Referenz automatisch aktualisieren -->
<script src="/js/main.abc123.js"></script>
```

**Vorteile**:

- ✅ Dateiname ändert sich, erzwingt den Download der neuen Datei
- ✅ Alte Version bleibt im Cache, keine Verschwendung
- ✅ Best Practice

### Methode 2: Query String Versionsnummer

```html
<!-- Versionsnummer manuell aktualisieren -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Nachteile**:

- ❌ Einige CDNs cachen keine Ressourcen mit Query String
- ❌ Manuelle Versionsverwaltung erforderlich

### Methode 3: Zeitstempel

```javascript
// Für die Entwicklungsumgebung
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Verwendung**:

- Cache in der Entwicklungsumgebung vermeiden
- Nicht für die Produktionsumgebung geeignet (jedes Mal eine neue Anfrage)

## 7. Common caching interview questions

> Häufige Caching-Interviewfragen

### Frage 1: Wie verhindert man, dass HTML gecacht wird?

<details>
<summary>Klicken Sie, um die Antwort anzuzeigen</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

Oder mit Meta-Tags:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Frage 2: Warum sollte man ETag verwenden und nicht nur Last-Modified?

<details>
<summary>Klicken Sie, um die Antwort anzuzeigen</summary>

**Vorteile von ETag**:

1. **Genauer**: Kann Änderungen unterhalb der Sekundenebene erkennen
2. **Inhaltsgesteuert**: Basiert auf Inhalts-Hash, nicht auf Zeit
3. **Zeitprobleme vermeiden**:
   - Dateiinhalt hat sich nicht geändert, aber die Zeit schon (z.B. bei Re-Deployment)
   - Zyklisch aktualisierte Ressourcen (kehren periodisch zum gleichen Inhalt zurück)
4. **Verteilte Systeme**: Zeiten verschiedener Server sind möglicherweise nicht synchron

**Beispiel**:

```javascript
// Dateiinhalt hat sich nicht geändert, aber Last-Modified schon
// 2024-01-01 12:00 - Version A deployen (Inhalt: abc)
// 2024-01-02 12:00 - Version A erneut deployen (Inhalt: abc)
// Last-Modified hat sich geändert, aber der Inhalt ist gleich!

// ETag hat dieses Problem nicht
ETag: 'hash-of-abc'; // Immer gleich
```

</details>

### Frage 3: Was ist der Unterschied zwischen from disk cache und from memory cache?

<details>
<summary>Klicken Sie, um die Antwort anzuzeigen</summary>

| Eigenschaft    | Memory Cache           | Disk Cache         |
| -------------- | ---------------------- | ------------------ |
| Speicherort    | Arbeitsspeicher (RAM)  | Festplatte         |
| Geschwindigkeit | Extrem schnell        | Langsamer          |
| Kapazität      | Klein (MB-Bereich)     | Groß (GB-Bereich)  |
| Persistenz     | Beim Tab-Schließen gelöscht | Dauerhafte Speicherung |
| Priorität      | Hoch (bevorzugt)       | Niedrig            |

**Ladereihenfolge**:

```text
1. Memory Cache (am schnellsten)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. Netzwerkanfrage (am langsamsten)
```

**Auslösebedingungen**:

- **Memory Cache**: Kürzlich aufgerufene Ressourcen (z.B. Seite neu laden)
- **Disk Cache**: Ressourcen, die vor längerer Zeit aufgerufen wurden, oder große Dateien

</details>

### Frage 4: Wie erzwingt man das Neuladen von Ressourcen im Browser?

<details>
<summary>Klicken Sie, um die Antwort anzuzeigen</summary>

**Entwicklungsphase**:

```javascript
// 1. Hard Reload (Ctrl/Cmd + Shift + R)
// 2. Cache leeren und neu laden

// 3. Zeitstempel im Code hinzufügen
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Produktionsumgebung**:

```javascript
// 1. Dateiname mit Hash verwenden (Best Practice)
main.abc123.js  // Von Webpack/Vite automatisch generiert

// 2. Versionsnummer aktualisieren
<script src="/js/main.js?v=2.0.0"></script>

// 3. Cache-Control setzen
Cache-Control: no-cache  // Validierung erzwingen
Cache-Control: no-store  // Überhaupt nicht cachen
```

</details>

### Frage 5: Wie implementiert man PWA Offline-Caching?

<details>
<summary>Klicken Sie, um die Antwort anzuzeigen</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// Bei Installation Offline-Seite cachen
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

// Anfrage abfangen
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Netzwerk fehlgeschlagen, Offline-Seite anzeigen
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Vollständige PWA Cache-Strategie**:

```javascript
// 1. Statische Ressourcen cachen
caches.addAll(['/css/', '/js/', '/images/']);

// 2. API-Anfragen: Network First
// 3. Bilder: Cache First
// 4. HTML: Network First, bei Fehler Offline-Seite anzeigen
```

</details>

## 8. Best practices

> Best Practices

### ✅ Empfohlene Vorgehensweisen

```javascript
// 1. HTML - Nicht cachen, sicherstellen, dass Benutzer die neueste Version erhalten
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS (mit Hash) - Permanent cachen
// Dateiname: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Bilder - Langfristig cachen
Cache-Control: public, max-age=2592000  // 30 Tage

// 4. API-Daten - Kurzfristiger Cache + Verhandlungs-Cache
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker für Offline-Unterstützung implementieren
```

### ❌ Zu vermeidende Vorgehensweisen

```javascript
// ❌ Schlecht: HTML mit langfristigem Cache
Cache-Control: max-age=31536000  // Benutzer sehen möglicherweise alte Version

// ❌ Schlecht: Expires statt Cache-Control verwenden
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, veraltet

// ❌ Schlecht: Überhaupt keinen Cache setzen
// Ohne Cache-Header ist das Browserverhalten unbestimmt

// ❌ Schlecht: Gleiche Strategie für alle Ressourcen
Cache-Control: max-age=3600  // Sollte je nach Ressourcentyp angepasst werden
```

### Cache-Strategie-Entscheidungsbaum

```text
Statische Ressource?
├─ Ja → Dateiname hat Hash?
│      ├─ Ja → Permanenter Cache (max-age=31536000, immutable)
│      └─ Nein → Mittel- bis langfristiger Cache (max-age=2592000)
└─ Nein → Ist es HTML?
         ├─ Ja → Nicht cachen (no-cache)
         └─ Nein → Ist es eine API?
                ├─ Ja → Kurzfristiger Cache + Verhandlung (max-age=60, ETag)
                └─ Nein → Je nach Aktualisierungshäufigkeit entscheiden
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/de/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/de/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/de/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
