---
id: static-hoisting
title: '[Medium] Vue3 Static Hoisting'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> Was ist Static Hoisting in Vue3?

In Vue3 ist das sogenannte **Static Hoisting (Statisches Hochheben)** eine Optimierungstechnik in der Kompilierungsphase.

### Definition

**Static Hoisting** bedeutet, dass der Vue 3-Compiler beim Kompilieren des Templates analysiert, welche Knoten keinerlei Abhaengigkeit von reaktivem Zustand haben und sich niemals aendern werden. Diese statischen Knoten werden als Konstanten an den Dateianfang extrahiert, nur beim ersten Render erstellt und bei nachfolgenden Re-Renders direkt wiederverwendet. Dies reduziert die Kosten fuer VNode-Erstellung und Diff.

### Funktionsweise

Der Compiler analysiert das Template und extrahiert Knoten, die vollstaendig unabhaengig vom reaktiven Zustand sind und sich nie aendern, als Konstanten an den Dateianfang. Sie werden nur einmal beim ersten Render erstellt und danach direkt wiederverwendet.

### Vergleich Vor und Nach der Kompilierung

**Template Vor der Kompilierung**:

<details>
<summary>Klicken Sie hier, um das Template-Beispiel zu erweitern</summary>

```vue
<template>
  <div>
    <h1>Statischer Titel</h1>
    <p>Statischer Inhalt</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**Kompiliertes JavaScript** (vereinfacht):

<details>
<summary>Klicken Sie hier, um das kompilierte JavaScript zu erweitern</summary>

```js
// Statische Knoten an den Anfang gehoben, nur einmal erstellt
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Statischer Titel');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Statischer Inhalt');

function render() {
  return h('div', null, [
    _hoisted_1, // Direkt wiederverwendet, keine Neuerstellung
    _hoisted_2, // Direkt wiederverwendet, keine Neuerstellung
    h('div', null, dynamicContent.value), // Dynamischer Inhalt muss neu erstellt werden
  ]);
}
```

</details>

### Vorteile

1. **Reduziert VNode-Erstellungskosten**: Statische Knoten werden nur einmal erstellt und danach wiederverwendet
2. **Reduziert Diff-Kosten**: Statische Knoten nehmen nicht am Diff-Vergleich teil
3. **Verbessert Rendering-Performance**: Besonders wirksam bei Komponenten mit viel statischem Inhalt
4. **Automatische Optimierung**: Entwickler muessen nichts Besonderes tun, um von dieser Optimierung zu profitieren

## 2. How Static Hoisting Works

> Wie funktioniert Static Hoisting?

### Analyseprozess des Compilers

Der Compiler analysiert jeden Knoten im Template:

1. **Prueft, ob der Knoten dynamische Bindungen enthaelt** - Prueft auf `{{ }}`, `v-bind`, `v-if`, `v-for` und andere dynamische Direktiven
2. **Markiert statische Knoten** - Wenn Knoten und Kindknoten keine dynamischen Bindungen haben, wird er als statisch markiert
3. **Hebt statische Knoten hoch** - Extrahiert statische Knoten ausserhalb der Render-Funktion als Modul-Konstanten

### Beispiel 1: Grundlegendes Static Hoisting

<details>
<summary>Klicken Sie hier, um das Grundbeispiel zu erweitern</summary>

```vue
<template>
  <div>
    <h1>Titel</h1>
    <p>Dies ist statischer Inhalt</p>
    <div>Statischer Block</div>
  </div>
</template>
```

</details>

### Beispiel 2: Gemischter statischer und dynamischer Inhalt

<details>
<summary>Klicken Sie hier, um das Mischbeispiel zu erweitern</summary>

```vue
<template>
  <div>
    <h1>Statischer Titel</h1>
    <p>{{ message }}</p>
    <div class="static-class">Statischer Inhalt</div>
    <span :class="dynamicClass">Dynamischer Inhalt</span>
  </div>
