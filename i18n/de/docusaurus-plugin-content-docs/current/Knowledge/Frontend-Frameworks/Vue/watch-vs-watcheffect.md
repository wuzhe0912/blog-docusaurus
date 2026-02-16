---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> Was sind watch und watchEffect?

`watch` und `watchEffect` sind zwei APIs der Vue 3 Composition API zum Ueberwachen von Aenderungen reaktiver Daten.

### watch

**Definition**: Gibt explizit die zu ueberwachende Datenquelle an und fuehrt eine Callback-Funktion aus, wenn sich die Daten aendern.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Einzelne Datenquelle ueberwachen
watch(count, (newValue, oldValue) => {
  console.log(`count aenderte sich von ${oldValue} zu ${newValue}`);
});

// Mehrere Datenquellen ueberwachen
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count oder message hat sich geaendert');
});
</script>
```

### watchEffect

**Definition**: Verfolgt automatisch die reaktiven Daten, die in der Callback-Funktion verwendet werden, und fuehrt sie automatisch aus, wenn sich diese Daten aendern.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Verfolgt automatisch count und message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // Wenn sich count oder message aendert, automatisch ausfuehren
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Hauptunterschiede zwischen watch und watchEffect

### 1. Angabe der Datenquelle

**watch**: Gibt explizit die zu ueberwachenden Daten an

```typescript
const count = ref(0);
const message = ref('Hello');

// Explizit count ueberwachen
watch(count, (newVal, oldVal) => {
  console.log('count hat sich geaendert');
});

// Explizit mehrere Daten ueberwachen
watch([count, message], ([newCount, newMessage]) => {
  console.log('count oder message hat sich geaendert');
});
```

**watchEffect**: Verfolgt automatisch verwendete Daten

```typescript
const count = ref(0);
const message = ref('Hello');

// Verfolgt automatisch count und message (da sie im Callback verwendet werden)
watchEffect(() => {
  console.log(count.value); // Verfolgt count automatisch
  console.log(message.value); // Verfolgt message automatisch
});
```

### 2. Ausfuehrungszeitpunkt

**watch**: Standardmaessig lazy (verzoegert), fuehrt nur bei Datenaenderung aus

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Ausgefuehrt'); // Nur wenn sich count aendert
});

count.value = 1; // Loest Ausfuehrung aus
```

**watchEffect**: Sofortige Ausfuehrung, dann Aenderungen verfolgen

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('Ausgefuehrt'); // Wird sofort einmal ausgefuehrt
  console.log(count.value);
});

count.value = 1; // Erneute Ausfuehrung
```

### 3. Zugriff auf alten Wert

**watch**: Kann auf den alten Wert zugreifen

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Aenderte sich von ${oldVal} zu ${newVal}`);
});
```

**watchEffect**: Kein Zugriff auf den alten Wert

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Kann nur auf aktuellen Wert zugreifen
  // Alter Wert nicht verfuegbar
});
```

### 4. Ueberwachung stoppen

**watch**: Gibt eine Stopp-Funktion zurueck

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Ueberwachung stoppen
stopWatch();
```

**watchEffect**: Gibt eine Stopp-Funktion zurueck

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// Ueberwachung stoppen
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> Wann watch verwenden? Wann watchEffect?

### Wann watch verwenden

1. **Explizite Angabe der zu ueberwachenden Daten erforderlich**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **Zugriff auf alten Wert erforderlich**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`Aenderte sich von ${oldVal} zu ${newVal}`);
   });
   ```

3. **Lazy-Ausfuehrung erforderlich (nur bei Aenderung)**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **Feinere Kontrolle erforderlich**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### Wann watchEffect verwenden

1. **Automatische Verfolgung mehrerer zusammenhaengender Daten**
   ```typescript
   watchEffect(() => {
     // Verfolgt automatisch alle verwendeten reaktiven Daten
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **Alter Wert nicht benoetigt**
   ```typescript
   watchEffect(() => {
     console.log(`Aktueller Zaehler: ${count.value}`);
   });
   ```

3. **Sofortige Ausfuehrung erforderlich**
   ```typescript
   watchEffect(() => {
     // Sofort ausfuehren, dann Aenderungen verfolgen
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Haeufige Interviewfragen

### Frage 1: Grundlegende Unterschiede

Erklaeren Sie die Ausfuehrungsreihenfolge und das Ergebnis des folgenden Codes.

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch: lazy Ausfuehrung, wird nicht sofort ausgefuehrt
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: sofortige Ausfuehrung
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // Sofortige Ausgabe: watchEffect: 0 Hello
});

count.value = 1;
// Loest watch aus: watch: 1
// Loest watchEffect aus: watchEffect: 1 Hello

message.value = 'World';
// watch ueberwacht message nicht, wird nicht ausgefuehrt
// watchEffect ueberwacht message, Ausfuehrung: watchEffect: 1 World
```

**Ausgabereihenfolge**:
1. `watchEffect: 0 Hello` (sofortige Ausfuehrung)
2. `watch: 1` (count geaendert)
3. `watchEffect: 1 Hello` (count geaendert)
4. `watchEffect: 1 World` (message geaendert)

**Wesentliche Unterschiede**:
- `watch` lazy Ausfuehrung, nur bei Aenderung der ueberwachten Daten
- `watchEffect` sofortige Ausfuehrung, verfolgt dann alle verwendeten Daten

</details>

### Frage 2: Zugriff auf alten Wert

Erklaeren Sie, wie man bei Verwendung von `watchEffect` an den alten Wert gelangt.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Problem**: `watchEffect` kann nicht direkt auf den alten Wert zugreifen

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Kann nur auf aktuellen Wert zugreifen
  // Alter Wert nicht verfuegbar
});
```

