---
title: '[Lv2] Nuxt 3 Lifecycle et principes de Hydration'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Comprendre en profondeur le cycle de vie (Lifecycle), la gestion d'état (State Management) et le mécanisme de Hydration de Nuxt 3, en évitant les problèmes courants de Hydration Mismatch.

---

## 1. Points clés de réponse en entretien

1. **Différences de Lifecycle** : Distinguer les Hooks exécutés côté Server et côté Client. `setup` s'exécute des deux côtés, `onMounted` uniquement côté Client.
2. **Gestion d'état** : Comprendre les différences entre `useState` et `ref` dans les scénarios SSR. `useState` peut synchroniser l'état entre Server et Client, évitant le Hydration Mismatch.
3. **Mécanisme de Hydration** : Expliquer comment la Hydration transforme le HTML statique en application interactive, et les causes courantes de Mismatch (structure HTML inconsistante, contenu aléatoire, etc.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Environnement d'exécution des Lifecycle Hooks

Dans Nuxt 3 (Vue 3 SSR), différents Hooks s'exécutent dans différents environnements :

| Lifecycle Hook | Server-side | Client-side | Description |
|----------------|-------------|-------------|-------------|
| **setup()** | ✅ Exécuté | ✅ Exécuté | Logique d'initialisation du composant. **Attention : éviter d'utiliser des APIs exclusives au Client (comme window, document) dans setup**. |
| **onBeforeMount** | ❌ Non exécuté | ✅ Exécuté | Avant le montage. |
| **onMounted** | ❌ Non exécuté | ✅ Exécuté | Montage terminé. **Les opérations DOM et appels Browser API doivent aller ici**. |
| **onBeforeUpdate** | ❌ Non exécuté | ✅ Exécuté | Avant la mise à jour des données. |
| **onUpdated** | ❌ Non exécuté | ✅ Exécuté | Après la mise à jour des données. |
| **onBeforeUnmount** | ❌ Non exécuté | ✅ Exécuté | Avant le démontage. |
| **onUnmounted** | ❌ Non exécuté | ✅ Exécuté | Après le démontage. |

### 2.2 Question d'entretien courante : onMounted s'exécute-t-il côté Server ?

**Réponse :**
Non. `onMounted` ne s'exécute que côté Client (navigateur). Le rendu côté serveur ne fait que générer la chaîne HTML, sans effectuer le montage (Mounting) du DOM.

**Question de suivi : Que faire si une logique spécifique doit être exécutée côté Server ?**
- Utiliser `setup()` ou `useAsyncData` / `useFetch`.
- Si vous devez distinguer l'environnement, utilisez `process.server` ou `process.client` pour déterminer.

```typescript
<script setup>
// S'exécute sur Server et Client
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // S'exécute uniquement sur le Client
  console.log('Mounted (Client Only)');
  // Utilisation sécurisée de window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 Pourquoi Nuxt a-t-il besoin de useState ?

Dans les applications SSR, après que le Server a rendu le HTML, il sérialise l'état (State) et l'envoie au Client pour que celui-ci effectue la Hydration (reprise de l'état).

- **Vue `ref`** : C'est un état local au sein du composant. Dans le processus SSR, la valeur de `ref` créée sur le Server **n'est pas automatiquement** transférée au Client. Lors de l'initialisation du Client, `ref` est recréé (généralement réinitialisé à la valeur initiale), causant une inconsistance entre le contenu rendu par le Server et l'état initial du Client, produisant un Hydration Mismatch.
- **Nuxt `useState`** : C'est une gestion d'état compatible SSR. Elle stocke l'état dans `NuxtPayload`, envoyé avec le HTML au Client. Lors de l'initialisation du Client, ce Payload est lu et l'état restauré, assurant la cohérence entre Server et Client.

### 3.2 Tableau comparatif

| Caractéristique | Vue `ref` / `reactive` | Nuxt `useState` |
|-----------------|------------------------|-----------------|
| **Portée** | Au sein du composant / module | Global (partageable dans toute l'App via key) |
| **Synchronisation d'état SSR** | ❌ Ne synchronise pas | ✅ Sérialise et synchronise automatiquement au Client |
| **Scénarios d'utilisation** | État d'interaction Client uniquement, données ne nécessitant pas de synchronisation SSR | État inter-composants, données devant être transportées du Server au Client (comme User Info) |

### 3.3 Exemple d'implémentation

**Mauvais exemple (utiliser ref pour l'état inter-plateformes) :**

```typescript
// Server génère un nombre aléatoire -> HTML affiche 5
const count = ref(Math.random());

// Client ré-exécute -> génère un nouveau nombre aléatoire 3
// Résultat : Hydration Mismatch (Server: 5, Client: 3)
```

**Bon exemple (utiliser useState) :**

```typescript
// Server génère un nombre aléatoire -> stocké dans Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client lit le Payload -> obtient la valeur générée par le Server
// Résultat : État cohérent
```

---

## 4. Hydration et Hydration Mismatch

### 4.1 Qu'est-ce que la Hydration ?

La Hydration est le processus par lequel le JavaScript côté Client prend le relais du HTML statique rendu par le Server.

1. **Server Rendering** : Le Server exécute l'application Vue et génère une chaîne HTML (incluant contenu et CSS).
2. **Téléchargement HTML** : Le navigateur télécharge et affiche le HTML statique (First Paint).
3. **Téléchargement et exécution JS** : Le navigateur télécharge le bundle JS Vue/Nuxt.
4. **Hydration** : Vue reconstruit le DOM virtuel (Virtual DOM) côté Client et le compare au DOM réel existant. Si la structure correspond, Vue "active" ces éléments DOM (lie les event listeners), rendant la page interactive.

### 4.2 Qu'est-ce que le Hydration Mismatch ?

Quand la structure du Virtual DOM générée côté Client **ne correspond pas** à la structure HTML rendue par le Server, Vue émet un avertissement de Hydration Mismatch. Cela signifie généralement que le Client doit rejeter le HTML du Server et re-rendre, causant une dégradation des performances et un scintillement de l'écran.

### 4.3 Causes courantes de Mismatch et solutions

#### 1. Structure HTML invalide
Le navigateur corrige automatiquement les structures HTML incorrectes, causant une inconsistance avec les attentes de Vue.
- **Exemple** : `<div>` à l'intérieur de `<p>`.
- **Solution** : Vérifier la syntaxe HTML et s'assurer que la structure imbriquée est valide.

#### 2. Contenu aléatoire ou horodatages
Le Server et le Client génèrent un contenu différent lors de l'exécution.
- **Exemple** : `new Date()`, `Math.random()`.
- **Solution** :
    - Utiliser `useState` pour fixer la valeur.
    - Ou déplacer cette logique dans `onMounted` (rendre uniquement côté Client, laisser vide ou afficher un Placeholder côté Server).

```typescript
// Incorrect
const time = new Date().toISOString();

// Correct (utiliser onMounted)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// Ou utiliser <ClientOnly>
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. Rendu conditionnel dépendant de window/document
- **Exemple** : `v-if="window.innerWidth > 768"`
- **Cause** : Le Server n'a pas window, évalue à false ; le Client évalue à true.
- **Solution** : Mettre à jour l'état dans `onMounted`, ou utiliser des hooks Client-only comme `useWindowSize`.

---

## 5. Résumé d'entretien

**Vous pouvez répondre ainsi :**

> La principale différence entre Server-side et Client-side réside dans l'exécution des Lifecycle Hooks. Le Server exécute principalement `setup`, tandis que `onMounted` et les autres Hooks liés au DOM ne s'exécutent que côté Client. Cela mène au concept de Hydration, c'est-à-dire le processus par lequel le Client prend le relais du HTML du Server.
>
> Pour éviter le Hydration Mismatch, nous devons nous assurer que le contenu du rendu initial du Server et du Client est cohérent. C'est pourquoi Nuxt fournit `useState`. Contrairement au `ref` de Vue, `useState` sérialise l'état et l'envoie au Client, assurant la synchronisation de l'état des deux côtés. Si `ref` est utilisé pour stocker des données générées côté Server, une inconsistance se produira lors de la réinitialisation du Client.
>
> Les Mismatch courants incluent les nombres aléatoires, les horodatages ou les structures HTML imbriquées invalides. La solution est de déplacer le contenu variable vers `onMounted` ou d'utiliser le composant `<ClientOnly>`.

**Points clés :**
- ✅ `onMounted` ne s'exécute que côté Client
- ✅ `useState` supporte la synchronisation d'état SSR, `ref` non
- ✅ Causes du Hydration Mismatch (structure, valeurs aléatoires) et solutions (`<ClientOnly>`, `onMounted`)
