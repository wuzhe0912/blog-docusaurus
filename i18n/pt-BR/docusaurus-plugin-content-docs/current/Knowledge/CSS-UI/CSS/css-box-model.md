---
id: css-box-model
title: '[Easy] 🏷️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Padrão

O `Box Model` é um termo utilizado em `CSS` para discutir como projetar layouts. Ele pode ser entendido como uma caixa que envolve os elementos `HTML`, com quatro propriedades principais:

- content: Usado principalmente para exibir o conteúdo do elemento, como texto.
- padding: A distância entre o conteúdo do elemento e sua borda.
- margin: A distância do elemento em relação a outros elementos externos.
- border: A linha de borda do próprio elemento.

## box-sizing

O tipo de `Box Model` utilizado é determinado pela propriedade `box-sizing`.

Isso significa que, quando o elemento calcula largura e altura, as propriedades `padding` e `border` utilizam preenchimento interno ou expansão externa.

O valor padrão é `content-box`, que usa expansão externa. Nesta condição, além da largura e altura do próprio elemento, `padding` e `border` adicionais precisam ser incluídos no cálculo. Veja:

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

A largura deste `div` é calculada como `100px(width)` + `20px(padding esquerdo e direito)` + `2px(border esquerda e direita)` = `122px`.

## border-box

Evidentemente, o método acima não é confiável, pois obriga o desenvolvedor frontend a calcular constantemente largura e altura dos elementos. Para melhorar a experiência de desenvolvimento, naturalmente adota-se o outro modo: `border-box`.

Como no exemplo abaixo, ao inicializar os estilos, define-se o `box-sizing` de todos os elementos como `border-box`:

```css
* {
  box-sizing: border-box; // global style
}
```

Dessa forma, adota-se a forma de preenchimento interno, tornando o design de largura e altura dos elementos mais intuitivo, sem a necessidade de ajustar números por causa de `padding` ou `border`.

## Exemplo Comparativo

Supondo as mesmas configurações de estilo:

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box (valor padrão)

- **Largura real ocupada** = `100px(width)` + `20px(padding esquerdo e direito)` + `10px(border esquerda e direita)` = `130px`
- **Altura real ocupada** = `100px(height)` + `20px(padding superior e inferior)` + `10px(border superior e inferior)` = `130px`
- **Área do content** = `100px x 100px`
- **Observação**: `margin` não é incluído na largura do elemento, mas afeta a distância em relação a outros elementos

### border-box

- **Largura real ocupada** = `100px` (padding e border comprimem para dentro)
- **Altura real ocupada** = `100px`
- **Área do content** = `100px` - `20px(padding esquerdo e direito)` - `10px(border esquerda e direita)` = `70px x 70px`
- **Observação**: `margin` igualmente não é incluído na largura do elemento

### Comparação Visual

```
content-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (100×100)       │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Largura total: 130px (sem margin)

border-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (70×70)         │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Largura total: 100px (sem margin)
```

## Armadilhas Comuns

### 1. Tratamento do margin

Seja em `content-box` ou `border-box`, **margin nunca é incluído na largura e altura do elemento**. Os dois modos afetam apenas o cálculo de `padding` e `border`.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* Não é incluído no width */
}
/* A largura real do elemento ainda é 100px, mas a distância em relação a outros elementos será 20px a mais */
```

### 2. Largura em porcentagem

Ao usar largura em porcentagem, o cálculo também é afetado pelo `box-sizing`:

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* 50% do elemento pai = 100px */
  padding: 10px;
  border: 5px solid;
}

/* content-box: Largura real 130px (pode ultrapassar o elemento pai) */
/* border-box: Largura real 100px (exatamente 50% do elemento pai) */
```

### 3. Elementos inline

`box-sizing` não funciona em elementos `inline`, pois a definição de `width` e `height` em elementos inline é ineficaz por si só.

```css
span {
  display: inline;
  width: 100px; /* Ineficaz */
  box-sizing: border-box; /* Também ineficaz */
}
```

### 4. min-width / max-width

`min-width` e `max-width` também são afetados pelo `box-sizing`:

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* Inclui padding e border */
  padding: 10px;
  border: 5px solid;
}
/* Largura mínima do content = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [學習 CSS 版面配置](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
