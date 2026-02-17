---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE, também conhecida como expressão de função imediatamente invocada, possui uma sintaxe diferente das funções comuns. Ela precisa ser envolvida com uma camada adicional de `()` e tem a característica de ser executada imediatamente:

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

Além disso, também é possível executá-la repetidamente por meio de recursion (recursão) até que uma condição de parada seja atingida. Os `()` finais permitem a passagem de parâmetros.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Porém, é importante notar que um IIFE só pode ser executado na inicialização ou chamado recursivamente internamente; não é possível invocá-lo novamente a partir do exterior.

## 2. Why use IIFE ?

### scope

Com base na característica de que variáveis são destruídas dentro de uma function, é possível usar IIFE para criar um efeito de isolamento e evitar a poluição de variáveis globais. Veja o exemplo abaixo:

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

Usando IIFE em conjunto com closure, é possível criar Private variable and methods. Isso significa que variáveis podem ser mantidas dentro de uma function, e a cada chamada dessa function, o valor pode ser ajustado com base no resultado anterior, como incrementar ou decrementar.

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

Porém, é importante notar que, como as variáveis não são destruídas, o uso abusivo pode ocupar memória e afetar o desempenho.

### module

Também é possível executar em forma de objeto. No exemplo abaixo, é possível ver que, além de incrementar variáveis, também é possível realizar a inicialização:

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

Outra forma de escrever:

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

Por fim, é especialmente importante notar que, devido à característica de execução imediata do IIFE, se houver duas funções imediatamente executadas consecutivas, a regra de `ASI (Automatic Semicolon Insertion)` pode não funcionar corretamente. Portanto, quando houver dois IIFEs consecutivos, é necessário adicionar o ponto e vírgula manualmente.
