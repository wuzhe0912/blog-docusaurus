---
id: performance-lv1-image-optimization
title: '[Lv1] Otimizacao de carregamento de imagens: quatro camadas de Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Atraves de uma estrategia de quatro camadas de lazy loading de imagens, reduzimos o trafego de imagens da primeira tela de 60MB para 2MB, melhorando o tempo de carregamento em 85%.

---

## Contexto do problema (Situation)

> Imagine que voce esta navegando em uma pagina pelo celular. A tela mostra apenas 10 imagens, mas a pagina carrega os dados completos de 500 imagens de uma vez. Seu celular vai travar e o consumo de dados vai disparar para 50MB instantaneamente.

**Situacao real do projeto:**

```markdown
Estatisticas de uma pagina inicial
- 300+ miniaturas (150-300KB cada)
- 50+ banners promocionais
- Se tudo for carregado: 300 x 200KB = 60MB+ de dados de imagem

Problemas reais
- Primeira tela mostra apenas 8-12 imagens
- O usuario pode rolar ate a imagem 30 e sair
- As 270 imagens restantes sao carregadas inutilmente (desperdicio de trafego + lentidao)

Impacto
- Tempo do primeiro carregamento: 15-20 segundos
- Consumo de trafego: 60MB+ (usuarios reclamando)
- Travamento da pagina: rolagem nao fluida
- Taxa de rejeicao: 42% (muito alta)
```

## Objetivo da otimizacao (Task)

1. **Carregar apenas imagens na area visivel**
2. **Pre-carregar imagens prestes a entrar na viewport** (iniciar carregamento 50px antes)
3. **Controlar concorrencia** (evitar carregar muitas imagens simultaneamente)
4. **Prevenir desperdicio de recursos por troca rapida**
5. **Trafego de imagens da primeira tela < 3MB**

## Solucao (Action)

### Implementacao de v-lazy-load.ts

> Quatro camadas de image lazy load

#### Primeira camada: deteccao de visibilidade na viewport (IntersectionObserver)

```js
// Criar observador para monitorar se a imagem entrou na viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Imagem entrou na area visivel
        // Iniciar carregamento da imagem
      }
    });
  },
  {
    rootMargin: '50px 0px', // Iniciar carregamento 50px antes (pre-carregamento)
    threshold: 0.1, // Acionar quando 10% estiver visivel
  }
);
```

- Utiliza a API nativa IntersectionObserver do navegador (performance muito superior a eventos de scroll)
- rootMargin: "50px" -> quando a imagem ainda esta 50px abaixo, o carregamento ja comeca; quando o usuario chega la, ja esta pronta (sensacao mais fluida)
- Imagens fora da viewport nao sao carregadas

#### Segunda camada: mecanismo de controle de concorrencia (gerenciamento de fila)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // Maximo de 6 imagens simultaneas
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Tem vaga, carregar imediatamente
    } else {
      this.queue.push(loadFn)   // Sem vaga, entrar na fila
    }
  }
}
```

- Mesmo que 20 imagens entrem na viewport simultaneamente, apenas 6 serao carregadas ao mesmo tempo
- Evita "carregamento em cascata" que bloqueia o navegador (Chrome permite no maximo 6 requisicoes simultaneas por padrao)
- Apos o carregamento, processa automaticamente a proxima da fila

```md
Usuario rola rapidamente ate o final -> 30 imagens acionadas simultaneamente
Sem gerenciamento de fila: 30 requisicoes enviadas de uma vez -> navegador trava
Com gerenciamento de fila: primeiras 6 carregam -> apos completar, proximas 6 -> fluido
```

#### Terceira camada: resolucao de race condition de recursos (controle de versao)

```js
// Definir numero de versao no carregamento
el.setAttribute('data-version', Date.now().toString());

// Verificar versao apos carregamento
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Versao consistente, exibir imagem
  } else {
    // Versao inconsistente, usuario ja mudou para outro conteudo, nao exibir
  }
};
```

Caso real:

```md
Acoes do usuario:

1. Clica na categoria "Noticias" -> aciona carregamento de 100 imagens (versao 1001)
2. 0.5 segundo depois clica em "Promocoes" -> aciona carregamento de 80 imagens (versao 1002)
3. As imagens de noticias terminam de carregar 1 segundo depois

