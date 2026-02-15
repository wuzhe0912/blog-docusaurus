---
id: css-units
title: "[Medium] \U0001F3F7️ Unités CSS"
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Expliquez les différences entre `px`, `em`, `rem`, `vw`, `vh`

### Tableau comparatif rapide

| Unité | Type     | Relatif à                      | Affecté par le parent | Usages courants                            |
| ----- | -------- | ------------------------------ | --------------------- | ------------------------------------------ |
| `px`  | Absolue  | Pixel de l'écran               | Non                   | Bordures, ombres, petits détails           |
| `em`  | Relative | font-size du **parent**        | Oui                   | Padding, margin (suivant la taille de police) |
| `rem` | Relative | font-size de la **racine**     | Non                   | Police, espacement, dimensions générales   |
| `vw`  | Relative | 1% de la largeur du viewport   | Non                   | Largeur responsive, éléments pleine largeur |
| `vh`  | Relative | 1% de la hauteur du viewport   | Non                   | Hauteur responsive, sections plein écran   |

### Explications détaillées

#### `px` (Pixels)

**Définition** : Unité absolue, 1px = un point pixel à l'écran

**Caractéristiques** :

- Taille fixe, ne change avec aucun paramètre
- Contrôle précis, mais manque de flexibilité
- Défavorable au design responsive et à l'accessibilité

**Quand l'utiliser** :

```css
/* Adapté pour */
border: 1px solid #000; /* Bordure */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre */
border-radius: 4px; /* Petit arrondi */

/* Déconseillé pour */
font-size: 16px; /* Préférer rem pour la police */
width: 1200px; /* Préférer % ou vw pour la largeur */
```

#### `em`

**Définition** : Multiple du font-size de l'élément **parent**

**Caractéristiques** :

- Se cumule par héritage (les structures imbriquées s'additionnent)
- Flexible mais peut devenir incontrôlable
- Adapté aux scénarios nécessitant un redimensionnement suivant le parent

**Exemple de calcul** :

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px (relatif à son propre font-size) */
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px (effet cumulatif !) */
}
```

**Quand l'utiliser** :

```css
/* Adapté pour */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* Le padding suit la taille de police du bouton */
}

.card-title {
  font-size: 1.2em; /* Relatif à la police de base de la carte */
  margin-bottom: 0.5em; /* L'espacement suit la taille du titre */
}

/* Attention à l'accumulation dans les imbrications */
```

#### `rem` (Root em)

**Définition** : Multiple du font-size de l'élément **racine** (`<html>`)

**Caractéristiques** :

- Pas d'accumulation par héritage (toujours relatif à l'élément racine)
- Facile à gérer et maintenir
- Pratique pour un redimensionnement global
- L'une des unités les plus recommandées

**Exemple de calcul** :

```css
html {
  font-size: 16px; /* Valeur par défaut du navigateur */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* Toujours 24px, pas d'accumulation ! */
}
```

**Quand l'utiliser** :

```css
/* Le plus recommandé pour */
html {
  font-size: 16px; /* Définir la base */
}

body {
  font-size: 1rem; /* Texte courant 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* Pratique pour le mode sombre ou les ajustements d'accessibilité */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* Toutes les unités rem s'agrandissent automatiquement */
  }
}
```

#### `vw` (Viewport Width)

**Définition** : 1% de la largeur du viewport (100vw = largeur du viewport)

**Caractéristiques** :

- Véritable unité responsive
- Change en temps réel avec la taille de la fenêtre du navigateur
- Attention : 100vw inclut la largeur de la barre de défilement

**Exemple de calcul** :

```css
/* En supposant une largeur de viewport de 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* En supposant une largeur de viewport de 375px (mobile) */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**Quand l'utiliser** :

```css
/* Adapté pour */
.hero {
  width: 100vw; /* Bannière pleine largeur */
  margin-left: calc(-50vw + 50%); /* Dépasser les limites du conteneur */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* Police responsive */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* Ajouter une limite maximale */
}

/* À éviter */
body {
  width: 100vw; /* Provoquera une barre de défilement horizontale (inclut la barre de défilement) */
}
```

#### `vh` (Viewport Height)

**Définition** : 1% de la hauteur du viewport (100vh = hauteur du viewport)

**Caractéristiques** :

- Adapté aux effets plein écran
- Attention au problème de la barre d'adresse sur mobile
- Peut être affecté par l'apparition du clavier

**Quand l'utiliser** :

```css
/* Adapté pour */
.hero-section {
  height: 100vh; /* Page d'accueil plein écran */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* Alternative pour les appareils mobiles */
.hero-section {
  height: 100vh;
  height: 100dvh; /* Hauteur de viewport dynamique (unité plus récente) */
}

/* Centrage vertical */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Conseils pratiques et bonnes pratiques

#### 1. Établir un système de polices responsive

```css
/* Définir la base */
html {
  font-size: 16px; /* Défaut desktop */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* Tablette */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* Mobile */
  }
}

/* Tous les éléments utilisant rem se redimensionnent automatiquement */
h1 {
  font-size: 2.5rem;
} /* Desktop 40px, Mobile 30px */
p {
  font-size: 1rem;
} /* Desktop 16px, Mobile 12px */
```

#### 2. Mélanger différentes unités

```css
.card {
  /* Largeur responsive + plage limitée */
  width: 90vw;
  max-width: 75rem;

  /* rem pour l'espacement */
  padding: 2rem;
  margin: 1rem auto;

  /* px pour les détails */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp combine plusieurs unités pour un redimensionnement fluide */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### Exemple de réponse en entretien

**Structure de la réponse** :

```markdown
1. **px** : Petits détails en pixels -> bordures, ombres, petits arrondis
2. **rem** : Base stable et invariable -> police, espacement, dimensions principales
3. **em** : Suit l'élément parent
4. **vw** : Varie avec la largeur du viewport -> largeur responsive
5. **vh** : Remplit la hauteur du viewport -> sections plein écran
```

1. **Définition rapide**

   - px est une unité absolue, les autres sont relatives
   - em est relatif au parent, rem relatif à la racine
   - vw/vh relatifs aux dimensions du viewport

2. **Différence clé**

   - rem ne s'accumule pas, em s'accumule (différence principale)
   - vw/vh véritablement responsive, mais attention au problème de la barre de défilement

3. **Application pratique**

   - **px** : Bordures de 1px, ombres et autres détails
   - **rem** : Police, espacement, conteneurs (le plus courant, facile à maintenir)
   - **em** : Padding des boutons (quand il faut suivre le redimensionnement de la police)
   - **vw/vh** : Bannières pleine largeur, sections plein écran, police responsive avec clamp

4. **Bonnes pratiques**
   - Définir html font-size comme base
   - Utiliser clamp() pour combiner différentes unités
   - Attention au problème de vh sur mobile (utiliser dvh)

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
