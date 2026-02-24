---
id: web-browsing-process
title: "\U0001F4C4 Processo di navigazione web"
slug: /web-browsing-process
---

## 1. Spiega come il browser ottiene l'HTML dal server e come lo renderizza sullo schermo

> Spiega come il browser recupera l'HTML dal server e lo renderizza sullo schermo.

### 1. Avvio della richiesta

- **Inserimento dell'URL**: Quando un utente inserisce un URL nel browser o clicca su un link, il browser inizia ad analizzare l'URL per determinare a quale server inviare la richiesta.
- **Ricerca DNS**: Il browser esegue una ricerca DNS per risolvere l'indirizzo IP del server corrispondente.
- **Stabilire la connessione**: Il browser invia una richiesta all'indirizzo IP del server tramite internet usando il protocollo HTTP o HTTPS. Se si tratta di HTTPS, deve essere stabilita anche una connessione SSL/TLS.

### 2. Risposta del server

- **Elaborazione della richiesta**: Dopo aver ricevuto la richiesta, il server legge i dati corrispondenti dal database in base al percorso e ai parametri della richiesta.
- **Invio della risposta**: Il server invia poi il documento HTML come parte della risposta HTTP al browser. La risposta include anche informazioni come codici di stato e altri parametri (CORS, content-type, ecc.).

### 3. Parsing dell'HTML

- **Costruzione del DOM Tree**: Il browser legge il documento HTML e lo converte in nodi DOM in base ai tag e agli attributi HTML, costruendo il DOM Tree in memoria.
- **Richiesta di sotto-risorse**: Durante il parsing dell'HTML, se il browser incontra risorse esterne come CSS, JavaScript o immagini, invia richieste aggiuntive al server per recuperare tali risorse.

### 4. Rendering della pagina

- **Costruzione del CSSOM Tree**: Il browser analizza i file CSS per costruire il CSSOM Tree.
- **Render Tree**: Il browser unisce il DOM Tree e il CSSOM Tree in un Render Tree, che contiene tutti i nodi visibili e i loro stili corrispondenti.
- **Layout**: Il browser esegue il layout (chiamato anche Reflow), calcolando la posizione e la dimensione di ogni nodo.
- **Paint**: Infine, il browser attraversa la fase di painting, disegnando il contenuto di ogni nodo sulla pagina.

### 5. Interazione JavaScript

- **Esecuzione di JavaScript**: Se l'HTML contiene JavaScript, il browser lo analizza e lo esegue. Questo può modificare il DOM e aggiornare gli stili.

L'intero processo è progressivo per natura. In teoria, gli utenti vedranno prima una parte del contenuto della pagina prima che la pagina completa venga caricata. Durante questo processo, possono essere attivati multipli reflow e repaint, specialmente quando la pagina contiene stili complessi o effetti interattivi. Oltre alle ottimizzazioni del browser stesso, gli sviluppatori utilizzano tipicamente varie tecniche per rendere l'esperienza utente più fluida.

## 2. Descrivi Reflow e Repaint

### Reflow

Il Reflow si riferisce a cambiamenti nel DOM di una pagina web che causano il ricalcolo delle posizioni degli elementi da parte del browser e il loro posizionamento nelle posizioni corrette. In termini più semplici, il layout deve essere rigenerato per riorganizzare gli elementi.

#### Attivazione del Reflow

Il Reflow si verifica in due scenari: uno è un cambiamento globale che interessa l'intera pagina, e l'altro è un cambiamento parziale che interessa aree specifiche dei componenti.

- Il caricamento iniziale della pagina è il reflow più significativo.
- Aggiunta o rimozione di elementi DOM.
- Modifica delle dimensioni di un elemento, come l'aumento del contenuto o il cambio della dimensione del font.
- Regolazione del layout di un elemento, come la modifica di margin o padding.
- Ridimensionamento della finestra del browser.
- Attivazione di pseudo-class, come gli effetti hover.

### Repaint

Il Repaint si verifica quando l'aspetto di un elemento cambia senza influenzare il layout. Poiché gli elementi sono contenuti all'interno del layout, un reflow attiverà sempre un repaint. Tuttavia, un repaint da solo non causa necessariamente un reflow.

#### Attivazione del Repaint

- Modifica del colore o dello sfondo di un elemento, come l'aggiunta di un colore o la modifica delle proprietà dello sfondo.
- Modifica del box-shadow o del border di un elemento si qualifica anch'essa come repaint.

### Come ottimizzare Reflow e Repaint

- Evitare di usare layout con tabelle. Le proprietà delle tabelle tendono a causare ricalcoli del layout quando vengono modificate. Se le tabelle sono inevitabili, considerare l'aggiunta di proprietà come `table-layout: auto;` o `table-layout: fixed;` per renderizzare una riga alla volta e limitare l'area interessata.
- Invece di manipolare il DOM per cambiare gli stili uno alla volta, definire gli stili necessari in una classe CSS e attivarla tramite JavaScript.
  - Ad esempio, in Vue, puoi usare il class binding per alternare gli stili invece di modificare direttamente gli stili tramite una funzione.
- Per scenari che richiedono alternanza frequente (es. cambio tab), preferire `v-show` rispetto a `v-if`. Il primo usa semplicemente CSS `display: none;` per nascondere gli elementi, mentre il secondo attiva il ciclo di vita del componente creando o distruggendo elementi, risultando in un overhead di prestazioni maggiore.
- Se il reflow è inevitabile, usare `requestAnimationFrame` per l'ottimizzazione (poiché questa API è progettata per le animazioni e si sincronizza con il frame rate del browser). Questo può raggruppare più reflow in uno solo, riducendo il numero di repaint.
  - Ad esempio, se un'animazione deve muoversi verso un obiettivo sulla pagina, puoi usare `requestAnimationFrame` per calcolare ogni passo del movimento.
  - Allo stesso modo, alcune proprietà CSS3 possono attivare l'accelerazione hardware lato client, migliorando le prestazioni delle animazioni, come `transform`, `opacity`, `filters` e `Will-change`.
- Quando possibile, modificare gli stili sui nodi DOM di livello inferiore per evitare di attivare cambiamenti di stile sull'elemento genitore che si propaghino a tutti gli elementi figli.
- Per le animazioni, usare elementi con posizionamento `absolute` o `fixed`. Questo minimizza l'impatto sugli altri elementi, attivando solo il repaint senza reflow.

### Esempio

```js
// non ottimale
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// ottimale
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Riferimenti

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Descrivi quando il browser invia una richiesta OPTIONS al server

> Spiega quando il browser invia una richiesta OPTIONS al server.

Nella maggior parte dei casi, questo si applica agli scenari CORS. Prima di inviare la richiesta effettiva, avviene un controllo preflight dove il browser invia prima una richiesta OPTIONS per chiedere al server se la richiesta cross-origin è consentita. Se il server risponde con il permesso, il browser procede a inviare la richiesta effettiva. Altrimenti, il browser genera un errore.

Inoltre, se il metodo della richiesta non è `GET`, `HEAD` o `POST`, attiverà anch'esso una richiesta OPTIONS.
