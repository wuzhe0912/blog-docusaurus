---
id: project-architecture-browser-compatibility
title: 'Browser-Kompatibilitätsbehandlung'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Behandlung von Cross-Browser-Kompatibilitätsproblemen, insbesondere spezielle Behandlung für Safari und mobile Endgeräte.

---

## Browser-Kompatibilität

> Kleine Viewport-Einheiten (Small Viewport Units): svh
> Große Viewport-Einheiten (Large Viewport Units): lvh
> Dynamische Viewport-Einheiten (Dynamic Viewport Units): dvh

In bestimmten Szenarien ist es erlaubt, die neue Syntax dvh zu verwenden, um das Problem der schlecht gestalteten schwebenden Leiste in Safari zu lösen. Wenn eine Kompatibilität mit seltenen oder älteren Browsern erzwungen werden muss, wird stattdessen JS zur Erkennung der Höhe verwendet.

## Automatische Textgrößenanpassung in iOS Safari verhindern

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Vendor-Präfixe

Vendor-Präfixe werden durch manuelle Konfiguration und automatische Einrichtung von Autoprefixer behandelt.
