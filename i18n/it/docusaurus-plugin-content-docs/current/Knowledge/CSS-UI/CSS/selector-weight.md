---
id: selector-weight
title: '[Easy] Specificità dei selettori'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Come si calcola la specificità dei selettori?

La specificità (specificity) decide quale regola CSS vince quando più regole puntano allo stesso elemento.

Un modello mentale semplice:

`inline style` > `ID` > `class/attribute/pseudo-class` > `element/pseudo-element`

## 2. Punteggio della specificità

Ragiona per colonne:

- A: inline style
- B: ID
- C: class, attributi, pseudo-class
- D: nomi di elementi e pseudo-element

Confronta da sinistra a destra.

```html
<div id="app" class="wrapper">Testo</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

`#app` vince perché la specificità dell'ID è più alta.

## 3. Esempi comuni

```css
p {}                /* 0-0-0-1 */
.card p {}          /* 0-0-1-1 */
#root .card p {}    /* 0-1-1-1 */
```

## 4. E riguardo `!important`?

`!important` sovrascrive l'ordine normale della cascata all'interno della stessa origine/layer, ma usarlo ovunque rende il CSS difficile da mantenere.

Preferire:

- Una migliore struttura dei selettori
- Minore profondità di annidamento
- Scope dei componenti prevedibile

## 5. Best practice (buone pratiche)

- Mantenere la specificità bassa e coerente
- Evitare selettori concatenati profondi
- Preferire lo styling basato su class per UI riutilizzabili
- Usare classi utility o scope dei componenti per evitare conflitti tra selettori

## 6. Risposte rapide per i colloqui

### D1: L'ordine conta se la specificità è uguale?

Sì. Le dichiarazioni successive vincono.

### D2: Lo styling basato su ID è consigliato?

Di solito no per sistemi UI scalabili; le class sono più riutilizzabili.

### D3: Perché evitare l'uso frequente di `!important`?

Rompe la cascata prevedibile e aumenta i costi di manutenzione.
