---
id: vue-lifecycle
title: '[Medium] Vue Lifecycle Hooks'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Erklaeren Sie die Lifecycle Hooks von Vue (einschliesslich Vue 2 und Vue 3)

Vue-Komponenten durchlaufen vom Erstellen bis zum Zerstoeren eine Reihe von Prozessen. Waehrend dieser Prozesse werden automatisch bestimmte Funktionen aufgerufen - diese Funktionen sind die "Lifecycle Hooks". Das Verstaendnis des Lebenszyklus ist sehr wichtig, um das Verhalten von Komponenten zu beherrschen.

### Vue Lifecycle-Diagramm

```
Erstellungsphase → Mounting-Phase → Update-Phase → Unmounting-Phase
       ↓                ↓               ↓                ↓
    Created          Mounted         Updated          Unmounted
```

### Vergleichstabelle Vue 2 vs Vue 3

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | Beschreibung                        |
| ------------------- | ------------------- | ----------------------- | ----------------------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | Vor der Instanz-Initialisierung     |
| `created`           | `created`           | `setup()`               | Komponenteninstanz erstellt         |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | Vor dem Einhaengen in das DOM       |
| `mounted`           | `mounted`           | `onMounted`             | Nach dem Einhaengen in das DOM      |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | Vor der Datenaktualisierung         |
| `updated`           | `updated`           | `onUpdated`             | Nach der Datenaktualisierung        |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | Vor dem Entfernen der Komponente    |
| `destroyed`         | `unmounted`         | `onUnmounted`           | Nach dem Entfernen der Komponente   |
| `activated`         | `activated`         | `onActivated`           | keep-alive Komponente aktiviert     |
| `deactivated`       | `deactivated`       | `onDeactivated`         | keep-alive Komponente deaktiviert   |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | Fehler einer Kindkomponente erfasst |

### 1. Erstellungsphase (Creation Phase)

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // ❌ Zu diesem Zeitpunkt sind data und methods noch nicht initialisiert
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ Zu diesem Zeitpunkt sind data, computed, methods und watch initialisiert
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined (noch nicht in DOM eingehaengt)

    // ✅ Geeignet fuer API-Anfragen hier
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Verwendungszeitpunkt:**

- `beforeCreate`: Selten verwendet, ueblicherweise fuer Plugin-Entwicklung
- `created`:
  - ✅ API-Anfragen senden
  - ✅ Nicht-reaktive Daten initialisieren
  - ✅ Event Listener einrichten
  - ❌ DOM-Manipulation nicht moeglich (noch nicht eingehaengt)

### 2. Mounting-Phase (Mounting Phase)

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // ❌ Virtual DOM erstellt, aber noch nicht im realen DOM gerendert
    console.log('beforeMount');
    console.log(this.$el); // Existiert, aber Inhalt ist veraltet (falls vorhanden)
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ Komponente ist im DOM eingehaengt, DOM-Elemente koennen manipuliert werden
    console.log('mounted');
    console.log(this.$el); // Echtes DOM-Element
    console.log(this.$refs.myElement); // Ref kann zugegriffen werden

    // ✅ Geeignet fuer DOM-Manipulation hier
    this.initCanvas();

    // ✅ Geeignet fuer Drittanbieter-DOM-Bibliotheken
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // Canvas zeichnen...
    },

    initChart() {
      // Diagrammbibliothek initialisieren (z.B. Chart.js, ECharts)
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**Verwendungszeitpunkt:**

- `beforeMount`: Selten verwendet
- `mounted`:
  - ✅ DOM-Elemente manipulieren
  - ✅ Drittanbieter-DOM-Bibliotheken initialisieren (z.B. Diagramme, Karten)
  - ✅ Event Listener einrichten, die DOM benoetigen
  - ✅ Timer starten
  - ⚠️ **Hinweis**: `mounted` von Kindkomponenten wird vor dem `mounted` der Elternkomponente ausgefuehrt

### 3. Update-Phase (Updating Phase)

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Zaehler: {{ count }}</p>
    <button @click="count++">Erhoehen</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // ✅ Daten aktualisiert, aber DOM noch nicht aktualisiert
    console.log('beforeUpdate');
    console.log('data count:', this.count); // Neuer Wert
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Alter Wert

    // Hier kann der DOM-Zustand vor der Aktualisierung abgerufen werden
  },

  updated() {
    // ✅ Daten und DOM sind aktualisiert
    console.log('updated');
    console.log('data count:', this.count); // Neuer Wert
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Neuer Wert

    // ⚠️ Achtung: Keine Daten hier aendern, fuehrt zu Endlosschleife
    // this.count++; // ❌ Falsch! Fuehrt zu endloser Aktualisierung
  },
};
</script>
```

**Verwendungszeitpunkt:**

- `beforeUpdate`: Wenn der alte DOM-Zustand vor der Aktualisierung benoetigt wird
- `updated`:
  - ✅ Operationen nach DOM-Aktualisierung (z.B. Elementgroessen neu berechnen)
  - ❌ **Keine Daten hier aendern**, fuehrt zu endloser Aktualisierungsschleife
  - ⚠️ Fuer Operationen nach Datenaenderung wird `watch` oder `nextTick` empfohlen

### 4. Unmounting-Phase (Unmounting Phase)

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // Timer einrichten
    this.timer = setInterval(() => {
      console.log('Timer laeuft...');
    }, 1000);

    // WebSocket-Verbindung erstellen
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('Nachricht empfangen:', event.data);
    };

    // Event Listener einrichten
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 verwendet beforeUnmount
    // Vue 2 verwendet beforeDestroy
    console.log('beforeUnmount');
    // Komponente wird gleich zerstoert, aber Daten und DOM sind noch zugaenglich
  },

  unmounted() {
    // Vue 3 verwendet unmounted
    // Vue 2 verwendet destroyed
    console.log('unmounted');

    // ✅ Timer bereinigen
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ WebSocket-Verbindung schliessen
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ Event Listener entfernen
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('Fenstergroesse geaendert');
    },
    handleClick() {
      console.log('Klick-Ereignis');
    },
  },
};
</script>
```

