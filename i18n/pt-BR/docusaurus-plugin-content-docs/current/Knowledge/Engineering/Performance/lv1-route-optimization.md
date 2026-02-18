---
id: performance-lv1-route-optimization
title: '[Lv1] Otimização a nível de rota: três camadas de Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Através de três camadas de Lazy Loading de rotas, reduzimos o carregamento inicial de 12.5MB para 850KB, diminuindo o tempo da primeira tela em 70%.

---

## Contexto do problema (Situation)

Características do projeto:

- **27+ templates multi-tenant diferentes** (arquitetura multi-tenant)
- **Cada template tem 20-30 páginas** (página inicial, lobby, promocoes, agente, notícias, etc.)
- **Se todo o código fosse carregado de uma vez**: o primeiro acesso exigiria download de **10MB+ de arquivos JS**
- **Tempo de espera do usuário superior a 10 segundos** (especialmente em redes móveis)

## Objetivo da otimização (Task)

1. **Reduzir o volume de JavaScript no primeiro carregamento** (meta: < 1MB)
2. **Diminuir o tempo da primeira tela** (meta: < 3 segundos)
3. **Carregamento sob demanda** (usuário baixa apenas o que precisa)
4. **Manter a experiência de desenvolvimento** (sem impactar a eficiencia de desenvolvimento)

## Solução (Action)

Adotamos a estratégia de **três camadas de Lazy Loading de rotas**, otimizando do "template" -> "página" -> "permissões" em três níveis.

### Camada 1: carregamento dinâmico de template

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Carrega dinamicamente as rotas do template correspondente com base nas variáveis de ambiente
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Explicacao:

- O projeto tem 27 templates, mas o usuário utiliza apenas 1
- Determina a marca atual através de environment.json
- Carrega apenas a configuração de rotas dessa marca; os outros 26 templates não são carregados

Resultado:

- Reducao de aproximadamente 85% do código de configuração de rotas no primeiro carregamento

### Camada 2: Lazy Loading de páginas

```typescript
// Abordagem tradicional (ruim)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Todas as paginas sao empacotadas no main.js

// Nossa abordagem (boa)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Cada rota utiliza arrow function + import()
- Somente quando o usuário realmente acessa a página, o chunk JS correspondente e baixado
- O Vite empacota automaticamente cada página como um arquivo independente

### Camada 3: estratégia de carregamento sob demanda

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Usuarios não autenticados não carregarao páginas como "Centro do Agente"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Resultados da otimização (Result)

**Antes da otimização:**

```
Primeiro carregamento: main.js (12.5 MB)
Tempo da primeira tela: 8-12 segundos
Inclui todos os 27 templates + todas as paginas
```

**Após otimização:**

```markdown
Primeiro carregamento: main.js (850 KB) - 93%
Tempo da primeira tela: 1.5-2.5 segundos + 70%
Inclui apenas codigo central + pagina inicial atual
```

**Dados concretos:**

- Reducao do volume JavaScript: **12.5 MB -> 850 KB (redução de 93%)**
- Reducao do tempo da primeira tela: **10 segundos -> 2 segundos (melhoria de 70%)**
- Carregamento de páginas subsequentes: **média de 300-500 KB por página**
- Pontuacao de experiência do usuário: **de 45 para 92 pontos (Lighthouse)**

**Valor comercial:**

- Taxa de rejeição caiu 35%
- Tempo de permanência na página aumentou 50%
- Taxa de conversão aumentou 25%

## Pontos-chave para entrevista

**Perguntas de extensão comuns:**

1. **P: Por que não usar React.lazy() ou componentes assincronos do Vue?**
   R: Na verdade usamos componentes assincronos do Vue (`() => import()`), mas o ponto-chave e a **arquitetura de três camadas**:

   - Camada 1 (template): decidido em tempo de compilação (configuração do Vite)
   - Camada 2 (página): Lazy Loading em tempo de execução
   - Camada 3 (permissões): controle por guardas de navegação

   Lazy loading simples cobre apenas a camada 2; nos adicionamos a separação a nível de template.

2. **P: Como decidir qual código deve ficar no main.js?**
   R: Usando a configuração `manualChunks` do Vite:

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   Princípio: apenas o que "toda página utiliza" vai no vendor chunk.

3. **P: Lazy Loading não afeta a experiência do usuário (tempo de espera)?**
   R: Temos duas estratégias para lidar com isso:

   - **Prefetch**: pre-carregar páginas que provavelmente serao acessadas durante momentos ociosos
   - **Estado de loading**: usar Skeleton Screen em vez de tela branca

   Testes reais: tempo medio de carregamento de páginas subsequentes < 500ms, imperceptível pelo usuário.

4. **P: Como medir o efeito da otimização?**
   R: Usando combinação de várias ferramentas:

   - **Lighthouse**: Performance Score (45 -> 92)
   - **Webpack Bundle Analyzer**: análise visual do tamanho dos chunks
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: dados reais dos usuários

5. **P: Quais são os trade-offs?**
   R:
   - Pode haver problemas de dependência circular durante o desenvolvimento (necessário ajustar estrutura de módulos)
   - Primeira troca de rota tem breve tempo de carregamento (resolvido com prefetch)
   - Mas o beneficio geral supera os custos, especialmente a melhoria perceptivel na experiência de usuários móveis
