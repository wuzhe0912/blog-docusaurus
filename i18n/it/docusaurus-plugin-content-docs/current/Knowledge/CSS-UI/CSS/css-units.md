---
id: css-units
title: '[Medium] Unità CSS'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Qual è la differenza tra `px`, `em`, `rem`, `vw` e `vh`?

### Confronto rapido

| Unità | Tipo | Relativa a | Uso tipico |
| --- | --- | --- | --- |
| `px` | Simile ad assoluta | Pixel CSS | Bordi, ombre, dettagli fini |
| `em` | Relativa | Dimensione font dell'elemento (o del genitore per font-size) | Spaziatura/scala locale |
| `rem` | Relativa | Dimensione font del root (`html`) | Tipografia e spaziatura globale |
| `vw` | Relativa | 1% della larghezza del viewport | Larghezza/layout fluido |
| `vh` | Relativa | 1% dell'altezza del viewport | Sezioni a tutta altezza |

## 2. Comportamento delle unità con esempi

### `px`

```css
.card {
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
```

Da usare per dettagli visivi nitidi.

### `em`

```css
.button {
  font-size: 1rem;
  padding: 0.5em 1em;
}
```

Il padding si scala con la dimensione del font di questo elemento.

### `rem`

```css
html {
  font-size: 16px;
}

h1 {
  font-size: 2rem; /* 32px */
}
```

Ottimo per dimensioni coerenti tra i componenti.

### `vw` e `vh`

```css
.hero {
  min-height: 100vh;
  padding-inline: 5vw;
}
```

Da usare per layout guidati dal viewport.

## 3. Altre unità utili

### `%`

Relativa alla dimensione del genitore/riferimento.

```css
.container {
  width: 80%;
}
```

### `vmin` e `vmax`

- `1vmin`: 1% del lato più piccolo del viewport
- `1vmax`: 1% del lato più grande del viewport

### `ch`

Approssimativamente la larghezza del carattere `0`. Utile per lunghezze di riga leggibili.

```css
.prose {
  max-width: 65ch;
}
```

## 4. Regole pratiche

- Usare `rem` per font e scala di spaziatura
- Usare `px` per bordi/effetti sottili
- Usare `%` per contenitori fluidi
- Usare `vw`/`vh` per sezioni guidate dal viewport
- Usare `em` quando si desidera uno scaling locale al componente

## 5. Avvertenza sul viewport mobile

Nei browser mobile, le barre degli indirizzi dinamiche possono rendere `100vh` instabile.

Preferire le unità più recenti dove supportate:

- `dvh`: altezza viewport dinamica
- `svh`: altezza viewport piccola
- `lvh`: altezza viewport grande

```css
.full-screen {
  min-height: 100dvh;
}
```

## 6. Risposte rapide per i colloqui

### D1: Perché molti team preferiscono `rem` a `px` per la tipografia?

Centralizza lo scaling dalla dimensione font del root e migliora la coerenza.

### D2: Perché gli `em` annidati possono essere problematici?

Si compongono in base alle dimensioni font locali, il che può sfuggire di mano inaspettatamente.

### D3: Quando `px` è ancora la scelta giusta?

Per dettagli visivi esatti come bordi, ombre e aggiustamenti di allineamento delle icone.
