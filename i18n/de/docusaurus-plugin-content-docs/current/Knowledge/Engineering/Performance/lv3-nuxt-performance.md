---
title: '[Lv3] Nuxt 3 Performance-Optimierung: Bundle Size, SSR-Geschwindigkeit und Bildoptimierung'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Komplettleitfaden zur Nuxt 3 Performance-Optimierung: Von der Bundle-Size-Verkleinerung über SSR-Geschwindigkeitsoptimierung bis hin zu Bildladestrategien für maximale Performance.

---

## 1. Hauptachse der Interview-Antwort

1. **Bundle Size Optimierung**: Analyse (`nuxi analyze`), Aufteilung (`SplitChunks`), Tree Shaking, Lazy Loading.
2. **SSR-Geschwindigkeitsoptimierung (TTFB)**: Redis Cache, Nitro Cache, Reduzierung blockierender API-Aufrufe, Streaming SSR.
3. **Bildoptimierung**: `@nuxt/image`, WebP-Format, CDN, Lazy Loading.
4. **Optimierung großer Datenmengen**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Wie reduziert man die Bundle Size von Nuxt 3?

### 2.1 Diagnosewerkzeuge

Zunächst muss man wissen, wo der Engpass liegt. Verwenden Sie `nuxi analyze`, um die Bundle-Struktur zu visualisieren.

```bash
npx nuxi analyze
```

Dies erzeugt einen Bericht, der zeigt, welche Pakete am meisten Platz einnehmen.

### 2.2 Optimierungsstrategien

#### 1. Code Splitting
Nuxt 3 macht standardmäßig bereits routenbasiertes Code Splitting. Bei großen Paketen (wie ECharts, Lodash) müssen wir manuell optimieren.

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
Stellen Sie sicher, dass nur benötigte Module importiert werden, nicht das gesamte Paket.

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
Für Komponenten, die nicht auf der ersten Seite benötigt werden, das `Lazy`-Präfix für dynamische Imports verwenden.