**Verwendungszeitpunkt:**

- `beforeUnmount` / `beforeDestroy`: Selten verwendet
- `unmounted` / `destroyed`:
  - ✅ Timer bereinigen (`setInterval`, `setTimeout`)
  - ✅ Event Listener entfernen
  - ✅ WebSocket-Verbindungen schliessen
  - ✅ Unvollstaendige API-Anfragen abbrechen
  - ✅ Drittanbieter-Bibliotheksinstanzen bereinigen

### 5. Spezialkomponente: KeepAlive

#### Was ist `<KeepAlive>`?

`<KeepAlive>` ist eine eingebaute Vue-Komponente, deren Hauptfunktion das **Caching von Komponenteninstanzen** ist, um zu vermeiden, dass Komponenten beim Wechseln zerstoert werden.

- **Standardverhalten**: Beim Komponentenwechsel (z.B. Routenwechsel oder `v-if`-Wechsel) zerstoert Vue die alte Komponente und erstellt eine neue.
- **KeepAlive-Verhalten**: Mit `<KeepAlive>` umschlossene Komponenten behalten ihren Zustand im Speicher und werden nicht zerstoert.

#### Kernfunktionen und Eigenschaften

1. **Zustandscaching**: Formulareingaben, Scroll-Position usw. werden beibehalten.
2. **Performance-Optimierung**: Vermeidet wiederholtes Rendern und doppelte API-Anfragen.
3. **Exklusiver Lebenszyklus**: Bietet zwei exklusive Hooks: `activated` und `deactivated`.

#### Anwendungsszenarien

1. **Tab-Wechsel**: Z.B. Tabs in Admin-Systemen.
2. **Listen- und Detailseiten-Wechsel**: Beim Zurueckkehren von der Detailseite sollen Scroll-Position und Filter der Liste erhalten bleiben.
3. **Komplexe Formulare**: Beim Wechsel zu einer anderen Seite waehrend der Eingabe soll der Formularinhalt nicht verloren gehen.

#### Verwendungsbeispiel

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`: Nur Komponenten mit uebereinstimmenden Namen werden gecacht.
- `exclude`: Komponenten mit uebereinstimmenden Namen werden **nicht** gecacht.
- `max`: Maximale Anzahl gecachter Komponenteninstanzen.

### 6. Spezielle Lifecycle Hooks

#### `activated` / `deactivated` (in Verbindung mit `<KeepAlive>`)

```vue
<template>
  <div>
    <button @click="toggleComponent">Komponente wechseln</button>

    <!-- keep-alive cacht die Komponente, erstellt sie nicht neu -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - wird nur einmal ausgefuehrt');
  },

  activated() {
    console.log('activated - wird bei jeder Aktivierung ausgefuehrt');
    // ✅ Geeignet zum erneuten Laden von Daten
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - wird bei jeder Deaktivierung ausgefuehrt');
    // ✅ Geeignet zum Pausieren von Operationen (z.B. Videowiedergabe)
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - wird nicht ausgefuehrt (durch keep-alive gecacht)');
  },

  methods: {
    refreshData() {
      // Daten erneut laden
    },
    pauseVideo() {
      // Videowiedergabe pausieren
    },
  },
};
</script>
```

#### `errorCaptured` (Fehlerbehandlung)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('Fehler der Kindkomponente erfasst:', err);
    console.log('Fehlerquelle-Komponente:', instance);
    console.log('Fehlerinformation:', info);

    // Rueckgabe von false verhindert weitere Fehlerweiterleitung
    return false;
  },
};
</script>
```

