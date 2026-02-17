---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> Was sind watch und watchEffect?

`watch` und `watchEffect` sind zwei APIs der Vue 3 Composition API zum Überwachen von Änderungen reaktiver Daten.

### watch

**Definition**: Gibt explizit die zu überwachende Datenquelle an und führt eine Callback-Funktion aus, wenn sich die Daten ändern.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Einzelne Datenquelle überwachen
watch(count, (newValue, oldValue) => {
  console.log(`count änderte sich von ${oldValue} zu ${newValue}`);
});

// Mehrere Datenquellen überwachen
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count oder message hat sich geändert');
});
</script>
```

### watchEffect

**Definition**: Verfolgt automatisch die reaktiven Daten, die in der Callback-Funktion verwendet werden, und führt sie automatisch aus, wenn sich diese Daten ändern.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Verfolgt automatisch count und message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // Wenn sich count oder message ändert, automatisch ausführen
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Hauptunterschiede zwischen watch und watchEffect

### 1. Angabe der Datenquelle

**watch**: Gibt explizit die zu überwachenden Daten an

```typescript
const count = ref(0);
const message = ref('Hello');

// Explizit count überwachen
watch(count, (newVal, oldVal) => {
  console.log('count hat sich geändert');
});

// Explizit mehrere Daten überwachen
watch([count, message], ([newCount, newMessage]) => {
  console.log('count oder message hat sich geändert');
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

### 2. Ausführungszeitpunkt

**watch**: Standardmäßig lazy (verzögert), führt nur bei Datenänderung aus

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Ausgeführt'); // Nur wenn sich count ändert
});

count.value = 1; // Löst Ausführung aus
```

**watchEffect**: Sofortige Ausführung, dann Änderungen verfolgen

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('Ausgeführt'); // Wird sofort einmal ausgeführt
  console.log(count.value);
});

count.value = 1; // Erneute Ausführung
```

### 3. Zugriff auf alten Wert

**watch**: Kann auf den alten Wert zugreifen

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Änderte sich von ${oldVal} zu ${newVal}`);
});
```

**watchEffect**: Kein Zugriff auf den alten Wert

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Kann nur auf aktuellen Wert zugreifen
  // Alter Wert nicht verfügbar
});
```

### 4. Überwachung stoppen

**watch**: Gibt eine Stopp-Funktion zurück

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Überwachung stoppen
stopWatch();
```

**watchEffect**: Gibt eine Stopp-Funktion zurück

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// Überwachung stoppen
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> Wann watch verwenden? Wann watchEffect?

### Wann watch verwenden

1. **Explizite Angabe der zu überwachenden Daten erforderlich**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **Zugriff auf alten Wert erforderlich**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`Änderte sich von ${oldVal} zu ${newVal}`);
   });
   ```

3. **Lazy-Ausführung erforderlich (nur bei Änderung)**
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

1. **Automatische Verfolgung mehrerer zusammenhängender Daten**
   ```typescript
   watchEffect(() => {
     // Verfolgt automatisch alle verwendeten reaktiven Daten
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **Alter Wert nicht benötigt**
   ```typescript
   watchEffect(() => {
     console.log(`Aktueller Zähler: ${count.value}`);
   });
   ```

3. **Sofortige Ausführung erforderlich**
   ```typescript
   watchEffect(() => {
     // Sofort ausführen, dann Änderungen verfolgen
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Häufige Interviewfragen

### Frage 1: Grundlegende Unterschiede

Erklären Sie die Ausführungsreihenfolge und das Ergebnis des folgenden Codes.

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

// watch: lazy Ausführung, wird nicht sofort ausgeführt
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: sofortige Ausführung
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // Sofortige Ausgabe: watchEffect: 0 Hello
});

count.value = 1;
// Löst watch aus: watch: 1
// Löst watchEffect aus: watchEffect: 1 Hello

message.value = 'World';
// watch überwacht message nicht, wird nicht ausgeführt
// watchEffect überwacht message, Ausführung: watchEffect: 1 World
```

**Ausgabereihenfolge**:
1. `watchEffect: 0 Hello` (sofortige Ausführung)
2. `watch: 1` (count geändert)
3. `watchEffect: 1 Hello` (count geändert)
4. `watchEffect: 1 World` (message geändert)

**Wesentliche Unterschiede**:
- `watch` lazy Ausführung, nur bei Änderung der überwachten Daten
- `watchEffect` sofortige Ausführung, verfolgt dann alle verwendeten Daten

</details>

### Frage 2: Zugriff auf alten Wert

Erklären Sie, wie man bei Verwendung von `watchEffect` an den alten Wert gelangt.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Problem**: `watchEffect` kann nicht direkt auf den alten Wert zugreifen

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Kann nur auf aktuellen Wert zugreifen
  // Alter Wert nicht verfügbar
});
```

**Lösung 1: ref zum Speichern des alten Werts verwenden**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`Änderte sich von ${prevCount.value} zu ${count.value}`);
  prevCount.value = count.value; // Alten Wert aktualisieren
});
```

