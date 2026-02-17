---
title: '[Lv3] Nuxt 3 Mehrsprachigkeit (i18n) und SEO Best Practices'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Die Implementierung von Mehrsprachigkeit (Internationalization) unter einer SSR-Architektur umfasst nicht nur die Übersetzung von Texten, sondern auch Routing-Strategien, SEO-Tags (hreflang), Zustandsverwaltung und Hydration-Konsistenz.

---

## 1. Kernpunkte für die Interviewantwort

1.  **Routing-Strategie**: Die URL-Präfix-Strategie von `@nuxtjs/i18n` (z.B. `/en/about`, `/jp/about`) zur Unterscheidung der Sprachen verwenden. Dies ist am SEO-freundlichsten.
2.  **SEO-Tags**: Sicherstellen, dass korrekte `<link rel="alternate" hreflang="..." />` und Canonical URL automatisch generiert werden, um Strafen für doppelten Inhalt zu vermeiden.
3.  **Zustandsverwaltung**: In der SSR-Phase die Benutzersprache korrekt erkennen (Cookie/Header) und sicherstellen, dass die Sprache bei der Client-seitigen Hydration konsistent ist.

---

## 2. Nuxt 3 i18n Implementierungsstrategie

### 2.1 Warum `@nuxtjs/i18n` wählen?

Das offizielle Modul `@nuxtjs/i18n` basiert auf `vue-i18n` und ist speziell für Nuxt optimiert. Es löst die häufigen Probleme bei der manuellen i18n-Implementierung:

- Automatische Generierung von Routen mit Sprachpräfix (Auto-generated routes).
- Automatische Verarbeitung von SEO Meta Tags (hreflang, og:locale).
- Unterstützung für Lazy Loading von Sprachpaketen (Optimierung der Bundle-Größe).

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
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: 'Traditionelles Chinesisch' },
    ],
    defaultLocale: 'tw',
    lazy: true, // Lazy Loading aktivieren
    langDir: 'locales', // Verzeichnis für Sprachdateien
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

Dies ist der Schlüssel für SEO. `@nuxtjs/i18n` bietet mehrere Strategien:

1.  **prefix_except_default** (empfohlen):

    - Standardsprache (tw) ohne Präfix: `example.com/about`
    - Andere Sprachen (en) mit Präfix: `example.com/en/about`
    - Vorteil: Saubere URL, konzentriertes SEO-Gewicht.

2.  **prefix_and_default**:

    - Alle Sprachen mit Präfix: `example.com/tw/about`, `example.com/en/about`
    - Vorteil: Einheitliche Struktur, einfache Handhabung von Weiterleitungen.

3.  **no_prefix** (nicht für SEO empfohlen):
    - Alle Sprachen mit der gleichen URL, Umschaltung per Cookie.
    - Nachteil: Suchmaschinen können verschiedene Sprachversionen nicht indexieren.

---

## 3. Wichtige SEO-Implementierung

### 3.1 hreflang Tag

Suchmaschinen müssen wissen, "welche Sprachversionen hat diese Seite". `@nuxtjs/i18n` generiert automatisch im `<head>`:

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Hinweis:** `baseUrl` muss in `nuxt.config.ts` gesetzt werden, sonst generiert hreflang relative Pfade (ungültig).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Muss gesetzt werden!
  },
});
```

### 3.2 Canonical URL

Sicherstellen, dass jede Sprachversion der Seite eine auf sich selbst verweisende Canonical URL hat, um nicht als doppelter Inhalt betrachtet zu werden.

### 3.3 Dynamische Inhaltsübersetzung (API)

Die Backend-API muss ebenfalls Mehrsprachigkeit unterstützen. Normalerweise wird der `Accept-Language` Header bei Anfragen mitgeschickt.

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

## 4. Häufige Herausforderungen und Lösungen

### 4.1 Hydration Mismatch

**Problem:** Server erkennt Englisch und rendert englisches HTML; der Client-Browser hat Chinesisch als Standard, Vue i18n initialisiert auf Chinesisch, was zu Bildschirmflackern oder Hydration Error führt.

**Lösung:**

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
    <NuxtLink :to="switchLocalePath('tw')">Traditionelles Chinesisch</NuxtLink>
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
> Bezüglich **SEO**:
>
> 1.  **URL-Struktur**: Ich verwende die "Unterpfad"-Strategie (z.B. `/en/`, `/tw/`), um verschiedenen Sprachen unabhängige URLs zu geben, damit Suchmaschinen indexieren können.
> 2.  **hreflang**: `<link rel="alternate" hreflang="..." />` muss korrekt gesetzt werden, um Google mitzuteilen, dass diese Seiten verschiedene Sprachversionen desselben Inhalts sind, und Strafen für doppelten Inhalt zu vermeiden. Normalerweise verwende ich das `@nuxtjs/i18n` Modul, um diese Tags automatisch zu generieren.
>
> Bezüglich **Hydration**:
> Sicherstellen, dass die vom Server gerenderte Sprache und die vom Client initialisierte Sprache konsistent sind. Ich konfiguriere die Sprachbestimmung über URL-Präfix oder Cookie und füge die entsprechende Locale im API-Anfrage-Header hinzu.

### 5.2 Routing und Zustand

**Q: Wie implementiert man die Sprachwechsel-Funktion?**

> **Beispielantwort:**
> Ich verwende das von `@nuxtjs/i18n` bereitgestellte `useSwitchLocalePath` Composable.
> Es generiert automatisch die URL der entsprechenden Sprache basierend auf der aktuellen Route (unter Beibehaltung der Query-Parameter) und behandelt die Umwandlung der Routenpräfixe. Dies vermeidet Fehler bei der manuellen Zeichenkettenverkettung und stellt sicher, dass der Benutzer beim Sprachwechsel auf dem ursprünglichen Seiteninhalt bleibt.

---

## 6. Referenzen

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
