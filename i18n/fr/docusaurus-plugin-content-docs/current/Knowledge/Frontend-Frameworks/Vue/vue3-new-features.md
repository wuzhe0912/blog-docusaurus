---
id: vue3-new-features
title: '[Easy] Nouvelles fonctionnalités de Vue 3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Quelles sont les nouvelles fonctionnalités de Vue 3 ?

Vue 3 a introduit de nombreuses nouvelles fonctionnalités et améliorations, notamment :

### Principales nouvelles fonctionnalités

1. **Composition API** : nouvelle façon d'écrire les composants
2. **Teleport** : rendre le contenu d'un composant à un autre endroit du DOM
3. **Fragment** : les composants peuvent avoir plusieurs nœuds racines
4. **Suspense** : gérer le chargement des composants asynchrones
5. **Multiple v-model** : support de plusieurs v-model
6. **Meilleur support TypeScript**
7. **Optimisations de performance** : bundle plus petit, rendu plus rapide

## 2. Teleport

> Qu'est-ce que Teleport ?

**Définition** : `Teleport` permet de rendre le contenu d'un composant à un autre endroit de l'arbre DOM, sans changer la structure logique du composant.

### Cas d'utilisation

**Cas courants** : Modal, Tooltip, Notification et autres composants nécessitant un rendu dans le body

<details>
<summary>Cliquez pour voir l'exemple Teleport</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Ouvrir la modale</button>

    <!-- Utiliser Teleport pour rendre la modale dans le body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Titre de la modale</h2>
          <p>Contenu de la modale</p>
          <button @click="showModal = false">Fermer</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### Avantages

1. **Résout les problèmes de z-index** : la modale est rendue dans le body, non affectée par les styles du composant parent
2. **Préserve la structure logique** : la logique du composant reste à sa position d'origine, seule la position DOM change
3. **Meilleure maintenabilité** : le code lié à la modale est centralisé dans le composant

## 3. Fragment (nœuds racines multiples)

> Qu'est-ce que Fragment ?

**Définition** : Vue 3 permet aux composants d'avoir plusieurs nœuds racines, sans avoir besoin de les envelopper dans un seul élément. C'est un Fragment implicite, pas besoin d'utiliser une balise `<Fragment>` comme dans React.

### Vue 2 vs Vue 3

**Vue 2** : doit avoir un seul nœud racine

```vue
<!-- Vue 2 : doit être enveloppé dans un seul élément -->
<template>
  <div>
    <h1>Titre</h1>
    <p>Contenu</p>
  </div>
</template>
```

**Vue 3** : peut avoir plusieurs nœuds racines

```vue
<!-- Vue 3 : peut avoir plusieurs nœuds racines -->
<template>
  <h1>Titre</h1>
  <p>Contenu</p>
</template>
```

### Pourquoi Fragment ?

Dans Vue 2, les composants devaient avoir un seul nœud racine, obligeant souvent les développeurs à ajouter des éléments d'enveloppement supplémentaires (comme `<div>`), ce qui :

1. **Brisait le HTML sémantique** : ajout d'éléments d'enveloppement sans signification
2. **Augmentait la profondeur du DOM** : impactait les sélecteurs CSS et les performances
3. **Compliquait le contrôle des styles** : nécessitait de gérer les styles de l'élément d'enveloppement

### Cas d'utilisation

#### Cas 1 : Structure HTML sémantique

```vue
<template>
  <!-- Pas besoin d'élément d'enveloppement supplémentaire -->
  <header>
    <h1>Titre du site</h1>
  </header>
  <main>
    <p>Contenu principal</p>
  </main>
  <footer>
    <p>Pied de page</p>
  </footer>
</template>
```

#### Cas 2 : Composant d'élément de liste

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### Cas 3 : Rendu conditionnel de plusieurs éléments

```vue
<template>
  <div v-if="showHeader" class="header">Titre</div>
  <div v-if="showContent" class="content">Contenu</div>
  <div v-if="showFooter" class="footer">Pied de page</div>
</template>
```

### Héritage d'attributs (Attribute Inheritance)

Quand un composant a plusieurs nœuds racines, le comportement de l'héritage d'attributs change.

**Nœud racine unique** : les attributs sont automatiquement hérités par l'élément racine

