---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> What is Deep Clone?

**Deep Clone** creates a new object and recursively copies all properties of the original object, including all nested objects and arrays. After a deep clone, the new object is completely independent from the original — modifying one does not affect the other.

### Shallow Clone vs Deep Clone

**Shallow Clone**: Only copies the first level of an object's properties. Nested objects still share references.

```javascript
// Shallow clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Original object was also modified
```

**Deep Clone**: Recursively copies all levels of properties, fully independent.

```javascript
// Deep clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Original object is unaffected
```

## 2. Implementation Methods

> Implementation Methods

### Method 1: Using JSON.parse and JSON.stringify

**Pros**: Simple and quick
**Cons**: Cannot handle functions, undefined, Symbol, Date, RegExp, Map, Set, and other special types

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Limitations**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date becomes an empty object
console.log(cloned.func); // undefined ❌ Function is lost
console.log(cloned.undefined); // undefined ✅ But JSON.stringify removes it
console.log(cloned.symbol); // undefined ❌ Symbol is lost
console.log(cloned.regex); // {} ❌ RegExp becomes an empty object
```

### Method 2: Recursive Implementation (handling basic types and objects)

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Unaffected
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Method 3: Complete Implementation (handling Map, Set, Symbol, etc.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  // Handle Symbol properties
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copy regular properties
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copy Symbol properties
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Test
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Method 4: Handling Circular References

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Circular reference handled correctly
console.log(cloned !== original); // true ✅ It's a different object
```

## 3. Common Interview Questions

> Common Interview Questions

### Question 1: Basic Deep Clone Implementation

Implement a `deepClone` function that can deep clone objects and arrays.

<details>
<summary>Click to reveal answer</summary>

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Question 2: Handling Circular References

Implement a `deepClone` function that can handle circular references.

<details>
<summary>Click to reveal answer</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Key points**:

- Use `WeakMap` to track already-processed objects
- Check whether an object already exists in the map before creating a new one
- If it exists, return the reference from the map to avoid infinite recursion

</details>

### Question 3: Limitations of JSON.parse and JSON.stringify

Explain the limitations of using `JSON.parse(JSON.stringify())` for deep cloning, and provide solutions.

<details>
<summary>Click to reveal answer</summary>

**Limitations**:

1. **Cannot handle functions**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Cannot handle undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (but the property is removed) ❌
   ```

3. **Cannot handle Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol property is lost
   ```

4. **Date becomes a string**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Becomes a string
   ```

5. **RegExp becomes an empty object**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Becomes an empty object
   ```

6. **Cannot handle Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Becomes an empty object
   ```

7. **Cannot handle circular references**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Error: Converting circular structure to JSON
   ```

**Solution**: Use a recursive implementation with special handling for different types.

</details>

## 4. Best Practices

> Best Practices

### Recommended Approaches

```javascript
// 1. Choose the appropriate method based on requirements
// For basic objects and arrays only, use a simple recursive implementation
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. For complex types, use the complete implementation
function completeDeepClone(obj, map = new WeakMap()) {
  // ... complete implementation
}

// 3. Use WeakMap to handle circular references
// WeakMap doesn't prevent garbage collection, making it suitable for tracking object references
```

### Approaches to Avoid

```javascript
// 1. Don't overuse JSON.parse(JSON.stringify())
// ❌ Loses functions, Symbol, Date, and other special types
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Don't forget to handle circular references
// ❌ Will cause stack overflow
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Infinite recursion
  }
  return cloned;
}

// 3. Don't forget to handle Date, RegExp, and other special types
// ❌ These types require special handling
```

## 5. Interview Summary

> Interview Summary

### Quick Reference

**Deep Clone**:

- **Definition**: Recursively copies an object and all its nested properties, creating a fully independent copy
- **Methods**: Recursive implementation, JSON.parse(JSON.stringify()), structuredClone()
- **Key points**: Handle special types, circular references, Symbol properties

**Implementation Steps**:

1. Handle primitive types and null
2. Handle Date, RegExp, and other special objects
3. Handle arrays and objects
4. Handle circular references (using WeakMap)
5. Handle Symbol properties

### Interview Answer Example

**Q: Please implement a Deep Clone function.**

> "Deep clone creates a completely independent new object by recursively copying all nested properties. My implementation first handles primitive types and null, then applies special handling for different types like Date, RegExp, arrays, and objects. To handle circular references, I use a WeakMap to track already-processed objects. For Symbol properties, I use Object.getOwnPropertySymbols to retrieve and copy them. This ensures the deep-cloned object is fully independent from the original — modifying one won't affect the other."

**Q: What are the limitations of JSON.parse(JSON.stringify())?**

> "The main limitations include: 1) Cannot handle functions — they get removed; 2) Cannot handle undefined and Symbol — these properties are ignored; 3) Date objects become strings; 4) RegExp becomes an empty object; 5) Cannot handle Map, Set, and other special data structures; 6) Cannot handle circular references — it throws an error. For these special cases, a recursive implementation should be used instead."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
