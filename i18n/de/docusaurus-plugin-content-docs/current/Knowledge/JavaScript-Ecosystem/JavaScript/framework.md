---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> Bitte erklären und vergleichen Sie die Vor- und Nachteile von SPA und SSR

### SPA (Single Page Application)

#### SPA Vorteile

1. Benutzererfahrung: Das Wesen einer SPA ist eine einzige Seite, die durch dynamisches Laden von Daten in Kombination mit Frontend-Routing dem Benutzer den Eindruck vermittelt, zwischen Seiten zu wechseln, während tatsächlich nur Components gewechselt werden. Diese Nutzungserfahrung ist natürlich fließender und schneller.
2. Frontend-Backend-Trennung: Das Frontend ist nur für das Rendern der Seite und Interaktion verantwortlich, während das Backend nur Daten-APIs bereitstellt. Dies reduziert die Entwicklungslast beider Seiten und erleichtert die Wartung.
3. Netzwerkoptimierung: Da die Seite nur einmal geladen werden muss und nicht wie bei der traditionellen Mehrseitenstruktur bei jedem Seitenwechsel neu geladen werden muss, werden die Anzahl der Anfragen reduziert und die Serverlast verringert.

#### SPA Nachteile

1. SEO: SPA-Seiten werden dynamisch geladen, daher können Suchmaschinen den Seiteninhalt nicht direkt erfassen (obwohl Google in den letzten Jahren behauptet, dies zu verbessern). Gegenüber Suchmaschinen-Crawlern ist es immer noch nicht so gut wie traditionelles HTML.
2. Initiale Ladezeit: SPA muss JavaScript auf der Client-Seite laden und ausführen, bevor die Seite gerendert werden kann, daher ist die initiale Ladezeit länger, besonders bei schlechten Netzwerkbedingungen.

### SSR (Server-Side Rendering)

#### SSR Vorteile

1. SEO: Da SSR die Seite mit Daten bereits auf der Server-Seite rendert, können Suchmaschinen den Seiteninhalt direkt erfassen. Dies ist der größte Vorteil von SSR.
2. Ladezeit: Da SSR die Rendering-Last auf die Server-Seite verlagert, kann die Renderzeit beim ersten Besuch verkürzt werden.

#### SSR Nachteile

1. Lernkosten und Komplexität: Am Beispiel von Next und Nuxt, obwohl sie auf React und Vue basieren, haben sie jeweils eigene Ökosysteme entwickelt, was die Lernkosten erhöht. Betrachtet man die kürzliche Next.js 14 Überarbeitung, kann nicht jeder Entwickler solche Änderungen akzeptieren.
2. Serverbelastung: Da die Rendering-Arbeit auf die Server-Seite verlagert wird, kann dies besonders bei Hochlast-Szenarien eine größere Belastung für den Server darstellen.

### Fazit

Grundsätzlich besteht bei Backend-Systemen ohne SEO-Bedarf keine Notwendigkeit, SSR-Frameworks zu verwenden. Für Produktwebseiten, die auf Suchmaschinen angewiesen sind, lohnt es sich, die Verwendung eines SSR-Frameworks zu evaluieren.

## 2. Beschreiben Sie die verwendeten Web Frameworks und vergleichen Sie deren Vor- und Nachteile

**Beide konvergieren in den letzten Jahren zur „funktionsbasierten Komponentenentwicklung":**

> Vue 3 teilt über die Composition API die Logik in wiederverwendbare Composables auf; React hat Hooks als Kern. Die Entwicklererfahrung ist bei beiden sehr ähnlich, insgesamt sind die Einstiegskosten bei Vue niedriger, während React im Ökosystem und in der Flexibilität stärker ist.

### Vue (hauptsächlich Vue 3)

**Vorteile:**

- **Sanftere Lernkurve**: SFC (Single File Component) bündelt template / script / style zusammen, was für Entwickler, die von traditionellem Frontend (Backend-Templates) kommen, sehr zugänglich ist.
- **Klare offizielle Konventionen, vorteilhaft für Teams**: Der offizielle Styleguide und die Konventionen sind klar, was neuen Teammitgliedern erleichtert, bei der Übernahme von Projekten Konsistenz zu wahren.
- **Vollständiges Kern-Ökosystem**: Offiziell werden Vue Router, Pinia (oder Vuex), CLI / Vite Plugin usw. gepflegt, von der Projekterstellung bis zur Zustandsverwaltung und Routing gibt es „offizielle Lösungen", die die Auswahlkosten senken.
- **Composition API verbessert die Wartbarkeit**: Logik kann nach Funktion in Composables aufgeteilt werden (z.B. useAuth, useForm), um in großen Projekten Logik zu teilen und doppelten Code zu reduzieren.

**Nachteile:**

- **Ökosystem und Community etwas kleiner als React**: Die Anzahl und Vielfalt der Drittanbieter-Pakete ist geringer als bei React, und einige Spitzenwerkzeuge oder Integrationen priorisieren React.
- **Arbeitsmarkt relativ auf bestimmte Regionen/Branchen konzentriert**: Im Vergleich zu React verwenden ausländische oder multinationale Teams überwiegend React, was die Karriereflexibilität einschränkt (im chinesischsprachigen Raum jedoch etwa gleich verteilt).

---

### React

**Vorteile:**

- **Riesiges Ökosystem mit schnellen Technologie-Updates**: Fast alle neuen Frontend-Technologien, Designsysteme oder Drittanbieterdienste bieten priorisiert eine React-Version an.
- **Hohe Flexibilität, freie Kombination des Technologie-Stacks je nach Projekt**: Kombinierbar mit Redux / Zustand / Recoil und anderen Zustandsverwaltungen, plus Meta Frameworks wie Next.js, Remix, mit ausgereiften Lösungen von SPA bis SSR, SSG, CSR.
- **Reife Integration mit TypeScript und Frontend-Engineering**: Viele Community-Diskussionen zu Typisierung und Best Practices für große Projekte, hilfreich für langfristig gewartete große Projekte.

**Nachteile:**

- **Hohe Freiheit erfordert teameigene Regeln**: Ohne klaren Coding-Style oder Architekturkonventionen können verschiedene Entwickler völlig unterschiedliche Schreibweisen und Zustandsverwaltungsmethoden verwenden, was die spätere Wartung verteuert.
- **Lernkurve tatsächlich nicht niedrig**: Neben React selbst (JSX, Hooks-Denkweise) muss man sich mit Router, Zustandsverwaltung, Datenabruf, SSR usw. auseinandersetzen, Anfänger verlieren sich leicht in der Frage „welche Library soll ich wählen".
- **API-Änderungen und Best-Practice-Evolution sind schnell**: Von Class Component zu Function Component + Hooks, dann zu Server Components - wenn alte Projekte und neue Schreibweisen koexistieren, sind zusätzliche Migrations- und Wartungskosten nötig.
