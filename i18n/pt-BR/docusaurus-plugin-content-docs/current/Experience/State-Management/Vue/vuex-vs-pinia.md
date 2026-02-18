---
id: state-management-vue-vuex-vs-pinia
title: 'Comparação entre Vuex e Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> Comparação das diferenças fundamentais entre Vuex e Pinia, incluindo design de API, suporte a TypeScript, modularização, e guia de migração.

---

## 1. Eixo principal da resposta em entrevista

1. **Diferencas fundamentais**: Vuex requer mutations, Pinia não; Pinia tem melhor suporte a TypeScript; a forma de modularização e diferente.
2. **Recomendação de escolha**: Para novos projetos Vue 3, recomenda-se Pinia; para projetos Vue 2, use Vuex.
3. **Consideracoes de migração**: Passos e pontos de atenção para migrar de Vuex para Pinia.

---

## 2. Visão geral das diferenças fundamentais

| Característica      | Vuex                     | Pinia                      |
| ------------------- | ------------------------ | -------------------------- |
| **Versao do Vue**   | Vue 2                    | Vue 3                      |
| **Complexidade da API** | Mais complexa (requer mutations) | Mais simples (sem mutations) |
| **Suporte TypeScript** | Requer configuração adicional | Suporte nativo completo    |
| **Modularizacao**   | Módulos aninhados        | Flat, cada store e independente |
| **Tamanho**         | Maior                    | Menor (aprox. 1KB)         |
| **Experiência de desenvolvimento** | Boa          | Melhor (HMR, Devtools)     |

---

## 3. Comparação de diferenças de API

### 3.1 Mutations vs Actions

**Vuex**: Requer `mutations` para modificar o state de forma síncrona

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

**Pinia**: Não requer `mutations`, modifica o state diretamente nas `actions`

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
- **Vuex**: Deve modificar o state de forma síncrona através de `mutations`, `actions` chamam `mutations` via `commit`
- **Pinia**: Não requer `mutations`, `actions` podem modificar o state diretamente (síncrona ou assincronamente)

### 3.2 Definicao do State

**Vuex**: `state` pode ser um objeto ou uma função

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **deve ser uma função**, para evitar compartilhamento de estado entre múltiplas instâncias

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: getters recebem `(state, getters)` como parâmetros

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

**Vuex**: Usa funções auxiliares `mapState`, `mapGetters`, `mapActions`

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**: Usa a instância da store diretamente, com `storeToRefs` para manter a reatividade

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Diferencas na modularização

### 4.1 Vuex Modules (módulos aninhados)

**Vuex**: Usa módulos aninhados, requer `namespaced: true`

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
- **Vuex**: Requer módulos aninhados, usa `namespaced: true`, chamadas necessitam de prefixo de namespace
- **Pinia**: Cada store e independente, sem namespace, chamada direta

---

## 5. Diferencas no suporte a TypeScript

### 5.1 Suporte TypeScript do Vuex

