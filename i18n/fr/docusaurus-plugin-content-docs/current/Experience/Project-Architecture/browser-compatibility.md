---
id: project-architecture-browser-compatibility
title: 'Gestion de la compatibilité navigateur'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Gestion des problèmes de compatibilité inter-navigateurs, en particulier le traitement spécial pour Safari et les appareils mobiles.

---

## Compatibilité navigateur

> Petites unités de viewport (Small Viewport Units) : svh
> Grandes unités de viewport (Large Viewport Units) : lvh
> Unités de viewport dynamiques (Dynamic Viewport Units) : dvh

Dans certains scénarios spécifiques, il est permis d'utiliser la nouvelle syntaxe dvh pour résoudre le problème de la barre flottante mal conçue dans Safari. Si une compatibilité forcée avec des navigateurs rares ou anciens est nécessaire, JS est utilisé pour détecter la hauteur.

## Empêcher l'ajustement automatique de la taille du texte dans iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Préfixes fournisseur

Les préfixes fournisseur sont gérés par une configuration manuelle et une configuration automatique d'Autoprefixer.
