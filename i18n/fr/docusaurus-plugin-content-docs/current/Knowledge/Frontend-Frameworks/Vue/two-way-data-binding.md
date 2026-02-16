---
id: vue-two-way-data-binding
title: '[Hard] Liaison bidirectionnelle des données'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Expliquez le principe sous-jacent de la liaison bidirectionnelle dans Vue 2 et Vue 3.

Pour comprendre la liaison bidirectionnelle de Vue, il faut d'abord comprendre le mécanisme du système réactif, ainsi que les différences d'implémentation entre Vue 2 et Vue 3.

### Implémentation dans Vue 2

Vue 2 utilise `Object.defineProperty` pour implémenter la liaison bidirectionnelle. Cette méthode permet d'encapsuler les propriétés d'un objet en `getter` et `setter` pour surveiller les changements.

#### 1. Data Hijacking (Interception des données)

Dans Vue 2, lorsqu'un objet de données d'un composant est créé, Vue parcourt toutes les propriétés de l'objet et utilise `Object.defineProperty` pour les convertir en `getter` et `setter`, permettant ainsi à Vue de suivre les lectures et modifications des données.

#### 2. Dependency Collection (Collecte des dépendances)

Chaque fois que la fonction de rendu d'un composant est exécutée, elle lit les propriétés de data, ce qui déclenche les `getter`. Vue enregistre ces dépendances pour s'assurer que les composants concernés sont notifiés lorsque les données changent.

#### 3. Dispatching Updates (Déclenchement des mises à jour)

Lorsque les données sont modifiées, le `setter` est déclenché. Vue notifie alors tous les composants qui dépendent de ces données et ré-exécute la fonction de rendu pour mettre à jour le DOM.

#### Exemple de code Vue 2

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // Déclenche le getter, affiche "get name: Pitt"
data.name = 'Vue2 Reactivity'; // Déclenche le setter, affiche "set name: Vue2 Reactivity"
```

#### Limitations de Vue 2

L'utilisation de `Object.defineProperty` présente certaines limitations :

- **Impossible de détecter l'ajout ou la suppression de propriétés** : il faut utiliser `Vue.set()` ou `Vue.delete()`
- **Impossible de détecter les changements d'index de tableaux** : il faut utiliser les méthodes fournies par Vue (comme `push`, `pop`, etc.)
- **Problèmes de performance** : nécessite de parcourir récursivement toutes les propriétés et de prédéfinir getter et setter

### Implémentation dans Vue 3

Vue 3 a introduit `Proxy` d'ES6, qui permet d'encapsuler un objet dans un proxy et de surveiller les changements de ses propriétés, avec de meilleures performances.

#### 1. Interception des données avec Proxy

Dans Vue 3, `new Proxy` est utilisé pour créer un proxy des données, au lieu de définir individuellement des `getter` et `setter` pour chaque propriété. Cela permet un suivi plus fin des changements de données et l'interception de plus de types d'opérations, comme l'ajout ou la suppression de propriétés.

#### 2. Suivi des dépendances plus efficace

Avec Proxy, Vue 3 peut suivre les dépendances plus efficacement car il n'est plus nécessaire de prédéfinir les `getter/setter`. Proxy peut intercepter jusqu'à 13 types d'opérations (`get`, `set`, `has`, `deleteProperty`, etc.).

#### 3. Re-rendu minimal automatique

Lorsque les données changent, Vue 3 peut déterminer plus précisément quelle partie de l'interface doit être mise à jour, réduisant ainsi les re-rendus inutiles.

#### Exemple de code Vue 3

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`Obtenir ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`Définir ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // Lecture des données, déclenche le get du Proxy
data.name = 'Vue 3 Reactivity'; // Modification des données, déclenche le set du Proxy
console.log(data.name);
```

### Tableau comparatif Vue 2 vs Vue 3

| Caractéristique | Vue 2 | Vue 3 |
| --- | --- | --- |
| Implémentation | `Object.defineProperty` | `Proxy` |
| Détection d'ajout de propriété | Nécessite `Vue.set()` | Support natif |
| Détection de suppression | Nécessite `Vue.delete()` | Support natif |
| Détection d'index de tableau | Nécessite des méthodes spécifiques | Support natif |
| Performance | Parcours récursif de toutes les propriétés | Traitement paresseux, meilleures performances |
| Support navigateur | IE9+ | Pas de support IE11 |

