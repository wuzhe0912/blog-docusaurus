---
id: project-architecture-browser-compatibility
title: 'Browser-Kompatibilitaetsbehandlung'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Behandlung von Cross-Browser-Kompatibilitaetsproblemen, insbesondere spezielle Behandlung fuer Safari und mobile Endgeraete.

---

## Browser-Kompatibilitaet

> Kleine Viewport-Einheiten (Small Viewport Units): svh
> Grosse Viewport-Einheiten (Large Viewport Units): lvh
> Dynamische Viewport-Einheiten (Dynamic Viewport Units): dvh

In bestimmten Szenarien ist es erlaubt, die neue Syntax dvh zu verwenden, um das Problem der schlecht gestalteten schwebenden Leiste in Safari zu loesen. Wenn eine Kompatibilitaet mit seltenen oder aelteren Browsern erzwungen werden muss, wird stattdessen JS zur Erkennung der Hoehe verwendet.

## Automatische Textgroessenanpassung in iOS Safari verhindern

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Vendor-Praefixe

Vendor-Praefixe werden durch manuelle Konfiguration und automatische Einrichtung von Autoprefixer behandelt.
