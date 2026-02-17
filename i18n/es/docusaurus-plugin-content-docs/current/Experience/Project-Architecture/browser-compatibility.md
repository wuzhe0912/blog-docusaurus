---
id: project-architecture-browser-compatibility
title: 'Manejo de compatibilidad del navegador'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Manejo de problemas de compatibilidad entre navegadores, especialmente el tratamiento especial para Safari y dispositivos moviles.

---

## Compatibilidad del navegador

> Unidades de viewport pequeno (Small Viewport Units): svh
> Unidades de viewport grande (Large Viewport Units): lvh
> Unidades de viewport dinamico (Dynamic Viewport Units): dvh

En escenarios especificos, se permite usar la nueva sintaxis dvh para resolver el problema de la barra flotante mal disenada en Safari. Si se requiere compatibilidad forzada con navegadores poco comunes o antiguos, se utiliza JS para detectar la altura.

## Prevenir el ajuste automatico del tamano de texto en iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Prefijos de proveedor

Los prefijos de proveedor se manejan mediante configuracion manual y configuracion automatica de Autoprefixer.
