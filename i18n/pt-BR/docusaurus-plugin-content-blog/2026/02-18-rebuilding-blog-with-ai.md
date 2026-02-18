---
slug: rebuilding-blog-with-ai
title: 'Reconstruindo meu blog inteiro com Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Antes de 2023-2024, eu ainda achava que blogs técnicos tradicionais tinham bastante valor. Dava pra organizar suas anotações, experiências de entrevista, problemas que apareceram, e até aqueles detalhes e armadilhas que você tropeçou pelo caminho.

Mas a partir de meados de 2025, os modelos começaram a iterar cada vez mais rápido e ficaram cada vez mais fortes. Até o Cursor — que no primeiro semestre de 2025 eu achava bem decente como AI Code Editor — no segundo semestre já dava pra sentir claramente que não tinha como competir com o Claude Code. Foi aí que eu soube que precisava acompanhar os tempos e reformular o blog inteiro do zero (na esperança de que ainda tivesse algum valor).

<!--truncate-->

## Dados

Vou começar com os dados, porque esse volume de trabalho, feito puramente por esforço humano, levaria uma eternidade — e posso garantir com quase certeza que a procrastinação teria me destruído completamente. Mas com a ajuda de ferramentas de IA, ficou pronto em 10 dias (e ainda durante o Ano Novo Lunar chinês). A qualidade tá razoável. Um pequeno milagre, eu diria.

| Metric                      | Value                     |
| --------------------------- | ------------------------- |
| Duration                    | 10 days (Feb 8–18, 2026)  |
| Total commits               | 104                       |
| Files changed               | 1,078                     |
| Lines inserted              | 263,000+                  |
| Lines deleted               | 21,000+                   |
| Locales                     | 4 → 10                    |
| Docs translated to English  | 89                        |
| Translation files generated | 801 (89 docs × 9 locales) |
| Blog posts with full i18n   | 5                         |
| Tools used                  | Claude Code               |

## O que eu realmente fiz

### Phase 1: Fundação (8–9 de fev) — 8 commits

Redesenhei a homepage e a página About do zero. Criei o `CLAUDE.md` como a constituição do projeto — formato de commit, regras de i18n, convenções de estrutura de arquivos. Expandi os locales de 4 pra 6. Tudo feito interagindo com o Claude Code.

Essa fase foi mais sobre decisões de arquitetura: como a homepage deveria ser? Como planejar a página About? Que convenções o projeto inteiro deveria seguir? Essas perguntas foram todas resolvidas através da interação com o Claude — especialmente na hora de montar o plano de execução. Eu só fiquei responsável por revisar e ajustar.

### Phase 2: Escalar (11–12 de fev) — 14 commits

Adicionei mais 4 locales (pt-BR, de, fr, vi) pra completar 10. Gerei os arquivos de tradução do tema. Redesenhei a navbar e a sidebar pra melhorar a organização do conteúdo. Troquei o `defaultLocale` pra `en` e configurei o i18n routing no Vercel. Atualizei as dependências. A expansão de locales foi quase totalmente trabalho mecânico — exatamente onde a IA manda bem. Consome Token pra caramba, mas se fosse feito por humano, seria praticamente impossível terminar em tão pouco tempo.

### Phase 3: Conteúdo (13–14 de fev) — 14 commits

Limpei posts antigos do blog. Escrevi uma retrospectiva de fim de ano. Traduzi todos os posts do blog pra 10 locales. Criei uma página de Projects showcase. Completei o i18n da homepage. Corrigi bugs de componentes de UI (alinhamento de botão do ShowcaseCard, problema de recorte do dropdown).

O que rolou nessa fase foi que a IA não é boa em perceber problemas de layout quebrado (problemas de UI) logo de cara. Foram necessárias várias interações, com um humano (ou seja, eu) apontando continuamente a direção das correções, pra finalmente deixar a tela certa.

### Phase 4: Sidebar + Blog (15 de fev) — 7 commits

Reorganizei toda a estrutura da sidebar dos docs. Traduzi as labels de categoria da sidebar pra todos os 10 locales. Limpei 206 chaves de tradução inúteis que sobraram de reestruturações anteriores. Escrevi e traduzi o post sobre negociação de demissão pra todos os locales.

### Phase 5: i18n dos Docs (16–17 de fev) — 14 commits

O maior batch: traduzir 89 docs pra 9 locales não-ingleses, gerando 801 arquivos de tradução. Cobriu as seções Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience e Coding.

Essa fase e a próxima foram as que mais consumiram Token — joguei todo o trabalho altamente mecânico de tradução em cima da IA e deixei ela ir à loucura (afinal, eu não entendo a maioria desses idiomas mesmo).

