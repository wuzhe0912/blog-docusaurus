---
title: '[Lv2] Nuxt 3 Rendering Modes: Estratégia de seleção SSR, SSG, CSR'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Compreender os Rendering Modes do Nuxt 3 e poder selecionar a estratégia de renderização adequada (SSR, SSG, CSR) de acordo com os requisitos do projeto.

---

## 1. Pontos-chave para a entrevista

1. **Classificação dos Rendering Modes**: Nuxt 3 suporta quatro modos: SSR, SSG, CSR, Hybrid Rendering
2. **Estratégia de seleção**: Escolher o modo adequado com base nos requisitos de SEO, dinamismo do conteúdo e requisitos de performance
3. **Experiência de implementação**: Como configurar e selecionar diferentes Rendering Modes no projeto

---

## 2. Introdução aos Rendering Modes do Nuxt 3

### 2.1 Quatro Rendering Modes

O Nuxt 3 suporta quatro Rendering Modes principais:

| Modo | Nome completo | Momento da renderização | Cenários de aplicação |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | Renderizado no Server a cada requisição | SEO + conteúdo dinâmico necessário |
| **SSG** | Static Site Generation | HTML pré-gerado no momento do build | SEO + conteúdo fixo necessário |
| **CSR** | Client-Side Rendering | Renderização no navegador | Sem necessidade de SEO + alta interatividade |
| **Hybrid** | Hybrid Rendering | Uso misto de vários modos | Diferentes páginas com diferentes requisitos |

### 2.2 SSR (Server-Side Rendering)

**Definição:** A cada requisição, JavaScript é executado no Server para gerar HTML completo e enviá-lo ao navegador.

**Configuração:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Padrão é true
});
```

**Fluxo:**
1. O navegador solicita a página
2. O Server executa JavaScript e gera HTML completo
3. O HTML é enviado ao navegador
4. O navegador realiza Hydration (ativação das funcionalidades interativas)

**Vantagens:**
- ✅ Compatível com SEO (mecanismos de busca podem ver o conteúdo completo)
- ✅ Carregamento inicial rápido (não precisa esperar a execução do JavaScript)
- ✅ Suporte a conteúdo dinâmico (dados atualizados a cada requisição)

**Desvantagens:**
- ❌ Maior carga no Server (cada requisição requer renderização)
- ❌ TTFB (Time To First Byte) pode ser mais longo
- ❌ Requer ambiente de Server

**Cenários de aplicação:**
- Páginas de produtos de e-commerce (SEO + preços/estoque dinâmicos necessários)
- Páginas de artigos de notícias (SEO + conteúdo dinâmico necessário)
- Páginas de perfil de usuário (SEO + conteúdo personalizado necessário)

### 2.3 SSG (Static Site Generation)

**Definição:** No momento do build (Build Time), todas as páginas HTML são pré-geradas e implantadas como arquivos estáticos.

**Configuração:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG requer SSR como true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // Especificar rotas para pré-renderização
    },
  },
});

// Ou usando routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**Fluxo:**
1. Durante o build, JavaScript é executado para gerar HTML de todas as páginas
2. Os arquivos HTML são implantados no CDN
3. Ao solicitar, o navegador recebe diretamente o HTML pré-gerado

**Vantagens:**
- ✅ Melhor performance (cache CDN, resposta rápida)
- ✅ Compatível com SEO (conteúdo HTML completo)
- ✅ Carga mínima no Server (não requer renderização em tempo de execução)
- ✅ Baixo custo (pode ser implantado no CDN)

**Desvantagens:**
- ❌ Não adequado para conteúdo dinâmico (requer rebuild para atualizar)
- ❌ O tempo de build pode ser longo (com muitas páginas)
- ❌ Não pode lidar com conteúdo específico do usuário

**Cenários de aplicação:**
- Página "Sobre nós" (conteúdo fixo)
- Página de descrição de produto (conteúdo relativamente fixo)
- Artigos de blog (não mudam frequentemente após publicação)

### 2.4 CSR (Client-Side Rendering)

**Definição:** JavaScript é executado no navegador para gerar dinamicamente o conteúdo HTML.

**Configuração:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Desabilitar SSR globalmente
});

// Ou para rotas específicas
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// Ou configurar na página
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**Fluxo:**
1. O navegador solicita HTML (normalmente um shell vazio)
2. Download do bundle JavaScript
3. Execução do JavaScript, geração dinâmica do conteúdo
4. Renderização da página

**Vantagens:**
- ✅ Alta interatividade, ideal para SPA
- ✅ Redução da carga no Server
- ✅ Transições de página fluidas (sem necessidade de recarregamento)

**Desvantagens:**
- ❌ Não compatível com SEO (mecanismos de busca podem não indexar corretamente)
- ❌ Tempo de carregamento inicial mais longo (necessário baixar e executar JavaScript)
- ❌ JavaScript necessário para ver o conteúdo

**Cenários de aplicação:**
- Sistemas de administração backend (SEO não necessário)
- Dashboards de usuário (SEO não necessário)
- Aplicações interativas (jogos, ferramentas, etc.)

### 2.5 Hybrid Rendering (Renderização Híbrida)

**Definição:** Conforme os requisitos de diferentes páginas, vários Rendering Modes são usados de forma mista.

**Configuração:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSR padrão
  routeRules: {
    // Páginas que precisam de SEO: SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // Páginas com conteúdo fixo: SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // Páginas sem necessidade de SEO: CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**Vantagens:**
- ✅ Seleção do modo adequado com base nas características da página
- ✅ Equilíbrio entre SEO, performance e experiência de desenvolvimento
- ✅ Alta flexibilidade

**Cenários de aplicação:**
- Grandes projetos (diferentes páginas com diferentes requisitos)
- Plataformas de e-commerce (página de produto SSR, backend CSR, página sobre nós SSG)

### 2.6 ISR (Incremental Static Regeneration)

**Definição:** Regeneração estática incremental. Combina a performance do SSG com o dinamismo do SSR. As páginas geram HTML estático no momento do build ou na primeira requisição, e são armazenadas em cache por um período (TTL). Quando o cache expira, a próxima requisição regenera a página em segundo plano enquanto retorna o conteúdo antigo do cache (Stale-While-Revalidate).

**Configuração:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Habilitar ISR, cache de 1 hora (3600 segundos)
    '/blog/**': { swr: 3600 },
    // Ou usar a propriedade isr (suporte específico no Netlify/Vercel, etc.)
    '/products/**': { isr: 600 },
  },
});
```

