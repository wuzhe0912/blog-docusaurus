---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. Cosa sono `interface` e `type`?

> Come differiscono `interface` e `type` in TypeScript?

Entrambi definiscono tipi, e si sovrappongono per molti casi d'uso relativi alla forma degli oggetti.

### `interface`

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}
```

### `type`

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};
```

Per la modellazione di oggetti di base, entrambi sono validi.

## 2. Differenze principali (Key differences)

| Argomento | `interface` | `type` |
| --- | --- | --- |
| Forma dell'oggetto | Eccellente | Eccellente |
| Alias di primitivi | Non supportato | Supportato |
| Tipo union | Non supportato direttamente | Supportato |
| Tipo tupla | Non supportato direttamente | Supportato |
| Fusione delle dichiarazioni (Declaration merging) | Supportata | Non supportata |
| Tipi mappati/condizionali | Limitati | Di prima classe |

## 3. Fusione delle dichiarazioni (Declaration merging)

Le dichiarazioni `interface` con lo stesso nome vengono fuse.

```ts
interface Config {
  apiBase: string;
}

interface Config {
  timeout: number;
}

const cfg: Config = {
  apiBase: '/api',
  timeout: 5000,
};
```

`type` non può essere riaperto con lo stesso nome.

## 4. Union, tupla e composizione avanzata

Questi sono naturali con `type`.

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';
type Point = [number, number];

type ApiSuccess<T> = { ok: true; data: T };
type ApiFail = { ok: false; message: string };
type ApiResult<T> = ApiSuccess<T> | ApiFail;
```

## 5. Estensione e combinazione (Extending and combining)

### Interface extends

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}
```

### Type intersection

```ts
type Animal = { name: string };
type Dog = Animal & { bark(): void };
```

Entrambi i pattern sono comuni. Scegli quello che si adatta alle convenzioni del tuo team.

## 6. Tipi di funzione (Function types)

```ts
interface Formatter {
  (value: string): string;
}

type Parser = (input: string) => number;
```

Entrambi funzionano bene per le firme delle funzioni.

## 7. Guida decisionale pratica

Usa `interface` quando:

- Modelli principalmente contratti di oggetti
- Vuoi il comportamento di fusione delle dichiarazioni
- Definisci contratti di API pubbliche nelle librerie

Usa `type` quando:

- Hai bisogno di alias di union/tupla/primitivi
- Fai affidamento su tipi mappati o condizionali
- Vuoi comporre logica di tipo avanzata

## 8. Raccomandazione per la maggior parte dei team

- Inizia con `interface` per contratti di oggetti semplici
- Usa `type` per union, tuple e programmazione a livello di tipo
- Mantieni la coerenza in ogni codebase per ridurre il carico cognitivo

## 9. Risposte rapide per i colloqui (Quick Interview Answers)

### D1: Uno è strettamente migliore?

No. Si sovrappongono molto; le differenze emergono in scenari avanzati.

### D2: Perché gli autori di librerie potrebbero preferire `interface`?

La fusione delle dichiarazioni può migliorare l'estensibilità per i consumatori.

### D3: Perché il codice delle app potrebbe preferire `type`?

Il codice delle app usa spesso union e composizione in stile utility.
