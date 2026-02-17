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

// Objekte (können auch ref verwenden)
const user = ref({
  name: 'John',
  age: 30,
});

// Zugriff über .value erforderlich
console.log(count.value); // 0
count.value++; // Wert ändern
</script>
```

</details>

### reactive

**Definition**: `reactive` wird verwendet, um ein reaktives **Objekt** zu erstellen (kann nicht direkt für primitive Typen verwendet werden).

<details>
<summary>Klicken Sie hier, um das grundlegende reactive-Beispiel zu erweitern</summary>

```vue
<script setup>
import { reactive } from 'vue';

// Nur für Objekte
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// Direkter Zugriff auf Eigenschaften, kein .value nötig
console.log(state.count); // 0
state.count++; // Wert ändern
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Hauptunterschiede zwischen ref und reactive

### 1. Anwendbare Typen

**ref**: Kann für jeden Typ verwendet werden

```typescript
const count = ref(0); // Zahl
const message = ref('Hello'); // String
const isActive = ref(true); // Boolean
const user = ref({ name: 'John' }); // Objekt
const items = ref([1, 2, 3]); // Array
```

**reactive**: Nur für Objekte

```typescript
const state = reactive({ count: 0 }); // Objekt
const state = reactive([1, 2, 3]); // Array (ist auch ein Objekt)
const count = reactive(0); // Fehler: Primitive Typen nicht möglich
const message = reactive('Hello'); // Fehler: Primitive Typen nicht möglich
```

### 2. Zugriffsweise

**ref**: Erfordert `.value` für den Zugriff

<details>
<summary>Klicken Sie hier, um das ref-Zugriffsbeispiel zu erweitern</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// In JavaScript ist .value erforderlich
console.log(count.value); // 0
count.value = 10;

// Im Template automatisches Unwrapping, kein .value nötig
</script>

<template>
  <div>{{ count }}</div>
  <!-- Automatisches Unwrapping, kein .value nötig -->
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
user.value = { name: 'Jane' }; // Neuzuweisung möglich
```

**reactive**: Kann nicht neu zugewiesen werden (verliert Reaktivität)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // Verliert Reaktivität, löst keine Updates aus
```

### 4. Destrukturierung

**ref**: Behält Reaktivität nach Destrukturierung

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Destrukturiert primitive Werte, verliert Reaktivität

// Aber der ref selbst kann destrukturiert werden
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: Verliert Reaktivität nach Destrukturierung

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // Verliert Reaktivität

// toRefs verwenden, um Reaktivität zu erhalten
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // Erhält Reaktivität
```

## 3. When to Use ref vs reactive?

> Wann ref verwenden? Wann reactive?

### Situationen für ref

1. **Primitive Werte**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Objekte, die neu zugewiesen werden müssen**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Neuzuweisung möglich
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

### Situationen für reactive

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

3. **Mehrere zusammengehörige Eigenschaften organisieren**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Häufige Interviewfragen

### Frage 1: Grundlegende Unterschiede

Erklären Sie die Unterschiede und Ausgabeergebnisse des folgenden Codes.

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
state2 = { count: 10 }; // Verliert Reaktivität
console.log(state2.count); // 10 (Wert korrekt, aber Reaktivität verloren)
// Spätere Änderungen an state2.count lösen keine View-Updates aus
```

**Hauptunterschiede**:

- `ref` erfordert `.value` für den Zugriff
- `reactive` greift direkt auf Eigenschaften zu
- `reactive` kann nicht neu zugewiesen werden, verliert sonst Reaktivität

</details>

### Frage 2: Destrukturierungsproblem

Erklären Sie das Problem im folgenden Code und bieten Sie eine Lösung an.

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

// Richtig: ref-Wert direkt ändern
user.value.name = 'Jane'; // Richtig
// Oder neu zuweisen
user.value = { name: 'Jane', age: 30 }; // Richtig
```

**Fall 2: reactive-Destrukturierung**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // Verliert Reaktivität, löst kein Update aus

// Richtig 1: Eigenschaft direkt ändern
state.count = 10; // Richtig

// Richtig 2: toRefs verwenden, um Reaktivität zu erhalten
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // Jetzt ein ref, .value erforderlich
```

