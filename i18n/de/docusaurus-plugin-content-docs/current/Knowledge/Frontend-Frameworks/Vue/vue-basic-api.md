---
id: vue-basic-api
title: '[Medium] Vue Grundlagen und API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Beschreiben Sie die Kernprinzipien und Vorteile des Vue-Frameworks

### Kernprinzipien

Vue ist ein progressives JavaScript-Framework, dessen Kernprinzipien folgende wichtige Konzepte umfassen:

#### 1. Virtual DOM

Verwendet Virtual DOM zur Performance-Verbesserung. Es aktualisiert nur geänderte DOM-Knoten, anstatt den gesamten DOM-Baum neu zu rendern. Der Diff-Algorithmus vergleicht Unterschiede zwischen altem und neuem Virtual DOM.

#### 2. Bidirektionale Datenbindung (Two-way Data Binding)

Wenn sich das Model ändert, aktualisiert sich die View automatisch und umgekehrt. Entwickler müssen das DOM nicht manuell manipulieren.

#### 3. Komponentenbasiert (Component-based)

Teilt die gesamte Anwendung in einzelne Komponenten auf, was die Wiederverwendbarkeit erhöht. Jede Komponente hat ihren eigenen Zustand, Stil und Logik.

#### 4. Lifecycle Hooks

Besitzt eigene Lebenszyklen. Bei Datenänderungen werden entsprechende Lifecycle Hooks ausgelöst.

#### 5. Direktivensystem

Bietet gängige Direktiven wie `v-if`, `v-for`, `v-bind`, `v-model` für schnellere Entwicklung.

#### 6. Template-Syntax

Verwendet Templates zum Schreiben von HTML, wobei Daten durch Interpolation direkt in Templates gerendert werden können.

### Einzigartige Vorteile von Vue (im Vergleich zu React)

1. **Niedrigere Lernkurve**: Einheitlicher offizieller Schreibstil
2. **Eigene Direktivensyntax**: Intuitivere UI-Logikbehandlung
3. **Einfachere bidirektionale Bindung**: `v-model` macht es sehr einfach
4. **Template- und Logiktrennung**: Bessere Lesbarkeit und Wartbarkeit
5. **Vollständiges offizielles Ökosystem**: Vue Router, Vuex/Pinia, Vue CLI

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Erklären Sie die Verwendung von `v-model`, `v-bind` und `v-html`

### `v-model`: Bidirektionale Datenbindung

Bei Datenänderung aktualisiert sich automatisch der Template-Inhalt und umgekehrt.

```vue
<template>
  <div>
    <!-- Textfeld -->
    <input v-model="message" />
    <p>Eingegebener Inhalt: {{ message }}</p>

    <!-- Checkbox -->
    <input type="checkbox" v-model="checked" />
    <p>Ausgewählt: {{ checked }}</p>

    <!-- Auswahlliste -->
    <select v-model="selected">
      <option value="A">Option A</option>
      <option value="B">Option B</option>
    </select>
    <p>Ausgewählte Option: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### `v-model`-Modifikatoren

```vue
<!-- .lazy: Aktualisierung nach change-Event -->
<input v-model.lazy="msg" />

<!-- .number: Automatische Konvertierung in Zahl -->
<input v-model.number="age" type="number" />

<!-- .trim: Automatisches Entfernen von Leerzeichen -->
<input v-model.trim="msg" />
```

### `v-bind`: Dynamische Attributbindung

Häufig zum Binden von Klassen, Links, Bildern usw. verwendet.

```vue
<template>
  <div>
    <!-- Klasse binden (Kurzform :class) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">Dynamische Klasse</div>

    <!-- Style binden -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Dynamischer Stil</div>

    <!-- Bildpfad binden -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- Link binden -->
    <a :href="linkUrl">Zum Link gehen</a>
  </div>
</template>
```

### `v-html`: HTML-String rendern

Wird verwendet, wenn zurückgegebener Inhalt HTML-Tags enthält.

**Sicherheitswarnung**: Verwenden Sie `v-html` niemals mit benutzergeneriertem Inhalt, um XSS-Schwachstellen zu vermeiden!

### Vergleichsübersicht

| Direktive | Verwendung | Kurzform | Beispiel |
| --------- | ---------------- | ---- | --------------------------- |
| `v-model` | Bidirektionale Formularbindung | Keine | `<input v-model="msg">` |
| `v-bind` | Unidirektionale Attributbindung | `:` | `<img :src="url">` |
| `v-html` | HTML-String rendern | Keine | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> Wie greift man auf HTML-Elemente zu?

In Vue wird empfohlen, **Template Refs** statt `document.querySelector` zu verwenden.

### Composition API (Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputElement = ref(null);

const focusInput = () => {
  inputElement.value?.focus();
};

onMounted(() => {
  console.log(inputElement.value);
});
</script>
```

