---
title: '[Lv2] Nuxt 3 Server-Funktionen: Server Routes und dynamische Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Beherrschung der Nitro Server Engine Funktionen von Nuxt 3, Implementierung von Server Routes (API Routes), dynamischer Sitemap und Robots.txt zur Verbesserung des SEO und der architektonischen Flexibilität der Website.

---

## 1. Kernpunkte für die Interviewantwort

1.  **Server Routes (API Routes)**: Verwendung von `server/api` oder `server/routes` zum Aufbau von Backend-Logik. Häufig verwendet zum Verbergen von API Keys, CORS-Behandlung, BFF (Backend for Frontend) Architektur.
2.  **Dynamische Sitemap**: Dynamische XML-Generierung über Server Routes (`server/routes/sitemap.xml.ts`), um sicherzustellen, dass Suchmaschinen den neuesten Inhalt indexieren können.
3.  **Robots.txt**: Ebenso dynamisch über Server Routes generiert oder über Nuxt Config konfiguriert, um Crawler-Zugriffsberechtigungen zu steuern.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Was ist Nitro?

Nitro ist die neue Server-Engine von Nuxt 3, die es ermöglicht, Nuxt-Anwendungen überall zu deployen (Universal Deployment). Es ist nicht nur ein Server, sondern ein leistungsfähiges Build- und Runtime-Tool.

### 2.2 Kernfunktionen von Nitro

1.  **Plattformübergreifendes Deployment (Universal Deployment)**:
    Kann zu Node.js Server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers und anderen Formaten kompiliert werden. Zero-config Deployment auf gängigen Plattformen.

2.  **Leichtgewichtig und schnell (Lightweight & Fast)**:
    Extrem kurze Cold-Start-Zeit und sehr kleine generierte Bundle-Größe (minimal < 1MB).

3.  **Automatisches Code Splitting (Auto Code Splitting)**:
    Analysiert automatisch die Abhängigkeiten der Server Routes und führt Code Splitting durch, um die Startgeschwindigkeit sicherzustellen.

4.  **HMR (Hot Module Replacement)**:
    Nicht nur das Frontend hat HMR, Nitro ermöglicht auch HMR für die Backend-API-Entwicklung. Änderungen an `server/` Dateien erfordern keinen Server-Neustart.

5.  **Storage Layer (Unstorage)**:
    Integrierte einheitliche Storage-API, die eine einfache Verbindung zu Redis, GitHub, FS, Memory und anderen Speicher-Schnittstellen ermöglicht.

6.  **Server Assets**:
    Bequemer Zugriff auf statische Ressourcen-Dateien auf der Server-Seite.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Was sind Server Routes?

Nuxt 3 hat die **Nitro** Server-Engine integriert, die es Entwicklern ermöglicht, Backend-APIs direkt im Projekt zu schreiben. Diese Dateien werden in den Verzeichnissen `server/api` oder `server/routes` platziert und automatisch als API-Endpunkte zugeordnet.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 In welchen Situationen werden sie verwendet? (Häufige Interviewfrage)

**1. Sensible Informationen verbergen (Secret Management)**
Das Frontend kann Private API Keys nicht sicher speichern. Durch Verwendung von Server Routes als Vermittler kann auf dem Server über Umgebungsvariablen auf den Key zugegriffen und nur das Ergebnis an das Frontend zurückgegeben werden.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key wird nur auf dem Server verwendet, nicht dem Client exponiert
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. CORS-Probleme behandeln (Proxy)**
Wenn eine externe API CORS nicht unterstützt, können Server Routes als Proxy verwendet werden. Der Browser stellt Anfragen an den Nuxt Server (gleicher Ursprung), der Nuxt Server stellt Anfragen an die externe API (keine CORS-Einschränkungen).

**3. Backend for Frontend (BFF)**
Daten von mehreren Backend-APIs auf dem Nuxt Server aggregieren, filtern oder das Format konvertieren und dann auf einmal an das Frontend zurückgeben. Reduziert die Anzahl der Frontend-Anfragen und die Payload-Größe.

**4. Webhooks behandeln**
Webhook-Benachrichtigungen von Drittanbieter-Diensten (wie Zahlungsdienste, CMS) empfangen.

---

## 4. Dynamische Sitemap implementieren

### 3.1 Warum wird eine dynamische Sitemap benötigt?

Für Websites mit häufig wechselndem Inhalt (wie E-Commerce, Nachrichtenseiten) veraltet eine statisch generierte `sitemap.xml` schnell. Mit Server Routes kann bei jeder Anfrage dynamisch die neueste Sitemap generiert werden.

