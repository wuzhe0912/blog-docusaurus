---
title: '[Lv2] SSR Implementierung: Data Fetching und SEO Meta Management'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> In einem Nuxt-3-Projekt: SSR-Datenladen und dynamisches SEO-Meta-Management so umsetzen, dass Suchmaschinen dynamische Routen korrekt indexieren können.

---

## 1. Interview-Kernpunkte

1. **Data-Fetching-Strategie**: `useFetch`/`useAsyncData` für Server-Side-Vorladen nutzen, damit SEO-relevanter Content bereits im HTML vorhanden ist.
2. **Dynamische Meta Tags**: Mit `useHead` oder `useSeoMeta` pro Datensatz passende Meta-Tags erzeugen.
3. **Performance**: Request-Deduplication, Server-Side-Caching und klare Trennung zwischen SSR- und CSR-Seiten.

---

## 2. useFetch / useAsyncData korrekt einsetzen

### 2.1 Warum SSR Data Fetching wichtig ist

**Typische Situation:**

- Dynamische Routen (z. B. `/products/[id]`) müssen Daten aus einer API laden.
- Reines Client-Side-Laden führt dazu, dass Crawler unvollständigen Inhalt sehen.
- Ziel ist vollständig gerenderter HTML-Output auf dem Server.

**Lösung:** `useFetch` oder `useAsyncData` in Nuxt 3 verwenden.

### 2.2 useFetch Basisbeispiel

**Dateipfad:** `pages/products/[id].vue`

```typescript
// Basisnutzung
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Wichtige Optionen:**

| Option      | Zweck                                        | Default    |
| ----------- | -------------------------------------------- | ---------- |
| `key`       | Eindeutiger Schlüssel für Request-Deduping   | auto       |
| `lazy`      | Verzögertes Laden (blockiert SSR nicht)      | `false`    |
| `server`    | Auf Server ausführen                         | `true`     |
| `default`   | Fallback-Wert                                | `null`     |
| `transform` | Antwort vor der Nutzung transformieren       | -          |

### 2.3 Vollständiges Beispiel

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // vermeidet doppelte Requests
  lazy: false, // SSR wartet auf Daten
  server: true, // garantiert Server-Ausführung
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // Daten normalisieren
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Warum diese Optionen wichtig sind:**

1. **`key`**
   - Ermöglicht Request-Deduplication
   - Gleicher key -> nur ein effektiver Request
2. **`lazy: false`**
   - Server rendert erst nach Datenverfügbarkeit
   - Suchmaschine sieht sofort vollständigen Inhalt
3. **`server: true`**
   - Daten kommen aus dem SSR-Pfad
   - Keine reine Client-Ausführung

### 2.4 useAsyncData vs useFetch

| Kriterium       | useFetch                    | useAsyncData                       |
| --------------- | --------------------------- | ---------------------------------- |
| Hauptzweck      | API-Aufruf                  | Beliebige asynchrone Operationen   |
| Convenience     | URL/Header automatisch      | Manuelle Logik                     |
| Typische Nutzung| HTTP Data Fetching          | DB-Abfragen, Aggregationen, Files  |

```typescript
// useFetch: API-zentriert
const { data } = await useFetch('/api/products/123');

