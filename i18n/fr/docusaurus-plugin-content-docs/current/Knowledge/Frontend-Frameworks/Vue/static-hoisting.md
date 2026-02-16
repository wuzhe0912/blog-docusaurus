---
id: static-hoisting
title: '[Medium] Extraction statique (Static Hoisting) de Vue 3'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> Qu'est-ce que le Static Hoisting dans Vue 3 ?

Dans Vue 3, le **Static Hoisting (extraction statique)** est une technique d'optimisation au niveau de la compilation.

### Définition

Le **Static Hoisting** est une optimisation du compilateur Vue 3 qui, lors de la compilation du template, analyse quels noeuds ne dépendent d'aucun état réactif et ne changeront jamais, puis les extrait en constantes au niveau supérieur du fichier. Ces noeuds ne sont créés qu'une seule fois lors du premier rendu et sont directement réutilisés lors des rendus suivants, réduisant ainsi le coût de création des VNodes et du diff.

### Principe de fonctionnement

Le compilateur analyse le template, extrait les noeuds qui ne dépendent d'aucun état réactif et ne changeront jamais, les transforme en constantes au niveau supérieur du fichier, les crée une seule fois lors du premier rendu et les réutilise directement lors des rendus suivants.

### Comparaison avant et après compilation

**Template avant compilation** :

<details>
<summary>Cliquez pour voir l'exemple de template</summary>

```vue
<template>
  <div>
    <h1>Titre statique</h1>
    <p>Contenu statique</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**JavaScript après compilation** (version simplifiée) :

<details>
<summary>Cliquez pour voir le JavaScript compilé</summary>

```js
// Les noeuds statiques sont extraits au niveau supérieur, créés une seule fois
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Titre statique');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Contenu statique');

function render() {
  return h('div', null, [
    _hoisted_1, // Réutilisation directe, pas besoin de recréer
    _hoisted_2, // Réutilisation directe, pas besoin de recréer
    h('div', null, dynamicContent.value), // Le contenu dynamique doit être recréé
  ]);
}
```

</details>

### Avantages

1. **Réduction du coût de création des VNodes** : Les noeuds statiques ne sont créés qu'une seule fois et sont réutilisés
2. **Réduction du coût du diff** : Les noeuds statiques ne participent pas à la comparaison diff
3. **Amélioration des performances de rendu** : Particulièrement visible dans les composants avec beaucoup de contenu statique
4. **Optimisation automatique** : Le développeur n'a rien de spécial à écrire pour bénéficier de cette optimisation

## 2. How Static Hoisting Works

> Comment fonctionne le Static Hoisting ?

### Processus d'analyse du compilateur

Le compilateur analyse chaque noeud du template :

1. **Vérification des liaisons dynamiques**

   - Vérifie la présence de `{{ }}`, `v-bind`, `v-if`, `v-for` et autres directives dynamiques
   - Vérifie si les valeurs d'attributs contiennent des variables

2. **Marquage des noeuds statiques**

   - Si un noeud et tous ses enfants n'ont aucune liaison dynamique, il est marqué comme statique

3. **Extraction des noeuds statiques**
   - Les noeuds statiques sont extraits hors de la fonction render
   - Définis comme constantes au niveau supérieur du module

### Exemple 1 : Extraction statique de base

<details>
<summary>Cliquez pour voir l'exemple d'extraction statique de base</summary>

```vue
<template>
  <div>
    <h1>Titre</h1>
    <p>Ceci est du contenu statique</p>
    <div>Bloc statique</div>
  </div>
</template>
```

</details>

**Après compilation** :

<details>
<summary>Cliquez pour voir le résultat compilé</summary>

```js
// Tous les noeuds statiques sont extraits
const _hoisted_1 = h('h1', null, 'Titre');
const _hoisted_2 = h('p', null, 'Ceci est du contenu statique');
const _hoisted_3 = h('div', null, 'Bloc statique');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### Exemple 2 : Mélange de contenu statique et dynamique

<details>
<summary>Cliquez pour voir l'exemple de contenu mixte</summary>

```vue
<template>
  <div>
    <h1>Titre statique</h1>
    <p>{{ message }}</p>
    <div class="static-class">Contenu statique</div>
    <span :class="dynamicClass">Contenu dynamique</span>
  </div>
</template>
```

</details>

**Après compilation** :

<details>
<summary>Cliquez pour voir le résultat compilé</summary>

```js
// Seuls les noeuds entièrement statiques sont extraits
const _hoisted_1 = h('h1', null, 'Titre statique');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Contenu statique');

function render() {
  return h('div', null, [
    _hoisted_1, // Noeud statique, réutilisé
    h('p', null, message.value), // Contenu dynamique, doit être recréé
    _hoisted_3, // Noeud statique, réutilisé
    h('span', { class: dynamicClass.value }, 'Contenu dynamique'), // Attribut dynamique, doit être recréé
  ]);
}
```

</details>

### Exemple 3 : Extraction des attributs statiques

