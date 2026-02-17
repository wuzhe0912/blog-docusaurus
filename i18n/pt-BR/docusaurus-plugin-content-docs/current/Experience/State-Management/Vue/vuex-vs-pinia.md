---
id: state-management-vue-vuex-vs-pinia
title: 'Comparacao entre Vuex e Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Comparacao das diferencas fundamentais entre Vuex e Pinia, incluindo design de API, suporte a TypeScript, modularizacao, e guia de migracao.

---

## 1. Eixo principal da resposta em entrevista

1. **Diferencas fundamentais**: Vuex requer mutations, Pinia nao; Pinia tem melhor suporte a TypeScript; a forma de modularizacao e diferente.
2. **Recomendacao de escolha**: Para novos projetos Vue 3, recomenda-se Pinia; para projetos Vue 2, use Vuex.
3. **Consideracoes de migracao**: Passos e pontos de atencao para migrar de Vuex para Pinia.

---

## 2. Visao geral das diferencas fundamentais

| Caracteristica      | Vuex                     | Pinia                      |
| ------------------- | ------------------------ | -------------------------- |
| **Versao do Vue**   | Vue 2                    | Vue 3                      |
| **Complexidade da API** | Mais complexa (requer mutations) | Mais simples (sem mutations) |
| **Suporte TypeScript** | Requer configuracao adicional | Suporte nativo completo    |
| **Modularizacao**   | Modulos aninhados        | Flat, cada store e independente |
| **Tamanho**         | Maior                    | Menor (aprox. 1KB)         |
| **Experiencia de desenvolvimento** | Boa          | Melhor (HMR, Devtools)     |

---

## 3. Comparacao de diferencas de API

### 3.1 Mutations vs Actions

**Vuex**: Requer `mutations` para modificar o state de forma sincrona

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});
```

**Pinia**: Nao requer `mutations`, modifica o state diretamente nas `actions`

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++; // Modificar diretamente
    },
  },
});
```

**Diferencas-chave**:
- **Vuex**: Deve modificar o state de forma sincrona atraves de `mutations`, `actions` chamam `mutations` via `commit`
- **Pinia**: Nao requer `mutations`, `actions` podem modificar o state diretamente (sincrona ou assincronamente)

### 3.2 Definicao do State

**Vuex**: `state` pode ser um objeto ou uma funcao

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **deve ser uma funcao**, para evitar compartilhamento de estado entre multiplas instancias

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: getters recebem `(state, getters)` como parametros

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**: getters podem usar `this` para acessar outros getters

```typescript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne(): number {
    return this.doubleCount + 1;
  },
}
```

### 3.4 Uso em componentes

**Vuex**: Usa funcoes auxiliares `mapState`, `mapGetters`, `mapActions`

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**: Usa a instancia da store diretamente, com `storeToRefs` para manter a reatividade

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Diferencas na modularizacao

### 4.1 Vuex Modules (modulos aninhados)

**Vuex**: Usa modulos aninhados, requer `namespaced: true`

```javascript
// stores/user.js
export default {
  namespaced: true,
  state: { name: 'John' },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
  },
};

// Uso em componentes
this.$store.dispatch('user/SET_NAME', 'Jane'); // Requer prefixo de namespace
```

### 4.2 Pinia Stores (flat)

**Pinia**: Cada store e independente, sem necessidade de aninhamento

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'John' }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});

// Uso em componentes
const userStore = useUserStore();
userStore.setName('Jane'); // Chamada direta, sem namespace
```

**Diferencas-chave**:
- **Vuex**: Requer modulos aninhados, usa `namespaced: true`, chamadas necessitam de prefixo de namespace
- **Pinia**: Cada store e independente, sem namespace, chamada direta

---

## 5. Diferencas no suporte a TypeScript

### 5.1 Suporte TypeScript do Vuex

**Vuex**: Requer configuracao adicional de tipos

```typescript
// stores/types.ts
export interface State {
  count: number;
  user: { name: string; age: number };
}

// stores/index.ts
import { createStore, Store } from 'vuex';
import { State } from './types';

export default createStore<State>({
  state: { count: 0, user: { name: 'John', age: 30 } },
});

// Uso em componentes
const store = useStore<State>();
// Requer definicao manual de tipos, sem inferencia de tipos completa
```

### 5.2 Suporte TypeScript do Pinia

**Pinia**: Suporte nativo completo, inferencia automatica de tipos

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // Inferencia automatica de tipos
  },
  actions: {
    increment() {
      this.count++; // Inferencia de tipos completa e autocompletar
    },
  },
});

// Uso em componentes
const store = useCounterStore();
store.count; // Inferencia de tipos completa
store.doubleCount; // Inferencia de tipos completa
store.increment(); // Inferencia de tipos completa
```

**Diferencas-chave**:
- **Vuex**: Requer definicao manual de tipos, inferencia de tipos incompleta
- **Pinia**: Suporte nativo completo, inferencia automatica de tipos, melhor experiencia de desenvolvimento

---

## 6. Guia de migracao

### 6.1 Passos basicos de migracao

1. **Instalar Pinia**

```bash
npm install pinia
```

2. **Substituir Vuex Store**

```javascript
// Vuex antigo
import { createStore } from 'vuex';
export default createStore({ ... });

// Pinia novo
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **Converter definicao da Store**

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

4. **Atualizar uso em componentes**

```javascript
// Vuex
import { mapState, mapActions } from 'vuex';
computed: { ...mapState(['count']) },
methods: { ...mapActions(['increment']) },

