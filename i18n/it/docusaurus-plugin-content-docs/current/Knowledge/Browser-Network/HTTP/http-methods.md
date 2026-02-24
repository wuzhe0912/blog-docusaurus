---
id: http-methods
title: "\U0001F4C4 Metodi HTTP"
slug: /http-methods
---

## 1. Cos'è una RESTful API?

Una RESTful API segue uno stile di design standardizzato che facilita la comunicazione tra diversi sistemi sulla rete. Per aderire ai principi REST, un'API dovrebbe essere prevedibile e facile da capire. Come sviluppatore frontend, l'attenzione è principalmente su tre aspetti:

- **Percorso URL**: Identifica l'ambito della richiesta del client, ad esempio:
  - `/products`: Probabilmente restituisce una lista di prodotti
  - `/products/abc`: Fornisce i dettagli del prodotto con ID "abc"
- **Metodi HTTP**: Definiscono l'azione specifica da eseguire:
  - `GET`: Utilizzato per recuperare dati
  - `POST`: Utilizzato per creare nuovi dati
  - `PUT`: Utilizzato per aggiornare dati esistenti
  - `DELETE`: Utilizzato per eliminare dati
- **Codici di stato**: Forniscono un'indicazione rapida sul successo della richiesta e, in caso contrario, dove potrebbe essere il problema. I codici di stato comuni includono:
  - `200`: Successo
  - `404`: Risorsa richiesta non trovata
  - `500`: Errore del server

## 2. Se GET può anche trasportare dati in una richiesta, perché dovremmo usare POST?

> Dato che GET può anche inviare richieste con dati, perché abbiamo ancora bisogno di usare POST?

Questo si basa principalmente su quattro considerazioni:

1. **Sicurezza**: Poiché i dati GET sono aggiunti all'URL, i dati sensibili sono facilmente esposti. POST inserisce i dati nel corpo della richiesta, il che è relativamente più sicuro.
2. **Limite sulla dimensione dei dati**: Con GET, browser e server impongono limiti sulla lunghezza dell'URL (anche se varia leggermente tra i browser, generalmente si aggira intorno ai 2048 byte), il che limita la quantità di dati. POST nominalmente non ha limiti, ma in pratica, il middleware è tipicamente configurato per limitare la dimensione dei dati per prevenire attacchi malevoli con payload di grandi dimensioni. Ad esempio, il `body-parser` di Express.
3. **Chiarezza semantica**: Garantisce che gli sviluppatori possano comprendere chiaramente lo scopo della richiesta. GET è tipicamente usato per recuperare dati, mentre POST è più adatto per creare o aggiornare dati.
4. **Immutabilità**: Nel protocollo HTTP, il metodo GET è progettato per essere "sicuro" -- indipendentemente da quante richieste vengono inviate, non c'è preoccupazione di modificare i dati sul server.

## 3. Cosa fa il metodo PUT in HTTP?

> Qual è lo scopo del metodo PUT?

Serve principalmente a due scopi:

1. Aggiornare una risorsa esistente (es. modificare le informazioni utente)
2. Creare una nuova risorsa se non esiste

### Esempio

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // URL dell'API
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // Esegui la richiesta PUT
    console.log('Utente aggiornato:', response.data); // Mostra le info utente aggiornate
  } catch (error) {
    console.log('Errore nell\'aggiornamento utente:', error); // Mostra le info sull'errore
  }
}

updateUser(1, 'Pitt Wu');
```
