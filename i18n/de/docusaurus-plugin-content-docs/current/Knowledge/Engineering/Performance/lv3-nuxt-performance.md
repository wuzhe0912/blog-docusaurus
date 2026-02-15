---
title: '[Lv3] Nuxt 3 Performance-Optimierung: Bundle Size, SSR-Geschwindigkeit und Bildoptimierung'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Komplettleitfaden zur Nuxt 3 Performance-Optimierung: Von der Bundle-Size-Verkleinerung ueber SSR-Geschwindigkeitsoptimierung bis hin zu Bildladestrategien fuer maximale Performance.

---

## 1. Hauptachse der Interview-Antwort

1. **Bundle Size Optimierung**: Analyse (`nuxi analyze`), Aufteilung (`SplitChunks`), Tree Shaking, Lazy Loading.
2. **SSR-Geschwindigkeitsoptimierung (TTFB)**: Redis Cache, Nitro Cache, Reduzierung blockierender API-Aufrufe, Streaming SSR.
3. **Bildoptimierung**: `@nuxt/image`, WebP-Format, CDN, Lazy Loading.
4. **Optimierung großer Datenmengen**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Wie reduziert man die Bundle Size von Nuxt 3?

### 2.1 Diagnosewerkzeuge

Zunaechst muss man wissen, wo der Engpass liegt. Verwenden Sie `nuxi analyze`, um die Bundle-Struktur zu visualisieren.

```bash
npx nuxi analyze
```

Dies erzeugt einen Bericht, der zeigt, welche Pakete am meisten Platz einnehmen.

### 2.2 Optimierungsstrategien

#### 1. Code Splitting
Nuxt 3 macht standardmaessig bereits routenbasiertes Code Splitting. Bei großen Paketen (wie ECharts, Lodash) muessen wir manuell optimieren.

**Nuxt Config Konfiguration (Vite/Webpack):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('echarts')) return 'echarts';
            }
          },
        },
      },
    },
  },
});
```

#### 2. Tree Shaking und bedarfsgesteuerte Imports
Stellen Sie sicher, dass nur benoetigte Module importiert werden, nicht das gesamte Paket.

```typescript
// Falsch: gesamtes lodash importieren
import _ from 'lodash';
_.debounce(() => {}, 100);

// Richtig: nur debounce importieren
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// Empfohlen: vueuse verwenden (Vue-spezifisch und tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Komponenten-Lazy Loading
Fuer Komponenten, die nicht auf der ersten Seite benoetigt werden, das `Lazy`-Praefix fuer dynamische Imports verwenden.

```vue
<template>
  <div>
    <!-- Der Komponentencode wird erst geladen, wenn show true ist -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Unnoetige Server-side-Pakete entfernen
Stellen Sie sicher, dass Pakete, die nur auf dem Server verwendet werden (Datenbanktreiber, fs-Operationen), nicht in den Client gebuendelt werden. Nuxt 3 behandelt automatisch Dateien mit `.server.ts`-Endung oder das `server/`-Verzeichnis.

---

## 3. Wie optimiert man die SSR-Geschwindigkeit (TTFB)?

### 3.1 Warum ist der TTFB zu lang?
TTFB (Time To First Byte) ist der Schluesselindikator fuer SSR-Performance. Haeufige Ursachen:
1. **Langsame API-Antworten**: Der Server muss auf Backend-API-Antworten warten, bevor HTML gerendert werden kann.
2. **Serielle Anfragen**: Mehrere API-Anfragen werden nacheinander statt parallel ausgefuehrt.
3. **Aufwaendige Berechnungen**: Server fuehrt zu viele CPU-intensive Aufgaben aus.

### 3.2 Optimierungsloesungen

#### 1. Server-Side Caching (Nitro Cache)
Nitro's Cache-Funktionalitaet nutzen, um API-Antworten oder Rendering-Ergebnisse zwischenzuspeichern.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { swr: 3600 },
    '/products/**': { swr: 600 },
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. Parallele Anfragen (Parallel Fetching)
`Promise.all` verwenden, um mehrere Anfragen parallel zu senden.

```typescript
// Langsam: serielle Ausfuehrung (Gesamtzeit = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// Schnell: parallele Ausfuehrung (Gesamtzeit = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Nicht-kritische Daten verzoegern (Lazy Fetching)
Daten, die nicht auf der ersten Seite benoetigt werden, koennen auf dem Client geladen werden (`lazy: true`).

```typescript
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false,
});
```

#### 4. Streaming SSR (experimentell)
Nuxt 3 unterstuetzt HTML Streaming: gleichzeitig rendern und senden.

---

## 4. Nuxt 3 Bildoptimierung

