---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Qual è la differenza tra JSONP e CORS?

JSONP (JSON with Padding) e CORS (Cross-Origin Resource Sharing) sono due tecniche per implementare richieste cross-origin, che permettono alle pagine web di richiedere dati da domini diversi.

### JSONP

JSONP è una tecnica più datata utilizzata per aggirare le restrizioni della same-origin policy, permettendo alle pagine web di richiedere dati da origini diverse (dominio, protocollo o porta). Poiché il caricamento tramite tag `<script>` non è soggetto alla same-origin policy, JSONP funziona aggiungendo dinamicamente un tag `<script>` che punta a un URL che restituisce dati JSON. La risposta da quell'URL è incapsulata in una chiamata di funzione, e il JavaScript sulla pagina definisce questa funzione in anticipo per ricevere i dati.

```javascript
// lato client
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// lato server
receiveData({ name: 'PittWu', type: 'player' });
```

Lo svantaggio è un rischio di sicurezza più elevato (poiché può eseguire JavaScript arbitrario) e supporta solo richieste GET.

### CORS

CORS è una tecnica più sicura e moderna rispetto a JSONP. Utilizza l'header HTTP `Access-Control-Allow-Origin` per informare il browser che la richiesta è consentita. Il server configura gli header CORS pertinenti per determinare quali origini possono accedere alle sue risorse.

Ad esempio, se il frontend su `http://client.com` vuole accedere alle risorse su `http://api.example.com`, `api.example.com` deve includere il seguente header HTTP nella sua risposta:

```http
Access-Control-Allow-Origin: http://client.com
```

Oppure per consentire qualsiasi origine:

```http
Access-Control-Allow-Origin: *
```

CORS può essere utilizzato con qualsiasi tipo di richiesta HTTP ed è un modo standardizzato e sicuro per effettuare richieste cross-origin.