```vue
<!-- Composant parent -->
<MyComponent class="custom-class" id="my-id" />

<!-- Composant enfant (racine unique) -->
<template>
  <div>Contenu</div>
</template>

<!-- Résultat du rendu -->
<div class="custom-class" id="my-id">Contenu</div>
```

**Nœuds racines multiples** : les attributs ne sont pas automatiquement hérités, il faut les spécifier manuellement

```vue
<!-- Composant parent -->
<MyComponent class="custom-class" id="my-id" />

<!-- Composant enfant (racines multiples) -->
<template>
  <div>Premier nœud racine</div>
  <div>Deuxième nœud racine</div>
</template>

<!-- Résultat du rendu : les attributs ne sont pas hérités -->
<div>Premier nœud racine</div>
<div>Deuxième nœud racine</div>
```

**Solution** : utiliser `$attrs` pour lier manuellement les attributs

```vue
<!-- Composant enfant -->
<template>
  <div v-bind="$attrs">Premier nœud racine</div>
  <div>Deuxième nœud racine</div>
</template>

<!-- Résultat du rendu -->
<div class="custom-class" id="my-id">Premier nœud racine</div>
<div>Deuxième nœud racine</div>
```

**Utiliser `inheritAttrs: false` pour contrôler l'héritage** :

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Désactiver l'héritage automatique
});
</script>

<template>
  <div v-bind="$attrs">Premier nœud racine</div>
  <div>Deuxième nœud racine</div>
</template>
```

### Fragment vs React Fragment

| Caractéristique       | Vue 3 Fragment         | React Fragment                    |
| --------------------- | ---------------------- | --------------------------------- |
| **Syntaxe**           | Implicite (pas de balise) | Explicite (`<Fragment>` ou `<>`) |
| **Attribut Key**      | Non nécessaire         | `<Fragment key={...}>` si besoin  |
| **Héritage d'attributs** | Traitement manuel   | Non supporté                      |

**Vue 3** :

```vue
<!-- Vue 3 : Fragment implicite -->
<template>
  <h1>Titre</h1>
  <p>Contenu</p>
</template>
```

**React** :

```jsx
// React : Fragment explicite
function Component() {
  return (
    <>
      <h1>Titre</h1>
      <p>Contenu</p>
    </>
  );
}
```

### Points d'attention

1. **Héritage d'attributs** : avec des nœuds racines multiples, les attributs ne sont pas automatiquement hérités, il faut utiliser `$attrs` pour les lier manuellement
2. **Portée des styles** : avec des nœuds racines multiples, les styles `scoped` s'appliquent à tous les nœuds racines
3. **Enveloppement logique** : si l'enveloppement est logiquement nécessaire, il faut toujours utiliser un seul nœud racine

```vue
<!-- Bonne pratique : enveloppement logiquement nécessaire -->
<template>
  <div class="card">
    <h2>Titre</h2>
    <p>Contenu</p>
  </div>
</template>

<!-- À éviter : nœuds racines multiples sans raison -->
<template>
  <h2>Titre</h2>
  <p>Contenu</p>
  <!-- Si ces deux éléments forment logiquement un groupe, il faut les envelopper -->
</template>
```

## 4. Suspense

> Qu'est-ce que Suspense ?

**Définition** : `Suspense` est un composant intégré utilisé pour gérer l'état de chargement des composants asynchrones.

### Utilisation de base

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Chargement en cours...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Cas d'utilisation

1. **Chargement de composants asynchrones**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **Chargement de données asynchrones**
   ```vue
   <script setup>
   const data = await fetchData(); // Utiliser await dans setup
   </script>
   ```

## 5. Multiple v-model

> v-model multiples

**Définition** : Vue 3 permet aux composants d'utiliser plusieurs `v-model`, chaque `v-model` correspondant à un prop différent.

### Vue 2 vs Vue 3

**Vue 2** : un seul `v-model` possible

```vue
<!-- Vue 2 : un seul v-model -->
<CustomInput v-model="value" />
```

**Vue 3** : plusieurs `v-model` possibles

```vue
<!-- Vue 3 : plusieurs v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Exemple d'implémentation

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Cas d'utilisation de Teleport

Expliquez quand utiliser `Teleport`.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Cas d'utilisation de Teleport** :

