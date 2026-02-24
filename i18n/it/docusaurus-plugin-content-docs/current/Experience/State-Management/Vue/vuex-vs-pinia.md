---
id: state-management-vue-vuex-vs-pinia
title: 'Confronto Vuex vs Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Vuex e Pinia risolvono lo stesso problema, ma con ergonomia e livello di modernizzazione diversi.

---

## 1. Focus da colloquio

1. Differenze architetturali principali
2. Quando ogni opzione è appropriata
3. Strategia di migrazione da Vuex a Pinia

## 2. Confronto ad alto livello

| Tema | Vuex | Pinia |
| --- | --- | --- |
| Epoca ecosistema Vue | Principale in Vue 2 | Ufficiale in Vue 3 |
| Mutations richieste | Sì | No |
| Ergonomia TypeScript | Setup più pesante | Inferenza migliore |
| Design moduli | Moduli annidati comuni | Store indipendenti e piatti |
| DX e manutenibilità | Buona | Migliore nelle app moderne Vue 3 |

## 3. Confronto API

### Stile Vuex

```ts
mutations: {
  increment(state) {
    state.count++;
  }
}
```

### Stile Pinia

```ts
actions: {
  increment() {
    this.count++;
  }
}
```

Pinia rimuove il boilerplate delle mutation.

## 4. Guida alla scelta

Usa Vuex quando:

- Il codebase legacy Vue 2 è stabile
- Il costo di migrazione è attualmente troppo alto

Usa Pinia quando:

- Stai sviluppando nuovi progetti Vue 3
- Hai obiettivi forti su TS e manutenibilità
- Il team vuole meno boilerplate

## 5. Approccio alla migrazione

1. Introduci Pinia accanto a Vuex esistente
2. Migra prima i moduli a basso rischio
3. Sposta i flussi business condivisi nei composable
4. Rimuovi Vuex dopo aver raggiunto parità e copertura test

## 6. Sintesi pronta per il colloquio

> Per i progetti Vue 3 raccomando Pinia grazie ad API più pulita ed ergonomia TypeScript. Per i codebase legacy Vuex, uso una migrazione incrementale per ridurre il rischio.