Sem controle de versao: exibe imagens de noticias (errado!)
Com controle de versao: verifica versao inconsistente, descarta imagens de noticias (correto!)
```

#### Quarta camada: estrategia de placeholder (imagem transparente Base64)

```js
// Exibir SVG transparente 1x1 por padrao para evitar deslocamento de layout
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// URL real da imagem armazenada em data-src
el.setAttribute('data-src', realImageUrl);
```

- Usa SVG transparente codificado em Base64 (apenas 100 bytes)
- Evita CLS (Cumulative Layout Shift)
- O usuario nao vera o fenomeno de "imagem aparecendo de repente"

## Resultados da otimizacao (Result)

**Antes da otimizacao:**

```markdown
Imagens da primeira tela: carregamento de 300 imagens de uma vez (60MB)
Tempo de carregamento: 15-20 segundos
Fluidez da rolagem: travamento severo
Taxa de rejeicao: 42%
```

**Apos otimizacao:**

```markdown
Imagens da primeira tela: apenas 8-12 imagens (2MB) - 97%
Tempo de carregamento: 2-3 segundos + 85%
Fluidez da rolagem: fluida (60fps)
Taxa de rejeicao: 28% - 33%
```

**Dados concretos:**

- Trafego de imagens da primeira tela: **60 MB -> 2 MB (reducao de 97%)**
- Tempo de carregamento de imagens: **15 segundos -> 2 segundos (melhoria de 85%)**
- FPS de rolagem da pagina: **de 20-30 para 55-60**
- Uso de memoria: **reducao de 65%** (imagens nao carregadas nao ocupam memoria)

**Indicadores tecnicos:**

- Performance do IntersectionObserver: muito superior ao evento scroll tradicional (reducao de 80% no uso de CPU)
- Efeito do controle de concorrencia: evita bloqueio de requisicoes do navegador
- Taxa de acerto do controle de versao: 99.5% (rarissimas imagens incorretas)

## Pontos-chave para entrevista

**Perguntas de extensao comuns:**

1. **P: Por que nao usar diretamente o atributo `loading="lazy"`?**
   R: O `loading="lazy"` nativo tem algumas limitacoes:

   - Nao e possivel controlar a distancia de pre-carregamento (o navegador decide)
   - Nao e possivel controlar a quantidade de concorrencia
   - Nao e possivel lidar com controle de versao (problema de troca rapida)
   - Navegadores antigos nao suportam

   Diretiva personalizada fornece controle mais preciso, adequado para nossos cenarios complexos.

2. **P: Em que o IntersectionObserver e melhor que eventos de scroll?**
   R:

   ```javascript
   // Evento scroll tradicional
   window.addEventListener('scroll', () => {
     // Dispara a cada rolagem (60 vezes/segundo)
     // Precisa calcular posicao do elemento (getBoundingClientRect)
     // Pode causar reflow forcado (assassino de performance)
   });

   // IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Dispara apenas quando elemento entra/sai da viewport
   // Otimizacao nativa do navegador, nao bloqueia a thread principal
   // Melhoria de performance de 80%
   ```

3. **P: De onde vem o limite de 6 imagens no controle de concorrencia?**
   R: E baseado no **limite de concorrencia HTTP/1.1 por origem** do navegador:

   - Chrome/Firefox: maximo de 6 conexoes simultaneas por dominio
   - Requisicoes alem do limite ficam na fila
   - HTTP/2 pode ter mais, mas considerando compatibilidade, mantemos em 6
   - Testes reais: 6 imagens simultaneas e o melhor equilibrio entre performance e experiencia

4. **P: Por que usar timestamp em vez de UUID para controle de versao?**
   R:

   - Timestamp: `Date.now()` (simples, suficiente, ordenavel)
   - UUID: `crypto.randomUUID()` (mais rigoroso, mas over-engineering)
   - Nosso cenario: timestamp ja e suficientemente unico (nivel de milissegundos)
   - Consideracao de performance: geracao de timestamp e mais rapida

5. **P: Como lidar com falha no carregamento de imagens?**
   R: Implementamos fallback em multiplas camadas:

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. Tentar novamente 3 vezes
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Exibir imagem padrao
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **P: Havera problemas de CLS (Cumulative Layout Shift)?**
   R: Tres estrategias para evitar:

   ```html
   <!-- 1. SVG placeholder padrao -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio para proporcao fixa -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Pontuacao CLS final: < 0.1 (excelente)
