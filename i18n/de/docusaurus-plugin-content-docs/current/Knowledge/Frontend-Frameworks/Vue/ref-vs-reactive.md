---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> Was sind ref und reactive?

`ref` und `reactive` sind zwei Kern-APIs der Vue 3 Composition API zur Erstellung reaktiver Daten.

### ref

**Definition**: `ref` wird verwendet, um einen reaktiven **primitiven Wert** oder eine **Objektreferenz** zu erstellen.

<details>
<summary>Klicken Sie hier, um das grundlegende ref-Beispiel zu erweitern</summary>

```vue
<script setup>
import { ref } from 'vue';

// Primitive Typen
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// Objekte (koennen auch ref verwenden)
const user = ref({
  name: 'John',
  age: 30,
});

// Zugriff ueber .value erforderlich
console.log(count.value); // 0
count.value++; // Wert aendern
</script>
```

</details>

### reactive

**Definition**: `reactive` wird verwendet, um ein reaktives **Objekt** zu erstellen (kann nicht direkt fuer primitive Typen verwendet werden).

<details>
<summary>Klicken Sie hier, um das grundlegende reactive-Beispiel zu erweitern</summary>

```vue
<script setup>
import { reactive } from 'vue';

// Nur fuer Objekte
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// Direkter Zugriff auf Eigenschaften, kein .value noetig
console.log(state.count); // 0
state.count++; // Wert aendern
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Hauptunterschiede zwischen ref und reactive

### 1. Anwendbare Typen

**ref**: Kann fuer jeden Typ verwendet werden

```typescript
const count = ref(0); // Zahl
const message = ref('Hello'); // String
const isActive = ref(true); // Boolean
const user = ref({ name: 'John' }); // Objekt
const items = ref([1, 2, 3]); // Array
```

**reactive**: Nur fuer Objekte

```typescript
const state = reactive({ count: 0 }); // Objekt
const state = reactive([1, 2, 3]); // Array (ist auch ein Objekt)
const count = reactive(0); // Fehler: Primitive Typen nicht moeglich
const message = reactive('Hello'); // Fehler: Primitive Typen nicht moeglich
```

### 2. Zugriffsweise

**ref**: Erfordert `.value` fuer den Zugriff

<details>
<summary>Klicken Sie hier, um das ref-Zugriffsbeispiel zu erweitern</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// In JavaScript ist .value erforderlich
console.log(count.value); // 0
count.value = 10;

// Im Template automatisches Unwrapping, kein .value noetig
</script>

<template>
  <div>{{ count }}</div>
  <!-- Automatisches Unwrapping, kein .value noetig -->
</template>
```

</details>

**reactive**: Direkter Zugriff auf Eigenschaften

<details>
<summary>Klicken Sie hier, um das reactive-Zugriffsbeispiel zu erweitern</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// Direkter Zugriff auf Eigenschaften
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Neuzuweisung

**ref**: Kann neu zugewiesen werden

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Neuzuweisung moeglich
```

**reactive**: Kann nicht neu zugewiesen werden (verliert Reaktivitaet)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // Verliert Reaktivitaet, loest keine Updates aus
```

### 4. Destrukturierung

**ref**: Behaelt Reaktivitaet nach Destrukturierung

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Destrukturiert primitive Werte, verliert Reaktivitaet

// Aber der ref selbst kann destrukturiert werden
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: Verliert Reaktivitaet nach Destrukturierung

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // Verliert Reaktivitaet

// toRefs verwenden, um Reaktivitaet zu erhalten
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // Erhaelt Reaktivitaet
```

## 3. When to Use ref vs reactive?

> Wann ref verwenden? Wann reactive?

### Situationen fuer ref

1. **Primitive Werte**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Objekte, die neu zugewiesen werden muessen**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Neuzuweisung moeglich
   ```

3. **Template Refs**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **Situationen, die Destrukturierung erfordern**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // Destrukturierung primitiver Werte kein Problem
   ```

### Situationen fuer reactive

1. **Komplexer Objektzustand**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **Zustand ohne Neuzuweisung**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **Mehrere zusammengehoerige Eigenschaften organisieren**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Haeufige Interviewfragen

### Frage 1: Grundlegende Unterschiede

Erklaeren Sie die Unterschiede und Ausgabeergebnisse des folgenden Codes.

```typescript
// Fall 1: Mit ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// Fall 2: Mit reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// Fall 3: reactive Neuzuweisung
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```typescript
// Fall 1: Mit ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10

// Fall 2: Mit reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10

// Fall 3: reactive Neuzuweisung
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // Verliert Reaktivitaet
console.log(state2.count); // 10 (Wert korrekt, aber Reaktivitaet verloren)
// Spaetere Aenderungen an state2.count loesen keine View-Updates aus
```

**Hauptunterschiede**:

- `ref` erfordert `.value` fuer den Zugriff
- `reactive` greift direkt auf Eigenschaften zu
- `reactive` kann nicht neu zugewiesen werden, verliert sonst Reaktivitaet

</details>

### Frage 2: Destrukturierungsproblem

Erklaeren Sie das Problem im folgenden Code und bieten Sie eine Loesung an.

