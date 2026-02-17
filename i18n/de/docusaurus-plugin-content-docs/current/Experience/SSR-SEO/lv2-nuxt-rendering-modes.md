---
title: '[Lv2] Nuxt 3 Rendering Modes: SSR, SSG, CSR Auswahlstrategie'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Die Rendering Modes von Nuxt 3 verstehen und je nach Projektanforderungen die passende Rendering-Strategie (SSR, SSG, CSR) auswählen können.

---

## 1. Kernpunkte für das Vorstellungsgespräch

1. **Rendering Modes Klassifizierung**: Nuxt 3 unterstützt vier Modi: SSR, SSG, CSR, Hybrid Rendering
2. **Auswahlstrategie**: Basierend auf SEO-Anforderungen, Content-Dynamik und Performance-Anforderungen den passenden Modus wählen
3. **Implementierungserfahrung**: Wie man verschiedene Rendering Modes im Projekt konfiguriert und auswählt

---

## 2. Nuxt 3 Rendering Modes Einführung

### 2.1 Vier Rendering Modes

Nuxt 3 unterstützt vier Haupt-Rendering-Modes:

| Modus | Vollständiger Name | Rendering-Zeitpunkt | Anwendungsszenarien |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | Bei jeder Anfrage serverseitig gerendert | SEO + dynamischer Inhalt erforderlich |
| **SSG** | Static Site Generation | HTML wird beim Build vorab generiert | SEO + fester Inhalt erforderlich |
| **CSR** | Client-Side Rendering | Rendering im Browser | Kein SEO erforderlich + hohe Interaktivität |
| **Hybrid** | Hybrid Rendering | Gemischte Nutzung mehrerer Modi | Verschiedene Seiten haben verschiedene Anforderungen |

### 2.2 SSR (Server-Side Rendering)

**Definition:** Bei jeder Anfrage wird auf der Server-Seite JavaScript ausgeführt, um vollständiges HTML zu generieren und an den Browser zu senden.