**Vuex**: Requer configuração adicional de tipos

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
// Requer definição manual de tipos, sem inferência de tipos completa
```

### 5.2 Suporte TypeScript do Pinia

**Pinia**: Suporte nativo completo, inferência automática de tipos

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
- **Vuex**: Requer definição manual de tipos, inferência de tipos incompleta
- **Pinia**: Suporte nativo completo, inferência automática de tipos, melhor experiência de desenvolvimento

---

## 6. Guia de migração

### 6.1 Passos básicos de migração

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

3. **Converter definição da Store**

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

### 6.2 Problemas comuns de migração

**Problema 1: Como lidar com Vuex modules?**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia: Cada módulo se torna uma store independente
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

## 7. Por que Pinia não precisa de mutations?

**Razoes**:

1. **Sistema reativo do Vue 3**
   - Vue 3 usa Proxy, podendo rastrear diretamente as modificacoes de objetos
   - Não precisa rastrear mudancas de estado através de mutations como no Vue 2

2. **Simplificacao da API**
   - Remover mutations simplifica a API e reduz o código boilerplate
   - Actions podem modificar o state diretamente, seja síncrona ou assincronamente

3. **Experiência de desenvolvimento**
   - Reduz uma camada de abstração, facilitando a compreensão e uso pelos desenvolvedores
   - Não é necessário lembrar a diferença entre `commit` e `dispatch`

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

**Recomendações de escolha**:

1. **Novos projetos**
   - Projetos Vue 3: **Recomenda-se usar Pinia**
   - Projetos Vue 2: Use Vuex

2. **Projetos existentes**
   - Vue 2 + Vuex: Pode continuar usando Vuex, ou considerar upgrade para Vue 3 + Pinia
   - Vue 3 + Vuex: Pode considerar migrar para Pinia (mas não é obrigatório)

3. **Requisitos do projeto**
   - Precisa de suporte completo a TypeScript: **Escolha Pinia**
   - Precisa de API mais simples: **Escolha Pinia**
   - Equipe familiarizada com Vuex: Pode continuar usando Vuex

**Resumo**:
- Novos projetos Vue 3: **Fortemente recomendado Pinia**
- Projetos Vue 2: Use Vuex
- Projetos existentes Vue 3 + Vuex: Pode considerar migração, mas não é obrigatório

---

## 9. Resumo dos pontos-chave para entrevista

### 9.1 Diferencas fundamentais

**Você pode responder assim:**

> Vuex e Pinia são ambas ferramentas de gerenciamento de estado do Vue, as principais diferenças incluem: 1) Complexidade da API: Vuex requer mutations para modificar o state de forma síncrona, Pinia não requer mutations, actions podem modificar o state diretamente; 2) Suporte TypeScript: Vuex requer configuração adicional, inferência de tipos incompleta, Pinia tem suporte nativo completo, inferência automática de tipos; 3) Modularizacao: Vuex usa módulos aninhados, requer namespaced, Pinia cada store e independente, sem namespace; 4) Experiência de desenvolvimento: Pinia é menor, suporta HMR, melhor suporte a Devtools; 5) Versao do Vue: Vuex é principalmente para Vue 2, Pinia é a recomendação oficial do Vue 3. Para novos projetos Vue 3, eu recomendo usar Pinia.

**Pontos-chave:**
- Diferencas de complexidade de API
- Diferencas de suporte TypeScript
- Diferencas na forma de modularização
- Recomendação de escolha

### 9.2 Por que Pinia não precisa de mutations?

**Você pode responder assim:**

> Pinia não precisa de mutations por três razoes principais: 1) Vue 3 usa Proxy como sistema reativo, podendo rastrear diretamente as modificacoes de objetos, sem necessidade de rastrear mudancas de estado através de mutations como no Vue 2; 2) Simplificacao da API, remover mutations reduz o código boilerplate, actions podem modificar o state diretamente, seja síncrona ou assincronamente; 3) Melhoria da experiência de desenvolvimento, reduzindo uma camada de abstração, facilitando a compreensão e uso pelos desenvolvedores, sem necessidade de lembrar a diferença entre commit e dispatch.

**Pontos-chave:**
- Sistema reativo do Vue 3
- Simplificacao da API
- Melhoria da experiência de desenvolvimento

---

## 10. Resumo da entrevista

**Você pode responder assim:**

> As principais diferenças entre Vuex e Pinia estão no design da API, suporte a TypeScript e forma de modularização. Vuex requer mutations, Pinia não; Pinia tem melhor suporte a TypeScript; Vuex usa módulos aninhados, Pinia usa design flat. Para novos projetos Vue 3, eu recomendo usar Pinia, pois oferece melhor experiência de desenvolvimento e API mais simples. Se o projeto precisa migrar de Vuex para Pinia, os passos principais são remover mutations, converter modules em stores independentes e atualizar o modo de uso nos componentes.

**Pontos-chave:**
- Resumo das diferenças fundamentais
- Recomendação de escolha
- Guia de migração
- Experiência em projetos reais

## Reference

- [Documentacao oficial do Vuex](https://vuex.vuejs.org/)
- [Documentacao oficial do Pinia](https://pinia.vuejs.org/)
- [Migrar de Vuex para Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
