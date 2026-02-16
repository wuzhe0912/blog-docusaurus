---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> Qu'est-ce que watch et watchEffect ?

`watch` et `watchEffect` sont deux API de Vue 3 Composition API utilisées pour surveiller les changements des données réactives.

### watch

**Définition** : spécifie explicitement la source de données à surveiller et exécute une fonction de rappel lorsque les données changent.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Surveiller une seule source de données
watch(count, (newValue, oldValue) => {
  console.log(`count est passé de ${oldValue} à ${newValue}`);
});

// Surveiller plusieurs sources de données
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count ou message a changé');
});
</script>
```

### watchEffect

**Définition** : suit automatiquement les données réactives utilisées dans la fonction de rappel et s'exécute automatiquement lorsque ces données changent.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Suit automatiquement count et message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // S'exécute automatiquement quand count ou message change
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Principales différences entre watch et watchEffect

### 1. Spécification de la source de données

**watch** : spécifie explicitement les données à surveiller

```typescript
const count = ref(0);
const message = ref('Hello');

// Spécifie explicitement la surveillance de count
watch(count, (newVal, oldVal) => {
  console.log('count a changé');
});

// Spécifie explicitement la surveillance de plusieurs données
watch([count, message], ([newCount, newMessage]) => {
  console.log('count ou message a changé');
});
```

**watchEffect** : suit automatiquement les données utilisées

```typescript
const count = ref(0);
const message = ref('Hello');

// Suit automatiquement count et message (car utilisés dans le callback)
watchEffect(() => {
  console.log(count.value); // Suit automatiquement count
  console.log(message.value); // Suit automatiquement message
});
```

### 2. Moment d'exécution

**watch** : exécution paresseuse par défaut (lazy), s'exécute uniquement quand les données changent

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Exécuté'); // S'exécute uniquement quand count change
});

count.value = 1; // Déclenche l'exécution
```

**watchEffect** : exécution immédiate, puis suivi des changements

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('Exécuté'); // S'exécute immédiatement une fois
  console.log(count.value);
});

count.value = 1; // S'exécute à nouveau
```

### 3. Accès à l'ancienne valeur

**watch** : peut accéder à l'ancienne valeur

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`De ${oldVal} à ${newVal}`);
});
```

**watchEffect** : ne peut pas accéder à l'ancienne valeur

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Peut uniquement accéder à la valeur actuelle
  // Impossible d'obtenir l'ancienne valeur
});
```

### 4. Arrêter la surveillance

**watch** : retourne une fonction d'arrêt

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Arrêter la surveillance
stopWatch();
```

**watchEffect** : retourne une fonction d'arrêt

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// Arrêter la surveillance
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> Quand utiliser watch ? Quand utiliser watchEffect ?

### Cas d'utilisation de watch

1. **Besoin de spécifier explicitement les données surveillées**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **Besoin d'accéder à l'ancienne valeur**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`De ${oldVal} à ${newVal}`);
   });
   ```

3. **Besoin d'exécution paresseuse (uniquement sur changement)**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **Besoin d'un contrôle plus fin**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### Cas d'utilisation de watchEffect

1. **Suivi automatique de plusieurs données liées**
   ```typescript
   watchEffect(() => {
     // Suit automatiquement toutes les données réactives utilisées
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **Pas besoin de l'ancienne valeur**
   ```typescript
   watchEffect(() => {
     console.log(`Compteur actuel : ${count.value}`);
   });
   ```

3. **Besoin d'exécution immédiate**
   ```typescript
   watchEffect(() => {
     // S'exécute immédiatement, puis suit les changements
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Différences de base

Expliquez l'ordre d'exécution et la sortie du code suivant.

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch : exécution paresseuse, ne s'exécute pas immédiatement
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect : exécution immédiate
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // Sortie immédiate : watchEffect: 0 Hello
});

count.value = 1;
// Déclenche watch : watch: 1
// Déclenche watchEffect : watchEffect: 1 Hello

message.value = 'World';
// watch ne surveille pas message, pas d'exécution
// watchEffect surveille message, exécution : watchEffect: 1 World
```

**Ordre de sortie** :
1. `watchEffect: 0 Hello` (exécution immédiate)
2. `watch: 1` (count a changé)
3. `watchEffect: 1 Hello` (count a changé)
4. `watchEffect: 1 World` (message a changé)

**Différences clés** :
- `watch` s'exécute paresseusement, uniquement quand les données surveillées changent
- `watchEffect` s'exécute immédiatement, puis suit toutes les données utilisées

</details>

### Question 2 : Accès à l'ancienne valeur

Expliquez comment obtenir l'ancienne valeur avec `watchEffect`.

<details>
<summary>Cliquez pour voir la réponse</summary>

**Problème** : `watchEffect` ne peut pas accéder directement à l'ancienne valeur

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Peut uniquement accéder à la valeur actuelle
  // Impossible d'obtenir l'ancienne valeur
});
```

**Solution 1 : Utiliser un ref pour stocker l'ancienne valeur**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`De ${prevCount.value} à ${count.value}`);
  prevCount.value = count.value; // Mettre à jour l'ancienne valeur
});
```