**Fluxo:**
1. Requisição A chega: Server renderiza a página, retorna e armazena em cache (Cache MISS -> HIT).
2. Requisição B chega (dentro do TTL): Retorna diretamente o conteúdo em cache (Cache HIT).
3. Requisição C chega (após o TTL): Retorna o cache antigo (Stale), enquanto re-renderiza em segundo plano e atualiza o cache (Revalidate).
4. Requisição D chega: Retorna o novo conteúdo em cache.

**Vantagens:**
- ✅ Performance próxima do ideal do SSG
- ✅ Resolve o problema do tempo longo de build do SSG
- ✅ O conteúdo pode ser atualizado periodicamente

**Cenários de aplicação:**
- Blogs grandes
- Páginas de detalhe de produtos de e-commerce
- Sites de notícias

### 2.7 Route Rules e estratégias de cache

O Nuxt 3 usa `routeRules` para gerenciar de forma unificada a renderização híbrida e as estratégias de cache. Isso é processado no nível do Nitro.

| Propriedade | Significado | Cenários de aplicação |
|------|------|---------|
| `ssr: true` | Forçar Server-Side Rendering | SEO + alta dinamicidade |
| `ssr: false` | Forçar Client-Side Rendering (SPA) | Backend, dashboard |
| `prerender: true` | Pré-renderizar no build (SSG) | Sobre nós, página de termos |
| `swr: true` | Habilitar cache SWR (sem tempo de expiração, até reimplantação) | Conteúdo com mudanças mínimas |
| `swr: 60` | Habilitar ISR, cache de 60 segundos | Páginas de listagem, páginas de eventos |
| `cache: { maxAge: 60 }` | Definir header Cache-Control (cache navegador/CDN) | Recursos estáticos |

---

## 3. Estratégia de seleção

### 3.1 Selecionar Rendering Mode conforme os requisitos

**Diagrama de decisão:**

```
Precisa de SEO?
├─ Sim → O conteúdo muda frequentemente?
│   ├─ Sim → SSR
│   └─ Não → SSG
└─ Não → CSR
```

**Tabela de comparação:**

| Requisito | Modo recomendado | Razão |
|------|---------|------|
| **Precisa de SEO** | SSR / SSG | Mecanismos de busca podem ver o conteúdo completo |
| **Conteúdo muda frequentemente** | SSR | Conteúdo atualizado a cada requisição |
| **Conteúdo relativamente fixo** | SSG | Melhor performance, menor custo |
| **Não precisa de SEO** | CSR | Alta interatividade, transições fluidas |
| **Muitas páginas** | SSG | Geradas no build, cache CDN |
| **Conteúdo específico do usuário** | SSR / CSR | Requer geração dinâmica |

### 3.2 Casos práticos

#### Caso 1: Plataforma de e-commerce

**Requisitos:**
- Páginas de produtos precisam de SEO (indexação do Google)
- Conteúdo dos produtos muda frequentemente (preços, estoque)
- Páginas pessoais dos usuários não precisam de SEO

