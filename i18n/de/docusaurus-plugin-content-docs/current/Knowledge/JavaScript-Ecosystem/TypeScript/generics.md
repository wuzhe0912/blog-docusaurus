---
id: generics
title: '[Medium] Generics (Generika)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> Was sind Generics?

Generics sind eine leistungsstarke Funktion in TypeScript, mit der wiederverwendbare Komponenten erstellt werden konnen, die mehrere Typen statt nur eines einzelnen Typs verarbeiten konnen.

**Kernkonzept**: Bei der Definition von Funktionen, Interfaces oder Klassen wird kein konkreter Typ vorab festgelegt, sondern erst bei der Verwendung angegeben.

### Warum werden Generics benotigt?

**Problem ohne Generics**:

```typescript
// Problem: Fur jeden Typ muss eine eigene Funktion geschrieben werden
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**Losung mit Generics**:

```typescript
// Eine Funktion fur alle Typen
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Grundlegende Generics-Syntax

### Generische Funktionen

```typescript
// Syntax: <T> steht fur den Typparameter
function identity<T>(arg: T): T {
  return arg;
}

// Verwendung 1: Typ explizit angeben
let output1 = identity<string>('hello');  // output1: string

// Verwendung 2: TypeScript den Typ inferieren lassen
let output2 = identity('hello');  // output2: string (automatisch inferiert)
```

### Generische Interfaces

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### Generische Klassen

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> Generische Einschrankungen

### Grundlegende Einschrankungen

**Syntax**: Verwendung des `extends`-Schlusselworts zur Einschrankung des generischen Typs.

```typescript
// T muss eine length-Eigenschaft haben
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Fehler: number hat keine length-Eigenschaft
```

### Einschrankung mit keyof

```typescript
// K muss ein Schlussel von T sein
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ Fehler: 'id' ist kein Schlussel von user
```

### Mehrere Einschrankungen

```typescript
// T muss mehrere Bedingungen gleichzeitig erfullen
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Fehler: boolean liegt ausserhalb der Einschrankung
```

## 4. Common Interview Questions

> Haufige Interviewfragen

### Frage 1: Generische Funktion implementieren

Implementieren Sie eine generische Funktion `first`, die das erste Element eines Arrays zuruckgibt.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Ihre Implementierung
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Verwendungsbeispiel
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**Erklarung**:
- `<T>` definiert den generischen Typparameter
- `arr: T[]` steht fur ein Array vom Typ T
- Ruckgabewert `T | undefined` bedeutet, dass es vom Typ T oder undefined sein kann

</details>

### Frage 2: Generische Einschrankungen

Implementieren Sie eine Funktion, die zwei Objekte zusammenfuhrt, aber nur die Eigenschaften des ersten Objekts zusammenfuhrt.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Ihre Implementierung
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// Verwendungsbeispiel
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**Fortgeschrittene Version (nur Eigenschaften des ersten Objekts zusammenfuhren)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Kann nur Eigenschaften von obj1 enthalten

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Frage 3: Generisches Interface

Definieren Sie ein generisches Interface `Repository` fur Datenzugriffsoperationen.

```typescript
interface Repository<T> {
  // Ihre Definition
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Implementierungsbeispiel
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### Frage 4: Generische Einschrankungen und keyof

Implementieren Sie eine Funktion, die den Eigenschaftswert eines Objekts anhand des Schlusselnamens abruft und Typsicherheit gewahrleistet.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Ihre Implementierung
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Verwendungsbeispiel
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ Fehler: 'id' ist kein Schlussel von user
```

**Erklarung**:
- `K extends keyof T` stellt sicher, dass K einer der Schlussel von T ist
- `T[K]` steht fur den Typ des Wertes, der dem Schlussel K im Objekt T entspricht
- Dies gewahrleistet Typsicherheit und ermoglicht die Erkennung von Fehlern zur Kompilierzeit

</details>

### Frage 5: Bedingte Typen und Generics

