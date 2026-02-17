---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Was sind Interface und Type Alias?

### Interface (Schnittstelle)

**Definition**: Wird verwendet, um die Struktur eines Objekts zu definieren und zu beschreiben, welche Eigenschaften und Methoden ein Objekt haben soll.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Optionale Eigenschaft
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Typalias)

**Definition**: Erstellt einen Alias fur einen Typ, der fur jeden Typ verwendet werden kann, nicht nur fur Objekte.

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Hauptunterschiede zwischen Interface und Type Alias

### 1. Erweiterungsmethode

**Interface: Verwendung von extends**

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
};
```

**Type Alias: Verwendung von Intersection-Typen**

```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
};
```

### 2. Zusammenfuhrung (Declaration Merging)

**Interface: Unterstutzt Zusammenfuhrung**

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// Automatisch zu { name: string; age: number; } zusammengefuhrt
const user: User = {
  name: 'John',
  age: 30,
};
```

**Type Alias: Unterstutzt keine Zusammenfuhrung**

```typescript
type User = {
  name: string;
};

type User = {  // ❌ Fehler: Duplicate identifier 'User'
  age: number;
};
```

### 3. Anwendungsbereich

**Interface: Hauptsachlich fur Objektstrukturen**

```typescript
interface User {
  name: string;
  age: number;
}
```

**Type Alias: Fur jeden Typ verwendbar**

```typescript
// Grundtypen
type ID = string | number;

// Funktionstypen
type Greet = (name: string) => string;

// Union-Typen
type Status = 'active' | 'inactive' | 'pending';

// Tupel
type Point = [number, number];

// Objekte
type User = {
  name: string;
  age: number;
};
```

### 4. Berechnete Eigenschaften

**Interface: Unterstutzt keine berechneten Eigenschaften**

```typescript
interface User {
  [key: string]: any;  // Indexsignatur
}
```

**Type Alias: Unterstutzt komplexere Typoperationen**

```typescript
type Keys = 'name' | 'age' | 'email';

type User = {
  [K in Keys]: string;  // Mapping-Typ
};
```

## 3. When to Use Interface vs Type Alias?

> Wann Interface verwenden? Wann Type Alias verwenden?

### Interface verwenden bei

1. **Definition von Objektstrukturen** (am haufigsten)
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   ```

2. **Wenn Deklarationszusammenfuhrung benotigt wird**
   ```typescript
   interface Window {
     myCustomProperty: string;
   }
   ```

3. **Definition von Klassenvertragen**
   ```typescript
   interface Flyable {
     fly(): void;
   }

   class Bird implements Flyable {
     fly(): void {
       console.log('Flying');
     }
   }
   ```

### Type Alias verwenden bei

1. **Definition von Union- oder Intersection-Typen**
   ```typescript
   type ID = string | number;
   type Status = 'active' | 'inactive';
   ```

2. **Definition von Funktionstypen**
   ```typescript
   type EventHandler = (event: Event) => void;
   ```

3. **Definition von Tupeln**
   ```typescript
   type Point = [number, number];
   ```

4. **Wenn Mapping- oder bedingte Typen benotigt werden**
   ```typescript
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

## 4. Common Interview Questions

> Haufige Interviewfragen

### Frage 1: Grundlegende Unterschiede

Erklaren Sie die Unterschiede der folgenden zwei Definitionsmethoden.

```typescript
// Methode 1: Interface verwenden
interface User {
  name: string;
  age: number;
}

// Methode 2: Type Alias verwenden
type User = {
  name: string;
  age: number;
};
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

**Gemeinsamkeiten**:
- Beide konnen zur Definition von Objektstrukturen verwendet werden
- Die Verwendung ist identisch
- Beide konnen erweitert und vererbt werden

**Unterschiede**:

1. **Deklarationszusammenfuhrung**:
   ```typescript
   // Interface unterstutzt es
   interface User {
     name: string;
   }
   interface User {
     age: number;
   }
   // Automatisch zu { name: string; age: number; } zusammengefuhrt

   // Type Alias unterstutzt es nicht
   type User = { name: string; };
   type User = { age: number; }; // ❌ Fehler
   ```

2. **Anwendungsbereich**:
   ```typescript
   // Interface hauptsachlich fur Objekte
   interface User { ... }

   // Type Alias fur jeden Typ
   type ID = string | number;
   type Handler = (event: Event) => void;
   type Point = [number, number];
   ```

**Empfehlung**:
- Fur Objektstrukturen konnen beide verwendet werden
- Bei Bedarf an Deklarationszusammenfuhrung Interface verwenden
- Fur Nicht-Objekt-Typen Type Alias verwenden

</details>

### Frage 2: Erweiterungsmethoden

Erklaren Sie die Unterschiede der folgenden zwei Erweiterungsmethoden.

```typescript
// Methode 1: Interface extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Methode 2: Type intersection
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

**Interface extends**:
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Aquivalent zu
interface Dog {
  name: string;
  breed: string;
}
```

**Type intersection**:
```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

// Aquivalent zu
type Dog = {
  name: string;
  breed: string;
};
```

**Unterschiede**:
- **Syntax**: Interface verwendet `extends`, Type verwendet `&`
- **Ergebnis**: Beide Ergebnisse sind gleich
- **Lesbarkeit**: `extends` von Interface ist intuitiver
- **Flexibilitat**: `&` von Type kann mehrere Typen kombinieren

**Beispiel**:
```typescript
// Interface: kann nur eines erweitern
interface Dog extends Animal {
  breed: string;
}