**Solução:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Página de produto: SSR (SEO + conteúdo dinâmico necessário)
    '/products/**': { ssr: true },

    // Sobre nós: SSG (conteúdo fixo)
    '/about': { prerender: true },

    // Página de usuário: CSR (SEO não necessário)
    '/user/**': { ssr: false },
  },
});
```

#### Caso 2: Site de blog

**Requisitos:**
- Páginas de artigos precisam de SEO
- Conteúdo dos artigos é relativamente fixo (não muda frequentemente após publicação)
- Carregamento rápido necessário

**Solução:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Página de artigo: SSG (conteúdo fixo + SEO necessário)
    '/articles/**': { prerender: true },

    // Página inicial: SSG (conteúdo fixo)
    '/': { prerender: true },

    // Administração backend: CSR (SEO não necessário)
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. Pontos-chave para a entrevista

### 4.1 Rendering Modes do Nuxt 3

**Você pode responder assim:**

> O Nuxt 3 suporta quatro Rendering Modes: SSR renderiza no Server a cada requisição, adequado para páginas que precisam de SEO com conteúdo dinâmico; SSG pré-gera HTML no momento do build, adequado para páginas que precisam de SEO com conteúdo fixo, com a melhor performance; CSR renderiza no navegador, adequado para páginas sem necessidade de SEO com alta interatividade; Hybrid Rendering mistura vários modos, escolhendo o modo adequado conforme os requisitos de cada página.

**Pontos-chave:**
- ✅ Características e diferenças dos quatro modos
- ✅ Cenários de aplicação e critérios de seleção
- ✅ Vantagens do Hybrid Rendering

### 4.2 Como escolher o Rendering Mode?

**Você pode responder assim:**

> A seleção do Rendering Mode considera principalmente três fatores: requisitos de SEO, dinamismo do conteúdo e requisitos de performance. Páginas que precisam de SEO escolhem SSR ou SSG; conteúdo que muda frequentemente escolhe SSR; conteúdo fixo escolhe SSG; páginas sem necessidade de SEO podem escolher CSR. Em projetos reais, geralmente se usa Hybrid Rendering, escolhendo o modo adequado conforme as características de cada página. Por exemplo, em uma plataforma de e-commerce, as páginas de produto usam SSR (SEO + conteúdo dinâmico), a página sobre nós usa SSG (conteúdo fixo), e as páginas pessoais de usuários usam CSR (sem necessidade de SEO).

**Pontos-chave:**
- ✅ Seleção baseada em requisitos de SEO, dinamismo do conteúdo e performance
- ✅ Uso misto de vários modos em projetos reais
- ✅ Explicação com casos concretos

### 4.3 ISR e Route Rules
**Q: Como implementar ISR (Incremental Static Regeneration)? Quais são os mecanismos de caching do Nuxt 3?**

> **Exemplo de resposta:**
> No Nuxt 3, podemos implementar ISR através das `routeRules`.
> Basta configurar `{ swr: segundos }` no `nuxt.config.ts` para que o Nitro habilite automaticamente o mecanismo Stale-While-Revalidate.
> Por exemplo, `'/blog/**': { swr: 3600 }` significa que as páginas sob esse caminho serão armazenadas em cache por 1 hora.
> `routeRules` é muito poderoso, permitindo configurar diferentes estratégias para diferentes caminhos: algumas páginas usam SSR, outras SSG (`prerender: true`), outras ISR (`swr`), e outras CSR (`ssr: false`), essa é a essência do Hybrid Rendering.

---

## 5. Melhores práticas

### 5.1 Princípios de seleção

1. **Páginas que precisam de SEO**
   - Conteúdo fixo → SSG
   - Conteúdo dinâmico → SSR

2. **Páginas sem necessidade de SEO**
   - Alta interatividade → CSR
   - Lógica no Server necessária → SSR

3. **Estratégia mista**
   - Escolher o modo adequado conforme as características da página
   - Gestão unificada com `routeRules`

### 5.2 Recomendações de configuração

1. **Usar SSR por padrão**
   - Garantir compatibilidade com SEO
   - Pode ser ajustado posteriormente para páginas específicas

2. **Gestão unificada com routeRules**
   - Configuração centralizada, fácil manutenção
   - Identificação clara do modo de renderização de cada página

3. **Revisão e otimização periódica**
   - Ajustar conforme o uso real
   - Monitorar métricas de performance

---

## 6. Resumo para a entrevista

**Você pode responder assim:**

> O Nuxt 3 suporta quatro Rendering Modes: SSR, SSG, CSR e Hybrid Rendering. SSR é adequado para páginas com SEO e conteúdo dinâmico; SSG é adequado para páginas com SEO e conteúdo fixo, com a melhor performance; CSR é adequado para páginas sem SEO e alta interatividade. A seleção considera principalmente requisitos de SEO, dinamismo do conteúdo e performance. Em projetos reais, geralmente se usa Hybrid Rendering, escolhendo o modo adequado conforme as características de cada página. Por exemplo, em uma plataforma de e-commerce, as páginas de produto usam SSR, a página sobre nós usa SSG, e as páginas de usuário usam CSR.

**Pontos-chave:**
- ✅ Características e diferenças dos quatro Rendering Modes
- ✅ Estratégia de seleção e fatores de avaliação
- ✅ Experiência de implementação com Hybrid Rendering
- ✅ Casos de projetos reais

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
