---
title: '[Lv1] Fondamenti SEO: modalità router e meta tag'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Implementazione SEO di base per web app: URL puliti, metadata fondamentali e struttura pagina adatta ai crawler.

---

## 1. Focus da colloquio

1. Perché la modalità di routing è importante per la crawlabilità
2. Come strutturare i meta tag di base
3. Come validare l'output SEO in produzione

## 2. Scelta della modalità router

### Perché è preferibile la modalità history

Usa la modalità history per ottenere URL puliti:

- Preferito: `/products/123`
- Meno ideale: `/#/products/123`

Gli URL puliti sono più semplici per motori di ricerca e utenti.

### Fallback server richiesto

Quando usi la modalità history, configura il fallback verso `index.html`:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Senza questo, i deep link possono restituire 404 al refresh.

## 3. Setup dei meta tag fondamentali

Al minimo includi:

- `title`
- `meta[name="description"]`
- URL canonical
- Tag Open Graph
- Tag Twitter card

```html
<title>Product Detail | Brand</title>
<meta name="description" content="Compare product features, pricing, and delivery options." />
<link rel="canonical" href="https://example.com/products/123" />
<meta property="og:title" content="Product Detail | Brand" />
<meta property="og:description" content="Compare product features and pricing." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/products/123" />
<meta property="og:image" content="https://example.com/og/product-123.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

## 4. Checklist per pagine statiche

Per landing page e pagine campagna:

- Un solo `h1` chiaro
- Gerarchia semantica dei titoli
- Titolo e descrizione descrittivi
- Testo alt significativo per le immagini principali
- Link interni verso sezioni correlate

## 5. Errori comuni

- Titoli duplicati tra pagine diverse
- Tag canonical mancanti o duplicati
- Keyword stuffing nella descrizione
- Blocco accidentale di pagine indicizzabili nel robots

## 6. Flusso di validazione

- Visualizza il sorgente pagina e conferma i tag head finali
- Usa validator di anteprima social per i tag OG
- Controlla la copertura di indicizzazione nella search console
- Monitora le pagine organiche con report di performance

## Sintesi pronta per il colloquio

> Parto da URL puliti in modalità history, meta tag di base completi e fallback server corretto. Poi valido output sorgente e comportamento d'indicizzazione per garantire metadata stabili e di qualità sia per crawler sia per utenti.
