---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> O que é Deep Clone?

**Deep Clone (Copia profunda)** refere-se a criar um novo objeto e copiar recursivamente todas as propriedades do objeto original e todos os seus objetos e arrays aninhados. O objeto resultante do Deep Clone é completamente independente do original -- modificar um não afeta o outro.

### Copia superficial vs Copia profunda

**Shallow Clone (Copia superficial)**: Copia apenas as propriedades do primeiro nível do objeto; objetos aninhados ainda compartilham a mesma referência.

```javascript
// Exemplo de copia superficial
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ O objeto original tambem foi modificado
```

**Deep Clone (Copia profunda)**: Copia recursivamente todas as camadas de propriedades, completamente independente.

```javascript
// Exemplo de copia profunda
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ O objeto original nao e afetado
```

## 2. Implementation Methods

> Metodos de implementação

### Método 1: Usando JSON.parse e JSON.stringify

**Vantagens**: Simples e rápido
**Desvantagens**: Não consegue lidar com funções, undefined, Symbol, Date, RegExp, Map, Set e outros tipos especiais

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Teste
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Limitações**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date se torna objeto vazio
console.log(cloned.func); // undefined ❌ Funcao e perdida
console.log(cloned.undefined); // undefined ✅ Mas JSON.stringify o remove
console.log(cloned.symbol); // undefined ❌ Symbol e perdido
console.log(cloned.regex); // {} ❌ RegExp se torna objeto vazio
```

### Método 2: Implementação recursiva (tratamento de tipos básicos e objetos)

```javascript
function deepClone(obj) {
  // Tratamento de null e tipos básicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Tratamento de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Tratamento de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Tratamento de arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Tratamento de objetos
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Teste
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Nao afetado
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Método 3: Implementação completa (tratamento de Map, Set, Symbol, etc.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Tratamento de null e tipos básicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Tratamento de referências circulares
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Tratamento de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Tratamento de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Tratamento de Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Tratamento de Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Tratamento de arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Tratamento de objetos
  const cloned = {};
  map.set(obj, cloned);

  // Tratamento de propriedades Symbol
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copiar propriedades normais
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copiar propriedades Symbol
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Teste
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Método 4: Tratamento de referências circulares

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Tratamento de null e tipos básicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Tratamento de referências circulares
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Tratamento de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Tratamento de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Tratamento de arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Tratamento de objetos
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Teste de referências circulares
const original = {
  name: 'John',
};
original.self = original; // Referencia circular

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Referencia circular tratada corretamente
console.log(cloned !== original); // true ✅ Sao objetos diferentes
```

## 3. Common Interview Questions

> Perguntas frequentes em entrevistas

### Questão 1: Implementação básica de Deep Clone

Implemente uma função `deepClone` que possa copiar profundamente objetos e arrays.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function deepClone(obj) {
  // Tratamento de null e tipos básicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Tratamento de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Tratamento de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Tratamento de arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Tratamento de objetos
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Teste
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Questão 2: Tratamento de referências circulares

Implemente uma função `deepClone` que possa tratar referências circulares.

<details>
<summary>Clique para ver a resposta</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Tratamento de null e tipos básicos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Tratamento de referências circulares
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Tratamento de Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Tratamento de RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Tratamento de arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Tratamento de objetos
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Teste de referências circulares
const original = {
  name: 'John',
};
original.self = original; // Referencia circular

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Pontos-chave**:

- Usar `WeakMap` para rastrear objetos já processados
- Antes de criar um novo objeto, verificar se já existe no map
- Se existir, retornar diretamente a referência do map para evitar recursão infinita

</details>

### Questão 3: Limitações de JSON.parse e JSON.stringify

Explique as limitações do uso de `JSON.parse(JSON.stringify())` para Deep Clone e forneca soluções.

<details>
<summary>Clique para ver a resposta</summary>

**Limitações**:

1. **Não consegue lidar com funções**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Não consegue lidar com undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (mas a propriedade e removida) ❌
   ```

3. **Não consegue lidar com Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Propriedade Symbol e perdida
   ```

4. **Date se torna string**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Se torna string
   ```

5. **RegExp se torna objeto vazio**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Se torna objeto vazio
   ```

6. **Não consegue lidar com Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Se torna objeto vazio
   ```

7. **Não consegue lidar com referências circulares**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Erro: Converting circular structure to JSON
   ```

**Solução**: Usar uma implementação recursiva com tratamento especial para diferentes tipos.

</details>

## 4. Best Practices

> Melhores práticas

### Praticas recomendadas

```javascript
// 1. Escolher o método adequado de acordo com os requisitos
// Se apenas objetos básicos e arrays precisam ser tratados, usar uma implementação recursiva simples
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. Se tipos complexos precisam ser tratados, usar a implementação completa
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Implementação completa
}

// 3. Usar WeakMap para tratar referências circulares
// WeakMap não impede a coleta de lixo, adequado para rastrear referências de objetos
```

### Praticas a evitar

```javascript
// 1. Não abusar de JSON.parse(JSON.stringify())
// ❌ Funcoes, Symbol, Date e outros tipos especiais são perdidos
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Não esquecer de tratar referências circulares
// ❌ Causa estouro de pilha
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Recursao infinita
  }
  return cloned;
}

// 3. Não esquecer de tratar Date, RegExp e outros tipos especiais
// ❌ Esses tipos requerem tratamento especial
```

## 5. Interview Summary

> Resumo para entrevistas

### Referencia rápida

**Deep Clone**:

- **Definicao**: Copiar recursivamente um objeto e todas as suas propriedades aninhadas, completamente independente
- **Metodos**: Implementação recursiva, JSON.parse(JSON.stringify()), structuredClone()
- **Pontos-chave**: Tratamento de tipos especiais, referências circulares, propriedades Symbol

**Pontos de implementação**:

1. Tratar tipos básicos e null
2. Tratar Date, RegExp e outros objetos especiais
3. Tratar arrays e objetos
4. Tratar referências circulares (usando WeakMap)
5. Tratar propriedades Symbol

### Exemplo de resposta em entrevista

**Q: Por favor, implemente uma função Deep Clone.**

> "Deep Clone significa criar um novo objeto completamente independente, copiando recursivamente todas as propriedades aninhadas. Minha implementação primeiro trata os tipos básicos e null, depois realiza um tratamento especial para diferentes tipos como Date, RegExp, arrays e objetos. Para tratar referências circulares, uso um WeakMap para rastrear objetos já processados. Para propriedades Symbol, uso Object.getOwnPropertySymbols para obte-las e copia-las. Isso garante que o objeto copiado profundamente seja completamente independente do objeto original, e que modificar um não afete o outro."

**Q: Quais são as limitações de JSON.parse(JSON.stringify())?**

> "As principais limitações deste método incluem: 1) Não consegue lidar com funções, que são removidas; 2) Não consegue lidar com undefined e Symbol, essas propriedades são ignoradas; 3) Objetos Date se tornam strings; 4) RegExp se torna objeto vazio; 5) Não consegue lidar com Map, Set e outras estruturas de dados especiais; 6) Não consegue lidar com referências circulares, causando erro. Se esses casos especiais precisam ser tratados, deve-se usar uma implementação recursiva."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/pt-BR/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
