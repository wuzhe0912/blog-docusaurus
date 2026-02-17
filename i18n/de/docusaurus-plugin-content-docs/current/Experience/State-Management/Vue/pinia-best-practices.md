---
id: state-management-vue-pinia-best-practices
title: 'Pinia Best Practices und häufige Fehler'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Best Practices und häufige Fehlerbehandlungen für Pinia Store in einem Multi-Brand-Plattformprojekt.

---

## 1. Kernpunkte für die Interviewantwort

1. **Designprinzipien**: Single-Responsibility-Prinzip, Store schlank halten, kein direkter API-Aufruf im Store.
2. **Häufige Fehler**: Reaktivitätsverlust durch direktes Destrukturieren, Store-Aufruf außerhalb von Setup, Reaktivitätsverlust bei State-Modifikation, zirkuläre Abhängigkeiten.
3. **Best Practices**: TypeScript verwenden, Verantwortungstrennung, mehrere Stores in Composables kombinieren.

---

## 2. Store-Designprinzipien

### 2.1 Single-Responsibility-Prinzip

```typescript
// ✅ Gutes Design: Jeder Store ist nur für einen Bereich verantwortlich
useAuthStore(); // Nur Authentifizierung
useUserInfoStore(); // Nur Benutzerinformationen
useGameStore(); // Nur Spielinformationen

// ❌ Schlechtes Design: Ein Store verwaltet alles
useAppStore(); // Verwaltet Authentifizierung, Benutzer, Spiele, Einstellungen...
```

### 2.2 Store schlank halten

```typescript
// ✅ Empfohlen
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ Nicht empfohlen: Store enthält komplexe Geschäftslogik
// Sollte in einem Composable platziert werden
```

### 2.3 Kein direkter API-Aufruf im Store

```typescript
// ❌ Nicht empfohlen: Direkter API-Aufruf im Store
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // API-Aufruf
      this.list = data;
    },
  },
});

// ✅ Empfohlen: API im Composable aufrufen, Store nur für Speicherung
export const useGameStore = defineStore('gameStore', {
  actions: {
    setGameList(list: Game[]) {
      this.list = list;
    },
  },
});

export function useGame() {
  const gameStore = useGameStore();
  async function fetchGames() {
    const { status, data } = await api.getGames(); // API-Aufruf im Composable
    if (status) {
      gameStore.setGameList(data); // Store nur für Speicherung
    }
  }
  return { fetchGames };
}
```

---

## 3. TypeScript verwenden

```typescript
// ✅ Vollständige Typdefinition
type UserState = {
  info: Response.UserInfo;
  walletList: Response.UserWalletList;
};

export const useUserInfoStore = defineStore('useInfoStore', () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: [],
  });
  return { state };
});
```

---

## 4. Häufige Fehler

### 4.1 Fehler 1: Reaktivitätsverlust durch direktes Destrukturieren

```typescript
// ❌ Falsch
const { count } = useCounterStore();
count; // Nicht reaktiv

// ✅ Richtig
const { count } = storeToRefs(useCounterStore());
count.value; // Reaktiv
```

### 4.2 Fehler 2: Store-Aufruf außerhalb von Setup

```typescript
// ❌ Falsch: Aufruf auf Modulebene
const authStore = useAuthStore(); // ❌ Falscher Zeitpunkt

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ Richtig: Aufruf innerhalb der Funktion
export function useAuth() {
  const authStore = useAuthStore(); // ✅ Richtiger Zeitpunkt
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 Fehler 3: Reaktivitätsverlust bei State-Modifikation

```typescript
// ❌ Falsch: Direktes Zuweisen eines neuen Arrays
function updateList(newList) {
  gameState.list = newList; // Kann Reaktivität verlieren
}

// ✅ Richtig: splice oder push verwenden
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ Auch möglich: Zuweisung mit reactive
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 Fehler 4: Zirkuläre Abhängigkeiten

```typescript
// ❌ Falsch: Gegenseitige Abhängigkeit zwischen Stores
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // Abhängig von userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // Abhängig von authStore ❌ Zirkuläre Abhängigkeit
});

// ✅ Richtig: In Composable kombinieren
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  async function initialize() {
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
    }
  }
  return { initialize };
}
```

### 4.5 Fehler 5: return vergessen

```typescript
// ❌ Falsch: return vergessen
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ return vergessen, Komponente kann nicht zugreifen
});

// ✅ Richtig
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ return ist erforderlich
});
```

---

## 5. Zusammenfassung der Interviewschwerpunkte

### 5.1 Store-Designprinzipien

**Mögliche Antwort:**

> Beim Design von Pinia Stores folge ich mehreren Prinzipien: 1) Single-Responsibility-Prinzip, jeder Store ist nur für einen Bereich verantwortlich; 2) Store schlank halten, keine komplexe Geschäftslogik einbauen; 3) Kein direkter API-Aufruf im Store, APIs im Composable aufrufen, Store nur für Speicherung; 4) Vollständige TypeScript-Typdefinitionen verwenden, um die Entwicklungserfahrung zu verbessern.

**Kernpunkte:**
- ✅ Single-Responsibility-Prinzip
- ✅ Store schlank halten
- ✅ Verantwortungstrennung
- ✅ TypeScript-Nutzung

### 5.2 Häufige Fehler und Vermeidung

**Mögliche Antwort:**

> Häufige Fehler bei der Verwendung von Pinia umfassen: 1) Reaktivitätsverlust durch direktes Destrukturieren, man muss `storeToRefs` verwenden; 2) Store-Aufruf außerhalb von Setup, sollte innerhalb der Funktion aufgerufen werden; 3) Reaktivitätsverlust bei State-Modifikation, `.length = 0` oder `Object.assign` verwenden; 4) Zirkuläre Abhängigkeiten, mehrere Stores in Composables kombinieren; 5) return vergessen, Composition API Stores müssen return haben.

**Kernpunkte:**
- ✅ Reaktivität bewahren
- ✅ Richtiger Aufrufzeitpunkt
- ✅ State-Modifikationsmethoden
- ✅ Zirkuläre Abhängigkeiten vermeiden

---

## 6. Interview-Zusammenfassung

**Mögliche Antwort:**

> Bei der Verwendung von Pinia im Projekt folge ich mehreren Best Practices: 1) Store-Design folgt dem Single-Responsibility-Prinzip und bleibt schlank; 2) Kein direkter API-Aufruf im Store, Aufruf im Composable; 3) Vollständige TypeScript-Typdefinitionen verwenden; 4) Häufige Fehler beachten, wie Reaktivitätsverlust, zirkuläre Abhängigkeiten usw. Diese Praktiken stellen die Wartbarkeit und Erweiterbarkeit des Stores sicher.

**Kernpunkte:**
- ✅ Store-Designprinzipien
- ✅ Häufige Fehler und Vermeidung
- ✅ Best Practices
- ✅ Praktische Projekterfahrung
