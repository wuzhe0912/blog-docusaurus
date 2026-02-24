---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect e Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. Cos'è `useEffect`?

> Cosa fa `useEffect` in React?

`useEffect` esegue effetti collaterali dopo che React ha completato gli aggiornamenti della UI.

Effetti collaterali tipici:

- Recupero di dati remoti
- Sottoscrizione ad eventi del browser
- Sincronizzazione con API come `document.title` o `localStorage`
- Avvio e pulizia di timer

```tsx
import { useEffect, useState } from 'react';

export default function CounterTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Conteggio: ${count}`;
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((v) => v + 1)}>
      Click {count}
    </button>
  );
}
```

## 2. Come funziona l'array delle dipendenze?

### Nessun array di dipendenze

Viene eseguito dopo ogni render.

```tsx
useEffect(() => {
  console.log('eseguito dopo ogni render');
});
```

### Array di dipendenze vuoto `[]`

Viene eseguito una volta al mount e pulizia all'unmount.

```tsx
useEffect(() => {
  console.log('solo al mount');
  return () => console.log('pulizia all\'unmount');
}, []);
```

### Dipendenze specifiche

Viene eseguito al mount e ogni volta che uno di quei valori cambia.

```tsx
useEffect(() => {
  console.log('query cambiata:', query);
}, [query]);
```

## 3. Perché la pulizia è importante

Restituire una funzione da `useEffect` per rilasciare le risorse.

```tsx
useEffect(() => {
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
  };
}, []);
```

Senza pulizia, si possono verificare perdite di listener, timer o lavoro asincrono obsoleto.

## 4. Errori comuni con `useEffect`

### 1) Re-render infiniti

```tsx
// errore: aggiorna lo stato ad ogni render
useEffect(() => {
  setCount((v) => v + 1);
});
```

Correggere aggiungendo l'array di dipendenze corretto o spostando la logica altrove.

### 2) Dipendenze mancanti

Se si utilizza una variabile all'interno dell'effetto, includerla nelle dipendenze a meno che non sia intenzionalmente stabile.

### 3) Closure obsolete

Gli effetti catturano i valori dal render che li ha creati. Usare refs o aggiornamenti delle dipendenze quando necessario.

### 4) Eseguire calcoli derivati nell'effetto

Se un valore può essere calcolato direttamente da props/state, preferire `useMemo` o un calcolo semplice rispetto a `useEffect`.

## 5. Cos'è il Virtual DOM?

Il Virtual DOM è una rappresentazione in memoria della UI. React confronta gli alberi virtuali precedente e successivo, poi aggiorna solo le parti necessarie del DOM reale.

### Perché è utile

- Riduce gli aggiornamenti manuali del DOM
- Fornisce aggiornamenti UI prevedibili dallo stato
- Funziona con euristiche di riconciliazione per l'efficienza

Non è sempre "gratuito"; creare e confrontare gli alberi ha comunque un costo.

## 6. La riconciliazione in termini semplici

Quando lo stato cambia:

1. React costruisce un nuovo albero virtuale
2. React lo confronta con l'albero precedente
3. React applica le modifiche minime al DOM reale

Le key nelle liste sono cruciali perché aiutano React a far corrispondere correttamente i nodi vecchi e nuovi.

```tsx
{items.map((item) => (
  <li key={item.id}>{item.label}</li>
))}
```

Key stabili prevengono il riutilizzo errato e i remount non necessari.

## 7. Relazione tra `useEffect` e Virtual DOM

- Il diffing del Virtual DOM avviene durante la fase di render/riconciliazione
- `useEffect` viene eseguito dopo la fase di commit
- Quindi `useEffect` non blocca il painting nella maggior parte dei casi

Se devi leggere/scrivere il layout in modo sincrono prima del paint, usa `useLayoutEffect` con attenzione.

## 8. Pattern pratici

### Recupero dati con guardia di cancellazione

```tsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    const res = await fetch('/api/user');
    const data = await res.json();
    if (!cancelled) setUser(data);
  }

  load();

  return () => {
    cancelled = true;
  };
}, []);
```

### Estrarre logica di effetto riutilizzabile in custom hooks

```tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

## 9. Risposte rapide per i colloqui

### D1: `useEffect` è equivalente ai metodi lifecycle delle classi?

Concettualmente sì per gli effetti collaterali, ma il modello mentale è "dopo il render" con ri-esecuzioni guidate dalle dipendenze.

### D2: Il Virtual DOM significa che gli aggiornamenti di React sono sempre veloci?

Non sempre. Le prestazioni dipendono comunque dalla struttura dei componenti, dalla frequenza di render, dalla memoizzazione e dalla stabilità delle key.

### D3: Quando dovrei evitare `useEffect`?

Evitarlo per valori derivati puri e gestori di eventi che non richiedono sincronizzazione esterna.
