---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Explique e compare as vantagens e desvantagens de SPA e SSR

### SPA (Aplicação de Página Única)

#### Vantagens do SPA

1. Experiência do usuário: A essência do SPA é uma única página que carrega dados dinamicamente e combina o roteamento frontend para dar ao usuário a impressão de estar navegando entre páginas, quando na realidade apenas os components mudam. Essa experiência é naturalmente mais fluida e rápida.
2. Separação frontend-backend: O frontend cuida apenas da renderização e interação da página, enquanto o backend apenas fornece APIs de dados. Isso reduz a carga de desenvolvimento de ambos os lados e facilita a manutenção.
3. Otimização de rede: A página só precisa ser carregada uma vez, diferente da estrutura multi-páginas tradicional que requer recarregamento a cada troca de página, reduzindo as requisições é a carga do servidor.

#### Desvantagens do SPA

1. SEO: As páginas SPA são carregadas dinamicamente, então os motores de busca não conseguem capturar diretamente o conteúdo (embora o Google afirme estar melhorando isso). Perante os crawlers de busca, ainda é inferior ao HTML tradicional.
2. Tempo de carregamento inicial: O SPA precisa carregar e executar JavaScript no cliente antes de renderizar a página, portanto o tempo de carregamento inicial é mais longo, especialmente com condições de rede ruins.

### SSR (Renderização do Lado do Servidor)

#### Vantagens do SSR

1. SEO: O SSR renderiza a página com dados no servidor, então os motores de busca podem capturar diretamente o conteúdo. Esta é a maior vantagem do SSR.
2. Tempo de carregamento: O SSR transfere a carga de renderização para o servidor, o que pode encurtar o tempo de renderização na primeira visita.

#### Desvantagens do SSR

1. Custo de aprendizado e complexidade: Tomando Next e Nuxt como exemplo, embora sejam baseados em React e Vue, desenvolveram seus próprios ecossistemas, aumentando o custo de aprendizado. Olhando a recente revisão do Next.js 14, nem todos os desenvolvedores conseguem aceitar tais mudanças.
2. Carga do servidor: A transferência do trabalho de renderização para o servidor pode causar maior carga, especialmente em cenários de alto tráfego.

### Conclusão

Em princípio, para sistemas de backoffice sem necessidade de SEO, não é necessário usar frameworks SSR. Para páginas web de produtos que dependem de motores de busca, vale a pena avaliar a adoção de um framework SSR.

## 2. Descreva os Web Frameworks utilizados e compare suas vantagens e desvantagens

**Ambos convergem para o "desenvolvimento de componentes baseado em funções":**

> Vue 3 divide a lógica em composables reutilizáveis através da Composition API; React tem Hooks como núcleo. A experiência de desenvolvimento é muito similar, mas no geral Vue tem menor custo de entrada, enquanto React é mais forte em ecossistema e flexibilidade.

### Vue (principalmente Vue 3)

**Vantagens:**

- **Curva de aprendizado mais suave**: SFC (Single File Component) agrupa template / script / style, sendo muito acessível para desenvolvedores vindos do frontend tradicional (templates backend).
- **Convenções oficiais claras, benéfico para equipes**: O guia de estilo e convenções oficiais são claros, facilitando a manutenção da consistência quando novos membros assumem projetos.
- **Ecossistema central completo**: Oficialmente são mantidos Vue Router, Pinia (ou Vuex), CLI / Vite Plugin, etc., com "soluções oficiais" desde a criação do projeto até gerenciamento de estado e roteamento.
- **Composition API melhora a manutenibilidade**: A lógica pode ser separada por funcionalidade em composables (ex: useAuth, useForm), compartilhando lógica e reduzindo código duplicado em projetos grandes.

**Desvantagens:**

- **Ecossistema e comunidade ligeiramente menores que React**: A quantidade e diversidade de pacotes de terceiros é menor, e algumas ferramentas ou integrações de vanguarda priorizam React.
- **Mercado de trabalho relativamente concentrado em regiões/indústrias específicas**: Comparado com React, equipes internacionais ou multinacionais usam predominantemente React, sendo relativamente desvantajoso em flexibilidade de carreira (mas no mundo sinófono é cerca de metade-metade).

---

### React

**Vantagens:**

- **Ecossistema enorme com atualizações tecnológicas rápidas**: Quase todas as novas tecnologias frontend, sistemas de design ou serviços de terceiros oferecem prioritariamente versão React.
- **Alta flexibilidade, livre combinação do stack tecnológico**: Compatível com Redux / Zustand / Recoil e outros gerenciadores de estado, além de Meta Frameworks como Next.js, Remix, com soluções maduras de SPA a SSR, SSG, CSR.
- **Integração madura com TypeScript e engenharia frontend**: Muita discussão comunitária sobre tipagem é melhores práticas para projetos grandes, útil para projetos mantidos a longo prazo.

**Desvantagens:**

- **Alta liberdade requer normas próprias da equipe**: Sem estilo de código claro ou convenções de arquitetura, diferentes desenvolvedores podem usar estilos e métodos de gerenciamento de estado completamente diferentes, aumentando os custos de manutenção.
- **A curva de aprendizado não é realmente baixa**: Além do React (JSX, pensamento de Hooks), é preciso enfrentar Router, gerenciamento de estado, busca de dados, SSR, etc., e iniciantes se perdem facilmente em "qual library escolher".
- **Mudanças de API e evolução de melhores práticas são rápidas**: De Class Component para Function Component + Hooks, depois Server Components, quando projetos antigos e novos estilos coexistem, custos adicionais de migração e manutenção são necessários.