1. **Boîte de dialogue modale**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - Résout les problèmes de z-index
   - Non affecté par les styles du composant parent

2. **Infobulle (Tooltip)**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - Évite d'être masqué par le overflow du parent

3. **Notification**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - Gestion unifiée de la position des notifications

**Cas où Teleport n'est pas nécessaire** :

- Contenu général
- Composants ne nécessitant pas de position DOM spéciale

</details>

### Question 2 : Avantages de Fragment

Expliquez les avantages des nœuds racines multiples dans Vue 3.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Avantages** :

1. **Réduction des éléments DOM inutiles**

   ```vue
   <!-- Vue 2 : div supplémentaire nécessaire -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3 : pas d'élément supplémentaire -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **Meilleur HTML sémantique**

   - Pas besoin d'ajouter des éléments d'enveloppement sans signification
   - Préserve la sémantique de la structure HTML

3. **Contrôle des styles plus flexible**

   - Pas besoin de gérer les styles de l'élément d'enveloppement
   - Réduction de la complexité des sélecteurs CSS

4. **Réduction de la profondeur du DOM**

   - Arbre DOM moins profond, meilleures performances
   - Réduction du coût de rendu du navigateur

5. **Meilleure maintenabilité**
   - Code plus concis, pas d'élément d'enveloppement supplémentaire
   - Structure des composants plus claire

</details>

### Question 3 : Problème d'héritage d'attributs avec Fragment

Expliquez le comportement de l'héritage d'attributs quand un composant a plusieurs nœuds racines. Comment résoudre ce problème ?

<details>
<summary>Cliquez pour voir la réponse</summary>

**Problème** :

Quand un composant a plusieurs nœuds racines, les attributs transmis par le composant parent (comme `class`, `id`, etc.) ne sont pas automatiquement hérités par aucun nœud racine.

**Exemple** :

```vue
<!-- Composant parent -->
<MyComponent class="custom-class" id="my-id" />

<!-- Composant enfant (racines multiples) -->
<template>
  <div>Premier nœud racine</div>
  <div>Deuxième nœud racine</div>
</template>

<!-- Résultat : les attributs ne sont pas hérités -->
<div>Premier nœud racine</div>
<div>Deuxième nœud racine</div>
```

**Solutions** :

1. **Utiliser `$attrs` pour lier manuellement les attributs**

```vue
<!-- Composant enfant -->
<template>
  <div v-bind="$attrs">Premier nœud racine</div>
  <div>Deuxième nœud racine</div>
</template>

<!-- Résultat -->
<div class="custom-class" id="my-id">Premier nœud racine</div>
<div>Deuxième nœud racine</div>
```

2. **Utiliser `inheritAttrs: false` pour contrôler l'héritage**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Désactiver l'héritage automatique
});
</script>

<template>
  <div v-bind="$attrs">Premier nœud racine</div>
  <div>Deuxième nœud racine</div>
</template>
```

3. **Lier sélectivement des attributs spécifiques**

```vue
<template>
  <div :class="$attrs.class">Premier nœud racine</div>
  <div :id="$attrs.id">Deuxième nœud racine</div>
</template>
```

**Points clés** :

- Nœud racine unique : héritage automatique des attributs
- Nœuds racines multiples : pas d'héritage automatique, traitement manuel nécessaire
- `$attrs` permet d'accéder à tous les attributs non définis dans `props`

</details>

### Question 4 : Fragment vs React Fragment

Comparez les différences entre Vue 3 Fragment et React Fragment.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Principales différences** :

| Caractéristique        | Vue 3 Fragment               | React Fragment                    |
| ---------------------- | ---------------------------- | --------------------------------- |
| **Syntaxe**            | Implicite (pas de balise)    | Explicite (`<Fragment>` ou `<>`)  |
| **Attribut Key**       | Non nécessaire               | `<Fragment key={...}>` si besoin  |
| **Héritage d'attributs** | Traitement manuel (`$attrs`) | Non supporté                    |

**Vue 3** :

```vue
<!-- Vue 3 : Fragment implicite, écrire directement plusieurs nœuds racines -->
<template>
  <h1>Titre</h1>
  <p>Contenu</p>
</template>
```

**React** :

