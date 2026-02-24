---
id: theme-switching
title: '[Medium] Implementazione del cambio tema multiplo'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 1. Scenario da colloquio

> Un prodotto necessita di almeno due temi visivi (ad esempio, chiaro e scuro). Come progetteresti l'architettura CSS?

Questa domanda valuta:

- Decisioni sull'architettura CSS
- Strategia dei token per il tema
- Approccio al cambio a runtime
- Prestazioni e manutenibilità

## 2. Panoramica delle strategie consigliate

| Strategia | Ideale per | Cambio a runtime | Complessità | Raccomandazione |
| --- | --- | --- | --- | --- |
| CSS custom properties | La maggior parte delle app moderne | Sì | Media | Fortemente consigliata |
| Modalità tema del framework utility | Stack utility-first | Sì | Media | Consigliata |
| Stili duplicati basati su class | Compatibilità legacy | Sì | Alta | Alternativa accettabile |
| Solo variabili al build-time (Sass/Less) | Build a brand fisso | No | Bassa | Non ideale per toggle dal vivo |

## 3. Architettura centrale: design token + variabili CSS

Definire token semantici invece di colori hard-coded nei componenti.

```css
:root {
  --bg: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
}

[data-theme='dark'] {
  --bg: #0b1220;
  --surface: #111827;
  --text: #f3f4f6;
  --text-muted: #9ca3af;
  --border: #374151;
  --primary: #60a5fa;
}
```

Consumare i token ovunque:

```css
.page {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
}

.button-primary {
  background: var(--primary);
  color: #fff;
}
```

## 4. Implementazione del cambio tema a runtime

### Base HTML

```html
<html data-theme="light">
  <body>
    <button id="theme-toggle" type="button">Cambia tema</button>
  </body>
</html>
```

### Logica JavaScript

```js
const STORAGE_KEY = 'theme';
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function initTheme() {
  applyTheme(getPreferredTheme());
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

initTheme();
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
```

## 5. Prevenire il flash del tema al primo rendering

Applicare il tema iniziale prima che l'app venga renderizzata.

```html
<script>
  (function () {
    var key = 'theme';
    var saved = localStorage.getItem(key);
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'light' || saved === 'dark' ? saved : dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

Posizionare questo script nel `<head>` prima dei bundle CSS/JS quando possibile.

## 6. Stratificazione scalabile dei token

Un modello pratico di token:

1. Primitive globali (`--gray-100`, `--blue-500`)
2. Token semantici (`--text`, `--bg`, `--border`)
3. Token per componente (`--btn-bg`, `--card-shadow`)

Esempio:

```css
:root {
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --blue-600: #2563eb;

  --bg: var(--gray-50);
  --text: var(--gray-900);
  --link: var(--blue-600);
}
```

Questo rende gestibili i cambiamenti a livello di sistema.

## 7. Requisiti di accessibilità

- Soddisfare i requisiti di contrasto (WCAG)
- Mantenere gli stati di focus visibili in tutti i temi
- Non affidarsi solo al colore per lo stato
- Supportare le preferenze di sistema (`prefers-color-scheme`)

Media query utile:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## 8. Indicazioni su animazioni e transizioni

Le transizioni tra temi possono essere sottili ma dovrebbero evitare repaint pesanti.

```css
:root,
[data-theme='dark'] {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

Evitare di animare blur/shadow grandi su ogni elemento durante il cambio tema.

## 9. Esempi per framework

### React

```tsx
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function onToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  return <button onClick={onToggle}>Tema: {theme}</button>;
}
```

### Vue 3

```ts
import { ref, watchEffect } from 'vue';

const theme = ref<'light' | 'dark'>('light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});
```

## 10. Errori comuni

- Codificare i colori direttamente nei componenti
- Mescolare naming di token semantici e primitivi
- Ignorare le differenze di tema per grafici/blocchi di codice
- Alternare troppe classi su alberi profondi
- Dimenticare di persistere la preferenza dell'utente

## 11. Checklist per i test

- Il tema persiste dopo il refresh
- Nessun flash al primo rendering
- I controlli di contrasto sono superati
- Gli stati focus/hover/disabled sono tutti chiari
- I componenti di terze parti hanno il tema applicato in modo coerente
- L'aspetto su mobile e desktop è stato validato

## 12. Template di risposta pronto per il colloquio

> Uso CSS custom properties con token semantici e cambio i temi usando un attributo root come `data-theme`. Inizializzo il tema prima del primo rendering per evitare lo sfarfallio, persisto la preferenza in localStorage e ricorro alla preferenza di sistema come fallback. Inoltre impongo contrasto e visibilità degli stati tra i temi. Questo mantiene il cambio tema veloce, manutenibile e scalabile.

## 13. Risposte rapide per i colloqui

### D1: Perché scegliere le variabili CSS rispetto a regole di classe duplicate?

Meno duplicazione, flessibilità a runtime e migliore manutenibilità.

### D2: Come evitare lo sfarfallio iniziale?

Impostare il tema in un piccolo script inline prima di renderizzare l'app.

### D3: Il tema dovrebbe essere uno stato globale?

Di solito sì, perché molte pagine/componenti dipendono da esso.

### D4: Le variabili Sass possono gestire il cambio tema a runtime?

Non da sole. Le variabili Sass vengono risolte al build time.
