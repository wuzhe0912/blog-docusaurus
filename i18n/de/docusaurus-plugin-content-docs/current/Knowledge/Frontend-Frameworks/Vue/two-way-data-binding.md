---
id: vue-two-way-data-binding
title: '[Hard] Bidirektionale Datenbindung'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Erklaeren Sie das zugrundeliegende Prinzip, wie Vue2 und Vue3 jeweils bidirektionale Bindung implementieren

Um die bidirektionale Bindung von Vue zu verstehen, muss man zunaechst den Mechanismus des reaktiven Systems und die Implementierungsunterschiede zwischen Vue2 und Vue3 verstehen.

### Vue2-Implementierung

Vue2 verwendet `Object.defineProperty` zur Implementierung der bidirektionalen Bindung. Diese Methode kann Objekteigenschaften in `getter` und `setter` umwandeln und Aenderungen an Objekteigenschaften ueberwachen.

#### 1. Data Hijacking (Daten-Hijacking)

In Vue2 durchlaeuft Vue beim Erstellen eines Datenobjekts alle Eigenschaften und konvertiert sie mittels `Object.defineProperty` in `getter` und `setter`, wodurch Datenlese- und -aenderungsvorgaenge nachverfolgt werden koennen.

#### 2. Dependency Collection (Abhaengigkeitserfassung)

Wenn die Render-Funktion ausgefuehrt wird, liest sie Eigenschaften aus data und loest den `getter` aus. Vue zeichnet diese Abhaengigkeiten auf, um bei Datenaenderungen die betroffenen Komponenten benachrichtigen zu koennen.

#### 3. Dispatching Updates (Update-Versand)

Wenn Daten geaendert werden, wird der `setter` ausgeloest, und Vue benachrichtigt alle abhaengigen Komponenten, die Render-Funktion erneut auszufuehren und das DOM zu aktualisieren.

#### Vue2-Codebeispiel

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

console.log(data.name); // Loest getter aus, gibt "get name: Pitt" aus
data.name = 'Vue2 Reactivity'; // Loest setter aus, gibt "set name: Vue2 Reactivity" aus
```

#### Einschraenkungen von Vue2

- **Kann hinzugefuegte/geloeschte Objekteigenschaften nicht erkennen**: Erfordert `Vue.set()` oder `Vue.delete()`
- **Kann Array-Index-Aenderungen nicht erkennen**: Erfordert spezielle Vue-Array-Methoden
- **Performance-Problem**: Erfordert rekursives Durchlaufen aller Eigenschaften

### Vue3-Implementierung

Vue3 fuehrt den ES6 `Proxy` ein, der ein Objekt in einen Proxy einwickeln und Eigenschaftsaenderungen mit optimierter Performance ueberwachen kann.

#### 1. Daten-Hijacking mit Proxy

Vue3 verwendet `new Proxy`, um einen Daten-Proxy zu erstellen, anstatt einzeln `getter` und `setter` fuer jede Eigenschaft zu definieren. Dies ermoeglicht granulareres Tracking und das Abfangen von mehr Operationstypen.

#### 2. Effizienteres Abhaengigkeitstracking

Mit Proxy kann Vue3 Abhaengigkeiten effizienter verfolgen und bis zu 13 Operationstypen abfangen (`get`, `set`, `has`, `deleteProperty` usw.).

#### 3. Automatische minimierte Neudarstellung

Bei Datenaenderungen kann Vue3 praeziser bestimmen, welcher Teil der UI aktualisiert werden muss.

#### Vue3-Codebeispiel

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`Abruf ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`Setzen ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // Loest Proxy-get aus
data.name = 'Vue 3 Reactivity'; // Loest Proxy-set aus
```

### Vergleichstabelle Vue2 vs Vue3

| Eigenschaft | Vue2 | Vue3 |
| --- | --- | --- |
| Implementierung | `Object.defineProperty` | `Proxy` |
| Neue Eigenschaften erkennen | Erfordert `Vue.set()` | Native Unterstuetzung |
| Eigenschaftsloeschung erkennen | Erfordert `Vue.delete()` | Native Unterstuetzung |
| Array-Index erkennen | Erfordert spezielle Methoden | Native Unterstuetzung |
| Performance | Rekursives Durchlaufen aller Eigenschaften | Lazy-Verarbeitung, bessere Performance |
| Browser-Unterstuetzung | IE9+ | Kein IE11-Support |

### Fazit

Vue2 verwendet `Object.defineProperty` fuer die bidirektionale Bindung, was gewisse Einschraenkungen hat. Vue3 fuehrt den ES6 `Proxy` ein und bietet ein leistungsfaehigeres und flexibleres reaktives System mit besserer Performance.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Warum verwendet Vue3 `Proxy` statt `Object.defineProperty`?

### Hauptgruende

#### 1. Staerkere Abfangfaehigkeit

`Proxy` kann bis zu 13 Operationstypen abfangen, waehrend `Object.defineProperty` nur Lesen und Setzen von Eigenschaften abfangen kann.

#### 2. Native Array-Index-Ueberwachung

```js
// Vue2 kann nicht erkennen
const arr = [1, 2, 3];
arr[0] = 10; // Loest kein Update aus

// Vue3 kann erkennen
const arr = reactive([1, 2, 3]);
arr[0] = 10; // Loest Update aus
```

#### 3. Native Unterstuetzung fuer dynamisches Hinzufuegen/Loeschen von Eigenschaften

```js
// Vue2 erfordert Spezialbehandlung
Vue.set(obj, 'newKey', 'value');

// Vue3 native Unterstuetzung
const obj = reactive({});
obj.newKey = 'value'; // Loest Update aus
delete obj.newKey; // Loest ebenfalls Update aus
```

#### 4. Bessere Performance

```js
// Vue2: Rekursives Durchlaufen aller Eigenschaften erforderlich
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: Lazy-Verarbeitung, Proxy erst beim Zugriff
function reactive(obj) {
  return new Proxy(obj, handler); // Keine Rekursion noetig
}
```

### Warum hat Vue2 nicht Proxy verwendet?

Hauptsaechlich wegen **Browser-Kompatibilitaet**: Bei der Veroeffentlichung von Vue2 (2016) war Proxy noch nicht weit verbreitet und kann nicht polyfilled werden. Vue3 hat die IE11-Unterstuetzung aufgegeben und kann daher Proxy einsetzen.

### Zusammenfassung

Vue3 verwendet `Proxy` fuer: 1) Vollstaendigere reaktive Unterstuetzung; 2) Bessere Performance; 3) Einfacheren Code; 4) Bessere Entwicklererfahrung. Der einzige Preis ist der Verzicht auf aeltere Browser (IE11).

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