// Type: kann mehrere kombinieren
type Dog = Animal & Canine & {
  breed: string;
};
```

</details>

### Frage 3: Deklarationszusammenfuhrung

Erklaren Sie das Verhalten des folgenden Codes.

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: 'John',
  // Was passiert, wenn age fehlt?
};
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// Die beiden Deklarationen werden automatisch zusammengefuhrt:
// interface User {
//   name: string;
//   age: number;
// }

const user: User = {
  name: 'John',
  // ❌ Fehler: Property 'age' is missing in type '{ name: string; }' but required in type 'User'
};
```

**Korrekte Schreibweise**:
```typescript
const user: User = {
  name: 'John',
  age: 30,  // ✅ age muss enthalten sein
};
```

**Anwendungsfalle der Deklarationszusammenfuhrung**:
```typescript
// Erweiterung der Typdefinitionen von Drittanbieter-Paketen
interface Window {
  myCustomProperty: string;
}

// Kann nun verwendet werden
window.myCustomProperty = 'value';
```

**Hinweis**: Type Alias unterstutzt keine Deklarationszusammenfuhrung
```typescript
type User = { name: string; };
type User = { age: number; }; // ❌ Fehler: Duplicate identifier
```

</details>

### Frage 4: Implementierung (implements)

Erklaren Sie die Unterschiede zwischen Interface und Type Alias bei der Klassenimplementierung.

```typescript
// Fall 1: Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// Fall 2: Type Alias
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

**Beide konnen fur implements verwendet werden**:

```typescript
// Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// Type Alias (Objekttyp)
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

**Unterschiede**:
- **Interface**: Traditionell haufiger fur Klassenvertrage verwendet
- **Type Alias**: Ebenfalls moglich, aber semantisch ist Interface geeigneter

**Empfehlung**:
- Fur Klassenvertrage Interface bevorzugen
- Wenn bereits mit Type Alias definiert, kann es auch implementiert werden

**Hinweis**: Mit Type Alias definierte Funktionstypen konnen nicht implementiert werden
```typescript
type Flyable = () => void;

class Bird implements Flyable {  // ❌ Fehler: Nur Objekttypen konnen implementiert werden
  // ...
}
```

</details>

## 5. Best Practices

> Best Practices

### Empfohlene Vorgehensweisen

```typescript
// 1. Fur Objektstrukturen Interface bevorzugen
interface User {
  name: string;
  age: number;
}

// 2. Fur Union-Typen Type Alias verwenden
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 3. Fur Funktionstypen Type Alias verwenden
type EventHandler = (event: Event) => void;

// 4. Fur Deklarationszusammenfuhrung Interface verwenden
interface Window {
  customProperty: string;
}

// 5. Fur Klassenvertrage Interface verwenden
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {}
}
```

### Zu vermeidende Vorgehensweisen

```typescript
// 1. Interface und Type Alias nicht fur dieselbe Struktur mischen
interface User { ... }
type User = { ... };  // ❌ Verwirrend

// 2. Type Alias nicht fur einfache Objektstrukturen verwenden (ausser bei besonderen Anforderungen)
type User = {  // ⚠️ Interface ist geeigneter
  name: string;
};

// 3. Interface nicht fur Nicht-Objekt-Typen verwenden
interface ID extends string {}  // ❌ Nicht unterstutzt
type ID = string | number;  // ✅ Korrekt
```

## 6. Interview Summary

> Zusammenfassung fur das Interview

### Schnellreferenz

**Interface (Schnittstelle)**:
- Hauptsachlich fur die Definition von Objektstrukturen
- Unterstutzt Declaration Merging
- Erweiterung mit `extends`
- Geeignet fur Klassenvertrage

**Type Alias (Typalias)**:
- Fur jeden Typ verwendbar
- Unterstutzt kein Declaration Merging
- Erweiterung mit `&` Intersection-Typ
- Geeignet fur Union-Typen, Funktionstypen, Tupel

### Beispielantworten fur das Interview

**Q: Was sind die Unterschiede zwischen Interface und Type Alias?**

> "Interface und Type Alias konnen beide zur Definition von Objektstrukturen verwendet werden, haben aber einige wesentliche Unterschiede: 1) Interface unterstutzt Declaration Merging - dasselbe Interface kann mehrfach deklariert und automatisch zusammengefuhrt werden; Type Alias unterstutzt dies nicht. 2) Interface wird hauptsachlich fur Objektstrukturen verwendet; Type Alias kann fur jeden Typ verwendet werden, einschliesslich Union-Typen, Funktionstypen, Tupel usw. 3) Interface wird mit extends erweitert; Type Alias mit Intersection-Typ &. 4) Interface ist besser fur Klassenvertrage geeignet. Im Allgemeinen konnen fur Objektstrukturen beide verwendet werden, aber bei Bedarf an Declaration Merging muss Interface und fur Nicht-Objekt-Typen muss Type Alias verwendet werden."

**Q: Wann sollte Interface und wann Type Alias verwendet werden?**

> "Interface verwenden bei: Definition von Objektstrukturen, Bedarf an Declaration Merging (z.B. Erweiterung von Drittanbieter-Typen), Definition von Klassenvertragen. Type Alias verwenden bei: Definition von Union- oder Intersection-Typen, Definition von Funktionstypen, Definition von Tupeln, Bedarf an Mapping- oder bedingten Typen. Kurz gesagt: Fur Objektstrukturen Interface bevorzugen, fur andere Typen Type Alias verwenden."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
