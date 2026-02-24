---
id: state-management-vue-pinia-persistence
title: 'Strategie di persistenza in Pinia'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> La persistenza deve essere intenzionale: non tutto lo stato deve sopravvivere al refresh.

---

## 1. Focus da colloquio

1. Opzioni di persistenza in Pinia
2. Decisioni di storage a livello campo
3. Confini di sicurezza

## 2. Opzioni di persistenza

### Option A: `pinia-plugin-persistedstate`

```ts
export const usePrefsStore = defineStore('prefs', {
  state: () => ({ theme: 'light', locale: 'en' }),
  persist: true,
});
```

Puoi anche configurare storage personalizzato e path selezionati.

### Opzione B: composable storage di VueUse

```ts
const theme = useLocalStorage<'light' | 'dark'>('theme', 'light');
const dismissedTips = useSessionStorage<boolean>('dismissedTips', false);
```

Utile quando solo campi specifici richiedono persistenza.

### Opzione C: persistenza manuale

Possibile, ma facile da sbagliare e più difficile da mantenere.

## 3. Cosa persistere e cosa no

Da persistere:

- tema / locale
- preferenze UI
- filtri non sensibili

Da non persistere:

- access token grezzi in contesti non sicuri
- campi sensibili del profilo utente senza policy chiara
- stato transitorio di loading a vita breve

## 4. Raccomandazioni per la produzione

- Definisci una matrice di persistenza store-per-store
- Usa `sessionStorage` per dati di sessione breve
- Usa chiavi di versione esplicite per le migrazioni
- Fornisci fallback sicuri quando cambia lo schema salvato

## 5. Sintesi pronta per il colloquio

> Scelgo la persistenza in base a sensibilità e durata del dato. Uso plugin o VueUse per una persistenza prevedibile, evito di persistere ciecamente valori sensibili e mantengo chiavi sicure per la migrazione.
