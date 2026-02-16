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

Verwendet Virtual DOM zur Performance-Verbesserung. Es aktualisiert nur geaenderte DOM-Knoten, anstatt den gesamten DOM-Baum neu zu rendern. Der Diff-Algorithmus vergleicht Unterschiede zwischen altem und neuem Virtual DOM.

#### 2. Bidirektionale Datenbindung (Two-way Data Binding)

Wenn sich das Model aendert, aktualisiert sich die View automatisch und umgekehrt. Entwickler muessen das DOM nicht manuell manipulieren.

#### 3. Komponentenbasiert (Component-based)

Teilt die gesamte Anwendung in einzelne Komponenten auf, was die Wiederverwendbarkeit erhoeht. Jede Komponente hat ihren eigenen Zustand, Stil und Logik.

#### 4. Lifecycle Hooks

Besitzt eigene Lebenszyklen. Bei Datenaenderungen werden entsprechende Lifecycle Hooks ausgeloest.

#### 5. Direktivensystem

Bietet gaengige Direktiven wie `v-if`, `v-for`, `v-bind`, `v-model` fuer schnellere Entwicklung.

#### 6. Template-Syntax

Verwendet Templates zum Schreiben von HTML, wobei Daten durch Interpolation direkt in Templates gerendert werden koennen.

### Einzigartige Vorteile von Vue (im Vergleich zu React)

1. **Niedrigere Lernkurve**: Einheitlicher offizieller Schreibstil
2. **Eigene Direktivensyntax**: Intuitivere UI-Logikbehandlung
3. **Einfachere bidirektionale Bindung**: `v-model` macht es sehr einfach
4. **Template- und Logiktrennung**: Bessere Lesbarkeit und Wartbarkeit
5. **Vollstaendiges offizielles Oekosystem**: Vue Router, Vuex/Pinia, Vue CLI

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Erklaeren Sie die Verwendung von `v-model`, `v-bind` und `v-html`

### `v-model`: Bidirektionale Datenbindung

Bei Datenaenderung aktualisiert sich automatisch der Template-Inhalt und umgekehrt.

```vue
<template>
  <div>
    <!-- Textfeld -->
    <input v-model="message" />
    <p>Eingegebener Inhalt: {{ message }}</p>

    <!-- Checkbox -->
    <input type="checkbox" v-model="checked" />
    <p>Ausgewaehlt: {{ checked }}</p>

    <!-- Auswahlliste -->
    <select v-model="selected">
      <option value="A">Option A</option>
      <option value="B">Option B</option>
    </select>
    <p>Ausgewaehlte Option: {{ selected }}</p>
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

Haeufig zum Binden von Klassen, Links, Bildern usw. verwendet.

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

Wird verwendet, wenn zurueckgegebener Inhalt HTML-Tags enthaelt.

**Sicherheitswarnung**: Verwenden Sie `v-html` niemals mit benutzergeneriertem Inhalt, um XSS-Schwachstellen zu vermeiden!

### Vergleichsuebersicht

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

**Hinweise**: Der Variablenname muss mit dem `ref`-Attributwert im Template uebereinstimmen. DOM-Elemente erst nach `onMounted` zugreifen.

## 4. Please explain the difference between `v-show` and `v-if`

> Erklaeren Sie den Unterschied zwischen `v-show` und `v-if`

### Gemeinsamkeiten

Beide steuern die Anzeige und das Ausblenden von DOM-Elementen basierend auf Bedingungen.

### Unterschiede

#### 1. DOM-Manipulation

- **`v-show`**: Steuert ueber CSS `display`. Element bleibt im DOM.
- **`v-if`**: Entfernt oder fuegt Element direkt im DOM hinzu.

#### 2. Performance-Unterschiede

- **`v-show`**: Hoeherer Anfangsaufwand (Element wird immer erstellt), niedrigerer Umschaltaufwand (nur CSS). Geeignet fuer **haeufiges Umschalten**.
- **`v-if`**: Niedrigerer Anfangsaufwand (rendert nicht bei false), hoeherer Umschaltaufwand (zerstoert/erstellt neu). Geeignet fuer **selten wechselnde Bedingungen**.

#### 3. Lifecycle-Ausloesung

- **`v-if`**: Loest vollstaendigen Komponentenlebenszyklus aus
- **`v-show`**: Loest keinen Komponentenlebenszyklus aus

### Vergleichstabelle

| Eigenschaft | v-if | v-show |
| ------------ | ------------------------- | ---------------- |
| Anfangsaufwand | Niedrig (rendert nicht bei false) | Hoch (rendert immer) |
| Umschaltaufwand | Hoch (zerstoert/erstellt) | Niedrig (nur CSS) |
| Anwendungsfall | Selten wechselnde Bedingungen | Haeufiges Umschalten |
| Lifecycle | Loest aus | Loest nicht aus |

### Merkhilfe

> - `v-if`: Rendert nicht wenn nicht angezeigt, fuer selten wechselnde Bedingungen
> - `v-show`: Von Anfang an gerendert, jederzeit bereit zur Anzeige, fuer haeufiges Umschalten

## 5. What's the difference between `computed` and `watch`?

> Was ist der Unterschied zwischen `computed` und `watch`?

### `computed` (Berechnete Eigenschaften)

- **Cache-Mechanismus**: Ergebnis wird gecacht und nur bei Abhaengigkeitsaenderung neu berechnet
- **Automatisches Tracking**: Verfolgt automatisch verwendete reaktive Daten
- **Synchrone Berechnung**: Muss synchron sein und Rueckgabewert haben
- Geeignet fuer: Datenformatierung, Filterung, Summierung

### `watch` (Ueberwachungseigenschaften)

- **Manuelles Tracking**: Erfordert explizite Angabe der zu ueberwachenden Daten
- **Asynchrone Operationen**: Geeignet fuer API-Aufrufe, Timer usw.
- **Kein Rueckgabewert**: Hauptsaechlich fuer Seiteneffekte
- **Alter und neuer Wert**: Kann Werte vor und nach Aenderung abrufen

### Vergleichstabelle

| Eigenschaft | computed | watch |
| ----------------- | ---------------------- | ---------------------- |
| **Hauptverwendung** | Neue Daten aus bestehenden berechnen | Datenaenderungen ueberwachen und Effekte ausfuehren |
| **Rueckgabewert** | Pflicht | Nicht erforderlich |
| **Cache** | Ja | Nein |
| **Tracking** | Automatisch | Manuell |
| **Asynchrone Ops** | Nicht unterstuetzt | Unterstuetzt |
| **Alter/neuer Wert** | Nicht verfuegbar | Verfuegbar |

### Merkhilfe

> **"`computed` berechnet Daten, `watch` fuehrt Aktionen aus"**
>
> - `computed`: Zum **Berechnen neuer Daten** (Formatierung, Filterung, Summierung)
> - `watch`: Zum **Ausfuehren von Aktionen** (API-Anfragen, Daten speichern, Benachrichtigungen)

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
