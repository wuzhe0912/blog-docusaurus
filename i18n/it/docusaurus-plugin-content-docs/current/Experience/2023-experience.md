---
id: 2023-experience
title: 'Esperienza 2023'
slug: /2023-experience
---

## Qual è il problema tecnico più sfidante che hai risolto?

Una sfida recente è stata implementare il login WebAuthn, in modo che gli utenti web potessero autenticarsi con un'esperienza simile a Face ID/Touch ID, paragonabile all'app nativa.

### Contesto

- Obiettivo: UX di login web più fluida e veloce
- Vincolo: esperienza limitata in produzione con WebAuthn
- Complessità: differenze di comportamento della piattaforma tra iOS e Android

### Cosa l'ha resa difficile

- Il tuning dei parametri e delle opzioni della ceremony era delicato
- Gli esempi in documentazione non coprivano completamente gli edge case reali di prodotto
- L'attivazione biometrica su Android richiedeva aggiustamenti di compatibilità lato backend

### Cosa ho fatto

1. Ho validato la fattibilità usando riferimenti di prototipi
2. Ho allineato il flusso decisionale di registrazione/login con PM e backend
3. Ho testato in modo iterativo le opzioni dell'authenticator e i comportamenti di fallback
4. Ho lavorato con il backend per adattare la gestione di challenge e credential, garantendo coerenza tra dispositivi

### Risultato

- L'esperienza di login web è diventata più vicina al flusso dell'app nativa
- Insieme ai miglioramenti PWA, l'attrito per gli utenti si è ridotto
- Il team ha acquisito conoscenze riutilizzabili per futuri upgrade dell'autenticazione

### Riferimenti usati durante l'implementazione

- [webauthn.io](https://webauthn.io/)
- [Introduction to WebAuthn API](https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285)
