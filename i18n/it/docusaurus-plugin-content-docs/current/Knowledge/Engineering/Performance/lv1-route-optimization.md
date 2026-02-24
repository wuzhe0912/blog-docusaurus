---
id: performance-lv1-route-optimization
title: '[Lv1] Ottimizzazione a Livello di Route: Lazy Loading a Tre Livelli'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Il lazy loading a livello di route riduce la dimensione iniziale del JavaScript e migliora la velocità della prima schermata, distribuendo il codice su richiesta.

---

## Situazione

Nei prodotti multi-tenant, ogni tenant ha spesso un tema e un albero di route diverso. Se tutto viene incluso nel bundle in modo anticipato, il JS di avvio diventa troppo grande.

Sintomi comuni:

- Caricamento iniziale lento su reti mobili
- Bundle `main.js` troppo grande
- Codice non necessario per route che gli utenti non visitano mai

## Obiettivo

1. Mantenere ridotto il budget iniziale del JS
2. Caricare solo i moduli del tenant e delle route necessari
3. Preservare la manutenibilità e la velocità di sviluppo

## Azione: Lazy loading a tre livelli

### Livello 1: Modulo di route dinamico a livello di tenant

```ts
// src/router/routes.ts
export default async function getRoutes(siteKey: string) {
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return module.routes;
}
```

Viene caricato solo l'albero di route del tenant attivo.

### Livello 2: Import lazy dei componenti a livello di pagina

```ts
const HomePage = () => import('@/pages/HomePage.vue');

export const routes = [
  {
    path: '/home',
    component: HomePage,
  },
];
```

Ogni chunk di pagina viene scaricato solo quando necessario.

### Livello 3: Gating delle route basato sui permessi

```ts
router.beforeEach(async (to) => {
  const allowed = await permissionService.canAccess(to.name as string);
  if (!allowed) return '/403';
});
```

Le pagine non autorizzate vengono bloccate prima che vengano caricati i moduli pesanti.

## Miglioramenti aggiuntivi

- Prefetch delle route successive più probabili durante l'inattività
- Separare le dipendenze condivise di grandi dimensioni in vendor chunk
- Monitorare la dimensione dei chunk per route nella CI

## Risultato

Impatto tipico:

- JS iniziale ridotto significativamente
- Rendering della prima schermata più veloce
- Migliore time-to-interactive su dispositivi di fascia bassa

## Riepilogo per il colloquio

> Ottimizzo le route su tre livelli: caricamento del modulo tenant, chunk lazy a livello di pagina e guard basati sui permessi. Questo mantiene l'avvio ridotto preservando un'architettura di routing scalabile.
