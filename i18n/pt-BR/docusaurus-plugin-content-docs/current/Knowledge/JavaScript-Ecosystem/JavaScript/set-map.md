---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> O que são Set e Map?

`Set` e `Map` são duas novas estruturas de dados introduzidas no ES6, oferecendo soluções mais adequadas para cenários específicos do que objetos e arrays tradicionais.

### Set (Conjunto)

**Definição**: `Set` é uma coleção de **valores únicos**, semelhante ao conceito de conjunto na matemática.

**Características**:

- Os valores armazenados **não se repetem**
- Usa `===` para determinar a igualdade dos valores
- Mantém a ordem de inserção
- Pode armazenar qualquer tipo de valor (tipos primitivos ou objetos)

**Uso básico**:

```javascript
// Criar um Set
const set = new Set();

// Adicionar valores
set.add(1);
set.add(2);
set.add(2); // Valores duplicados não são adicionados
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// Verificar se um valor existe
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// Deletar um valor
set.delete(2);
console.log(set.has(2)); // false

// Limpar o Set
set.clear();
console.log(set.size); // 0
```

**Criar Set a partir de um array**:

```javascript
// Remover valores duplicados de um array
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// Converter de volta para array
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// Forma abreviada
const uniqueArr2 = [...new Set(arr)];
```

### Map (Mapa)

**Definição**: `Map` é uma coleção de **pares chave-valor**, semelhante a um objeto, mas as chaves podem ser de qualquer tipo.

**Características**:

- As chaves podem ser de qualquer tipo (strings, números, objetos, funções, etc.)
- Mantém a ordem de inserção
- Tem a propriedade `size`
- A ordem de iteração corresponde à ordem de inserção

**Uso básico**:

```javascript
// Criar um Map
const map = new Map();

// Adicionar pares chave-valor
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// Obter valores
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// Verificar se uma chave existe
console.log(map.has('name')); // true

// Deletar um par chave-valor
map.delete('name');

// Obter o tamanho
console.log(map.size); // 3

// Limpar o Map
map.clear();
```

**Criar Map a partir de um array**:

```javascript
// Criar a partir de um array bidimensional
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// Criar a partir de um objeto
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Diferenças entre Set e Array

| Característica      | Set                    | Array                    |
| ------------------- | ---------------------- | ------------------------ |
| Valores duplicados  | Não permite            | Permite                  |
| Acesso por índice   | Não suporta            | Suporta                  |
| Performance de busca | O(1)                  | O(n)                     |
| Ordem de inserção   | Mantém                 | Mantém                   |
| Métodos comuns      | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Cenários de uso**:

```javascript
// ✅ Adequado para Set: valores únicos são necessários
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Adequado para Set: verificação rápida de existência
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('A página inicial já foi visitada');
}

// ✅ Adequado para Array: índices ou valores duplicados são necessários
const scores = [100, 95, 100, 90]; // Permite duplicados
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Diferenças entre Map e Object

| Característica      | Map                | Object                     |
| ------------------- | ------------------ | -------------------------- |
| Tipo de chave       | Qualquer tipo      | String ou Symbol           |
| Tamanho             | Propriedade `size` | Cálculo manual necessário  |
| Chaves padrão       | Nenhuma            | Tem cadeia de protótipos   |
| Ordem de iteração   | Ordem de inserção  | ES2015+ mantém ordem de inserção |
| Performance         | Mais rápido em adições/remoções frequentes | Mais rápido em casos gerais |
| JSON                | Não suporta diretamente | Suporte nativo          |

**Cenários de uso**:

```javascript
// ✅ Adequado para Map: as chaves não são strings
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Adequado para Map: adições/remoções frequentes necessárias
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Adequado para Object: estrutura estática, JSON necessário
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // Pode ser serializado diretamente
```

## 4. Common Interview Questions

> Perguntas comuns de entrevista

### Questão 1: Remover valores duplicados de um array

Implemente uma função que remova os valores duplicados de um array.

