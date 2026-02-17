---
id: state-management-vue-pinia-setup
title: 'Inicialização e Configuração do Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Configuração de inicialização do Pinia e design da estrutura do projeto em um projeto de plataforma multi-marca.

---

## 1. Eixos principais de resposta em entrevista

1. **Razões para escolher o Pinia**: Melhor suporte TypeScript, API mais simples, design modular, melhor experiência de desenvolvimento.
2. **Configuração de inicialização**: Uso de `piniaPluginPersistedstate` para persistência, extensão da interface `PiniaCustomProperties`.
3. **Estrutura do projeto**: 30+ stores, gerenciados por categorias de domínio funcional.

---

## 2. Por que Pinia?

### 2.1 Pinia vs Vuex

**Pinia** é a ferramenta oficial de gerenciamento de estado para Vue 3 e, como sucessor do Vuex, oferece uma API mais simples e melhor suporte TypeScript.

**Resposta chave para entrevista**:

1. **Melhor suporte TypeScript**
   - Pinia fornece inferência de tipos completa
   - Não precisa de funções auxiliares adicionais (como `mapState`, `mapGetters`)

2. **API mais simples**
   - Não precisa de mutations (camada de operações síncronas no Vuex)
   - Executar operações síncronas/assíncronas diretamente nas actions

3. **Design modular**
   - Sem módulos aninhados
   - Cada store é independente

4. **Melhor experiência de desenvolvimento**
   - Suporte ao Vue Devtools
   - Hot Module Replacement (HMR)
   - Tamanho menor (aprox. 1KB)

5. **Recomendação oficial do Vue 3**
   - Pinia é a ferramenta oficial de gerenciamento de estado para Vue 3

### 2.2 Componentes principais do Pinia

```typescript
// Os três elementos centrais de um Store
{
  state: () => ({ ... }),      // Dados de estado
  getters: { ... },            // Propriedades computadas
  actions: { ... }             // Métodos (síncronos/assíncronos)
}
```

**Correspondência com componentes Vue**:
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Configuração de inicialização do Pinia

### 3.1 Configuração básica

**Localização do arquivo:** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Estender propriedades personalizadas do Pinia
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // Registrar plugin de persistência
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**Pontos-chave de entrevista**:
- ✅ Uso de `piniaPluginPersistedstate` para persistência de estado
- ✅ Extensão da interface `PiniaCustomProperties` para todos os stores acessarem o router
- ✅ Integração através do wrapper `store` do Quasar

### 3.2 Estrutura de arquivos do Store

```
src/stores/
├── index.ts                    # Configuração da instância Pinia
├── store-flag.d.ts            # Declaração de tipos TypeScript
│
├── authStore.ts               # Autenticação
├── userInfoStore.ts           # Informações do usuário
├── gameStore.ts               # Informações do jogo
├── productStore.ts            # Informações do produto
├── languageStore.ts           # Configuração de idioma
├── darkModeStore.ts          # Modo de tema
├── envStore.ts               # Configuração de ambiente
└── ... (30+ stores no total)
```

**Princípios de design**:
- Cada Store é responsável por um único domínio funcional
- Convenção de nomes: `nomeDaFunção + Store.ts`
- Usar definições de tipos TypeScript completas

---

## 4. Resumo dos pontos-chave para entrevista

### 4.1 Razões para escolher o Pinia

**Possível resposta:**

> No projeto, escolhemos o Pinia em vez do Vuex principalmente por várias razões: 1) Melhor suporte TypeScript com inferência de tipos completa sem configuração adicional; 2) API mais simples sem mutations, operações síncronas/assíncronas diretamente nas actions; 3) Design modular sem módulos aninhados, cada store é independente; 4) Melhor experiência de desenvolvimento com Vue Devtools, HMR e menor tamanho; 5) Recomendação oficial do Vue 3.

**Pontos-chave:**
- ✅ Suporte TypeScript
- ✅ Simplicidade da API
- ✅ Design modular
- ✅ Experiência de desenvolvimento

### 4.2 Pontos-chave da configuração de inicialização

**Possível resposta:**

> Na inicialização do Pinia, realizei várias configurações chave: 1) Uso de `piniaPluginPersistedstate` para persistência de estado, permitindo que o Store se salve automaticamente no localStorage; 2) Extensão da interface `PiniaCustomProperties` para que todos os stores acessem o router, facilitando operações de roteamento nas actions; 3) Integração através do wrapper `store` do Quasar para integração com o framework.

**Pontos-chave:**
- ✅ Configuração do plugin de persistência
- ✅ Extensão de propriedades personalizadas
- ✅ Integração com o framework

---

## 5. Resumo da entrevista

**Possível resposta:**

> No projeto, uso o Pinia como ferramenta de gerenciamento de estado. Escolhi o Pinia por seu melhor suporte TypeScript, API mais simples e melhor experiência de desenvolvimento. Na configuração de inicialização, uso `piniaPluginPersistedstate` para persistência e estendo `PiniaCustomProperties` para que todos os stores acessem o router. O projeto tem 30+ stores gerenciados por categorias de domínio funcional, onde cada Store é responsável por um único domínio.

**Pontos-chave:**
- ✅ Razões para escolher o Pinia
- ✅ Pontos-chave da configuração
- ✅ Design da estrutura do projeto
- ✅ Experiência real em projetos
