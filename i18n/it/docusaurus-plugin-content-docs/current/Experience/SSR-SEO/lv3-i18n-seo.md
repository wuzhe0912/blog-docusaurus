---
title: '[Lv3] Best practice Nuxt i18n e SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Nei progetti SSR, la SEO i18n non è solo traduzione. Include strategia delle rotte, link alternati, policy canonical e stato locale sicuro per hydration.

---

## 1. Focus da colloquio

1. Strategia delle rotte locale e crawlabilità
2. Correttezza di `hreflang` e canonical
3. Rilevamento locale in SSR e coerenza di hydration

## 2. Strategia delle rotte per SEO multilingua

Approcci preferiti:

- Prefisso locale per rotta (`/en/about`, `/ja/about`)
- URL specifici per locale stabili
- Un canonical per ogni pagina locale

Esempio di configurazione Nuxt:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: 'Japanese' },
      { code: 'zh-tw', iso: 'zh-TW', file: 'zh-tw.json', name: 'Traditional Chinese' },
    ],
    lazy: true,
    langDir: 'locales',
  },
});
```

## 3. Link alternati e tag canonical

Ogni pagina locale dovrebbe esporre:

- `rel="alternate"` con `hreflang` corretto
- `x-default` quando necessario
- URL canonical specifico per locale

Esempio concettuale di output:

- Canonical pagina `en`: `https://example.com/about`
- Canonical pagina `ja`: `https://example.com/ja/about`

## 4. Rilevamento locale in SSR

Sorgenti comuni:

- Prefisso URL
- Preferenza cookie
- Fallback tramite header `Accept-Language`

Regole:

- Risolvi la locale sul server prima del render
- Mantieni la stessa locale risolta durante la hydration
- Evita cambi di locale durante la hydration iniziale

## 5. Policy di contenuto e indicizzazione

- Traduci contenuti significativi, non solo le etichette UI
- Mantieni i dati strutturati localizzati dove rilevante
- Assicurati che la sitemap includa URL localizzati
- Evita pagine con traduzione automatica di bassa qualità e contenuto scarso

## 6. Errori comuni

- Coppie `hreflang` mancanti tra le locali
- Canonical che punta sempre alla locale di default
- Locale incoerente tra SSR e client
- Meta title/description non localizzati

## Sintesi pronta per il colloquio

> Tratto la SEO i18n come architettura URL più correttezza dei metadata. Impongo rotte specifiche per locale, link canonical e alternati, e risoluzione locale server-first per mantenere coerenti indicizzazione e hydration.
