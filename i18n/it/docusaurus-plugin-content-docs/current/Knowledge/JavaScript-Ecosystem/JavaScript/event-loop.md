---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Perché JavaScript ha bisogno dell'asincronia? Spiega callback ed event loop

> Perché JavaScript ha bisogno del comportamento asincrono? Spiega callback ed event loop.

JavaScript è fondamentalmente single-threaded. Uno dei suoi compiti principali è manipolare il DOM del browser. Se più thread modificassero lo stesso nodo contemporaneamente, il comportamento diventerebbe molto complesso. Per evitare ciò, JavaScript opera con un modello a thread singolo.

Il comportamento asincrono è la soluzione pratica sopra questo modello.
Se un'operazione deve attendere 2 secondi, il browser non può semplicemente bloccarsi. Esegue prima i task sincroni, mentre i task asincroni vengono accodati in una coda dei task.

Il contesto di esecuzione sincrono può essere inteso come il call stack.
Il browser esegue prima i task nel call stack. Quando il call stack diventa vuoto, preleva i task in attesa dalla coda dei task e li inserisce nel call stack.

1. Il browser verifica se il call stack è vuoto => No => continua a eseguire i task del call stack.
2. Il browser verifica se il call stack è vuoto => Sì => controlla la coda dei task => se ci sono task, ne sposta uno nel call stack.

Questo ciclo ripetuto è il concetto di event loop.

```js
console.log(1);

// Questa funzione asincrona è il callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Ordine di output: 1 3 2
```

## 2. Perché setInterval non è preciso in termini di tempistica?

> Perché `setInterval` non è preciso nella tempistica?

1. JavaScript è single-threaded (un task alla volta, gli altri attendono in coda). Se un callback di `setInterval` impiega più tempo dell'intervallo stesso, il callback successivo viene ritardato.
   Esempio: l'intervallo è 1 secondo, ma un callback impiega 2 secondi. L'esecuzione successiva è già in ritardo di 1 secondo. Questo sfasamento si accumula nel tempo.

2. Anche i browser e i runtime impongono limiti. Nella maggior parte dei principali browser (Chrome, Firefox, Safari), l'intervallo minimo pratico è solitamente intorno ai 4ms.
   Quindi anche se imposti 1ms, spesso viene eseguito circa ogni 4ms.

3. Un uso intensivo di CPU o memoria può ritardare l'esecuzione. Task come editing video o elaborazione immagini spesso causano ritardi nei timer.

4. JavaScript ha la garbage collection. Se il callback dell'intervallo crea molti oggetti, il lavoro del GC può introdurre ritardi aggiuntivi.

### Alternativa

#### requestAnimationFrame

Se stai usando `setInterval` per le animazioni, considera di sostituirlo con `requestAnimationFrame`.

- Sincronizzato con il repaint: viene eseguito quando il browser è pronto a disegnare il frame successivo. Questo è molto più preciso che indovinare la tempistica del repaint con `setInterval` o `setTimeout`.
- Migliori prestazioni: poiché si allinea con i cicli di repaint, non viene eseguito quando il repaint non è necessario (ad esempio, nelle tab in background), risparmiando calcoli.
- Throttling automatico: regola la frequenza di esecuzione in base alle condizioni del dispositivo, tipicamente intorno ai 60 FPS.
- Timestamp ad alta precisione: riceve un parametro `DOMHighResTimeStamp` (precisione al microsecondo), utile per tempistiche precise delle animazioni.

##### Esempio

```js
let startPos = 0;

function moveElement(timestamp) {
  // aggiorna la posizione nel DOM
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Continua l'animazione fino a quando l'elemento raggiunge la posizione target
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// avvia l'animazione
requestAnimationFrame(moveElement);
```

`moveElement()` aggiorna la posizione ad ogni frame (tipicamente 60 FPS) fino a raggiungere 500 pixel.
Questo di solito produce un'animazione più fluida e naturale rispetto a `setInterval`.
