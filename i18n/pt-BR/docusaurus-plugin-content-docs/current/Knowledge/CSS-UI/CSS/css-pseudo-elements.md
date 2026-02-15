---
id: css-pseudo-elements
title: '[Easy] 🏷️ Pseudo-elementos'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## O que são Pseudo-elementos

Pseudo-elementos (Pseudo-elements) são palavras-chave do CSS usadas para selecionar partes específicas de um elemento ou inserir conteúdo antes ou depois de um elemento. Eles utilizam a sintaxe de **dois-pontos duplo** `::` (padrão CSS3), para se distinguir das pseudo-classes (pseudo-classes) que usam dois-pontos simples `:`.

## Pseudo-elementos Comuns

### 1. ::before e ::after

Os pseudo-elementos mais utilizados, usados para inserir conteúdo antes ou depois do conteúdo de um elemento.

```css
.icon::before {
  content: '📌';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**Características**:

- Devem conter a propriedade `content` (mesmo que seja uma string vazia)
- Por padrão são elementos `inline`
- Não aparecem no DOM, não podem ser selecionados por JavaScript

### 2. ::first-letter

Seleciona a primeira letra do elemento, comumente usado para efeitos de capitular estilo revista.

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

Seleciona a primeira linha de texto do elemento.

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**Observação**: `::first-line` só pode ser usado em elementos de nível de bloco.

### 4. ::selection

Personaliza o estilo quando o usuário seleciona texto.

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox precisa de prefixo */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

Personaliza o estilo do placeholder de formulários.

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

Personaliza o estilo do marcador de lista (list marker).

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

Usado para a máscara de fundo de elementos em tela cheia (como `<dialog>` ou vídeos em tela cheia).

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## Cenários de Aplicação Prática

### 1. Ícones e Símbolos Decorativos

Sem necessidade de elementos HTML adicionais, implementação pura com CSS:

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**Quando usar**: Quando não se deseja adicionar elementos puramente decorativos no HTML.

### 2. Clearfix (Limpeza de Float)

Técnica clássica de limpeza de float:

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**Quando usar**: Quando o elemento pai contém elementos filhos com float e precisa expandir a altura do pai.

### 3. Decoração de Aspas

Adicionar aspas automaticamente ao texto citado:

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**Quando usar**: Embelezar blocos de citação sem inserir aspas manualmente.

### 4. Formas CSS Puras

Usar pseudo-elementos para criar formas geométricas:

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**Quando usar**: Criar setas, triângulos e outras formas simples sem imagens ou SVG.

### 5. Marcação de Campo Obrigatório

Adicionar asterisco vermelho a campos obrigatórios do formulário:

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**Quando usar**: Indicar campos obrigatórios mantendo a semântica HTML limpa.

### 6. Indicação de Link Externo

Adicionar automaticamente ícone para links externos:

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* Ou usando icon font */
a[target='_blank']::after {
  content: '\f08e'; /* Ícone de link externo do Font Awesome */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**Quando usar**: Melhorar a experiência do usuário, informando que uma nova aba será aberta.

### 7. Numeração com Contadores

Usar contadores CSS para numeração automática:

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**Quando usar**: Gerar numeração automaticamente sem manutenção manual.

### 8. Efeito de Camada de Sobreposição

Adicionar sobreposição no hover para imagens:

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**Quando usar**: Quando não se deseja adicionar elementos HTML extras para implementar efeitos de sobreposição.

## Pseudo-elementos vs Pseudo-classes

| Característica | Pseudo-elementos (::)                           | Pseudo-classes (:)                          |
| -------------- | ----------------------------------------------- | ------------------------------------------- |
| **Sintaxe**    | Dois-pontos duplo `::before`                    | Dois-pontos simples `:hover`                |
| **Função**     | Criar/selecionar partes específicas do elemento | Selecionar estados específicos do elemento  |
| **Exemplos**   | `::before`, `::after`, `::first-letter`         | `:hover`, `:active`, `:nth-child()`         |
| **DOM**        | Não existem no DOM                              | Selecionam elementos reais do DOM           |

## Armadilhas Comuns

### 1. A propriedade content deve existir

`::before` e `::after` devem ter a propriedade `content`, caso contrário não serão exibidos:

```css
/* Não será exibido */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* Correto */
.box::before {
  content: ''; /* Mesmo uma string vazia precisa ser adicionada */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. Não pode ser usado em elementos substituídos

Alguns elementos (como `<img>`, `<input>`, `<iframe>`) não podem usar `::before` e `::after`:

```css
/* Inválido */
img::before {
  content: 'Photo:';
}

/* Use um elemento wrapper */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. Padrão como elemento inline

`::before` e `::after` são por padrão elementos `inline`. Ao definir largura e altura, tenha atenção:

```css
.box::before {
  content: '';
  display: block; /* ou inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. Problemas de camada z-index

O `z-index` do pseudo-elemento é relativo ao elemento pai:

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* Ficará abaixo do elemento pai, mas acima do fundo do elemento pai */
}
```

### 5. Compatibilidade retroativa com dois-pontos simples

A especificação CSS3 usa dois-pontos duplo `::` para distinguir pseudo-elementos de pseudo-classes, mas dois-pontos simples `:` ainda funciona (compatibilidade retroativa com CSS2):

```css
/* Escrita padrão CSS3 (recomendada) */
.box::before {
}

/* Escrita CSS2 (ainda funciona) */
.box:before {
}
```

## Pontos-chave para Entrevistas

1. **Sintaxe de dois-pontos duplo dos pseudo-elementos**: Distinguir pseudo-elementos `::` de pseudo-classes `:`
2. **A propriedade content deve existir**: Ponto fundamental de `::before` e `::after`
3. **Não estão no DOM**: Não podem ser selecionados ou manipulados diretamente por JavaScript
4. **Não podem ser usados em elementos substituídos**: `<img>`, `<input>` etc. não funcionam
5. **Cenários de aplicação prática**: Ícones decorativos, clearfix, desenho de formas etc.

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