**Zusammenfassung**:

- Destrukturierung primitiver Werte verliert Reaktivität
- `reactive`-Destrukturierung muss `toRefs` verwenden, um Reaktivität zu erhalten
- Destrukturierung von `ref`-Objekteigenschaften verliert ebenfalls Reaktivität, `.value` direkt ändern

</details>

### Frage 3: ref oder reactive wählen?

Geben Sie an, ob in den folgenden Szenarien `ref` oder `reactive` verwendet werden sollte.

```typescript
// Szenario 1: Zähler
const count = ?;

// Szenario 2: Formularzustand
const form = ?;

// Szenario 3: Benutzerdaten (möglicherweise Neuzuweisung nötig)
const user = ?;

// Szenario 4: Template-Referenz
const inputRef = ?;
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```typescript
// Szenario 1: Zähler (primitiver Typ)
const count = ref(0); // ref

// Szenario 2: Formularzustand (komplexes Objekt, keine Neuzuweisung)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // reactive

// Szenario 3: Benutzerdaten (möglicherweise Neuzuweisung nötig)
const user = ref({ name: 'John', age: 30 }); // ref (kann neu zugewiesen werden)

// Szenario 4: Template-Referenz
const inputRef = ref(null); // ref (Template Refs müssen ref verwenden)
```

**Auswahlprinzipien**:

- Primitiver Typ -> `ref`
- Neuzuweisung nötig -> `ref`
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

// 5. Einheitlicher Stil: Team kann hauptsächlich ref oder reactive wählen
```

### Zu vermeidende Vorgehensweisen

```typescript
// 1. reactive nicht für primitive Typen verwenden
const count = reactive(0); // Fehler

// 2. reactive nicht neu zuweisen
let state = reactive({ count: 0 });
state = { count: 10 }; // Verliert Reaktivität

// 3. reactive nicht direkt destrukturieren
const { count } = reactive({ count: 0 }); // Verliert Reaktivität

// 4. .value im Template nicht vergessen (bei ref)
// Im Template kein .value nötig, aber in JavaScript schon
```

## 6. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**ref**:

- Anwendbar für jeden Typ
- Erfordert `.value` für den Zugriff
- Kann neu zugewiesen werden
- Automatisches Unwrapping im Template

**reactive**:

- Nur für Objekte
- Direkter Zugriff auf Eigenschaften
- Kann nicht neu zugewiesen werden
- Destrukturierung erfordert `toRefs`

**Auswahlprinzipien**:

- Primitiver Typ -> `ref`
- Neuzuweisung nötig -> `ref`
- Komplexer Objektzustand -> `reactive`

### Beispielantwort für Interviews

**F: Was ist der Unterschied zwischen ref und reactive?**

> "ref und reactive sind beides APIs in Vue 3 zur Erstellung reaktiver Daten. Die Hauptunterschiede umfassen: 1) Anwendbare Typen: ref kann für jeden Typ verwendet werden, reactive nur für Objekte; 2) Zugriffsweise: ref erfordert .value, reactive greift direkt auf Eigenschaften zu; 3) Neuzuweisung: ref kann neu zugewiesen werden, reactive verliert bei Neuzuweisung die Reaktivität; 4) Destrukturierung: reactive-Destrukturierung erfordert toRefs, um Reaktivität zu erhalten. Generell verwenden primitive Typen und Objekte mit Neuzuweisung ref, komplexer Objektzustand verwendet reactive."

**F: Wann ref und wann reactive verwenden?**

> "ref verwenden bei: 1) Primitiven Werten (Zahlen, Strings, Booleans); 2) Objekten mit Neuzuweisung; 3) Template Refs. reactive verwenden bei: 1) Komplexem Objektzustand mit mehreren zusammengehörigen Eigenschaften; 2) Zustand ohne Neuzuweisung. In der Praxis verwenden viele Teams einheitlich ref, da es flexibler ist und einen breiteren Anwendungsbereich hat."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
