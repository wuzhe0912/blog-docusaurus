---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Question Description

Implement object path parsing functions that can get and set values of nested objects based on a path string.

### Requirements

1. **`get` function**: Retrieve a value from an object based on a path

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **`set` function**: Set a value on an object based on a path

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Implementing the get function

### Method 1: Using split and reduce

**Approach**: Split the path string into an array, then use `reduce` to access the object level by level.

```javascript
function get(obj, path, defaultValue) {
  // Handle edge cases
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Split the path string into an array
  const keys = path.split('.');

  // Use reduce to access level by level
  const result = keys.reduce((current, key) => {
    // If current value is null or undefined, return undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // If result is undefined, return the default value
  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (need to handle array indices)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Method 2: Supporting Array Indices

**Approach**: Handle array indices in the path, such as `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Regex to match: property names or array indices
  // Matches 'a', 'b', '[0]', 'c', etc.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Handle array index [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Method 3: Complete Implementation (handling edge cases)

```javascript
function get(obj, path, defaultValue) {
  // Handle edge cases
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Parse path: supports 'a.b.c' and 'a.b[0].c' formats
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // If current value is null or undefined, return default value
    if (result == null) {
      return defaultValue;
    }

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (empty path returns original object)
```

## 3. Implementation: set Function

> Implementing the set function

### Method 1: Basic Implementation

**Approach**: Create nested object structure based on the path, then set the value.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Parse path
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Create nested structure
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // If key doesn't exist or isn't an object, create a new object
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // If current is not an array, convert it
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Method 2: Complete Implementation (handling arrays and objects)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Iterate to the second-to-last key, creating nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // Ensure it's an array
      if (!Array.isArray(current)) {
        // Convert object to array (preserving existing indices)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // Ensure index exists
      if (current[index] == null) {
        // Determine if next key is array or object
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Handle object key
      if (current[key] == null) {
        // Determine if next key is array or object
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // If exists but not an object, convert it
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Method 3: Simplified Version (objects only, no array index handling)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Create nested structure (except for the last key)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> Common Interview Questions

### Question 1: Basic get Function

Implement a `get` function that retrieves a nested object's value based on a path string.

<details>
<summary>Click to reveal answer</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Key points**:

- Handle null/undefined cases
- Use split to divide the path
- Access object properties level by level
- Return default value when path doesn't exist

</details>

### Question 2: get Function with Array Index Support

Extend the `get` function to support array indices like `'a.b[0].c'`.

<details>
<summary>Click to reveal answer</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Use regex to parse the path
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Handle array index
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Key points**:

- Use regex `/[^.[\]]+|\[(\d+)\]/g` to parse the path
- Handle `[0]` format array indices
- Convert string index to number

</details>

### Question 3: set Function

Implement a `set` function that sets a nested object's value based on a path string.

<details>
<summary>Click to reveal answer</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Create nested structure (except for the last key)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Set the value for the last key
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Key points**:

- Create nested object structure level by level
- Ensure intermediate path objects exist
- Set the target value at the end

</details>

### Question 4: Complete get and set Implementation

Implement complete `get` and `set` functions with array index support and edge case handling.

<details>
<summary>Click to reveal answer</summary>

```javascript
// get function
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// set function
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Create nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Set value
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> Best Practices

### Recommended Approaches

```javascript
// 1. Handle edge cases
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Use regex to parse complex paths
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Determine the next key's type in set
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Use nullish coalescing for default values
return result ?? defaultValue;
```

### Approaches to Avoid

```javascript
// 1. ❌ Don't forget to handle null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // May throw
}

// 2. ❌ Don't directly mutate the original object (unless explicitly required)
function set(obj, path, value) {
  // Should return the modified object, not just mutate directly
}

// 3. ❌ Don't ignore the difference between arrays and objects
// Need to determine if the next key is an array index or object key
```

## 6. Interview Summary

> Interview Summary

### Quick Reference

**Object Path Parsing**:

- **get function**: Retrieve value by path, handle null/undefined, support default values
- **set function**: Set value by path, auto-create nested structure
- **Path parsing**: Use regex to handle `'a.b.c'` and `'a.b[0].c'` formats
- **Edge case handling**: Handle null, undefined, empty strings, etc.

**Implementation Steps**:

1. Path parsing: `split('.')` or regex
2. Level-by-level access: Use loops or `reduce`
3. Edge case handling: Check for null/undefined
4. Array support: Handle `[0]` format indices

### Interview Answer Example

**Q: Implement a function that retrieves an object's value by path.**

> "I'd implement a `get` function that takes an object, a path string, and a default value. First, handle edge cases — if the object is null or the path isn't a string, return the default value. Then use `split('.')` to split the path into an array of keys, and use a loop to access object properties level by level. At each access, check if the current value is null or undefined — if so, return the default value. Finally, if the result is undefined, return the default value; otherwise return the result. To support array indices, use the regex `/[^.[\]]+|\[(\d+)\]/g` to parse the path and handle `[0]` format indices."

**Q: How would you implement a function that sets an object's value by path?**

> "I'd implement a `set` function that takes an object, a path string, and a value. First, parse the path into an array of keys, then iterate to the second-to-last key, creating nested object structure level by level. For each intermediate key, if it doesn't exist or isn't an object, create a new object. If the next key is an array index format, create an array instead. Finally, set the value for the last key. This ensures all intermediate objects in the path exist before correctly setting the target value."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
