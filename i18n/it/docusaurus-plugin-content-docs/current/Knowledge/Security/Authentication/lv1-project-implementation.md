---
id: login-lv1-project-implementation
title: "[Lv1] Come È Stata Implementata l'Autenticazione nei Progetti Passati?"
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Obiettivo: Spiegare chiaramente "come il frontend gestisce il login, la gestione dello stato e la protezione delle pagine" in 3-5 minuti, facilitando il richiamo durante i colloqui.

---

## 1. Punti Chiave della Risposta al Colloquio

1. **Tre Fasi del Flusso di Login**: Invio del form → Verifica backend → Salvataggio del token e redirect.
2. **Gestione dello Stato e del Token**: Pinia con persistenza, Axios Interceptor per allegare automaticamente il Bearer Token.
3. **Gestione Post-login e Protezione**: Inizializzazione dei dati condivisi, route guard, logout e casi limite (OTP, cambio password forzato).

Inizia con questi tre punti chiave, poi espandi nei dettagli se necessario, mostrando all'intervistatore che hai una visione olistica.

---

## 2. Componenti del Sistema e Responsabilità

| Modulo           | Posizione                           | Ruolo                                                    |
| ---------------- | ----------------------------------- | -------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Memorizza lo stato di login, persiste il token, fornisce getter |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Incapsula il flusso di login/logout, formato di ritorno unificato |
| Login API        | `src/api/login.ts`                  | Chiama il backend `POST /login`, `POST /logout`          |
| Axios Utility    | `src/common/utils/request.ts`       | Request/Response Interceptor, gestione errori unificata  |
| Route Guard      | `src/router/index.ts`               | Controlla `meta` per determinare se è richiesto il login |
| Inizializzazione | `src/common/composables/useInit.ts` | Controlla la presenza di un token all'avvio dell'app, carica i dati necessari |

> Mnemonico: **"Lo Store gestisce lo stato, l'Hook gestisce il flusso, l'Interceptor gestisce il canale, il Guard gestisce le pagine."**

---

## 3. Flusso di Login (Passo dopo Passo)

### Passo 0. Form e Pre-validazione

- Supporta due metodi di login: password e codice di verifica SMS.
- Validazione base prima dell'invio (campi obbligatori, formato, debounce).

### Passo 1. Chiamata all'API di Login

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` gestisce la gestione degli errori e lo stato di caricamento in modo uniforme.
- In caso di successo, `data` restituisce il token e le informazioni utente principali.

### Passo 2. Gestione della Risposta del Backend

| Scenario                                            | Comportamento                                                    |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| **Verifica aggiuntiva richiesta** (es. conferma identità al primo login) | Imposta `authStore.onBoarding` a `true`, redirect alla pagina di verifica |
| **Cambio password forzato**                         | Redirect al flusso di cambio password con i parametri necessari   |
| **Successo normale**                                | Chiama `authStore.$patch()` per salvare token e informazioni utente |

### Passo 3. Azioni Condivise dopo il Login

1. Recuperare il profilo utente e la lista dei wallet.
2. Inizializzare i contenuti personalizzati (es. lista regali, notifiche).
3. Redirect alla pagina interna basato su `redirect` o route predefinita.

> Un login riuscito è solo metà del lavoro — **i dati condivisi dovrebbero essere caricati a questo punto** per evitare che ogni pagina faccia chiamate API separate.

---

## 4. Gestione del Ciclo di Vita del Token

### 4.1 Strategia di Archiviazione

- `authStore` abilita `persist: true`, scrivendo i campi chiave in `localStorage`.
- Pro: Lo stato si recupera automaticamente dopo il refresh della pagina. Contro: Bisogna fare attenzione a XSS e sicurezza.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Le API che richiedono autorizzazione includono automaticamente il Bearer Token.
- Le API esplicitamente contrassegnate con `needToken: false` (login, registrazione, ecc.) saltano l'allegamento del token.

### 4.3 Gestione della Scadenza e delle Eccezioni

- Se il backend restituisce una risposta di token scaduto o token non valido, il Response Interceptor la converte uniformemente in una notifica di errore e attiva il flusso di logout.
- Un meccanismo di Refresh Token può essere aggiunto come estensione, ma il progetto attuale utilizza una strategia semplificata.

---

## 5. Protezione delle Route e Inizializzazione

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- Utilizza `meta.needAuth` per determinare se controllare lo stato di login.
- Redirect alla pagina di login o a una pagina pubblica designata quando non si è loggati.

### 5.2 Inizializzazione all'Avvio dell'App

`useInit` gestisce quanto segue all'avvio dell'app:

1. Controlla se l'URL contiene `login_token` o `platform_token` — in tal caso, esegue il login automatico o imposta il token.
2. Se lo Store ha già un token, carica le informazioni utente e i dati condivisi.
3. Se non c'è un token, rimane sulla pagina pubblica e attende che l'utente faccia il login manualmente.

---

## 6. Flusso di Logout (Pulizia)

1. Chiama `POST /logout` per notificare il backend.
2. Esegue `reset()`:
   - `authStore.$reset()` cancella le informazioni di login.
   - Anche gli store correlati (info utente, preferiti, codici invito, ecc.) vengono resettati.
3. Cancella le cache lato browser (es. cache di localStorage).
4. Redirect alla pagina di login o alla homepage.

> Il logout è l'immagine speculare del login: non si tratta solo di eliminare il token — bisogna assicurarsi che tutto lo stato dipendente sia cancellato per evitare fughe di dati.

---

## 7. Domande Frequenti e Best Practice

- **Decomposizione del Flusso**: Separare il login e l'inizializzazione post-login per mantenere gli hook concisi.
- **Gestione degli Errori**: Unificata tramite `useApi` e Response Interceptor per garantire un comportamento UI consistente.
- **Sicurezza**:
  - Utilizzare sempre HTTPS.
  - Quando si memorizzano token in `localStorage`, fare attenzione a XSS per le operazioni sensibili.
  - Considerare l'estensione con httpOnly Cookie o Refresh Token secondo necessità.
- **Estensibilità**: Casi limite come OTP e cambio password forzato vengono gestiti in modo flessibile — l'hook restituisce lo stato affinché il livello vista lo elabori.

---

## 8. Mnemonici Rapidi per il Colloquio

1. **"Input → Valida → Salva → Redirect"**: Usa questo ordine per descrivere il flusso complessivo.
2. **"Lo Store gestisce lo stato, l'Interceptor gestisce gli header, il Guard blocca gli accessi non autorizzati"**: Evidenzia la separazione architetturale.
3. **"Caricare i dati condivisi immediatamente dopo il login"**: Dimostra sensibilità all'esperienza utente.
4. **"Il logout è un reset con un click + redirect a una pagina sicura"**: Copre sicurezza e completamento del flusso.
