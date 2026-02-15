---
id: selector-weight
title: "[Easy] \U0001F3F7️ Poids des sélecteurs"
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Comment calculer le poids d'un sélecteur ?

> Comment calcule-t-on le poids d'un sélecteur ?

La priorité des sélecteurs CSS sert à résoudre le problème de détermination du style final appliqué à un élément :

```html
<div id="app" class="wrapper">What color ?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

Dans cet exemple, le résultat sera bleu, car deux sélecteurs sont appliqués : un ID et une class. Le poids de l'ID étant supérieur à celui de la class, le style de la class est écrasé.

### Ordre de priorité

> inline style > ID > class > tag

Si un code HTML contient un style inline dans la balise, son poids sera par défaut le plus élevé, écrasant les styles du fichier CSS :

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

Cependant, dans le développement courant, cette méthode d'écriture n'est pas utilisée car elle est difficile à maintenir et peut facilement contaminer les styles.

### Cas particulier

Si vous rencontrez vraiment un style inline qui ne peut pas être supprimé et que vous souhaitez l'écraser via un fichier CSS, vous pouvez utiliser `!important` :

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

Bien entendu, il est préférable d'éviter autant que possible l'utilisation de `!important`. Bien que les styles inline puissent également comporter `!important`, personnellement je ne considère pas cette approche d'écriture de styles. De même, sauf dans des cas particuliers, je n'utilise pas les sélecteurs d'ID, et je construis l'ensemble de la feuille de styles en me basant sur les class.
