---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Descrição do problema

Implemente uma função que receba uma string e retorne o caractere que aparece com mais frequência.

### Exemplos

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Metodos de implementação

### Método 1: Contagem com objeto (versão básica)

**Abordagem**: Percorrer a string, usar um objeto para registrar o número de aparicoes de cada caractere e depois encontrar o mais frequente.

```javascript
function findMostFrequentChar(str) {
  // Inicializar objeto para armazenar caracteres e contagens
  const charCount = {};

  // Inicializar variáveis para contagem máxima e caractere
  let maxCount = 0;
  let maxChar = '';

  // Percorrer a string
  for (let char of str) {
    // Se o caractere não está no objeto, definir contagem como 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Incrementar a contagem deste caractere
    charCount[char]++;

    // Se a contagem deste caractere e maior que a contagem máxima
    // Atualizar contagem máxima e caractere máximo
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Retornar o caractere máximo
  return maxChar;
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Complexidade temporal**: O(n), onde n e o comprimento da string
**Complexidade espacial**: O(k), onde k e o número de caracteres diferentes

### Método 2: Contar primeiro e depois encontrar o máximo (duas fases)

**Abordagem**: Primeiro percorrer uma vez para calcular as aparicoes de todos os caracteres, depois percorrer novamente para encontrar o máximo.

```javascript
function findMostFrequentChar(str) {
  // Fase 1: Calcular as aparicoes de cada caractere
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Fase 2: Encontrar o caractere mais frequente
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Vantagens**: Logica mais clara, processamento por fases
**Desvantagens**: Requer duas travessias

### Método 3: Usando Map (ES6)

**Abordagem**: Usar Map para armazenar a relação entre caracteres e contagens.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Vantagens**: Usar Map é mais adequado ao estilo moderno do JavaScript
**Desvantagens**: Para cenários simples, um objeto pode ser mais intuitivo

### Método 4: Usando reduce (estilo funcional)

**Abordagem**: Usar `reduce` e `Object.entries` para implementar.

```javascript
function findMostFrequentChar(str) {
  // Calcular as aparicoes de cada caractere
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Encontrar o caractere mais frequente
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Vantagens**: Estilo funcional, código conciso
**Desvantagens**: Menor legibilidade, desempenho ligeiramente inferior

### Método 5: Tratamento de múltiplos valores maximos iguais

**Abordagem**: Se vários caracteres tem a mesma frequência máxima, retornar um array ou o primeiro encontrado.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Calcular as aparicoes de cada caractere
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Encontrar todos os caracteres com frequência igual ao máximo
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Retornar o primeiro encontrado (ou retornar o array inteiro)
  return mostFrequentChars[0];
  // Ou retornar todos: return mostFrequentChars;
}

// Teste
console.log(findMostFrequentChar('aabbcc')); // 'a' (o primeiro encontrado)
```

## 3. Edge Cases

> Tratamento de casos limite

### String vazia

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Ou throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Maiusculas e minusculas

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Teste
console.log(findMostFrequentChar('Hello', false)); // 'l' (sem distinguir maiusculas/minusculas)
console.log(findMostFrequentChar('Hello', true)); // 'l' (distinguindo maiusculas/minusculas)
```

### Espacos e caracteres especiais

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Teste
console.log(findMostFrequentChar('hello world', true)); // 'l' (ignorando espacos)
console.log(findMostFrequentChar('hello world', false)); // ' ' (espaco)
```

## 4. Common Interview Questions

> Perguntas frequentes em entrevistas

### Questão 1: Implementação básica

Implemente uma função que encontre o caractere mais frequente em uma string.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Pontos-chave**:

- Usar objeto ou Map para registrar a frequência de cada caractere
- Atualizar o máximo durante a travessia
- Complexidade temporal O(n), complexidade espacial O(k)

</details>

### Questão 2: Versao otimizada

Otimize a função acima para tratar múltiplos valores maximos iguais.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Fase 1: Calcular as aparicoes de cada caractere
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Fase 2: Encontrar todos os caracteres com frequência máxima
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Retornar o primeiro ou todos conforme necessidade
  return mostFrequentChars[0]; // Ou retornar mostFrequentChars
}

// Teste
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Questão 3: Implementação com Map

Implemente esta função usando Map do ES6.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Mais adequado para pares chave-valor dinâmicos, as chaves podem ser de qualquer tipo
- **Object**: Mais simples e intuitivo, adequado para chaves do tipo string

</details>

## 5. Best Practices

> Melhores práticas

### Praticas recomendadas

```javascript
// 1. Usar nomes de variáveis claros
function findMostFrequentChar(str) {
  const charCount = {}; // Expressar claramente o proposito
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Tratar casos limite
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Atualizar o máximo durante a travessia (uma única travessia)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Praticas a evitar

```javascript
// 1. Não usar duas travessias (a menos que necessário)
// ❌ Desempenho inferior
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Segunda travessia
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Não esquecer de tratar strings vazias
// ❌ Pode retornar undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Com string vazia, maxChar e ''
}

// 3. Não usar estilos funcionais excessivamente complexos (a menos que seja convencao da equipe)
// ❌ Menor legibilidade
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Resumo para entrevistas

### Referencia rápida

**Pontos de implementação**:

1. Usar objeto ou Map para registrar a frequência de cada caractere
2. Atualizar o máximo durante a travessia
3. Complexidade temporal O(n), complexidade espacial O(k)
4. Tratar casos limite (string vazia, maiusculas/minusculas, etc.)

**Direcoes de otimização**:

- Completar em uma única travessia (contar e encontrar o máximo simultaneamente)
- Usar Map para cenários complexos
- Tratar múltiplos valores maximos iguais
- Considerar maiusculas/minusculas, espaços e outros casos especiais

### Exemplo de resposta em entrevista

**Q: Implemente uma função que encontre o caractere mais frequente em uma string.**

> "Eu usaria um objeto para registrar a frequência de cada caractere e atualizaria o máximo durante a travessia da string. A implementação concreta e: inicializar um objeto vazio charCount para armazenar caracteres e contagens, inicializar as variáveis maxCount e maxChar. Depois percorrer a string, para cada caractere, se não estiver no objeto, inicializar em 0, depois incrementar a contagem. Se a contagem do caractere atual for maior que maxCount, atualizar maxCount e maxChar. Finalmente retornar maxChar. A complexidade temporal deste método e O(n) e a complexidade espacial e O(k), onde n e o comprimento da string e k e o número de caracteres diferentes."

## Reference

- [MDN - String](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
