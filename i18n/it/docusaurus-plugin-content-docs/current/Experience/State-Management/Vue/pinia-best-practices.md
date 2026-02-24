---
id: state-management-vue-pinia-best-practices
title: 'Best practice Pinia ed errori comuni'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Come mantenere manutenibili gli store Pinia in applicazioni Vue medio-grandi.

---

## 1. Focus da colloquio

1. Confini di design degli store
2. Insidie della reattività
3. Pratiche di manutenibilità a livello team

## 2. Principi di design degli store

### Responsabilità singola per store

```ts
useAuthStore();
useUserStore();
useCatalogStore();
```

Evita un mega store unico che mescola responsabilità non correlate.

### Mantieni gli store come contenitori di stato

Preferisci:

- state
- getter deterministici
- action focalizzate

Sposta i workflow di business complessi in composable/service.

### Mantieni gli effetti collaterali all'esterno quando possibile

Invece di mettere tutta l'orchestrazione API direttamente nelle action dello store, usa i composable per il workflow e mantieni le action focalizzate sugli aggiornamenti di stato.

## 3. Errori comuni

### Errore 1: destrutturazione diretta di state/getter

```ts
// bad: reactivity can be lost
const { token, isLoggedIn } = authStore;

// good
const { token, isLoggedIn } = storeToRefs(authStore);
```

### Errore 2: accesso agli store fuori da un contesto valido

Chiama gli store in `setup`, nei composable o in punti sicuri del lifecycle applicativo.

### Errore 3: dipendenze circolari tra store

Store A che importa Store B e Store B che importa Store A causa comportamenti fragili a runtime.

### Errore 4: mutare copie non reattive

Aggiorna sempre tramite riferimenti reattivi o action.

## 4. Standard pratici

- Usa tipi TypeScript per stato e payload
- Mantieni espliciti i nomi delle action (`setUserProfile`, `resetSession`)
- Raggruppa gli store per dominio di business
- Aggiungi metodi di reset per logout/cambio account
- Mantieni esplicita la policy di persistenza per campo

## 5. Sintesi pronta per il colloquio

> Mantengo gli store piccoli e focalizzati sul dominio, evito problemi di reattività con `storeToRefs`, sposto l'orchestrazione complessa nei composable e applico strategie chiare di typing e reset.
