---
id: css-box-model
title: '[Easy] Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## 1. Cos'è il CSS Box Model?

Il CSS Box Model descrive come vengono calcolate le dimensioni e la spaziatura di un elemento.

Ogni elemento è composto da:

- `content`: il testo o il contenuto multimediale effettivo
- `padding`: lo spazio tra il contenuto e il bordo
- `border`: il contorno attorno al contenuto + padding
- `margin`: lo spazio esterno tra gli elementi

```css
.card {
  width: 240px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 12px;
}
```

## 2. Cosa controlla `box-sizing`?

`box-sizing` definisce se `padding` e `border` sono inclusi nella larghezza/altezza dichiarata.

### `content-box` (predefinito)

La larghezza dichiarata = solo il contenuto.

Larghezza renderizzata = `width + padding sinistro/destro + border sinistro/destro`.

```css
.box {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

La larghezza finale è `100 + 20 + 2 = 122px`.

### `border-box`

La larghezza dichiarata include contenuto + padding + border.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

La larghezza finale rimane `100px`.

## 3. Perché `border-box` è comunemente utilizzato?

Rende i calcoli del layout prevedibili e più semplici per il design responsive.

Un reset comune:

```css
* {
  box-sizing: border-box;
}
```

Molti team lo applicano anche agli pseudo-element:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4. Margin collapse (collasso dei margini, punto importante nei colloqui)

I margini verticali tra elementi block possono collassare.

```css
.a {
  margin-bottom: 24px;
}

.b {
  margin-top: 16px;
}
```

Lo spazio è `24px`, non `40px`.

Modi per evitare il margin collapse:

- Aggiungere `padding` o `border` al genitore
- Usare `display: flow-root` sul genitore
- Usare layout `flex` o `grid`

## 5. Suggerimenti per il debug del Box Model

- Usare il pannello box model nei DevTools del browser
- Aggiungere temporaneamente `outline: 1px solid red` per ispezionare i confini
- Preferire sistemi di spaziatura (es. scala 4/8) per coerenza

## 6. Risposte rapide per i colloqui

### D1: Qual è la differenza tra margin e padding?

`padding` è all'interno del border; `margin` è all'esterno del border.

### D2: Perché impostare `box-sizing: border-box` globalmente?

Previene sorprese su larghezza/altezza e semplifica i calcoli del layout.

### D3: La larghezza viene sempre rispettata?

Può essere vincolata da `min-width`, `max-width`, dal layout del genitore e dal comportamento del contenuto.
