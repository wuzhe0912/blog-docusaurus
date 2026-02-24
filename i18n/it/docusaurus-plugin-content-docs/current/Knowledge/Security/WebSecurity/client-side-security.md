---
id: client-side-security
title: "[Easy] 📄 Sicurezza Lato Client"
slug: /client-side-security
---

## 1. Puoi spiegare cos'è CSP (Content Security Policy)?

> Puoi spiegare cos'è CSP (Content Security Policy)?

In linea di principio, CSP è un meccanismo che migliora la sicurezza delle pagine web. Configurando gli header HTTP, limita le fonti da cui il contenuto della pagina può essere caricato (whitelist), impedendo agli attaccanti malintenzionati di rubare i dati degli utenti tramite script iniettati.

Dal punto di vista frontend, per prevenire attacchi XSS (Cross-Site Scripting), i framework moderni vengono comunemente utilizzati per lo sviluppo perché forniscono meccanismi di protezione integrati. Ad esempio, il JSX di React esegue automaticamente l'escape dell'HTML, e Vue con il binding `{{ data }}` esegue anch'esso l'escape automatico dei tag HTML.

Sebbene ci siano azioni limitate che il frontend può intraprendere in quest'area, ci sono comunque alcune ottimizzazioni:

1. Per i form che accettano input utente, è possibile validare i caratteri speciali per prevenire attacchi (anche se è difficile coprire tutti gli scenari). È più comune limitare la lunghezza dell'input per controllare il contenuto lato client, o limitare i tipi di input.
2. Quando si fanno riferimenti a link esterni, preferire URL HTTPS rispetto a URL HTTP.
3. Per i siti statici, è possibile limitare il contenuto tramite un meta tag, come segue:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: Per impostazione predefinita, consenti solo il caricamento di risorse dalla stessa origine (stesso dominio).
- `img-src https://*`: Consenti solo il caricamento di immagini tramite HTTPS.
- `child-src 'none'`: Non consentire l'incorporamento di risorse esterne figlie, come `<iframe>`.

## 2. Cos'è un attacco XSS (Cross-site scripting)?

> Cos'è un attacco XSS (Cross-Site Scripting)?

XSS, o Cross-Site Scripting, è un attacco in cui gli aggressori iniettano script malevoli che vengono eseguiti nel browser dell'utente, permettendo loro di rubare dati sensibili come i cookie, o di modificare direttamente il contenuto della pagina per reindirizzare gli utenti verso siti malevoli.

### Prevenire lo Stored XSS

Gli aggressori possono iniettare intenzionalmente HTML o script malevoli in un database tramite form di commento. Oltre all'escape lato backend, i framework frontend moderni come il JSX di React e la sintassi `{{ data }}` dei template di Vue eseguono anch'essi l'escape per ridurre il rischio di attacchi XSS.

### Prevenire il Reflected XSS

Evitare l'uso di `innerHTML` per manipolare il DOM, poiché può eseguire tag HTML. Si raccomanda di utilizzare `textContent` al suo posto.

### Prevenire il DOM-based XSS

In linea di principio, dovremmo evitare di permettere agli utenti di inserire direttamente HTML nella pagina. Se richiesto da un caso d'uso specifico, i framework forniscono direttive per assistere — ad esempio, `dangerouslySetInnerHTML` di React e `v-html` di Vue — che aiutano a prevenire XSS automaticamente. Se è necessario JavaScript nativo, preferire l'uso di `textContent`, `createElement` e `setAttribute` per manipolare il DOM.
