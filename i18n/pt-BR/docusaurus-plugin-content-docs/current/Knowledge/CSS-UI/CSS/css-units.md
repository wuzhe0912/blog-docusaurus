---
id: css-units
title: '[Medium] 🏷️ Unidades CSS'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Explique as diferenças entre `px`, `em`, `rem`, `vw` e `vh`

### Tabela Comparativa Rápida

| Unidade | Tipo     | Relativo a                      | Afetado pelo pai? | Usos comuns                              |
| ------- | -------- | ------------------------------- | ------------------ | ---------------------------------------- |
| `px`    | Absoluto | Pixel da tela                   | Não                | Bordas, sombras, pequenos detalhes       |
| `em`    | Relativo | font-size do **elemento pai**   | Sim                | Padding, margin (seguir tamanho da fonte) |
| `rem`   | Relativo | font-size do **elemento raiz**  | Não                | Fontes, espaçamentos, tamanhos gerais    |
| `vw`    | Relativo | 1% da largura da viewport       | Não                | Largura responsiva, elementos full-width |
| `vh`    | Relativo | 1% da altura da viewport        | Não                | Altura responsiva, seções full-screen    |

### Explicação Detalhada

#### `px` (Pixels)

**Definição**: Unidade absoluta, 1px = um ponto de pixel na tela

**Características**:

- Tamanho fixo, não muda por nenhuma configuração
- Controle preciso, porém sem flexibilidade
- Desfavorável para design responsivo e acessibilidade

**Quando usar**:

```css
/* Adequado para */
border: 1px solid #000; /* Bordas */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombras */
border-radius: 4px; /* Cantos arredondados pequenos */

/* Não recomendado para */
font-size: 16px; /* Fontes: melhor usar rem */
width: 1200px; /* Largura: melhor usar % ou vw */
```

#### `em`

**Definição**: Múltiplo do font-size do **elemento pai**

**Características**:

- Acumula por herança (estruturas aninhadas se acumulam)
- Alta flexibilidade, mas pode sair do controle
- Adequado para cenários onde se precisa acompanhar a escala do elemento pai

**Exemplo de cálculo**:

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px (relativo ao próprio font-size) */
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px (efeito acumulativo!) */
}
```

**Quando usar**:

```css
/* Adequado para */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* Padding acompanha o tamanho da fonte do botão */
}

.card-title {
  font-size: 1.2em; /* Relativo à fonte base do card */
  margin-bottom: 0.5em; /* Espaçamento acompanha o tamanho do título */
}

/* Cuidado com acumulação em aninhamento */
```

#### `rem` (Root em)

**Definição**: Múltiplo do font-size do **elemento raiz** (`<html>`)

**Características**:

- Não acumula por herança (sempre relativo ao elemento raiz)
- Fácil de gerenciar e manter
- Conveniente para implementar escala global
- Uma das unidades mais recomendadas

**Exemplo de cálculo**:

```css
html {
  font-size: 16px; /* Padrão do navegador */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* Continua sendo 24px, não acumula! */
}
```

**Quando usar**:

```css
/* Mais recomendado para */
html {
  font-size: 16px; /* Definir base */
}

body {
  font-size: 1rem; /* Texto corpo 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* Conveniente para dark mode ou ajustes de acessibilidade */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* Todas as unidades rem escalam automaticamente */
  }
}
```

#### `vw` (Viewport Width)

**Definição**: Relativo a 1% da largura da viewport (100vw = largura da viewport)

**Características**:

- Unidade verdadeiramente responsiva
- Muda em tempo real com o tamanho da janela do navegador
- Atenção: 100vw inclui a largura da barra de rolagem

**Exemplo de cálculo**:

```css
/* Supondo viewport com largura de 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* Supondo viewport com largura de 375px (celular) */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**Quando usar**:

```css
/* Adequado para */
.hero {
  width: 100vw; /* Banner full-width */
  margin-left: calc(-50vw + 50%); /* Extravasar o container */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* Fonte responsiva */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* Adicionar limite máximo */
}

/* Evitar */
body {
  width: 100vw; /* Causa barra de rolagem horizontal (inclui largura da scrollbar) */
}
```

#### `vh` (Viewport Height)

**Definição**: Relativo a 1% da altura da viewport (100vh = altura da viewport)

**Características**:

- Adequado para efeitos full-screen
- Em dispositivos móveis, atenção com a barra de endereço
- Pode ser afetado pelo teclado virtual

**Quando usar**:

```css
/* Adequado para */
.hero-section {
  height: 100vh; /* Página inicial full-screen */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* Alternativa para dispositivos móveis */
.hero-section {
  height: 100vh;
  height: 100dvh; /* Altura dinâmica da viewport (unidade mais recente) */
}

/* Centralização vertical */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Dicas Práticas e Melhores Práticas

#### 1. Sistema de Fontes Responsivo

```css
/* Definir base */
html {
  font-size: 16px; /* Desktop padrão */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* Tablet */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* Celular */
  }
}

/* Todos os elementos usando rem escalam automaticamente */
h1 {
  font-size: 2.5rem;
} /* Desktop 40px, Celular 30px */
p {
  font-size: 1rem;
} /* Desktop 16px, Celular 12px */
```

#### 2. Uso Combinado de Diferentes Unidades

```css
.card {
  /* Largura responsiva + limite de faixa */
  width: 90vw;
  max-width: 75rem;

  /* rem para espaçamentos */
  padding: 2rem;
  margin: 1rem auto;

  /* px para detalhes */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp combina múltiplas unidades para escala fluida */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### Modelo de Resposta para Entrevistas

**Estrutura da resposta**:

```markdown
1. **px**: Detalhes pequenos em pixels -> bordas, sombras, cantos arredondados pequenos
2. **rem**: Base estável e imutável -> fontes, espaçamentos, tamanhos principais
3. **em**: Segue o elemento pai
4. **vw**: Muda com a largura da viewport -> largura responsiva
5. **vh**: Preenche a altura da viewport -> seções full-screen
```

1. **Definição rápida**

   - px é unidade absoluta, as demais são unidades relativas
   - em é relativo ao elemento pai, rem é relativo ao elemento raiz
   - vw/vh são relativos às dimensões da viewport

2. **Diferença principal**

   - rem não acumula, em acumula (esta é a principal distinção)
   - vw/vh são verdadeiramente responsivos, mas atenção com a barra de rolagem

3. **Aplicação prática**

   - **px**: Bordas de 1px, sombras e outros detalhes
   - **rem**: Fontes, espaçamentos, containers (mais usado, fácil manutenção)
   - **em**: Padding de botões (quando precisam acompanhar a escala da fonte)
   - **vw/vh**: Banners full-width, seções full-screen, fontes responsivas com clamp

4. **Melhores práticas**
   - Definir html font-size como base
   - Usar clamp() combinando diferentes unidades
   - Atenção com o problema do vh em dispositivos móveis (pode usar dvh)

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