Erklaren Sie die Typinferenzergebnisse des folgenden Codes.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Erklarung**:
- `NonNullable<T>` ist ein bedingter Typ (Conditional Type)
- Wenn T `null | undefined` zuweisbar ist, wird `never` zuruckgegeben, andernfalls `T`
- Bei `string | null` erfullt `string` die Bedingung nicht, `null` schon, daher ist das Ergebnis `string`
- Bei `string | number` erfullen beide die Bedingung nicht, daher ist das Ergebnis `string | number`

**Praktische Anwendung**:
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> Fortgeschrittene Generics-Muster

### Standard-Typparameter

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Verwendet Standardtyp string
const container2: Container<number> = { value: 42 };
```

### Mehrere Typparameter

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Generische Hilfstypen

```typescript
// Partial: Alle Eigenschaften werden optional
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: Alle Eigenschaften werden erforderlich
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: Bestimmte Eigenschaften auswahlen
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: Bestimmte Eigenschaften ausschliessen
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Best Practices

### Empfohlene Vorgehensweisen

```typescript
// 1. Aussagekraftige Generics-Namen verwenden
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Einschrankungen zur Begrenzung des Generics-Bereichs verwenden
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Standard-Typparameter bereitstellen
interface Config<T = string> {
  value: T;
}

// 4. Generische Hilfstypen verwenden
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Zu vermeidende Vorgehensweisen

```typescript
// 1. Generics nicht ubermassig verwenden
function process<T>(value: T): T {  // ⚠️ Wenn nur ein Typ vorhanden ist, sind Generics unnotig
  return value;
}

// 2. Keine einzelnen Buchstaben als Generics-Namen verwenden (ausser in einfachen Fallen)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Bedeutung unklar
  // ...
}

// 3. Einschrankungen nicht ignorieren
function process<T>(value: T) {  // ⚠️ Bei Einschrankungen sollten Constraints hinzugefugt werden
  return value.length;  // Moglicher Fehler
}
```

## 7. Interview Summary

> Zusammenfassung fur das Interview

### Schnellreferenz

**Generics-Kernkonzepte**:
- Bei der Definition keinen konkreten Typ angeben, erst bei der Verwendung
- Syntax: `<T>` definiert den Typparameter
- Anwendbar auf Funktionen, Interfaces, Klassen

**Generische Einschrankungen**:
- `extends` zur Einschrankung des Generics-Bereichs
- `K extends keyof T` stellt sicher, dass K ein Schlussel von T ist
- Mehrere Einschrankungen kombinierbar

**Gangige Muster**:
- Generische Funktion: `function identity<T>(arg: T): T`
- Generisches Interface: `interface Box<T> { value: T; }`
- Generische Klasse: `class Container<T> { ... }`

### Beispielantworten fur das Interview

**Q: Was sind Generics? Warum werden sie benotigt?**

> "Generics sind ein Mechanismus in TypeScript zur Erstellung wiederverwendbarer Komponenten, bei dem der konkrete Typ nicht bei der Definition, sondern erst bei der Verwendung angegeben wird. Die Hauptvorteile von Generics sind: 1) Erhohte Code-Wiederverwendbarkeit - eine Funktion kann mehrere Typen verarbeiten; 2) Typsicherheit beibehalten - Typfehler zur Kompilierzeit prufen; 3) Weniger duplizierter Code - nicht fur jeden Typ eine eigene Funktion schreiben mussen. Zum Beispiel kann `function identity<T>(arg: T): T` jeden Typ verarbeiten, ohne separate Funktionen fur string, number usw. schreiben zu mussen."

**Q: Was sind generische Einschrankungen? Wie werden sie verwendet?**

> "Generische Einschrankungen verwenden das `extends`-Schlusselwort, um den Bereich des generischen Typs einzuschranken. Zum Beispiel stellt `function getLength<T extends { length: number }>(arg: T)` sicher, dass T eine length-Eigenschaft haben muss. Eine weitere haufige Einschrankung ist `K extends keyof T`, die sicherstellt, dass K einer der Schlussel von T ist, was einen typsicheren Eigenschaftszugriff ermoglicht. Einschrankungen helfen dabei, bei der Verwendung von Generics die Typsicherheit beizubehalten und gleichzeitig die notwendigen Typinformationen bereitzustellen."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