<details>
<summary>Cliquez pour voir l'exemple d'attributs statiques</summary>

```vue
<template>
  <div>
    <div class="container" id="main">Contenu</div>
    <button disabled>Bouton</button>
  </div>
</template>
```

</details>

**Après compilation** :

<details>
<summary>Cliquez pour voir le résultat compilé</summary>

```js
// Les objets d'attributs statiques sont aussi extraits
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Contenu');
const _hoisted_4 = h('button', _hoisted_2, 'Bouton');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> La directive v-once

Si le développeur souhaite marquer manuellement un grand bloc de contenu qui ne changera jamais, il peut utiliser la directive `v-once`.

### Rôle de v-once

`v-once` indique au compilateur que cet élément et ses enfants ne doivent être rendus qu'une seule fois. Même s'ils contiennent des liaisons dynamiques, celles-ci ne seront évaluées que lors du premier rendu et ne seront pas mises à jour ensuite.

### Utilisation de base

<details>
<summary>Cliquez pour voir l'exemple de base de v-once</summary>

```vue
<template>
  <div>
    <!-- Utilisation de v-once pour marquer le contenu statique -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- Sans v-once, mise à jour réactive -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Titre initial');
const content = ref('Contenu initial');

// Même si ces valeurs sont modifiées, le bloc v-once ne sera pas mis à jour
setTimeout(() => {
  title.value = 'Nouveau titre';
  content.value = 'Nouveau contenu';
}, 1000);
</script>
```

</details>

### v-once vs Static Hoisting

| Caractéristique | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Déclenchement** | Automatique (analyse du compilateur) | Manuel (marqué par le développeur) |
| **Cas d'utilisation** | Contenu entièrement statique | Contenu avec liaisons dynamiques rendu une seule fois |
| **Performance** | Optimale (ne participe pas au diff) | Bonne (rendu une seule fois) |
| **Moment d'utilisation** | Déterminé automatiquement à la compilation | Le développeur sait que le contenu ne changera pas |

### Cas d'utilisation

```vue
<template>
  <!-- Scénario 1 : Données affichées une seule fois -->
  <div v-once>
    <p>Date de création : {{ createdAt }}</p>
    <p>Créateur : {{ creator }}</p>
  </div>

  <!-- Scénario 2 : Structure statique complexe -->
  <div v-once>
    <div class="header">
      <h1>Titre</h1>
      <nav>Navigation</nav>
    </div>
  </div>

  <!-- Scénario 3 : Éléments statiques dans une liste -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Principe du Static Hoisting

Expliquez le principe de fonctionnement du Static Hoisting de Vue 3 et comment il améliore les performances.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Principe de fonctionnement du Static Hoisting** :

1. **Analyse à la compilation** :

   - Le compilateur analyse chaque noeud du template
   - Vérifie la présence de liaisons dynamiques (`{{ }}`, `v-bind`, `v-if`, etc.)
   - Si un noeud et ses enfants n'ont aucune liaison dynamique, il est marqué comme statique

2. **Extraction des noeuds** :

   - Les noeuds statiques sont extraits hors de la fonction render
   - Définis comme constantes au niveau supérieur du module
   - Créés une seule fois lors du premier rendu

3. **Mécanisme de réutilisation** :
   - Les rendus suivants réutilisent directement ces noeuds statiques
   - Pas besoin de recréer les VNodes
   - Pas besoin de participer à la comparaison diff

**Amélioration des performances** :

- **Réduction du coût de création des VNodes** : Les noeuds statiques ne sont créés qu'une seule fois
- **Réduction du coût du diff** : Les noeuds statiques sautent la comparaison diff
- **Réduction de l'utilisation mémoire** : Plusieurs instances de composants peuvent partager les noeuds statiques
- **Amélioration de la vitesse de rendu** : Particulièrement visible dans les composants avec beaucoup de contenu statique

</details>

### Question 2 : Différence entre Static Hoisting et v-once

Expliquez la différence entre le Static Hoisting et `v-once`, ainsi que leurs cas d'utilisation respectifs.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Principales différences** :

| Caractéristique | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Déclenchement** | Automatique (analyse du compilateur) | Manuel (marqué par le développeur) |
| **Contenu applicable** | Contenu entièrement statique | Contenu avec liaisons dynamiques rendu une seule fois |
| **Moment de compilation** | Déterminé automatiquement | Marqué explicitement par le développeur |
| **Performance** | Optimale (ne participe pas au diff) | Bonne (rendu une seule fois) |
| **Comportement de mise à jour** | Ne sera jamais mis à jour | Ne sera plus mis à jour après le premier rendu |

**Cas d'utilisation** :

**Static Hoisting** :

- Structure HTML entièrement statique
- Contenu sans aucune liaison dynamique
- Traité automatiquement par le compilateur, transparent pour le développeur

**v-once** :

- Contenu avec liaisons dynamiques mais rendu une seule fois
- Blocs que le développeur sait ne pas changer
- Nécessite un marquage manuel

**Recommandations** :

