---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Deep Clone là gì?

**Deep Clone (Sao chép sâu)** là việc tạo một đối tượng mới và sao chép đệ quy tất cả các thuộc tính của đối tượng gốc cũng như tất cả các đối tượng và mảng lồng nhau của nó. Đối tượng sau khi Deep Clone hoàn toàn độc lập với đối tượng gốc -- việc thay đổi một đối tượng sẽ không ảnh hưởng đến đối tượng kia.

### Sao chép nông vs Sao chép sâu

**Shallow Clone (Sao chép nông)**: Chỉ sao chép các thuộc tính ở cấp độ đầu tiên của đối tượng; các đối tượng lồng nhau vẫn chia sẻ cùng một tham chiếu.

```javascript
// Ví dụ sao chép nông
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Đối tượng gốc cũng bị thay đổi
```

**Deep Clone (Sao chép sâu)**: Sao chép đệ quy tất cả các cấp độ thuộc tính, hoàn toàn độc lập.

```javascript
// Ví dụ sao chép sâu
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Đối tượng gốc không bị ảnh hưởng
```

## 2. Implementation Methods

> Các phương pháp triển khai

### Phương pháp 1: Sử dụng JSON.parse và JSON.stringify

**Ưu điểm**: Đơn giản và nhanh
**Nhược điểm**: Không thể xử lý hàm, undefined, Symbol, Date, RegExp, Map, Set và các kiểu đặc biệt khác

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Kiểm tra
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

**Hạn chế**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date trở thành đối tượng rỗng
console.log(cloned.func); // undefined ❌ Hàm bị mất
console.log(cloned.undefined); // undefined ✅ Nhưng JSON.stringify sẽ loại bỏ nó
console.log(cloned.symbol); // undefined ❌ Symbol bị mất
console.log(cloned.regex); // {} ❌ RegExp trở thành đối tượng rỗng
```

### Phương pháp 2: Triển khai đệ quy (xử lý các kiểu cơ bản và đối tượng)

```javascript
function deepClone(obj) {
  // Xử lý null và các kiểu cơ bản
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xử lý RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Xử lý mảng
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Xử lý đối tượng
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Kiểm tra
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

console.log(original.date.getFullYear()); // 2024 ✅ Không bị ảnh hưởng
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Phương pháp 3: Triển khai đầy đủ (xử lý Map, Set, Symbol, v.v.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Xử lý null và các kiểu cơ bản
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xử lý tham chiếu vòng
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xử lý RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xử lý Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Xử lý Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Xử lý mảng
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Xử lý đối tượng
  const cloned = {};
  map.set(obj, cloned);

  // Xử lý thuộc tính Symbol
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Sao chép thuộc tính thường
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Sao chép thuộc tính Symbol
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Kiểm tra
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

### Phương pháp 4: Xử lý tham chiếu vòng

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Xử lý null và các kiểu cơ bản
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xử lý tham chiếu vòng
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xử lý RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xử lý mảng
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Xử lý đối tượng
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Kiểm tra tham chiếu vòng
const original = {
  name: 'John',
};
original.self = original; // Tham chiếu vòng

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Xử lý tham chiếu vòng chính xác
console.log(cloned !== original); // true ✅ Là các đối tượng khác nhau
```

## 3. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Bài 1: Triển khai Deep Clone cơ bản

Hãy triển khai một hàm `deepClone` có thể sao chép sâu các đối tượng và mảng.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
function deepClone(obj) {
  // Xử lý null và các kiểu cơ bản
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xử lý RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xử lý mảng
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Xử lý đối tượng
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Kiểm tra
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

### Bài 2: Xử lý tham chiếu vòng

Hãy triển khai một hàm `deepClone` có thể xử lý tham chiếu vòng.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Xử lý null và các kiểu cơ bản
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xử lý tham chiếu vòng
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Xử lý RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Xử lý mảng
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Xử lý đối tượng
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Kiểm tra tham chiếu vòng
const original = {
  name: 'John',
};
original.self = original; // Tham chiếu vòng

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Điểm chính**:

- Sử dụng `WeakMap` để theo dõi các đối tượng đã được xử lý
- Trước khi tạo đối tượng mới, kiểm tra xem nó đã tồn tại trong map chưa
- Nếu đã tồn tại, trả về trực tiếp tham chiếu từ map để tránh đệ quy vô hạn

</details>

### Bài 3: Hạn chế của JSON.parse và JSON.stringify

Hãy giải thích các hạn chế khi sử dụng `JSON.parse(JSON.stringify())` để Deep Clone và đưa ra giải pháp.

<details>
<summary>Nhấn để xem đáp án</summary>

**Hạn chế**:

1. **Không thể xử lý hàm**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Không thể xử lý undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (nhưng thuộc tính bị xóa) ❌
   ```

3. **Không thể xử lý Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Thuộc tính Symbol bị mất
   ```

4. **Date trở thành chuỗi**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Trở thành chuỗi
   ```

5. **RegExp trở thành đối tượng rỗng**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Trở thành đối tượng rỗng
   ```

6. **Không thể xử lý Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Trở thành đối tượng rỗng
   ```

7. **Không thể xử lý tham chiếu vòng**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Lỗi: Converting circular structure to JSON
   ```

**Giải pháp**: Sử dụng triển khai đệ quy với xử lý đặc biệt cho các kiểu khác nhau.

</details>

## 4. Best Practices

> Các phương pháp tốt nhất

### Cách làm khuyên nghị

```javascript
// 1. Chọn phương pháp phù hợp dựa trên yêu cầu
// Nếu chỉ cần xử lý đối tượng cơ bản và mảng, sử dụng triển khai đệ quy đơn giản
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

// 2. Nếu cần xử lý các kiểu phức tạp, sử dụng triển khai đầy đủ
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Triển khai đầy đủ
}

// 3. Sử dụng WeakMap để xử lý tham chiếu vòng
// WeakMap không ngăn cản thu gom rác, phù hợp để theo dõi tham chiếu đối tượng
```

### Cách làm cần tránh

```javascript
// 1. Không lạm dụng JSON.parse(JSON.stringify())
// ❌ Hàm, Symbol, Date và các kiểu đặc biệt khác sẽ bị mất
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Không quên xử lý tham chiếu vòng
// ❌ Sẽ gây tràn bộ nhớ
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Đệ quy vô hạn
  }
  return cloned;
}