```vue
<template>
  <div>
    <!-- Der Komponentencode wird erst geladen, wenn show true ist -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Unnötige Server-side-Pakete entfernen
Stellen Sie sicher, dass Pakete, die nur auf dem Server verwendet werden (Datenbanktreiber, fs-Operationen), nicht in den Client gebündelt werden. Nuxt 3 behandelt automatisch Dateien mit `.server.ts`-Endung oder das `server/`-Verzeichnis.

---

## 3. Wie optimiert man die SSR-Geschwindigkeit (TTFB)?

### 3.1 Warum ist der TTFB zu lang?
TTFB (Time To First Byte) ist der Schlüsselindikator für SSR-Performance. Häufige Ursachen:
1. **Langsame API-Antworten**: Der Server muss auf Backend-API-Antworten warten, bevor HTML gerendert werden kann.
2. **Serielle Anfragen**: Mehrere API-Anfragen werden nacheinander statt parallel ausgeführt.
3. **Aufwändige Berechnungen**: Server führt zu viele CPU-intensive Aufgaben aus.

### 3.2 Optimierungslösungen

#### 1. Server-Side Caching (Nitro Cache)
Nitro's Cache-Funktionalität nutzen, um API-Antworten oder Rendering-Ergebnisse zwischenzuspeichern.

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
// Langsam: serielle Ausführung (Gesamtzeit = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// Schnell: parallele Ausführung (Gesamtzeit = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Nicht-kritische Daten verzögern (Lazy Fetching)
Daten, die nicht auf der ersten Seite benötigt werden, können auf dem Client geladen werden (`lazy: true`).

```typescript
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false,
});
```

#### 4. Streaming SSR (experimentell)
Nuxt 3 unterstützt HTML Streaming: gleichzeitig rendern und senden.

---

## 4. Nuxt 3 Bildoptimierung

### 4.1 Verwendung von @nuxt/image
Das offizielle Modul `@nuxt/image` ist die optimale Lösung:
- **Automatische Formatkonvertierung**: automatisch zu WebP/AVIF.
- **Automatische Skalierung**: erzeugt Bilder in passender Größe.
- **Lazy Loading**: eingebautes Lazy Loading.
- **CDN-Integration**: unterstützt Cloudinary, Imgix und andere Provider.

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

### 5.1 Lösungsauswahl
Bei großen Datenmengen (z.B. 10.000 Produkte) gibt es drei Hauptstrategien unter Berücksichtigung von **SEO**:

| Strategie | Geeignetes Szenario | SEO-Kompatibilität |
| :--- | :--- | :--- |
| **Traditionelle Paginierung** | E-Commerce-Listen, Artikellisten | Ausgezeichnet (am besten) |
| **Unendliches Scrollen** | Soziale Feeds, Fotogalerien | Gering (Sonderbehandlung nötig) |
| **Virtual Scroll** | Komplexe Berichte, sehr lange Listen | Sehr gering (Inhalt nicht im DOM) |

### 5.2 SEO bei unendlichem Scrollen beibehalten
Bei unendlichem Scrollen crawlen Suchmaschinen normalerweise nur die erste Seite. Lösungen:
1. **Kombination mit Paginierung**: `<link rel="next" href="...">` Tags bereitstellen.
2. **Noscript Fallback**: Traditionelle Paginierung in `<noscript>` für Crawler.
3. **"Mehr laden"-Button**: SSR rendert die ersten 20 Einträge; weitere Klicks auf "Mehr laden" oder Scrollen lösen Client-side Fetch aus.

---

## 6. Lazy Loading in SSR-Umgebung

### 6.1 Problembeschreibung
In SSR-Umgebungen führt die Verwendung von `IntersectionObserver` für Lazy Loading zu Fehlern oder Hydration Mismatch, da der Server kein `window` oder `document` hat.

### 6.2 Lösungen

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

### 7.1 Warum ist Monitoring nötig?
Performance-Engpässe von SSR-Anwendungen treten oft auf dem Server auf, unsichtbar für die Browser-DevTools.

### 7.2 Gängige Werkzeuge

1. **Nuxt DevTools (Entwicklungsphase)**: Server Routes Antwortzeiten anzeigen.
2. **Lighthouse / PageSpeed Insights (nach dem Deployment)**: Core Web Vitals (LCP, CLS, FID/INP) überwachen.
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

**F: Wie verfolgt und überwacht man SSR-Performance-Probleme?**
> In der Entwicklungsphase verwende ich hauptsächlich **Nuxt DevTools**. In der Produktionsumgebung überwache ich **Core Web Vitals** (besonders LCP) und **TTFB**. Für tiefgehende Server-Analyse verwende ich benutzerdefinierte Server Middleware oder integriere **Sentry** / **OpenTelemetry**.

**F: Wie reduziert man die Nuxt 3 Bundle Size?**
> Zuerst analysiere ich mit `nuxi analyze`. Für große Pakete wende ich Tree Shaking oder manuelle Aufteilung (`manualChunks`) an. Für nicht-erstseiten-relevante Komponenten verwende ich `<LazyComponent>`.

**F: Wie optimiert man die SSR-Geschwindigkeit?**
> Fokus auf TTFB-Reduzierung. Nitro `routeRules` für Server-side Caching (SWR). API-Anfragen mit `Promise.all` parallelisieren. Nicht-kritische Daten mit `lazy: true` auf den Client verlagern.

**F: Wie macht man Bildoptimierung?**
> Ich verwende das `@nuxt/image`-Modul für automatische WebP-Konvertierung, automatische Skalierung und Lazy Loading.

**F: Wie erhält man SEO bei unendlichem Scrollen?**
> Unendliches Scrollen ist nicht SEO-freundlich. Bei Inhaltsseiten bevorzuge ich traditionelle Paginierung. Wenn unendliches Scrollen nötig ist, rendere ich die erste Seite mit SSR und verwende Meta Tags (`rel="next"`) oder Noscript-Paginierungslinks.
