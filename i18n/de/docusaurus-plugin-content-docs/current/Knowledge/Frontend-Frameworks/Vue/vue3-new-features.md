---
id: vue3-new-features
title: '[Easy] Vue3 Neue Features'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Welche neuen Features hat Vue 3?

Vue 3 hat viele neue Features und Verbesserungen eingefuehrt, darunter:

### Wichtigste neue Features

1. **Composition API**: Neue Schreibweise fuer Komponenten
2. **Teleport**: Komponenten an andere DOM-Positionen rendern
3. **Fragment**: Komponenten koennen mehrere Wurzelknoten haben
4. **Suspense**: Behandlung des Ladens asynchroner Komponenten
5. **Mehrere v-model**: Unterstuetzung mehrerer v-model
6. **Bessere TypeScript-Unterstuetzung**
7. **Performance-Optimierung**: Kleinere Bundle-Groesse, schnellere Rendergeschwindigkeit

## 2. Teleport

> Was ist Teleport?

**Definition**: `Teleport` erlaubt es uns, den Inhalt einer Komponente an einer anderen Stelle im DOM-Baum zu rendern, ohne die logische Struktur der Komponente zu aendern.

### Anwendungsszenarien

**Gaengige Szenarien**: Modal, Tooltip, Notification und andere Komponenten, die im body gerendert werden muessen

<details>
<summary>Klicken Sie hier, um das Teleport-Beispiel zu erweitern</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Modal oeffnen</button>

    <!-- Teleport verwenden, um Modal im body zu rendern -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal-Titel</h2>
          <p>Modal-Inhalt</p>
          <button @click="showModal = false">Schliessen</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### Vorteile

1. **Loest z-index-Probleme**: Modal wird im body gerendert, unabhaengig von Elternkomponenten-Stilen
2. **Behaelt logische Struktur bei**: Komponentenlogik bleibt am urspruenglichen Ort, nur die DOM-Position ist anders
3. **Bessere Wartbarkeit**: Modal-bezogener Code ist in der Komponente zentralisiert

## 3. Fragment (Mehrere Wurzelknoten)

> Was ist Fragment?

**Definition**: Vue 3 erlaubt Komponenten mit mehreren Wurzelknoten, ohne sie in ein einzelnes Element einwickeln zu muessen. Dies ist ein implizites Fragment, es wird keine `<Fragment>`-Tag wie in React benoetigt.

### Vue 2 vs Vue 3

**Vue 2**: Einzelner Wurzelknoten erforderlich

```vue
<!-- Vue 2: Muss in einzelnes Element eingewickelt werden -->
<template>
  <div>
    <h1>Titel</h1>
    <p>Inhalt</p>
  </div>
</template>
```

**Vue 3**: Mehrere Wurzelknoten moeglich

```vue
<!-- Vue 3: Mehrere Wurzelknoten moeglich -->
<template>
  <h1>Titel</h1>
  <p>Inhalt</p>
</template>
```

### Warum brauchen wir Fragment?

In Vue 2 mussten Komponenten einen einzelnen Wurzelknoten haben, was Entwickler oft zwang, zusaetzliche Wrapper-Elemente (wie `<div>`) hinzuzufuegen, die:

1. **Semantisches HTML brechen**: Bedeutungslose Wrapper-Elemente hinzufuegen
2. **DOM-Ebenen erhoehen**: Stilselektoren und Performance beeinflussen
3. **Stilkontrolle erschweren**: Stile des zusaetzlichen Wrapper-Elements muessen behandelt werden

### Anwendungsszenarien

#### Szenario 1: Semantische HTML-Struktur

```vue
<template>
  <!-- Kein zusaetzliches Wrapper-Element noetig -->
  <header>
    <h1>Seitentitel</h1>
  </header>
  <main>
    <p>Hauptinhalt</p>
  </main>
  <footer>
    <p>Fusszeile</p>
  </footer>
</template>
```

#### Szenario 2: Listenelement-Komponente

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### Szenario 3: Bedingte Darstellung mehrerer Elemente

```vue
<template>
  <div v-if="showHeader" class="header">Titel</div>
  <div v-if="showContent" class="content">Inhalt</div>
  <div v-if="showFooter" class="footer">Fusszeile</div>
</template>
```

### Attributvererbung (Attribute Inheritance)

Bei Komponenten mit mehreren Wurzelknoten aendert sich das Verhalten der Attributvererbung.

**Einzelner Wurzelknoten**: Attribute werden automatisch an das Wurzelelement vererbt

