---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Confronto

| Proprietà      | `cookie`                                                                                           | `sessionStorage`              | `localStorage`                  |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------- |
| Durata         | Eliminato alla chiusura della pagina a meno che non sia impostata una scadenza (`Expires`) o una durata massima (`Max-Age`) | Eliminato alla chiusura della tab | Persiste fino alla rimozione manuale |
| Richiesta HTTP | Sì, inviato al server tramite l'header Cookie                                                     | No                            | No                              |
| Limite di archiviazione | 4KB                                                                                       | 5MB                           | 5MB                             |
| Ambito di accesso | Tra finestre/tab                                                                                | Solo nella stessa tab         | Tra finestre/tab                |
| Sicurezza      | JavaScript non può accedere ai `cookie HttpOnly`                                                   | Nessuna protezione speciale di default | Nessuna protezione speciale di default |

## Terminologia

> Cosa sono i cookie persistenti?

Un cookie persistente (chiamato anche cookie permanente) memorizza i dati nel browser dell'utente per un lungo periodo.
Come menzionato sopra, questo viene fatto impostando un valore di scadenza (`Expires` o `Max-Age`).

## Esperienza pratica

### `cookie`

#### 1. Verifica di sicurezza

Alcuni progetti legacy avevano una sicurezza debole e frequenti furti di account, il che aumentava significativamente i costi operativi.
Ho usato prima [Fingerprint](https://fingerprint.com/) (la versione community è ufficialmente descritta con circa il 60% di accuratezza, e la versione a pagamento include 20.000 richieste mensili gratuite).
Ogni utente che effettuava il login veniva identificato come un ID visita unico basato sui parametri del dispositivo e della geolocalizzazione. Poi, sfruttando il fatto che i cookie vengono inviati con ogni richiesta HTTP, il backend poteva verificare se l'utente aveva cambiato dispositivo o mostrava uno spostamento sospetto della posizione. Se veniva rilevata un'anomalia, il flusso di login forzava la verifica OTP (email o SMS, a seconda della policy aziendale).

#### 2. URL con codice referral

Quando si gestisce un sito web di prodotto, il marketing di affiliazione è comune: ogni promotore ottiene un URL dedicato per l'attribuzione.
Per garantire che gli utenti acquisiti tramite quel traffico fossero ancora attribuiti al promotore, ho implementato una soluzione con l'attributo `expires` del cookie. Una volta che un utente entrava tramite un link di referral, il codice referral rimaneva valido per 24 ore (la finestra temporale può essere configurata dalle operazioni). Anche se l'utente rimuoveva i parametri di referral dall'URL, la registrazione leggeva comunque il valore dal `cookie` fino alla scadenza automatica.

### `localStorage`

#### 1. Memorizzazione delle preferenze utente

- Comunemente usato per memorizzare le preferenze utente come la modalità scura e il locale i18n.
- Può anche memorizzare i token di login.
