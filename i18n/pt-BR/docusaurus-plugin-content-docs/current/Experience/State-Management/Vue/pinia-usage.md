---
id: state-management-vue-pinia-usage
title: 'Praticas de uso do Pinia'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Em um projeto de plataforma multi-marca, como usar Pinia Store em componentes e Composables, alem dos padroes de comunicacao entre Stores.

---

## 1. Eixo principal da resposta em entrevista

1. **Uso em componentes**: Use `storeToRefs` para manter a reatividade, Actions podem ser desestruturadas diretamente.
2. **Composicao com Composables**: Combine multiplas Stores em Composables para encapsular a logica de negocios.
3. **Comunicacao entre Stores**: Recomenda-se combinar em Composables, evitando dependencias circulares.

---

## 2. Usando Store em componentes

### 2.1 Uso basico

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// Usar a instancia da store diretamente
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

// Actions podem ser desestruturadas diretamente (nao precisam de storeToRefs)
const { setToptVerified } = authStore;
</script>
```

**Por que a desestruturacao direta perde a reatividade?**

- O state e os getters do Pinia sao reativos
- A desestruturacao direta quebra a conexao reativa
- `storeToRefs` converte cada propriedade em um `ref`, mantendo a reatividade
- Actions nao sao reativas por natureza, portanto podem ser desestruturadas diretamente

---

## 3. Usando Store em Composables

### 3.1 Caso pratico: useGame.ts

Composables sao o melhor lugar para combinar a logica de Stores.

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1. Importar multiplas stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2. Desestruturar state e getters (usando storeToRefs)
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3. Desestruturar actions (desestruturacao direta)
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4. Combinar logica
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
- Composables sao o melhor lugar para combinar a logica de Stores
- Use `storeToRefs` para garantir a reatividade
- Actions podem ser desestruturadas diretamente
- Encapsule a logica de negocios complexa em composables

---

## 4. Comunicacao entre Stores

### 4.1 Metodo 1: Chamar outra Store dentro de uma Store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Chamar metodo de outra store
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Metodo 2: Combinar multiplas Stores em um Composable (recomendado)

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // Executar inicializacao de multiplas stores sequencialmente
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
- Recomenda-se combinar multiplas Stores em Composables
- Evite dependencias circulares entre Stores
- Mantenha o principio de responsabilidade unica da Store

---

## 5. Caso pratico: Fluxo de login do usuario

Este e um fluxo completo de uso de Store, abrangendo a colaboracao entre multiplas Stores.

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

### 5.2 Implementacao do codigo

```typescript
// 1. authStore.ts - Gerenciar estado de autenticacao
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

// 2. userInfoStore.ts - Gerenciar informacoes do usuario
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

// 3. useAuth.ts - Combinar logica de autenticacao
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

// 4. LoginPage.vue - Pagina de login
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
    // Passo 2: Obter informacoes do usuario
    await getUserInfo();
    // Passo 3: Inicializar lista de jogos
    await initGameList();
    // Passo 4: Redirecionar para pagina inicial
    router.push('/');
  }
};
</script>
```

**Pontos-chave para entrevista**:

1. **Separacao de responsabilidades**
   - `authStore`: Gerencia apenas o estado de autenticacao
   - `userInfoStore`: Gerencia apenas as informacoes do usuario
   - `useAuth`: Encapsula a logica de negocios de autenticacao
   - `useUserInfo`: Encapsula a logica de negocios de informacoes do usuario

2. **Fluxo de dados reativo**
   - Use `storeToRefs` para manter a reatividade
   - Atualizacoes na Store acionam automaticamente atualizacoes nos componentes

3. **Estrategia de persistencia**
   - `authStore` e persistida (manter login apos atualizar a pagina)
   - `userInfoStore` nao e persistida (por questoes de seguranca)

---

## 6. Resumo dos pontos-chave para entrevista

### 6.1 Uso de storeToRefs

**Voce pode responder assim:**

> Ao usar Pinia Store em componentes, se voce precisa desestruturar state e getters, deve usar `storeToRefs` para manter a reatividade. A desestruturacao direta quebra a conexao reativa, pois o state e os getters do Pinia sao reativos. `storeToRefs` converte cada propriedade em um `ref`, mantendo a reatividade. Actions podem ser desestruturadas diretamente sem `storeToRefs`, pois nao sao reativas por natureza.

**Pontos-chave:**
- Funcao do `storeToRefs`
- Por que `storeToRefs` e necessario
- Actions podem ser desestruturadas diretamente

### 6.2 Comunicacao entre Stores

**Voce pode responder assim:**

> A comunicacao entre Stores pode ser feita de duas formas: 1) Chamar outra Store dentro de uma Store, mas cuidado para evitar dependencias circulares; 2) Combinar multiplas Stores em um Composable, que e a forma recomendada. A melhor pratica e manter o principio de responsabilidade unica da Store, encapsular a logica de negocios complexa em Composables e evitar dependencias diretas entre Stores.

**Pontos-chave:**
- Duas formas de comunicacao
- Recomenda-se combinar em Composables
- Evitar dependencias circulares

---

## 7. Resumo da entrevista

**Voce pode responder assim:**

> Ao usar Pinia Store em projetos, existem algumas praticas-chave: 1) Usar `storeToRefs` para desestruturar state e getters em componentes, mantendo a reatividade; 2) Combinar multiplas Stores em Composables para encapsular a logica de negocios; 3) A comunicacao entre Stores e recomendada ser feita em Composables, evitando dependencias circulares; 4) Manter o principio de responsabilidade unica da Store, colocando logica complexa em Composables.

**Pontos-chave:**
- Uso de `storeToRefs`
- Composicao de Stores com Composables
- Padroes de comunicacao entre Stores
- Principio de separacao de responsabilidades
