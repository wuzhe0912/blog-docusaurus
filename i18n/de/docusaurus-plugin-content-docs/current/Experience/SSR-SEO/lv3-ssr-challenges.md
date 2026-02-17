---
title: '[Lv3] SSR-Implementierungsprobleme und Lösungen'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Häufige Probleme bei SSR-Implementierungen und bewährte Lösungen: Hydration Mismatch, Umgebungsvariablen, Drittanbieter-Kompatibilität, Performance und Deployment.

---

## Interview-Szenario

**Frage: Welche Schwierigkeiten sind bei SSR aufgetreten und wie wurden sie gelöst?**

Was Interviewer dabei prüfen:

1. **Praxis**: Wurde SSR wirklich im Projekt umgesetzt?
2. **Problemlogik**: Wie wird analysiert und priorisiert?
3. **Tiefe**: Verständnis für Rendering, Hydration, Caching, Deployments.
4. **Best Practices**: Robuste, wartbare und messbare Lösungen.

---

## Herausforderung 1: Hydration Mismatch

### Problembeschreibung

Typische Warnung:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Häufige Ursachen:

- Unterschiedliche Ausgabe zwischen Server- und Client-Render
- Nutzung browser-exklusiver APIs im SSR-Pfad (`window`, `document`, `localStorage`)
- Nicht-deterministische Werte (`Date.now()`, `Math.random()`)

### Lösungen

#### Variante A: `ClientOnly` einsetzen

```vue
<template>
  <div>
    <h1>SSR-Inhalt</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>Lade...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

#### Variante B: Client-seitige Guards

```vue
<script setup lang="ts">
const ua = ref('');

onMounted(() => {
  if (process.client) {
    ua.value = window.navigator.userAgent;
  }
});
</script>
```

**Interview-Kernaussage:** SSR-Ausgabe muss deterministisch sein; browser-only Logik strikt in Client-Pfade verschieben.

---

## Herausforderung 2: Umgebungsvariablen

### Problembeschreibung

- Serverseitige Secrets dürfen nicht im Client landen.
- `process.env` ungeordnet genutzt -> schwer nachvollziehbare Konfiguration.

### Lösung

Mit Runtime Config trennen:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
```

```ts
// Verwendung
const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // Client + Server
const secret = config.apiSecret; // Nur Server
```

**Interview-Kernaussage:** Sensitive Variablen nur serverseitig, öffentliche Konfiguration explizit im `public`-Block.

---

## Herausforderung 3: Drittanbieter-Bibliotheken ohne SSR-Support

### Problembeschreibung

- Manche Pakete greifen während SSR auf DOM-APIs zu.
- Folgen: Build-/Runtime-Fehler oder Hydration-Probleme.

### Lösungen

1. Bibliothek nur clientseitig laden (Plugin `.client.ts`)
2. Dynamischer Import im Client-Kontext
3. SSR-kompatible Alternative prüfen

```ts
let chartLib: any;
if (process.client) {
  chartLib = await import('chart.js/auto');
}
```

**Interview-Kernaussage:** Erst Ursache isolieren, dann Client-Isolation oder Library-Wechsel.

---

## Herausforderung 4: Cookie- und Header-Verarbeitung

### Problembeschreibung

- Auth in SSR braucht Cookie-Lesen auf dem Server.
- Header müssen zwischen Client, SSR und API konsistent sein.

### Lösung

```ts
const token = useCookie('access_token');

const { data } = await useFetch('/api/me', {
  headers: process.server
    ? useRequestHeaders(['cookie'])
    : undefined,
  credentials: 'include',
});
```

**Interview-Kernaussage:** SSR-Requests dürfen Auth-Kontext nicht verlieren.

---

## Herausforderung 5: Timing bei asynchronem Laden

### Problembeschreibung

- Mehrere Komponenten laden dieselben Daten.
- Duplicate Requests und inkonsistente Ladezustände.

### Lösung

- Einheitliche keys für deduplication
- Shared Composables für Datenzugriff
- Klare Trennung: Initial Load vs User Action

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Interview-Kernaussage:** Datenfluss zentralisieren, statt in jeder Komponente neu zu laden.

---

## Herausforderung 6: Performance / Server-Last

### Problembeschreibung

