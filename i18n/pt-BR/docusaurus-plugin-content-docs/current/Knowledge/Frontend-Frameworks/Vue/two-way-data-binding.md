---
id: vue-two-way-data-binding
title: '[Hard] Ligacao Bidirecional de Dados'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Explique o principio subjacente de como Vue2 e Vue3 implementam a ligacao bidirecional

Para entender a ligacao bidirecional do Vue, e necessario primeiro compreender o mecanismo do sistema reativo e as diferencas de implementacao entre Vue2 e Vue3.

### Implementacao do Vue2

O Vue2 usa `Object.defineProperty` para implementar a ligacao bidirecional. Este metodo pode transformar propriedades de um objeto em `getter` e `setter`, permitindo monitorar mudancas nas propriedades.

#### 1. Data Hijacking (Sequestro de Dados)

No Vue2, quando um objeto de dados de um componente e criado, o Vue percorre todas as propriedades do objeto e usa `Object.defineProperty` para converte-las em `getter` e `setter`, permitindo rastrear leituras e modificacoes dos dados.

#### 2. Dependency Collection (Coleta de Dependencias)

Sempre que a funcao de renderizacao do componente e executada, ela le propriedades do data, acionando o `getter`. O Vue registra essas dependencias para notificar os componentes que dependem desses dados quando houver mudancas.

#### 3. Dispatching Updates (Despacho de Atualizacoes)

Quando os dados sao modificados, o `setter` e acionado, e o Vue notifica todos os componentes que dependem desses dados para re-executar a funcao de renderizacao e atualizar o DOM.

#### Exemplo de Codigo Vue2

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

#### Limitacoes do Vue2

- **Nao detecta adicao ou remocao de propriedades de objetos**: Necessita usar `Vue.set()` ou `Vue.delete()`
- **Nao detecta mudancas por indice em arrays**: Necessita usar metodos de array do Vue (como `push`, `pop`, etc.)
- **Problema de performance**: Precisa percorrer recursivamente todas as propriedades

### Implementacao do Vue3

O Vue3 introduziu o `Proxy` do ES6, que pode envolver um objeto em um proxy e monitorar mudancas nas propriedades com performance otimizada.

#### 1. Data Hijacking com Proxy

O Vue3 usa `new Proxy` para criar um proxy dos dados, em vez de definir `getter` e `setter` individualmente para cada propriedade, permitindo rastrear mudancas de forma mais granular e interceptar mais tipos de operacoes.

#### 2. Rastreamento de Dependencias Mais Eficiente

Com Proxy, o Vue3 rastreia dependencias de forma mais eficiente, pois nao precisa pre-definir `getter/setter`, e o Proxy pode interceptar ate 13 tipos de operacoes (como `get`, `set`, `has`, `deleteProperty`, etc.).

#### 3. Re-renderizacao Minimizada Automatica

Quando os dados mudam, o Vue3 pode determinar com mais precisao qual parte da UI precisa ser atualizada.

#### Exemplo de Codigo Vue3

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

| Caracteristica | Vue2 | Vue3 |
| --- | --- | --- |
| Implementacao | `Object.defineProperty` | `Proxy` |
| Detectar novas propriedades | Necessita `Vue.set()` | Suporte nativo |
| Detectar exclusao de propriedades | Necessita `Vue.delete()` | Suporte nativo |
| Detectar indice de array | Necessita metodos especificos | Suporte nativo |
| Performance | Percorre recursivamente todas as propriedades | Processamento lazy, melhor performance |
| Suporte a navegadores | IE9+ | Nao suporta IE11 |

### Conclusao

O Vue2 usa `Object.defineProperty` para implementar a ligacao bidirecional, mas este metodo tem certas limitacoes. O Vue3 introduziu o `Proxy` do ES6, fornecendo um sistema reativo mais poderoso e flexivel, com melhor performance.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Por que o Vue3 usa `Proxy` em vez de `Object.defineProperty`?

### Principais Razoes

#### 1. Capacidade de Interceptacao Mais Poderosa

`Proxy` pode interceptar ate 13 tipos de operacoes, enquanto `Object.defineProperty` so pode interceptar leitura e escrita de propriedades.

#### 2. Suporte Nativo a Monitoramento de Indice de Array

```js
// Vue2 nao detecta
const arr = [1, 2, 3];
arr[0] = 10; // Nao aciona atualizacao

// Vue3 detecta
const arr = reactive([1, 2, 3]);
arr[0] = 10; // Aciona atualizacao
```

#### 3. Suporte Nativo a Adicao/Exclusao Dinamica de Propriedades

```js
// Vue2 precisa tratamento especial
Vue.set(obj, 'newKey', 'value');

// Vue3 suporte nativo
const obj = reactive({});
obj.newKey = 'value'; // Aciona atualizacao
delete obj.newKey; // Tambem aciona atualizacao
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
  return new Proxy(obj, handler); // Sem recursao necessaria
}
```

### Por que o Vue2 Nao Usou Proxy?

Principalmente por **compatibilidade de navegadores**: quando o Vue2 foi lancado (2016), Proxy ainda nao era amplamente suportado e nao pode ser polyfilled. O Vue3 abandonou o suporte ao IE11, permitindo o uso de Proxy.

### Resumo

O Vue3 usa `Proxy` para: 1) Suporte reativo mais completo; 2) Melhor performance; 3) Codigo mais simples; 4) Melhor experiencia de desenvolvimento. O unico custo e abandonar o suporte a navegadores antigos (IE11).

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
