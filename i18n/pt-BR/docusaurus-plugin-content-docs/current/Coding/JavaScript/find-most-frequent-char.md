---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Descricao do problema

Implemente uma funcao que receba uma string e retorne o caractere que aparece com mais frequencia.

### Exemplos

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Metodos de implementacao

### Metodo 1: Contagem com objeto (versao basica)

**Abordagem**: Percorrer a string, usar um objeto para registrar o numero de aparicoes de cada caractere e depois encontrar o mais frequente.

```javascript
function findMostFrequentChar(str) {
  // Inicializar objeto para armazenar caracteres e contagens
  const charCount = {};

  // Inicializar variaveis para contagem maxima e caractere
  let maxCount = 0;
  let maxChar = '';

  // Percorrer a string
  for (let char of str) {
    // Se o caractere nao esta no objeto, definir contagem como 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Incrementar a contagem deste caractere
    charCount[char]++;

    // Se a contagem deste caractere e maior que a contagem maxima
    // Atualizar contagem maxima e caractere maximo
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Retornar o caractere maximo
  return maxChar;
}

// Teste
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Complexidade temporal**: O(n), onde n e o comprimento da string
**Complexidade espacial**: O(k), onde k e o numero de caracteres diferentes

### Metodo 2: Contar primeiro e depois encontrar o maximo (duas fases)

**Abordagem**: Primeiro percorrer uma vez para calcular as aparicoes de todos os caracteres, depois percorrer novamente para encontrar o maximo.

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

### Metodo 3: Usando Map (ES6)

**Abordagem**: Usar Map para armazenar a relacao entre caracteres e contagens.

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

**Vantagens**: Usar Map e mais adequado ao estilo moderno do JavaScript
**Desvantagens**: Para cenarios simples, um objeto pode ser mais intuitivo

### Metodo 4: Usando reduce (estilo funcional)

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

**Vantagens**: Estilo funcional, codigo conciso
**Desvantagens**: Menor legibilidade, desempenho ligeiramente inferior

### Metodo 5: Tratamento de multiplos valores maximos iguais

**Abordagem**: Se varios caracteres tem a mesma frequencia maxima, retornar um array ou o primeiro encontrado.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Calcular as aparicoes de cada caractere
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Encontrar todos os caracteres com frequencia igual ao maximo
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

### Questao 1: Implementacao basica

Implemente uma funcao que encontre o caractere mais frequente em uma string.

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

- Usar objeto ou Map para registrar a frequencia de cada caractere
- Atualizar o maximo durante a travessia
- Complexidade temporal O(n), complexidade espacial O(k)

</details>

### Questao 2: Versao otimizada

Otimize a funcao acima para tratar multiplos valores maximos iguais.

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

  // Fase 2: Encontrar todos os caracteres com frequencia maxima
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

### Questao 3: Implementacao com Map

Implemente esta funcao usando Map do ES6.

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

- **Map**: Mais adequado para pares chave-valor dinamicos, as chaves podem ser de qualquer tipo
- **Object**: Mais simples e intuitivo, adequado para chaves do tipo string

</details>

## 5. Best Practices

> Melhores praticas

### Praticas recomendadas

```javascript
// 1. Usar nomes de variaveis claros
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

// 3. Atualizar o maximo durante a travessia (uma unica travessia)
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
// 1. Nao usar duas travessias (a menos que necessario)
// ❌ Desempenho inferior
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Segunda travessia
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Nao esquecer de tratar strings vazias
// ❌ Pode retornar undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Com string vazia, maxChar e ''
}

// 3. Nao usar estilos funcionais excessivamente complexos (a menos que seja convencao da equipe)
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

### Referencia rapida

**Pontos de implementacao**:

1. Usar objeto ou Map para registrar a frequencia de cada caractere
2. Atualizar o maximo durante a travessia
3. Complexidade temporal O(n), complexidade espacial O(k)
4. Tratar casos limite (string vazia, maiusculas/minusculas, etc.)

**Direcoes de otimizacao**:

- Completar em uma unica travessia (contar e encontrar o maximo simultaneamente)
- Usar Map para cenarios complexos
- Tratar multiplos valores maximos iguais
- Considerar maiusculas/minusculas, espacos e outros casos especiais

### Exemplo de resposta em entrevista

**Q: Implemente uma funcao que encontre o caractere mais frequente em uma string.**

> "Eu usaria um objeto para registrar a frequencia de cada caractere e atualizaria o maximo durante a travessia da string. A implementacao concreta e: inicializar um objeto vazio charCount para armazenar caracteres e contagens, inicializar as variaveis maxCount e maxChar. Depois percorrer a string, para cada caractere, se nao estiver no objeto, inicializar em 0, depois incrementar a contagem. Se a contagem do caractere atual for maior que maxCount, atualizar maxCount e maxChar. Finalmente retornar maxChar. A complexidade temporal deste metodo e O(n) e a complexidade espacial e O(k), onde n e o comprimento da string e k e o numero de caracteres diferentes."

## Reference

- [MDN - String](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