- SSR erhöht CPU- und I/O-Last.
- Hohe Lastzeiten vergrößern TTFB.

### Lösungen

1. Nitro Caching
2. DB-Abfragen optimieren
3. SSR/CSR nach SEO-Relevanz aufteilen
4. CDN korrekt vorschalten

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Interview-Kernaussage:** Performance ist ein Architekturthema, nicht nur ein Frontend-Detail.

---

## Herausforderung 7: Fehlerbehandlung und 404

### Problembeschreibung

- Dynamische IDs können ungültig sein.
- Fehlende 404-Semantik führt zu SEO-Fehlindexierung.

### Lösung

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Zusatz:

- `error.vue` für klare Fehlkommunikation
- Fehlerseiten auf `noindex, nofollow`

**Interview-Kernaussage:** HTTP-Status, UX und SEO müssen konsistent sein.

---

## Herausforderung 8: Browser-only APIs

### Problembeschreibung

- SSR-Kontext hat kein `window`/`document`.
- Direkter Zugriff verursacht Runtime-Fehler.

### Lösung

```ts
const width = ref<number | null>(null);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Oder abgesichert:

```ts
if (process.client) {
  localStorage.setItem('theme', 'dark');
}
```

**Interview-Kernaussage:** Browser-APIs nur in klar gekapselten Client-Phasen nutzen.

---

## Herausforderung 9: Server-side Memory Leak

### Problembeschreibung

- Langlaufender Node-Prozess wächst kontinuierlich im Speicher.
- Ursachen oft globale Mutable States, nicht bereinigte Timer/Listener.

### Lösungen

1. Request-spezifischen Zustand nicht global halten
2. Listener/Interval sauber aufräumen
3. Mit Heap Snapshots und `process.memoryUsage()` beobachten

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Interview-Kernaussage:** Leaks in SSR sind Betriebsrisiko und Security-Risiko (State-Leak zwischen Requests).

---

## Herausforderung 10: Ads und Tracking-Skripte

### Problembeschreibung

- Drittanbieter-Skripte blockieren Main Thread oder stören Hydration.
- CLS/FID/INP leiden.

### Lösung

- Skripte asynchron laden, spät injizieren
- Platzhalterflächen für Ads reservieren
- Kritische UI nicht von Tracking abh. machen

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Interview-Kernaussage:** Monetarisierung darf Rendering-Stabilität nicht zerstören.

---

## Herausforderung 11: Deployment-Architektur (SSR vs SPA)

### Problembeschreibung

- SPA-Deployment ist statisch und simpel.
- SSR braucht Compute-Layer, Observability und Prozessmanagement.

### Vergleich

| Aspekt          | SPA (Static)            | SSR (Node/Edge)                        |
| --------------- | ----------------------- | -------------------------------------- |
| Infrastruktur   | Storage + CDN           | Compute + CDN                          |
| Betrieb         | Sehr einfach            | Mittlere Komplexität                   |
| Kosten          | Niedrig                 | Höher (Rechenzeit)                     |
| Monitoring      | Minimal                 | Logs, Metrics, Memory, Cold Start      |

### Praxisempfehlungen

1. PM2/Container für Prozessstabilität
2. CDN + Cache-Control korrekt setzen
3. Staging mit Lasttests vor Produktion
4. Error Budget und Alerting definieren

**Interview-Kernaussage:** SSR ist nicht nur Rendering, sondern auch Betriebsarchitektur.

---

## Interview-Zusammenfassung

**Mögliche Antwort in 30-45 Sekunden:**

> In SSR-Projekten sind für mich vier Problemgruppen entscheidend: erstens deterministisches Rendering zur Vermeidung von Hydration-Mismatch, zweitens saubere Trennung von Server- und Client-Konfiguration inklusive Cookie/Header-Flow, drittens Performance über Deduplication, Caching und SSR/CSR-Splitting, und viertens verlässliche Betriebsfähigkeit mit klarer Fehlerbehandlung, Leak-Monitoring und geeigneter Deployment-Architektur.

**Checkliste für die Antwort:**
- ✅ Mindestens ein konkretes Problem mit Ursache nennen
- ✅ Technische Gegenmaßnahmen zeigen
- ✅ Auswirkungen auf SEO/Performance/Betrieb benennen
- ✅ Mit einem realistischen Projektkontext abschließen
