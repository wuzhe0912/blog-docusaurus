---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE wird auch als sofort ausgeführter Funktionsausdruck bezeichnet. Im Vergleich zu normalen Funktionen hat er eine andere Schreibweise: Er muss mit einer zusätzlichen `()` umschlossen werden und besitzt die Eigenschaft, sofort ausgeführt zu werden:

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

Darüber hinaus kann er auch durch Recursion (Rekursion) wiederholt ausgeführt werden, bis eine Abbruchbedingung erreicht wird. Die abschließenden `()` können dabei zum Übergeben von Parametern verwendet werden.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Dabei ist zu beachten, dass ein IIFE nur bei der Initialisierung ausgeführt werden kann oder sich intern selbst rekursiv aufruft. Ein erneuter Aufruf von außen ist nicht möglich.

## 2. Why use IIFE ?

### scope

Basierend auf der Eigenschaft, dass Variablen innerhalb einer function zerstört werden, kann durch IIFE eine Isolierung erreicht werden, um eine Verschmutzung globaler Variablen zu vermeiden. Siehe das folgende Beispiel:

```js
// global
const name = 'Yumi';
const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // result Pitt
  console.log(Hello()); // result Hello Pitt!
})();

console.log(name); // result Yumi
console.log(Hello()); // result Hello Yumi!
```

### private variable and methods

Durch die Kombination von IIFE mit Closure können Private variable and methods erstellt werden. Das bedeutet, dass Variablen innerhalb einer function gespeichert werden können und bei jedem Aufruf dieser function basierend auf dem vorherigen Ergebnis angepasst werden können, zum Beispiel durch Inkrementierung oder Dekrementierung.

```js
const increment = (() => {
  let result = 0;
  console.log(result);
  const credits = (num) => {
    console.log(`I have ${num} credits.`);
  };
  return () => {
    result += 1;
    credits(result);
  };
})();

increment(); // I have 1 credits.
increment(); // I have 2 credits.
```

Dabei ist zu beachten, dass die Variablen nicht zerstört werden. Bei übermäßiger Verwendung kann dies Speicher belegen und die Performance beeinträchtigen.

### module

Die Ausführung kann auch in Objektform erfolgen. Im folgenden Beispiel sehen Sie, dass neben dem Inkrementieren von Variablen auch eine Initialisierung möglich ist:

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
console.log(Score.current()); // result 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // result 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // result 0 => reset = 0
```

Eine alternative Schreibweise:

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

Abschließend ist besonders zu beachten, dass aufgrund der sofortigen Ausführungseigenschaft von IIFE bei zwei aufeinanderfolgenden sofort ausgeführten Funktionen die `ASI (Automatic Semicolon Insertion)`-Regel nicht greifen kann. Daher muss bei zwei aufeinanderfolgenden IIFEs das Semikolon manuell gesetzt werden.
