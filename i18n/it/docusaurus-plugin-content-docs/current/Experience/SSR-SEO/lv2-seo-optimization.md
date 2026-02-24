---
title: '[Lv2] SEO avanzata: meta tag dinamici e integrazione tracking'
slug: /experience/ssr-seo/lv2-seo-optimization
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Costruisci un livello SEO scalabile con metadata dinamici, integrazione tracking e gestione centralizzata della configurazione.

---

## 1. Focus da colloquio

1. Strategia meta dinamica per ambienti multi-brand
2. Integrazione tracking senza bloccare il rendering
3. Governance della configurazione SEO su larga scala

## 2. Perché servono metadata dinamici

I tag head statici sono difficili da mantenere quando:

- Più brand condividono un'unica piattaforma
- I metadata delle campagne cambiano spesso
- I dati prodotto vengono aggiornati continuamente

Un sistema head dinamico permette aggiornamenti senza redeploy completo.

## 3. Pattern di implementazione dei meta dinamici

Usa una fonte di configurazione centralizzata e un mapping consapevole della rotta.

```ts
type SeoConfig = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
};

function applySeo(config: SeoConfig) {
  useHead({
    title: config.title,
    meta: [
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords || '' },
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:image', content: config.ogImage || '' },
    ],
    link: [{ rel: 'canonical', href: config.canonical || '' }],
  });
}
```

## 4. Principi di integrazione tracking

Integra analytics con impatto minimo sulle performance:

- Carica in modo asincrono gli script non critici
- Ritarda i tracker pesanti fino al consenso/interazione utente se necessario
- Mantieni gli ID di tracking specifici per ambiente
- Gestisci in modo resiliente il blocco degli script di terze parti

```ts
useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX',
      async: true,
    },
  ],
});
```

## 5. Gestione SEO centralizzata

Usa una singola source of truth per i campi SEO:

- Default del brand
- Override a livello rotta
- Valori dinamici a livello contenuto

Questo evita metadata in conflitto e migliora l'auditabilità.

## 6. Checklist di verifica

- Titolo/descrizione corretti per rotta
- URL canonical presente e accurato
- Anteprima OG/Twitter corretta
- Script di tracking caricati senza bloccare il contenuto principale
- Nessun tag duplicato/in conflitto nell'HTML finale

## Sintesi pronta per il colloquio

> Progetto la SEO come sistema centralizzato: metadata dinamici consapevoli della rotta, policy canonical coerente e integrazione tracking non bloccante. Questo scala su più brand e supporta aggiornamenti operativi più rapidi.
