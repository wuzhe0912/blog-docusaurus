---
id: state-management-vue-pinia-persistence
title: 'Estratégias de Persistência do Pinia'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Estratégias de persistência para Pinia Store em um projeto de plataforma multi-marca: uso de `piniaPluginPersistedstate` e `useSessionStorage` do VueUse.

---

## 1. Eixos principais de resposta em entrevista

1. **Três métodos de persistência**: `persist: true`, `useSessionStorage`, persistência manual.
2. **Estratégia de seleção**: Para o Store inteiro usar `persist: true`, para campos específicos usar `useSessionStorage`.
3. **Considerações de segurança**: Não persistir informações sensíveis, persistir preferências do usuário.

---

## 2. Métodos de persistência

### 2.1 Pinia Plugin Persistedstate

**Options API:**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // Persistência automática no localStorage
});
```

**Configuração personalizada:**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // Persistir apenas campos específicos
}
```

### 2.2 useSessionStorage / useLocalStorage do VueUse

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Persistência automática no sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 Persistência manual (não recomendado)

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // Salvamento manual
    },
  },
});
```

---

## 3. Tabela comparativa

| Método                  | Vantagens              | Desvantagens                    | Caso de uso                          |
| ----------------------- | ---------------------- | ------------------------------- | ------------------------------------ |
| **persist: true**       | Automático, simples    | Todo o state é persistido       | Store inteiro precisa de persistência |
| **useSessionStorage**   | Flexível, type-safe    | Precisa definir individualmente | Campos específicos                   |
| **Persistência manual** | Controle total         | Propenso a erros, difícil manutenção | Não recomendado                |

---

## 4. Resetar o estado do Store

### 4.1 `$reset()` integrado do Pinia

```typescript
// Suportado pelo Options API Store
const store = useMyStore();
store.$reset(); // Resetar para o estado inicial
```

### 4.2 Método de reset personalizado

```typescript
// Composition API Store
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({
    list: [],
    favoriteList: [],
  });

  function resetGameStore() {
    gameState.list = [];
    gameState.favoriteList = [];
  }

  return { gameState, resetGameStore };
});
```

### 4.3 Reset em lote (caso real)

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // Resetar múltiplos stores
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // Resetar todos os estados ao fazer logout
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. Melhores práticas

### 5.1 Estratégia de persistência

```typescript
// ✅ Não persistir informações sensíveis
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // Persistir
    user_password: undefined, // ❌ Nunca persistir senhas
  }),
  persist: {
    paths: ['access_token'], // Persistir apenas o token
  },
});
```

### 5.2 Atualização em lote com `$patch`

```typescript
// ❌ Não recomendado: Múltiplas atualizações (dispara múltiplas reações)
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ Recomendado: Atualização em lote (dispara apenas uma reação)
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ Forma funcional também é possível
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. Resumo dos pontos-chave para entrevista

### 6.1 Escolha do método de persistência

**Possível resposta:**

> No projeto, uso três métodos de persistência: 1) `persist: true`, o Store inteiro é automaticamente persistido no localStorage, adequado para Stores que precisam de persistência completa; 2) `useSessionStorage` ou `useLocalStorage`, persistência de campos específicos, mais flexível e type-safe; 3) Persistência manual, não recomendado. Na escolha: informações sensíveis não são persistidas, preferências do usuário são persistidas.

**Pontos-chave:**
- ✅ Três métodos de persistência
- ✅ Estratégia de seleção
- ✅ Considerações de segurança

### 6.2 Atualização em lote e reset

**Possível resposta:**

> Ao atualizar o estado do Store, uso `$patch` para atualizações em lote que disparam apenas uma reação, melhorando o desempenho. Ao resetar estados, Options API Stores podem usar `$reset()`, Composition API Stores precisam de um método de reset personalizado. Ao fazer logout, pode-se resetar múltiplos Stores em lote para garantir a limpeza completa do estado.

**Pontos-chave:**
- ✅ `$patch` para atualização em lote
- ✅ Métodos de reset de estado
- ✅ Estratégia de reset em lote

---

## 7. Resumo da entrevista

**Possível resposta:**

> Ao implementar a persistência do Pinia Store no projeto, uso `persist: true` para a persistência automática do Store inteiro ou `useSessionStorage` para a persistência de campos específicos. A estratégia de seleção é: informações sensíveis não são persistidas, preferências do usuário são persistidas. Ao atualizar estados, uso `$patch` para atualizações em lote para melhorar o desempenho. Ao resetar estados, Options API usa `$reset()`, Composition API usa métodos de reset personalizados.

**Pontos-chave:**
- ✅ Métodos de persistência e seleção
- ✅ Estratégia de atualização em lote
- ✅ Métodos de reset de estado
- ✅ Experiência real em projetos
