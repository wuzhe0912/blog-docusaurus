---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> Was ist TypeScript?

TypeScript ist eine von Microsoft entwickelte Open-Source-Programmiersprache und ein **Superset** von JavaScript. Das bedeutet, dass jeder gultige JavaScript-Code auch gultiger TypeScript-Code ist.

**Kernmerkmale**:

- Fugt JavaScript ein **statisches Typsystem** hinzu
- Fuhrt Typprufungen zur Kompilierzeit durch
- Wird nach der Kompilierung in reines JavaScript umgewandelt
- Bietet eine bessere Entwicklungserfahrung und Toolunterstutzung

## 2. What are the differences between TypeScript and JavaScript?

> Was sind die Unterschiede zwischen TypeScript und JavaScript?

### Hauptunterschiede

| Eigenschaft  | JavaScript              | TypeScript              |
| ------------ | ----------------------- | ----------------------- |
| Typsystem    | Dynamisch (Laufzeitprufung) | Statisch (Kompilierzeitprufung) |
| Kompilierung | Nicht erforderlich       | Kompilierung zu JavaScript erforderlich |
| Typannotationen | Nicht unterstutzt     | Typannotationen unterstutzt |
| Fehlererkennung | Fehler zur Laufzeit   | Fehler zur Kompilierzeit |
| IDE-Unterstutzung | Grundlegend          | Leistungsstarke Autovervollstandigung und Refactoring |
| Lernkurve    | Niedrig                 | Hoher                   |

### Typsystem-Unterschiede

**JavaScript (dynamische Typisierung)**:

```javascript
let value = 10;
value = 'hello'; // Typanderung moglich
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (Stringverkettung)
add(1, '2'); // '12' (Typkonvertierung)
```

**TypeScript (statische Typisierung)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ Kompilierfehler

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Kompilierfehler
```

### Kompilierungsprozess

```typescript
// TypeScript-Quellcode
let message: string = 'Hello World';
console.log(message);

// ↓ Nach Kompilierung in JavaScript umgewandelt
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Warum TypeScript verwenden?

### Vorteile

1. **Fruhe Fehlererkennung** - Typfehler zur Kompilierzeit erkennen
2. **Bessere IDE-Unterstutzung** - Autovervollstandigung und Refactoring
3. **Code-Lesbarkeit** - Typannotationen verdeutlichen die Funktion
4. **Sichereres Refactoring** - Automatische Erkennung aktualisierungsbedurftiger Stellen

### Nachteile

1. **Kompilierungsschritt erforderlich** - Erhohte Komplexitat des Entwicklungsworkflows
2. **Lernkurve** - Typsystem muss erlernt werden
3. **Dateigrose** - Typinformationen erhohen die Quellcodegrose (nach Kompilierung kein Einfluss)
4. **Konfigurationskomplexitat** - `tsconfig.json` muss konfiguriert werden

## 4. Common Interview Questions

> Haufige Interviewfragen

### Frage 1: Zeitpunkt der Typprufung

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

- JavaScript fuhrt **zur Laufzeit** Typkonvertierungen durch, was zu unerwarteten Ergebnissen fuhren kann
- TypeScript pruft Typen **zur Kompilierzeit** und erkennt Fehler fruhzeitig

</details>

### Frage 2: Typinferenz

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

TypeScript leitet den Typ automatisch aus dem Initialwert ab. Nach der Inferenz kann der Typ nicht geandert werden (es sei denn, er wird explizit als `any` oder `union`-Typ deklariert).

</details>

### Frage 3: Laufzeitverhalten

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

- TypeScript-**Typannotationen verschwinden nach der Kompilierung vollstandig**
- Kompiliertes JavaScript ist identisch mit reinem JavaScript
- TypeScript bietet Typprufung nur in der **Entwicklungsphase** und beeinflusst die Laufzeitleistung nicht

</details>

### Frage 4: Typfehler vs Laufzeitfehler

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

- **TypeScript-Kompilierfehler**: In der Entwicklungsphase erkannt, Programm kann nicht ausgefuhrt werden
- **JavaScript-Laufzeitfehler**: Wahrend der Nutzung erkannt, fuhrt zu Programmabsturzen

TypeScript kann durch Typprufung viele Laufzeitfehler praventiv verhindern.

</details>

## 5. Best Practices

> Best Practices

### Empfohlene Vorgehensweisen

```typescript
// 1. Ruckgabetyp von Funktionen explizit angeben
function add(a: number, b: number): number { return a + b; }

// 2. Interface fur komplexe Objektstrukturen
interface User { name: string; age: number; email?: string; }

// 3. unknown statt any bevorzugen
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Typaliase fur bessere Lesbarkeit
type UserID = string;
```

## 6. Interview Summary

> Zusammenfassung fur das Interview

**Q: Was sind die Hauptunterschiede zwischen TypeScript und JavaScript?**

> "TypeScript ist ein Superset von JavaScript, der Hauptunterschied ist das statische Typsystem. JavaScript ist dynamisch typisiert mit Typprufung zur Laufzeit; TypeScript ist statisch typisiert mit Typprufung zur Kompilierzeit. Dies ermoglicht es, typbezogene Fehler bereits in der Entwicklungsphase zu erkennen. Nach der Kompilierung wird TypeScript in reines JavaScript umgewandelt, sodass das Laufzeitverhalten identisch mit JavaScript ist."

**Q: Warum TypeScript verwenden?**

> "Die Hauptvorteile sind: 1) Fruhe Fehlererkennung zur Kompilierzeit; 2) Bessere IDE-Unterstutzung mit Autovervollstandigung und Refactoring; 3) Verbesserte Code-Lesbarkeit durch Typannotationen; 4) Sichereres Refactoring durch automatische Erkennung aktualisierungsbedurftiger Stellen. Allerdings mussen die Lernkurve und der zusatzliche Kompilierungsschritt berucksichtigt werden."

## Reference

- [TypeScript Offizielle Dokumentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