```typescript
// Fall 1: ref-Destrukturierung
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// Fall 2: reactive-Destrukturierung
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Fall 1: ref-Destrukturierung**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // Aktualisiert user.value.name nicht

// Richtig: ref-Wert direkt aendern
user.value.name = 'Jane'; // Richtig
// Oder neu zuweisen
user.value = { name: 'Jane', age: 30 }; // Richtig
```

**Fall 2: reactive-Destrukturierung**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // Verliert Reaktivitaet, loest kein Update aus

// Richtig 1: Eigenschaft direkt aendern
state.count = 10; // Richtig

// Richtig 2: toRefs verwenden, um Reaktivitaet zu erhalten
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // Jetzt ein ref, .value erforderlich
```

**Zusammenfassung**:

- Destrukturierung primitiver Werte verliert Reaktivitaet
- `reactive`-Destrukturierung muss `toRefs` verwenden, um Reaktivitaet zu erhalten
- Destrukturierung von `ref`-Objekteigenschaften verliert ebenfalls Reaktivitaet, `.value` direkt aendern

</details>

### Frage 3: ref oder reactive waehlen?

Geben Sie an, ob in den folgenden Szenarien `ref` oder `reactive` verwendet werden sollte.

```typescript
// Szenario 1: Zaehler
const count = ?;

// Szenario 2: Formularzustand
const form = ?;

// Szenario 3: Benutzerdaten (moeglicherweise Neuzuweisung noetig)
const user = ?;

// Szenario 4: Template-Referenz
const inputRef = ?;
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```typescript
// Szenario 1: Zaehler (primitiver Typ)
const count = ref(0); // ref

// Szenario 2: Formularzustand (komplexes Objekt, keine Neuzuweisung)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // reactive

// Szenario 3: Benutzerdaten (moeglicherweise Neuzuweisung noetig)
const user = ref({ name: 'John', age: 30 }); // ref (kann neu zugewiesen werden)

// Szenario 4: Template-Referenz
const inputRef = ref(null); // ref (Template Refs muessen ref verwenden)
```

**Auswahlprinzipien**:

- Primitiver Typ -> `ref`
- Neuzuweisung noetig -> `ref`
- Template-Referenz -> `ref`
- Komplexer Objektzustand ohne Neuzuweisung -> `reactive`

</details>

## 5. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

```typescript
// 1. Primitive Typen verwenden ref
const count = ref(0);
const message = ref('Hello');

// 2. Komplexer Zustand verwendet reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. Neuzuweisung verwendet ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Richtig

// 4. reactive-Destrukturierung mit toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. Einheitlicher Stil: Team kann hauptsaechlich ref oder reactive waehlen
```

### Zu vermeidende Vorgehensweisen

```typescript
// 1. reactive nicht fuer primitive Typen verwenden
const count = reactive(0); // Fehler

// 2. reactive nicht neu zuweisen
let state = reactive({ count: 0 });
state = { count: 10 }; // Verliert Reaktivitaet

// 3. reactive nicht direkt destrukturieren
const { count } = reactive({ count: 0 }); // Verliert Reaktivitaet

// 4. .value im Template nicht vergessen (bei ref)
// Im Template kein .value noetig, aber in JavaScript schon
```

## 6. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**ref**:

- Anwendbar fuer jeden Typ
- Erfordert `.value` fuer den Zugriff
- Kann neu zugewiesen werden
- Automatisches Unwrapping im Template

**reactive**:

- Nur fuer Objekte
- Direkter Zugriff auf Eigenschaften
- Kann nicht neu zugewiesen werden
- Destrukturierung erfordert `toRefs`

**Auswahlprinzipien**:

- Primitiver Typ -> `ref`
- Neuzuweisung noetig -> `ref`
- Komplexer Objektzustand -> `reactive`

### Beispielantwort fuer Interviews

**F: Was ist der Unterschied zwischen ref und reactive?**

> "ref und reactive sind beides APIs in Vue 3 zur Erstellung reaktiver Daten. Die Hauptunterschiede umfassen: 1) Anwendbare Typen: ref kann fuer jeden Typ verwendet werden, reactive nur fuer Objekte; 2) Zugriffsweise: ref erfordert .value, reactive greift direkt auf Eigenschaften zu; 3) Neuzuweisung: ref kann neu zugewiesen werden, reactive verliert bei Neuzuweisung die Reaktivitaet; 4) Destrukturierung: reactive-Destrukturierung erfordert toRefs, um Reaktivitaet zu erhalten. Generell verwenden primitive Typen und Objekte mit Neuzuweisung ref, komplexer Objektzustand verwendet reactive."

**F: Wann ref und wann reactive verwenden?**

> "ref verwenden bei: 1) Primitiven Werten (Zahlen, Strings, Booleans); 2) Objekten mit Neuzuweisung; 3) Template Refs. reactive verwenden bei: 1) Komplexem Objektzustand mit mehreren zusammengehoerigen Eigenschaften; 2) Zustand ohne Neuzuweisung. In der Praxis verwenden viele Teams einheitlich ref, da es flexibler ist und einen breiteren Anwendungsbereich hat."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
