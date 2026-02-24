---
id: css-pseudo-elements
title: '[Easy] Pseudo-element'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 1. Cosa sono gli pseudo-element?

Gli pseudo-element stilizzano una parte specifica di un elemento o creano contenuto virtuale prima/dopo di esso.

Utilizzano la sintassi con doppio due punti:

- `::before`
- `::after`
- `::first-letter`
- `::first-line`
- `::selection`

## 2. `::before` e `::after`

Questi sono gli pseudo-element più comuni.

```css
.link::after {
  content: ' (esterno)';
  color: #6b7280;
}

.badge::before {
  content: 'NUOVO';
  margin-right: 8px;
  background: #111827;
  color: #fff;
  padding: 2px 6px;
  border-radius: 999px;
}
```

Note:

- `content` è obbligatorio (può essere una stringa vuota)
- Fanno parte del rendering, non sono nodi DOM reali
- Possono essere posizionati e stilizzati come elementi normali

## 3. Pseudo-element relativi al testo

### `::first-letter`

```css
.article p::first-letter {
  font-size: 2rem;
  font-weight: 700;
}
```

### `::first-line`

```css
.article p::first-line {
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

### `::selection`

```css
::selection {
  background: #fef08a;
  color: #111827;
}
```

## 4. Pseudo-element per form e liste

### `::placeholder`

```css
input::placeholder {
  color: #9ca3af;
}
```

### `::marker`

```css
li::marker {
  color: #2563eb;
  font-weight: 700;
}
```

### `::file-selector-button`

```css
input[type='file']::file-selector-button {
  border: 0;
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
}
```

## 5. Pseudo-element vs pseudo-class

- Pseudo-class (`:hover`, `:focus`) seleziona uno stato
- Pseudo-element (`::before`, `::after`) seleziona una parte virtuale

## 6. Best practice (buone pratiche)

- Non inserire contenuto semantico critico solo in `::before/::after`
- Mantenere il contenuto decorativo come decorativo
- Testare l'accessibilità e il comportamento degli screen reader
- Evitare l'uso eccessivo di contenuto generato per la logica di business

## 7. Risposte rapide per i colloqui

### D1: Perché usare `::before` invece di HTML aggiuntivo?

Per UI puramente decorative, riduce il rumore nel DOM.

### D2: JavaScript può selezionare direttamente gli pseudo-element?

Non come nodi DOM; si stilizzano tramite regole CSS.

### D3: Perché il doppio due punti?

CSS3 ha standardizzato gli pseudo-element con `::` per distinguerli dalle pseudo-class.
