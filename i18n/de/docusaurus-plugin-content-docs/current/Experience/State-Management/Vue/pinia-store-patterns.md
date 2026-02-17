---
id: state-management-vue-pinia-store-patterns
title: 'Pinia Store Implementierungsmuster'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> In einem Multi-Brand-Plattformprojekt werden Pinia Stores mit Options API und Composition API implementiert, wobei je nach Szenario das passende Muster gewählt wird.

---

## 1. Kernpunkte für die Interviewantwort

1. **Zwei Schreibweisen**: Options API und Composition API, je nach Szenario wählen.
2. **Auswahlstrategie**: Einfache Stores mit Composition API, Stores mit Persistenz mit Options API, komplexe Logik mit Composition API.
3. **Wesentliche Unterschiede**: State muss eine Funktion sein, `this` in Actions zeigt auf die Store-Instanz, zwei Schreibweisen für Getters.

---

## 2. Options API (Traditionelle Schreibweise)

### 2.1 Grundstruktur

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: Zustand definieren
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: Methoden definieren
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: Berechnete Eigenschaften definieren
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ Persistenzkonfiguration
  persist: true, // Automatische Persistenz in localStorage
});
```

### 2.2 Wichtige Punkte

**1. State muss eine Funktion sein**

```typescript
// ✅ Richtig
state: () => ({ count: 0 });

// ❌ Falsch (führt dazu, dass mehrere Instanzen den Zustand teilen)
state: {
  count: 0;
}
```

**2. `this` in Actions zeigt auf die Store-Instanz**

```typescript
actions: {
  increment() {
    this.count++; // Direkte State-Modifikation
  },
};
```

**3. Zwei Schreibweisen für Getters**

```typescript
getters: {
  // Methode 1: Wert direkt zurückgeben (empfohlen)
  doubleCount: (state) => state.count * 2,

  // Methode 2: computed zurückgeben (reaktive Aktualisierung)
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup (Moderne Schreibweise)

### 3.1 Einfaches Store-Beispiel

```typescript
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

**Interview-Schwerpunkte**:
- Verwendung von `@vueuse/core`'s `useSessionStorage` für Persistenz
- Näher an der Composition API Schreibweise
- Alle `ref` oder `reactive` sind State
- Alle Funktionen sind Actions
- Alle `computed` sind Getters

### 3.2 Komplexes Store-Beispiel

```typescript
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';

type GameState = {
  list: Response.GameList;
  allGameList: Response.AllGameList;
  favoriteList: Response.FavoriteList;
  favoriteMap: Response.FavoriteMap;
};

export const useGameStore = defineStore('gameStore', () => {
  // 📦 State (mit reactive)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: [],
    },
    favoriteList: [],
    favoriteMap: {},
  });

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING;
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO;
    gameState.allGameList.SLOT = data.SLOT;
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data;
    gameState.favoriteMap = {};
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true;
    });
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0; // Reaktivität bewahren
    gameState.favoriteMap = {};
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList,
  };
});
```

**Wichtige Punkte**:

**1. `reactive` vs `ref` verwenden**

```typescript
// 📌 reactive verwenden (empfohlen für komplexe Objekte)
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // Direkter Zugriff

// 📌 ref verwenden (empfohlen für primitive Typen)
const count = ref(0);
count.value++; // Benötigt .value
```

**2. Warum `.length = 0` zum Leeren von Arrays?**

```typescript
// ✅ Bewahrt Reaktivität (empfohlen)
gameState.favoriteList.length = 0;

// ❌ Verliert Reaktivität
gameState.favoriteList = [];
```

---

## 4. Vergleich der beiden Schreibweisen

| Eigenschaft           | Options API              | Composition API (Setup)          |
| --------------------- | ------------------------ | -------------------------------- |
| **Syntaxstil**        | Objektkonfiguration      | Funktional                       |
| **Lernkurve**         | Niedriger (ähnlich Vue 2) | Höher (Composition API verstehen) |
| **TypeScript-Unterstützung** | Gut              | Besser                           |
| **Flexibilität**      | Mittel                   | Hoch (freie Logikkombination)    |
| **Lesbarkeit**        | Klare Struktur           | Braucht gute Organisation        |
| **Empfohlenes Szenario** | Einfache Stores       | Komplexe Logik, Funktionskomposition |

**Auswahlstrategie des Projekts**:
- **Einfache Stores (< 5 States)**: Composition API
- **Stores mit Persistenz**: Options API + `persist: true`
- **Komplexe Geschäftslogik**: Composition API (flexibler)
- **Stores mit Getters**: Options API (klarere Syntax)

---

## 5. Zusammenfassung der Interviewschwerpunkte

### 5.1 Wahl zwischen den beiden Schreibweisen

**Mögliche Antwort:**

> Im Projekt verwende ich zwei Store-Definitionsmethoden: Options API und Composition API. Options API verwendet Objektkonfiguration, ähnliche Syntax wie Vue 2, niedrigere Lernkurve, geeignet für einfache Stores und Stores mit Persistenz. Composition API verwendet funktionale Schreibweise, flexibler, bessere TypeScript-Unterstützung, geeignet für komplexe Logik. Die Auswahlstrategie: Einfache Stores mit Composition API, Stores mit Persistenz mit Options API, komplexe Geschäftslogik mit Composition API.

**Kernpunkte:**
- ✅ Unterschiede zwischen den beiden Schreibweisen
- ✅ Auswahlstrategie
- ✅ Praktische Projekterfahrung

### 5.2 Technische Schlüsselpunkte

**Mögliche Antwort:**

> Bei der Store-Implementierung gibt es einige technische Schlüsselpunkte: 1) State muss eine Funktion sein, um gemeinsam genutzten Zustand bei mehreren Instanzen zu vermeiden; 2) `this` in Actions zeigt auf die Store-Instanz, State kann direkt modifiziert werden; 3) Getters haben zwei Schreibweisen, können Werte direkt oder als computed zurückgeben; 4) `reactive` für komplexe Objekte, `ref` für primitive Typen; 5) Arrays mit `.length = 0` leeren, um Reaktivität zu bewahren.

**Kernpunkte:**
- ✅ State muss eine Funktion sein
- ✅ `this`-Verwendung in Actions
- ✅ Getters-Schreibweisen
- ✅ reactive vs ref
- ✅ Reaktivität bewahren

---

## 6. Interview-Zusammenfassung

**Mögliche Antwort:**

> Im Projekt verwende ich Options API und Composition API zum Implementieren von Pinia Stores. Options API eignet sich für einfache Stores und Stores mit Persistenz, klare Syntax. Composition API eignet sich für komplexe Logik, flexibler und bessere TypeScript-Unterstützung. Die Auswahlstrategie richtet sich nach Komplexität und Anforderungen des Stores. Technische Schlüsselpunkte umfassen: State muss eine Funktion sein, `this`-Verwendung in Actions, zwei Getters-Schreibweisen und Bewahrung der Reaktivität.

**Kernpunkte:**
- ✅ Unterschiede und Wahl zwischen den beiden Schreibweisen
- ✅ Technische Schlüsselpunkte
- ✅ Praktische Projekterfahrung
