---
id: state-management-vue-pinia-setup
title: 'Pinia Initialisierung und Konfiguration'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Pinia-Initialisierungskonfiguration und Projektstrukturdesign in einem Multi-Brand-Plattformprojekt.

---

## 1. Kernpunkte für die Interviewantwort

1. **Gründe für Pinia**: Bessere TypeScript-Unterstützung, einfachere API, modulares Design, bessere Entwicklungserfahrung.
2. **Initialisierungskonfiguration**: Verwendung von `piniaPluginPersistedstate` für Persistenz, Erweiterung der `PiniaCustomProperties`-Schnittstelle.
3. **Projektstruktur**: 30+ Stores, nach Funktionsbereichen kategorisiert verwaltet.

---

## 2. Warum Pinia?

### 2.1 Pinia vs Vuex

**Pinia** ist das offizielle Zustandsverwaltungswerkzeug für Vue 3 und bietet als Nachfolger von Vuex eine einfachere API und bessere TypeScript-Unterstützung.

**Interview-Schwerpunktantwort**:

1. **Bessere TypeScript-Unterstützung**
   - Pinia bietet vollständige Typinferenz
   - Keine zusätzlichen Hilfsfunktionen nötig (wie `mapState`, `mapGetters`)

2. **Einfachere API**
   - Keine mutations nötig (synchrone Operationsebene in Vuex)
   - Synchrone/asynchrone Operationen direkt in actions ausführen

3. **Modulares Design**
   - Keine verschachtelten Module nötig
   - Jeder Store ist unabhängig

4. **Bessere Entwicklungserfahrung**
   - Vue Devtools-Unterstützung
   - Hot Module Replacement (HMR)
   - Kleinere Größe (ca. 1KB)

5. **Offizielle Vue 3 Empfehlung**
   - Pinia ist das offizielle Zustandsverwaltungswerkzeug für Vue 3

### 2.2 Kernkomponenten von Pinia

```typescript
// Die drei Kernelemente eines Store
{
  state: () => ({ ... }),      // Zustandsdaten
  getters: { ... },            // Berechnete Eigenschaften
  actions: { ... }             // Methoden (synchron/asynchron)
}
```

**Entsprechung zu Vue-Komponenten**:
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Pinia-Initialisierungskonfiguration

### 3.1 Basiskonfiguration

**Dateipfad:** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Pinia-benutzerdefinierte Eigenschaften erweitern
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // Persistenz-Plugin registrieren
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**Interview-Schwerpunkte**:
- ✅ Verwendung von `piniaPluginPersistedstate` für Zustandspersistenz
- ✅ Erweiterung der `PiniaCustomProperties`-Schnittstelle, damit alle Stores auf den Router zugreifen können
- ✅ Integration über Quasars `store` Wrapper

### 3.2 Store-Dateistruktur

```
src/stores/
├── index.ts                    # Pinia-Instanzkonfiguration
├── store-flag.d.ts            # TypeScript-Typdeklaration
│
├── authStore.ts               # Authentifizierung
├── userInfoStore.ts           # Benutzerinformationen
├── gameStore.ts               # Spielinformationen
├── productStore.ts            # Produktinformationen
├── languageStore.ts           # Spracheinstellungen
├── darkModeStore.ts          # Themenmodus
├── envStore.ts               # Umgebungskonfiguration
└── ... (insgesamt 30+ Stores)
```

**Designprinzipien**:
- Jeder Store ist für einen einzelnen Funktionsbereich verantwortlich
- Dateinamenkonvention: `Funktionsname + Store.ts`
- Vollständige TypeScript-Typdefinitionen verwenden

---

## 4. Zusammenfassung der Interviewschwerpunkte

### 4.1 Gründe für die Wahl von Pinia

**Mögliche Antwort:**

> Im Projekt haben wir Pinia statt Vuex gewählt, hauptsächlich aus mehreren Gründen: 1) Bessere TypeScript-Unterstützung mit vollständiger Typinferenz ohne zusätzliche Konfiguration; 2) Einfachere API ohne mutations, synchrone/asynchrone Operationen direkt in actions; 3) Modulares Design ohne verschachtelte Module, jeder Store ist unabhängig; 4) Bessere Entwicklungserfahrung mit Vue Devtools, HMR und kleinerer Größe; 5) Offizielle Vue 3 Empfehlung.

**Kernpunkte:**
- ✅ TypeScript-Unterstützung
- ✅ API-Einfachheit
- ✅ Modulares Design
- ✅ Entwicklungserfahrung

### 4.2 Schwerpunkte der Initialisierungskonfiguration

**Mögliche Antwort:**

> Bei der Pinia-Initialisierung habe ich einige wichtige Konfigurationen vorgenommen: 1) Verwendung von `piniaPluginPersistedstate` für Zustandspersistenz, damit der Store automatisch in localStorage gespeichert werden kann; 2) Erweiterung der `PiniaCustomProperties`-Schnittstelle, damit alle Stores auf den Router zugreifen können, was Routing-Operationen in actions erleichtert; 3) Integration über Quasars `store` Wrapper für die Framework-Integration.

**Kernpunkte:**
- ✅ Persistenz-Plugin-Konfiguration
- ✅ Benutzerdefinierte Eigenschaftserweiterung
- ✅ Framework-Integration

---

## 5. Interview-Zusammenfassung

**Mögliche Antwort:**

> Im Projekt verwende ich Pinia als Zustandsverwaltungswerkzeug. Die Wahl fiel auf Pinia wegen besserer TypeScript-Unterstützung, einfacherer API und besserer Entwicklungserfahrung. Bei der Initialisierungskonfiguration verwende ich `piniaPluginPersistedstate` für Persistenz und erweitere `PiniaCustomProperties`, damit alle Stores auf den Router zugreifen können. Das Projekt hat 30+ Stores, die nach Funktionsbereichen kategorisiert verwaltet werden, wobei jeder Store für einen einzelnen Funktionsbereich verantwortlich ist.

**Kernpunkte:**
- ✅ Gründe für die Wahl von Pinia
- ✅ Schwerpunkte der Initialisierungskonfiguration
- ✅ Projektstrukturdesign
- ✅ Praktische Projekterfahrung
