---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Panoramica (Overview)

In HTML, ci sono tre modi principali per caricare file JavaScript:

1. `<script>`
2. `<script async>`
3. `<script defer>`

Questi tre metodi si comportano diversamente durante il caricamento e l'esecuzione dello script.

## Confronto dettagliato (Detailed Comparison)

### `<script>`

- **Comportamento**: Quando il browser incontra questo tag, mette in pausa il parsing dell'HTML, scarica ed esegue lo script, poi continua il parsing.
- **Quando usarlo**: Per script critici per il rendering.
- **Pro**: Garantisce che gli script vengano eseguiti in ordine.
- **Contro**: Può ritardare il rendering della pagina.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Comportamento**: Il browser scarica lo script in background continuando a parsare l'HTML. Una volta scaricato, lo script viene eseguito immediatamente e potrebbe interrompere il parsing.
- **Quando usarlo**: Per script indipendenti come analytics o annunci.
- **Pro**: Non blocca il parsing dell'HTML e può migliorare la velocità di caricamento.
- **Contro**: L'ordine di esecuzione non è garantito e lo script potrebbe essere eseguito prima che il DOM sia completamente pronto.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Comportamento**: Il browser scarica lo script in background ma lo esegue solo dopo che il parsing dell'HTML è completato. Script defer multipli vengono eseguiti nell'ordine del documento.
- **Quando usarlo**: Per script che necessitano di un DOM completo ma non sono necessari immediatamente.
- **Pro**: Non blocca il parsing dell'HTML, preserva l'ordine e funziona bene per script dipendenti dal DOM.
- **Contro**: Se lo script è critico, potrebbe ritardare l'interattività.

```html
<script defer src="ui-enhancements.js"></script>
```

## Analogia

Immagina di prepararti per un appuntamento:

1. **`<script>`**:
   Fermi tutto e chiami il tuo partner per confermare i dettagli. La comunicazione è chiara, ma la preparazione viene ritardata.

2. **`<script async>`**:
   Ti prepari mentre parli tramite auricolari Bluetooth. È efficiente, ma potresti perdere la concentrazione e commettere errori.

3. **`<script defer>`**:
   Mandi un messaggio dicendo che chiamerai dopo esserti preparato. Puoi finire la preparazione prima, poi comunicare correttamente.

## Uso attuale (Current Usage)

Nei framework moderni, di solito non configuri il comportamento di `<script>` manualmente.
Ad esempio, Vite usa `type="module"` come default, che si comporta in modo simile a `defer`.

```javascript
<script type="module" src="/src/main.js"></script>
```

Le eccezioni sono gli script di terze parti, come Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
