---
id: performance-lv1-route-optimization
title: '[Lv1] Otimizacao a nivel de rota: tres camadas de Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Atraves de tres camadas de Lazy Loading de rotas, reduzimos o carregamento inicial de 12.5MB para 850KB, diminuindo o tempo da primeira tela em 70%.

---

## Contexto do problema (Situation)

Caracteristicas do projeto:

- **27+ templates multi-tenant diferentes** (arquitetura multi-tenant)
- **Cada template tem 20-30 paginas** (pagina inicial, lobby, promocoes, agente, noticias, etc.)
- **Se todo o codigo fosse carregado de uma vez**: o primeiro acesso exigiria download de **10MB+ de arquivos JS**
- **Tempo de espera do usuario superior a 10 segundos** (especialmente em redes moveis)

## Objetivo da otimizacao (Task)

1. **Reduzir o volume de JavaScript no primeiro carregamento** (meta: < 1MB)
2. **Diminuir o tempo da primeira tela** (meta: < 3 segundos)
3. **Carregamento sob demanda** (usuario baixa apenas o que precisa)
4. **Manter a experiencia de desenvolvimento** (sem impactar a eficiencia de desenvolvimento)

## Solucao (Action)

Adotamos a estrategia de **tres camadas de Lazy Loading de rotas**, otimizando do "template" -> "pagina" -> "permissoes" em tres niveis.

### Camada 1: carregamento dinamico de template

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Carrega dinamicamente as rotas do template correspondente com base nas variaveis de ambiente
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Explicacao:

- O projeto tem 27 templates, mas o usuario utiliza apenas 1
- Determina a marca atual atraves de environment.json
- Carrega apenas a configuracao de rotas dessa marca; os outros 26 templates nao sao carregados

Resultado:

- Reducao de aproximadamente 85% do codigo de configuracao de rotas no primeiro carregamento

### Camada 2: Lazy Loading de paginas

```typescript
// Abordagem tradicional (ruim)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Todas as paginas sao empacotadas no main.js

// Nossa abordagem (boa)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Cada rota utiliza arrow function + import()
- Somente quando o usuario realmente acessa a pagina, o chunk JS correspondente e baixado
- O Vite empacota automaticamente cada pagina como um arquivo independente

### Camada 3: estrategia de carregamento sob demanda

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Usuarios nao autenticados nao carregarao paginas como "Centro do Agente"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Resultados da otimizacao (Result)

**Antes da otimizacao:**

```
Primeiro carregamento: main.js (12.5 MB)
Tempo da primeira tela: 8-12 segundos
Inclui todos os 27 templates + todas as paginas
```

**Apos otimizacao:**

```markdown
Primeiro carregamento: main.js (850 KB) - 93%
Tempo da primeira tela: 1.5-2.5 segundos + 70%
Inclui apenas codigo central + pagina inicial atual
```

**Dados concretos:**

- Reducao do volume JavaScript: **12.5 MB -> 850 KB (reducao de 93%)**
- Reducao do tempo da primeira tela: **10 segundos -> 2 segundos (melhoria de 70%)**
- Carregamento de paginas subsequentes: **media de 300-500 KB por pagina**
- Pontuacao de experiencia do usuario: **de 45 para 92 pontos (Lighthouse)**

**Valor comercial:**

- Taxa de rejeicao caiu 35%
- Tempo de permanencia na pagina aumentou 50%
- Taxa de conversao aumentou 25%

## Pontos-chave para entrevista

**Perguntas de extensao comuns:**

1. **P: Por que nao usar React.lazy() ou componentes assincronos do Vue?**
   R: Na verdade usamos componentes assincronos do Vue (`() => import()`), mas o ponto-chave e a **arquitetura de tres camadas**:

   - Camada 1 (template): decidido em tempo de compilacao (configuracao do Vite)
   - Camada 2 (pagina): Lazy Loading em tempo de execucao
   - Camada 3 (permissoes): controle por guardas de navegacao

   Lazy loading simples cobre apenas a camada 2; nos adicionamos a separacao a nivel de template.

2. **P: Como decidir qual codigo deve ficar no main.js?**
   R: Usando a configuracao `manualChunks` do Vite:

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

   Principio: apenas o que "toda pagina utiliza" vai no vendor chunk.

3. **P: Lazy Loading nao afeta a experiencia do usuario (tempo de espera)?**
   R: Temos duas estrategias para lidar com isso:

   - **Prefetch**: pre-carregar paginas que provavelmente serao acessadas durante momentos ociosos
   - **Estado de loading**: usar Skeleton Screen em vez de tela branca

   Testes reais: tempo medio de carregamento de paginas subsequentes < 500ms, imperceptivel pelo usuario.

4. **P: Como medir o efeito da otimizacao?**
   R: Usando combinacao de varias ferramentas:

   - **Lighthouse**: Performance Score (45 -> 92)
   - **Webpack Bundle Analyzer**: analise visual do tamanho dos chunks
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: dados reais dos usuarios

5. **P: Quais sao os trade-offs?**
   R:
   - Pode haver problemas de dependencia circular durante o desenvolvimento (necessario ajustar estrutura de modulos)
   - Primeira troca de rota tem breve tempo de carregamento (resolvido com prefetch)
   - Mas o beneficio geral supera os custos, especialmente a melhoria perceptivel na experiencia de usuarios moveis
