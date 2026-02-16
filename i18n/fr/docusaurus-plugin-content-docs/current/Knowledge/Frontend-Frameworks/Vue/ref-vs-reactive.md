---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> Qu'est-ce que ref et reactive ?

`ref` et `reactive` sont deux API fondamentales de la Composition API de Vue 3 pour créer des données réactives.

### ref

**Définition** : `ref` sert à créer une **valeur de type primitif** ou une **référence d'objet** réactive.

<details>
<summary>Cliquez pour voir l'exemple de base de ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// Types primitifs
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// Objet (on peut aussi utiliser ref)
const user = ref({
  name: 'John',
  age: 30,
});

// L'accès nécessite .value
console.log(count.value); // 0
count.value++; // Modifier la valeur
</script>
```

</details>

### reactive

**Définition** : `reactive` sert à créer un **objet** réactif (ne peut pas être utilisé directement pour les types primitifs).

<details>
<summary>Cliquez pour voir l'exemple de base de reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

// Uniquement pour les objets
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// Accès direct aux propriétés, pas besoin de .value
console.log(state.count); // 0
state.count++; // Modifier la valeur
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Principales différences entre ref et reactive

### 1. Types applicables

**ref** : Peut être utilisé pour tout type

```typescript
const count = ref(0); // Nombre
const message = ref('Hello'); // Chaîne
const isActive = ref(true); // Booléen
const user = ref({ name: 'John' }); // Objet
const items = ref([1, 2, 3]); // Tableau
```

**reactive** : Uniquement pour les objets

```typescript
const state = reactive({ count: 0 }); // Objet
const state = reactive([1, 2, 3]); // Tableau (c'est aussi un objet)
const count = reactive(0); // Erreur : type primitif non supporté
const message = reactive('Hello'); // Erreur : type primitif non supporté
```

### 2. Mode d'accès

**ref** : Nécessite `.value` pour accéder

<details>
<summary>Cliquez pour voir l'exemple d'accès ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// En JavaScript, .value est nécessaire
console.log(count.value); // 0
count.value = 10;

// Dans le template, déballage automatique, pas besoin de .value
</script>

<template>
  <div>{{ count }}</div>
  <!-- Déballage automatique, pas besoin de .value -->
</template>
```

</details>

**reactive** : Accès direct aux propriétés

<details>
<summary>Cliquez pour voir l'exemple d'accès reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// Accès direct aux propriétés
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Réaffectation

**ref** : Peut être réaffecté

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Réaffectation possible
```

**reactive** : Ne peut pas être réaffecté (perd la réactivité)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // Perd la réactivité, ne déclenchera pas de mise à jour
```

### 4. Déstructuration

**ref** : La déstructuration conserve la réactivité

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Déstructuration de valeurs primitives, perd la réactivité

// Mais on peut déstructurer les ref eux-mêmes
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive** : La déstructuration perd la réactivité

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // Perd la réactivité

// Il faut utiliser toRefs pour conserver la réactivité
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // Conserve la réactivité
```

## 3. When to Use ref vs reactive?

> Quand utiliser ref ? Quand utiliser reactive ?

### Situations pour utiliser ref

1. **Valeurs de types primitifs**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Objets nécessitant une réaffectation**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Réaffectation possible
   ```

3. **Références de template (Template Refs)**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **Situations nécessitant la déstructuration**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // La déstructuration de valeurs primitives fonctionne
   ```

### Situations pour utiliser reactive

1. **États d'objets complexes**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **États ne nécessitant pas de réaffectation**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **Plusieurs propriétés associées regroupées**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Différences de base

Expliquez les différences et les résultats du code suivant.

```typescript
// Cas 1 : Utilisation de ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// Cas 2 : Utilisation de reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// Cas 3 : Réaffectation de reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
// Cas 1 : Utilisation de ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10

// Cas 2 : Utilisation de reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10

// Cas 3 : Réaffectation de reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // Perd la réactivité
console.log(state2.count); // 10 (valeur correcte, mais réactivité perdue)
// Les modifications ultérieures de state2.count ne déclencheront pas de mise à jour de la vue
```

**Différences clés** :

- `ref` nécessite `.value` pour l'accès
- `reactive` accède directement aux propriétés
- `reactive` ne peut pas être réaffecté, sinon la réactivité est perdue

</details>

### Question 2 : Problème de déstructuration

Expliquez le problème du code suivant et proposez une solution.

```typescript
// Cas 1 : Déstructuration de ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// Cas 2 : Déstructuration de reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Cas 1 : Déstructuration de ref**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // Ne mettra pas à jour user.value.name

