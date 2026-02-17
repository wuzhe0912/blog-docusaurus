---
title: '[Lv2] Nuxt 3 Lifecycle e principios de Hydration'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Compreensao aprofundada do ciclo de vida (Lifecycle), gerenciamento de estado (State Management) e mecanismo de Hydration do Nuxt 3, evitando problemas comuns de Hydration Mismatch.

---

## 1. Pontos-chave de resposta em entrevista

1. **Diferencas de Lifecycle**: Distinguir os Hooks executados no Server-side e Client-side. `setup` e executado em ambos os lados, `onMounted` apenas no lado do Client.
2. **Gerenciamento de estado**: Entender as diferencas entre `useState` e `ref` em cenarios SSR. `useState` pode sincronizar o estado entre Server e Client, evitando Hydration Mismatch.
3. **Mecanismo de Hydration**: Explicar como a Hydration transforma HTML estatico em uma aplicacao interativa, e as causas comuns de Mismatch (estrutura HTML inconsistente, conteudo aleatorio, etc.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Ambiente de execucao dos Lifecycle Hooks

No Nuxt 3 (Vue 3 SSR), diferentes Hooks sao executados em diferentes ambientes:

| Lifecycle Hook | Server-side | Client-side | Descricao |
|----------------|-------------|-------------|-----------|
| **setup()** | ✅ Executado | ✅ Executado | Logica de inicializacao do componente. **Atencao: evite usar APIs exclusivas do Client (como window, document) no setup**. |
| **onBeforeMount** | ❌ Nao executado | ✅ Executado | Antes da montagem. |
| **onMounted** | ❌ Nao executado | ✅ Executado | Montagem concluida. **Operacoes DOM e chamadas de Browser API devem ir aqui**. |
| **onBeforeUpdate** | ❌ Nao executado | ✅ Executado | Antes da atualizacao de dados. |
| **onUpdated** | ❌ Nao executado | ✅ Executado | Apos a atualizacao de dados. |
| **onBeforeUnmount** | ❌ Nao executado | ✅ Executado | Antes da desmontagem. |
| **onUnmounted** | ❌ Nao executado | ✅ Executado | Apos a desmontagem. |

### 2.2 Pergunta comum de entrevista: onMounted e executado no Server?

**Resposta:**
Nao. `onMounted` so e executado no lado do Client (navegador). A renderizacao do lado do servidor so e responsavel por gerar a string HTML, nao realiza a montagem (Mounting) do DOM.

**Pergunta de acompanhamento: O que fazer se precisar executar logica especifica no Server?**
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

Em aplicacoes SSR, apos o Server renderizar o HTML, ele serializa o estado (State) e o envia ao Client para que este realize a Hydration (assumir o estado).

- **Vue `ref`**: E um estado local dentro do componente. No processo SSR, o valor de `ref` criado no Server **nao e transferido automaticamente** para o Client. Na inicializacao do Client, o `ref` e recriado (geralmente reiniciado ao valor inicial), causando inconsistencia entre o conteudo renderizado pelo Server e o estado inicial do Client, produzindo Hydration Mismatch.
- **Nuxt `useState`**: E um gerenciamento de estado compativel com SSR. Ele armazena o estado no `NuxtPayload`, enviado junto com o HTML ao Client. Na inicializacao do Client, este Payload e lido e o estado restaurado, garantindo consistencia entre Server e Client.

### 3.2 Tabela comparativa

| Caracteristica | Vue `ref` / `reactive` | Nuxt `useState` |
|----------------|------------------------|-----------------|
| **Escopo** | Dentro do componente / modulo | Global (compartilhavel em toda a App via key) |
| **Sincronizacao de estado SSR** | ❌ Nao sincroniza | ✅ Serializa e sincroniza automaticamente ao Client |
| **Cenarios de uso** | Apenas estado de interacao do Client, dados que nao necessitam sincronizacao SSR | Estado entre componentes, dados que precisam ir do Server ao Client (como User Info) |

### 3.3 Exemplo de implementacao

**Exemplo incorreto (usar ref para estado entre plataformas):**

```typescript
// Server gera numero aleatorio -> HTML exibe 5
const count = ref(Math.random());

// Client re-executa -> gera novo numero aleatorio 3
// Resultado: Hydration Mismatch (Server: 5, Client: 3)
```

**Exemplo correto (usar useState):**

```typescript
// Server gera numero aleatorio -> armazena no Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client le o Payload -> obtem o valor gerado pelo Server
// Resultado: Estado consistente
```

---

## 4. Hydration e Hydration Mismatch

### 4.1 O que e Hydration?

Hydration (hidratacao) e o processo em que o JavaScript do Client assume o HTML estatico renderizado pelo Server.

1. **Server Rendering**: O Server executa a aplicacao Vue e gera uma string HTML (incluindo conteudo e CSS).
2. **Download do HTML**: O navegador baixa e exibe o HTML estatico (First Paint).
3. **Download e execucao do JS**: O navegador baixa o bundle JS do Vue/Nuxt.
4. **Hydration**: O Vue reconstroi o DOM virtual (Virtual DOM) no Client e o compara com o DOM real existente. Se a estrutura corresponder, o Vue "ativa" esses elementos DOM (vinculando event listeners), tornando a pagina interativa.

### 4.2 O que e Hydration Mismatch?

Quando a estrutura do Virtual DOM gerada no Client **nao corresponde** a estrutura HTML renderizada pelo Server, o Vue emite um aviso de Hydration Mismatch. Isso geralmente significa que o Client precisa descartar o HTML do Server e re-renderizar, causando degradacao de desempenho e cintilacao de tela.

### 4.3 Causas comuns de Mismatch e solucoes

#### 1. Estrutura HTML invalida
O navegador corrige automaticamente estruturas HTML incorretas, causando inconsistencia com o esperado pelo Vue.
- **Exemplo**: `<div>` dentro de `<p>`.
- **Solucao**: Verificar a sintaxe HTML e garantir que a estrutura aninhada seja valida.

#### 2. Conteudo aleatorio ou carimbos de data/hora
Server e Client geram conteudo diferente na execucao.
- **Exemplo**: `new Date()`, `Math.random()`.
- **Solucao**:
    - Usar `useState` para fixar o valor.
    - Ou mover essa logica para `onMounted` (renderizar apenas no Client, deixar em branco ou exibir Placeholder no Server).

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
- **Causa**: Server nao tem window, avalia como false; Client avalia como true.
- **Solucao**: Atualizar estado no `onMounted`, ou usar hooks exclusivos do Client como `useWindowSize`.

---

## 5. Resumo da entrevista

**Voce pode responder assim:**

> A principal diferenca entre Server-side e Client-side esta na execucao dos Lifecycle Hooks. O Server executa principalmente `setup`, enquanto `onMounted` e outros Hooks relacionados ao DOM so sao executados no Client. Isso leva ao conceito de Hydration, ou seja, o processo em que o Client assume o HTML do Server.
>
> Para evitar Hydration Mismatch, devemos garantir que o conteudo da renderizacao inicial do Server e do Client seja consistente. E por isso que o Nuxt fornece `useState`. Diferente do `ref` do Vue, `useState` serializa o estado e o envia ao Client, garantindo a sincronizacao do estado em ambos os lados. Se `ref` for usado para armazenar dados gerados no Server, uma inconsistencia ocorrera quando o Client for reinicializado.
>
> Mismatches comuns incluem numeros aleatorios, carimbos de data/hora ou estruturas HTML aninhadas invalidas. A solucao e mover o conteudo variavel para `onMounted` ou usar o componente `<ClientOnly>`.

**Pontos-chave:**
- ✅ `onMounted` e executado apenas no Client
- ✅ `useState` suporta sincronizacao de estado SSR, `ref` nao
- ✅ Causas do Hydration Mismatch (estrutura, valores aleatorios) e solucoes (`<ClientOnly>`, `onMounted`)
