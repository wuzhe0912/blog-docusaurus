---
title: '[Lv3] Nuxt 3 Mehrsprachigkeit (i18n) und SEO Best Practices'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Die Implementierung von Mehrsprachigkeit (Internationalization) unter einer SSR-Architektur umfasst nicht nur die Uebersetzung von Texten, sondern auch Routing-Strategien, SEO-Tags (hreflang), Zustandsverwaltung und Hydration-Konsistenz.

---

## 1. Kernpunkte fuer die Interviewantwort

1.  **Routing-Strategie**: Die URL-Praefix-Strategie von `@nuxtjs/i18n` (z.B. `/en/about`, `/jp/about`) zur Unterscheidung der Sprachen verwenden. Dies ist am SEO-freundlichsten.
2.  **SEO-Tags**: Sicherstellen, dass korrekte `<link rel="alternate" hreflang="..." />` und Canonical URL automatisch generiert werden, um Strafen fuer doppelten Inhalt zu vermeiden.
3.  **Zustandsverwaltung**: In der SSR-Phase die Benutzersprache korrekt erkennen (Cookie/Header) und sicherstellen, dass die Sprache bei der Client-seitigen Hydration konsistent ist.

---

## 2. Nuxt 3 i18n Implementierungsstrategie

### 2.1 Warum `@nuxtjs/i18n` waehlen?

Das offizielle Modul `@nuxtjs/i18n` basiert auf `vue-i18n` und ist speziell fuer Nuxt optimiert. Es loest die haeufigen Probleme bei der manuellen i18n-Implementierung:

- Automatische Generierung von Routen mit Sprachpraefix (Auto-generated routes).
- Automatische Verarbeitung von SEO Meta Tags (hreflang, og:locale).
- Unterstuetzung fuer Lazy Loading von Sprachpaketen (Optimierung der Bundle-Groesse).

### 2.2 Installation und Konfiguration

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: '繁體中文' },
    ],
    defaultLocale: 'tw',
    lazy: true, // Lazy Loading aktivieren
    langDir: 'locales', // Verzeichnis fuer Sprachdateien
    strategy: 'prefix_and_default', // Wichtige Routing-Strategie
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Nur am Root-Pfad erkennen und umleiten
    },
  },
});
```

### 2.3 Routing-Strategie (Routing Strategy)

Dies ist der Schluessel fuer SEO. `@nuxtjs/i18n` bietet mehrere Strategien:

1.  **prefix_except_default** (empfohlen):

    - Standardsprache (tw) ohne Praefix: `example.com/about`
    - Andere Sprachen (en) mit Praefix: `example.com/en/about`
    - Vorteil: Saubere URL, konzentriertes SEO-Gewicht.

2.  **prefix_and_default**:

    - Alle Sprachen mit Praefix: `example.com/tw/about`, `example.com/en/about`
    - Vorteil: Einheitliche Struktur, einfache Handhabung von Weiterleitungen.

3.  **no_prefix** (nicht fuer SEO empfohlen):
    - Alle Sprachen mit der gleichen URL, Umschaltung per Cookie.
    - Nachteil: Suchmaschinen koennen verschiedene Sprachversionen nicht indexieren.

---

## 3. Wichtige SEO-Implementierung

### 3.1 hreflang Tag

Suchmaschinen muessen wissen, "welche Sprachversionen hat diese Seite". `@nuxtjs/i18n` generiert automatisch im `<head>`:

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Hinweis:** `baseUrl` muss in `nuxt.config.ts` gesetzt werden, sonst generiert hreflang relative Pfade (ungueltig).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Muss gesetzt werden!
  },
});
```

### 3.2 Canonical URL

Sicherstellen, dass jede Sprachversion der Seite eine auf sich selbst verweisende Canonical URL hat, um nicht als doppelter Inhalt betrachtet zu werden.

### 3.3 Dynamische Inhaltsuebersetzung (API)

Die Backend-API muss ebenfalls Mehrsprachigkeit unterstuetzen. Normalerweise wird der `Accept-Language` Header bei Anfragen mitgeschickt.

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // Aktuelle Sprache an das Backend senden
    },
  });
};
```

---

## 4. Haeufige Herausforderungen und Loesungen

### 4.1 Hydration Mismatch

**Problem:** Server erkennt Englisch und rendert englisches HTML; der Client-Browser hat Chinesisch als Standard, Vue i18n initialisiert auf Chinesisch, was zu Bildschirmflackern oder Hydration Error fuehrt.

**Loesung:**

- `detectBrowserLanguage` Einstellung verwenden, damit der Client bei der Initialisierung die URL- oder Cookie-Einstellung respektiert, nicht die Browser-Einstellung.
- Sicherstellen, dass die `defaultLocale` Einstellung von Server und Client konsistent ist.

### 4.2 Sprachwechsel

`switchLocalePath` verwenden, um Links zu generieren, anstatt Zeichenketten manuell zusammenzusetzen.

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <nav>
    <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="switchLocalePath('tw')">繁體中文</NuxtLink>
  </nav>
</template>
```

---

## 5. Interview-Schwerpunkte

### 5.1 i18n und SEO

**Q: Worauf muss man bei Mehrsprachigkeit (i18n) in einer SSR-Umgebung achten? Wie wird SEO behandelt?**

> **Beispielantwort:**
> Bei i18n in einer SSR-Umgebung sind **SEO** und **Hydration-Konsistenz** am wichtigsten.
>
> Bezueglich **SEO**:
>
> 1.  **URL-Struktur**: Ich verwende die "Unterpfad"-Strategie (z.B. `/en/`, `/tw/`), um verschiedenen Sprachen unabhaengige URLs zu geben, damit Suchmaschinen indexieren koennen.
> 2.  **hreflang**: `<link rel="alternate" hreflang="..." />` muss korrekt gesetzt werden, um Google mitzuteilen, dass diese Seiten verschiedene Sprachversionen desselben Inhalts sind, und Strafen fuer doppelten Inhalt zu vermeiden. Normalerweise verwende ich das `@nuxtjs/i18n` Modul, um diese Tags automatisch zu generieren.
>
> Bezueglich **Hydration**:
> Sicherstellen, dass die vom Server gerenderte Sprache und die vom Client initialisierte Sprache konsistent sind. Ich konfiguriere die Sprachbestimmung ueber URL-Praefix oder Cookie und fuege die entsprechende Locale im API-Anfrage-Header hinzu.

### 5.2 Routing und Zustand

**Q: Wie implementiert man die Sprachwechsel-Funktion?**

> **Beispielantwort:**
> Ich verwende das von `@nuxtjs/i18n` bereitgestellte `useSwitchLocalePath` Composable.
> Es generiert automatisch die URL der entsprechenden Sprache basierend auf der aktuellen Route (unter Beibehaltung der Query-Parameter) und behandelt die Umwandlung der Routenpraefixe. Dies vermeidet Fehler bei der manuellen Zeichenkettenverkettung und stellt sicher, dass der Benutzer beim Sprachwechsel auf dem urspruenglichen Seiteninhalt bleibt.

---

## 6. Referenzen

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
