---
id: element-properties
title: '[Easy] Proprietà degli elementi'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Cosa sono gli elementi block e inline?

### Elementi block

Gli elementi block di solito iniziano su una nuova riga e si espandono alla larghezza disponibile.

Esempi comuni:

`div`, `section`, `article`, `header`, `footer`, `main`, `nav`, `ul`, `ol`, `li`, `form`.

### Elementi inline

Gli elementi inline scorrono all'interno del testo e non iniziano una nuova riga per impostazione predefinita.

Esempi comuni:

`span`, `a`, `strong`, `em`, `img`, `label`, `code`.

## 2. Cos'è `inline-block`?

`inline-block` si posiziona inline ma mantiene il comportamento di dimensionamento block.

```css
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
}
```

Da usare quando gli elementi devono allinearsi orizzontalmente mantenendo il controllo su larghezza/altezza/padding.

## 3. Cosa fa `* { box-sizing: border-box; }`?

Modifica il dimensionamento in modo che la larghezza/altezza dichiarata includa `padding` e `border`.

```css
* {
  box-sizing: border-box;
}
```

Questo rende i calcoli del layout più prevedibili.

## 4. Risposte rapide per i colloqui

### D1: Gli elementi inline possono impostare larghezza/altezza?

Di solito no (eccetto gli elementi sostituiti come `img`). Usare `inline-block` o `block` se necessario.

### D2: Gli elementi block possono apparire inline?

Sì, cambiando `display` con CSS.

### D3: Perché `border-box` è popolare?

Riduce le sorprese sul dimensionamento e semplifica i layout responsive.

## Riferimenti

- [MDN: Contenuto a livello di blocco](https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content)
- [MDN: Contenuto a livello inline](https://developer.mozilla.org/en-US/docs/Glossary/Inline-level_content)
- [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)