**Konfiguration:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Standard ist true
});
```

**Ablauf:**
1. Browser fordert die Seite an
2. Server führt JavaScript aus und generiert vollständiges HTML
3. HTML wird an den Browser gesendet
4. Browser führt Hydration durch (Aktivierung interaktiver Funktionen)

**Vorteile:**
- ✅ SEO-freundlich (Suchmaschinen können den vollständigen Inhalt sehen)
- ✅ Schnelles erstes Laden (kein Warten auf JavaScript-Ausführung)
- ✅ Unterstützung dynamischer Inhalte (bei jeder Anfrage aktuelle Daten abrufbar)

**Nachteile:**
- ❌ Höhere Server-Belastung (jede Anfrage erfordert Rendering)
- ❌ TTFB (Time To First Byte) kann länger sein
- ❌ Server-Umgebung erforderlich

**Anwendungsszenarien:**
- E-Commerce-Produktseiten (SEO + dynamische Preise/Lagerbestände erforderlich)
- Nachrichtenartikelseiten (SEO + dynamischer Inhalt erforderlich)
- Benutzerprofilseiten (SEO + personalisierte Inhalte erforderlich)

### 2.3 SSG (Static Site Generation)

**Definition:** Zur Build-Zeit (Build Time) werden alle HTML-Seiten vorab generiert und als statische Dateien bereitgestellt.

**Konfiguration:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG erfordert SSR auf true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // Routen für Pre-Rendering angeben
    },
  },
});

// Oder mit routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**Ablauf:**
1. Beim Build wird JavaScript ausgeführt und HTML für alle Seiten generiert
2. HTML-Dateien werden auf CDN bereitgestellt
3. Bei Browser-Anfragen wird das vorab generierte HTML direkt zurückgegeben

**Vorteile:**
- ✅ Beste Performance (CDN-Cache, schnelle Antwortzeiten)
- ✅ SEO-freundlich (vollständiger HTML-Inhalt)
- ✅ Minimale Server-Belastung (kein Laufzeit-Rendering erforderlich)
- ✅ Niedrige Kosten (Deployment auf CDN möglich)

**Nachteile:**
- ❌ Nicht geeignet für dynamische Inhalte (Rebuild für Updates erforderlich)
- ❌ Build-Zeit kann lang sein (bei vielen Seiten)
- ❌ Kann benutzerspezifische Inhalte nicht verarbeiten

**Anwendungsszenarien:**
- Über-uns-Seite (fester Inhalt)
- Produktbeschreibungsseite (relativ fester Inhalt)
- Blogartikel (ändern sich nach Veröffentlichung nicht häufig)

### 2.4 CSR (Client-Side Rendering)

**Definition:** JavaScript wird im Browser ausgeführt, um HTML-Inhalte dynamisch zu generieren.

**Konfiguration:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // SSR global deaktivieren
});

// Oder für bestimmte Routen
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// Oder in der Seite konfigurieren
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**Ablauf:**
1. Browser fordert HTML an (normalerweise eine leere Shell)
2. JavaScript-Bundle herunterladen
3. JavaScript ausführen, Inhalt dynamisch generieren
4. Seite rendern

**Vorteile:**
- ✅ Hohe Interaktivität, geeignet für SPA
- ✅ Reduzierte Server-Belastung
- ✅ Flüssige Seitenwechsel (kein Neuladen erforderlich)

**Nachteile:**
- ❌ SEO-unfreundlich (Suchmaschinen können möglicherweise nicht korrekt indexieren)
- ❌ Längere erste Ladezeit (JavaScript muss heruntergeladen und ausgeführt werden)
- ❌ JavaScript erforderlich, um Inhalte zu sehen

**Anwendungsszenarien:**
- Backend-Verwaltungssysteme (kein SEO erforderlich)
- Benutzer-Dashboards (kein SEO erforderlich)
- Interaktive Anwendungen (z.B. Spiele, Tools)

### 2.5 Hybrid Rendering (Hybrides Rendering)

**Definition:** Basierend auf den Anforderungen verschiedener Seiten werden mehrere Rendering Modes gemischt verwendet.

**Konfiguration:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Standard SSR
  routeRules: {
    // Seiten, die SEO benötigen: SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // Seiten mit festem Inhalt: SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // Seiten ohne SEO-Bedarf: CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**Vorteile:**
- ✅ Passenden Modus basierend auf Seitenmerkmalen auswählen
- ✅ Balance zwischen SEO, Performance und Entwicklungserfahrung
- ✅ Hohe Flexibilität

**Anwendungsszenarien:**
- Große Projekte (verschiedene Seiten haben verschiedene Anforderungen)
- E-Commerce-Plattformen (Produktseite SSR, Backend CSR, Über-uns-Seite SSG)

### 2.6 ISR (Incremental Static Regeneration)

**Definition:** Inkrementelle statische Regenerierung. Kombiniert die Performance von SSG mit der Dynamik von SSR. Seiten generieren statisches HTML beim Build oder bei der ersten Anfrage und werden für einen bestimmten Zeitraum (TTL) gecacht. Bei der nächsten Anfrage nach Ablauf des Caches wird die Seite im Hintergrund neu generiert, während der alte Cache-Inhalt zurückgegeben wird (Stale-While-Revalidate).

**Konfiguration:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // ISR aktivieren, 1 Stunde cachen (3600 Sekunden)
    '/blog/**': { swr: 3600 },
    // Oder die isr-Eigenschaft verwenden (spezifische Unterstützung auf Netlify/Vercel usw.)
    '/products/**': { isr: 600 },
  },
});
```

**Ablauf:**
1. Anfrage A kommt an: Server rendert die Seite, gibt sie zurück und cached sie (Cache MISS -> HIT).
2. Anfrage B kommt an (innerhalb TTL): Gibt gecachten Inhalt direkt zurück (Cache HIT).
3. Anfrage C kommt an (nach TTL): Gibt alten Cache zurück (Stale) und rendert im Hintergrund neu und aktualisiert den Cache (Revalidate).
4. Anfrage D kommt an: Gibt neuen gecachten Inhalt zurück.

**Vorteile:**
- ✅ Nahezu SSG-ähnliche ultimative Performance
- ✅ Löst das Problem langer SSG-Build-Zeiten
- ✅ Inhalte können regelmäßig aktualisiert werden

**Anwendungsszenarien:**
- Große Blogs
- E-Commerce-Produktdetailseiten
- Nachrichtenwebsites

### 2.7 Route Rules und Caching-Strategien