### Conclusion

Vue 2 utilise `Object.defineProperty` pour la liaison bidirectionnelle, mais cette méthode a des limitations (comme l'impossibilité de détecter l'ajout ou la suppression de propriétés). Vue 3 a introduit `Proxy` d'ES6, offrant un système réactif plus puissant et flexible, tout en améliorant les performances. C'est l'une des améliorations majeures de Vue 3 par rapport à Vue 2.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Pourquoi Vue 3 utilise-t-il `Proxy` plutôt que `Object.defineProperty` ?

### Raisons principales

#### 1. Capacité d'interception plus puissante

`Proxy` peut intercepter jusqu'à 13 types d'opérations, tandis que `Object.defineProperty` ne peut intercepter que la lecture et l'écriture des propriétés :

```js
// Opérations interceptables par Proxy
const handler = {
  get() {},              // Lecture de propriété
  set() {},              // Écriture de propriété
  has() {},              // Opérateur in
  deleteProperty() {},   // Opérateur delete
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // Appel de fonction
  construct() {}         // Opérateur new
};
```

#### 2. Support natif de la surveillance des index de tableaux

```js
// Vue 2 ne peut pas détecter
const arr = [1, 2, 3];
arr[0] = 10; // Ne déclenche pas de mise à jour

// Vue 3 peut détecter
const arr = reactive([1, 2, 3]);
arr[0] = 10; // Déclenche la mise à jour
```

#### 3. Support natif de l'ajout/suppression dynamique de propriétés

```js
// Vue 2 nécessite un traitement spécial
Vue.set(obj, 'newKey', 'value');
obj.newKey = 'value'; // Ne déclenche pas de mise à jour

// Vue 3 support natif
const obj = reactive({});
obj.newKey = 'value'; // Déclenche la mise à jour
delete obj.newKey; // Déclenche aussi la mise à jour
```

#### 4. Meilleures performances

```js
// Vue 2 : parcours récursif de toutes les propriétés
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue 3 : traitement paresseux, proxy uniquement lors de l'accès
function reactive(obj) {
  return new Proxy(obj, handler); // Pas besoin de récursion
}
```

#### 5. Code plus concis

L'implémentation du système réactif de Vue 3 nécessite beaucoup moins de code, avec un coût de maintenance réduit.

### Pourquoi Vue 2 n'utilisait-il pas Proxy ?

Principalement en raison de la **compatibilité des navigateurs** :

- Lors de la sortie de Vue 2 (2016), Proxy n'était pas encore largement supporté
- Vue 2 devait supporter IE9+, et Proxy ne peut pas être polyfillé
- Vue 3 a abandonné le support d'IE11, permettant l'adoption de Proxy

### Exemple comparatif pratique

```js
// ===== Limitations de Vue 2 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// Les opérations suivantes ne déclenchent pas de mise à jour
vm.obj.b = 2;           // Ajout de propriété
delete vm.obj.a;        // Suppression de propriété
vm.arr[0] = 10;         // Modification d'index de tableau
vm.arr.length = 0;      // Modification de longueur de tableau

// Nécessite des méthodes spéciales
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue 3 support natif =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// Toutes ces opérations déclenchent des mises à jour
state.obj.b = 2;        // Ajout de propriété
delete state.obj.a;     // Suppression de propriété
state.arr[0] = 10;      // Modification d'index de tableau
state.arr.length = 0;   // Modification de longueur de tableau
```

### Résumé

Vue 3 utilise `Proxy` pour :

1. Fournir un support réactif plus complet (ajout/suppression de propriétés, index de tableaux, etc.)
2. Améliorer les performances (traitement paresseux, pas de récursion préalable)
3. Simplifier le code (implémentation plus concise)
4. Offrir une meilleure expérience de développement (pas besoin de mémoriser des API spéciales)

Le seul compromis est l'abandon du support des anciens navigateurs (IE11), mais c'est un compromis qui en vaut la peine.

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
