---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Descrição do problema

Implementar funções de análise de caminho de objeto, capazes de obter e definir valores de objetos aninhados com base em uma string de caminho.

### Requisitos

1. **Função `get`**: Obter o valor de um objeto com base no caminho

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Função `set`**: Definir o valor de um objeto com base no caminho

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Implementação da função get

### Método 1: Usando split e reduce

**Ideia**: Dividir a string de caminho em um array, depois usar `reduce` para acessar o objeto camada por camada.

```javascript
function get(obj, path, defaultValue) {
  // Tratar casos extremos
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Dividir a string de caminho em array
  const keys = path.split('.');

  // Usar reduce para acessar camada por camada
  const result = keys.reduce((current, key) => {
    // Se o valor atual for null ou undefined, retornar undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // Se o resultado for undefined, retornar o valor padrão
  return result !== undefined ? result : defaultValue;
}

// Teste
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined（necessita tratamento de índices de array）
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Método 2: Suporte a índices de array

**Ideia**: Tratar índices de array no caminho, como `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Expressão regular: nomes de propriedade ou índices de array
  // Corresponde a 'a', 'b', '[0]', 'c' etc.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Tratar índice de array [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Teste
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Método 3: Implementação completa (tratamento de casos extremos)

```javascript
function get(obj, path, defaultValue) {
  // Tratar casos extremos
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Analisar o caminho: suporte aos formatos 'a.b.c' e 'a.b[0].c'
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Se o valor atual for null ou undefined, retornar o valor padrão
    if (result == null) {
      return defaultValue;
    }

    // Tratar índice de array
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Teste
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj（caminho vazio retorna o objeto original）
```

## 3. Implementation: set Function

> Implementação da função set

### Método 1: Implementação básica

**Ideia**: Criar uma estrutura de objetos aninhados com base no caminho e depois definir o valor.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Analisar o caminho
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Criar a estrutura aninhada
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Tratar índice de array
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // Se a chave não existe ou não é um objeto, criar um novo objeto
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Definir o valor da última chave
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // Se não for um array, precisa converter
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Teste
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Método 2: Implementação completa (tratamento de arrays e objetos)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Percorrer até a penúltima chave, criando a estrutura aninhada
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Tratar índice de array
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // Garantir que é um array
      if (!Array.isArray(current)) {
        // Converter objeto em array (preservar índices existentes)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // Garantir que o índice existe
      if (current[index] == null) {
        // Determinar se a próxima chave é um array ou objeto
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Tratar chaves de objeto
      if (current[key] == null) {
        // Determinar se a próxima chave é um array ou objeto
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // Se já existe mas não é um objeto, precisa converter
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Definir o valor da última chave
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Teste
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Método 3: Versão simplificada (apenas objetos, sem índices de array)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Criar a estrutura aninhada (exceto a última chave)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Definir o valor da última chave
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Teste
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Questão 1: Implementação básica da função get

Implemente uma função `get` que obtém o valor de um objeto aninhado com base em uma string de caminho.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// Teste
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Pontos-chave**:

- Tratar casos de null/undefined
- Usar split para dividir o caminho
- Acessar as propriedades do objeto camada por camada
- Retornar o valor padrão quando o caminho não existe

</details>

### Questão 2: Função get com suporte a índices de array

Estenda a função `get` para suportar índices de array, como `'a.b[0].c'`.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Usar expressão regular para analisar o caminho
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Tratar índice de array
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Teste
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Pontos-chave**:

- Usar a expressão regular `/[^.[\]]+|\[(\d+)\]/g` para analisar o caminho
- Tratar índices de array no formato `[0]`
- Converter índices string em números

</details>

### Questão 3: Implementação da função set

Implemente uma função `set` que define o valor de um objeto aninhado com base em uma string de caminho.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Criar a estrutura aninhada (exceto a última chave)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Definir o valor da última chave
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Teste
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Pontos-chave**:

- Criar camada por camada a estrutura de objetos aninhados
- Garantir que os objetos intermediários do caminho existam
- Definir o valor alvo no final

</details>

### Questão 4: Implementação completa de get e set

Implemente as funções `get` e `set` completas, com suporte a índices de array e tratamento de todos os casos extremos.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// Função get
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Função set
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Criar a estrutura aninhada
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Definir o valor
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Teste
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> Boas práticas

### Práticas recomendadas

```javascript
// 1. Tratar casos extremos
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Usar expressões regulares para analisar caminhos complexos
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Determinar o tipo da próxima chave no set
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Usar nullish coalescing para tratar valores padrão
return result ?? defaultValue;
```

### Práticas a evitar

```javascript
// 1. ❌ Não esquecer de tratar null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // Pode causar erro
}

// 2. ❌ Não modificar diretamente o objeto original (a menos que explicitamente solicitado)
function set(obj, path, value) {
  // Deveria retornar o objeto modificado, não modificá-lo diretamente
}

// 3. ❌ Não ignorar a diferença entre arrays e objetos
// É necessário determinar se a próxima chave é um índice de array ou uma chave de objeto
```

## 6. Interview Summary

> Resumo de entrevista

### Memorização rápida

**Análise de caminho de objeto**:

- **Função get**: Obter valor pelo caminho, tratar null/undefined, suportar valores padrão
- **Função set**: Definir valor pelo caminho, criar automaticamente a estrutura aninhada
- **Análise de caminho**: Usar expressões regulares para tratar os formatos `'a.b.c'` e `'a.b[0].c'`
- **Tratamento de casos extremos**: Tratar null, undefined, string vazia, etc.

**Pontos-chave da implementação**:

1. Análise de caminho: `split('.')` ou expressões regulares
2. Acesso camada por camada: usar loop ou `reduce`
3. Tratamento de casos extremos: verificar null/undefined
4. Suporte a arrays: tratar índices no formato `[0]`

### Exemplo de resposta em entrevista

**Q: Implemente uma função que obtém o valor de um objeto com base em um caminho.**

> "Eu implementaria uma função `get` que aceita um objeto, uma string de caminho e um valor padrão. Primeiro, trato os casos extremos: se o objeto for null ou o caminho não for uma string, retorno o valor padrão. Em seguida, uso `split('.')` para dividir o caminho em um array de chaves e uso um loop para acessar camada por camada as propriedades do objeto. Em cada acesso, verifico se o valor atual é null ou undefined e, se for, retorno o valor padrão. Por fim, se o resultado for undefined, retorno o valor padrão; caso contrário, retorno o resultado. Se for necessário suportar índices de array, posso usar a expressão regular `/[^.[\]]+|\[(\d+)\]/g` para analisar o caminho e tratar os índices no formato `[0]`."

**Q: Como implementar uma função que define o valor de um objeto com base em um caminho?**

> "Eu implementaria uma função `set` que aceita um objeto, uma string de caminho e um valor. Primeiro, analiso o caminho em um array de chaves, depois percorro até a penúltima chave, criando camada por camada a estrutura de objetos aninhados. Para cada chave intermediária, se não existir ou não for um objeto, crio um novo objeto. Se a próxima chave estiver no formato de índice de array, crio um array. Por fim, defino o valor da última chave. Isso garante que todos os objetos intermediários do caminho existam e, então, define corretamente o valor alvo."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