### Vue 3 Composition API Lebenszyklus

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() selbst entspricht beforeCreate + created
console.log('setup wird ausgefuehrt');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ DOM manipulieren, Bibliotheken initialisieren
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // ✅ Ressourcen bereinigen
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('Fehler:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> Wie ist die Ausfuehrungsreihenfolge der Lifecycle Hooks von Eltern- und Kindkomponenten?

Dies ist eine sehr wichtige Interviewfrage. Das Verstaendnis der Ausfuehrungsreihenfolge der Lebenszyklen zwischen Eltern- und Kindkomponenten hilft beim Verstaendnis der Interaktion zwischen Komponenten.

### Ausfuehrungsreihenfolge

```
Eltern beforeCreate
→ Eltern created
→ Eltern beforeMount
→ Kind beforeCreate
→ Kind created
→ Kind beforeMount
→ Kind mounted
→ Eltern mounted
```

**Merkhilfe: "Erstellung von aussen nach innen, Mounting von innen nach aussen"**

### Praktisches Beispiel

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Elternkomponente</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. Eltern beforeCreate');
  },
  created() {
    console.log('2. Eltern created');
  },
  beforeMount() {
    console.log('3. Eltern beforeMount');
  },
  mounted() {
    console.log('8. Eltern mounted');
  },
  beforeUpdate() {
    console.log('Eltern beforeUpdate');
  },
  updated() {
    console.log('Eltern updated');
  },
  beforeUnmount() {
    console.log('9. Eltern beforeUnmount');
  },
  unmounted() {
    console.log('12. Eltern unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Kindkomponente</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. Kind beforeCreate');
  },
  created() {
    console.log('5. Kind created');
  },
  beforeMount() {
    console.log('6. Kind beforeMount');
  },
  mounted() {
    console.log('7. Kind mounted');
  },
  beforeUpdate() {
    console.log('Kind beforeUpdate');
  },
  updated() {
    console.log('Kind updated');
  },
  beforeUnmount() {
    console.log('10. Kind beforeUnmount');
  },
  unmounted() {
    console.log('11. Kind unmounted');
  },
};
</script>
```

### Ausfuehrungsreihenfolge nach Phase

#### 1. Erstellungs- und Mounting-Phase

```
1. Eltern beforeCreate
2. Eltern created
3. Eltern beforeMount
4. Kind beforeCreate
5. Kind created
6. Kind beforeMount
7. Kind mounted          ← Kindkomponente wird zuerst gemountet
8. Eltern mounted        ← Elternkomponente wird danach gemountet
```

**Grund**: Die Elternkomponente muss warten, bis die Kindkomponenten das Mounting abgeschlossen haben, um sicherzustellen, dass der gesamte Komponentenbaum vollstaendig gerendert wurde.

#### 2. Update-Phase

```
Datenaenderung der Elternkomponente:
1. Eltern beforeUpdate
2. Kind beforeUpdate    ← Wenn die Kindkomponente Daten der Elternkomponente verwendet
3. Kind updated
4. Eltern updated

Datenaenderung der Kindkomponente:
1. Kind beforeUpdate
2. Kind updated
(Elternkomponente loest kein Update aus)
```

#### 3. Unmounting-Phase

```
9. Eltern beforeUnmount
10. Kind beforeUnmount
11. Kind unmounted       ← Kindkomponente wird zuerst zerstoert
12. Eltern unmounted     ← Elternkomponente wird danach zerstoert
```

### Fall mit mehreren Kindkomponenten

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

Ausfuehrungsreihenfolge:

```
1. Eltern beforeCreate
2. Eltern created
3. Eltern beforeMount
4. KindA beforeCreate
5. KindA created
6. KindA beforeMount
7. KindB beforeCreate
8. KindB created
9. KindB beforeMount
10. KindC beforeCreate
11. KindC created
12. KindC beforeMount
13. KindA mounted
14. KindB mounted
15. KindC mounted
16. Eltern mounted
```

### Warum diese Reihenfolge?

#### Mounting-Phase

Der Mounting-Prozess von Vue aehnelt einer "Tiefensuche":

1. Elternkomponente beginnt mit der Erstellung
2. Beim Template-Parsing werden Kindkomponenten entdeckt
3. Kindkomponenten werden zuerst vollstaendig gemountet
4. Nachdem alle Kindkomponenten gemountet sind, schliesst die Elternkomponente das Mounting ab

```
Elternkomponente bereitet Mounting vor
    ↓
Kindkomponente entdeckt
    ↓
Kindkomponente vollstaendig gemountet (beforeMount → mounted)
    ↓