```jsx
// React : Fragment explicite, nécessite des balises
function Component() {
  return (
    <>
      <h1>Titre</h1>
      <p>Contenu</p>
    </>
  );
}

// Ou utiliser Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>Titre</h1>
      <p>Contenu</p>
    </Fragment>
  );
}
```

**Comparaison des avantages** :

- **Vue 3** : syntaxe plus concise, pas de balise supplémentaire
- **React** : plus explicite, possibilité d'ajouter l'attribut key

</details>

### Question 5 : Utilisation de Suspense

Implémentez un exemple utilisant `Suspense` pour charger un composant asynchrone.

<details>
<summary>Cliquez pour voir la réponse</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Chargement des données utilisateur...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// Définir un composant asynchrone
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**Utilisation avancée : gestion des erreurs**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Chargement en cours...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('Composant chargé avec succès');
};

const onReject = (error) => {
  console.error('Échec du chargement du composant :', error);
};
</script>
```

</details>

## 7. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```vue
<!-- 1. Utiliser Teleport pour les modales -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. Garder les nœuds racines multiples sémantiques -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. Utiliser Suspense pour les composants asynchrones -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. Utiliser des noms explicites pour les v-model multiples -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Pratiques à éviter

```vue
<!-- 1. Ne pas abuser de Teleport -->
<Teleport to="body">
  <div>Contenu général</div> <!-- Pas nécessaire -->
</Teleport>

<!-- 2. Ne pas casser la structure pour avoir des nœuds racines multiples -->
<template>
  <h1>Titre</h1>
  <p>Contenu</p>
  <!-- Si logiquement ces éléments doivent être groupés, utiliser un seul nœud racine -->
</template>

<!-- 3. Ne pas ignorer la gestion des erreurs avec Suspense -->
<Suspense>
  <AsyncComponent />
  <!-- Il faut gérer le cas d'échec du chargement -->
</Suspense>
```

## 8. Interview Summary

> Résumé pour l'entretien

### Mémo rapide

**Principales nouvelles fonctionnalités de Vue 3** :

- **Composition API** : nouvelle façon d'écrire les composants
- **Teleport** : rendre le contenu à un autre endroit du DOM
- **Fragment** : support des nœuds racines multiples
- **Suspense** : gérer le chargement des composants asynchrones
- **Multiple v-model** : support de liaisons v-model multiples

**Cas d'utilisation** :

- Modal/Tooltip -> `Teleport`
- HTML sémantique -> `Fragment`
- Composants asynchrones -> `Suspense`
- Composants de formulaire -> Multiple `v-model`

### Exemples de réponses d'entretien

**Q: Quelles sont les principales nouvelles fonctionnalités de Vue 3 ?**

> "Vue 3 a introduit de nombreuses nouvelles fonctionnalités, notamment : 1) Composition API, offrant une nouvelle façon d'écrire les composants avec une meilleure organisation logique et réutilisation du code ; 2) Teleport, permettant de rendre le contenu d'un composant à un autre endroit de l'arbre DOM, couramment utilisé pour les modales et les tooltips ; 3) Fragment, permettant aux composants d'avoir plusieurs nœuds racines sans élément d'enveloppement supplémentaire ; 4) Suspense, gérant l'état de chargement des composants asynchrones ; 5) v-model multiples, supportant plusieurs liaisons v-model par composant ; 6) Meilleur support TypeScript et optimisations de performance. Ces nouvelles fonctionnalités rendent Vue 3 plus puissant et flexible, tout en maintenant la rétrocompatibilité."

**Q: Quels sont les cas d'utilisation de Teleport ?**

> "Teleport est principalement utilisé pour les scénarios où le contenu d'un composant doit être rendu à un autre endroit de l'arbre DOM. Les cas courants incluent : 1) Les boîtes de dialogue modales, qui doivent être rendues dans le body pour éviter les problèmes de z-index ; 2) Les infobulles (Tooltip), pour éviter d'être masquées par le overflow du parent ; 3) Les notifications, pour une gestion unifiée de leur position. L'avantage de Teleport est de préserver la structure logique du composant tout en changeant uniquement la position de rendu dans le DOM, résolvant ainsi les problèmes de style tout en maintenant la maintenabilité du code."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
