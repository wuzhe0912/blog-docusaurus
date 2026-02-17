---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE, aussi appelée expression de fonction immédiatement invoquée, a une syntaxe différente des fonctions classiques. Elle doit être entourée d'une couche supplémentaire de `()` et possède la caractéristique d'être exécutée immédiatement :

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

De plus, il est possible de l'exécuter de manière répétée via la recursion (récursion) jusqu'à ce qu'une condition d'arrêt soit atteinte. Les `()` finaux permettent de passer des paramètres.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Il faut cependant noter qu'un IIFE ne peut être exécuté qu'à l'initialisation ou s'appeler récursivement en interne ; il ne peut pas être appelé à nouveau depuis l'extérieur.

## 2. Why use IIFE ?

### scope

En se basant sur la caractéristique de destruction des variables à l'intérieur d'une function, on peut utiliser IIFE pour isoler la portée et éviter de polluer les variables globales. Voir l'exemple ci-dessous :

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

En combinant IIFE avec closure, on peut créer des Private variable and methods. Cela signifie que des variables peuvent être conservées dans une function, et à chaque appel de cette function, la valeur peut être ajustée en fonction du résultat précédent, par exemple par incrémentation ou décrémentation.

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

Il faut toutefois noter que les variables n'étant pas détruites, une utilisation abusive peut occuper de la mémoire et affecter les performances.

### module

L'exécution peut également se faire sous forme d'objet. Dans l'exemple ci-dessous, on peut voir qu'en plus de l'incrémentation de variables, il est aussi possible de procéder à une initialisation :

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

Une autre façon de l'écrire :

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

Enfin, il faut particulièrement noter que, en raison de la caractéristique d'exécution immédiate des IIFE, si deux fonctions immédiatement exécutées se suivent, la règle `ASI (Automatic Semicolon Insertion)` peut ne pas fonctionner correctement. Il est donc nécessaire d'ajouter manuellement le point-virgule lorsque deux IIFE se suivent.
