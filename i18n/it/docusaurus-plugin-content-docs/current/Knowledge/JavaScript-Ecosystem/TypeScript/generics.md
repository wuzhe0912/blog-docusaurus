---
id: generics
title: '[Medium] Generics'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. Cosa sono i generics?

> Quale problema risolvono i generics in TypeScript?

I generics ti permettono di scrivere codice riutilizzabile e type-safe senza codificare un tipo concreto specifico.

Senza i generics, spesso duplichi le funzioni per ogni tipo. Con i generics, una singola implementazione può funzionare per molti tipi mantenendo le informazioni sui tipi.

## 2. Funzioni generiche (Generic functions)

### Sintassi di base

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity<number>(123);
const s = identity('hello'); // il tipo viene inferito come string
```

### Helper generico per array

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);
const firstString = firstItem(['a', 'b']);
```

## 3. Vincoli generici (Generic constraints)

A volte hai bisogno di un tipo generico con campi obbligatori.

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('TypeScript');
getLength([1, 2, 3]);
// getLength(123); // Errore: number non ha length
```

`extends` qui significa "deve soddisfare questa struttura".

## 4. Parametri di tipo multipli (Multiple type parameters)

```ts
function toPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const pair = toPair('id', 1001); // [string, number]
```

Questo è comune nelle mappe, nei dizionari e nelle utility di trasformazione dei dati.

## 5. Interfacce e alias di tipo generici

### Interfaccia generica (Generic interface)

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const userResponse: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: 'Pitt' },
};
```

### Alias di tipo generico (Generic type alias)

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };
```

## 6. Classi generiche (Generic classes)

```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }
}

const numberQueue = new Queue<number>();
numberQueue.enqueue(10);
```

## 7. Tipi generici predefiniti (Default generic types)

Puoi definire tipi di fallback.

```ts
type ApiResult<T = string> = {
  data: T;
  status: number;
};

const a: ApiResult = { data: 'ok', status: 200 };
const b: ApiResult<number> = { data: 1, status: 200 };
```

## 8. `keyof` con i generics

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alex' };
const name = pick(user, 'name'); // string
```

Questo pattern è fondamentale per molti tipi utility.

## 9. Errori comuni e best practice

### Errori comuni

- Usare troppi parametri generici senza uno scopo chiaro
- Nominare tutto `T` nelle API complesse
- Ricorrere a `any` invece di vincoli appropriati

### Best practice

- Usa nomi descrittivi nei casi complessi (`TItem`, `TValue`)
- Aggiungi vincoli dove il comportamento dipende dalla struttura
- Preferisci l'inferenza prima, argomenti di tipo espliciti solo quando necessario
- Mantieni le API generiche piccole e focalizzate

## 10. Risposte rapide per i colloqui (Quick Interview Answers)

### D1: Qual è il più grande beneficio dei generics?

Codice riutilizzabile con sicurezza dei tipi in fase di compilazione.

### D2: Cosa significa `T extends U`?

`T` deve essere assegnabile a `U`; è un vincolo generico.

### D3: Quando dovrei evitare i generics?

Quando l'astrazione non migliora la chiarezza o supporta solo un tipo concreto.
