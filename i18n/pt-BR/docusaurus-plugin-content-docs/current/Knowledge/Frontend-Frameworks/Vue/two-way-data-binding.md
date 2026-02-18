---
id: vue-two-way-data-binding
title: '[Hard] Ligação Bidirecional de Dados'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Explique o princípio subjacente de como Vue2 e Vue3 implementam a ligação bidirecional

Para entender a ligação bidirecional do Vue, é necessário primeiro compreender o mecanismo do sistema reativo é as diferenças de implementação entre Vue2 e Vue3.

### Implementação do Vue2

O Vue2 usa `Object.defineProperty` para implementar a ligação bidirecional. Este método pode transformar propriedades de um objeto em `getter` e `setter`, permitindo monitorar mudanças nas propriedades.

#### 1. Data Hijacking (Sequestro de Dados)

No Vue2, quando um objeto de dados de um componente é criado, o Vue percorre todas as propriedades do objeto e usa `Object.defineProperty` para convertê-las em `getter` e `setter`, permitindo rastrear leituras e modificações dos dados.

#### 2. Dependency Collection (Coleta de Dependências)

Sempre que a função de renderização do componente é executada, ela lê propriedades do data, acionando o `getter`. O Vue registra essas dependências para notificar os componentes que dependem desses dados quando houver mudanças.

#### 3. Dispatching Updates (Despacho de Atualizações)

Quando os dados são modificados, o `setter` é acionado, é o Vue notifica todos os componentes que dependem desses dados para re-executar a função de renderização e atualizar o DOM.

#### Exemplo de Código Vue2

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // Aciona getter, imprime "get name: Pitt"
data.name = 'Vue2 Reactivity'; // Aciona setter, imprime "set name: Vue2 Reactivity"
```

#### Limitações do Vue2

- **Não detecta adição ou remoção de propriedades de objetos**: Necessita usar `Vue.set()` ou `Vue.delete()`
- **Não detecta mudanças por índice em arrays**: Necessita usar métodos de array do Vue (como `push`, `pop`, etc.)
- **Problema de performance**: Precisa percorrer recursivamente todas as propriedades

### Implementação do Vue3

O Vue3 introduziu o `Proxy` do ES6, que pode envolver um objeto em um proxy e monitorar mudanças nas propriedades com performance otimizada.

#### 1. Data Hijacking com Proxy

O Vue3 usa `new Proxy` para criar um proxy dos dados, em vez de definir `getter` e `setter` individualmente para cada propriedade, permitindo rastrear mudanças de forma mais granular e interceptar mais tipos de operações.

#### 2. Rastreamento de Dependências Mais Eficiente

Com Proxy, o Vue3 rastreia dependências de forma mais eficiente, pois não precisa pré-definir `getter/setter`, é o Proxy pode interceptar até 13 tipos de operações (como `get`, `set`, `has`, `deleteProperty`, etc.).

#### 3. Re-renderização Minimizada Automática

Quando os dados mudam, o Vue3 pode determinar com mais precisão qual parte da UI precisa ser atualizada.

#### Exemplo de Código Vue3

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`Obtendo ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`Definindo ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // Aciona get do Proxy
data.name = 'Vue 3 Reactivity'; // Aciona set do Proxy
```

### Tabela Comparativa Vue2 vs Vue3

| Característica | Vue2 | Vue3 |
| --- | --- | --- |
| Implementação | `Object.defineProperty` | `Proxy` |
| Detectar novas propriedades | Necessita `Vue.set()` | Suporte nativo |
| Detectar exclusão de propriedades | Necessita `Vue.delete()` | Suporte nativo |
| Detectar índice de array | Necessita métodos específicos | Suporte nativo |
| Performance | Percorre recursivamente todas as propriedades | Processamento lazy, melhor performance |
| Suporte a navegadores | IE9+ | Não suporta IE11 |

### Conclusão

O Vue2 usa `Object.defineProperty` para implementar a ligação bidirecional, mas este método tem certas limitações. O Vue3 introduziu o `Proxy` do ES6, fornecendo um sistema reativo mais poderoso e flexível, com melhor performance.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Por que o Vue3 usa `Proxy` em vez de `Object.defineProperty`?

### Principais Razões

#### 1. Capacidade de Interceptação Mais Poderosa

`Proxy` pode interceptar até 13 tipos de operações, enquanto `Object.defineProperty` só pode interceptar leitura e escrita de propriedades.

#### 2. Suporte Nativo a Monitoramento de Índice de Array

```js
// Vue2 não detecta
const arr = [1, 2, 3];
arr[0] = 10; // Não aciona atualização

// Vue3 detecta
const arr = reactive([1, 2, 3]);
arr[0] = 10; // Aciona atualização
```

#### 3. Suporte Nativo a Adição/Exclusão Dinâmica de Propriedades

```js
// Vue2 precisa tratamento especial
Vue.set(obj, 'newKey', 'value');

// Vue3 suporte nativo
const obj = reactive({});
obj.newKey = 'value'; // Aciona atualização
delete obj.newKey; // Também aciona atualização
```

#### 4. Melhor Performance

```js
// Vue2: precisa percorrer recursivamente todas as propriedades
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: processamento lazy, proxy apenas quando acessado
function reactive(obj) {
  return new Proxy(obj, handler); // Sem recursão necessária
}
```

### Por que o Vue2 Não Usou Proxy?

Principalmente por **compatibilidade de navegadores**: quando o Vue2 foi lançado (2016), Proxy ainda não era amplamente suportado e não pode ser polyfilled. O Vue3 abandonou o suporte ao IE11, permitindo o uso de Proxy.

### Resumo

O Vue3 usa `Proxy` para: 1) Suporte reativo mais completo; 2) Melhor performance; 3) Código mais simples; 4) Melhor experiência de desenvolvimento. O único custo é abandonar o suporte a navegadores antigos (IE11).

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
