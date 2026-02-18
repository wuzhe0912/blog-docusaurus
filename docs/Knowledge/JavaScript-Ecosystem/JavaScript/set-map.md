---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> What are Set and Map?

`Set` and `Map` are two data structures introduced in ES6.
They solve specific use cases better than plain arrays/objects.

### Set

**Definition**: `Set` is a collection of **unique values**, similar to a mathematical set.

**Characteristics**:

- Stored values are **unique**
- Equality check uses `===` semantics for most values
- Keeps insertion order
- Can store any value type (primitive or object)

**Basic usage**:

```javascript
// create Set
const set = new Set();

// add values
set.add(1);
set.add(2);
set.add(2); // duplicate ignored
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// existence check
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// delete
set.delete(2);
console.log(set.has(2)); // false

// clear
set.clear();
console.log(set.size); // 0
```

**Create Set from array**:

```javascript
// remove duplicates from array
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// convert back to array
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// shorthand
const uniqueArr2 = [...new Set(arr)];
```

### Map

**Definition**: `Map` is a key-value collection similar to objects, but keys can be any type.

**Characteristics**:

- Keys can be any type (string, number, object, function, etc.)
- Keeps insertion order
- Has `size` property
- Iteration follows insertion order

**Basic usage**:

```javascript
// create Map
const map = new Map();

// set key-value pairs
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// get value
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// key existence
console.log(map.has('name')); // true

// delete
map.delete('name');

// size
console.log(map.size); // 3

// clear
map.clear();
```

**Create Map from array**:

```javascript
// from 2D array
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// from object
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Difference between Set and Array

| Feature | Set | Array |
| ------- | --- | ----- |
| Duplicates | Not allowed | Allowed |
| Index access | Not supported | Supported |
| Lookup complexity | O(1) average | O(n) |
| Insertion order | Preserved | Preserved |
| Common methods | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Use cases**:

```javascript
// ✅ Set for unique values
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Set for fast existence checks
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Homepage already visited');
}

// ✅ Array when index or duplicates are needed
const scores = [100, 95, 100, 90];
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Difference between Map and Object

| Feature | Map | Object |
| ------- | --- | ------ |
| Key type | Any type | String or Symbol |
| Size | `size` property | Manual calculation |
| Default keys | None | Prototype chain exists |
| Iteration order | Insertion order | Insertion order in modern JS |
| Performance | Better for frequent add/remove | Often good for static/simple structures |
| JSON | Not directly serializable | Native JSON support |

**Use cases**:

```javascript
// ✅ Map when keys are non-string
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Map for frequent add/remove
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Object for static structure + JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config);
```

## 4. Common Interview Questions

> Common interview questions

### Question 1: remove duplicates from array

Implement a function to remove duplicates.

```javascript
function removeDuplicates(arr) {
  // your implementation
}
```

<details>
<summary>Click to view answer</summary>

**Method 1: Set (recommended)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Method 2: filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Method 3: reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Performance**:

- Set: O(n), fastest
- filter + indexOf: O(n²), slower
- reduce + includes: O(n²), slower

</details>

### Question 2: check duplicates in array

Implement a function to check whether an array has duplicates.

```javascript
function hasDuplicates(arr) {
  // your implementation
}
```

<details>
<summary>Click to view answer</summary>

**Method 1: Set (recommended)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Method 2: Set with early exit**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Method 3: indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Performance**:

- Set method 1: O(n), fastest
- Set method 2: O(n), can stop early
- indexOf: O(n²), slower

</details>

### Question 3: count occurrences

Implement a function to count occurrences of each element.

```javascript
function countOccurrences(arr) {
  // your implementation
}
```

<details>
<summary>Click to view answer</summary>

**Method 1: Map (recommended)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Method 2: reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Method 3: plain object**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Why Map helps**:

- Keys can be any type
- Built-in `size`
- Stable insertion-order iteration

</details>

### Question 4: intersection of two arrays

Implement array intersection.

```javascript
function intersection(arr1, arr2) {
  // your implementation
}
```

<details>
<summary>Click to view answer</summary>

**Method 1: Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Method 2: filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Method 3: filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Performance**:

- Set: O(n + m), faster
- filter + includes: O(n × m), slower

</details>

### Question 5: difference of two arrays

