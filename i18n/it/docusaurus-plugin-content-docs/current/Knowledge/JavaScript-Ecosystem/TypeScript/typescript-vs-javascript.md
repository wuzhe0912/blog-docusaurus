---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. Cos'è TypeScript?

> Come è correlato TypeScript a JavaScript?

TypeScript è un superset di JavaScript che aggiunge tipizzazione statica e strumenti per lo sviluppatore.

- Tutto il JavaScript valido è TypeScript valido
- Il codice TypeScript viene compilato in JavaScript prima dell'esecuzione
- Gli errori di tipo vengono trovati durante lo sviluppo, non solo a runtime

## 2. TypeScript vs JavaScript in sintesi

| Argomento | JavaScript | TypeScript |
| --- | --- | --- |
| Sistema di tipi | Dinamico | Statico + inferito |
| Fase di compilazione | Non richiesta | Richiesta (`tsc` o bundler) |
| Rilevamento errori | Principalmente a runtime | Compilazione + runtime |
| Supporto al refactoring | Basilare | Forte |
| Curva di apprendimento | Inferiore | Superiore |

## 3. Esempio di confronto

### JavaScript

```js
function add(a, b) {
  return a + b;
}

console.log(add(1, '2')); // "12" (forse non intenzionale)
```

### TypeScript

```ts
function add(a: number, b: number): number {
  return a + b;
}

// add(1, '2'); // errore in fase di compilazione
console.log(add(1, 2));
```

TypeScript aiuta a prevenire bug accidentali di coercion.

## 4. Flusso di compilazione (Compilation flow)

1. Scrivi `.ts` o `.tsx`
2. Verifica dei tipi con il compilatore TypeScript
3. Emetti JavaScript
4. Esegui JavaScript nel browser o Node.js

In produzione invii comunque JavaScript.

## 5. Vantaggi di TypeScript

- Rilevamento precoce dei bug
- Migliore autocompletamento e navigazione nell'IDE
- Refactoring su larga scala più sicuro
- Contratti API più chiari tra i team

## 6. Compromessi di TypeScript (Trade-offs)

- Richiede configurazione (`tsconfig`, pipeline di build)
- Aggiunge sintassi e concetti di tipo
- Può essere eccessivamente verboso se usato male

## 7. Quando scegliere quale

Scegli JavaScript quando:

- La velocità del prototipo è la priorità principale
- L'ambito del progetto è piccolo e di breve durata

Scegli TypeScript quando:

- La dimensione del progetto o del team è media o grande
- La manutenzione a lungo termine è importante
- Le API pubbliche necessitano di contratti forti

## 8. Strategia di migrazione da JavaScript

1. Abilita TypeScript con `allowJs`
2. Converti prima i moduli ad alto rischio
3. Attiva `strict` gradualmente
4. Sostituisci `any` con tipi precisi nel tempo

Questo percorso incrementale minimizza le interruzioni.

## 9. Risposte rapide per i colloqui (Quick Interview Answers)

### D1: TypeScript viene eseguito direttamente dai browser?

No. I browser eseguono JavaScript, quindi TypeScript deve essere prima compilato.

### D2: TypeScript garantisce zero bug a runtime?

No. Individua molti bug legati ai tipi, ma gli errori di logica a runtime possono comunque verificarsi.

### D3: TypeScript è obbligatorio per React?

No. React funziona sia con JavaScript che con TypeScript; TypeScript è opzionale ma comune nelle app di produzione.