```vue
<!-- Elternkomponente -->
<MyComponent class="custom-class" id="my-id" />

<!-- Kindkomponente (einzelner Wurzelknoten) -->
<template>
  <div>Inhalt</div>
</template>

<!-- Render-Ergebnis -->
<div class="custom-class" id="my-id">Inhalt</div>
```

**Mehrere Wurzelknoten**: Attribute werden nicht automatisch vererbt, manuelle Zuweisung erforderlich

```vue
<!-- Elternkomponente -->
<MyComponent class="custom-class" id="my-id" />

<!-- Kindkomponente (mehrere Wurzelknoten) -->
<template>
  <div>Erster Wurzelknoten</div>
  <div>Zweiter Wurzelknoten</div>
</template>

<!-- Render-Ergebnis: Attribute werden nicht automatisch vererbt -->
<div>Erster Wurzelknoten</div>
<div>Zweiter Wurzelknoten</div>
```

**Loesung**: `$attrs` verwenden, um Attribute manuell zu binden

```vue
<!-- Kindkomponente -->
<template>
  <div v-bind="$attrs">Erster Wurzelknoten</div>
  <div>Zweiter Wurzelknoten</div>
</template>

<!-- Render-Ergebnis -->
<div class="custom-class" id="my-id">Erster Wurzelknoten</div>
<div>Zweiter Wurzelknoten</div>
```

**`inheritAttrs: false` zur Steuerung des Vererbungsverhaltens**:

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Automatische Vererbung deaktivieren
});
</script>

<template>
  <div v-bind="$attrs">Erster Wurzelknoten</div>
  <div>Zweiter Wurzelknoten</div>
</template>
```

### Fragment vs React Fragment

| Eigenschaft          | Vue 3 Fragment         | React Fragment                    |
| -------------------- | ---------------------- | --------------------------------- |
| **Syntax**           | Implizit (keine Tags)  | Explizit (`<Fragment>` oder `<>`) |
| **Key-Attribut**     | Nicht erforderlich     | Bei Bedarf `<Fragment key={...}>` |
| **Attributvererbung** | Manuelle Behandlung   | Keine Attributunterstuetzung      |

**Vue 3**:

```vue
<!-- Vue 3: Implizites Fragment -->
<template>
  <h1>Titel</h1>
  <p>Inhalt</p>
</template>
```

**React**:

```jsx
// React: Explizites Fragment
function Component() {
  return (
    <>
      <h1>Titel</h1>
      <p>Inhalt</p>
    </>
  );
}
```

### Hinweise

1. **Attributvererbung**: Bei mehreren Wurzelknoten werden Attribute nicht automatisch vererbt, `$attrs` muss manuell verwendet werden
2. **Style-Scoping**: Bei mehreren Wurzelknoten werden `scoped`-Stile auf alle Wurzelknoten angewendet
3. **Logisches Wrapping**: Wenn logisch ein Wrapper benoetigt wird, sollte weiterhin ein einzelner Wurzelknoten verwendet werden

```vue
<!-- ✅ Gute Praxis: Logisch ein Wrapper noetig -->
<template>
  <div class="card">
    <h2>Titel</h2>
    <p>Inhalt</p>
  </div>
</template>

<!-- ⚠️ Vermeiden: Mehrere Wurzelknoten ohne Notwendigkeit -->
<template>
  <h2>Titel</h2>
  <p>Inhalt</p>
  <!-- Wenn diese Elemente logisch zusammengehoeren, sollten sie eingewickelt werden -->
</template>
```

## 4. Suspense

> Was ist Suspense?

**Definition**: `Suspense` ist eine eingebaute Komponente zum Behandeln des Ladezustands asynchroner Komponenten.

### Grundlegende Verwendung

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Laden...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Anwendungsszenarien

1. **Laden asynchroner Komponenten**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **Asynchrones Laden von Daten**
   ```vue
   <script setup>
   const data = await fetchData(); // await im setup verwenden
   </script>
   ```

## 5. Multiple v-model

> Mehrere v-model

**Definition**: Vue 3 erlaubt Komponenten die Verwendung mehrerer `v-model`, wobei jedes `v-model` einem anderen Prop entspricht.

### Vue 2 vs Vue 3

**Vue 2**: Nur ein `v-model`

```vue
<!-- Vue 2: Nur ein v-model -->
<CustomInput v-model="value" />
```

**Vue 3**: Mehrere `v-model` moeglich

```vue
<!-- Vue 3: Mehrere v-model moeglich -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Implementierungsbeispiel

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> Haeufige Interviewfragen