Implement array difference (values in `arr1` but not in `arr2`).

```javascript
function difference(arr1, arr2) {
  // your implementation
}
```

<details>
<summary>Click to view answer</summary>

**Method 1: Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Method 2: dedupe first then filter**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Method 3: includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Performance**:

- Set: O(n + m), faster
- includes: O(n × m), slower

</details>

### Question 6: implement LRU cache

Implement an LRU cache with `Map`.

```javascript
class LRUCache {
  constructor(capacity) {
    // your implementation
  }

  get(key) {
    // your implementation
  }

  put(key, value) {
    // your implementation
  }
}
```

<details>
<summary>Click to view answer</summary>

**Implementation:**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // move key to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // if key exists, delete first
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // if full, evict oldest (first key)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // add to end (most recent)
    this.cache.set(key, value);
  }
}

// usage
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // evicts key 2
console.log(cache.get(2)); // -1
console.log(cache.get(3)); // 'three'
```

**Explanation:**

- Map keeps insertion order
- first key is the oldest
- `get` refreshes recency by delete+set
- `put` evicts oldest when capacity is full

</details>

### Question 7: object as Map key

Explain the output:

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Click to view answer</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Explanation:**

- `obj1` and `obj2` are different object instances
- `Map` compares object keys by reference
- so they are treated as different keys

**Contrast with plain object:**

```javascript
// plain object keys become strings
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (overwritten)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']

// Map keeps references
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet and WeakMap

> Difference between WeakSet and WeakMap

### WeakSet

**Characteristics**:

- Can only store **objects**
- Uses **weak references**
- No `size`
- Not iterable
- No `clear`

**Use case**: object marking without memory leaks.

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// if obj1 has no other references, it can be garbage-collected
```

### WeakMap

**Characteristics**:

- Keys must be **objects**
- Uses **weak references** for keys
- No `size`
- Not iterable
- No `clear`

**Use case**: private metadata tied to object lifecycle.

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// if obj1 has no other references, entry can be garbage-collected
```

### Weak vs strong collections

| Feature | Set/Map | WeakSet/WeakMap |
| ------- | ------- | --------------- |
| Key/value type | Any type | Object only |
| Weak reference | No | Yes |
| Iterable | Yes | No |
| `size` | Yes | No |
| `clear` | Yes | No |
| Auto GC cleanup | No | Yes |

## 6. Best Practices

> Best practices

### Recommended

```javascript
// 1. Use Set for uniqueness
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Use Set for fast lookup
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // access granted
}

// 3. Use Map when keys are not strings
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Use Map for frequent add/remove
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Use WeakMap for object-linked private data
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Avoid

```javascript
// 1. Do not use Set as full array replacement
const set = new Set([1, 2, 3]);
// set[0] -> undefined

const arr = [1, 2, 3];
arr[0]; // 1

// 2. Do not use Map for simple static structure
const configMap = new Map();
configMap.set('apiUrl', 'https://api.example.com');
configMap.set('timeout', 5000);

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Do not confuse Set and Map APIs
const set2 = new Set();
// set2.set('key', 'value'); // TypeError

const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> Interview summary

### Quick memory

**Set**:

- Unique values only
- Fast lookup O(1)
- Great for deduplication and membership checks

**Map**:

- Key-value store with keys of any type
- Preserves insertion order
- Great for non-string keys and frequent updates

**WeakSet / WeakMap**:

- Weak references, GC-friendly
- Object-only keys/values
- Great for leak-safe object metadata

### Sample interview answers

**Q: When should you use Set instead of Array?**

> Use Set when you need uniqueness or fast existence checks.
> `Set.has` is O(1) on average, while array `includes` is O(n).
> Typical examples are deduplication and permission checks.

**Q: What is the difference between Map and Object?**

> Map keys can be any type, including objects/functions.
> Object keys are only string or Symbol.
> Map has `size`, preserves insertion order, and avoids prototype-chain key issues.
> Map is better when keys are dynamic or updates are frequent.

**Q: What is the difference between WeakMap and Map?**

> WeakMap keys must be objects and are weakly referenced.
> If the key object is no longer referenced elsewhere, its entry can be garbage-collected automatically.
> WeakMap is not iterable and has no `size`.
> It is useful for private data and memory-leak prevention.

## Reference

- [MDN - Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