Nuxt 3 verwendet `routeRules` zur einheitlichen Verwaltung von Hybrid Rendering und Caching-Strategien. Dies wird auf Nitro-Ebene verarbeitet.

| Eigenschaft | Bedeutung | Anwendungsszenarien |
|------|------|---------|
| `ssr: true` | Server-Side Rendering erzwingen | SEO + hohe Dynamik |
| `ssr: false` | Client-Side Rendering (SPA) erzwingen | Backend, Dashboard |
| `prerender: true` | Beim Build vorrendern (SSG) | Über uns, AGB-Seite |
| `swr: true` | SWR-Cache aktivieren (keine Ablaufzeit, bis zum Redeployment) | Inhalt mit minimalen Änderungen |
| `swr: 60` | ISR aktivieren, 60 Sekunden cachen | Listenseiten, Event-Seiten |
| `cache: { maxAge: 60 }` | Cache-Control Header setzen (Browser/CDN Cache) | Statische Ressourcen |

---

## 3. Auswahlstrategie

### 3.1 Rendering Mode basierend auf Anforderungen auswählen

**Entscheidungsdiagramm:**

```
SEO erforderlich?
├─ Ja → Ändert sich der Inhalt häufig?
│   ├─ Ja → SSR
│   └─ Nein → SSG
└─ Nein → CSR
```

**Auswahlvergleichstabelle:**

| Anforderung | Empfohlener Modus | Grund |
|------|---------|------|
| **SEO erforderlich** | SSR / SSG | Suchmaschinen können vollständigen Inhalt sehen |
| **Häufig wechselnder Inhalt** | SSR | Bei jeder Anfrage aktuelle Inhalte abrufbar |
| **Relativ fester Inhalt** | SSG | Beste Performance, niedrigste Kosten |
| **Kein SEO erforderlich** | CSR | Hohe Interaktivität, flüssige Seitenwechsel |
| **Viele Seiten** | SSG | Beim Build generiert, CDN-Cache |
| **Benutzerspezifischer Inhalt** | SSR / CSR | Dynamische Generierung erforderlich |

### 3.2 Praxisbeispiele

#### Beispiel 1: E-Commerce-Plattform

**Anforderungen:**
- Produktseiten benötigen SEO (Google-Indexierung)
- Produktinhalte ändern sich häufig (Preise, Lagerbestände)
- Benutzerprofilseiten benötigen kein SEO