**Loesung 1: ref zum Speichern des alten Werts verwenden**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`Aenderte sich von ${prevCount.value} zu ${count.value}`);
  prevCount.value = count.value; // Alten Wert aktualisieren
});
```

**Loesung 2: watch verwenden (wenn alter Wert benoetigt)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Aenderte sich von ${oldVal} zu ${newVal}`);
});
```

**Empfehlung**:
- Wenn der alte Wert benoetigt wird, bevorzugt `watch` verwenden
- `watchEffect` eignet sich fuer Szenarien ohne Bedarf an altem Wert

</details>

### Frage 3: watch oder watchEffect waehlen?

Erklaeren Sie, welches in den folgenden Szenarien verwendet werden sollte: `watch` oder `watchEffect`.

```typescript
// Szenario 1: Benutzer-ID-Aenderung ueberwachen, Benutzerdaten neu laden
const userId = ref(1);
// ?

// Szenario 2: Bei bestandener Formularvalidierung automatisch Absenden-Button aktivieren
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Szenario 3: Suchbegriff ueberwachen, Suche ausfuehren (mit Debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Szenario 1: Benutzer-ID ueberwachen**

```typescript
const userId = ref(1);

// ✅ watch verwenden: explizite Angabe der zu ueberwachenden Daten
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Szenario 2: Formularvalidierung**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ watchEffect verwenden: automatische Verfolgung zusammenhaengender Daten
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Szenario 3: Suche (mit Debounce)**

```typescript
const searchQuery = ref('');

// ✅ watch verwenden: feinere Kontrolle erforderlich (Debounce)
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**Auswahlprinzipien**:
- Explizite Ueberwachungsdaten angeben → `watch`
- Automatische Verfolgung mehrerer zusammenhaengender Daten → `watchEffect`
- Alter Wert oder feine Kontrolle benoetigt → `watch`
- Sofortige Ausfuehrung benoetigt → `watchEffect`

</details>

## 5. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

```typescript
// 1. watch verwenden, wenn explizite Ueberwachungsdaten angegeben werden
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. watchEffect verwenden, wenn mehrere zusammenhaengende Daten automatisch verfolgt werden
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. watch verwenden, wenn alter Wert benoetigt wird
watch(count, (newVal, oldVal) => {
  console.log(`Aenderte sich von ${oldVal} zu ${newVal}`);
});

// 4. Ueberwacher bereinigen nicht vergessen
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Zu vermeidende Praktiken

```typescript
// 1. Keine asynchronen Operationen in watchEffect ohne Bereinigung
watchEffect(async () => {
  const data = await fetchData(); // ❌ Kann zu Speicherlecks fuehren
  // ...
});

// 2. watchEffect nicht uebermaessig verwenden
// Wenn nur bestimmte Daten ueberwacht werden muessen, ist watch expliziter
watchEffect(() => {
  console.log(count.value); // ⚠️ Wenn nur count ueberwacht werden muss, ist watch besser geeignet
});

// 3. Keine ueberwachten Daten in watchEffect aendern (moegliche Endlosschleife)
watchEffect(() => {
  count.value++; // ❌ Kann Endlosschleife verursachen
});
```

## 6. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**watch**:
- Gibt explizit die zu ueberwachenden Daten an
- Lazy-Ausfuehrung (Standard)
- Kann auf alten Wert zugreifen
- Geeignet fuer Szenarien mit feiner Kontrolle

**watchEffect**:
- Verfolgt automatisch verwendete Daten
- Sofortige Ausfuehrung
- Kein Zugriff auf alten Wert
- Geeignet fuer automatische Verfolgung mehrerer zusammenhaengender Daten

**Auswahlprinzipien**:
- Explizite Ueberwachung → `watch`
- Automatische Verfolgung → `watchEffect`
- Alter Wert benoetigt → `watch`
- Sofortige Ausfuehrung benoetigt → `watchEffect`

### Beispielantwort fuer Interviews

**F: Was ist der Unterschied zwischen watch und watchEffect?**

> "watch und watchEffect sind beide Vue 3 APIs zum Ueberwachen von Aenderungen reaktiver Daten. Die Hauptunterschiede umfassen: 1) Datenquelle: watch erfordert die explizite Angabe der zu ueberwachenden Daten, watchEffect verfolgt automatisch die reaktiven Daten im Callback; 2) Ausfuehrungszeitpunkt: watch ist standardmaessig lazy, fuehrt nur bei Datenaenderung aus, watchEffect fuehrt sofort aus und verfolgt dann Aenderungen; 3) Zugriff auf alten Wert: watch kann auf den alten Wert zugreifen, watchEffect nicht; 4) Anwendungsszenarien: watch eignet sich fuer explizite Datenueberwachung oder wenn der alte Wert benoetigt wird, watchEffect eignet sich fuer die automatische Verfolgung mehrerer zusammenhaengender Daten."

**F: Wann sollte man watch verwenden? Wann watchEffect?**

> "watch verwenden bei: 1) Expliziter Angabe der zu ueberwachenden Daten; 2) Bedarf am alten Wert; 3) Lazy-Ausfuehrung; 4) Feiner Kontrolle (wie immediate, deep Optionen). watchEffect verwenden bei: 1) Automatischer Verfolgung mehrerer zusammenhaengender Daten; 2) Kein Bedarf am alten Wert; 3) Sofortiger Ausfuehrung. Generell gilt: Wenn nur bestimmte Daten ueberwacht werden muessen, ist watch expliziter; wenn mehrere zusammenhaengende Daten automatisch verfolgt werden sollen, ist watchEffect bequemer."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