// 3. Không quên xử lý Date, RegExp và các kiểu đặc biệt khác
// ❌ Các kiểu này cần xử lý đặc biệt
```

## 5. Interview Summary

> Tóm tắt phỏng vấn

### Ghi nhớ nhanh

**Deep Clone**:

- **Định nghĩa**: Sao chép đệ quy đối tượng và tất cả các thuộc tính lồng nhau, hoàn toàn độc lập
- **Phương pháp**: Triển khai đệ quy, JSON.parse(JSON.stringify()), structuredClone()
- **Điểm chính**: Xử lý các kiểu đặc biệt, tham chiếu vòng, thuộc tính Symbol

**Điểm triển khai**:

1. Xử lý các kiểu cơ bản và null
2. Xử lý Date, RegExp và các đối tượng đặc biệt khác
3. Xử lý mảng và đối tượng
4. Xử lý tham chiếu vòng (sử dụng WeakMap)
5. Xử lý thuộc tính Symbol

### Ví dụ trả lời phỏng vấn

**Q: Hãy triển khai một hàm Deep Clone.**

> "Deep Clone là việc tạo một đối tượng mới hoàn toàn độc lập, sao chép đệ quy tất cả các thuộc tính lồng nhau. Triển khai của tôi sẽ xử lý các kiểu cơ bản và null trước, sau đó thực hiện xử lý đặc biệt cho các kiểu khác nhau như Date, RegExp, mảng và đối tượng. Để xử lý tham chiếu vòng, tôi sẽ sử dụng WeakMap để theo dõi các đối tượng đã được xử lý. Đối với thuộc tính Symbol, tôi sẽ sử dụng Object.getOwnPropertySymbols để lấy và sao chép. Điều này đảm bảo rằng đối tượng sau khi sao chép sâu hoàn toàn độc lập với đối tượng gốc, việc thay đổi một đối tượng sẽ không ảnh hưởng đến đối tượng kia."

**Q: JSON.parse(JSON.stringify()) có những hạn chế gì?**

> "Các hạn chế chính của phương pháp này bao gồm: 1) Không thể xử lý hàm, hàm sẽ bị xóa; 2) Không thể xử lý undefined và Symbol, các thuộc tính này sẽ bị bỏ qua; 3) Đối tượng Date sẽ trở thành chuỗi; 4) RegExp sẽ trở thành đối tượng rỗng; 5) Không thể xử lý Map, Set và các cấu trúc dữ liệu đặc biệt khác; 6) Không thể xử lý tham chiếu vòng, sẽ báo lỗi. Nếu cần xử lý các trường hợp đặc biệt này, nên sử dụng cách triển khai đệ quy."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/vi/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
