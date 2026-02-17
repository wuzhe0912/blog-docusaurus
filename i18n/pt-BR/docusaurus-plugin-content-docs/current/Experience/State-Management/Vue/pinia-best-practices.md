---
id: state-management-vue-pinia-best-practices
title: 'Melhores Práticas e Erros Comuns do Pinia'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Melhores práticas e tratamento de erros comuns do Pinia Store em um projeto de plataforma multi-marca.

---

## 1. Eixos principais de resposta em entrevista

1. **Princípios de design**: Princípio de responsabilidade única, manter o Store enxuto, não chamar APIs diretamente no Store.
2. **Erros comuns**: Perda de reatividade ao desestruturar diretamente, chamar Store fora do Setup, quebra de reatividade ao modificar State, dependências circulares.
3. **Melhores práticas**: Usar TypeScript, separação de responsabilidades, combinar múltiplos Stores em Composables.

---

## 2. Princípios de design do Store

### 2.1 Princípio de responsabilidade única

```typescript
// ✅ Bom design: Cada Store é responsável por apenas um domínio
useAuthStore(); // Apenas autenticação
useUserInfoStore(); // Apenas informações do usuário
useGameStore(); // Apenas informações do jogo

// ❌ Design ruim: Um Store gerencia tudo
useAppStore(); // Gerencia autenticação, usuário, jogos, configurações...
```

### 2.2 Manter o Store enxuto

```typescript
// ✅ Recomendado
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ Não recomendado: Store com lógica de negócio complexa
// Deveria estar em um composable
```

### 2.3 Não chamar APIs diretamente no Store

```typescript
// ❌ Não recomendado: Chamada direta de API no Store
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // Chamada API
      this.list = data;
    },
  },
});

// ✅ Recomendado: Chamar API no Composable, Store apenas armazena
export const useGameStore = defineStore('gameStore', {
  actions: {
    setGameList(list: Game[]) {
      this.list = list;
    },
  },
});

export function useGame() {
  const gameStore = useGameStore();
  async function fetchGames() {
    const { status, data } = await api.getGames(); // Chamada API no Composable
    if (status) {
      gameStore.setGameList(data); // Store apenas armazena
    }
  }
  return { fetchGames };
}
```

---

## 3. Usar TypeScript

```typescript
// ✅ Definição de tipos completa
type UserState = {
  info: Response.UserInfo;
  walletList: Response.UserWalletList;
};

export const useUserInfoStore = defineStore('useInfoStore', () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: [],
  });
  return { state };
});
```

---

## 4. Erros comuns

### 4.1 Erro 1: Perda de reatividade ao desestruturar diretamente

```typescript
// ❌ Incorreto
const { count } = useCounterStore();
count; // Não é reativo

// ✅ Correto
const { count } = storeToRefs(useCounterStore());
count.value; // Reativo
```

### 4.2 Erro 2: Chamar Store fora do Setup

```typescript
// ❌ Incorreto: Chamada no nível do módulo
const authStore = useAuthStore(); // ❌ Momento incorreto

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ Correto: Chamada dentro da função
export function useAuth() {
  const authStore = useAuthStore(); // ✅ Momento correto
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 Erro 3: Quebra de reatividade ao modificar State

```typescript
// ❌ Incorreto: Atribuir diretamente um novo array
function updateList(newList) {
  gameState.list = newList; // Pode perder reatividade
}

// ✅ Correto: Usar splice ou push
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ Também possível: Atribuição com reactive
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 Erro 4: Dependências circulares

```typescript
// ❌ Incorreto: Dependência mútua entre Stores
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // Depende de userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // Depende de authStore ❌ Dependência circular
});

// ✅ Correto: Combinar no Composable
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  async function initialize() {
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
    }
  }
  return { initialize };
}
```

### 4.5 Erro 5: Esquecer o return

```typescript
// ❌ Incorreto: Esqueceu o return
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ Esqueceu o return, componente não consegue acessar
});

// ✅ Correto
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ return é obrigatório
});
```

---

## 5. Resumo dos pontos-chave para entrevista

### 5.1 Princípios de design do Store

**Possível resposta:**

> Ao projetar Pinia Stores, sigo vários princípios: 1) Princípio de responsabilidade única, cada Store é responsável por apenas um domínio; 2) Manter o Store enxuto, não incluir lógica de negócio complexa; 3) Não chamar APIs diretamente no Store, chamar APIs nos Composables, o Store apenas armazena; 4) Usar definições de tipos completas com TypeScript para melhorar a experiência de desenvolvimento.

**Pontos-chave:**
- ✅ Princípio de responsabilidade única
- ✅ Store enxuto
- ✅ Separação de responsabilidades
- ✅ Uso de TypeScript

### 5.2 Erros comuns e como evitá-los

**Possível resposta:**

> Os erros comuns ao usar Pinia incluem: 1) Perda de reatividade ao desestruturar diretamente, é necessário usar `storeToRefs`; 2) Chamar Store fora do Setup, deve ser chamado dentro da função; 3) Quebra de reatividade ao modificar State, usar `.length = 0` ou `Object.assign`; 4) Dependências circulares, combinar múltiplos Stores em Composables; 5) Esquecer o return, Stores com Composition API devem ter return.

**Pontos-chave:**
- ✅ Manter a reatividade
- ✅ Momento correto de chamada
- ✅ Métodos de modificação de estado
- ✅ Evitar dependências circulares

---

## 6. Resumo da entrevista

**Possível resposta:**

> Ao usar Pinia no projeto, sigo várias melhores práticas: 1) O design do Store segue o princípio de responsabilidade única e se mantém enxuto; 2) Não chamar APIs diretamente no Store, mas nos Composables; 3) Usar definições de tipos completas com TypeScript; 4) Prestar atenção a erros comuns como perda de reatividade, dependências circulares, etc. Essas práticas garantem a manutenibilidade e escalabilidade do Store.

**Pontos-chave:**
- ✅ Princípios de design do Store
- ✅ Erros comuns e como evitá-los
- ✅ Melhores práticas
- ✅ Experiência real em projetos