### 3.2 Implementierungsmethode: Manuelle Generierung

`server/routes/sitemap.xml.ts` erstellen:

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. Alle dynamischen Routendaten aus der Datenbank oder API abrufen
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. Statische Seiten hinzufügen
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. Dynamische Seiten hinzufügen
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Header setzen und XML zurückgeben
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 Implementierungsmethode: Modul verwenden (`@nuxtjs/sitemap`)

Für Standardanforderungen wird das offizielle Modul empfohlen:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // Eine API angeben, die die dynamische URL-Liste bereitstellt
    ],
  },
});
```

---

## 5. Dynamische Robots.txt implementieren

### 4.1 Implementierungsmethode

`server/routes/robots.txt.ts` erstellen:

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // Regeln dynamisch basierend auf der Umgebung bestimmen
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // Indexierung in Nicht-Produktionsumgebungen verbieten

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. Interview-Schwerpunkte

### 5.1 Nitro Engine & Server Routes

**Q: Was ist die Server Engine von Nuxt 3? Was sind die Eigenschaften von Nitro?**

> **Beispielantwort:**
> Die Server Engine von Nuxt 3 heißt **Nitro**.
> Das größte Merkmal ist **Universal Deployment**, das heißt, es kann ohne Konfiguration in jeder Umgebung deployed werden (Node.js, Vercel, AWS Lambda, Edge Workers usw.).
> Weitere Merkmale umfassen: **HMR** für Backend-APIs (kein Neustart bei Änderungen), **Auto Code Splitting** (beschleunigte Startgeschwindigkeit) und ein integrierter **Storage Layer** (einfache Verbindung zu Redis oder KV Storage).

**Q: Was sind Nuxt 3 Server Routes? Haben Sie sie implementiert?**

> **Beispielantwort:**
> Ja, ich habe sie implementiert. Server Routes sind Backend-Funktionalitäten, die Nuxt 3 über die Nitro Engine bereitstellt, platziert im `server/api` Verzeichnis.
> Ich habe sie hauptsächlich in folgenden Szenarien verwendet:
>
> 1.  **API Key verbergen**: Bei der Integration von Drittanbieterdiensten, um zu vermeiden, dass Secret Keys im Frontend-Code exponiert werden.
> 2.  **CORS Proxy**: Lösung von Cross-Origin-Anfrageproblemen.
> 3.  **BFF (Backend for Frontend)**: Mehrere API-Anfragen zu einer zusammenfassen, Frontend-Anfragen reduzieren und Datenstruktur optimieren.

### 5.2 Sitemap und Robots.txt

**Q: Wie implementiert man dynamische Sitemap und Robots.txt in Nuxt 3?**

> **Beispielantwort:**
> Ich würde die Server Routes von Nuxt verwenden.
> Für die **Sitemap** würde ich `server/routes/sitemap.xml.ts` erstellen, darin die Backend-API aufrufen, um die neueste Artikel- oder Produktliste abzurufen, dann das `sitemap` Paket verwenden, um den XML-String zu generieren und zurückzugeben. So wird sichergestellt, dass Suchmaschinen bei jedem Crawl die neuesten Links erhalten.
> Für **Robots.txt** würde ich `server/routes/robots.txt.ts` erstellen und basierend auf Umgebungsvariablen (Production oder Staging) dynamisch verschiedene Regeln zurückgeben, z.B. in der Staging-Umgebung `Disallow: /` setzen, um Indexierung zu verhindern.

### 5.3 SEO Meta Tags (Ergänzung)

**Q: Wie behandeln Sie SEO Meta Tags in Nuxt 3? Haben Sie useHead oder useSeoMeta verwendet?**

> **Beispielantwort:**
> Ich verwende hauptsächlich die in Nuxt 3 integrierten `useHead` und `useSeoMeta` Composables.
> Mit `useHead` kann ich `title`, `meta`, `link` und andere Tags definieren. Für reine SEO-Konfiguration bevorzuge ich `useSeoMeta`, da die Syntax prägnanter ist und Type-safe Hinweise bietet, wie das direkte Setzen von `ogTitle`, `description` und anderen Eigenschaften.
> Auf dynamischen Seiten (wie Produktseiten) übergebe ich eine Getter Function (z.B. `title: () => product.value.name`), damit Meta Tags automatisch reaktiv aktualisiert werden, wenn sich die Daten ändern.

---

## 7. Verwandte Referenzen

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
