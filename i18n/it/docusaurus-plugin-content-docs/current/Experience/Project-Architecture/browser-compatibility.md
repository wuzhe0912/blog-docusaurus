---
id: project-architecture-browser-compatibility
title: 'Gestione della compatibilità browser'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Strategie pratiche di compatibilità browser, con focus su Safari e sul comportamento della viewport mobile.

---

## 1. Compatibilità delle unità viewport

Unità viewport moderne:

- `svh`: altezza viewport piccola
- `lvh`: altezza viewport grande
- `dvh`: altezza viewport dinamica

Quando supportata, `dvh` aiuta a risolvere i problemi di salto causati dalla barra indirizzi su Safari mobile.

Per il supporto ai browser legacy, usa un fallback con calcolo dell'altezza via JavaScript.

## 2. Evitare il ridimensionamento automatico del testo in iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

Usalo con cautela e verifica l'impatto sull'accessibilità.

## 3. Strategia dei vendor prefix

Usa Autoprefixer come default e aggiungi prefissi manuali solo per edge case specifici.

Consigliato:

- Definire i target browser in un unico punto
- Mantenere esplicita la strategia dei polyfill
- Verificare i flussi critici su Safari e Android WebView

## Sintesi pronta per il colloquio

> Gestisco la compatibilità con fallback a livelli: prima CSS moderno, poi prefissi mirati e polyfill, e fallback JS solo quando il comportamento della piattaforma non è affidabile.
