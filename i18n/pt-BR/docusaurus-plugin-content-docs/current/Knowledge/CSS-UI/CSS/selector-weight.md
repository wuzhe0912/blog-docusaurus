---
id: selector-weight
title: '[Easy] 🏷️ Peso do Seletor'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Como calcular o peso de um seletor?

> Como calcular o peso de um seletor?

A determinação da prioridade dos seletores CSS serve para resolver a questão de qual estilo será finalmente aplicado ao elemento, como no exemplo:

```html
<div id="app" class="wrapper">Qual cor?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

Neste caso, o resultado final será azul, pois aqui são aplicados dois seletores: ID e class. Como o peso do ID é maior que o do class, o estilo do class é sobrescrito.

### Sequência de Peso

> inline style > ID > class > tag

Se em um trecho de HTML houver estilo inline escrito diretamente na tag, por padrão seu peso será o maior, sobrepondo os estilos do arquivo CSS, como no exemplo:

```html
<div id="app" class="wrapper" style="color: #f00">Qual cor?</div>
```

No entanto, no desenvolvimento convencional, esse tipo de escrita não é utilizado, pois é difícil de manter e facilmente causa problemas de poluição de estilos.

### Caso Especial

Se realmente encontrar um estilo inline que não pode ser removido e desejar sobrescrevê-lo pelo arquivo CSS, pode usar `!important`:

```html
<div id="app" class="wrapper" style="color: #f00">Qual cor?</div>
```

```css
#app {
  color: blue !important;
}
```

Claro, se possível, é preferível evitar o uso de `!important`. Embora estilos inline também possam adicionar `!important`, pessoalmente não considero esse tipo de escrita de estilos. Além disso, exceto em casos especiais, também não utilizo seletores de ID, construindo toda a folha de estilos basicamente com class.

