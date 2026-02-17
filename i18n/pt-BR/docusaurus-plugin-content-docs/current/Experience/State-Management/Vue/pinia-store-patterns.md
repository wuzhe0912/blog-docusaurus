---
id: state-management-vue-pinia-store-patterns
title: 'Padrões de Implementação do Pinia Store'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Em um projeto de plataforma multi-marca, os Pinia Stores são implementados com Options API e Composition API, escolhendo o padrão adequado conforme o cenário.

---

## 1. Eixos principais de resposta em entrevista

1. **Duas formas de escrita**: Options API e Composition API, escolhidas conforme o cenário.
2. **Estratégia de seleção**: Stores simples com Composition API, stores com persistência com Options API, lógica complexa com Composition API.
3. **Diferenças chave**: State deve ser uma função, `this` em Actions aponta para a instância do store, duas formas de escrever Getters.

---

## 2. Options API (Escrita tradicional)

### 2.1 Estrutura básica

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: Definir estado
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: Definir métodos
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: Definir propriedades computadas
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ Configuração de persistência
  persist: true, // Persistência automática no localStorage
});
```

### 2.2 Pontos-chave

**1. State deve ser uma função**

```typescript
// ✅ Correto
state: () => ({ count: 0 });

// ❌ Incorreto (faz com que múltiplas instâncias compartilhem estado)
state: {
  count: 0;
}
```

**2. `this` em Actions aponta para a instância do store**

```typescript
actions: {
  increment() {
    this.count++; // Modificação direta do state
  },
};
```

**3. Duas formas de escrever Getters**

```typescript
getters: {
  // Forma 1: Retornar valor diretamente (recomendado)
  doubleCount: (state) => state.count * 2,

  // Forma 2: Retornar computed (atualização reativa)
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup (Escrita moderna)

### 3.1 Exemplo de Store simples

```typescript
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

**Pontos-chave de entrevista**:
- Uso de `useSessionStorage` do `@vueuse/core` para persistência
- Mais próximo da escrita Composition API
- Todos os `ref` ou `reactive` são State
- Todas as funções são Actions
- Todos os `computed` são Getters

### 3.2 Exemplo de Store complexo

```typescript
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';

type GameState = {
  list: Response.GameList;
  allGameList: Response.AllGameList;
  favoriteList: Response.FavoriteList;
  favoriteMap: Response.FavoriteMap;
};

export const useGameStore = defineStore('gameStore', () => {
  // 📦 State (usando reactive)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: [],
    },
    favoriteList: [],
    favoriteMap: {},
  });

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING;
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO;
    gameState.allGameList.SLOT = data.SLOT;
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data;
    gameState.favoriteMap = {};
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true;
    });
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0; // Manter reatividade
    gameState.favoriteMap = {};
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList,
  };
});
```

**Pontos-chave**:

**1. Uso de `reactive` vs `ref`**

```typescript
// 📌 Usar reactive (recomendado para objetos complexos)
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // Acesso direto

// 📌 Usar ref (recomendado para tipos primitivos)
const count = ref(0);
count.value++; // Precisa de .value
```

**2. Por que usar `.length = 0` para esvaziar arrays?**

```typescript
// ✅ Mantém reatividade (recomendado)
gameState.favoriteList.length = 0;

// ❌ Perde reatividade
gameState.favoriteList = [];
```

---

## 4. Comparação das duas formas de escrita

| Característica          | Options API              | Composition API (Setup)            |
| ----------------------- | ------------------------ | ---------------------------------- |
| **Estilo de sintaxe**   | Configuração de objeto   | Funcional                          |
| **Curva de aprendizado** | Menor (similar ao Vue 2) | Maior (requer entender Composition API) |
| **Suporte TypeScript**  | Bom                      | Melhor                             |
| **Flexibilidade**       | Média                    | Alta (composição livre de lógica)  |
| **Legibilidade**        | Estrutura clara          | Precisa de boa organização         |
| **Cenário recomendado** | Stores simples           | Lógica complexa, composição de funções |

**Estratégia de seleção do projeto**:
- **Stores simples (< 5 states)**: Composition API
- **Stores com persistência**: Options API + `persist: true`
- **Lógica de negócio complexa**: Composition API (mais flexível)
- **Stores com Getters**: Options API (sintaxe mais clara)

---

## 5. Resumo dos pontos-chave para entrevista

### 5.1 Escolha entre as duas formas de escrita

**Possível resposta:**

> No projeto, uso dois métodos de definição de Store: Options API e Composition API. Options API usa configuração de objeto, sintaxe similar ao Vue 2, curva de aprendizado menor, adequado para stores simples e stores com persistência. Composition API usa escrita funcional, mais flexível, melhor suporte TypeScript, adequado para lógica complexa. A estratégia de seleção: stores simples com Composition API, stores com persistência com Options API, lógica de negócio complexa com Composition API.

**Pontos-chave:**
- ✅ Diferenças entre as duas formas de escrita
- ✅ Estratégia de seleção
- ✅ Experiência real em projetos

### 5.2 Pontos técnicos chave

**Possível resposta:**

> Ao implementar Stores, há vários pontos técnicos chave: 1) State deve ser uma função para evitar compartilhamento de estado entre múltiplas instâncias; 2) `this` em Actions aponta para a instância do store, pode modificar state diretamente; 3) Getters tem duas formas de escrita, pode retornar valores diretamente ou retornar computed; 4) Usar `reactive` para objetos complexos, `ref` para tipos primitivos; 5) Esvaziar arrays com `.length = 0` para manter a reatividade.

**Pontos-chave:**
- ✅ State deve ser uma função
- ✅ Uso de `this` em Actions
- ✅ Formas de escrita de Getters
- ✅ reactive vs ref
- ✅ Manter a reatividade

---

## 6. Resumo da entrevista

**Possível resposta:**

> No projeto, uso Options API e Composition API para implementar Pinia Stores. Options API é adequado para stores simples e stores com persistência, sintaxe clara. Composition API é adequado para lógica complexa, mais flexível e melhor suporte TypeScript. A estratégia de seleção é baseada na complexidade e necessidades do Store. Os pontos técnicos chave incluem: State deve ser uma função, uso de `this` em Actions, duas formas de escrita de Getters e manutenção da reatividade.

**Pontos-chave:**
- ✅ Diferenças e escolha entre as duas formas de escrita
- ✅ Pontos técnicos chave
- ✅ Experiência real em projetos