### Phase 6: Correções de qualidade (17–18 de fev) — 24 commits

Essa fase existe porque o resultado da Phase 5 não estava limpo o suficiente. Foram 24 commits inteiros só corrigindo traduções geradas pela IA:

- **German**: Umlauts renderizados como ASCII (`ue` em vez de `ü`, `ae` em vez de `ä`)
- **French**: Acentos removidos (`e` em vez de `é`, `a` em vez de `à`)
- **Vietnamese**: Marcas de tom desapareceram completamente (vietnamita sem tons é praticamente ilegível)
- **Spanish/Portuguese**: Acentos sumiram no texto inteiro
- **Chinese Simplified**: Caracteres de chinês tradicional misturados (a IA às vezes não consegue distinguir os dois sistemas de escrita)
- **Resíduos CJK**: Comentários em chinês não traduzidos em blocos de código em es, pt-BR, ja, ko, vi

Cada correção gerava mais problemas. Corrigir os acentos do português causou supercorreções que quebraram os campos `id` e `slug` do frontmatter. Corrigir tons do vietnamita deixou um arquivo escapar. A correção de acentos do espanhol teve falsos positivos que precisaram de mais um commit de correção.

Na real, nessa fase, a menos que você saiba um desses idiomas, humanos simplesmente não conseguem intervir. Você só pode confiar na verificação cruzada entre modelos diferentes.

**Coisas que a IA não faz bem**:

```markdown
// Example:

- Acertar acentos e marcas tonais de primeira (accents, umlauts, tonal marks)
- Distinguir chinês tradicional de simplificado de forma consistente
- Decidir se comentários dentro do código devem ficar no original ou ser traduzidos
- Preservar campos do frontmatter intactos durante a transformação de conteúdo
```

## Armadilhas

**O desastre dos acentos e tons.** A IA substituiu caracteres não-ASCII por aproximações ASCII em cinco idiomas. Isso resultou em 24 commits de correção — quase um quarto do total. Vietnamita foi o pior caso: sem as marcas de tom, o idioma inteiro fica praticamente irreconhecível.

**Mistura de chinês tradicional e simplificado.** Nas traduções de `zh-cn`, comentários de código e referências inline apareceram em chinês tradicional. A IA não consegue distinguir os dois sistemas de escrita de forma consistente.

**Frontmatter corrompido.** Ao traduzir docs, a IA às vezes mexia nos campos `id` e `slug` do frontmatter, quebrando o routing do Docusaurus. Um commit foi dedicado especificamente a corrigir `id` e `slug` do português que foram estragados durante as correções de acentos.

**Reação em cadeia de supercorreções.** Corrigir um problema frequentemente criava outro. A correção de acentos do português supercorrigiu alguns termos técnicos. A correção de tons do vietnamita deixou um arquivo escapar. Cada commit de "correção" tinha uma chance real de criar um problema novo.

## Onde humanos ainda conseguem intervir

**Decisões de arquitetura.** Quais 10 locales suportar. Como organizar a sidebar. O que vai no dropdown da navbar e o que fica no nível superior. Essas decisões afetaram todo o trabalho que veio depois.

**Julgamento de qualidade.** A UI tá quebrada? Tá de acordo com as especificações de design? As traduções têm erros óbvios — tipo, a troca de defaultLocale tá correspondendo certo?

**O arquivo `CLAUDE.md`.** Na essência, é uma constituição do repositório que ensina à IA as convenções do seu projeto: formato de commit, estrutura de arquivos, regras de i18n, o que nunca fazer. Quanto mais completo esse arquivo fica, menos erros a IA comete e menos intervenção humana é necessária. Por isso precisa de iteração e atualização frequentes.

## Conclusões

**Comece com um `CLAUDE.md` bem feito.** Cada convenção que você coloca lá economiza dezenas de ciclos de correção depois. O meu cresceu de umas poucas linhas pra um documento completo cobrindo formato de commit, regras de i18n, estrutura do projeto e proibições explícitas.

**Agrupe trabalho similar, revise em batch.** Não traduza um arquivo por vez. Jogue 15 arquivos parecidos pra IA de uma vez e revise o resultado todo junto. Assim você evita ter que aprovar detalhes demais manualmente.

**Use ferramentas em paralelo sempre que possível.** Deixar o Claude Code cuidando do trabalho interativo enquanto transfere trabalho pra Gemini, Codex e outros processarem em batch é o maior ganho de eficiência. Não serialize trabalho que pode ser paralelizado.

**Registre tudo.** Cada mensagem de commit, cada divisão de fase, cada correção — tudo tá lá no histórico. Se você tá fazendo um projeto grande com assistência de IA, o histórico de commits é a documentação.