// useAsyncData: freie Async-Logik
const { data } = await useAsyncData('products', async () => {
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**Kurzregel für Interviews:**

- **`$fetch`** für user-getriebene Actions (Button-Click, Form-Submit, Refresh).
- **`useFetch`** für initiales Seitenladen mit SSR/Hydration-Sync.

**`$fetch` Eigenschaften:**

- Reiner HTTP-Client (`ofetch`)
- Kein SSR-Status-Transfer
- In `setup()` direkt genutzt -> Risiko von Double Fetch

**`useFetch` Eigenschaften:**

- Kombiniert `useAsyncData` + `$fetch`
- Hydration-freundlich
- Liefert `data`, `pending`, `error`, `refresh`

**Vergleich:**

| Merkmal            | useFetch                          | $fetch                           |
| ------------------ | --------------------------------- | -------------------------------- |
| SSR-Status-Transfer| Ja                                | Nein                             |
| Rückgabe           | Reaktive refs                     | Promise mit Rohdaten             |
| Hauptfall          | Initiales Page Data Fetching      | Event-getriebene Operationen     |

```typescript
// Korrekt: initiales Laden
const { data } = await useFetch('/api/user');

// Korrekt: user action
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// Zu vermeiden: setup + $fetch direkt
const data = await $fetch('/api/user');
```

---

## 3. SEO Meta Management mit useHead

### 3.1 Warum dynamische Meta Tags nötig sind

**Typische Situation:**

- Produkt- und Artikelseiten sind dynamisch.
- Jede URL braucht eigene `title`, `description`, `og:image`, canonical.
- Social Sharing (Open Graph/Twitter) muss konsistent sein.

**Lösung:** `useHead` oder `useSeoMeta`.

### 3.2 useHead Beispiel

```typescript
useHead({
  title: () => product.value?.name,
  meta: [
    { name: 'description', content: () => product.value?.description },
    { property: 'og:title', content: () => product.value?.name },
    { property: 'og:image', content: () => product.value?.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**Best Practices:**

1. Werte als Funktionen (`() => ...`) übergeben, damit Meta bei Datenupdates nachzieht.
2. Vollständige SEO-Struktur setzen: title, description, OG, canonical.
3. Bei 404 bewusst `noindex, nofollow` setzen.

### 3.3 useSeoMeta kompakte Variante

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

---

## 4. Praxisfall 1: SEO für dynamische Routen

### 4.1 Ausgangslage

Ein Commerce-Szenario mit vielen SKU-Seiten (`/products/[id]`).

**Herausforderungen:**

- Viele dynamische URLs
- Eindeutige SEO-Daten pro URL
- Saubere 404-Behandlung
- Duplicate-Content vermeiden

### 4.2 Umsetzungsstrategie

1. Daten serverseitig vorladen (`lazy: false`, `server: true`)
2. 404 sauber werfen (`createError`)
3. Meta und canonical URL dynamisch erzeugen

```typescript
const { data: product, error } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`,
  lazy: false,
  server: true,
});

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}

useSeoMeta({
  title: () => `${product.value?.name} - Product`,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

### 4.3 Ergebnis

**Vorher:**
- Crawler sehen unvollständige Seiten
- Gleiche Meta-Daten für viele Seiten
- 404 inkonsistent

**Nachher:**
- Vollständige SSR-Seiten für Crawler
- Eindeutige Meta-Daten je Route
- Saubere Fehlerbehandlung inkl. SEO-Schutz

---

## 5. Praxisfall 2: Performance-Optimierung

### 5.1 Problem

SSR erhöht Server-Last. Ohne Optimierung steigen Antwortzeiten und Kosten.

### 5.2 Strategien

1. **Request-Deduplication**

```typescript
const { data } = await useFetch('/api/product/123', {
  key: 'product-123',
});
```

2. **Server-Side-Caching (Nitro)**

```typescript
export default defineCachedEventHandler(
  async (event) => {
    return await getProductsFromDB();
  },
  {
    maxAge: 60 * 60,
    swr: true,
  },
);
```

3. **SSR/CSR klar trennen**
- SEO-kritische Seiten: SSR
- Interne, nicht indexierbare Seiten: CSR

4. **Critical CSS und Asset-Strategie**
- Above-the-fold CSS priorisieren
- Nicht-kritische Ressourcen später laden

### 5.3 Wirkung

**Vorher:**
- Hohe Server-Last
- Duplicate Requests
- Keine Caching-Strategie

**Nachher:**
- Schnellere Antwortzeiten
- Weniger Last auf Backend/DB
- Stabilere Performance unter Last

---

## 6. Interview-Antworten kompakt

### 6.1 useFetch / useAsyncData

> Ich nutze für initiales Seitenladen `useFetch` mit `key`, `lazy: false` und `server: true`, damit SSR vollständige Inhalte liefert und Crawler den finalen Content sehen.

### 6.2 Dynamische Meta Tags

> Ich setze `useHead`/`useSeoMeta` mit funktionsbasierten Werten, damit Meta Tags bei Datenänderungen korrekt aktualisiert werden, inkl. OG und canonical URL.

### 6.3 Performance

> Ich kombiniere Request-Deduplication, Server-Caching und SSR/CSR-Splitting. So sinken Last und TTFB, während SEO-Qualität erhalten bleibt.

---

## 7. Best Practices

### 7.1 Data Fetching

1. Immer `key` setzen.
2. `lazy` passend zum SEO-Bedarf wählen.
3. Fehlerfälle (404/5xx) sauber behandeln.

### 7.2 SEO Meta

1. Funktionale Werte für reaktive Updates.
2. Vollständige Meta-Struktur (title/description/OG/canonical).
3. Fehlerseiten mit `noindex, nofollow` absichern.

### 7.3 Performance

1. Server-Caching nutzen.
2. SSR nur dort, wo SEO es braucht.
3. Rendering-Kosten durch Asset- und CSS-Strategie senken.

---

## 8. Interview-Zusammenfassung

> In Nuxt 3 habe ich SSR Data Fetching und dynamische SEO Meta Verwaltung so umgesetzt, dass sowohl Crawler als auch Nutzer profitieren: serverseitig vorgerenderte Inhalte, konsistente Meta-Daten pro Route und eine stabile Performance durch Deduplication, Caching und SSR/CSR-Trennung.

**Schlüsselpunkte:**
- ✅ Korrekte Nutzung von `useFetch`/`useAsyncData`
- ✅ Dynamische Meta-Verwaltung mit `useHead`/`useSeoMeta`
- ✅ SEO für dynamische Routen
- ✅ Performance-Optimierung in realen Projekten
