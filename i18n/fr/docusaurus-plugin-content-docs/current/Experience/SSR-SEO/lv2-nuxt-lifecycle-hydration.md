---
title: '[Lv2] Nuxt 3 Lifecycle et principes de Hydration'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Comprendre en profondeur le cycle de vie (Lifecycle), la gestion d'etat (State Management) et le mecanisme de Hydration de Nuxt 3, en evitant les problemes courants de Hydration Mismatch.

---

## 1. Points cles de reponse en entretien

1. **Differences de Lifecycle** : Distinguer les Hooks executes cote Server et cote Client. `setup` s'execute des deux cotes, `onMounted` uniquement cote Client.
2. **Gestion d'etat** : Comprendre les differences entre `useState` et `ref` dans les scenarios SSR. `useState` peut synchroniser l'etat entre Server et Client, evitant le Hydration Mismatch.
3. **Mecanisme de Hydration** : Expliquer comment la Hydration transforme le HTML statique en application interactive, et les causes courantes de Mismatch (structure HTML inconsistante, contenu aleatoire, etc.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Environnement d'execution des Lifecycle Hooks

Dans Nuxt 3 (Vue 3 SSR), differents Hooks s'executent dans differents environnements :

| Lifecycle Hook | Server-side | Client-side | Description |
|----------------|-------------|-------------|-------------|
| **setup()** | ✅ Execute | ✅ Execute | Logique d'initialisation du composant. **Attention : eviter d'utiliser des APIs exclusives au Client (comme window, document) dans setup**. |
| **onBeforeMount** | ❌ Non execute | ✅ Execute | Avant le montage. |
| **onMounted** | ❌ Non execute | ✅ Execute | Montage termine. **Les operations DOM et appels Browser API doivent aller ici**. |
| **onBeforeUpdate** | ❌ Non execute | ✅ Execute | Avant la mise a jour des donnees. |
| **onUpdated** | ❌ Non execute | ✅ Execute | Apres la mise a jour des donnees. |
| **onBeforeUnmount** | ❌ Non execute | ✅ Execute | Avant le demontage. |
| **onUnmounted** | ❌ Non execute | ✅ Execute | Apres le demontage. |

### 2.2 Question d'entretien courante : onMounted s'execute-t-il cote Server ?

**Reponse :**
Non. `onMounted` ne s'execute que cote Client (navigateur). Le rendu cote serveur ne fait que generer la chaine HTML, sans effectuer le montage (Mounting) du DOM.

**Question de suivi : Que faire si une logique specifique doit etre executee cote Server ?**
- Utiliser `setup()` ou `useAsyncData` / `useFetch`.
- Si vous devez distinguer l'environnement, utilisez `process.server` ou `process.client` pour determiner.

```typescript
<script setup>
// S'execute sur Server et Client
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // S'execute uniquement sur le Client
  console.log('Mounted (Client Only)');
  // Utilisation securisee de window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 Pourquoi Nuxt a-t-il besoin de useState ?

Dans les applications SSR, apres que le Server a rendu le HTML, il serialise l'etat (State) et l'envoie au Client pour que celui-ci effectue la Hydration (reprise de l'etat).

- **Vue `ref`** : C'est un etat local au sein du composant. Dans le processus SSR, la valeur de `ref` creee sur le Server **n'est pas automatiquement** transferee au Client. Lors de l'initialisation du Client, `ref` est recree (generalement reinitialise a la valeur initiale), causant une inconsistance entre le contenu rendu par le Server et l'etat initial du Client, produisant un Hydration Mismatch.
- **Nuxt `useState`** : C'est une gestion d'etat compatible SSR. Elle stocke l'etat dans `NuxtPayload`, envoye avec le HTML au Client. Lors de l'initialisation du Client, ce Payload est lu et l'etat restaure, assurant la coherence entre Server et Client.

### 3.2 Tableau comparatif

| Caracteristique | Vue `ref` / `reactive` | Nuxt `useState` |
|-----------------|------------------------|-----------------|
| **Portee** | Au sein du composant / module | Global (partageable dans toute l'App via key) |
| **Synchronisation d'etat SSR** | ❌ Ne synchronise pas | ✅ Serialise et synchronise automatiquement au Client |
| **Scenarios d'utilisation** | Etat d'interaction Client uniquement, donnees ne necessitant pas de synchronisation SSR | Etat inter-composants, donnees devant etre transportees du Server au Client (comme User Info) |

### 3.3 Exemple d'implementation

**Mauvais exemple (utiliser ref pour l'etat inter-plateformes) :**

```typescript
// Server genere un nombre aleatoire -> HTML affiche 5
const count = ref(Math.random());

// Client re-execute -> genere un nouveau nombre aleatoire 3
// Resultat : Hydration Mismatch (Server: 5, Client: 3)
```

**Bon exemple (utiliser useState) :**

```typescript
// Server genere un nombre aleatoire -> stocke dans Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client lit le Payload -> obtient la valeur generee par le Server
// Resultat : Etat coherent
```

---

## 4. Hydration et Hydration Mismatch

### 4.1 Qu'est-ce que la Hydration ?

La Hydration est le processus par lequel le JavaScript cote Client prend le relais du HTML statique rendu par le Server.

1. **Server Rendering** : Le Server execute l'application Vue et genere une chaine HTML (incluant contenu et CSS).
2. **Telechargement HTML** : Le navigateur telecharge et affiche le HTML statique (First Paint).
3. **Telechargement et execution JS** : Le navigateur telecharge le bundle JS Vue/Nuxt.
4. **Hydration** : Vue reconstruit le DOM virtuel (Virtual DOM) cote Client et le compare au DOM reel existant. Si la structure correspond, Vue "active" ces elements DOM (lie les event listeners), rendant la page interactive.

### 4.2 Qu'est-ce que le Hydration Mismatch ?

Quand la structure du Virtual DOM generee cote Client **ne correspond pas** a la structure HTML rendue par le Server, Vue emet un avertissement de Hydration Mismatch. Cela signifie generalement que le Client doit rejeter le HTML du Server et re-rendre, causant une degradation des performances et un scintillement de l'ecran.

### 4.3 Causes courantes de Mismatch et solutions

#### 1. Structure HTML invalide
Le navigateur corrige automatiquement les structures HTML incorrectes, causant une inconsistance avec les attentes de Vue.
- **Exemple** : `<div>` a l'interieur de `<p>`.
- **Solution** : Verifier la syntaxe HTML et s'assurer que la structure imbriquee est valide.

#### 2. Contenu aleatoire ou horodatages
Le Server et le Client generent un contenu different lors de l'execution.
- **Exemple** : `new Date()`, `Math.random()`.
- **Solution** :
    - Utiliser `useState` pour fixer la valeur.
    - Ou deplacer cette logique dans `onMounted` (rendre uniquement cote Client, laisser vide ou afficher un Placeholder cote Server).

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

#### 3. Rendu conditionnel dependant de window/document
- **Exemple** : `v-if="window.innerWidth > 768"`
- **Cause** : Le Server n'a pas window, evalue a false ; le Client evalue a true.
- **Solution** : Mettre a jour l'etat dans `onMounted`, ou utiliser des hooks Client-only comme `useWindowSize`.

---

## 5. Resume d'entretien

**Vous pouvez repondre ainsi :**

> La principale difference entre Server-side et Client-side reside dans l'execution des Lifecycle Hooks. Le Server execute principalement `setup`, tandis que `onMounted` et les autres Hooks lies au DOM ne s'executent que cote Client. Cela mene au concept de Hydration, c'est-a-dire le processus par lequel le Client prend le relais du HTML du Server.
>
> Pour eviter le Hydration Mismatch, nous devons nous assurer que le contenu du rendu initial du Server et du Client est coherent. C'est pourquoi Nuxt fournit `useState`. Contrairement au `ref` de Vue, `useState` serialise l'etat et l'envoie au Client, assurant la synchronisation de l'etat des deux cotes. Si `ref` est utilise pour stocker des donnees generees cote Server, une inconsistance se produira lors de la reinitialisation du Client.
>
> Les Mismatch courants incluent les nombres aleatoires, les horodatages ou les structures HTML imbriquees invalides. La solution est de deplacer le contenu variable vers `onMounted` ou d'utiliser le composant `<ClientOnly>`.

**Points cles :**
- ✅ `onMounted` ne s'execute que cote Client
- ✅ `useState` supporte la synchronisation d'etat SSR, `ref` non
- ✅ Causes du Hydration Mismatch (structure, valeurs aleatoires) et solutions (`<ClientOnly>`, `onMounted`)