**Solution 2 : Utiliser watch (si l'ancienne valeur est nécessaire)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`De ${oldVal} à ${newVal}`);
});
```

**Recommandation** :
- Si l'ancienne valeur est nécessaire, préférer `watch`
- `watchEffect` est adapté aux scénarios ne nécessitant pas l'ancienne valeur

</details>

### Question 3 : Choisir watch ou watchEffect ?

Indiquez si les scénarios suivants devraient utiliser `watch` ou `watchEffect`.

```typescript
// Scénario 1 : Surveiller le changement d'ID utilisateur, recharger les données
const userId = ref(1);
// ?

// Scénario 2 : Activer automatiquement le bouton de soumission quand la validation passe
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Scénario 3 : Surveiller le mot-clé de recherche, exécuter la recherche (avec debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Scénario 1 : Surveiller l'ID utilisateur**

```typescript
const userId = ref(1);

// Utiliser watch : spécifier explicitement les données surveillées
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Scénario 2 : Validation de formulaire**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// Utiliser watchEffect : suivi automatique des données liées
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Scénario 3 : Recherche (avec debounce)**

```typescript
const searchQuery = ref('');

// Utiliser watch : besoin d'un contrôle plus fin (debounce)
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**Principes de choix** :
- Spécifier explicitement les données surveillées -> `watch`
- Suivi automatique de plusieurs données liées -> `watchEffect`
- Besoin de l'ancienne valeur ou d'un contrôle fin -> `watch`
- Besoin d'exécution immédiate -> `watchEffect`

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```typescript
// 1. Utiliser watch quand on spécifie explicitement les données
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. Utiliser watchEffect pour le suivi automatique de données liées
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. Utiliser watch quand l'ancienne valeur est nécessaire
watch(count, (newVal, oldVal) => {
  console.log(`De ${oldVal} à ${newVal}`);
});

// 4. Penser à nettoyer les surveillances
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Pratiques à éviter

```typescript
// 1. Ne pas effectuer d'opérations asynchrones dans watchEffect sans gérer le nettoyage
watchEffect(async () => {
  const data = await fetchData(); // Peut causer des fuites mémoire
  // ...
});

// 2. Ne pas abuser de watchEffect
// Si seules des données spécifiques doivent être surveillées, watch est plus explicite
watchEffect(() => {
  console.log(count.value); // Si seul count doit être surveillé, watch est plus adapté
});

// 3. Ne pas modifier les données surveillées dans watchEffect (risque de boucle infinie)
watchEffect(() => {
  count.value++; // Peut causer une boucle infinie
});
```

## 6. Interview Summary

> Résumé pour l'entretien

### Mémo rapide

**watch** :
- Spécifie explicitement les données surveillées
- Exécution paresseuse (par défaut)
- Peut accéder à l'ancienne valeur
- Adapté aux scénarios nécessitant un contrôle fin

**watchEffect** :
- Suit automatiquement les données utilisées
- Exécution immédiate
- Ne peut pas accéder à l'ancienne valeur
- Adapté au suivi automatique de données liées

**Principes de choix** :
- Spécifier explicitement la surveillance -> `watch`
- Suivi automatique -> `watchEffect`
- Besoin de l'ancienne valeur -> `watch`
- Besoin d'exécution immédiate -> `watchEffect`

### Exemples de réponses d'entretien

**Q: Quelle est la différence entre watch et watchEffect ?**

> "watch et watchEffect sont tous deux des API de Vue 3 pour surveiller les changements de données réactives. Les principales différences incluent : 1) Source de données : watch nécessite de spécifier explicitement les données à surveiller, watchEffect suit automatiquement les données réactives utilisées dans le callback ; 2) Moment d'exécution : watch s'exécute paresseusement par défaut, uniquement quand les données changent, watchEffect s'exécute immédiatement puis suit les changements ; 3) Accès à l'ancienne valeur : watch peut accéder à l'ancienne valeur, watchEffect ne le peut pas ; 4) Cas d'utilisation : watch est adapté quand on a besoin de spécifier les données ou d'accéder à l'ancienne valeur, watchEffect est adapté au suivi automatique de données liées."

**Q: Quand utiliser watch ? Quand utiliser watchEffect ?**

> "Utiliser watch quand : 1) on a besoin de spécifier explicitement les données surveillées ; 2) on a besoin de l'ancienne valeur ; 3) on a besoin d'une exécution paresseuse, uniquement sur changement ; 4) on a besoin d'un contrôle plus fin (options immediate, deep). Utiliser watchEffect quand : 1) on a besoin du suivi automatique de données liées ; 2) on n'a pas besoin de l'ancienne valeur ; 3) on a besoin d'une exécution immédiate. En général, si seules des données spécifiques doivent être surveillées, watch est plus explicite ; si on a besoin du suivi automatique de données liées, watchEffect est plus pratique."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
