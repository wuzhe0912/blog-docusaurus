---
title: '[Lv2] Nuxt 3 Lifecycle und Hydration Prinzipien'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Tiefgehendes Verstaendnis des Lebenszyklus (Lifecycle), der Zustandsverwaltung (State Management) und des Hydration-Mechanismus von Nuxt 3, um haeufige Hydration Mismatch Probleme zu vermeiden.

---

## 1. Kernpunkte fuer die Interviewantwort

1. **Lifecycle-Unterschiede**: Unterscheidung zwischen Hooks, die Server-side und Client-side ausgefuehrt werden. `setup` wird auf beiden Seiten ausgefuehrt, `onMounted` nur auf der Client-Seite.
2. **Zustandsverwaltung**: Die Unterschiede zwischen `useState` und `ref` in SSR-Szenarien verstehen. `useState` kann den Zustand zwischen Server und Client synchronisieren und Hydration Mismatch vermeiden.
3. **Hydration-Mechanismus**: Erklaeren, wie Hydration statisches HTML in eine interaktive Anwendung umwandelt, und haeufige Mismatch-Ursachen (inkonsistente HTML-Struktur, zufaelliger Inhalt usw.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Ausfuehrungsumgebung der Lifecycle Hooks

In Nuxt 3 (Vue 3 SSR) werden verschiedene Hooks in verschiedenen Umgebungen ausgefuehrt:

| Lifecycle Hook | Server-side | Client-side | Beschreibung |
|----------------|-------------|-------------|--------------|
| **setup()** | ✅ Wird ausgefuehrt | ✅ Wird ausgefuehrt | Komponenteninitialisierungslogik. **Achtung: Vermeiden Sie die Verwendung von Client-only APIs (wie window, document) in setup**. |
| **onBeforeMount** | ❌ Wird nicht ausgefuehrt | ✅ Wird ausgefuehrt | Vor dem Mounting. |
| **onMounted** | ❌ Wird nicht ausgefuehrt | ✅ Wird ausgefuehrt | Mounting abgeschlossen. **DOM-Operationen und Browser API Aufrufe gehoeren hierher**. |
| **onBeforeUpdate** | ❌ Wird nicht ausgefuehrt | ✅ Wird ausgefuehrt | Vor der Datenaktualisierung. |
| **onUpdated** | ❌ Wird nicht ausgefuehrt | ✅ Wird ausgefuehrt | Nach der Datenaktualisierung. |
| **onBeforeUnmount** | ❌ Wird nicht ausgefuehrt | ✅ Wird ausgefuehrt | Vor dem Unmounting. |
| **onUnmounted** | ❌ Wird nicht ausgefuehrt | ✅ Wird ausgefuehrt | Nach dem Unmounting. |

### 2.2 Haeufige Interviewfrage: Wird onMounted auf dem Server ausgefuehrt?

**Antwort:**
Nein. `onMounted` wird nur auf der Client-Seite (Browser) ausgefuehrt. Das serverseitige Rendering ist nur fuer die Generierung der HTML-Zeichenkette verantwortlich und fuehrt kein DOM-Mounting durch.

**Folgefrage: Was tun, wenn spezifische Logik auf dem Server ausgefuehrt werden muss?**
- `setup()` oder `useAsyncData` / `useFetch` verwenden.
- Wenn die Umgebung unterschieden werden muss, kann `process.server` oder `process.client` zur Bestimmung verwendet werden.

```typescript
<script setup>
// Wird auf Server und Client ausgefuehrt
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // Wird nur auf dem Client ausgefuehrt
  console.log('Mounted (Client Only)');
  // Sichere Verwendung von window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 Warum braucht Nuxt useState?

In SSR-Anwendungen serialisiert der Server nach dem Rendern des HTML den Zustand (State) und sendet ihn an den Client, damit dieser die Hydration (Zustandsuebernahme) durchfuehren kann.

- **Vue `ref`**: Ist ein lokaler Zustand innerhalb der Komponente. Im SSR-Prozess wird der auf dem Server erstellte `ref`-Wert **nicht automatisch** an den Client uebertragen. Bei der Client-Initialisierung wird `ref` neu erstellt (normalerweise auf den Anfangswert zurueckgesetzt), was zu einer Inkonsistenz zwischen dem servergerenderten Inhalt und dem anfaenglichen Client-Zustand fuehrt und Hydration Mismatch verursacht.
- **Nuxt `useState`**: Ist eine SSR-freundliche Zustandsverwaltung. Sie speichert den Zustand in `NuxtPayload` und sendet ihn zusammen mit dem HTML an den Client. Bei der Client-Initialisierung wird dieses Payload gelesen, der Zustand wiederhergestellt und die Konsistenz zwischen Server und Client sichergestellt.

### 3.2 Vergleichstabelle

| Eigenschaft | Vue `ref` / `reactive` | Nuxt `useState` |
|-------------|------------------------|-----------------|
| **Gueltigkeitsbereich** | Innerhalb der Komponente / des Moduls | Global (in der gesamten App ueber Key teilbar) |
| **SSR-Zustandssynchronisation** | ❌ Wird nicht synchronisiert | ✅ Automatische Serialisierung und Synchronisation zum Client |
| **Anwendungsszenarien** | Nur Client-seitige Interaktionszustaende, Daten die keine SSR-Synchronisation benoetigen | Komponentenuebergreifende Zustaende, Daten die vom Server zum Client mitgenommen werden muessen (z.B. User Info) |

### 3.3 Implementierungsbeispiel

**Falsches Beispiel (ref fuer plattformuebergreifenden Zustand):**

```typescript
// Server generiert Zufallszahl -> HTML zeigt 5
const count = ref(Math.random());

// Client fuehrt erneut aus -> generiert neue Zufallszahl 3
// Ergebnis: Hydration Mismatch (Server: 5, Client: 3)
```

**Richtiges Beispiel (useState verwenden):**

```typescript
// Server generiert Zufallszahl -> speichert in Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client liest Payload -> erhaelt den vom Server generierten Wert
// Ergebnis: Zustand konsistent
```

---

## 4. Hydration und Hydration Mismatch

### 4.1 Was ist Hydration?

Hydration ist der Prozess, bei dem clientseitiges JavaScript das vom Server gerenderte statische HTML uebernimmt.

1. **Server Rendering**: Der Server fuehrt die Vue-Anwendung aus und generiert einen HTML-String (einschliesslich Inhalt und CSS).
2. **HTML-Download**: Der Browser laedt das statische HTML herunter und zeigt es an (First Paint).
3. **JS-Download und Ausfuehrung**: Der Browser laedt das Vue/Nuxt JS Bundle herunter.
4. **Hydration**: Vue erstellt auf der Client-Seite das virtuelle DOM (Virtual DOM) neu und vergleicht es mit dem bestehenden realen DOM. Wenn die Struktur uebereinstimmt, "aktiviert" Vue diese DOM-Elemente (bindet Event-Listener) und macht die Seite interaktiv.

### 4.2 Was ist Hydration Mismatch?

Wenn die auf der Client-Seite generierte Virtual DOM Struktur **nicht mit** der vom Server gerenderten HTML-Struktur uebereinstimmt, gibt Vue eine Hydration Mismatch Warnung aus. Dies bedeutet normalerweise, dass der Client das Server-HTML verwerfen und neu rendern muss, was zu Leistungseinbussen und Bildschirmflackern fuehrt.

### 4.3 Haeufige Mismatch-Ursachen und Loesungen

#### 1. Ungueltige HTML-Struktur
Der Browser korrigiert automatisch fehlerhafte HTML-Strukturen, was zu Inkonsistenzen mit Vues Erwartungen fuehrt.
- **Beispiel**: `<div>` innerhalb von `<p>` Tags.
- **Loesung**: HTML-Syntax pruefen und sicherstellen, dass die Verschachtelungsstruktur gueltig ist.

#### 2. Zufaelliger Inhalt oder Zeitstempel
Server und Client generieren bei der Ausfuehrung unterschiedliche Inhalte.
- **Beispiel**: `new Date()`, `Math.random()`.
- **Loesung**:
    - `useState` verwenden, um den Wert zu fixieren.
    - Oder diese Logik in `onMounted` verschieben (nur auf dem Client rendern, auf dem Server leer lassen oder Placeholder anzeigen).

```typescript
// Falsch
const time = new Date().toISOString();

// Richtig (onMounted verwenden)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// Oder <ClientOnly> verwenden
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. Bedingtes Rendering abhaengig von window/document
- **Beispiel**: `v-if="window.innerWidth > 768"`
- **Ursache**: Server hat kein window, wird als false bewertet; Client wird als true bewertet.
- **Loesung**: Zustand in `onMounted` aktualisieren, oder Client-only Hooks wie `useWindowSize` verwenden.

---

## 5. Interview-Zusammenfassung

**So koennen Sie antworten:**

> Der Hauptunterschied zwischen Server-side und Client-side liegt in der Ausfuehrung der Lifecycle Hooks. Der Server fuehrt hauptsaechlich `setup` aus, waehrend `onMounted` und andere DOM-bezogene Hooks nur auf der Client-Seite ausgefuehrt werden. Dies fuehrt zum Konzept der Hydration, also dem Prozess, bei dem der Client das Server-HTML uebernimmt.
>
> Um Hydration Mismatch zu vermeiden, muessen wir sicherstellen, dass der Inhalt des anfaenglichen Renderings von Server und Client konsistent ist. Deshalb bietet Nuxt `useState` an. Im Gegensatz zu Vues `ref` serialisiert `useState` den Zustand und sendet ihn an den Client, um die Zustandssynchronisation auf beiden Seiten sicherzustellen. Wenn `ref` zum Speichern von serverseitig generierten Daten verwendet wird, tritt bei einem Client-Reset eine Inkonsistenz auf.
>
> Haeufige Mismatches sind Zufallszahlen, Zeitstempel oder ungueltige HTML-Verschachtelungsstrukturen. Die Loesung besteht darin, veraenderlichen Inhalt nach `onMounted` zu verschieben oder die `<ClientOnly>` Komponente zu verwenden.

**Kernpunkte:**
- ✅ `onMounted` wird nur auf dem Client ausgefuehrt
- ✅ `useState` unterstuetzt SSR-Zustandssynchronisation, `ref` nicht
- ✅ Ursachen von Hydration Mismatch (Struktur, Zufallswerte) und Loesungen (`<ClientOnly>`, `onMounted`)
