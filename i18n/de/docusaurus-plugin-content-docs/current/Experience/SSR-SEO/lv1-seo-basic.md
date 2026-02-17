---
title: '[Lv1] SEO Grundlagen-Implementierung: Router-Modi und Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> In einem Multi-Brand-Plattformprojekt, Implementierung der grundlegenden SEO-Konfiguration: Router History Mode, Meta Tags Struktur und SEO für statische Seiten.

---

## 1. Kernpunkte für die Interviewantwort

1. **Router-Modus-Auswahl**: History Mode statt Hash Mode verwenden, um eine saubere URL-Struktur bereitzustellen.
2. **Meta Tags Grundlagen**: Vollständige SEO Meta Tags implementieren, einschließlich Open Graph und Twitter Card.
3. **SEO für statische Seiten**: Vollständige SEO-Elemente für die Landing Page konfigurieren.

---

## 2. Router History Mode Konfiguration

### 2.1 Warum History Mode wählen?

**Dateipfad:** `quasar.config.js`

```javascript
// Zeile 82
vueRouterMode: "history", // History Mode statt Hash Mode verwenden
```

**SEO-Vorteile:**

| Modus            | URL-Beispiel | SEO-Auswirkung                          |
| ---------------- | ------------ | ---------------------------------------- |
| **Hash Mode**    | `/#/home`    | ❌ Schwerer für Suchmaschinen zu indexieren |
| **History Mode** | `/home`      | ✅ Saubere URL, leicht zu indexieren       |

**Wesentliche Unterschiede:**

- History Mode erzeugt saubere URLs (z.B.: `/home` statt `/#/home`)
- Suchmaschinen können einfacher indexieren und crawlen
- Bessere Benutzererfahrung und Teilerfahrung
- Erfordert Backend-Konfiguration (um 404-Fehler zu vermeiden)

### 2.2 Backend-Konfigurationsanforderungen

Bei Verwendung des History Mode wird eine Backend-Konfiguration benötigt:

```nginx
# Nginx Beispiel
location / {
  try_files $uri $uri/ /index.html;
}
```

Dies stellt sicher, dass alle Routen `index.html` zurückgeben und der Frontend-Router die Verarbeitung übernimmt.

---

## 3. Grundlegende Meta Tags Struktur

### 3.1 Grundlegende SEO Meta Tags

**Dateipfad:** `template/*/public/landingPage/index.html`

```html
<!-- Grundlegende Meta Tags -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="Sofortige Aktualisierung jederzeit und überall. VIP-Testprogramm nur für die ersten 100 Mitglieder."
/>
```

**Erklärung:**

- `title`: Seitentitel, beeinflusst die Anzeige in Suchergebnissen
- `keywords`: Schlüsselwörter (geringere Bedeutung in modernem SEO, aber Konfiguration wird empfohlen)
- `description`: Seitenbeschreibung, wird in Suchergebnissen angezeigt

### 3.2 Open Graph Tags (Social Media Sharing)

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

**Verwendung:**

- Vorschau, die beim Teilen auf sozialen Medien wie Facebook, LinkedIn angezeigt wird
- Empfohlene Größe für `og:image`: 1200x630px
- `og:type` kann auf `website`, `article` usw. gesetzt werden

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Twitter Card Typen:**

- `summary`: Kleine Karte
- `summary_large_image`: Große Bildkarte (empfohlen)

---

## 4. SEO-Implementierung für statische Landing Page

### 4.1 Vollständige SEO-Element-Checkliste

In der Landing Page des Projekts wurden folgende SEO-Elemente implementiert:

```html
✅ Title Tag ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn usw.) ✅ Twitter Card tags ✅ Canonical URL ✅ Favicon
Konfiguration
```

### 4.2 Implementierungsbeispiel

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Grundlegendes SEO -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="Sofortige Aktualisierung jederzeit und überall. VIP-Testprogramm nur für die ersten 100 Mitglieder."
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
    <!-- Seiteninhalt -->
  </body>
</html>
```

---

## 5. Interview-Schwerpunkte

### 5.1 Router-Modus-Auswahl

**Warum History Mode wählen?**

- Bietet saubere URLs, verbessert den SEO-Effekt
- Suchmaschinen können einfacher indexieren
- Bessere Benutzererfahrung

**Worauf muss man achten?**

- Backend-Konfigurationsunterstützung erforderlich (404 bei direktem Routenzugriff vermeiden)
- Fallback-Mechanismus muss konfiguriert werden

### 5.2 Bedeutung der Meta Tags

**Grundlegende Meta Tags:**

- `title`: Beeinflusst die Anzeige in Suchergebnissen
- `description`: Beeinflusst die Klickrate
- `keywords`: Geringere Bedeutung in modernem SEO, aber Konfiguration wird empfohlen

**Social Media Meta Tags:**

- Open Graph: Vorschau beim Teilen auf Plattformen wie Facebook, LinkedIn
- Twitter Card: Vorschau beim Teilen auf Twitter
- Empfohlene Bildgröße: 1200x630px

---

## 6. Best Practices

1. **Title Tag**

   - Länge auf 50-60 Zeichen begrenzen
   - Hauptschlüsselwörter einbeziehen
   - Jede Seite sollte einen einzigartigen Titel haben

2. **Description**

   - Länge auf 150-160 Zeichen begrenzen
   - Seiteninhalt prägnant beschreiben
   - Call-to-Action (CTA) einbeziehen

3. **Open Graph Bild**

   - Größe: 1200x630px
   - Dateigröße: < 1MB
   - Hochwertige Bilder verwenden

4. **Canonical URL**
   - Probleme mit doppeltem Inhalt vermeiden
   - Auf die URL der Hauptversion verweisen

---

## 7. Interview-Zusammenfassung

**So können Sie antworten:**

> Im Projekt habe ich mich für Vue Routers History Mode anstelle des Hash Mode entschieden, da der History Mode eine saubere URL-Struktur bietet, die SEO-freundlicher ist. Gleichzeitig habe ich vollständige SEO Meta Tags für die Landing Page implementiert, einschließlich grundlegender title, description, keywords sowie Open Graph und Twitter Card Tags, um sicherzustellen, dass die Vorschau beim Teilen in sozialen Medien korrekt angezeigt wird.

**Kernpunkte:**

- ✅ Auswahl und Gründe für Router History Mode
- ✅ Vollständige Meta Tags Struktur
- ✅ Optimierung für Social Media Sharing
- ✅ Praktische Projekterfahrung