### Frage 1: Anwendungsszenarien von Teleport

Erklaeren Sie, wann `Teleport` verwendet werden sollte.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Szenarien fuer Teleport**:

1. **Modal-Dialog**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - Loest z-index-Probleme
   - Unabhaengig von Elternkomponenten-Stilen

2. **Tooltip**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - Vermeidet Verstecken durch overflow der Elternkomponente

3. **Notification**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - Einheitliche Verwaltung der Benachrichtigungsposition

**Kein Teleport noetig bei**:

- Allgemeinem Inhalt
- Komponenten ohne besondere DOM-Positionsanforderungen

</details>

### Frage 2: Vorteile von Fragment

Erklaeren Sie die Vorteile von mehreren Wurzelknoten in Vue 3.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Vorteile**:

1. **Reduziert unnoetige DOM-Elemente**

   ```vue
   <!-- Vue 2: Zusaetzliches div noetig -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3: Kein zusaetzliches Element noetig -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **Besseres semantisches HTML**

   - Keine bedeutungslosen Wrapper-Elemente wegen Vue-Einschraenkungen
   - Behaelt die Semantik der HTML-Struktur bei

3. **Flexiblere Stilkontrolle**

   - Keine Behandlung von Wrapper-Element-Stilen noetig
   - Reduziert CSS-Selektor-Komplexitaet

4. **Weniger DOM-Ebenen**

   - Flacherer DOM-Baum, bessere Performance
   - Reduziert Browser-Rendering-Kosten

5. **Bessere Wartbarkeit**
   - Saubererer Code ohne zusaetzliche Wrapper-Elemente
   - Klarere Komponentenstruktur

</details>

### Frage 3: Fragment-Attributvererbungsproblem

Erklaeren Sie das Verhalten der Attributvererbung bei Komponenten mit mehreren Wurzelknoten. Wie loest man das?

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Problem**:

Bei Komponenten mit mehreren Wurzelknoten werden von der Elternkomponente uebergebene Attribute (wie `class`, `id` usw.) nicht automatisch an einen Wurzelknoten vererbt.

**Beispiel**:

```vue
<!-- Elternkomponente -->
<MyComponent class="custom-class" id="my-id" />

<!-- Kindkomponente (mehrere Wurzelknoten) -->
<template>
  <div>Erster Wurzelknoten</div>
  <div>Zweiter Wurzelknoten</div>
</template>

<!-- Render-Ergebnis: Attribute nicht automatisch vererbt -->
<div>Erster Wurzelknoten</div>
<div>Zweiter Wurzelknoten</div>
```

**Loesungen**:

1. **`$attrs` verwenden, um Attribute manuell zu binden**

```vue
<!-- Kindkomponente -->
<template>
  <div v-bind="$attrs">Erster Wurzelknoten</div>
  <div>Zweiter Wurzelknoten</div>
</template>

<!-- Render-Ergebnis -->
<div class="custom-class" id="my-id">Erster Wurzelknoten</div>
<div>Zweiter Wurzelknoten</div>
```

2. **`inheritAttrs: false` zur Steuerung des Vererbungsverhaltens**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Automatische Vererbung deaktivieren
});
</script>

<template>
  <div v-bind="$attrs">Erster Wurzelknoten</div>
  <div>Zweiter Wurzelknoten</div>
</template>
```

3. **Selektives Binden bestimmter Attribute**

```vue
<template>
  <div :class="$attrs.class">Erster Wurzelknoten</div>
  <div :id="$attrs.id">Zweiter Wurzelknoten</div>
</template>
```

**Wichtige Punkte**:

- Einzelner Wurzelknoten: Attribute werden automatisch vererbt
- Mehrere Wurzelknoten: Attribute werden nicht automatisch vererbt, manuelle Behandlung noetig
- Mit `$attrs` kann auf alle nicht in `props` definierten Attribute zugegriffen werden

</details>

### Frage 4: Fragment vs React Fragment

Vergleichen Sie Vue 3 Fragment und React Fragment.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Hauptunterschiede**:

| Eigenschaft          | Vue 3 Fragment               | React Fragment                    |
| -------------------- | ---------------------------- | --------------------------------- |
| **Syntax**           | Implizit (keine Tags)        | Explizit (`<Fragment>` oder `<>`) |
| **Key-Attribut**     | Nicht erforderlich           | Bei Bedarf `<Fragment key={...}>` |
| **Attributvererbung** | Manuelle Behandlung (`$attrs`) | Keine Attributunterstuetzung   |

