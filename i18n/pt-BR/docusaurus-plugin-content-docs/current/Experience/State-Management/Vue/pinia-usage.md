---
id: state-management-vue-pinia-usage
title: 'Praticas de uso do Pinia'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Em um projeto de plataforma multi-marca, como usar Pinia Store em componentes e Composables, além dos padrões de comunicação entre Stores.

---

## 1. Eixo principal da resposta em entrevista

1. **Uso em componentes**: Use `storeToRefs` para manter a reatividade, Actions podem ser desestruturadas diretamente.
2. **Composicao com Composables**: Combine múltiplas Stores em Composables para encapsular a lógica de negocios.
3. **Comunicacao entre Stores**: Recomenda-se combinar em Composables, evitando dependências circulares.

---

## 2. Usando Store em componentes

### 2.1 Uso básico

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// Usar a instância da store diretamente
const authStore = useAuthStore();

// Acessar state
console.log(authStore.access_token);

// Chamar action
authStore.setToptVerified(true);

// Acessar getter
console.log(authStore.isLogin);
</script>
```

### 2.2 Desestruturacao com `storeToRefs` (importante!)

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// Errado: Perde a reatividade
const { access_token, isLogin } = authStore;

// Correto: Mantem a reatividade
const { access_token, isLogin } = storeToRefs(authStore);

// Actions podem ser desestruturadas diretamente (não precisam de storeToRefs)
const { setToptVerified } = authStore;
</script>
```

**Por que a desestruturação direta perde a reatividade?**

- O state e os getters do Pinia são reativos
- A desestruturação direta quebra a conexão reativa
- `storeToRefs` converte cada propriedade em um `ref`, mantendo a reatividade
- Actions não são reativas por natureza, portanto podem ser desestruturadas diretamente

---

## 3. Usando Store em Composables

### 3.1 Caso prático: useGame.ts

Composables são o melhor lugar para combinar a lógica de Stores.

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1. Importar múltiplas stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2. Desestruturar state e getters (usando storeToRefs)
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3. Desestruturar actions (desestruturação direta)
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4. Combinar lógica
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5. Retornar para uso em componentes
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**Pontos-chave para entrevista**:
- Composables são o melhor lugar para combinar a lógica de Stores
- Use `storeToRefs` para garantir a reatividade
- Actions podem ser desestruturadas diretamente
- Encapsule a lógica de negocios complexa em composables

---

## 4. Comunicacao entre Stores

### 4.1 Método 1: Chamar outra Store dentro de uma Store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Chamar método de outra store
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Método 2: Combinar múltiplas Stores em um Composable (recomendado)

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // Executar inicialização de múltiplas stores sequencialmente
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**Pontos-chave para entrevista**:
- Recomenda-se combinar múltiplas Stores em Composables
- Evite dependências circulares entre Stores
- Mantenha o princípio de responsabilidade única da Store

---

## 5. Caso prático: Fluxo de login do usuário

Este é um fluxo completo de uso de Store, abrangendo a colaboracao entre múltiplas Stores.

### 5.1 Diagrama de fluxo

```
Usuario clica no botao de login
     |
Chamar useAuth().handleLogin()
     |
Requisicao de login via API
     |
Sucesso -> authStore armazena o token
     |
useUserInfo().getUserInfo()
     |
userInfoStore armazena as informacoes do usuario
     |
useGame().initGameList()
     |
gameStore armazena a lista de jogos
     |
Redirecionar para a pagina inicial
```

### 5.2 Implementação do código

```typescript
// 1. authStore.ts - Gerenciar estado de autenticação
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // Persistir informacoes de autenticacao
});

// 2. userInfoStore.ts - Gerenciar informações do usuário
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // Nao persistir (informacoes sensiveis)
});

// 3. useAuth.ts - Combinar lógica de autenticação
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // Atualizar authStore
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id,
      });
      return true;
    }
    return false;
  }

  return {
    access_token,
    isLogin,
    handleLogin,
  };
}

// 4. LoginPage.vue - Página de login
<script setup lang="ts">
import { useAuth } from 'src/common/hooks/useAuth';
import { useUserInfo } from 'src/common/composables/useUserInfo';
import { useGame } from 'src/common/composables/useGame';
import { useRouter } from 'vue-router';

const { handleLogin } = useAuth();
const { getUserInfo } = useUserInfo();
const { initGameList } = useGame();
const router = useRouter();

const onSubmit = async (formData: LoginForm) => {
  // Passo 1: Login
  const success = await handleLogin(formData);
  if (success) {
    // Passo 2: Obter informações do usuário
    await getUserInfo();
    // Passo 3: Inicializar lista de jogos
    await initGameList();
    // Passo 4: Redirecionar para página inicial
    router.push('/');
  }
};
</script>
```

**Pontos-chave para entrevista**:

1. **Separacao de responsabilidades**
   - `authStore`: Gerencia apenas o estado de autenticação
   - `userInfoStore`: Gerencia apenas as informações do usuário
   - `useAuth`: Encapsula a lógica de negocios de autenticação
   - `useUserInfo`: Encapsula a lógica de negocios de informações do usuário

2. **Fluxo de dados reativo**
   - Use `storeToRefs` para manter a reatividade
   - Atualizacoes na Store acionam automaticamente atualizações nos componentes

3. **Estratégia de persistência**
   - `authStore` e persistida (manter login após atualizar a página)
   - `userInfoStore` não é persistida (por questões de segurança)

---

## 6. Resumo dos pontos-chave para entrevista

### 6.1 Uso de storeToRefs

**Você pode responder assim:**

> Ao usar Pinia Store em componentes, se você precisa desestruturar state e getters, deve usar `storeToRefs` para manter a reatividade. A desestruturação direta quebra a conexão reativa, pois o state e os getters do Pinia são reativos. `storeToRefs` converte cada propriedade em um `ref`, mantendo a reatividade. Actions podem ser desestruturadas diretamente sem `storeToRefs`, pois não são reativas por natureza.

**Pontos-chave:**
- Funcao do `storeToRefs`
- Por que `storeToRefs` é necessário
- Actions podem ser desestruturadas diretamente

### 6.2 Comunicacao entre Stores

**Você pode responder assim:**

> A comunicação entre Stores pode ser feita de duas formas: 1) Chamar outra Store dentro de uma Store, mas cuidado para evitar dependências circulares; 2) Combinar múltiplas Stores em um Composable, que é a forma recomendada. A melhor prática e manter o princípio de responsabilidade única da Store, encapsular a lógica de negocios complexa em Composables e evitar dependências diretas entre Stores.

**Pontos-chave:**
- Duas formas de comunicação
- Recomenda-se combinar em Composables
- Evitar dependências circulares

---

## 7. Resumo da entrevista

**Você pode responder assim:**

> Ao usar Pinia Store em projetos, existem algumas práticas-chave: 1) Usar `storeToRefs` para desestruturar state e getters em componentes, mantendo a reatividade; 2) Combinar múltiplas Stores em Composables para encapsular a lógica de negocios; 3) A comunicação entre Stores é recomendada ser feita em Composables, evitando dependências circulares; 4) Manter o princípio de responsabilidade única da Store, colocando lógica complexa em Composables.

**Pontos-chave:**
- Uso de `storeToRefs`
- Composicao de Stores com Composables
- Padroes de comunicação entre Stores
- Princípio de separação de responsabilidades