### 4.1 Verwendung von @nuxt/image
Das offizielle Modul `@nuxt/image` ist die optimale Loesung:
- **Automatische Formatkonvertierung**: automatisch zu WebP/AVIF.
- **Automatische Skalierung**: erzeugt Bilder in passender Groesse.
- **Lazy Loading**: eingebautes Lazy Loading.
- **CDN-Integration**: unterstuetzt Cloudinary, Imgix und andere Provider.

### 4.2 Implementierungsbeispiel

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    format: ['webp'],
  },
});
```

```vue
<template>
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    width="300"
    loading="lazy"
    placeholder
  />
</template>
```

---

## 5. Paginierung und Scrollen bei großen Datenmengen

### 5.1 Loesungsauswahl
Bei großen Datenmengen (z.B. 10.000 Produkte) gibt es drei Hauptstrategien unter Beruecksichtigung von **SEO**:

| Strategie | Geeignetes Szenario | SEO-Kompatibilitaet |
| :--- | :--- | :--- |
| **Traditionelle Paginierung** | E-Commerce-Listen, Artikellisten | Ausgezeichnet (am besten) |
| **Unendliches Scrollen** | Soziale Feeds, Fotogalerien | Gering (Sonderbehandlung noetig) |
| **Virtual Scroll** | Komplexe Berichte, sehr lange Listen | Sehr gering (Inhalt nicht im DOM) |

### 5.2 SEO bei unendlichem Scrollen beibehalten
Bei unendlichem Scrollen crawlen Suchmaschinen normalerweise nur die erste Seite. Loesungen:
1. **Kombination mit Paginierung**: `<link rel="next" href="...">` Tags bereitstellen.
2. **Noscript Fallback**: Traditionelle Paginierung in `<noscript>` fuer Crawler.
3. **"Mehr laden"-Button**: SSR rendert die ersten 20 Eintraege; weitere Klicks auf "Mehr laden" oder Scrollen loesen Client-side Fetch aus.

---

## 6. Lazy Loading in SSR-Umgebung

### 6.1 Problembeschreibung
In SSR-Umgebungen fuehrt die Verwendung von `IntersectionObserver` fuer Lazy Loading zu Fehlern oder Hydration Mismatch, da der Server kein `window` oder `document` hat.

### 6.2 Loesungen

#### 1. Nuxt-eigene Komponenten verwenden
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Benutzerdefinierte Directive (mit SSR-Behandlung)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. SSR Performance-Monitoring und Tracking

### 7.1 Warum ist Monitoring noetig?
Performance-Engpaesse von SSR-Anwendungen treten oft auf dem Server auf, unsichtbar fuer die Browser-DevTools.

### 7.2 Gaengige Werkzeuge

1. **Nuxt DevTools (Entwicklungsphase)**: Server Routes Antwortzeiten anzeigen.
2. **Lighthouse / PageSpeed Insights (nach dem Deployment)**: Core Web Vitals (LCP, CLS, FID/INP) ueberwachen.
3. **Server-Side Monitoring (APM)**: **Sentry / Datadog**, **OpenTelemetry**.

### 7.3 Einfache Zeitmessung implementieren

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);
  });
});
```

---

## 8. Interview-Zusammenfassung

**F: Wie verfolgt und ueberwacht man SSR-Performance-Probleme?**
> In der Entwicklungsphase verwende ich hauptsaechlich **Nuxt DevTools**. In der Produktionsumgebung ueberwache ich **Core Web Vitals** (besonders LCP) und **TTFB**. Fuer tiefgehende Server-Analyse verwende ich benutzerdefinierte Server Middleware oder integriere **Sentry** / **OpenTelemetry**.

**F: Wie reduziert man die Nuxt 3 Bundle Size?**
> Zuerst analysiere ich mit `nuxi analyze`. Fuer große Pakete wende ich Tree Shaking oder manuelle Aufteilung (`manualChunks`) an. Fuer nicht-erstseiten-relevante Komponenten verwende ich `<LazyComponent>`.

**F: Wie optimiert man die SSR-Geschwindigkeit?**
> Fokus auf TTFB-Reduzierung. Nitro `routeRules` fuer Server-side Caching (SWR). API-Anfragen mit `Promise.all` parallelisieren. Nicht-kritische Daten mit `lazy: true` auf den Client verlagern.

**F: Wie macht man Bildoptimierung?**
> Ich verwende das `@nuxt/image`-Modul fuer automatische WebP-Konvertierung, automatische Skalierung und Lazy Loading.

**F: Wie erhaelt man SEO bei unendlichem Scrollen?**
> Unendliches Scrollen ist nicht SEO-freundlich. Bei Inhaltsseiten bevorzuge ich traditionelle Paginierung. Wenn unendliches Scrollen noetig ist, rendere ich die erste Seite mit SSR und verwende Meta Tags (`rel="next"`) oder Noscript-Paginierungslinks.