</template>
```

</details>

## 3. v-once Directive

> v-once-Direktive

Wenn ein Entwickler manuell einen grossen Block markieren moechte, der sich nie aendern wird, kann die `v-once`-Direktive verwendet werden.

### Funktion von v-once

`v-once` teilt dem Compiler mit, dass dieses Element und seine Kinder nur einmal gerendert werden sollen. Selbst wenn dynamische Bindungen enthalten sind, werden sie nur bei der ersten Renderung berechnet und danach nicht mehr aktualisiert.

### v-once vs Static Hoisting

| Eigenschaft | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Ausloesung** | Automatisch (Compiler-Analyse) | Manuell (Entwickler-Markierung) |
| **Anwendungsfall** | Vollstaendig statischer Inhalt | Enthaelt dynamische Bindungen, wird aber nur einmal gerendert |
| **Performance** | Optimal (nimmt nicht am Diff teil) | Gut (wird nur einmal gerendert) |
| **Verwendungszeitpunkt** | Compiler entscheidet automatisch | Entwickler weiss, dass sich nichts aendert |

### Anwendungsszenarien

```vue
<template>
  <!-- Szenario 1: Einmalig angezeigte Daten -->
  <div v-once>
    <p>Erstellungszeit: {{ createdAt }}</p>
    <p>Ersteller: {{ creator }}</p>
  </div>

  <!-- Szenario 2: Komplexe statische Struktur -->
  <div v-once>
    <div class="header">
      <h1>Titel</h1>
      <nav>Navigation</nav>
    </div>
  </div>

  <!-- Szenario 3: Statische Elemente in Listen -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> Haeufige Interviewfragen

### Frage 1: Prinzip des Static Hoisting

Erklaeren Sie das Funktionsprinzip von Static Hoisting in Vue3 und wie es die Performance verbessert.

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Funktionsprinzip**: 1) Kompilierungsphase-Analyse: Der Compiler analysiert jeden Knoten und markiert solche ohne dynamische Bindungen als statisch; 2) Knotenhochhebung: Statische Knoten werden ausserhalb der Render-Funktion als Konstanten definiert; 3) Wiederverwendungsmechanismus: Nachfolgende Renders verwenden diese statischen Knoten direkt wieder.

**Performance-Verbesserung**: Reduziert VNode-Erstellungskosten, Diff-Kosten, Speicherverbrauch und erhoeht die Rendering-Geschwindigkeit. In Komponenten mit viel statischem Inhalt kann dies 30-50% der VNode-Erstellungszeit und 40-60% der Diff-Vergleichszeit einsparen.

</details>

### Frage 2: Unterschied zwischen Static Hoisting und v-once

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

**Hauptunterschiede**: Static Hoisting ist automatisch durch den Compiler, fuer vollstaendig statischen Inhalt. v-once ist manuell vom Entwickler markiert, fuer Inhalte mit dynamischen Bindungen die nur einmal gerendert werden. Static Hoisting nimmt nicht am Diff teil (optimale Performance), v-once wird nur einmal gerendert (gute Performance).

**Empfehlung**: Vollstaendig statischer Inhalt -> Compiler automatisch behandeln lassen. Dynamische Bindungen, die nur einmal gerendert werden -> `v-once` verwenden. Inhalt mit reaktiven Updates -> kein `v-once`.

</details>

## 5. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

```vue
<!-- 1. Compiler automatisch statischen Inhalt behandeln lassen -->
<template>
  <div>
    <h1>Titel</h1>
    <p>Statischer Inhalt</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. v-once explizit fuer einmalig gerenderten Inhalt verwenden -->
<template>
  <div v-once>
    <p>Erstellungszeit: {{ createdAt }}</p>
    <p>Ersteller: {{ creator }}</p>
  </div>
</template>
```

## 6. Interview Summary

> Interview-Zusammenfassung

### Schnelle Merkhilfe

**Static Hoisting**: Kompilierungsphase-Optimierung, hebt statische Knoten als Konstanten hoch, erstellt nur einmal. Automatisch, Entwickler merkt nichts.

**v-once**: Manuelle Markierung fuer einmalig gerenderten Inhalt. Geeignet fuer Bloecke mit dynamischen Bindungen die sich nicht aendern.

### Beispielantwort fuer Interviews

**F: Was ist Static Hoisting in Vue3?**

> "In Vue3 ist Static Hoisting eine Optimierung in der Kompilierungsphase. Der Compiler analysiert das Template und extrahiert Knoten, die keinerlei Abhaengigkeit von reaktivem Zustand haben, als Konstanten an den Dateianfang. Sie werden nur beim ersten Render erstellt und danach direkt wiederverwendet, was die VNode-Erstellungs- und Diff-Kosten reduziert. Entwickler muessen nichts Besonderes tun - der Compiler entscheidet automatisch, welche Knoten hochgehoben werden koennen. Fuer manuelle Markierung von unveraenderlichem Inhalt kann v-once verwendet werden."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