**Lösung 2: watch verwenden (wenn alter Wert benötigt)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Änderte sich von ${oldVal} zu ${newVal}`);
});
```

**Empfehlung**:
- Wenn der alte Wert benötigt wird, bevorzugt `watch` verwenden
- `watchEffect` eignet sich für Szenarien ohne Bedarf an altem Wert

</details>

### Frage 3: watch oder watchEffect wählen?

Erklären Sie, welches in den folgenden Szenarien verwendet werden sollte: `watch` oder `watchEffect`.

```typescript
// Szenario 1: Benutzer-ID-Änderung überwachen, Benutzerdaten neu laden
const userId = ref(1);
// ?

// Szenario 2: Bei bestandener Formularvalidierung automatisch Absenden-Button aktivieren
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Szenario 3: Suchbegriff überwachen, Suche ausführen (mit Debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Szenario 1: Benutzer-ID überwachen**

```typescript
const userId = ref(1);

// ✅ watch verwenden: explizite Angabe der zu überwachenden Daten
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Szenario 2: Formularvalidierung**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ watchEffect verwenden: automatische Verfolgung zusammenhängender Daten
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
- Explizite Überwachungsdaten angeben → `watch`
- Automatische Verfolgung mehrerer zusammenhängender Daten → `watchEffect`
- Alter Wert oder feine Kontrolle benötigt → `watch`
- Sofortige Ausführung benötigt → `watchEffect`

</details>

## 5. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

```typescript
// 1. watch verwenden, wenn explizite Überwachungsdaten angegeben werden
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. watchEffect verwenden, wenn mehrere zusammenhängende Daten automatisch verfolgt werden
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. watch verwenden, wenn alter Wert benötigt wird
watch(count, (newVal, oldVal) => {
  console.log(`Änderte sich von ${oldVal} zu ${newVal}`);
});

// 4. Überwacher bereinigen nicht vergessen
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Zu vermeidende Praktiken

```typescript
// 1. Keine asynchronen Operationen in watchEffect ohne Bereinigung
watchEffect(async () => {
  const data = await fetchData(); // ❌ Kann zu Speicherlecks führen
  // ...
});

// 2. watchEffect nicht übermäßig verwenden
// Wenn nur bestimmte Daten überwacht werden müssen, ist watch expliziter
watchEffect(() => {
  console.log(count.value); // ⚠️ Wenn nur count überwacht werden muss, ist watch besser geeignet
});

// 3. Keine überwachten Daten in watchEffect ändern (mögliche Endlosschleife)
watchEffect(() => {
  count.value++; // ❌ Kann Endlosschleife verursachen
});
```

## 6. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**watch**:
- Gibt explizit die zu überwachenden Daten an
- Lazy-Ausführung (Standard)
- Kann auf alten Wert zugreifen
- Geeignet für Szenarien mit feiner Kontrolle

**watchEffect**:
- Verfolgt automatisch verwendete Daten
- Sofortige Ausführung
- Kein Zugriff auf alten Wert
- Geeignet für automatische Verfolgung mehrerer zusammenhängender Daten

**Auswahlprinzipien**:
- Explizite Überwachung → `watch`
- Automatische Verfolgung → `watchEffect`
- Alter Wert benötigt → `watch`
- Sofortige Ausführung benötigt → `watchEffect`

### Beispielantwort für Interviews

**F: Was ist der Unterschied zwischen watch und watchEffect?**

> "watch und watchEffect sind beide Vue 3 APIs zum Überwachen von Änderungen reaktiver Daten. Die Hauptunterschiede umfassen: 1) Datenquelle: watch erfordert die explizite Angabe der zu überwachenden Daten, watchEffect verfolgt automatisch die reaktiven Daten im Callback; 2) Ausführungszeitpunkt: watch ist standardmäßig lazy, führt nur bei Datenänderung aus, watchEffect führt sofort aus und verfolgt dann Änderungen; 3) Zugriff auf alten Wert: watch kann auf den alten Wert zugreifen, watchEffect nicht; 4) Anwendungsszenarien: watch eignet sich für explizite Datenüberwachung oder wenn der alte Wert benötigt wird, watchEffect eignet sich für die automatische Verfolgung mehrerer zusammenhängender Daten."

**F: Wann sollte man watch verwenden? Wann watchEffect?**

> "watch verwenden bei: 1) Expliziter Angabe der zu überwachenden Daten; 2) Bedarf am alten Wert; 3) Lazy-Ausführung; 4) Feiner Kontrolle (wie immediate, deep Optionen). watchEffect verwenden bei: 1) Automatischer Verfolgung mehrerer zusammenhängender Daten; 2) Kein Bedarf am alten Wert; 3) Sofortiger Ausführung. Generell gilt: Wenn nur bestimmte Daten überwacht werden müssen, ist watch expliziter; wenn mehrere zusammenhängende Daten automatisch verfolgt werden sollen, ist watchEffect bequemer."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