- Si le contenu est entièrement statique -> laisser le compilateur traiter automatiquement (Static Hoisting)
- Si le contenu a des liaisons dynamiques mais n'est rendu qu'une fois -> utiliser `v-once`
- Si le contenu nécessite des mises à jour réactives -> ne pas utiliser `v-once`

</details>

### Question 3 : Scénarios d'application pratique

Expliquez dans quelles situations le Static Hoisting apporte une amélioration notable des performances.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Scénarios où le Static Hoisting améliore nettement les performances** :

1. **Composants avec beaucoup de contenu statique**

2. **Éléments statiques dans les listes**

3. **Composants fréquemment mis à jour**

4. **Multiples instances de composants**
   - Les noeuds statiques peuvent être partagés entre les instances
   - Réduction de l'utilisation mémoire

**Facteurs clés d'amélioration des performances** :

- **Proportion de contenu statique** : Plus il y a de contenu statique, plus l'amélioration est notable
- **Fréquence de mise à jour** : Plus les mises à jour sont fréquentes, plus la réduction du coût du diff est efficace
- **Nombre d'instances** : Plus il y a d'instances, plus l'avantage du partage des noeuds statiques est important

**Mesures pratiques** :

Dans les composants avec beaucoup de contenu statique, le Static Hoisting peut :

- Réduire de 30-50% le temps de création des VNodes
- Réduire de 40-60% le temps de comparaison diff
- Réduire l'utilisation mémoire (partage entre instances)

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```vue
<!-- 1. Laisser le compilateur traiter automatiquement le contenu statique -->
<template>
  <div>
    <h1>Titre</h1>
    <p>Contenu statique</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. Utiliser explicitement v-once pour le contenu rendu une seule fois -->
<template>
  <div v-once>
    <p>Date de création : {{ createdAt }}</p>
    <p>Créateur : {{ creator }}</p>
  </div>
</template>

<!-- 3. Séparer la structure statique du contenu dynamique -->
<template>
  <div>
    <!-- Structure statique -->
    <div class="container">
      <header>Titre</header>
      <!-- Contenu dynamique -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### Pratiques à éviter

```vue
<!-- 1. Ne pas abuser de v-once -->
<template>
  <!-- Si le contenu doit être mis à jour, ne pas utiliser v-once -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. Ne pas utiliser v-once sur du contenu dynamique -->
<template>
  <!-- Si les éléments de la liste doivent être mis à jour, ne pas utiliser v-once -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>

<!-- 3. Ne pas casser la structure pour optimiser -->
<template>
  <!-- Ne pas forcer la séparation du contenu logiquement lié pour le Static Hoisting -->
  <div>
    <h1>Titre</h1>
    <p>Contenu</p>
  </div>
</template>
```

## 6. Interview Summary

> Résumé d'entretien

### Aide-mémoire

**Static Hoisting** :

- **Définition** : Extraction des noeuds statiques en constantes à la compilation, créés une seule fois
- **Avantage** : Réduit les coûts de création des VNodes et du diff
- **Automatisation** : Traité automatiquement par le compilateur, transparent pour le développeur
- **Application** : Noeuds ne dépendant d'aucun état réactif

**v-once** :

- **Définition** : Marquage manuel du contenu rendu une seule fois
- **Application** : Blocs avec des liaisons dynamiques mais rendus une seule fois
- **Performance** : Réduit les mises à jour inutiles

**Différence clé** :

- Static Hoisting : automatique, contenu entièrement statique
- v-once : manuel, peut contenir des liaisons dynamiques

### Exemples de réponses en entretien

**Q: Qu'est-ce que le Static Hoisting de Vue 3 ?**

> "Dans Vue 3, le Static Hoisting est une optimisation au niveau de la compilation. Le compilateur analyse le template, extrait les noeuds qui ne dépendent d'aucun état réactif et ne changeront jamais, les transforme en constantes au niveau supérieur du fichier, les crée une seule fois lors du premier rendu et les réutilise directement lors des rendus suivants, réduisant ainsi le coût de création des VNodes et du diff. Le développeur n'a rien de spécial à écrire pour bénéficier de cette optimisation ; il suffit d'écrire un template normal et le compilateur détermine automatiquement quels noeuds peuvent être extraits. Pour marquer manuellement un grand bloc de contenu immuable, on peut utiliser v-once."

**Q: Comment le Static Hoisting améliore-t-il les performances ?**

> "Le Static Hoisting améliore les performances principalement de trois manières : 1) réduction du coût de création des VNodes, les noeuds statiques ne sont créés qu'une seule fois et sont réutilisés ; 2) réduction du coût du diff, les noeuds statiques ne participent pas à la comparaison diff ; 3) réduction de l'utilisation mémoire, plusieurs instances de composants peuvent partager les noeuds statiques. Cette optimisation est particulièrement efficace dans les composants avec beaucoup de contenu statique, pouvant réduire de 30-50% le temps de création des VNodes et de 40-60% le temps de comparaison diff."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
