---
id: project-architecture-vite-setting
title: 'Configurazione Vite in un sistema multi-tenant'
slug: /experience/project-architecture/vite-setting
tags: [Experience, Interview, Project-Architecture]
---

> Come usare Vite per supportare molti template brand in un unico repository, con routing di build dinamico e isolamento degli ambienti.

---

## 1. Selezione dinamica del template route tramite `SITE_KEY`

In fase di build, risolvi il file route del tenant corrispondente e genera l'entry router attiva.

```ts
function writeBuildRouter(siteKey: string) {
  const sourceFile = path.resolve(__dirname, `../../template/${siteKey}/router/routes.ts`);
  const destinationFile = path.resolve(__dirname, '../../src/router/build.ts');

  const data = fs.readFileSync(sourceFile, 'utf8');
  fs.writeFileSync(destinationFile, data, 'utf8');
}
```

Vantaggi:

- Un solo repository per molti template tenant
- Minore duplicazione di codice
- Output di build specifico per un tenant alla volta

## 2. Strategia delle variabili d'ambiente

Usa file di ambiente espliciti e validazione a runtime.

- `.env.development`
- `.env.staging`
- `.env.production`

Esponi solo le variabili necessarie e sicure lato client tramite una policy di prefisso.

## 3. Configurazione proxy in sviluppo

Usa il proxy di Vite per i domini API in sviluppo locale, così eviti attriti con CORS.

## 4. Integrazione i18n e plugin

Integra Vue i18n e i plugin correlati in una pipeline plugin Vite centralizzata per mantenere un comportamento coerente tra ambienti.

## 5. Configurazione dei target browser

```js
target: {
  browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
  node: 'node16',
}
```

Questo bilancia sintassi moderna e compatibilità pratica.

## Sintesi pronta per il colloquio

> Nei sistemi multi-tenant uso una composizione di build guidata da `SITE_KEY`, isolamento rigoroso degli ambienti e una policy esplicita sui target browser, così ogni build tenant resta prevedibile e manutenibile.