**Hinweise**: Der Variablenname muss mit dem `ref`-Attributwert im Template übereinstimmen. DOM-Elemente erst nach `onMounted` zugreifen.

## 4. Please explain the difference between `v-show` and `v-if`

> Erklären Sie den Unterschied zwischen `v-show` und `v-if`

### Gemeinsamkeiten

Beide steuern die Anzeige und das Ausblenden von DOM-Elementen basierend auf Bedingungen.

### Unterschiede

#### 1. DOM-Manipulation

- **`v-show`**: Steuert über CSS `display`. Element bleibt im DOM.
- **`v-if`**: Entfernt oder fügt Element direkt im DOM hinzu.

#### 2. Performance-Unterschiede

- **`v-show`**: Höherer Anfangsaufwand (Element wird immer erstellt), niedrigerer Umschaltaufwand (nur CSS). Geeignet für **häufiges Umschalten**.
- **`v-if`**: Niedrigerer Anfangsaufwand (rendert nicht bei false), höherer Umschaltaufwand (zerstört/erstellt neu). Geeignet für **selten wechselnde Bedingungen**.

#### 3. Lifecycle-Auslösung

- **`v-if`**: Löst vollständigen Komponentenlebenszyklus aus
- **`v-show`**: Löst keinen Komponentenlebenszyklus aus

### Vergleichstabelle

| Eigenschaft | v-if | v-show |
| ------------ | ------------------------- | ---------------- |
| Anfangsaufwand | Niedrig (rendert nicht bei false) | Hoch (rendert immer) |
| Umschaltaufwand | Hoch (zerstört/erstellt) | Niedrig (nur CSS) |
| Anwendungsfall | Selten wechselnde Bedingungen | Häufiges Umschalten |
| Lifecycle | Löst aus | Löst nicht aus |

### Merkhilfe

> - `v-if`: Rendert nicht wenn nicht angezeigt, für selten wechselnde Bedingungen
> - `v-show`: Von Anfang an gerendert, jederzeit bereit zur Anzeige, für häufiges Umschalten

## 5. What's the difference between `computed` and `watch`?

> Was ist der Unterschied zwischen `computed` und `watch`?

### `computed` (Berechnete Eigenschaften)

- **Cache-Mechanismus**: Ergebnis wird gecacht und nur bei Abhängigkeitsänderung neu berechnet
- **Automatisches Tracking**: Verfolgt automatisch verwendete reaktive Daten
- **Synchrone Berechnung**: Muss synchron sein und Rückgabewert haben
- Geeignet für: Datenformatierung, Filterung, Summierung

### `watch` (Überwachungseigenschaften)

- **Manuelles Tracking**: Erfordert explizite Angabe der zu überwachenden Daten
- **Asynchrone Operationen**: Geeignet für API-Aufrufe, Timer usw.
- **Kein Rückgabewert**: Hauptsächlich für Seiteneffekte
- **Alter und neuer Wert**: Kann Werte vor und nach Änderung abrufen

### Vergleichstabelle

| Eigenschaft | computed | watch |
| ----------------- | ---------------------- | ---------------------- |
| **Hauptverwendung** | Neue Daten aus bestehenden berechnen | Datenänderungen überwachen und Effekte ausführen |
| **Rückgabewert** | Pflicht | Nicht erforderlich |
| **Cache** | Ja | Nein |
| **Tracking** | Automatisch | Manuell |
| **Asynchrone Ops** | Nicht unterstützt | Unterstützt |
| **Alter/neuer Wert** | Nicht verfügbar | Verfügbar |

### Merkhilfe

> **"`computed` berechnet Daten, `watch` führt Aktionen aus"**
>
> - `computed`: Zum **Berechnen neuer Daten** (Formatierung, Filterung, Summierung)
> - `watch`: Zum **Ausführen von Aktionen** (API-Anfragen, Daten speichern, Benachrichtigungen)

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