Elternkomponente schliesst Mounting ab (mounted)
```

#### Unmounting-Phase

Die Unmounting-Reihenfolge ist "erst Elternkomponente benachrichtigen, dann Kindkomponenten der Reihe nach zerstoeren":

```
Elternkomponente bereitet Unmounting vor (beforeUnmount)
    ↓
Kindkomponenten benachrichtigen (beforeUnmount)
    ↓
Kindkomponenten abschliessen (unmounted)
    ↓
Elternkomponente abschliessen (unmounted)
```

### Praktische Anwendungsszenarien

#### Szenario 1: Elternkomponente muss warten bis Kindkomponentendaten geladen sind

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // ✅ Zu diesem Zeitpunkt sind alle Kindkomponenten gemountet
    console.log('Alle Kindkomponenten sind bereit');
    this.childrenReady = true;
  },
};
</script>
```

#### Szenario 2: Kindkomponente muss auf Daten der Elternkomponente zugreifen

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // Daten der Elternkomponente empfangen

  created() {
    // ✅ Zu diesem Zeitpunkt kann auf Elterndaten zugegriffen werden (created der Elternkomponente wurde bereits ausgefuehrt)
    console.log('Elterndaten:', this.parentData);
  },
};
</script>
```

#### Szenario 3: Zugriff auf noch nicht gemountete Kindkomponenten im `mounted` vermeiden

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ Zu diesem Zeitpunkt ist die Kindkomponente gemountet, sicherer Zugriff
    this.$refs.child.someMethod();
  },
};
</script>
```

### Haeufige Fehler

#### Fehler 1: Zugriff auf Kindkomponenten-Ref im `created` der Elternkomponente

```vue
<!-- ❌ Falsch -->
<script>
export default {
  created() {
    // Zu diesem Zeitpunkt ist die Kindkomponente noch nicht erstellt
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ Richtig -->
<script>
export default {
  mounted() {
    // Zu diesem Zeitpunkt ist die Kindkomponente gemountet
    console.log(this.$refs.child); // Zugriff moeglich
  },
};
</script>
```

#### Fehler 2: Annahme, dass die Kindkomponente vor der Elternkomponente gemountet wird

```vue
<!-- ❌ Falsch -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Annahme, dass die Elternkomponente bereits gemountet ist (falsch!)
    this.$parent.someMethod(); // Kann Fehler verursachen
  },
};
</script>

<!-- ✅ Richtig -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // $nextTick verwenden, um sicherzustellen, dass die Elternkomponente auch gemountet ist
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> Wann sollten wir welchen Lifecycle Hook verwenden?

Hier ist eine Zusammenfassung der besten Anwendungsszenarien fuer jeden Lifecycle Hook.

### Uebersichtstabelle der Anwendungsszenarien

| Lebenszyklus | Haeufige Verwendung                    | Zugaengliche Inhalte              |
| ------------ | -------------------------------------- | --------------------------------- |
| `created`    | API-Anfragen, Daten initialisieren     | ✅ data, methods ❌ DOM          |
| `mounted`    | DOM manipulieren, Bibliotheken init.   | ✅ data, methods, DOM            |
| `updated`    | Operationen nach DOM-Aktualisierung    | ✅ Neues DOM                     |
| `unmounted`  | Ressourcen bereinigen                  | ✅ Timer, Events bereinigen      |
| `activated`  | keep-alive Aktivierung                 | ✅ Daten erneut laden            |

### Praktische Anwendungsbeispiele

#### 1. `created`: API-Anfragen senden

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // ✅ Geeignet fuer API-Anfragen hier
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted`: Drittanbieter-Bibliotheken initialisieren

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // ✅ Geeignet fuer Initialisierung von DOM-abhaengigen Bibliotheken
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: 'Verkaufsdaten' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ Diagramminstanz bereinigen
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`: Ressourcen bereinigen

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // Timer starten
    this.intervalId = setInterval(() => {
      console.log('Ausfuehrung...');
    }, 1000);

    // Intersection Observer erstellen
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // Globale Events ueberwachen
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ Timer bereinigen
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ Observer bereinigen
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ Event Listener entfernen
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('Fenstergroesse geaendert');
    },
  },
};
</script>
```

### Merktipps

1. **`created`**: "Erstellung abgeschlossen, Daten nutzbar" → API-Anfragen
2. **`mounted`**: "Mounting abgeschlossen, DOM nutzbar" → DOM-Manipulation, Drittanbieter-Bibliotheken
3. **`updated`**: "Aktualisierung abgeschlossen, DOM synchronisiert" → Operationen nach DOM-Aktualisierung
4. **`unmounted`**: "Unmounting abgeschlossen, aufraeumen" → Ressourcen bereinigen

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
