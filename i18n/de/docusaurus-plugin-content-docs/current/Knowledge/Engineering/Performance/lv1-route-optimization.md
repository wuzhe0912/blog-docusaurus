---
id: performance-lv1-route-optimization
title: '[Lv1] Routing-Optimierung: Drei Ebenen des Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Durch drei Ebenen des Route Lazy Loading wurde die Erstladung von 12,5 MB auf 850 KB reduziert, mit einer 70%igen Verkuerzung der First-Screen-Zeit.

---

## Problemhintergrund (Situation)

Projekteigenschaften:

- **27+ verschiedene Multi-Tenant-Templates** (Multi-Tenant-Architektur)
- **Jedes Template hat 20-30 Seiten** (Startseite, Lobby, Aktionen, Agenten, Nachrichten etc.)
- **Wenn der gesamte Code auf einmal geladen wird**: Erstbesuch erfordert Download von **10 MB+ JS-Dateien**
- **Wartezeit des Benutzers ueber 10 Sekunden** (besonders in mobilen Netzwerkumgebungen)

## Optimierungsziel (Task)

1. **JavaScript-Volumen beim Erstladen reduzieren** (Ziel: < 1 MB)
2. **First-Screen-Zeit verkuerzen** (Ziel: < 3 Sekunden)
3. **Bedarfsgesteuertes Laden** (Benutzer laedt nur, was benoetigt wird)
4. **Entwicklererfahrung beibehalten** (darf die Entwicklungseffizienz nicht beeintraechtigen)

## Loesung (Action)

Wir haben eine Strategie mit **drei Ebenen des Route Lazy Loading** angewendet, optimiert auf den Ebenen "Template" -> "Seite" -> "Berechtigungen".

### Ebene 1: Dynamisches Template-Laden

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Laedt dynamisch die Route-Konfiguration des entsprechenden Templates basierend auf Umgebungsvariablen
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Erklaerung:

- Das Projekt hat 27 Templates, aber der Benutzer verwendet nur eines
- Bestimmt die aktuelle Marke ueber environment.json
- Laedt nur die Route-Konfiguration dieser Marke, die anderen 26 Templates werden nicht geladen

Ergebnis:

- Ca. 85% weniger Route-Konfigurationscode beim Erstladen

### Ebene 2: Seiten-Lazy Loading

```typescript
// Traditioneller Ansatz (schlecht)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Alle Seiten werden in main.js gebuendelt

// Unser Ansatz (gut)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Jede Route verwendet Arrow Function + import()
- Erst wenn der Benutzer die Seite tatsaechlich besucht, wird der entsprechende JS-Chunk heruntergeladen
- Vite buendelt automatisch jede Seite als eigenstaendige Datei

### Ebene 3: Bedarfsgesteuerte Ladestrategie

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Nicht eingeloggte Benutzer laden keine Seiten wie "Agenten-Center"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Optimierungsergebnis (Result)

**Vor der Optimierung:**

```
Erstladung: main.js (12,5 MB)
First-Screen-Zeit: 8-12 Sekunden
Enthaelt alle 27 Templates + alle Seiten
```

**Nach der Optimierung:**

```markdown
Erstladung: main.js (850 KB) -93%
First-Screen-Zeit: 1,5-2,5 Sekunden +70%
Enthaelt nur Kerncode + aktuelle Startseite
```

**Konkrete Daten:**

- JavaScript-Volumen reduziert: **12,5 MB -> 850 KB (Reduktion um 93%)**
- First-Screen-Zeit verkuerzt: **10 Sekunden -> 2 Sekunden (Verbesserung um 70%)**
- Nachfolgende Seitenladung: **Durchschnittlich 300-500 KB pro Seite**
- Benutzererfahrungsbewertung: **Von 45 auf 92 Punkte (Lighthouse)**

**Geschaeftswert:**

- Absprungrate sank um 35%
- Verweildauer stieg um 50%
- Konversionsrate stieg um 25%

## Interview-Schwerpunkte

**Haeufige Erweiterungsfragen:**

1. **F: Warum nicht React.lazy() oder Vue Async-Komponenten verwenden?**
   A: Wir verwenden tatsaechlich Vue Async-Komponenten (`() => import()`), aber der Schluessel ist die **Drei-Ebenen-Architektur**:

   - Ebene 1 (Template): Zur Kompilierzeit entschieden (Vite-Konfiguration)
   - Ebene 2 (Seite): Lazy Loading zur Laufzeit
   - Ebene 3 (Berechtigungen): Steuerung durch Navigation Guards

   Einfaches Lazy Loading deckt nur Ebene 2 ab; wir haben zusaetzlich die Template-Ebene getrennt.

2. **F: Wie entscheidet man, welcher Code in main.js gehoert?**
   A: Mit der `manualChunks`-Konfiguration von Vite:

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   Prinzip: Nur was "jede Seite benoetigt" kommt in den Vendor Chunk.

3. **F: Beeintraechtigt Lazy Loading die Benutzererfahrung (Wartezeit)?**
   A: Zwei Strategien dagegen:

   - **Prefetch**: In Leerlaufzeiten moeglicherweise besuchte Seiten vorladen
   - **Loading-Zustand**: Skeleton Screen statt weißem Bildschirm verwenden

   Reale Tests: Durchschnittliche Ladezeit nachfolgender Seiten < 500 ms, vom Benutzer nicht wahrnehmbar.

4. **F: Wie misst man den Optimierungseffekt?**
   A: Mit einer Kombination verschiedener Tools:

   - **Lighthouse**: Performance Score (45 -> 92)
   - **Webpack Bundle Analyzer**: Visuelle Analyse der Chunk-Groessen
   - **Chrome DevTools**: Network Waterfall, Coverage
   - **Real User Monitoring (RUM)**: Echte Benutzerdaten

5. **F: Welche Trade-offs gibt es?**
   A:
   - Moegliche zirkulaere Abhaengigkeiten waehrend der Entwicklung (Modulstruktur muss angepasst werden)
   - Erste Routenumschaltung hat kurze Ladezeit (mit Prefetch geloest)
   - Insgesamt ueberwiegen die Vorteile, besonders die spuerbare Verbesserung fuer mobile Benutzer
