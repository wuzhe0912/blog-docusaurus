---
title: '[Lv2] Nuxt 3 Lifecycle e princípios de Hydration'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Compreensao aprofundada do ciclo de vida (Lifecycle), gerenciamento de estado (State Management) e mecanismo de Hydration do Nuxt 3, evitando problemas comuns de Hydration Mismatch.

---

## 1. Pontos-chave de resposta em entrevista

1. **Diferencas de Lifecycle**: Distinguir os Hooks executados no Server-side e Client-side. `setup` é executado em ambos os lados, `onMounted` apenas no lado do Client.
2. **Gerenciamento de estado**: Entender as diferenças entre `useState` e `ref` em cenários SSR. `useState` pode sincronizar o estado entre Server e Client, evitando Hydration Mismatch.
3. **Mecanismo de Hydration**: Explicar como a Hydration transforma HTML estático em uma aplicação interativa, e as causas comuns de Mismatch (estrutura HTML inconsistente, conteúdo aleatorio, etc.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Ambiente de execução dos Lifecycle Hooks

No Nuxt 3 (Vue 3 SSR), diferentes Hooks são executados em diferentes ambientes:

| Lifecycle Hook | Server-side | Client-side | Descrição |
|----------------|-------------|-------------|-----------|
| **setup()** | ✅ Executado | ✅ Executado | Logica de inicialização do componente. **Atenção: evite usar APIs exclusivas do Client (como window, document) no setup**. |
| **onBeforeMount** | ❌ Não executado | ✅ Executado | Antes da montagem. |
| **onMounted** | ❌ Não executado | ✅ Executado | Montagem concluida. **Operacoes DOM e chamadas de Browser API devem ir aqui**. |
| **onBeforeUpdate** | ❌ Não executado | ✅ Executado | Antes da atualização de dados. |
| **onUpdated** | ❌ Não executado | ✅ Executado | Após a atualização de dados. |
| **onBeforeUnmount** | ❌ Não executado | ✅ Executado | Antes da desmontagem. |
| **onUnmounted** | ❌ Não executado | ✅ Executado | Após a desmontagem. |

### 2.2 Pergunta comum de entrevista: onMounted é executado no Server?

**Resposta:**
Não. `onMounted` só é executado no lado do Client (navegador). A renderização do lado do servidor só é responsável por gerar a string HTML, não realiza a montagem (Mounting) do DOM.

**Pergunta de acompanhamento: O que fazer se precisar executar lógica específica no Server?**
- Usar `setup()` ou `useAsyncData` / `useFetch`.
- Se precisar distinguir o ambiente, use `process.server` ou `process.client` para determinar.

```typescript
<script setup>
// Executado em Server e Client
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // Executado apenas no Client
  console.log('Mounted (Client Only)');
  // Uso seguro de window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 Por que o Nuxt precisa do useState?

Em aplicações SSR, após o Server renderizar o HTML, ele serializa o estado (State) e o envia ao Client para que este realize a Hydration (assumir o estado).

- **Vue `ref`**: E um estado local dentro do componente. No processo SSR, o valor de `ref` criado no Server **não é transferido automaticamente** para o Client. Na inicialização do Client, o `ref` e recriado (geralmente reiniciado ao valor inicial), causando inconsistência entre o conteúdo renderizado pelo Server e o estado inicial do Client, produzindo Hydration Mismatch.
- **Nuxt `useState`**: E um gerenciamento de estado compatível com SSR. Ele armazena o estado no `NuxtPayload`, enviado junto com o HTML ao Client. Na inicialização do Client, este Payload e lido e o estado restaurado, garantindo consistência entre Server e Client.

### 3.2 Tabela comparativa

| Característica | Vue `ref` / `reactive` | Nuxt `useState` |
|----------------|------------------------|-----------------|
| **Escopo** | Dentro do componente / módulo | Global (compartilhavel em toda a App via key) |
| **Sincronizacao de estado SSR** | ❌ Não sincroniza | ✅ Serializa e sincroniza automaticamente ao Client |
| **Cenários de uso** | Apenas estado de interação do Client, dados que não necessitam sincronização SSR | Estado entre componentes, dados que precisam ir do Server ao Client (como User Info) |

### 3.3 Exemplo de implementação

**Exemplo incorreto (usar ref para estado entre plataformas):**

```typescript
// Server gera número aleatorio -> HTML exibe 5
const count = ref(Math.random());

// Client re-executa -> gera novo número aleatorio 3
// Resultado: Hydration Mismatch (Server: 5, Client: 3)
```

**Exemplo correto (usar useState):**

```typescript
// Server gera número aleatorio -> armazena no Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client le o Payload -> obtem o valor gerado pelo Server
// Resultado: Estado consistente
```

---

## 4. Hydration e Hydration Mismatch

### 4.1 O que é Hydration?

Hydration (hidratacao) é o processo em que o JavaScript do Client assume o HTML estático renderizado pelo Server.

1. **Server Rendering**: O Server executa a aplicação Vue e gera uma string HTML (incluindo conteúdo e CSS).
2. **Download do HTML**: O navegador baixa e exibe o HTML estático (First Paint).
3. **Download e execução do JS**: O navegador baixa o bundle JS do Vue/Nuxt.
4. **Hydration**: O Vue reconstroi o DOM virtual (Virtual DOM) no Client e o compara com o DOM real existente. Se a estrutura corresponder, o Vue "ativa" esses elementos DOM (vinculando event listeners), tornando a página interativa.

### 4.2 O que é Hydration Mismatch?

Quando a estrutura do Virtual DOM gerada no Client **não corresponde** a estrutura HTML renderizada pelo Server, o Vue emite um aviso de Hydration Mismatch. Isso geralmente significa que o Client precisa descartar o HTML do Server e re-renderizar, causando degradação de desempenho e cintilação de tela.

### 4.3 Causas comuns de Mismatch e soluções

#### 1. Estrutura HTML inválida
O navegador corrige automaticamente estruturas HTML incorretas, causando inconsistência com o esperado pelo Vue.
- **Exemplo**: `<div>` dentro de `<p>`.
- **Solução**: Verificar a sintaxe HTML e garantir que a estrutura aninhada seja válida.

#### 2. Conteúdo aleatorio ou carimbos de data/hora
Server e Client geram conteúdo diferente na execução.
- **Exemplo**: `new Date()`, `Math.random()`.
- **Solução**:
    - Usar `useState` para fixar o valor.
    - Ou mover essa lógica para `onMounted` (renderizar apenas no Client, deixar em branco ou exibir Placeholder no Server).

```typescript
// Incorreto
const time = new Date().toISOString();

// Correto (usando onMounted)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// Ou usar <ClientOnly>
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. Renderizacao condicional dependente de window/document
- **Exemplo**: `v-if="window.innerWidth > 768"`
- **Causa**: Server não tem window, avalia como false; Client avalia como true.
- **Solução**: Atualizar estado no `onMounted`, ou usar hooks exclusivos do Client como `useWindowSize`.

---

## 5. Resumo da entrevista

**Você pode responder assim:**

> A principal diferença entre Server-side e Client-side esta na execução dos Lifecycle Hooks. O Server executa principalmente `setup`, enquanto `onMounted` e outros Hooks relacionados ao DOM só são executados no Client. Isso leva ao conceito de Hydration, ou seja, o processo em que o Client assume o HTML do Server.
>
> Para evitar Hydration Mismatch, devemos garantir que o conteúdo da renderização inicial do Server e do Client seja consistente. É por isso que o Nuxt fornece `useState`. Diferente do `ref` do Vue, `useState` serializa o estado e o envia ao Client, garantindo a sincronização do estado em ambos os lados. Se `ref` for usado para armazenar dados gerados no Server, uma inconsistência ocorrerá quando o Client for reinicializado.
>
> Mismatches comuns incluem números aleatorios, carimbos de data/hora ou estruturas HTML aninhadas invalidas. A solução e mover o conteúdo variável para `onMounted` ou usar o componente `<ClientOnly>`.

**Pontos-chave:**
- ✅ `onMounted` é executado apenas no Client
- ✅ `useState` suporta sincronização de estado SSR, `ref` não
- ✅ Causas do Hydration Mismatch (estrutura, valores aleatorios) e soluções (`<ClientOnly>`, `onMounted`)
