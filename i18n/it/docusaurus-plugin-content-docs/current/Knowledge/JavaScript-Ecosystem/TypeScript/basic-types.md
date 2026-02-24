---
id: basic-types
title: '[Easy] Tipi di base e annotazioni di tipo'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. Quali sono i tipi di base di TypeScript?

> Quali tipi di base fornisce TypeScript?

TypeScript aggiunge un sistema di tipi statici sopra JavaScript. Puoi annotare variabili, parametri di funzione e valori di ritorno per individuare errori prima del runtime.

### Tipi primitivi comuni

```ts
let age: number = 30;
let price: number = 99.99;

let userName: string = 'John';
let message: string = `Ciao, ${userName}`;

let isActive: boolean = true;
```

### `null` e `undefined`

```ts
let emptyValue: null = null;
let notAssigned: undefined = undefined;
```

Con `strictNullChecks` abilitato, `null` e `undefined` non sono assegnabili a tutti i tipi.

## 2. Quali sono i tipi oggetto, array e tupla?

### Tipo oggetto (Object type)

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};

const user: User = {
  id: 1,
  name: 'Pitt',
};
```

### Tipo array (Array type)

```ts
const scores: number[] = [80, 90, 100];
const tags: Array<string> = ['ts', 'react'];
```

### Tipo tupla (Tuple type)

Una tupla ha lunghezza fissa e posizioni fisse.

```ts
const point: [number, number] = [10, 20];
const userRecord: [number, string, boolean] = [1, 'Alice', true];
```

## 3. Quali sono i tipi union e literal?

### Tipo union (Union type)

```ts
let id: string | number = 'A001';
id = 1001;
```

### Tipo literal (Literal type)

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';

let requestStatus: Status = 'idle';
requestStatus = 'success';
```

I tipi union e literal sono utili per modellare stati finiti.

## 4. Cosa sono `any`, `unknown`, `void` e `never`?

### `any`

`any` disabilita la sicurezza dei tipi. Usa solo come scappatoia temporanea.

```ts
let data: any = 10;
data = 'text';
data = { ok: true };
```

### `unknown`

`unknown` è più sicuro di `any`. Devi restringere il tipo prima dell'uso.

```ts
function printLength(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.length);
  }
}
```

### `void`

`void` di solito significa che una funzione non restituisce un valore.

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

### `never`

`never` significa che un valore non può mai verificarsi.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

## 5. Come funzionano le annotazioni di tipo per le funzioni?

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

### Parametri opzionali e predefiniti

```ts
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

function formatPrice(price: number, currency: string = 'USD'): string {
  return `${currency} ${price.toFixed(2)}`;
}
```

## 6. Cos'è l'inferenza di tipo (Type Inference)?

TypeScript può inferire i tipi dai valori.

```ts
let count = 0; // inferito come number
const framework = 'React'; // inferito come stringa literal 'React'
```

Non hai bisogno di annotazioni ovunque. Aggiungi annotazioni esplicite dove le API o i confini dovrebbero essere chiari.

## 7. Errori comuni e best practice

### Errori comuni

- Uso eccessivo di `any`
- Dimenticare la modalità `strict`
- Usare tipi ampi dove i tipi union literal sono migliori

### Best practice

- Abilita la modalità strict in `tsconfig.json`
- Preferisci `unknown` rispetto a `any`
- Usa tipi union/literal per la modellazione degli stati
- Mantieni esplicite le firme delle funzioni pubbliche

## 8. Risposte rapide per i colloqui (Quick Interview Answers)

### D1: Perché usare i tipi di base di TypeScript?

Per individuare le incompatibilità di tipo in fase di compilazione e migliorare gli strumenti dell'IDE.

### D2: `any` vs `unknown`?

`any` disabilita il controllo. `unknown` forza il restringimento del tipo prima dell'uso.

### D3: Quando dovrei usare una tupla invece di un array?

Usa una tupla quando posizione e lunghezza sono fisse e significative.
