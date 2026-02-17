---
id: project-architecture-browser-compatibility
title: 'Gestion de la compatibilite navigateur'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Gestion des problemes de compatibilite inter-navigateurs, en particulier le traitement special pour Safari et les appareils mobiles.

---

## Compatibilite navigateur

> Petites unites de viewport (Small Viewport Units) : svh
> Grandes unites de viewport (Large Viewport Units) : lvh
> Unites de viewport dynamiques (Dynamic Viewport Units) : dvh

Dans certains scenarios specifiques, il est permis d'utiliser la nouvelle syntaxe dvh pour resoudre le probleme de la barre flottante mal concue dans Safari. Si une compatibilite forcee avec des navigateurs rares ou anciens est necessaire, JS est utilise pour detecter la hauteur.

## Empecher l'ajustement automatique de la taille du texte dans iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Prefixes fournisseur

Les prefixes fournisseur sont geres par une configuration manuelle et une configuration automatique d'Autoprefixer.
