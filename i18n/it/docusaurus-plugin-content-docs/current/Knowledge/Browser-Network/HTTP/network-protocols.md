---
id: network-protocols
title: "\U0001F4C4 Protocolli di rete"
slug: /network-protocols
---

## 1. Descrivi TCP, HTTP, HTTPS e WebSocket

1. **TCP (Transmission Control Protocol)**:
   TCP è un protocollo affidabile e orientato alla connessione utilizzato per trasmettere dati in modo affidabile tra due computer su internet. Garantisce l'ordinamento e l'affidabilità dei pacchetti -- il che significa che i dati arrivano a destinazione intatti indipendentemente dalle condizioni della rete.

2. **HTTP (Hypertext Transfer Protocol)**:
   HTTP è un protocollo per la trasmissione di ipertesto (cioè pagine web). Si basa su TCP e fornisce un modo per browser e server di comunicare. HTTP è stateless, il che significa che il server non conserva alcuna informazione sull'utente.

3. **HTTPS (Hypertext Transfer Protocol Secure)**:
   HTTPS è la versione sicura di HTTP. Cripta la trasmissione dati HTTP attraverso il protocollo SSL/TLS, proteggendo la sicurezza dei dati scambiati e prevenendo attacchi man-in-the-middle, garantendo così la privacy e l'integrità dei dati.

4. **WebSocket**:
   Il protocollo WebSocket fornisce un modo per stabilire una connessione persistente tra client e server, abilitando la trasmissione di dati bidirezionale e in tempo reale dopo che la connessione è stata stabilita. Questo differisce dalle richieste HTTP tradizionali, dove ogni trasmissione richiede l'apertura di una nuova connessione. WebSocket è più adatto per la comunicazione in tempo reale e le applicazioni che richiedono aggiornamenti rapidi dei dati.

## 2. Cos'è il Three-Way Handshake?

Il three-way handshake è il processo di stabilire una connessione tra un server e un client in una rete TCP/IP. Il processo prevede tre passaggi per confermare che le capacità di invio e ricezione di entrambe le parti funzionano normalmente, sincronizzando anche gli Initial Sequence Number (ISN) per garantire l'integrità e la sicurezza dei dati.

### Tipi di messaggio TCP

Prima di comprendere i passaggi, è necessario conoscere la funzione principale di ogni tipo di messaggio:

| Messaggio | Descrizione                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| SYN       | Utilizzato per avviare e stabilire una connessione e per sincronizzare i numeri di sequenza |
| ACK       | Utilizzato per confermare la ricezione di un SYN                                  |
| SYN-ACK   | Acknowledgment di sincronizzazione -- invia il proprio SYN insieme a un ACK        |
| FIN       | Termina la connessione                                                            |

### Passaggi

1. Il client avvia una connessione con il server e invia un messaggio SYN, informando il server che è pronto a comunicare e quale è il suo numero di sequenza iniziale.
2. Dopo aver ricevuto il SYN, il server prepara una risposta. Incrementa di 1 il numero di sequenza SYN ricevuto e lo invia tramite ACK, inviando contemporaneamente il proprio messaggio SYN.
3. Il client conferma la risposta del server. Entrambe le parti hanno stabilito una connessione stabile e iniziano a trasmettere dati.

### Esempio

L'Host A invia un pacchetto TCP SYN contenente un numero di sequenza casuale, supponiamo 1000:

```bash
Host A ===(SYN=1000)===> Server
```

Il server deve confermare il numero di sequenza dell'Host A, quindi lo incrementa di 1 e invia anche il proprio SYN:

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Dopo aver ricevuto il SYN del server, l'Host A invia un acknowledgment incrementando di 1 il numero di sequenza del server:

```bash
Host A ===(ACK=2001)===> Server
```

### Un handshake a due vie funzionerebbe?

1. Lo scopo del three-way handshake è confermare che sia il client che il server possono inviare e ricevere correttamente. Con solo due handshake, il server non sarebbe in grado di verificare la capacità di ricezione del client.
2. Senza il terzo handshake, il client non può ricevere il numero di sequenza del server e quindi non può inviare una conferma. Questo potrebbe compromettere la sicurezza dei dati.
3. In condizioni di rete scadenti, i dati possono arrivare in momenti diversi. Se dati vecchi e nuovi arrivano fuori ordine, stabilire una connessione senza la conferma SYN del terzo handshake potrebbe portare a errori di rete.

### Cos'è l'ISN?

ISN sta per Initial Sequence Number. Indica al ricevente quale numero di sequenza il mittente utilizzerà durante la trasmissione dei dati. Si tratta di un numero di sequenza generato casualmente per impedire ad attaccanti terzi di indovinarlo e falsificare i messaggi.

### In quale momento del three-way handshake può iniziare la trasmissione dei dati?

Il primo e il secondo handshake servono per confermare le capacità di invio/ricezione di entrambe le parti e non possono trasportare dati. Se fosse possibile trasmettere dati durante il primo handshake, terze parti malevole potrebbero inondare il server con dati falsi, costringendolo a consumare memoria per il buffering -- creando un'opportunità di attacco.

Solo durante il terzo handshake, dopo che entrambe le parti hanno confermato la sincronizzazione e sono in stato di connessione, è consentita la trasmissione dei dati.

### Riferimenti

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Descrivi il meccanismo di caching HTTP

Il meccanismo di caching HTTP è una tecnica utilizzata nel protocollo HTTP per memorizzare temporaneamente (o "mettere in cache") i dati web, con l'obiettivo di ridurre il carico del server, diminuire la latenza e migliorare la velocità di caricamento delle pagine. Esistono diverse strategie principali di caching:

1. **Freshness (Strong Cache)**: Impostando gli header di risposta `Expires` o `Cache-Control: max-age`, i dati possono essere considerati freschi per una durata specifica. Il client può utilizzare direttamente i dati in cache senza conferma da parte del server.

2. **Validation Cache**: Utilizzando gli header di risposta `Last-Modified` ed `ETag`, il client può inviare una richiesta condizionale al server. Se i dati non sono stati modificati, il server restituisce un codice di stato 304 (Not Modified), indicando che è possibile utilizzare i dati nella cache locale.

3. **Negotiation Cache**: Questo approccio si basa sull'header di risposta `Vary`. Il server decide se fornire versioni diverse del contenuto in cache in base alla richiesta del client (es. `Accept-Language`).

4. **No-store**: Se `Cache-Control: no-store` è impostato, i dati non dovrebbero essere memorizzati in cache affatto, e ogni richiesta deve recuperare i dati più recenti dal server.

La scelta della strategia di caching dipende da fattori come il tipo di dati e la frequenza di aggiornamento. Una strategia di caching efficace può migliorare significativamente le prestazioni delle applicazioni web.

### Service Worker

Dall'esperienza personale, dopo aver configurato la PWA per una Web App, è possibile registrare stili di base, loghi o persino una pagina `offline.html` offline nel `service-worker.js`. In questo modo, anche quando l'utente è offline, attraverso questo meccanismo di caching può comunque essere consapevole dello stato attuale del sito web o della rete, mantenendo un'esperienza utente ragionevole.