// Bonne pratique : modifier la valeur du ref
user.value.name = 'Jane';
// Ou réaffecter
user.value = { name: 'Jane', age: 30 };
```

**Cas 2 : Déstructuration de reactive**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // Perd la réactivité, ne déclenchera pas de mise à jour

// Bonne pratique 1 : modifier directement la propriété
state.count = 10;

// Bonne pratique 2 : utiliser toRefs pour conserver la réactivité
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // C'est maintenant un ref, .value est nécessaire
```

**Résumé** :

- La déstructuration de valeurs primitives perd la réactivité
- La déstructuration de `reactive` nécessite `toRefs` pour conserver la réactivité
- La déstructuration des propriétés d'objet de `ref` perd aussi la réactivité, il faut modifier `.value` directement

</details>

### Question 3 : Choisir ref ou reactive ?

Indiquez si les scénarios suivants devraient utiliser `ref` ou `reactive`.

```typescript
// Scénario 1 : Compteur
const count = ?;

// Scénario 2 : État du formulaire
const form = ?;

// Scénario 3 : Données utilisateur (peut nécessiter une réaffectation)
const user = ?;

// Scénario 4 : Référence de template
const inputRef = ?;
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
// Scénario 1 : Compteur (type primitif)
const count = ref(0); // ref

// Scénario 2 : État du formulaire (objet complexe, pas de réaffectation)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // reactive

// Scénario 3 : Données utilisateur (peut nécessiter une réaffectation)
const user = ref({ name: 'John', age: 30 }); // ref (réaffectation possible)

// Scénario 4 : Référence de template
const inputRef = ref(null); // ref (les références de template doivent utiliser ref)
```

**Principes de choix** :

- Type primitif -> `ref`
- Objet nécessitant une réaffectation -> `ref`
- Référence de template -> `ref`
- État d'objet complexe sans réaffectation -> `reactive`

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```typescript
// 1. Types primitifs avec ref
const count = ref(0);
const message = ref('Hello');

// 2. États complexes avec reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. Réaffectation avec ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };

// 4. Déstructuration de reactive avec toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. Style uniforme : l'équipe peut choisir d'utiliser principalement ref ou reactive
```

### Pratiques à éviter

```typescript
// 1. Ne pas utiliser reactive pour les types primitifs
const count = reactive(0); // Erreur

// 2. Ne pas réaffecter reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // Perd la réactivité

// 3. Ne pas déstructurer directement reactive
const { count } = reactive({ count: 0 }); // Perd la réactivité

// 4. Ne pas oublier .value dans le template (cas de ref)
// Pas besoin de .value dans le template, mais nécessaire en JavaScript
```

## 6. Interview Summary

> Résumé d'entretien

### Aide-mémoire

**ref** :

- Applicable à tout type
- Nécessite `.value` pour l'accès
- Peut être réaffecté
- Déballage automatique dans le template

**reactive** :

- Uniquement pour les objets
- Accès direct aux propriétés
- Ne peut pas être réaffecté
- La déstructuration nécessite `toRefs`

**Principes de choix** :

- Type primitif -> `ref`
- Besoin de réaffectation -> `ref`
- État d'objet complexe -> `reactive`

### Exemples de réponses en entretien

**Q: Quelle est la différence entre ref et reactive ?**

> "ref et reactive sont deux API de Vue 3 pour créer des données réactives. Les principales différences incluent : 1) Types applicables : ref peut être utilisé pour tout type, reactive uniquement pour les objets ; 2) Mode d'accès : ref nécessite .value, reactive accède directement aux propriétés ; 3) Réaffectation : ref peut être réaffecté, reactive ne le peut pas sous peine de perdre la réactivité ; 4) Déstructuration : la déstructuration de reactive nécessite toRefs pour conserver la réactivité. En général, on utilise ref pour les types primitifs et les objets nécessitant une réaffectation, et reactive pour les états d'objets complexes."

**Q: Quand utiliser ref ? Quand utiliser reactive ?**

> "Utiliser ref : 1) valeurs de types primitifs ; 2) objets nécessitant une réaffectation ; 3) références de template. Utiliser reactive : 1) états d'objets complexes avec plusieurs propriétés associées ; 2) états ne nécessitant pas de réaffectation. En pratique, beaucoup d'équipes utilisent uniformément ref car il est plus flexible et applicable à un plus large éventail de cas."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
