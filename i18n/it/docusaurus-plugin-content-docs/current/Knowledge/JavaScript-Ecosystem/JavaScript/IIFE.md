---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. Cos'è una IIFE?

IIFE sta per Immediately Invoked Function Expression (espressione di funzione immediatamente invocata).
Rispetto a una normale dichiarazione di funzione, avvolge la funzione con un extra `()` e la esegue immediatamente:

```js
(() => {
  console.log(1);
})();

# oppure

(function () {
  console.log(2);
})();
```

Può anche eseguirsi ripetutamente tramite ricorsione fino a quando una condizione di arresto non viene raggiunta, e le parentesi finali `()` possono passare parametri.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finito!!');
})((num = 0));
```

Nota che una IIFE viene eseguita al momento dell'inizializzazione (o tramite auto-chiamate interne), ma non può essere richiamata direttamente dall'esterno.

## 2. Perché usare una IIFE?

### Scope

Poiché le variabili dichiarate all'interno di una funzione hanno scope limitato a quella funzione, la IIFE può isolare lo stato ed evitare di inquinare le variabili globali:

```js
// globale
const name = 'Yumi';
const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // risultato Pitt
  console.log(Hello()); // risultato Hello Pitt!
})();

console.log(name); // risultato Yumi
console.log(Hello()); // risultato Hello Yumi!
```

### Variabili e metodi privati (Private variable and methods)

Usando IIFE con closure si possono creare variabili e metodi privati.
Ciò significa che lo stato può essere preservato all'interno della funzione e aggiornato ad ogni chiamata (ad esempio, incremento/decremento).

```js
const increment = (() => {
  let result = 0;
  console.log(result);
  const credits = (num) => {
    console.log(`Ho ${num} crediti.`);
  };
  return () => {
    result += 1;
    credits(result);
  };
})();

increment(); // Ho 1 crediti.
increment(); // Ho 2 crediti.
```

Attenzione: poiché quelle variabili persistono, un uso eccessivo può consumare memoria e ridurre le prestazioni.

### Modulo (Module)

Puoi esporre funzionalità in forma di oggetto come pattern modulo.
Nell'esempio seguente, puoi incrementare e anche resettare lo stato:

```js
const Score = (() => {
  let result = 0;

  return {
    current: () => {
      return result;
    },

    increment: () => {
      result += 1;
    },

    reset: () => {
      result = 0;
    },
  };
})();

Score.increment();
console.log(Score.current()); // risultato 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // risultato 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // risultato 0 => reset = 0
```

Un altro stile:

```js
const Score = (() => {
  let result = 0;
  const current = () => {
    return result;
  };

  const increment = () => {
    result += 1;
  };

  const reset = () => {
    result = 0;
  };

  return {
    current: current,
    increment: increment,
    reset: reset,
  };
})();

Score.increment();
console.log(Score.current());
Score.increment();
console.log(Score.current());
Score.reset();
console.log(Score.current());
```

Un'altra nota: poiché le IIFE vengono eseguite immediatamente, posizionare due IIFE consecutive può rompere l'`ASI` (Automatic Semicolon Insertion).
Quando si concatenano IIFE, aggiungi i punti e virgola esplicitamente.
