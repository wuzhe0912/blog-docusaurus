---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Explique e compare as vantagens e desvantagens de SPA e SSR

### SPA (Aplicacao de Pagina Unica)

#### Vantagens do SPA

1. Experiencia do usuario: A essencia do SPA e uma unica pagina que carrega dados dinamicamente e combina o roteamento frontend para dar ao usuario a impressao de estar navegando entre paginas, quando na realidade apenas os components mudam. Essa experiencia e naturalmente mais fluida e rapida.
2. Separacao frontend-backend: O frontend cuida apenas da renderizacao e interacao da pagina, enquanto o backend apenas fornece APIs de dados. Isso reduz a carga de desenvolvimento de ambos os lados e facilita a manutencao.
3. Otimizacao de rede: A pagina so precisa ser carregada uma vez, diferente da estrutura multi-paginas tradicional que requer recarregamento a cada troca de pagina, reduzindo as requisicoes e a carga do servidor.

#### Desvantagens do SPA

1. SEO: As paginas SPA sao carregadas dinamicamente, entao os motores de busca nao conseguem capturar diretamente o conteudo (embora o Google afirme estar melhorando isso). Perante os crawlers de busca, ainda e inferior ao HTML tradicional.
2. Tempo de carregamento inicial: O SPA precisa carregar e executar JavaScript no cliente antes de renderizar a pagina, portanto o tempo de carregamento inicial e mais longo, especialmente com condicoes de rede ruins.

### SSR (Renderizacao do Lado do Servidor)

#### Vantagens do SSR

1. SEO: O SSR renderiza a pagina com dados no servidor, entao os motores de busca podem capturar diretamente o conteudo. Esta e a maior vantagem do SSR.
2. Tempo de carregamento: O SSR transfere a carga de renderizacao para o servidor, o que pode encurtar o tempo de renderizacao na primeira visita.

#### Desvantagens do SSR

1. Custo de aprendizado e complexidade: Tomando Next e Nuxt como exemplo, embora sejam baseados em React e Vue, desenvolveram seus proprios ecossistemas, aumentando o custo de aprendizado. Olhando a recente revisao do Next.js 14, nem todos os desenvolvedores conseguem aceitar tais mudancas.
2. Carga do servidor: A transferencia do trabalho de renderizacao para o servidor pode causar maior carga, especialmente em cenarios de alto trafego.

### Conclusao

Em principio, para sistemas de backoffice sem necessidade de SEO, nao e necessario usar frameworks SSR. Para paginas web de produtos que dependem de motores de busca, vale a pena avaliar a adocao de um framework SSR.

## 2. Descreva os Web Frameworks utilizados e compare suas vantagens e desvantagens

**Ambos convergem para o "desenvolvimento de componentes baseado em funcoes":**

> Vue 3 divide a logica em composables reutilizaveis atraves da Composition API; React tem Hooks como nucleo. A experiencia de desenvolvimento e muito similar, mas no geral Vue tem menor custo de entrada, enquanto React e mais forte em ecossistema e flexibilidade.

### Vue (principalmente Vue 3)

**Vantagens:**

- **Curva de aprendizado mais suave**: SFC (Single File Component) agrupa template / script / style, sendo muito acessivel para desenvolvedores vindos do frontend tradicional (templates backend).
- **Convencoes oficiais claras, benefico para equipes**: O guia de estilo e convencoes oficiais sao claros, facilitando a manutencao da consistencia quando novos membros assumem projetos.
- **Ecossistema central completo**: Oficialmente sao mantidos Vue Router, Pinia (ou Vuex), CLI / Vite Plugin, etc., com "solucoes oficiais" desde a criacao do projeto ate gerenciamento de estado e roteamento.
- **Composition API melhora a manutenibilidade**: A logica pode ser separada por funcionalidade em composables (ex: useAuth, useForm), compartilhando logica e reduzindo codigo duplicado em projetos grandes.

**Desvantagens:**

- **Ecossistema e comunidade ligeiramente menores que React**: A quantidade e diversidade de pacotes de terceiros e menor, e algumas ferramentas ou integracoes de vanguarda priorizam React.
- **Mercado de trabalho relativamente concentrado em regioes/industrias especificas**: Comparado com React, equipes internacionais ou multinacionais usam predominantemente React, sendo relativamente desvantajoso em flexibilidade de carreira (mas no mundo sinofono e cerca de metade-metade).

---

### React

**Vantagens:**

- **Ecossistema enorme com atualizacoes tecnologicas rapidas**: Quase todas as novas tecnologias frontend, sistemas de design ou servicos de terceiros oferecem prioritariamente versao React.
- **Alta flexibilidade, livre combinacao do stack tecnologico**: Compativel com Redux / Zustand / Recoil e outros gerenciadores de estado, alem de Meta Frameworks como Next.js, Remix, com solucoes maduras de SPA a SSR, SSG, CSR.
- **Integracao madura com TypeScript e engenharia frontend**: Muita discussao comunitaria sobre tipagem e melhores praticas para projetos grandes, util para projetos mantidos a longo prazo.

**Desvantagens:**

- **Alta liberdade requer normas proprias da equipe**: Sem estilo de codigo claro ou convencoes de arquitetura, diferentes desenvolvedores podem usar estilos e metodos de gerenciamento de estado completamente diferentes, aumentando os custos de manutencao.
- **A curva de aprendizado nao e realmente baixa**: Alem do React (JSX, pensamento de Hooks), e preciso enfrentar Router, gerenciamento de estado, busca de dados, SSR, etc., e iniciantes se perdem facilmente em "qual library escolher".
- **Mudancas de API e evolucao de melhores praticas sao rapidas**: De Class Component para Function Component + Hooks, depois Server Components, quando projetos antigos e novos estilos coexistem, custos adicionais de migracao e manutencao sao necessarios.