```javascript
function removeDuplicates(arr) {
  // Sua implementação
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Método 1: Usando Set (recomendado)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Método 2: Usando filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Método 3: Usando reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Comparação de performance**:

- Método Set: O(n), o mais rápido
- filter + indexOf: O(n²), mais lento
- reduce + includes: O(n²), mais lento

</details>

### Questão 2: Verificar se um array tem valores duplicados

Implemente uma função que verifique se um array contém valores duplicados.

```javascript
function hasDuplicates(arr) {
  // Sua implementação
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Método 1: Usando Set (recomendado)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Método 2: Usando o método has do Set**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Método 3: Usando indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Comparação de performance**:

- Método Set 1: O(n), o mais rápido
- Método Set 2: O(n), pode terminar mais cedo em média
- Método indexOf: O(n²), mais lento

</details>

### Questão 3: Contar a frequência dos elementos

Implemente uma função que conte quantas vezes cada elemento aparece em um array.

```javascript
function countOccurrences(arr) {
  // Sua implementação
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Método 1: Usando Map (recomendado)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Método 2: Usando reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Método 3: Converter para objeto**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Vantagens de usar Map**:

- As chaves podem ser de qualquer tipo (objetos, funções, etc.)
- Tem a propriedade `size`
- A ordem de iteração corresponde à ordem de inserção

</details>

### Questão 4: Encontrar a interseção de dois arrays

Implemente uma função que encontre a interseção (elementos comuns) de dois arrays.

```javascript
function intersection(arr1, arr2) {
  // Sua implementação
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Método 1: Usando Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Método 2: Usando filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Método 3: Usando filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Comparação de performance**:

- Método Set: O(n + m), o mais rápido
- filter + includes: O(n × m), mais lento

</details>

### Questão 5: Encontrar a diferença de dois arrays

Implemente uma função que encontre a diferença de dois arrays (elementos em arr1 que não estão em arr2).

```javascript
function difference(arr1, arr2) {
  // Sua implementação
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Método 1: Usando Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Método 2: Usando Set para deduplicar e depois filtrar**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Método 3: Usando includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Comparação de performance**:

- Método Set: O(n + m), o mais rápido
- Método includes: O(n × m), mais lento

</details>

### Questão 6: Implementar LRU Cache

Use Map para implementar um cache LRU (Least Recently Used).

```javascript
class LRUCache {
  constructor(capacity) {
    // Sua implementação
  }

  get(key) {
    // Sua implementação
  }

  put(key, value) {
    // Sua implementação
  }
}
```

<details>
<summary>Clique para ver a resposta</summary>

**Implementação**:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // Mover a chave para o final (indica uso recente)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // Se a chave já existe, deletar primeiro
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Se a capacidade está cheia, deletar a chave mais antiga (a primeira)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Adicionar par chave-valor (automaticamente colocado no final)
    this.cache.set(key, value);
  }
}

// Exemplo de uso
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // Remove a chave 2
console.log(cache.get(2)); // -1 (já foi removida)
console.log(cache.get(3)); // 'three'
```

**Explicação**:

- Map mantém a ordem de inserção, a primeira chave é a mais antiga
- No `get`, a chave é movida para o final para indicar uso recente
- No `put`, se a capacidade está cheia, a primeira chave é deletada

</details>

### Questão 7: Usar objetos como chaves de Map

Explique o resultado de saída do seguinte código.

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Clique para ver a resposta</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Explicação**:

- `obj1` e `obj2` têm o mesmo conteúdo, mas são **instâncias de objetos diferentes**
- Map usa **comparação por referência** (reference comparison), não comparação por valor
- Portanto, `obj1` e `obj2` são tratados como chaves diferentes
- Se um objeto comum é usado como Map, o objeto é convertido para a string `[object Object]`, fazendo com que todos os objetos se tornem a mesma chave

**Comparação com objetos comuns**:

```javascript
// Objeto comum: as chaves são convertidas para string
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (sobrescrito)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]'] (apenas uma chave)

// Map: mantém a referência do objeto
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet e WeakMap

> Diferenças entre WeakSet e WeakMap

### WeakSet

**Características**:

- Só pode armazenar **objetos** (não pode armazenar tipos primitivos)
- **Referência fraca**: se o objeto não tem outras referências, será coletado pelo garbage collector
- Não tem a propriedade `size`
- Não é iterável
- Não tem o método `clear`

**Cenário de uso**: Marcar objetos, evitar vazamentos de memória

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// Quando obj1 não tem outras referências, será coletado
// A referência no weakSet também será limpa automaticamente
```

### WeakMap

**Características**:

- As chaves só podem ser **objetos** (não podem ser tipos primitivos)
- **Referência fraca**: se o objeto chave não tem outras referências, será coletado pelo garbage collector
- Não tem a propriedade `size`
- Não é iterável
- Não tem o método `clear`

**Cenário de uso**: Armazenar dados privados de objetos, evitar vazamentos de memória

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// Quando obj1 não tem outras referências, será coletado
// O par chave-valor no weakMap também será limpo automaticamente
```

### Comparação WeakSet/WeakMap vs Set/Map

| Característica       | Set/Map              | WeakSet/WeakMap          |
| -------------------- | -------------------- | ------------------------ |
| Tipo de chave/valor  | Qualquer tipo        | Apenas objetos           |
| Referência fraca     | Não                  | Sim                      |
| Iterável             | Sim                  | Não                      |
| Propriedade size     | Sim                  | Não                      |
| Método clear         | Sim                  | Não                      |
| Garbage collection   | Não limpa automaticamente | Limpa automaticamente |

## 6. Best Practices

> Melhores práticas

### Práticas recomendadas

```javascript
// 1. Usar Set quando valores únicos são necessários
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Usar Set quando busca rápida é necessária
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // Permitir acesso
}

// 3. Usar Map quando as chaves não são strings
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Usar Map quando adições/remoções frequentes são necessárias
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Usar WeakMap para associar dados de objetos e evitar vazamentos de memória
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Práticas a evitar

```javascript
// 1. Não usar Set para substituir todas as funcionalidades de arrays
// ❌ Ruim: usar Set quando acesso por índice é necessário
const set = new Set([1, 2, 3]);
// set[0] // undefined, não é possível acessar por índice

// ✅ Bom: usar array quando acesso por índice é necessário
const arr = [1, 2, 3];
arr[0]; // 1

// 2. Não usar Map para substituir todas as funcionalidades de objetos
// ❌ Ruim: usar Map para estruturas estáticas simples
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ Bom: usar objeto para estruturas simples
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Não confundir Set e Map
// ❌ Erro: Set não tem pares chave-valor
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ Correto: Map tem pares chave-valor
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> Resumo de entrevista

### Memorização rápida

**Set (Conjunto)**:

- Valores únicos, sem duplicados
- Busca rápida: O(1)
- Adequado para: deduplicação, verificação rápida de existência

**Map (Mapa)**:

- Pares chave-valor, as chaves podem ser de qualquer tipo
- Mantém a ordem de inserção
- Adequado para: chaves não-string, adições/remoções frequentes

**WeakSet/WeakMap**:

- Referência fraca, garbage collection automático
- Chaves/valores apenas objetos
- Adequado para: evitar vazamentos de memória

### Exemplo de resposta em entrevista

**Q: Quando se deve usar Set em vez de um array?**

> "Deve-se usar Set quando é necessário garantir a unicidade dos valores ou verificar rapidamente se um valor existe. O método `has` do Set tem complexidade temporal O(1), enquanto o `includes` de um array é O(n). Por exemplo, ao remover valores duplicados de um array ou verificar permissões de usuário, Set é mais eficiente."

**Q: Qual é a diferença entre Map e Object?**

> "As chaves de Map podem ser de qualquer tipo, incluindo objetos, funções, etc., enquanto as chaves de um objeto só podem ser strings ou Symbols. Map tem a propriedade `size` para obter diretamente o tamanho, enquanto um objeto requer cálculo manual. Map mantém a ordem de inserção e não tem cadeia de protótipos, sendo adequado para armazenar dados puros. Quando é necessário usar objetos como chaves ou são necessárias adições/remoções frequentes, Map é a melhor escolha."

**Q: Qual é a diferença entre WeakMap e Map?**

> "As chaves de WeakMap só podem ser objetos e usam referências fracas. Quando o objeto chave não tem outras referências, a entrada correspondente no WeakMap será automaticamente coletada pelo garbage collector, evitando vazamentos de memória. WeakMap não é iterável e não tem a propriedade `size`. É adequado para armazenar dados privados ou metadados de objetos; quando o objeto é destruído, os dados relacionados também são limpos automaticamente."

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