**Lösung:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Produktseite: SSR (SEO + dynamischer Inhalt erforderlich)
    '/products/**': { ssr: true },

    // Über uns: SSG (fester Inhalt)
    '/about': { prerender: true },

    // Benutzerseite: CSR (kein SEO erforderlich)
    '/user/**': { ssr: false },
  },
});
```

#### Beispiel 2: Blog-Website

**Anforderungen:**
- Artikelseiten benötigen SEO
- Artikelinhalte sind relativ fest (ändern sich nach Veröffentlichung nicht häufig)
- Schnelles Laden erforderlich

**Lösung:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Artikelseite: SSG (fester Inhalt + SEO erforderlich)
    '/articles/**': { prerender: true },

    // Startseite: SSG (fester Inhalt)
    '/': { prerender: true },

    // Backend-Verwaltung: CSR (kein SEO erforderlich)
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. Wichtige Punkte für das Vorstellungsgespräch

### 4.1 Nuxt 3 Rendering Modes

**So können Sie antworten:**

> Nuxt 3 unterstützt vier Rendering Modes: SSR rendert bei jeder Anfrage serverseitig und eignet sich für Seiten, die SEO und dynamische Inhalte benötigen; SSG generiert HTML beim Build vorab und eignet sich für Seiten mit SEO-Bedarf und festem Inhalt mit der besten Performance; CSR rendert im Browser und eignet sich für Seiten ohne SEO-Bedarf mit hoher Interaktivität; Hybrid Rendering kombiniert mehrere Modi und wählt basierend auf den Anforderungen verschiedener Seiten den passenden Modus.

**Kernpunkte:**
- ✅ Eigenschaften und Unterschiede der vier Modi
- ✅ Anwendungsszenarien und Auswahlkriterien
- ✅ Vorteile von Hybrid Rendering

### 4.2 Wie wählt man den Rendering Mode?

**So können Sie antworten:**

> Bei der Wahl des Rendering Mode werden hauptsächlich drei Faktoren berücksichtigt: SEO-Anforderungen, Content-Dynamik und Performance-Anforderungen. Seiten, die SEO benötigen, wählen SSR oder SSG; häufig wechselnde Inhalte wählen SSR; feste Inhalte wählen SSG; Seiten ohne SEO-Bedarf können CSR wählen. In der Praxis wird meist Hybrid Rendering verwendet, wobei basierend auf den Merkmalen verschiedener Seiten der passende Modus gewählt wird. Beispielsweise verwendet eine E-Commerce-Plattform SSR für Produktseiten (SEO + dynamischer Inhalt), SSG für die Über-uns-Seite (fester Inhalt) und CSR für Benutzerprofilseiten (kein SEO).

**Kernpunkte:**
- ✅ Auswahl basierend auf SEO-Anforderungen, Content-Dynamik und Performance
- ✅ Gemischte Nutzung mehrerer Modi in realen Projekten
- ✅ Erklärung anhand konkreter Beispiele

### 4.3 ISR und Route Rules
**Q: Wie implementiert man ISR (Incremental Static Regeneration)? Welche Caching-Mechanismen bietet Nuxt 3?**

> **Antwortbeispiel:**
> In Nuxt 3 können wir ISR über `routeRules` implementieren.
> Durch einfaches Setzen von `{ swr: Sekunden }` in `nuxt.config.ts` aktiviert Nitro automatisch den Stale-While-Revalidate-Mechanismus.
> Zum Beispiel bedeutet `'/blog/**': { swr: 3600 }`, dass die Seiten unter diesem Pfad 1 Stunde gecacht werden.
> `routeRules` ist sehr leistungsfähig und ermöglicht es, verschiedene Strategien für verschiedene Pfade festzulegen: Einige Seiten laufen über SSR, einige über SSG (`prerender: true`), einige über ISR (`swr`) und einige über CSR (`ssr: false`) - das ist der Kern von Hybrid Rendering.

---

## 5. Best Practices

### 5.1 Auswahlprinzipien

1. **Seiten, die SEO benötigen**
   - Fester Inhalt → SSG
   - Dynamischer Inhalt → SSR

2. **Seiten ohne SEO-Bedarf**
   - Hohe Interaktivität → CSR
   - Server-seitige Logik erforderlich → SSR

3. **Hybride Strategie**
   - Passenden Modus basierend auf Seitenmerkmalen wählen
   - Einheitliche Verwaltung mit `routeRules`

### 5.2 Konfigurationsempfehlungen

1. **Standardmäßig SSR verwenden**
   - SEO-Freundlichkeit sicherstellen
   - Kann später für bestimmte Seiten angepasst werden

2. **Einheitliche Verwaltung mit routeRules**
   - Zentralisierte Konfiguration, einfache Wartung
   - Klare Kennzeichnung des Rendering-Modus jeder Seite

3. **Regelmäßige Überprüfung und Optimierung**
   - Basierend auf tatsächlicher Nutzung anpassen
   - Performance-Metriken überwachen

---

## 6. Zusammenfassung für das Vorstellungsgespräch

**So können Sie antworten:**

> Nuxt 3 unterstützt vier Rendering Modes: SSR, SSG, CSR und Hybrid Rendering. SSR eignet sich für Seiten, die SEO und dynamische Inhalte benötigen; SSG eignet sich für Seiten mit SEO-Bedarf und festem Inhalt mit der besten Performance; CSR eignet sich für Seiten ohne SEO-Bedarf mit hoher Interaktivität. Bei der Auswahl werden hauptsächlich SEO-Anforderungen, Content-Dynamik und Performance-Anforderungen berücksichtigt. In der Praxis wird meist Hybrid Rendering verwendet, wobei basierend auf den Merkmalen verschiedener Seiten der passende Modus gewählt wird. Beispielsweise verwendet eine E-Commerce-Plattform SSR für Produktseiten, SSG für die Über-uns-Seite und CSR für Benutzerprofilseiten.

**Kernpunkte:**
- ✅ Eigenschaften und Unterschiede der vier Rendering Modes
- ✅ Auswahlstrategie und Bewertungsfaktoren
- ✅ Implementierungserfahrung mit Hybrid Rendering
- ✅ Praxisbeispiele aus realen Projekten

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