// Pinia
import { storeToRefs } from 'pinia';
const store = useCounterStore();
const { count } = storeToRefs(store);
const { increment } = store;
```

### 6.2 Problemas comuns de migracao

**Problema 1: Como lidar com Vuex modules?**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia: Cada modulo se torna uma store independente
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**Problema 2: Como lidar com namespaces?**

```javascript
// Vuex: Requer prefixo de namespace
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia: Chamada direta, sem namespace
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. Por que Pinia nao precisa de mutations?

**Razoes**:

1. **Sistema reativo do Vue 3**
   - Vue 3 usa Proxy, podendo rastrear diretamente as modificacoes de objetos
   - Nao precisa rastrear mudancas de estado atraves de mutations como no Vue 2

2. **Simplificacao da API**
   - Remover mutations simplifica a API e reduz o codigo boilerplate
   - Actions podem modificar o state diretamente, seja sincrona ou assincronamente

3. **Experiencia de desenvolvimento**
   - Reduz uma camada de abstracao, facilitando a compreensao e uso pelos desenvolvedores
   - Nao e necessario lembrar a diferenca entre `commit` e `dispatch`

**Exemplo**:

```typescript
// Vuex: Requer mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia: Modificacao direta
actions: { setCount(count) { this.count = count; } },
```

---

## 8. Como escolher entre Vuex e Pinia?

**Recomendacoes de escolha**:

1. **Novos projetos**
   - Projetos Vue 3: **Recomenda-se usar Pinia**
   - Projetos Vue 2: Use Vuex

2. **Projetos existentes**
   - Vue 2 + Vuex: Pode continuar usando Vuex, ou considerar upgrade para Vue 3 + Pinia
   - Vue 3 + Vuex: Pode considerar migrar para Pinia (mas nao e obrigatorio)

3. **Requisitos do projeto**
   - Precisa de suporte completo a TypeScript: **Escolha Pinia**
   - Precisa de API mais simples: **Escolha Pinia**
   - Equipe familiarizada com Vuex: Pode continuar usando Vuex

**Resumo**:
- Novos projetos Vue 3: **Fortemente recomendado Pinia**
- Projetos Vue 2: Use Vuex
- Projetos existentes Vue 3 + Vuex: Pode considerar migracao, mas nao e obrigatorio

---

## 9. Resumo dos pontos-chave para entrevista

### 9.1 Diferencas fundamentais

**Voce pode responder assim:**

> Vuex e Pinia sao ambas ferramentas de gerenciamento de estado do Vue, as principais diferencas incluem: 1) Complexidade da API: Vuex requer mutations para modificar o state de forma sincrona, Pinia nao requer mutations, actions podem modificar o state diretamente; 2) Suporte TypeScript: Vuex requer configuracao adicional, inferencia de tipos incompleta, Pinia tem suporte nativo completo, inferencia automatica de tipos; 3) Modularizacao: Vuex usa modulos aninhados, requer namespaced, Pinia cada store e independente, sem namespace; 4) Experiencia de desenvolvimento: Pinia e menor, suporta HMR, melhor suporte a Devtools; 5) Versao do Vue: Vuex e principalmente para Vue 2, Pinia e a recomendacao oficial do Vue 3. Para novos projetos Vue 3, eu recomendo usar Pinia.

**Pontos-chave:**
- Diferencas de complexidade de API
- Diferencas de suporte TypeScript
- Diferencas na forma de modularizacao
- Recomendacao de escolha

### 9.2 Por que Pinia nao precisa de mutations?

**Voce pode responder assim:**

> Pinia nao precisa de mutations por tres razoes principais: 1) Vue 3 usa Proxy como sistema reativo, podendo rastrear diretamente as modificacoes de objetos, sem necessidade de rastrear mudancas de estado atraves de mutations como no Vue 2; 2) Simplificacao da API, remover mutations reduz o codigo boilerplate, actions podem modificar o state diretamente, seja sincrona ou assincronamente; 3) Melhoria da experiencia de desenvolvimento, reduzindo uma camada de abstracao, facilitando a compreensao e uso pelos desenvolvedores, sem necessidade de lembrar a diferenca entre commit e dispatch.

**Pontos-chave:**
- Sistema reativo do Vue 3
- Simplificacao da API
- Melhoria da experiencia de desenvolvimento

---

## 10. Resumo da entrevista

**Voce pode responder assim:**

> As principais diferencas entre Vuex e Pinia estao no design da API, suporte a TypeScript e forma de modularizacao. Vuex requer mutations, Pinia nao; Pinia tem melhor suporte a TypeScript; Vuex usa modulos aninhados, Pinia usa design flat. Para novos projetos Vue 3, eu recomendo usar Pinia, pois oferece melhor experiencia de desenvolvimento e API mais simples. Se o projeto precisa migrar de Vuex para Pinia, os passos principais sao remover mutations, converter modules em stores independentes e atualizar o modo de uso nos componentes.

**Pontos-chave:**
- Resumo das diferencas fundamentais
- Recomendacao de escolha
- Guia de migracao
- Experiencia em projetos reais

## Reference

- [Documentacao oficial do Vuex](https://vuex.vuejs.org/)
- [Documentacao oficial do Pinia](https://pinia.vuejs.org/)
- [Migrar de Vuex para Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