**Vue 3**:

```vue
<!-- Vue 3: Implizites Fragment, direkt mehrere Wurzelknoten -->
<template>
  <h1>Titel</h1>
  <p>Inhalt</p>
</template>
```

**React**:

```jsx
// React: Explizites Fragment, Tags erforderlich
function Component() {
  return (
    <>
      <h1>Titel</h1>
      <p>Inhalt</p>
    </>
  );
}

// Oder mit Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>Titel</h1>
      <p>Inhalt</p>
    </Fragment>
  );
}
```

**Vorteilsvergleich**:

- **Vue 3**: Kompaktere Syntax, keine zusaetzlichen Tags
- **React**: Expliziter, Key-Attribut moeglich

</details>

### Frage 5: Verwendung von Suspense

Implementieren Sie ein Beispiel mit `Suspense` zum Laden einer asynchronen Komponente.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Benutzerdaten werden geladen...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// Asynchrone Komponente definieren
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**Fortgeschrittene Verwendung: Fehlerbehandlung**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Laden...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('Komponente erfolgreich geladen');
};

const onReject = (error) => {
  console.error('Komponente konnte nicht geladen werden:', error);
};
</script>
```

</details>

## 7. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

```vue
<!-- 1. Modal mit Teleport -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. Mehrere Wurzelknoten semantisch halten -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. Asynchrone Komponenten mit Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. Mehrere v-model mit eindeutigen Namen -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Zu vermeidende Praktiken

```vue
<!-- 1. Teleport nicht uebermaessig verwenden -->
<Teleport to="body">
  <div>Allgemeiner Inhalt</div> <!-- ❌ Nicht noetig -->
</Teleport>

<!-- 2. Struktur nicht fuer mehrere Wurzelknoten aufbrechen -->
<template>
  <h1>Titel</h1>
  <p>Inhalt</p>
  <!-- ⚠️ Wenn logisch ein Wrapper noetig ist, einzelnen Wurzelknoten verwenden -->
</template>

<!-- 3. Fehlerbehandlung bei Suspense nicht ignorieren -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ Ladefehler sollten behandelt werden -->
</Suspense>
```

## 8. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**Hauptneuerungen von Vue 3**:

- **Composition API**: Neue Schreibweise fuer Komponenten
- **Teleport**: Komponenten an andere DOM-Positionen rendern
- **Fragment**: Unterstuetzung mehrerer Wurzelknoten
- **Suspense**: Behandlung des Ladens asynchroner Komponenten
- **Mehrere v-model**: Unterstuetzung mehrerer v-model-Bindungen

**Anwendungsszenarien**:

- Modal/Tooltip → `Teleport`
- Semantisches HTML → `Fragment`
- Asynchrone Komponenten → `Suspense`
- Formularkomponenten → Mehrere `v-model`

### Beispielantwort fuer Interviews

**F: Welche sind die wichtigsten neuen Features von Vue 3?**

> "Vue 3 hat viele neue Features eingefuehrt, darunter: 1) Composition API, bietet eine neue Schreibweise mit besserer Logikorganisation und Wiederverwendbarkeit; 2) Teleport, erlaubt das Rendern von Komponenteninhalten an anderen DOM-Baum-Positionen, haeufig verwendet fuer Modal, Tooltip usw.; 3) Fragment, Komponenten koennen mehrere Wurzelknoten haben ohne zusaetzliche Wrapper-Elemente; 4) Suspense, behandelt den Ladezustand asynchroner Komponenten; 5) Mehrere v-model, unterstuetzt mehrere v-model-Bindungen pro Komponente; 6) Bessere TypeScript-Unterstuetzung und Performance-Optimierung. Diese Features machen Vue 3 leistungsfaehiger und flexibler bei gleichzeitiger Abwaertskompatibilitaet."

**F: Was sind die Anwendungsszenarien von Teleport?**

> "Teleport wird hauptsaechlich in Szenarien verwendet, in denen Komponenten an anderen DOM-Baum-Positionen gerendert werden muessen. Gaengige Szenarien sind: 1) Modal-Dialoge, die im body gerendert werden, um z-index-Probleme zu vermeiden; 2) Tooltips, die nicht durch overflow der Elternkomponente versteckt werden; 3) Benachrichtigungen mit einheitlicher Positionsverwaltung. Der Vorteil von Teleport ist, dass die logische Komponentenstruktur unveraendert bleibt und nur die DOM-Renderposition geaendert wird, was sowohl Stilprobleme loest als auch die Wartbarkeit des Codes beibehalt."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
